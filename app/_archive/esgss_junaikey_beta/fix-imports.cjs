
const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'src', 'omni'),
    path.join(__dirname, 'src', 'core')
];

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fixImports(filePath);
        }
    });
}

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Regex to match imports ending in .js and replace with .ts
    // Handles ' and " quotes
    // Handles import ... from ... and export ... from ...
    const regex = /(from\s+['"])([^'"]+)\.js(['"])/g;

    if (regex.test(content)) {
        const newContent = content.replace(regex, '$1$2.ts$3');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Scanning ${dir}...`);
        walk(dir);
    } else {
        console.log(`Directory not found: ${dir}`);
    }
});
