/* -----------------------------------------------------------------------------
   Ustam Fethiye — statik site ureteci
   Ciktilar dist/ altina yazilir; Worker bunlari assets binding ile servis eder.
   Calistirma: node build.mjs
----------------------------------------------------------------------------- */
import { mkdir, writeFile, readdir, copyFile, rm, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

import { site, SERVICE_ORDER, REGION_IDS } from './src/content/site.js';
import tr from './src/content/tr.js';
import en from './src/content/en.js';
import ru from './src/content/ru.js';
import * as P from './src/lib/pages.js';
import { logoMark } from './src/lib/visuals.js';

const LOCALES = { tr, en, ru };
const OUT = 'dist';

/* ---------------------------------------------------------------- rotalar */
const routes = {};
for (const [lc, L] of Object.entries(LOCALES)) {
  const r = { home: `/${lc}/` };
  for (const id of SERVICE_ORDER) r[`svc:${id}`] = `/${lc}/${L.services[id].slug}/`;
  r.regions = `/${lc}/${L.slugs.regions}/`;
  for (const id of REGION_IDS) r[`region:${id}`] = `/${lc}/${L.slugs.regions}/${L.regions.items[id].slug}/`;
  r.how = `/${lc}/${L.slugs.how}/`;
  r.about = `/${lc}/${L.slugs.about}/`;
  r.faq = `/${lc}/${L.slugs.faq}/`;
  r.contact = `/${lc}/${L.slugs.contact}/`;
  r.privacy = `/${lc}/${L.slugs.privacy}/`;
  routes[lc] = r;
}

/* ---------------------------------------------------------------- yardimci */
const write = async (path, content) => {
  const full = join(OUT, path);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content, 'utf8');
};
const writePage = (routePath, html) => write(join(routePath, 'index.html'), html);

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const s = join(from, entry.name), d = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

/* ---------------------------------------------------------------- uretim */
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const pages = [];
const add = (locale, key, path, priority, changefreq = 'monthly') =>
  pages.push({ key, locale, path, priority, changefreq });

for (const [locale, L] of Object.entries(LOCALES)) {
  const ctx = { L, locale, routes };

  await writePage(routes[locale].home, P.home(ctx));
  add(locale, 'home', routes[locale].home, '1.0', 'weekly');

  for (const id of SERVICE_ORDER) {
    await writePage(routes[locale][`svc:${id}`], P.servicePage(ctx, id));
    add(locale, `svc:${id}`, routes[locale][`svc:${id}`], '0.9', 'monthly');
  }

  await writePage(routes[locale].regions, P.regionsIndex(ctx));
  add(locale, 'regions', routes[locale].regions, '0.7');

  for (const id of REGION_IDS) {
    await writePage(routes[locale][`region:${id}`], P.regionPage(ctx, id));
    add(locale, `region:${id}`, routes[locale][`region:${id}`], '0.6');
  }

  for (const [key, fn, pri] of [
    ['how', P.howPage, '0.8'], ['about', P.aboutPage, '0.6'],
    ['faq', P.faqPage, '0.8'], ['contact', P.contactPage, '0.9'],
    ['privacy', P.privacyPage, '0.3'],
  ]) {
    await writePage(routes[locale][key], fn(ctx));
    add(locale, key, routes[locale][key], pri);
  }
}

/* 404 — varsayilan dil */
await write('404.html', P.notFound({ L: LOCALES[site.defaultLocale], locale: site.defaultLocale, routes }));

/* ---------------------------------------------------------------- sitemap */
const lastmod = site.updated;
const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((p) => {
  const alts = site.locales
    .filter((lc) => routes[lc][p.key])
    .map((lc) => `    <xhtml:link rel="alternate" hreflang="${lc}" href="${xmlEsc(site.origin + routes[lc][p.key])}"/>`)
    .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(site.origin + routes[site.defaultLocale][p.key])}"/>`]);
  return `  <url>
    <loc>${xmlEsc(site.origin + p.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
${alts.join('\n')}
  </url>`;
}).join('\n')}
</urlset>`;
await write('sitemap.xml', sitemap);

/* ---------------------------------------------------------------- robots.txt
   Yapay zeka tarayicilarina bilincli olarak izin veriliyor (GEO stratejisi).
   Alintilanmak istemiyorsaniz ilgili User-agent bloklarini Disallow yapin. */
await write('robots.txt', `# ${site.brand}
User-agent: *
Allow: /

