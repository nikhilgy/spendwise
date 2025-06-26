import express from 'express';
import { PDFImportController } from '../controllers/pdfImportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/pdf-import/upload - Upload and process PDF file
router.post('/upload', PDFImportController.uploadAndProcess);

// POST /api/pdf-import/validate - Validate uploaded file
router.post('/validate', PDFImportController.validateFile);

// POST /api/pdf-import/extract - Extract transactions from provided data
router.post('/extract', PDFImportController.extractTransactions);

// POST /api/pdf-import/save - Save extracted transactions
router.post('/save', PDFImportController.saveTransactions);

// GET /api/pdf-import/history - Get import history
router.get('/history', PDFImportController.getImportHistory);

export default router; 