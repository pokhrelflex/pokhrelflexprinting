import { useRef } from "react";

// Segmented 6-digit code input — renders one box per digit (placeholder "_"),
// auto-advances on type, steps back on Backspace, and accepts a pasted code.
// Parent owns the value (a string); remount via a changing `key` to clear.
export default function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const set = (i, char) => {
    const arr = Array.from({ length }, (_, k) => value[k] ?? "");
    arr[i] = char;
    onChange(arr.join("").slice(0, length));
  };

  const handleChange = (i, e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      set(i, "");
      return;
    }
    set(i, digits[digits.length - 1]);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      refs.current[i - 1]?.focus();
      set(i - 1, "");
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    onChange(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          autoFocus={i === 0}
          placeholder="_"
          value={chars[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="h-14 w-12 rounded-xl border border-gray-300 bg-white text-center text-2xl font-semibold text-[#1d1d1f] outline-none transition placeholder:text-gray-300 focus:border-[#1B4F8A] focus:ring-2 focus:ring-[#1B4F8A]/15"
        />
      ))}
    </div>
  );
}
