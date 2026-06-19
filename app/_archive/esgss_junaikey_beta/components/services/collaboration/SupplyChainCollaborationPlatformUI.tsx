// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-2. 供應鏈協作平台 (Supply Chain Collaboration Platform)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import {
  SupplyChainCollaborationPlatform,
  Supplier,
  SupplierAssessment,
} from '../../../types/services-part4';

interface SupplyChainCollaborationPlatformUIProps {
  data?: SupplyChainCollaborationPlatform;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬供應商數據
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'GreenMaterials Co.',
    type: 'raw_materials',
    industry: 'Chemicals',
    location: 'Taiwan, Kaohsiung',
    contact: { email: 'contact@greenmat.com', phone: '+886-7-1234567' },
    esgScore: {
      overall: 88,
      environmental: 92,
      social: 85,
      governance: 87,
      lastUpdated: new Date(),
      trend: 'improving',
    },
    certifications: [],
    riskLevel: 'low',
    status: 'active',
    onboardedAt: new Date('2022-05-15'),
    lastAssessed: new Date('2024-01-20'),
  },
  {
    id: 'SUP-002',
    name: 'EcoLogistics Ltd.',
    type: 'logistics',
    industry: 'Transportation',
    location: 'Singapore',
    contact: { email: 'ops@ecologistics.sg', phone: '+65-98765432' },
    esgScore: {
      overall: 75,
      environmental: 70,
      social: 80,
      governance: 75,
      lastUpdated: new Date(),
      trend: 'stable',
    },
    certifications: [],
    riskLevel: 'medium',
    status: 'active',
    onboardedAt: new Date('2023-02-10'),
    lastAssessed: new Date('2023-11-05'),
  },
  {
    id: 'SUP-003',
    name: 'NextGen Chips',
    type: 'manufacturing',
    industry: 'Electronics',
    location: 'Vietnam, Hanoi',
    contact: { email: 'sales@nextgen.vn', phone: '+84-24-12345678' },
    esgScore: {
      overall: 62,
      environmental: 55,
      social: 65,
      governance: 66,
      lastUpdated: new Date(),
      trend: 'declining',
    },
    certifications: [],
    riskLevel: 'high',
    status: 'under_review',
    onboardedAt: new Date('2023-08-01'),
    lastAssessed: new Date('2024-01-15'),
  },
];

export const SupplyChainCollaborationPlatformUI: React.FC<
  SupplyChainCollaborationPlatformUIProps
