// ESGss JunAiKey - Sustainability Transformation Advisor UI
// 2.4 永續轉型顧問 - 液態玻璃風格設計

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { SustainabilityTransformationAdvisor } from '../../../types/services-part2';

interface SustainabilityTransformationAdvisorUIProps {
  data: SustainabilityTransformationAdvisor;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const SustainabilityTransformationAdvisorUI: React.FC<
  SustainabilityTransformationAdvisorUIProps
> = ({ data, theme, language }) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<
    'roadmap' | 'business-model' | 'stakeholders' | 'change-management'
  >('roadmap');
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const translations = {
    'zh-TW': {
      title: '永續轉型顧問',
      roadmap: '轉型路徑',
      businessModel: '商業模式重設計',
      stakeholders: '利益相關者對齊',
      changeManagement: '變革管理',
      currentMaturity: '當前成熟度',
      targetMaturity: '目標成熟度',
      overallProgress: '總體進度',
      transformationPhases: '轉型階段',
      businessModelCanvas: '商業模式畫布',
      stakeholderAnalysis: '利益相關者分析',
      engagementStrategy: '參與策略',
      changeReadiness: '變革準備度',
      implementationPlan: '實施計劃',
      createPhase: '創建階段',
      generateReport: '生成報告',
    },
    en: {
      title: 'Sustainability Transformation Advisor',
      roadmap: 'Transformation Roadmap',
      businessModel: 'Business Model Redesign',
      stakeholders: 'Stakeholder Alignment',
      changeManagement: 'Change Management',
      currentMaturity: 'Current Maturity',
      targetMaturity: 'Target Maturity',
      overallProgress: 'Overall Progress',
      transformationPhases: 'Transformation Phases',
      businessModelCanvas: 'Business Model Canvas',
      stakeholderAnalysis: 'Stakeholder Analysis',
      engagementStrategy: 'Engagement Strategy',
      changeReadiness: 'Change Readiness',
      implementationPlan: 'Implementation Plan',
      createPhase: 'Create Phase',
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

  const MaturityOverview = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
      }}
    >
      <GlassCard theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
            marginBottom: '12px',
          }}
        >
          {t.currentMaturity}
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: colors.warning,
            marginBottom: '8px',
          }}
        >
          {data.transformation.currentMaturity}/5
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.accent,
            marginBottom: '8px',
          }}
        >
          ↓
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: colors.success,
          }}
        >
          {data.transformation.targetMaturity}/5
        </div>
      </GlassCard>

      <GlassCard theme={theme} style={{ padding: '24px' }}>
        <h3
          style={{
            margin: '0 0 16px 0',
            color: colors.text,
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          {t.overallProgress}
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
                marginBottom: '4px',
              }}
            >
              轉型進度
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.primary,
              }}
            >
              {Math.round(
                (data.transformation.currentMaturity / data.transformation.targetMaturity) * 100
              )}
              %
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
                marginBottom: '4px',
              }}
            >
              已完成階段
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.accent,
              }}
            >
              {data.transformation.phases.filter(p => p.progress >= 100).length}/
              {data.transformation.phases.length}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const TransformationPhases = () => (
    <div
      style={{
        display: 'grid',
        gap: '20px',
      }}
    >
      <GlassCard theme={theme} style={{ padding: '24px' }}>
        <h3
          style={{
            margin: '0 0 20px 0',
            color: colors.text,
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          {t.transformationPhases}
        </h3>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          {data.transformation.phases?.map((phase, index) => (
            <div
              key={phase.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 100px',
                gap: '16px',
                alignItems: 'center',
                padding: '16px',
                background: `rgba(255, 255, 255, ${theme === 'light' ? '0.05' : '0.02'})`,
                borderRadius: '12px',
                borderLeft: `4px solid ${
                  phase.progress >= 100
                    ? glassTheme.light.success
                    : phase.progress > 0
                      ? glassTheme.light.warning
                      : colors.border
                }`,
              }}
              onClick={() => setSelectedPhase(phase.id)}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: colors.accent,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {phase.name}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: colors.textSecondary,
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                >
                  {phase.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: phase.progress >= 100 ? glassTheme.light.success : colors.primary,
                  }}
                >
                  {phase.progress}%
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                  }}
                >
                  {new Date(phase.startDate).toLocaleDateString()} -{' '}
                  {new Date(phase.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
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
            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
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
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton theme={theme} variant="secondary">
              {t.generateReport}
            </GlassButton>
            <GlassButton theme={theme} variant="primary">
              {t.createPhase}
            </GlassButton>
          </div>
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
          <TabButton tab="roadmap" label={t.roadmap} />
          <TabButton tab="business-model" label={t.businessModel} />
          <TabButton tab="stakeholders" label={t.stakeholders} />
          <TabButton tab="change-management" label={t.changeManagement} />
        </div>
      </div>

      {/* Main Content */}
      <main
        style={{
          padding: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {activeTab === 'roadmap' && (
          <div>
            <MaturityOverview />
            <TransformationPhases />
          </div>
        )}

        {activeTab === 'business-model' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.businessModelCanvas}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              商業模式重設計內容將在這裡顯示...
            </div>
          </GlassCard>
        )}

        {activeTab === 'stakeholders' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.stakeholderAnalysis}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              利益相關者分析內容將在這裡顯示...
            </div>
          </GlassCard>
        )}

        {activeTab === 'change-management' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.changeReadiness}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              變革管理內容將在這裡顯示...
            </div>
          </GlassCard>
        )}
      </main>

      {/* Phase Detail Modal */}
      {selectedPhase && (
        <GlassModal
          isOpen={!!selectedPhase}
          onClose={() => setSelectedPhase(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>階段詳細資訊</h2>
            <p>詳細的轉型階段資訊: {selectedPhase}</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  SustainabilityTransformationAdvisorUI,
};
