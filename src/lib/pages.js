import { site, SERVICE_ORDER, REGION_IDS, waLink } from '../content/site.js';
import { esc, layout, leadForm, crumbs, faqBlock, ctaBand, trustBar, serviceCard, icons as I, SVC_ICON } from './render.js';

const abs = (p) => site.origin + p;

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
export function home(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const waText = locale === 'tr' ? 'Merhaba, keşif için bilgi almak istiyorum.'
    : locale === 'ru' ? 'Здравствуйте, хочу записаться на осмотр.'
    : 'Hello, I would like to arrange a site visit.';

  const body = `
<section class="hero">
  <div class="wrap hero__in">
    <div>
      <p class="eyebrow">${esc(L.ui.serviceArea)}</p>
      <h1>${esc(L.home.h1)}</h1>
      <p class="lede">${esc(L.home.lede)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${u('contact')}">${esc(L.ui.ctaQuote)}</a>
        <a class="btn btn--wa" href="${waLink(waText)}" rel="noopener">${I.wa}${esc(L.ui.ctaWhatsapp)}</a>
        <a class="btn btn--ghost" href="tel:${site.phoneHref}">${I.phone}${esc(site.phoneDisplay)}</a>
      </div>
      <ul class="hero__points">
        ${L.ui.trust.map((t) => `<li>${I.check}<span>${esc(t)}</span></li>`).join('')}
      </ul>
    </div>
    ${leadForm(ctx, { compact: true })}
  </div>
</section>

${trustBar(L)}

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">${esc(L.ui.services)}</p>
      <h2>${esc(L.home.servicesTitle)}</h2>
      <p class="lede">${esc(L.home.servicesLede)}</p>
    </div>
    <div class="grid grid--4">
      ${['painting', 'pool', 'garden', 'plumbing'].map((id) => serviceCard(ctx, id)).join('\n')}
      ${serviceCard(ctx, 'homecare', true)}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">${esc(L.home.promiseTitle)}</p>
      <h2>${esc(L.home.promiseTitle)}</h2>
      <p class="lede">${esc(L.home.promiseLede)}</p>
    </div>
    <div class="grid grid--3">
      ${L.home.promises.map((p, i) => `<div class="cell promise">
        <span class="promise__n">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>`).join('\n')}
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">${esc(L.pages.how.h1)}</p>
      <h2>${esc(L.home.howTitle)}</h2>
      <p class="lede">${esc(L.home.howLede)}</p>
    </div>
    <ol class="steps">
      ${L.pages.how.steps.map((s) => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('\n')}
    </ol>
    <p style="margin-top:1.6rem"><a class="btn btn--ghost" href="${u('how')}">${esc(L.pages.how.h1)} ${I.arrow}</a></p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">${esc(L.ui.regions)}</p>
      <h2>${esc(L.home.regionsTitle)}</h2>
      <p class="lede">${esc(L.home.regionsLede)}</p>
    </div>
    <ul class="chips">
      ${REGION_IDS.map((id) => `<li><a href="${u('region:' + id)}">${esc(L.regions.items[id].name)}</a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L.home.faqTitle)}</h2></div>
    ${faqBlock(L.pages.faq.items.slice(0, 6))}
    <p style="margin-top:1.6rem"><a class="btn btn--ghost" href="${u('faq')}">${esc(L.pages.faq.h1)} ${I.arrow}</a></p>
  </div>
</section>

${ctaBand(ctx)}`;

  return layout(ctx, {
    key: 'home', title: L.home.title, description: L.home.description, body,
    jsonld: [
      orgSchema(ctx),
      { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand, url: abs(u('home')), inLanguage: locale },
      faqSchema(L.pages.faq.items.slice(0, 6)),
    ],
  });
}

/* ---------------------------------------------------------------- hizmet */
export function servicePage(ctx, id) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const s = L.services[id];
  const related = SERVICE_ORDER.filter((x) => x !== id).slice(0, 3);

  const body = `
${crumbs(ctx, [[L.ui.services, u('home')], [s.name, u('svc:' + id)]])}

