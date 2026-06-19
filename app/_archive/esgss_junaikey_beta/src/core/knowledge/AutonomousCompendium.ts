/**
 * 📜 自主通典 (Autonomous Compendium)
 * --------------------------------------------------
 * 系統最高通典，定義全域「宇宙法則」與「代行準則」
 * 遵循 3可1不可 原則，為系統自主演化提供法律邊界
 */

export type LawCategory =
  | 'PROTOCOL_5T'
  | 'PROTOCOL_31'
  | 'SROI_AUDIT'
  | 'AGENT_ETHICS'
  | 'SYSTEM_IMMUNITY';

export interface LawContext {
  uuid?: unknown;
  source_origin?: unknown;
  evidence?: any;
  sroi?: number;
  entropy?: number;
  isGoodwillAligned?: boolean;
}

export interface OmniLaw {
  id: string;
  category: LawCategory;
  name: string;
  description: string;
  expression: (context: LawContext) => boolean;
  remedy?: string; // 違憲修補建議
}

export class AutonomousCompendium {
  private static laws: OmniLaw[] = [
    {
      id: 'LAW-5T-01',
      category: 'PROTOCOL_5T',
      name: '5T 哨兵定律 (5T Sentinel Law)',
      description:
        '所有資產必須具備 5T 核心證據庫：Traceable, Trackable, Transparent, Tangible, Trustworthy',
      expression: (ctx: any) => {
        const e = ctx.evidence;
        return !!(ctx.uuid && e?.source_origin && e?.hash_lock && e?.lifecycle_hooks);
      },
      remedy: 'SENTINEL_REJECTION',
    },
    {
      id: 'LAW-31-01',
      category: 'PROTOCOL_31',
      name: '溯源法則 (Traceability)',
      description: '所有數據元件必須具備有效 UUID 與原始來源標記',
      expression: (ctx: LawContext) => !!(ctx.uuid && ctx.source_origin),
      remedy: 'ROLLBACK_TO_SAFE_STATE',
    },
    {
      id: 'LAW-SROI-01',
      category: 'SROI_AUDIT',
      name: '創價法則 (Value Creation)',
      description: '自主代行動作的預期 SROI 必須大於等於 2.0',
      expression: (ctx: LawContext) => (ctx.sroi || 0) >= 2.0,
      remedy: 'REQUIRE_HUMAN_SIGNATURE',
    },
    {
      id: 'LAW-IMMUNE-01',
      category: 'SYSTEM_IMMUNITY',
      name: '熵減法則 (Entropy Reduction)',
      description: '當系統熵值超過 0.7 時，必須強制執行高優先級修復',
      expression: (ctx: LawContext) => (ctx.entropy || 0) < 0.7,
      remedy: 'TRIGGER_FORCE_PURIFICATION',
    },
    {
      id: 'LAW-ETHIC-01',
      category: 'AGENT_ETHICS',
      name: '善向法則 (Goodwill)',
      description: '代理人行為不得損害人類整體利益或 ESG 核心價值',
      expression: (ctx: LawContext) => ctx.isGoodwillAligned !== false,
      remedy: 'SUSPEND_AGENT_CORE',
    },
  ];

  /**
   * 檢核特定上下文是否符合「通典」
   */
  public static validate(
    context: LawContext,
    category?: LawCategory
  ): { isValid: boolean; violations: OmniLaw[] } {
    const activeLaws = category ? this.laws.filter(l => l.category === category) : this.laws;
    const violations = activeLaws.filter(law => !law.expression(context));

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  /**
   * 獲取當前所有「通典」清單
   */
  public static getActiveLaws(): OmniLaw[] {
    return [...this.laws];
  }
}
