// Server-side logic for the API route
import { MaterialityIssue } from '../types/ncb-types';

import { createOmniHeart } from '../omni-heart';

const DEFAULT_MATERIALITY: MaterialityIssue[] = [
    {
        id: "M-001",
        topic: "能源管理與溫室氣體排放",
        category: "E",
        description: "管控生產過程中的能源消耗及溫室氣體排放，降低氣候變遷風險。",
        gri_mapping: ["GRI 302", "GRI 305"],
        sasb_mapping: "EM-MM-110a.1",
        omniHeart: createOmniHeart("Environment", "CarbonEmission", "Source_TPC_API")
    },
    {
        id: "M-002",
        topic: "職業健康與安全",
        category: "S",
        description: "保障員工工作環境的安全與健康，落實零職災目標。",
        gri_mapping: ["GRI 403"],
        sasb_mapping: "EM-MM-320a.1",
        omniHeart: createOmniHeart("Social", "OccupationalSafety", "Source_HR_Manual")
    },
    {
        id: "M-003",
        topic: "企業倫理與誠信經營",
        category: "G",
        description: "建立透明的治理架構，落實反貪腐與公平競爭。",
        gri_mapping: ["GRI 205", "GRI 206"],
        sasb_mapping: "EM-MM-510a.1",
        omniHeart: createOmniHeart("Governance", "Ethics", "Source_Audit_Committee")
    },
    {
        id: "M-004",
        topic: "水資源管理",
        category: "E",
        description: "優化水資源回收利用，減少對當地水源的衝擊。",
        gri_mapping: ["GRI 303"],
        sasb_mapping: "EM-MM-140a.1",
        omniHeart: createOmniHeart("Environment", "WaterManagement", "Source_Water_Board")
    },
    {
        id: "M-005",
        topic: "供應鏈人權與勞動實務",
        category: "S",
        description: "監督供應鏈勞動條件，確保無強迫勞動與童工現象。",
        gri_mapping: ["GRI 407", "GRI 408", "GRI 409"],
        sasb_mapping: "EM-MM-310a.1",
        omniHeart: createOmniHeart("Social", "SupplyChain", "Source_Supplier_Audit")
    },
    {
        id: "M-006",
        topic: "廢棄物與循環經濟",
        category: "E",
        description: "推動廢棄物減量與資源化，實現閉環生產模式。",
        gri_mapping: ["GRI 306"],
        sasb_mapping: "EM-MM-150a.1",
        omniHeart: createOmniHeart("Environment", "WasteManagement", "Source_Circular_Engine")
    },
    {
        id: "M-007",
        topic: "生物多樣性保護",
        category: "E",
        description: "保護營運所在地生態系統，降低對生物多樣性的負面影響。",
        gri_mapping: ["GRI 304"],
        sasb_mapping: "EM-MM-160a.1",
        omniHeart: createOmniHeart("Environment", "Biodiversity", "Source_Ecological_Survey")
    },
    {
        id: "M-008",
        topic: "數據隱私與網絡安全",
        category: "G",
        description: "強化 ZK-Privacy 數據防護，確保利害關係人資訊安全。",
        gri_mapping: ["GRI 418"],
        sasb_mapping: "EM-MM-230a.1",
        omniHeart: createOmniHeart("Governance", "DataPrivacy", "Source_ZKP_Engine")
    }
];

export async function getMaterialityIssues(): Promise<MaterialityIssue[]> {
    return DEFAULT_MATERIALITY;
}
