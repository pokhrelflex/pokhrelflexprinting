import { useRef, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap,
} from "framer-motion";

const PRODUCT_IMAGES = [
  "/Images/visiting card.jpg",
  "/Images/badge.jpg",
  "/Images/cup.jpg",
  "/Images/signage.jpg",
  "/Images/machines.jpg",
  "/Images/advertisement.jpg",
  "/Images/wedding.jpg",
  "/Images/trophy.jpg",
  "/Images/id.jpg",
  "/Images/venyl.jpg",
  "/Images/sublimation.jpg",
  "/Images/menu.jpg",
];
const PRODUCT_COUNT = PRODUCT_IMAGES.length;

// 3 copies — translateX(-COPY_UNITS%) of total width = exactly 1 copy width
// (so wrap is seamless). Fewer copies = fewer composited cards on screen.
const COPY_COUNT = 3;
const COPY_UNITS = 100 / COPY_COUNT;
const CARDS_TO_SHOW = 11;
const SCROLL_BASEX_END = (CARDS_TO_SHOW / PRODUCT_COUNT) * COPY_UNITS;
const DRIFT_RATE_PER_UNIT = 0.04;

const ProductCard = memo(function ProductCard({ num, name, tag, img }) {
  return (
    <div className="shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] mr-4 sm:mr-6 group">
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
      <div className="aspect-[4/5] relative overflow-hidden bg-[#003A4D]">
        {img && (
          <img
            src={img}
            alt={name}
            width="340"
            height="425"
            decoding="async"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001E2C]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="premium-font-galdgderbold text-white/15 leading-none select-none"
            style={{ fontSize: "clamp(5rem, 8vw, 9rem)" }}
          >
            {num}
          </span>
        </div>
        <div className="pointer-events-none absolute top-5 left-5 sm:top-6 sm:left-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F0C924]">
            [{num}]
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-12 bg-[#F0C924]" />
      </div>
    </div>
  );
});

function ProductMarquee({ scrollProgress, baseVelocity = 1, active }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const items = t("section3.items", { returnObjects: true });

  const scrollBaseX = useTransform(scrollProgress, [0, 1], [0, SCROLL_BASEX_END]);
  const driftX = useMotionValue(0);
  const baseX = useTransform([scrollBaseX, driftX], ([s, d]) => s + d);
  const x = useTransform(baseX, (v) => `-${wrap(0, COPY_UNITS, v)}%`);

  useAnimationFrame((_t, delta) => {
    if (prefersReducedMotion || !active) return;
    const driftDeltaUnits = baseVelocity * DRIFT_RATE_PER_UNIT * (delta / 1000);
    driftX.set(driftX.get() + driftDeltaUnits);
  });

  return (
    <div
      className="overflow-hidden w-full"
      aria-hidden={prefersReducedMotion ? undefined : "true"}
    >
      <motion.div className="flex w-max" style={{ x, willChange: "transform" }}>
        {Array.from({ length: COPY_COUNT }, (_, dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((p, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <ProductCard
                  key={`${dup}-${num}`}
                  num={num}
                  name={p.name}
                  tag={p.tag}
                  img={PRODUCT_IMAGES[i]}
                />
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Section3() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const { t, i18n } = useTranslation();
  const isNepali = i18n.language === "ne";
  const headingFontSize = isNepali
    ? "clamp(1.6rem, 4.2vw, 3.3rem)"
    : "clamp(2.25rem, 6vw, 4.75rem)";
  const headingLineHeight = isNepali ? 1.3 : 0.92;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-white"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 h-[100vh] min-h-[640px] flex flex-col justify-start pt-20 sm:pt-24 lg:pt-28 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 mb-10 sm:mb-14 lg:mb-16">
          <div className="text-center">
            <h2
              className="premium-font-galdgderbold uppercase text-[#003A4D] tracking-tight"
              style={{ fontSize: headingFontSize, lineHeight: headingLineHeight }}
            >
              {t("section3.headlineA")}
              {!isNepali && (
                <>
                  <br />
                  {t("section3.headlineB")}
                </>
              )}
            </h2>
          </div>
        </div>

        <ProductMarquee
          scrollProgress={scrollYProgress}
          baseVelocity={10}
          active={inView}
        />
      </div>
    </section>
  );
}
