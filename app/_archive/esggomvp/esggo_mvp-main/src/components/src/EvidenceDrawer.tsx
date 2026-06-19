'use client';
/**
 * 🔮 EvidenceDrawer.tsx — 液態玻璃證據抽屜 (Liquid Glass Evidence Drawer)
 * =============================================================
 * 美學準則: 「上善若水」— 以水之德喻系統之性，清澈、包容、流動
 * 主題色: Aqua 青 #63a6b0 | 永恆金 #ffd700
 *
 * 核心功能:
 *  - 展示報告中每個資料點 (IEvidenceMap) 的 5T 驗證狀態
 *  - The Golden Thread: 視覺化呈現從原始數據到報告的完整溯源鏈
 *  - 加蓋 / 解鎖 Evidence Atoms (Trustworthy 封印儀式)
 */

import React, { useState, useCallback } from 'react';
import { PDFViewer } from '@/components/pdf/PDFViewer';

// ─────────────────────────────────────────────────────────────────────────────
// Types (aligned with IEvidenceMap in omni-types.ts)
// ─────────────────────────────────────────────────────────────────────────────

export interface IEvidenceAtom {
    uuid: string;
    indicatorCode: string;
    indicatorNameZh: string;
    value: number | string;
    unit: string;
    isFrozen: boolean;
    contentHash?: string;
    sourceOrigin: string;
    formula?: string;
    standardRef: string;
    /** ISO timestamp of when the evidence was locked */
    lockedAt?: string;
    /** Lifecycle events trail — The Golden Thread */
    goldenThread: Array<{
        event: 'CREATED' | 'VERIFIED' | 'SEALED' | 'ARCHIVED';
        actor: string;
        time: number;
        note?: string;
    }>;
    /** Optional URL or path to an evidence document (e.g., PDF) */
    documentUrl?: string;
}

interface EvidenceDrawerProps {
    /** List of evidence atoms to display */
    atoms: IEvidenceAtom[];
    /** Whether the parent report is frozen (sealed) */
    reportFrozen?: boolean;
    /** Called when user attempts to seal an atom */
    onSeal?: (atomUuid: string) => void;
    /** Called when the drawer is closed */
    onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const PILLAR_COLORS: Record<string, string> = {
    E: '#22c55e',  // Green for Environment
    S: '#3b82f6',  // Blue for Social
    G: '#a855f7',  // Purple for Governance
};

function TBadge({ label, color }: { label: string; color: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
            background: `${color}22`, color, border: `1px solid ${color}55`,
        }}>
            {label}
        </span>
    );
}

function GoldenThreadStep({ event, actor, time, note }: IEvidenceAtom['goldenThread'][0]) {
    const EVENT_ICONS: Record<string, string> = {
        CREATED: '🌱', VERIFIED: '🔍', SEALED: '🔒', ARCHIVED: '📦',
    };
    const EVENT_COLORS: Record<string, string> = {
        CREATED: '#63a6b0', VERIFIED: '#ffd700', SEALED: '#22c55e', ARCHIVED: '#94a3b8',
    };
    const color = EVENT_COLORS[event] ?? '#94a3b8';
    const timeStr = new Date(time).toLocaleString('zh-TW', { dateStyle: 'short', timeStyle: 'short' });

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0' }}>
            <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                background: `${color}22`, border: `2px solid ${color}`, flexShrink: 0,
            }}>
                {EVENT_ICONS[event] ?? '⚡'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color }}>{event}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>{timeStr}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>由 {actor}</div>
                {note && <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px', fontStyle: 'italic' }}>{note}</div>}
            </div>
        </div>
    );
}

