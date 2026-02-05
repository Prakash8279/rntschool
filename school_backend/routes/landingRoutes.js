const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getLandingContent,
  updateLandingContent,
  bulkUpdateLandingContent,
  getAllGalleryImages,
  uploadGalleryImage,
  addExternalGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/landingController');

// Ensure gallery upload directory exists
const galleryUploadDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, { recursive: true });
}

// Multer config for gallery images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, galleryUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Public route - Get landing page content
router.get('/content', getLandingContent);

// Admin routes - Content management
router.put('/content', protect, adminOnly, updateLandingContent);
router.put('/content/bulk', protect, adminOnly, bulkUpdateLandingContent);

// Admin routes - Gallery management
router.get('/gallery', protect, adminOnly, getAllGalleryImages);
router.post('/gallery', protect, adminOnly, upload.single('image'), uploadGalleryImage);
router.post('/gallery/external', protect, adminOnly, addExternalGalleryImage);
router.put('/gallery/:id', protect, adminOnly, updateGalleryImage);
router.delete('/gallery/:id', protect, adminOnly, deleteGalleryImage);

// Admin routes - Notice management
router.get('/notices', protect, adminOnly, getAllNotices);
router.post('/notices', protect, adminOnly, createNotice);
router.put('/notices/:id', protect, adminOnly, updateNotice);
router.delete('/notices/:id', protect, adminOnly, deleteNotice);

module.exports = router;
