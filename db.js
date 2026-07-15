/* Embark India — Supabase data layer (Phase 1: no payments)
   The URL and anon key below are PUBLIC by design; all safety
   comes from Row Level Security rules in supabase/schema.sql. */

const SB_URL = 'https://ibxyrmzyrqggfeuxzzze.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieHlybXp5cnFnZ2ZldXh6enplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTU0MjIsImV4cCI6MjA5OTY3MTQyMn0.Asxt-bHTsP2E9HR37lCYNopj7kZ2V_pCvD_KmuxliTQ';

const sb = window.supabase.createClient(SB_URL, SB_ANON);

/* ---------------- auth ---------------- */
async function sbUser() {
  const { data } = await sb.auth.getUser();
  return data.user || null;
}
async function sbSendCode(email) {
  return sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
}
async function sbVerifyCode(email, code) {
  return sb.auth.verifyOtp({ email, token: code, type: 'email' });
}
async function sbSignOut() { await sb.auth.signOut(); }

async function sbProfile() {
  const u = await sbUser();
  if (!u) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', u.id).single();
  return data ? { ...data, email: u.email } : null;
}
async function sbSaveProfile(name, college) {
  const u = await sbUser();
  if (!u) return { error: { message: 'Not signed in' } };
  return sb.from('profiles').update({ name, college }).eq('id', u.id);
}

/* ---------------- competitions ---------------- */
function rowToComp(r) {
  return {
    id: r.id, title: r.title, host: r.host, category: r.category, banner: r.banner,
    fee: r.fee, teamMin: r.team_min, teamMax: r.team_max,
    eligibility: r.eligibility, about: r.about,
    rules: r.rules || [], prizes: r.prizes || [],
    ppo: r.ppo, beginner: r.beginner, draft: r.draft,
    regOpen: r.reg_open, regClose: r.reg_close,
    start: r.start_at, end: r.end_at, result: r.result_at,
    rounds: r.rounds || [], seedRegs: r.seed_regs
  };
}
async function dbComps(includeDrafts = false) {
  let q = sb.from('competitions').select('*').order('start_at', { ascending: true });
  if (!includeDrafts) q = q.eq('draft', false);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(rowToComp);
}
async function dbComp(id) {
  const { data, error } = await sb.from('competitions').select('*').eq('id', id).single();
  if (error) return null;
  return rowToComp(data);
}

/* ---------------- registrations ---------------- */
async function dbMyRegs() {
  const u = await sbUser();
  if (!u) return [];
  const { data } = await sb.from('registrations').select('*').eq('user_id', u.id);
  return data || [];
}
async function dbMyReg(compId) {
  const u = await sbUser();
  if (!u) return null;
  const { data } = await sb.from('registrations').select('*').eq('user_id', u.id).eq('comp_id', compId).maybeSingle();
  return data || null;
}
async function dbRegister(compId, teamName, members) {
  const u = await sbUser();
  if (!u) return { error: { message: 'Please sign in first.' } };
  return sb.from('registrations').insert({ comp_id: compId, user_id: u.id, team_name: teamName, members });
}

/* ---------------- submissions ---------------- */
async function dbMySubs(compId) {
  const reg = await dbMyReg(compId);
  if (!reg) return [];
  const { data } = await sb.from('submissions').select('*').eq('reg_id', reg.id);
  return data || [];
}
async function dbSubmit(compId, regId, roundIdx, file, link, note) {
  const u = await sbUser();
  if (!u) return { error: { message: 'Please sign in first.' } };
  let filePath = null;
  if (file) {
    filePath = `${u.id}/${compId}/round${roundIdx}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const up = await sb.storage.from('submissions').upload(filePath, file);
    if (up.error) return up;
  }
  const row = { comp_id: compId, reg_id: regId, round_idx: roundIdx, file_path: filePath, link: link || null, note: note || '' };
  const ins = await sb.from('submissions').insert(row);
  if (ins.error && ins.error.code === '23505') {
    return sb.from('submissions')
      .update({ file_path: filePath, link: link || null, note: note || '', updated_at: new Date().toISOString() })
      .eq('reg_id', regId).eq('round_idx', roundIdx);
  }
  return ins;
}
async function dbMyAdvancements(compId) {
  const reg = await dbMyReg(compId);
  if (!reg) return [];
  const { data } = await sb.from('advancements').select('*').eq('reg_id', reg.id);
  return data || [];
}

/* ---------------- results ---------------- */
async function dbWinners(compId) {
  const { data } = await sb.from('winners').select('*').eq('comp_id', compId).order('rank');
  return data || [];
}

/* ---------------- admin ---------------- */
async function dbIsAdmin() {
  const p = await sbProfile();
  return !!(p && p.is_admin);
}
async function dbSaveComp(comp) {
  return sb.from('competitions').upsert(comp);
}
async function dbDeleteComp(id) {
  return sb.from('competitions').delete().eq('id', id);
}
async function dbRegsFor(compId) {
  const { data } = await sb.from('registrations').select('*').eq('comp_id', compId).order('created_at');
  return data || [];
}
async function dbSubsFor(compId) {
  const { data } = await sb.from('submissions').select('*').eq('comp_id', compId);
  return data || [];
}
async function dbAdvFor(compId) {
  const { data } = await sb.from('advancements').select('*').eq('comp_id', compId);
  return data || [];
}
async function dbSetAdvancing(compId, roundIdx, regIds) {
  await sb.from('advancements').delete().eq('comp_id', compId).eq('round_idx', roundIdx);
  if (!regIds.length) return { error: null };
  return sb.from('advancements').insert(regIds.map(id => ({ comp_id: compId, round_idx: roundIdx, reg_id: id })));
}
async function dbSetWinners(compId, list) {
  await sb.from('winners').delete().eq('comp_id', compId);
  if (!list.length) return { error: null };
  return sb.from('winners').insert(list.map(w => ({ comp_id: compId, reg_id: w.regId, rank: w.rank, team_name: w.teamName })));
}
async function dbFileUrl(path) {
  const { data } = await sb.storage.from('submissions').createSignedUrl(path, 3600);
  return data ? data.signedUrl : null;
}
