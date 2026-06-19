// ESGss JunAiKey - Governance & Compliance Services UI
// 3-2. 治理合規服務 - 可信證據保險箱 (Trustworthy Evidence Vault)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
// Note: Keeping the type import as ImmutableEvidenceVault if the type definition hasn't changed globally yet,
// or aliasing it if needed. For now, assuming we import the existing type but use it in the new component.
import { ImmutableEvidenceVault } from '../../../types/services-part3';

// 定義組件屬性介面
interface TrustworthyEvidenceVaultUIProps {
  data: ImmutableEvidenceVault; // 暫時維持原類型名稱
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬證據數據 (Mock Data)
const MOCK_EVIDENCE_LOGS = [
  {
    id: 'EV-2024-001',
    hash: '0x7f83b1657ff1...a90b',
    timestamp: '2024-01-24T10:30:00Z',
    type: 'CarbonCredit',
    description: '2023 Q4 碳權抵換證明',
    status: 'verified',
    blockNumber: 18923456,
  },
  {
    id: 'EV-2024-002',
    hash: '0x3a2c5e891b...c2d1',
    timestamp: '2024-01-25T08:15:00Z',
    type: 'ImpactReport',
    description: '供應鏈永續審計報告 v1.0',
    status: 'pending',
    blockNumber: 18924112,
  },
  {
    id: 'EV-2023-998',
    hash: '0x9d8e7f6a5c...b4e3',
    timestamp: '2023-12-31T23:59:59Z',
    type: 'Governance',
    description: '年度董事會決議簽署',
    status: 'verified',
    blockNumber: 18899888,
  },
  {
    id: 'EV-2023-997',
    hash: '0x1b2c3d4e5f...6a7b',
    timestamp: '2023-12-15T14:20:00Z',
    type: 'WaterAudit',
    description: '工廠水資源利用率認證',
    status: 'verified',
    blockNumber: 18855421,
  },
];

export const TrustworthyEvidenceVaultUI: React.FC<TrustworthyEvidenceVaultUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'vault' | 'verification' | 'audit_log'>('vault');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProof, setSelectedProof] = useState<(typeof MOCK_EVIDENCE_LOGS)[0] | null>(null);

  // 翻譯字典 (以繁體中文為主)
  const t = {
    title: '可信證據保險箱',
    subtitle: 'Trustworthy Evidence Vault',
    tabs: {
      vault: '證據庫總覽',
      verification: '鏈上驗證',
      audit_log: '審計日誌',
    },
    stats: {
      totalEvidence: '存證總數',
      verified: '已驗證區塊',
      latestBlock: '最新區塊高度',
      securityScore: '安全信任分數',
    },
    actions: {
      search: '搜尋證據 ID / Hash...',
      verify: '驗證真偽',
      download: '下載憑證',
      details: '查看詳情',
    },
    status: {
      verified: '已上鏈驗證',
      pending: '確認中',
      failed: '驗證失敗',
    },
  };

  // 過濾數據
  const filteredEvidence = MOCK_EVIDENCE_LOGS.filter(
    e =>
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.includes(searchQuery)
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)' // 青色系 (Governance)
            : 'linear-gradient(135deg, #001e1d 0%, #004d40 100%)',
        color: colors.text,
        fontFamily: '"SF Pro Display", "Inter", "Noto Sans TC", sans-serif',
      }}
    >
      {/* 頂部導航欄 */}
      <header
        style={{
          padding: '24px 32px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: colors.text,
                letterSpacing: '-0.5px',
              }}
            >
              {t.title}
            </h1>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                marginTop: '4px',
                fontWeight: '500',
              }}
            >
              {t.subtitle}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <GlassInput
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.actions.search}
              theme={theme}
              style={{ width: '300px' }}
            />
            <GlassButton theme={theme} variant="primary">
              + {t.actions.verify}
            </GlassButton>
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main
        style={{
          padding: '32px',
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        {/* 狀態儀表板 (Stats Dashboard) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: t.stats.totalEvidence, value: '1,284', icon: '🗄️', color: colors.primary },
            { label: t.stats.verified, value: '99.8%', icon: '🔗', color: colors.success },
            { label: t.stats.latestBlock, value: '#18,924,115', icon: '📦', color: colors.accent },
            { label: t.stats.securityScore, value: '100 / 100', icon: '🛡️', color: '#FFD700' }, // Gold
          ].map((stat, idx) => (
            <GlassCard key={idx} theme={theme} style={{ padding: '24px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
              >
                <span style={{ fontSize: '24px' }}>{stat.icon}</span>
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: stat.color,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* 證據列表 (Evidence List) */}
        <GlassCard theme={theme} style={{ padding: '0', overflow: 'hidden' }}>
          <div
            style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              gap: '20px',
            }}
          >
            {Object.entries(t.tabs).map(([key, label]) => (
              <div
                key={key}
                onClick={() => setActiveTab(key as any)}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  background: activeTab === key ? `${colors.primary}22` : 'transparent',
                  color: activeTab === key ? colors.primary : colors.textSecondary,
                  fontWeight: activeTab === key ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: colors.text }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}`, textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>ID</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>描述</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>類型</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>區塊 Hash</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>時間戳</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>狀態</th>
                  <th style={{ padding: '16px', color: colors.textSecondary }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvidence.map(row => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '20px 16px', fontWeight: '500' }}>{row.id}</td>
                    <td style={{ padding: '20px 16px' }}>{row.description}</td>
                    <td style={{ padding: '20px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: `${colors.accent}22`,
                          color: colors.accent,
                          fontSize: '12px',
                        }}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px', fontFamily: 'monospace', opacity: 0.8 }}>
                      {row.hash}
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '14px' }}>
                      {new Date(row.timestamp).toLocaleString('zh-TW')}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: row.status === 'verified' ? colors.success : colors.warning,
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: row.status === 'verified' ? colors.success : colors.warning,
                          }}
                        />
                        {row.status === 'verified' ? t.status.verified : t.status.pending}
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <GlassButton
                        theme={theme}
                        variant="ghost"
                        onClick={() => setSelectedProof(row)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {t.actions.details}
                      </GlassButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>

      {/* 詳細資訊模態框 (Detail Modal) */}
      {selectedProof && (
        <GlassModal
          isOpen={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '24px', color: colors.text }}>
            <h2
              style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              🛡️ 鏈上存證詳情
              <span
                style={{
                  fontSize: '14px',
                  padding: '4px 8px',
                  background: `${colors.success}22`,
                  color: colors.success,
                  borderRadius: '4px',
                  fontWeight: 'normal',
                }}
              >
                {t.status.verified}
              </span>
            </h2>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div
                style={{
                  background: `${colors.background}55`,
                  padding: '16px',
                  borderRadius: '12px',
                }}
              >
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
                  交易哈希 (Transaction Hash)
                </div>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '16px' }}>
                  {selectedProof.hash}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                    區塊高度 (Block Number)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>
                    #{selectedProof.blockNumber.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                    時間戳 (Timestamp)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>
                    {new Date(selectedProof.timestamp).toLocaleString('zh-TW')}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '8px' }}>
                  元數據內容 (Metadata Content)
                </div>
                <div
                  style={{
                    background: '#00000033',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  }}
                >
                  {JSON.stringify(
                    {
                      evidence_id: selectedProof.id,
                      type: selectedProof.type,
                      content_summary: selectedProof.description,
                      signer: 'ESG_Oracle_Validator_0x1',
                    },
                    null,
                    2
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedProof(null)}>
                關閉
              </GlassButton>
              <GlassButton theme={theme} variant="primary">
                ⬇ 下載區塊鏈憑證
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  TrustworthyEvidenceVaultUI,
};
