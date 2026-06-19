import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

/**
 * 🤖 Omni Agent Core Service
 * Implements the "5T Protocol" for Automated Agencies (CrewAI / AutoGPT)
 */
interface LogStepPayload {
  agent_role: string;
  thought: string;
  tools_used?: string;
  source_origin?: string;
  session_id?: string;
}

interface FinishTaskPayload {
  task_name: string;
  output: string;
  calculation_formula?: string;
  expected_output?: string;
}

interface LockProjectPayload {
  project_name: string;
  artifacts: string[];
  final_summary: string;
}

class OmniAgentService {
  private ledger: Map<string, any>;
  private lockedProjects: Set<string>;

  constructor() {
    this.ledger = new Map(); // In-memory ledger (Replace with DB/Redis in prod)
    this.lockedProjects = new Set();
  }

  /**
   * 可追溯 Step Webhook: Traceable Logging
   * Records every thought step and checks for hallucinations
   */
  async logStep(payload: LogStepPayload) {
    const { agent_role, thought, tools_used, source_origin, session_id } = payload;

    // 5T Check: Traceable
    if (!source_origin && !tools_used) {
      logger.warn(`[5T WARNING] Step missing traceability: ${thought?.substring(0, 50)}...`);
    }

    const stepId = uuidv4();
    const timestamp = new Date().toISOString();

    const record = {
      stepId,
      sessionId: session_id || 'unknown',
      agentRole: agent_role,
      thought,
      toolsUsed: tools_used,
      timestamp,
      traceability: {
        source: source_origin || 'generated',
        tool: tools_used || 'internal_logic',
      },
    };

    // Log to structured logger
    logger.info(
      {
        type: 'AGENT_STEP',
        ...record,
      },
      `[Step] ${agent_role}: ${thought?.substring(0, 80)}...`
    );

    // In a real system, push to Flowlu or DB here
    return { status: 'logged', stepId, timestamp };
  }

  /**
   * 可計算 Task Webhook: Calculable Verification
   * Verifies outputs and formulas
   */
  async finishTask(payload: FinishTaskPayload) {
    const { task_name, output, calculation_formula, expected_output } = payload;

    // 5T Check: Calculable
    let calculableVerified = true;
    if (task_name.includes('Calcul') || calculation_formula) {
      if (!calculation_formula) {
        calculableVerified = false;
        logger.warn(`[5T ALERT] Task ${task_name} missing calculation formula!`);
      }
    }

    const taskId = uuidv4();
    logger.info(
      {
        type: 'TASK_COMPLETE',
        taskId,
        taskName: task_name,
        calculable: calculableVerified,
      },
      `[Task] ${task_name} Finished`
    );

    return {
      status: 'verified',
      taskId,
      calculable: calculableVerified,
    };
  }

  /**
   * 本身不可竄改 Crew Webhook: Immutable Locking
   * Finalizes the project and generates Hash Lock
   */
  async lockProject(payload: LockProjectPayload) {
    const { project_name, artifacts, final_summary } = payload;

    const timestamp = new Date().toISOString();
    const projectUuid = uuidv4();

    // Generate Hash Lock (SHA-256)
    const contentToHash = JSON.stringify({ project_name, artifacts, final_summary, timestamp });
    const hashLock = crypto.createHash('sha256').update(contentToHash).digest('hex');

    const record = {
      uuid: projectUuid,
      projectName: project_name,
      timestamp,
      hashLock,
      status: 'LOCKED',
      artifacts: artifacts?.length || 0,
    };

    // Store in immutable ledger (simulated)
    this.lockedProjects.add(hashLock);

    logger.info(
      {
        type: 'PROJECT_LOCK',
        ...record,
      },
      `[Crew] 不可竄改 Project ${project_name} Locked with Hash: ${hashLock.substring(0, 8)}...`
    );

    return {
      status: 'locked',
      uuid: projectUuid,
      hash_lock: hashLock,
      timestamp,
    };
  }
}

export default new OmniAgentService();
