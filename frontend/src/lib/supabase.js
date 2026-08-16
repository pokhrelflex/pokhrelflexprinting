import { createClient } from "@supabase/supabase-js";

// Public (anon) Supabase client used only for admin authentication on the
// frontend. The anon key is safe to expose; row-level security and the
// backend service key protect the actual data.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const NOT_CONFIGURED = {
  message:
    "Authentication is not configured on this deployment (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
};

// createClient() throws synchronously when the URL is blank. Because this module
// is pulled in by AuthProvider — which wraps the whole app — that throw happens
// during module evaluation and takes the entire public site down with a blank
// #root. Never let a missing admin credential break the public pages: fall back
// to an inert client that mirrors the parts of the auth API we actually call and
// simply reports "signed out".
function createStubClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: async () => ({ data: null, error: NOT_CONFIGURED }),
      signUp: async () => ({ data: null, error: NOT_CONFIGURED }),
      signOut: async () => ({ error: null }),
    },
  };
}

if (!supabaseConfigured) {
  console.warn(
    "⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — admin login is disabled."
  );
}

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createStubClient();
