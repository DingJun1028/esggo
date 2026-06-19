/**
 * Partner Knowledge Base Import/Export System
 */
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { OmniStore, OmniNamespace } from './OmniStore.js';

import type {
  AIPartner,
  Skill,
  Rune,
  OmniCard,
  Equipment,
  TalentNode,
  TruthDataLabel,
  KnowledgeBaseInfo,
} from '../../shared/types.js';

// ============================================================================
// Export Data Definition
// ============================================================================

export interface PartnerExportData {
  version: string;
  exportedAt: Date;

  // Partner basic data
  partner: AIPartner;

  // Skills
  skills: Skill[];

  // Talents
  talents: TalentNode[];

  // Cards
  cards: OmniCard[];

  // Equipment
  equipment: Equipment[];

  // Knowledge Base
  knowledgeBase: {
    id: string;
    name: string;
    entries: KnowledgeEntry[];
  }[];

  // Truth Labels
  truthLabels: TruthDataLabel[];

  // Metadata
  metadata: {
    totalExperience: number;
    totalSkillsUsed: number;
    totalQuestsCompleted: number;
    checksum: string;
  };
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Export Service
// ============================================================================

export class PartnerExportService {
  /**
   * Export complete partner info
   */
  async exportPartner(pId: string): Promise<PartnerExportData> {
    omniLogger.info(LogCategory.DATA, `Starting partner export`, { pId });

    // Load data from OmniStore persistence layer
    const partner = await this.loadPartner(pId);
    const skills = await this.loadSkills(pId);
    const talents = await this.loadTalents(pId);
    const cards = await this.loadCards(pId);
    const equipment = await this.loadEquipment(pId);
    const knowledgeBase = await this.loadKnowledgeBase(pId);
    const truthLabels = await this.loadTruthLabels(pId);

    const exportData: PartnerExportData = {
      version: '2.0.0',
      exportedAt: new Date(),
      partner,
      skills,
      talents,
      cards,
      equipment,
      knowledgeBase,
      truthLabels,
      metadata: {
        totalExperience: partner.experience,
        totalSkillsUsed: partner.growth.totalSkillsUsed,
        totalQuestsCompleted: partner.growth.questsCompleted,
        checksum: this.generateChecksum(partner, skills, talents),
      },
    };

    omniLogger.info(LogCategory.DATA, 'Export complete', {
      skills: skills.length,
      talents: talents.length,
      cards: cards.length,
      equipment: equipment.length,
      knowledgeEntries: knowledgeBase.reduce((sum, kb) => sum + kb.entries.length, 0),
    });

    return exportData;
  }

