/**
 * ⚕️ Omni-Healer (Active Agent: s_self_healing)
 * --------------------------------------------------
 * [Core Mission] Reduce System Entropy (Entropy Reduction).
 * [Protocol] 3+1 Protocol (Traceable, Trackable, Calculable, Immutable).
 * [Action] Scans for lint errors, applies fixes, and logs evidence.
 */

import { execSync } from 'child_process';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger'; // ts-node mapping handled by tsconfig
import { IComponentCore, IEvidenceMap as IEvidence } from '../src/types/core';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// Mock Agent Core for the Healer Script
const HEALER_CORE: IComponentCore = {
  uuid: 'agent_healer_v1_0',
  version: '1.0.0',
  timestamp: Date.now(),
  status: 'ACTIVE',
  evidence: {},
  data: {},
};

const TRACE_ID = uuidv4();

function log(level: 'INFO' | 'WARN' | 'ERROR', message: string, details?: any) {
  const category = LogCategory.AGENT;
  if (level === 'INFO') omniLogger.info(category, message, { trace_id: TRACE_ID, ...details });
  if (level === 'WARN') omniLogger.warn(category, message, { trace_id: TRACE_ID, ...details });
  if (level === 'ERROR') omniLogger.error(category, message, { trace_id: TRACE_ID, ...details });
}

function runCommand(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' }); // stdio pipe to capture output
    return { success: true, output };
  } catch (error: any) {
    return { success: false, output: error.stdout?.toString() + '\n' + error.stderr?.toString() };
  }
}

async function checkEnvironment(): Promise<{ healthy: boolean; issues: string[] }> {
  log('INFO', '🌍 [Check] Validating environment...', {
    source_origin: 'OmniHealer.checkEnvironment',
  });
  const issues: string[] = [];

  const nodeVersion = process.version || 'v18.0.0';
  const versionParts = nodeVersion.slice(1).split('.');
  const majorVersion = parseInt(versionParts[0] || '18', 10);
  if (majorVersion < 18) {
    issues.push(`Node version ${nodeVersion} is below recommended v18+`);
  }

  // Check .env file
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    issues.push('.env file missing');
  } else {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredVars = ['GEMINI_API_KEY', 'DATABASE_URL'];
    requiredVars.forEach(varName => {
      if (!envContent.includes(varName)) {
        issues.push(`Missing ${varName} in .env`);
      }
    });
  }

  log('INFO', `🌍 [Check] Environment status`, { issues_count: issues.length, issues });
  return { healthy: issues.length === 0, issues };
}

async function checkPorts(): Promise<{ healthy: boolean; blockedPorts: number[] }> {
  log('INFO', '🔌 [Check] Scanning for port conflicts...', {
    source_origin: 'OmniHealer.checkPorts',
  });
  const portsToCheck = [3000, 3001, 3005];
  const blockedPorts: number[] = [];

  for (const port of portsToCheck) {
    const result = runCommand(`netstat -ano | findstr :${port}`);
    if (result.output.includes('LISTENING')) {
      blockedPorts.push(port);
    }
  }

  log('INFO', `🔌 [Check] Port scan complete`, { blocked_ports: blockedPorts });
  return { healthy: blockedPorts.length === 0, blockedPorts };
}

async function scanHealth() {
  log('INFO', '🔍 [Scan] Initiating entropy scan...', { source_origin: 'OmniHealer.scanHealth' });

  // We expect lint to fail if there are errors, so catch is normal
  const result = runCommand('npm run lint'); // Assuming 'lint' script maps to eslint

  // Count errors roughly from output
  const errorCountMatch = result.output.match(/(\d+) problems? \(\d+ errors, \d+ warnings\)/);
  // ESLint output might differ, simplified regex for now or check output length/presence of "error"
  const errorCount = (result.output.match(/error/gi) || []).length;

  log('INFO', `📊 [Analysis] Current Entropy Level`, {
    error_count: errorCount,
    raw_output_preview: result.output.slice(0, 200),
  });

  return { healthy: result.success, errorCount };
}

async function heal() {
  log('INFO', '💊 [Heal] Applying automated fixes...', { source_origin: 'OmniHealer.heal' });

  // Attempt auto-fix
  const fixResult = runCommand('npm run lint -- --fix');

  log('INFO', '🩹 [Heal] Fix Attempt Completed', {
    success: fixResult.success,
    output_preview: fixResult.output.slice(0, 200),
  });

  return fixResult.success;
}

async function generateEvidence(initialErrors: number, finalErrors: number) {
  const evidence: IEvidence = Object.freeze({
    traceable: {
      source_origin: 'SkillEngine:s_self_healing',
    },
    verified_at: Date.now(),
    trustworthy: {
      hash_lock: `healed_${Date.now()}_${initialErrors}_to_${finalErrors}`,
      is_frozen: true,
    },
    // Optional: add metadata to a specific property or keep it flat if allowed
  });

  log('INFO', '📝 [Evidence] Healing Session Recorded', {
    evidence_hash: evidence.trustworthy?.hash_lock,
    reduction: initialErrors - finalErrors,
  });

  // In a real agent loop, we would append this to the agent's memory/core
  // Here we just log it as proof.
}

async function main() {
  console.log('⚡ Omni-Healer Activating...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // 1. Environment Check
    console.log('\n🌍 Phase 1: Environment Validation');
    const envStatus = await checkEnvironment();
    if (!envStatus.healthy) {
      console.log('⚠️  Environment Issues Detected:');
      envStatus.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ Environment: Healthy');
    }

    // 2. Port Check
    console.log('\n🔌 Phase 2: Port Conflict Detection');
    const portStatus = await checkPorts();
    if (!portStatus.healthy) {
      console.log('⚠️  Port Conflicts Detected:');
      portStatus.blockedPorts.forEach(port => console.log(`   - Port ${port} is in use`));
      console.log('   💡 Tip: Run `netstat -ano | findstr :<port>` to identify process');
    } else {
      console.log('✅ Ports: Available');
    }

    // 3. Lint Scan
    console.log('\n🔍 Phase 3: Code Entropy Scan');
    const initialStatus = await scanHealth();

    if (initialStatus.healthy && initialStatus.errorCount === 0) {
      console.log('✅ Code: Zero Entropy');
    } else {
      console.log(`⚠️  Detected ${initialStatus.errorCount} lint issues`);

      // 4. Heal
      console.log('\n💊 Phase 4: Applying Auto-Fixes');
      await heal();

      // 5. Verify
      const finalStatus = await scanHealth();

      // 6. Evidence
      await generateEvidence(initialStatus.errorCount, finalStatus.errorCount);

      if (finalStatus.errorCount < initialStatus.errorCount) {
        console.log(`✨ Entropy reduced: ${initialStatus.errorCount} → ${finalStatus.errorCount}`);
      } else if (finalStatus.errorCount > 0) {
        console.log(`⚠️  Entropy remains: ${finalStatus.errorCount} (manual intervention needed)`);
      } else {
        console.log('✨ Code fully healed');
      }
    }

    // Final Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const allHealthy = envStatus.healthy && portStatus.healthy && initialStatus.healthy;
    if (allHealthy) {
      console.log('🎉 System Status: OPTIMAL');
    } else {
      console.log('⚠️  System Status: NEEDS ATTENTION');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (e: any) {
    log('ERROR', '🔥 Healer Critical Failure', { error: e.message, stack: e.stack });
    process.exit(1);
  }
}

main();
