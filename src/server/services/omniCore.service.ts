// src/server/services/omniCore.service.ts
import { OmniCoreRepository } from '../repositories/omniCore.repository';
import type { OmniCoreRecord, OmniCoreMatrix } from '../../shared/types/omniCore.types';

export class OmniCoreService {
  private repo = new OmniCoreRepository();

  /**
   * Create or update the core record for a component.
   * If the record does not exist it will be inserted; otherwise the matrix/crystal/etc. are overwritten.
   */
  async upsertCore(componentId: string, version: string, matrix: OmniCoreMatrix = {}, crystal: Record<string, unknown> = {}, eternalMemory: Record<string, unknown> = {}): Promise<OmniCoreRecord | undefined> {
    const record: OmniCoreRecord = {
      id: `core-${componentId}`,
      componentId,
      version,
      crystal,
      eternalMemory,
      matrix,
    };
    return this.repo.upsert(record);
  }

  /** Retrieve the core record for a given component */
  async getCore(componentId: string) {
    return this.repo.getByComponentId(componentId);
  }
}

export const omniCoreService = new OmniCoreService();
