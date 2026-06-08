'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// أشهر الجمعية بالترتيب كما في الصورة
const MONTHS = [
  'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر',
  'ديسمبر', 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو'
];

// ----- التخزين (ملف JSON بسيط) -----
function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      bookings: parsed.bookings || {}, // { month: { name, at } }
      sessions: parsed.sessions || {}  // { token: name }
    };
  } catch (e) {
    return { bookings: {}, sessions: {} };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let data = loadData();

// ----- أدوات مساعدة -----
function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  });
  return out;
}

function getUser(req) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  if (token && data.sessions[token]) {
    return { token, name: data.sessions[token] };
  }
  return null;
}

function sendJSON(res, status, body, extraHeaders) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json; charset=utf-8' },
    extraHeaders || {}
  );
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy(); // حماية بسيطة
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { resolve({}); }
    });
  });
}

function publicState() {
  return MONTHS.map(month => {
    const b = data.bookings[month];
    return { month, bookedBy: b ? b.name : null, at: b ? b.at : null };
  });
}

// ----- الواجهات البرمجية (API) -----
async function handleApi(req, res, pathname) {
  // تسجيل الدخول بالاسم فقط
  if (pathname === '/api/login' && req.method === 'POST') {
    const body = await readBody(req);
    const name = (body.name || '').toString().trim();
    if (!name) return sendJSON(res, 400, { error: 'الرجاء إدخال الاسم' });
    if (name.length > 40) return sendJSON(res, 400, { error: 'الاسم طويل جداً' });

    const token = crypto.randomBytes(24).toString('hex');
    data.sessions[token] = name;
    saveData(data);
    const cookie = `session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
    return sendJSON(res, 200, { name, months: publicState() }, { 'Set-Cookie': cookie });
  }

  // معرفة المستخدم الحالي + حالة الأشهر
  if (pathname === '/api/me' && req.method === 'GET') {
    const user = getUser(req);
    return sendJSON(res, 200, { name: user ? user.name : null, months: publicState() });
  }

  // تسجيل الخروج
  if (pathname === '/api/logout' && req.method === 'POST') {
    const user = getUser(req);
    if (user) { delete data.sessions[user.token]; saveData(data); }
    const cookie = 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
    return sendJSON(res, 200, { ok: true }, { 'Set-Cookie': cookie });
  }

  // حجز شهر
  if (pathname === '/api/book' && req.method === 'POST') {
    const user = getUser(req);
    if (!user) return sendJSON(res, 401, { error: 'سجّل الدخول أولاً' });
    const body = await readBody(req);
    const month = (body.month || '').toString();
    if (!MONTHS.includes(month)) return sendJSON(res, 400, { error: 'شهر غير صحيح' });

    const existing = data.bookings[month];
    if (existing) {
      return sendJSON(res, 409, { error: `الشهر محجوز مسبقاً باسم ${existing.name}`, months: publicState() });
    }
    data.bookings[month] = { name: user.name, at: new Date().toISOString() };
    saveData(data);
    return sendJSON(res, 200, { ok: true, months: publicState() });
  }

  // إلغاء الحجز — فقط صاحب الحجز يقدر يلغيه
  if (pathname === '/api/cancel' && req.method === 'POST') {
    const user = getUser(req);
    if (!user) return sendJSON(res, 401, { error: 'سجّل الدخول أولاً' });
    const body = await readBody(req);
    const month = (body.month || '').toString();
    const existing = data.bookings[month];
    if (!existing) return sendJSON(res, 404, { error: 'الشهر غير محجوز', months: publicState() });
    if (existing.name !== user.name) {
      return sendJSON(res, 403, { error: 'لا يمكنك تعديل حجز شخص آخر', months: publicState() });
    }
    delete data.bookings[month];
    saveData(data);
    return sendJSON(res, 200, { ok: true, months: publicState() });
  }

  return sendJSON(res, 404, { error: 'غير موجود' });
}

// ----- خدمة الملفات الثابتة -----
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
  const fullPath = path.join(PUBLIC_DIR, filePath);
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('الصفحة غير موجودة');
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

// ----- الخادم -----
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname).catch(() => sendJSON(res, 500, { error: 'خطأ في الخادم' }));
  } else {
    serveStatic(req, res, pathname);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`جمعية الأشهر تعمل على http://localhost:${PORT}`);
  });
}

module.exports = { server, MONTHS };
