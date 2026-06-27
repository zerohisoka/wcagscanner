# WCAG Scanner — Automated Accessibility Compliance Audits

> **"Build honestly. No overlay widgets."**

A production-grade micro-SaaS for automated WCAG & ADA accessibility scanning. Find the 6 issues that cause 96% of all accessibility failures — in seconds.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3 + dark theme
- **Animations:** Framer Motion v11
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Scanning Engine:** axe-core + Puppeteer
- **Payments:** Stripe (Subscriptions + Webhooks)
- **Hosting:** Vercel

---

## 📋 Prerequisites

- **Node.js 18+** installed
- A **Supabase** account (free tier works)
- A **Stripe** account (test mode for development)

---

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/wcag-scanner.git
cd wcag-scanner
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard → Developers → API Keys |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Webhooks → Create Endpoint |
| `STRIPE_PRO_PRICE_ID` | Pro plan price ID | Stripe Dashboard → Products → Create Product |
| `STRIPE_AGENCY_PRICE_ID` | Agency plan price ID | Stripe Dashboard → Products → Create Product |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` for local dev |

### 3. Database Setup

Run the migration SQL in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents and paste into the SQL Editor
4. Click "Run"

This creates all tables, RLS policies, indexes, and the auto-create-profile trigger.

### 4. Stripe Setup

1. **Create Products:** In your Stripe Dashboard, create two products:
   - **WCAG Scanner Pro** — $25/month (recurring)
   - **WCAG Scanner Agency** — $45/month (recurring)
2. Copy each product's API/Price ID into your `.env.local`
3. **Create a Webhook Endpoint:**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy the webhook signing secret (`whsec_...`) into `.env.local`

4. **For local development with webhooks:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Then copy the local webhook secret.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment (Vercel)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Add all environment variables from `.env.example` in Vercel's Environment Variables
5. Deploy

### Important: Puppeteer on Vercel

The `vercel.json` file configures the scan API routes with 1024MB memory and 30s timeout. For production, consider:
- Using `chrome-aws-lambda` (included in `package.json`)
- Setting up a dedicated worker for heavy scans

---

## 📁 Project Structure

```
wcag-scanner/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Signup, OAuth callback
│   ├── (dashboard)/        # Dashboard pages (protected)
│   ├── (legal)/            # Privacy, Terms, Refund, Disclaimer
│   ├── api/                # API route handlers
│   ├── pricing/            # Public pricing page
│   ├── free-scan/          # Lead magnet free scanner
│   └── contact/            # Contact page
├── components/             # React components
│   ├── landing/            # Marketing page sections
│   ├── scanner/            # Scan UI components
│   ├── reports/            # Report display components
│   ├── billing/            # Pricing and subscription
│   ├── layout/             # Navbar, Footer, Sidebar
│   └── legal/              # Legal page layout
├── lib/                    # Business logic
│   ├── supabase/           # Supabase clients (browser + server)
│   ├── stripe/             # Stripe client + plan definitions
│   ├── scanner/            # Scan engine (axe-core + puppeteer)
│   └── pdf/                # PDF report generator
├── hooks/                  # React hooks (useUser, useScan, useSubscription)
├── types/                  # TypeScript type definitions
├── supabase/
│   ├── migrations/         # Database schema SQL
│   └── functions/          # Edge functions (scheduled scans)
└── middleware.ts           # Auth guard + session refresh
```

---

## ⚠️ Important Legal Notice

This tool provides **automated scanning only**. Results do NOT constitute legal advice.

- Our scanner detects ~57% of WCAG issues
- A passing score does not guarantee legal compliance
- For full compliance, consult a qualified accessibility expert and attorney
- Read our full [Disclaimer](./app/(legal)/disclaimer/page.tsx)

---

## 📄 License

GNU General Public License v3.0 — See [LICENSE](./LICENSE) for details.

---

Built honestly. No overlay widgets. 🛡️
