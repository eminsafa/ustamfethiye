/* -----------------------------------------------------------------------------
   Blog (Rehber) — Markdown yazilari, dogrulama ve HTML donusumu.
   Yazilar content/blog/<slug>.md dosyalaridir; bagimlilik yok.
   Denetimler (validatePost) otomatik yayin icin bir kapidir: gecersiz yazi
   yayina alinmaz.
----------------------------------------------------------------------------- */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { esc } from './render.js';

const DIR = 'content/blog';
const SERVICES = ['painting', 'pool', 'garden', 'plumbing', 'homecare'];

export const slugify = (t) => String(t).toLowerCase()
  .replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* ---------------------------------------------------------------- markdown */
const inline = (s) => esc(s)
  .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*\s][^*]*)\*(?!\*)/g, '$1<em>$2</em>');

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r/g, '').split('\n');
  const out = [], toc = [], seen = new Map();
  const uid = (t) => { const b = slugify(t) || 'bolum'; const n = seen.get(b) || 0; seen.set(b, n + 1); return n ? `${b}-${n + 1}` : b; };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,3})\s+(.+)$/))) {
      const level = m[1].length, text = m[2].trim(), id = uid(text);
      if (level === 2) toc.push({ id, text });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`); i++; continue;
    }
    if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${buf.map((b) => `<p>${inline(b)}</p>`).join('')}</blockquote>`); continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s+/, '')); i++; }
      out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`); continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++; }
      out.push(`<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`); continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|[-*]\s|\d+\.\s|>|---)/.test(lines[i])) { buf.push(lines[i].trim()); i++; }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

/* ---------------------------------------------------------------- dogrulama */
const FORBIDDEN = [
  [/müşterilerimiz|müşterimiz|yıllardır|yıllık deneyim|deneyimimiz|tecrübemiz|tecrübeli ekibimiz|projelerimiz|referanslarımız|yaptığımız (iş|proje)|yüzlerce|binlerce|onlarca/i, 'firma deneyimi veya müşteri geçmişi iması'],
  [/\d[\d.,]*\s*(TL|₺|€|\$|EUR|USD|GBP|lira|euro)\b/i, 'fiyat veya tutar'],
  [/%\s*100|yüzde yüz|kesin(likle)? (garanti|çözüm)|en iyi (firma|usta|fiyat|hizmet)/i, 'abartılı ya da kanıtlanamaz iddia'],
  [/gerçek müşteri|müşteri yorum|yorumlarımız|memnun kalan/i, 'yorum veya referans iması'],
];

export function validatePost(post) {
  const issues = [];
  const { meta, body, slug } = post;
  for (const k of ['title', 'description', 'date', 'category', 'service']) if (!meta[k]) issues.push(`eksik alan: ${k}`);
  if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) issues.push('date biçimi YYYY-AA-GG olmalı');
  if (meta.service && !SERVICES.includes(meta.service)) issues.push(`service geçersiz: ${meta.service}`);
  if (meta.title && meta.title.length > 70) issues.push(`başlık çok uzun (${meta.title.length}>70)`);
  if (meta.description && (meta.description.length < 110 || meta.description.length > 165)) issues.push(`açıklama 110–165 karakter olmalı (${meta.description.length})`);
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 450) issues.push(`yazı çok kısa (${words} kelime, en az 450)`);
  if (!/\]\(\/tr\/[^)]*\)/.test(body)) issues.push('en az bir site içi bağlantı gerekli, örn. [hizmet](/tr/havuz-bakimi/)');
  if ((body.match(/^## /gm) || []).length < 3) issues.push('en az 3 ara başlık (##) gerekli');
  const text = `${meta.title} ${meta.description} ${body}`;
  for (const [re, what] of FORBIDDEN) { const m = text.match(re); if (m) issues.push(`yasak ifade (${what}): "${m[0]}"`); }
  return issues.map((x) => `${slug}: ${x}`);
}

/* ---------------------------------------------------------------- yukleme */
export async function loadPosts({ today = new Date().toISOString().slice(0, 10) } = {}) {
  let files = [];
  try { files = (await readdir(DIR)).filter((f) => f.endsWith('.md') && !f.startsWith('_')); } catch { /* klasor yok */ }
  const posts = [], issues = [], titles = new Set();
  for (const f of files.sort()) {
    const raw = await readFile(join(DIR, f), 'utf8');
    const m = raw.replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const slug = f.replace(/\.md$/, '');
    if (!m) { issues.push(`${slug}: front matter (--- ... ---) yok`); continue; }
    const meta = {};
    m[1].split('\n').forEach((l) => { const k = l.match(/^(\w+):\s*(.*)$/); if (k) meta[k[1]] = k[2].replace(/^["']|["']$/g, '').trim(); });
    const isDraft = meta.draft === 'true';
    if (isDraft && !process.env.BLOG_PREVIEW) continue;   // taslaklar yayina alinmaz (yalnizca yerel onizleme)
    const post = { slug, meta, body: m[2].trim() };
    const problems = validatePost(post);
    if (titles.has(meta.title)) problems.push(`${slug}: başlık başka bir yazıyla aynı`);
    titles.add(meta.title);
    if (problems.length) { issues.push(...problems); continue; }
    if (meta.date > today) continue;   // ileri tarihli: tarihi gelene kadar yayinlanmaz
    const { html, toc } = renderMarkdown(post.body);
    posts.push({
      slug, draft: isDraft, title: meta.title, description: meta.description, date: meta.date,
      updated: meta.updated || meta.date, category: meta.category, service: meta.service,
      html, toc, minutes: Math.max(1, Math.round(post.body.split(/\s+/).length / 200)),
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  return { posts, issues };
}
