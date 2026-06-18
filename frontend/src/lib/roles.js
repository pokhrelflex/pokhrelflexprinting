// The only two accounts treated as admins. Everyone else who registers is a
// regular user (routed to the user portal, not the admin dashboard).
export const ADMIN_EMAILS = [
  "ersubodhpokhrel@gmail.com",
  "pokhrelflex@gmail.com",
];

export const isAdminEmail = (email) =>
  !!email && ADMIN_EMAILS.includes(String(email).trim().toLowerCase());

// Where a signed-in account should land based on its role.
export const homePathForEmail = (email) => (isAdminEmail(email) ? "/admin" : "/portal");
