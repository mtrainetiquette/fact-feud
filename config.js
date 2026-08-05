/* Fact Feud — shared config & helpers. Loaded by all three pages. */
const FF = (() => {
  const SUPABASE_URL = 'https://kkjqqyupcuapuwhznxnh.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_LNasopEjo_0UY-7872aePQ_ALI4mx-o';

  const sb = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null; // buzzer page loads no supabase library at all

  const store = {
    get(k, fallback = null) {
      try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };

  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function randomSaltHex() {
    const a = new Uint8Array(16); crypto.getRandomValues(a);
    return [...a].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Tolerance band for a question row → {lo, hi}
  function band(q) {
    const v = Number(q.answer_value), t = Number(q.tolerance_value);
    return q.tolerance_mode === 'absolute'
      ? { lo: v - t, hi: v + t }
      : { lo: v * (1 - t / 100), hi: v * (1 + t / 100) };
  }

  const UNIT_FMT = {
    percent: v => `${fmtNum(v)}%`,
    dollars: v => `$${Number(v).toLocaleString('en-US')}`,
    persons: v => `${fmtNum(v)} people`,
    minutes: v => `${fmtNum(v)} min`,
    years:   v => `${fmtNum(v)} yrs`,
    count:   v => Number(v).toLocaleString('en-US'),
  };
  function fmtNum(v) {
    const n = Number(v);
    return Number.isInteger(n) ? n.toLocaleString('en-US')
      : n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  function fmtVal(v, unit) { return (UNIT_FMT[unit] || fmtNum)(v); }

  // Parse a typed guess: strips $, %, commas, spaces
  function parseGuess(s) {
    const n = Number(String(s).replace(/[$,%\s]/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  function toast(msg, bad = false) {
    let el = document.getElementById('ff-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'ff-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = bad ? 'bad show' : 'show';
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  return { sb, store, sha256Hex, randomSaltHex, band, fmtVal, fmtNum, parseGuess, toast };
})();
