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

```
backend/
├── server.js                  Express entry, CORS (allows .vercel.app)
├── config/
│   ├── environment.js         PORT=5300, DB config, email config
│   ├── postgres.js            Sequelize connection
│   └── supabase.js            Supabase client, bucket: pfp-images
├── middleware/validation.js   express-validator helpers
├── models/
│   ├── FormSubmission.js      formTypes: contact, newsletter, inquiry
│   └── Counter.js             auto-increment counters per type
├── routes/forms.js            POST /contact, /newsletter, /inquiry
└── services/
    ├── emailService.js        Nodemailer + Gmail, inquiry# PFP-DDYYMM-0000
    └── whatsappService.js     WhatsApp Cloud API (optional)
```

## API Endpoints

| Method | Path                    | Body fields                              |
|--------|-------------------------|------------------------------------------|
| POST   | /api/forms/contact      | name, email, phone, country, message     |
| POST   | /api/forms/newsletter   | email                                    |
| POST   | /api/forms/inquiry      | name, email, phone, country, product, message |

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

**Form submission flow:** Frontend POST → backend validates → saves to Supabase (FormSubmission) → increments Counter → sends email via Nodemailer.

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
SUPABASE_KEY=...
EMAIL_USER=...@gmail.com
EMAIL_PASS=...          # Gmail App Password
NOTIFICATION_EMAIL=...
WHATSAPP_TOKEN=...      # optional
WHATSAPP_PHONE_ID=...   # optional
```

## Deployment

Hosted on **Vercel**. `vercel.json` rewrites all routes to `index.html` for SPA routing. Backend deployed separately; set `VITE_API_URL` to the backend URL on Vercel.

## What This Site Is NOT

- Not e-commerce — no cart, checkout, payments
- No customer/supplier login portals
- No inventory or order tracking dashboards
- No currency toggle
- No i18n / multi-language
