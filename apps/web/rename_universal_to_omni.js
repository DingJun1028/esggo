const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Project\\esggo\\esggo';

// Directories to exclude
const excludeDirs = ['node_modules', '.git', '.next', '.kilo'];

// Step 1: Move components/ui/omni to components/ui/omni
const omniDir = path.join(projectRoot, 'components', 'ui', 'omni');
const omniDir = path.join(projectRoot, 'components', 'ui', 'omni');

if (fs.existsSync(omniDir)) {
  fs.renameSync(omniDir, omniDir);
  console.log(`Renamed ${omniDir} to ${omniDir}`);
}

// Step 2: Rename files inside components/ui/omni
if (fs.existsSync(omniDir)) {
  const files = fs.readdirSync(omniDir);
  for (const file of files) {
    let newFile = file;
    if (newFile.includes('OmniBaseCard')) {
      newFile = newFile.replace('OmniBaseCard', 'OmniBaseCard');
    } else if (newFile.includes('OmniBaseTable')) {
      newFile = newFile.replace('OmniBaseTable', 'OmniBaseTable');
    } else if (newFile.includes('Omni')) {
      newFile = newFile.replace('Omni', 'Omni');
    }
    
    if (newFile !== file) {
      fs.renameSync(path.join(omniDir, file), path.join(omniDir, newFile));
      console.log(`Renamed ${file} to ${newFile}`);
    }
  }
}

// Step 3: Replace strings in all files
function walk(dir) {
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludeDirs.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const fileStat = fs.statSync(fullPath);

    if (fileStat.isDirectory()) {
      walk(fullPath);
    } else if (fileStat.isFile()) {
      // Only process common text files
      if (!/\.(tsx|ts|js|jsx|md|css|json)$/i.test(fullPath)) continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Special handling for naming collisions
      content = content.replace(/OmniBaseCard/g, 'OmniBaseCard');
      content = content.replace(/OmniBaseTable/g, 'OmniBaseTable');
      
      // Global rename for Omni -> Omni
      content = content.replace(/Omni/g, 'Omni');
      content = content.replace(/omni/g, 'omni');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated contents of ${fullPath}`);
      }
    }
  }
}

walk(projectRoot);
console.log('Done!');
