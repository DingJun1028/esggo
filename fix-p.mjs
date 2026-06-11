import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./app', function(filePath) {
    if (filePath.endsWith('page.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extract the folder name to use as title
        let parts = filePath.split(path.sep);
        let folderName = parts[parts.length - 2];
        
        let changed = false;
        if (content.includes('{p.id}')) {
            content = content.replace(/\{p\.id\}/g, folderName.toUpperCase());
            changed = true;
        }
        if (content.includes('{p.title}')) {
            content = content.replace(/\{p\.title\}/g, folderName.replace(/-/g, ' ').toUpperCase());
            changed = true;
        }
        if (content.includes('{p.sub}')) {
            content = content.replace(/\{p\.sub\}/g, folderName + ' dashboard');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed ${filePath}`);
        }
    }
});
