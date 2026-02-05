const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// GET image as base64
router.get('/base64', async (req, res) => {
  try {
    let { path: imagePath } = req.query;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    console.log('Original image path:', imagePath);
    
    // Remove http://localhost:5000 prefix if present
    imagePath = imagePath.replace(/^https?:\/\/[^\/]+/, '');
    
    console.log('Cleaned image path:', imagePath);

    // Construct full path
    const fullPath = path.join(__dirname, '..', imagePath.replace(/^\//, ''));
    
    console.log('Full file path:', fullPath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      console.error('File not found:', fullPath);
      return res.status(404).json({ error: 'Image not found', path: fullPath });
    }

    // Read file as buffer
    const imageBuffer = await fs.readFile(fullPath);
    
    // Convert to base64
    const base64Image = imageBuffer.toString('base64');
    
    // Determine mime type
    const ext = path.extname(fullPath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    
    // Send as data URL
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    
    console.log('Image converted successfully, size:', base64Image.length);
    
    res.json({ 
      success: true,
      data: dataUrl 
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    res.status(500).json({ error: 'Error processing image', message: error.message });
  }
});

module.exports = router;
