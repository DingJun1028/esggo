import { createHash } from 'crypto';

export interface IComponentCore {
  uuid: string;
  timestamp: number;
  formula: string;
  impactMetric: string;
  status: "Trustworthy" | "Pending";
  evidence: Record<string, any>;
}

/**
 * 5T Protocol: Generates a Hash Lock for immutable data
 */
export function generateHashLock(data: Partial<IComponentCore>): string {
  const payload = JSON.stringify({
    uuid: data.uuid,
    timestamp: data.timestamp,
    formula: data.formula,
  });
  return createHash('sha256').update(payload).digest('hex');
}
