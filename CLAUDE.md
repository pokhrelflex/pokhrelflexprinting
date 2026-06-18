# Pokhrel Flex Printing – Claude Code Guide

## Project Overview

Portfolio website for **Pokhrel Flex Printing**, a printing business in Nepal. Sells vinyl/flex printing, sublimation products, trophies, medals, and table stands — retail and wholesale. Not e-commerce; no shopping cart or payments.

## Architecture

```
pokhrelflexprinting/
├── frontend/          React 19 + Vite 7 — port 3300
├── backend/           Express 4 + Node.js — port 5300
├── dist/              Vite build output (gitignored)
├── vite.config.js     root: ./frontend, outDir: ../dist
└── vercel.json        Vercel SPA rewrite
```

## Brand Colors

Always use these — never hardcode arbitrary hex values:

| CSS var / Tailwind token  | Hex       | Use                    |
|---------------------------|-----------|------------------------|
| `pfp-main` / `#1B4F8A`    | navy blue | primary brand color    |
| `pfp-secondary-light` / `#F5A623` | amber | accent / CTA         |
| `pfp-ink` / `#1A1A1A`     | near-black | body text             |
| `pfp-paper` / `#F2F0EC`   | warm off-white | light sections    |
| `pfp-dark` / `#0D1F3C`    | deep navy  | dark hero sections     |

## Dev Commands

```bash
npm run dev           # frontend + backend (concurrently)
npm run dev:frontend  # frontend only  (port 3300)
npm run dev:backend   # backend only   (port 5300)
npm run build         # Vite production build → dist/
```

## Frontend Structure

```
frontend/src/
├── api/client.js              axios base client (defaults to :5300)
├── components/
│   ├── Header.jsx             sticky glass pill-bar, NAV: Home/About/Portfolio
│   ├── Footer.jsx             dark bg, newsletter form, social links
│   ├── ScrollToTop.jsx        scroll restoration on route change
│   ├── countries.js           country data with phone prefixes
│   ├── ui/
│   │   ├── Layout.jsx         scroll-hide header wrapper
│   │   └── CountrySelector.jsx flag + search dropdown
│   ├── FAQ.jsx                8 printing FAQs
│   ├── HelpCenter.jsx         help topics
│   ├── Support.jsx            contact cards + business hours
│   ├── Privacy.jsx            privacy policy
│   └── Terms.jsx              terms and conditions
├── pages/
│   ├── Landing/
│   │   ├── Landingpage.jsx    composes Section1–Section6
│   │   ├── useScrollReveal.js IntersectionObserver hook
│   │   ├── Section1.jsx       cinematic intro + typewriter "We Print Your Vision."
│   │   ├── Section2.jsx       stats strip (100+ products, 5+ years, 500+ customers)
│   │   ├── Section3.jsx       5-step process carousel
│   │   ├── Section4.jsx       product overview + Framer Motion card stack
│   │   ├── Section5.jsx       3 product categories + 8-step printing process
│   │   └── Section6.jsx       mission quote + Quality/Creative/Affordable cards
│   ├── Contact.jsx            contact form with CountrySelector + phone prefix
│   ├── about.jsx              about page with stats, values, process timeline
│   └── portfolio.jsx          6 product categories + capabilities grid
└── utils/env.js               VITE_API_URL helper
```

## Backend Structure

> **Runs under `tsx`** (`npm run dev` / `npm start` → `tsx server.js`), not plain
> `node`, so the CommonJS server can import the ESM `.jsx` email templates with
> no separate build step.

```
backend/
├── server.js                  Express entry, CORS (allows .vercel.app)
├── config/
│   ├── environment.js         PORT=5300, DB config, email config
│   ├── postgres.js            Sequelize connection
│   └── supabase.js            Supabase client, bucket: pfp-images
├── middleware/
│   ├── validation.js          express-validator helpers
│   └── auth.js                requireAdmin (Supabase token verify)
├── models/
│   ├── FormSubmission.js      formTypes: contact, newsletter, inquiry
│   ├── Counter.js             auto-increment counters per type
│   └── EmailOtp.js            email OTP codes (bcrypt hash, expiry, attempts)
├── emails/                    React Email templates (.jsx)
│   ├── components/
│   │   ├── BrandLayout.jsx    shared navy/paper/dark shell + <Preview>
│   │   └── Field.jsx          reusable label/value row
│   ├── ContactEmail.jsx       inquiry# PFP-DDYYMM-0000
│   ├── NewsletterEmail.jsx
│   ├── InquiryEmail.jsx
│   └── OtpEmail.jsx           6-digit code, amber on paper
├── routes/
│   ├── forms.js               POST /contact, /newsletter, /inquiry
│   ├── auth.js                /check-email, /request-otp, /verify-otp
│   └── admin.js               guarded /api/admin/*
└── services/
    ├── emailService.js        Resend + React Email (render → HTML + plain text)
    └── whatsappService.js     WhatsApp Cloud API (optional)
```

