// Blog yazilarini dogrular. Hata varsa cikis kodu 1 (otomatik yayin bu kapidan gecer).
import { loadPosts } from '../src/lib/blog.js';
const { posts, issues } = await loadPosts();
console.log(`${posts.length} yazı geçerli.`);
if (issues.length) { console.error('\nSORUNLAR:\n' + issues.map((x) => '  - ' + x).join('\n')); process.exit(1); }
