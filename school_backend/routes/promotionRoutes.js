const express = require('express');
const router = express.Router();
const {
    getClassList,
    getStudentsForPromotion,
    promoteStudents,
    getPromotionHistory,
} = require('../controllers/promotionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/classes', protect, adminOnly, getClassList);
router.get('/students', protect, adminOnly, getStudentsForPromotion);
router.post('/promote', protect, adminOnly, promoteStudents);
router.get('/history', protect, adminOnly, getPromotionHistory);

module.exports = router;
