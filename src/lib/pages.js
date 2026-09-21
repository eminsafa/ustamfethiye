import { site, SERVICE_ORDER, REGION_IDS, waLink } from '../content/site.js';
import { esc, layout, leadForm, crumbs, faqBlock, ctaBand, serviceCard, icons as I, SVC_ICON } from './render.js';
import { ART, heroArt, WHY_ICON, STEP_ICON, GUARANTEE_ICON, ICON } from './visuals.js';

const abs = (p) => site.origin + p;

/** Aciklamayi cumle ya da kelime sinirinda keser; kelimeyi ortadan bolmez. */
const clip = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const dot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '));
  if (dot > max * 0.6) return cut.slice(0, dot + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–—-]$/, '') + '…';
};

/* ---------------------------------------------------------------- schema.org */
export function orgSchema(ctx) {
  const { L, locale, routes } = ctx;
  const o = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': site.origin + '/#business',
    name: site.brand,
    legalName: site.legalName,
    url: abs(routes[locale].home),
    description: L.home.description,
    telephone: site.phoneHref,
    email: site.email,
    image: site.origin + '/assets/favicon.svg',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street || undefined,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Fethiye, Muğla, Türkiye' },
      { '@type': 'AdministrativeArea', name: 'Seydikemer, Muğla, Türkiye' },
      ...REGION_IDS.map((id) => ({ '@type': 'Place', name: L.regions.items[id].name })),
    ],
    availableLanguage: [
      { '@type': 'Language', name: 'Turkish', alternateName: 'tr' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Russian', alternateName: 'ru' },
    ],
    knowsLanguage: ['tr', 'en', 'ru'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:00' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: L.ui.services,
      itemListElement: SERVICE_ORDER.map((id) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: L.services[id].name, url: abs(routes[locale]['svc:' + id]) },
      })),
    },
    sameAs: Object.values(site.profiles).filter(Boolean),
  };
  if (!o.sameAs.length) delete o.sameAs;
  return o;
}

const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: abs(it[1]) })),
});

const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/* ---------------------------------------------------------------- ana sayfa */
// Ana sayfa: fiyat etkenleri ve teklifin netlesme adimlari
const PRICE_FACTOR_ICON = [I.pin, ICON.ruler, ICON.doc];
const PRICE_STEP_ICON = [ICON.phone, ICON.camera, ICON.ruler, ICON.doc];

const waMessage = (locale) => locale === 'tr' ? 'Merhaba, keşif için bilgi almak istiyorum.'
  : locale === 'ru' ? 'Здравствуйте, хочу записаться на осмотр.'
  : 'Hello, I would like to arrange a site visit.';

