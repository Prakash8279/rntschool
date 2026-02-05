const db = require('../config/db');

// Get all settings
const getAllSettings = async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM settings ORDER BY setting_key');
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get setting by key
const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const [settings] = await db.query('SELECT * FROM settings WHERE setting_key = ?', [key]);
    
    if (settings.length === 0) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    res.json(settings[0]);
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update setting
const upsertSetting = async (req, res) => {
  try {
    const { setting_key, setting_value, setting_type, description } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO settings (setting_key, setting_value, setting_type, description) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value),
       setting_type = VALUES(setting_type),
       description = VALUES(description)`,
      [setting_key, JSON.stringify(setting_value), setting_type, description]
    );
    
    res.json({ message: 'Setting saved successfully', id: result.insertId });
  } catch (error) {
    console.error('Save setting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete setting
const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    await db.query('DELETE FROM settings WHERE setting_key = ?', [key]);
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  deleteSetting
};
