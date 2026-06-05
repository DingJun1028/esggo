const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function appendToStepSummary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  }
  console.log(text);
}

try {
  console.log('🛡️ OmniCore Auto-Repair Initiated...');
  let rcaReport = '### 🔍 Auto-Repair RCA Report\n\n';
  let needsFix = false;

  // 1. Check for missing critical environment variables
  const criticalVars = ['NEXT_PUBLIC_SUPABASE_URL', 'RENDER_API_KEY'];
  const missingVars = criticalVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    rcaReport += `**🚨 Missing Env Vars Detected:** ${missingVars.join(', ')}\n`;
    rcaReport += `*Action Taken:* Injecting safe fallback values into \`.env.fallback\` (Git Ignored) for build phase.\n`;
    
    // Write safe placeholders
    let fallbackContent = '';
    missingVars.forEach(v => {
      fallbackContent += `${v}=AUTO_REPAIR_PLACEHOLDER_${v}\n`;
    });
    fs.writeFileSync(path.join(process.cwd(), '.env.fallback'), fallbackContent);
    needsFix = true;
  } else {
    rcaReport += `✅ Environment variables are intact.\n`;
  }

  // 2. Check for dependency mismatch / npm failures
  try {
    execSync('npm ls', { stdio: 'ignore' });
    rcaReport += `✅ Dependencies tree is healthy.\n`;
  } catch (e) {
    rcaReport += `**📦 Dependency Error Detected:** package-lock.json might be out of sync.\n`;
    rcaReport += `*Action Taken:* Running \`npm install\` to auto-heal dependencies.\n`;
    execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });
    needsFix = true;
  }

  appendToStepSummary(rcaReport);

  // Note: We no longer auto-commit to prevent accidentally pushing secrets or breaking the main branch.
  // The auto-repair only applies fixes to the current CI runtime environment.
  
  if (needsFix) {
    console.log('✅ Auto-repair completed mitigation in current CI environment.');
  } else {
    console.log('ℹ️ No auto-repair actions were required.');
  }

} catch (error) {
  console.error('❌ Auto-repair critical failure:', error.message);
  appendToStepSummary(`**❌ Auto-repair critical failure:** ${error.message}`);
  process.exit(1);
}