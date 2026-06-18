import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { isAdminEmail } from "../../lib/roles";

// Guards portal pages. Checks the session authoritatively via getSession() on
// mount (and stays in sync via onAuthStateChange) so it never bounces to the
// login page on a stale/just-set session right after signing in.
//
// Pass `requireAdmin` to restrict a route to the two admin accounts; a signed-in
// non-admin hitting an admin route is sent to the user portal instead of login.
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [status, setStatus] = useState("checking"); // "checking" | "in" | "out"
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setEmail(data.session?.user?.email ?? null);
      setStatus(data.session ? "in" : "out");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setEmail(session?.user?.email ?? null);
      setStatus(session ? "in" : "out");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1B4F8A] border-t-transparent" />
      </div>
    );
  }

  if (status === "out") return <Navigate to="/login" replace />;

  // Signed in but not an admin trying to reach an admin-only route → user portal.
  if (requireAdmin && !isAdminEmail(email)) return <Navigate to="/portal" replace />;

  return children;
}
