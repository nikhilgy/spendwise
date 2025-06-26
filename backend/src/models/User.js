import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin, getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class User {
  static async create(userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12);
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          avatar_url: userData.avatar_url
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Create user profile in database
      const profileData = {
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
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
      // Delete from Supabase Auth
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) {
        throw new Error(authError.message);
      }

      // Delete profile from database
      return await deleteRow('users', id);
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
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