import fs from 'fs';

const files = [
    'src/omni/core/OmniChing.ts',
    'src/omni/core/OmniClue.ts',
    'src/omni/core/OmniOrb.ts',
    'src/adk/agents/OmniMasterAgent.ts',
    'src/config/antigravity-routes-utf8.tsx',
    'src/pages/OmniSensePage.tsx',
    'src/scripts/verify_eternal_convergence.ts',
];

const results = [];

for (const f of files) {
    const buf = fs.readFileSync(f);
    const hasBOM16 = buf[0] === 0xFF && buf[1] === 0xFE;
    const isUTF16 = hasBOM16 || (buf.length > 4 && buf[1] === 0 && buf[3] === 0);

    let txt;
    if (isUTF16) {
        txt = buf.toString('utf16le');
        if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
    } else {
        txt = buf.toString('utf-8');
    }

    const lines = txt.split(/\r?\n/);
    const info = {
        file: f,
        encoding: isUTF16 ? 'UTF-16LE' : 'UTF-8',
        bom: hasBOM16,
        size: buf.length,
        lines: lines.length,
        corruptedLines: [],
        problematicContent: [],
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('\uFFFD')) {
            info.corruptedLines.push(i + 1);
        }
        // Check for Chinese characters that may cause TS errors
        if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(line)) {
            // Check if they're in a string
            const inString = /['"`].*[\u4e00-\u9fff].*['"`]/.test(line) || /\/\/.*[\u4e00-\u9fff]/.test(line) || /\/\*.*[\u4e00-\u9fff]/.test(line);
            if (!inString) {
                info.problematicContent.push({ line: i + 1, content: line.substring(0, 120) });
            }
        }
    }

    results.push(info);
}

fs.writeFileSync('encoding_diag.json', JSON.stringify(results, null, 2), 'utf-8');
console.log('Diagnostic written to encoding_diag.json');
for (const r of results) {
    console.log(`\n${r.file}: ${r.encoding} | ${r.lines} lines | Corrupted: ${r.corruptedLines.length} | Problematic: ${r.problematicContent.length}`);
}