export function home(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const faqItems = [2, 3, 6].map((i) => L.pages.faq.items[i]);
  const latest = (ctx.posts || []).slice(0, 3);
  const blogSection = latest.length && L.blog ? `<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L.blog.latest)}</h2></div>
    <ul class="postlist postlist--wide">
      ${latest.map((p) => `<li><a href="${u('post:' + p.slug)}"><span>${esc(p.title)}</span>${I.arrow}</a></li>`).join('\n      ')}
    </ul>
    <p class="more"><a class="btn btn--ghost" href="${u('blog')}">${esc(L.blog.all)} ${I.arrow}</a></p>
  </div>
</section>

` : '';

  const body = `
<section class="hero">
  <div class="wrap hero__in">
    <div>
      <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
      <h1>${esc(L.home.h1)}</h1>
      <p class="lede">${esc(L.home.lede)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${u('contact')}">${esc(L.ui.ctaQuote)}</a>
        <a class="btn btn--wa" href="${waLink(waMessage(locale))}" rel="noopener">${I.wa}${esc(L.ui.ctaWhatsapp)}</a>
      </div>
      <ul class="hero__facts">
        ${L.ui.trust.slice(0, 3).map((t) => `<li>${I.check}<span>${esc(t)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="hero__art">${heroArt(SVC_ICON)}<span class="hero__tag">${I.pin}${esc(L.ui.serviceArea)}</span></div>
  </div>
</section>

<section class="sec" id="services">
  <div class="wrap">
    <div class="sec-head">
      <h2>${esc(L.home.servicesTitle)}</h2>
      <p class="lede">${esc(L.home.servicesLede)}</p>
    </div>
    <div class="grid grid--4">
      ${['painting', 'pool', 'garden', 'plumbing'].map((id) => serviceCard(ctx, id)).join('\n')}
      ${serviceCard(ctx, 'homecare', { wide: true })}
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>${esc(L.home.compare.title)}</h2>
      <p class="lede">${esc(L.home.compare.lede)}</p>
    </div>
    <div class="tablewrap">
      <table class="compare">
        <thead><tr>
          <th scope="col"><span class="sr">${esc(L.home.compare.title)}</span></th>
          <th scope="col">${esc(L.home.compare.colA)}</th>
          <th scope="col" class="is-us">${esc(L.home.compare.colB)}</th>
        </tr></thead>
        <tbody>
          ${L.home.compare.rows.map((r) => `<tr><th scope="row">${esc(r.k)}</th><td data-label="${esc(L.home.compare.colA)}">${esc(r.a)}</td><td class="is-us" data-label="${esc(L.home.compare.colB)}">${esc(r.b)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2>${esc(L.home.pricing.title)}</h2>
      <p class="lede">${esc(L.home.pricing.lede)}</p>
    </div>
    <div class="grid grid--3">
      ${L.home.pricing.factors.map((f, i) => `<div class="cell gcell"><span class="tile__icon">${PRICE_FACTOR_ICON[i]}</span><div><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></div></div>`).join('\n      ')}
    </div>
    <h3 class="h-flow">${esc(L.home.pricing.stepsTitle)}</h3>
    <ol class="flow flow--detail" style="--cols:4">
      ${L.home.pricing.steps.map((st, i) => `<li><span class="flow__icon">${PRICE_STEP_ICON[i]}<b>${i + 1}</b></span><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></li>`).join('\n      ')}
    </ol>
    <p class="more"><a class="btn btn--primary" href="${u('contact')}">${esc(L.ui.ctaQuote)}</a></p>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L.home.promiseTitle)}</h2></div>
    <ul class="tiles">
      ${L.home.promises.map((p, i) => `<li><span class="tile__icon">${WHY_ICON[i]}</span><span class="tile__t">${esc(p.t)}</span></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
      <h2>${esc(L.home.regionsTitle)}</h2>
      <p class="lede">${esc(L.home.regionsLede)}</p>
    </div>
    <ul class="chips chips--pin">
      ${REGION_IDS.map((id) => `<li><a href="${u('region:' + id)}">${I.pin}${esc(L.regions.items[id].name)}</a></li>`).join('')}
    </ul>
  </div>
</section>

${blogSection}<section class="${blogSection ? 'sec' : 'sec sec--alt'}">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L.home.faqTitle)}</h2></div>
    ${faqBlock(faqItems)}
    <p class="more"><a class="btn btn--ghost" href="${u('faq')}">${esc(L.pages.faq.h1)} ${I.arrow}</a></p>
  </div>
</section>

${ctaBand(ctx, { form: true })}`;

  return layout(ctx, {
    key: 'home', title: L.home.title, description: L.home.description, body,
    jsonld: [
      orgSchema(ctx),
      { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand, url: abs(u('home')), inLanguage: locale },
      faqSchema(faqItems),
    ],
  });
}

/* ---------------------------------------------------------------- hizmet */
export function servicePage(ctx, id) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const s = L.services[id];
  const related = SERVICE_ORDER.filter((x) => x !== id).slice(0, 3);
  const [lead, ...rest] = s.intro;

  const body = `
${crumbs(ctx, [[L.ui.services, u('home') + '#services'], [s.name, u('svc:' + id)]])}

<section class="phead">
  <div class="wrap phead__in phead__in--art">
    <div>
      <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
      <h1>${esc(s.h1 || s.name)}</h1>
      <p class="lede">${esc(s.tagline)}</p>
      <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
    </div>
    <div class="phead__art">${ART[id]}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <p class="intro">${esc(lead)}</p>
      ${rest.length ? `<details class="more-text"><summary>${esc(L.ui.readMore)}</summary>${rest.map((p) => `<p>${esc(p)}</p>`).join('')}</details>` : ''}

      <h2 class="h-block">${esc(L.ui.scope)}</h2>
      <ul class="checklist">${s.scope.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

      <h2 class="h-block">${esc(L.ui.approach)}</h2>
      <ol class="mini">${s.approach.map((x, n) => `<li><b>${n + 1}</b><span>${esc(x)}</span></li>`).join('')}</ol>

      <p class="pricenote">${esc(L.priceNote)}</p>

      <h2 class="h-block">${esc(L.ui.faqTitle)}</h2>
      ${faqBlock(s.faq)}
    </div>

    <div class="aside">
      ${leadForm(ctx, { compact: true })}
      <div class="panel">
        <h3>${esc(L.ui.relatedServices)}</h3>
        <ul class="chips chips--col">
          ${related.map((r) => `<li><a href="${u('svc:' + r)}">${esc(L.services[r].name)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>

${ctaBand(ctx)}`;

  return layout(ctx, {
    key: 'svc:' + id, title: s.title, description: s.description, body,
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: s.name, description: s.description,
        serviceType: s.name,
        url: abs(u('svc:' + id)),
        provider: { '@id': site.origin + '/#business' },
        areaServed: REGION_IDS.map((r) => ({ '@type': 'Place', name: L.regions.items[r].name })),
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: abs(u('contact')),
          servicePhone: { '@type': 'ContactPoint', telephone: site.phoneHref, availableLanguage: ['tr', 'en', 'ru'] },
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog', name: L.ui.scope,
          itemListElement: s.scope.map((x) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x } })),
        },
      },
      faqSchema(s.faq),
      breadcrumbSchema([[L.ui.home, u('home')], [s.name, u('svc:' + id)]]),
      orgSchema(ctx),
    ],
  });
}

