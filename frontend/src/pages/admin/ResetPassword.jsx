import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../api/client";
import OtpInput from "../../components/admin/OtpInput";
import { AuthHeader, AuthFooter } from "../../components/admin/AuthChrome";

const EASE = [0.22, 1, 0.36, 1];

export default function ResetPassword() {
  const navigate = useNavigate();

  // step: "email" → "code" → "newpass"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailOk, setEmailOk] = useState(false); // account exists → unlock Send
  const [checking, setChecking] = useState(false);
  const [code, setCode] = useState("");
  const [attemptKey, setAttemptKey] = useState(0); // remount OtpInput on a wrong code
  const [resetToken, setResetToken] = useState(""); // JWT from verify-otp
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] font-normal text-[#1d1d1f] outline-none transition placeholder:font-light placeholder:text-gray-400 focus:border-[#1B4F8A] focus:ring-2 focus:ring-[#1B4F8A]/15";

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

  // Check that an account exists → unlocks the Send button.
  const checkEmail = async () => {
    setError("");
    setEmailOk(false);
    if (!email.trim()) return;
    setChecking(true);
    try {
      const { data } = await api.post("/api/auth/check-email", { email: email.trim() });
      setEmailOk(data.exists);
      if (!data.exists) setError("No account found for this email.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  // Send the recovery code via Resend.
  const handleSend = async (e) => {
    e.preventDefault();
    if (!emailOk) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/request-otp", { email: email.trim(), purpose: "reset" });
      setLoading(false);
      setStep("code");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Couldn't send the code. Please try again.");
    }
  };

  // Verify the recovery code → keep the returned JWT to authorize the reset.
  // Triggered automatically once all 6 digits are entered (see effect below).
  const verify = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", {
        email: email.trim(),
        code: code.trim(),
        purpose: "reset",
      });
      setLoading(false);
      setResetToken(data.verificationToken || "");
      setStep("newpass");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Incorrect code — please try again.");
      setCode("");
      setAttemptKey((k) => k + 1);
    }
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
      await api.post("/api/auth/request-otp", { email: email.trim(), purpose: "reset" });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
    }
  };

  // Set the new password via the backend (no session — uses the reset JWT).
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        email: email.trim(),
        token: resetToken,
        password,
      });
      setLoading(false);
      navigate("/login", { replace: true });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Couldn't update the password. Please try again.");
    }
  };

  const subtitle =
    step === "email"
      ? "Enter your email to reset your password."
      : step === "code"
      ? `Enter the code we sent to ${email}.`
      : "Choose a new password for your account.";

  return (
    <div className="admin-ui flex min-h-screen flex-col bg-white text-[#1d1d1f] antialiased">
      <AuthHeader delay={0.05} />

      <main className="flex flex-1 items-start justify-center px-6 pt-14 pb-16">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
        >
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-700">
            Reset password
          </h1>
          <p className="mt-2 text-[15px] font-light text-gray-500">{subtitle}</p>

          {/* ── Step 1: email ── */}
          {step === "email" && (
            <form onSubmit={handleSend} className="mt-8 space-y-3">
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailOk(false);
                }}
                onBlur={checkEmail}
                className={inputClass}
              />
              {error && <p className="text-[13px] font-medium text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={!emailOk || loading || checking}
                className="flex w-full items-center justify-center rounded-xl bg-[#1B4F8A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#163f70] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading || checking ? <Spinner /> : "Send code"}
              </button>
              <Link
                to="/login"
                className="block pt-1 text-center text-[14px] font-normal text-[#1B4F8A] hover:underline"
              >
                ← Back to log in
              </Link>
            </form>
          )}

          {/* ── Step 2: code ── */}
          {step === "code" && (
            <div className="mt-8">
              <OtpInput key={attemptKey} value={code} onChange={setCode} length={6} />
              {loading ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-[14px] font-medium text-[#1B4F8A]">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B4F8A] border-t-transparent" />
                  Verifying…
                </div>
              ) : error ? (
                <p className="mt-4 text-center text-[13px] font-medium text-red-500">{error}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-center gap-6 text-[14px] font-normal">
                <button type="button" onClick={() => setStep("email")} className="text-[#1B4F8A] hover:underline">
                  ← Back
                </button>
                <button type="button" onClick={resendCode} className="text-[#1B4F8A] hover:underline">
                  Resend code
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: new password ── */}
          {step === "newpass" && (
            <form onSubmit={handleUpdate} className="mt-8 space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  autoComplete="new-password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
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
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-[#1B4F8A]"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {error && <p className="text-[13px] font-medium text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#1B4F8A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#163f70] disabled:opacity-70"
              >
                {loading ? <Spinner /> : "Update password"}
              </button>
            </form>
          )}
        </motion.div>
      </main>

      <AuthFooter delay={0.2} />
    </div>
  );
}
