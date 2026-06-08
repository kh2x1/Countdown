'use strict';

const el = (id) => document.getElementById(id);
let currentUser = null;

async function api(path, method, body) {
  const res = await fetch(path, {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  return { ok: res.ok, status: res.status, data };
}

function render(months) {
  const list = el('monthsList');
  list.innerHTML = '';

  months.forEach(m => {
    const li = document.createElement('li');
    li.className = 'month-row';

    const name = document.createElement('span');
    name.className = 'month-name';
    name.textContent = m.month;

    const by = document.createElement('span');
    by.className = 'booked-by';
    const action = document.createElement('span');
    action.className = 'row-action';

    if (!m.bookedBy) {
      by.classList.add('empty');
      by.textContent = '— متاح —';
      const btn = document.createElement('button');
      btn.className = 'btn-book';
      btn.textContent = 'احجز';
      btn.onclick = () => book(m.month);
      action.appendChild(btn);
    } else if (m.bookedBy === currentUser) {
      by.classList.add('mine');
      by.textContent = m.bookedBy + ' (أنت)';
      const btn = document.createElement('button');
      btn.className = 'btn-cancel';
      btn.textContent = 'إلغاء';
      btn.onclick = () => cancel(m.month);
      action.appendChild(btn);
    } else {
      by.classList.add('taken');
      by.textContent = m.bookedBy;
      const badge = document.createElement('span');
      badge.className = 'badge-taken';
      badge.textContent = 'محجوز';
      action.appendChild(badge);
    }

    li.appendChild(name);
    li.appendChild(by);
    li.appendChild(action);
    list.appendChild(li);
  });
}

function showLoggedIn(name, months) {
  currentUser = name;
  el('userName').textContent = name;
  el('loginCard').classList.add('hidden');
  el('userBar').classList.remove('hidden');
  el('boardCard').classList.remove('hidden');
  render(months);
}

function showLoggedOut() {
  currentUser = null;
  el('loginCard').classList.remove('hidden');
  el('userBar').classList.add('hidden');
  el('boardCard').classList.add('hidden');
  el('nameInput').focus();
}

function msg(text, kind) {
  const box = el('boardMsg');
  box.textContent = text || '';
  box.className = 'msg' + (kind ? ' ' + kind : '');
  if (text) setTimeout(() => { if (box.textContent === text) { box.textContent = ''; box.className = 'msg'; } }, 4000);
}

async function book(month) {
  const r = await api('/api/book', 'POST', { month });
  if (r.ok) { msg('تم حجز ' + month + ' ✓', 'ok'); render(r.data.months); }
  else { msg(r.data.error || 'تعذر الحجز', 'err'); if (r.data.months) render(r.data.months); }
}

async function cancel(month) {
  if (!confirm('هل تريد إلغاء حجزك لشهر ' + month + '؟')) return;
  const r = await api('/api/cancel', 'POST', { month });
  if (r.ok) { msg('تم إلغاء حجز ' + month, 'ok'); render(r.data.months); }
  else { msg(r.data.error || 'تعذر الإلغاء', 'err'); if (r.data.months) render(r.data.months); }
}

el('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = el('nameInput').value.trim();
  el('loginError').textContent = '';
  if (!name) { el('loginError').textContent = 'الرجاء إدخال الاسم'; return; }
  const r = await api('/api/login', 'POST', { name });
  if (r.ok) showLoggedIn(r.data.name, r.data.months);
  else el('loginError').textContent = r.data.error || 'تعذر تسجيل الدخول';
});

el('logoutBtn').addEventListener('click', async () => {
  await api('/api/logout', 'POST');
  showLoggedOut();
});

// تحميل الحالة عند فتح الصفحة
(async function init() {
  const r = await api('/api/me', 'GET');
  if (r.ok && r.data.name) showLoggedIn(r.data.name, r.data.months);
  else showLoggedOut();
})();
