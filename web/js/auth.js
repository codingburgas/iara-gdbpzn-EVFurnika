// Accounts and profile. Client-side (localStorage) so it works without a
// server. Passwords are hashed, not stored as plain text. A real app would
// do this on the server (e.g. with bcrypt).
const AUTH = (function () {
  const UKEY = 'iara_users';
  const SKEY = 'iara_session';

  // Simple non-cryptographic hash, for demo purposes only
  function hash(s) {
    let h = 5381;
    for (const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
    return 'h' + h.toString(16);
  }

  function users() {
    try { return JSON.parse(localStorage.getItem(UKEY)) || []; } catch { return []; }
  }
  function saveUsers(arr) { localStorage.setItem(UKEY, JSON.stringify(arr)); }
  function strip(u) { const { parola, ...rest } = u; return rest; }

  function register(data) {
    const email = (data.email || '').trim().toLowerCase();
    if (!email || !data.parola || !data.ime) throw new Error('Попълнете име, имейл и парола.');
    if (data.parola.length < 4) throw new Error('Паролата трябва да е поне 4 символа.');
    const all = users();
    if (all.some(u => u.email === email)) throw new Error('Вече има акаунт с този имейл.');
    const u = {
      id: Date.now(), ime: data.ime.trim(), email,
      parola: hash(data.parola),
      telefon: '', egn: '', kategoria: 'nad14', grad: '',
      tickets: [],
    };
    all.push(u);
    saveUsers(all);
    localStorage.setItem(SKEY, email);
    return strip(u);
  }

  function login(email, parola) {
    email = (email || '').trim().toLowerCase();
    const u = users().find(x => x.email === email);
    if (!u || u.parola !== hash(parola)) throw new Error('Грешен имейл или парола.');
    localStorage.setItem(SKEY, email);
    return strip(u);
  }

  function logout() { localStorage.removeItem(SKEY); }

  function current() {
    const e = localStorage.getItem(SKEY);
    if (!e) return null;
    const u = users().find(x => x.email === e);
    return u ? strip(u) : null;
  }

  function updateProfile(data) {
    const e = localStorage.getItem(SKEY);
    if (!e) throw new Error('Не сте влезли в акаунт.');
    const all = users();
    const i = all.findIndex(x => x.email === e);
    if (i < 0) throw new Error('Акаунтът не е намерен.');
    all[i] = { ...all[i], ...data, email: all[i].email, id: all[i].id, parola: all[i].parola };
    saveUsers(all);
    return strip(all[i]);
  }

  function addTicket(ticket) {
    const e = localStorage.getItem(SKEY);
    if (!e) return false;
    const all = users();
    const i = all.findIndex(x => x.email === e);
    if (i < 0) return false;
    all[i].tickets = all[i].tickets || [];
    all[i].tickets.unshift(ticket);
    saveUsers(all);
    return true;
  }

  function myTickets() {
    const u = current();
    return u ? (u.tickets || []) : [];
  }

  return { register, login, logout, current, updateProfile, addTicket, myTickets };
})();

// --- User menu in the navbar ---
function renderAuthSlot() {
  const slot = document.getElementById('auth-slot');
  if (!slot) return;
  const u = AUTH.current();

  if (!u) {
    slot.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm">${ICON.user} Вход</a>`;
    return;
  }

  const initials = (u.ime || '?').trim().split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  slot.innerHTML = `
    <div class="user-menu" id="userMenu">
      <button class="user-chip" id="userChipBtn" aria-label="Профил">
        <span class="avatar">${escapeHtml(initials)}</span>
        <span class="uname">${escapeHtml((u.ime || '').split(' ')[0])}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="user-dropdown" id="userDropdown">
        <div class="ud-head">
          <b>${escapeHtml(u.ime)}</b>
          <span>${escapeHtml(u.email)}</span>
        </div>
        <a href="profile.html">${ICON.user} Личен кабинет</a>
        <a href="bileti.html">${ICON.ticket} Купи билет</a>
        <button id="logoutBtn" class="ud-danger">${ICON.logout} Изход</button>
      </div>
    </div>`;

  const menu = document.getElementById('userMenu');
  document.getElementById('userChipBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', () => menu.classList.remove('open'));
  document.getElementById('logoutBtn').addEventListener('click', () => {
    AUTH.logout();
    toast('Излязохте от акаунта', 'До скоро! 👋', 'info');
    setTimeout(() => location.href = 'index.html', 700);
  });
}

document.addEventListener('DOMContentLoaded', renderAuthSlot);
