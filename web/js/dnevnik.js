// E-logbook page: catch records, traceability panel, add/edit/delete.
let DNEVNIK = [];
let query = '';
let selected = null;
let editMode = false;
let editingId = null;

const form = document.getElementById('dnevnikForm');
document.getElementById('searchIco').innerHTML = ICON.search;
bindModal('addDnevnik');

const TRACE_STEPS = { 'разтоварен': 2, 'в транспорт': 3, 'в магазин': 4 };

async function load() {
  DNEVNIK = await dataList('dnevnik', DEMO.dnevnik);
  const korabi = await dataList('korabi', DEMO.korabi);
  document.getElementById('korabSelect').innerHTML =
    korabi.map(k => `<option>${escapeHtml(k.ime)}</option>`).join('');
  updateStats();
  render();
  if (DNEVNIK.length) selectRecord(DNEVNIK[0].id);
}

function updateStats() {
  document.getElementById('st-records').textContent = DNEVNIK.length;
  const total = DNEVNIK.reduce((s, d) => s + (Number(d.kolichestvo) || 0), 0);
  document.getElementById('st-total').textContent = total.toLocaleString('bg-BG');
  document.getElementById('st-vessels').textContent = new Set(DNEVNIK.map(d => d.korab)).size;
}

function matches(d) {
  if (!query) return true;
  return `${d.korab} ${d.vid_riba} ${d.zona}`.toLowerCase().includes(query);
}

function render() {
  const list = document.getElementById('list');
  const items = DNEVNIK.filter(matches);
  document.getElementById('count').textContent = `${items.length} записа`;

  if (!items.length) {
    list.innerHTML = `<div class="empty"><div class="ico">📒</div><p>Няма записи.</p></div>`;
    return;
  }

  list.innerHTML = items.map(d => `
    <article class="record reveal in" data-row="${d.id}" style="cursor:pointer;${selected === d.id ? 'border-color:var(--blue);box-shadow:var(--shadow)' : ''}">
      <div class="rec-head">
        <div class="rec-title">
          <span class="ico">${ICON.book}</span>
          <div>${escapeHtml(d.korab)}<div class="rec-sub">${fmtDate(d.data)} · ${escapeHtml(d.start || '')}–${escapeHtml(d.kray || '')}</div></div>
        </div>
        ${statusPill(d.status || 'разтоварен')}
      </div>
      <div class="rec-grid">
        <div class="f"><span>Вид риба</span><b>🐟 ${escapeHtml(d.vid_riba)}</b></div>
        <div class="f"><span>Количество</span><b>${Number(d.kolichestvo).toLocaleString('bg-BG')} ${escapeHtml(d.edinica || 'кг')}</b></div>
        <div class="f" style="grid-column:1/-1"><span>Зона</span><b>${escapeHtml(d.zona || '—')}</b></div>
        <div class="f" style="grid-column:1/-1"><span>Уреди</span><b>${escapeHtml(d.uredi || '—')}</b></div>
      </div>
      ${editMode ? `
        <div class="rec-foot">
          <div class="rec-actions">
            <button class="icon-btn edit" data-edit="${d.id}">${ICON.edit} Редактирай</button>
            <button class="icon-btn del" data-del="${d.id}">${ICON.trash} Изтрий</button>
          </div>
        </div>` : ''}
    </article>
  `).join('');

  // click a row to show its traceability (ignore clicks on action buttons)
  list.querySelectorAll('[data-row]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.icon-btn')) return;
      selectRecord(isNaN(+el.dataset.row) ? el.dataset.row : +el.dataset.row);
    });
  });
  if (editMode) {
    list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.edit)));
    list.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => removeRow(b.dataset.del)));
  }
}

