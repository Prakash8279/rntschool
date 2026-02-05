const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Get all landing page content
const getLandingContent = async (req, res) => {
  try {
    const [content] = await db.query('SELECT * FROM landing_content');
    const [gallery] = await db.query('SELECT * FROM gallery_images WHERE is_active = TRUE ORDER BY display_order');
    const [notices] = await db.query('SELECT * FROM landing_notices WHERE is_active = TRUE AND (end_date IS NULL OR end_date >= CURDATE()) ORDER BY is_important DESC, created_at DESC');

    // Transform content into structured object
    const contentObj = {
      home: {},
      about: {},
      contact: {},
      gallery: {
        title: '',
        titleHighlight: '',
        description: '',
        images: []
      }
    };

    content.forEach(item => {
      if (item.section === 'home') {
        if (item.field_key.startsWith('stats_')) {
          const parts = item.field_key.split('_');
          const statName = parts[1];
          const statField = parts[2];
          if (!contentObj.home.stats) contentObj.home.stats = {};
          if (!contentObj.home.stats[statName]) contentObj.home.stats[statName] = {};
          contentObj.home.stats[statName][statField] = item.field_value;
        } else {
          contentObj.home[item.field_key] = item.field_value;
        }
      } else if (item.section === 'about') {
        contentObj.about[item.field_key] = item.field_value;
      } else if (item.section === 'contact') {
        contentObj.contact[item.field_key] = item.field_value;
      } else if (item.section === 'gallery') {
        contentObj.gallery[item.field_key] = item.field_value;
      }
    });

    // Add gallery images - support both upload and external URL
    contentObj.gallery.images = gallery.map(img => ({
      id: img.id,
      src: img.image_type === 'external' ? img.external_url : img.image_path,
      title: img.title,
      category: img.category,
      emoji: img.emoji,
      image_type: img.image_type || 'upload'
    }));

    res.json({
      success: true,
      data: {
        content: contentObj,
        notices: notices
      }
    });
  } catch (error) {
    console.error('Error fetching landing content:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update landing page content
const updateLandingContent = async (req, res) => {
  try {
    const { section, field_key, field_value } = req.body;

    await db.query(
      `INSERT INTO landing_content (section, field_key, field_value) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE field_value = ?`,
      [section, field_key, field_value, field_value]
    );

    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating landing content:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk update landing content
const bulkUpdateLandingContent = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { section, field_key, field_value }

    for (const update of updates) {
      await db.query(
        `INSERT INTO landing_content (section, field_key, field_value) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE field_value = ?`,
        [update.section, update.field_key, update.field_value, update.field_value]
      );
    }

    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error bulk updating landing content:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all gallery images (including inactive)
const getAllGalleryImages = async (req, res) => {
  try {
    const [images] = await db.query('SELECT * FROM gallery_images ORDER BY display_order');
    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Upload gallery image from file
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, category, emoji } = req.body;
    const imagePath = `/uploads/gallery/${req.file.filename}`;

    // Get max display order
    const [maxOrder] = await db.query('SELECT MAX(display_order) as maxOrder FROM gallery_images');
    const displayOrder = (maxOrder[0].maxOrder || 0) + 1;

    const [result] = await db.query(
      'INSERT INTO gallery_images (title, category, emoji, image_path, image_type, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title || 'Gallery Image', category || 'Activities', emoji || '📸', imagePath, 'upload', displayOrder]
    );

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: result.insertId,
        title,
        category,
        emoji,
        image_path: imagePath,
        image_type: 'upload',
        display_order: displayOrder
      }
    });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add gallery image from external URL (Google Drive, etc.)
const addExternalGalleryImage = async (req, res) => {
  try {
    const { title, category, emoji, external_url } = req.body;

    if (!external_url) {
      return res.status(400).json({ success: false, message: 'External URL is required' });
    }

    // Get max display order
    const [maxOrder] = await db.query('SELECT MAX(display_order) as maxOrder FROM gallery_images');
    const displayOrder = (maxOrder[0].maxOrder || 0) + 1;

    const [result] = await db.query(
      'INSERT INTO gallery_images (title, category, emoji, external_url, image_type, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title || 'Gallery Image', category || 'Activities', emoji || '📸', external_url, 'external', displayOrder]
    );

    res.json({
      success: true,
      message: 'Image added successfully',
      data: {
        id: result.insertId,
        title,
        category,
        emoji,
        external_url,
        image_type: 'external',
        display_order: displayOrder
      }
    });
  } catch (error) {
    console.error('Error adding external gallery image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update gallery image
const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, emoji, display_order, is_active, external_url, image_type } = req.body;

    if (image_type === 'external' && external_url) {
      await db.query(
        'UPDATE gallery_images SET title = ?, category = ?, emoji = ?, display_order = ?, is_active = ?, external_url = ?, image_type = ? WHERE id = ?',
        [title, category, emoji, display_order, is_active, external_url, 'external', id]
      );
    } else {
      await db.query(
        'UPDATE gallery_images SET title = ?, category = ?, emoji = ?, display_order = ?, is_active = ? WHERE id = ?',
        [title, category, emoji, display_order, is_active, id]
      );
    }

    res.json({ success: true, message: 'Image updated successfully' });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete gallery image
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Get image details first
    const [images] = await db.query('SELECT image_path, image_type FROM gallery_images WHERE id = ?', [id]);
    
    if (images.length > 0) {
      // Delete file if it's an uploaded file (not external URL)
      if (images[0].image_type === 'upload' && images[0].image_path) {
        const imagePath = images[0].image_path;
        if (imagePath.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    await db.query('DELETE FROM gallery_images WHERE id = ?', [id]);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const [notices] = await db.query('SELECT * FROM landing_notices ORDER BY created_at DESC');
    res.json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create notice
const createNotice = async (req, res) => {
  try {
    const { title, content, notice_type, is_important, start_date, end_date } = req.body;

    const [result] = await db.query(
      'INSERT INTO landing_notices (title, content, notice_type, is_important, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, notice_type || 'general', is_important || false, start_date || null, end_date || null]
    );

    res.json({
      success: true,
      message: 'Notice created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update notice
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, notice_type, is_important, start_date, end_date, is_active } = req.body;

    await db.query(
      'UPDATE landing_notices SET title = ?, content = ?, notice_type = ?, is_important = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?',
      [title, content, notice_type, is_important, start_date || null, end_date || null, is_active, id]
    );

    res.json({ success: true, message: 'Notice updated successfully' });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete notice
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM landing_notices WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
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
};