/* ---------------------------------------------------------------- bolgeler */
export function regionsIndex(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const R = L.regions;

  const body = `
${crumbs(ctx, [[R.h1, u('regions')]])}
<section class="phead"><div class="wrap phead__in">
  <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
  <h1>${esc(R.h1)}</h1>
  <p class="lede">${esc(R.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap">
    <div class="grid grid--4">
      ${REGION_IDS.map((id) => {
        const r = R.items[id];
        return `<a class="regioncard" href="${u('region:' + id)}">
          <span class="regioncard__pin">${I.pin}</span>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.intro)}</p>
          <span class="regioncard__svc">${r.services.map((sid) => `<i title="${esc(L.services[sid].name)}">${SVC_ICON[sid]}</i>`).join('')}</span>
        </a>`;
      }).join('\n')}
    </div>
  </div>
</section>
${ctaBand(ctx, { form: true })}`;

  return layout(ctx, {
    key: 'regions', title: R.title, description: R.description, body,
    jsonld: [
      breadcrumbSchema([[L.ui.home, u('home')], [R.h1, u('regions')]]),
      {
        '@context': 'https://schema.org', '@type': 'ItemList',
        itemListElement: REGION_IDS.map((id, i) => ({
          '@type': 'ListItem', position: i + 1,
          name: R.items[id].name, url: abs(u('region:' + id)),
        })),
      },
      orgSchema(ctx),
    ],
  });
}