function selectRecord(id) {
  selected = id;
  // only update the card borders, no full re-render
  document.querySelectorAll('#list [data-row]').forEach(el => {
    const on = String(el.dataset.row) === String(id);
    el.style.borderColor = on ? 'var(--blue)' : '';
    el.style.boxShadow = on ? 'var(--shadow)' : '';
  });
  const d = DNEVNIK.find(x => String(x.id) === String(id));
  if (!d) return;
  const step = TRACE_STEPS[d.status] || 1;

  const nodes = [
    { ico: '⚓', title: `Улов · ${escapeHtml(d.korab)}`, sub: `${escapeHtml(d.zona || '')} · ${escapeHtml(d.uredi || '')}` },
    { ico: '🏗️', title: 'Разтоварване на брега', sub: 'Регистрирана партида с уникален №' },
    { ico: '🚚', title: 'Транспорт', sub: 'Хладилен камион към търговец' },
    { ico: '🏪', title: 'Магазин', sub: 'На щанд за продажба' },
  ];

  const batchId = 'BG-2026-' + String(10000 + (typeof id === 'number' ? id * 137 : 44218) % 89999).slice(0, 5);

  document.getElementById('trace').innerHTML = `
    <div style="background:var(--surface-2);border-radius:14px;padding:14px 16px;margin-bottom:18px">
      <div class="muted" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.05em">Партида</div>
      <b style="font-size:1.05rem">#${batchId}</b>
      <div class="muted" style="font-size:.85rem">${escapeHtml(d.vid_riba)} · ${Number(d.kolichestvo).toLocaleString('bg-BG')} кг · ${fmtDate(d.data)}</div>
    </div>
    <div style="position:relative;padding-left:6px">
      ${nodes.map((n, i) => {
        const done = i < step;
        const active = i === step - 1;
        const color = done ? 'var(--green)' : (active ? 'var(--blue)' : 'var(--line)');
        const txtMuted = i >= step ? 'opacity:.45' : '';
        return `
        <div style="display:flex;gap:14px;${txtMuted}">
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:${done || active ? color : 'var(--surface)'};border:2px solid ${color};color:${done || active ? '#fff' : 'var(--muted)'};font-size:1.1rem">${done ? '✓' : n.ico}</div>
            ${i < nodes.length - 1 ? `<div style="width:2px;flex:1;min-height:26px;background:${i < step - 1 ? 'var(--green)' : 'var(--line)'}"></div>` : ''}
          </div>
          <div style="padding-bottom:18px">
            <b>${n.title}</b>
            <div class="muted" style="font-size:.84rem">${n.sub}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="pill pill-green" style="margin-top:6px">${ICON.check} Законен улов · проследим</div>
  `;
}

// --- Edit mode ---
function refreshEditBtn() {
  const btn = document.getElementById('editToggle');
  if (!AUTH.current()) {
    btn.innerHTML = '🔒 Влез за редактиране';
    btn.onclick = () => location.href = 'login.html?next=dnevnik.html';
    return;
  }
  btn.onclick = () => {
    editMode = !editMode;
    btn.classList.toggle('btn-warn', editMode);
    btn.innerHTML = editMode ? '✓ Готово' : '✎ Редактиране';
    render();
    if (selected) selectRecord(selected);
  };
  btn.innerHTML = editMode ? '✓ Готово' : '✎ Редактиране';
}

function openAdd() {
  editingId = null;
  form.reset();
  document.getElementById('dnevnikModalTitle').textContent = '📒 Нов запис в електронния дневник';
  openModal('addDnevnik');
}
function openEdit(id) {
  const d = DNEVNIK.find(x => String(x.id) === String(id));
  if (!d) return;
  editingId = id;
  form.reset();
  fillForm(form, d);
  document.getElementById('dnevnikModalTitle').textContent = '✎ Редактиране на записа';
  openModal('addDnevnik');
}

async function removeRow(id) {
  const d = DNEVNIK.find(x => String(x.id) === String(id));
  const ok = await uiConfirm('Изтриване на запис', `Изтриване на улова на „${d ? d.korab : ''}“ (${d ? d.vid_riba : ''})?`, { danger: true, ok: 'Изтрий', icon: '🗑️' });
  if (!ok) return;
  await dataDelete('dnevnik', id, DEMO.dnevnik);
  DNEVNIK = DNEVNIK.filter(x => String(x.id) !== String(id));
  if (String(selected) === String(id)) selected = DNEVNIK[0] ? DNEVNIK[0].id : null;
  updateStats(); render();
  if (selected) selectRecord(selected); else document.getElementById('trace').innerHTML = '<p class="muted">Няма избран запис.</p>';
  toast('Записът е изтрит', '', 'info');
}

document.getElementById('addBtn').addEventListener('click', openAdd);
document.getElementById('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); render(); if (selected) selectRecord(selected); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = readForm(form);
  data.kolichestvo = Number(data.kolichestvo) || 0;
  data.edinica = 'кг';

  if (editingId !== null) {
    const updated = await dataUpdate('dnevnik', editingId, data, DEMO.dnevnik);
    const i = DNEVNIK.findIndex(x => String(x.id) === String(editingId));
    if (i >= 0) DNEVNIK[i] = updated;
    toast('Промените са запазени', `Записът за „${updated.korab}“ е обновен.`);
    updateStats(); render(); selectRecord(editingId);
  } else {
    data.status = 'разтоварен';
    const saved = await dataCreate('dnevnik', data, DEMO.dnevnik);
    DNEVNIK.unshift(saved);
    toast('Записът е добавен', `${saved.vid_riba} · ${saved.kolichestvo} кг от „${saved.korab}“.`);
    updateStats(); render(); selectRecord(saved.id);
  }
  closeModal('addDnevnik'); form.reset(); editingId = null;
});

refreshEditBtn();
load();
