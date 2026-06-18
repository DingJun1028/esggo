import fs from 'fs';
import path from 'path';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function copyWithRetry(src, dest, retries = 5, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      fs.copyFileSync(src, dest);
      return;
    } catch (e) {
      if (e.code === 'EBUSY' && i < retries - 1) {
        await sleep(delay * (i + 1));
        continue;
      }
      throw e;
    }
  }
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);

    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

const rootDir = path.join(process.cwd());
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('✨ Found Next.js standalone directory. Copying assets...');
  
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicSrc)) {
    console.log(`- Copying public assets from ${publicSrc} to ${publicDest}...`);
    copyFolderRecursiveSync(publicSrc, publicDest);
  }

  const staticSrc = path.join(rootDir, '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    console.log(`- Copying static assets from ${staticSrc} to ${staticDest}...`);
    copyFolderRecursiveSync(staticSrc, staticDest);
  }

  console.log('✅ Next.js standalone assets copied successfully.');
} else {
  console.log('⚠️ Next.js standalone directory not found. Skipping asset copy.');
}