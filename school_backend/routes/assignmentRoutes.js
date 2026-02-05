const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const assignmentController = require('../controllers/assignmentController');

// ============================================
// ASSIGNMENTS ROUTES
// ============================================

// Get all assignments (Admin/Teacher)
router.get('/assignments', protect, assignmentController.getAllAssignments);

// Get assignments by class (Student)
router.get('/assignments/class/:classname', protect, assignmentController.getAssignmentsByClass);

// Create assignment (Teacher)
router.post('/assignments', protect, assignmentController.createAssignment);

// Update assignment
router.put('/assignments/:id', protect, assignmentController.updateAssignment);

// Delete assignment
router.delete('/assignments/:id', protect, assignmentController.deleteAssignment);

// ============================================
// ASSIGNMENT SUBMISSIONS ROUTES
// ============================================

// Submit assignment (Student)
router.post('/assignments/submit', protect, assignmentController.submitAssignment);

// Get submissions for an assignment (Teacher/Admin)
router.get('/assignments/:assignmentId/submissions', protect, assignmentController.getAssignmentSubmissions);

// Get student's submission
router.get('/assignments/:assignmentId/submission/:admissionNo', protect, assignmentController.getStudentSubmission);

// Grade assignment (Teacher)
router.put('/assignments/submissions/:id/grade', protect, assignmentController.gradeAssignment);

// ============================================
// QUIZZES ROUTES
// ============================================

// Get all quizzes (Admin/Teacher)
router.get('/quizzes', protect, assignmentController.getAllQuizzes);

// Get quizzes by class (Student)
router.get('/quizzes/class/:classname', protect, assignmentController.getQuizzesByClass);

// Get quiz for taking (Student) - without answers
router.get('/quizzes/:id/take', protect, assignmentController.getQuizForStudent);

// Create quiz (Teacher)
router.post('/quizzes', protect, assignmentController.createQuiz);

// Update quiz
router.put('/quizzes/:id', protect, assignmentController.updateQuiz);

// Delete quiz
router.delete('/quizzes/:id', protect, assignmentController.deleteQuiz);

// ============================================
// QUIZ SUBMISSIONS ROUTES
// ============================================

// Submit quiz (Student)
router.post('/quizzes/submit', protect, assignmentController.submitQuiz);

// Get submissions for a quiz (Teacher/Admin)
router.get('/quizzes/:quizId/submissions', protect, assignmentController.getQuizSubmissions);

// Get student's quiz submission
router.get('/quizzes/:quizId/submission/:admissionNo', protect, assignmentController.getStudentQuizSubmission);

// Grade quiz (Teacher)
router.put('/quizzes/submissions/:id/grade', protect, assignmentController.gradeQuiz);

module.exports = router;
