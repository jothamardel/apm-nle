# NLE Makinde/Daura APM Grassroots Support Network (`www.nlegrassroots.org`)

**Motto:** *Reimagine. Reset. Rebuild*  
**National Chairman:** Ms Nikurai Maton  
**National Secretariat:** No. 8 Rabo House Plaza, opp. Jos City Park, Mazaram Rayfield, Jos, Plateau State

---

## Features Built

- **Unified Online Membership & Volunteer Registration (`/join`, `/signin`)**: Single account onboarding with Email/Password (+ Google OAuth when Supabase is configured), inclusive PVC status (*Has PVC*, *Planning PVC*, *No PVC — Supporting the Cause*, *Diaspora*), zero-barrier Ward/Polling Unit bypass, and multi-select Action Teams (*Protect The Ballots*, *Social Media Team*, *Grassroots Mobilization*, *Fundraising & Outreach*).
- **Live Public Analytics Explorer (`/analytics`)**: Real-time aggregate member counts drilling down **Nigeria (37 States) → 774 LGAs → Wards → INEC Polling Units**, geopolitical zone distribution, and PVC vs. Non-PVC breakdown with zero PII exposed.
- **Member Portal (`/portal`)**: Downloadable PNG & printable **Digital Membership ID Card** with QR verification code, Action Team management, Personal Referral Link & Mobilizer Leaderboard, Social Media Toolkit & WhatsApp/Telegram links, and Donation History.
- **Donations & Fundraising Outreaches (`/donate`)**: General Movement Fund + Dedicated Outreach Campaigns with live progress bars, Paystack checkout (`/api/paystack/initialize` + cryptographic HMAC-SHA512 `/api/paystack/webhook`), and Manual Bank Transfer with receipt upload & Admin verification.
- **Event & Outreach Gallery (`/gallery`)**: Filterable by event category and state with an accessible native `<dialog>` lightbox viewer.
- **Role-Based Admin Console (`/admin`)**: Enforced via Supabase RLS for **National Admin**, **State Coordinator** (state-scoped CSV rosters), and **Media Editor** (Gallery & News publishing).

---

## Quick Start (Interactive Preview Mode)

Runs immediately out of the box with zero external credentials required (requires **Node 22+**, configured in `.nvmrc`):

```bash
nvm use
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Use `/signin` to preview all four roles (*National Admin*, *State Coordinator*, *Media Editor*, *Member*) or register a new member at `/join`.

---

## Going Live with Supabase & Paystack

1. Copy `.env.example` to `.env.local` and fill in your **Supabase** and **Paystack** keys.
2. Run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor to create all tables, indexes, `SECURITY DEFINER` public analytics RPCs, and strict role-based RLS policies.
3. Provision Supabase Storage buckets: `gallery-media`, `member-avatars`, `toolkit-assets` (public read), and `donation-receipts` (private).
4. Seed all **37 States, 774 LGAs, ~8,809 Wards, and ~176,846 INEC Polling Units**:
   ```bash
   npm run seed:inec
   ```
5. In Paystack Dashboard → Settings → Webhooks, point your webhook URL to `https://www.nlegrassroots.org/api/paystack/webhook`.
6. Deploy to Vercel and bind `www.nlegrassroots.org`.

