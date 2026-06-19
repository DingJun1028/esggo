// ESGss JunAiKey - Governance & Compliance Services UI
// 3. 治理合規服務 (5項服務) - 液態玻璃風格設計

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { AutomatedReportGeneration } from '../../../types/services-part2';

interface AutomatedReportGenerationUIProps {
  data: AutomatedReportGeneration;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const AutomatedReportGenerationUI: React.FC<AutomatedReportGenerationUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'templates' | 'standards'>(
    'overview'
  );
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  const translations = {
    'zh-TW': {
      title: '自動化報告生成',
      overview: '總覽',
      reports: '報告管理',
      templates: '模板庫',
      standards: '標準管理',
      activeReports: '活躍報告',
      completionRate: '完成率',
      timeSaved: '節省時間',
      generateReport: '生成報告',
      reportStatus: '報告狀態',
      framework: '框架',
      lastGenerated: '最後生成',
      complianceScore: '合規分數',
      gri: 'GRI',
      sasb: 'SASB',
      tcfd: 'TCFD',
      csrd: 'CSRD',
      createNew: '建立新報告',
      fromTemplate: '從模板',
      upload: '上傳資料',
      preview: '預覽',
      publish: '發布',
      templateGallery: '模板畫廊',
      standardCompliance: '標準合規性',
    },
    en: {
      title: 'Automated Report Generation',
      overview: 'Overview',
      reports: 'Reports',
      templates: 'Templates',
      standards: 'Standards',
      activeReports: 'Active Reports',
      completionRate: 'Completion Rate',
      timeSaved: 'Time Saved',
      generateReport: 'Generate Report',
      reportStatus: 'Report Status',
      framework: 'Framework',
      lastGenerated: 'Last Generated',
      complianceScore: 'Compliance Score',
      gri: 'GRI',
      sasb: 'SASB',
      tcfd: 'TCFD',
      csrd: 'CSRD',
      createNew: 'Create New',
      fromTemplate: 'From Template',
      upload: 'Upload',
      preview: 'Preview',
      publish: 'Publish',
      templateGallery: 'Template Gallery',
      standardCompliance: 'Standard Compliance',
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

  const ReportsGrid = () => {
    const mockReports = [
      {
        id: '1',
        title: '2023年度ESG報告',
        framework: 'GRI',
        status: 'published',
        completionRate: 95,
        lastGenerated: '2024-01-15',
        pages: 120,
        fileSize: '15.2 MB',
      },
      {
        id: '2',
        title: 'TCFD氣候風險報告',
        framework: 'TCFD',
        status: 'in_review',
        completionRate: 78,
        lastGenerated: '2024-01-20',
        pages: 85,
        fileSize: '8.7 MB',
      },
      {
        id: '3',
        title: 'SASB可持續發展報告',
        framework: 'SASB',
        status: 'draft',
        completionRate: 45,
        lastGenerated: '2024-01-22',
        pages: 65,
        fileSize: '4.3 MB',
      },
      {
        id: '4',
        title: 'CSRD合規報告',
        framework: 'CSRD',
        status: 'planning',
        completionRate: 12,
        lastGenerated: '2024-01-25',
        pages: 30,
        fileSize: '1.8 MB',
      },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
        }}
      >
        {mockReports.map(report => (
          <GlassCard
            key={report.id}
            theme={theme}
            hover={true}
            clickable={true}
            onClick={() => setSelectedReport(report.id)}
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
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    color: colors.text,
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  {report.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '14px',
                    color: colors.textSecondary,
                  }}
                >
                  <span
                    style={{
                      padding: '2px 6px',
                      background: `${colors.primary}33`,
                      color: colors.primary,
                      borderRadius: '4px',
                      fontWeight: '500',
                    }}
                  >
                    {report.framework}
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      background:
                        report.status === 'published'
                          ? `${colors.success}33`
                          : report.status === 'in_review'
                            ? `${colors.warning}33`
                            : report.status === 'draft'
                              ? `${colors.textSecondary}33`
                              : `${colors.accent}33`,
                      color:
                        report.status === 'published'
                          ? colors.success
                          : report.status === 'in_review'
                            ? colors.warning
                            : report.status === 'draft'
                              ? colors.textSecondary
                              : colors.accent,
                      borderRadius: '4px',
                      fontWeight: '500',
                    }}
                  >
                    {report.status === 'published'
                      ? '已發布'
                      : report.status === 'in_review'
                        ? '審核中'
                        : report.status === 'draft'
                          ? '草稿'
                          : '計劃中'}
                  </span>
                </div>
              </div>
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
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '4px',
                  }}
                >
                  {t.completionRate}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color:
                      report.completionRate >= 80
                        ? glassTheme.light.success
                        : report.completionRate >= 50
                          ? glassTheme.light.warning
                          : glassTheme.light.error,
                  }}
                >
                  {report.completionRate}%
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
                  頁數/大小
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: colors.text,
                  }}
                >
                  {report.pages} 頁 / {report.fileSize}
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
                {t.lastGenerated}: {new Date(report.lastGenerated).toLocaleDateString()}
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
                  onClick={e => e?.stopPropagation()}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                >
                  {t.preview}
                </GlassButton>
                <GlassButton
                  theme={theme}
                  variant="primary"
                  onClick={e => e?.stopPropagation()}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                >
                  {t.publish}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  const StandardsCompliance = () => {
    const standards = [
      {
        name: 'GRI',
        title: 'Global Reporting Initiative',
        description: '全球報告倡議標準',
        compliance: 92,
        lastUpdated: '2024-01-15',
        requirements: 34,
        completed: 31,
      },
      {
        name: 'SASB',
        title: 'Sustainability Accounting Standards Board',
        description: '可持續會計準則委員會',
        compliance: 88,
        lastUpdated: '2024-01-10',
        requirements: 27,
        completed: 24,
      },
      {
        name: 'TCFD',
        title: 'Task Force on Climate-related Financial Disclosures',
        description: '氣候相關財務揭露工作組',
        compliance: 85,
        lastUpdated: '2024-01-20',
        requirements: 11,
        completed: 9,
      },
      {
        name: 'CSRD',
        title: 'Corporate Sustainability Reporting Directive',
        description: '企業可持續發展報告指令',
        compliance: 75,
        lastUpdated: '2024-01-05',
        requirements: 12,
        completed: 9,
      },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
        }}
      >
        {standards.map((standard, index) => (
          <GlassCard key={index} theme={theme} style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: '0 0 4px 0',
                    color: colors.text,
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {standard.name}
                </h3>
                <div
                  style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                  }}
                >
                  {standard.title}
                </div>
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color:
                    standard.compliance >= 90
                      ? glassTheme.light.success
                      : standard.compliance >= 80
                        ? glassTheme.light.warning
                        : glassTheme.light.error,
                }}
              >
                {standard.compliance}%
              </div>
            </div>

            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.5',
              }}
            >
              {standard.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '4px',
                  }}
                >
                  需求數量
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: colors.text,
                  }}
                >
                  {standard.requirements}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '4px',
                  }}
                >
                  已完成
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: colors.success,
                  }}
                >
                  {standard.completed}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '4px',
                  }}
                >
                  完成率
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  }}
                >
                  {Math.round((standard.completed / standard.requirements) * 100)}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              <span>最後更新: {new Date(standard.lastUpdated).toLocaleDateString()}</span>
              <GlassButton
                theme={theme}
                variant="primary"
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                }}
              >
                詳情
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </div>
    );
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
              {t.upload}
            </GlassButton>
            <GlassButton theme={theme} variant="primary">
              {t.generateReport}
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
          <TabButton tab="overview" label={t.overview} />
          <TabButton tab="reports" label={t.reports} />
          <TabButton tab="templates" label={t.templates} />
          <TabButton tab="standards" label={t.standards} />
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
        {activeTab === 'overview' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            <GlassCard theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: colors.accent,
                  marginBottom: '8px',
                }}
              >
                24
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                }}
              >
                {t.activeReports}
              </div>
            </GlassCard>

            <GlassCard theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: glassTheme.light.success,
                  marginBottom: '8px',
                }}
              >
                89%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                }}
              >
                {t.completionRate}
              </div>
            </GlassCard>

            <GlassCard theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: glassTheme.light.primary,
                  marginBottom: '8px',
                }}
              >
                4.5小時
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                }}
              >
                {t.timeSaved} (每份報告)
              </div>
            </GlassCard>

            <GlassCard theme={theme} style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: glassTheme.light.warning,
                  marginBottom: '8px',
                }}
              >
                95%
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                }}
              >
                平均{t.complianceScore}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'reports' && <ReportsGrid />}
        {activeTab === 'templates' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.templateGallery}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              報告模板庫將在這裡顯示...
            </div>
          </GlassCard>
        )}
        {activeTab === 'standards' && <StandardsCompliance />}
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <GlassModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>報告生成嚮導</h2>
            <p>逐步報告生成介面...</p>
          </div>
        </GlassModal>
      )}

      {/* Report Builder Modal */}
      {showReportBuilder && (
        <GlassModal
          isOpen={showReportBuilder}
          onClose={() => setShowReportBuilder(false)}
          theme={theme}
          size="xl"
        >
          <div style={{ color: colors.text }}>
            <h2>報告生成嚮導</h2>
            <p>逐步報告生成介面...</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  AutomatedReportGenerationUI,
};
