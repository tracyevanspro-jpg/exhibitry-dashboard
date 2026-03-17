// ==========================================
// 1. CONFIGURATION & INITIALIZATION
// ==========================================

// Use import.meta.env for Vite-based environment variables.
// These are populated from .env (local) or Cloudflare Dashboard (production).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

// The global supabase object is loaded via CDN in index.html
const { createClient } = window.supabase;
export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
