
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_DIR = path.resolve(ROOT_DIR, 'server');

const targetDirs = [
    path.join(SERVER_DIR, 'services'),
    path.join(SERVER_DIR, 'routes'),
    path.join(SERVER_DIR, 'middleware'),
    path.join(SERVER_DIR, 'db'),
    path.join(SERVER_DIR, 'controllers'),
    path.join(SERVER_DIR, 'utils'),
    path.join(ROOT_DIR, 'src', 'omni'),
    path.join(ROOT_DIR, 'src', 'services'),
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex for relative imports or @/ imports lacking extensions
    // Matches: from './something' or from '../something' or from '@/something'
    // Excludes: already have extension like .js, .json, .css, etc. or absolute imports like 'express'
    const importRegex = /(import|export)\s+([\s\S]*?)\s+from\s+(['"])(\.\/|\.\.\/|@\/)(.*?)(['"])/g;

    const newContent = content.replace(importRegex, (match, type, members, quote1, prefix, pathPart, quote2) => {
        // Skip if already has extension
        if (pathPart.match(/\.(js|json|css|png|jpg|svg|ts|tsx)$/)) {
            return match;
        }

        // Skip if it looks like a directory with a trailing slash (rare in imports but possible)
        if (pathPart.endsWith('/')) {
            return match;
        }

        changed = true;
        return `${type} ${members} from ${quote1}${prefix}${pathPart}.js${quote2}`;
    });

    if (changed) {
        console.log(`[FIXED] ${path.relative(ROOT_DIR, filePath)}`);
        fs.writeFileSync(filePath, newContent, 'utf8');
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    });
}

console.log('Starting ESM Extension Fixer...');
targetDirs.forEach(dir => {
    console.log(`Scanning: ${dir}`);
    walk(dir);
});
console.log('Done.');
