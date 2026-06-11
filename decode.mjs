import fs from 'fs';
import iconv from 'iconv-lite';

const buffer = fs.readFileSync('scratch_wiki.md');
const decoded = iconv.decode(buffer, 'big5');
fs.writeFileSync('WIKI.md', decoded, 'utf8');
console.log('Decoded scratch_wiki.md to WIKI.md');
