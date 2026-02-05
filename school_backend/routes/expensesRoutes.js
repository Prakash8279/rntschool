const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');
const { protect } = require('../middleware/authMiddleware');

// Create expense (protected)
router.post('/', protect, expensesController.createExpense);

// Get all expenses with filters (protected)
router.get('/', protect, expensesController.getAllExpenses);

// Get expense summary (protected)
router.get('/summary', protect, expensesController.getExpenseSummary);

// Get expenses by category (protected)
router.get('/category', protect, expensesController.getExpensesByCategory);

// Get expense by ID (protected)
router.get('/:id', protect, expensesController.getExpenseById);

// Update expense (protected)
router.put('/:id', protect, expensesController.updateExpense);

// Delete expense (protected)
router.delete('/:id', protect, expensesController.deleteExpense);

module.exports = router;
