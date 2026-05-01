import React, { useState, useMemo } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import CountrySelector from "../components/ui/CountrySelector";
import { countries } from "../components/countries";

const STEPS = [
  { num: "01", title: "Send us your requirement", desc: "Fill the form or call us with your printing needs." },
  { num: "02", title: "We review your design", desc: "Our team checks specs and gets back within 24 hours." },
  { num: "03", title: "Confirm your order", desc: "We finalize materials, quantity, and delivery timeline." },
  { num: "04", title: "Pick up or delivery", desc: "Collect from our shop or we deliver to your location." },
];

const flagUrl   = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
const flagUrl2x = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

export default function Contact() {
  const [form, setForm]                       = useState({ name: "", email: "", message: "" });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phonePrefix, setPhonePrefix]         = useState("");
  const [phoneNumber, setPhoneNumber]         = useState("");
  const [submitted, setSubmitted]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");

  const API_URL = import.meta.env.PROD
    ? "/api/forms/contact"
    : "http://localhost:5300/api/forms/contact";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setPhonePrefix(country.countryCode);
  };

  const handlePhoneNumberChange = (e) =>
    setPhoneNumber(e.target.value.replace(/[^\d\s\-]/g, ''));

  const prefixFlag = useMemo(() => {
    if (selectedCountry) return selectedCountry;
    if (!phonePrefix || phonePrefix.length < 2) return null;
    return countries.find(c => c.countryCode === phonePrefix) ?? null;
  }, [phonePrefix, selectedCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fullPhone = phoneNumber ? `${phonePrefix} ${phoneNumber}`.trim() : phonePrefix;
      await axios.post(API_URL, {
        ...form,
        country: selectedCountry?.name ?? "",
        phone: fullPhone,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", message: "" });
    setSelectedCountry(null);
    setPhonePrefix("");
    setPhoneNumber("");
  };

  return (
    <>
      {/* ═══ SECTION 1 — Hero ═══ */}
      <section className="bg-white pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-start gap-10 lg:gap-16 lg:grid-cols-2">

            {/* Left — Headline + Contact Details */}
            <div>
              <h1 className="premium-font-galdgderbold text-3xl sm:text-4xl md:text-5xl text-[#1B4F8A] leading-tight">
                We are ready to help you print your vision
              </h1>
              <p className="mt-5 text-sm leading-relaxed text-[#1A1A1A]/50 max-w-md">
                Whether you need banners, sublimation items, trophies, or custom prints — our team is here to assist you every step of the way.
              </p>

              {/* Contact Info Grid */}
              <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Phone</h4>
                  <div className="mt-2 space-y-2 text-sm text-[#1A1A1A]/60 leading-relaxed">
                    <p>+977 [phone placeholder]</p>
                    <p>+977 [phone placeholder]</p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Email</h4>
                    <p className="mt-2 text-sm text-[#1A1A1A]/60 break-all">[email placeholder]</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Location</h4>
                    <p className="mt-2 text-sm text-[#1A1A1A]/60 leading-relaxed">
                      [Address placeholder],<br />Nepal
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Social</h4>
                    <div className="mt-3 flex items-center gap-4">
                      <a href="#" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A]/40 transition hover:text-[#1B4F8A]" aria-label="Facebook">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A]/40 transition hover:text-[#1B4F8A]" aria-label="Instagram">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="bg-[#1B4F8A]/5 backdrop-blur-sm p-6 sm:p-8 md:p-10">
              <h2 className="premium-font-galdgdersemi text-xl sm:text-2xl text-[#1B4F8A]">Get a Quote</h2>
              <p className="mt-2 text-sm text-[#1A1A1A]/50">
                Tell us what you need printed and we'll get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1B4F8A]/10 text-[#1B4F8A] mb-4">
                    <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Thank You for Your Inquiry!</h3>
                  <p className="mt-2 text-sm text-[#1A1A1A]/60">
                    We've received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-6 w-full bg-[#1B4F8A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1B4F8A]/90"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-[#1A1A1A]/8 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1B4F8A] focus:bg-white/80 placeholder:text-[#1A1A1A]/30"
                    placeholder="Full name"
                  />

                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-[#1A1A1A]/8 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1B4F8A] focus:bg-white/80 placeholder:text-[#1A1A1A]/30"
                    placeholder="Email"
                  />

                  <CountrySelector
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Country"
                    required
                  />

                  {/* Phone */}
                  <div className="flex border border-[#1A1A1A]/8 bg-white/60 backdrop-blur-sm focus-within:border-[#1B4F8A] focus-within:bg-white/80 transition-colors">
                    <div className="flex items-center gap-1.5 pl-3 pr-2 border-r border-[#1A1A1A]/8 flex-shrink-0">
                      {prefixFlag && (
                        <img
                          src={flagUrl(prefixFlag.code)}
                          srcSet={`${flagUrl2x(prefixFlag.code)} 2x`}
                          alt=""
                          className="w-5 h-4 object-contain flex-shrink-0"
                        />
                      )}
                      <input
                        type="text"
                        value={phonePrefix}
                        onChange={e => setPhonePrefix(e.target.value.replace(/[^\d+]/g, ''))}
                        placeholder="+977"
                        className="w-14 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#1A1A1A]/30 py-3"
                      />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="flex-1 bg-transparent px-3 py-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#1A1A1A]/30 min-w-0"
                      placeholder="Phone number"
                    />
                  </div>

                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border border-[#1A1A1A]/10 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1B4F8A] resize-none placeholder:text-[#1A1A1A]/30"
                    placeholder="What would you like to print? (size, quantity, material, etc.)"
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1B4F8A] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1B4F8A]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Sending..." : "Send a message"}</span>
                    {!loading && (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — Steps ═══ */}
      <section className="border-t border-[#1A1A1A]/8 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="premium-font-galdgdersemi text-xl sm:text-2xl text-[#1B4F8A] italic mb-10 sm:mb-14">
            How to work with Pokhrel Flex Printing
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col items-start">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border-2 border-[#1B4F8A] text-xs sm:text-sm font-bold text-[#1B4F8A]">
                  {step.num}
                </div>
                <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-[#1A1A1A]">{step.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-[#1A1A1A]/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
