# Skills Reference – Pokhrel Flex Printing Website

## UI/UX & Responsive Design

### Responsive Breakpoints (Tailwind)

| Prefix | Min-width | Target               |
|--------|-----------|----------------------|
| (none) | 0px       | Mobile first (base)  |
| `sm:`  | 640px     | Large mobile / small tablet |
| `md:`  | 768px     | Tablet               |
| `lg:`  | 1024px    | Desktop              |
| `xl:`  | 1280px    | Wide desktop         |

**Pattern used throughout the codebase:**
```jsx
// Text scales up with screen size
<h1 className="text-2xl sm:text-4xl lg:text-5xl">

// Grid adapts from 1 column on mobile to multi-column on desktop
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

// Spacing grows with screen size
<section className="py-16 sm:py-20 lg:py-24">
```

### Touch Targets

All interactive elements meet the 44px minimum touch target:
```jsx
// Buttons use min-h-11 (44px) or explicit py-3 + text-sm = ~44px
<button className="min-h-[44px] px-4 py-3 touch-manipulation">
```

### Motion & Accessibility

```jsx
// Scroll reveal animation with reduced-motion support
<div className={`transition-all duration-700 motion-reduce:transition-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

// Framer Motion with reduced motion
const prefersReducedMotion = useReducedMotion();
// Pass reducedMotion flag to skip spring animations
```

---

## Scroll Animations

### `useScrollReveal` hook

```js
// frontend/src/pages/Landing/useScrollReveal.js
const [ref, visible] = useScrollReveal(threshold);
// threshold: 0.0–1.0, portion of element visible before triggering
```

Typical thresholds:
- `0.08` — hero sections (trigger early)
- `0.1–0.15` — standard sections
- `0.3` — stat counters (need more context)

### Framer Motion Scroll-Driven Stack (Section4)

```jsx
const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
const rawY = useTransform(scrollYProgress, [entryStart, entryEnd], [startY, endY]);
const y = useSpring(rawY, { stiffness: 220, damping: 32, mass: 0.55 });
```

- Section height: `500vh` mobile / `560vh` desktop
- Cards animate in sequentially as user scrolls
- `sticky` inner container keeps cards visible during scroll

---

## Component Patterns

### Section Background Alternation

Landing page sections alternate backgrounds:
```
Section1 — dark: #0D1F3C (cinematic intro)
Section2 — light: #F2F0EC (about + stats strip #1B4F8A)
Section3 — dark: #0D1F3C (process carousel)
Section4 — light: #F2F0EC (product overview + card stack)
Section5 — light: #F2F0EC (categories + process pipeline)
Section6 — dark: #0D1F3C (mission quote)
```

### Glass Card Pattern

```jsx
<div className="border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:border-[#F5A623]/35 hover:bg-white/[0.14]">
```

### Pill Badge / Tag

```jsx
<span className="inline-flex bg-[#1B4F8A]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4F8A]">
  Full Range
</span>
```

### Amber Accent Divider

```jsx
<div className="inline-block h-px w-24 bg-[#F5A623]/70" />
```

---

## Typography

### Font Classes

```css
/* In index.css */
.premium-font-galdgderbold   { font-family: "Galderglynn Titling Bd"; }
.premium-font-galdgdersemi   { font-family: "Galderglynn Titling SmBd"; }
```

### Heading Scale

```jsx
// Hero headings
<h1 className="premium-font-galdgderbold text-[2.5rem] sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.95]">

// Section headings
<h2 className="premium-font-galdgderbold text-2xl sm:text-4xl lg:text-5xl leading-tight">

// Card headings
<h3 className="premium-font-galdgderbold text-[1.4rem] sm:text-[1.8rem] lg:text-[2rem] leading-tight">
```

---

## Form Handling

### Contact Form Pattern

```jsx
// 1. State
const [form, setForm] = useState({ name: "", email: "", message: "" });
const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState("");

// 2. API URL (prod vs dev)
const API_URL = import.meta.env.PROD ? "/api/forms/contact" : "http://localhost:5300/api/forms/contact";

// 3. Submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.post(API_URL, form);
    setSubmitted(true);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to send.");
  } finally {
    setLoading(false);
  }
};
```

### CountrySelector

Located at `frontend/src/components/ui/CountrySelector.jsx`. Displays a searchable dropdown with country flags (from flagcdn.com) and phone prefixes.

```jsx
<CountrySelector
  value={selectedCountry}
  onChange={(country) => {
    setSelectedCountry(country);
    setPhonePrefix(country.countryCode);
  }}
  placeholder="Country"
  required
/>
```

---

## Backend API

### Form Route Pattern

```js
// backend/routes/forms.js
router.post('/contact', validateContact, async (req, res) => {
  const submission = await FormSubmission.create({ ...fields, formType: 'contact' });
  await emailService.sendContactEmail(fields);
  res.json({ success: true, id: submission.id });
});
```

### Email Service

Uses Nodemailer with Gmail SMTP. Configure via `EMAIL_USER` and `EMAIL_PASS` (App Password) env vars.

Inquiry number format: `PFP-DDYYMM-0000` (e.g., `PFP-010526-0001`).

---

## Deployment Checklist

- [ ] `VITE_API_URL` set on Vercel to backend URL
- [ ] `DATABASE_URL` set on backend host
- [ ] `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password) configured
- [ ] `NOTIFICATION_EMAIL` set for form notifications
- [ ] `SUPABASE_URL` and `SUPABASE_KEY` configured
- [ ] Vercel root directory set to `pokhrelflexprinting/`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

---

## MCP Servers

Configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": { ... },
    "figma": { ... },
    "@21st-dev/magic": { ... }
  }
}
```

Usage:
- **Supabase MCP** — query database, inspect tables, manage storage during development
- **Figma MCP** — pull design specs and assets from Figma files
- **21st-dev Magic** — generate UI components from natural language prompts
