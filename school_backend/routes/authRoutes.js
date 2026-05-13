const express = require('express');
const router = express.Router();
const { login, registerAdmin, changeOwnPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', registerAdmin);
router.put('/change-password', protect, changeOwnPassword);

module.exports = router;