import { site, SERVICE_ORDER, REGION_IDS, waLink } from '../content/site.js';
import { ART, logoMark } from './visuals.js';

/* ---------------------------------------------------------------- yardimcilar */
export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = (s = '') => esc(s);
const j = (arr) => arr.filter(Boolean).join('\n');

/* ---------------------------------------------------------------- ikonlar */
const I = {
  check: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.5 5.5L8 14l-4.5-4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrow: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.2 3h-2A1.2 1.2 0 003 4.2C3 11.3 8.7 17 15.8 17A1.2 1.2 0 0017 15.8v-2a1 1 0 00-.8-1l-2.6-.5a1 1 0 00-1 .4l-.8 1.1a11 11 0 01-4-4l1.1-.8a1 1 0 00.4-1L8.8 4a1 1 0 00-1-.9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  wa: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 17l1-3.4A7 7 0 1110 17a7 7 0 01-3.4-.9L3 17z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.4 7.6c0 2.6 2.4 5 5 5 .6 0 1-.4 1-.9v-.6l-1.6-.7-.7.8a5 5 0 01-2.2-2.2l.8-.7-.7-1.6h-.6c-.5 0-.9.4-.9 1z" fill="currentColor"/></svg>`,
  mail: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M3 5.5l7 5 7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  pin: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17s5.2-4.6 5.2-8.2A5.2 5.2 0 0010 3.6a5.2 5.2 0 00-5.2 5.2C4.8 12.4 10 17 10 17z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10" cy="8.6" r="1.9" stroke="currentColor" stroke-width="1.5"/></svg>`,
  clock: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4.2l2.6 1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  painting: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="5" width="18" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M22 8.5h4.5V15a1.5 1.5 0 01-1.5 1.5h-8a1.5 1.5 0 00-1.5 1.5v2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="13" y="20.5" width="5" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>`,
  pool: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 22c2.2 0 2.2 2 4.3 2s2.2-2 4.3-2 2.2 2 4.4 2 2.2-2 4.3-2 2.2 2 4.4 2 2.2-2 4.3-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 27c2.2 0 2.2 2 4.3 2s2.2-2 4.3-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><path d="M10 21V7a3 3 0 016 0v14M10 12h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M22 21V7a3 3 0 00-3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".55"/></svg>`,
  garden: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 28V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 17c-5 0-7-2.6-7-6.5C13.4 10.5 16 12.6 16 17z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 14c0-4.4 2.6-7 7-7 0 4.4-2.6 7-7 7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 28h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  plumbing: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4s6.5 7.4 6.5 12.2A6.5 6.5 0 0116 23a6.5 6.5 0 01-6.5-6.8C9.5 11.4 16 4 16 4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 16.6a3 3 0 003 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11 28h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  homecare: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 14.5L16 5l11 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 13v13h17V13" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12.5 20.5l2.3 2.3 4.7-4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const SVC_ICON = { painting: I.painting, pool: I.pool, garden: I.garden, plumbing: I.plumbing, homecare: I.homecare };

const LOGO = logoMark({ cls: 'brand__mark' });

/* ---------------------------------------------------------------- layout */
export function layout(ctx, { title, description, body, jsonld = [], key, noindex = false }) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const abs = (p) => site.origin + p;

  const alts = site.locales
    .filter((lc) => routes[lc] && routes[lc][key])
    .map((lc) => `<link rel="alternate" hreflang="${lc}" href="${abs(routes[lc][key])}">`)
    .concat([`<link rel="alternate" hreflang="x-default" href="${abs(routes[site.defaultLocale][key] || '/tr/')}">`]);

  const ogAlt = site.locales.filter((lc) => lc !== locale)
    .map((lc) => `<meta property="og:locale:alternate" content="${lc === 'tr' ? 'tr_TR' : lc === 'ru' ? 'ru_RU' : 'en_GB'}">`);

  const navLink = (k, label) => `<a href="${u(k)}"${k === key ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  const onService = String(key).startsWith('svc:');
  const nav = [
    `<div class="nav__group">
        <a class="nav__parent" href="${u('home')}#services"${onService ? ' aria-current="page"' : ''}>${esc(L.ui.services)}</a>
        <div class="nav__menu">${SERVICE_ORDER.map((id) => navLink('svc:' + id, L.services[id].name)).join('')}</div>
      </div>`,
    navLink('regions', L.ui.regions),
    navLink('how', L.pages.how.h1),
    navLink('contact', L.pages.contact.h1),
  ];

  const waText = locale === 'tr' ? 'Merhaba, keşif için bilgi almak istiyorum.'
    : locale === 'ru' ? 'Здравствуйте, хочу записаться на осмотр.'
    : 'Hello, I would like to arrange a site visit.';

  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
<link rel="canonical" href="${abs(u(key) || '/')}">
${alts.join('\n')}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.brand)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${abs(u(key) || '/')}">
<meta property="og:locale" content="${L.ogLocale}">
${ogAlt.join('\n')}
<meta property="og:image" content="${abs('/assets/og-image.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${abs('/assets/og-image.png')}">
<meta name="theme-color" content="#0E5349">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
${jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
${site.cfAnalyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${site.cfAnalyticsToken}"}'></script>` : ''}
</head>
<body>
<a class="skip" href="#main">${esc(L.ui.skip)}</a>

