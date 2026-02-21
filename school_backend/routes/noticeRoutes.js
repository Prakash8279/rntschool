const express = require('express');
const router = express.Router();
const { getNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getNotices);
router.post('/', protect, createNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;