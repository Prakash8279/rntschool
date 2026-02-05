const db = require('../config/db');

// Get all subjects or by class
const getSubjects = async (req, res) => {
  try {
    const { class: className } = req.query;
    
    let query = 'SELECT * FROM subjects';
    let params = [];
    
    if (className) {
      query += ' WHERE class = ?';
      params.push(className);
    }
    
    query += ' ORDER BY class, subject_code';
    
    const [subjects] = await db.query(query, params);
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get subjects by class
const getSubjectsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const [subjects] = await db.query(
      'SELECT * FROM subjects WHERE class = ? ORDER BY subject_code',
      [className]
    );
    
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects by class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create subject
const createSubject = async (req, res) => {
  try {
    const { class: className, subject_name, subject_code } = req.body;
    
    if (!className || !subject_name || !subject_code) {
      return res.status(400).json({ message: 'Class, subject name, and subject code are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO subjects (class, subject_name, subject_code) VALUES (?, ?, ?)',
      [className, subject_name, subject_code]
    );
    
    res.status(201).json({ 
      message: 'Subject created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create subject error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Subject already exists for this class' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name, subject_code } = req.body;
    
    const [result] = await db.query(
      'UPDATE subjects SET subject_name = ?, subject_code = ? WHERE id = ?',
      [subject_name, subject_code, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json({ message: 'Subject updated successfully' });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM subjects WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk update subjects for a class
const bulkUpdateSubjects = async (req, res) => {
  try {
    const { className } = req.params;
    const { subjects } = req.body;
    
    if (!Array.isArray(subjects)) {
      return res.status(400).json({ message: 'Subjects must be an array' });
    }
    
    // Delete existing subjects for this class
    await db.query('DELETE FROM subjects WHERE class = ?', [className]);
    
    // Insert new subjects
    for (const subject of subjects) {
      await db.query(
        'INSERT INTO subjects (class, subject_name, subject_code) VALUES (?, ?, ?)',
        [className, subject.name || subject.subject_name, subject.code || subject.subject_code]
      );
    }
    
    res.json({ message: 'Subjects updated successfully' });
  } catch (error) {
    console.error('Bulk update subjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectsByClass,
  createSubject,
  updateSubject,
  deleteSubject,
  bulkUpdateSubjects
};
