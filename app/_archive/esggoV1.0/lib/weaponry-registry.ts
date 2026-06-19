/**
 * Tactical Weaponry (Tool) Registry
 * 管理所有分配給 Agent 小隊的 Genkit Tools 或外部 API 武器庫
 */

export interface TacticalWeapon {
    id: string;
    name: string;
    description: string;
    agentOwner: string;
    status: "ACTIVE" | "IN_DEVELOPMENT" | "OFFLINE";
    schema: string;
    type: "Calculation" | "Verification" | "Retrieval" | "Action";
    minSkillLevel?: number; // 解鎖所需的技能等級
    alignmentRequirement?: number; // 解鎖所需的對齊分數 (0-1)
}

export const TACTICAL_WEAPONRY: TacticalWeapon[] = [
    {
        id: "tool_calc_emissions",
        name: "碳排計算處理器 (calculateEmissions)",
        description: "自動從對話中萃取範疇一、二、三數據，並進行 ISO 14064 級別的加總與風險判定。",
        agentOwner: "GRI 專家代理",
        status: "ACTIVE",
        schema: "Input: { scope1: number, scope2: number, scope3: number }\nOutput: { total_tCO2e: number, status: string }",
        type: "Calculation",
        minSkillLevel: 1
    },
    {
        id: "tool_check_evidence",
        name: "5T 證據核實器 (checkEvidence)",
        description: "校驗特定證據記錄是否通過 5T 協議及 ZKP 認證，並提取底層防篡改 Hash。",
        agentOwner: "審計定錨代理",
        status: "ACTIVE",
        schema: "Input: { recordId: string }\nOutput: { status: string, hash: string }",
        type: "Verification",
        minSkillLevel: 4
    },
    {
        id: "tool_forensic_xray",
        name: "鑑識級 X-Ray 掃描儀 (Forensic_XRay)",
        description: "穿透式審查供應鏈三層級 (Tier-3) 數據，自動識別潛在的綠洗 (Greenwashing) 風險。",
        agentOwner: "OmniSphere",
        status: "ACTIVE",
        schema: "Input: { supplierId: string, depth: number }\nOutput: { riskScore: number, forensicEvidence: string[] }",
        type: "Action",
        minSkillLevel: 8,
        alignmentRequirement: 0.9
    },
    {
        id: "tool_zkp_mask",
        name: "ZKP 隱私遮罩引擎 (generateZKP)",
        description: "對敏感的財務與人事數據執行不可逆的 L3 級別加密遮罩，並產生可驗證的零知識證明。",
        agentOwner: "審計定錨代理",
        status: "ACTIVE",
        schema: "Input: { value: any, level: 'L1'|'L2'|'L3' }\nOutput: { maskedValue: any, proof: string }",
        type: "Action",
        minSkillLevel: 6
    },
    {
        id: "tool_vault_seal",
        name: "誠信保險庫封印 (Vault_Seal)",
        description: "最終級數據定錨工具，將全站 ESG 狀態同步至主權鏈，並生成不可篡改的年度合規證書。",
        agentOwner: "System-Wide",
        status: "IN_DEVELOPMENT",
        schema: "Input: { year: number }\nOutput: { certificateId: string, blockchainHash: string }",
        type: "Action",
        minSkillLevel: 10,
        alignmentRequirement: 0.95
    }
];
