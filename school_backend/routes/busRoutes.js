const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');

// ============================================
// BUS ROUTES MANAGEMENT (Admin Only)
// ============================================
router.get('/routes', protect, busController.getAllBusRoutes);
router.post('/routes', protect, busController.createBusRoute);
router.put('/routes/:id', protect, busController.updateBusRoute);
router.delete('/routes/:id', protect, busController.deleteBusRoute);
router.post('/routes/seed', protect, busController.seedBusRoutes); // Seed default routes

// ============================================
// BUS FEE CONFIGURATION (Admin Only)
// ============================================
router.get('/config', protect, busController.getBusFeeConfig);
router.put('/config', protect, busController.updateBusFeeConfig);

// ============================================
// BUS ASSIGNMENTS (Student Bus Selection)
// ============================================
router.get('/assignments', protect, busController.getAllBusAssignments);
router.get('/assignments/:admissionNo', protect, busController.getStudentBusAssignment);
router.post('/assignments', protect, busController.assignBusToStudent);
router.put('/assignments/:admissionNo/remove', protect, busController.removeBusFromStudent);

module.exports = router;
