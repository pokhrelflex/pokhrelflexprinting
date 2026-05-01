import { useState } from "react";
import Footer from "./Footer";

const FAQS = [
  { q: "What printing services do you offer?", a: "We offer vinyl/flex printing, sublimation printing (mugs, cups, t-shirts), trophies, medals, table stands, and many more custom printing products." },
  { q: "Do you offer wholesale pricing?", a: "Yes! We offer wholesale pricing for bulk orders. Contact us with your quantity requirements and we will provide you a competitive quote." },
  { q: "What is the minimum order quantity?", a: "Minimum order quantities vary by product. For sublimation cups and mugs, there is no minimum. For flex banners, we accept single pieces. Contact us for specific product MOQs." },
  { q: "How long does an order take?", a: "Standard turnaround is 1-3 business days for most products. Rush orders can be accommodated. Large or complex orders may take longer — we will confirm timelines when you place your order." },
  { q: "Do you deliver?", a: "Yes, we offer local delivery within our service area. We also ship nationwide. Delivery costs are calculated based on your location and order size." },
  { q: "Can I provide my own design?", a: "Absolutely! You can send us your design files (PDF, AI, CDR, PSD, PNG/JPG at 300 DPI minimum). Our team will review them and notify you if adjustments are needed." },
  { q: "Do you offer design services?", a: "Yes, our in-house design team can create designs for you. Design charges apply depending on complexity. Contact us to discuss your design needs." },
  { q: "What payment methods do you accept?", a: "We accept cash, bank transfer, and digital payment methods. For large orders, we may require a deposit. Contact us for payment details." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1B4F8A]/60">Support</span>
        <h1 className="mt-4 premium-font-galdgderbold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight">
          Frequently Asked <span className="text-[#1B4F8A]">Questions</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/55 max-w-lg">
          Everything you need to know about our printing services. Can't find the answer? Contact us directly.
        </p>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-[#1B4F8A]/10 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#1A1A1A] hover:bg-[#1B4F8A]/5 transition-colors min-h-[44px]"
              >
                <span>{faq.q}</span>
                <svg className={`h-4 w-4 shrink-0 ml-4 transition-transform duration-200 text-[#F5A623] ${open === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-[#1A1A1A]/60 border-t border-[#1B4F8A]/8">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#1B4F8A] text-white">
          <h3 className="font-bold text-lg">Still have questions?</h3>
          <p className="mt-1 text-sm text-white/70">Our team is happy to help you with any enquiry.</p>
          <a href="/contact" className="mt-4 inline-flex items-center gap-2 bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#F5A623]/85 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
