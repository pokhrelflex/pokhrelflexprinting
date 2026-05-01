import Footer from "./Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        <h1 className="premium-font-galdgderbold text-3xl sm:text-4xl text-[#1A1A1A] leading-tight">Privacy Policy</h1>
        <p className="mt-2 text-xs text-[#1A1A1A]/40">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 prose prose-sm max-w-none text-[#1A1A1A]/65 space-y-6">
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Information We Collect</h2>
            <p>We collect information you provide directly to us, including name, email address, phone number, and any messages you send through our contact form. We also collect information automatically when you visit our website.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">How We Use Your Information</h2>
            <p>We use the information we collect to respond to your inquiries, process orders, send order updates, and improve our services. We do not sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Cookies</h2>
            <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:pokhrelflexprinting@gmail.com" className="text-[#1B4F8A] hover:underline">pokhrelflexprinting@gmail.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
