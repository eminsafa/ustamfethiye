# Ustam Fethiye — proje notları

Fethiye ve Seydikemer'de boya-tadilat, havuz, bahçe ve su tesisatı hizmeti veren firmanın (TR/EN/RU) kurumsal sitesi.
Statik üretim (`node build.mjs` → `dist/`), Cloudflare Worker (`src/worker.js`) ile servis edilir. Bağımlılık yok.

## Komutlar
- `node build.mjs` — siteyi üretir. `npm run preview` — `http://localhost:8788/tr/`.
- `BLOG_PREVIEW=1 node build.mjs` — taslak blog yazılarıyla yerel önizleme (yayına gitmez).
- `npx wrangler deploy` — yayın. `master`'a push da otomatik yayınlar (Cloudflare Workers Builds).
- `node scripts/check-posts.mjs` — blog denetim kapısı. `node scripts/publish-post.mjs <slug>` — onaylı taslağı yayına hazırlar.
- `node scripts/indexnow.mjs` — sitemap'i Bing/Yandex'e bildirir.

## Değişmez kurallar
1. **Sahte referans, yorum, müşteri geçmişi ya da deneyim iddiası YOK.** Firma henüz iş yapmamıştır. "Müşterilerimiz",
   "yıllardır", "yüzlerce iş" gibi ifadeler yazılmaz. Gerçek olmayan hiçbir şey yayınlanmaz.
2. **Blog yazıları onaysız yayınlanmaz.** Bkz. `docs/blog-yazim-kurallari.md`.
3. Fiyat sitede yazılmaz; fiyat işe göre belirlenir (konum, büyüklük, iş tanımı).
4. Değişiklik yapmadan önce ilgili dosyayı okuyun; içerik `src/content/{tr,en,ru}.js` içindedir, üç dil birlikte güncellenir.
5. Rusça/İngilizce metinleri yerel konuşucu kontrol etmelidir.

## Tasarım sistemi
- Renkler: derin cam yeşili `#0E5349`, açık `#DCEAE5`/`#EEF4F1`, vurgu nane `#7FC9B4`, okur `#8A5F06`, zemin `#F4F6F2`, metin `#121A17`.
  Soluk metin `--ink-3: #5B6963` (kontrast ≥ 4.5:1 — daha açığına çekmeyin).
- Yazı: Onest (arayüz/başlık), Source Serif 4 (metin), IBM Plex Mono (etiket).
- Logo: dolu "U" + çatı (`src/lib/visuals.js` → `logoMark`). Çizimler satır içi SVG (`ART`, `heroArt`).
- Erişilebilirlik hedefi: axe-core sıfır ihlal (masaüstü + mobil). Yeni bileşen eklerken kontrol edin.
- Telefonda 320–414 px arası yatay taşma olmamalı.

## Hesaplar / yapılandırma
- Talepler: D1 (`leads`) + e-posta (Cloudflare Email Routing, `LEAD_EMAIL_TO` secret). Form: `/api/lead`.
- Kanonik adres `https://ustamfethiye.com` (www → apex 301).
- Yayın: GitHub `eminsafa/ustamfethiye` → Cloudflare Workers Builds.
