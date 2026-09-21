/* -----------------------------------------------------------------------------
   Gorseller: hizmet cizimleri, hero sahnesi ve ikon seti.
   Hepsi satir ici SVG; renkler marka paletinden (styles.css ile ayni degerler).
----------------------------------------------------------------------------- */

const C = {
  deep: '#0E5349', mid: '#1E7A6C', mint: '#7FC9B4', soft: '#DCEAE5', pale: '#EEF4F1',
  water: '#8FD0C8', water2: '#BFE6E0', ochre: '#C58A12', sand: '#F7EFD9', sand2: '#F1D896',
  wood: '#8A5F06', line: '#DCE1D9', white: '#fff',
};

const svg = (vb, body) =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">${body}</svg>`;

/* ---------------------------------------------------------------- hizmet cizimleri (240x160) */
export const ART = {
  painting: svg('0 0 240 160', `
    <rect x="30" y="18" width="180" height="112" rx="4" fill="${C.white}"/>
    <rect x="30" y="18" width="98" height="112" rx="4" fill="${C.mint}"/>
    <rect x="112" y="18" width="16" height="112" fill="${C.mint}"/>
    <path d="M128 66c0 0 6 0 6 8s-2 14-2 14" stroke="${C.mint}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <rect x="20" y="130" width="200" height="8" rx="2" fill="${C.deep}" opacity=".16"/>
    <rect x="104" y="44" width="70" height="22" rx="7" fill="${C.deep}"/>
    <rect x="108" y="48" width="62" height="5" rx="2.5" fill="${C.mid}"/>
    <path d="M174 55h14v26h-42v14" stroke="${C.deep}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="139" y="95" width="14" height="34" rx="5" fill="${C.ochre}"/>
    <rect x="180" y="108" width="24" height="22" rx="3" fill="${C.ochre}"/>
    <path d="M183 108c0-9 18-9 18 0" stroke="${C.wood}" stroke-width="2.4" fill="none"/>
    <rect x="180" y="108" width="24" height="6" rx="2" fill="${C.sand2}"/>`),

  pool: svg('0 0 240 160', `
    <circle cx="192" cy="34" r="15" fill="${C.sand2}"/>
    <circle cx="192" cy="34" r="22" fill="${C.sand2}" opacity=".35"/>
    <rect x="0" y="118" width="240" height="42" fill="${C.sand}"/>
    <rect x="22" y="80" width="196" height="62" rx="12" fill="${C.water}"/>
    <rect x="30" y="88" width="180" height="46" rx="8" fill="${C.water2}"/>
    <path d="M42 104c6 0 6-5 12-5s6 5 12 5 6-5 12-5 6 5 12 5 6-5 12-5 6 5 12 5 6-5 12-5" stroke="${C.white}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".9"/>
    <path d="M60 122c6 0 6-5 12-5s6 5 12 5 6-5 12-5 6 5 12 5 6-5 12-5" stroke="${C.white}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".6"/>
    <path d="M52 100V60a8 8 0 0116 0v40M74 100V60a8 8 0 0116 0v40" stroke="${C.deep}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M52 76h16M74 76h16M52 90h16M74 90h16" stroke="${C.deep}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="176" cy="112" r="9" fill="${C.ochre}"/>
    <path d="M167 112h18" stroke="${C.white}" stroke-width="3"/>`),

  garden: svg('0 0 240 160', `
    <circle cx="200" cy="30" r="14" fill="${C.sand2}"/>
    <path d="M0 126c40-10 80-10 120-4s80 6 120-4v42H0z" fill="${C.mint}" opacity=".55"/>
    <rect x="0" y="134" width="240" height="26" fill="${C.mint}" opacity=".6"/>
    <path d="M114 138c0-22 2-44-4-56M126 138c0-22-2-40 4-52" stroke="${C.wood}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="120" cy="58" r="30" fill="${C.deep}"/>
    <circle cx="90" cy="76" r="21" fill="${C.deep}"/>
    <circle cx="152" cy="76" r="21" fill="${C.deep}"/>
    <circle cx="108" cy="50" r="12" fill="${C.mid}"/>
    <circle cx="140" cy="64" r="10" fill="${C.mid}"/>
    <circle cx="86" cy="72" r="8" fill="${C.mid}"/>
    <circle cx="128" cy="44" r="3.4" fill="${C.sand2}"/><circle cx="100" cy="66" r="3.4" fill="${C.sand2}"/><circle cx="150" cy="80" r="3.4" fill="${C.sand2}"/>
    <rect x="196" y="112" width="5" height="26" rx="2" fill="${C.deep}"/>
    <rect x="190" y="106" width="17" height="9" rx="3" fill="${C.deep}"/>
    <path d="M192 104c-8-18-22-22-34-14M201 102c10-16 22-16 30-6" stroke="${C.water}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="44" cy="136" r="5" fill="${C.ochre}"/><circle cx="60" cy="140" r="5" fill="${C.sand2}"/><circle cx="30" cy="142" r="4" fill="${C.sand2}"/>
    <path d="M44 141v8M60 145v6M30 146v5" stroke="${C.deep}" stroke-width="2.2" stroke-linecap="round"/>`),

  plumbing: svg('0 0 240 160', `
    <rect x="18" y="66" width="120" height="26" rx="4" fill="${C.deep}"/>
    <rect x="112" y="66" width="26" height="72" rx="4" fill="${C.deep}"/>
    <rect x="12" y="60" width="9" height="38" rx="3" fill="${C.mid}"/>
    <rect x="104" y="130" width="42" height="9" rx="3" fill="${C.mid}"/>
    <rect x="62" y="60" width="14" height="38" rx="3" fill="${C.mid}"/>
    <rect x="24" y="72" width="30" height="5" rx="2.5" fill="${C.mint}" opacity=".7"/>
    <path d="M176 26c0 0 24 27 24 44a24 24 0 01-48 0c0-17 24-44 24-44z" fill="${C.water}" stroke="${C.deep}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M166 72a10 10 0 0010 10" stroke="${C.white}" stroke-width="3.4" stroke-linecap="round" fill="none"/>
    <g transform="rotate(-38 188 128)">
      <rect x="150" y="122" width="84" height="12" rx="6" fill="${C.ochre}"/>
      <circle cx="150" cy="128" r="15" fill="${C.ochre}"/>
      <rect x="128" y="125" width="20" height="7" fill="${C.pale}"/>
    </g>`),

  cleaning: svg('0 0 240 160', `
    <rect x="0" y="130" width="240" height="30" fill="${C.sand}"/>
    <path d="M38 52l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="${C.sand2}"/>
    <path d="M198 30l3.5 8.5 8.5 3.5-8.5 3.5-3.5 8.5-3.5-8.5-8.5-3.5 8.5-3.5z" fill="${C.ochre}"/>
    <path d="M214 96l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="${C.sand2}"/>
    <path d="M62 88h62l-8 44H70z" fill="${C.deep}"/>
    <rect x="58" y="80" width="70" height="10" rx="5" fill="${C.mid}"/>
    <path d="M68 82c0-32 50-32 50 0" stroke="${C.wood}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="78" cy="76" r="9" fill="${C.water2}" stroke="${C.water}" stroke-width="2"/>
    <circle cx="95" cy="68" r="12" fill="${C.water2}" stroke="${C.water}" stroke-width="2"/>
    <circle cx="112" cy="77" r="8" fill="${C.water2}" stroke="${C.water}" stroke-width="2"/>
    <path d="M188 22L170 116" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>
    <path d="M148 116h44l6 18h-56z" fill="${C.ochre}"/>
    <path d="M156 122v10M166 122v10M176 122v10M186 122v10" stroke="${C.sand2}" stroke-width="2.4" stroke-linecap="round"/>`),

  homecare: svg('0 0 240 160', `
    <rect x="0" y="130" width="240" height="30" fill="${C.mint}" opacity=".5"/>
    <path d="M44 76L120 22l76 54z" fill="${C.deep}"/>
    <rect x="62" y="72" width="116" height="64" fill="${C.white}"/>
    <rect x="106" y="96" width="28" height="40" rx="2" fill="${C.mint}"/>
    <rect x="72" y="88" width="24" height="22" rx="2" fill="${C.soft}"/>
    <rect x="144" y="88" width="24" height="22" rx="2" fill="${C.soft}"/>
    <path d="M84 88v22M72 99h24M156 88v22M144 99h24" stroke="${C.white}" stroke-width="2"/>
    <circle cx="192" cy="44" r="21" fill="${C.ochre}"/>
    <path d="M182 44.5l7 7 12-13" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <g transform="rotate(-8 40 112)">
      <rect x="18" y="92" width="46" height="40" rx="4" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <rect x="23" y="97" width="36" height="24" rx="2" fill="${C.soft}"/>
      <path d="M23 121l11-12 8 8 6-5 11 9z" fill="${C.mid}"/>
      <circle cx="49" cy="105" r="3.4" fill="${C.sand2}"/>
    </g>`),
};

