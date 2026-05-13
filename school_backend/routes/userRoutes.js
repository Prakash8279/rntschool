const express = require('express');
const router = express.Router();
const { getSystemUsers, createSystemUser, deleteUser, changePasswordByAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSystemUsers);
router.post('/', createSystemUser);
router.delete('/:id', deleteUser);
router.put('/change-password', protect, changePasswordByAdmin);

module.exports = router;