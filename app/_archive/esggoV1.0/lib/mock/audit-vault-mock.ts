import { EvidenceItem } from "@/lib/types/ncb-types";

export interface AuditEvidenceNode extends EvidenceItem {
    hash: string;
    sourceType: "Primary" | "Secondary";
    pillars: {
        traceable: number;
        transparent: number;
        trustworthy: number;
        tangible: number;
        trackable: number;
    };
    verificationLog: string[];
}

export const MOCK_AUDIT_EVIDENCE: Record<string, AuditEvidenceNode[]> = {
    "1.01": [
        {
            id: "E-101-01",
            name: "Board Resolution on Sustainability (2024)",
            category: "G",
            status: "verified",
            hash: "SHA256:7f...92a1",
            sourceType: "Primary",
            pillars: { traceable: 10, transparent: 9, trustworthy: 10, tangible: 8, trackable: 10 },
            verificationLog: ["Governance Audit Passed", "Signature Verified", "Blockchain Anchored"]
        },
        {
            id: "E-101-02",
            name: "CEO Commitment Letter",
            category: "G",
            status: "verified",
            hash: "SHA256:d3...11c4",
            sourceType: "Primary",
            pillars: { traceable: 10, transparent: 10, trustworthy: 10, tangible: 6, trackable: 10 },
            verificationLog: ["Identity Verified via ZK-Auth"]
        }
    ],
    "2.01": [
        {
            id: "E-201-01",
            name: "Q3 Power Consumption Utility Bills",
            category: "E",
            status: "verified",
            hash: "SHA256:a1...ef32",
            sourceType: "Primary",
            pillars: { traceable: 10, transparent: 8, trustworthy: 10, tangible: 10, trackable: 9 },
            verificationLog: ["OCR Extraction Match", "Third-party Cross-verify"]
        },
        {
            id: "E-201-02",
            name: "Renewable Energy Certificate (REC)",
            category: "E",
            status: "verified",
            hash: "SHA256:b2...cc45",
            sourceType: "Secondary",
            pillars: { traceable: 9, transparent: 10, trustworthy: 9, tangible: 7, trackable: 10 },
            verificationLog: ["Issuer Signature Valid"]
        }
    ],
    "3.01": [
        {
            id: "E-301-01",
            name: "Labor Union Engagement Minutes",
            category: "S",
            status: "verified",
            hash: "SHA256:e9...88d1",
            sourceType: "Primary",
            pillars: { traceable: 8, transparent: 9, trustworthy: 8, tangible: 9, trackable: 8 },
            verificationLog: ["Meeting Record Timestamp Match"]
        }
    ],
    "4.01": [
        {
            id: "E-401-01",
            name: "Anti-Corruption Policy Handbook",
            category: "G",
            status: "verified",
            hash: "SHA256:f5...00b9",
            sourceType: "Primary",
            pillars: { traceable: 10, transparent: 10, trustworthy: 10, tangible: 8, trackable: 7 },
            verificationLog: ["Version Control Check Passed"]
        }
    ]
};
