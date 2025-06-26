import dotenv from 'dotenv';
import { testConnection } from './src/utils/database.js';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
      console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
      process.exit(1);
    }

    console.log('✅ Environment variables found');
    console.log(`📡 Supabase URL: ${process.env.SUPABASE_URL.substring(0, 30)}...`);
    
    // Test the connection
    await testConnection();
    
    console.log('🎉 Supabase connection test successful!');
    console.log('🚀 Your backend is ready to use with Supabase');
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your Supabase project URL and API keys');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Run the database schema setup (database/schema.sql)');
    console.log('4. Check your .env file configuration');
    process.exit(1);
  }
}

testSupabaseConnection(); 