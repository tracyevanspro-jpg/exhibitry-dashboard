# Gemini Handoff Prompt — Exhibitry Dashboard

Paste this as your first message when opening this project in your AI IDE.

---

## Opening prompt for Gemini

I'm building a personal project management dashboard for my company Exhibitry.
The data lives in a Supabase database called Brain 2.
I have an existing HTML prototype called `dashboard.html` in this folder — please read it first.
I also have a schema reference in `supabase-context.md`.

Here is my Supabase connection:
- URL: `https://jrgfbfxzrpzfscguicwi.supabase.co`
- Anon key: [paste your anon key here — get from Supabase → Settings → API]

**What I want to build:**

1. A live dashboard that queries Supabase on load and auto-refreshes every 60 seconds
2. Project cards grouped by status (fabrication / pitch / proposal / active / leads)
3. A task list with overdue items highlighted in red, this-week items in amber
4. Ability to click a project card and mark a task complete (updates Supabase directly)
5. A simple "add task" form at the bottom
6. Eventually: deploy to Cloudflare Pages with the anon key stored as an environment variable

**Tech preferences:**
- Vanilla HTML/CSS/JS — no build step, no framework
- Single `dashboard.html` file to start, can split later
- Supabase JS client loaded from CDN
- Clean, minimal design — white cards on light gray background

**First step:** Read `dashboard.html` and `supabase-context.md`, then tell me what you see
and suggest what to improve or build next.

---

## Cloudflare Pages deployment (when ready)

1. Push `Dashboard/` folder to a GitHub repo
2. In Cloudflare dashboard → Pages → Connect to Git → select repo
3. Build command: (none — static site)
4. Output directory: `/` (root of Dashboard folder)
5. Add environment variable: `SUPABASE_ANON_KEY` = your anon key
6. Update `dashboard.html` to read key from env: requires a small build step or just hardcode for now

Or deploy manually with Wrangler CLI:
```
npm install -g wrangler
wrangler pages deploy . --project-name exhibitry-dashboard
```

## Notes
- The Supabase anon key is safe for client-side use IF you have Row Level Security (RLS) enabled
- Without RLS, anyone with the key can read your Brain — either enable RLS or keep the dashboard private
- Cloudflare Pages has a free tier that handles this easily
