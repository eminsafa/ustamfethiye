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
import { loadPosts } from './src/lib/blog.js';

const LOCALES = { tr, en, ru };

// Rehber (blog) yazilari: yalnizca Turkce. Gecersiz yazi yayina alinmaz.
const { posts, issues: postIssues } = await loadPosts();
if (postIssues.length) console.warn('UYARI — yayına alınmayan yazılar:\n' + postIssues.map((x) => '  - ' + x).join('\n'));
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
  if (lc === 'tr' && L.slugs.blog && posts.length) {
    r.blog = `/${lc}/${L.slugs.blog}/`;
    for (const p of posts) r[`post:${p.slug}`] = `/${lc}/${L.slugs.blog}/${p.slug}/`;
  }
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
const add = (locale, key, path, priority, changefreq = 'monthly', lastmod) =>
  pages.push({ key, locale, path, priority, changefreq, lastmod });

for (const [locale, L] of Object.entries(LOCALES)) {
  const ctx = { L, locale, routes, posts: locale === 'tr' ? posts : [] };

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

  if (routes[locale].blog) {
    await writePage(routes[locale].blog, P.blogIndex(ctx));
    add(locale, 'blog', routes[locale].blog, '0.7', 'weekly', posts[0].updated);
    for (const p of posts) {
      await writePage(routes[locale][`post:${p.slug}`], P.blogPost(ctx, p));
      add(locale, `post:${p.slug}`, routes[locale][`post:${p.slug}`], '0.6', 'monthly', p.updated);
    }
    // RSS
    const rfc = (iso) => new Date(iso + 'T09:00:00Z').toUTCString();
    const x = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await write(join(routes[locale].blog, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${x(L.blog.title)}</title>
<link>${site.origin}${routes[locale].blog}</link>
<description>${x(L.blog.description)}</description>
<language>${L.htmlLang}</language>
${posts.map((p) => `<item><title>${x(p.title)}</title><link>${site.origin}${routes[locale]['post:' + p.slug]}</link><guid>${site.origin}${routes[locale]['post:' + p.slug]}</guid><pubDate>${rfc(p.date)}</pubDate><description>${x(p.description)}</description></item>`).join('\n')}
</channel></rss>`);
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
    <lastmod>${p.lastmod || lastmod}</lastmod>
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

> Fethiye ve Seydikemer bolgesinde boya-tadilat, havuz bakimi, bahce bakimi, su
> tesisati ve ev temizligi hizmeti veren kurumsal hizmet sirketi. Isi yapan usta degil, sirket
> sorumludur. Turkce, Ingilizce ve Rusca hizmet verilir. Hedef musteri: bolgede
> yasayan ya da evi bolgede olup uzakta yasayan villa ve mustakil ev sahipleri.
>
> A service company providing painting & renovation, pool maintenance, garden
> maintenance, plumbing and home cleaning across the Fethiye and Seydikemer districts of Mugla,
> Turkiye. The company — not the individual tradesman — is responsible for the
> work. Services are provided in Turkish, English and Russian. Target customers:
> owners of villas and detached houses in the area, whether resident or living abroad.

## Hizmetler / Services
${SERVICE_ORDER.map((id) => `- ${L0.services[id].name} / ${Len.services[id].name}: ${site.origin}${routes.tr['svc:' + id]} (EN: ${site.origin}${routes.en['svc:' + id]}, RU: ${site.origin}${routes.ru['svc:' + id]})`).join('\n')}

## Hizmet bolgeleri / Areas served
${REGION_IDS.map((id) => `- ${L0.regions.items[id].name} / ${Len.regions.items[id].name}: ${site.origin}${routes.tr['region:' + id]}`).join('\n')}

## Bilinmesi gerekenler / Key facts
- Hizmet bolgesi: Mugla ili, Fethiye ve Seydikemer ilceleri.
- Service area: Fethiye and Seydikemer districts, Mugla province, Turkiye.
- Kesif ucretsizdir / Site visits are free within the service area.
- Fiyat isin konumuna, buyuklugune ve tanimina gore belirlenir: on gorusme, fotograf/video, gerekirse ucretsiz kesif, ardindan kalem kalem yazili teklif.
- Price depends on the location, size and scope of the job: initial conversation, photos or video, a free site visit if needed, then an itemised written quotation.
- Ilgili terimler / Related terms: Fethiye boyaci, Fethiye tadilat, Fethiye havuz bakimi, Fethiye su tesisatcisi, Fethiye villa bakimi, Seydikemer bahce bakimi; Fethiye painter, Fethiye villa care, pool maintenance Fethiye.
- Her is yazili sozlesme ile yapilir ve iscilik garantisi verilir.
- Every job is carried out under a written contract with a workmanship guarantee.
- Diller / Languages: Turkce (tr), English (en), Russian (ru).
- Mesai saatleri icinde 2 saat icinde donus / Response within 2 hours in working hours.
- Uzaktaki ev sahipleri icin aylik Ev Bakim Plani / Monthly Home Care Plan for absentee owners.

${posts.length ? `## Rehber / Guides (Turkish)
${posts.map((p) => `- ${p.title}: ${site.origin}${routes.tr['post:' + p.slug]}`).join('\n')}

` : ''}## Sayfalar / Pages
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
