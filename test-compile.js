const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit --project tsconfig.json', { stdio: 'inherit' });
  console.log('Compile success');
} catch (e) {
  console.error('Compile failed');
}