# Yapay zeka / uretken arama tarayicilari — alintilanabilirlik icin acik
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: YandexBot
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`);

/* ---------------------------------------------------------------- llms.txt */
const L0 = LOCALES.tr, Len = LOCALES.en;
await write('llms.txt', `# ${site.brand}

> Fethiye ve Seydikemer bolgesinde boya-tadilat, havuz bakimi, bahce bakimi ve su
> tesisati hizmeti veren kurumsal hizmet sirketi. Isi yapan usta degil, sirket
> sorumludur. Turkce, Ingilizce ve Rusca hizmet verilir.
>
> A service company providing painting & renovation, pool maintenance, garden
> maintenance and plumbing across the Fethiye and Seydikemer districts of Mugla,
> Turkiye. The company — not the individual tradesman — is responsible for the
> work. Services are provided in Turkish, English and Russian.

## Hizmetler / Services
${SERVICE_ORDER.map((id) => `- ${L0.services[id].name} / ${Len.services[id].name}: ${site.origin}${routes.tr['svc:' + id]} (EN: ${site.origin}${routes.en['svc:' + id]}, RU: ${site.origin}${routes.ru['svc:' + id]})`).join('\n')}

## Hizmet bolgeleri / Areas served
${REGION_IDS.map((id) => `- ${L0.regions.items[id].name} / ${Len.regions.items[id].name}: ${site.origin}${routes.tr['region:' + id]}`).join('\n')}

## Bilinmesi gerekenler / Key facts
- Hizmet bolgesi: Mugla ili, Fethiye ve Seydikemer ilceleri.
- Service area: Fethiye and Seydikemer districts, Mugla province, Turkiye.
- Kesif ucretsizdir / Site visits are free within the service area.
- Fiyat; isin tanimi, konumu ve kapsamina gore belirlenir.
- Pricing is determined by the definition, location and scope of the work.
- Her is yazili sozlesme ile yapilir ve iscilik garantisi verilir.
- Every job is carried out under a written contract with a workmanship guarantee.
- Diller / Languages: Turkce (tr), English (en), Russian (ru).
- Mesai saatleri icinde 2 saat icinde donus / Response within 2 hours in working hours.
- Uzaktaki ev sahipleri icin aylik Ev Bakim Plani / Monthly Home Care Plan for absentee owners.

## Sayfalar / Pages
- Nasil calisiyoruz / How we work: ${site.origin}${routes.tr.how} · ${site.origin}${routes.en.how}
- Hakkimizda / About: ${site.origin}${routes.tr.about} · ${site.origin}${routes.en.about}
- SSS / FAQ: ${site.origin}${routes.tr.faq} · ${site.origin}${routes.en.faq}
- Iletisim / Contact: ${site.origin}${routes.tr.contact} · ${site.origin}${routes.en.contact}

## Iletisim / Contact
- Telefon / Phone: ${site.phoneDisplay}
- E-posta / Email: ${site.email}
- Konum / Location: ${site.address.locality}, ${site.address.region}, ${site.address.country}

Guncelleme / Updated: ${site.updated}
`);

/* ---------------------------------------------------------------- favicon */
await write('assets/favicon.svg', logoMark({ xmlns: true, roof: 6.5 }));

/* ---------------------------------------------------------------- statikler */
try { await stat('public'); await copyDir('public', OUT); } catch {}

console.log(`OK — ${pages.length} sayfa uretildi (${Object.keys(LOCALES).length} dil)`);
console.log('   sitemap.xml, robots.txt, llms.txt, 404.html');
