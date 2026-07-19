# Conversation Log

Newest first. Append a short dated entry at the end of each conversation: what was done, decisions made, and what's next.

---

## 2026-07-18
- Explored the repo and established what it is: static HTML/CSS/JS site + Supabase backend (see [project.md](project.md)).
- Created `CLAUDE.md` in the project root (architecture + product status + guardrails).
- Set up this in-repo `memory/` folder as the persistent memory (moved from the hidden `.claude` folder at founder's request) so context survives a cleared chat.
- **Reorganized the folder:** moved `gl.css` → `css/`, all 6 JS files → `js/`, renamed typo folder `invetory` → `design-source`. Updated all CSS/JS refs in the 14 HTML pages and verified zero stray references. HTML pages intentionally kept at root (they're live URLs). Confirmed `js/competitions.js` is unused dead code (offered to delete, awaiting OK). `?v=` cache numbers left unchanged — the new path already busts the cache.
- **Decision:** keep the database on Supabase, do NOT move it to Hostinger.
- **Tooling:** Enabled `code-review` plugin. `playwright` + `frontend-design` already active. Founder connected the **Supabase MCP** via the claude.ai connector (`mcp.supabase.com`) — shows Connected; tools load after a Claude Code restart. NOTE: connector method may NOT be read-only (unlike the `--read-only` npx command originally suggested) — always confirm before any DB write; founder can enable read-only in connector settings on claude.ai. Project ref: `ibxyrmzyrqggfeuxzzze`.
- **Deleted** `js/competitions.js` (dead code), per founder OK.
- **Git connected:** the working folder was a disconnected ZIP download (`EmbarkIndia-main`, no git). Initialized git, linked to public repo `NarentherMS/EmbarkIndia` (branch `main`), reset onto origin/main history, committed today's work, and pushed (commit 725431d). Hostinger's Git connector deploys from this repo. Founder authenticated via Git Credential Manager (cached for future pushes). Deploy workflow now: edit here → commit → push → Hostinger deploys.
- **Excluded from git:** `design-source/` (~100 MB of design .docx — would have bloated the repo AND deployed to the live site). Added `.gitignore`. Also blocked `.md` files from public web via `.htaccess`.
- **Next:** confirm Hostinger deployed the push (auto or one-click in hPanel) and the live site loads (CSS/JS now under `css/` and `js/`). Then finish/polish the Playbooks page — still need the founder to specify the exact gap (content vs design vs a broken section).

---

## 2026-07-19
- **Removed the Blog service entirely** (service #8 in CLAUDE.md §4) at founder's request. Deleted `blog.html`, `blog-post.html`, `js/posts.js`. Removed the "Featured Blogs" section from the homepage (`index.html`) — markup, its `POSTS`-driven JS, the `js/posts.js` script tag, and all dead `.bloghl`/`.fb-*`/`.fbf-*`/`.bh-*` CSS (kept `.spot-pill`, still used by the College spotlight). Stripped the "Blog" nav link, mobile-menu link, and "The eMBArk Times" footer link from all 12 pages. Deleted the dead blog/article/comments block (`.blog-*`/`.post-*`/`.article-*`/`.comments`) from `css/gl.css`.
- **Fixed leftover blog references:** college cards on the homepage now link to `playbooks.html` (was `blog.html`); mentorship cross-sell + playbook "next" copy reworded to point at playbooks; playbook college chips now render as plain non-link chips (`.pb-colleges span`).
- Bumped `css/gl.css?v=5` → `v=6` across all pages (edited gl.css). Verified in browser: zero blog traces, no console errors, spot-pill + college chips styled correctly. Committed (7e651ff) and pushed to `main`.
- **Note:** CLAUDE.md §4 still lists Blog as service #8 — update it if the founder wants the docs to match. Left as-is for now (not asked).
- **Next:** unchanged — Hostinger deploy confirmation + Playbooks polish.
