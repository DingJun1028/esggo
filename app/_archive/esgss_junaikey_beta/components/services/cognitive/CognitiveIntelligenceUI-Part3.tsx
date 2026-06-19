// ESGss JunAiKey - Cognitive Intelligence Services UI/UX (Part 3)
// 完成認知智能服務 - Trend Prediction Engine

import React, { useState, useEffect } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { TrendPredictionEngine } from '../../../types/services';

// ===== 1.5 Trend Prediction Engine =====

interface TrendPredictionEngineUIProps {
  data: TrendPredictionEngine;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const TrendPredictionEngineUI: React.FC<TrendPredictionEngineUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'environmental' | 'social' | 'governance'
  >('all');

  const translations = {
    'zh-TW': {
      title: '趨勢預測引擎',
      predictions: '預測分析',
      riskAlerts: '風險預警',
      opportunities: '機會窗口',
      modelAccuracy: '模型準確度',
      timeframe: '時間範圍',
      confidence: '信心度',
      currentValue: '當前值',
      predictedValue: '預測值',
      scenarios: '情景分析',
      severity: '嚴重程度',
      potentialValue: '潛在價值',
      competitionLevel: '競爭級別',
      overallAccuracy: '整體準確率',
      byCategory: '分類準確率',
      byTimeframe: '時間框架準確率',
      lastEvaluated: '最後評估時間',
      sampleSize: '樣本大小',
      critical: '嚴重',
      high: '高',
      medium: '中等',
      low: '低',
      positive: '正面',
      negative: '負面',
      neutral: '中性',
      days: '天',
      months: '月',
      years: '年',
      all: '全部',
      environmental: '環境',
      social: '社會',
      governance: '治理',
      viewDetails: '查看詳情',
      generateReport: '生成報告',
      exportData: '匯出資料',
    },
    en: {
      title: 'Trend Prediction Engine',
      predictions: 'Predictions',
      riskAlerts: 'Risk Alerts',
      opportunities: 'Opportunities',
      modelAccuracy: 'Model Accuracy',
      timeframe: 'Timeframe',
      confidence: 'Confidence',
      currentValue: 'Current Value',
      predictedValue: 'Predicted Value',
      scenarios: 'Scenarios',
      severity: 'Severity',
      potentialValue: 'Potential Value',
      competitionLevel: 'Competition Level',
      overallAccuracy: 'Overall Accuracy',
      byCategory: 'By Category',
      byTimeframe: 'By Timeframe',
      lastEvaluated: 'Last Evaluated',
      sampleSize: 'Sample Size',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      days: 'days',
      months: 'months',
      years: 'years',
      all: 'All',
      environmental: 'Environmental',
      social: 'Social',
      governance: 'Governance',
      viewDetails: 'View Details',
      generateReport: 'Generate Report',
      exportData: 'Export Data',
    },
  };

  const t = translations[language];

  // Filter predictions based on selected filters
  const filteredPredictions = data.predictions.filter(prediction => {
    const timeMatch = timeFilter === 'all' || prediction.timeframe === timeFilter;
    const categoryMatch = categoryFilter === 'all' || prediction.category === categoryFilter;
    return timeMatch && categoryMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return glassTheme.light.error;
      case 'high':
        return glassTheme.light.warning;
      case 'medium':
        return glassTheme.light.primary;
      default:
        return glassTheme.light.success;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return glassTheme.light.success;
    if (confidence >= 60) return glassTheme.light.warning;
    return glassTheme.light.error;
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'short':
        return t.days;
      case 'medium':
        return t.months;
      case 'long':
        return t.years;
      default:
        return timeframe;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            : 'linear-gradient(135deg, #4b134f 0%, #c94b4b 100%)',
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
              {t.exportData}
            </GlassButton>
            <GlassButton theme={theme} variant="primary">
              {t.generateReport}
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Filters */}
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
            gap: '16px',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <span style={{ color: colors.text, fontSize: '14px', fontWeight: '500' }}>
            {t.timeframe}:
          </span>
          {(['all', 'short', 'medium', 'long'] as const).map(filter => (
            <GlassButton
              key={filter}
              theme={theme}
              variant={timeFilter === filter ? 'primary' : 'ghost'}
              onClick={() => setTimeFilter(filter)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
              }}
            >
              {filter === 'all' ? t.all : getTimeframeText(filter)}
            </GlassButton>
          ))}

