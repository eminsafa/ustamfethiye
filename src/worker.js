/* -----------------------------------------------------------------------------
   Ustam Fethiye — Cloudflare Worker
   · Statik sayfalari ASSETS binding uzerinden servis eder
   · / adresini varsayilan dile yonlendirir
   · /api/lead ile teklif taleplerini alir (D1 + e-posta, hepsi opsiyonel)
   · E-posta: Cloudflare Email Routing (send_email binding) ya da Resend
----------------------------------------------------------------------------- */

import { EmailMessage } from 'cloudflare:email';

const DEFAULT_LOCALE = 'tr';
const LOCALES = ['tr', 'en', 'ru'];

const SERVICES = ['painting', 'pool', 'garden', 'plumbing', 'homecare', 'other'];
const REGIONS = ['merkez', 'calis', 'oludeniz', 'ovacik-hisaronu', 'kayakoy', 'gocek', 'uzumlu', 'seydikemer', 'other'];

// Bildirimlerde kodlar yerine okunur adlar gosterilir.
const SERVICE_LABEL = {
  painting: 'Boya ve Tadilat', pool: 'Havuz Bakımı', garden: 'Bahçe Bakımı',
  plumbing: 'Su Tesisatı', homecare: 'Ev Bakım Planı', other: 'Diğer',
};
const REGION_LABEL = {
  merkez: 'Fethiye Merkez', calis: 'Çalış', oludeniz: 'Ölüdeniz', 'ovacik-hisaronu': 'Ovacık / Hisarönü',
  kayakoy: 'Kayaköy', gocek: 'Göcek', uzumlu: 'Üzümlü', seydikemer: 'Seydikemer', other: 'Diğer',
};

const TIMING_LABEL = { urgent: 'Acil (birkaç gün içinde)', week: 'Bu hafta', month: 'Bu ay içinde', later: 'Acelesi yok, fiyat öğreniyor' };
const PROPERTY_LABEL = { apartment: 'Daire', villa: 'Villa', house: 'Müstakil ev', business: 'İşyeri' };

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
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    /* --- API -------------------------------------------------------------- */
    if (pathname === '/api/lead') {
      if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      return handleLead(request, env, ctx);
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

/** UTF-8 metni base64'e cevirir. */
const b64 = (str) => {
  let bin = '';
  for (const byte of new TextEncoder().encode(str)) bin += String.fromCharCode(byte);
  return btoa(bin);
};

/** Ikili veriyi base64'e cevirir (parcali; buyuk dosyalarda yigin tasmasi olmaz). */
const bytesToB64 = (u8) => {
  let bin = '';
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(bin);
};

// Ek dosya sinirlari (e-posta toplam 25 MB ile sinirli; base64 ~%33 buyutur)
const FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'application/pdf'];
const MAX_FILES = 5;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/**
 * Cloudflare Email Routing uzerinden talep e-postasi gonderir.
 * Gerekenler: send_email binding (LEAD_EMAIL), LEAD_EMAIL_FROM (alan adindan bir adres),
 * LEAD_EMAIL_TO (Email Routing'de dogrulanmis hedef adres).
 * Alan degerleri clean() ile kontrol karakterlerinden arindirildigi icin baslik enjeksiyonu olmaz.
 */
async function sendLeadMail(env, lead, summary, files = []) {
  const from = env.LEAD_EMAIL_FROM;
  const to = env.LEAD_EMAIL_TO;
  const subject = `${lead.timing === 'urgent' ? 'ACİL — ' : ''}Yeni talep: ${lead.name} — ${SERVICE_LABEL[lead.service] || 'genel'}`;
  const wrap = (str) => str.replace(/.{76}/g, '$&\r\n');
  const headers = [
    `From: Ustam Fethiye <${from}>`,
    `To: ${to}`,
    ...(EMAIL_RE.test(lead.email) ? [`Reply-To: ${lead.email}`] : []),
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Message-ID: <${crypto.randomUUID()}@${from.split('@')[1]}>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
  ];
  const textPart = ['Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', '', wrap(b64(summary))];

  let raw;
  if (!files.length) {
    raw = [...headers, ...textPart].join('\r\n');
  } else {
    const boundary = `=_ustam_${crypto.randomUUID()}`;
    const parts = [`--${boundary}`, ...textPart];
    for (const f of files) {
      parts.push(
        `--${boundary}`,
        `Content-Type: ${f.type}; name="${f.name}"`,
        `Content-Disposition: attachment; filename="${f.name}"`,
        'Content-Transfer-Encoding: base64',
        '',
        wrap(bytesToB64(new Uint8Array(await f.arrayBuffer())))
      );
    }
    parts.push(`--${boundary}--`, '');
    raw = [...headers, `Content-Type: multipart/mixed; boundary="${boundary}"`, '', ...parts].join('\r\n');
  }
  await env.LEAD_EMAIL.send(new EmailMessage(from, to, raw));
}

