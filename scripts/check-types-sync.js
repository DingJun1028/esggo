import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), '..', 'esggo', 'shared', 'types.ts');
const DEST = path.resolve(process.cwd(), 'types', 'generated', 'esggo-shared.d.ts');

if (!fs.existsSync(SRC)) {
  console.error(`SRC missing: ${SRC}`);
  process.exit(1);
}
if (!fs.existsSync(DEST)) {
  console.error(`DEST missing: ${DEST}`);
  process.exit(1);
}

const a = fs.readFileSync(SRC, 'utf-8').replace(/\r\n/g, '\n').trim();
const b = fs.readFileSync(DEST, 'utf-8').replace(/\r\n/g, '\n').trim();

const normalize = (text) =>
  text
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').trim())
    .filter((line) => {
      if (!line) return false;
      if (line.startsWith('/*') || line.endsWith('*/')) return false;
      if (line.startsWith('*')) return false;
      return true;
    })
    .join('\n')
    .replace(/from ['"][^'"]+['"]/g, 'from "..."');

const na = normalize(a);
const nb = normalize(b);

if (na === nb) {
  console.log('TYPES_IN_SYNC');
  process.exit(0);
}

console.error('TYPES_OUT_OF_SYNC');
const aLines = na.split('\n');
const bLines = nb.split('\n');
let shown = 0;
for (let i = 0; i < Math.max(aLines.length, bLines.length) && shown < 20; i++) {
  const av = (aLines[i] ?? '').trim();
  const bv = (bLines[i] ?? '').trim();
  if (av !== bv) {
    if (av) console.error('- ' + av.slice(0, 120));
    if (bv) console.error('+ ' + bv.slice(0, 120));
    shown++;
  }
}
process.exit(1);
