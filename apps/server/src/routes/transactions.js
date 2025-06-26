import express from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransactionById, 
  updateTransaction, 
  deleteTransaction,
  getTransactionStats,
  getRecentTransactions,
  importTransactions,
  parseCSVTransactions
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Transaction routes
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.get('/recent', getRecentTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

// Import routes
router.post('/import', importTransactions);
router.post('/parse-csv', parseCSVTransactions);

export default router; 