<section class="phead">
  <div class="wrap phead__in">
    <p class="eyebrow">${esc(L.ui.serviceArea)}</p>
    <h1>${esc(s.name)}</h1>
    <p class="lede">${esc(s.tagline)}</p>
    <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <div class="summary">
        <h2>${esc(L.ui.inShort)}</h2>
        <ul>${s.summary.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>

      ${s.intro.map((p) => `<p>${esc(p)}</p>`).join('\n')}

      <h2 style="margin:2.4rem 0 1.1rem">${esc(L.ui.scope)}</h2>
      <ul class="checklist">${s.scope.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

      <h2 style="margin:2.4rem 0 1.1rem">${esc(L.ui.approach)}</h2>
      <ul class="arrowlist">${s.approach.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

      <p class="pricenote">${esc(L.priceNote)}</p>

      <h2 style="margin:2.6rem 0 1.1rem">${esc(L.ui.faqTitle)}</h2>
      ${faqBlock(s.faq)}
    </div>

    <aside class="aside">
      ${leadForm(ctx, { compact: true })}
      <div class="panel">
        <h3>${esc(L.ui.relatedServices)}</h3>
        <ul class="chips" style="flex-direction:column;align-items:stretch">
          ${related.map((r) => `<li><a href="${u('svc:' + r)}">${esc(L.services[r].name)}</a></li>`).join('')}
        </ul>
      </div>
      <div class="panel">
        <h3>${esc(L.ui.allRegions)}</h3>
        <ul class="chips">
          ${REGION_IDS.slice(0, 8).map((r) => `<li><a href="${u('region:' + r)}">${esc(L.regions.items[r].name)}</a></li>`).join('')}
        </ul>
      </div>
    </aside>
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
  <p class="eyebrow">${esc(L.ui.serviceArea)}</p>
  <h1>${esc(R.h1)}</h1>
  <p class="lede">${esc(R.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap">
    <div class="grid grid--2">
      ${REGION_IDS.map((id) => {
        const r = R.items[id];
        return `<div class="cell">
          <h3 style="margin-bottom:.5rem"><a href="${u('region:' + id)}" style="text-decoration:none">${esc(r.name)}</a></h3>
          <p style="font-family:var(--f-ui);font-size:.92rem;color:var(--ink-2);line-height:1.55">${esc(r.intro)}</p>
          <p style="margin:0"><a href="${u('region:' + id)}" style="font-family:var(--f-ui);font-size:.86rem;font-weight:600">${esc(L.ui.ctaMore)} →</a></p>
        </div>`;
      }).join('\n')}
    </div>
  </div>
</section>
${ctaBand(ctx)}`;

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
  const title = `${r.name} — ${L.ui.services} | ${site.brand}`;
  const desc = r.intro.slice(0, 155);

  const body = `
${crumbs(ctx, [[L.regions.h1, u('regions')], [r.name, u('region:' + id)]])}
<section class="phead"><div class="wrap phead__in">
  <p class="eyebrow">${esc(L.ui.serviceArea)}</p>
  <h1>${esc(r.name)}</h1>
  <p class="lede">${esc(r.intro)}</p>
  <p class="phead__meta">${esc(L.ui.updated)}: ${site.updated}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2 style="margin-bottom:1.1rem">${esc(L.regions.regionNotes)}</h2>
      <ul class="arrowlist">${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>

      <h2 style="margin:2.4rem 0 1.1rem">${esc(L.regions.inRegion)}</h2>
      <div class="grid grid--3" style="margin-bottom:1.6rem">
        ${r.services.map((sid) => serviceCard(ctx, sid)).join('\n')}
      </div>

      <p class="pricenote">${esc(L.priceNote)}</p>

      <p><a href="${u('regions')}" style="font-family:var(--f-ui);font-weight:600">${esc(L.ui.allRegions)} →</a></p>
    </div>
    <aside class="aside">
      ${leadForm(ctx, { compact: true })}
    </aside>
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
  <p class="eyebrow">${esc(L.ui.serviceArea)}</p>
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap">
    <ol class="steps" style="grid-template-columns:repeat(2,1fr)">
      ${P.steps.map((s) => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(P.guaranteeTitle)}</h2></div>
    <div class="grid grid--2">
      ${P.guarantees.map((g) => `<div class="cell promise"><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p></div>`).join('\n')}
    </div>
    <p class="pricenote">${esc(L.priceNote)}</p>
  </div>
</section>
${ctaBand(ctx)}`;

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
    <div class="prose">
      ${P.body.map((b) => `<h2 style="margin:0 0 1rem">${esc(b.t)}</h2>${b.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('\n<hr style="margin:2rem 0">\n')}
    </div>
    <aside class="aside">
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
    </aside>
  </div>
</section>
${ctaBand(ctx)}`;

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
    <aside class="aside">${leadForm(ctx, { compact: true })}</aside>
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
  const waText = locale === 'tr' ? 'Merhaba, keşif için bilgi almak istiyorum.'
    : locale === 'ru' ? 'Здравствуйте, хочу записаться на осмотр.'
    : 'Hello, I would like to arrange a site visit.';

  const body = `
${crumbs(ctx, [[P.h1, u('contact')]])}
<section class="phead"><div class="wrap phead__in">
  <h1>${esc(P.h1)}</h1>
  <p class="lede">${esc(P.lede)}</p>
</div></section>

<section class="sec">
  <div class="wrap split">
    ${leadForm(ctx)}
    <aside class="aside">
      <div class="panel">
        <h3>${esc(P.infoTitle)}</h3>
        <ul class="contactlist">
          <li>${I.phone}<div><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a><span>${esc(L.ui.ctaCall)}</span></div></li>
          <li>${I.wa}<div><a href="${waLink(waText)}" rel="noopener">WhatsApp</a><span>${esc(site.phoneDisplay)}</span></div></li>
          <li>${I.mail}<div><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
          <li>${I.clock}<div>${esc(L.ui.footerWeekdays)} ${esc(site.hours.weekdays)}<span>${esc(L.ui.footerSaturday)} ${esc(site.hours.saturday)}</span></div></li>
        </ul>
      </div>
      <div class="panel">
        <h3>${esc(P.areaTitle)}</h3>
        <p style="font-family:var(--f-ui);font-size:.92rem;color:var(--ink-2);line-height:1.55;margin:0 0 .9rem">${esc(P.areaText)}</p>
        <ul class="chips">
          ${REGION_IDS.map((id) => `<li><a href="${u('region:' + id)}">${esc(L.regions.items[id].name)}</a></li>`).join('')}
        </ul>
      </div>
      <div class="panel">
        <h3>${esc(L.ui.services)}</h3>
        <ul class="chips" style="flex-direction:column;align-items:stretch">
          ${SERVICE_ORDER.map((id) => `<li><a href="${u('svc:' + id)}">${esc(L.services[id].name)}</a></li>`).join('')}
        </ul>
      </div>
    </aside>
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
