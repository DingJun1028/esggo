// Reusable verification for the quality-boost round (§14).
// Copy into apps/universal-translator/ and run: node ./verify_quality.mjs
// Use RELATIVE ./ specifier — absolute C:/ paths break ESM on Windows.
import { translateDetailed, translateToMany } from './translate.mjs';

let pass = 0, fail = 0;
const ok = (name, cond) => { (cond ? pass++ : fail++); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`); };

// 1) basic translation + engine tag
const r1 = await translateDetailed('The meeting starts now', 'en', 'zh-TW');
ok('en->zh-TW returns text', typeof r1.text === 'string' && r1.text.length > 0);
ok('engine tagged', !!r1.engine);

// 2) multi-target parallel
const r2 = await translateToMany('Hello world', 'en', ['zh-TW', 'ja', 'es', 'fr']);
ok('multi-target has 4 langs', Object.keys(r2.translations).length === 4);

// 3) cache hit on repeat
const r3 = await translateDetailed('The meeting starts now', 'en', 'zh-TW');
ok('cache hit second call', r3.cached === true);

// 4) postProcess sanity (no stray asterisk / bracket garbage)
const r4 = await translateDetailed('This is a *test* [note]', 'en', 'zh-TW');
ok('postProcess strips * and []', !r4.text.includes('*') && !r4.text.includes('['));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
