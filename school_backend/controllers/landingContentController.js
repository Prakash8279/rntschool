const db = require('../config/db');

// Get landing page content
const getLandingContent = async (req, res) => {
  try {
    const { section } = req.query;
    
    let query = 'SELECT * FROM landing_content';
    let params = [];
    
    if (section) {
      query += ' WHERE section = ?';
      params.push(section);
    }
    
    const [content] = await db.query(query, params);
    
    // Parse JSON content
    const parsed = content.map(item => ({
      section: item.section,
      content: JSON.parse(item.content)
    }));
    
    // If single section requested, return just that content
    if (section && parsed.length > 0) {
      return res.json(parsed[0].content);
    }
    
    // Otherwise return all sections as object
    const result = {};
    parsed.forEach(item => {
      result[item.section] = item.content;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get landing content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update landing page content
const updateLandingContent = async (req, res) => {
  try {
    const { section, content } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ message: 'Section and content are required' });
    }
    
    const [result] = await db.query(
      `INSERT INTO landing_content (section, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE 
       content = VALUES(content)`,
      [section, JSON.stringify(content)]
    );
    
    res.json({ message: 'Landing content updated successfully', id: result.insertId });
  } catch (error) {
    console.error('Update landing content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk update all landing page content
const bulkUpdateLandingContent = async (req, res) => {
  try {
    const contentData = req.body; // Expected: { home: {...}, about: {...}, gallery: {...}, contact: {...} }
    
    for (const [section, content] of Object.entries(contentData)) {
      await db.query(
        `INSERT INTO landing_content (section, content) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE 
         content = VALUES(content)`,
        [section, JSON.stringify(content)]
      );
    }
    
    res.json({ message: 'All landing content updated successfully' });
  } catch (error) {
    console.error('Bulk update landing content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete landing page section
const deleteLandingContent = async (req, res) => {
  try {
    const { section } = req.params;
    
    const [result] = await db.query('DELETE FROM landing_content WHERE section = ?', [section]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json({ message: 'Landing content deleted successfully' });
  } catch (error) {
    console.error('Delete landing content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLandingContent,
  updateLandingContent,
  bulkUpdateLandingContent,
  deleteLandingContent
};