> = ({ data, theme, language }) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'map' | 'suppliers' | 'assessments'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const t = {
    title: '供應鏈協作平台',
    subtitle: 'Supply Chain Collaboration Platform',
    tabs: {
      map: '供應鏈地圖',
      suppliers: '供應商列表',
      assessments: '評估與審計',
    },
    metrics: {
      totalSuppliers: '總供應商',
      avgScore: '平均 ESG 分數',
      highRisk: '高風險供應商',
      assessmentsDue: '待評估項目',
    },
    status: {
      active: '活躍',
      inactive: '非活躍',
      under_review: '審核中',
    },
    risk: {
      low: '低風險',
      medium: '中風險',
      high: '高風險',
    },
    actions: {
      details: '詳情',
      audit: '發起審計',
      message: '聯絡',
    },
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'high':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #e6dee9 0%, #a4e7e0 100%)' // 淡雅綠紫 (Modern Supply Chain)
            : 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)', // 深海藍 (Global)
        color: colors.text,
        fontFamily: '"SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '24px 32px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{t.title}</h1>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>{t.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <GlassButton theme={theme} variant="primary">
            + 新增供應商
          </GlassButton>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: t.metrics.totalSuppliers, value: '1,248', color: colors.primary },
            { label: t.metrics.avgScore, value: '76.4', color: colors.accent },
            { label: t.metrics.highRisk, value: '12', color: colors.error },
            { label: t.metrics.assessmentsDue, value: '5', color: colors.warning },
          ].map((stat, i) => (
            <GlassCard key={i} theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: stat.color,
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          {Object.entries(t.tabs).map(([key, label]) => (
            <GlassButton
              key={key}
              theme={theme}
              variant={activeTab === key ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(key as any)}
            >
              {label}
            </GlassButton>
          ))}
        </div>

        {/* Suppliers List */}
        {activeTab === 'suppliers' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <GlassInput
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜尋供應商名稱、地點或產業..."
                theme={theme}
                style={{ width: '400px' }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '24px',
              }}
            >
              {MOCK_SUPPLIERS.map(supplier => (
                <GlassCard
                  key={supplier.id}
                  theme={theme}
                  style={{ padding: '24px' }}
                  hover
                  clickable
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: `${colors.text}11`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}
                      >
                        🏭
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                          {supplier.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {supplier.location}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getRiskColor(supplier.riskLevel) + '22',
                        color: getRiskColor(supplier.riskLevel),
                        fontWeight: 'bold',
                      }}
                    >
                      {t.risk[supplier.riskLevel as keyof typeof t.risk]}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                      fontSize: '14px',
                    }}
                  >
                    <div>
                      <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>
                        ESG Score
                      </div>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: getScoreColor(supplier.esgScore.overall),
                        }}
                      >
                        {supplier.esgScore.overall}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>
                        Industry
                      </div>
                      <div style={{ fontWeight: '500' }}>{supplier.industry}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <GlassButton
                      theme={theme}
                      variant="ghost"
                      style={{ flex: 1, fontSize: '12px' }}
                    >
                      {t.actions.details}
                    </GlassButton>
                    <GlassButton
                      theme={theme}
                      variant="secondary"
                      style={{ flex: 1, fontSize: '12px' }}
                    >
                      {t.actions.audit}
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {activeTab === 'map' && (
          <GlassCard
            theme={theme}
            style={{
              padding: '0',
              overflow: 'hidden',
              height: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${colors.background}55`,
            }}
          >
            <div style={{ textAlign: 'center', color: colors.textSecondary }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>🌍</div>
              <h2>互動式供應鏈地球儀載入中...</h2>
              <p>視覺化全球供應商分佈與風險熱點</p>
            </div>
          </GlassCard>
        )}

        {/* Assessments Placeholder */}
        {activeTab === 'assessments' && (
          <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
            <h2>📋 評估管理中心</h2>
            <p style={{ color: colors.textSecondary }}>追蹤所有供應商的審核進度與改善計畫。</p>
          </GlassCard>
        )}
      </main>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <GlassModal
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                  ID: {selectedSupplier.id}
                </span>
                <h2 style={{ fontSize: '32px', margin: '4px 0', color: colors.text }}>
                  {selectedSupplier.name}
                </h2>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: `${colors.primary}22`,
                      color: colors.primary,
                      fontSize: '12px',
                    }}
                  >
                    {selectedSupplier.type}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: `${colors.textSecondary}22`,
                      color: colors.textSecondary,
                      fontSize: '12px',
                    }}
                  >
                    {selectedSupplier.status}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: getScoreColor(selectedSupplier.esgScore.overall),
                    lineHeight: 1,
                  }}
                >
                  {selectedSupplier.esgScore.overall}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>Overall Score</div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  background: `${colors.background}55`,
                  borderRadius: '8px',
                }}
              >
                <div style={{ color: colors.textSecondary, marginBottom: '4px', fontSize: '12px' }}>
                  Environmental
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: getScoreColor(selectedSupplier.esgScore.environmental),
                  }}
                >
                  {selectedSupplier.esgScore.environmental}
                </div>
              </div>
              <div
                style={{
                  padding: '16px',
                  background: `${colors.background}55`,
                  borderRadius: '8px',
                }}
              >
                <div style={{ color: colors.textSecondary, marginBottom: '4px', fontSize: '12px' }}>
                  Social
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: getScoreColor(selectedSupplier.esgScore.social),
                  }}
                >
                  {selectedSupplier.esgScore.social}
                </div>
              </div>
              <div
                style={{
                  padding: '16px',
                  background: `${colors.background}55`,
                  borderRadius: '8px',
                }}
              >
                <div style={{ color: colors.textSecondary, marginBottom: '4px', fontSize: '12px' }}>
                  Governance
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: getScoreColor(selectedSupplier.esgScore.governance),
                  }}
                >
                  {selectedSupplier.esgScore.governance}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>聯絡資訊</h4>
              <div style={{ fontSize: '14px', color: colors.text }}>
                <div>📍 {selectedSupplier.location}</div>
                <div>📧 {selectedSupplier.contact.email}</div>
                <div>📞 {selectedSupplier.contact.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedSupplier(null)}>
                關閉
              </GlassButton>
              <GlassButton theme={theme} variant="primary">
                查看完整報告
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  SupplyChainCollaborationPlatformUI,
};
