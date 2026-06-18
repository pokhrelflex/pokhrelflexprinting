import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

// User portal — what regular (non-admin) accounts see after signing in. Kept
// minimal for now; order history / saved details can grow here later.
export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const meta = user?.user_metadata || {};
  const name = meta.full_name || meta.username || (user?.email || "").split("@")[0];

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
            My Account
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
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          This is your Pokhrel Flex Printing account. Browse products and send an
          inquiry, and your order details will appear here.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Browse products", to: "/products" },
            { label: "Send an inquiry", to: "/contact" },
            { label: "Our portfolio", to: "/portfolio" },
          ].map(({ label, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#1B4F8A]/40 hover:shadow-sm"
            >
              <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
              <p className="mt-1 text-[12px] text-gray-400">Go →</p>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-[#1A1A1A]">Your details</p>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-gray-400">Name</dt>
              <dd className="text-[#1A1A1A]">{name || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-400">Email</dt>
              <dd className="text-[#1A1A1A]">{user?.email || "—"}</dd>
            </div>
            {meta.username && (
              <div className="flex gap-2">
                <dt className="text-gray-400">Username</dt>
                <dd className="text-[#1A1A1A]">{meta.username}</dd>
              </div>
            )}
          </dl>
        </div>
      </main>
    </div>
  );
}
