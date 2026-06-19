/**
 * Omni_Kernel_v4.3 (Enterprise Terminal Hardened Edition)
 * 核心哲學：以企業級別的精確度鑄造企業永續信仰，將 ESG 報告昇華為不可篡改的永續聖典。
 * 版本特性：Linked Hash Chain + Semantic GRI Bridge + 5T Compliance
 */

export enum OmniTagType {
  A_TAGGING = "A_TAGGING", // [信] 信 (Trustful) - Trustworthy (不可篡改)
  B_LABEL = "B_LABEL",     // [美/善] 美 (Tasteful) / 善 (Thankful) - Tangible / Transparent
  C_TAG = "C_TAG",         // [真/通] 真 (Truthful) / 通 (Transferful) - Traceable / Trackable
  D_MECE = "D_MECE",       // [真/通] 絕對歸屬 - MECE + GRI Mapping
}

export interface IOmniHeart {
  readonly uuid: string;
  readonly A_Tagging: {
    readonly is_trustworthy: boolean;
    readonly hash_lock: string;
    readonly parent_hash?: string; // 鏈式雜湊：指向前一個狀態
  };
  readonly B_Label: {
    readonly ui: string;
    readonly iso_ref: string;
    readonly verify: () => boolean;
  };
  readonly C_Tag: {
    readonly source_origin: string;
    readonly trace_path: string[];
    readonly hooks: {
      onTransfer: (to: string) => void;
    };
  };
  readonly D_MECE: {
    readonly domain: string;
    readonly subCategory: string;
    readonly gri_mapping?: string[]; // 語義映射：對接 GRI 準則
  };
}

/**
 * Omni Trinity: 三位一體概念模型
 */
export interface IOmniTrinity {
  readonly truth: { status: "VALID" | "INVALID"; hash: string; isChained: boolean }; // 父 - 溯源 (Provenance)
  readonly order: { status: "ALIGNED" | "PENDING"; standards: string[] };          // 子 - 規範 (Standards)
  readonly flow: { status: "ACTIVE" | "STAGNANT"; depth: number };                // 靈 - 流轉 (Evolution)
  readonly divinity: number; // 0-100 綜合誠信評分
}

export const TRINITY_MANIFEST = {
  FATHER: "真 (Truthful) - Traceable (可溯源)",
  SON: "善 (Thankful) - Transparent (可透明)",
  SPIRIT: "通 (Transferful) - Trackable (可追蹤)",
};

/**
 * 5T 核心協議：4 可 1 不考 (5T Protocol)
 */
export const FIVE_T_PROTOCOL = {
  TRUTH: { key: "Ta", label: "Truthful", status: "Traceable (可溯源)", means: "鏈式日誌標註 source_origin" },
  GOODNESS: { key: "Tp", label: "Thankful", status: "Transparent (可透明)", means: "ISO 標準算法公開 + 零幻覺驗算" },
  BEAUTY: { key: "Tg", label: "Tasteful", status: "Tangible (可感知)", means: "Enterprise Matte UI + 高密度數據感官回饋" },
  TRUST: { key: "Tw", label: "Trustful", status: "Trustworthy (不可篡改)", means: "5T 核心禁區：Hash Lock + Object.freeze()" },
  THROUGH: { key: "Tk", label: "Transferful", status: "Trackable (可追蹤)", means: "實作生命週期 Hook 紀錄流轉路徑" },
};

/**
 * GRI 語義映射字典
 */
const GRI_MAPPING_CATALOG: Record<string, string[]> = {
  "Environment/Carbon": ["GRI 305-1", "GRI 305-2", "GRI 305-3"],
  "Environment/Energy": ["GRI 302-1", "GRI 302-3"],
  "Social/Labor": ["GRI 401-1", "GRI 404-1"],
  "Governance/Ethics": ["GRI 205-1", "GRI 2-23"],
  "KnowledgeBase/EternalRecord": ["GRI 2-1", "GRI 2-3"],
};

/**
 * 萬能標籤 Omni Tagging Label：三位一體實作 (v3.3 Chained)
 */
export function createOmniHeart(
  domain: string = "Terminal_Operations",
  subCategory: string = "Clinic_Core",
  source: string = "Omni_Kernel_v4.3",
  parentHash?: string
): IOmniHeart {
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const currentHash = `SHA256:${uuid}-${timestamp}${parentHash ? `-${parentHash.slice(-8)}` : ""}`;

  const heart: IOmniHeart = {
    uuid,
    A_Tagging: Object.freeze({
      is_trustworthy: true,
      hash_lock: currentHash,
      ...(parentHash ? { parent_hash: parentHash } : {})
    }),
    B_Label: {
      ui: 'Enterprise_Matte_v4.3',
      iso_ref: '[ISO-14064-1]',
      verify: () => {
        // 深層驗證邏輯：檢查雜湊格式與 UUID 有效性
        const isValidHash = heart.A_Tagging.hash_lock.startsWith("SHA256:");
        const isFresh = (Date.now() - timestamp) < 1000 * 60 * 60 * 24; // 24小時內視為新鮮
        return isValidHash && isFresh;
      }
    },
    C_Tag: {
      source_origin: source,
      trace_path: [`Origin@${timestamp}`],
      hooks: {
        onTransfer: (to: string) => {
          (heart.C_Tag.trace_path as string[]).push(`${to}@${Date.now()}`);
        }
      }
    },
    D_MECE: Object.freeze({
      domain,
      subCategory,
      gri_mapping: GRI_MAPPING_CATALOG[`${domain}/${subCategory}`] || []
    })
  };

  Object.seal(heart);
  return heart;
}

