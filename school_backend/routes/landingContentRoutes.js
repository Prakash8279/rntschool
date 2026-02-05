const express = require('express');
const router = express.Router();
const landingContentController = require('../controllers/landingContentController');
const { protect } = require('../middleware/authMiddleware');

// Get landing page content (public for website viewing)
router.get('/', landingContentController.getLandingContent);

// Update single section (protected)
router.post('/', protect, landingContentController.updateLandingContent);

// Bulk update all sections (protected)
router.put('/bulk', protect, landingContentController.bulkUpdateLandingContent);

// Delete section (protected)
router.delete('/:section', protect, landingContentController.deleteLandingContent);

module.exports = router;
