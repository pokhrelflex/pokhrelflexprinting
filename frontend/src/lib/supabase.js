import { createClient } from "@supabase/supabase-js";

// Public (anon) Supabase client used only for admin authentication on the
// frontend. The anon key is safe to expose; row-level security and the
// backend service key protect the actual data.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced in the console during dev so a missing .env is obvious.
  console.warn(
    "⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — admin login will not work."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
