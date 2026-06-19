import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { IAcceptanceArtifact, INetworkMock, sealArtifact } from '../core/IAcceptanceArtifact';
import { v4 as uuidv4 } from 'uuid';

/**
 * SafetyAuditComponent
 * 模擬 ESG 安全審�?組件，發射帶?�網路模?��? AcceptanceArtifact
 * 展示如�?使用 EntropyForge ??Network Mock ?�能
 */
export const SafetyAuditComponent: React.FC = () => {
    const [auditStatus, setAuditStatus] = useState<'idle' | 'auditing' | 'complete'>('idle');
    const [artifact, setArtifact] = useState<IAcceptanceArtifact | null>(null);

    const performAudit = () => {
        setAuditStatus('auditing');

        // 模擬網路請�?
        setTimeout(async () => {
            // 定義網路模擬?�置
            const networkMocks: INetworkMock[] = [
                {
                    url: '/api/esg/safety-incidents',
                    method: 'GET',
                    status: 200,
                    body: {
                        incidents: [
                            { id: 1, severity: 'high', date: '2026-02-01', description: '工�?A?�?��?學�?洩�?' },
                            { id: 2, severity: 'medium', date: '2026-02-03', description: '?�工輕傷事�?' }
                        ],
                        total: 2
                    },
                    headers: { 'X-ESG-Source': 'Safety-DB' },
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

            const auditArtifact = await sealArtifact({
                uuid: uuidv4(),
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
                networkMocks, // ?�� ?�鍵：注?�網路模?��?�?
                evidence: {
                    attachments: ['screenshot_safety_dashboard.png', 'audit_log_2026_02.json']
                }
            });

            setArtifact(auditArtifact);
            setAuditStatus('complete');

            // ?�控?�台輸出 artifact JSON
            omniLogger.info(LogCategory.SYSTEM, '[SafetyAuditComponent] SafetyAudit Artifact Generated', JSON.stringify(auditArtifact, null, 2));
        }, 1500);
    };

    const downloadArtifact = () => {
        if (!artifact) return;

        const dataStr = JSON.stringify(artifact, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `safety-audit-artifact-${artifact.uuid}.json`;
        link.click();
    };

    return (
        <div className="safety-audit-component" style={{
            padding: '32px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#f8fafb',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,255,255, 0.15)'
        }}>
            <h1 style={{
                color: '#00FFFF',
                fontSize: '28px',
                marginBottom: '16px',
                fontWeight: 700
            }}>
                ?���?ESG 安全審�?實�?�?
            </h1>

            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>
                ?��?件�?示�?何�??�帶??<strong>網路模擬</strong> ??AcceptanceArtifact�?
                ?�於 EntropyForge 精�??�現 AI 驗收結�???
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={performAudit}
                    disabled={auditStatus === 'auditing'}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: auditStatus === 'auditing' ? '#ccc' : '#00FFFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: auditStatus === 'auditing' ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {auditStatus === 'auditing' ? '?? 審�?�?..' : '?? ?��?安全審�?'}
                </button>

                {artifact && (
                    <button
                        onClick={downloadArtifact}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#FFD700',
                            color: '#333',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ?�� 下�? Artifact JSON
                    </button>
                )}
            </div>

            {auditStatus === 'complete' && artifact && (
                <div style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '2px solid #00FFFF'
                }}>
                    <h3 style={{ color: '#00FFFF', marginBottom: '16px' }}>
                        ??審�?完�?
                    </h3>

                    <div style={{ marginBottom: '16px' }}>
                        <strong>UUID:</strong> <code>{artifact.uuid}</code>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <strong>?�??</strong> <span style={{
                            color: artifact.acceptanceStatus === 'PASS' ? '#52C41A' : '#F5222D',
                            fontWeight: 600
                        }}>{artifact.acceptanceStatus}</span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <strong>安全?�數:</strong> {artifact.logicSnapshot.actualOutput.safetyScore}%
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <strong>事�??��?:</strong> {artifact.logicSnapshot.actualOutput.incidentCount}
                    </div>

                    <details style={{ marginTop: '16px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#00FFFF' }}>
                            ?? 網路模擬?�置 ({artifact.networkMocks?.length || 0} ??
                        </summary>
                        <pre style={{
                            backgroundColor: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '12px',
                            marginTop: '8px'
                        }}>
                            {JSON.stringify(artifact.networkMocks, null, 2)}
                        </pre>
                    </details>

                    <details style={{ marginTop: '16px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#00FFFF' }}>
                            ?? ?��?路�??��?
                        </summary>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            {artifact.logicSnapshot.traceLog.map((log, i) => (
                                <li key={i} style={{ marginBottom: '4px', color: '#555', fontSize: '14px' }}>
                                    {log}
                                </li>
                            ))}
                        </ul>
                    </details>

                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#FFF9E6',
                        borderRadius: '8px',
                        borderLeft: '4px solid #FFD700'
                    }}>
                        <strong>?? Hash Lock:</strong>{' '}
                        <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                            {artifact.evidence.hashLock}
                        </code>
                    </div>

                    <p style={{ marginTop: '16px', color: '#777', fontSize: '14px' }}>
                        ?�� ?�示：�?載此 Artifact JSON 後�??�使??
                        <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                            npx tsx scripts/reproduce_acceptance.ts [path/to/artifact.json]
                        </code>
                        ?��? Playwright 測試?�本??
                    </p>
                </div>
            )}
        </div>
    );
};

