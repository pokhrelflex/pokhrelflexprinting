import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LOGO_PATHS, BRAND } from "./brand";

const EASE = [0.22, 1, 0.36, 1];

export function AuthHeader({ delay = 0 }) {
  return (
    <motion.header
      className="border-b border-gray-200"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
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
          <Link to="/login" className="transition hover:text-[#1d1d1f]">Log in</Link>
          <Link to="/register" className="text-[#1d1d1f]">Create your account</Link>
          <Link to="/faq" className="transition hover:text-[#1d1d1f]">Frequently asked questions</Link>
        </nav>
      </div>
    </motion.header>
  );
}

export function AuthFooter({ delay = 0 }) {
  return (
    <motion.footer
      className="border-t border-gray-200 bg-[#f5f5f7]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
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
  );
}
