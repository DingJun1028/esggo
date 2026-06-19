import { InfoNode } from './types';

/**
 * Omni Crystal (WanNengJingTi).
 * Also known as Omni Core, Omni Heart Core, or Omni Eternal Memory.
 *
 * It represents the "Storage" pillar of the Omni Trinity (Info-One Three-In-One).
 * It acts as the Trustworthy (不可篡改), crystallised knowledge graph of the system.
 */
export class OmniCrystal {
  private static instance: OmniCrystal;
  private memoryStore: Map<string, InfoNode>;

  private constructor() {
    this.memoryStore = new Map<string, InfoNode>();
  }

  public static getInstance(): OmniCrystal {
    if (!OmniCrystal.instance) {
      OmniCrystal.instance = new OmniCrystal();
    }
    return OmniCrystal.instance;
  }

  /**
   * Crystallizes a Trinity Element (InfoNode) into the Eternal Memory.
   * This is the "Storage" pillar of the Omni Trinity.
   */
  async crystallize(node: InfoNode): Promise<void> {
    this.memoryStore.set(node.uid, node);
    console.debug(`[OmniCrystal] Crystallized: ${node.uid} (${node.label})`);
  }

  /**
   * Retrieves a crystallized Element by its unique ID.
   */
  async recall(uid: string): Promise<InfoNode | undefined> {
    return this.memoryStore.get(uid);
  }

  /**
   * Retrieves all Elements with a specific Omni Label.
   */
  async recallByLabel(label: string): Promise<InfoNode[]> {
    const results: InfoNode[] = [];
    for (const node of this.memoryStore.values()) {
      if (node.label === label) {
        results.push(node);
      }
    }
    return results;
  }

  /**
   * Traces the lineage of a thought/element back to its origin.
   */
  async traceLineage(uid: string): Promise<InfoNode[]> {
    const chain: InfoNode[] = [];
    let current = this.memoryStore.get(uid);
    while (current) {
      chain.unshift(current);
      if (current.predecessor) {
        current = this.memoryStore.get(current.predecessor);
      } else {
        current = undefined;
      }
    }
    return chain;
  }
}
