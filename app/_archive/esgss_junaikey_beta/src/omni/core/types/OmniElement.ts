export type OmniLabel = 'Omni' | 'OmniOne' | 'OmniStandard' | 'OmniTriple' | string;

export interface OmniElement {
  /** Unique Identifier */
  uid: string;
  /** Categorization Label */
  label: OmniLabel;
  /** Business Attributes / Payload */
  attrs: Record<string, any>;
  /** Predecessor UID for Chain of Thought / Traceability */
  predecessor?: string | null;
  /** Trace ID for distributed tracing */
  traceId?: string;
  /** Timestamp of creation */
  createdAt: string;
  /** Version of the element structure */
  version: string;
}
