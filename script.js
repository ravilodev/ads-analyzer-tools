/* ═══════════════════════════════════════════════
   RAVILO DIGI — Shopee Ads Analyzer
   script.js
════════════════════════════════════════════════ */

// ── SUPABASE ──
const SUPABASE_URL  = 'https://ueglkmjpghukzreuznev.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZ2xrbWpwZ2h1a3pyZXV6bmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzk5MDMsImV4cCI6MjA5Mjc1NTkwM30.69i5F6IAnPF3BKMrZH3pUZWR8ENRF4vbYSq8VsiqUQk';
const supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

const SESSION_KEY = 'ravilo_session';

// ══════════════════════════════════════════════
// SESSION
// ══════════════════════════════════════════════
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// ══════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════
async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  const btn      = document.querySelector('#loginPage .btn-primary');

  if (!email || !password) {
    errEl.textContent = 'Email dan password wajib diisi.';
    errEl.style.display = 'block';
    return;
  }

  btn.innerHTML = '<span class="spinner"></span> Memeriksa...';
  btn.disabled = true;

  try {
    const { data, error } = await supa
      .from('subscribers')
      .select('email, name')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      errEl.textContent = 'Email atau password salah.';
      errEl.style.display = 'block';
    } else {
      errEl.style.display = 'none';
      saveSession(data);
      showApp(data);
    }
  } catch {
    errEl.textContent = 'Koneksi gagal. Periksa internet kamu.';
    errEl.style.display = 'block';
  }

  btn.innerHTML = `${ICONS.login} Masuk ke Dashboard`;
  btn.disabled = false;
}

function doLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('loginPage').classList.add('active');
  document.getElementById('appPage').style.display = 'none';
  document.getElementById('navbar').style.display = 'none';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

function showApp(user) {
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('navbar').style.display = 'flex';
  document.getElementById('appPage').style.display = 'block';
  document.getElementById('navUserName').textContent = user.name;
  renderHistory(user.email);
}

// ══════════════════════════════════════════════
// SVG ICON LIBRARY
// ══════════════════════════════════════════════
const ICONS = {
  login:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  logout:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  user:       `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  lock:       `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  chart:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  edit:       `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  tag:        `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  zap:        `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  refresh:    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  search:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  rocket:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  calendar:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  info:       `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  copy:       `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  trash:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  alert:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  xCircle:    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  trending:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  trendingDn: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,
  settings:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
  target:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  box:        `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  shield:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  dollar:     `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  image:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  award:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  pause:      `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
};

// ══════════════════════════════════════════════
// ANALYZE
// ══════════════════════════════════════════════
let lastResult = null;