<header class="topbar" id="topbar">
  <div class="wrap topbar__in">
    <a class="brand" href="${u('home')}">${LOGO}<span>Ustam <em>Fethiye</em></span></a>
    <button class="navtoggle" type="button" aria-expanded="false" aria-controls="nav" id="navtoggle">${esc(L.ui.menu)}</button>
    <nav class="nav" id="nav" aria-label="${attr(L.ui.services)}">
      ${nav.join('\n      ')}
    </nav>
    <div class="topbar__cta">
      <div class="lang" role="group" aria-label="${attr(L.ui.langLabel)}">
        ${site.locales.map((lc) => {
          const href = routes[lc] && routes[lc][key] ? routes[lc][key] : `/${lc}/`;
          const short = lc === 'tr' ? 'TR' : lc === 'en' ? 'EN' : 'RU';
          return `<a href="${href}" hreflang="${lc}"${lc === locale ? ' aria-current="true"' : ''}>${short}</a>`;
        }).join('')}
      </div>
      <a class="btn btn--primary btn--sm" href="${u('contact')}">${esc(L.ui.ctaQuoteShort)}</a>
    </div>
  </div>
</header>

<main id="main">
${body}
</main>

${footer(ctx)}

<div class="mobilebar">
  <a class="btn btn--primary" href="${u('contact')}">${esc(L.ui.ctaQuoteShort)}</a>
  <a class="btn btn--wa" href="${waLink(waText)}" rel="noopener">${I.wa}${esc(L.ui.ctaWhatsapp)}</a>
</div>

