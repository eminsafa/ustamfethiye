// Onaylanan taslagi yayina hazirlar: draft satirini kaldirir, tarihi bugun yapar, dogrular.
// Kullanim: node scripts/publish-post.mjs <slug> [YYYY-AA-GG]
import { readFile, writeFile } from 'node:fs/promises';
import { loadPosts } from '../src/lib/blog.js';

const slug = process.argv[2];
if (!slug) { console.error('Kullanım: node scripts/publish-post.mjs <slug> [tarih]'); process.exit(1); }
const date = process.argv[3] || new Date().toISOString().slice(0, 10);
const file = `content/blog/${slug}.md`;
let raw;
try { raw = await readFile(file, 'utf8'); } catch { console.error('Bulunamadı: ' + file); process.exit(1); }
raw = raw.replace(/^draft:\s*true\s*\n/m, '').replace(/^date:.*$/m, `date: ${date}`);
await writeFile(file, raw);
const { posts, issues } = await loadPosts({ today: date });
if (issues.length) { console.error('Denetim başarısız:\n' + issues.map((x) => '  - ' + x).join('\n')); process.exit(1); }
console.log(`Yayına hazır: ${slug} (${date}). Yayında ${posts.length} yazı olacak.`);
