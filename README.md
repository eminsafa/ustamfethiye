# Ustam Fethiye

Fethiye ve Seydikemer bölgesinde boya-tadilat, havuz bakımı, bahçe bakımı ve su
tesisatı hizmetleri veren firmanın kurumsal web sitesi.

Üç dilli (TR / EN / RU), statik üretilmiş, tamamen **Cloudflare Workers** üzerinde
çalışır. Framework yok, çalışma zamanı bağımlılığı yok — build çıktısı düz HTML.

---

## Yayına almadan önce yapılacaklar

| # | İş | Dosya |
|---|-----|-------|
| 1 | **Telefon numarasını gir** (`phoneDisplay`, `phoneHref`, `whatsapp`) | `src/content/site.js` |
| 2 | Resmi unvan ve açık adresi gir (`legalName`, `address.street`) | `src/content/site.js` |
| 3 | E-posta adresini doğrula | `src/content/site.js` |
| 4 | Google İşletme Profili / Yandex / sosyal medya bağlantılarını ekle (`profiles`) | `src/content/site.js` |
| 5 | Turnstile site key ve Cloudflare Analytics token ekle | `src/content/site.js` |
| 6 | Gerçek ekip ve iş fotoğraflarını ekle (stok görsel kullanmayın) | `public/assets/` |
| 7 | `og:image` için 1200×630 bir görsel ekleyip `src/lib/render.js` içinde tanımla | — |

Numara ve adres `site.js` içinde tek yerde tanımlıdır; değiştirip `npm run build`
demek tüm sayfaları günceller.

---

## Komutlar

```bash
npm install          # sadece wrangler
npm run build        # dist/ üretir (60 sayfa + sitemap + robots + llms.txt)
npm run preview      # build + http://localhost:8788/tr/ adresinde önizleme
npm run dev          # build + wrangler dev (Worker dahil, form çalışır)
npm run deploy       # build + wrangler deploy
```

---

## Cloudflare kurulumu

### 1. İlk yayın

```bash
npx wrangler login
npm run deploy
```

> Cloudflare Workers Builds (GitHub bağlı otomatik yayın) doğrudan
> `npx wrangler deploy` çalıştırır ve `package.json` scriptlerini atlar.
> Bu yüzden statik üretim `wrangler.jsonc` içindeki `build.command` alanına
> bağlıdır — hem yerelde hem CI'da çalışır. Panelde deploy komutunu
> değiştirmeye gerek yok.

Bu haliyle çalışır: site yayınlanır, form gönderilir ve talep Worker loglarına
düşer (`npx wrangler tail`). Aşağıdakiler opsiyoneldir.

### 2. Alan adını bağlama

Cloudflare panelinde **Workers & Pages → ustamfethiye → Settings → Domains &
Routes → Add → Custom domain** ile `ustamfethiye.com` ve `www.ustamfethiye.com`
ekleyin. DNS kayıtları otomatik oluşur.

### 3. Talepleri veritabanına yazma (D1)

```bash
npx wrangler d1 create ustamfethiye
npx wrangler d1 execute ustamfethiye --remote --file=./schema.sql
```

Dönen `database_id` değerini `wrangler.jsonc` içindeki yorumlu `d1_databases`
bloğuna yazıp yorumu kaldırın.

Talepleri okumak:

```bash
npx wrangler d1 execute ustamfethiye --remote \
  --command "SELECT created_at,name,phone,service,region,status FROM leads ORDER BY id DESC LIMIT 20"
```

### 4. Bildirimler

Talep geldiğinde anında haber almak için (hepsi opsiyonel, tanımlı olanlar çalışır):

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN     # @BotFather ile bot açın
npx wrangler secret put TELEGRAM_CHAT_ID       # kendi chat id'niz
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put LEAD_EMAIL_TO
npx wrangler secret put LEAD_EMAIL_FROM
```

Telegram en hızlı ve ücretsiz seçenek; e-posta gecikebilir.

### 5. Spam koruması (Turnstile)

Cloudflare → Turnstile → yeni site ekleyin.
Site key'i `src/content/site.js` içine, secret'ı Worker'a:

```bash
npx wrangler secret put TURNSTILE_SECRET
```

Secret tanımlı değilse doğrulama atlanır; form yine de bal küpü (honeypot) alanıyla
korunur.

### 6. Ölçümleme

Cloudflare → Web Analytics → site ekleyin, token'ı `site.js` içindeki
`cfAnalyticsToken` alanına yazın. Çerez kullanmaz, çerez onay bandı gerekmez.

---

## Yapı

```
src/
  content/
    site.js       telefon, adres, diller, hizmet ve bölge kimlikleri
    tr.js         Türkçe içeriğin tamamı
    en.js         İngilizce içeriğin tamamı
    ru.js         Rusça içeriğin tamamı
  lib/
    render.js     layout, head/SEO, üst bar, alt bilgi, form, ortak parçalar
    pages.js      sayfa şablonları + schema.org
  worker.js       Worker: yönlendirme, statik servis, /api/lead
