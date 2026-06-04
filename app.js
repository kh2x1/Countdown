// ===== العداد التنازلي للمناسبات =====
// تُحفظ المواعيد في localStorage داخل متصفح المستخدم.

const STORAGE_KEY = "countdown_events_v1";

const form = document.getElementById("event-form");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const eventsEl = document.getElementById("events");
const emptyState = document.getElementById("empty-state");

let events = loadEvents();

// --- التخزين ---
function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// --- حساب الفرق بشكل تقويمي (شهور/أيام/ساعات/دقائق/ثواني) ---
function getDiff(target, now) {
  if (target <= now) return null;

  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());

  // أضف الشهور لتاريخ "now" ثم اضبط إذا تجاوزنا الهدف
  let anchor = new Date(now);
  anchor.setMonth(anchor.getMonth() + months);
  if (anchor > target) {
    months--;
    anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);
  }

  let rem = target - anchor; // المتبقي بالمللي ثانية بعد الشهور الكاملة
  const days = Math.floor(rem / 86400000);
  rem -= days * 86400000;
  const hours = Math.floor(rem / 3600000);
  rem -= hours * 3600000;
  const minutes = Math.floor(rem / 60000);
  rem -= minutes * 60000;
  const seconds = Math.floor(rem / 1000);

  return { months, days, hours, minutes, seconds };
}

// --- التنسيق ---
const dateFmt = new Intl.DateTimeFormat("ar", {
  dateStyle: "full",
  timeStyle: "short",
});

function pad(n) {
  return String(n).padStart(2, "0");
}

// --- العرض ---
function render() {
  emptyState.style.display = events.length ? "none" : "block";

  // رتّب حسب الأقرب
  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  eventsEl.innerHTML = sorted
    .map((ev) => {
      const target = new Date(ev.date);
      const diff = getDiff(target, new Date());
      const body = diff
        ? `
        <div class="countdown">
          <div class="unit"><div class="num">${diff.months}</div><div class="label">شهر</div></div>
          <div class="unit"><div class="num">${diff.days}</div><div class="label">يوم</div></div>
          <div class="unit"><div class="num">${pad(diff.hours)}</div><div class="label">ساعة</div></div>
          <div class="unit"><div class="num">${pad(diff.minutes)}</div><div class="label">دقيقة</div></div>
          <div class="unit"><div class="num">${pad(diff.seconds)}</div><div class="label">ثانية</div></div>
        </div>`
        : `<div class="event-done">🎉 حان الموعد!</div>`;

      return `
        <article class="event-card ${diff ? "" : "past"}" data-id="${ev.id}">
          <div class="event-head">
            <div>
              <div class="event-title">${escapeHtml(ev.title)}</div>
              <div class="event-date">${dateFmt.format(target)}</div>
            </div>
            <button class="btn-delete" data-id="${ev.id}" title="حذف" aria-label="حذف">🗑️</button>
          </div>
          ${body}
        </article>`;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- الأحداث ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const date = dateInput.value;
  if (!title || !date) return;

  events.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title,
    date,
  });
  saveEvents();
  form.reset();
  render();
});

eventsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;
  const id = btn.dataset.id;
  if (confirm("متأكد أنك تبي تحذف هذا الموعد؟")) {
    events = events.filter((ev) => ev.id !== id);
    saveEvents();
    render();
  }
});

// تحديث كل ثانية
render();
setInterval(render, 1000);
