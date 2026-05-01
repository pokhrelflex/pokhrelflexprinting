import Footer from "./Footer";

const TOPICS = [
  { title: "Placing an Order", desc: "Learn how to place an order for printing products — online, by phone, or in person.", link: "/contact" },
  { title: "Design & File Requirements", desc: "Find out what file formats we accept and how to prepare your artwork for print.", link: "/faq" },
  { title: "Pricing & Quotes", desc: "Understand how we price our products and how to request a custom quote.", link: "/contact" },
  { title: "Delivery & Pickup", desc: "Information about delivery options, shipping areas, and store pickup.", link: "/faq" },
  { title: "Bulk & Wholesale Orders", desc: "How to order in bulk and get wholesale pricing for your business.", link: "/contact" },
  { title: "After-Sale Support", desc: "What to do if there is an issue with your order.", link: "/support" },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#003A4D" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F0C924]/80">Help Center</span>
        <h1 className="mt-4 premium-font-galdgderbold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
          How Can We Help?
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-lg">
          Browse the topics below to find the information you need. For direct assistance, contact our team.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic) => (
            <a
              key={topic.title}
              href={topic.link}
              className="group border border-white/10 bg-white/5 p-5 hover:border-[#F0C924]/40 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="font-bold text-white group-hover:text-[#F0C924] transition-colors text-sm">{topic.title}</h3>
              <p className="mt-2 text-xs text-white/50 leading-relaxed">{topic.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#F0C924]">
                Learn more
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
