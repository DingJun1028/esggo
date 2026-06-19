// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-5. 合作夥伴聯盟門戶 (Partner Alliance Portal)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';

// 由於 services-part4.ts 未定義 PartnerAlliance 相關完整介面，
// 此處定義 UI 專用之擴充介面以滿足演示需求。
// 在真實場景中，應於 types 目錄中補充定義。

interface PartnerAlliancePortalUIProps {
  // data?: any; // 暫時使用 any 或可選，待類型補全
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

interface Alliance {
  id: string;
  name: string;
  type: 'strategic' | 'technology' | 'academic' | 'ngo';
  status: 'active' | 'pending' | 'negotiating';
  description: string;
  membersCount: number;
  projectsCount: number;
  resourcesShared: number;
  establishedAt: Date;
}

const MOCK_ALLIANCES: Alliance[] = [
  {
    id: 'AL-001',
    name: '亞洲綠色金融科技聯盟',
    type: 'strategic',
    status: 'active',
    description: '推動亞洲地區綠色金融標準的統一與 Fintech 應用落地。',
    membersCount: 15,
    projectsCount: 4,
    resourcesShared: 128,
    establishedAt: new Date('2023-01-15'),
  },
  {
    id: 'AL-002',
    name: '半導體永續製造倡議',
    type: 'technology',
    status: 'negotiating',
    description: '針對晶圓製造過程中的水資源與廢棄物管理技術共享。',
    membersCount: 8,
    projectsCount: 1,
    resourcesShared: 45,
    establishedAt: new Date('2023-11-20'),
  },
];

export const PartnerAlliancePortalUI: React.FC<PartnerAlliancePortalUIProps> = ({
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'alliances' | 'resources' | 'opportunities'>(
    'alliances'
  );
  const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(null);

  const t = {
    title: '合作夥伴聯盟門戶',
    subtitle: 'Partner Alliance Portal',
    tabs: {
      alliances: '我的聯盟',
      resources: '資源共享',
      opportunities: '合作機會',
    },
    actions: {
      create: '建立聯盟',
      join: '申請加入',
      share: '分享資源',
    },
    status: {
      active: '已建立',
      pending: '審核中',
      negotiating: '洽談中',
    },
    metrics: {
      members: '成員',
      projects: '專案',
      resources: '資源',
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'negotiating':
        return colors.accent;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' // 夢幻紫藍 (Collaboration)
            : 'linear-gradient(135deg, #434343 0%, #000000 100%)', // 曜石黑 (Exclusive)
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
          <GlassButton theme={theme} variant="primary">
            + {t.actions.create}
          </GlassButton>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
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

        {/* Alliances View */}
        {activeTab === 'alliances' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            {MOCK_ALLIANCES.map(alliance => (
              <GlassCard
                key={alliance.id}
                theme={theme}
                style={{ padding: '24px' }}
                hover
                clickable
                onClick={() => setSelectedAlliance(alliance)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: 'white',
                      }}
                    >
                      🤝
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        {alliance.name}
                      </h3>
                      <div
                        style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '4px' }}
                      >
                        {alliance.type}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: `1px solid ${getStatusColor(alliance.status)}`,
                      color: getStatusColor(alliance.status),
                    }}
                  >
                    {t.status[alliance.status as keyof typeof t.status]}
                  </span>
                </div>

                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: '24px',
                    lineHeight: '1.6',
                    minHeight: '48px',
                  }}
                >
                  {alliance.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: `${colors.background}55`,
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {alliance.membersCount}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {t.metrics.members}
                    </div>
                  </div>
                  <div style={{ width: '1px', background: colors.border }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {alliance.projectsCount}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {t.metrics.projects}
                    </div>
                  </div>
                  <div style={{ width: '1px', background: colors.border }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {alliance.resourcesShared}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {t.metrics.resources}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Join New Card */}
            <GlassButton
              theme={theme}
              variant="ghost"
              style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                minHeight: '250px',
              }}
            >
              <span style={{ fontSize: '48px', opacity: 0.3 }}>🔍</span>
              <span style={{ fontSize: '18px', color: colors.textSecondary }}>
                尋找更多合作聯盟
              </span>
            </GlassButton>
          </div>
        )}

        {/* Resources Placeholder */}
        {activeTab === 'resources' && (
          <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
            <h2>📚 資源共享池</h2>
            <p style={{ color: colors.textSecondary }}>
              存取聯盟成員共享的白皮書、專利授權與數據集。
            </p>
          </GlassCard>
        )}

        {/* Opportunities Placeholder */}
        {activeTab === 'opportunities' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <GlassCard
              theme={theme}
              style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  padding: '4px 12px',
                  background: colors.accent,
                  color: 'white',
                  fontSize: '12px',
                  borderBottomRightRadius: '12px',
                }}
              >
                HOT
              </div>
              <h3 style={{ marginTop: '16px' }}>跨國碳權交易試點</h3>
              <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                尋找具備 Verra 認證經驗的合作夥伴...
              </p>
              <GlassButton
                theme={theme}
                variant="primary"
                style={{ width: '100%', marginTop: '16px' }}
              >
                聯繫發起人
              </GlassButton>
            </GlassCard>
          </div>
        )}
      </main>

      {/* Alliance Detail Modal */}
      {selectedAlliance && (
        <GlassModal
          isOpen={!!selectedAlliance}
          onClose={() => setSelectedAlliance(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '28px' }}>{selectedAlliance.name}</h2>
            <p>{selectedAlliance.description}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedAlliance(null)}>
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
  PartnerAlliancePortalUI,
};
