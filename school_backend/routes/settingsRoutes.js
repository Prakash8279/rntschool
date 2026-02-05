const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// Get all settings (protected)
router.get('/', protect, settingsController.getAllSettings);

// Get setting by key (protected)
router.get('/:key', protect, settingsController.getSettingByKey);

// Create or update setting (protected)
router.post('/', protect, settingsController.upsertSetting);

// Delete setting (protected)
router.delete('/:key', protect, settingsController.deleteSetting);

module.exports = router;
