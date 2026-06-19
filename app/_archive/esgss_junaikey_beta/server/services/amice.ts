import crypto from 'crypto';
import { runSwarm } from './swarmService.js';
import { ARVOAgentFactory } from './arvoAgent.js';
import ragService from './rag.js';
import dotenv from 'dotenv';

dotenv.config();

// Type definitions for AMICE events
interface SystemAlertPayload {
  message: string;
  severity: string;
  [key: string]: unknown;
}

interface AgentTaskPayload {
  target_agent?: string;
  instruction: string;
  use_swarm?: boolean;
  [key: string]: unknown;
}

interface DataIngestPayload {
  kb_id?: string;
  content: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

interface EventResult {
  status: 'success' | 'error' | 'ignored' | 'processing';
  message?: string;
  result?: unknown;
  error?: string;
}

class AmiceService {
  secret: string;

  constructor() {
    this.secret = process.env.AMICE_WEBHOOK_SECRET || 'default_secret_change_me_in_prod';
  }

  /**
   * Validate HMAC-SHA256 Signature
   * @param payload - Request body
   * @param signature - x-amice-signature header
   * @returns isValid
   */
  validateSignature(payload: Record<string, unknown>, signature: string | undefined): boolean {
    if (!signature || !this.secret) return false;

    // Ensure payload is string for hashing
    const data = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', this.secret);
    const digest = hmac.update(data).digest('hex');
    const expectedSignature = `sha256=${digest}`;

    try {
      const source = Buffer.from(signature);
      const target = Buffer.from(expectedSignature);

      if (source.length !== target.length) {
        return false;
      }

      // Timing-safe comparison
      return crypto.timingSafeEqual(source, target);
    } catch {
      return false;
    }
  }

  /**
   * Handle Incoming Event
   * @param eventType - Type of the event
   * @param payload - Event payload
   */
  async handleEvent(eventType: string, payload: Record<string, unknown>): Promise<EventResult> {
    console.log(`[AMICE] Received Event: ${eventType}`);

    switch (eventType) {
      case 'system_alert':
        return this.handleSystemAlert(payload as SystemAlertPayload);
      case 'agent_task':
        return this.handleAgentTask(payload as AgentTaskPayload);
      case 'data_ingest':
        return this.handleDataIngest(payload as DataIngestPayload);
      default:
        console.warn(`[AMICE] Unknown event type: ${eventType}`);
        return { status: 'ignored', message: 'Unknown event type' };
    }
  }

  async handleSystemAlert(payload: SystemAlertPayload): Promise<EventResult> {
    // Trigger a Swarm to diagnose the alert
    const goal = `SWARM: Analyze system alert: ${payload.message}. Level: ${payload.severity}. Suggest fixes.`;
    console.log(`[AMICE] Triggering Diagnostic Swarm...`);

    // Execute asynchronously (fire & forget from webhook perspective, but we log it)
    runSwarm(goal)
      .then(result => {
        console.log(`[AMICE] Diagnostic Swarm Complete. Message: ${result.message}`);
      })
      .catch(err => {
        console.error(`[AMICE] Swarm Failed:`, err);
      });

    return { status: 'processing', message: 'Diagnostic swarm triggered' };
  }

  async handleAgentTask(payload: AgentTaskPayload): Promise<EventResult> {
    // Wake up a specific agent
    try {
      const agentName = payload.target_agent || 'Omni-Coordinator';
      const agent = await ARVOAgentFactory.create(agentName);
      const result = await agent.process(payload.instruction, { force_swarm: payload.use_swarm });

      return { status: 'success', result };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('[AMICE] Agent execution failed:', err);
      return { status: 'error', error: err.message };
    }
  }

  async handleDataIngest(payload: DataIngestPayload): Promise<EventResult> {
    // Trigger RAG ingestion
    try {
      await ragService.ingestKnowledge(payload.kb_id || 'default', payload.content, {
        source: 'webhook',
        ...payload.metadata,
      });
      return { status: 'success', message: 'Knowledge ingested' };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('[AMICE] Ingestion failed:', err);
      return { status: 'error', error: err.message };
    }
  }
}

export default new AmiceService();
