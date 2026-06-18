import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { api } from "../../api/client";
import OtpInput from "../../components/admin/OtpInput";
import { isAdminEmail, homePathForEmail } from "../../lib/roles";

const EASE = [0.22, 1, 0.36, 1];

// Company mark (same 3 paths as the intro logo).
const LOGO_PATHS = [
  "M1182.47 0C1200.04 19.54 1217.53 39.15 1235.18 58.61C1323.89 156.38 1412.62 254.15 1501.51 351.76C1505.67 356.33 1506.78 360.9 1506.78 366.68C1506.68 492.06 1506.71 617.45 1506.71 742.83C1506.71 972.56 1506.71 1202.29 1506.71 1432.03C1506.71 1435.63 1506.83 1439.24 1506.57 1442.82C1505.87 1452.74 1499.6 1459.2 1489.81 1460.19C1487.34 1460.44 1484.83 1460.4 1482.35 1460.4C1200.31 1460.4 918.26 1460.41 636.22 1460.4C619.23 1460.4 614.32 1455.66 614.31 1438.85C614.27 1330.63 614.29 1222.4 614.3 1114.18C614.3 1111.97 614.33 1109.74 614.62 1107.55C615.83 1098.22 621.23 1093.2 630.51 1092.77C633.55 1092.63 636.6 1092.71 639.64 1092.71C802.11 1092.71 964.59 1092.71 1127.06 1092.71H1137.5C1139.37 1086.04 1140.11 374 1138.47 359.22C1138.27 359.04 1138.07 358.85 1137.86 358.68C1137.65 358.5 1137.44 358.31 1137.2 358.19C1136.96 358.07 1136.67 358.02 1136.4 357.98C1135.86 357.89 1135.31 357.82 1134.76 357.75C1134.49 357.72 1134.21 357.71 1133.93 357.71C1133.38 357.7 1132.82 357.69 1132.27 357.68C1131.72 357.68 1131.16 357.68 1130.61 357.68C815.35 357.68 500.09 357.67 184.83 357.66C184.28 357.66 183.72 357.63 183.17 357.61C182.89 357.6 182.62 357.56 182.35 357.53C182.08 357.5 181.8 357.47 181.53 357.4C181.26 357.33 181.01 357.22 179.96 356.85C178.94 355.05 177.5 352.75 176.28 350.34C118.4 236.37 60.55 122.44 2.76 8.47C1.43 5.85 0.9 2.83 0 0C394.16 0 788.31 0 1182.47 0Z",
  "M562.17 426.8H174.92V1926.5H562.17V426.8Z",
  "M3012.8 351.69C2907.06 235.36 2801.41 118.95 2695.74 2.54C2695 1.72 2694.32 0.85 2693.61 0H1511.14C1512.03 2.57 1512.63 5.29 1513.86 7.7C1571.9 122.15 1630 236.57 1688.08 351C1695.71 357.8 1694.15 366.9 1694.15 375.57C1694.17 888.95 1694.17 1402.34 1694.15 1915.73C1694.15 1919.32 1693.94 1922.91 1693.83 1926.49H2062.52C2062.44 1923.72 2062.28 1920.97 2062.28 1918.2C2062.28 1769.34 2062.28 1620.49 2062.28 1471.64V1461.95C2068.82 1460.08 2638.95 1459.59 2650.13 1461.42C2650.25 1464.68 2650.48 1468.15 2650.48 1471.63C2650.5 1618.83 2650.5 1766.02 2650.48 1913.22C2650.48 1917.65 2650.45 1922.07 2650.43 1926.5H3018.43V649.08C3018.46 648.4 3018.47 647.72 3018.47 647.05C3018.49 553.22 3018.44 459.39 3018.61 365.56C3018.63 359.75 3016.51 355.78 3012.8 351.69ZM2650.49 1081.07V1092.41H2064.09C2063.55 1091.94 2063.33 1091.78 2063.14 1091.57C2062.97 1091.38 2062.76 1091.15 2062.72 1090.91C2062.55 1089.82 2062.3 1088.73 2062.3 1087.64C2062.3 845.49 2062.32 603.33 2062.37 361.18C2062.37 360.38 2062.73 359.59 2063.19 357.66H2074.38C2243.52 357.66 2412.66 357.6 2581.81 357.83L2647.34 480.44L2650.54 480.07C2650.43 481.1 2650.38 482.17 2650.38 483.3C2650.5 682.56 2650.49 881.82 2650.49 1081.07Z",
];

