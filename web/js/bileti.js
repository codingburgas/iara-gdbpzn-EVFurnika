// Recreational tickets page: price calculator + purchase.
const CENI = DEMO.ceni;
let selKat = 'nad14';
let selSrok = '7dni';

// --- Login banner + prefill from profile ---
function renderLoginBanner() {
  const banner = document.getElementById('loginBanner');
  const u = AUTH.current();
  if (u) {
    banner.className = 'card';
    banner.style.cssText = 'margin-bottom:26px;display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap';
    banner.innerHTML = `
      <div class="flex items-center" style="gap:12px">
        <span class="avatar">${(u.ime||'?').trim().split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase()}</span>
        <div><b>Здравейте, ${escapeHtml(u.ime.split(' ')[0])}!</b><div class="muted" style="font-size:.85rem">Данните ви са попълнени автоматично. Билетът ще се запази в кабинета ви.</div></div>
      </div>
      <a href="profile.html" class="btn btn-ghost btn-sm">Личен кабинет ${ICON.arrow}</a>`;
  } else {
    banner.className = 'card';
    banner.style.cssText = 'margin-bottom:26px;display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap;border-style:dashed';
    banner.innerHTML = `
      <div><b>💡 Влезте в акаунта си</b><div class="muted" style="font-size:.9rem">За да запазите билета в личния кабинет и да попълвате данните автоматично.</div></div>
      <a href="login.html?next=bileti.html" class="btn btn-primary btn-sm">${ICON.user} Вход / Регистрация</a>`;
  }
}

function prefillFromProfile() {
  const u = AUTH.current();
  if (!u) return;
  if (u.ime) document.getElementById('ime').value = u.ime;
  if (u.email) document.getElementById('email').value = u.email;
  if (u.egn) document.getElementById('egn').value = u.egn;
  if (u.kategoria && CENI.matrica[u.kategoria]) selKat = u.kategoria;
}

// --- Categories ---
function renderKategorii() {
  document.getElementById('kategoriiGrid').innerHTML = CENI.kategorii.map(k => `
    <div class="option ${k.key === selKat ? 'selected' : ''}" data-kat="${k.key}">
      <b>${k.label}</b>
      <span>${k.opisanie}</span>
    </div>
  `).join('');
}

// --- Durations (price depends on the selected category) ---
function renderSrokove() {
  document.getElementById('srokoveGrid').innerHTML = CENI.srokove.map(s => {
    const price = CENI.matrica[selKat][s.key];
    return `
    <div class="option ${s.key === selSrok ? 'selected' : ''}" data-srok="${s.key}">
      <b>${s.label}</b>
      <span>${s.dni} ${s.dni === 1 ? 'ден' : 'дни'} валидност</span>
      <div class="price">${price === 0 ? 'Безплатно' : price + ' лв.'}</div>
    </div>`;
  }).join('');
}

// --- Price table ---
function renderTable() {
  const head = `<thead><tr>
    <th style="text-align:left;padding:14px;border-bottom:2px solid var(--line)">Категория</th>
    ${CENI.srokove.map(s => `<th style="padding:14px;border-bottom:2px solid var(--line)">${s.label}</th>`).join('')}
  </tr></thead>`;
  const body = `<tbody>${CENI.kategorii.map(k => `
    <tr>
      <td style="text-align:left;padding:14px;border-bottom:1px solid var(--line);font-weight:700">${k.label}</td>
      ${CENI.srokove.map(s => {
        const p = CENI.matrica[k.key][s.key];
        return `<td style="text-align:center;padding:14px;border-bottom:1px solid var(--line);${p === 0 ? 'color:var(--green);font-weight:700' : ''}">${p === 0 ? 'Безплатно' : p + ' лв.'}</td>`;
      }).join('')}
    </tr>`).join('')}</tbody>`;
  document.getElementById('priceTable').innerHTML = head + body;
}