/* ---------------------------------------------------------------- hero sahnesi (520x420) */
const inner = (s) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

export function heroArt(svcIcons) {
  const badge = (x, y, id) => `
    <g transform="translate(${x} ${y})">
      <circle r="35" fill="#000" opacity=".05" cy="4"/>
      <circle r="33" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <g transform="translate(-20 -20) scale(1.25)" fill="none" style="color:${C.deep}">${inner(svcIcons[id])}</g>
    </g>`;
  return svg('0 0 520 420', `
    <ellipse cx="260" cy="222" rx="236" ry="184" fill="${C.soft}"/>
    <circle cx="384" cy="82" r="30" fill="${C.sand2}"/>
    <circle cx="384" cy="82" r="44" fill="${C.sand2}" opacity=".3"/>
    <ellipse cx="260" cy="346" rx="226" ry="50" fill="#B9DCD1"/>

    <rect x="330" y="98" width="24" height="52" fill="${C.deep}"/>
    <polygon points="132,186 260,92 388,186" fill="${C.deep}"/>
    <rect x="152" y="178" width="216" height="150" fill="${C.white}" stroke="${C.deep}" stroke-width="3"/>
    <rect x="240" y="252" width="40" height="76" rx="3" fill="${C.mint}"/>
    <circle cx="271" cy="292" r="2.6" fill="${C.deep}"/>
    <rect x="172" y="212" width="46" height="42" rx="2" fill="${C.soft}" stroke="${C.deep}" stroke-width="2"/>
    <rect x="302" y="212" width="46" height="42" rx="2" fill="${C.soft}" stroke="${C.deep}" stroke-width="2"/>
    <path d="M195 212v42M172 233h46M325 212v42M302 233h46" stroke="${C.deep}" stroke-width="2"/>
    <circle cx="260" cy="150" r="9" fill="${C.sand}" stroke="${C.deep}" stroke-width="2"/>

    <rect x="188" y="334" width="144" height="40" rx="20" fill="${C.water}"/>
    <rect x="196" y="341" width="128" height="26" rx="13" fill="${C.water2}"/>
    <path d="M208 354c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4 5-4 10-4 5 4 10 4 5-4 10-4 5 4 10 4" stroke="${C.white}" stroke-width="2.4" stroke-linecap="round" fill="none"/>

    <rect x="86" y="284" width="11" height="52" rx="4" fill="${C.wood}"/>
    <circle cx="92" cy="262" r="32" fill="${C.deep}"/>
    <circle cx="68" cy="284" r="21" fill="${C.deep}"/>
    <circle cx="116" cy="284" r="21" fill="${C.deep}"/>
    <circle cx="80" cy="254" r="12" fill="${C.mid}"/><circle cx="106" cy="272" r="9" fill="${C.mid}"/>
    <circle cx="428" cy="314" r="22" fill="${C.mid}"/><circle cx="452" cy="324" r="16" fill="${C.deep}"/>
    <circle cx="420" cy="306" r="3.4" fill="${C.sand2}"/><circle cx="440" cy="318" r="3.4" fill="${C.sand2}"/>

    ${badge(64, 132, 'painting')}
    ${badge(456, 176, 'plumbing')}
    ${badge(46, 214, 'pool')}
    ${badge(474, 268, 'garden')}`);
}