function analyzeAds() {
  const name         = document.getElementById('f_name').value.trim() || 'Produk Tanpa Nama';
  const hpp          = parseFloat(document.getElementById('f_hpp').value);
  const price        = parseFloat(document.getElementById('f_price').value);
  const adspend      = parseFloat(document.getElementById('f_adspend').value);
  const revenue      = parseFloat(document.getElementById('f_revenue').value);
  const platform_pct = parseFloat(document.getElementById('f_platform').value) || 25;

  if ([hpp, price, adspend, revenue].some(v => isNaN(v) || v <= 0)) {
    alert('Mohon isi semua field dengan angka yang valid.');
    return;
  }
  if (hpp >= price) {
    alert('Harga jual harus lebih besar dari modal/HPP.');
    return;
  }

  const btn = document.getElementById('analyzeBtnText');
  btn.innerHTML = '<span class="spinner"></span> Menganalisis...';

  setTimeout(() => {
    btn.innerHTML = `${ICONS.zap} Analisis Iklan Saya`;

    const hpp_ratio       = hpp / price;
    const margin_pct      = ((price - hpp) / price) * 100;
    const real_margin_pct = margin_pct - platform_pct;
    const roas            = revenue / adspend;
    const acos            = (adspend / revenue) * 100;
    const breakeven       = real_margin_pct;
    const units           = revenue / price;

    const platform_cost   = revenue * (platform_pct / 100);
    const gross_profit    = revenue * (1 - hpp_ratio);
    const net_profit      = gross_profit - platform_cost - adspend;
    const cpo             = adspend / units;
    const roi             = net_profit > 0 ? (net_profit / (adspend + platform_cost)) * 100 : 0;

    const net_margin_pct  = real_margin_pct - acos;

    let status, color, verdict_label, verdict_text;
    if (net_margin_pct < 0) {
      status = 'RUGI'; color = 'red';
      verdict_label = 'Iklan Sedang Rugi';
      verdict_text  = `Margin kotor ${margin_pct.toFixed(1)}% − platform ${platform_pct.toFixed(1)}% − ACoS ${acos.toFixed(1)}% = sisa <strong>${net_margin_pct.toFixed(1)}%</strong>. Setiap penjualan dari iklan menggerus modal.`;
    } else if (net_margin_pct < 10) {
      status = 'TIDAK LAYAK'; color = 'red';
      verdict_label = 'Margin Terlalu Tipis';
      verdict_text  = `Margin kotor ${margin_pct.toFixed(1)}% − platform ${platform_pct.toFixed(1)}% − ACoS ${acos.toFixed(1)}% = hanya sisa <strong>${net_margin_pct.toFixed(1)}%</strong>. Tidak ada ruang untuk error, retur, atau diskon.`;
    } else if (net_margin_pct < 20) {
      status = 'TIPIS'; color = 'yellow';
      verdict_label = 'Iklan Perlu Dioptimasi';
      verdict_text  = `Sisa bersih <strong>${net_margin_pct.toFixed(1)}%</strong> setelah platform ${platform_pct.toFixed(1)}% + ACoS ${acos.toFixed(1)}%. Masih untung tapi tipis — jangan scale sebelum ACoS turun.`;
    } else {
      status = 'SEHAT'; color = 'green';
      verdict_label = 'Iklan Kamu Sehat';
      verdict_text  = `Sisa bersih <strong>${net_margin_pct.toFixed(1)}%</strong> setelah platform ${platform_pct.toFixed(1)}% + ACoS ${acos.toFixed(1)}%. ROAS ${roas.toFixed(1)}x — efisien dan layak di-scale.`;
    }

    const result = {
      name, hpp, price, adspend, revenue, units,
      platform_pct, platform_cost,
      margin_pct, real_margin_pct,
      roas, acos, breakeven,
      gross_profit, net_profit, net_margin_pct,
      cpo, roi, status, color,
      verdict_label, verdict_text,
      date: new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    };

    lastResult = result;
    renderResults(result);
    renderRecos(result);
    saveAnalysis(result);
    const session = getSession();
    if (session) renderHistory(session.email);
  }, 800);
}

