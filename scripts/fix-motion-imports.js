const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Use glob to find all tsx and ts files
const files = glob.sync('**/*.{tsx,ts}', { ignore: 'node_modules/**' });

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('from "motion/react"')) {
    const updatedContent = content.replace(/from "motion\/react"/g, 'from "framer-motion"');
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
