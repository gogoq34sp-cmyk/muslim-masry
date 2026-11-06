// يشغَّل بعد: npx cap add android
// ينسخ الأصوات والأيقونة الصغيرة إلى مشروع أندرويد، ويضيف أذونات المنبّه الدقيق والإشعارات.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res');
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.error('لم أجد مشروع أندرويد. شغّل أولاً: npx cap add android');
  process.exit(1);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    fs.copyFileSync(path.join(from, f), path.join(to, f));
    console.log('نُسخ:', f);
  }
}
copyDir(path.join(root, 'android-res', 'raw'), path.join(androidRes, 'raw'));
copyDir(path.join(root, 'android-res', 'drawable'), path.join(androidRes, 'drawable'));

let xml = fs.readFileSync(manifestPath, 'utf8');
const perms = [
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.VIBRATE'
];
let added = 0;
for (const p of perms) {
  if (!xml.includes(p)) {
    xml = xml.replace('<application', `<uses-permission android:name="${p}" />\n    <application`);
    added++;
  }
}
fs.writeFileSync(manifestPath, xml);
console.log(`تمت إضافة ${added} إذن للـ AndroidManifest.xml`);
console.log('تم. الخطوة التالية: npx cap sync android ثم npx cap open android');
