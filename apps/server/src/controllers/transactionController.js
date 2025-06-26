import { Transaction } from '../models/Transaction.js';
import { Category } from '../models/Category.js';

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { amount, description, category_id, type, date, tags } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!amount || !description || !category_id || !type) {
      return res.status(400).json({
        error: 'Amount, description, category_id, and type are required'
      });
    }

    // Validate category belongs to user
    const category = await Category.findById(category_id);
    if (!category || category.user_id !== userId) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const transactionData = {
      user_id: userId,
      amount: parseFloat(amount),
      description,
      category_id,
      type,
      date: date || new Date().toISOString(),
      tags: tags || []
    };

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      error: 'Failed to create transaction',
      details: error.message
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      category_id, 
      start_date, 
      end_date,
      search 
    } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const options = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { column: 'date', ascending: false }
    };

    const filters = {};
    if (type) filters.type = type;
    if (category_id) filters.category_id = category_id;
    if (start_date) filters.startDate = start_date;
    if (end_date) filters.endDate = end_date;

    let transactions;
    if (search) {
      transactions = await Transaction.search(userId, search, options);
    } else {
      transactions = await Transaction.findByUserId(userId, { ...filters, ...options });
    }

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: transactions.length
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to get transactions',
      details: error.message
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({
      transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      error: 'Failed to get transaction',
      details: error.message
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;
    const { amount, description, category_id, type, date, tags } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await Transaction.findById(id);
    if (!existingTransaction) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    if (existingTransaction.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Validate category if provided
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category || category.user_id !== userId) {
        return res.status(400).json({
          error: 'Invalid category'
        });
      }
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description) updateData.description = description;
    if (category_id) updateData.category_id = category_id;
    if (type) updateData.type = type;
    if (date) updateData.date = date;
    if (tags) updateData.tags = tags;

    const transaction = await Transaction.update(id, updateData);

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      error: 'Failed to update transaction',
      details: error.message
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await Transaction.findById(id);
    if (!existingTransaction) {
      return res.status(404).json({
        error: 'Transaction not found'
      });
    }

    if (existingTransaction.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await Transaction.delete(id);

    res.json({
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Failed to delete transaction',
      details: error.message
    });
  }
};

export const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { period = 'month' } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const stats = await Transaction.getStats(userId, period);

    res.json({
      stats,
      period
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      error: 'Failed to get transaction stats',
      details: error.message
    });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { limit = 5 } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const transactions = await Transaction.findByUserId(userId, {
      limit: parseInt(limit),
      orderBy: { column: 'date', ascending: false }
    });

    res.json({
      transactions
    });
  } catch (error) {
    console.error('Get recent transactions error:', error);
    res.status(500).json({
      error: 'Failed to get recent transactions',
      details: error.message
    });
  }
};

export const importTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { transactions, source, categoryMapping } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        error: 'Transactions array is required and must not be empty'
      });
    }

    const results = {
      success: [],
      errors: [],
      total: transactions.length
    };

    // Process each transaction
    for (const txData of transactions) {
      try {
        // Validate required fields
        if (!txData.amount || !txData.description || !txData.type) {
          results.errors.push({
            transaction: txData,
            error: 'Missing required fields: amount, description, or type'
          });
          continue;
        }

        // Map category if provided
        let categoryId = txData.category_id;
        if (categoryMapping && txData.merchant) {
          const mappedCategory = categoryMapping.find(m => 
            txData.merchant.toLowerCase().includes(m.keyword.toLowerCase())
          );
          if (mappedCategory) {
            categoryId = mappedCategory.category_id;
          }
        }

        // If no category is mapped, use default or create one
        if (!categoryId) {
          // Try to find a default category for this type
          const defaultCategory = await Category.findByUserIdAndName(userId, 'Uncategorized');
          categoryId = defaultCategory?.id;
        }

        const transactionData = {
          user_id: userId,
          amount: parseFloat(txData.amount),
          description: txData.description,
          merchant: txData.merchant || txData.description,
          category_id: categoryId,
          type: txData.type,
          date: txData.date || new Date().toISOString(),
          source: source || 'Import',
          tags: txData.tags || []
        };

        const transaction = await Transaction.create(transactionData);
        results.success.push(transaction);

      } catch (error) {
        results.errors.push({
          transaction: txData,
          error: error.message
        });
      }
    }

    res.status(200).json({
      message: `Import completed. ${results.success.length} successful, ${results.errors.length} failed`,
      results
    });

  } catch (error) {
    console.error('Import transactions error:', error);
    res.status(500).json({
      error: 'Failed to import transactions',
      details: error.message
    });
  }
};

export const parseCSVTransactions = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({
        error: 'CSV data is required'
      });
    }

    // Simple CSV parsing (you might want to use a library like papaparse)
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const transaction = {};

      headers.forEach((header, index) => {
        if (values[index]) {
          switch (header) {
            case 'date':
              transaction.date = values[index];
              break;
            case 'description':
            case 'merchant':
              transaction.description = values[index];
              transaction.merchant = values[index];
              break;
            case 'amount':
              transaction.amount = parseFloat(values[index]);
              break;
            case 'type':
              transaction.type = values[index].toLowerCase();
              break;
            case 'category':
              transaction.category = values[index];
              break;
          }
        }
      });

      if (transaction.amount && transaction.description) {
        transactions.push(transaction);
      }
    }

    res.json({
      transactions,
      preview: transactions.slice(0, 5) // Show first 5 as preview
    });

  } catch (error) {
    console.error('Parse CSV error:', error);
    res.status(500).json({
      error: 'Failed to parse CSV',
      details: error.message
    });
  }
}; 