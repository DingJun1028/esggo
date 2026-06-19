export type InfoLabel = 'Info' | 'InfoOne' | 'InfoInfo' | 'InfoInfoInfo' | 'Info2Info' | string;

export enum InfoLevel {
  Standard = 1,
  Double = 2,
  Triple = 3,
}

export interface InfoNodeAttrs {
  [key: string]: any;
  infoId?: string;
  infoLabel?: string;
  infoRelation?: string[];
  infoLevel?: InfoLevel | number;
  source?: string;
  confidence?: number;
  reasoningResult?: any;
}

export interface InfoNode {
  /**
   * The Unique Identifier for this Trinity Element.
   * Acts as the primary key in the Knowledge Warehouse.
   */
  uid: string;

  /**
   * The Omni Label (Tag).
   * Defines the classification and hierarchy of the information.
   */
  label: InfoLabel;

  /**
   * The actual Data/Payload/Attributes of the element.
   * Stores the "Memory" portion of the Trinity.
   */
  attrs: InfoNodeAttrs;

  /**
   * The Trace ID for the Trinity Chain.
   * Allows full traceability of the information lineage.
   */
  traceId: string;

  /**
   * The UID of the predecessor node.
   * links this element to its origin in the reasoning chain.
   */
  predecessor?: string | null;

  /**
   * Timestamp of creation.
   */
  createdAt: string;
}

// ==================== UNIFIED AGENT ARCHITECTURE ====================
import { Agent } from '../../types/agency';

/**
 * 🤖 OmniSprite (奧秘精靈)
 * Represents an Omni-Sprite as a first-class citizen of the Omni Trinity.
 * Sprite IS Data (InfoNode) + Behavior (Logic).
 */
export interface InfoOneAgent extends InfoNode {
  label: 'OmniSprite';
  attrs: Agent & InfoNodeAttrs; // Agent DNA merged with Omni Attrs
}
