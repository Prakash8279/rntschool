const db = require('../config/db');

// ============================================
// BUS ROUTES MANAGEMENT
// ============================================

// Get all bus routes
exports.getAllBusRoutes = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bus_routes ORDER BY bus_name');
    const routes = rows.map(r => ({
      _id: r.id.toString(),
      id: r.id,
      bus_name: r.bus_name,
      route_number: r.route_number,
      driver_name: r.driver_name,
      driver_contact: r.driver_contact,
      capacity: r.capacity,
      notes: r.notes
    }));
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new bus route
exports.createBusRoute = async (req, res) => {
  const { bus_name, route_number, driver_name, driver_contact, capacity, notes } = req.body;
  try {
    const sql = `
      INSERT INTO bus_routes (bus_name, route_number, driver_name, driver_contact, capacity, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      bus_name, route_number, driver_name, driver_contact, capacity || 50, notes || ''
    ]);
    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      bus_name,
      route_number,
      driver_name,
      driver_contact,
      capacity,
      notes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update bus route
exports.updateBusRoute = async (req, res) => {
  const { id } = req.params;
  const { bus_name, route_number, driver_name, driver_contact, capacity, notes } = req.body;
  try {
    const sql = `
      UPDATE bus_routes SET bus_name=?, route_number=?, driver_name=?, driver_contact=?, capacity=?, notes=?
      WHERE id=?
    `;
    await db.execute(sql, [bus_name, route_number, driver_name, driver_contact, capacity || 50, notes || '', id]);
    res.json({ _id: id, bus_name, route_number, driver_name, driver_contact, capacity, notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete bus route
exports.deleteBusRoute = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM bus_routes WHERE id=?', [id]);
    res.json({ message: 'Bus route deleted', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Seed default bus routes (for testing/demo)
exports.seedBusRoutes = async (req, res) => {
  try {
    const defaultRoutes = [
      {
        bus_name: 'Route A - North',
        route_number: 'A-101',
        driver_name: 'Rajesh Kumar',
        driver_contact: '9876543210',
        capacity: 45,
        notes: 'North side pick-up route'
      },
      {
        bus_name: 'Route B - South',
        route_number: 'B-102',
        driver_name: 'Priya Sharma',
        driver_contact: '9876543211',
        capacity: 50,
        notes: 'South side pick-up route'
      },
      {
        bus_name: 'Route C - East',
        route_number: 'C-103',
        driver_name: 'Vikram Singh',
        driver_contact: '9876543212',
        capacity: 48,
        notes: 'East side pick-up route'
      },
      {
        bus_name: 'Route D - West',
        route_number: 'D-104',
        driver_name: 'Anjali Verma',
        driver_contact: '9876543213',
        capacity: 50,
        notes: 'West side pick-up route'
      }
    ];

    let insertedCount = 0;
    for (const route of defaultRoutes) {
      try {
        await db.execute(`
          INSERT IGNORE INTO bus_routes (bus_name, route_number, driver_name, driver_contact, capacity, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [route.bus_name, route.route_number, route.driver_name, route.driver_contact, route.capacity, route.notes]);
        insertedCount++;
      } catch (e) {
        // Route already exists, skip
      }
    }

    res.json({
      message: `Seeded ${insertedCount} bus routes`,
      routesCreated: insertedCount,
      totalRoutes: defaultRoutes.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// BUS FEE CONFIGURATION (Admin Control)
// ============================================

// Get current bus fee configuration
exports.getBusFeeConfig = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bus_fee_config LIMIT 1');
    if (rows.length === 0) {
      // Create default if not exists
      const [result] = await db.execute(`
        INSERT INTO bus_fee_config (is_bus_fee_enabled, applicable_from_month, applicable_from_year)
        VALUES (TRUE, 'April', ?)
      `, [new Date().getFullYear()]);
      
      return res.json({
        _id: result.insertId.toString(),
        is_bus_fee_enabled: true,
        applicable_from_month: 'April',
        applicable_from_year: new Date().getFullYear(),
        removable_from_month: null,
        removable_from_year: null
      });
    }
    
    const config = rows[0];
    res.json({
      _id: config.id.toString(),
      is_bus_fee_enabled: !!config.is_bus_fee_enabled,
      applicable_from_month: config.applicable_from_month,
      applicable_from_year: config.applicable_from_year,
      removable_from_month: config.removable_from_month,
      removable_from_year: config.removable_from_year
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update bus fee configuration
exports.updateBusFeeConfig = async (req, res) => {
  const { is_bus_fee_enabled, applicable_from_month, applicable_from_year, removable_from_month, removable_from_year } = req.body;
  
  try {
    // Get current config
    const [rows] = await db.execute('SELECT id FROM bus_fee_config LIMIT 1');
    
    if (rows.length === 0) {
      // Create new
      const [result] = await db.execute(`
        INSERT INTO bus_fee_config (is_bus_fee_enabled, applicable_from_month, applicable_from_year, removable_from_month, removable_from_year)
        VALUES (?, ?, ?, ?, ?)
      `, [is_bus_fee_enabled, applicable_from_month, applicable_from_year, removable_from_month, removable_from_year]);
      
      return res.json({
        _id: result.insertId.toString(),
        is_bus_fee_enabled,
        applicable_from_month,
        applicable_from_year,
        removable_from_month,
        removable_from_year
      });
    }
    
    // Update existing
    const configId = rows[0].id;
    await db.execute(`
      UPDATE bus_fee_config SET 
        is_bus_fee_enabled=?, applicable_from_month=?, applicable_from_year=?, 
        removable_from_month=?, removable_from_year=?
      WHERE id=?
    `, [is_bus_fee_enabled, applicable_from_month, applicable_from_year, removable_from_month, removable_from_year, configId]);
    
    res.json({
      _id: configId.toString(),
      is_bus_fee_enabled,
      applicable_from_month,
      applicable_from_year,
      removable_from_month,
      removable_from_year
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// BUS ASSIGNMENTS (Student Bus Selection)
// ============================================

// Get all bus assignments
exports.getAllBusAssignments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ba.*, br.bus_name, br.route_number
      FROM bus_student_assignments ba
      LEFT JOIN bus_routes br ON ba.bus_route_id = br.id
      ORDER BY ba.created_at DESC
    `);
    
    const assignments = rows.map(r => ({
      _id: r.id.toString(),
      id: r.id,
      admission_no: r.admission_no,
      student_name: r.student_name,
      classname: r.classname,
      bus_route_id: r.bus_route_id,
      bus_name: r.bus_name,
      route_number: r.route_number,
      pickup_point: r.pickup_point,
      pickup_time: r.pickup_time,
      drop_time: r.drop_time,
      assigned_date: r.assigned_date ? new Date(r.assigned_date).toISOString().split('T')[0] : null,
      removed_date: r.removed_date ? new Date(r.removed_date).toISOString().split('T')[0] : null,
      is_active: r.is_active,
      created_at: r.created_at,
      updated_at: r.updated_at
    }));
    
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bus assignments for a specific student
exports.getStudentBusAssignment = async (req, res) => {
  let { admissionNo } = req.params;
  try {
    if (!admissionNo) {
      return res.status(400).json({ message: "Admission Number is required" });
    }
    admissionNo = String(admissionNo).trim();

    const [rows] = await db.execute(`
      SELECT ba.*, br.bus_name, br.route_number 
      FROM bus_student_assignments ba
      LEFT JOIN bus_routes br ON ba.bus_route_id = br.id
      WHERE ba.admission_no=? AND ba.is_active=1
      ORDER BY ba.created_at DESC
      LIMIT 1
    `, [admissionNo]);
    
    if (rows.length === 0) {
      return res.json(null);
    }
    
    const r = rows[0];
    res.json({
      _id: r.id.toString(),
      id: r.id,
      admission_no: r.admission_no,
      student_name: r.student_name,
      classname: r.classname,
      bus_route_id: r.bus_route_id,
      bus_name: r.bus_name,
      route_number: r.route_number,
      pickup_point: r.pickup_point,
      assigned_date: r.assigned_date ? new Date(r.assigned_date).toISOString().split('T')[0] : null,
      removed_date: r.removed_date ? new Date(r.removed_date).toISOString().split('T')[0] : null,
      is_active: r.is_active
    });
  } catch (err) {
    console.error("Error fetching student bus assignment:", err);
    res.status(500).json({ message: err.message });
  }
};

// Assign bus to student
exports.assignBusToStudent = async (req, res) => {
  let { admission_no, bus_id, bus_name, start_date } = req.body;
  
  try {
    if (!admission_no) {
      return res.status(400).json({ message: "Admission Number is required" });
    }
    
    admission_no = String(admission_no).trim();

    // Validate student exists first to prevent Foreign Key error
    const [student] = await db.execute('SELECT admission_no FROM students WHERE admission_no = ?', [admission_no]);
    if (student.length === 0) {
      return res.status(404).json({ message: `Student with Admission No '${admission_no}' not found.` });
    }

    const validAdmissionNo = student[0].admission_no;

    // Check if student already has an active assignment
    const [existing] = await db.execute(`
      SELECT * FROM bus_student_assignments 
      WHERE admission_no=? AND is_active=1
    `, [validAdmissionNo]);
    
    if (existing.length > 0) {
      // End the previous assignment
      await db.execute(`
        UPDATE bus_student_assignments SET is_active=0 
        WHERE id=?
      `, [existing[0].id]);
    }
    
    // Create new assignment
    const sql = `
      INSERT INTO bus_student_assignments (admission_no, student_name, classname, bus_route_id, pickup_point, assigned_date, is_active)
      SELECT ?, student_name, classname, ?, ?, ?, 1 FROM students WHERE admission_no = ?
    `;
    
    const [result] = await db.execute(sql, [validAdmissionNo, bus_id || null, start_date || null, start_date, validAdmissionNo]);
    
    // Update student's uses_bus flag
    await db.execute('UPDATE students SET uses_bus = 1 WHERE admission_no = ?', [validAdmissionNo]);
    
    // Get bus name for response
    let busName = null;
    if (bus_id) {
      const [busRoute] = await db.execute('SELECT bus_name FROM bus_routes WHERE id = ?', [bus_id]);
      if (busRoute.length > 0) {
        busName = busRoute[0].bus_name;
      }
    }
    
    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      admission_no: validAdmissionNo,
      bus_route_id: bus_id,
      bus_name: busName,
      pickup_point: start_date,
      assigned_date: start_date
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove bus from student
exports.removeBusFromStudent = async (req, res) => {
  let { admissionNo } = req.params;
  const { end_date } = req.body;
  
  try {
    admissionNo = String(admissionNo).trim();
    // Get the active assignment
    const [rows] = await db.execute(`
      SELECT * FROM bus_student_assignments 
      WHERE admission_no=? AND is_active=1
      LIMIT 1
    `, [admissionNo]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active bus assignment found' });
    }
    
    const assignment = rows[0];
    
    // Update to inactive and set removed_date
    const removalDate = end_date || new Date().toISOString().split('T')[0];
    await db.execute(`
      UPDATE bus_student_assignments SET is_active=0, removed_date=?
      WHERE id=?
    `, [removalDate, assignment.id]);
    
    // Update student's uses_bus flag to 0
    await db.execute('UPDATE students SET uses_bus = 0 WHERE admission_no = ?', [admissionNo]);
    
    // Update bus fee ledger to mark months as inactive from end_date onwards
    await updateBusFeeLedgerForRemoval(admissionNo, removalDate);
    
    console.log(`Bus removed for ${admissionNo} on ${removalDate}`);
    res.json({ message: 'Bus removed successfully', id: assignment.id, end_date: removalDate });
  } catch (err) {
    console.error('Error removing bus:', err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate bus fee ledger for months when bus is active
async function generateBusFeeLedger(admissionNo, startDate, endDate) {
  try {
    const allMonths = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    
    // Get bus fee config to check overall applicability
    const [config] = await db.execute('SELECT * FROM bus_fee_config LIMIT 1');
    const busConfig = config[0] || {};
    
    if (!busConfig.is_bus_fee_enabled) {
      return; // Bus fees not enabled globally
    }
    
    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : null;
    
    // Generate months from startDate up to now (or endDate if provided)
    const today = new Date();
    const limitDate = endDateObj && endDateObj < today ? endDateObj : today;
    
    // Academic year logic
    let currentDate = new Date(startDateObj);
    
    while (currentDate <= limitDate) {
      const monthIndex = currentDate.getMonth(); // 0=Jan, 3=Apr
      const monthName = allMonths[(monthIndex + 9) % 12]; // Convert to academic calendar
      const year = monthIndex < 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      
      // Insert or ignore if exists
      await db.execute(`
        INSERT IGNORE INTO bus_fee_ledger (admission_no, month, year, bus_active)
        VALUES (?, ?, ?, 1)
      `, [admissionNo, monthName, year]);
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } catch (err) {
    console.error('Error generating bus fee ledger:', err.message);
  }
}

// Update ledger when bus is removed
async function updateBusFeeLedgerForRemoval(admissionNo, removalDate) {
  try {
    const allMonths = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    
    const removalDateObj = new Date(removalDate);
    
    // Mark all months from removalDate onwards as inactive
    let currentDate = new Date(removalDateObj);
    const today = new Date();
    
    while (currentDate <= today) {
      const monthIndex = currentDate.getMonth();
      const monthName = allMonths[(monthIndex + 9) % 12];
      const year = monthIndex < 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      
      await db.execute(`
        UPDATE bus_fee_ledger SET bus_active=0 
        WHERE admission_no=? AND month=? AND year=?
      `, [admissionNo, monthName, year]);
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } catch (err) {
    console.error('Error updating bus fee ledger:', err.message);
  }
}