  /**
   * Export to JSON file
   */
  async exportToJSON(pId: string): Promise<string> {
    const data = await this.exportPartner(pId);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export skill tree
   */
  async exportSkillTree(pId: string): Promise<Skill[]> {
    omniLogger.info(LogCategory.DATA, `Exporting skill tree`, { pId });
    const skills = await this.loadSkills(pId);
    omniLogger.info(LogCategory.DATA, `Exported ${skills.length} skills`);
    return skills;
  }

  /**
   * Export knowledge base
   */
  async exportKnowledgeBase(pId: string, kbId?: string): Promise<KnowledgeEntry[]> {
    omniLogger.info(LogCategory.DATA, `Exporting Knowledge Base`, { pId, kbId });
    const knowledgeBase = await this.loadKnowledgeBase(pId);

    if (kbId) {
      const kb = knowledgeBase.find(k => k.id === kbId);
      return kb ? kb.entries : [];
    }

    return knowledgeBase.flatMap(kb => kb.entries);
  }

  // ========== Private Methods ==========

  private async loadPartner(partnerId: string): Promise<AIPartner> {
    const res = OmniStore.getItem<AIPartner>(OmniNamespace.PARTNER, partnerId);
    if (res.success && res.data) return res.data;

    // Fallback to active ID if partnerId is generic
    const activeRes = OmniStore.getItem<string>(OmniNamespace.PARTNER, 'current_id');
    if (activeRes.success && activeRes.data) {
      const pRes = OmniStore.getItem<AIPartner>(OmniNamespace.PARTNER, activeRes.data);
      if (pRes.success && pRes.data) return pRes.data;
    }

    return {} as AIPartner;
  }

  private async loadSkills(partnerId: string): Promise<Skill[]> {
    const res = OmniStore.getItem<Skill[]>(OmniNamespace.PARTNER, `${partnerId}_skills`);
    return res.success && res.data ? res.data : [];
  }

  private async loadTalents(partnerId: string): Promise<TalentNode[]> {
    const res = OmniStore.getItem<TalentNode[]>(OmniNamespace.PARTNER, `${partnerId}_talents`);
    return res.success && res.data ? res.data : [];
  }

  private async loadCards(partnerId: string): Promise<OmniCard[]> {
    const res = OmniStore.getItem<OmniCard[]>(OmniNamespace.PARTNER, `${partnerId}_cards`);
    return res.success && res.data ? res.data : [];
  }

  private async loadEquipment(partnerId: string): Promise<Equipment[]> {
    const res = OmniStore.getItem<Equipment[]>(OmniNamespace.PARTNER, `${partnerId}_equipment`);
    return res.success && res.data ? res.data : [];
  }

  private async loadKnowledgeBase(partnerId: string): Promise<any[]> {
    const res = OmniStore.getItem<any[]>(OmniNamespace.SYSTEM, `knowledge_${partnerId}`);
    return res.success && res.data ? res.data : [];
  }

  private async loadTruthLabels(partnerId: string): Promise<TruthDataLabel[]> {
    const res = OmniStore.getItem<TruthDataLabel[]>(OmniNamespace.SYSTEM, `labels_${partnerId}`);
    return res.success && res.data ? res.data : [];
  }

  private generateChecksum(partner: any, skills: any[], talents: any[]): string {
    const data = JSON.stringify({ partner, skills, talents });
    // Browser-compatible Base64
    try {
      return btoa(unescape(encodeURIComponent(data))).substring(0, 32);
    } catch (e) {
      return 'checksum_fallback';
    }
  }
}

// ============================================================================
// Import Service
// ============================================================================

export class PartnerImportService {
  /**
   * Import complete partner info
   */
  async importPartner(
    data: PartnerExportData,
    userId: string
  ): Promise<{
    success: boolean;
    partnerId?: string;
    errors: string[];
  }> {
    omniLogger.info(LogCategory.DATA, `Starting partner import`, { userId });
    const errors: string[] = [];

    // 1. Verify version
    if (data.version !== '2.0.0') {
      errors.push(`Version mismatch: ${data.version} (required 2.0.0)`);
    }

    // 2. Verify checksum
    const checksum = this.generateChecksum(data.partner, data.skills, data.talents);
    if (checksum !== data.metadata.checksum) {
      errors.push('Checksum mismatch, data might be corrupted');
    }

    if (errors.length > 0) {
      omniLogger.warn(LogCategory.DATA, `Import validation failed`, { errors });
      return { success: false, errors };
    }

    try {
      // 3. Create partner
      const partnerId = await this.createPartner(data.partner, userId);

      // 4. Import skills
      await this.importSkills(partnerId, data.skills);

      // 5. Import talents
      await this.importTalents(partnerId, data.talents);

      // 6. Import cards
      await this.importCards(partnerId, data.cards);

      // 7. Import equipment
      await this.importEquipment(partnerId, data.equipment);

      // 8. Import knowledge base
      await this.importKnowledgeBase(partnerId, data.knowledgeBase);

      // 9. Import truth labels
      await this.importTruthLabels(partnerId, data.truthLabels);

      omniLogger.info(LogCategory.DATA, `Import complete`, { partnerId });
      return { success: true, partnerId, errors: [] };
    } catch (error) {
      omniLogger.error(LogCategory.DATA, `Import failed`, { error });
      errors.push(`Import failed: ${error}`);
      return { success: false, errors };
    }
  }

