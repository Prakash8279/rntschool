const db = require('../config/db');

// ============================================
// ASSIGNMENTS MANAGEMENT
// ============================================

// Get all assignments (Admin/Teacher view)
exports.getAllAssignments = async (req, res) => {
  try {
    const { classname, subject, teacher_id } = req.query;
    let sql = 'SELECT * FROM assignments WHERE 1=1';
    const params = [];

    if (classname) {
      sql += ' AND classname = ?';
      params.push(classname);
    }
    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }
    if (teacher_id) {
      sql += ' AND teacher_id = ?';
      params.push(teacher_id);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(sql, params);
    const assignments = rows.map(a => ({
      _id: a.id.toString(),
      ...a,
      due_date: a.due_date ? new Date(a.due_date).toISOString().split('T')[0] : null
    }));
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get assignments for a class (Student view)
exports.getAssignmentsByClass = async (req, res) => {
  try {
    const { classname } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM assignments WHERE classname = ? AND is_active = 1 ORDER BY due_date ASC',
      [classname]
    );
    const assignments = rows.map(a => ({
      _id: a.id.toString(),
      ...a,
      due_date: a.due_date ? new Date(a.due_date).toISOString().split('T')[0] : null
    }));
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create assignment (Teacher)
exports.createAssignment = async (req, res) => {
  const { title, description, classname, subject, teacher_id, teacher_name, due_date, max_marks, attachment_url } = req.body;
  try {
    const sql = `
      INSERT INTO assignments (title, description, classname, subject, teacher_id, teacher_name, due_date, max_marks, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title, description, classname, subject, teacher_id, teacher_name, due_date, max_marks || 100, attachment_url || null
    ]);
    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      title, description, classname, subject, teacher_id, teacher_name, due_date, max_marks, attachment_url
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, classname, subject, due_date, max_marks, attachment_url, is_active } = req.body;
  try {
    const sql = `
      UPDATE assignments SET title=?, description=?, classname=?, subject=?, due_date=?, max_marks=?, attachment_url=?, is_active=?
      WHERE id=?
    `;
    await db.execute(sql, [title, description, classname, subject, due_date, max_marks, attachment_url, is_active, id]);
    res.json({ _id: id, title, description, classname, subject, due_date, max_marks, attachment_url, is_active });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM assignments WHERE id = ?', [id]);
    res.json({ message: 'Assignment deleted', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ASSIGNMENT SUBMISSIONS
// ============================================

// Submit assignment (Student)
exports.submitAssignment = async (req, res) => {
  const { assignment_id, student_id, admission_no, student_name, classname, submission_text, attachment_url } = req.body;
  try {
    // Check if already submitted
    const [existing] = await db.execute(
      'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND admission_no = ?',
      [assignment_id, admission_no]
    );

    if (existing.length > 0) {
      // Update existing submission
      await db.execute(
        'UPDATE assignment_submissions SET submission_text=?, attachment_url=?, submitted_at=NOW() WHERE id=?',
        [submission_text, attachment_url, existing[0].id]
      );
      return res.json({ message: 'Assignment updated', id: existing[0].id });
    }

    const sql = `
      INSERT INTO assignment_submissions (assignment_id, student_id, admission_no, student_name, classname, submission_text, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      assignment_id, student_id, admission_no, student_name, classname, submission_text, attachment_url || null
    ]);
    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      assignment_id, student_id, admission_no, student_name, classname, submission_text
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get submissions for an assignment (Teacher/Admin)
exports.getAssignmentSubmissions = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM assignment_submissions WHERE assignment_id = ? ORDER BY submitted_at DESC',
      [assignmentId]
    );
    const submissions = rows.map(s => ({
      _id: s.id.toString(),
      ...s,
      submitted_at: s.submitted_at ? new Date(s.submitted_at).toISOString() : null
    }));
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's submission for an assignment
exports.getStudentSubmission = async (req, res) => {
  const { assignmentId, admissionNo } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM assignment_submissions WHERE assignment_id = ? AND admission_no = ?',
      [assignmentId, admissionNo]
    );
    if (rows.length === 0) {
      return res.json(null);
    }
    res.json({ _id: rows[0].id.toString(), ...rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Grade assignment submission (Teacher)
exports.gradeAssignment = async (req, res) => {
  const { id } = req.params;
  const { marks_obtained, remarks, graded_by } = req.body;
  try {
    await db.execute(
      'UPDATE assignment_submissions SET marks_obtained=?, remarks=?, is_graded=1, graded_by=?, graded_at=NOW() WHERE id=?',
      [marks_obtained, remarks, graded_by, id]
    );
    res.json({ message: 'Assignment graded', id, marks_obtained, remarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// QUIZZES MANAGEMENT
// ============================================

// Get all quizzes (Admin/Teacher view)
exports.getAllQuizzes = async (req, res) => {
  try {
    const { classname, subject, teacher_id } = req.query;
    let sql = 'SELECT * FROM quizzes WHERE 1=1';
    const params = [];

    if (classname) {
      sql += ' AND classname = ?';
      params.push(classname);
    }
    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }
    if (teacher_id) {
      sql += ' AND teacher_id = ?';
      params.push(teacher_id);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(sql, params);
    const quizzes = rows.map(q => ({
      _id: q.id.toString(),
      ...q,
      questions: q.questions ? JSON.parse(q.questions) : [],
      start_time: q.start_time ? new Date(q.start_time).toISOString() : null,
      end_time: q.end_time ? new Date(q.end_time).toISOString() : null
    }));
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get quizzes for a class (Student view)
exports.getQuizzesByClass = async (req, res) => {
  try {
    const { classname } = req.params;
    const [rows] = await db.execute(
      'SELECT id, title, description, classname, subject, teacher_name, start_time, end_time, duration_minutes, total_marks, is_active FROM quizzes WHERE classname = ? AND is_active = 1 ORDER BY start_time ASC',
      [classname]
    );
    const quizzes = rows.map(q => ({
      _id: q.id.toString(),
      ...q,
      start_time: q.start_time ? new Date(q.start_time).toISOString() : null,
      end_time: q.end_time ? new Date(q.end_time).toISOString() : null
    }));
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get quiz with questions (for taking quiz)
exports.getQuizForStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = rows[0];
    let questions = quiz.questions ? JSON.parse(quiz.questions) : [];
    
    // Hide correct answers from student
    questions = questions.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      marks: q.marks
      // Don't send correct_answer
    }));

    res.json({
      _id: quiz.id.toString(),
      ...quiz,
      questions,
      start_time: quiz.start_time ? new Date(quiz.start_time).toISOString() : null,
      end_time: quiz.end_time ? new Date(quiz.end_time).toISOString() : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create quiz (Teacher)
exports.createQuiz = async (req, res) => {
  const { title, description, classname, subject, teacher_id, teacher_name, start_time, end_time, duration_minutes, total_marks, questions } = req.body;
  try {
    const sql = `
      INSERT INTO quizzes (title, description, classname, subject, teacher_id, teacher_name, start_time, end_time, duration_minutes, total_marks, questions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title, description, classname, subject, teacher_id, teacher_name, start_time, end_time, 
      duration_minutes || 30, total_marks || 100, JSON.stringify(questions || [])
    ]);
    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      title, description, classname, subject, teacher_id, teacher_name, start_time, end_time, duration_minutes, total_marks, questions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description, classname, subject, start_time, end_time, duration_minutes, total_marks, questions, is_active } = req.body;
  try {
    const sql = `
      UPDATE quizzes SET title=?, description=?, classname=?, subject=?, start_time=?, end_time=?, duration_minutes=?, total_marks=?, questions=?, is_active=?
      WHERE id=?
    `;
    await db.execute(sql, [
      title, description, classname, subject, start_time, end_time, duration_minutes, total_marks, 
      JSON.stringify(questions || []), is_active, id
    ]);
    res.json({ _id: id, title, description, classname, subject, start_time, end_time, duration_minutes, total_marks, questions, is_active });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM quizzes WHERE id = ?', [id]);
    res.json({ message: 'Quiz deleted', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// QUIZ SUBMISSIONS
// ============================================

// Submit quiz (Student)
exports.submitQuiz = async (req, res) => {
  const { quiz_id, student_id, admission_no, student_name, classname, answers, started_at } = req.body;
  try {
    // Check if already submitted
    const [existing] = await db.execute(
      'SELECT id FROM quiz_submissions WHERE quiz_id = ? AND admission_no = ?',
      [quiz_id, admission_no]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    // Get quiz to auto-grade MCQs
    const [quizRows] = await db.execute('SELECT questions FROM quizzes WHERE id = ?', [quiz_id]);
    const questions = quizRows[0]?.questions ? JSON.parse(quizRows[0].questions) : [];

    let autoMarks = 0;
    const answersArray = answers || [];

    // Auto-grade MCQ questions
    questions.forEach(q => {
      if (q.type === 'mcq') {
        const studentAnswer = answersArray.find(a => a.question_id === q.id);
        if (studentAnswer && studentAnswer.answer === q.correct_answer) {
          autoMarks += q.marks || 0;
        }
      }
    });

    const sql = `
      INSERT INTO quiz_submissions (quiz_id, student_id, admission_no, student_name, classname, answers, started_at, auto_marks, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      quiz_id, student_id, admission_no, student_name, classname, 
      JSON.stringify(answersArray), started_at, autoMarks, autoMarks
    ]);

    res.status(201).json({
      _id: result.insertId.toString(),
      id: result.insertId,
      quiz_id, student_id, admission_no, student_name, classname, answers: answersArray, auto_marks: autoMarks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get submissions for a quiz (Teacher/Admin)
exports.getQuizSubmissions = async (req, res) => {
  const { quizId } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM quiz_submissions WHERE quiz_id = ? ORDER BY submitted_at DESC',
      [quizId]
    );
    const submissions = rows.map(s => ({
      _id: s.id.toString(),
      ...s,
      answers: s.answers ? JSON.parse(s.answers) : [],
      submitted_at: s.submitted_at ? new Date(s.submitted_at).toISOString() : null
    }));
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's quiz submission
exports.getStudentQuizSubmission = async (req, res) => {
  const { quizId, admissionNo } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM quiz_submissions WHERE quiz_id = ? AND admission_no = ?',
      [quizId, admissionNo]
    );
    if (rows.length === 0) {
      return res.json(null);
    }
    const s = rows[0];
    res.json({ 
      _id: s.id.toString(), 
      ...s,
      answers: s.answers ? JSON.parse(s.answers) : []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Grade quiz (Teacher - for text questions)
exports.gradeQuiz = async (req, res) => {
  const { id } = req.params;
  const { manual_marks, graded_by } = req.body;
  try {
    // Get current auto_marks
    const [current] = await db.execute('SELECT auto_marks FROM quiz_submissions WHERE id = ?', [id]);
    const autoMarks = current[0]?.auto_marks || 0;
    const totalMarks = autoMarks + (manual_marks || 0);

    await db.execute(
      'UPDATE quiz_submissions SET manual_marks=?, total_marks=?, is_graded=1, graded_by=?, graded_at=NOW() WHERE id=?',
      [manual_marks, totalMarks, graded_by, id]
    );
    res.json({ message: 'Quiz graded', id, manual_marks, total_marks: totalMarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
