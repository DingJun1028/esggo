import { InfoNode, InfoNodeAttrs, InfoLabel } from './types';
import { uidFromUidPrefix, generateTraceId } from './OmniTag';
import { KnowledgeWarehouse } from './KnowledgeWarehouse';

/**
 * The Trinity Element (WanNengElement).
 * The atomic unit of the AVOS architecture.
 *
 * Combines:
 * 1. Omni Tag (Label)
 * 2. Storage (KnowledgeWarehouse persistence)
 * 3. Reasoning (Predecessor chaining & logic)
 */
export class TrinityElement {
  private warehouse: KnowledgeWarehouse;

  constructor() {
    this.warehouse = KnowledgeWarehouse.getInstance();
  }

  /**
   * Creates a fresh Trinity Element (InfoOne).
   * This is the "God Particle" of the system - the starting point.
   */
  async createInfoOne(
    label: InfoLabel,
    attrs: InfoNodeAttrs,
    predecessorUid?: string,
    existingTraceId?: string
  ): Promise<InfoNode> {
    const uid = uidFromUidPrefix('InfoOne');
    const traceId = existingTraceId || generateTraceId();

    const node: InfoNode = {
      uid,
      label,
      attrs: {
        ...attrs,
        // Trinity attributes
        infoId: uid,
        infoLabel: label,
      },
      traceId,
      predecessor: predecessorUid || null,
      createdAt: new Date().toISOString(),
    };

    // 2. Storage: Automatically persist to Knowledge Warehouse
    await this.warehouse.storeNode(node);

    return node;
  }

  /**
   * Performs reasoning on an existing element to produce a NEW derived element.
   * This represents the "Reasoning" pillar of the Trinity.
   */
  async reason(
    inputNode: InfoNode,
    newLabel: string,
    reasoningLogic: (attrs: InfoNodeAttrs) => Promise<InfoNodeAttrs>
  ): Promise<InfoNode> {
    console.info(`[Trinity] Reasoning on ${inputNode.uid}...`);

    // 1. Execute logic
    const newAttrs = await reasoningLogic(inputNode.attrs);

    // 2. Create derived element (inherits traceId)
    const derivedNode = await this.createInfoOne(
      newLabel,
      {
        ...newAttrs,
        derivedFrom: inputNode.uid,
      },
      inputNode.uid,
      inputNode.traceId
    );

    return derivedNode;
  }
}

// Singleton export
export const trinity = new TrinityElement();
