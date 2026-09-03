/* -----------------------------------------------------------------------------
   Ustam Fethiye — Cloudflare Worker
   · Statik sayfalari ASSETS binding uzerinden servis eder
   · / adresini varsayilan dile yonlendirir
   · /api/lead ile teklif taleplerini alir (D1 + Telegram + e-posta, hepsi opsiyonel)
----------------------------------------------------------------------------- */

const DEFAULT_LOCALE = 'tr';
const LOCALES = ['tr', 'en', 'ru'];

const SERVICES = ['painting', 'pool', 'garden', 'plumbing', 'homecare', 'other'];
const REGIONS = ['merkez', 'calis', 'oludeniz', 'ovacik-hisaronu', 'kayakoy', 'gocek', 'uzumlu', 'seydikemer', 'other'];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Kontrol karakterlerini temizler ve uzunlugu sinirlar. */
const clean = (v, max = 500) =>
  typeof v === 'string'
    ? v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max)
    : '';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    /* --- API -------------------------------------------------------------- */
    if (pathname === '/api/lead') {
      if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      return handleLead(request, env);
    }
    if (pathname === '/api/health') {
      return json({ ok: true, ts: new Date().toISOString() });
    }

    /* --- kok adres -> varsayilan dil --------------------------------------- */
    if (pathname === '/' || pathname === '') {
      return Response.redirect(new URL(`/${DEFAULT_LOCALE}/`, url).toString(), 301);
    }

    /* --- /tr gibi eksik bolu isaretini duzelt ------------------------------ */
    const parts = pathname.split('/');
    if (parts.length === 2 && LOCALES.includes(parts[1])) {
      return Response.redirect(new URL(`/${parts[1]}/`, url).toString(), 301);
    }

    /* --- statik varliklar --------------------------------------------------- */
    const res = await env.ASSETS.fetch(request);

    if (res.status === 200 && !pathname.startsWith('/assets/')) {
      const h = new Headers(res.headers);
      h.set('x-content-type-options', 'nosniff');
      h.set('referrer-policy', 'strict-origin-when-cross-origin');
      h.set('permissions-policy', 'geolocation=(), microphone=(), camera=()');
      h.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};

/* ---------------------------------------------------------------- lead akisi */
async function handleLead(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Bal kupu alani — botlar doldurur, gercek kullanicilar gormez.
  if (clean(data.company)) return json({ ok: true });

  const lead = {
    locale: LOCALES.includes(data.locale) ? data.locale : DEFAULT_LOCALE,
    name: clean(data.name, 120),
    phone: clean(data.phone, 40),
    email: clean(data.email, 160),
    service: SERVICES.includes(data.service) ? data.service : '',
    region: REGIONS.includes(data.region) ? data.region : '',
    message: clean(data.message, 2000),
    source_page: clean(request.headers.get('referer'), 300),
    referrer: clean(data.ref, 300),
    country: request.headers.get('cf-ipcountry') || '',
  };

  if (!lead.name || !lead.phone) return json({ error: 'missing_fields' }, 400);
  if (!data.consent) return json({ error: 'consent_required' }, 400);

  // Turnstile — secret tanimliysa dogrula, degilse atla.
  if (env.TURNSTILE_SECRET) {
    const token = clean(data['cf-turnstile-response'], 2048);
    if (!token) return json({ error: 'captcha_required' }, 400);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('cf-connecting-ip'),
      }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!verify.success) return json({ error: 'captcha_failed' }, 400);
  }

  // D1 — binding tanimliysa kaydet.
  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO leads (locale,name,phone,email,service,region,message,source_page,referrer,country)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        lead.locale, lead.name, lead.phone, lead.email, lead.service,
        lead.region, lead.message, lead.source_page, lead.referrer, lead.country
      ).run();
    } catch (e) {
      console.error('D1 insert failed', e);
    }
  }

  const summary =
    'Yeni talep — Ustam Fethiye\n' +
    `Ad: ${lead.name}\nTelefon: ${lead.phone}\n` +
    (lead.email ? `E-posta: ${lead.email}\n` : '') +
    `Hizmet: ${lead.service || '-'}\nKonum: ${lead.region || '-'}\n` +
    `Dil: ${lead.locale}${lead.country ? ` | Ulke: ${lead.country}` : ''}\n` +
    (lead.message ? `\nMesaj:\n${lead.message}\n` : '') +
    (lead.source_page ? `\nSayfa: ${lead.source_page}` : '');

  const notify = [];

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    notify.push(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: summary, disable_web_page_preview: true }),
      }).catch((e) => console.error('telegram', e))
    );
  }

  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO && env.LEAD_EMAIL_FROM) {
    notify.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: env.LEAD_EMAIL_FROM,
          to: [env.LEAD_EMAIL_TO],
          reply_to: lead.email || undefined,
          subject: `Yeni talep: ${lead.name} — ${lead.service || 'genel'}`,
          text: summary,
        }),
      }).catch((e) => console.error('resend', e))
    );
  }

  if (notify.length) await Promise.allSettled(notify);
  else console.log('LEAD', JSON.stringify(lead));

  return json({ ok: true });
}
