# Pokhrel Flex Printing – Portfolio Website

Pokhrel Flex Printing is a printing business based in Nepal offering quality print solutions for retail and wholesale customers. This repository contains the website that showcases the business and handles customer inquiries.

## Company Overview

Pokhrel Flex Printing specializes in:

- vinyl and flex banner printing
- sublimation mugs, cups, t-shirts, and personalized items
- custom trophies, medals, and plaques
- table stands, menu holders, and display accessories
- custom printing for stationery and marketing materials

## How the Code Works

The project is separated into two parts:

1. `frontend/` — the portfolio website built with Vite and React
2. `backend/` — the API server built with Node.js and Express

### Frontend

The frontend is a single-page application that:

- presents the company, products, and services with scroll animations
- handles contact and inquiry form submissions
- uses Vite to build and serve the app at port 3300

Key files:

- `frontend/src/App.jsx` — main application wrapper with routes
- `frontend/src/main.jsx` — React entry point
- `frontend/src/utils/env.js` — environment variable helper
- `frontend/src/components/` — Header, Footer, FAQ, Support, etc.
- `frontend/src/pages/Landing/` — landing page sections (Section1–Section6)
- `frontend/src/pages/` — Contact, About, Portfolio pages

### Backend

The backend serves REST APIs for form submissions:

- `backend/server.js` — Express server entry point (port 5300)
- `backend/routes/forms.js` — contact, newsletter, inquiry endpoints
- `backend/models/` — FormSubmission and Counter models
- `backend/services/emailService.js` — Nodemailer email notifications
- `backend/services/whatsappService.js` — optional WhatsApp notifications
- `backend/middleware/validation.js` — request validation

## Project Structure

```
pokhrelflexprinting/
├── backend/
│   ├── config/         # environment, postgres, supabase
│   ├── middleware/     # validation
│   ├── models/         # FormSubmission, Counter
│   ├── routes/         # forms API
│   ├── services/       # email and WhatsApp notifications
│   ├── server.js       # backend entry point
│   ├── package.json    # backend dependencies
│   └── .env.example    # backend environment template
├── frontend/
│   ├── public/         # static assets (favicon, fonts)
│   ├── src/
│   │   ├── api/        # axios client
│   │   ├── components/ # Header, Footer, CountrySelector, FAQ, etc.
│   │   ├── pages/      # Landing, Contact, About, Portfolio
│   │   └── utils/      # env helpers
│   └── .env.example    # frontend environment template
├── package.json        # root scripts
├── vite.config.js      # Vite config (port 3300, outDir ../dist)
├── tailwind.config.js  # Tailwind with pfp-* color tokens
├── vercel.json         # Vercel deployment (SPA rewrite)
├── .mcp.json           # MCP server config (Supabase, Figma, 21st-dev)
└── .gitignore
```

## Brand Colors

| Token                 | Value     | Use                          |
|-----------------------|-----------|------------------------------|
| `pfp-main`            | `#1B4F8A` | Primary navy blue            |
| `pfp-secondary-light` | `#F5A623` | Accent amber/gold            |
| `pfp-ink`             | `#1A1A1A` | Body text                    |
| `pfp-paper`           | `#F2F0EC` | Light section backgrounds    |
| `pfp-dark`            | `#0D1F3C` | Dark section backgrounds     |

## Environment Files

- `pokhrelflexprinting/.env.example` — frontend environment template
- `pokhrelflexprinting/backend/.env.example` — backend environment template

Copy each to `.env` in their respective folders and update values.

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm

### Install Dependencies

```bash
# From the pokhrelflexprinting folder
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies (handled by root install via workspaces)
```

Or install all at once from the root workspace:

```bash
cd pokhrelflexprinting
npm install
```

### Copy Environment Files

**Windows (PowerShell):**
```powershell
copy .env.example .env
copy backend\.env.example backend\.env
```

**macOS / Linux:**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Then update the values in each `.env` file.

### Run the App

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them independently:

```bash
# Frontend (port 3300)
npm run dev:frontend

# Backend (port 5300)
npm run dev:backend
```

### Production Build

Build the frontend for Vercel deployment:

```bash
npm run build
```

The built files go to `dist/` in the project root, which Vercel serves directly.

## Deployment (Vercel)

The `vercel.json` at the root configures:

- SPA rewrite: all routes → `index.html`
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

To deploy:

1. Connect the repository to a Vercel project
2. Set root directory to `pokhrelflexprinting/`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables from `.env.example`

The backend is deployed separately (e.g., Railway, Render) and the `VITE_API_URL` env var points to it.

## MCP Servers

Configured in `.mcp.json`:

- **Supabase** — database and storage access during development
- **Figma** — design file access
- **21st-dev Magic** — AI-assisted component generation
