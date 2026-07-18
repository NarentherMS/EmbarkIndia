# CLAUDE.md — Embark India

This file orients any AI assistant (or developer) working on this project. Read it fully before making changes.

> ## 🧠 MEMORY — do this every conversation
> Persistent memory lives in the **[`./memory/`](memory/)** folder (in this repo, so it survives a cleared chat).
> - **At the START of every conversation:** read every file in `./memory/` (start with [`memory/MEMORY.md`](memory/MEMORY.md)) to restore context.
> - **At the END of every conversation (and after any meaningful decision or change):** update the relevant memory file(s) — especially append a dated entry to [`memory/conversation-log.md`](memory/conversation-log.md) with what was done, decisions made, and what's next. Keep entries short. This is how context is preserved when the chat is cleared.

**Founder:** Non-technical, solo. You (the AI) do the coding. Explain what you're doing in plain language, make the safe call by default, and always tell the founder what to click/upload to deploy.

**Guiding principle: Pareto (80/20).** Always prefer the approach that delivers 80% of the outcome for 20% of the effort. Do not build infrastructure the site doesn't need yet (CMS, custom backend, complex frameworks). Ship simple, ship working.

---

## 1. What this project is

**Embark India** — a web platform for MBA students (positioned for Tier-2 B-school talent). A "career operating system" spanning eight intended services (see §4). Brand voice: sharp, confident, mentor-like. Tagline theme: *"for every aspirant who starts before they feel ready."*

The **only fully-built, revenue-capable product today is Case Competitions.** Everything else is either a static marketing page or not built yet. Be honest about this when planning — don't treat aspirational services as if they exist.

---

## 2. How it's built (architecture)

This is a **plain static website. No framework. No build step. No `package.json`. No npm.** It is hand-written HTML + CSS + vanilla JavaScript. You edit a `.html`/`.css`/`.js` file and it's live once uploaded.

### Folder layout
```
/                    → all .html pages live here (they ARE the live URLs — must stay at root)
  .htaccess          → Hostinger cache rule for HTML
  CLAUDE.md          → this file
/css/  gl.css        → the ONE shared stylesheet (all design tokens live here)
/js/                 → all page/logic scripts (see below)
/assets/             → images + vendored libs
  categories/ logos/ people/ posters/   → images used across the site
  vendor/supabase.js → the Supabase browser library (do not edit)
/supabase/           → database setup: schema.sql + update-0*.sql (run in Supabase, not deployed)
/memory/             → persistent AI memory (see top of file)
/design-source/      → design source docs (e.g. the design playbook .docx). NOT part of the website — do not upload to Hostinger.
```

- **Pages** = individual `.html` files at the repo root (e.g. `index.html`, `competitions.html`, `playbook.html`). They must stay at root — each one is a live URL (`embarkindia.in/competition.html`); moving them breaks links and SEO.
- **Styling** = ONE shared stylesheet, [css/gl.css](css/gl.css) (~44KB), linked by every page. All design tokens (colors, fonts, the orange brand `--orange` / `#FB4D0A`) live here. Change the look once, it changes everywhere.
- **Shared nav behaviour** = [js/nav.js](js/nav.js) (sticky nav + mobile burger menu). Included on most pages.
- **Fonts** = Google Fonts (Bricolage Grotesque + Inter, plus a few accents), loaded via `<link>` in each page's `<head>`.
- **Data for static sections** = hardcoded JavaScript arrays in dedicated files:
  - [js/mentors.js](js/mentors.js) → `MENTORS` (mentorship + guest-lecture profiles)
  - [js/playbooks.js](js/playbooks.js) → `PLAYBOOKS` (6 MBA-stream playbooks)
  - [js/posts.js](js/posts.js) → `POSTS` (blog articles)
  - [js/competitions.js](js/competitions.js) → ⚠️ **UNUSED dead code** — old localStorage prototype, replaced by `db.js` + Supabase. Referenced by nothing. Safe to delete; kept only pending founder's OK.

### Backend = Supabase (keep it)
The real backend is **Supabase** (a hosted service that gives us a database, user login/signup, file uploads, and security rules — all callable directly from the browser). Wiring lives in [js/db.js](js/db.js); the database structure lives in [supabase/schema.sql](supabase/schema.sql) plus `supabase/update-0*.sql`.

- Public URL + anon key in [js/db.js](js/db.js) are **public by design** — safe to expose. Real security comes from Supabase Row Level Security (RLS) rules in the SQL files. **Do not weaken or remove RLS policies.**
- Pages that use the backend load `assets/vendor/supabase.js`, then `js/db.js`, then the page script.
- Asset paths written *inside* JS strings (e.g. `assets/people/p1.jpg`) resolve relative to the HTML page, not the `.js` file — so JS files sit in `/js/` without breaking those paths.

