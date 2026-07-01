// Personal cabinet: profile details + purchased tickets. Requires login.
const ME = AUTH.current();
if (!ME) { location.href = 'login.html?next=profile.html'; }

const TODAY = new Date('2026-06-30');

function kategoriaLabel(key) {
  const m = { pod14: 'Под 14 г.', nad14: 'Над 14 г.', pensioner: 'Пенсионер', invalid: 'Лице с увреждане' };
  return m[key] || key;
}

function initials(name) {
  return (name || '?').trim().split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
}

function renderHeader() {
  const u = AUTH.current();
  document.getElementById('bigAvatar').textContent = initials(u.ime);
  document.getElementById('hello').textContent = 'Здравейте, ' + u.ime.split(' ')[0] + '!';
  document.getElementById('subhello').textContent = u.email;

  const tickets = u.tickets || [];
  const active = tickets.filter(t => new Date(t.do) >= TODAY).length;
  const spent = tickets.reduce((s, t) => s + (Number(t.cena) || 0), 0);
  document.getElementById('st-tickets').textContent = tickets.length;
  document.getElementById('st-active').textContent = active;
  document.getElementById('st-spent').textContent = spent.toLocaleString('bg-BG') + ' лв.';
}

function renderProfileForm() {
  const u = AUTH.current();
  fillForm(document.getElementById('profileForm'), u);
}

function renderTickets() {
  const u = AUTH.current();
  const list = document.getElementById('ticketsList');
  const tickets = u.tickets || [];

  if (!tickets.length) {
    list.innerHTML = `
      <div class="empty">
        <div class="ico">🎟️</div>
        <p>Все още нямате закупени билети.</p>
        <a href="bileti.html" class="btn btn-primary btn-sm mt-2">Купи първия си билет</a>
      </div>`;
    return;
  }

  list.innerHTML = tickets.map(t => {
    const active = new Date(t.do) >= TODAY;
    return `
    <article class="record reveal in">
      <div class="rec-head">
        <div class="rec-title">
          <span class="ico">${ICON.ticket}</span>
          <div>${escapeHtml(t.kategoria)} · ${escapeHtml(t.srok)}<div class="rec-sub">№ ${escapeHtml(t.nomer)}</div></div>
        </div>
        <span class="pill ${active ? 'pill-green' : 'pill-amber'}">${active ? 'Валиден' : 'Изтекъл'}</span>
      </div>
      <div class="rec-grid">
        <div class="f"><span>Притежател</span><b>${escapeHtml(t.ime)}</b></div>
        <div class="f"><span>Цена</span><b>${Number(t.cena) === 0 ? 'Безплатно' : fmtMoney(t.cena)}</b></div>
        <div class="f"><span>Валиден от</span><b>${fmtDate(t.ot)}</b></div>
        <div class="f"><span>Валиден до</span><b>${fmtDate(t.do)}</b></div>
      </div>
      ${t.telk ? `<p class="muted" style="font-size:.85rem;margin-top:10px">♿ ТЕЛК №: ${escapeHtml(t.telk)}</p>` : ''}
      <div class="rec-foot">
        <span class="muted" style="font-size:.82rem">📱 Покажете билета при проверка</span>
        <button class="btn btn-ghost btn-sm" data-del="${escapeHtml(t.nomer)}">${ICON.trash} Изтрий</button>
      </div>
    </article>`;
  }).join('');

  // delete a ticket
  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ok = await uiConfirm('Изтриване на билет', 'Сигурни ли сте, че искате да премахнете билет № ' + btn.dataset.del + '?', { danger: true, ok: 'Изтрий', icon: '🗑️' });
      if (!ok) return;
      const u = AUTH.current();
      const tickets = (u.tickets || []).filter(t => t.nomer !== btn.dataset.del);
      AUTH.updateProfile({ tickets });
      toast('Билетът е изтрит', '№ ' + btn.dataset.del, 'info');
      renderHeader(); renderTickets();
    });
  });
}

// save profile
document.getElementById('profileForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = readForm(e.target);
  delete data.email; // email is not editable
  AUTH.updateProfile(data);
  toast('Данните са запазени', 'Ще се попълват автоматично при покупка на билет.');
  renderHeader();
});

if (ME) {
  renderHeader();
  renderProfileForm();
  renderTickets();
}