          <span
            style={{
              color: colors.text,
              fontSize: '14px',
              fontWeight: '500',
              marginLeft: '20px',
            }}
          >
            類別:
          </span>
          {(['all', 'environmental', 'social', 'governance'] as const).map(filter => (
            <GlassButton
              key={filter}
              theme={theme}
              variant={categoryFilter === filter ? 'primary' : 'ghost'}
              onClick={() => setCategoryFilter(filter)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
              }}
            >
              {t[filter as keyof typeof t]}
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
        {/* Key Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Active Predictions */}
          <GlassCard theme={theme} style={{ padding: '20px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.predictions}
            </h3>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.accent,
                marginBottom: '4px',
              }}
            >
              {data.predictions.length}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              活躍預測
            </div>
          </GlassCard>

          {/* Risk Alerts */}
          <GlassCard theme={theme} style={{ padding: '20px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.riskAlerts}
            </h3>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: glassTheme.light.error,
                marginBottom: '4px',
              }}
            >
              {data.riskAlerts.filter(alert => alert.severity === 'critical').length}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              嚴重預警
            </div>
          </GlassCard>

          {/* Opportunities */}
          <GlassCard theme={theme} style={{ padding: '20px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.opportunities}
            </h3>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: glassTheme.light.success,
                marginBottom: '4px',
              }}
            >
              {data.opportunities.length}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              潛在機會
            </div>
          </GlassCard>

          {/* Model Accuracy */}
          <GlassCard theme={theme} style={{ padding: '20px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.modelAccuracy}
            </h3>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.primary,
                marginBottom: '4px',
              }}
            >
              {data.modelAccuracy.overallAccuracy.toFixed(1)}%
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              {t.overallAccuracy}
            </div>
          </GlassCard>
        </div>

        {/* Grid Layout for Main Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
          }}
        >
          {/* Predictions Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2
              style={{
                margin: 0,
                color: colors.text,
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {t.predictions}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredPredictions.map(prediction => (
                <GlassCard
                  key={prediction.id}
                  theme={theme}
                  hover={true}
                  clickable={true}
                  onClick={() => setSelectedPrediction(prediction.id)}
                  style={{ padding: '20px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          color: colors.text,
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {prediction.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          fontSize: '12px',
                          color: colors.textSecondary,
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 6px',
                            background: `${colors.accent}33`,
                            borderRadius: '4px',
                          }}
                        >
                          {t[prediction.category as keyof typeof t]}
                        </span>
                        <span
                          style={{
                            padding: '2px 6px',
                            background: `${colors.primary}33`,
                            borderRadius: '4px',
                          }}
                        >
                          {getTimeframeText(prediction.timeframe)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        minWidth: '80px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: getConfidenceColor(prediction.confidence),
                        }}
                      >
                        {prediction.confidence}%
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: colors.textSecondary,
                        }}
                      >
                        {t.confidence}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '12px',
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
                        {t.currentValue}
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: colors.text,
                        }}
                      >
                        {prediction.currentValue}
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
                        {t.predictedValue}
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: colors.accent,
                        }}
                      >
                        {prediction.predictedValue}
                      </div>
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
                      {new Date(prediction.generatedAt).toLocaleDateString()}
                    </div>
                    <GlassButton
                      theme={theme}
                      variant="secondary"
                      onClick={e => {
                        e?.stopPropagation();
                        setSelectedPrediction(prediction.id);
                      }}
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      {t.viewDetails}
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Risk Alerts */}
            <GlassCard theme={theme} style={{ padding: '20px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.riskAlerts}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.riskAlerts.slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '12px',
                      background: `${getSeverityColor(alert.severity)}22`,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: colors.text,
                          flex: 1,
                        }}
                      >
                        {alert.title}
                      </div>
                      <span
                        style={{
                          padding: '2px 6px',
                          background: getSeverityColor(alert.severity),
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500',
                        }}
                      >
                        {t[alert.severity as keyof typeof t]}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                        lineHeight: '1.4',
                      }}
                    >
                      {alert.description}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Opportunities */}
            <GlassCard theme={theme} style={{ padding: '20px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.opportunities}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.opportunities.slice(0, 3).map(opportunity => (
                  <div
                    key={opportunity.id}
                    style={{
                      padding: '12px',
                      background: `${glassTheme.light.success}22`,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${glassTheme.light.success}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: colors.text,
                        marginBottom: '8px',
                      }}
                    >
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: colors.textSecondary,
                      }}
                    >
                      <span>💰 {opportunity.potentialValue}</span>
                      <span>🏆 {opportunity.competitionLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Model Accuracy */}
            <GlassCard theme={theme} style={{ padding: '20px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t.modelAccuracy}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {Object.entries(data.modelAccuracy.byCategory).map(([category, accuracy]) => (
                  <div
                    key={category}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: colors.text,
                        textTransform: 'capitalize',
                      }}
                    >
                      {t[category as keyof typeof t]}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '50px',
                          height: '4px',
                          background: colors.border,
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${accuracy}%`,
                            height: '100%',
                            background: getConfidenceColor(accuracy),
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: colors.textSecondary,
                          minWidth: '35px',
                        }}
                      >
                        {accuracy.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </aside>
        </div>
      </main>

      {/* Prediction Detail Modal */}
      {selectedPrediction && (
        <GlassModal
          isOpen={!!selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>Prediction Detail</h2>
            <p>Detailed view for prediction {selectedPrediction}</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  TrendPredictionEngineUI,
};
