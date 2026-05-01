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

  const textColor    = dark ? "text-white/80"          : "text-[#1A1A1A]";
  const hoverColor   = dark ? "hover:text-white"       : "hover:text-[#6F1C00]";
  const activeColor  = dark ? "text-[#F0C924]"         : "text-[#6F1C00]";
  const ctaClasses   = dark
    ? "bg-[#F0C924] text-[#003A4D] hover:bg-[#F0C924]/85"
    : "bg-[#6F1C00] text-white hover:bg-[#6F1C00]/85";
  const borderColor  = dark ? "rgba(255,255,255,0.15)" : "rgba(0,58,77,0.12)";
  const bgColor      = "transparent";

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
            <svg
              viewBox="0 0 3019 1927"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Pokhrel Flex Printing"
              className={`h-5 sm:h-6 w-auto transition-colors duration-500 ${dark ? "text-white" : "text-[#003A4D]"}`}
              fill="currentColor"
            >
              <path d="M1182.47 0C1200.04 19.54 1217.53 39.15 1235.18 58.61C1323.89 156.38 1412.62 254.15 1501.51 351.76C1505.67 356.33 1506.78 360.9 1506.78 366.68C1506.68 492.06 1506.71 617.45 1506.71 742.83C1506.71 972.56 1506.71 1202.29 1506.71 1432.03C1506.71 1435.63 1506.83 1439.24 1506.57 1442.82C1505.87 1452.74 1499.6 1459.2 1489.81 1460.19C1487.34 1460.44 1484.83 1460.4 1482.35 1460.4C1200.31 1460.4 918.26 1460.41 636.22 1460.4C619.23 1460.4 614.32 1455.66 614.31 1438.85C614.27 1330.63 614.29 1222.4 614.3 1114.18C614.3 1111.97 614.33 1109.74 614.62 1107.55C615.83 1098.22 621.23 1093.2 630.51 1092.77C633.55 1092.63 636.6 1092.71 639.64 1092.71C802.11 1092.71 964.59 1092.71 1127.06 1092.71H1137.5C1139.37 1086.04 1140.11 374 1138.47 359.22C1138.27 359.04 1138.07 358.85 1137.86 358.68C1137.65 358.5 1137.44 358.31 1137.2 358.19C1136.96 358.07 1136.67 358.02 1136.4 357.98C1135.86 357.89 1135.31 357.82 1134.76 357.75C1134.49 357.72 1134.21 357.71 1133.93 357.71C1133.38 357.7 1132.82 357.69 1132.27 357.68C1131.72 357.68 1131.16 357.68 1130.61 357.68C815.35 357.68 500.09 357.67 184.83 357.66C184.28 357.66 183.72 357.63 183.17 357.61C182.89 357.6 182.62 357.56 182.35 357.53C182.08 357.5 181.8 357.47 181.53 357.4C181.26 357.33 181.01 357.22 179.96 356.85C178.94 355.05 177.5 352.75 176.28 350.34C118.4 236.37 60.55 122.44 2.76 8.47C1.43 5.85 0.9 2.83 0 0C394.16 0 788.31 0 1182.47 0Z" />
              <path d="M562.17 426.8H174.92V1926.5H562.17V426.8Z" />
              <path d="M3012.8 351.69C2907.06 235.36 2801.41 118.95 2695.74 2.54C2695 1.72 2694.32 0.85 2693.61 0H1511.14C1512.03 2.57 1512.63 5.29 1513.86 7.7C1571.9 122.15 1630 236.57 1688.08 351C1695.71 357.8 1694.15 366.9 1694.15 375.57C1694.17 888.95 1694.17 1402.34 1694.15 1915.73C1694.15 1919.32 1693.94 1922.91 1693.83 1926.49H2062.52C2062.44 1923.72 2062.28 1920.97 2062.28 1918.2C2062.28 1769.34 2062.28 1620.49 2062.28 1471.64V1461.95C2068.82 1460.08 2638.95 1459.59 2650.13 1461.42C2650.25 1464.68 2650.48 1468.15 2650.48 1471.63C2650.5 1618.83 2650.5 1766.02 2650.48 1913.22C2650.48 1917.65 2650.45 1922.07 2650.43 1926.5H3018.43V649.08C3018.46 648.4 3018.47 647.72 3018.47 647.05C3018.49 553.22 3018.44 459.39 3018.61 365.56C3018.63 359.75 3016.51 355.78 3012.8 351.69ZM2650.49 1081.07V1092.41H2064.09C2063.55 1091.94 2063.33 1091.78 2063.14 1091.57C2062.97 1091.38 2062.76 1091.15 2062.72 1090.91C2062.55 1089.82 2062.3 1088.73 2062.3 1087.64C2062.3 845.49 2062.32 603.33 2062.37 361.18C2062.37 360.38 2062.73 359.59 2063.19 357.66H2074.38C2243.52 357.66 2412.66 357.6 2581.81 357.83L2647.34 480.44L2650.54 480.07C2650.43 481.1 2650.38 482.17 2650.38 483.3C2650.5 682.56 2650.49 881.82 2650.49 1081.07Z" />
            </svg>
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
                className={({ isActive }) => `transition-colors duration-300 ${isActive ? activeColor : hoverColor}`}
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
            className={`hidden sm:flex rounded-full px-5 py-2 text-sm font-bold transition-colors duration-300 items-center gap-2 ${ctaClasses}`}
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
