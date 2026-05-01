import { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function isSectionDark(elements) {
  if (!elements || elements.length === 0) return true;
  const darkKeywords = ["#003A4D", "#002C3B", "#001E2C", "#00131C", "pfp-main", "pfp-dark"];
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
  { label: "Products", to: "/products" },
  { label: "Notices", to: "/notices" },
];

export default function Header({ visible = true }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isContact = location.pathname === "/contact";
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const DARK_HERO = ["/", "/about", "/products", "/notices", "/faq", "/support", "/help-center"];

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

  useEffect(() => {
    if (!menuOpen) return;
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const textColor   = dark ? "text-white/80"   : "text-[#1A1A1A]/70";
  const hoverColor  = dark ? "hover:text-white" : "hover:text-[#1A1A1A]";
  const borderColor = dark ? "rgba(255,255,255,0.15)" : "rgba(0,58,77,0.12)";
  const bgColor     = "transparent";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out px-4 py-3"
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
                background: dark ? "rgba(240,201,36,0.9)" : "#F0C924",
                color: "#fff",
                borderRadius: "6px",
              }}
            >
              PF
            </div>
            <span
              className={`hidden sm:block text-sm font-bold tracking-tight transition-colors duration-500 ${dark ? "text-white" : "text-[#003A4D]"}`}
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
                className={({ isActive }) => `transition-colors duration-300 ${isActive ? "text-[#F0C924]" : hoverColor}`}
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
            className="hidden sm:flex rounded-full bg-[#F0C924] px-5 py-2 text-sm font-bold text-[#003A4D] transition-colors duration-300 items-center gap-2 hover:bg-[#F0C924]/85"
          >
            Contact
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(o => !o)}
            className={`md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-[#003A4D]/10"}`}
          >
            <span className={`block w-5 h-0.5 rounded transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-5 h-0.5 rounded mt-1 transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 rounded mt-1 transition-all duration-300 ${dark ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile slide-in drawer (right, full width × full height) ── */}
      <aside
        className="md:hidden fixed top-0 right-0 z-40 h-[100vh] w-screen"
        style={{
          background: "#003A4D",
          transform: menuOpen ? "translateX(0)" : "translateX(101%)",
          transition: menuOpen
            ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 420ms cubic-bezier(0.64, 0, 0.78, 0)",
          willChange: "transform",
        }}
        aria-hidden={!menuOpen}
      >
        <div className="relative flex h-full flex-col px-8 pt-24 pb-10">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav className="flex-1 flex flex-col">
            {NAV_LINKS.map(({ label, to }, i) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-1 py-4 text-2xl premium-font-galdgderbold transition-colors duration-200
                  ${isActive ? "text-[#F0C924]" : "text-white/85 hover:text-white"}
                  ${i < NAV_LINKS.length - 1 ? "border-b border-white/10" : ""}
                `}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-6 block w-full text-center rounded-full bg-[#F0C924] px-5 py-3.5 text-base font-bold text-[#003A4D] transition-colors hover:bg-[#F0C924]/85"
          >
            Contact
          </Link>
        </div>
      </aside>
    </header>
  );
}