// --- Update the ticket preview ---
function update() {
  const kat = CENI.kategorii.find(k => k.key === selKat);
  const srok = CENI.srokove.find(s => s.key === selSrok);
  const price = CENI.matrica[selKat][selSrok];

  document.getElementById('tpCat').textContent = kat.label;
  document.getElementById('tpCat2').textContent = kat.label;
  document.getElementById('tpPrice').textContent = price === 0 ? 'Безплатно' : price + ' лв.';
  document.getElementById('tpSrok').textContent = srok.label;

  // validity period
  const ot = document.getElementById('ot').value ? new Date(document.getElementById('ot').value) : new Date('2026-06-30');
  const do_ = new Date(ot); do_.setDate(do_.getDate() + srok.dni);
  document.getElementById('tpValid').textContent = `${fmtDate(ot)} – ${fmtDate(do_)}`;

  const name = document.getElementById('ime').value.trim();
  document.getElementById('tpName').textContent = name || '—';

  // TELK field only for the "disabled" category
  const isInvalid = selKat === 'invalid';
  document.getElementById('invalidBox').classList.toggle('hidden', !isInvalid);
  const telkRow = document.getElementById('tpTelkRow');
  if (isInvalid) {
    telkRow.style.display = 'flex';
    document.getElementById('tpTelk').textContent = document.getElementById('telk').value.trim() || '—';
  } else {
    telkRow.style.display = 'none';
  }

  document.getElementById('qr').innerHTML = makeQR(`${selKat}-${selSrok}-${name || 'guest'}`);
}

// Decorative "QR" built from a deterministic grid
function makeQR(seed) {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 7; let cells = '';
  const size = 92, cs = size / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const on = (h >> (x % 7)) & 1;
    const corner = (x < 2 && y < 2) || (x > n - 3 && y < 2) || (x < 2 && y > n - 3);
    if (on || corner) cells += `<rect x="${x * cs}" y="${y * cs}" width="${cs}" height="${cs}" rx="1.5" fill="#0b2447"/>`;
  }
  return `<svg width="78" height="78" viewBox="0 0 ${size} ${size}">${cells}</svg>`;
}

// --- Purchase ---
async function buy() {
  const name = document.getElementById('ime').value.trim();
  if (!name) { toast('Липсват данни', 'Моля, въведете име на любителя.', 'err'); return; }
  if (selKat === 'invalid' && !document.getElementById('telk').value.trim()) {
    toast('Липсва ТЕЛК номер', 'За безплатен билет е нужен № на решение от ТЕЛК.', 'err'); return;
  }

  const srok = CENI.srokove.find(s => s.key === selSrok);
  const price = CENI.matrica[selKat][selSrok];
  const ot = document.getElementById('ot').value || '2026-06-30';
  const do_ = new Date(ot); do_.setDate(do_.getDate() + srok.dni);

  const ticket = {
    nomer: 'БЛР-2026-' + Math.floor(100000 + Math.random() * 899999),
    ime: name,
    egn: document.getElementById('egn').value.trim(),
    email: document.getElementById('email').value.trim(),
    kategoria: CENI.kategorii.find(k => k.key === selKat).label,
    srok: srok.label,
    cena: price,
    ot, do: do_.toISOString().slice(0, 10),
    telk: selKat === 'invalid' ? document.getElementById('telk').value.trim() : '',
  };

  // store the ticket (server or localStorage)
  const saved = await dataCreate('bileti', ticket, []);

  // if logged in, keep a copy in the profile and remember the details
  const u = AUTH.current();
  if (u) {
    AUTH.addTicket(saved);
    AUTH.updateProfile({
      ime: ticket.ime,
      egn: ticket.egn,
      kategoria: selKat,
    });
    toast('Билетът е издаден! 🎉', `№ ${saved.nomer} · запазен в кабинета ви.`);
  } else {
    toast('Билетът е издаден! 🎉', `№ ${saved.nomer} · ${price === 0 ? 'безплатно' : price + ' лв.'}`);
  }

  const btn = document.getElementById('buyBtn');
  btn.textContent = u ? '✓ Запазен в кабинета' : '✓ Билетът е издаден';
  setTimeout(() => { btn.textContent = 'Купи билет'; }, 2500);
}

// --- Events ---
document.getElementById('kategoriiGrid').addEventListener('click', (e) => {
  const o = e.target.closest('[data-kat]'); if (!o) return;
  selKat = o.dataset.kat;
  renderKategorii(); renderSrokove(); update();
});
document.getElementById('srokoveGrid').addEventListener('click', (e) => {
  const o = e.target.closest('[data-srok]'); if (!o) return;
  selSrok = o.dataset.srok;
  renderSrokove(); update();
});
['ime', 'egn', 'email', 'ot', 'telk'].forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});
document.getElementById('buyBtn').addEventListener('click', buy);

// --- Start ---
renderLoginBanner();
prefillFromProfile();
renderKategorii();
renderSrokove();
renderTable();
update();
