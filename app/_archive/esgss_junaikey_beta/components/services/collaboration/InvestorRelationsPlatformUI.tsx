// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-3. 投資人關係平台 (Investor Relations Platform)
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
  InvestorRelationsPlatform,
  Investor,
  InvestorCommunication,
} from '../../../types/services-part4';

interface InvestorRelationsPlatformUIProps {
  data?: InvestorRelationsPlatform;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬投資人
const MOCK_INVESTORS: Investor[] = [
  {
    id: 'INV-001',
    name: 'BlackRock Global ESG Fund',
    type: 'institutional',
    category: 'Asset Manager',
    aum: 5000000000,
    region: 'North America',
    contact: {
      primary: { email: 'esg@blackrock.mock', phone: '+1-212-555-0101' },
      team: [],
      preferredChannels: ['email'],
      language: ['en'],
    },
    interests: ['Climate Tech', 'Renewable Energy'],
    esgFocus: {
      priorities: ['Carbon Neutrality'],
      exclusions: ['Coal'],
      frameworks: ['TCFD'],
      requirements: [],
      reporting: 'Annual',
    },
    relationship: {
      status: 'active',
      level: 'strategic',
      since: new Date('2020-01-01'),
      touchpoints: 45,
      satisfaction: 92,
    },
    lastContact: new Date('2024-01-20'),
  },
  {
    id: 'INV-002',
    name: 'Norwegian Sovereign Wealth Fund',
    type: 'institutional',
    category: 'Sovereign Wealth',
    aum: 1300000000000,
    region: 'Europe',
    contact: {
      primary: { email: 'invest@nbim.mock', phone: '+47-22-555-0102' },
      team: [],
      preferredChannels: ['report'],
      language: ['en'],
    },
    interests: ['Human Rights', 'Biodiversity'],
    esgFocus: {
      priorities: ['Governance'],
      exclusions: ['Tobacco'],
      frameworks: ['GRI', 'SASB'],
      requirements: [],
      reporting: 'Quarterly',
    },
    relationship: {
      status: 'prospect',
      level: 'primary',
      since: new Date('2023-06-15'),
      touchpoints: 12,
      satisfaction: 85,
    },
    lastContact: new Date('2024-01-10'),
  },
];

export const InvestorRelationsPlatformUI: React.FC<InvestorRelationsPlatformUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data_room' | 'investors'>('dashboard');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  const t = {
    title: '投資人關係平台',
    subtitle: 'Investor Relations Platform',
    tabs: {
      dashboard: 'IR儀表板',
      data_room: '虛擬數據室',
      investors: '投資人管理',
    },
    metrics: {
      totalInvestors: '投資人總數',
      engagementScore: '互動分數',
      reportDownloads: '報告下載量',
      upcomingMeetings: '近期會議',
    },
    actions: {
      uploadReport: '上傳報告',
      scheduleMeeting: '安排會議',
      sendMessage: '發送訊息',
    },
    investorStatus: {
      active: '現有股東',
      prospect: '潛在投資人',
      inactive: '非活躍',
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' // 專業商務灰 (Finance)
            : 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', // 科技藍 (Trust)
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <GlassButton theme={theme} variant="ghost">
            進入 Data Room
          </GlassButton>
          <GlassButton theme={theme} variant="primary">
            發佈 ESG 季報
          </GlassButton>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Navigation */}
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

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
              gap: '24px',
            }}
          >
            {/* Main Chart Area Placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <GlassCard theme={theme} style={{ padding: '24px', flex: 1 }}>
                <h3 style={{ margin: '0 0 16px 0' }}>投資人ESG關注度趨勢</h3>
                <div
                  style={{
                    height: '300px',
                    background: `linear-gradient(to right, ${colors.primary}11, ${colors.accent}11)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textSecondary,
                  }}
                >
                  [趨勢圖表區塊 - 氣候變化 vs 治理議題]
                </div>
              </GlassCard>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <GlassCard theme={theme} style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0' }}>持股結構分析</h3>
                  <div
                    style={{
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '12px',
                    }}
                  >
                    [圓餅圖]
                  </div>
                </GlassCard>
                <GlassCard theme={theme} style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0' }}>即將到來的路演 (Roadshow)</h3>
                  {/* List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: `${colors.background}55`,
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          background: colors.primary,
                          color: 'white',
                          padding: '8px',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          minWidth: '50px',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>JAN</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>28</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Q4 財報法說會</div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          線上會議 • 14:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Sidebar Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                {
                  label: t.metrics.totalInvestors,
                  value: '246',
                  trend: '+12%',
                  color: colors.primary,
                },
                {
                  label: t.metrics.engagementScore,
                  value: '8.8',
                  trend: '+0.4',
                  color: colors.success,
                },
                {
                  label: t.metrics.reportDownloads,
                  value: '1,892',
                  trend: '+350',
                  color: colors.accent,
                },
              ].map((stat, i) => (
                <GlassCard key={i} theme={theme} style={{ padding: '24px' }}>
                  <div
                    style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '8px' }}
                  >
                    {stat.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: '14px', color: colors.success }}>{stat.trend}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Investors View */}
        {activeTab === 'investors' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            {MOCK_INVESTORS.map(investor => (
              <GlassCard
                key={investor.id}
                theme={theme}
                style={{ padding: '24px' }}
                hover
                clickable
                onClick={() => setSelectedInvestor(investor)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                      {investor.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {investor.category} • {investor.region}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background:
                        investor.relationship.status === 'active'
                          ? `${colors.success}22`
                          : `${colors.warning}22`,
                      color:
                        investor.relationship.status === 'active' ? colors.success : colors.warning,
                    }}
                  >
                    {
                      t.investorStatus[
                        investor.relationship.status as keyof typeof t.investorStatus
                      ]
                    }
                  </span>
                </div>

                <div
                  style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                >
                  {investor.esgFocus.priorities.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: `${colors.accent}11`,
                        color: colors.accent,
                        border: `1px solid ${colors.accent}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    fontSize: '14px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ color: colors.textSecondary }}>AUM</div>
                    <div style={{ fontWeight: 'bold' }}>
                      ${(investor.aum / 1000000000).toFixed(1)}B
                    </div>
                  </div>
                  <div>
                    <div style={{ color: colors.textSecondary }}>Satisfaction</div>
                    <div style={{ fontWeight: 'bold' }}>{investor.relationship.satisfaction}%</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <GlassButton
                    theme={theme}
                    variant="primary"
                    style={{ flex: 1, fontSize: '12px' }}
                  >
                    {t.actions.sendMessage}
                  </GlassButton>
                  <GlassButton theme={theme} variant="ghost" style={{ flex: 1, fontSize: '12px' }}>
                    {t.actions.scheduleMeeting}
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Data Room Placeholder */}
        {activeTab === 'data_room' && (
          <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
            <h2>安全分級數據室</h2>
            <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
              您可以將 ESG 報告、財務審計文件與合規證書上傳至此。
              <br />
              系統將使用區塊鏈技術確保訪問紀錄不可竄改。
            </p>
            <GlassButton theme={theme} variant="primary">
              {t.actions.uploadReport}
            </GlassButton>
          </GlassCard>
        )}
      </main>

      {/* Investor Detail Modal */}
      {selectedInvestor && (
        <GlassModal
          isOpen={!!selectedInvestor}
          onClose={() => setSelectedInvestor(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '32px' }}>
            <h2>{selectedInvestor.name}</h2>
            <p>詳細互動紀錄與偏好分析...</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedInvestor(null)}>
                關閉
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  InvestorRelationsPlatformUI,
};
