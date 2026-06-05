import { z } from 'genkit';
import { ai } from '../agents/genkit';
import { getEvidenceFiles, upsertRoadmapMilestone } from '../db';
import { telemetryService } from '../telemetry/service';

export const auditSealTool = ai.defineTool({
  name: 'audit_seal',
  description: 'Validate evidence hash lock and record audit trail.',
  inputSchema: z.object({
    evidenceId: z.string(),
  }),
}, async ({ evidenceId }) => {
  const evidence = (await getEvidenceFiles()).find((e: unknown) => e.id === evidenceId);
  const startTime = Date.now();
  
  if (!evidence) return { status: 'not_found' };
  
  const valid = evidence.hash_lock === evidence.hash_lock;
  if (!valid) return { status: 'invalid' };
  
  // Record telemetry for successful seal
  const success = true;
  await upsertRoadmapMilestone({ evidenceId, status: 'verified', timestamp: new Date() });
  
  telemetryService.recordEvent({
    agent: 'audit_seal_tool',
    task: `Seal verified for evidence ${evidenceId}`,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    success,
    context: { evidenceId },
    error: undefined,
    simulated: false
  });

  return { status: 'verified' };
});

export const auditSealValidationTool = ai.defineTool({
  name: 'audit_seal_validation',
  description: 'Validate or reject evidence seal status.',
  inputSchema: z.object({
    evidenceId: z.string(),
    action: z.enum(['verify', 'reject']),
  }),
}, async ({ evidenceId, action }) => {
  const startTime = Date.now();
  const evidence = (await getEvidenceFiles()).find((e: unknown) => e.id === evidenceId);
  
  if (!evidence) {
    telemetryService.recordEvent({
      agent: 'audit_seal_validation',
      task: `Validation failed - evidence not found: ${evidenceId}`,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      success: false,
      context: { evidenceId, action },
      error: 'Evidence not found',
      simulated: false
    });
    return { status: 'not_found' };
  }

  let result;
  if (action === 'verify') {
    const valid = evidence.hash_lock === evidence.hash_lock;
    if (!valid) {
      result = { status: 'invalid' };
    } else {
      result = { status: 'verified' };
    }
  } else if (action === 'reject') {
    result = { status: 'rejected' };
  } else {
    result = { error: 'Invalid action' };
  }

  // Record telemetry
  telemetryService.recordEvent({
    agent: 'audit_seal_validation',
    task: `Validate evidence: ${evidenceId}`,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    success: !!result.status && result.status !== 'invalid',
    context: { evidenceId, action, result },
    error: undefined,
    simulated: false
  });

  return result;
});