<script>
(function(){
  var t=document.getElementById('navtoggle'),b=document.getElementById('topbar');
  if(t&&b)t.addEventListener('click',function(){
    var o=b.getAttribute('data-open')==='true';
    b.setAttribute('data-open',String(!o));t.setAttribute('aria-expanded',String(!o));
  });
  var f=document.getElementById('leadform');
  if(f){
    var q=function(n){return f.querySelector('[name='+n+']')};
    var svc=q('service'),svo=q('service_other'),reg=q('region'),adr=q('address'),fil=q('files');
    var lst=f.querySelector('.filelist'),msg=f.querySelector('.formmsg');
    var MAX=5,LIM=4*1024*1024;
    var syncSvc=function(){
      var on=!!svc&&svc.value==='other';
      svo.parentNode.hidden=!on;svo.required=on;if(!on)svo.value='';
    };
    var syncReg=function(){
      if(!adr)return;
      var on=!!reg&&reg.value==='other',lb=adr.parentNode.querySelector('label');
      lb.textContent=on?lb.dataset.other:lb.dataset.label;adr.required=on;
    };
    var shrink=function(file){
      return new Promise(function(done){
        if(!/^image\\/(jpeg|png|webp)$/.test(file.type))return done(file);
        var img=new Image(),url=URL.createObjectURL(file);
        img.onload=function(){
          var k=Math.min(1,1600/Math.max(img.width,img.height)),c=document.createElement('canvas'),x;
          c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
          x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
          c.toBlob(function(b){
            URL.revokeObjectURL(url);
            done(b&&b.size<file.size?new File([b],file.name.replace(/\\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'}):file);
          },'image/jpeg',0.82);
        };
        img.onerror=function(){URL.revokeObjectURL(url);done(file)};
        img.src=url;
      });
    };
    if(svc&&svo){svc.addEventListener('change',syncSvc);syncSvc();}
    if(reg)reg.addEventListener('change',syncReg);
    if(fil)fil.addEventListener('change',function(){
      lst.textContent='';
      Array.prototype.forEach.call(fil.files,function(x){var li=document.createElement('li');li.textContent=x.name;lst.appendChild(li);});
    });
    f.addEventListener('submit',async function(e){
      e.preventDefault();
      if(!f.reportValidity())return;
      var btn=f.querySelector('button[type=submit]'),old=btn.textContent;
      btn.disabled=true;btn.textContent=f.dataset.sending;msg.removeAttribute('data-state');
      try{
        var fd=new FormData(f);
        fd.delete('files');
        if(fil&&fil.files.length){
          if(fil.files.length>MAX)throw 'files';
          for(var i=0;i<fil.files.length;i++){
            var s=await shrink(fil.files[i]);
            if(s.size>LIM)throw 'files';
            fd.append('files',s,s.name);
          }
        }
        var r=await fetch('/api/lead',{method:'POST',body:fd});
        if(!r.ok)throw 0;
        msg.textContent=f.dataset.ok;msg.setAttribute('data-state','ok');f.reset();
        if(lst)lst.textContent='';if(svo)syncSvc();syncReg();
      }catch(err){
        msg.textContent=err==='files'?f.dataset.filesErr:f.dataset.err;msg.setAttribute('data-state','err');
      }finally{btn.disabled=false;btn.textContent=old;}
    });
  }
})();
</script>
</body>
</html>`;
}

/* ---------------------------------------------------------------- alt bilgi */
function footer(ctx) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const R = L.regions.items;
  const social = Object.entries(site.profiles).filter(([, v]) => v);

  return `<footer class="foot">
  <div class="wrap foot__in">
    <div class="foot__brandcol">
      <span class="foot__brand">Ustam Fethiye</span>
      <p class="foot__about">${esc(L.ui.footerAbout)}</p>
      ${social.length ? `<ul style="display:flex;gap:1rem;margin-top:1rem">${social.map(([k, v]) => `<li><a href="${attr(v)}" rel="noopener">${esc(k[0].toUpperCase() + k.slice(1))}</a></li>`).join('')}</ul>` : ''}
    </div>
    <div>
      <h3>${esc(L.ui.services)}</h3>
      <ul>${SERVICE_ORDER.map((id) => `<li><a href="${u('svc:' + id)}">${esc(L.services[id].name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>${esc(L.ui.regions)}</h3>
      <ul>${REGION_IDS.slice(0, 6).map((id) => `<li><a href="${u('region:' + id)}">${esc(R[id].name)}</a></li>`).join('')}
      <li><a href="${u('regions')}">${esc(L.ui.allRegions)}</a></li></ul>
    </div>
    <div>
      <h3>${esc(L.ui.footerContact)}</h3>
      <ul>
        <li><a href="tel:${attr(site.phoneHref)}">${esc(site.phoneDisplay)}</a></li>
        <li><a href="mailto:${attr(site.email)}">${esc(site.email)}</a></li>
        <li>${esc(site.address.locality)}, ${esc(site.address.region)}</li>
      </ul>
      <h3 style="margin-top:1.4rem">${esc(L.ui.footerHours)}</h3>
      <ul>
        <li>${esc(L.ui.footerWeekdays)}: ${esc(site.hours.weekdays)}</li>
        <li>${esc(L.ui.footerSaturday)}: ${esc(site.hours.saturday)}</li>
        <li>${esc(L.ui.footerSunday)}: ${esc(L.ui.footerClosed)}</li>
      </ul>
    </div>
  </div>
  <div class="wrap">
    <div class="foot__bottom">
      <span>© ${new Date().getFullYear()} ${esc(site.brand)}. ${esc(L.ui.rights)}</span>
      <span><a href="${u('about')}">${esc(L.pages.about.h1)}</a> · <a href="${u('privacy')}">${esc(L.pages.privacy.h1)}</a> · <a href="${u('faq')}">${esc(L.pages.faq.h1)}</a></span>
    </div>
  </div>
</footer>`;
}

/* ---------------------------------------------------------------- parcalar */
export function leadForm(ctx, { heading, intro, compact = false, mini = false } = {}) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  return `<form class="formcard" id="leadform" novalidate
  data-sending="${attr(L.ui.fSending)}" data-ok="${attr(L.ui.fOk)}" data-err="${attr(L.ui.fErr)}" data-files-err="${attr(L.ui.fFilesErr)}">
  <h2>${esc(heading || (mini ? L.ui.callTitle : L.ui.formTitle))}</h2>
  <p class="formcard__intro">${esc(intro || (mini ? L.ui.callIntro : L.ui.formIntro))}</p>
  <input type="hidden" name="locale" value="${locale}">
  <div class="hp" aria-hidden="true"><label>Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
  <div class="field2">
    <div class="field">
      <label for="f-name">${esc(L.ui.fName)} <span class="req">*</span></label>
      <input id="f-name" name="name" type="text" required autocomplete="name">
    </div>
    <div class="field">
      <label for="f-phone">${esc(L.ui.fPhone)} <span class="req">*</span></label>
      <input id="f-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel">
    </div>
  </div>
  <div${mini ? '' : ' class="field2"'}>
    <div class="field">
      <label for="f-service">${esc(L.ui.fService)}</label>
      <select id="f-service" name="service">
        <option value="">${esc(L.ui.fChoose)}</option>
        ${SERVICE_ORDER.map((id) => `<option value="${id}">${esc(L.services[id].name)}</option>`).join('')}
        <option value="other">${esc(L.ui.fOther)}</option>
      </select>
    </div>
    ${mini ? '' : `    <div class="field">
      <label for="f-region">${esc(L.ui.fRegion)}</label>
      <select id="f-region" name="region">
        <option value="">${esc(L.ui.fChoose)}</option>
        ${REGION_IDS.map((id) => `<option value="${id}">${esc(L.regions.items[id].name)}</option>`).join('')}
        <option value="other">${esc(L.ui.fOther)}</option>
      </select>
    </div>`}
  </div>
  <div class="field" hidden>
    <label for="f-service-other">${esc(L.ui.fServiceOther)} <span class="req">*</span></label>
    <input id="f-service-other" name="service_other" type="text" maxlength="200">
  </div>
  ${mini ? '' : `<div class="field">
    <label for="f-address" data-label="${attr(L.ui.fAddress)}" data-other="${attr(L.ui.fAddressOther + ' *')}">${esc(L.ui.fAddress)}</label>
    <input id="f-address" name="address" type="text" maxlength="300" autocomplete="street-address">
  </div>`}
  ${compact || mini ? '' : `<div class="field">
    <label for="f-email">${esc(L.ui.fEmail)}</label>
    <input id="f-email" name="email" type="email" autocomplete="email">
  </div>`}
  ${mini ? '' : `  <div class="field">
    <label for="f-message">${esc(L.ui.fMessage)}</label>
    <textarea id="f-message" name="message" rows="3"></textarea>
  </div>
  <div class="field field--files">
    <label for="f-files">${esc(L.ui.fFiles)}</label>
    <input id="f-files" name="files" type="file" multiple accept="image/*,application/pdf,.pdf">
    <p class="filehint">${esc(L.ui.fFilesHint)}</p>
    <ul class="filelist" aria-live="polite"></ul>
  </div>`}
  <label class="consent">
    <input type="checkbox" name="consent" required value="1">
    <span>${esc(L.ui.fConsent)} <a href="${u('privacy')}">${esc(L.ui.fConsentLink)}</a></span>
  </label>
  ${site.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${attr(site.turnstileSiteKey)}" data-size="flexible"></div>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>` : ''}
  <button class="btn btn--primary btn--block" type="submit">${esc(mini ? L.ui.callSubmit : L.ui.fSubmit)}</button>
  ${mini ? '' : `<p class="formhint">${esc(L.ui.fPhotoHint)}</p>`}
  <p class="formmsg" role="status" aria-live="polite"></p>
</form>`;
}

export function crumbs(ctx, trail) {
  const { L, locale, routes } = ctx;
  const items = [[L.ui.home, routes[locale].home], ...trail];
  return `<nav class="crumbs" aria-label="${attr(L.ui.breadcrumb)}"><div class="wrap"><ol>
${items.map(([label, href], i) => `<li>${href && i < items.length - 1 ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`}</li>`).join('')}
</ol></div></nav>`;
}

export function faqBlock(items, title) {
  return `${title ? `<h2 style="margin-bottom:1.2rem">${esc(title)}</h2>` : ''}
<div class="faq">
${items.map((f) => `<details><summary>${esc(f.q)}</summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('\n')}
</div>`;
}

export function ctaBand(ctx, { form = false } = {}) {
  const { L, locale, routes } = ctx;
  const u = (k) => routes[locale][k];
  const waText = locale === 'tr' ? 'Merhaba, keşif için bilgi almak istiyorum.'
    : locale === 'ru' ? 'Здравствуйте, хочу записаться на осмотр.'
    : 'Hello, I would like to arrange a site visit.';
  const buttons = `<div class="btn-row">
      ${form ? '' : `<a class="btn btn--light" href="${u('contact')}">${esc(L.ui.ctaQuote)}</a>`}
      <a class="btn ${form ? 'btn--light' : 'btn--outline-light'}" href="${waLink(waText)}" rel="noopener">${I.wa}${esc(L.ui.ctaWhatsapp)}</a>
      <a class="btn btn--outline-light" href="tel:${attr(site.phoneHref)}">${I.phone}${esc(site.phoneDisplay)}</a>
    </div>`;
  const text = `<h2>${esc(L.home.ctaTitle)}</h2>
      <p>${esc(L.home.ctaLede)}</p>`;
  if (!form) {
    return `<section class="ctaband">
  <div class="wrap ctaband__in">
    <div>
      ${text}
    </div>
    ${buttons}
  </div>
</section>`;
  }
  return `<section class="ctaband ctaband--form">
  <div class="wrap ctaband__in">
    <div>
      ${text}
      ${buttons}
    </div>
    ${leadForm(ctx, { mini: true })}
  </div>
</section>`;
}

export function serviceCard(ctx, id, { wide = false, art = true } = {}) {
  const { L, locale, routes } = ctx;
  const s = L.services[id];
  return `<a class="svc${wide ? ' svc--wide' : ''}${art ? ' svc--art' : ''}" href="${routes[locale]['svc:' + id]}">
  ${art ? `<span class="svc__art">${ART[id]}</span>` : `<span class="svc__icon">${SVC_ICON[id]}</span>`}
  <span class="svc__body">
    ${wide ? `<span class="tagpill">${esc(L.ui.ctaPlan)}</span>` : ''}
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.tagline)}</p>
    <span class="svc__go">${esc(L.ui.ctaMore)} ${I.arrow}</span>
  </span>
</a>`;
}

export { I as icons, SVC_ICON };
