# Exhibitry Dashboard — Project README

## What this is

A personal project management dashboard for Tracy Evans, President of Exhibitry
(exhibitry.com) — a Houston-based experiential design company specializing in
holographic displays (HoloTube), interactive exhibits, and immersive environments
for museums, corporate clients, and institutions.

The dashboard connects live to a Supabase database called **Brain 2** — a personal
knowledge base that stores all active projects, tasks, contacts, and ideas.
Brain 2 is queried during work sessions by an AI assistant (Claude) that helps
Tracy manage correspondence, draft emails, track project status, and plan next steps.

The goal is a lightweight, always-available operations dashboard Tracy can open
in any browser to see the full state of her business at a glance.

---

- **Ready for Deployment** — Build process verified, `wrangler.toml` configured.
- Connects to Supabase via modular JS (Vite build)
- Uses environment variables for security
- Deployment target: Cloudflare Pages

One thing still needed before first run: paste the Supabase anon key into
`dashboard.html` where it says `YOUR_ANON_KEY_HERE`.
Get it from: Supabase dashboard → Settings → API → anon public key.

---

## Where we want to take this

### Phase 1 — Polish the prototype (current focus)
- [ ] Make project cards expandable (click to see full notes/context)
- [ ] Add ability to mark a task complete directly from the dashboard (writes to Supabase)
- [ ] Add a quick "add task" form at the bottom
- [ ] Better visual hierarchy — distinguish today's urgencies from background tasks
- [ ] Add a "last synced" indicator and manual refresh button

### Phase 2 — Richer project view
- [ ] Project detail panel — click a project to see full notes, contacts, next action, history
- [ ] People tab — view contacts from the `people` table, filterable by tag/company
- [ ] Search across projects, tasks, and people
- [ ] Filter by client / status / date

### Phase 3 — Live operations
- [ ] Email integration — surface unread emails from key threads alongside project cards
- [ ] Calendar view — show upcoming deadlines and meetings
- [ ] Notification badges — flag projects that have gone quiet for too long
- [ ] Mobile PWA — installable on iPhone home screen for one-tap access

### Phase 4 — Deploy
- [ ] **Architecture Refactor**: Break out single-file HTML into modular JS components (`api.js`, `components.js`) and secure CSS before live deployment.
- [ ] Host on Cloudflare Pages (free tier)
- [ ] Supabase anon key stored as Cloudflare environment variable (not hardcoded)
- [ ] Optional: password-protect with Cloudflare Access (free for personal use)
- [ ] Optional: custom subdomain (e.g. dashboard.exhibitry.com)

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | No build step, no framework — keep it simple |
| Database | Supabase (Postgres) | Brain 2 project ID: `jrgfbfxzrpzfscguicwi` |
| Supabase client | CDN loaded JS | `@supabase/supabase-js@2` via jsdelivr |
| Hosting | Cloudflare Pages | Free tier, deploy from folder or GitHub |
| IDE | Antigravity (AI-native IDE) | Gemini-assisted development |

---

## Database — Brain 2

Full schema is in `supabase-context.md`. Summary:

- **`projects`** — active client opportunities and engagements
- **`admin`** — tasks and to-dos with optional due dates
- **`people`** — contacts (clients, partners, vendors)
- **`ideas`** — freeform ideas and observations
- **`documents`** — ingested meeting notes, reports, reference docs
- **`inbox_log`** — inbound leads and website form submissions

The database is written to by Claude during AI work sessions — so it reflects
real-time project state as of the last session.

---

## About Exhibitry

- President: Tracy Evans (tracy@exhibitry.com)
- Specialty: Holographic displays, interactive exhibits, immersive environments
- Signature product: **HoloTube** — life-size and standard holographic display systems
- Key fabrication partner: **USMI / Paul Johnson** (Houston, 30-year relationship)
- Field installation contractor: **Tim Drake** (Canadian)
- Active clients include: SLB, ChampionX, Naval Aviation Museum, SFPUC, UNR Fleischmann
  Planetarium, AI Digital, Lake Ontario National Marine Sanctuary, and others

---

## Files in this folder

