import { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function isSectionDark(elements) {
  if (!elements || elements.length === 0) return true;
  const darkKeywords = ["#0D1F3C", "#1B4F8A", "#0f2340", "#163e6e", "pfp-main", "pfp-dark"];
  const lightKeywords = ["#F2F0EC", "#ffffff", "bg-white", "bg-pfp-paper"];
  for (const el of elements) {
    const inlineStyle = (el.style?.backgroundColor || el.style?.background || "").trim();
    const bgCls = (el.className || "").split(/\s+/).filter(c => /^bg-/.test(c)).join(" ");
    if (darkKeywords.some(k => inlineStyle.includes(k) || bgCls.includes(k))) return true;
    if (lightKeywords.some(k => inlineStyle.includes(k) || bgCls.includes(k))) return false;
    const computed = window.getComputedStyle(el).backgroundColor;
    if (computed && computed !== "rgba(0, 0, 0, 0)" && computed !== "transparent") {
      const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const brightness = (parseInt(match[1]) * 299 + parseInt(match[2]) * 587 + parseInt(match[3]) * 114) / 1000;
        return brightness < 128;
      }
    }
  }
  return true;
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
];

export default function Header({ visible = true }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isContact = location.pathname === "/contact";
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const DARK_HERO = ["/", "/about", "/portfolio", "/faq", "/support", "/help-center"];

  const detectBackground = useCallback(() => {
    if (isContact) { setDark(false); return; }
    if (DARK_HERO.includes(location.pathname) && window.scrollY < 80) { setDark(true); return; }
    const headerEl = headerRef.current;
    if (!headerEl) { setDark(isLanding); return; }
    const headerBottom = headerEl.getBoundingClientRect().bottom;
    const probeX = window.innerWidth / 2;
    const probeY = headerBottom + 2;
    headerEl.style.pointerEvents = "none";
    headerEl.style.visibility = "hidden";
    const elements = document.elementsFromPoint(probeX, probeY);
    headerEl.style.pointerEvents = "";
    headerEl.style.visibility = "";
    if (!elements || elements.length === 0) { setDark(isLanding); return; }
    setDark(isSectionDark(elements));
  }, [isLanding, isContact, location.pathname]);

  useEffect(() => {
    detectBackground();
    window.addEventListener("scroll", detectBackground, { passive: true });
    return () => window.removeEventListener("scroll", detectBackground);
  }, [isLanding, detectBackground]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const textColor   = dark ? "text-white/80"   : "text-[#1A1A1A]/70";
  const hoverColor  = dark ? "hover:text-white" : "hover:text-[#1A1A1A]";
  const borderColor = dark ? "rgba(255,255,255,0.15)" : "rgba(27,79,138,0.12)";
  const bgColor     = dark ? "rgba(255,255,255,0.08)" : "rgba(27,79,138,0.06)";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 transition-all duration-700 ease-out px-4 py-3"
      style={{
        backgroundColor: "transparent",
        transform: visible ? "translateY(0)" : "translateY(-120%)",
      }}
    >
      {/* ── Pill bar ── */}
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3 transition-all duration-500"
        style={{
          background: bgColor,
          backdropFilter: "blur(40px) saturate(120%)",
          WebkitBackdropFilter: "blur(40px) saturate(120%)",
          borderRadius: "9999px",
          border: `1px solid ${borderColor}`,
          boxShadow: isContact ? "none" : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-black text-sm"
              style={{
                background: dark ? "rgba(245,166,35,0.9)" : "#F5A623",
                color: "#fff",
                borderRadius: "6px",
              }}
            >
              PF
            </div>
            <span
              className={`hidden sm:block text-sm font-bold tracking-tight transition-colors duration-500 ${dark ? "text-white" : "text-[#1B4F8A]"}`}
            >
              Pokhrel Flex
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="flex-1 flex justify-center">
          <nav className={`hidden md:flex flex-nowrap items-center justify-center gap-8 text-sm font-medium whitespace-nowrap transition-colors duration-500 ${textColor}`}>
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `transition-colors duration-300 ${isActive ? "text-[#F5A623]" : hoverColor}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right — CTA + hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:flex rounded-full bg-[#F5A623] px-5 py-2 text-sm font-semibold text-white transition-colors duration-300 items-center gap-2 hover:bg-[#F5A623]/85"
          >
            Get a Quote
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(o => !o)}
            className={`md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-[#1B4F8A]/10"}`}
          >
            <span className={`block w-5 h-0.5 rounded transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-5 h-0.5 rounded mt-1 transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 rounded mt-1 transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <div
        className={`md:hidden mx-auto max-w-6xl mt-2 overflow-hidden transition-all duration-300 ease-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            background: dark ? "rgba(13,31,60,0.92)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(40px) saturate(120%)",
            WebkitBackdropFilter: "blur(40px) saturate(120%)",
            border: `1px solid ${borderColor}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map(({ label, to }, i) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200
                  ${isActive ? "text-[#F5A623]" : dark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1B4F8A]/6"}
                  ${i < NAV_LINKS.length - 1 ? (dark ? "border-b border-white/5" : "border-b border-[#1B4F8A]/5") : ""}
                `}
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-3 pb-1 px-1">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center rounded-full bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F5A623]/85"
              >
                Get a Quote
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
