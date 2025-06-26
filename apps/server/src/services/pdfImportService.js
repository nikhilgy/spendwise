import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

export class PDFImportService {
  static async extractTransactionsFromPDF(filePath, userId) {
    try {
      // TODO: Implement actual PDF parsing logic
      // For now, return mock data structure
      
      const mockTransactions = [
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Sample Transaction 1',
          amount: 50.00,
          type: 'expense',
          category: 'Food & Dining',
          merchant: 'Sample Restaurant'
        },
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Sample Transaction 2',
          amount: 25.00,
          type: 'expense',
          category: 'Transportation',
          merchant: 'Sample Gas Station'
        }
      ];

      return {
        success: true,
        transactions: mockTransactions,
        totalTransactions: mockTransactions.length,
        fileName: path.basename(filePath),
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to extract transactions from PDF: ${error.message}`);
    }
  }

  static async processBankStatement(filePath, userId, bankAccountId = null) {
    try {
      // Extract transactions from PDF
      const extractionResult = await this.extractTransactionsFromPDF(filePath, userId);
      
      if (!extractionResult.success) {
        throw new Error('Failed to extract transactions from PDF');
      }

      // TODO: Implement transaction categorization and saving
      // For now, just return the extracted data
      
      return {
        success: true,
        message: `Successfully processed ${extractionResult.totalTransactions} transactions`,
        data: extractionResult,
        bankAccountId
      };
    } catch (error) {
      throw error;
    }
  }

  static async categorizeTransactions(transactions) {
    // TODO: Implement AI-powered transaction categorization
    // For now, use simple keyword matching
    
    const categoryKeywords = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'meal', 'lunch', 'dinner', 'breakfast'],
      'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'parking', 'toll', 'metro', 'bus'],
      'Shopping': ['amazon', 'walmart', 'target', 'mall', 'store', 'shop', 'retail'],
      'Entertainment': ['netflix', 'spotify', 'movie', 'theater', 'concert', 'game', 'entertainment'],
      'Healthcare': ['pharmacy', 'doctor', 'hospital', 'medical', 'health', 'dental'],
      'Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'utility'],
      'Housing': ['rent', 'mortgage', 'home', 'apartment', 'housing']
    };

    return transactions.map(transaction => {
      const description = transaction.description.toLowerCase();
      const merchant = transaction.merchant.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => 
          description.includes(keyword) || merchant.includes(keyword)
        )) {
          return { ...transaction, category };
        }
      }
      
      return { ...transaction, category: 'Other' };
    });
  }

  static async saveTransactions(transactions, userId, bankAccountId = null) {
    try {
      // TODO: Implement actual transaction saving logic
      // This would involve:
      // 1. Categorizing transactions
      // 2. Checking for duplicates
      // 3. Saving to database
      // 4. Updating account balances
      
      const categorizedTransactions = await this.categorizeTransactions(transactions);
      
      // Mock save operation
      const savedTransactions = categorizedTransactions.map((transaction, index) => ({
        id: `temp-${Date.now()}-${index}`,
        ...transaction,
        user_id: userId,
        bank_account_id: bankAccountId,
        source: 'PDF Import',
        created_at: new Date().toISOString()
      }));

      return {
        success: true,
        savedCount: savedTransactions.length,
        transactions: savedTransactions
      };
    } catch (error) {
      throw new Error(`Failed to save transactions: ${error.message}`);
    }
  }

  static async cleanupFile(filePath) {
    try {
      await promisify(fs.unlink)(filePath);
    } catch (error) {
      console.error('Failed to cleanup file:', error);
    }
  }
} 