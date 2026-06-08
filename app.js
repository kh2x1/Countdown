'use strict';

/*
 * جمعية الأشهر — نسخة ثابتة لـ GitHub Pages.
 * التخزين في localStorage داخل متصفح كل شخص (تجربة محلية).
 * القواعد:
 *  - الدخول بالاسم فقط.
 *  - كل شخص يحجز شهراً واحداً فقط.
 *  - لا يمكن إلغاء/تغيير حجز شخص آخر (يُسمح فقط بإلغاء حجزك أنت).
 */

// أشهر الجمعية بالترتيب كما في الفكرة الأصلية
const MONTHS = [
  'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر',
  'ديسمبر', 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو'
];

const USER_KEY = 'jamiya_user';
const BOOKINGS_KEY = 'jamiya_bookings';

const el = (id) => document.getElementById(id);
let currentUser = null;

// ----- التخزين -----
function getBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || {}; }
  catch (e) { return {}; }
}
function setBookings(b) { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(b)); }

function myBookedMonth() {
  const b = getBookings();
  return MONTHS.find(m => b[m] && b[m].name === currentUser) || null;
}

// ----- العرض -----
function render() {
  const bookings = getBookings();
  const mine = myBookedMonth();
  const list = el('monthsList');
  list.innerHTML = '';

  MONTHS.forEach(month => {
    const b = bookings[month];
    const li = document.createElement('li');
    li.className = 'month-row';

    const name = document.createElement('span');
    name.className = 'month-name';
    name.textContent = month;

    const by = document.createElement('span');
    by.className = 'booked-by';
    const action = document.createElement('span');
    action.className = 'row-action';

    if (!b) {
      by.classList.add('empty');
      by.textContent = '— متاح —';
      const btn = document.createElement('button');
      btn.className = 'btn-book';
      btn.textContent = 'احجز';
      // شهر واحد لكل شخص: إن كان عندك حجز، عطّل بقية الأزرار
      if (mine) {
        btn.disabled = true;
        btn.title = 'لديك حجز مسبق لشهر ' + mine + '. الغِه أولاً لتغييره.';
      } else {
        btn.onclick = () => book(month);
      }
      action.appendChild(btn);
    } else if (b.name === currentUser) {
      by.classList.add('mine');
      by.textContent = b.name + ' (أنت)';
      const btn = document.createElement('button');
      btn.className = 'btn-cancel';
      btn.textContent = 'إلغاء';
      btn.onclick = () => cancel(month);
      action.appendChild(btn);
    } else {
      by.classList.add('taken');
      by.textContent = b.name;
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

function msg(text, kind) {
  const box = el('boardMsg');
  box.textContent = text || '';
  box.className = 'msg' + (kind ? ' ' + kind : '');
  if (text) setTimeout(() => {
    if (box.textContent === text) { box.textContent = ''; box.className = 'msg'; }
  }, 4000);
}

// ----- العمليات -----
function book(month) {
  if (!MONTHS.includes(month)) return;
  const bookings = getBookings();

  if (bookings[month]) {
    msg('الشهر محجوز مسبقاً باسم ' + bookings[month].name, 'err');
    render();
    return;
  }
  const mine = myBookedMonth();
  if (mine) {
    msg('عندك حجز مسبق لشهر ' + mine + ' — الغِه أولاً (شهر واحد لكل شخص)', 'err');
    return;
  }
  bookings[month] = { name: currentUser, at: new Date().toISOString() };
  setBookings(bookings);
  msg('تم حجز ' + month + ' ✓', 'ok');
  render();
}

function cancel(month) {
  const bookings = getBookings();
  const b = bookings[month];
  if (!b) { render(); return; }
  // لا يمكن إلغاء حجز شخص آخر
  if (b.name !== currentUser) {
    msg('لا يمكنك تعديل حجز شخص آخر', 'err');
    return;
  }
  if (!confirm('هل تريد إلغاء حجزك لشهر ' + month + '؟')) return;
  delete bookings[month];
  setBookings(bookings);
  msg('تم إلغاء حجز ' + month, 'ok');
  render();
}

// ----- الجلسة -----
function showLoggedIn(name) {
  currentUser = name;
  localStorage.setItem(USER_KEY, name);
  el('userName').textContent = name;
  el('loginCard').classList.add('hidden');
  el('userBar').classList.remove('hidden');
  el('boardCard').classList.remove('hidden');
  render();
}

function showLoggedOut() {
  currentUser = null;
  localStorage.removeItem(USER_KEY);
  el('loginCard').classList.remove('hidden');
  el('userBar').classList.add('hidden');
  el('boardCard').classList.add('hidden');
  el('nameInput').value = '';
  el('nameInput').focus();
}

el('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = el('nameInput').value.trim();
  el('loginError').textContent = '';
  if (!name) { el('loginError').textContent = 'الرجاء إدخال الاسم'; return; }
  if (name.length > 40) { el('loginError').textContent = 'الاسم طويل جداً'; return; }
  showLoggedIn(name);
});

el('logoutBtn').addEventListener('click', showLoggedOut);

// مزامنة بين تبويبات نفس المتصفح
window.addEventListener('storage', () => { if (currentUser) render(); });

// تحميل الحالة
(function init() {
  const saved = localStorage.getItem(USER_KEY);
  if (saved) showLoggedIn(saved);
  else showLoggedOut();
})();
