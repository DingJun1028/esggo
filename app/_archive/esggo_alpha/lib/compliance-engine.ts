/**
 * Compliance Engine for ESGGo
 * Maps 5T Trust nodes to global regulatory standards (CSRD, ESRS, SASB, IFRS).
 */
import { IntegrityCheck } from "@/types";

export type RegulatoryStandard = 'SASB' | 'CSRD' | 'IFRS' | 'ESRS' | 'TaiwanFSC';

export interface ComplianceMapping {
    standard: RegulatoryStandard;
    disclosureId: string;
    requirementName: string;
    mappingConfidence: number;
    description: string;
}

const GLOBAL_MAPPINGS: Record<RegulatoryStandard, ComplianceMapping[]> = {
    'CSRD': [
        {
            standard: 'CSRD',
            disclosureId: 'ESRS E1-1',
            requirementName: 'Transition plan for climate change mitigation',
            mappingConfidence: 0.98,
            description: 'Maps to 5T Carbon Integrity Node. Requires verified historical emissions data.'
        },
        {
            standard: 'CSRD',
            disclosureId: 'ESRS S1-1',
            requirementName: 'Policies related to own workforce',
            mappingConfidence: 0.92,
            description: 'Maps to 5T Social Equity Node. Verified via labor audit documents.'
        }
    ],
    'SASB': [
        {
            standard: 'SASB',
            disclosureId: 'EM-EP-110a.1',
            requirementName: 'Gross global Scope 1 emissions',
            mappingConfidence: 0.99,
            description: 'Direct mapping to Verified Carbon Tracking data.'
        }
    ],
    'TaiwanFSC': [
        {
            standard: 'TaiwanFSC',
            disclosureId: 'TW-ESG-01',
            requirementName: '綠色能源使用比例',
            mappingConfidence: 0.95,
            description: '對應 5T 能源轉型節點。需包含可再生能源採購證書 (REC)。'
        }
    ],
    'IFRS': [
        {
            standard: 'IFRS',
            disclosureId: 'IFRS S1',
            requirementName: 'General Requirements for Disclosure of Sustainability-related Financial Information',
            mappingConfidence: 0.95,
            description: 'Core governance and risk management mapping. Linked to 5T Governance Node.'
        },
        {
            standard: 'IFRS',
            disclosureId: 'IFRS S2',
            requirementName: 'Climate-related Disclosures',
            mappingConfidence: 0.97,
            description: 'Physical & transition risk mapping. Linked to 5T Resilience Node.'
        }
    ],
    'ESRS': [
        {
            standard: 'ESRS',
            disclosureId: 'ESRS 2',
            requirementName: 'General disclosures',
            mappingConfidence: 0.94,
            description: 'Basis for preparation. Linked to 5T Transparency Node.'
        }
    ]
};

/**
 * Calculates the compliance readiness score for a specific dataset
 */
export function calculateComplianceScore(verifiedNodes: string[], targetStandard: RegulatoryStandard): number {
    const requirements = GLOBAL_MAPPINGS[targetStandard] || [];
    if (requirements.length === 0) return 100;

    // Simulate mapping logic: check if data nodes cover requirements
    const covered = requirements.filter(req => {
        // Simple mock: if standard is TaiwanFSC, we need energy nodes
        if (targetStandard === 'TaiwanFSC') return verifiedNodes.includes('energy') || verifiedNodes.includes('E');
        if (targetStandard === 'CSRD') return (verifiedNodes.includes('carbon') || verifiedNodes.includes('E')) && (verifiedNodes.includes('labor') || verifiedNodes.includes('S'));
        return verifiedNodes.length > 0;
    });

    return Math.round((covered.length / requirements.length) * 100);
}

/**
 * Returns available disclosures for a given standard
 */
export function getDisclosuresForStandard(standard: RegulatoryStandard): ComplianceMapping[] {
    return GLOBAL_MAPPINGS[standard] || [];
}

/**
 * Maps requirements to frontend indicator format
 */
export function getComplianceIndicators(verifiedNodes: string[], targetStandard: RegulatoryStandard = 'TaiwanFSC') {
    const list = [
        { id: "E1-1", req: "碳盤查與溫室氣體排放量", category: "E", nodeReq: "E" },
        { id: "E1-2", req: "能源消耗與能源效率", category: "E", nodeReq: "E" },
        { id: "S2-1", req: "員工教育訓練與發展", category: "S", nodeReq: "S" },
        { id: "G3-1", req: "董事會多元化與獨立性", category: "G", nodeReq: "G" },
        { id: "E2-4", req: "廢棄物集體管理", category: "E", nodeReq: "E" },
        { id: "S1-5", req: "職業安全與健康規範", category: "S", nodeReq: "S" },
    ];

    return list.map(item => {
        const isVerified = verifiedNodes.includes(item.nodeReq) || verifiedNodes.includes('ALL');
        // If not fully verified, give partial progress based on presence of nodes
        const progress = isVerified ? 100 : (verifiedNodes.length > 0 ? 40 : 0);
        const status = isVerified ? 'completed' : (progress > 0 ? 'inProgress' : 'missing');

        return {
            id: item.id,
            req: item.req,
            status,
            category: item.category,
            progress
        };
    });
}

/**
 * Keywords mapping for compliance indicators
 */
export const KEYWORDS_MAPPING: Record<string, string[]> = {
    "E1-1": ["碳盤查", "溫室氣體", "排放量", "Scope 1", "Scope 2", "Scope 3", "碳足跡", "GHG"],
    "E1-2": ["能源", "消耗", "效率", "電力", "再生能源", "節能", "PUE", "能耗"],
    "S2-1": ["教育訓練", "員工發展", "培訓", "時數", "職能", "人才", "課程"],
    "G3-1": ["董事會", "多元化", "獨立性", "治理", "薪酬", "稽核", "誠信", "提名"],
    "E2-4": ["廢棄物", "回收", "管理", "循環", "處理", "減量", "資源化"],
    "S1-5": ["職業安全", "健康", "工安", "職災", "防護", "勞安", "ISO 45001"],
};

/**
 * Analyzes content for compliance indicators based on keywords.
 * Returns indicators, trace ID, and integrity seal for 5T protocol.
 */
export function analyzeCompliance(content: string, title?: string): {
    alignedIndicators: string[],
    traceId: string,
    integritySeal: IntegrityCheck
} {
    const found: string[] = [];
    Object.entries(KEYWORDS_MAPPING).forEach(([id, keywords]) => {
        if (keywords.some(word => content.includes(word))) {
            found.push(id);
        }
    });

    // Mock trace and integrity for prototype
    const traceId = `compliance-tr-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    return {
        alignedIndicators: found,
        traceId,
        integritySeal: {
            status: "GUARANTEED",
            mark: `5T-SIG-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
            protocol: "GCP-COMPLIANCE-TRUST-v1",
            timestamp: new Date().toISOString(),
            signer: "ESGGo Compliance Engine (TrustNode)"
        }
    };
}