/* ---------------------------------------------------------------- ikonlar (32x32, cizgi) */
const ic = (body) => `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICON = {
  person: ic(`<circle cx="16" cy="11" r="5"/><path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9"/>`),
  doc: ic(`<path d="M8 4h11l5 5v19H8z"/><path d="M19 4v5h5M12 15h8M12 19h8M12 23h5"/>`),
  ruler: ic(`<rect x="3" y="10" width="26" height="12" rx="2"/><path d="M8 10v5M13 10v7M18 10v5M23 10v7"/>`),
  shield: ic(`<path d="M16 4l10 4v8c0 6-4.2 10.4-10 12-5.8-1.6-10-6-10-12V8z"/><path d="M11.5 16l3.3 3.3 6-6.3"/>`),
  globe: ic(`<circle cx="16" cy="16" r="11"/><ellipse cx="16" cy="16" rx="5" ry="11"/><path d="M5 16h22"/>`),
  camera: ic(`<path d="M4 11a2 2 0 012-2h4l2-3h8l2 3h4a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><circle cx="16" cy="17" r="5"/>`),
  chat: ic(`<path d="M5 8a3 3 0 013-3h16a3 3 0 013 3v10a3 3 0 01-3 3H15l-6 5v-5H8a3 3 0 01-3-3z"/><path d="M11 13h10M11 17h6"/>`),
  phone: ic(`<path d="M9.4 4.5H6.2A1.9 1.9 0 004.4 6.4C4.4 18 14 27.6 25.6 27.6a1.9 1.9 0 001.9-1.8v-3.2a1.6 1.6 0 00-1.3-1.6l-4.1-.8a1.6 1.6 0 00-1.6.6l-1.3 1.8a17.6 17.6 0 01-6.4-6.4l1.8-1.3a1.6 1.6 0 00.6-1.6l-.8-4.1a1.6 1.6 0 00-1.6-1.3z"/>`),
  pen: ic(`<path d="M10 22l-1.5 5 5-1.5L26 13l-3.5-3.5z"/><path d="M20.5 11.5L24 15"/>`),
  calendar: ic(`<rect x="5" y="7" width="22" height="20" rx="2.5"/><path d="M5 13h22M11 4v5M21 4v5M11 18h3M18 18h3M11 22h3"/>`),
  tools: ic(`<path d="M20 5a6 6 0 00-5.6 8.2L5.6 22a2.4 2.4 0 003.4 3.4l8.8-8.8A6 6 0 0027 12l-4 4-3.5-.5-.5-3.5 4-4A6 6 0 0020 5z"/>`),
  key: ic(`<circle cx="10.5" cy="16" r="5.5"/><path d="M16 16h12M23 16v4.5M27.5 16v3"/>`),
  tag: ic(`<path d="M4 6a2 2 0 012-2h9.2a2 2 0 011.4.6L27.4 15.4a2 2 0 010 2.8l-9.2 9.2a2 2 0 01-2.8 0L4.6 16.6A2 2 0 014 15.2z"/><circle cx="10" cy="10" r="1.8"/>`),
  ok: ic(`<circle cx="16" cy="16" r="11"/><path d="M10.5 16.5l3.8 3.8 7.2-7.6"/>`),
};

