const { createClient } = require('@supabase/supabase-js');

// Verifies the Supabase access token sent by the admin frontend.
// Attaches req.user on success; rejects with 401 otherwise.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Admin allow-list. Defaults to the two business admins; override with
// ADMIN_EMAILS (comma-separated). Only these accounts may reach /api/admin/*.
const DEFAULT_ADMINS = ['ersubodhpokhrel@gmail.com', 'pokhrelflex@gmail.com'];
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',')
  : DEFAULT_ADMINS
).map((e) => e.trim().toLowerCase()).filter(Boolean);

async function requireAdmin(req, res, next) {
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Auth is not configured on the server.' });
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing authentication token.' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }

  if (ADMIN_EMAILS.length && !ADMIN_EMAILS.includes((data.user.email || '').toLowerCase())) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  req.user = data.user;
  next();
}

module.exports = { requireAdmin };
