import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const newsletterApiUrl = import.meta.env.PROD
  ? "/api/forms/newsletter"
  : "http://localhost:5300/api/forms/newsletter";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");
  const [subscribeError, setSubscribeError] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus("");
    setSubscribeError("");
    setIsSubscribing(true);
    try {
      await axios.post(newsletterApiUrl, { email });
      setEmail("");
      setSubscribeStatus("Thank you for subscribing.");
    } catch (err) {
      setSubscribeError(err.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 pb-6">

        {/* ── Top row: tagline + newsletter ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-8 sm:pb-12">
          <h2 className="premium-font-galdgderbold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight shrink-0">
            <span className="block">Print With</span>
            <span className="block">Confidence.</span>
          </h2>

          <div className="flex flex-col items-start w-full sm:w-auto">
            <p className="text-sm font-semibold text-white mb-3">Get In Touch!</p>
            <form onSubmit={handleSubscribe} className="flex items-center overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm w-full sm:w-80">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-3 text-xs text-white outline-none placeholder:text-white/30 min-w-0"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="shrink-0 bg-[#F5A623] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#F5A623]/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubscribing ? "Sending..." : "Subscribe"}
              </button>
            </form>
            {subscribeStatus && <p className="mt-2 text-xs text-white/70">{subscribeStatus}</p>}
            {subscribeError && <p className="mt-2 text-xs text-red-300">{subscribeError}</p>}
          </div>
        </div>

        {/* ── Middle row: 4 columns ── */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:flex-row sm:flex-wrap sm:justify-between pb-10 border-b border-white/10">

          {/* Contact Information */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Contact Information</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-white/60">
                <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:pokhrelflexprinting@gmail.com" className="hover:text-white transition-colors break-all">pokhrelflexprinting@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/60">
                <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+977 XXX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/60">
                <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Nepal</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home",      to: "/" },
                { label: "About",     to: "/about" },
                { label: "Portfolio", to: "/portfolio" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><Link to="/faq" className="text-xs text-white/60 transition-colors hover:text-white">FAQ</Link></li>
              <li><Link to="/help-center" className="text-xs text-white/60 transition-colors hover:text-white">Help Center</Link></li>
              <li><Link to="/support" className="text-xs text-white/60 transition-colors hover:text-white">Support</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-[#F5A623] hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-[#F5A623] hover:text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom row: copyright + legal ── */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Pokhrel Flex Printing. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