function EvidenceCard({
    atom,
    reportFrozen,
    onSeal,
    onViewDocument
}: {
    atom: IEvidenceAtom;
    reportFrozen?: boolean;
    onSeal?: (uuid: string) => void;
    onViewDocument?: (url: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    const pillar = atom.standardRef.includes('FSC') || atom.standardRef.includes('GRI-2')
        ? 'G' : atom.indicatorCode.includes('305') || atom.indicatorCode.includes('401')
            ? atom.indicatorCode.includes('305') ? 'E' : 'S' : 'E';

    const pillarColor = PILLAR_COLORS[pillar] ?? '#63a6b0';

    return (
        <div
            style={{
                background: atom.isFrozen
                    ? 'linear-gradient(135deg, rgba(99,166,176,0.12) 0%, rgba(34,197,94,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(99,166,176,0.08) 0%, rgba(30,41,59,0.9) 100%)',
                border: atom.isFrozen
                    ? '1px solid rgba(34,197,94,0.4)'
                    : '1px solid rgba(99,166,176,0.25)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <TBadge label={atom.standardRef} color="#63a6b0" />
                        <TBadge label={`${pillar} Pillar`} color={pillarColor} />
                        {atom.isFrozen && <TBadge label="🔒 Sealed" color="#22c55e" />}
                        {atom.documentUrl && <TBadge label="📄 Document" color="#3b82f6" />}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                        {atom.indicatorNameZh}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {atom.indicatorCode} · 來源: {atom.sourceOrigin}
                    </div>
                </div>

                {/* Value Badge */}
                <div style={{
                    textAlign: 'right', flexShrink: 0,
                    background: 'rgba(99,166,176,0.15)',
                    borderRadius: '8px', padding: '8px 12px',
                    border: '1px solid rgba(99,166,176,0.3)',
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#63a6b0', lineHeight: 1.2 }}>
                        {typeof atom.value === 'number' ? atom.value.toLocaleString() : atom.value}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{atom.unit}</div>
                </div>
            </div>

            {/* Formula (if present) */}
            {atom.formula && (
                <div style={{
                    marginTop: '10px', padding: '8px 12px', borderRadius: '6px',
                    background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
                    fontSize: '11px', color: '#ffd700', fontFamily: 'monospace',
                }}>
                    ∑ {atom.formula}
                </div>
            )}

            {/* Content Hash */}
            {atom.contentHash && (
                <div style={{
                    marginTop: '8px', padding: '6px 10px', borderRadius: '6px',
                    background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
                    fontSize: '10px', color: 'rgba(34,197,94,0.8)', fontFamily: 'monospace',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    SHA-256: {atom.contentHash}
                </div>
            )}

            {/* Action Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        background: 'transparent', border: '1px solid rgba(99,166,176,0.3)',
                        color: '#63a6b0', borderRadius: '6px', padding: '4px 10px',
                        fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,166,176,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    {expanded ? '▲ 收起' : '▼ 黃金線索'}
                </button>

                {atom.documentUrl && onViewDocument && (
                    <button
                        onClick={() => onViewDocument(atom.documentUrl!)}
                        style={{
                            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                            color: '#3b82f6', borderRadius: '6px', padding: '4px 10px',
                            fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s',
                            marginLeft: 'auto', marginRight: '8px'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
                    >
                        📄 開啟佐證
                    </button>
                )}

                {!atom.isFrozen && !reportFrozen && onSeal && (
                    <button
                        onClick={() => onSeal(atom.uuid)}
                        style={{
                            background: 'linear-gradient(90deg, #22c55e33, #63a6b033)',
                            border: '1px solid rgba(34,197,94,0.5)', color: '#22c55e',
                            borderRadius: '6px', padding: '4px 12px',
                            fontSize: '11px', cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                        🔒 執行封印
                    </button>
                )}
            </div>

            {/* Golden Thread Expanded */}
            {expanded && (
                <div style={{
                    marginTop: '12px', padding: '12px',
                    borderTop: '1px solid rgba(99,166,176,0.2)',
                }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#ffd700', marginBottom: '8px' }}>
                        ✨ 黃金線索 (Golden Thread) — 完整生命週期
                    </div>
                    {atom.goldenThread.map((step, i) => (
                        <GoldenThreadStep key={i} {...step} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main EvidenceDrawer Component
// ─────────────────────────────────────────────────────────────────────────────

export function EvidenceDrawer({ atoms, reportFrozen, onSeal, onClose }: EvidenceDrawerProps) {
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'E' | 'S' | 'G' | 'SEALED' | 'PENDING'>('ALL');
    const [viewDocumentUrl, setViewDocumentUrl] = useState<string | null>(null);

    const filteredAtoms = useCallback(() => {
        return atoms.filter(atom => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'SEALED') return atom.isFrozen;
            if (activeFilter === 'PENDING') return !atom.isFrozen;
            // Pillar filter: simple heuristic
            const isE = atom.indicatorCode.includes('302') || atom.indicatorCode.includes('303') ||
                atom.indicatorCode.includes('304') || atom.indicatorCode.includes('305') ||
                atom.indicatorCode.includes('306') || atom.standardRef.includes('FSC97-E');
            const isS = atom.indicatorCode.includes('401') || atom.indicatorCode.includes('403') ||
                atom.indicatorCode.includes('404') || atom.indicatorCode.includes('405') ||
                atom.standardRef.includes('FSC97-S');
            if (activeFilter === 'E') return isE;
            if (activeFilter === 'S') return isS;
            if (activeFilter === 'G') return !isE && !isS;
            return true;
        });
    }, [atoms, activeFilter]);

    const sealedCount = atoms.filter(a => a.isFrozen).length;
    const pendingCount = atoms.filter(a => !a.isFrozen).length;

    const FILTERS: Array<{ key: typeof activeFilter; label: string; color: string }> = [
        { key: 'ALL', label: `全部 (${atoms.length})`, color: '#63a6b0' },
        { key: 'E', label: '🌿 環境', color: '#22c55e' },
        { key: 'S', label: '🤝 社會', color: '#3b82f6' },
        { key: 'G', label: '⚖️ 治理', color: '#a855f7' },
        { key: 'SEALED', label: `🔒 已封印 (${sealedCount})`, color: '#22c55e' },
        { key: 'PENDING', label: `⏳ 待封印 (${pendingCount})`, color: '#f59e0b' },
    ];

    return (
        <div
            style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(480px, 100vw)', zIndex: 9998,
                display: 'flex', flexDirection: 'column',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.99) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderLeft: '1px solid rgba(99,166,176,0.25)',
                boxShadow: '-8px 0 40px rgba(99,166,176,0.1)',
                fontFamily: '"Inter", "PingFang TC", "Microsoft JhengHei", sans-serif',
            }}
        >
            {/* ── Header ── */}
            <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(99,166,176,0.2)',
                background: 'linear-gradient(135deg, rgba(99,166,176,0.12) 0%, rgba(255,215,0,0.04) 100%)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.3px' }}>
                            🔮 Evidence Vault
                        </div>
                        <div style={{ fontSize: '11px', color: '#63a6b0', marginTop: '2px' }}>
                            5T Protocol · 萬能證據庫
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{
                            fontSize: '11px', padding: '4px 10px',
                            borderRadius: '9999px', background: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', fontWeight: 600,
                        }}>
                            {sealedCount}/{atoms.length} 已封印
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#94a3b8', borderRadius: '8px', padding: '6px 10px',
                                    cursor: 'pointer', fontSize: '14px', lineHeight: 1,
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Integrity Progress Bar */}
                <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>封印完整度</span>
                        <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>
                            {atoms.length > 0 ? Math.round((sealedCount / atoms.length) * 100) : 0}%
                        </span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{
                            height: '100%', borderRadius: '2px',
                            width: `${atoms.length > 0 ? (sealedCount / atoms.length) * 100 : 0}%`,
                            background: 'linear-gradient(90deg, #22c55e, #63a6b0)',
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>
            </div>

            {/* ── Filter Pills ── */}
            <div style={{
                padding: '12px 16px',
                display: 'flex', gap: '6px', flexWrap: 'wrap',
                borderBottom: '1px solid rgba(99,166,176,0.15)',
            }}>
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        style={{
                            background: activeFilter === f.key ? `${f.color}22` : 'transparent',
                            border: `1px solid ${activeFilter === f.key ? f.color : 'rgba(255,255,255,0.1)'}`,
                            color: activeFilter === f.key ? f.color : '#64748b',
                            borderRadius: '9999px', padding: '4px 10px',
                            fontSize: '11px', cursor: 'pointer', fontWeight: activeFilter === f.key ? 700 : 400,
                            transition: 'all 0.2s',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* ── Atom List ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', scrollbarWidth: 'thin' }}>
                {filteredAtoms().length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#475569' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌊</div>
                        <div style={{ fontSize: '13px' }}>此篩選條件下暫無證據原子</div>
                    </div>
                ) : (
                    filteredAtoms().map(atom => (
                        <EvidenceCard
                            key={atom.uuid}
                            atom={atom}
                            reportFrozen={reportFrozen}
                            onSeal={onSeal}
                            onViewDocument={setViewDocumentUrl}
                        />
                    ))
                )}
            </div>

            {/* ── Footer ── */}
            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(99,166,176,0.2)',
                background: 'rgba(99,166,176,0.04)',
            }}>
                <div style={{ fontSize: '9px', color: '#475569', textAlign: 'center', letterSpacing: '0.5px' }}>
                    上善若水 · 5T PROTOCOL · TRUSTWORTHY SEALED
                </div>
            </div>

            {/* Document Viewer Modal Overlay */}
            {viewDocumentUrl && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 10000,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '24px'
                    }}
                    onClick={() => setViewDocumentUrl(null)}
                >
                    <div
                        style={{ width: '100%', maxWidth: '1000px', height: '90vh' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <PDFViewer
                            fileUrl={viewDocumentUrl}
                            onClose={() => setViewDocumentUrl(null)}
                            title="Evidence Verification (Traceable)"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EvidenceDrawer;
