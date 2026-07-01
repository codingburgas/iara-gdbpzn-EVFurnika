// Fishing permits page: list, search, filters, add/edit/delete.
let RAZR = [];
let filter = 'all';
let query = '';
let editMode = false;
let editingId = null;

const form = document.getElementById('razrForm');
document.getElementById('searchIco').innerHTML = ICON.search;
bindModal('addRazr');

async function load() {
  RAZR = await dataList('razreshitelni', DEMO.razreshitelni);
  const korabi = await dataList('korabi', DEMO.korabi);
  document.getElementById('korabSelect').innerHTML =
    korabi.map(k => `<option>${escapeHtml(k.ime)}</option>`).join('');
  updateStats();
  render();
}

function isExpired(r) {
  if (r.status === 'отнето') return false;
  return new Date(r.validno_do) < new Date('2026-06-30');
}
function effStatus(r) {
  if (r.status === 'отнето') return 'отнето';
  return isExpired(r) ? 'изтекло' : 'валидно';
}

function updateStats() {
  document.getElementById('st-total').textContent = RAZR.length;
  document.getElementById('st-valid').textContent = RAZR.filter(r => effStatus(r) === 'валидно').length;
  document.getElementById('st-expired').textContent = RAZR.filter(r => effStatus(r) === 'изтекло').length;
  document.getElementById('st-revoked').textContent = RAZR.filter(r => r.status === 'отнето').length;
}

function matches(r) {
  if (filter !== 'all' && effStatus(r) !== filter) return false;
  if (query) {
    const hay = `${r.nomer} ${r.korab} ${r.sobstvenik} ${r.kapitan} ${r.uredi}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function render() {
  const list = document.getElementById('list');
  const items = RAZR.filter(matches);
  document.getElementById('count').textContent = `Показани ${items.length} от ${RAZR.length} разрешителни`;

  if (!items.length) {
    list.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ico">📄</div><p>Няма разрешителни по тези критерии.</p></div>`;
    return;
  }

  list.innerHTML = items.map(r => {
    const s = effStatus(r);
    return `
    <article class="record reveal in">
      <div class="rec-head">
        <div class="rec-title">
          <span class="ico">${ICON.doc}</span>
          <div>№ ${escapeHtml(r.nomer)}<div class="rec-sub">⚓ ${escapeHtml(r.korab)}</div></div>
        </div>
        ${statusPill(s)}
      </div>
      <div class="rec-grid">
        <div class="f"><span>Собственик / ползвател</span><b>${escapeHtml(r.sobstvenik)}</b></div>
        <div class="f"><span>Капитан</span><b>${escapeHtml(r.kapitan || '—')}</b></div>
        <div class="f" style="grid-column:1/-1"><span>Разрешени уреди</span><b>${escapeHtml(r.uredi)}</b></div>
        <div class="f"><span>Зона</span><b>${escapeHtml(r.zona || '—')}</b></div>
        <div class="f"><span>Издадено</span><b>${fmtDate(r.izdadeno)}</b></div>
      </div>
      <div class="rec-foot">
        ${editMode
          ? `<div class="rec-actions">
               <button class="icon-btn edit" data-edit="${r.id}">${ICON.edit} Редактирай</button>
               <button class="icon-btn del" data-del="${r.id}">${ICON.trash} Изтрий</button>
             </div>
             <span class="muted" style="font-size:.82rem">до ${fmtDate(r.validno_do)}</span>`
          : `<span class="muted" style="font-size:.85rem">📅 Валидно до <b style="color:var(--ink)">${fmtDate(r.validno_do)}</b></span>
             ${r.status === 'отнето'
               ? '<span class="pill pill-red">Отнето при нарушение</span>'
               : (s === 'изтекло' ? '<span class="pill pill-amber">Подлежи на подновяване</span>' : '<span class="pill pill-green">В сила</span>')}`}
      </div>
    </article>`;
  }).join('');

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
    btn.onclick = () => location.href = 'login.html?next=razreshitelni.html';
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

function openAdd() {
  editingId = null;
  form.reset();
  document.getElementById('razrModalTitle').textContent = '📄 Ново разрешително за риболов';
  openModal('addRazr');
}
function openEdit(id) {
  const r = RAZR.find(x => String(x.id) === String(id));
  if (!r) return;
  editingId = id;
  form.reset();
  fillForm(form, r);
  document.getElementById('razrModalTitle').textContent = '✎ Редактиране на № ' + r.nomer;
  openModal('addRazr');
}

async function removeRow(id) {
  const r = RAZR.find(x => String(x.id) === String(id));
  const ok = await uiConfirm('Изтриване на разрешително', `Изтриване на № ${r ? r.nomer : ''}?`, { danger: true, ok: 'Изтрий', icon: '🗑️' });
  if (!ok) return;
  await dataDelete('razreshitelni', id, DEMO.razreshitelni);
  RAZR = RAZR.filter(x => String(x.id) !== String(id));
  updateStats(); render();
  toast('Разрешителното е изтрито', '', 'info');
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
  if (editingId !== null) {
    const updated = await dataUpdate('razreshitelni', editingId, data, DEMO.razreshitelni);
    const i = RAZR.findIndex(x => String(x.id) === String(editingId));
    if (i >= 0) RAZR[i] = updated;
    toast('Промените са запазени', `№ ${updated.nomer} е обновено.`);
  } else {
    data.nomer = 'РБ-2026-' + String(Math.floor(10000 + Math.random() * 89999)).slice(0, 5);
    data.status = 'валидно';
    if (!data.izdadeno) data.izdadeno = '2026-06-30';
    if (!data.validno_do) data.validno_do = '2026-12-31';
    const saved = await dataCreate('razreshitelni', data, DEMO.razreshitelni);
    RAZR.unshift(saved);
    toast('Разрешителното е издадено', `№ ${saved.nomer} за „${saved.korab}“.`);
  }
  updateStats(); render();
  closeModal('addRazr'); form.reset(); editingId = null;
});

refreshEditBtn();
load();
