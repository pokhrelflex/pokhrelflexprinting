import { createClient } from "@supabase/supabase-js";

// Public (anon) Supabase client used only for admin authentication on the
// frontend. The anon key is safe to expose; row-level security and the
// backend service key protect the actual data.

const NOT_CONFIGURED = {
  message:
    "Authentication is not configured on this deployment (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
};

// Env values typed into a hosting dashboard routinely pick up wrapping quotes,
// stray whitespace, or — when a multi-line block is pasted into a single value
// field — a whole second variable glued onto the end. Chromium's URL parser
// silently percent-encodes that junk into the hostname, so a broken value looks
// fine on Android/desktop Chrome while WebKit (every browser on iOS, plus
// desktop Safari) rejects it, `createClient` throws during module evaluation,
// React never mounts, and the entire public site is a blank #root on iPhones.
// Keep only the first whitespace-delimited token and re-validate it here so all
// engines agree on the result.
function normalizeUrl(raw) {
  if (typeof raw !== "string") return null;
  const token = raw.trim().replace(/^["']|["']$/g, "").split(/\s+/)[0];
  if (!token) return null;
  try {
    const url = new URL(token);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

function normalizeKey(raw) {
  if (typeof raw !== "string") return null;
  // A JWT never contains whitespace, so trimming is always safe.
  const token = raw.trim().replace(/^["']|["']$/g, "").split(/\s+/)[0];
  return token || null;
}

const supabaseUrl = normalizeUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = normalizeKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

// An inert client mirroring the parts of the auth API we actually call. It
// reports "signed out" for everything, so the admin pages degrade to a clear
// error instead of crashing and the public pages are untouched.
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

function createSafeClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing or malformed — admin login is disabled."
    );
    return { client: createStubClient(), ok: false };
  }

  // Belt and braces: never let anything createClient() throws escape this
  // module and blank the site.
  try {
    return {
      client: createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }),
      ok: true,
    };
  } catch (err) {
    console.error(
      "⚠️ Supabase client could not be created — admin login is disabled.",
      err
    );
    return { client: createStubClient(), ok: false };
  }
}

const { client, ok } = createSafeClient();

export const supabaseConfigured = ok;
export const supabase = client;