// ══════════════════════════════════════════════
// RENDER RESULTS
// ══════════════════════════════════════════════
function renderResults(r) {
  const verdictIconMap = {
    red:    ICONS.xCircle,
    yellow: ICONS.alert,
    green:  ICONS.check,
  };

  const roasColor = r.roas >= (100 / r.real_margin_pct) ? 'green' : 'red';
  const acosColor = r.net_margin_pct >= 20 ? 'green' : r.net_margin_pct >= 10 ? 'orange' : 'red';

  const html = `
    <div class="verdict ${r.color}">
      <div class="verdict-icon">${verdictIconMap[r.color]}</div>
      <div>
        <div class="verdict-label">${r.verdict_label}</div>
        <div class="verdict-text">${r.verdict_text}</div>
      </div>
    </div>

    <div style="background:#F8F4FF;border-radius:12px;padding:14px 16px;margin-bottom:16px;">
      <div style="font-size:0.72rem;font-weight:700;color:var(--dark);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">
        Komposisi dari Setiap Rp Penjualan
      </div>
      <div style="display:flex;border-radius:8px;overflow:hidden;height:24px;gap:1px;">
        <div style="width:${(r.hpp/r.price*100).toFixed(1)}%;background:#C9A0F0;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700;color:#fff;overflow:hidden;padding:0 4px;">
          HPP ${(r.hpp/r.price*100).toFixed(0)}%
        </div>
        <div style="width:${r.platform_pct.toFixed(1)}%;background:#9B8BB0;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700;color:#fff;overflow:hidden;padding:0 4px;">
          Platform ${r.platform_pct.toFixed(0)}%
        </div>
        <div style="width:${Math.min(r.acos, r.real_margin_pct > 0 ? r.real_margin_pct : 0).toFixed(1)}%;background:${r.color==='red'?'#EF476F':'#FFD166'};display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700;color:${r.color==='yellow'?'#6B4500':'#fff'};overflow:hidden;padding:0 4px;">
          Iklan ${r.acos.toFixed(0)}%
        </div>
        <div style="flex:1;min-width:2%;background:${r.color==='green'?'#06D6A0':r.color==='yellow'?'#FFB347':'#EF476F'};display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700;color:#fff;overflow:hidden;padding:0 4px;">
          ${r.net_margin_pct > 0 ? 'Bersih ' + r.net_margin_pct.toFixed(0) + '%' : 'RUGI'}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;margin-top:8px;font-size:0.68rem;color:var(--gray);text-align:center;">
        <span>HPP<br><strong style="color:var(--dark)">${(r.hpp/r.price*100).toFixed(1)}%</strong></span>
        <span>Platform<br><strong style="color:#9B8BB0">${r.platform_pct.toFixed(1)}%</strong></span>
        <span>Iklan<br><strong style="color:${acosColor==='green'?'#059669':acosColor==='orange'?'var(--orange)':'var(--red)'};">${r.acos.toFixed(1)}%</strong></span>
        <span>Sisa<br><strong style="color:${r.color==='green'?'#059669':r.color==='yellow'?'#B45309':'var(--red)'};">${r.net_margin_pct.toFixed(1)}%</strong></span>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-tile">
        <div class="metric-name">ROAS</div>
        <div class="metric-value ${roasColor}">${r.roas.toFixed(2)}x</div>
        <div class="metric-desc">Break-even: ${r.real_margin_pct > 0 ? (100/r.real_margin_pct).toFixed(1)+'x' : '–'} | Aman: ${r.real_margin_pct > 20 ? (100/(r.real_margin_pct-20)).toFixed(1)+'x' : 'N/A'}</div>
      </div>
      <div class="metric-tile">
        <div class="metric-name">ACoS</div>
        <div class="metric-value ${acosColor}">${r.acos.toFixed(1)}%</div>
        <div class="metric-desc">Break-even: ${r.breakeven.toFixed(1)}% | Sisa: ${r.net_margin_pct.toFixed(1)}%</div>
      </div>
      <div class="metric-tile">
        <div class="metric-name">Laba Bersih Iklan</div>
        <div class="metric-value ${r.net_profit >= 0 ? 'purple' : 'red'}">${r.net_profit >= 0 ? '+' : ''}${formatRp(r.net_profit)}</div>
        <div class="metric-desc">(dari revenue iklan bulan ini)</div>
      </div>
      <div class="metric-tile">
        <div class="metric-name">Cost per Order</div>
        <div class="metric-value orange">${formatRp(r.cpo)}</div>
        <div class="metric-desc">Per produk dari iklan</div>
      </div>
    </div>

    <hr class="divider">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.8rem;color:var(--gray)">
      <div>Margin kotor: <strong style="color:var(--dark)">${r.margin_pct.toFixed(1)}%</strong></div>
      <div>Sisa bersih: <strong style="color:${r.color==='green'?'#059669':r.color==='yellow'?'#B45309':'var(--red)'};">${r.net_margin_pct.toFixed(1)}%</strong></div>
      <div>Biaya platform: <strong style="color:#9B8BB0">−${formatRp(r.platform_cost)}</strong></div>
      <div>Est. unit: <strong style="color:var(--dark)">${Math.round(r.units)} pcs</strong></div>
    </div>`;

  document.getElementById('resultsBody').innerHTML = html;
}

