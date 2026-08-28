// verify_translate.mjs — in-process engine check for universal-translator
// Copy into apps/universal-translator/ and run: node ./verify_translate.mjs
// (Windows ESM needs relative ./ specifier; absolute C:/... fails.)
import { translateDetailed, translateToMany, stats } from './translate.mjs';

let fail = 0;
const log = (...a) => console.log(...a);
async function check(name, fn) {
  try { const r = await fn(); log(`✓ ${name}: ${r}`); }
  catch (e) { fail++; log(`✗ ${name}: ${e.message}`); }
}
await check('en→zh', async () => { const r = await translateDetailed('Hello, world', 'en', 'zh'); return `"${r.text}" (${r.engine})`; });
await check('en→zh-TW', async () => { const r = await translateDetailed('Good morning', 'en', 'zh-TW'); return `"${r.text}" (${r.engine})`; });
await check('multi en→[zh,ja,es,fr]', async () => { const r = await translateToMany('Thank you', 'en', ['zh', 'ja', 'es', 'fr']); return JSON.stringify(r.translations); });
await check('passthrough (from===to)', async () => { const r = await translateDetailed('hi', 'en', 'en'); return r.engine; });
log(`\nstats: ${JSON.stringify(stats)}`);
log(`RESULT ${fail === 0 ? 'ALL PASS' : fail + ' FAILED'}`);
process.exit(fail ? 1 : 0);
