import bcrypt from 'bcryptjs';
import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class User {
  static async create(userData) {
    try {
      // Hash password
      const password_hash = await bcrypt.hash(userData.password, 12);
      const profileData = {
        email: userData.email,
        full_name: userData.full_name,
        password_hash,
        avatar_url: userData.avatar_url,
        currency: userData.currency || 'USD',
        timezone: userData.timezone || 'UTC',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const profile = await insertRow('users', profileData);
      return profile;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow('users', { id });
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      return await getRow('users', { email });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      updateData.updated_at = new Date().toISOString();
      return await updateRow('users', id, updateData);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await deleteRow('users', id);
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) throw new Error('Invalid credentials');
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) throw new Error('Invalid credentials');
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async getAll(options = {}) {
    try {
      return await getRows('users', {}, options);
    } catch (error) {
      throw error;
    }
  }
} 