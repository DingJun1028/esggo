/**
 * 夥伴知識庫匯入匯出系統
 * Partner Knowledge Base Import/Export System
 */
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { OmniStore, OmniNamespace } from './OmniStore';

import type {
  AIPartner,
  Skill,
  Rune,
  OmniCard,
  Equipment,
  TalentNode,
  TruthDataLabel,
  KnowledgeBaseInfo,
} from '../../shared/types';

// ============================================================================
// 匯出資料定義
// ============================================================================

export interface PartnerExportData {
  version: string;
  exportedAt: Date;

  // 夥伴基本資料
  partner: AIPartner;

  // 技能樹
  skills: Skill[];

  // 天賦
  talents: TalentNode[];

  // 萬能卡牌
  cards: OmniCard[];

  // 裝備
  equipment: Equipment[];

  // 知識庫
  knowledgeBase: {
    id: string;
    name: string;
    entries: PartnerKnowledgeEntry[];
  }[];

  // 事實標籤
  truthLabels: TruthDataLabel[];

  // 萬能卡牌
  metadata: {
    totalExperience: number;
    totalSkillsUsed: number;
    totalQuestsCompleted: number;
    checksum: string;
  };
}

export interface PartnerKnowledgeEntry {
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
// 匯出服務
// ============================================================================

export class PartnerExportService {
  /**
   * 匯出完整夥伴資料
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
   * 匯出為 JSON 檔案
   */
  async exportToJSON(pId: string): Promise<string> {
    const data = await this.exportPartner(pId);
    return JSON.stringify(data, null, 2);
  }

  /**
   * 匯出技能樹
   */
  async exportSkillTree(pId: string): Promise<Skill[]> {
    omniLogger.info(LogCategory.DATA, `Exporting skill tree`, { pId });
    const skills = await this.loadSkills(pId);
    omniLogger.info(LogCategory.DATA, `Exported ${skills.length} skills`);
    return skills;
  }

  /**
   * 匯出知識庫
   */
  async exportKnowledgeBase(pId: string, kbId?: string): Promise<PartnerKnowledgeEntry[]> {
    omniLogger.info(LogCategory.DATA, `Exporting Knowledge Base`, { pId, kbId });
    const knowledgeBase = await this.loadKnowledgeBase(pId);

    if (kbId) {
      const kb = knowledgeBase.find(k => k.id === kbId);
      return kb ? kb.entries : [];
    }

    return knowledgeBase.flatMap(kb => kb.entries);
  }

  // ========== 私有方法 ==========

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
// 匯入服務
// ============================================================================

export class PartnerImportService {
  /**
   * 匯入完整夥伴資料
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

    // 1. 驗證版本
    if (data.version !== '2.0.0') {
      errors.push(`Version mismatch: ${data.version} (required 2.0.0)`);
    }

    // 2. 驗證校驗碼
    const checksum = this.generateChecksum(data.partner, data.skills, data.talents);
    if (checksum !== data.metadata.checksum) {
      errors.push('Checksum mismatch, data might be corrupted');
    }

    if (errors.length > 0) {
      omniLogger.warn(LogCategory.DATA, `Import validation failed`, { errors });
      return { success: false, errors };
    }

    try {
      // 3. 創建夥伴
      const partnerId = await this.createPartner(data.partner, userId);

      // 4. 匯入技能
      await this.importSkills(partnerId, data.skills);

      // 5. 匯入天賦
      await this.importTalents(partnerId, data.talents);

      // 6. 匯入卡牌
      await this.importCards(partnerId, data.cards);

      // 7. 匯入裝備
      await this.importEquipment(partnerId, data.equipment);

      // 8. 匯入知識庫
      await this.importKnowledgeBase(partnerId, data.knowledgeBase);

      // 9. 匯入事實標籤
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
   * 匯入技能樹
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
   * 匯入知識庫
   */
  async importKnowledgeEntries(
    partnerId: string,
    kbId: string,
    entries: PartnerKnowledgeEntry[]
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

  // ========== 私有方法 ==========

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
// 實例導出
// ============================================================================

export const partnerExport = new PartnerExportService();
export const partnerImport = new PartnerImportService();