  /**
   * Import skill tree
   */
  async importSkillTree(partnerId: string, skills: Skill[]): Promise<boolean> {
    omniLogger.info(LogCategory.DATA, `Importing skill tree`, {
      partnerId,
      skillCount: skills.length,
    });

    try {
      await this.importSkills(partnerId, skills);
      omniLogger.info(LogCategory.DATA, `Skill tree import complete`);
      return true;
    } catch (error) {
      omniLogger.error(LogCategory.DATA, `Skill tree import failed`, { error });
      return false;
    }
  }

  /**
   * Import knowledge entries
   */
  async importKnowledgeEntries(
    partnerId: string,
    kbId: string,
    entries: KnowledgeEntry[]
  ): Promise<boolean> {
    omniLogger.info(LogCategory.DATA, `Importing knowledge`, {
      partnerId,
      kbId,
      entryCount: entries.length,
    });

    try {
      // OmniStore Persistence
      let existingBytes =
        OmniStore.getItem<any[]>(OmniNamespace.SYSTEM, `knowledge_${partnerId}`).data || [];
      existingBytes = [...existingBytes, ...entries]; // Simple append for gap filling
      OmniStore.setItem(OmniNamespace.SYSTEM, `knowledge_${partnerId}`, existingBytes);

      omniLogger.info(LogCategory.DATA, 'OmniStore: Imported Knowledge Entries', {
        partnerId,
        kbId,
        count: entries.length,
      });
      omniLogger.info(LogCategory.DATA, `Knowledge import complete`);
      return true;
    } catch (error) {
      omniLogger.error(LogCategory.DATA, `Knowledge import failed`, { error });
      return false;
    }
  }

  // ========== Private Methods ==========

  // Shared mock DB reference would typically go here or be injected
  // For this gap filling, we'll log the "writes" to simulate persistence

  private async createPartner(partner: AIPartner, userId: string): Promise<string> {
    const partnerId = `partner_${Date.now()}`;
    // Preserve original ID if implementing restore logic, but for new creates generate one
    // For import, we might want to respect the ID in the file or generate new
    // Here we assume new import = new persistence
    OmniStore.setItem(OmniNamespace.PARTNER, partnerId, partner);
    OmniStore.setItem(OmniNamespace.PARTNER, 'current_id', partnerId); // Set as active
    omniLogger.info(LogCategory.DATA, 'OmniStore: Created Partner', { userId, partnerId });
    return partnerId;
  }

  private async importSkills(partnerId: string, skills: Skill[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.PARTNER, `${partnerId}_skills`, skills);
  }

  private async importTalents(partnerId: string, talents: TalentNode[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.PARTNER, `${partnerId}_talents`, talents);
  }

  private async importCards(partnerId: string, cards: OmniCard[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.PARTNER, `${partnerId}_cards`, cards);
  }

  private async importEquipment(partnerId: string, equipment: Equipment[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.PARTNER, `${partnerId}_equipment`, equipment);
  }

  private async importKnowledgeBase(partnerId: string, knowledgeBase: any[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.SYSTEM, `knowledge_${partnerId}`, knowledgeBase);
  }

  private async importTruthLabels(partnerId: string, labels: TruthDataLabel[]): Promise<void> {
    OmniStore.setItem(OmniNamespace.SYSTEM, `labels_${partnerId}`, labels);
  }

  private generateChecksum(partner: any, skills: any[], talents: any[]): string {
    const data = JSON.stringify({ partner, skills, talents });
    try {
      return btoa(unescape(encodeURIComponent(data))).substring(0, 32);
    } catch (e) {
      return 'checksum_fallback';
    }
  }
}

// ============================================================================
// Service Instances
// ============================================================================

export const partnerExport = new PartnerExportService();
export const partnerImport = new PartnerImportService();
