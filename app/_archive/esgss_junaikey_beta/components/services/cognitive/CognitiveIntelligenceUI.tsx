// ESGss JunAiKey - Cognitive Intelligence Services UI/UX
// 1. 認知智能服務 (5項服務) - 極簡光學極致美學

import React, { useState, useEffect } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
  glassAnimations,
} from '../../../components/ui/GlassComponents';
import {
  ESGDashboard,
  AIStrategyHub,
  DailyESGBriefing,
  ESGAIAssistant,
  TrendPredictionEngine,
} from '../../../types/services';

// ===== 1.1 Personal ESG Dashboard =====

interface ESGDashboardUIProps {
  data: ESGDashboard;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const ESGDashboardUI: React.FC<ESGDashboardUIProps> = ({ data, theme, language }) => {
  const colors = glassTheme[theme];
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');

  const translations = {
    'zh-TW': {
      title: '個人ESG儀表板',
      overall: '總體分數',
      environmental: '環境',
      social: '社會',
      governance: '治理',
      trends: '趨勢分析',
      goals: '個人目標',
      achievements: '成就徽章',
      peerComparison: '同儕比較',
      esgScore: 'ESG分數',
      lastUpdated: '最後更新',
    },
    en: {
      title: 'Personal ESG Dashboard',
      overall: 'Overall',
      environmental: 'Environmental',
      social: 'Social',
      governance: 'Governance',
      trends: 'Trends',
      goals: 'Goals',
      achievements: 'Achievements',
      peerComparison: 'Peer Comparison',
      esgScore: 'ESG Score',
      lastUpdated: 'Last Updated',
    },
  };

  const t = translations[language];

  // Bento Grid Layout
  const BentoGrid = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        padding: '24px',
        gridAutoRows: 'minmax(140px, auto)',
      }}
    >
      {/* Main Score Card */}
      <GlassCard
        theme={theme}
        hover={true}
        style={{
          gridColumn: 'span 2',
          gridRow: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: colors.accent,
            marginBottom: '8px',
          }}
        >
          {data.personalMetrics.overall}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: colors.textSecondary,
            marginBottom: '16px',
          }}
        >
          {t.esgScore}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          {Object.entries(data.personalMetrics)
            .filter(([key]) => ['environmental', 'social', 'governance'].includes(key))
            .map(([key, value]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: colors.text,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                  }}
                >
                  {t[key as keyof typeof t]}
                </div>
              </div>
            ))}
        </div>
      </GlassCard>

      {/* Trend Chart */}
      <GlassCard
        theme={theme}
        hover={true}
        style={{
          gridRow: 'span 2',
          padding: '20px',
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            color: colors.text,
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {t.trends}
        </h3>
        <div
          style={{
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textSecondary,
            fontSize: '14px',
          }}
        >
          📊 趨勢圖表組件
        </div>
      </GlassCard>

      {/* Quick Goals */}
      <GlassCard
        theme={theme}
        hover={true}
        style={{
          padding: '20px',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            color: colors.text,
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {t.goals}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.goals.slice(0, 3).map(goal => (
            <div
              key={goal.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
              }}
            >
              <span style={{ color: colors.text }}>{goal.title}</span>
              <span
                style={{
                  color: colors.textSecondary,
                  fontSize: '12px',
                }}
              >
                {Math.round((goal.currentValue / goal.targetValue) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Achievements */}
      <GlassCard
        theme={theme}
        hover={true}
        style={{
          gridColumn: 'span 2',
          padding: '20px',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            color: colors.text,
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {t.achievements}
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {data.achievements.slice(0, 4).map(achievement => (
            <div
              key={achievement.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '24px',
              }}
            >
              <div>{achievement.icon || '🏆'}</div>
              <div
                style={{
                  fontSize: '10px',
                  color: colors.textSecondary,
                  textAlign: 'center',
                  maxWidth: '60px',
                }}
              >
                {achievement.title}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Peer Comparison */}
      <GlassCard
        theme={theme}
        hover={true}
        style={{
          padding: '20px',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            color: colors.text,
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {t.peerComparison}
        </h3>
        <div
          style={{
            textAlign: 'center',
            color: colors.text,
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: colors.accent,
              marginBottom: '4px',
            }}
          >
            {data.peerComparison.percentile}%
          </div>
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            排名第 {data.peerComparison.rank}
          </div>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: colors.text,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
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
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {t.title}
          </h1>
          <div
            style={{
              fontSize: '14px',
              color: colors.textSecondary,
            }}
          >
            {t.lastUpdated}:{' '}
            {new Date(data.personalMetrics.lastUpdated).toLocaleDateString(language)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <BentoGrid />
      </main>

      {/* Floating Action Buttons */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 100,
        }}
      >
        <GlassButton
          theme={theme}
          variant="primary"
          style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            padding: 0,
          }}
        >
          <span style={{ fontSize: '20px' }}>+</span>
        </GlassButton>
      </div>
    </div>
  );
};

// ===== 1.2 AI Strategy Hub =====

interface AIStrategyHubUIProps {
  data: AIStrategyHub;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const AIStrategyHubUI: React.FC<AIStrategyHubUIProps> = ({ data, theme, language }) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendations' | 'stakeholders'>(
    'analysis'
  );

  const translations = {
    'zh-TW': {
      title: 'AI策略中心',
      analysis: '戰略分析',
      recommendations: '策略建議',
      stakeholders: '利益相關者',
      maturityLevel: '成熟度等級',
      opportunities: '機會',
      risks: '風險',
      currentStatus: '現況',
      strategicInsights: '戰略洞察',
      generateReport: '生成報告',
    },
    en: {
      title: 'AI Strategy Hub',
      analysis: 'Strategic Analysis',
      recommendations: 'Recommendations',
      stakeholders: 'Stakeholders',
      maturityLevel: 'Maturity Level',
      opportunities: 'Opportunities',
      risks: 'Risks',
      currentStatus: 'Current Status',
      strategicInsights: 'Strategic Insights',
      generateReport: 'Generate Report',
    },
  };

  const t = translations[language];

  const TabButton = ({ tab, label }: { tab: typeof activeTab; label: string }) => (
    <GlassButton
      theme={theme}
      variant={activeTab === tab ? 'primary' : 'ghost'}
      onClick={() => setActiveTab(tab)}
      style={{
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
      }}
    >
      {label}
    </GlassButton>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        color: colors.text,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
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
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {t.title}
          </h1>
          <GlassButton theme={theme} variant="primary">
            {t.generateReport}
          </GlassButton>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div
        style={{
          padding: '16px 24px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.05' : '0.02'})`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <TabButton tab="analysis" label={t.analysis} />
          <TabButton tab="recommendations" label={t.recommendations} />
          <TabButton tab="stakeholders" label={t.stakeholders} />
        </div>
      </div>

      {/* Content Area */}
      <main
        style={{
          padding: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {activeTab === 'analysis' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Current Status Card */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {t.currentStatus}
              </h3>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: colors.textSecondary,
                  marginBottom: '20px',
                }}
              >
                {data.analysis.currentStatus}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: `rgba(${colors.primary.slice(1)}, 0.1)`,
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary}33`,
                }}
              >
                <span style={{ color: colors.text, fontWeight: '500' }}>{t.maturityLevel}</span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  }}
                >
                  {data.analysis.maturityLevel}/5
                </span>
              </div>
            </GlassCard>

            {/* Opportunities */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {t.opportunities}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.analysis.opportunities.slice(0, 3).map(opportunity => (
                  <div
                    key={opportunity.id}
                    style={{
                      padding: '12px',
                      background: `rgba(52, 168, 83, 0.1)`,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${glassTheme.light.success}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '500',
                        color: colors.text,
                        marginBottom: '4px',
                      }}
                    >
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      {opportunity.impact} • {opportunity.effort}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Risks */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {t.risks}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.analysis.risks.slice(0, 3).map(risk => (
                  <div
                    key={risk.id}
                    style={{
                      padding: '12px',
                      background: `rgba(234, 67, 53, 0.1)`,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${glassTheme.light.error}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '500',
                        color: colors.text,
                        marginBottom: '4px',
                      }}
                    >
                      {risk.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      {risk.impact} • {Math.round(risk.probability * 100)}% 概率
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px',
            }}
          >
            {data.recommendations
              .sort((a, b) => a.priority - b.priority)
              .map(rec => (
                <GlassCard key={rec.id} theme={theme} style={{ padding: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: '16px',
                        fontWeight: '600',
                        flex: 1,
                      }}
                    >
                      {rec.title}
                    </h3>
                    <span
                      style={{
                        padding: '4px 8px',
                        background: colors.accent,
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      #{rec.priority}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 16px 0',
                      fontSize: '14px',
                      color: colors.textSecondary,
                      lineHeight: '1.5',
                    }}
                  >
                    {rec.description}
                  </p>
                  <div
                    style={{
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontWeight: '500',
                      marginBottom: '8px',
                    }}
                  >
                    預期成果: {rec.expectedOutcome}
                  </div>
                  <GlassButton theme={theme} variant="secondary" style={{ fontSize: '14px' }}>
                    查看詳情
                  </GlassButton>
                </GlassCard>
              ))}
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div>
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 20px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {t.stakeholders}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                {data.stakeholderRadar.stakeholders.map(stakeholder => (
                  <div
                    key={stakeholder.id}
                    style={{
                      padding: '16px',
                      background: `rgba(255, 255, 255, ${theme === 'light' ? '0.05' : '0.02'})`,
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '500',
                        color: colors.text,
                        marginBottom: '8px',
                      }}
                    >
                      {stakeholder.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                        marginBottom: '12px',
                      }}
                    >
                      {stakeholder.type}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '4px',
                          background: `rgba(${colors.primary.slice(1)}, 0.1)`,
                          borderRadius: '4px',
                          fontSize: '11px',
                        }}
                      >
                        影響力: {stakeholder.influence}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '4px',
                          background: `rgba(${colors.accent.slice(1)}, 0.1)`,
                          borderRadius: '4px',
                          fontSize: '11px',
                        }}
                      >
                        利益: {stakeholder.interest}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default {
  ESGDashboardUI,
  AIStrategyHubUI,
};
