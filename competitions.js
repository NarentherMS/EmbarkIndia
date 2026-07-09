// Embark India — Case Competition Portal (prototype data layer).
// Statuses are ALWAYS computed from dates (spec 5.2/7) — never stored.
// Prototype "database" = localStorage; seed dates are relative to today so
// the demo always has live / upcoming / closed competitions.
// Sponsors are fictional placeholders.

const _now = () => new Date();
const _d = days => { const t = new Date(); t.setHours(0,0,0,0); t.setDate(t.getDate() + days); return t.toISOString(); };
const _h = hours => { const t = new Date(); t.setMinutes(0,0,0); t.setHours(t.getHours() + hours); return t.toISOString(); };

const COMP_SEED = [
  {
    id: 'fmcg-growth-sprint',
    title: 'Embark Case Sprint: FMCG Growth Challenge',
    host: 'Embark India × Meridian Consumer Goods',
    category: 'Marketing',
    banner: 'orange',
    fee: 0,
    teamMin: 1, teamMax: 4,
    eligibility: 'MBA/PGDM students of any year, any B-school in India. Cross-college teams allowed.',
    about: 'A real growth problem from a national FMCG player: a heritage brand losing shelf share to D2C challengers. Three rounds from screening deck to a live boardroom pitch. Built for Tier 2 talent hunting a resume signal — and the sponsor is watching for PPI candidates.',
    rules: [
      'Teams of 1–4; one submission per team per round',
      'Decks in PDF, max 12 slides plus appendix',
      'Plagiarism = disqualification; data sources must be cited',
      'Judging is offline by the sponsor and Embark panel; decisions are final'
    ],
    prizes: [
      ['Winner', '₹30,000 + PPI interviews with the sponsor'],
      ['1st runner-up', '₹15,000 + PPI interviews'],
      ['2nd runner-up', '₹5,000'],
      ['All finalists', 'Winner-track certificate + mentor session']
    ],
    ppo: true,
    regOpen: _d(-5), regClose: _d(4), start: _d(-2), end: _d(12), result: _d(15),
    rounds: [
      { name: 'Round 1 — Screening deck', brief: 'Diagnose the share loss and propose your growth thesis in 5 slides.', opens: _h(-24), closes: _h(72) },
      { name: 'Round 2 — Full solution', brief: 'Complete 12-slide strategy: portfolio, pricing, channel and media plan with financials.', opens: _d(5), closes: _d(8) },
      { name: 'Finals — Live boardroom pitch', brief: 'Online pitch to the sponsor CXO panel. 10 minutes, then Q&A.', opens: _d(10), closes: _d(11) }
    ],
    seedRegs: 87
  },
  {
    id: 'quickcommerce-ops-clash',
    title: 'SwiftCart Quick-Commerce Ops Clash',
    host: 'SwiftCart (with Embark India)',
    category: 'Operations',
    banner: 'green',
    fee: 299,
    teamMin: 2, teamMax: 4,
    eligibility: 'First and final-year MBA/PGDM students. One team per person.',
    about: 'Dark-store economics under 10-minute delivery pressure. Design the network, fix the unit economics, defend it to people who run this exact problem daily. The strongest ops case of the season, with a PPO track for finalists.',
    rules: [
      'Teams of 2–4 from the same institute',
      'Round 1 is a structured Excel + memo submission',
      'Registration fee is per team, non-transferable',
      'Judging is offline by SwiftCart ops leadership'
    ],
    prizes: [
      ['Winner', '₹40,000 + PPO-track interviews'],
      ['1st runner-up', '₹25,000 + PPO-track interviews'],
      ['2nd runner-up', '₹10,000']
    ],
    ppo: true,
    regOpen: _d(-3), regClose: _d(2), start: _d(3), end: _d(20), result: _d(23),
    rounds: [
      { name: 'Round 1 — Ops audit', brief: 'One dark store, real (sanitised) numbers. Find the bleed, write the memo.', opens: _d(3), closes: _d(6) },
      { name: 'Round 2 — Network design', brief: 'Scale the fix across a city. Capex, TAT and cost-per-order targets given.', opens: _d(9), closes: _d(12) },
      { name: 'Finals — War room', brief: 'Live scenario round: demand spikes, rider shortage, your call.', opens: _d(17), closes: _d(18) }
    ],
    seedRegs: 54
  },
  {
    id: 'bharat-marketing-league',
    title: 'Bharat Marketing League',
    host: 'Embark India',
    category: 'Marketing',
    banner: 'dark',
    fee: 0,
    teamMin: 1, teamMax: 3,
    eligibility: 'Open to all MBA/PGDM students. Tier 2 and Tier 3 college teams especially encouraged.',
    about: 'Go-to-market for the next 500 million: a rural-first launch challenge. Two rounds, fully online, designed so a strong team from any campus can beat a brand-name college on the merits.',
    rules: [
      'Teams of 1–3, any college mix',
      'Round 1 is a 3-slide concept note',
      'All submissions in English or Hinglish — clarity beats polish'
    ],
    prizes: [
      ['Winner', '₹20,000 + feature on The eMBArk Times'],
      ['Runner-up', '₹10,000'],
      ['Top 10', 'Winner-track certificates']
    ],
    ppo: false,
    regOpen: _d(6), regClose: _d(14), start: _d(15), end: _d(30), result: _d(33),
    rounds: [
      { name: 'Round 1 — Concept note', brief: 'Pick a category, define the wedge, three slides.', opens: _d(15), closes: _d(20) },
      { name: 'Finals — Full GTM', brief: 'Complete rural go-to-market with budget and channel math.', opens: _d(24), closes: _d(28) }
    ],
    seedRegs: 0
  },
  {
    id: 'analytics-case-cup',
    title: 'Northline Analytics Case Cup',
    host: 'Northline Analytics (with Embark India)',
    category: 'Analytics',
    banner: 'charcoal',
    fee: 199,
    teamMin: 1, teamMax: 3,
    eligibility: 'MBA/PGDM students with basic SQL/Excel.',
    about: 'A churn dataset, a revenue target, and 72 hours per round. The season\'s sharpest analytics case — completed last month with 214 teams from 63 campuses.',
    rules: ['Teams of 1–3', 'Dataset use governed by NDA-lite terms', 'Code + deck submitted together'],
    prizes: [
      ['Winner', '₹35,000 + interview fast-track'],
      ['1st runner-up', '₹15,000'],
      ['2nd runner-up', '₹5,000']
    ],
    ppo: true,
    regOpen: _d(-45), regClose: _d(-32), start: _d(-40), end: _d(-10), result: _d(-7),
    rounds: [
      { name: 'Round 1 — Diagnostic', brief: 'Find the churn drivers.', opens: _d(-40), closes: _d(-35) },
      { name: 'Round 2 — Model & plan', brief: 'Predict and prescribe.', opens: _d(-30), closes: _d(-25) },
      { name: 'Finals — Executive readout', brief: 'Ten minutes with the CXO panel.', opens: _d(-12), closes: _d(-11) }
    ],
    seedRegs: 214,
    seedWinners: [
      { rank: 1, team: 'Team Regression Rebels', college: 'IIM Ranchi' },
      { rank: 2, team: 'Insight Engine', college: 'GIM Goa' },
      { rank: 3, team: 'Two-Tailed Tests', college: 'K J Somaiya' }
    ]
  },
  {
    id: 'people-case-challenge',
    title: 'The People Case Challenge',
    host: 'Embark India',
    category: 'Human Resources',
    banner: 'green',
    fee: 0,
    teamMin: 1, teamMax: 4,
    eligibility: 'Draft — being finalised.',
    about: 'An HR transformation case. Draft — not yet published.',
    rules: ['Draft'],
    prizes: [['Winner', 'TBD']],
    ppo: false,
    draft: true,
    regOpen: _d(20), regClose: _d(30), start: _d(31), end: _d(45), result: _d(48),
    rounds: [{ name: 'Round 1', brief: 'TBD', opens: _d(31), closes: _d(35) }],
    seedRegs: 0
  }
];

