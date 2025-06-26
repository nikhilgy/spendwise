import { PDFImportService, upload } from '../services/pdfImportService.js';
import path from 'path';

export class PDFImportController {
  static async uploadAndProcess(req, res) {
    try {
      // Use multer middleware to handle file upload
      upload.single('pdfFile')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No PDF file provided'
          });
        }

        try {
          const userId = req.user.id;
          const { bank_account_id } = req.body;
          const filePath = req.file.path;

          // Process the uploaded PDF
          const result = await PDFImportService.processBankStatement(
            filePath, 
            userId, 
            bank_account_id
          );

          // Clean up the uploaded file
          await PDFImportService.cleanupFile(filePath);

          res.json({
            success: true,
            message: result.message,
            data: result.data
          });
        } catch (error) {
          // Clean up file on error
          if (req.file) {
            await PDFImportService.cleanupFile(req.file.path);
          }

          console.error('Error processing PDF:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to process PDF',
            error: error.message
          });
        }
      });
    } catch (error) {
      console.error('Error in uploadAndProcess:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async extractTransactions(req, res) {
    try {
      const userId = req.user.id;
      const { transactions } = req.body;

      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({
          success: false,
          message: 'Transactions array is required'
        });
      }

      // Categorize transactions
      const categorizedTransactions = await PDFImportService.categorizeTransactions(transactions);

      res.json({
        success: true,
        data: {
          transactions: categorizedTransactions,
          count: categorizedTransactions.length
        }
      });
    } catch (error) {
      console.error('Error extracting transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to extract transactions',
        error: error.message
      });
    }
  }

  static async saveTransactions(req, res) {
    try {
      const userId = req.user.id;
      const { transactions, bank_account_id } = req.body;

      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({
          success: false,
          message: 'Transactions array is required'
        });
      }

      // Save transactions to database
      const result = await PDFImportService.saveTransactions(
        transactions, 
        userId, 
        bank_account_id
      );

      res.json({
        success: true,
        message: `Successfully saved ${result.savedCount} transactions`,
        data: result
      });
    } catch (error) {
      console.error('Error saving transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save transactions',
        error: error.message
      });
    }
  }

  static async getImportHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, offset = 0 } = req.query;

      // TODO: Implement import history tracking
      // For now, return mock data
      const mockHistory = [
        {
          id: '1',
          user_id: userId,
          file_name: 'bank_statement_jan_2024.pdf',
          total_transactions: 45,
          processed_at: new Date().toISOString(),
          status: 'completed',
          bank_account_id: null
        },
        {
          id: '2',
          user_id: userId,
          file_name: 'credit_card_statement_feb_2024.pdf',
          total_transactions: 32,
          processed_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          bank_account_id: null
        }
      ];

      res.json({
        success: true,
        data: mockHistory.slice(offset, offset + limit),
        count: mockHistory.length
      });
    } catch (error) {
      console.error('Error fetching import history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch import history',
        error: error.message
      });
    }
  }

  static async validateFile(req, res) {
    try {
      upload.single('pdfFile')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'File validation error',
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No file provided'
          });
        }

        try {
          const fileInfo = {
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            filename: req.file.filename
          };

          // Validate file size (10MB limit)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (req.file.size > maxSize) {
            await PDFImportService.cleanupFile(req.file.path);
            return res.status(400).json({
              success: false,
              message: 'File size exceeds 10MB limit'
            });
          }

          // Validate file type
          if (req.file.mimetype !== 'application/pdf') {
            await PDFImportService.cleanupFile(req.file.path);
            return res.status(400).json({
              success: false,
              message: 'Only PDF files are allowed'
            });
          }

          res.json({
            success: true,
            message: 'File validation successful',
            data: fileInfo
          });
        } catch (error) {
          // Clean up file on error
          if (req.file) {
            await PDFImportService.cleanupFile(req.file.path);
          }

          console.error('Error validating file:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to validate file',
            error: error.message
          });
        }
      });
    } catch (error) {
      console.error('Error in validateFile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
} 