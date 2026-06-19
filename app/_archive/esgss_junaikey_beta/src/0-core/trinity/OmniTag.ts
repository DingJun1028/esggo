import { v4 as uuidv4 } from 'uuid';

export const OMNI_LABEL_PREFIX = 'Omni';

/**
 * Generates a unique UID based on a semantic prefix.
 * This ensures every Omni Tag has a globally unique identity.
 * @param prefix The semantic prefix (e.g., 'Omni', 'OmniOne')
 */
export function uidFromUidPrefix(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

/**
 * Generates a new unique Trace ID for a fresh Omni Chain.
 */
export function generateTraceId(): string {
  return `trace-${uuidv4()}`;
}

/**
 * Helper to derive a child label from a parent label.
 * e.g., 'OmniOne' -> 'OmniOne-derived'
 */
export function deriveLabel(parentLabel: string, suffix: string = 'derived'): string {
  return `${parentLabel}-${suffix}`;
}