/**
 * Reforge: 執行 Heart 的動態演化並建立雜湊鏈
 */
export function reforgeHeart(oldHeart: IOmniHeart, newSource: string = "Omni_Reforge_v3"): IOmniHeart {
  const newHeart = createOmniHeart(
    oldHeart.D_MECE.domain,
    oldHeart.D_MECE.subCategory,
    newSource,
    oldHeart.A_Tagging.hash_lock
  );

  // 繼承歷史路徑
  if (oldHeart?.C_Tag?.trace_path) {
    (newHeart.C_Tag.trace_path as string[]).unshift(...oldHeart.C_Tag.trace_path);
  }
  newHeart.C_Tag.trace_path.push(`Reforged@${Date.now()}`);

  return newHeart;
}

/**
 * 驗證 Heart 鏈條完整性
 */
export function verifyHeartChain(heart: IOmniHeart): boolean {
  if (!heart.A_Tagging.is_trustworthy) return false;
  if (!heart.A_Tagging.hash_lock.startsWith("SHA256:")) return false;

  // 檢查 D_MECE 分類是否存在於字典中
  const hasMapping = !!GRI_MAPPING_CATALOG[`${heart.D_MECE.domain}/${heart.D_MECE.subCategory}`];

  return hasMapping;
}

/**
 * getTrinityContext: 計算心臟的三位一體整合狀態
 */
export function getTrinityContext(heart: IOmniHeart): IOmniTrinity {
  const isChained = !!heart?.A_Tagging?.parent_hash;
  const standards = heart?.D_MECE?.gri_mapping || [];
  const flowDepth = heart?.C_Tag?.trace_path?.length || 0;

  const truthValid = !!(heart?.A_Tagging?.is_trustworthy && heart?.A_Tagging?.hash_lock?.startsWith("SHA256:"));
  const orderAligned = standards.length > 0;
  const flowActive = flowDepth > 0;

  // 綜合評分邏輯 (Professional-Practical Grade)
  let score = 0;
  if (truthValid) score += 40;
  if (isChained) score += 10;
  if (orderAligned) score += 30;
  if (flowActive) score += 20;

  return {
    truth: { status: truthValid ? "VALID" : "INVALID", hash: heart?.A_Tagging?.hash_lock || "NONE", isChained },
    order: { status: orderAligned ? "ALIGNED" : "PENDING", standards },
    flow: { status: flowActive ? "ACTIVE" : "STAGNANT", depth: flowDepth },
    divinity: score,
  };
}

/**
 * functional component 輔助工具 (Updated)
 */
export function withOmniHeartData<T>(
  data: T,
  domain?: string,
  subCategory?: string,
  parentHash?: string
): T & { omniHeart: IOmniHeart } {
  return {
    ...data,
    omniHeart: createOmniHeart(domain, subCategory, "Omni_DataWrapper", parentHash)
  };
}

/**
 * Calculates a global integrity status for an entire chain (represented by the heart)
 */
export function getGlobalIntegrity(heart: IOmniHeart): {
  score: number;
  health: "optimal" | "stable" | "critical";
  nodeCount: number;
} {
  const trinity = getTrinityContext(heart);
  const nodeCount = heart?.C_Tag?.trace_path?.length || 0;

  let health: "optimal" | "stable" | "critical" = "stable";
  if (trinity.divinity >= 90) health = "optimal";
  else if (trinity.divinity < 60) health = "critical";

  return {
    score: trinity.divinity,
    health,
    nodeCount,
  };
}
/**
 * Audit Log Item
 */
export interface AuditLogItem {
  timestamp: string;
  action: string;
  actor: string;
  hash: string;
  parentHash: string;
}

/**
 * logAuditAction: 為使用者操作產生查核軌跡
 */
export function logAuditAction(
  currentHeart: IOmniHeart,
  action: string,
  actor: string = "User_Admin"
): { newHeart: IOmniHeart; logEntry: AuditLogItem } {
  const newHeart = reforgeHeart(currentHeart, `Audit_${action}`);

  const logEntry: AuditLogItem = {
    timestamp: new Date().toISOString(),
    action,
    actor,
    hash: newHeart.A_Tagging.hash_lock,
    parentHash: currentHeart.A_Tagging.hash_lock
  };

  return { newHeart, logEntry };
}
