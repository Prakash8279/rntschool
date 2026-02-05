const db = require('../config/db');

/**
 * Calculate bus fee for a student for a specific month
 * 
 * Logic:
 * 1. Check if bus fees are enabled globally
 * 2. Check if bus fee is applicable from the configured month onwards
 * 3. Check if bus fee is not removed
 * 4. Check if student has active bus assignment for that month
 */
const calculateBusFeeForMonth = async (studentId, month, year) => {
  try {
    // 1. Get bus fee configuration
    const [configRows] = await db.execute('SELECT * FROM bus_fee_config LIMIT 1');
    const config = configRows[0];
    
    if (!config || !config.is_bus_fee_enabled) {
      return 0; // Bus fee not enabled
    }
    
    // 2. Check if month is within applicable range
    const monthIndex = getMonthIndex(month);
    const allMonths = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    
    const applicableFromIndex = allMonths.indexOf(config.applicable_from_month);
    
    // Check if current month is before applicable date
    if (year < config.applicable_from_year) {
      return 0;
    }
    
    if (year === config.applicable_from_year && monthIndex < applicableFromIndex) {
      return 0;
    }
    
    // 3. Check if bus fee has been removed
    if (config.removable_from_month && config.removable_from_year) {
      const removableIndex = allMonths.indexOf(config.removable_from_month);
      
      if (year > config.removable_from_year) {
        return 0; // After removal year
      }
      
      if (year === config.removable_from_year && monthIndex >= removableIndex) {
        return 0; // At or after removal month
      }
    }
    
    // 4. Check bus assignment for the student in this month
    const [ledgerRows] = await db.execute(
      'SELECT * FROM bus_fee_ledger WHERE student_id=? AND month=? AND year=? AND bus_active=1',
      [studentId, month, year]
    );
    
    if (ledgerRows.length === 0) {
      return 0; // No active bus assignment for this month
    }
    
    // 5. Get student's class and fee structure
    const [studentRows] = await db.execute(
      'SELECT classname FROM students WHERE id=?',
      [studentId]
    );
    
    if (studentRows.length === 0) {
      return 0;
    }
    
    const classname = studentRows[0].classname;
    
    // 6. Get bus fee from fee structure
    const [feeRows] = await db.execute(
      'SELECT bus_fee FROM fee_structure WHERE classname=?',
      [classname]
    );
    
    if (feeRows.length === 0) {
      return 0;
    }
    
    return Number(feeRows[0].bus_fee) || 0;
  } catch (err) {
    console.error('Error calculating bus fee:', err.message);
    return 0;
  }
};

/**
 * Check if student has active bus assignment for a specific month
 */
const isBusActiveForMonth = async (studentId, month, year) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bus_fee_ledger WHERE student_id=? AND month=? AND year=? AND bus_active=1',
      [studentId, month, year]
    );
    
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking bus status:', err.message);
    return false;
  }
};

/**
 * Get current bus assignment for a student
 */
const getCurrentBusAssignment = async (studentId) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bus_student_assignments WHERE student_id=? AND is_active=1 LIMIT 1',
      [studentId]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const assignment = rows[0];
    return {
      id: assignment.id,
      student_id: assignment.student_id,
      bus_id: assignment.bus_id,
      bus_name: assignment.bus_name,
      start_date: assignment.start_date ? new Date(assignment.start_date).toISOString().split('T')[0] : null,
      end_date: null
    };
  } catch (err) {
    console.error('Error getting bus assignment:', err.message);
    return null;
  }
};

/**
 * Get month index in academic calendar (Apr=0, May=1, ..., Mar=11)
 */
function getMonthIndex(monthName) {
  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  return months.indexOf(monthName);
}

/**
 * Convert JS month index (0=Jan) to academic month name
 */
const getAcademicMonthName = (jsMonthIndex) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const academicMonths = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  const monthName = months[jsMonthIndex];
  const academicIndex = months.indexOf(monthName);
  return academicMonths[(academicIndex + 9) % 12];
};

/**
 * Get academic year (Apr 2023 - Mar 2024 = 2023)
 */
const getAcademicYear = () => {
  const today = new Date();
  const month = today.getMonth(); // 0=Jan, 3=Apr
  return month < 3 ? today.getFullYear() - 1 : today.getFullYear();
};

// CommonJS exports
module.exports = {
  calculateBusFeeForMonth,
  isBusActiveForMonth,
  getCurrentBusAssignment,
  getAcademicMonthName,
  getAcademicYear
};
