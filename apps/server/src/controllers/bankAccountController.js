import { BankAccount } from '../models/BankAccount.js';

export class BankAccountController {
  static async create(req, res) {
    try {
      const { name, bank_name, account_number, account_type, current_balance } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!name || !bank_name || !account_type) {
        return res.status(400).json({
          success: false,
          message: 'Name, bank name, and account type are required'
        });
      }

      // Validate account type
      if (!['savings', 'checking'].includes(account_type)) {
        return res.status(400).json({
          success: false,
          message: 'Account type must be either "savings" or "checking"'
        });
      }

      const bankAccountData = {
        user_id: userId,
        name,
        bank_name,
        account_number: account_number || null,
        account_type,
        current_balance: current_balance || 0,
        is_active: true
      };

      const bankAccount = await BankAccount.create(bankAccountData);

      res.status(201).json({
        success: true,
        message: 'Bank account created successfully',
        data: bankAccount
      });
    } catch (error) {
      console.error('Error creating bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create bank account',
        error: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const userId = req.user.id;
      const { account_type, is_active, limit, offset } = req.query;

      const options = {};
      if (account_type) options.accountType = account_type;
      if (is_active !== undefined) options.isActive = is_active === 'true';
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      const bankAccounts = await BankAccount.findByUserId(userId, options);

      res.json({
        success: true,
        data: bankAccounts,
        count: bankAccounts.length
      });
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bank accounts',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const bankAccount = await BankAccount.findById(id);

      if (!bankAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      // Check if the bank account belongs to the user
      if (bankAccount.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: bankAccount
      });
    } catch (error) {
      console.error('Error fetching bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bank account',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Check if bank account exists and belongs to user
      const existingAccount = await BankAccount.findById(id);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      if (existingAccount.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Validate account type if provided
      if (updateData.account_type && !['savings', 'checking'].includes(updateData.account_type)) {
        return res.status(400).json({
          success: false,
          message: 'Account type must be either "savings" or "checking"'
        });
      }

      const updatedAccount = await BankAccount.update(id, updateData);

      res.json({
        success: true,
        message: 'Bank account updated successfully',
        data: updatedAccount
      });
    } catch (error) {
      console.error('Error updating bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update bank account',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if bank account exists and belongs to user
      const existingAccount = await BankAccount.findById(id);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      if (existingAccount.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await BankAccount.delete(id);

      res.json({
        success: true,
        message: 'Bank account deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete bank account',
        error: error.message
      });
    }
  }

  static async getStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await BankAccount.getStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching bank account stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bank account stats',
        error: error.message
      });
    }
  }

  static async updateBalance(req, res) {
    try {
      const { id } = req.params;
      const { balance } = req.body;
      const userId = req.user.id;

      if (typeof balance !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Balance must be a number'
        });
      }

      // Check if bank account exists and belongs to user
      const existingAccount = await BankAccount.findById(id);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      if (existingAccount.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const updatedAccount = await BankAccount.updateBalance(id, balance);

      res.json({
        success: true,
        message: 'Balance updated successfully',
        data: updatedAccount
      });
    } catch (error) {
      console.error('Error updating balance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update balance',
        error: error.message
      });
    }
  }
} 