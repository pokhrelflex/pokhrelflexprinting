import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

const MARQUEE_ITEMS = [
  "Vinyl",
  "Sublimation",
  "Trophies",
  "Banners",
  "Stamps",
  "Business Cards",
  "Stands",
  "Medals",
  "Brochures",
  "Signage",
];

export default function Section1() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.dispatchEvent(new CustomEvent("hero-typing-done"));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const spring = { stiffness: 120, damping: 30, mass: 0.7 };
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 60]),  spring);
  const fade  = useTransform(scrollYProgress, [0, 0.6, 0.95], [1, 0.9, 0]);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] overflow-hidden"
      style={{ background: "#003A4D" }}
    >
      {/* ── Massive headline ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10"
        style={{ y: textY, opacity: fade }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.95, ease }}
          className="premium-font-galdgderbold uppercase text-white text-center leading-[0.86] tracking-[-0.01em]"
          style={{ fontSize: "clamp(3.25rem, 11vw, 9.5rem)" }}
        >
          You Build,
          <br />
          We Print
          <br />
          Your Vision
        </motion.h1>
      </motion.div>

      {/* ── CTA (bottom-center, plain text link) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55, duration: 0.85, ease }}
        style={{ opacity: fade }}
        className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 z-10 px-6 text-center"
      >
        <Link
          to="/contact"
          className="group inline-flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-white transition-colors duration-300 hover:text-[#F0C924]"
        >
          Let&apos;s Talk
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </motion.div>

      {/* ── Bottom marquee strip ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-white/10 bg-[#003A4D]/80 backdrop-blur-sm">
        <div className="flex animate-marquee whitespace-nowrap py-3 sm:py-4">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.32em] text-white/55 px-6 sm:px-10">
                    {item}
                  </span>
                  <span className="text-[#F0C924]">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
