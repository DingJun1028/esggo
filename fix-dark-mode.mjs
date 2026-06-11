import fs from 'fs';

const files = [
    'app/environmental/page.tsx',
    'app/social/page.tsx',
    'app/governance/page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Page Wrapper
    content = content.replace('min-h-screen bg-slate-50 text-slate-800', 'min-h-screen bg-slate-50 dark:bg-void-stark text-slate-800 dark:text-slate-200');
    
    // Header
    content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-white/10');
    content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
    content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
    
    // MetricCard Text
    content = content.replace(/text-3xl font-black text-slate-800/g, 'text-3xl font-black text-slate-800 dark:text-white');
    
    // Table Wrapper
    content = content.replace(/bg-white/g, 'bg-white dark:bg-slate-900/50');
    content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-white/10');
    content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800/50');
    content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/50');
    content = content.replace(/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-800/80');

    // Table text
    content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
    content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-400');
    
    // The hover state for active tabs in table
    content = content.replace(/bg-white text-indigo-600/g, 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400');
    content = content.replace(/bg-white text-teal-600/g, 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400');
    content = content.replace(/bg-white text-amber-600/g, 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400');

    // Make the metrics card color classes adapt to dark mode
    content = content.replace(/bg-([a-z]+)-100 text-\1-600/g, 'bg-$1-100 dark:bg-$1-900/30 text-$1-600 dark:text-$1-400');
    content = content.replace(/bg-([a-z]+)-50 text-\1-600/g, 'bg-$1-50 dark:bg-$1-900/30 text-$1-600 dark:text-$1-400');
    content = content.replace(/bg-([a-z]+)-50 text-\1-700/g, 'bg-$1-50 dark:bg-$1-900/30 text-$1-700 dark:text-$1-400');
    content = content.replace(/bg-([a-z]+)-100 text-\1-800/g, 'bg-$1-100 dark:bg-$1-900/30 text-$1-800 dark:text-$1-400');

    fs.writeFileSync(file, content);
});

console.log('Fixed dark mode support for ESG dashboards.');
