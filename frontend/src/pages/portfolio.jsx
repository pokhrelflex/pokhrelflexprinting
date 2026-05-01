import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const CATEGORIES = [
  {
    title: "Flex & Vinyl Printing",
    examples: "Banners, standees, stickers, outdoor signage, backlit displays",
    note: "Large-format prints on premium flex and vinyl materials — suitable for indoor and outdoor use, events, and storefronts.",
  },
  {
    title: "Sublimation Products",
    examples: "Mugs, cups, t-shirts, phone cases, photo frames, keychains",
    note: "Vibrant, long-lasting sublimation prints on a wide range of products — ideal for gifts, merchandise, and corporate giveaways.",
  },
  {
    title: "Trophies & Medals",
    examples: "Custom trophies, medals, plaques, shields, recognition awards",
    note: "Wholesale and retail trophies for sports events, academic ceremonies, and corporate functions — any size or design.",
  },
  {
    title: "Table Stands & Signage",
    examples: "Acrylic stands, menu holders, nameplates, A4 display frames",
    note: "Professional display solutions for restaurants, offices, shops, and exhibitions — metal and acrylic finishes available.",
  },
  {
    title: "Custom Printing",
    examples: "Visiting cards, letterheads, brochures, calendars, notebooks",
    note: "Offset and digital printing for all your business stationery and marketing material needs, with quick turnaround.",
  },
  {
    title: "Wholesale Orders",
    examples: "Bulk banners, bulk mugs, bulk trophies, bulk stickers",
    note: "We offer wholesale pricing for resellers, event organizers, and corporate clients — contact us for bulk quotes.",
  },
];

const CAPABILITIES = [
  "Design assistance",
  "Pre-press proofing",
  "Material selection",
  "Custom sizing",
  "Lamination options",
  "Rush orders",
  "Bulk discounts",
  "Delivery available",
];

export default function Portfolio() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0D1F3C] pt-32 pb-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 40% 60%, #1B4F8A 0%, transparent 65%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A623]">Portfolio</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <h1 className="premium-font-galdgderbold text-4xl leading-[1] text-white sm:text-5xl lg:text-7xl">
              Print products we deliver with care.
            </h1>
            <p className="border-l border-white/15 pl-6 text-sm leading-[1.9] text-white/60">
              From large-format flex banners to personalized sublimation gifts and custom trophies — we cover all your printing needs under one roof, retail and wholesale.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <article key={category.title} className="group relative overflow-hidden border border-[#1A1A1A]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,45,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1B4F8A]/25">
                <div className="absolute -right-4 -top-6 premium-font-galdgderbold text-8xl text-[#1B4F8A]/5">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-black text-[#F5A623]">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="mt-5 text-lg font-bold text-[#1B4F8A]">{category.title}</h2>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]/38">{category.examples}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/55">{category.note}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 bg-[#F2F0EC] p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F5A623]">What we offer</p>
              <h2 className="mt-3 premium-font-galdgdersemi text-3xl text-[#1B4F8A]">More than just printing.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/58">
                Every order gets attention to detail — from material choice to final quality check before handover.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <div key={item} className="border border-[#1B4F8A]/10 bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A]/75">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border border-[#1B4F8A]/12 bg-[#1B4F8A] p-8 text-white">
            <h3 className="premium-font-galdgdersemi text-2xl">Need something not listed here?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
              Share your idea, size, quantity, and design. We will check whether we can produce it and give you a quote within 24 hours.
            </p>
            <Link to="/contact" className="mt-6 inline-flex bg-[#F5A623] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#F5A623]/85">
              Send print request
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
