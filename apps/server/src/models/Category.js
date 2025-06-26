import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class Category {
  static async create(categoryData) {
    try {
      const data = {
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return await insertRow('categories', data);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow('categories', { id });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, options = {}) {
    try {
      return await getRows('categories', { user_id: userId }, {
        orderBy: { column: 'name', ascending: true },
        ...options
      });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      updateData.updated_at = new Date().toISOString();
      return await updateRow('categories', id, updateData);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await deleteRow('categories', id);
    } catch (error) {
      throw error;
    }
  }

  static async getAll(options = {}) {
    try {
      return await getRows('categories', {}, {
        orderBy: { column: 'name', ascending: true },
        ...options
      });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserIdAndName(userId, name) {
    try {
      const categories = await getRows('categories', { 
        user_id: userId, 
        name: name 
      });
      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async getDefaultCategories() {
    return [
      { name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
      { name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
      { name: 'Shopping', icon: '🛍️', color: '#45B7D1', type: 'expense' },
      { name: 'Entertainment', icon: '🎬', color: '#96CEB4', type: 'expense' },
      { name: 'Healthcare', icon: '🏥', color: '#FFEAA7', type: 'expense' },
      { name: 'Education', icon: '📚', color: '#DDA0DD', type: 'expense' },
      { name: 'Utilities', icon: '⚡', color: '#FFB347', type: 'expense' },
      { name: 'Housing', icon: '🏠', color: '#87CEEB', type: 'expense' },
      { name: 'Salary', icon: '💰', color: '#98FB98', type: 'income' },
      { name: 'Freelance', icon: '💼', color: '#F0E68C', type: 'income' },
      { name: 'Investment', icon: '📈', color: '#20B2AA', type: 'income' },
      { name: 'Gifts', icon: '🎁', color: '#FF69B4', type: 'income' }
    ];
  }
} 