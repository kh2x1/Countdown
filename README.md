# World Cup 2026 Match Center ⚽

A modern, responsive dashboard dedicated to **FIFA World Cup 2026** matches —
with live countdown timers, fixtures, results, and rich stadium details across
the 16 host venues in the USA, Canada, and Mexico.

Built to look and feel like a professional, official-style match center.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![TS](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e)

---

## ✨ Features

| Area | What you get |
| --- | --- |
| **Match cards** | Team flags & names, date, **local-timezone** kickoff time, stadium name + image, and live status (Upcoming / Live / Finished) |
| **Countdown timers** | Real-time **Days / Hours / Minutes / Seconds** countdown for every upcoming match, ticking every second |
| **Stadiums** | High-quality images, name, city, country, and capacity for all 16 host venues |
| **Match details page** | Dedicated route with a large stadium hero, full match info, big countdown, stadium details, team info, and a weather panel |
| **Search & filters** | Search by team / stadium / city; filter by status and by stage (Group Stage → Final) |
| **Favorites** | Save matches locally (persists across reloads) and filter to favorites only |
| **Notifications** | Opt-in browser reminder ~15 minutes before kickoff |
| **Auto refresh** | Server data refreshes every 60s; manual refresh button included |
| **UI/UX** | Dark theme, glassmorphism cards, smooth animations, World Cup brand colors, mobile-first |
| **Performance / SEO** | SSR, image optimization (`next/image`), lazy loading, dynamic `sitemap.xml` + `robots.txt`, **PWA** manifest & icons |

> The app ships with **bundled seed data** for all 16 venues and a full fixture
> list, so it runs beautifully with **zero configuration**. Add Supabase and/or a
> football API to switch to live data — the data layer prefers live data and
> falls back to seed automatically.

---

## 🧱 Tech Stack

- **Next.js 15** (App Router, Server Components, SSR) · **React 19** · **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style primitives (Radix UI, CVA)
- **Supabase** (PostgreSQL) for fixtures/teams/stadiums
- **lucide-react** icons
- Football data via **API-Football** (pluggable provider)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (optional) configure environment
cp .env.example .env.local
#    -> the app works without this; add values to enable live data

# 3. Run the dev server
npm run dev
# open http://localhost:3000
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with `eslint-config-next` |
| `npm run typecheck` | `tsc --noEmit` |

---

## 🗄️ Supabase Setup (optional)

The dashboard runs on seed data out of the box. To serve live/persisted data:

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql)
   then [`supabase/seed.sql`](./supabase/seed.sql).
3. Add the project keys to `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY   # server-side sync only
   ```

The schema is public **read-only** via Row Level Security; writes happen through
the service-role key used by the sync job.

---

## 🔄 Live Football Data (optional)

[`lib/football-api.ts`](./lib/football-api.ts) and
[`scripts/sync-fixtures.mjs`](./scripts/sync-fixtures.mjs) integrate with
**API-Football**. Get a free key at <https://www.api-football.com/>.

```bash
FOOTBALL_API_PROVIDER=api-football
FOOTBALL_API_KEY=YOUR-KEY
node scripts/sync-fixtures.mjs   # upserts statuses/scores into Supabase
```

Run the script on a schedule (Vercel Cron, GitHub Actions, or a Supabase Edge
Function) to keep statuses and scores current. The provider is pluggable —
implement another branch in `fetchWorldCupFixtures` for Football-Data.org, etc.

---

## 📁 Project Structure