**Email:** templates are authored as React Email components in `backend/emails/`.
`emailService.js` (CommonJS) loads them via memoized dynamic `import()`, renders
each to HTML **and** a plain-text fallback with `@react-email/render`, then sends
through **Resend** (`RESEND_API_KEY`, `EMAIL_FROM` on a Resend-verified domain).
The single `sendViaResend()` wrapper is the only send path. To preview templates
while editing: `npx react-email dev` pointed at `backend/emails/`.

## API Endpoints

| Method | Path                    | Body fields                              |
|--------|-------------------------|------------------------------------------|
| POST   | /api/forms/contact      | name, email, phone, country, message     |
| POST   | /api/forms/newsletter   | email                                    |
| POST   | /api/forms/inquiry      | name, email, phone, country, product, message |
| POST   | /api/auth/check-email   | email \| identifier (does an account exist?) |
| POST   | /api/auth/request-otp   | email, purpose (`email_verify` \| `login`) — emails a 6-digit code via Resend |
| POST   | /api/auth/verify-otp    | email, code, purpose — verifies; returns a 15-min JWT on success |

## Routing (App.jsx)

| Path          | Component       |
|---------------|-----------------|
| `/`           | Landingpage     |
| `/about`      | About           |
| `/portfolio`  | Portfolio       |
| `/contact`    | Contact         |
| `/faq`        | FAQ             |
| `/help-center`| HelpCenter      |
| `/support`    | Support         |
| `/privacy`    | Privacy         |
| `/terms`      | Terms           |

## Key Patterns

**Scroll animations:** Use `useScrollReveal` hook from `pages/Landing/useScrollReveal.js` for simple fade/slide-in. Use Framer Motion `useScroll` + `useTransform` + `useSpring` for scroll-driven card stacking (see Section4).

**Section backgrounds:** Landing alternates `#F2F0EC` (light) and `#0D1F3C` (dark). Other pages use `bg-white` or `bg-[#F2F0EC]`.

**Font classes:** `premium-font-galdgderbold` and `premium-font-galdgdersemi` for headings (defined in `index.css`).

**CTA accent:** Always `#F5A623` (amber) for primary buttons and highlights.

**Form submission flow:** Frontend POST → backend validates → saves to Supabase (FormSubmission) → increments Counter → renders the React Email template → sends via Resend.

**Email OTP flow:** Frontend POST `/api/auth/request-otp` → backend stores a bcrypt-hashed code (10-min expiry, 60s resend cooldown, 5-attempt cap) in `email_otps` → emails the code via Resend. `/api/auth/verify-otp` checks it, marks it consumed (one-time use), and returns a short-lived `email_verified` JWT. Used by the admin `/register` page to verify the email *before* the Supabase account is created — which requires Supabase "Confirm email" to be **off** so `signUp` returns a session immediately.

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5300
```

### Backend (backend/.env)
```
PORT=5300
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...                          # also accepts SUPABASE_KEY
RESEND_API_KEY=re_...                             # Resend dashboard → API Keys
EMAIL_FROM=Pokhrel Flex Printing <noreply@pokhrelflexprinting.com>  # Resend-verified domain
EMAIL_TO=...                                      # where contact/inquiry/newsletter land
JWT_SECRET=...                                    # signs the OTP verification token
WHATSAPP_TOKEN=...      # optional
WHATSAPP_PHONE_ID=...   # optional
```

## Deployment

Hosted on **Vercel**. `vercel.json` rewrites all routes to `index.html` for SPA routing. Backend deployed separately; set `VITE_API_URL` to the backend URL on Vercel.

## Admin Panel

An admin area (Supabase Auth) is being built — see `frontend/src/pages/admin/`, `frontend/src/components/admin/`, `backend/routes/admin.js`, `backend/middleware/auth.js`.

- Auth routes: `/login` (Supabase `signInWithPassword`) and `/register`. Registration is a two-step flow — step 1 validates the form and requests a Resend OTP (`/api/auth/request-otp`); step 2 verifies the code (`/api/auth/verify-otp`) and only then calls Supabase `signUp`. Requires Supabase "Confirm email" **off** so `signUp` returns a session. Any Supabase user can sign in/up via the same forms — no single-admin restriction. Apple-style minimalist UI, small fonts.
- Routing: `/login`, `/register`, and guarded `/admin/*` (dashboard) all live outside the public `Layout` and skip the intro animation. Guarded by `ProtectedRoute` + `AuthProvider` (`frontend/src/context/authContext.js`).
- Backend: `requireAdmin` middleware verifies the Supabase token via `supabase.auth.getUser`; protects `/api/admin/*`. Optional `ADMIN_EMAIL` env restricts to one email (left empty = any user).
- Env: frontend `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`; backend reuses `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`.
- Planned screens: Products (image + description), Portfolio, Customers (reuse `FormSubmission`), Sales (order/line-item model).

## What This Site Is NOT

- Not e-commerce — no cart, checkout, payments (public-facing)
- No currency toggle
- No i18n / multi-language (note: i18next IS integrated with EN/NE locales)
