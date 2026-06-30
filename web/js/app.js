// Shared logic: navigation, footer, data layer, animations and helpers.

// --- Navigation (injected on every page) ---
const NAV_LINKS = [
  { href: 'index.html',         label: 'Начало' },
  { href: 'korabi.html',        label: 'Кораби' },
  { href: 'razreshitelni.html', label: 'Разрешителни' },
  { href: 'dnevnik.html',       label: 'Дневник' },
  { href: 'inspekcii.html',     label: 'Инспекции' },
  { href: 'bileti.html',        label: 'Билети' },
];

function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

function buildNav() {
  const root = document.getElementById('nav-root');
  if (!root) return;
  const active = currentPage();
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${l.href === active ? 'active' : ''}">${l.label}</a>`
  ).join('');

  root.innerHTML = `
  <header class="nav" id="nav">
    <div class="container">
      <a class="brand" href="index.html">
        <span class="logo">${ICON.fish}</span>
        <span>ИАРА<small>Рибарство и аквакултури</small></span>
      </a>
      <nav class="nav-links" id="navLinks">${links}</nav>
      <div class="nav-cta">
        <a href="bileti.html" class="btn btn-ghost btn-sm">Купи билет</a>
        <span id="auth-slot"></span>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  });

  document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

function buildFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;
  root.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">
            <span class="logo">${ICON.fish}</span>
            <span>ИАРА<small>Изпълнителна агенция по рибарство и аквакултури</small></span>
          </a>
          <p class="mt-2" style="max-width:34ch;color:#9fb3d4;font-size:.92rem">
            Единна информационна система за управление на риболова, аквакултурите
            и проследяване на улова в Република България.
          </p>
        </div>
        <div>
          <h4>Системата</h4>
          <ul>
            <li><a href="korabi.html">Регистър на кораби</a></li>
            <li><a href="razreshitelni.html">Разрешителни</a></li>
            <li><a href="dnevnik.html">Електронен дневник</a></li>
            <li><a href="inspekcii.html">Инспекции</a></li>
          </ul>
        </div>
        <div>
          <h4>Услуги</h4>
          <ul>
            <li><a href="bileti.html">Любителски билети</a></li>
            <li><a href="profile.html">Личен кабинет</a></li>
            <li><a href="dnevnik.html">Проследяване на риба</a></li>
            <li><a href="index.html#kontakt">Контакти</a></li>
          </ul>
        </div>
        <div>
          <h4>Контакти</h4>
          <ul>
            <li>гр. Бургас, ул. „Княз Ал. Батенберг“ 1</li>
            <li>тел.: 0700 12 345</li>
            <li>iara@government.bg</li>
            <li>iara.government.bg</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Изпълнителна агенция по рибарство и аквакултури. Ученически проект.</span>
        <span>Изработено с HTML · CSS · JavaScript · Python · Снимки: Wikimedia Commons</span>
      </div>
    </div>
  </footer>`;
}

// --- SVG icons ---
const ICON = {
  fish: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z"/><path d="M2 12c2 0 4 1 4.5 0-.5-1-2.5 0-4.5 0Z"/><path d="M18 11v.01"/></svg>',
  shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  ship: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18 5 11h14l2 7"/><path d="M3 18c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><path d="M12 11V4l5 3-5 2"/></svg>',
  doc: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  ticket: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v14"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
};

// --- Data layer: talks to the Flask API, falls back to localStorage offline ---
const API_BASE = '/api';
const STORE_PREFIX = 'iara_store_';

function _store(resource, demo) {
  const key = STORE_PREFIX + resource;
  let arr = null;
  try { arr = JSON.parse(localStorage.getItem(key)); } catch { arr = null; }
  if (!Array.isArray(arr)) {
    arr = (demo || []).map(x => ({ ...x }));
    localStorage.setItem(key, JSON.stringify(arr));
  }
  return arr;
}
function _saveStore(resource, arr) {
  localStorage.setItem(STORE_PREFIX + resource, JSON.stringify(arr));
}
function _nextId(arr) {
  let max = 0;
  arr.forEach(x => { const n = parseInt(x.id, 10); if (!isNaN(n) && n > max) max = n; });
  return max + 1;
}