// ══════════════════════════════════════════════
// RENDER RECOMMENDATIONS
// ══════════════════════════════════════════════
function renderRecos(r) {
  const target_acos_pct  = r.real_margin_pct - 20;
  const target_roas_safe = target_acos_pct > 0
    ? (100 / target_acos_pct).toFixed(1) + 'x'
    : 'Tidak disarankan iklan';
  const roas_breakeven   = r.real_margin_pct > 0
    ? (100 / r.real_margin_pct).toFixed(1) + 'x'
    : '–';
  const roas_safe_label  = target_acos_pct > 0
    ? (100 / target_acos_pct).toFixed(1) + 'x atau lebih tinggi'
    : 'Margin terlalu kecil untuk iklan';

  const recos = [];

  if (r.status === 'RUGI') {
    recos.push({ icon: ICONS.pause,     text: `Naikkan Target ROAS di GMV Max secara signifikan. Dengan margin nyata ${r.real_margin_pct.toFixed(1)}%, ROAS minimum agar tidak rugi adalah ${roas_breakeven}. ROAS kamu saat ini ${r.roas.toFixed(1)}x — belum cukup.` });
    recos.push({ icon: ICONS.trending,  text: `Set Target ROAS di GMV Max ke ${Math.ceil(parseFloat(roas_breakeven) * 10) / 10}x dulu sebagai titik aman. Shopee akan otomatis mengejar traffic yang lebih efisien.` });
    recos.push({ icon: ICONS.image,     text: 'Perbaiki konversi produk terlebih dahulu: foto utama, judul, dan harga. GMV Max bekerja optimal hanya jika halaman produk sudah menarik — ROAS tidak akan naik jika listing lemah.' });
    recos.push({ icon: ICONS.dollar,    text: `Pertimbangkan naikkan harga jual atau negosiasi ulang harga modal. Margin nyata ${r.real_margin_pct.toFixed(1)}% terlalu kecil — bahkan tanpa iklan pun keuntungannya sangat rentan.` });
  } else if (r.status === 'TIDAK LAYAK') {
    recos.push({ icon: ICONS.trendingDn,text: `Sisa bersih hanya ${r.net_margin_pct.toFixed(1)}% — sangat berisiko. Di GMV Max, naikkan Target ROAS ke minimal ${target_roas_safe} agar sisa margin mencapai 20%.` });
    recos.push({ icon: ICONS.settings,  text: `Cara naikkan ROAS di GMV Max: masuk ke kampanye → ubah "Target ROAS" ke ${target_roas_safe}. Shopee akan selektif memilih audience yang lebih likely to convert.` });
    recos.push({ icon: ICONS.image,     text: 'Optimasi listing produk: tambah video, perbaiki deskripsi, kumpulkan lebih banyak review. GMV Max memberi prioritas pada produk dengan engagement tinggi.' });
    recos.push({ icon: ICONS.dollar,    text: 'Naikkan harga jual jika memungkinkan. Setiap kenaikan harga langsung perlebar margin dan turunkan ACoS tanpa perlu ubah apapun di iklan.' });
  } else if (r.status === 'TIPIS') {
    recos.push({ icon: ICONS.settings,  text: `Sisa margin ${r.net_margin_pct.toFixed(1)}% masih tipis. Di GMV Max, naikkan Target ROAS secara bertahap ke ${target_roas_safe}. Pantau apakah volume penjualan turun drastis atau tidak.` });
    recos.push({ icon: ICONS.trending,  text: `Naikkan Target ROAS di GMV Max bertahap — tambah 0.5x per minggu. Jika penjualan stabil, lanjutkan. Jika drop lebih dari 30%, tahan di level itu dulu.` });
    recos.push({ icon: ICONS.box,       text: 'Perlebar margin dari sisi produk: bundle item kecil sebagai bonus, atau perbaiki packaging agar bisa justify harga lebih tinggi tanpa kehilangan konversi.' });
    recos.push({ icon: ICONS.chart,     text: `Target 30 hari: ACoS turun dari ${r.acos.toFixed(1)}% ke bawah ${target_acos_pct.toFixed(1)}%. Cek ulang bulan depan — jika tidak ada perubahan, evaluasi ulang harga atau produk.` });
  } else {
    recos.push({ icon: ICONS.rocket,    text: `Margin bersih ${r.net_margin_pct.toFixed(1)}% sangat sehat. Di GMV Max, kamu bisa turunkan sedikit Target ROAS (jangan di bawah ${roas_breakeven}) agar Shopee menangkap volume lebih banyak.` });
    recos.push({ icon: ICONS.dollar,    text: `Saat scale di GMV Max, pantau titik optimalnya: jika ACoS mulai mendekati ${(r.real_margin_pct - 20).toFixed(0)}%, itu batas bawah — jangan turunkan Target ROAS lebih jauh.` });
    recos.push({ icon: ICONS.award,     text: 'Aktifkan GMV Max untuk produk-produk serupa di tokomu. Produk dengan listing bagus + margin sehat adalah kombinasi terbaik untuk GMV Max bekerja optimal.' });
    recos.push({ icon: ICONS.shield,    text: 'Jangan tergoda perang harga. Margin sehat ini adalah keunggulan — investasikan profit ke foto profesional, stok lebih banyak, dan review produk.' });
  }

  const roasBox = `
    <div style="background:linear-gradient(135deg,#F0E6FF,#FFE6F0);border:1.5px solid #D4A8FF;border-radius:12px;padding:14px 16px;margin-bottom:12px;display:flex;gap:14px;align-items:center;">
      <div style="width:40px;height:40px;background:white;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
      </div>
      <div>
        <div style="font-size:0.7rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;">Target ROAS GMV Max yang Disarankan</div>
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:1.35rem;color:var(--dark);">${roas_safe_label}</div>
        <div style="font-size:0.72rem;color:var(--gray);margin-top:2px;">Break-even minimum: ${roas_breakeven} &nbsp;·&nbsp; Sisa margin aman: &ge;20%</div>
      </div>
    </div>`;

  document.getElementById('recoList').innerHTML = roasBox + recos.map(item =>
    `<div class="reco-item"><div class="reco-icon">${item.icon}</div><span>${item.text}</span></div>`
  ).join('');

  document.getElementById('recoCard').style.display = 'block';
}

