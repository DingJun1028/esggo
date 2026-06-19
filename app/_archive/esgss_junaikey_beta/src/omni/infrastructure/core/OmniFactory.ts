import { v4 as uuidv4 } from 'uuid';
import { OmniElement, OmniLabel } from '../../core/types/OmniElement.ts';

/**
 * Generates a UID with a prefix for readability and namespace separation.
 * @param prefix e.g., 'Omni', 'Risk', 'Action'
 */
export function uidFromUidPrefix(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

/**
 * Factory to create a Trinity Element (OmniElement).
 * This is the atomic unit of the Omni Core.
 *
 * @param label Categorization of this element
 * @param attrs Business data
 * @param predecessorUid Optional link to the previous element in the chain
 */
export function createOmniElement(
  label: OmniLabel,
  attrs: Record<string, any> = {},
  predecessorUid?: string
): OmniElement {
  const uid = uidFromUidPrefix(typeof label === 'string' ? label : 'Omni');

  const element: OmniElement = {
    uid,
    label,
    attrs,
    predecessor: predecessorUid || null,
    traceId: uuidv4(), // Generate a new trace context if not provided
    createdAt: new Date().toISOString(),
    version: '1.0',
  };

  return element;
}
