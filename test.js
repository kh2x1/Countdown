'use strict';

// اختبارات بسيطة للتأكد من منطق الحجز والصلاحيات
const http = require('http');
const fs = require('fs');
const path = require('path');

process.env.PORT = '3999';
const DATA_FILE = path.join(__dirname, 'data.json');
// نبدأ من حالة نظيفة
try { fs.unlinkSync(DATA_FILE); } catch (e) {}

const { server } = require('./server');

function req(method, pathName, body, cookie) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const r = http.request({
      host: 'localhost', port: 3999, path: pathName, method,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        payload ? { 'Content-Length': Buffer.byteLength(payload) } : {},
        cookie ? { 'Cookie': cookie } : {}
      )
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        let json = {};
        try { json = JSON.parse(data); } catch (e) {}
        const setCookie = res.headers['set-cookie'];
        resolve({ status: res.statusCode, json, cookie: setCookie ? setCookie[0].split(';')[0] : null });
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

let passed = 0, failed = 0;
function assert(cond, label) {
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}

async function run() {
  await new Promise(r => server.listen(3999, r));

  // علي يسجل دخول
  const ali = await req('POST', '/api/login', { name: 'علي' });
  assert(ali.status === 200 && ali.json.name === 'علي', 'تسجيل دخول علي');
  assert(ali.cookie && ali.cookie.startsWith('session='), 'استلام جلسة');

  // علي يحجز يونيو
  const book1 = await req('POST', '/api/book', { month: 'يونيو' }, ali.cookie);
  assert(book1.status === 200, 'علي يحجز يونيو');

  // علي يحاول يحجز يونيو مرة ثانية -> مرفوض (محجوز)
  const book2 = await req('POST', '/api/book', { month: 'يونيو' }, ali.cookie);
  assert(book2.status === 409, 'رفض حجز شهر محجوز');

  // سارة تسجل دخول
  const sara = await req('POST', '/api/login', { name: 'سارة' });
  assert(sara.status === 200, 'تسجيل دخول سارة');

  // سارة تحاول تلغي حجز علي -> ممنوع
  const cancelOther = await req('POST', '/api/cancel', { month: 'يونيو' }, sara.cookie);
  assert(cancelOther.status === 403, 'منع سارة من إلغاء حجز علي');

  // سارة تحجز يوليو
  const book3 = await req('POST', '/api/book', { month: 'يوليو' }, sara.cookie);
  assert(book3.status === 200, 'سارة تحجز يوليو');

  // علي يلغي حجزه هو -> مسموح
  const cancelMine = await req('POST', '/api/cancel', { month: 'يونيو' }, ali.cookie);
  assert(cancelMine.status === 200, 'علي يلغي حجزه الخاص');

  // حجز بدون تسجيل دخول -> مرفوض
  const noAuth = await req('POST', '/api/book', { month: 'مارس' }, null);
  assert(noAuth.status === 401, 'منع الحجز بدون تسجيل دخول');

  // شهر غير صحيح -> مرفوض
  const badMonth = await req('POST', '/api/book', { month: 'شهر وهمي' }, ali.cookie);
  assert(badMonth.status === 400, 'رفض شهر غير صحيح');

  server.close();
  try { fs.unlinkSync(DATA_FILE); } catch (e) {}
  console.log(`\nالنتيجة: ${passed} نجح، ${failed} فشل`);
  process.exit(failed ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