// ══════════════════════════════════════════════
// SUPABASE — SAVE & HISTORY
// ══════════════════════════════════════════════
async function saveAnalysis(result) {
  const session = getSession();
  if (!session) return;
  try {
    await supa.from('analyses').insert({
      user_email: session.email,
      name: result.name,
      data: result
    });
  } catch (e) {
    console.warn('Gagal simpan analisis:', e);
  }
}

async function renderHistory(email) {
  const el = document.getElementById('historyList');
  el.innerHTML = '<div class="empty-history" style="opacity:0.5">Memuat histori...</div>';

  try {
    const { data, error } = await supa
      .from('analyses')
      .select('id, name, data, created_at')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || !data.length) {
      el.innerHTML = '<div class="empty-history">Belum ada histori analisis. Mulai analisis pertamamu di atas.</div>';
      return;
    }

    window._historyCache = {};
    data.forEach(row => { window._historyCache[row.id] = row.data; });

    el.innerHTML = '<div class="history-list">' + data.map(row => {
      const item = row.data;
      return `
        <div class="history-item" onclick="loadHistoryItem('${row.id}')">
          <div>
            <div class="history-name">${item.name || row.name}</div>
            <div class="history-date">${item.date} &nbsp;·&nbsp; ROAS ${parseFloat(item.roas).toFixed(2)}x &nbsp;·&nbsp; ACoS ${parseFloat(item.acos).toFixed(1)}%</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="history-badge ${item.color}">${item.status}</span>
            <button class="btn-delete" onclick="event.stopPropagation();deleteHistory('${row.id}')" title="Hapus">
              ${ICONS.trash}
            </button>
          </div>
        </div>`;
    }).join('') + '</div>';

  } catch {
    el.innerHTML = '<div class="empty-history">Gagal memuat histori.</div>';
  }
}

function loadHistoryItem(id) {
  const item = window._historyCache && window._historyCache[id];
  if (!item) return;
  lastResult = item;
  renderResults(item);
  renderRecos(item);
  document.getElementById('recoCard').style.display = 'block';
  document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteHistory(id) {
  if (!confirm('Hapus analisis ini?')) return;
  try {
    await supa.from('analyses').delete().eq('id', id);
    const session = getSession();
    if (session) renderHistory(session.email);
  } catch {
    alert('Gagal menghapus.');
  }
}

// ══════════════════════════════════════════════
// COPY RESULT
// ══════════════════════════════════════════════
function copyResult() {
  if (!lastResult) return;
  const r = lastResult;
  const text =
`ANALISIS IKLAN SHOPEE — RAVILO DIGI
Produk : ${r.name}
Tanggal: ${r.date}

STATUS: ${r.status}
${'─'.repeat(32)}
ROAS        : ${r.roas.toFixed(2)}x
ACoS        : ${r.acos.toFixed(1)}%
Break-even  : ${r.breakeven.toFixed(1)}%
Sisa Margin : ${r.net_margin_pct.toFixed(1)}%
Laba Bersih : ${r.net_profit >= 0 ? '+' : ''}Rp${Math.abs(r.net_profit).toLocaleString('id')}
Cost/Order  : Rp${Math.round(r.cpo).toLocaleString('id')}

Dianalisis via Ravilo Digi Shopee Ads Analyzer`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.innerHTML = `${ICONS.check} Berhasil disalin!`;
    setTimeout(() => { btn.innerHTML = `${ICONS.copy} Salin Ringkasan Hasil`; }, 2000);
  });
}

// ══════════════════════════════════════════════
// RESET FORM
// ══════════════════════════════════════════════
function resetForm() {
  ['f_name','f_hpp','f_price','f_adspend','f_revenue'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('resultsBody').innerHTML = `
    <div class="results-placeholder">
      <div class="placeholder-icon">${ICONS.search}</div>
      <p>Isi form dan klik Analisis untuk melihat diagnosis iklanmu di sini.</p>
    </div>`;
  document.getElementById('recoCard').style.display = 'none';
  lastResult = null;
}

// ══════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════
function formatRp(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n < 0 ? '-' : '') + (abs / 1000000).toFixed(1) + 'jt';
  return (n < 0 ? '-' : '') + 'Rp' + abs.toLocaleString('id');
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.getElementById('loginPassword').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

window.addEventListener('load', () => {
  const session = getSession();
  if (session) showApp(session);
});
