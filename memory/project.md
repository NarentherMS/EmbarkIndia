# Project — Embark India

**Stack:** Plain static site — hand-written HTML/CSS/JS, no framework, no build, no npm. Backend is **Supabase** (auth + Postgres + storage + Row Level Security) wired in `js/db.js`. Content lists are hardcoded JS arrays: `js/mentors.js`, `js/playbooks.js`, `js/posts.js`.

**Folder layout (reorganized 2026-07-18):** `.html` pages at root (they're the live URLs — must stay); `css/gl.css` (one shared stylesheet, all design tokens); `js/` (all scripts incl. `db.js`, `nav.js`); `assets/` (images + `vendor/supabase.js`); `supabase/` (SQL setup); `memory/`; `design-source/` (design .docx, NOT deployed). `js/competitions.js` = unused dead code (old localStorage prototype), safe to delete.

**Hosting:** Website on **Hostinger** (shared, `.htaccess`); deploy = upload changed files, no build step. Database stays on **Supabase**.

**Manual cache-busting:** every css/js is linked with `?v=N`. Bump N in every page that links a file whenever that file changes, or changes appear not to work.

## The 8 intended services — real status
| # | Service | Status |
|---|---------|--------|
| 1 | Case competitions | ✅ Fully built (auth, registration, submissions, admin, winners, storage). The only revenue-capable product. |
| 2 | Mentorship | 🟡 Static page; mentors hardcoded in `mentors.js`; no booking/payments/DB |
| 3 | Jobs & internships | ❌ Not built |
| 4 | Courses | ❌ Not built |
| 5 | Guest lectures | 🟡 Static page + speaker/expert forms; no backend |
| 6 | Mock interviews & GDs | ❌ Not built |
| 7 | Stream playbooks | ✅ Built (6 streams, hardcoded in `playbooks.js`) |
| 8 | Blog | 🟡 Built but hardcoded in `posts.js`; no CMS |

**Monetization blockers:** no payments anywhere ("Phase 1: no payments") and money services have no backend. More static pages ≠ more revenue.

## Key decisions
- **2026-07-18 — Keep DB on Supabase, NOT Hostinger.** Founder wanted DB on Hostinger too; advised strongly against — Hostinger shared hosting is MySQL+PHP only, can't replace Supabase auth/storage/RLS/browser API; migrating = rewriting the working competitions product. Documented in `CLAUDE.md`.
- Admin access is set by hardcoded email in `supabase/schema.sql` (`handle_new_user()`).
- Hardcoded content arrays are Pareto-correct at current scale; don't build a CMS preemptively.

## Current focus
Finishing / polishing the **Playbooks page**. Mechanics already work (`playbook.html` renders any stream from `playbooks.js`); likely gap is content depth, more streams, or visual polish — confirm the specific gap before editing.