const BRAND = "#1B4F8A";
const deviceKey = (email) => `pfp_admin_verified_${email.toLowerCase()}`;

export default function AdminLogin() {
  const navigate = useNavigate();

  // step: "email" → "password" → "code"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");        // what the user typed (email OR username)
  const [loginEmail, setLoginEmail] = useState(""); // resolved email used for auth
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [attemptKey, setAttemptKey] = useState(0); // remount OtpInput on a wrong code
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // One-time check: if already signed in, go straight to the right portal. Runs
  // only on mount so it can't fire mid-flow (which would cause a bounce).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(homePathForEmail(data.session.user?.email), { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtitle =
    step === "code" ? "Enter the code we sent to your email" : "Manage your account";

  // Step 1 — email or username: only proceed if a matching account exists.
  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/check-email", { email: email.trim() });
      setLoading(false);
      if (data.exists) {
        setLoginEmail(data.email || email.trim()); // resolve username → email
        setStep("password");
      } else {
        setError("No account found for this email or username. Please register your ID.");
      }
    } catch (err) {
      setLoading(false);
      const status = err?.response?.status;
      if (status === 404) {
        setError("Login service unavailable (restart the backend server).");
      } else if (err?.code === "ERR_NETWORK") {
        setError("Can't reach the server. Is the backend running?");
      } else {
        setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
  };

  // Step 2 — verify password. First login on this device → send a Resend code.
  const handlePassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (authError) {
      setLoading(false);
      setError("Incorrect password. Please try again.");
      return;
    }

    // Admins, or a device already verified → straight to the right portal.
    if (isAdminEmail(loginEmail) || localStorage.getItem(deviceKey(loginEmail))) {
      setLoading(false);
      navigate(homePathForEmail(loginEmail), { replace: true });
      return;
    }

    // First time on this device → drop the session and require an emailed code.
    // The code must be verified before we re-establish the real session.
    await supabase.auth.signOut();
    try {
      await api.post("/api/auth/request-otp", { email: loginEmail, purpose: "login" });
      setLoading(false);
      setStep("code");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Couldn't send a verification code. Try again.");
    }
  };

  // Step 3 — verify the emailed code, then re-establish the session. Triggered
  // automatically once all 6 digits are entered (see effect below).
  const verify = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/verify-otp", { email: loginEmail, code: code.trim(), purpose: "login" });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Incorrect code — please try again.");
      setCode("");
      setAttemptKey((k) => k + 1);
      return;
    }

    // Code verified → sign in again (we still hold the password) to create the
    // real session, then remember this device.
    const { error: authError } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    setLoading(false);
    if (authError) {
      setError("Session error. Please sign in again.");
      setStep("password");
      return;
    }
    localStorage.setItem(deviceKey(loginEmail), "1");
    navigate(homePathForEmail(loginEmail), { replace: true });
  };

  // Auto-submit once all 6 digits are present.
  useEffect(() => {
    if (step === "code" && code.length === 6 && !loading) {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const resendCode = async () => {
    setError("");
    setCode("");
    setAttemptKey((k) => k + 1);
    try {
      await api.post("/api/auth/request-otp", { email: loginEmail, purpose: "login" });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
    }
  };

  const goBack = () => {
    setError("");
    if (step === "code") setStep("password");
    else if (step === "password") setStep("email");
  };

  const Spinner = () => (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );

  const EyeIcon = ({ open }) => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" strokeLinecap="round" />
          <path d="M10.6 6.1A10.8 10.8 0 0112 6c6.5 0 10 7 10 7a17.6 17.6 0 01-3.3 4M6.6 6.6A17.6 17.6 0 002 12s3.5 7 10 7a10.7 10.7 0 005-1.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] font-normal text-[#1d1d1f] outline-none transition placeholder:font-light placeholder:text-gray-400 focus:border-[#1B4F8A] focus:ring-2 focus:ring-[#1B4F8A]/15";

  const infoRow = (
    <div className="mt-6 flex flex-col items-start gap-2.5 text-left">
      <svg className="h-7 w-7 shrink-0 text-[#1B4F8A]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 11a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM3 19a5 5 0 0110 0v1H3v-1zm11 1v-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0121 19v1h-7z" />
      </svg>
      <p className="text-[13px] font-light leading-relaxed text-gray-500">
        Your Pokhrel Flex Printing admin account lets you securely manage products,
        portfolio, customers, and sales. The first time you sign in on a device, we
        send a verification code to your email.{" "}
        <Link to="/privacy" className="font-normal text-[#1B4F8A] hover:underline">
          See how your data is managed…
        </Link>
      </p>
    </div>
  );

  return (
    <div className="admin-ui flex min-h-screen flex-col bg-white text-[#1d1d1f] antialiased">
      {/* ── Top nav bar (logo only) ── */}
      <motion.header
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: EASE }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center" aria-label="Home">
            <svg viewBox="0 0 3019 1927" className="h-6 w-auto" aria-hidden="true">
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} fill={BRAND} />
              ))}
            </svg>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] font-light text-gray-600 sm:flex">
            <Link to="/login" className="text-[#1d1d1f]">Log in</Link>
            <Link to="/register" className="transition hover:text-[#1d1d1f]">Create your account</Link>
            <Link to="/faq" className="transition hover:text-[#1d1d1f]">Frequently asked questions</Link>
          </nav>
        </div>
      </motion.header>

      {/* ── Center content ── */}
      <main className="flex flex-1 items-start justify-center px-6 pt-12 pb-16">
        <div className="w-full max-w-[440px] text-center">
          {/* Animated blue glossy ring — intro: hold large & low (≈screen centre),
              then settle into place. */}
          <motion.div
            className="relative mx-auto mb-8 h-[160px] w-[160px]"
            initial={{ scale: 1.7, y: "190%" }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="pfpBlueRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cfe9fb" />
                  <stop offset="35%" stopColor="#5cb0ec" />
                  <stop offset="70%" stopColor="#1B7FC4" />
                  <stop offset="100%" stopColor="#0E5FA0" />
                </linearGradient>
                <filter id="pfpSoft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" />
                </filter>
              </defs>

              {/* soft outer glow */}
              <circle
                cx="100" cy="100" r="74" fill="none"
                stroke="url(#pfpBlueRing)" strokeWidth="24" opacity="0.30"
                filter="url(#pfpSoft)"
              />

              {/* main swirling ribbon */}
              <circle
                className="admin-ring"
                cx="100" cy="100" r="74" fill="none"
                stroke="url(#pfpBlueRing)" strokeWidth="13" strokeLinecap="round"
                strokeDasharray="345 120"
                style={{ animation: "admin-ring-spin 16s linear infinite" }}
              />

              {/* inner offset arc (counter-rotating) */}
              <circle
                className="admin-ring"
                cx="100" cy="100" r="63" fill="none"
                stroke="url(#pfpBlueRing)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray="230 180" opacity="0.85"
                style={{ animation: "admin-ring-spin-rev 22s linear infinite" }}
              />

              {/* glossy highlight */}
              <circle
                className="admin-ring"
                cx="100" cy="100" r="74" fill="none"
                stroke="#ffffff" strokeWidth="3" strokeLinecap="round"
                strokeDasharray="60 392" opacity="0.7"
                style={{ animation: "admin-ring-spin 16s linear infinite" }}
              />
            </svg>

            {/* Centered logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 3019 1927" className="h-[34px] w-auto" aria-hidden="true">
                {LOGO_PATHS.map((d, i) => (
                  <path key={i} d={d} fill={BRAND} />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Everything below the ring slides in after it settles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.55, ease: EASE }}
          >
          <p className="text-[26px] font-semibold text-gray-700">{subtitle}</p>

          {/* On the code step, show the actual email the code was sent to
              (important when the user signed in with a username). */}
          {step === "code" && (
            <p className="mt-1.5 text-[14px] font-normal text-[#1d1d1f]">{loginEmail}</p>
          )}

          {/* ── Step 1: email ── */}
          {step === "email" && (
            <form onSubmit={handleEmail} className="mx-auto mt-8 max-w-[400px] text-left">
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              {error && <p className="mt-3 text-[13px] font-medium text-red-500">{error}</p>}

              {/* Info paragraph */}
              {infoRow}

              {/* Continue + Create account */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center rounded-xl bg-[#1B4F8A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#163f70] disabled:opacity-70"
                >
                  {loading ? <Spinner /> : "Continue"}
                </button>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-black py-3 text-[14px] font-semibold text-white transition hover:bg-gray-900"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" />
                  </svg>
                  Create account
                </Link>
              </div>
            </form>
          )}

          {/* ── Step 2: password ── */}
          {step === "password" && (
            <form onSubmit={handlePassword} className="mx-auto mt-8 max-w-[400px] text-left">
              {/* Combined email + password field group */}
              <div className="overflow-hidden rounded-xl border border-gray-300">
                <button
                  type="button"
                  onClick={goBack}
                  className="block w-full border-b border-gray-200 bg-[#FFFCEC] px-4 py-2.5 text-left"
                >
                  <span className="block text-[11px] font-light text-gray-500">
                    Email or Username
                  </span>
                  <span className="block text-[15px] font-normal text-[#1d1d1f]">{email}</span>
                </button>
                <div className="relative bg-white">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white px-4 py-3 pr-11 text-[15px] font-normal text-[#1d1d1f] outline-none placeholder:font-light placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-[#1B4F8A]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Remember me + forgot password */}
              <div className="mt-3 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-[14px] font-normal text-[#1d1d1f]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 accent-[#1B4F8A]"
                  />
                  Remember me
                </label>
                <Link
                  to="/reset"
                  className="inline-flex items-center gap-0.5 text-[14px] font-normal text-[#1B4F8A] hover:underline"
                >
                  Forgotten your password? <span aria-hidden="true">↗</span>
                </Link>
              </div>

              {error && <p className="mt-3 text-[13px] font-medium text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#1B4F8A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#163f70] disabled:opacity-70"
              >
                {loading ? <Spinner /> : "Continue"}
              </button>
            </form>
          )}

          {/* ── Step 3: verification code ── */}
          {step === "code" && (
            <div className="mx-auto mt-8 max-w-[400px]">
              <OtpInput key={attemptKey} value={code} onChange={setCode} length={6} />
              {loading ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-[14px] font-medium text-[#1B4F8A]">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B4F8A] border-t-transparent" />
                  Verifying…
                </div>
              ) : error ? (
                <p className="mt-4 text-center text-[13px] font-medium text-red-500">{error}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-between text-[14px] font-normal">
                <button type="button" onClick={goBack} className="text-[#1B4F8A] hover:underline">
                  ← Back
                </button>
                <button type="button" onClick={resendCode} className="text-[#1B4F8A] hover:underline">
                  Resend code
                </button>
              </div>
            </div>
          )}
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <motion.footer
        className="border-t border-gray-200 bg-[#f5f5f7]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.75, duration: 0.5, ease: EASE }}
      >
        <div className="mx-auto max-w-6xl px-6 py-5 text-[12px] font-light text-gray-500">
          <p>
            More ways to order:{" "}
            <Link to="/contact" className="text-[#1B4F8A] hover:underline">Visit our store</Link>{" "}
            or call +977 9846306222.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>Copyright © 2026 Pokhrel Flex Printing. All rights reserved.</span>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">terms of use</Link>
            <Link to="/support" className="hover:underline">Support</Link>
            <Link to="/faq" className="hover:underline">FAQ</Link>
            <span className="ml-auto">Nepal</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
