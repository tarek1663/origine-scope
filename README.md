# OrigineScope

Discover your true origins in 30 seconds — no DNA kit needed. A Next.js 14 web app with Stripe checkout.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **Stripe** (Checkout + Webhook)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and set:

   - `STRIPE_SECRET_KEY` — from [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys)
   - `STRIPE_WEBHOOK_SECRET` — from Stripe CLI or Dashboard (Webhooks)
   - `NEXT_PUBLIC_APP_URL` (optional) — e.g. `http://localhost:3000` or your production URL

3. **Stripe webhook (local)**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   Use the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Pages

| Path        | Description                          |
| ----------- | ------------------------------------ |
| `/`         | Landing page with CTA                |
| `/analyze`  | 3-step form (photo, name, countries) |
| `/loading`  | Animated loading, then → `/preview`   |
| `/preview`  | Blurred results + “Unlock — $4.90”   |
| `/results`  | Full results (after payment)         |

## Production note (payments)

Paid sessions are stored in memory. For production with multiple instances, use a shared store (e.g. **Vercel KV**, Redis, or a database) in `src/lib/paidSessions.ts` and in the webhook so that `/api/verify-session` can confirm payment across instances.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
