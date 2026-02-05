const db = require('../config/db');
const { clearCache } = require('../middleware/cacheMiddleware');

// GET Structure
exports.getFeeStructure = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM fee_structure');
    // Map snake_case (DB) to camelCase (Frontend)
    const structure = rows.map(r => ({
      classname: r.classname,
      admissionFee: r.admission_fee,
      monthlyFee: r.monthly_fee,
      examFee: r.exam_fee,
      otherFee: r.other_fee,
      fine: r.fine,
      busFee: r.bus_fee,
      dressFee: r.dress_fee,
      bookFee: r.book_fee,
      discount: r.discount
    }));
    res.json(structure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Structure (Bulk Update)
exports.updateFeeStructure = async (req, res) => {
  const fees = req.body; // Expects an Array
  try {
    for (const f of fees) {
      const sql = `
        UPDATE fee_structure SET 
        admission_fee=?, monthly_fee=?, exam_fee=?, other_fee=?, fine=?, bus_fee=?, dress_fee=?, book_fee=?, discount=?
        WHERE classname=?
      `;
      await db.execute(sql, [
        f.admissionFee ?? 0, 
        f.monthlyFee ?? 0, 
        f.examFee ?? 0, 
        f.otherFee ?? 0, 
        f.fine ?? 0, 
        f.busFee ?? 0, 
        f.dressFee ?? 0, 
        f.bookFee ?? 0, 
        f.discount ?? 0,
        f.classname
      ]);
    }
    clearCache('/fee-structure'); // Clear fee structure cache after update
    res.json({ message: "Fee structure updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};