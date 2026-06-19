import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { glob } from 'glob';

const SRC_DIR = path.resolve('./src');
const OUTPUT_FILE = path.resolve('./INTEGRITY_SEAL.json');

console.log('🔒 Initiating 5T Integrity Seal Process...');

function calculateFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function generateSeal() {
  try {
    // Find all files in src, excluding test files if needed
    const files = glob.sync(`${SRC_DIR.replace(/\\/g, '/')}/**/*.{ts,tsx,js,css,json}`);
    files.sort(); // Ensure deterministic order

    const globalHash = crypto.createHash('sha256');

    let fileCount = 0;
    files.forEach(file => {
      const hash = calculateFileHash(file);
      globalHash.update(hash);
      fileCount++;
    });

    const finalHash = globalHash.digest('hex');
    const timestamp = new Date().toISOString();

    const seal = {
      integrity_hash: finalHash,
      timestamp: timestamp,
      files_sealed: fileCount,
      epoch: 'Sentient-7.0',
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(seal, null, 2));

    console.log(`✅ SEAL GENERATED SUCESSFULLY`);
    console.log(`   Hash: ${finalHash.substring(0, 16)}...`);
    console.log(`   Files: ${fileCount}`);
    console.log(`   Saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Seal Generation Failed:', error);
    process.exit(1);
  }
}

generateSeal();
