import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const WORK = [
  {
    title: "Flex & Vinyl Banners",
    tag: "Large Format",
    note: "Storefront banners, event backdrops, and outdoor signage printed on premium flex for shops, weddings, and political campaigns across Pokhara.",
  },
  {
    title: "Sublimation Gifts",
    tag: "Personalized",
    note: "Photo mugs, custom t-shirts, phone cases, and keepsake frames — vibrant prints produced for individuals, schools, and corporate giveaways.",
  },
  {
    title: "Trophies & Medals",
    tag: "Recognition",
    note: "Award trophies, medals, and engraved plaques delivered for sports tournaments, academic ceremonies, and company functions, retail and wholesale.",
  },
  {
    title: "Table Stands & Signage",
    tag: "Display",
    note: "Acrylic menu holders, nameplates, and display frames crafted for restaurants, offices, and exhibition booths with clean, durable finishes.",
  },
  {
    title: "Business Stationery",
    tag: "Branding",
    note: "Visiting cards, letterheads, brochures, and calendars designed and printed to give local businesses a consistent, professional identity.",
  },
  {
    title: "Wholesale Production",
    tag: "Bulk Orders",
    note: "High-volume runs of banners, mugs, stickers, and trophies fulfilled for resellers and event organizers on tight timelines.",
  },
];

const CAPABILITIES = [
  "In-house design",
  "Pre-press proofing",
  "Premium materials",
  "Custom sizing",
  "Lamination & finishing",
  "Rush turnaround",
  "Wholesale pricing",
  "Local delivery",
];

export default function Portfolio() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#003A4D] pt-32 pb-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 40% 60%, #003A4D 0%, transparent 65%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F0C924]">Portfolio</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <h1 className="premium-font-galdgderbold text-4xl leading-[1] text-white sm:text-5xl lg:text-7xl">
              A look at the work we print.
            </h1>
            <p className="border-l border-white/15 pl-6 text-sm leading-[1.9] text-white/60">
              From large-format banners to personalized sublimation gifts and custom trophies — here is the range of work we have delivered for retail and wholesale clients.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORK.map((item, index) => (
              <article key={item.title} className="group relative overflow-hidden border border-[#1A1A1A]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,45,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#003A4D]/25">
                <div className="absolute -right-4 -top-6 premium-font-galdgderbold text-8xl text-[#003A4D]/5">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-black text-[#F0C924]">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="mt-5 text-lg font-bold text-[#003A4D]">{item.title}</h2>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]/38">{item.tag}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/55">{item.note}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 bg-[#F2F0EC] p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F0C924]">How we work</p>
              <h2 className="mt-3 premium-font-galdgdersemi text-3xl text-[#003A4D]">Quality on every order.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/58">
                Each project gets attention to detail — from design and material choice to a final quality check before handover.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((cap) => (
                <div key={cap} className="border border-[#003A4D]/10 bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A]/75">
                  {cap}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border border-[#003A4D]/12 bg-[#003A4D] p-8 text-white">
            <h3 className="premium-font-galdgdersemi text-2xl">Have a project in mind?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
              Share your idea, size, quantity, and design. We will check what we can produce and get back to you with a quote within 24 hours.
            </p>
            <Link to="/contact" className="mt-6 inline-flex bg-[#F0C924] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#F0C924]/85">
              Start a project
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
