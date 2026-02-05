const db = require('../config/db');

// Create an expense
const createExpense = async (req, res) => {
  try {
    const { title, description, amount, category, date } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO expenses (title, amount, category, description, date, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.execute(query, [
      title || description || 'Untitled', 
      amount, 
      category, 
      description || '', 
      date
    ]);

    // Return the created expense
    const newExpense = {
      id: result.insertId,
      title: title || description || 'Untitled',
      amount: parseFloat(amount),
      category,
      description: description || '',
      date,
      created_at: new Date()
    };

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Error recording expense', error: error.message });
  }
};

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC';

    const [expenses] = await db.execute(query, params);

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM expenses WHERE id = ?';
    const [expenses] = await db.execute(query, [id]);

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ data: expenses[0] });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Error fetching expense', error: error.message });
  }
};

// Get expenses by category
const getExpensesByCategory = async (req, res) => {
  try {
    const query = `
      SELECT category, SUM(amount) as total, COUNT(*) as count
      FROM expenses
      GROUP BY category
      ORDER BY total DESC
    `;

    const [categoryData] = await db.execute(query);

    res.json({ data: categoryData });
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date, notes } = req.body;

    const query = `
      UPDATE expenses 
      SET title = ?, amount = ?, category = ?, description = ?, date = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [category, amount, category, description || notes || '', date, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM expenses WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};

// Get expense summary
const getExpenseSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    let dateFilter = '';
    const params = [];

    if (month && year) {
      dateFilter = ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(parseInt(month), parseInt(year));
    }

    const summaryQuery = `
      SELECT 
        SUM(amount) as totalAmount,
        COUNT(*) as totalExpenses,
        MAX(amount) as maxAmount,
        MIN(amount) as minAmount,
        AVG(amount) as avgAmount
      FROM expenses
      WHERE 1=1 ${dateFilter}
    `;

    const [summary] = await db.execute(summaryQuery, params);

    const categoryQuery = `
      SELECT category, SUM(amount) as amount, COUNT(*) as count
      FROM expenses
      WHERE 1=1 ${dateFilter}
      GROUP BY category
      ORDER BY amount DESC
    `;

    const [byCategory] = await db.execute(categoryQuery, params);

    res.json({
      summary: summary[0],
      byCategory: byCategory
    });
  } catch (error) {
    console.error('Error fetching expense summary:', error);
    res.status(500).json({ message: 'Error fetching summary', error: error.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByCategory,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
