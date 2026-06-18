import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { api } from "../../api/client";
import { homePathForEmail } from "../../lib/roles";
import OtpInput from "../../components/admin/OtpInput";
import { AuthHeader, AuthFooter } from "../../components/admin/AuthChrome";

const EASE = [0.22, 1, 0.36, 1];
const deviceKey = (email) => `pfp_admin_verified_${email.toLowerCase()}`;

export default function AdminRegister() {
  const navigate = useNavigate();

  // step: "form" → "code"
  const [step, setStep] = useState("form");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Bumped on a wrong code to remount OtpInput (clears boxes + refocuses).
  const [attemptKey, setAttemptKey] = useState(0);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] font-normal text-[#1d1d1f] outline-none transition placeholder:font-light placeholder:text-gray-400 focus:border-[#1B4F8A] focus:ring-2 focus:ring-[#1B4F8A]/15";

  // Step 1 — validate the form, then email a verification code via our backend
  // (Resend). The Supabase account is NOT created until the code is verified.
  const handleSendCode = async (e) => {
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
      await api.post("/api/auth/request-otp", {
        email: email.trim(),
        purpose: "email_verify",
      });
      setStep("code");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify the emailed code, then create the Supabase account.
  // Requires Supabase email confirmation to be OFF so signUp returns a session.
  // Triggered automatically once all 6 digits are entered (see effect below).
  const verify = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/verify-otp", {
        email: email.trim(),
        code: code.trim(),
        purpose: "email_verify",
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Incorrect code — please try again.");
      setCode("");
      setAttemptKey((k) => k + 1); // remount OtpInput → clears boxes, refocuses
      return;
    }

    // Email is verified — now create the account.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          age: age ? Number(age) : null,
          gender: gender || null,
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      localStorage.setItem(deviceKey(email), "1");
      navigate(homePathForEmail(email), { replace: true });
      return;
    }
    // No session → Supabase "Confirm email" is still ON. Turn it off so this
    // Resend-verified flow can complete sign-in.
    setError("Account created, but Supabase email confirmation is enabled. Disable it to finish sign-in.");
  };

  // Auto-submit as soon as all 6 digits are present.
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
      await api.post("/api/auth/request-otp", {
        email: email.trim(),
        purpose: "email_verify",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
    }
  };

  const Spinner = () => (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );

  // Eye / eye-off icon for the show-hide password toggle.
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

  const passwordWrap = "relative";
  const eyeBtn =
    "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-[#1B4F8A]";

  return (
    <div className="admin-ui flex min-h-screen flex-col bg-white text-[#1d1d1f] antialiased">
      <AuthHeader delay={0.05} />

      <main
        className={`flex flex-1 justify-center px-6 ${
          step === "code" ? "items-center pb-16" : "items-start pt-14 pb-16"
        }`}
      >
        <motion.div
          className="w-full max-w-[440px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
        >
          {step === "form" ? (
            <>
              <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-700">
                Create your account
              </h1>
              <p className="mt-2 text-[15px] font-light text-gray-500">
                One account to manage products, portfolio, customers, and sales for
                Pokhrel Flex Printing.
              </p>

              <form onSubmit={handleSendCode} className="mt-8 space-y-3">
                {/* Username */}
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                />

                {/* First name, Last name */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Email address */}
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />

                {/* Age, Gender */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={inputClass}
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`${inputClass} ${gender ? "text-[#1d1d1f]" : "text-gray-400"}`}
                  >
                    <option value="" disabled>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>

                {/* Password, Confirm password (with show/hide) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={passwordWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className={eyeBtn}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <div className={passwordWrap}>
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
                      className={eyeBtn}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>

                <p className="pt-1 text-[12px] font-light leading-relaxed text-gray-400">
                  By creating an account you agree to our{" "}
                  <Link to="/terms" className="text-[#1B4F8A] hover:underline">Terms</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#1B4F8A] hover:underline">Privacy Policy</Link>.
                  We&apos;ll email you a code to verify your address.
                </p>

                {error && <p className="text-[13px] font-medium text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center rounded-xl bg-[#1B4F8A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#163f70] disabled:opacity-70"
                >
                  {loading ? <Spinner /> : "Continue"}
                </button>
              </form>

              <p className="mt-6 text-[14px] font-light text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="font-normal text-[#1B4F8A] hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.02em] text-gray-700">
                Verify your email
              </h1>
              <p className="mt-2 text-[15px] font-light text-gray-500">
                Enter the verification code we sent to{" "}
                <span className="font-normal text-[#1d1d1f]">{email}</span>.
              </p>

              <div className="mt-8 space-y-4">
                <OtpInput key={attemptKey} value={code} onChange={setCode} length={6} />
                {loading ? (
                  <div className="flex items-center justify-center gap-2 text-[14px] font-medium text-[#1B4F8A]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B4F8A] border-t-transparent" />
                    Verifying…
                  </div>
                ) : error ? (
                  <p className="text-[13px] font-medium text-red-500">{error}</p>
                ) : null}
              </div>

              <div className="mt-4 text-center text-[14px] font-normal">
                <button type="button" onClick={resendCode} className="text-[#1B4F8A] hover:underline">
                  Resend code
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <AuthFooter delay={0.2} />
    </div>
  );
}
