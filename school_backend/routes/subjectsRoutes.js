const express = require('express');
const router = express.Router();
const subjectsController = require('../controllers/subjectsController');

// Get all subjects or filter by class
router.get('/', subjectsController.getSubjects);

// Get subjects by class
router.get('/class/:className', subjectsController.getSubjectsByClass);

// Create subject
router.post('/', subjectsController.createSubject);

// Bulk update subjects for a class
router.put('/class/:className', subjectsController.bulkUpdateSubjects);

// Update subject
router.put('/:id', subjectsController.updateSubject);

// Delete subject
router.delete('/:id', subjectsController.deleteSubject);

module.exports = router;
