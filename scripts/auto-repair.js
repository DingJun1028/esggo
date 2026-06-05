const { execSync } = require('child_process');

try {
  console.log('Running auto-repair...');
  execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
  execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
  execSync('git pull', { stdio: 'inherit' });
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "chore: auto-repair Render deployment"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('Auto-repair completed successfully');
} catch (error) {
  console.error('Auto-repair failed:', error.message);
  process.exit(1);
}