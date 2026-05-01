import React, { useState } from "react";
import useScrollReveal from "./useScrollReveal";

const CATEGORIES = [
  {
    name: "Flex & Vinyl Printing",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    desc: "Large format flex banners, vinyl stickers, standees and outdoor signage",
    items: "Banners, Stickers, Standees",
    pricing: "Per sq. ft",
  },
  {
    name: "Sublimation Products",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    desc: "Sublimation mugs, cups, t-shirts, phone cases and photo frames",
    items: "Mugs, Cups, T-shirts",
    pricing: "Per unit",
  },
  {
    name: "Trophies & Medals",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    desc: "Custom trophies, medals, plaques and certificates for any occasion",
    items: "Trophies, Medals, Plaques",
    pricing: "Wholesale available",
  },
];

const PROCESS_STEPS = [
  "Place Order",
  "Design Submission",
  "Pre-Press Check",
  "Material Preparation",
  "Printing",
  "Quality Control",
  "Finishing",
  "Ready for Collection",
];

export default function Section5() {
  const [ref, visible] = useScrollReveal(0.1);
  const [selectedCat, setSelectedCat] = useState(1);

  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-24 lg:py-28" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`text-center transition-all duration-700 motion-reduce:transition-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex bg-[#1B4F8A]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4F8A]">
            Full Range
          </span>
          <h2 className="mt-4 sm:mt-5 premium-font-galdgderbold text-2xl sm:text-4xl lg:text-5xl text-[#1B4F8A] leading-tight">
            Our Product Categories
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base leading-relaxed text-[#1A1A1A]/65">
            Everything you need in one place — from printing machines to finished products, retail and wholesale.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCat(i)}
              className={`group relative min-h-[44px] overflow-hidden border p-5 text-left transition-all duration-500 ease-out touch-manipulation motion-reduce:transition-none sm:p-6 ${selectedCat === i ? "border-[#1B4F8A]/35 bg-white shadow-[0_16px_40px_rgba(27,79,138,0.12)] sm:-translate-y-1" : "border-[#1A1A1A]/10 bg-white/90 hover:border-[#1A1A1A]/20 hover:shadow-[0_10px_28px_rgba(45,45,45,0.10)] sm:hover:-translate-y-0.5"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: visible ? `${220 + i * 90}ms` : "0ms" }}
            >
              {selectedCat === i && <div className="absolute -top-px left-0 right-0 h-1 bg-[#F5A623]" />}
              <div className={`inline-flex p-3 transition-all duration-300 ${selectedCat === i ? "bg-[#F5A623] text-white shadow-lg" : "bg-[#1B4F8A] text-white/85"}`}>
                {cat.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-[#1A1A1A]">{cat.name}</h3>
              <div className="mt-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">Products</span>
                  <span className="font-medium text-[#1A1A1A]/80">{cat.items}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">Description</span>
                  <span className="font-medium text-[#1A1A1A]/70 text-right max-w-[60%]">{cat.desc}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#1A1A1A]/50">Pricing</span>
                  <span className="font-semibold text-[#F5A623]">{cat.pricing}</span>
                </div>
              </div>
              {selectedCat === i && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#F5A623]">
                  <span className="h-1.5 w-1.5 bg-[#F5A623]" />
                  Selected category
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Process pipeline */}
        <div className={`mt-8 sm:mt-14 border border-[#1A1A1A]/10 bg-white/95 p-4 sm:p-8 shadow-[0_12px_32px_rgba(45,45,45,0.06)] transition-all duration-700 delay-300 motion-reduce:transition-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold tracking-tight text-[#1A1A1A]">Our Printing Process</h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {PROCESS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="group flex min-h-11 cursor-default items-center gap-2 border border-[#1B4F8A]/12 bg-[#1B4F8A]/5 px-3 py-2.5 transition-all duration-300 motion-reduce:transition-none hover:border-[#1B4F8A]/25 hover:bg-[#1B4F8A] hover:text-white hover:shadow-md sm:px-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#1B4F8A]/10 text-[10px] font-bold text-[#1B4F8A] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A] transition-colors duration-300 group-hover:text-white">{step}</span>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
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