public/assets/    styles.css ve statik dosyalar (olduğu gibi kopyalanır)
build.mjs         statik üretici
schema.sql        D1 tablo şeması
```

**İçerik değiştirmek:** `src/content/<dil>.js` düzenleyin, `npm run build`.
Yeni hizmet/bölge eklerken kimliği `site.js` içindeki `SERVICE_ORDER` /
`REGION_IDS` dizisine, içeriğini üç dil dosyasına da ekleyin.

---

## Sayfa haritası

Her sayfa üç dilde de üretilir; slug'lar dile göre farklıdır ve `hreflang` ile
karşılıklı bağlanır.

| Sayfa | TR | EN | RU |
|-------|----|----|----|
| Ana sayfa | `/tr/` | `/en/` | `/ru/` |
| Boya ve tadilat | `/tr/boya-tadilat/` | `/en/painting-and-renovation/` | `/ru/pokraska-i-remont/` |
| Havuz bakımı | `/tr/havuz-bakimi/` | `/en/pool-maintenance/` | `/ru/obsluzhivanie-basseynov/` |
| Bahçe bakımı | `/tr/bahce-bakimi/` | `/en/garden-maintenance/` | `/ru/ukhod-za-sadom/` |
| Su tesisatı | `/tr/su-tesisati/` | `/en/plumbing/` | `/ru/santekhnika/` |
| Ev Bakım Planı | `/tr/ev-bakim-plani/` | `/en/home-care-plan/` | `/ru/plan-ukhoda-za-domom/` |
| Bölgeler (+8 alt sayfa) | `/tr/bolgeler/` | `/en/areas-we-cover/` | `/ru/rayony-obsluzhivaniya/` |
| Nasıl çalışıyoruz | `/tr/nasil-calisiyoruz/` | `/en/how-we-work/` | `/ru/kak-my-rabotaem/` |
| Hakkımızda | `/tr/hakkimizda/` | `/en/about-us/` | `/ru/o-nas/` |
| SSS | `/tr/sik-sorulan-sorular/` | `/en/faq/` | `/ru/voprosy-i-otvety/` |
| İletişim | `/tr/iletisim/` | `/en/contact/` | `/ru/kontakty/` |
| Gizlilik / KVKK | `/tr/gizlilik-ve-kvkk/` | `/en/privacy-policy/` | `/ru/konfidentsialnost/` |

`/` adresi `/tr/` adresine 301 ile yönlenir. `x-default` Türkçeyi gösterir.

---

## SEO

- Sunucu tarafında üretilmiş düz HTML; içerik JavaScript'e bağlı değil
- Her sayfada tekil `title` + `meta description`, canonical, karşılıklı `hreflang` + `x-default`
- Schema.org: `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `HowTo`,
  `BreadcrumbList`, `ItemList`, `ContactPage`, `WebSite`
- `sitemap.xml` (dil alternatifleriyle), `robots.txt`, `404.html`
- Çerez yok → çerez onay bandı yok → hız ve dönüşüm avantajı
- Tek dış istek: Google Fonts (Faz 2'de kendi barındırmaya alınabilir)

### Bölge sayfaları hakkında uyarı

Her hizmet için ayrı mahalle sayfası **üretmeyin**. Aynı metnin yer adı
değiştirilmiş kopyaları arama motorlarınca *doorway page* sayılır ve zarar verir.
Buradaki 8 bölge sayfasının her biri o bölgeye özgü gerçek içerik taşır
(iklim, yapı tipi, tipik iş kalemleri). Yeni bölge eklerken aynı kuralı koruyun.

## GEO — yapay zekâ aramalarında görünürlük

- Her hizmet sayfasında **Kısaca** kutusu: olgusal, yer ve sayı içeren cümleler
- Soru formatında başlıklar + doğrudan cevaplar (`FAQPage` şemasıyla)
- `/llms.txt` — firma, hizmetler, bölgeler, diller ve temel gerçeklerin düz metin özeti
- `robots.txt` içinde GPTBot, PerplexityBot, ClaudeBot, Google-Extended,
  OAI-SearchBot, YandexBot **bilinçli olarak açık**. Alıntılanmak istemiyorsanız
  `build.mjs` içindeki robots bloğunu değiştirin.
- Sayfalarda `Güncelleme` tarihi görünür

**Site dışı kısım daha önemli:** Dil modelleri tek bir sitenin kendi hakkındaki
iddiasına güvenmez. Google İşletme Profili, Yandex Business, Facebook sayfası ve
gerçek değerlendirmelerdeki tutarlı bilgi alıntılanmayı belirler. Bunlar
kurulmadan GEO çalışmasının etkisi sınırlı kalır.

### Ölçüm

Ayda bir kez şu soruları ChatGPT, Gemini, Perplexity ve Google'a sorun, cevabı
kaydedin: *"Fethiye'de havuz bakımı yapan firma"*, *"reliable painter in Fethiye"*,
*"сантехник Фетхие"*. GEO'nun tek gerçek ölçüm yöntemi budur.

---

## Notlar

- Elektrik işleri sitede hiçbir yerde geçmez — bilinçli tercih.
- Fiyat hiçbir sayfada yazılı değil. Her hizmet ve bölge sayfasında tek bir cümle
  yer alır: *"Fiyat; işin tanımı, konumu ve kapsamına göre belirlenir."*
- Sitenin işi fiyat vermek değil, **ücretsiz keşif talebi üretmek**.
