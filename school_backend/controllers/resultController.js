const db = require('../config/db');

// Add Result (Single)
exports.addResult = async (req, res) => {
  const r = req.body;
  try {
    // Check if result already exists for this student+exam+subject
    const [existing] = await db.execute(
      'SELECT id FROM exam_results WHERE admission_no = ? AND exam_name = ? AND subject = ?',
      [r.admissionNo, r.examName, r.subject]
    );

    if (existing.length > 0) {
      // Update existing
      await db.execute(
        `UPDATE exam_results SET marks_obtained=?, total_marks=?, grade=?, remarks=?, academic_year=? 
         WHERE id=?`,
        [r.marksObtained, r.totalMarks, r.grade, r.remarks || null, r.academicYear || null, existing[0].id]
      );
      return res.json({ message: "Result updated", _id: existing[0].id.toString() });
    }

    // Insert New
    const sql = `
      INSERT INTO exam_results (
        student_name, admission_no, classname, exam_name, 
        subject, marks_obtained, total_marks, grade, remarks, academic_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      r.studentName, r.admissionNo, r.classname, r.examName,
      r.subject, r.marksObtained, r.totalMarks, r.grade, r.remarks || null, r.academicYear || null
    ]);

    res.status(201).json({ ...r, _id: result.insertId.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk Add Results (for saving multiple subjects at once)
exports.bulkAddResults = async (req, res) => {
  const { results } = req.body;
  
  if (!results || !Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ message: "Results array is required" });
  }
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const savedResults = [];
    
    // Batch check for existing results
    const checkKeys = results.map(r => `CONCAT(admission_no, '|', exam_name, '|', subject)`);
    const checkParams = results.flatMap(r => [r.admissionNo, r.examName, r.subject]);
    
    for (const r of results) {
      // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert
      const [result] = await connection.execute(
        `INSERT INTO exam_results (
          student_name, admission_no, classname, exam_name, 
          subject, marks_obtained, total_marks, grade, remarks, academic_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          marks_obtained = VALUES(marks_obtained),
          total_marks = VALUES(total_marks),
          grade = VALUES(grade),
          remarks = VALUES(remarks),
          academic_year = VALUES(academic_year)`,
        [r.studentName, r.admissionNo, r.classname, r.examName,
         r.subject, r.marksObtained, r.totalMarks, r.grade, r.remarks || null, r.academicYear || null]
      );
      savedResults.push({ ...r, _id: result.insertId.toString() });
    }
    
    await connection.commit();
    res.status(201).json({ message: "Results saved", count: savedResults.length, results: savedResults });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Results (Flexible Filter)
exports.getResults = async (req, res) => {
  const { studentId, classname, examName, admissionNo } = req.query;
  try {
    let sql = 'SELECT * FROM exam_results';
    let params = [];
    let conditions = [];

    if (studentId || admissionNo) {
      conditions.push('admission_no = ?');
      params.push(studentId || admissionNo);
    }
    if (classname) {
      conditions.push('classname = ?');
      params.push(classname);
    }
    if (examName) {
      conditions.push('exam_name = ?');
      params.push(examName);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(sql, params);
    
    // Map snake_case to camelCase
    const results = rows.map(r => ({
      _id: r.id.toString(),
      studentId: r.admission_no,
      studentName: r.student_name,
      admissionNo: r.admission_no,
      classname: r.classname,
      examName: r.exam_name,
      subject: r.subject,
      marksObtained: r.marks_obtained,
      totalMarks: r.total_marks,
      grade: r.grade,
      remarks: r.remarks,
      academicYear: r.academic_year
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Result
exports.deleteResult = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.execute('SELECT id FROM exam_results WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Result not found" });
    }
    
    await db.execute('DELETE FROM exam_results WHERE id = ?', [id]);
    res.json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};