// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-4. 社會影響力網絡 (Community Impact Network)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { CommunityImpactNetwork, ImpactProject, Community } from '../../../types/services-part4';

interface CommunityImpactNetworkUIProps {
  data?: CommunityImpactNetwork;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬專案數據
const MOCK_PROJECTS: ImpactProject[] = [
  {
    id: 'PROJ-001',
    title: '濁水溪流域復育計畫',
    description: '結合當地社區力量，進行河岸生態復育與水源保護教育。',
    category: 'Environment',
    sdgGoals: [6, 13, 15],
    location: 'Taiwan, Changhua',
    beneficiaries: 5000,
    team: { members: [], roles: [], skills: [], contributors: [] },
    timeline: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      phases: [],
      milestones: [],
    },
    budget: { total: 2000000, currency: 'TWD', breakdown: [], funded: 1500000, fundingSources: [] },
    status: 'active',
    impact: { environmental: [], social: [], economic: [], longTerm: [], scalability: [] },
    updates: [],
  },
  {
    id: 'PROJ-002',
    title: '偏鄉數位落差縮減行動',
    description: '提供再生電腦設備與程式教育課程給偏鄉學童。',
    category: 'Education',
    sdgGoals: [4, 10],
    location: 'Taiwan, Hualien',
    beneficiaries: 300,
    team: { members: [], roles: [], skills: [], contributors: [] },
    timeline: {
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-06-30'),
      phases: [],
      milestones: [],
    },
    budget: { total: 500000, currency: 'TWD', breakdown: [], funded: 500000, fundingSources: [] },
    status: 'completed',
    impact: { environmental: [], social: [], economic: [], longTerm: [], scalability: [] },
    updates: [],
  },
];

// SDG 圖標映射 (簡化)
const SDG_ICONS: Record<number, string> = {
  1: '🔴',
  2: '🟡',
  3: '🟢',
  4: '🔴',
  5: '🟠',
  6: '🔵',
  7: '🟡',
  8: '🔴',
  9: '🟠',
  10: '🟣',
  11: '🟠',
  12: '🟤',
  13: '🟢',
  14: '🔵',
  15: '🟢',
  16: '🔵',
  17: '🔵',
};

export const CommunityImpactNetworkUI: React.FC<CommunityImpactNetworkUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'feed' | 'projects' | 'volunteers'>('projects');
  const [selectedProject, setSelectedProject] = useState<ImpactProject | null>(null);

  const t = {
    title: '社會影響力網絡',
    subtitle: 'Community Impact Network',
    tabs: {
      feed: '社區動態',
      projects: '影響力專案',
      volunteers: '志工媒合',
    },
    status: {
      active: '進行中',
      completed: '已完成',
      planning: '規劃中',
      on_hold: '暫停',
    },
    actions: {
      join: '加入計畫',
      donate: '資助專案',
      share: '分享',
    },
    metrics: {
      beneficiaries: '受惠人數',
      raised: '募得資金',
      volunteers: '參與志工',
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'completed':
        return colors.primary;
      case 'planning':
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
            ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
            : 'linear-gradient(135deg, #243B55 0%, #141E30 100%)', // 深藍 (Community)
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
            我的影響力護照
          </GlassButton>
          <GlassButton theme={theme} variant="primary">
            + 發起專案
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

        {/* Projects View */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Map Placeholder */}
            <GlassCard
              theme={theme}
              style={{
                padding: '0',
                overflow: 'hidden',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${colors.background}55`,
              }}
            >
              <div style={{ textAlign: 'center', color: colors.textSecondary }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <h2>影響力地圖</h2>
                <p>探索您附近的永續行動專案</p>
              </div>
            </GlassCard>

            {/* Project List */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {MOCK_PROJECTS.map(project => (
                <GlassCard
                  key={project.id}
                  theme={theme}
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  hover
                  clickable
                  onClick={() => setSelectedProject(project)}
                >
                  <div
                    style={{
                      height: '180px',
                      background: `linear-gradient(45deg, ${colors.primary}44, ${colors.accent}44)`,
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {project.sdgGoals.map(goal => (
                        <span
                          key={goal}
                          style={{
                            fontSize: '20px',
                            background: 'white',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                          title={`SDG ${goal}`}
                        >
                          {SDG_ICONS[goal] || '🎯'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: colors.primary,
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        {project.category}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${getStatusColor(project.status)}22`,
                          color: getStatusColor(project.status),
                        }}
                      >
                        {t.status[project.status as keyof typeof t.status]}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: colors.textSecondary,
                        marginBottom: '24px',
                        flex: 1,
                      }}
                    >
                      {project.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: `1px solid ${colors.border}`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {t.metrics.beneficiaries}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {project.beneficiaries.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {t.metrics.raised}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {((project.budget.funded / project.budget.total) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Feed Placeholder */}
        {activeTab === 'feed' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ddd' }}
                ></div>
                <div style={{ flex: 1 }}>
                  <GlassInput placeholder="分享您的永續生活點滴..." theme={theme} />
                </div>
              </div>
              <hr style={{ borderColor: colors.border, margin: '24px 0', opacity: 0.5 }} />
              <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '40px' }}>
                暫無動態
              </div>
            </GlassCard>
            <GlassCard theme={theme} style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>熱門話題</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['#淨灘行動', '#二手交換', '#素食挑戰', '#SDGs'].map(tag => (
                  <span key={tag} style={{ color: colors.primary, cursor: 'pointer' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Volunteers Placeholder */}
        {activeTab === 'volunteers' && (
          <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
            <h2>🤝 志工媒合平台</h2>
            <p style={{ color: colors.textSecondary }}>尋找符合您技能的影響力專案。</p>
          </GlassCard>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <GlassModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '28px' }}>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '32px',
                gap: '12px',
              }}
            >
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedProject(null)}>
                關閉
              </GlassButton>
              <GlassButton theme={theme} variant="primary">
                {t.actions.join}
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  CommunityImpactNetworkUI,
};