export function regionPage(ctx, id) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const r = L.regions.items[id];
  const shortList = r.services.map((sid) => L.services[sid].short).join(', ');
  const nameList = r.services.map((sid) => L.services[sid].name).join(', ');
  const title = `${r.name} — ${shortList} | ${site.brand}`;
  const desc = clip(`${r.name}: ${nameList}. ${r.intro}`, 155);

  const body = `
${crumbs(ctx, [[L.regions.h1, u('regions')], [r.name, u('region:' + id)]])}
<section class="phead"><div class="wrap phead__in">
  <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
  <h1>${esc(r.name)}</h1>
  <p class="lede">${esc(r.intro)}</p>
  <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2 class="h-block h-block--first">${esc(L.regions.inRegion)}</h2>
      <div class="grid grid--3">
        ${r.services.map((sid) => serviceCard(ctx, sid)).join('\n')}
      </div>

      <h2 class="h-block">${esc(L.regions.regionNotes)}</h2>
      <ol class="mini mini--col">${r.notes.map((n, i) => `<li><b>${i + 1}</b><span>${esc(n)}</span></li>`).join('')}</ol>

      <p class="pricenote">${esc(L.priceNote)}</p>

      <p><a class="btn btn--ghost" href="${u('regions')}">${esc(L.ui.allRegions)} ${I.arrow}</a></p>
    </div>
    <div class="aside">
      ${leadForm(ctx, { compact: true })}
    </div>
  </div>
</section>
${ctaBand(ctx)}`;

  return layout(ctx, {
    key: 'region:' + id, title, description: desc, body,
    jsonld: [
      breadcrumbSchema([[L.ui.home, u('home')], [L.regions.h1, u('regions')], [r.name, u('region:' + id)]]),
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: `${L.ui.services} — ${r.name}`,
        provider: { '@id': site.origin + '/#business' },
        areaServed: { '@type': 'Place', name: r.name, address: { '@type': 'PostalAddress', addressLocality: r.name, addressRegion: 'Muğla', addressCountry: 'TR' } },
        url: abs(u('region:' + id)),
      },
      orgSchema(ctx),
    ],
  });
}

/* ---------------------------------------------------------------- nasil calisiyoruz */
export function howPage(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const P = L.pages.how;

  const body = `
${crumbs(ctx, [[P.h1, u('how')]])}
<section class="phead"><div class="wrap phead__in">
  <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap">
    <h2 class="sr">${esc(P.stepsTitle)}</h2>
    <ol class="flow flow--detail" style="--cols:4">
      ${P.steps.map((s, i) => `<li><span class="flow__icon">${STEP_ICON[i]}<b>${i + 1}</b></span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(P.guaranteeTitle)}</h2></div>
    <div class="grid grid--2">
      ${P.guarantees.map((g, i) => `<div class="cell gcell"><span class="tile__icon">${GUARANTEE_ICON[i]}</span><div><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p></div></div>`).join('\n')}
    </div>
    <p class="pricenote">${esc(L.priceNote)}</p>
  </div>
</section>
${ctaBand(ctx, { form: true })}`;

  return layout(ctx, {
    key: 'how', title: P.title, description: P.description, body,
    jsonld: [
      breadcrumbSchema([[L.ui.home, u('home')], [P.h1, u('how')]]),
      {
        '@context': 'https://schema.org', '@type': 'HowTo',
        name: P.h1, description: P.lede,
        step: P.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.t, text: s.d })),
      },
      orgSchema(ctx),
    ],
  });
}

/* ---------------------------------------------------------------- hakkimizda */
export function aboutPage(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const P = L.pages.about;

  const body = `
${crumbs(ctx, [[P.h1, u('about')]])}
<section class="phead"><div class="wrap phead__in">
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    <div class="grid grid--2 grid--flat">
      ${P.body.map((b, i) => `<div class="cell abox"><span class="abox__n">${String(i + 1).padStart(2, '0')}</span><h2>${esc(b.t)}</h2>${b.p.map((x) => `<p>${esc(x)}</p>`).join('')}</div>`).join('\n')}
    </div>
    <div class="aside">
      <div class="panel">
        <h3>${esc(P.factsTitle)}</h3>
        <dl class="deflist">
          ${P.facts.map((f) => `<dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd>`).join('')}
        </dl>
      </div>
      <div class="panel">
        <h3>${esc(L.ui.footerContact)}</h3>
        <ul class="contactlist">
          <li>${I.phone}<div><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></div></li>
          <li>${I.mail}<div><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
          <li>${I.pin}<div>${esc(site.address.locality)}, ${esc(site.address.region)}</div></li>
        </ul>
        <a class="btn btn--primary btn--block" style="margin-top:1rem" href="${u('contact')}">${esc(L.ui.ctaQuote)}</a>
      </div>
    </div>
  </div>
</section>
${ctaBand(ctx, { form: true })}`;

  return layout(ctx, {
    key: 'about', title: P.title, description: P.description, body,
    jsonld: [breadcrumbSchema([[L.ui.home, u('home')], [P.h1, u('about')]]), orgSchema(ctx)],
  });
}

/* ---------------------------------------------------------------- sss */
export function faqPage(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const P = L.pages.faq;

  const body = `
