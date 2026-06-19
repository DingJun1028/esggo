'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SUSTAINABILITY_LIBRARY_DB, ISustainabilityResource } from '@/data/sustainability-library-db';
import { downloadResourceAsPdf } from '@/lib/pdf-generator';

export default function ResourcePdfViewerPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [resource, setResource] = useState<ISustainabilityResource | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
        const found = SUSTAINABILITY_LIBRARY_DB.find((r: ISustainabilityResource) => r.id === id);
        if (!found) {
            router.replace('/omni/resource-center');
            return;
        }
        setResource(found);
        setPdfUrl(`/api/sustainability-library/pdf/${id}`);
    }, [id, router]);

    if (!resource) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#0a0f1a', color: '#63a6b0',
                fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14,
            }}>
                載入中…
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: '#0a0f1a', fontFamily: 'Inter,system-ui,sans-serif',
        }}>
            {/* Top bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderBottom: '1px solid rgba(99,166,176,0.18)',
                background: 'rgba(13,27,42,0.95)',
                backdropFilter: 'blur(12px)',
                flexShrink: 0,
                zIndex: 10,
            }}>
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                        fontSize: 12, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#63a6b066')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                    ← 返回資源中心
                </button>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontSize: 13, fontWeight: 700, color: '#e2e8f0',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {resource.title_zh}
                    </p>
                    <p style={{ fontSize: 10, color: '#63a6b0', marginTop: 2 }}>
                        PDF 預覽 · {resource.category} · {resource.year}
                    </p>
                </div>

                {/* Download button */}
                <button
                    onClick={() => downloadResourceAsPdf(resource)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 18px', borderRadius: 8,
                        background: 'linear-gradient(135deg,#63a6b0,#5190a0)',
                        border: 'none', color: '#fff', cursor: 'pointer',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                        boxShadow: '0 4px 16px rgba(99,166,176,0.3)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,166,176,0.4)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,166,176,0.3)';
                    }}
                >
                    ↓ 下載 PDF
                </button>
            </div>

            {/* Iframe area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Loading skeleton */}
                {!iframeLoaded && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#0a0f1a', color: '#63a6b0', fontSize: 13, gap: 10,
                        zIndex: 5,
                    }}>
                        <span style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: '2px solid #63a6b033',
                            borderTopColor: '#63a6b0',
                            animation: 'spin 0.8s linear infinite',
                            display: 'inline-block',
                        }} />
                        正在生成 ESG 摘要頁面…
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}

                <iframe
                    src={pdfUrl}
                    title={`PDF 預覽 — ${resource.title_zh}`}
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                        width: '100%', height: '100%',
                        border: 'none',
                        opacity: iframeLoaded ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />
            </div>

            {/* Hint bar */}
            <div style={{
                padding: '8px 20px', flexShrink: 0,
                borderTop: '1px solid rgba(99,166,176,0.1)',
                background: 'rgba(13,27,42,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 10, color: 'rgba(255,255,255,0.3)',
            }}>
                <span>ESG GO | InfoOne · 服務即教學，知識即資產 · 上善若水 ♾️</span>
                <span>
                    按 <kbd style={{
                        padding: '1px 5px', borderRadius: 4,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        fontFamily: 'monospace', fontSize: 9,
                        color: 'rgba(255,255,255,0.4)',
                    }}>Ctrl+P</kbd> → 另存為 PDF
                </span>
            </div>
        </div>
    );
}
