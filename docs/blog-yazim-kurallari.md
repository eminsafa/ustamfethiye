# Rehber (blog) yazım kuralları

Bu belge, blog yazılarını hazırlayan herkes için (insan ya da otomatik hazırlık) bağlayıcıdır.

## Yayın modeli
**Onaysız yayın YOKTUR.** Her yazı `draft: true` ile taslak olarak hazırlanır. Firma sahibi okuyup onaylayınca
`node scripts/publish-post.mjs <slug>` ile yayına alınır. Taslak, sitede hiçbir yerde görünmez.

## Dil ve hedef
- Yalnızca Türkçe. Hedef okur: Fethiye ve Seydikemer'de villa/müstakil ev sahibi (yerleşik ya da uzakta yaşayan).
- Ton: sakin, net, saygılı. Kısa cümleler, kısa paragraflar, madde işaretleri. Gereksiz uzatma yok.

## Kesin yasaklar (otomatik denetim bunları engeller: `node scripts/check-posts.mjs`)
- **Firma deneyimi ya da müşteri geçmişi iması:** "müşterilerimiz", "yıllardır", "deneyimimiz", "projelerimiz",
  "yüzlerce", "binlerce", "onlarca". Firma henüz iş yapmamıştır; bu ifadeler doğru değildir.
- **Fiyat ya da tutar** (TL, ₺, €, $ ile).
- **Abartılı/kanıtlanamaz iddia:** "%100", "kesin çözüm/garanti", "en iyi firma/usta/fiyat".
- **Yorum/referans iması:** "gerçek müşteri", "müşteri yorumu", "memnun kalan".
- Uydurma vaka, sahte istatistik, sahte alıntı, kaynağı olmayan "araştırmalar gösteriyor".

## Doğruluk
- Yalnızca genel kabul görmüş, güvenle söylenebilecek bilgi yazılır. Emin olunmayan sayı yazılmaz.
- Kimyasal, elektrik, gaz ve tesisat konularında güvenlik uyarısı eklenir. Yerine "uzmana danışın" denir.
- Sayısal aralıklar "genel referans, ürüne ve duruma göre değişir" notuyla verilir.
- Hukuki/mali tavsiye verilmez; genel çerçeve çizilir.

## Yapı (denetim bunları arar)
- `content/blog/<slug>.md`; slug ASCII, tireli.
- Front matter: `title` (≤70), `description` (110–165 karakter), `date`, `category`, `service`
  (`painting|pool|garden|plumbing|homecare`), `draft: true`.
- En az 450 kelime, en az 3 ara başlık (`##`), en az bir site içi bağlantı (`[metin](/tr/havuz-bakimi/)`).
- Sonda "Sık sorulan sorular" bölümü önerilir (3 kısa soru-cevap).
- Site içi bağlantılar: ilgili hizmet sayfası + varsa ilgili başka bir rehber.
- Aynı konuyu tekrar etmeyin: `content/blog/_konular.md` kuyruğundan sırayla gidin, bittiyse yeni konu ekleyin.

## Yeni yazı akışı (otomatik hazırlık)
1. `content/blog/_konular.md` içinden sıradaki işaretlenmemiş konuyu al.
2. Yazıyı `content/blog/<slug>.md` olarak, `draft: true` ile yaz.
3. `BLOG_PREVIEW=1 node scripts/check-posts.mjs` çalıştır; hata varsa düzelt.
4. Konuyu `_konular.md` içinde "Yapıldı"ya taşı.
5. Commit + push et. **Yayına alma.** Firma sahibine hangi yazının hazır olduğunu bildir.
