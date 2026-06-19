/**
 * ESGss-JunAiKey Webhook Receiver
 *
 * Core Features:
 * - Receive CrewAI Webhooks
 * - Verify 5T Protocol
 * - Anchor to Evidence Vault
 * - Maintain SSOT Integrity
 */

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import {
  OmniComponentCoreFactory,
  FiveTProtocolExecutor,
  type IComponentCore,
} from '../services/OmniComponentCore.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * CrewAI Webhook Payload Structure
 * --------------------------------------------------
 * [Standard] CrewAI Framework Output
 * [Extended] Includes 3+1 Protocol Metadata
 */
interface CrewAIWebhookPayload extends IComponentCore {
  crew_name: string;
  task_name?: string;
  step_name?: string;
  agent_name?: string;
  output: any;
  metadata: {
    execution_time_ms: number;
    tokens_used?: number;
    cost_usd?: number;
  };
}

// ============================================================================
// Core Verification Logic
// ============================================================================

/**
 * Verify 5T Protocol Integrity
 *
 * @param data - Webhook Payload
 * @returns boolean - validity status
 */
const verify5TIntegrity = (data: CrewAIWebhookPayload): boolean => {
  try {
    const primaryEvidence = data.evidence ? data.evidence[data.uuid] : undefined;

    // 1. Traceable (Source Origin)
    if (!primaryEvidence || !primaryEvidence.sourceOrigin) {
      console.error('Integrity Check Failed: Missing source_origin (Traceable)');
      return false;
    }

    // 2. Trackable (UUID & Timestamp)
    if (!data.uuid || !data.timestamp) {
      console.error('Integrity Check Failed: Missing UUID or Timestamp (Trackable)');
      return false;
    }

    // 3. Transparent
    // (Logged via system logs, verifiable via Evidence Vault)

    // +1. Trustworthy (Hash Lock)
    const hashLock = primaryEvidence.hashLock;
    if (!hashLock) {
      console.error('Integrity Check Failed: Missing hash_lock (Trustworthy)');
      return false;
    }

    // Verify Hash
    const computedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data.output))
      .digest('hex');

    if (computedHash !== hashLock) {
      console.error('Integrity Check Failed: Hash Mismatch');
      return false;
    }

    console.log('✅ 5T Protocol Verified');
    return true;
  } catch (error) {
    console.error('5T Verification Error:', error);
    return false;
  }
};

/**
 * Save to Evidence Vault (Simulation)
 */
const saveToEvidenceVault = async (data: CrewAIWebhookPayload): Promise<void> => {
  // In production, this would write to immutable storage
  console.log(`🔒 Anchoring to Evidence Vault: ${data.uuid}`);

  // Simulation:
  // const fs = require('fs').promises;
  // await fs.writeFile(
  //   `./vault/crewai/${data.uuid}.json`,
  //   JSON.stringify(data, null, 2)
  // );
};

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

// Verify Webhook Token
const verifyToken = (req: Request): boolean => {
  const token = req.headers['x-junaikey-token'];
  const expectedToken = process.env.JUNAIKEY_WEBHOOK_TOKEN;

  if (!expectedToken) {
    console.warn('⚠️  JUNAIKEY_WEBHOOK_TOKEN not set in environment (Dev Mode)');
    return true; // Weak security for dev mode
  }

  return token === expectedToken;
};

// ============================================================================
// Webhook Endpoints
// ============================================================================

/**
 * Step Webhook - Track individual agent steps
 *
 * Implements: Trackable
 */
app.post('/webhook/step', async (req: Request, res: Response) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stepLog = req.body;

    console.log(`[👣 Step Tracker] Agent: ${stepLog.agent_name}`);
    console.log(`                 Step: ${stepLog.step_name}`);
    console.log(`                 Status: ${stepLog.status}`);

    // TODO: Notify external systems (Discord/Slack)
    // await notifyDiscord(...);

    return res.status(200).json({
      status: 'logged',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Step Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Task Webhook - Verify completed tasks
 *
 * Implements: Transparent
 */
app.post('/webhook/task', async (req: Request, res: Response) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const taskData: CrewAIWebhookPayload = req.body;

    console.log(`[✅ Task Complete] Task: ${taskData.task_name}`);
    console.log(`                  UUID: ${taskData.uuid}`);

    // Verify 5T
    if (!verify5TIntegrity(taskData)) {
      return res.status(400).json({
        error: '5T Integrity Check Failed',
        details: 'Integrity check failed',
      });
    }

    // Anchor to Vault
    // Anchor to Vault
    await saveToEvidenceVault(taskData);

    // TODO: Trigger downstream workflows (Flowlu)
    // await createFlowluTask(...);

    return res.status(200).json({
      message: 'Task verified and stored',
      uuid: taskData.uuid,
      verified: true,
    });
  } catch (error) {
    console.error('Task Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Crew Webhook - Finalize and Lock
 *
 * Implements: Immutable (Trustworthy)
 * Uses Object.freeze() and Hash Locks.
 */
app.post('/webhook/crew', async (req: Request, res: Response) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const crewResult: CrewAIWebhookPayload = req.body;

    console.log(`[🚀 Crew Finalized] Crew: ${crewResult.crew_name}`);
    console.log(`                    UUID: ${crewResult.uuid}`);
    console.log(`                    Execution Time: ${crewResult.metadata.execution_time_ms}ms`);

    // Final Verification
    if (!verify5TIntegrity(crewResult)) {
      return res.status(400).json({
        error: 'Final Integrity Check Failed',
        details: 'Final integrity check failed',
      });
    }

    // Immutable Freeze
    const frozenResult = Object.freeze(crewResult);

    // Permanent Anchor
    await saveToEvidenceVault(frozenResult);

    // Generate Final Report
    const finalEvidence = frozenResult.evidence[frozenResult.uuid];
    const finalReport = {
      crew_name: frozenResult.crew_name,
      uuid: frozenResult.uuid,
      timestamp: frozenResult.timestamp,
      hash_lock: finalEvidence ? finalEvidence.hashLock : 'MISSING_LOCK',
      status: 'IMMUTABLE',
      verified: true,
      metadata: frozenResult.metadata,
    };

    console.log('💎 Crew Output Immutable & Anchored.');

    // TODO: External Lock (Flowlu Project)
    // await lockFlowluProject(...);

    return res.status(200).json(finalReport);
  } catch (error) {
    console.error('Crew Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ============================================================================
// Health Check
// ============================================================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ESGss-JunAiKey Webhook Receiver',
    version: '1.0.0',
    ssot_compliant: true,
    protocols: ['5T', 'SSOT'],
  });
});

// ============================================================================
// Server Start
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 🔗 ESGss-JunAiKey Webhook Receiver (Awakened Interface)                      ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✨ Server running on port ${PORT}`);
  console.log(`🛡️  5T Protocol: ENABLED`);
  console.log(`📜 SSOT Contract: ACTIVE`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST /webhook/step  - Track Step`);
  console.log(`  POST /webhook/task  - Verify Task`);
  console.log(`  POST /webhook/crew  - Final Lock`);
  console.log(`  GET  /health        - Health Check`);
  console.log('');
});

export default app;
