import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

const STACK_POSITIONS = {
  mobile: [
    { rotate: -2.5, y: -84, x: -12 },
    { rotate: 1.5, y: -24, x: -8 },
    { rotate: -1, y: 34, x: 8 },
    { rotate: 2, y: 92, x: 14 },
  ],
  tablet: [
    { rotate: -3, y: -104, x: -28 },
    { rotate: 2, y: -36, x: -22 },
    { rotate: -1.5, y: 28, x: 0 },
    { rotate: 2.5, y: 96, x: 16 },
  ],
  desktop: [
    { rotate: -3, y: -120, x: -40 },
    { rotate: 2, y: -40, x: -35 },
    { rotate: -1.5, y: 20, x: 0 },
    { rotate: 2.5, y: 85, x: 20 },
  ],
};

const getStackLayout = () => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

const CARD_ENTRY = [
  { start: 0.02, end: 0.14 },
  { start: 0.16, end: 0.28 },
  { start: 0.30, end: 0.42 },
  { start: 0.44, end: 0.60 },
];

function ProductCard({ p, index, progress, pos, layout, reducedMotion }) {
  const entry = CARD_ENTRY[index];
  const entryDistance = layout === "mobile" ? 760 : layout === "tablet" ? 900 : 1100;
  const rawY = useTransform(progress, [entry.start, entry.end], [reducedMotion ? pos.y : entryDistance, pos.y], { clamp: true });
  const rawX = useTransform(progress, [entry.start, entry.end], [reducedMotion ? pos.x : 48, pos.x], { clamp: true });
  const rawRotate = useTransform(progress, [entry.start, entry.end], [reducedMotion ? pos.rotate : 10, pos.rotate], { clamp: true });
  const spring = reducedMotion ? { stiffness: 1000, damping: 100, mass: 0.2 } : { stiffness: 220, damping: 32, mass: 0.55 };
  const y = useSpring(rawY, spring);
  const x = useSpring(rawX, spring);
  const rotate = useSpring(rawRotate, spring);
  const isGlass = index % 2 === 1;
  const cardStyle = isGlass
    ? { y, x, rotate, zIndex: index + 1, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px) saturate(120%)", WebkitBackdropFilter: "blur(16px) saturate(120%)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 20px 56px rgba(0,58,77,0.22), 0 4px 12px rgba(0,0,0,0.08)", isolation: "isolate" }
    : { y, x, rotate, zIndex: index + 1, backgroundColor: "#003A4D", boxShadow: "0 24px 64px rgba(0,58,77,0.35), 0 8px 24px rgba(0,0,0,0.2)", isolation: "isolate" };
  const indexCls = isGlass ? "text-[#003A4D]" : "text-[#F0C924]";
  const roleCls = isGlass ? "text-[#003A4D] bg-[#003A4D]/15" : "text-[#F0C924] bg-[#F0C924]/25";
  const titleCls = isGlass ? "text-[#003A4D]" : "text-white";
  const descCls = isGlass ? "text-[#1A1A1A]" : "text-white";
  const statBoxCls = isGlass ? "bg-[#003A4D]/10" : "bg-white/15";
  const statLabelCls = isGlass ? "text-[#1A1A1A]" : "text-white";
  const watermarkCls = isGlass ? "text-[#003A4D]/10" : "text-white/[0.04]";
  const dotColor = isGlass ? "#003A4D" : "#fff";
  return (
    <motion.div
      style={cardStyle}
      className={`absolute w-[min(82vw,300px)] sm:w-[300px] md:w-[320px] lg:w-[340px] overflow-hidden`}
    >
      <div className={`absolute -top-3 -left-1 font-black leading-none select-none pointer-events-none ${watermarkCls}`} style={{ fontSize: "clamp(72px, 10vw, 104px)" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
      <div className="relative z-10 flex flex-col p-5 sm:p-6 lg:p-7" style={{ minHeight: "clamp(330px, 48vh, 400px)" }}>
        <div className="flex justify-between items-start mb-6">
          <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${indexCls}`}>{String(index + 1).padStart(2, "0")}.</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${roleCls}`}>{p.role}</span>
        </div>
        <h3 className={`premium-font-galdgderbold text-[1.4rem] sm:text-[1.8rem] lg:text-[2rem] leading-tight mb-2 ${titleCls}`}>{p.name}</h3>
        <p className={`text-[12px] leading-relaxed mb-5 ${descCls}`} style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
        <div className="w-8 h-[2px] bg-[#F0C924] mb-4" />
        <div className="flex gap-2 mt-auto">
          <div className={`flex-1 p-2.5 ${statBoxCls}`}>
            <div className="text-sm font-bold text-[#F0C924] leading-none mb-1">{p.stat1Value}</div>
            <div className={`text-[8px] uppercase tracking-wider leading-tight ${statLabelCls}`}>{p.stat1Label}</div>
          </div>
          <div className={`flex-1 p-2.5 ${statBoxCls}`}>
            <div className="text-sm font-bold text-[#F0C924] leading-none mb-1">{p.stat2Value}</div>
            <div className={`text-[8px] uppercase tracking-wider leading-tight ${statLabelCls}`}>{p.stat2Label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductsSection() {
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [stackLayout, setStackLayout] = useState(getStackLayout);
  const products = t("section4.products", { returnObjects: true });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  useEffect(() => {
    const updateLayout = () => setStackLayout(getStackLayout());
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);
  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.09], [0, 1]);
  const pinSpring = { stiffness: 90, damping: 22, mass: 0.9 };
  const pin1 = useSpring(useTransform(scrollYProgress, [CARD_ENTRY[0].start, CARD_ENTRY[0].start + 0.04, CARD_ENTRY[1].start, CARD_ENTRY[1].start + 0.04], [0, 1, 1, 0], { clamp: true }), pinSpring);
  const pin2 = useSpring(useTransform(scrollYProgress, [CARD_ENTRY[1].start, CARD_ENTRY[1].start + 0.04, CARD_ENTRY[2].start, CARD_ENTRY[2].start + 0.04], [0, 1, 1, 0], { clamp: true }), pinSpring);
  const pin3 = useSpring(useTransform(scrollYProgress, [CARD_ENTRY[2].start, CARD_ENTRY[2].start + 0.04, CARD_ENTRY[3].start, CARD_ENTRY[3].start + 0.04], [0, 1, 1, 0], { clamp: true }), pinSpring);
  const pin4 = useSpring(useTransform(scrollYProgress, [CARD_ENTRY[3].start, CARD_ENTRY[3].start + 0.04], [0, 1], { clamp: true }), pinSpring);
  return (
    <section ref={containerRef} className="relative" style={{ height: stackLayout === "mobile" ? "500vh" : "560vh" }}>
      <div className="sticky top-0 h-[100dvh] min-h-[640px] overflow-hidden flex flex-col sm:min-h-[680px] sm:flex-row items-stretch" style={{ backgroundColor: "#F2F0EC" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20">
          <div className="w-full h-full" style={{ background: "radial-gradient(ellipse at center, rgba(0,58,77,0.15) 0%, transparent 70%)" }} />
        </div>
        <motion.div style={{ opacity: headingOpacity }} className="sm:hidden relative z-10 py-3 flex items-center justify-center shrink-0 pointer-events-none">
          <h2 className="premium-font-galdgderbold text-[11px] text-[#1A1A1A]/45 uppercase tracking-[0.25em]">{t("section4.vertical")}</h2>
        </motion.div>
        <div className="relative z-10 flex items-center justify-center w-full sm:w-[55%] lg:w-[42%] h-[60dvh] min-h-[400px] sm:h-full overflow-hidden">
          {products.map((p, i) => (
            <ProductCard key={i} p={p} index={i} progress={scrollYProgress} pos={STACK_POSITIONS[stackLayout][i]} layout={stackLayout} reducedMotion={prefersReducedMotion} />
          ))}
        </div>
        <div className="hidden sm:block flex-1" />
        <motion.div style={{ opacity: headingOpacity }} className="hidden sm:flex relative z-10 h-full items-center justify-center w-[72px] lg:w-[96px] shrink-0">
          <h2 className="premium-font-galdgderbold text-xl lg:text-3xl text-[#1A1A1A] whitespace-nowrap select-none" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.12em" }}>
            {t("section4.vertical")}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

export default function Section4() {
  return <ProductsSection />;
}
