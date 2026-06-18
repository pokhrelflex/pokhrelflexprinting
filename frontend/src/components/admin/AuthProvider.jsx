import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../context/authContext";
import { isAdminEmail } from "../../lib/roles";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore any existing session on first load.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Keep state in sync with login / logout / token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    isAdmin: isAdminEmail(session?.user?.email),
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
