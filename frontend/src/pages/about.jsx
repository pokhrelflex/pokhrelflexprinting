import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const STATS = [
  { value: "100+", label: "Products available" },
  { value: "25+", label: "Years experience" },
  { value: "500+", label: "Happy customers" },
  { value: "24hr", label: "Turnaround support" },
];

const VALUES = [
  {
    title: "Premium quality",
    body: "We use professional-grade materials and equipment to ensure every print looks sharp, vibrant, and durable.",
  },
  {
    title: "Retail & wholesale",
    body: "Whether you need one piece or a bulk order, we offer competitive pricing for individuals and businesses alike.",
  },
  {
    title: "Creative solutions",
    body: "From design assistance to custom formats, we help you bring your ideas to life with the right materials and finish.",
  },
];

const TIMELINE = [
  "Requirement review",
  "Design submission",
  "Pre-press check",
  "Material prep",
  "Printing",
  "Quality control",
  "Finishing",
  "Collection / delivery",
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#003A4D] pt-32 pb-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 40%, #003A4D 0%, transparent 65%)" }} />
        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-[#F0C924]">About Us</p>
            <h1 className="premium-font-galdgderbold text-4xl leading-[0.98] text-white sm:text-5xl lg:text-7xl">
              Your local printing partner, from design to delivery.
            </h1>
          </div>
          <div className="border-l border-white/15 pl-6">
            <p className="text-sm leading-[1.9] text-white/62">
              Pokhrel Flex Printing is based in Nepal and offers quality print solutions for retail customers, businesses, and wholesale buyers. We specialize in flex printing, sublimation products, trophies, and more.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex bg-[#F0C924] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#F0C924]/85"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F0EC] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[#003A4D]/10 px-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-[#F2F0EC] py-8 text-center">
              <div className="premium-font-galdgderbold text-3xl text-[#003A4D]">{stat.value}</div>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-18 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F0C924]">How we work</p>
              <h2 className="mt-4 premium-font-galdgdersemi text-3xl leading-tight text-[#003A4D]">
                Built for businesses and individuals who need quality prints, fast.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {VALUES.map((item) => (
                <div key={item.title} className="border border-[#1A1A1A]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,45,45,0.06)]">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#1A1A1A]/55">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border border-[#003A4D]/12 bg-[#003A4D]/5 p-6 sm:p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.22em] text-[#003A4D]">Our printing process</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TIMELINE.map((step, index) => (
                <div key={step} className="border border-[#003A4D]/12 bg-white px-4 py-4">
                  <span className="text-xs font-black text-[#F0C924]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-xs font-semibold text-[#1A1A1A]/75">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
