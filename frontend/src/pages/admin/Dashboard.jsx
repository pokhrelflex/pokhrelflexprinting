import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

// Placeholder dashboard — step 1 only proves auth + protected routing works.
// Products / Portfolio / Customers / Sales screens come in later steps.
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-ui min-h-screen bg-[#F2F0EC] antialiased">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4F8A]">
            <span className="text-[11px] font-semibold text-white">PFP</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-[13px] text-gray-500 sm:inline">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A] transition hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          You're signed in. Product, portfolio, customer &amp; sales management
          will appear here in the next steps.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["Products", "Portfolio", "Customers", "Sales"].map((label) => (
            <div
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
              <p className="mt-1 text-[12px] text-gray-400">Coming soon</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
