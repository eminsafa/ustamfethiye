// Arama motorlarina (Bing, Yandex...) sitemap'teki adresleri bildirir (IndexNow).
// Anahtar dosyasi public/<32 hex>.txt icindedir. Kullanim: node scripts/indexnow.mjs [adres ...]
import { readdir, readFile } from 'node:fs/promises';
const HOST = 'ustamfethiye.com';
const keyFile = (await readdir('public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('IndexNow anahtar dosyası (public/<32hex>.txt) yok'); process.exit(1); }
const key = (await readFile(`public/${keyFile}`, 'utf8')).trim();
let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} adres gönderildi, HTTP ${res.status} (200/202 = kabul)`);
