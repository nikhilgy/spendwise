import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class Transaction {
  static async create(transactionData) {
    try {
      const data = {
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return await insertRow('transactions', data);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow('transactions', { id });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, options = {}) {
    try {
      const filters = { user_id: userId };
      
      // Add date range filters if provided
      if (options.startDate) {
        filters.date = { gte: options.startDate };
      }
      if (options.endDate) {
        filters.date = { ...filters.date, lte: options.endDate };
      }
      if (options.categoryId) {
        filters.category_id = options.categoryId;
      }
      if (options.cardId) {
        filters.card_id = options.cardId;
      }
      if (options.type) {
        filters.type = options.type;
      }

      return await getRows('transactions', filters, {
        orderBy: { column: 'date', ascending: false },
        limit: options.limit || 50,
        offset: options.offset || 0,
        ...options
      });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      updateData.updated_at = new Date().toISOString();
      return await updateRow('transactions', id, updateData);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await deleteRow('transactions', id);
    } catch (error) {
      throw error;
    }
  }

  static async getStats(userId, period = 'month') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const transactions = await this.findByUserId(userId, {
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      });

      const stats = {
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        transactionCount: transactions.length,
        categoryBreakdown: {}
      };

      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        
        if (transaction.type === 'income') {
          stats.totalIncome += amount;
        } else {
          stats.totalExpense += amount;
        }

        // Category breakdown
        if (!stats.categoryBreakdown[transaction.category_id]) {
          stats.categoryBreakdown[transaction.category_id] = {
            total: 0,
            count: 0
          };
        }
        stats.categoryBreakdown[transaction.category_id].total += amount;
        stats.categoryBreakdown[transaction.category_id].count += 1;
      });

      stats.netAmount = stats.totalIncome - stats.totalExpense;

      return stats;
    } catch (error) {
      throw error;
    }
  }

  static async getRecentTransactions(userId, limit = 10) {
    try {
      return await this.findByUserId(userId, { limit });
    } catch (error) {
      throw error;
    }
  }

  static async search(userId, searchTerm, options = {}) {
    try {
      // This would need to be implemented with Supabase's full-text search
      // For now, we'll do a simple filter
      const transactions = await this.findByUserId(userId, options);
      
      return transactions.filter(transaction => 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount?.toString().includes(searchTerm)
      );
    } catch (error) {
      throw error;
    }
  }
} 