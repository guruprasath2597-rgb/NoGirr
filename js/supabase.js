/* =============================================
   NoGirr — Supabase Client
   ============================================= */

const SUPABASE_URL = 'https://nsoektoadbhjocofgwni.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb2VrdG9hZGJoam9jb2Znd25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODk5ODUsImV4cCI6MjA5MDE2NTk4NX0.FljCXu7aWA7AbahZyNPrpRH2jq2BwnSwvxjz0GO_n7w';

// Initialize Supabase client (using global from CDN)
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.NOGIRR_DB = _sb;
