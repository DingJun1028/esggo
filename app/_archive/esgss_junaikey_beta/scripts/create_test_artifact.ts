import { sealArtifact, INetworkMock } from '../src/core/IAcceptanceArtifact.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a valid artifact with proper hash lock
const networkMocks: INetworkMock[] = [
    {
        url: '/api/esg/safety-incidents',
        method: 'GET',
        status: 200,
        body: {
            incidents: [
                {
                    id: 1,
                    severity: 'high',
                    date: '2026-02-01',
                    description: '工廠A區域化學品洩漏'
                },
                {
                    id: 2,
                    severity: 'medium',
                    date: '2026-02-03',
                    description: '員工輕傷事故'
                }
            ],
            total: 2
        },
        headers: {
            'X-ESG-Source': 'Safety-DB'
        },
        delay: 200,
        source: 'Safety Incidents Database'
    },
    {
        url: '/api/esg/compliance-check',
        method: 'POST',
        status: 200,
        body: {
            compliance: true,
            score: 85,
            certifications: ['ISO 45001', 'OHSAS 18001']
        },
        source: 'Compliance Verification API'
    }
];

const artifact = sealArtifact({
    uuid: 'test-artifact-safety-audit-001',
    version: '1.0.0',
    timestamp: Date.now(),
    acceptanceStatus: 'PASS',
    entropyLevel: 0.15,
    formula: 'SafetyScore = (1 - (Incidents / TotalWorkDays)) * 100',
    impactMetric: 'Zero Incidents Target: 85% Achieved',
    environment: {
        nodeVersion: process.version,
        os: 'win32',
        seed: 42
    },
    logicSnapshot: {
        input: { auditType: 'monthly', year: 2026, month: 2 },
        expectedOutput: {
            safetyScore: 85,
            incidentCount: 2,
            complianceStatus: 'PASS'
        },
        actualOutput: {
            safetyScore: 85,
            incidentCount: 2,
            complianceStatus: 'PASS'
        },
        traceLog: [
            'Fetching safety incidents from /api/esg/safety-incidents',
            'Received 2 incidents from Safety DB',
            'Posting compliance check to /api/esg/compliance-check',
            'Compliance verified: ISO 45001, OHSAS 18001',
            'Calculating safety score: (1 - 2/60) * 100 = 85'
        ]
    },
    networkMocks,
    evidence: {
        attachments: ['screenshot_safety_dashboard.png', 'audit_log_2026_02.json']
    }
});

// Save to file in scripts directory
const outputPath = path.join(__dirname, 'test_safety_audit_artifact.json');
fs.writeFileSync(outputPath, JSON.stringify(artifact, null, 2));

console.log('✅ Test artifact generated successfully!');
console.log('📍 Path:', outputPath);
console.log('🔐 Hash Lock:', artifact.evidence.hashLock);
