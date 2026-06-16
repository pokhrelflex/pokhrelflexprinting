import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

// Module-level guard: the intro plays once per full page load (a browser
// refresh replays it; in-app route changes do not). This also stops React
// StrictMode's dev double-mount from replaying the timeline.
let introHasPlayed = false;

// The three paths that make up the Pokhrel Flex Printing mark (viewBox 3019×1927).
const PATHS = [
  "M1182.47 0C1200.04 19.54 1217.53 39.15 1235.18 58.61C1323.89 156.38 1412.62 254.15 1501.51 351.76C1505.67 356.33 1506.78 360.9 1506.78 366.68C1506.68 492.06 1506.71 617.45 1506.71 742.83C1506.71 972.56 1506.71 1202.29 1506.71 1432.03C1506.71 1435.63 1506.83 1439.24 1506.57 1442.82C1505.87 1452.74 1499.6 1459.2 1489.81 1460.19C1487.34 1460.44 1484.83 1460.4 1482.35 1460.4C1200.31 1460.4 918.26 1460.41 636.22 1460.4C619.23 1460.4 614.32 1455.66 614.31 1438.85C614.27 1330.63 614.29 1222.4 614.3 1114.18C614.3 1111.97 614.33 1109.74 614.62 1107.55C615.83 1098.22 621.23 1093.2 630.51 1092.77C633.55 1092.63 636.6 1092.71 639.64 1092.71C802.11 1092.71 964.59 1092.71 1127.06 1092.71H1137.5C1139.37 1086.04 1140.11 374 1138.47 359.22C1138.27 359.04 1138.07 358.85 1137.86 358.68C1137.65 358.5 1137.44 358.31 1137.2 358.19C1136.96 358.07 1136.67 358.02 1136.4 357.98C1135.86 357.89 1135.31 357.82 1134.76 357.75C1134.49 357.72 1134.21 357.71 1133.93 357.71C1133.38 357.7 1132.82 357.69 1132.27 357.68C1131.72 357.68 1131.16 357.68 1130.61 357.68C815.35 357.68 500.09 357.67 184.83 357.66C184.28 357.66 183.72 357.63 183.17 357.61C182.89 357.6 182.62 357.56 182.35 357.53C182.08 357.5 181.8 357.47 181.53 357.4C181.26 357.33 181.01 357.22 179.96 356.85C178.94 355.05 177.5 352.75 176.28 350.34C118.4 236.37 60.55 122.44 2.76 8.47C1.43 5.85 0.9 2.83 0 0C394.16 0 788.31 0 1182.47 0Z",
  "M562.17 426.8H174.92V1926.5H562.17V426.8Z",
  "M3012.8 351.69C2907.06 235.36 2801.41 118.95 2695.74 2.54C2695 1.72 2694.32 0.85 2693.61 0H1511.14C1512.03 2.57 1512.63 5.29 1513.86 7.7C1571.9 122.15 1630 236.57 1688.08 351C1695.71 357.8 1694.15 366.9 1694.15 375.57C1694.17 888.95 1694.17 1402.34 1694.15 1915.73C1694.15 1919.32 1693.94 1922.91 1693.83 1926.49H2062.52C2062.44 1923.72 2062.28 1920.97 2062.28 1918.2C2062.28 1769.34 2062.28 1620.49 2062.28 1471.64V1461.95C2068.82 1460.08 2638.95 1459.59 2650.13 1461.42C2650.25 1464.68 2650.48 1468.15 2650.48 1471.63C2650.5 1618.83 2650.5 1766.02 2650.48 1913.22C2650.48 1917.65 2650.45 1922.07 2650.43 1926.5H3018.43V649.08C3018.46 648.4 3018.47 647.72 3018.47 647.05C3018.49 553.22 3018.44 459.39 3018.61 365.56C3018.63 359.75 3016.51 355.78 3012.8 351.69ZM2650.49 1081.07V1092.41H2064.09C2063.55 1091.94 2063.33 1091.78 2063.14 1091.57C2062.97 1091.38 2062.76 1091.15 2062.72 1090.91C2062.55 1089.82 2062.3 1088.73 2062.3 1087.64C2062.3 845.49 2062.32 603.33 2062.37 361.18C2062.37 360.38 2062.73 359.59 2063.19 357.66H2074.38C2243.52 357.66 2412.66 357.6 2581.81 357.83L2647.34 480.44L2650.54 480.07C2650.43 481.1 2650.38 482.17 2650.38 483.3C2650.5 682.56 2650.49 881.82 2650.49 1081.07Z",
];

export default function IntroAnimation({ onReveal }) {
  const [done, setDone] = useState(introHasPlayed);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const logoRef = useRef(null);
  const pathRefs = useRef([]);

  useLayoutEffect(() => {
    // Run exactly once. The module-level guard also makes this a no-op on
    // StrictMode's dev double-invoke, so the timeline is never torn down
    // mid-flight. Scroll is restored in onComplete rather than in a cleanup.
    if (introHasPlayed) { onReveal?.(); return; }
    introHasPlayed = true;

    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const paths = pathRefs.current;

    // Each path starts as an undrawn outline with no fill.
    gsap.set(paths, {
      fill: "#ffffff",
      fillOpacity: 0,
      stroke: "#ffffff",
      strokeWidth: 14,
      strokeOpacity: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1,
    });
    gsap.set(logoRef.current, { transformOrigin: "center center" });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        window.__lenis?.start();
        document.body.style.overflow = prevOverflow;
        onReveal?.();   // reveal the real header logo the instant the intro lands
        setDone(true);  // …and remove the intro overlay in the same frame
      },
    });

    // CYCLE 1 (full) — draw each outline fully and slowly, then fill it in.
    tl.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.16 });
    tl.to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.6 }, "-=0.25");

    // CYCLE 2 (0.9) — loop back: undo the fill, redraw the outline to 90%,
    // then carry on smoothly into the landing-page reveal.
    tl.to(paths, { fillOpacity: 0, strokeOpacity: 1, duration: 0.4 });
    tl.set(paths, { strokeDashoffset: 1 });
    tl.to(paths, { strokeDashoffset: 0.1, duration: 0.95, stagger: 0.12 });

    // REVEAL — open the landing page: morph the logo into the
    // header slot while the backdrop fades away.
    tl.add(() => {
      const target = document.querySelector("[data-brand-logo]");
      const logo = logoRef.current;
      if (!target || !logo) return;
      const t = target.getBoundingClientRect();
      const l = logo.getBoundingClientRect();
      const scale = t.width / l.width;
      const dx = t.left + t.width / 2 - (l.left + l.width / 2);
      const dy = t.top + t.height / 2 - (l.top + l.height / 2);
      gsap.to(logo, { x: dx, y: dy, scale, duration: 1.1, ease: "power3.inOut" });
      gsap.to(bgRef.current, { opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.15 });
    });

    // hold the timeline open for the morph tweens above to finish.
    tl.to({}, { duration: 1.1 });
  }, []);

  if (done) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div ref={bgRef} className="absolute inset-0 bg-[#003A4D]" />
      <svg
        ref={logoRef}
        viewBox="0 0 3019 1927"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pokhrel Flex Printing"
        className="relative w-[24vw] max-w-[160px] h-auto"
      >
        {PATHS.map((d, i) => (
          <path key={i} ref={(el) => (pathRefs.current[i] = el)} d={d} pathLength="1" />
        ))}
      </svg>
    </div>
  );
}