```
.
├── app/
│   ├── layout.tsx            # Root layout, metadata, header/footer, dark theme
│   ├── page.tsx              # Home: hero, stats, match explorer, stadiums
│   ├── globals.css           # Theme tokens + glassmorphism utilities
│   ├── loading.tsx           # Skeleton loading state
│   ├── not-found.tsx         # 404 page
│   ├── manifest.ts           # PWA manifest
│   ├── robots.ts / sitemap.ts# SEO
│   └── match/[id]/page.tsx   # Match details page
├── components/
│   ├── ui/                   # shadcn-style primitives (button, card, badge…)
│   ├── hero.tsx              # Featured-match hero with big countdown
│   ├── match-card.tsx        # Glass match card
│   ├── match-explorer.tsx    # Search + filters + grid + auto-refresh
│   ├── countdown-timer.tsx   # Real-time D/H/M/S countdown
│   ├── stadium-section.tsx   # Stadium detail block
│   ├── stadiums-showcase.tsx # 16-venue grid
│   ├── favorite-button.tsx / notify-button.tsx / status-badge.tsx
│   └── site-header.tsx
├── lib/
│   ├── types.ts              # Domain types
│   ├── data.ts               # Data layer (Supabase → seed fallback)
│   ├── seed-data.ts          # Bundled venues / teams / fixtures
│   ├── football-api.ts       # Football API integration
│   ├── format.ts             # Flags, dates, countdown math
│   ├── use-favorites.ts / use-notifications.ts
│   └── supabase/             # Browser + server clients
├── scripts/sync-fixtures.mjs # Cron-friendly data sync
├── supabase/                 # schema.sql + seed.sql
└── public/icons/             # PWA icons
```

---

## 🌐 Deployment — GitHub Pages (automated)

This repo is configured to build a **static export** and publish to GitHub Pages
via GitHub Actions ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)).

**One-time setup:**

1. Push the code to GitHub (the workflow runs on pushes to `main` and the
   `claude/fifa-world-cup-website-DY23O` branch).
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and
   choose **GitHub Actions**.
3. That's it. On the next push the workflow builds and deploys automatically.
   Your site goes live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

   For this repo that is **https://kh2x1.github.io/Countdown/**.

**How it works / notes:**

- The workflow derives `NEXT_PUBLIC_BASE_PATH` (`/<repo-name>`) and the site URL
  automatically from `GITHUB_REPOSITORY`, so the sub-path routing, assets,
  manifest, and sitemap all resolve correctly — no manual edits needed.
- `next.config.mjs` uses `output: 'export'` with `images.unoptimized` (Pages has
  no Node server to run the image optimizer).
- Static hosting means data is baked at **build time** (from seed data, or from
  Supabase if you add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  as repo **Secrets**). Countdown timers still run **live in the browser**;
  re-run the workflow (or schedule it) to refresh match statuses/scores.
- If a deployment is blocked because it isn't running from the default branch,
  either merge this branch into `main`, or allow the branch under
  **Settings → Environments → github-pages → Deployment branches**.

**Build it locally the same way Pages does:**

```bash
NEXT_PUBLIC_BASE_PATH=/Countdown npm run build   # outputs static site to ./out
npx serve out                                    # preview
```

---

## ☁️ Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. (Optional) add the env vars from `.env.example` in **Project → Settings →
   Environment Variables**, including `NEXT_PUBLIC_SITE_URL=https://your-domain`.
4. Deploy. Next.js is detected automatically.

**Keep data fresh with a cron** (Vercel Cron example) — add to
`vercel.json` and an API route that calls the sync, or run the script via
GitHub Actions on a schedule:

```jsonc
// vercel.json
{ "crons": [{ "path": "/api/sync", "schedule": "*/5 * * * *" }] }
```

Other platforms (Netlify, Render, a Node host) work too — it's a standard
Next.js app: `npm run build` then `npm run start`.

---

## ⚙️ Configuration Notes

- **Images**: remote hosts are allow-listed in `next.config.mjs`
  (`flagcdn.com`, `images.unsplash.com`, `upload.wikimedia.org`,
  `media.api-sports.io`). Add your own as needed.
- **Flags** are resolved from ISO country codes via `flagcdn.com`.
- **Timezones**: kickoff times render in the **viewer's local timezone**.
- The bundled fixtures use the real host venues and tournament window; group
  pairings are illustrative sample fixtures and are not affiliated with FIFA.

---

## 📝 License

MIT — for educational and demonstration purposes. Not affiliated with FIFA.
