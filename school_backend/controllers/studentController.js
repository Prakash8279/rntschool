const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- GET ALL STUDENTS ---
exports.getAllStudents = async (req, res) => {
  try {
    // Optional: select only essential fields for performance
    const fields = req.query.fields || 'all';
    
    let selectClause = 's.*';
    if (fields !== 'all') {
      // Basic fields for dropdown/listing
      selectClause = `s.id, s.student_name, s.admission_no, s.classname, 
                      s.roll_no, s.uses_bus, s.admission_date, s.created_at`;
    }
    
    // Join with bus_student_assignments to get bus info - include both active and removed assignments
    const [rows] = await db.execute(`
      SELECT ${selectClause}, 
             ba.assigned_date as bus_start_date,
             ba.removed_date as bus_end_date,
             ba.is_active as bus_is_active,
             ba.bus_route_id,
             br.bus_name
      FROM students s
      LEFT JOIN (
        SELECT admission_no, assigned_date, removed_date, is_active, bus_route_id,
               ROW_NUMBER() OVER (PARTITION BY admission_no ORDER BY created_at DESC) as rn
        FROM bus_student_assignments
      ) ba ON s.admission_no = ba.admission_no AND ba.rn = 1
      LEFT JOIN bus_routes br ON ba.bus_route_id = br.id
      ORDER BY s.classname, s.roll_no
    `);
    // Map 'id' to '_id' for frontend compatibility
    // Map 'uses_bus' (0/1) back to boolean
    const students = rows.map(s => ({ 
      ...s, 
      _id: s.id.toString(), 
      usesBus: !!s.uses_bus || (s.bus_is_active === 1),
      bus_start_date: s.bus_start_date || null,
      bus_end_date: s.bus_end_date || null,
      bus_route_id: s.bus_route_id || null,
      bus_name: s.bus_name || null
    }));
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: err.message });
  }
};

// --- GET NEXT ADMISSION NUMBER ---
exports.getNextAdmissionNo = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const prefix = `${currentYear}-`;
    
    // Find the highest admission_no for the current year
    const [rows] = await db.execute(
      `SELECT admission_no FROM students 
       WHERE admission_no LIKE ? 
       ORDER BY admission_no DESC LIMIT 1`,
      [`${prefix}%`]
    );
    
    let nextNumber = 1;
    if (rows.length > 0) {
      const lastNo = rows[0].admission_no; // e.g. "2026-005"
      const lastNum = parseInt(lastNo.split('-')[1], 10);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }
    
    const nextAdmissionNo = `${currentYear}-${String(nextNumber).padStart(3, '0')}`;
    res.json({ admission_no: nextAdmissionNo });
  } catch (err) {
    console.error('Error generating admission number:', err);
    res.status(500).json({ message: err.message });
  }
};

// --- REGISTER STUDENT ---
exports.registerStudent = async (req, res) => {
  const s = req.body;
  try {
    // Hash password if provided
    let passwordHash = null;
    if (s.password && s.password.length >= 6) {
      passwordHash = await bcrypt.hash(s.password, 10);
    }

    const sql = `
      INSERT INTO students (
        admission_no, roll_no, student_name, classname, address, 
        contact_no, gender, dob, age, email, registration_fees, image, uses_bus,
        pan_no, weight, height, aadhar_no, previous_school_name, 
        alternate_mobile_no, father_name, father_aadhar_no, mother_name, mother_aadhar_no,
        password_hash, admission_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const rawValues = [
      s.admission_no, s.roll_no, s.student_name, s.classname, s.address,
      s.contact_no, s.gender, s.dob, s.age, s.email, s.registration_fees, s.image, s.usesBus,
      s.pan_no, s.weight, s.height, s.aadhar_no, s.previous_school_name,
      s.alternate_mobile_no, s.father_name, s.father_aadhar_no, s.mother_name, s.mother_aadhar_no,
      passwordHash, s.admission_date || new Date().toISOString().split('T')[0]
    ];

    // FIX: Convert all 'undefined' values to 'null' to prevent MySQL errors
    const values = rawValues.map(v => (v === undefined ? null : v));

    const [result] = await db.execute(sql, values);
    res.status(201).json({ ...s, _id: result.insertId.toString() });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- UPDATE STUDENT ---
exports.updateStudent = async (req, res) => {
  const id = req.params.id;
  const s = req.body;
  
  try {
    const sql = `
      UPDATE students SET 
        admission_no=?, roll_no=?, student_name=?, classname=?, address=?,
        contact_no=?, gender=?, dob=?, age=?, email=?, registration_fees=?, image=?, uses_bus=?,
        pan_no=?, weight=?, height=?, aadhar_no=?, previous_school_name=?, 
        alternate_mobile_no=?, father_name=?, father_aadhar_no=?, mother_name=?, mother_aadhar_no=?
      WHERE id = ?
    `;

    const rawValues = [
      s.admission_no, s.roll_no, s.student_name, s.classname, s.address,
      s.contact_no, s.gender, s.dob, s.age, s.email, s.registration_fees, s.image, s.usesBus,
      s.pan_no, s.weight, s.height, s.aadhar_no, s.previous_school_name,
      s.alternate_mobile_no, s.father_name, s.father_aadhar_no, s.mother_name, s.mother_aadhar_no,
      id // ID goes last to match the WHERE clause
    ];

    // Ensure no undefined values
    const values = rawValues.map(v => (v === undefined ? null : v));

    await db.execute(sql, values);
    
    // Return the updated object
    res.json({ ...s, _id: id });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- DELETE STUDENT ---
exports.deleteStudent = async (req, res) => {
  try {
    await db.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};