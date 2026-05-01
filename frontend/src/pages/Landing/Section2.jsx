import React, { useState, useEffect, useRef } from "react";
import useScrollReveal from "./useScrollReveal";

const STATS = [
  { value: 100, suffix: "+", label: "Products Available" },
  { value: 25, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Happy Customers" },
  { value: 4, suffix: "", label: "Product Categories" },
];

function useCountUp(target, suffix, duration, shouldStart) {
  const [display, setDisplay] = useState("0" + suffix);
  const started = useRef(false);
  useEffect(() => {
    if (!shouldStart || started.current) return;
    started.current = true;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, suffix, duration, shouldStart]);
  return display;
}

function StatItem({ value, suffix, label }) {
  const [statRef, statVisible] = useScrollReveal(0.3);
  const display = useCountUp(value, suffix, 2000, statVisible);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={statRef}
      className="group text-center cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`premium-font-galdgderbold text-3xl sm:text-4xl transition-all duration-300 ${hovered ? "text-[#F0C924] scale-110" : "text-white"}`}>
        {display}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
    </div>
  );
}

function StatsStrip() {
  const [stripRef, stripVisible] = useScrollReveal(0.3);
  return (
    <div ref={stripRef} className={`bg-[#003A4D] transition-all duration-1000 ${stripVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((s, i) => (
          <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 200} />
        ))}
      </div>
    </div>
  );
}

export default function Section2() {
  const [ref, visible] = useScrollReveal(0.08);
  return (
    <section ref={ref} id="who-we-are" className="relative bg-[#F2F0EC] overflow-hidden">
      <div className="pt-16 sm:pt-24 lg:pt-32 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#003A4D]/60">
              About Us
            </span>
            <h2 className="mt-4 premium-font-galdgderbold text-[2.5rem] text-[#6F1C00] sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.95]">
              Who We{" "}
              <span className="text-[#003A4D]">Are</span>
            </h2>
          </div>

          <div className={`mt-8 sm:mt-12 grid gap-0 lg:grid-cols-[1fr_1px_1fr] items-start transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-base sm:text-lg leading-[1.8] text-[#1A1A1A]/70 pr-0 lg:pr-12">
              <span className="font-semibold text-[#1A1A1A]">Pokhrel Flex Printing</span> is a printing business based in Nepal offering quality print solutions for retail and wholesale customers.
            </p>
            <div className="hidden lg:block w-px h-full bg-[#1A1A1A]/10" />
            <p className="text-sm sm:text-base leading-[1.8] text-[#1A1A1A]/50 pl-0 lg:pl-12 mt-4 lg:mt-0">
              We specialize in vinyl and flex printing, sublimation cups and materials, custom trophies, medals, table stands, and much more. Whether you need a single piece or a bulk wholesale order, we deliver quality every time.
            </p>
          </div>
        </div>
      </div>
      <StatsStrip />
    </section>
  );
}