// "Neden biz" sirasi: tek muhatap, yazili sozlesme, ucretsiz kesif, garanti, dil, foto rapor
export const WHY_ICON = [ICON.person, ICON.doc, ICON.ruler, ICON.shield, ICON.globe, ICON.camera];

// 8 adimli surec: talep, on gorusme, kesif, teklif, sozlesme, planlama, uygulama, teslim
export const STEP_ICON = [ICON.chat, ICON.phone, ICON.ruler, ICON.doc, ICON.pen, ICON.calendar, ICON.tools, ICON.key];

// Taahhutler: muhatap, sabit fiyat, garanti, duzen
export const GUARANTEE_ICON = [ICON.person, ICON.tag, ICON.shield, ICON.ok];

/* ---------------------------------------------------------------- logo isareti
   Dolu "U" (usta / sorumluluk) + cati (ev). 64x64; kucuk boyutta cati kalinlasir. */
export const logoMark = ({ bg = C.deep, fg = C.white, accent = C.mint, cls = '', xmlns = false, roof = 5.5, rx = 15 } = {}) =>
  `<svg${xmlns ? ' xmlns="http://www.w3.org/2000/svg"' : ''}${cls ? ` class="${cls}"` : ''} viewBox="0 0 64 64" fill="none"${xmlns ? '' : ' aria-hidden="true"'}>` +
  `<rect width="64" height="64" rx="${rx}" fill="${bg}"/>` +
  `<path d="M17 25v14c0 8.3 6.7 15 15 15s15-6.7 15-15V25h-9.5v14a5.5 5.5 0 01-11 0V25z" fill="${fg}"/>` +
  `<path d="M13 22.5L32 9l19 13.5" stroke="${accent}" stroke-width="${roof}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