/* ---------------------------------------------------------------- lead akisi */
async function handleLead(request, env, ctx) {
  // Govde limiti: 5 dosya x 4 MB + form alanlari
  if (Number(request.headers.get('content-length')) > 12 * 1024 * 1024) return json({ error: 'too_large' }, 413);

  let data = {};
  let files = [];
  try {
    if ((request.headers.get('content-type') || '').includes('multipart/form-data')) {
      for (const [key, value] of (await request.formData()).entries()) {
        if (typeof value === 'string') data[key] = value;
        else if (key === 'files' && value.size > 0) files.push(value);
      }
    } else {
      data = await request.json();
    }
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Dosya dogrulama: sayi, tur, boyut. Gecersizse talep reddedilir (sessizce dusurulmez).
  const total = files.reduce((n, f) => n + f.size, 0);
  if (files.length > MAX_FILES || total > MAX_TOTAL_BYTES ||
      files.some((f) => !FILE_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES)) {
    return json({ error: 'bad_files' }, 400);
  }
  files = files.map((f, i) => {
    // Turkce harfleri sadelestir (ç→c, ı→i ...), gerisini guvenli karaktere cevir.
    const ascii = String(f.name || '').replace(/ı/g, 'i').replace(/İ/g, 'I').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const safe = ascii.replace(/[^\w.\-]+/g, '_').replace(/^_+|_+$/g, '').slice(-80) || `dosya-${i + 1}`;
    return new File([f], safe, { type: f.type });
  });

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
    address: clean(data.address, 300),
    service_other: data.service === 'other' ? clean(data.service_other, 200) : '',
    files: files.length,
    timing: Object.hasOwn(TIMING_LABEL, data.timing) ? data.timing : '',
    property_type: Object.hasOwn(PROPERTY_LABEL, data.property) ? data.property : '',
    source_page: clean(request.headers.get('referer'), 300),
    referrer: clean(data.ref, 300),
    country: request.headers.get('cf-ipcountry') || '',
  };

  if (!lead.name || !lead.phone) return json({ error: 'missing_fields' }, 400);
  if (lead.service === 'other' && !lead.service_other) return json({ error: 'service_detail_required' }, 400);
  if (lead.region === 'other' && !lead.address) return json({ error: 'address_required' }, 400);
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
        `INSERT INTO leads (locale,name,phone,email,service,region,message,source_page,referrer,country,address,service_other,files,timing,property_type)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        lead.locale, lead.name, lead.phone, lead.email, lead.service,
        lead.region, lead.message, lead.source_page, lead.referrer, lead.country,
        lead.address, lead.service_other, lead.files, lead.timing, lead.property_type
      ).run();
    } catch (e) {
      console.error('D1 insert failed', e);
    }
  }

  const summary =
    'Yeni talep — Ustam Fethiye\n' +
    `Ad: ${lead.name}\nTelefon: ${lead.phone}\n` +
    (lead.email ? `E-posta: ${lead.email}\n` : '') +
    `Hizmet: ${SERVICE_LABEL[lead.service] || '-'}${lead.service_other ? ` — ${lead.service_other}` : ''}\n` +
    `Konum: ${REGION_LABEL[lead.region] || '-'}\n` +
    (lead.address ? `Adres: ${lead.address}\n` : '') +
    (lead.property_type ? `Mülk: ${PROPERTY_LABEL[lead.property_type]}\n` : '') +
    (lead.timing ? `Zamanlama: ${TIMING_LABEL[lead.timing]}\n` : '') +
    (lead.files ? `Ekler: ${lead.files} dosya (bu e-postaya ekli)\n` : '') +
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

  if (env.LEAD_EMAIL && env.LEAD_EMAIL_FROM && env.LEAD_EMAIL_TO) {
    notify.push(sendLeadMail(env, lead, summary, files).catch((e) => console.error('email', e)));
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
          subject: `Yeni talep: ${lead.name} — ${SERVICE_LABEL[lead.service] || 'genel'}`,
          text: summary,
        }),
      }).catch((e) => console.error('resend', e))
    );
  }

  // Bildirimler arka planda gider; musteri e-posta gonderimini beklemez.
  if (notify.length) ctx.waitUntil(Promise.allSettled(notify));
  else console.log('LEAD', JSON.stringify(lead));

  return json({ ok: true });
}
