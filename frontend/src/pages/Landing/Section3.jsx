import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  useSpring,
  wrap,
} from "framer-motion";

const PRODUCTS = [
  { num: "01", name: "Visiting Card",      tag: "Identity" },
  { num: "02", name: "Badge Printing",     tag: "Identity" },
  { num: "03", name: "Cup Printing",       tag: "Sublimation" },
  { num: "04", name: "Signage Board",      tag: "Spatial" },
  { num: "05", name: "T-shirt Print",      tag: "Apparel" },
  { num: "06", name: "Advertising Board",  tag: "Outdoor" },
  { num: "07", name: "Event Banners",      tag: "Events" },
  { num: "08", name: "Trophies & Medals",  tag: "Recognition" },
  { num: "09", name: "ID Card Printing",   tag: "Identity" },
  { num: "10", name: "Vinyl Stickers",     tag: "Adhesive" },
  { num: "11", name: "Sublimation Prints", tag: "Heat Transfer" },
  { num: "12", name: "Menu Designs",       tag: "Hospitality" },
];

// 12 cards = 1 copy = 25 baseX units. Each card advanced per scroll distance
// is driven by this number — higher = more cards per scroll = faster scrub.
const CARDS_TO_SHOW = 11;
const COPY_UNITS = 25;
const TOTAL_CARDS = PRODUCTS.length;
const SCROLL_BASEX_END = (CARDS_TO_SHOW / TOTAL_CARDS) * COPY_UNITS;
// Drift rate: baseVelocity units → baseX units/sec. baseVelocity=1 gives a
// slow but clearly visible ambient drift (~7 px/s on desktop strip).
const DRIFT_RATE_PER_UNIT = 0.04;

function ProductCard({ num, name, tag }) {
  return (
    <div className="shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] mr-4 sm:mr-6 group">
      {/* Text above the visual — not inside the box */}
      <div className="mb-4 sm:mb-5">
        <h3
          className="font-light text-[#6F1C00] leading-tight tracking-tight"
          style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}
        >
          {name}
        </h3>
        <p className="mt-1 text-[10px] sm:text-xs font-light uppercase tracking-[0.06em] text-[#1A1A1A]/45">
          {tag}
        </p>
      </div>
      {/* Visual block */}
      <div className="aspect-[4/5] relative overflow-hidden bg-[#003A4D] transition-colors duration-500 group-hover:bg-[#001E2C]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="premium-font-galdgderbold text-white/[0.07] leading-none select-none"
            style={{ fontSize: "clamp(7rem, 11vw, 13rem)" }}
          >
            {num}
          </span>
        </div>
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F0C924]">
            [{num}]
          </span>
        </div>
        <div className="absolute bottom-0 left-0 h-[3px] w-12 bg-[#F0C924] transition-all duration-500 group-hover:w-24" />
      </div>
    </div>
  );
}

function ProductMarquee({ products, scrollProgress, baseVelocity = 1 }) {
  const prefersReducedMotion = useReducedMotion();

  // Scroll-tied baseline — scroll [0, 1] → baseX [0, SCROLL_BASEX_END]
  const scrollBaseXRaw = useTransform(scrollProgress, [0, 1], [0, SCROLL_BASEX_END]);
  // Spring-smooth the scroll-tied component for buttery scrubbing
  const scrollBaseX = useSpring(scrollBaseXRaw, { stiffness: 200, damping: 40, mass: 0.5 });
  // Continuous ambient drift accumulator — never pauses
  const driftX = useMotionValue(0);
  // Combined position
  const baseX = useTransform([scrollBaseX, driftX], ([s, d]) => s + d);
  const x = useTransform(baseX, (v) => `-${wrap(0, COPY_UNITS, v)}%`);

  useAnimationFrame((t, delta) => {
    if (prefersReducedMotion) return;
    const driftDeltaUnits = baseVelocity * DRIFT_RATE_PER_UNIT * (delta / 1000);
    driftX.set(driftX.get() + driftDeltaUnits);
  });

  return (
    <div
      className="overflow-hidden w-full"
      aria-hidden={prefersReducedMotion ? undefined : "true"}
    >
      <motion.div className="flex w-max" style={{ x, willChange: "transform" }}>
        {[0, 1, 2, 3].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {products.map((p) => (
              <ProductCard key={`${dup}-${p.num}`} {...p} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Section3() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-white"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 h-[100vh] min-h-[640px] flex flex-col justify-start pt-20 sm:pt-24 lg:pt-28 overflow-hidden">
        {/* ── Heading block ── */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 mb-10 sm:mb-14 lg:mb-16">
          <div className="text-center">
            <h2
              className="premium-font-galdgderbold uppercase text-[#003A4D] leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 6vw, 4.75rem)" }}
            >
              Everything your
              <br />
              brand prints.
            </h2>
          </div>
        </div>

        {/* ── Sticky-pinned marquee: scroll-tied + ambient auto-drift ── */}
        <ProductMarquee products={PRODUCTS} scrollProgress={scrollYProgress} baseVelocity={10} />
      </div>
    </section>
  );
}
