// -----------------------------------------------------------------------------
// Ustam Fethiye - genel yapilandirma
// YAYINA ALMADAN ONCE DOLDURULMASI ZORUNLU alanlar TODO ile isaretlidir.
// -----------------------------------------------------------------------------

export const site = {
  brand: 'Ustam Fethiye',
  legalName: 'Ustam Fethiye',            // TODO: resmi unvan (Ltd. Sti. vb.)
  origin: 'https://ustamfethiye.com',

  // TODO: gercek numara ile degistirin (her iki alan da guncellenmeli)
  phoneDisplay: '+90 555 000 00 00',
  phoneHref: '+905550000000',
  whatsapp: '905550000000',              // ulke kodu + numara, sadece rakam

  email: 'info@ustamfethiye.com',

  address: {
    street: '',                          // TODO: acik adres
    locality: 'Fethiye',
    region: 'Mugla',
    postalCode: '48300',
    country: 'TR',
  },

  geo: { lat: 36.6213, lng: 29.1164 },   // Fethiye merkez
  hours: { weekdays: '08:00-19:00', saturday: '09:00-17:00', sunday: null },

  // Kurulduktan sonra doldurun; bos birakilanlar sayfaya yazilmaz.
  profiles: {
    google: '',                          // Google Isletme Profili
    yandex: '',
    facebook: '',
    instagram: '',
  },

  // Opsiyonel entegrasyonlar - bos ise ilgili kod hic calismaz
  turnstileSiteKey: '',                  // Cloudflare Turnstile site key
  cfAnalyticsToken: '',                  // Cloudflare Web Analytics token

  locales: ['tr', 'en', 'ru'],
  defaultLocale: 'tr',
  updated: '2026-09-03',
};

// Hizmet kimlikleri - slug'lar dil dosyalarinda tanimlanir
export const SERVICE_IDS = ['homecare', 'pool', 'garden', 'painting', 'plumbing'];

// Ana sayfa ve menude one cikan sira (Ev Bakim Plani cati urun)
export const SERVICE_ORDER = ['painting', 'pool', 'garden', 'plumbing', 'homecare'];

export const REGION_IDS = [
  'merkez', 'calis', 'oludeniz', 'ovacik-hisaronu',
  'kayakoy', 'gocek', 'uzumlu', 'seydikemer',
];

export const waLink = (text) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