/* ---------------- store (prototype "database") ---------------- */
const CCP_KEY = 'embark_ccp_v1';
function ccpLoad() {
  try { return JSON.parse(localStorage.getItem(CCP_KEY)) || {}; } catch { return {}; }
}
function ccpSave(db) { localStorage.setItem(CCP_KEY, JSON.stringify(db)); }
function ccpGet(section, fallback) {
  const db = ccpLoad();
  return db[section] !== undefined ? db[section] : fallback;
}
function ccpSet(section, value) {
  const db = ccpLoad();
  db[section] = value;
  ccpSave(db);
}

/* competitions = seed (minus deleted, with overrides) + admin-created */
function allComps(includeDrafts = false) {
  const overrides = ccpGet('overrides', {});
  const deleted = ccpGet('deleted', []);
  const custom = ccpGet('customComps', []);
  const seed = COMP_SEED
    .filter(c => !deleted.includes(c.id))
    .map(c => ({ ...c, ...(overrides[c.id] || {}) }));
  const all = [...seed, ...custom.filter(c => !deleted.includes(c.id))];
  return includeDrafts ? all : all.filter(c => !c.draft);
}
function getComp(id, includeDrafts = true) {
  return allComps(includeDrafts).find(c => c.id === id) || null;
}

/* status — ALWAYS computed from dates (spec 7) */
function compStatus(c) {
  const now = _now().toISOString();
  if (now < c.start) return 'upcoming';
  if (now <= c.end) return 'live';
  return 'closed';
}
function regWindow(c) {
  const now = _now().toISOString();
  if (now < c.regOpen) return 'not-open';
  if (now <= c.regClose && compStatus(c) !== 'closed') return 'open';
  return 'closed';
}
function roundWindow(r) {
  const now = _now().toISOString();
  if (now < r.opens) return 'not-open';
  if (now <= r.closes) return 'open';
  return 'closed';
}

