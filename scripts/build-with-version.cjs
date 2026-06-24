const { execSync } = require('child_process');
const path = require('path');
const packageJson = require(path.join(__dirname, '..', 'package.json'));
process.env.NEXT_PUBLIC_APP_VERSION = packageJson.version;
execSync('next build', { stdio: 'inherit' });
