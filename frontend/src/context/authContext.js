import { createContext, useContext } from "react";

// session  → the current Supabase session (null when logged out)
// user     → convenience accessor for session.user
// isAdmin  → true when the signed-in email is one of the two admins
// loading  → true while the initial session is being restored
// signOut  → logs the account out
export const AuthContext = createContext({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