| File | Purpose |
|---|---|
| `dashboard.html` | Working prototype — open in browser to run |
| `README.md` | This file — project overview and roadmap |
| `supabase-context.md` | Database schema reference for AI context |
| `gemini-prompt.md` | Opening prompt to paste into Antigravity/Gemini |

---

## Getting started in Antigravity

1. Open this folder (`—Brain/Dashboard/`) in Antigravity
2. Read `gemini-prompt.md` and paste its contents as your first message to Gemini
3. Gemini will read `dashboard.html` and `supabase-context.md` and orient itself
4. Start with Phase 1 tasks — expandable cards and task completion are the highest value

The Supabase anon key is safe for client-side use as long as Row Level Security
(RLS) is enabled on the Supabase project. Verify this before deploying publicly.

- **2026-03-16 [Antigravity]** - Integrated Zapier/Gmail pipeline to pull unread targeted emails into `inbox_log` table and connected Supabase Anon Keys to dashboard UI.

- **2026-03-16** [Antigravity] - Integrated Zapier/Gmail pipeline to pull targeted emails into `inbox_log` table and connected Supabase Anon Keys to dashboard UI.

- **2026-03-16** [Antigravity] - Implemented CSS variables and added a Dark Mode toggle (saved to localStorage) for the UI.

- **2026-03-16** [Antigravity] - Implemented project thumbnail system. Dashboard gracefully checks for .jpg files matching project names in a local `/thumbnails` folder.

- **2026-03-16** [Antigravity] - Added expandable project cards to reveal notes, interactive checkboxes to mark tasks complete in Supabase, and a Quick Add Task form.

- **2026-03-16** [Antigravity] - Refined thumbnail image linking to use simplified filenames (first word, lowercase, alphanumeric only).

- **2026-03-16** [Antigravity] - Adjusted CSS object-position for project thumbnails to better display portrait-oriented images.

- **2026-03-16** [Antigravity] - Updated thumbnail naming convention to use the full project name (kebab-case) to prevent collisions for projects sharing the same client name prefix.

- **2026-03-16** [Antigravity] - Changed project card layout grid from 3 columns to 4 columns to visually align with the top stats row.

- **2026-03-16** [Antigravity] - Improved thumbnail logic to only use the first half of the project name (before any dashes) to allow for much shorter, more manageable filenames while avoiding company name overlaps.

- **2026-03-16** [Antigravity] - Implemented Markdown parsing for project notes (bold, bullets, line breaks) for improved legibility, and added a 'Recently Completed' section that persists the last 5 completed tasks on the dashboard.

- **2026-03-16** [Antigravity] - Created a dedicated `notes.html` page. Project cards now contain a link that seamlessly jumps to the notes page, passing the project name to filter and edit project-specific meeting notes from the `ideas` table.

- **2026-03-16** [Antigravity] - Added a visual 'NOTES' flag badge to project cards that contain inline project context so they are identifiable at a glance.

- **2026-03-16** [Antigravity] - Refactored the 'NOTES' badge to float over the top right corner of the project thumbnail for a cleaner card layout.

- **2026-03-16** [Antigravity] - Repositioned the NOTES flag to float over the thumbnail corner. Added logic to only show the NOTES flag if the project has notes in the `projects` table or the `ideas` table.

- **2026-03-16** [Antigravity] - Generated 10 unique, photorealistic custom thumbnails utilizing DALL-E for projects that were missing cover images.

- **2026-03-16** [Antigravity] - Clarified the difference between short project descriptions (saved to the `projects` table) and long-form meeting notes (saved to the `ideas` table). The NOTES flag now correctly only displays based on the presence of `ideas` records.

- **2026-03-16** [Antigravity] - Fixed the Supabase query logic in `notes.html` to correctly fetch and render the meeting notes tied to a project name.

- **2026-03-16** [Antigravity] - Generated and implemented a premium geometric placeholder image as a fallback for project thumbnails that have not yet been explicitly uploaded.
- **2026-03-17** [Antigravity] - Added versioning and date headers to dashboard.html, adopting organizational best practices.
- **2026-03-17** [Antigravity] - Refactored dashboard.html into a modular architecture, extracting styles to `css/styles.css` and logic into separate ES modules (`js/config.js`, `js/components.js`, `js/actions.js`, `js/app.js`) to improve maintainability and scalability.
