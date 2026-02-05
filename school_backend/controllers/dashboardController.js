const db = require('../config/db');

// --- STATISTICS ---
exports.getStats = async (req, res) => {
  try {
    // Single optimized query instead of 4 separate queries
    const currentYear = new Date().getFullYear();
    const [result] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM students) as students,
        (SELECT COUNT(*) FROM teachers) as teachers,
        (SELECT COUNT(*) FROM staff) as staff,
        (SELECT COALESCE(SUM(total_amount), 0) FROM fee_collections WHERE year = ?) as totalCollection
    `, [currentYear.toString()]);

    res.json({
      students: result[0].students,
      teachers: result[0].teachers,
      staff: result[0].staff,
      totalCollection: result[0].totalCollection
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- LANDING PAGE CONTENT ---
exports.getLandingContent = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT content FROM site_content WHERE section_name = 'landing_page'");
    if (rows.length > 0) {
      res.json(rows[0].content || {});
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLandingContent = async (req, res) => {
  const content = req.body; // Full JSON object
  try {
    const jsonStr = JSON.stringify(content);
    // Upsert (Insert if not exists, update if exists)
    const sql = `
      INSERT INTO site_content (section_name, content) VALUES ('landing_page', ?)
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `;
    await db.execute(sql, [jsonStr]);
    res.json({ message: "Content updated", content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};