${crumbs(ctx, [[P.h1, u('faq')]])}
<section class="phead"><div class="wrap phead__in">
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
  <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    <div>${faqBlock(P.items)}</div>
    <div class="aside">${leadForm(ctx, { compact: true })}</div>
  </div>
</section>
${ctaBand(ctx)}`;

  return layout(ctx, {
    key: 'faq', title: P.title, description: P.description, body,
    jsonld: [faqSchema(P.items), breadcrumbSchema([[L.ui.home, u('home')], [P.h1, u('faq')]]), orgSchema(ctx)],
  });
}

/* ---------------------------------------------------------------- iletisim */
export function contactPage(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const P = L.pages.contact;

  const body = `
${crumbs(ctx, [[P.h1, u('contact')]])}
<section class="phead"><div class="wrap phead__in">
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    ${leadForm(ctx)}
    <div class="aside">
      <div class="panel">
        <h3>${esc(P.infoTitle)}</h3>
        <ul class="contactlist">
          <li>${I.phone}<div><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a><span>${esc(L.ui.ctaCall)}</span></div></li>
          <li>${I.wa}<div><a href="${waLink(waMessage(locale))}" rel="noopener">WhatsApp</a><span>${esc(site.phoneDisplay)}</span></div></li>
          <li>${I.mail}<div><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
          <li>${I.clock}<div>${esc(L.ui.footerWeekdays)} ${esc(site.hours.weekdays)}<span>${esc(L.ui.footerSaturday)} ${esc(site.hours.saturday)}</span></div></li>
        </ul>
      </div>
      <div class="panel">
        <h3>${esc(P.areaTitle)}</h3>
        <ul class="chips chips--pin">
          ${REGION_IDS.map((id) => `<li><a href="${u('region:' + id)}">${I.pin}${esc(L.regions.items[id].name)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`;

  return layout(ctx, {
    key: 'contact', title: P.title, description: P.description, body,
    jsonld: [
      breadcrumbSchema([[L.ui.home, u('home')], [P.h1, u('contact')]]),
      {
        '@context': 'https://schema.org', '@type': 'ContactPage',
        name: P.h1, url: abs(u('contact')),
        mainEntity: {
          '@type': 'ContactPoint', telephone: site.phoneHref, email: site.email,
          contactType: 'customer service', availableLanguage: ['tr', 'en', 'ru'],
          areaServed: ['Fethiye', 'Seydikemer'],
        },
      },
      orgSchema(ctx),
    ],
  });
}

/* ---------------------------------------------------------------- rehber (blog) */
const fmtDate = (L, iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${L.blog.months[m - 1]} ${y}`;
};

const postCard = (ctx, p) => {
  const { L, locale, routes } = ctx;
  return `<a class="postcard" href="${routes[locale]['post:' + p.slug]}">
    <span class="postcard__cat">${esc(p.category)}${p.draft ? ` · ${esc(L.blog.draft)}` : ''}</span>
    <h2>${esc(p.title)}</h2>
    <p>${esc(p.description)}</p>
    <span class="postcard__meta">${esc(fmtDate(L, p.date))} · ${p.minutes} ${esc(L.blog.readMin)}</span>
  </a>`;
};

export function blogIndex(ctx) {
  const { L, locale, routes, posts } = ctx;
  const u = (k) => routes[locale][k];
  const B = L.blog;
  const body = `
${crumbs(ctx, [[B.nav, u('blog')]])}
<section class="phead"><div class="wrap phead__in">
  <p class="place">${I.pin}<span>${esc(L.ui.serviceArea)}</span></p>
  <h1>${esc(B.h1)}</h1>
  <p class="lede">${esc(B.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap">
    <div class="postgrid">
      ${posts.map((p) => postCard(ctx, p)).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand(ctx, { form: true })}`;

  return layout(ctx, {
    key: 'blog', title: B.title, description: B.description, body,
    head: `<link rel="alternate" type="application/rss+xml" title="${esc(B.title)}" href="${u('blog')}feed.xml">`,
    jsonld: [
      breadcrumbSchema([[L.ui.home, u('home')], [B.nav, u('blog')]]),
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: B.h1, url: abs(u('blog')), inLanguage: locale },
      orgSchema(ctx),
    ],
  });
}

export function blogPost(ctx, post) {
  const { L, locale, routes, posts } = ctx;
  const u = (k) => routes[locale][k];
  const B = L.blog;
  const url = abs(u('post:' + post.slug));
  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.service === post.service),
    ...posts.filter((p) => p.slug !== post.slug && p.service !== post.service),
  ].slice(0, 3);

  const body = `
${crumbs(ctx, [[B.nav, u('blog')], [post.title, u('post:' + post.slug)]])}
<section class="phead">
  <div class="wrap phead__in narrow-head">
    <p class="mono-cat">${esc(post.category)}${post.draft ? ` · ${esc(B.draft)}` : ''}</p>
    <h1>${esc(post.title)}</h1>
    <p class="lede">${esc(post.description)}</p>
    <p class="phead__meta">${esc(fmtDate(L, post.date))} · ${post.minutes} ${esc(B.readMin)}${post.updated !== post.date ? ` · ${esc(L.ui.updated)}: ${esc(fmtDate(L, post.updated))}` : ''}</p>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <article class="prose post">
      ${post.toc.length >= 3 ? `<nav class="toc" aria-label="${esc(B.toc)}"><p class="toc__t">${esc(B.toc)}</p><ol>${post.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}
      ${post.html}
      <p class="pricenote">${esc(B.disclaimer)}</p>
      <p><a class="btn btn--primary" href="${u('svc:' + post.service)}">${esc(L.services[post.service].name)} ${I.arrow}</a></p>
    </article>
    <div class="aside">
      ${leadForm(ctx, { compact: true })}
      ${related.length ? `<div class="panel"><h3>${esc(B.more)}</h3><ul class="postlist">${related.map((p) => `<li><a href="${u('post:' + p.slug)}"><span>${esc(p.title)}</span></a></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>
</section>
${ctaBand(ctx)}`;

  return layout(ctx, {
    key: 'post:' + post.slug, title: `${post.title} | ${site.brand}`, description: post.description, body,
    head: `<link rel="alternate" type="application/rss+xml" title="${esc(B.title)}" href="${u('blog')}feed.xml">`,
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: post.title, description: post.description, inLanguage: locale,
        datePublished: post.date, dateModified: post.updated,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: [abs('/assets/og-image.png')],
        author: { '@id': site.origin + '/#business' }, publisher: { '@id': site.origin + '/#business' },
      },
      breadcrumbSchema([[L.ui.home, u('home')], [B.nav, u('blog')], [post.title, u('post:' + post.slug)]]),
      orgSchema(ctx),
    ],
  });
}

/* ---------------------------------------------------------------- gizlilik */
export function privacyPage(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const P = L.pages.privacy;

  const body = `
${crumbs(ctx, [[P.h1, u('privacy')]])}
<section class="phead"><div class="wrap phead__in narrow">
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
  <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
</div></section>

<section class="sec">
  <div class="wrap narrow prose">
    ${P.sections.map((s) => `<h2 style="margin:2rem 0 .9rem">${esc(s.t)}</h2>${s.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('\n')}
    <h2 style="margin:2rem 0 .9rem">${esc(L.ui.footerContact)}</h2>
    <p><a href="mailto:${site.email}">${esc(site.email)}</a> · <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></p>
  </div>
</section>`;

  return layout(ctx, { key: 'privacy', title: P.title, description: P.description, body, noindex: false });
}

/* ---------------------------------------------------------------- 404 */
export function notFound(ctx) {
  const { L, locale, routes } = ctx;
  const body = `<section class="wrap center">
  <h1>${esc(L.ui.notFoundTitle)}</h1>
  <p class="lede">${esc(L.ui.notFoundText)}</p>
  <a class="btn btn--primary" href="${routes[locale].home}">${esc(L.ui.notFoundCta)}</a>
</section>`;
  return layout(ctx, { key: 'home', title: `404 — ${L.ui.notFoundTitle} | ${site.brand}`, description: L.ui.notFoundText, body, noindex: true });
}
