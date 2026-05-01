import React from "react";
import Footer from "../components/Footer";

const NOTICES = [
  {
    date: "2026-04-15",
    tag: "Holiday",
    title: "Closed for Nepali New Year",
    body: "Our workshop will be closed on Baisakh 1 (April 14) for Nepali New Year celebrations. Orders placed before April 12 will be delivered on time. Operations resume April 15.",
  },
  {
    date: "2026-03-28",
    tag: "New Service",
    title: "Same-day flex banner printing now available",
    body: "Need a banner urgently? We now offer same-day printing on standard flex banners up to 8 ft for orders placed before 11 AM. Surcharge applies. Contact us for details.",
  },
  {
    date: "2026-03-10",
    tag: "Pricing",
    title: "Wholesale rates updated for trophies and medals",
    body: "We have refreshed our wholesale pricing for trophy and medal bulk orders (50+ pieces). Reach out for an updated quote — savings of up to 18% on previous tiers.",
  },
  {
    date: "2026-02-22",
    tag: "Workshop",
    title: "New sublimation press installed",
    body: "We have upgraded our sublimation equipment to handle larger formats and faster turnaround. Mug, cup, and t-shirt orders now ship 1-2 days sooner on average.",
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Notices() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#003A4D] pt-32 pb-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 40%, #F0C924 0%, transparent 60%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F0C924]">Notices</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <h1 className="premium-font-galdgderbold text-4xl leading-[1] text-white sm:text-5xl lg:text-7xl">
              Updates from the workshop.
            </h1>
            <p className="border-l border-white/15 pl-6 text-sm leading-[1.9] text-white/60">
              Holiday closures, new equipment, pricing updates, and announcements — everything you should know before placing your next order.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <ul className="space-y-5">
            {NOTICES.map((notice) => (
              <li
                key={notice.date + notice.title}
                className="group relative overflow-hidden border border-[#1A1A1A]/10 bg-white p-6 sm:p-8 shadow-[0_14px_34px_rgba(45,45,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#003A4D]/25"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex bg-[#F0C924] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#003A4D]">
                    {notice.tag}
                  </span>
                  <time className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1A1A]/45">
                    {formatDate(notice.date)}
                  </time>
                </div>
                <h2 className="premium-font-galdgdersemi text-xl sm:text-2xl text-[#003A4D] leading-tight">
                  {notice.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/65">
                  {notice.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 border border-[#003A4D]/12 bg-[#003A4D] p-8 text-white">
            <h3 className="premium-font-galdgdersemi text-2xl">Want notices in your inbox?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
              Subscribe to our newsletter from the footer and we will send you updates on holiday hours, pricing changes, and new services.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
