import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";

const FULL_TEXT = "We Print Your Vision.";
const TYPE_SPEED = 140;
const CURSOR_BLINK_DURATION = 600;

function createCinematicBoom() {
  const sampleRate = 44100;
  const duration = 2.5;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const w = (off, str) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
  w(0, "RIFF"); view.setUint32(4, 36 + numSamples * 2, true);
  w(8, "WAVE"); w(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  w(36, "data"); view.setUint32(40, numSamples * 2, true);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const boom = Math.sin(2 * Math.PI * 50 * t) * Math.exp(-t * 2.0) * 0.6;
    const noise = (Math.random() * 2 - 1);
    const whooshEnv = Math.exp(-Math.pow(t - 0.3, 2) / 0.08) * 0.25;
    const whoosh = noise * whooshEnv;
    const impact = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 30) * 0.5;
    const rumble = Math.sin(2 * Math.PI * 35 * t + Math.sin(2 * Math.PI * 0.5 * t) * 2) * Math.exp(-t * 1.2) * 0.3;
    const shimmerEnv = Math.exp(-Math.pow(t - 0.5, 2) / 0.15) * 0.08;
    const shimmer = Math.sin(2 * Math.PI * 800 * t) * shimmerEnv;
    const val = Math.max(-1, Math.min(1, boom + whoosh + impact + rumble + shimmer));
    view.setInt16(44 + i * 2, val * 32767, true);
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function createClickWav() {
  const sampleRate = 44100;
  const duration = 0.08;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const w = (off, str) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
  w(0, "RIFF"); view.setUint32(4, 36 + numSamples * 2, true);
  w(8, "WAVE"); w(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  w(36, "data"); view.setUint32(40, numSamples * 2, true);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const click = Math.exp(-t * 300) * (Math.random() * 2 - 1) * 0.7;
    const tock = Math.sin(2 * Math.PI * 3500 * t) * Math.exp(-t * 80) * 0.5;
    const thud = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 60) * 0.4;
    const shimmer = Math.sin(2 * Math.PI * 6000 * t) * Math.exp(-t * 200) * 0.25;
    const spring = Math.sin(2 * Math.PI * 4200 * t + Math.sin(t * 500) * 3) * Math.exp(-t * 40) * 0.15;
    const val = Math.max(-1, Math.min(1, click + tock + thud + shimmer + spring));
    view.setInt16(44 + i * 2, val * 32767, true);
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

const POOL_SIZE = 6;
let clickPool = [];
let poolIdx = 0;
let boomAudio = null;

function initAudio() {
  if (clickPool.length > 0) return;
  const clickUrl = createClickWav();
  for (let i = 0; i < POOL_SIZE; i++) {
    const a = new Audio(clickUrl);
    a.volume = 1.0;
    clickPool.push(a);
  }
  boomAudio = new Audio(createCinematicBoom());
  boomAudio.volume = 0.7;
}

function playTypeSound() {
  try {
    const a = clickPool[poolIdx % POOL_SIZE];
    poolIdx++;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (_) {}
}

function playCinematicBoom() {
  try {
    if (boomAudio) { boomAudio.currentTime = 0; boomAudio.play().catch(() => {}); }
  } catch (_) {}
}

export default function Section1() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const hasVisited = useRef(typeof localStorage !== "undefined" && localStorage.getItem("pfp_intro_seen") === "1");
  const [entered, setEntered] = useState(hasVisited.current);
  const [introFading, setIntroFading] = useState(false);
  const [printValue, setPrintValue] = useState("");

  const GREETING = "Welcome! We are printing specialists ready to bring your ideas to life.";
  const [greetTyped, setGreetTyped] = useState(0);
  const [greetDone, setGreetDone] = useState(false);
  const [greetFading, setGreetFading] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const [typedCount, setTypedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLogoVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (entered || !logoVisible) return;
    if (greetDone) return;
    if (greetTyped < GREETING.length) {
      const lastChar = GREETING[greetTyped - 1];
      const delay = lastChar === "," ? 400 : lastChar === "." ? 600 : 45;
      const t = setTimeout(() => setGreetTyped((c) => c + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setGreetDone(true);
      setGreetFading(true);
      setTimeout(() => setShowInput(true), 800);
    }, 600);
    return () => clearTimeout(t);
  }, [entered, logoVisible, greetTyped, greetDone, GREETING.length]);

  function handleEnter() {
    if (introFading) return;
    initAudio();
    playCinematicBoom();
    api.post("/api/leads", { print: printValue }).catch(() => {});
    setIntroFading(true);
    setTimeout(() => {
      setEntered(true);
      try { localStorage.setItem("pfp_intro_seen", "1"); } catch (_) {}
    }, 800);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleEnter();
  }

  useEffect(() => {
    if (!entered) return;
    if (typedCount < FULL_TEXT.length) {
      const t = setTimeout(() => {
        playTypeSound();
        setTypedCount((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    }
    const blinkInterval = setInterval(() => setCursorVisible((v) => !v), 300);
    const hideTimer = setTimeout(() => {
      clearInterval(blinkInterval);
      setShowCursor(false);
      setTypingDone(true);
      window.dispatchEvent(new CustomEvent("hero-typing-done"));
    }, CURSOR_BLINK_DURATION);
    return () => { clearInterval(blinkInterval); clearTimeout(hideTimer); };
  }, [entered, typedCount]);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionHeight = el.offsetHeight;
    const raw = -rect.top / (sectionHeight - window.innerHeight);
    setScrollProgress(Math.max(0, Math.min(1, raw)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const titleFade = Math.max(0, Math.min(1, 1 - scrollProgress / 0.20));
  const titleScale = 1 + scrollProgress * 0.06;
  const splitProgress = Math.max(0, Math.min(1, scrollProgress / 0.20));
  const splitDistance = splitProgress * 60;
  const caveProgress = Math.max(0, Math.min(1, (scrollProgress - 0.10) / 0.45));
  const revealProgress = Math.max(0, Math.min(1, (scrollProgress - 0.50) / 0.35));
  const circleRadius = 3 + caveProgress * 115;
  const videoY = (1 - caveProgress) * 20;

  const typed = FULL_TEXT.slice(0, typedCount);
  const leftText = typed.slice(0, 2);
  const rightText = typed.slice(2);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "220vh" }}>

      {/* ====== INTRO OVERLAY ====== */}
      {!entered && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-800 ${introFading ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
          style={{ background: "#0D1F3C" }}
        >
          <div className="absolute top-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#F5A623]/5 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[10%] h-[350px] w-[350px] rounded-full bg-white/3 blur-[100px] animate-pulse-slow" style={{ animationDelay: "3s" }} />

          {!showInput && (
            <div className={`relative z-10 flex flex-col items-center max-w-2xl px-6 transition-all duration-1000 ${greetFading ? "opacity-0 scale-95 blur-sm translate-y-[-40px]" : "opacity-100"}`}>
              <div className={`transition-all duration-[1200ms] ease-out ${logoVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                <div className="flex items-center justify-center h-24 w-24 mx-auto" style={{ background: "rgba(245,166,35,0.9)", borderRadius: "16px" }}>
                  <span className="font-black text-4xl text-white">PF</span>
                </div>
              </div>
              <div className="mt-8 text-center min-h-[5rem]">
                <p className="premium-font-galdgdersemi text-base sm:text-lg lg:text-xl leading-relaxed" style={{ color: "#F2F0EC" }}>
                  {greetTyped <= 8
                    ? <span style={{ color: "#F5A623" }}>{GREETING.slice(0, greetTyped)}</span>
                    : <><span style={{ color: "#F5A623" }}>{GREETING.slice(0, 8)}</span>{GREETING.slice(8, greetTyped)}</>
                  }
                  {!greetDone && (
                    <span className="inline-block w-[2px] ml-1 animate-pulse" style={{ height: "0.85em", backgroundColor: "#F5A623", verticalAlign: "baseline" }} />
                  )}
                </p>
              </div>
            </div>
          )}

          <div className={`absolute z-10 flex flex-col items-center w-full max-w-sm sm:max-w-md px-4 sm:px-6 transition-all duration-1000 ease-out ${showInput ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95 pointer-events-none"}`}>
            <div className="relative mb-6 flex items-center justify-center h-12 w-12" style={{ background: "rgba(245,166,35,0.9)", borderRadius: "10px" }}>
              <span className="font-black text-xl text-white">PF</span>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={printValue}
                  onChange={(e) => setPrintValue(e.target.value)}
                  placeholder="What are you looking to print?"
                  className="w-full border border-white/15 bg-white/5 px-6 py-4 pr-14 text-sm text-white placeholder-white/30 backdrop-blur-md outline-none transition-all duration-300 focus:border-[#F5A623]/50 focus:bg-white/8"
                  style={{ caretColor: "#F5A623" }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[#F5A623] text-white transition-all duration-300 hover:bg-[#F5A623]/90 hover:scale-110 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ====== LAYER 1: Dark bg + title ====== */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{
            opacity: Math.max(titleFade, caveProgress < 1 ? 0.001 : 0),
            pointerEvents: titleFade < 0.05 ? "none" : "auto",
            background: "#0D1F3C",
          }}
        >
          <div className="absolute top-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#F5A623]/8 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[10%] h-[350px] w-[350px] rounded-full bg-white/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: "3s" }} />

          <div className="relative z-10 px-6 w-full flex items-center justify-center overflow-hidden -mt-16">
            {!typingDone ? (
              <span className="premium-font-galdgderbold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1] whitespace-nowrap">
                <span style={{ color: "#F2F0EC" }}>{leftText}</span>
                {rightText && (
                  <>
                    <span style={{ color: "#F2F0EC" }}>{rightText.startsWith("Pr") ? rightText.slice(0, 5) : ""}</span>
                    {rightText.length > 5 && (
                      <span className="bg-gradient-to-r from-[#F5A623] via-yellow-300 to-[#F5A623] bg-clip-text text-transparent">
                        {rightText.slice(5)}
                      </span>
                    )}
                  </>
                )}
                {showCursor && (
                  <span
                    className="inline-block w-[3px] ml-1"
                    style={{ height: "0.85em", backgroundColor: "#F2F0EC", opacity: cursorVisible ? 1 : 0, verticalAlign: "baseline", transition: "opacity 0.1s" }}
                  />
                )}
              </span>
            ) : (
              <>
                <span
                  className="premium-font-galdgderbold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1] whitespace-nowrap"
                  style={{ transform: `translateX(-${splitDistance}%) scale(${titleScale})`, color: "#F2F0EC" }}
                >
                  We{" "}
                </span>
                <span
                  className="premium-font-galdgderbold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1] whitespace-nowrap"
                  style={{ transform: `translateX(${splitDistance}%) scale(${titleScale})` }}
                >
                  <span style={{ color: "#F2F0EC" }}>Print </span>
                  <span className="bg-gradient-to-r from-[#F5A623] via-yellow-300 to-[#F5A623] bg-clip-text text-transparent">
                    Your Vision.
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* ====== LAYER 2: Cave mask ====== */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "#0D1F3C",
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${circleRadius}%, black ${circleRadius + 2}%)`,
            maskImage: `radial-gradient(circle at 50% 50%, transparent ${circleRadius}%, black ${circleRadius + 2}%)`,
            opacity: caveProgress >= 1 ? 0 : 1,
            transition: caveProgress >= 1 ? "opacity 0.5s" : "none",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `radial-gradient(ellipse at 50% 50%, transparent ${Math.max(0, circleRadius - 4)}%, rgba(0,0,0,0.4) ${circleRadius - 1}%, black ${circleRadius + 5}%)`,
              maskImage: `radial-gradient(ellipse at 50% 50%, transparent ${Math.max(0, circleRadius - 4)}%, rgba(0,0,0,0.4) ${circleRadius - 1}%, black ${circleRadius + 5}%)`,
              background: "linear-gradient(135deg, #0D1F3C 0%, #091628 100%)",
            }}
          />
        </div>

        {/* ====== LAYER 3: Video ====== */}
        <div className="absolute inset-0 z-10">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: `translateY(${videoY}px) scale(1.1)` }}
            autoPlay muted loop playsInline
          >
            <source src="https://assets.mixkit.co/videos/4672/4672-720.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* ====== LAYER 4: Revealed content ====== */}
        <div
          className="absolute inset-0 z-40 flex items-end justify-center pb-16 sm:pb-20 pointer-events-none"
          style={{ opacity: revealProgress, transform: `translateY(${(1 - revealProgress) * 80}px)` }}
        >
          <div className="text-center px-4 sm:px-6 pointer-events-auto">
            <h2 className="premium-font-galdgderbold text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1]">
              Quality Printing, Every Time
            </h2>
            <p className="mt-3 sm:mt-4 mx-auto max-w-xl text-xs sm:text-base text-white/60 leading-relaxed">
              Vinyl printing, sublimation, trophies, medals, table stands and much more — retail and wholesale available.
            </p>
            <div
              className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              style={{ opacity: Math.max(0, (revealProgress - 0.3) / 0.7), transform: `translateY(${Math.max(0, (1 - revealProgress) * 30)}px)` }}
            >
              <a href="#how-it-works" className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden bg-[#F5A623] px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,166,35,0.5)] hover:scale-105">
                <span className="relative z-10">Order Now</span>
                <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </a>
              <Link to="/contact" className="group inline-flex items-center gap-2 sm:gap-3 border border-white/25 bg-white/5 px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/15 hover:scale-105">
                <svg className="h-4 w-4 text-[#F5A623] transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {caveProgress > 0 && caveProgress < 1 && (
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: `inset 0 0 ${100 + (1 - caveProgress) * 200}px ${50 + (1 - caveProgress) * 100}px rgba(13,31,60,${0.8 * (1 - caveProgress)})`,
            zIndex: 25,
          }} />
        )}
      </div>
    </section>
  );
}
