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
- **Next:** finish/polish the Playbooks page — still need the founder to specify the exact gap (content vs design vs a broken section). Also: confirm whether to delete `js/competitions.js`.
