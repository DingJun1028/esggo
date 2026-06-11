import fs from 'fs';

const files = [
    'app/environmental/page.tsx',
    'app/social/page.tsx',
    'app/governance/page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix malformed tailwind classes
    content = content.replace(/bg-white dark:bg-slate-900\/50\/10/g, 'bg-white/10 dark:bg-white/5');
    content = content.replace(/bg-white dark:bg-slate-900\/50\/20/g, 'bg-white/20 dark:bg-white/10');
    content = content.replace(/dark:hover:bg-slate-800\/80 dark:bg-slate-800\/50/g, 'dark:hover:bg-slate-800/80');

    fs.writeFileSync(file, content);
});

console.log('Fixed malformed dark mode classes.');
