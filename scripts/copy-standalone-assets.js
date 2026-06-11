const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;

  // Create target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Copy all files and folders
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

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('✨ Found Next.js standalone directory. Copying assets...');
  
  // Copy public folder
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicSrc)) {
    console.log(`- Copying public assets from ${publicSrc} to ${publicDest}...`);
    copyFolderRecursiveSync(publicSrc, publicDest);
  }

  // Copy .next/static folder
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
