// This file configures the connection to your Supabase database.

const SUPABASE_URL = 'https://jrgfbfxzrpzfscguicwi.supabase.co';

// IMPORTANT: This key is safe to expose in a browser if you have enabled
// Row Level Security (RLS) for your database tables.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZ2ZiZnh6cnB6ZnNjZ3VpY3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODUwNDEsImV4cCI6MjA4OTE2MTA0MX0.VTOenW3GEUaMML55NxB7TEXlpDfrx2YnQescbbR0WAk';

// The `supabase` global is created by the script tag in index.html
const { createClient } = supabase;

// Export the database client for other modules to use
export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);