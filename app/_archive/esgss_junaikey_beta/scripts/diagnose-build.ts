#!/usr/bin/env tsx
/**
 * 診斷構建錯誤並生成詳細報告
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('🔍 Running build with full error capture...\n');

try {
    const output = execSync('npm run build 2>&1', {
        cwd: process.cwd(),
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    console.log('✅ Build succeeded!');
    console.log(output);

    writeFileSync('build-success.log', output, 'utf-8');

} catch (error: any) {
    console.error('❌ Build failed!\n');
    console.error('Exit code:', error.status);
    console.error('\nFull output:');
    console.error(error.stdout || error.message);

    // Write to file
    const errorReport = `
BUILD FAILURE REPORT
====================
Exit Code: ${error.status}

STDOUT:
${error.stdout || '(empty)'}

STDERR:
${error.stderr || '(empty)'}

ERROR MESSAGE:
${error.message}
`;

    writeFileSync('build-error.log', errorReport, 'utf-8');
    console.log('\n📝 Full error log written to: build-error.log');

    process.exit(1);
}
