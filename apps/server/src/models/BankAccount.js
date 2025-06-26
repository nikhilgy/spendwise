import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class BankAccount {
  static async create(bankAccountData) {
    try {
      const data = {
        ...bankAccountData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return await insertRow('bank_accounts', data);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow('bank_accounts', { id });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, options = {}) {
    try {
      const filters = { user_id: userId };
      
      if (options.accountType) {
        filters.account_type = options.accountType;
      }
      if (options.isActive !== undefined) {
        filters.is_active = options.isActive;
      }

      return await getRows('bank_accounts', filters, {
        orderBy: { column: 'created_at', ascending: false },
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
      const data = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      return await updateRow('bank_accounts', id, data);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await deleteRow('bank_accounts', id);
    } catch (error) {
      throw error;
    }
  }

  static async getStats(userId) {
    try {
      const accounts = await this.findByUserId(userId, { isActive: true });
      
      const stats = {
        totalAccounts: accounts.length,
        savingsAccounts: accounts.filter(account => account.account_type === 'savings').length,
        checkingAccounts: accounts.filter(account => account.account_type === 'checking').length,
        banks: [...new Set(accounts.map(account => account.bank_name))],
        totalBalance: accounts.reduce((sum, account) => sum + (account.current_balance || 0), 0)
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  static async updateBalance(id, newBalance) {
    try {
      return await this.update(id, { current_balance: newBalance });
    } catch (error) {
      throw error;
    }
  }

  static async getAccountWithTransactions(id) {
    try {
      const account = await this.findById(id);
      if (!account) return null;

      // TODO: Add transaction fetching logic when transaction model is ready
      // const transactions = await Transaction.findByAccountId(id);
      
      return {
        ...account,
        transactions: [] // Placeholder for now
      };
    } catch (error) {
      throw error;
    }
  }
} 