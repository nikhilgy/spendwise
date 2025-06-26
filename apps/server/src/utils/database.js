import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// In development, allow placeholder values for testing
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  (!isDevelopment || (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder_anon_key'));

let supabase;
let supabaseAdmin;

if (!hasValidConfig) {
  if (isDevelopment) {
    console.warn('⚠️  Using placeholder Supabase configuration for development');
    // Create mock clients for development
    const mockClient = {
      from: () => ({
        select: () => ({ limit: () => ({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) })
      })
    };
    supabase = mockClient;
    supabaseAdmin = mockClient;
  } else {
    throw new Error('Missing Supabase environment variables');
  }
} else {
  // Client for user operations (uses anon key)
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Admin client for server-side operations (uses service role key)
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { supabase, supabaseAdmin };

// Test the connection
export const testConnection = async () => {
  try {
    if (!hasValidConfig) {
      console.log('🔌 Using mock database connection for development');
      return true;
    }
    
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection error:', error);
      throw error;
    }
    console.log('🔌 Connected to Supabase database');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    throw error;
  }
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('❌ Supabase error:', error);
  if (error.code === 'PGRST116') {
    return { error: 'Record not found' };
  }
  if (error.code === '23505') {
    return { error: 'Duplicate entry' };
  }
  return { error: error.message || 'Database error' };
};

// Helper function to get a single row
export const getRow = async (table, filters = {}) => {
  try {
    let query = supabase.from(table).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
};

// Helper function to get multiple rows
export const getRows = async (table, filters = {}, options = {}) => {
  try {
    let query = supabase.from(table).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending !== false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
};

// Helper function to insert a row
export const insertRow = async (table, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return result;
  } catch (error) {
    throw handleSupabaseError(error);
  }
};

// Helper function to update a row
export const updateRow = async (table, id, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return result;
  } catch (error) {
    throw handleSupabaseError(error);
  }
};

// Helper function to delete a row
export const deleteRow = async (table, id) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}; 