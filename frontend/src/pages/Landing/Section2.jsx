import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useScrollReveal from "./useScrollReveal";

const STATS = [
  { value: 100, suffix: "+", labelKey: "stats.products" },
  { value: 25,  suffix: "+", labelKey: "stats.years" },
  { value: 500, suffix: "+", labelKey: "stats.customers" },
  { value: 4,   suffix: "",  labelKey: "stats.categories" },
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

function StatItem({ value, suffix, labelKey }) {
  const { t } = useTranslation();
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
        {t(labelKey)}
      </div>
    </div>
  );
}

function StatsStrip() {
  const [stripRef, stripVisible] = useScrollReveal(0.3);
  return (
    <div ref={stripRef} className={`bg-[#003A4D] transition-all duration-1000 ${stripVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((s) => (
          <StatItem key={s.labelKey} value={s.value} suffix={s.suffix} labelKey={s.labelKey} />
        ))}
      </div>
    </div>
  );
}

export default function Section2() {
  const { t } = useTranslation();
  const [ref, visible] = useScrollReveal(0.08);
  return (
    <section ref={ref} id="who-we-are" className="relative bg-[#F2F0EC] overflow-hidden">
      <div className="pt-16 sm:pt-24 lg:pt-32 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#003A4D]/60">
              {t("about.eyebrow")}
            </span>
            <h2 className="mt-4 premium-font-galdgderbold text-[2.5rem] text-[#6F1C00] sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.95]">
              {t("about.titleA")}{" "}
              <span className="text-[#003A4D]">{t("about.titleB")}</span>
            </h2>
          </div>

          <div className={`mt-8 sm:mt-12 grid gap-0 lg:grid-cols-[1fr_1px_1fr] items-start transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-base sm:text-lg leading-[1.8] text-[#1A1A1A]/70 pr-0 lg:pr-12">
              <span className="font-semibold text-[#1A1A1A]">{t("about.leadName")}</span>{t("about.leadBody")}
            </p>
            <div className="hidden lg:block w-px h-full bg-[#1A1A1A]/10" />
            <p className="text-sm sm:text-base leading-[1.8] text-[#1A1A1A]/50 pl-0 lg:pl-12 mt-4 lg:mt-0">
              {t("about.subBody")}
            </p>
          </div>
        </div>
      </div>
      <StatsStrip />
    </section>
  );
}
