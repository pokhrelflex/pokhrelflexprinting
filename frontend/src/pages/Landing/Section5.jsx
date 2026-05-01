import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useScrollReveal from "./useScrollReveal";

const CATEGORY_ICONS = [
  (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
];

export default function Section5() {
  const { t } = useTranslation();
  const [ref, visible] = useScrollReveal(0.1);
  const [selectedCat, setSelectedCat] = useState(1);
  const categories = t("section5.categories", { returnObjects: true });
  const fields = t("section5.categoryFields", { returnObjects: true });
  const processSteps = t("section5.processSteps", { returnObjects: true });

  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-24 lg:py-28" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`text-center transition-all duration-700 motion-reduce:transition-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex bg-[#003A4D]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#003A4D]">
            {t("section5.eyebrow")}
          </span>
          <h2 className="mt-4 sm:mt-5 premium-font-galdgderbold text-2xl sm:text-4xl lg:text-5xl text-[#003A4D] leading-tight">
            {t("section5.title")}
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base leading-relaxed text-[#1A1A1A]/65">
            {t("section5.subtitle")}
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedCat(i)}
              className={`group relative min-h-[44px] overflow-hidden border p-5 text-left transition-all duration-500 ease-out touch-manipulation motion-reduce:transition-none sm:p-6 ${selectedCat === i ? "border-[#003A4D]/35 bg-white shadow-[0_16px_40px_rgba(0,58,77,0.12)] sm:-translate-y-1" : "border-[#1A1A1A]/10 bg-white/90 hover:border-[#1A1A1A]/20 hover:shadow-[0_10px_28px_rgba(45,45,45,0.10)] sm:hover:-translate-y-0.5"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: visible ? `${220 + i * 90}ms` : "0ms" }}
            >
              {selectedCat === i && <div className="absolute -top-px left-0 right-0 h-1 bg-[#F0C924]" />}
              <div className={`inline-flex p-3 transition-all duration-300 ${selectedCat === i ? "bg-[#F0C924] text-white shadow-lg" : "bg-[#003A4D] text-white/85"}`}>
                {CATEGORY_ICONS[i]}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-[#1A1A1A]">{cat.name}</h3>
              <div className="mt-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">{fields.products}</span>
                  <span className="font-medium text-[#1A1A1A]/80">{cat.items}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">{fields.description}</span>
                  <span className="font-medium text-[#1A1A1A]/70 text-right max-w-[60%]">{cat.desc}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">{fields.pricing}</span>
                  <span className="font-semibold text-[#F0C924]">{cat.pricing}</span>
                </div>
              </div>
              {selectedCat === i && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#F0C924]">
                  <span className="h-1.5 w-1.5 bg-[#F0C924]" />
                  {fields.selected}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Process pipeline */}
        <div className={`mt-8 sm:mt-14 border border-[#1A1A1A]/10 bg-white/95 p-4 sm:p-8 shadow-[0_12px_32px_rgba(45,45,45,0.06)] transition-all duration-700 delay-300 motion-reduce:transition-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold tracking-tight text-[#1A1A1A]">{t("section5.processTitle")}</h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="group flex min-h-11 cursor-default items-center gap-2 border border-[#003A4D]/12 bg-[#003A4D]/5 px-3 py-2.5 transition-all duration-300 motion-reduce:transition-none hover:border-[#003A4D]/25 hover:bg-[#003A4D] hover:text-white hover:shadow-md sm:px-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#003A4D]/10 text-[10px] font-bold text-[#003A4D] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A] transition-colors duration-300 group-hover:text-white">{step}</span>
                </div>
                {i < processSteps.length - 1 && (
                  <svg className="hidden h-4 w-4 shrink-0 text-[#1A1A1A]/25 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