### Deployment (Git-based)
- **Version control:** this folder is a Git repo connected to GitHub — **`NarentherMS/EmbarkIndia`** (branch `main`). This folder is the source of truth; edit here, commit, push.
- **Deploy flow:** `commit → push to GitHub → Hostinger's Git connector deploys to the live site`. Depending on the connector setup, deploy is either automatic on push or a one-click "Deploy" in Hostinger hPanel → Git. There is no build step — repo files go live as-is.
- **`design-source/` is git-ignored** (large Word docs) — it stays local, never on GitHub, never deployed.
- Internal `.md` files (CLAUDE.md, `memory/`) are in the repo for backup but blocked from public web view by `.htaccess`.
- **Database stays on Supabase.** ⚠️ See §5: do NOT move the database to Hostinger.
- ⚠️ Reminder: when you change a `.css`/`.js` file, still bump its `?v=` in the HTML (see §3.2) — Git deploy doesn't bust browser caches by itself.

---

## 3. Conventions & rules (follow these)

1. **Match the existing file when editing.** Copy the surrounding HTML structure, class names, and comment style. This site has a consistent hand-made design system in `gl.css` — reuse existing classes (`.btn`, `.btn-primary`, `.wrap`, `.pb-section`, `.reveal`, etc.) instead of inventing new ones or adding inline styles.
2. **Cache-busting is manual.** Assets are linked with a version query like `gl.css?v=5` or `db.js?v=6`. **When you change a `.css` or `.js` file, bump its `?v=` number in every page that links it** — otherwise the founder (and visitors) will keep seeing the old cached version and think nothing changed. This is the #1 "why didn't my change show up" trap.
3. **Add a new page** by copying the closest existing page (nav + footer + font links + `gl.css` link are all boilerplate you want to keep identical). Update the nav `<span class="nav-service">` and the active links.
4. **Adding content** (a mentor, playbook, blog post) = append an object to the relevant array in `mentors.js` / `playbooks.js` / `posts.js`. No database needed. Keep the same field shape as existing entries.
5. **Always escape user-supplied data** before putting it in HTML — use the existing `esc()` helper in `db.js`. Hardcoded content in the JS arrays is trusted and doesn't need it.
6. **Never commit secrets** beyond the Supabase anon key (which is meant to be public). No service-role keys, no passwords in the repo.
7. **Test the real flow, not just the code.** After a change, open the page in a browser and click through it. For competition changes, that means sign in → view → register → submit.

---

## 4. The eight services — real status (product source of truth)

| # | Service | Status | Where |
|---|---------|--------|-------|
| 1 | **Case competitions** (Unstop-style) | ✅ **Built & functional.** Auth, registration, multi-round submissions, admin panel, winners, file storage, RLS. | `competitions.html`, `competition.html`, `comp-admin.html`, `db.js`, `supabase/*` |
| 2 | Mentorship (end-to-end MBA journey) | 🟡 Static marketing page. Mentor list hardcoded in `mentors.js`. **No booking, no payments, no DB.** | `mentorship.html`, `mentor-profile.html` |
| 3 | Jobs & internships community | ❌ Not built. | — |
| 4 | Courses | ❌ Not built. | — |
| 5 | Guest lecture as a service | 🟡 Static page + "become a speaker" / "invite an expert" forms. No backend. | `guest-lectures.html`, `become-speaker.html`, `invite-expert.html` |
| 6 | Mock interviews & GDs | ❌ Not built. | — |
| 7 | Stream playbooks (Gen Mgmt, Marketing, etc.) | ✅ Built (content-driven). 6 streams. Index + per-stream detail page with skill checklist. | `playbooks.html`, `playbook.html`, `playbooks.js` |
| 8 | Blog | 🟡 Built but hardcoded. Articles are objects in `posts.js`; no CMS. | `blog.html`, `blog-post.html`, `posts.js` |

**The two real monetization blockers:** (a) there are **no payments anywhere** ("Phase 1: no payments" is baked into the code), and (b) the money-making services (mentorship, courses, mocks) have no backend. Building more static pages does not move revenue — payments + booking do. Keep this in mind when the founder asks "what should I build next."

---

## 5. ⚠️ Flags & landmines (read before big decisions)

- **Do NOT move the database to Hostinger.** Hostinger shared hosting offers MySQL + PHP only — it cannot replace Supabase's login, file uploads, security rules, and browser-callable API. Moving would mean rewriting the entire working competitions product in PHP and rebuilding auth/storage by hand. That is the opposite of Pareto. **Keep the site on Hostinger and the database on Supabase.** They already work together; that split is correct.
- **Hardcoded admin email.** The founder's admin access is set in SQL by email (`handle_new_user()` in `schema.sql`). If the founder's email changes, or a co-admin is needed, that's a deliberate SQL change — don't forget it exists.
- **Everything content-like is a hardcoded array.** Fine at current scale (Pareto-correct). It stops scaling past ~20–30 items per list, or once the founder wants to add content without an AI/developer. Don't build a CMS preemptively — flag it only when volume actually demands it.
- **Manual cache-busting** (`?v=`) is the most common source of "my change isn't showing." Always bump it.
- **This site was started by a previous developer.** Some code may be rough. Improve incrementally and safely; don't do risky big-bang rewrites of the one working product (competitions).

---

## 6. Current focus

**Finishing / polishing the Playbooks page.** The mechanics already work — `playbook.html` renders any stream from `playbooks.js`. Likely work is content depth, additional streams, or visual polish. Confirm the specific gap with the founder before editing, then follow the conventions in §3 (especially bump `?v=` if `gl.css`/`playbooks.js` change).
