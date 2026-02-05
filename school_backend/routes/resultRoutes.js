const express = require('express');
const router = express.Router();
const { addResult, getResults, deleteResult, bulkAddResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/', addResult);
router.post('/bulk', bulkAddResults);
router.get('/', getResults);
router.delete('/:id', deleteResult);

module.exports = router;