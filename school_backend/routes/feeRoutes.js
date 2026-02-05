const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.get('/', protect, feeController.getFeeHistory);
router.post('/pay', protect, feeController.collectFee);
router.get('/analytics', protect, feeController.getFeeAnalytics);
router.get('/defaulters', protect, feeController.getDefaultersList);
router.get('/student/:admissionNo', protect, feeController.getStudentFeeSummary);
router.get('/fee-dues/all', protect, feeController.getAllFeeDues);
router.get('/fee-dues/:admissionNo', protect, feeController.getFeeDueByAdmissionNo);
router.get('/advance/all', protect, feeController.getAllStudentAdvances);
router.get('/advance/:admissionNo', protect, feeController.getStudentAdvance);

router.delete('/:id', protect, feeController.deleteFeeRecord);



module.exports = router;