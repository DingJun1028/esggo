const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const viewsDir = 'c:/Project/esggo/components/views';
const files = walk(viewsDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Universal')) {
        console.log(`Updating ${file}`);
        content = content.replace(/Universal/g, 'Omni');
        fs.writeFileSync(file, content, 'utf8');
    }
});