/* registrations */
function regsFor(compId) { return ccpGet('regs', {})[compId] || []; }
function addReg(compId, reg) {
  const regs = ccpGet('regs', {});
  regs[compId] = regs[compId] || [];
  regs[compId].push(reg);
  ccpSet('regs', regs);
}
function myReg(compId) {
  const me = ccpGet('me', null);
  if (!me) return null;
  return regsFor(compId).find(r => r.lead.email === me.email) || null;
}

/* submissions: subs[compId][roundIdx][teamId] = {name, kind, ts} */
function subsFor(compId) { return ccpGet('subs', {})[compId] || {}; }
function addSub(compId, roundIdx, teamId, sub) {
  const all = ccpGet('subs', {});
  all[compId] = all[compId] || {};
  all[compId][roundIdx] = all[compId][roundIdx] || {};
  all[compId][roundIdx][teamId] = sub;
  ccpSet('subs', all);
}

/* advancement: adv[compId][roundIdx] = [teamIds] (spec 5.4 — picked from list) */
function advFor(compId) { return ccpGet('adv', {})[compId] || {}; }
function setAdv(compId, roundIdx, teamIds) {
  const all = ccpGet('adv', {});
  all[compId] = all[compId] || {};
  all[compId][roundIdx] = teamIds;
  ccpSet('adv', all);
}

/* winners: winners[compId] = [{teamId, rank}] */
function winnersFor(compId) { return ccpGet('winners', {})[compId] || []; }
function setWinners(compId, list) {
  const all = ccpGet('winners', {});
  all[compId] = list;
  ccpSet('winners', all);
}

/* helpers */
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
function fmtDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}
function countdown(iso) {
  let ms = new Date(iso) - _now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 864e5); ms -= d * 864e5;
  const h = Math.floor(ms / 36e5); ms -= h * 36e5;
  const m = Math.floor(ms / 6e4); ms -= m * 6e4;
  const s = Math.floor(ms / 1e3);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}
function totalRegs(c) { return (c.seedRegs || 0) + regsFor(c.id).length; }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); }
