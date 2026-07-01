// Vessel register page: list, search, filters, add/edit/delete.
let KORABI = [];
let filter = 'all';
let query = '';
let editMode = false;
let editingId = null;

const form = document.getElementById('korabForm');
document.getElementById('searchIco').innerHTML = ICON.search;
bindModal('addKorab');

async function load() {
  KORABI = await dataList('korabi', DEMO.korabi);
  updateStats();
  render();
}

function updateStats() {
  document.getElementById('st-total').textContent = KORABI.length;
  document.getElementById('st-active').textContent = KORABI.filter(k => k.status === 'активен').length;
  document.getElementById('st-traulers').textContent = KORABI.filter(k => k.tip === 'Траулер').length;
}

function vesselPhoto(tip) {
  // Trawlers shown at the dock, others out at sea
  return tip === 'Траулер' ? 'trawler-harbor.jpg' : 'vessel-sea.jpg';
}

function matches(k) {
  if (filter !== 'all') {
    if (['активен', 'спрян'].includes(filter) && k.status !== filter) return false;
    if (['Траулер', 'Сейнер'].includes(filter) && k.tip !== filter) return false;
  }
  if (query) {
    const hay = `${k.ime} ${k.mejdunaroden_nomer} ${k.pozivna} ${k.sobstvenik} ${k.kapitan} ${k.pristanishte}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function render() {
  const list = document.getElementById('list');
  const items = KORABI.filter(matches);
  document.getElementById('count').textContent = `Показани ${items.length} от ${KORABI.length} кораба`;

  if (!items.length) {
    list.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ico">🔍</div><p>Няма намерени кораби по зададените критерии.</p></div>`;
    return;
  }

  list.innerHTML = items.map(k => `
    <article class="record reveal in ${editMode ? 'editing' : ''}">
      <div class="rec-photo" style="background-image:url('img/${vesselPhoto(k.tip)}')"></div>
      <div class="rec-head">
        <div class="rec-title">
          <span class="ico">${ICON.ship}</span>
          <div>
            ${escapeHtml(k.ime)}
            <div class="rec-sub">${escapeHtml(k.tip || '—')} · ${escapeHtml(k.pristanishte || '—')}</div>
          </div>
        </div>
        ${statusPill(k.status)}
      </div>
      <div class="rec-grid">
        <div class="f"><span>Межд. номер</span><b>${escapeHtml(k.mejdunaroden_nomer)}</b></div>
        <div class="f"><span>Позивна</span><b>${escapeHtml(k.pozivna || '—')}</b></div>
        <div class="f"><span>Собственик</span><b>${escapeHtml(k.sobstvenik)}</b></div>
        <div class="f"><span>Капитан</span><b>${escapeHtml(k.kapitan || '—')}</b></div>
        <div class="f"><span>Дължина / Широчина</span><b>${k.dalzhina || '—'} м / ${k.shirina || '—'} м</b></div>
        <div class="f"><span>Тонаж / Газене</span><b>${k.tonaj || '—'} БТ / ${k.gazene || '—'} м</b></div>
        <div class="f"><span>Двигател</span><b>${k.moshtnost || '—'} кW · ${escapeHtml(k.gorivo || '—')}</b></div>
        <div class="f"><span>Маркировка</span><b>${escapeHtml(k.markirovka || '—')}</b></div>
      </div>
      <div class="rec-foot">
        ${editMode
          ? `<div class="rec-actions">
               <button class="icon-btn edit" data-edit="${k.id}">${ICON.edit} Редактирай</button>
               <button class="icon-btn del" data-del="${k.id}">${ICON.trash} Изтрий</button>
             </div>`
          : `<span class="muted" style="font-size:.82rem">${Number(k.dalzhina) > 10 ? '📒 Подава електронен дневник' : '🎣 Под 10 м'}</span>
             <a class="btn btn-ghost btn-sm" href="razreshitelni.html">Разрешителни ${ICON.arrow}</a>`}
      </div>
    </article>
  `).join('');

  if (editMode) bindRowActions();
}

function bindRowActions() {
  document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.edit)));
  document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => removeKorab(b.dataset.del)));
}

// --- Edit mode ---
function refreshEditBtn() {
  const btn = document.getElementById('editToggle');
  if (!AUTH.current()) {
    btn.innerHTML = '🔒 Влез за редактиране';
    btn.onclick = () => location.href = 'login.html?next=korabi.html';
    return;
  }
  btn.onclick = () => {
    editMode = !editMode;
    btn.classList.toggle('btn-warn', editMode);
    btn.innerHTML = editMode ? '✓ Готово' : '✎ Редактиране';
    render();
  };
  btn.innerHTML = editMode ? '✓ Готово' : '✎ Редактиране';
}

// --- Add / edit ---
function openAdd() {
  editingId = null;
  form.reset();
  document.getElementById('korabModalTitle').textContent = '➕ Нов риболовен кораб';
  openModal('addKorab');
}
function openEdit(id) {
  const k = KORABI.find(x => String(x.id) === String(id));
  if (!k) return;
  editingId = id;
  form.reset();
  fillForm(form, k);
  document.getElementById('korabModalTitle').textContent = '✎ Редактиране на „' + k.ime + '“';
  openModal('addKorab');
}

async function removeKorab(id) {
  const k = KORABI.find(x => String(x.id) === String(id));
  const ok = await uiConfirm('Изтриване на кораб', `Сигурни ли сте, че искате да изтриете „${k ? k.ime : ''}“ от регистъра?`, { danger: true, ok: 'Изтрий', icon: '🗑️' });
  if (!ok) return;
  await dataDelete('korabi', id, DEMO.korabi);
  KORABI = KORABI.filter(x => String(x.id) !== String(id));
  updateStats(); render();
  toast('Корабът е изтрит', k ? `„${k.ime}“ е премахнат от регистъра.` : '', 'info');
}

document.getElementById('addBtn').addEventListener('click', openAdd);
document.getElementById('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); render(); });
document.getElementById('chips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active'); filter = chip.dataset.f; render();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = readForm(form);
  ['dalzhina', 'shirina', 'tonaj', 'gazene', 'moshtnost'].forEach(k => data[k] = data[k] ? Number(data[k]) : null);

  if (editingId !== null) {
    const updated = await dataUpdate('korabi', editingId, data, DEMO.korabi);
    const i = KORABI.findIndex(x => String(x.id) === String(editingId));
    if (i >= 0) KORABI[i] = updated;
    toast('Промените са запазени', `„${updated.ime}“ е обновен.`);
  } else {
    data.status = 'активен';
    const saved = await dataCreate('korabi', data, DEMO.korabi);
    KORABI.unshift(saved);
    toast('Корабът е добавен', `„${saved.ime}“ е вписан в регистъра.`);
  }
  updateStats(); render();
  closeModal('addKorab'); form.reset(); editingId = null;
});

refreshEditBtn();
load();