async function dataList(resource, demo) {
  try {
    const r = await fetch(`${API_BASE}/${resource}`, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    return _store(resource, demo);
  }
}

async function dataCreate(resource, obj, demo) {
  try {
    const r = await fetch(`${API_BASE}/${resource}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj),
    });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    const arr = _store(resource, demo);
    const rec = { id: _nextId(arr), ...obj };
    arr.unshift(rec);
    _saveStore(resource, arr);
    return rec;
  }
}

async function dataUpdate(resource, id, obj, demo) {
  try {
    const r = await fetch(`${API_BASE}/${resource}/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj),
    });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    const arr = _store(resource, demo);
    const i = arr.findIndex(x => String(x.id) === String(id));
    if (i < 0) throw new Error('Записът не е намерен');
    arr[i] = { ...arr[i], ...obj, id: arr[i].id };
    _saveStore(resource, arr);
    return arr[i];
  }
}

async function dataDelete(resource, id, demo) {
  try {
    const r = await fetch(`${API_BASE}/${resource}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw 0;
    return true;
  } catch {
    const arr = _store(resource, demo).filter(x => String(x.id) !== String(id));
    _saveStore(resource, arr);
    return true;
  }
}

// --- Scroll reveal ---
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

// --- Animated counters ---
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1500;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)).toLocaleString('bg-BG') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) { els.forEach(animateCounter); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { animateCounter(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.5 });
  els.forEach(e => io.observe(e));
}

// --- Toast notifications ---
function toast(title, msg, type = 'ok') {
  let wrap = document.querySelector('.toasts');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast ' + (type === 'ok' ? '' : type);
  const icon = type === 'err' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✅');
  t.innerHTML = `<span style="font-size:1.3rem">${icon}</span><div><b>${escapeHtml(title)}</b><span>${escapeHtml(msg)}</span></div>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s, transform .4s'; t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; setTimeout(() => t.remove(), 400); }, 3600);
}

// --- Modal helpers ---
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function bindModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.addEventListener('click', (e) => { if (e.target === m) closeModal(id); });
}

// Custom confirm dialog, resolves to true/false
function uiConfirm(title, msg, opts = {}) {
  return new Promise((resolve) => {
    const ov = document.createElement('div');
    ov.className = 'modal-overlay open';
    ov.style.zIndex = '400';
    ov.innerHTML = `
      <div class="modal" style="max-width:430px">
        <div class="modal-body" style="text-align:center;padding:32px 26px">
          <div style="font-size:2.6rem;line-height:1">${opts.icon || '⚠️'}</div>
          <h3 style="margin:12px 0 6px">${escapeHtml(title)}</h3>
          <p class="muted">${escapeHtml(msg)}</p>
          <div class="flex gap-2" style="justify-content:center;margin-top:24px">
            <button class="btn btn-ghost" data-no>Отказ</button>
            <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-yes>${escapeHtml(opts.ok || 'Потвърди')}</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    const close = (v) => { ov.remove(); document.body.style.overflow = ''; resolve(v); };
    ov.addEventListener('click', (e) => { if (e.target === ov) close(false); });
    ov.querySelector('[data-no]').onclick = () => close(false);
    ov.querySelector('[data-yes]').onclick = () => close(true);
  });
}

// --- Form helpers ---
function fillForm(form, data) {
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    const v = data[el.name];
    if (v !== undefined && v !== null) el.value = v;
  });
}
function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

// --- Formatting helpers ---
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}
function fmtMoney(n) { return Number(n).toLocaleString('bg-BG') + ' лв.'; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Status -> coloured pill
function statusPill(status) {
  const map = {
    'активен':   ['pill-green', 'Активен'],
    'валидно':   ['pill-green', 'Валидно'],
    'валиден':   ['pill-green', 'Валиден'],
    'изтекло':   ['pill-amber', 'Изтекло'],
    'изтекъл':   ['pill-amber', 'Изтекъл'],
    'отнето':    ['pill-red',   'Отнето'],
    'спрян':     ['pill-red',   'Спрян'],
    'нарушение': ['pill-red',   'Нарушение'],
    'редовно':   ['pill-green', 'Редовно'],
    'в процес':  ['pill-blue',  'В процес'],
    'предупреждение': ['pill-amber', 'Предупреждение'],
  };
  const [cls, label] = map[status] || ['pill-gray', status];
  return `<span class="pill ${cls}">${label}</span>`;
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
  initReveal();
  initCounters();
});
