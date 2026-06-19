import { InfoNode } from './types';

/**
 * The Omni Intelligence Warehouse (WanZhiKu).
 * Abstraction for the Knowledge Graph that stores all Omni Elements.
 *
 * In a production environment, this would connect to Neo4j or pgvector.
 * Here we provide an in-memory simulation for rapid prototyping.
 */
export class KnowledgeWarehouse {
  private static instance: KnowledgeWarehouse;
  private store: Map<string, InfoNode>;

  private constructor() {
    this.store = new Map<string, InfoNode>();
  }

  public static getInstance(): KnowledgeWarehouse {
    if (!KnowledgeWarehouse.instance) {
      KnowledgeWarehouse.instance = new KnowledgeWarehouse();
    }
    return KnowledgeWarehouse.instance;
  }

  /**
   * Stores a Trinity Element (InfoNode) into the Knowledge Graph.
   * This is the "Storage" pillar of the Trinity.
   */
  async storeNode(node: InfoNode): Promise<void> {
    // In production: await db.insert(node);
    this.store.set(node.uid, node);
    console.debug(`[KnowledgeWarehouse] Stored node: ${node.uid} (${node.label})`);
  }

  /**
   * Retrieves a Trinity Element by its unique ID.
   */
  async getNode(uid: string): Promise<InfoNode | undefined> {
    return this.store.get(uid);
  }

  /**
   * Retrieves all Elements with a specific Label (i.e., Tag query).
   */
  async getNodesByLabel(label: string): Promise<InfoNode[]> {
    const results: InfoNode[] = [];
    for (const node of this.store.values()) {
      if (node.label === label) {
        results.push(node);
      }
    }
    return results;
  }

  /**
   * Retrieves the reasoning lineage (chain) of a specific node.
   * Visualizes the thought process from origin to current state.
   */
  async getLineage(uid: string): Promise<InfoNode[]> {
    const chain: InfoNode[] = [];
    let current = this.store.get(uid);
    while (current) {
      chain.unshift(current);
      if (current.predecessor) {
        current = this.store.get(current.predecessor);
      } else {
        current = undefined;
      }
    }
    return chain;
  }
}
