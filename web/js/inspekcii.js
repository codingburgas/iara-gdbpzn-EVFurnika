// Inspections page: list, search, filters, add/edit/delete.
let INSP = [];
let filter = 'all';
let query = '';
let editMode = false;
let editingId = null;

const form = document.getElementById('inspForm');
document.getElementById('searchIco').innerHTML = ICON.search;
bindModal('addInsp');

const OBJ_ICON = { 'Кораб': '⚓', 'Хладилен камион': '🚚', 'Магазин': '🏪', 'Любителски риболов': '🎣' };

async function load() {
  INSP = await dataList('inspekcii', DEMO.inspekcii);
  updateStats();
  render();
}

function updateStats() {
  document.getElementById('st-total').textContent = INSP.length;
  document.getElementById('st-ok').textContent = INSP.filter(i => i.rezultat === 'редовно').length;
  document.getElementById('st-viol').textContent = INSP.filter(i => i.rezultat === 'нарушение').length;
  const fines = INSP.reduce((s, i) => s + (Number(i.globa) || 0), 0);
  document.getElementById('st-fines').textContent = fines.toLocaleString('bg-BG');
}

function matches(i) {
  if (filter !== 'all' && i.rezultat !== filter) return false;
  if (query) {
    const hay = `${i.nomer} ${i.obekt} ${i.inspektor} ${i.mqsto}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function render() {
  const list = document.getElementById('list');
  const items = INSP.filter(matches);
  document.getElementById('count').textContent = `Показани ${items.length} от ${INSP.length} инспекции`;

  if (!items.length) {
    list.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ico">🛡️</div><p>Няма инспекции по тези критерии.</p></div>`;
    return;
  }

  list.innerHTML = items.map(i => `
    <article class="record reveal in">
      <div class="rec-head">
        <div class="rec-title">
          <span class="ico">${OBJ_ICON[i.obekt_tip] || '🛡️'}</span>
          <div>${escapeHtml(i.obekt)}<div class="rec-sub">${escapeHtml(i.obekt_tip)} · № ${escapeHtml(i.nomer || '—')}</div></div>
        </div>
        ${statusPill(i.rezultat)}
      </div>
      <div class="rec-grid">
        <div class="f"><span>Инспектор</span><b>${escapeHtml(i.inspektor)}</b></div>
        <div class="f"><span>Дата</span><b>${fmtDate(i.data)}</b></div>
        <div class="f"><span>Място</span><b>${escapeHtml(i.mqsto || '—')}</b></div>
        <div class="f"><span>Акт</span><b>${i.akt ? escapeHtml(i.akt) : '—'}</b></div>
      </div>
      ${i.belejka ? `<p class="muted" style="font-size:.9rem;margin-top:12px;background:var(--surface-2);padding:10px 12px;border-radius:10px">📝 ${escapeHtml(i.belejka)}</p>` : ''}
      <div class="rec-foot">
        ${editMode
          ? `<div class="rec-actions">
               <button class="icon-btn edit" data-edit="${i.id}">${ICON.edit} Редактирай</button>
               <button class="icon-btn del" data-del="${i.id}">${ICON.trash} Изтрий</button>
             </div>
             ${Number(i.globa) > 0 ? `<span class="pill pill-red">${fmtMoney(i.globa)}</span>` : ''}`
          : `<span class="muted" style="font-size:.85rem">${i.rezultat === 'нарушение' ? '⚖️ Издаден акт' : '✔️ Проверка'}</span>
             ${Number(i.globa) > 0 ? `<span class="pill pill-red">Глоба: ${fmtMoney(i.globa)}</span>` : '<span class="pill pill-green">Без санкция</span>'}`}
      </div>
    </article>
  `).join('');

  if (editMode) {
    list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.edit)));
    list.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => removeRow(b.dataset.del)));
  }
}

// --- Edit mode ---
function refreshEditBtn() {
  const btn = document.getElementById('editToggle');
  if (!AUTH.current()) {
    btn.innerHTML = '🔒 Влез за редактиране';
    btn.onclick = () => location.href = 'login.html?next=inspekcii.html';
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

function toggleViol(val) {
  document.getElementById('violFields').classList.toggle('hidden', val !== 'нарушение');
}

function openAdd() {
  editingId = null;
  form.reset();
  toggleViol('редовно');
  document.getElementById('inspModalTitle').textContent = '🛡️ Регистриране на инспекция';
  openModal('addInsp');
}
function openEdit(id) {
  const it = INSP.find(x => String(x.id) === String(id));
  if (!it) return;
  editingId = id;
  form.reset();
  fillForm(form, it);
  toggleViol(it.rezultat);
  document.getElementById('inspModalTitle').textContent = '✎ Редактиране на № ' + (it.nomer || '');
  openModal('addInsp');
}

async function removeRow(id) {
  const it = INSP.find(x => String(x.id) === String(id));
  const ok = await uiConfirm('Изтриване на инспекция', `Изтриване на № ${it ? it.nomer : ''} (${it ? it.obekt : ''})?`, { danger: true, ok: 'Изтрий', icon: '🗑️' });
  if (!ok) return;
  await dataDelete('inspekcii', id, DEMO.inspekcii);
  INSP = INSP.filter(x => String(x.id) !== String(id));
  updateStats(); render();
  toast('Инспекцията е изтрита', '', 'info');
}

document.getElementById('addBtn').addEventListener('click', openAdd);
document.getElementById('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); render(); });
document.getElementById('chips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active'); filter = chip.dataset.f; render();
});
document.getElementById('rezultatSelect').addEventListener('change', (e) => toggleViol(e.target.value));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = readForm(form);
  data.globa = data.rezultat === 'нарушение' ? (Number(data.globa) || 0) : 0;
  if (data.rezultat !== 'нарушение') data.akt = '';
  if (!data.data) data.data = '2026-06-30';

  if (editingId !== null) {
    const updated = await dataUpdate('inspekcii', editingId, data, DEMO.inspekcii);
    const i = INSP.findIndex(x => String(x.id) === String(editingId));
    if (i >= 0) INSP[i] = updated;
    toast('Промените са запазени', `№ ${updated.nomer} е обновена.`);
  } else {
    data.nomer = 'ИНС-2026-' + String(Math.floor(1000 + Math.random() * 8999));
    const saved = await dataCreate('inspekcii', data, DEMO.inspekcii);
    INSP.unshift(saved);
    toast('Инспекцията е записана', `№ ${saved.nomer} · ${saved.obekt}`, saved.rezultat === 'нарушение' ? 'err' : 'ok');
  }
  updateStats(); render();
  closeModal('addInsp'); form.reset(); editingId = null;
  document.getElementById('violFields').classList.add('hidden');
});

refreshEditBtn();
load();
