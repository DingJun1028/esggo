import { InfoNode, InfoNodeAttrs, InfoLabel } from './types';
import { uidFromUidPrefix, generateTraceId } from './OmniTag';
import { OmniCrystal } from './OmniCrystal';

/**
 * Omni Element (WanNengElement).
 * The concrete realization of "Info-One Three-In-One" (Omni Trinity).
 *
 * Combines:
 * 1. Omni Tag (Label)
 * 2. Omni Crystal (Eternal Memory/Storage)
 * 3. Reasoning (Logic/Evolution)
 */
export class OmniElement {
  private crystal: OmniCrystal;

  constructor() {
    this.crystal = OmniCrystal.getInstance();
  }

  /**
   * Creates a fresh Omni Element (InfoOne).
   * This is the "God Particle" of the Omni system.
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
        // Omni attributes
        omniId: uid,
        omniLabel: label,
      },
      traceId,
      predecessor: predecessorUid || null,
      createdAt: new Date().toISOString(),
    };

    // 2. Storage: Crystallize into Omni Eternal Memory
    await this.crystal.crystallize(node);

    return node;
  }

  /**
   * Performs reasoning on an existing element to produce a NEW derived element.
   * This represents the dynamic evolution of the Omni Trinity.
   */
  async evolve(
    inputNode: InfoNode,
    newLabel: string,
    evolutionLogic: (attrs: InfoNodeAttrs) => Promise<InfoNodeAttrs>
  ): Promise<InfoNode> {
    console.info(`[Omni] Evolving ${inputNode.uid}...`);

    // 1. Execute logic
    const newAttrs = await evolutionLogic(inputNode.attrs);

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
export const omni = new OmniElement();
