import express from 'express';
import { BankAccountController } from '../controllers/bankAccountController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/bank-accounts - Get all bank accounts for user
router.get('/', BankAccountController.getAll);

// GET /api/bank-accounts/stats - Get bank account statistics
router.get('/stats', BankAccountController.getStats);

// GET /api/bank-accounts/:id - Get specific bank account
router.get('/:id', BankAccountController.getById);

// POST /api/bank-accounts - Create new bank account
router.post('/', BankAccountController.create);

// PUT /api/bank-accounts/:id - Update bank account
router.put('/:id', BankAccountController.update);

// PATCH /api/bank-accounts/:id/balance - Update bank account balance
router.patch('/:id/balance', BankAccountController.updateBalance);

// DELETE /api/bank-accounts/:id - Delete bank account
router.delete('/:id', BankAccountController.delete);

export default router; 