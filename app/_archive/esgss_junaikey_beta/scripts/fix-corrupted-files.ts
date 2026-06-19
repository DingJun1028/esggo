
import fs from 'fs';
import path from 'path';

const filesToFix = [
    {
        path: 'src/examples/omniCoreDemo.ts',
        replacements: [
            {
                // Fix broken substring call in template literal
                from: /m\.content\.substring\(0', { data: 50\)}\.\.\.`/g,
                to: 'm.content.substring(0, 50)}...`'
            },
            {
                // Fix another instance if it exists
                from: /content\.substring\(0', { data: 40\)}\.\.\.`/g,
                to: 'content.substring(0, 40)}...`'
            }
        ]
    },
    {
        path: 'src/services/integrationService.ts',
        replacements: [
            {
                // Fix corrupted filter status check
                from: /i\.status === '\{ error \}\.length/g,
                to: "i.status === 'error').length"
            },
            {
                // Fix similar corruption for externalSources
                from: /s\.status === '\{ error \}\.length/g,
                to: "s.status === 'error').length"
            }
        ]
    },
    {
        path: 'src/1-service/integrationService.ts', // Check if duplicate exists
        replacements: [
            {
                from: /i\.status === '\{ error \}\.length/g,
                to: "i.status === 'error').length"
            },
            {
                from: /s\.status === '\{ error \}\.length/g,
                to: "s.status === 'error').length"
            }
        ]
    }
];

function fixFiles() {
    const rootDir = process.cwd();

    filesToFix.forEach(fileTask => {
        const filePath = path.join(rootDir, fileTask.path);
        if (fs.existsSync(filePath)) {
            console.log(`Processing ${fileTask.path}...`);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            fileTask.replacements.forEach(rep => {
                if (rep.from.test(content)) {
                    content = content.replace(rep.from, rep.to);
                    modified = true;
                    console.log(`  Fixed pattern: ${rep.from}`);
                }
            });

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  Saved changes to ${fileTask.path}`);
            } else {
                console.log(`  No patterns matched in ${fileTask.path}`);
            }
        } else {
            console.log(`  File not found: ${fileTask.path}`);
        }
    });
}

fixFiles();
