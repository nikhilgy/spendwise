const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SUPABASE_URL = 'https://mtifmxnnqzgfuiwdsejw.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aWZteG5ucXpnZnVpd2RzZWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjEyNDAsImV4cCI6MjA2NjQ5NzI0MH0.d5hq95GBYXWcdt_JN7RCh0jePVi0j9RArx9o7SIDKLs';

fetch(SUPABASE_URL, {
  headers: { apikey: SUPABASE_ANON_KEY }
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);