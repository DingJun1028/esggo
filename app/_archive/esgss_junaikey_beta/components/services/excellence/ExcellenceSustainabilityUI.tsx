// ESGss JunAiKey - Excellence & Sustainability Services UI/UX
// 2. 卓越永續服務 (5項服務) - 極簡光學極致美學

import React, { useState, useEffect } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { CorporateHealthCheck } from '../../../types/services';

// ===== 2.1 Corporate Health Check =====

interface CorporateHealthCheckUIProps {
  data: CorporateHealthCheck;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const CorporateHealthCheckUI: React.FC<CorporateHealthCheckUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeSection, setActiveSection] = useState<
    'overview' | 'vitals' | 'diagnostics' | 'treatment'
  >('overview');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<string | null>(null);

  const translations = {
    'zh-TW': {
      title: '企業健康檢查',
      overview: '總覽',
      vitals: '生命徵象',
      diagnostics: '診斷結果',
      treatment: '處方計畫',
      healthScore: '健康分數',
      overallHealth: '整體健康狀況',
      vitalSigns: '生命徵象監測',
      criticalIssues: '嚴重問題',
      recommendations: '建議',
      startAssessment: '開始評估',
      viewReport: '檢視報告',
      downloadReport: '下載報告',
      scheduleFollowUp: '安排追蹤',
      healthy: '健康',
      warning: '警告',
      critical: '嚴重',
      lastAssessed: '最後評估時間',
      nextAssessment: '下次評估時間',
      progress: '進度',
      urgent: '緊急',
      high: '高',
      medium: '中等',
      low: '低',
    },
    en: {
      title: 'Corporate Health Check',
      overview: 'Overview',
      vitals: 'Vital Signs',
      diagnostics: 'Diagnostics',
      treatment: 'Treatment Plans',
      healthScore: 'Health Score',
      overallHealth: 'Overall Health',
      vitalSigns: 'Vital Signs Monitoring',
      criticalIssues: 'Critical Issues',
      recommendations: 'Recommendations',
      startAssessment: 'Start Assessment',
      viewReport: 'View Report',
      downloadReport: 'Download Report',
      scheduleFollowUp: 'Schedule Follow-up',
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
      lastAssessed: 'Last Assessed',
      nextAssessment: 'Next Assessment',
      progress: 'Progress',
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
  };

  const t = translations[language];

  const getHealthColor = (score: number) => {
    if (score >= 80) return glassTheme.light.success;
    if (score >= 60) return glassTheme.light.warning;
    return glassTheme.light.error;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return glassTheme.light.success;
      case 'warning':
        return glassTheme.light.warning;
      case 'critical':
        return glassTheme.light.error;
      default:
        return glassTheme.light.secondary;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return glassTheme.light.error;
      case 'medium':
        return glassTheme.light.warning;
      case 'low':
        return glassTheme.light.success;
      default:
        return glassTheme.light.secondary;
    }
  };

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
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton theme={theme} variant="secondary">
              {t.viewReport}
            </GlassButton>
            <GlassButton theme={theme} variant="primary">
              {t.startAssessment}
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
          {(['overview', 'vitals', 'diagnostics', 'treatment'] as const).map(section => (
            <GlassButton
              key={section}
              theme={theme}
              variant={activeSection === section ? 'primary' : 'ghost'}
              onClick={() => setActiveSection(section)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
              }}
            >
              {t[section as keyof typeof t]}
            </GlassButton>
          ))}
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
        {activeSection === 'overview' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Health Score Card */}
            <GlassCard
              theme={theme}
              style={{
                padding: '32px',
                textAlign: 'center',
                gridRow: 'span 2',
              }}
            >
              <h2
                style={{
                  margin: '0 0 20px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {t.healthScore}
              </h2>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  background: `conic-gradient(${getHealthColor(data.healthScore.overall)} ${data.healthScore.overall * 3.6}deg, ${colors.border} 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background:
                      theme === 'light' ? glassTheme.light.background : glassTheme.dark.background,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: getHealthColor(data.healthScore.overall),
                    }}
                  >
                    {data.healthScore.overall}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                    }}
                  >
                    /100
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              >
                {Object.entries(data.healthScore.byCategory).map(([category, score]) => (
                  <div
                    key={category}
                    style={{
                      padding: '4px 8px',
                      background: `${colors.border}66`,
                      borderRadius: '8px',
                      color: colors.text,
                    }}
                  >
                    {category}: {score}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.overallHealth}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: colors.text }}>{t.lastAssessed}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                    {new Date(data.healthScore.lastAssessed).toLocaleDateString()}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: colors.text }}>{t.nextAssessment}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '14px' }}>待安排</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: colors.text }}>{t.progress}</span>
                  <span
                    style={{
                      color: getHealthColor(data.healthScore.overall),
                      fontWeight: '500',
                    }}
                  >
                    {data.healthScore.trend === 'improving'
                      ? '📈'
                      : data.healthScore.trend === 'stable'
                        ? '📊'
                        : '📉'}{' '}
                    {t[data.healthScore.trend as keyof typeof t]}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Critical Issues */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.criticalIssues}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.diagnostics
                  .filter(d => d.severity === 'high')
                  .slice(0, 3)
                  .map(diagnostic => (
                    <div
                      key={diagnostic.id}
                      style={{
                        padding: '12px',
                        background: `${glassTheme.light.error}22`,
                        borderRadius: '8px',
                        borderLeft: `4px solid ${glassTheme.light.error}`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '500',
                          color: colors.text,
                          marginBottom: '4px',
                          fontSize: '14px',
                        }}
                      >
                        {diagnostic.title}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: colors.textSecondary,
                        }}
                      >
                        {diagnostic.description.slice(0, 60)}...
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>

            {/* Treatment Plans Progress */}
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.treatment}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.treatmentPlans.slice(0, 3).map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      padding: '12px',
                      background: `${colors.border}33`,
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: '500',
                          color: colors.text,
                          fontSize: '14px',
                        }}
                      >
                        {plan.title}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: colors.textSecondary,
                        }}
                      >
                        {plan.progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: colors.border,
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${plan.progress}%`,
                          height: '100%',
                          background: colors.accent,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeSection === 'vitals' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {data.vitalSigns.map(vital => (
              <GlassCard key={vital.id} theme={theme} style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    {vital.name}
                  </h3>
                  <span
                    style={{
                      padding: '4px 8px',
                      background: `${getStatusColor(vital.status)}33`,
                      color: getStatusColor(vital.status),
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {t[vital.status as keyof typeof t]}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: colors.textSecondary,
                        marginBottom: '4px',
                      }}
                    >
                      當前值
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: colors.text,
                      }}
                    >
                      {vital.currentValue}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: colors.text,
                      }}
                    >
                      {vital.currentValue}
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
                      目標值
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: colors.accent,
                      }}
                    >
                      {vital.targetValue}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '12px',
                  }}
                >
                  最後測量: {new Date(vital.lastMeasured).toLocaleDateString()}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      marginRight: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                        marginBottom: '4px',
                      }}
                    >
                      趨勢圖
                    </div>
                    <div
                      style={{
                        height: '40px',
                        background: `${colors.border}33`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      📈
                    </div>
                  </div>
                  <GlassButton
                    theme={theme}
                    variant="secondary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                    }}
                  >
                    查看詳情
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeSection === 'diagnostics' && (
          <div
            style={{
              display: 'grid',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {(['high', 'medium', 'low'] as const).map(severity => (
                <GlassButton
                  key={severity}
                  theme={theme}
                  variant="ghost"
                  onClick={() => {}}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getSeverityColor(severity),
                      marginRight: '8px',
                    }}
                  />
                  {t[severity as keyof typeof t]} (
                  {data.diagnostics.filter(d => d.severity === severity).length})
                </GlassButton>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {data.diagnostics.map(diagnostic => (
                <GlassCard
                  key={diagnostic.id}
                  theme={theme}
                  hover={true}
                  clickable={true}
                  onClick={() => setSelectedDiagnostic(diagnostic.id)}
                  style={{ padding: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
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
                      {diagnostic.title}
                    </h3>
                    <span
                      style={{
                        padding: '4px 8px',
                        background: `${getSeverityColor(diagnostic.severity)}33`,
                        color: getSeverityColor(diagnostic.severity),
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {t[diagnostic.severity as keyof typeof t]}
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
                    {diagnostic.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '16px',
                    }}
                  >
                    {diagnostic.rootCauses.slice(0, 3).map((cause, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          background: `${colors.border}66`,
                          color: colors.textSecondary,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      >
                        {cause}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      影響區域: {diagnostic.affectedAreas.slice(0, 2).join(', ')}
                    </div>
                    <GlassButton
                      theme={theme}
                      variant="secondary"
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                      }}
                    >
                      查看詳情
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'treatment' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: '20px',
            }}
          >
            {data.treatmentPlans.map(plan => (
              <GlassCard key={plan.id} theme={theme} style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: '18px',
                      fontWeight: '600',
                      flex: 1,
                    }}
                  >
                    {plan.title}
                  </h3>
                  <span
                    style={{
                      padding: '4px 8px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {plan.progress}%
                  </span>
                </div>

                <p
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.5',
                  }}
                >
                  {plan.description}
                </p>

                <div
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: colors.text,
                        fontWeight: '500',
                      }}
                    >
                      {t.progress}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      {plan.steps.filter(s => s.completed).length} / {plan.steps.length}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: colors.border,
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${plan.progress}%`,
                        height: '100%',
                        background: colors.accent,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                    }}
                  >
                    時程: {plan.timeline}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <GlassButton
                      theme={theme}
                      variant="ghost"
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                      }}
                    >
                      查看步驟
                    </GlassButton>
                    <GlassButton
                      theme={theme}
                      variant="primary"
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                      }}
                    >
                      更新進度
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      {/* Diagnostic Detail Modal */}
      {selectedDiagnostic && (
        <GlassModal
          isOpen={!!selectedDiagnostic}
          onClose={() => setSelectedDiagnostic(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>Diagnostic Detail</h2>
            <p>Full details for diagnostic {selectedDiagnostic}</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  CorporateHealthCheckUI,
};
