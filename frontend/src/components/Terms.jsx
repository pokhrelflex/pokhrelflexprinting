import Footer from "./Footer";

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F0EC" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        <h1 className="premium-font-galdgderbold text-3xl sm:text-4xl text-[#1A1A1A] leading-tight">Terms & Conditions</h1>
        <p className="mt-2 text-xs text-[#1A1A1A]/40">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 prose prose-sm max-w-none text-[#1A1A1A]/65 space-y-6">
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Acceptance of Terms</h2>
            <p>By using our services or placing an order, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Orders & Payment</h2>
            <p>All orders are subject to availability. Payment must be confirmed before production begins. For custom orders, a deposit may be required. Prices are subject to change without notice.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Design & Artwork</h2>
            <p>Customers are responsible for ensuring their submitted artwork is correct. We are not liable for errors in customer-supplied designs. We reserve the right to refuse printing of content that violates laws or our standards.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Returns & Refunds</h2>
            <p>Custom printed items cannot be returned unless there is a defect in printing quality or materials. Please inspect your order upon receipt and report any issues within 48 hours.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Limitation of Liability</h2>
            <p>Our liability is limited to the value of the order placed. We are not responsible for indirect or consequential damages resulting from delays or product issues.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Contact</h2>
            <p>Questions about these Terms? Contact us at <a href="mailto:pokhrelflexprinting@gmail.com" className="text-[#1B4F8A] hover:underline">pokhrelflexprinting@gmail.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
