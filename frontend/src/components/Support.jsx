import Footer from "./Footer";

export default function Support() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1B4F8A]/60">Customer Support</span>
        <h1 className="mt-4 premium-font-galdgderbold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight">
          We Are Here <span className="text-[#1B4F8A]">For You</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/55 max-w-lg">
          Our support team is available to help you with order issues, product questions, and general inquiries.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="border border-[#1B4F8A]/15 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center bg-[#1B4F8A] text-white mb-4">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-[#1A1A1A]">Email Support</h3>
            <p className="mt-1 text-sm text-[#1A1A1A]/55">Send us an email and we'll get back to you within 24 hours.</p>
            <a href="mailto:pokhrelflexprinting@gmail.com" className="mt-4 inline-block text-sm font-semibold text-[#1B4F8A] hover:text-[#F5A623] transition-colors">
              pokhrelflexprinting@gmail.com
            </a>
          </div>

          <div className="border border-[#1B4F8A]/15 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center bg-[#1B4F8A] text-white mb-4">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-bold text-[#1A1A1A]">Phone Support</h3>
            <p className="mt-1 text-sm text-[#1A1A1A]/55">Call or WhatsApp us during business hours.</p>
            <a href="tel:+977000000000" className="mt-4 inline-block text-sm font-semibold text-[#1B4F8A] hover:text-[#F5A623] transition-colors">
              +977 XXX XXX XXXX
            </a>
          </div>
        </div>

        <div className="mt-8 border border-[#1B4F8A]/15 bg-white p-6">
          <h3 className="font-bold text-[#1A1A1A]">Business Hours</h3>
          <div className="mt-4 space-y-2 text-sm text-[#1A1A1A]/60">
            <div className="flex justify-between">
              <span>Sunday – Friday</span>
              <span className="font-semibold text-[#1A1A1A]">9:00 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-semibold text-[#1A1A1A]">10:00 AM – 4:00 PM</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a href="/contact" className="inline-flex items-center gap-2 bg-[#1B4F8A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1B4F8A]/85 transition-colors">
            Send a Message
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
