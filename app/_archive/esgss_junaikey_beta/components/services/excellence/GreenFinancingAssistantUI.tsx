// ESGss JunAiKey - Green Financing Assistant UI
// 2.5 綠色融資助手 - 液態玻璃風格設計

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { GreenFinancingAssistant } from '../../../types/services-part2';

interface GreenFinancingAssistantUIProps {
  data: GreenFinancingAssistant;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const GreenFinancingAssistantUI: React.FC<GreenFinancingAssistantUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<
    'opportunities' | 'applications' | 'compliance' | 'investors'
  >('opportunities');
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [showApplicationWizard, setShowApplicationWizard] = useState(false);

  const translations = {
    'zh-TW': {
      title: '綠色融資助手',
      opportunities: '融資機會',
      applications: '申請管理',
      compliance: '合規檢查',
      investors: '投資者連接',
      availableOpportunities: '可用機會',
      activeApplications: '活躍申請',
      fundingSuccess: '融資成功率',
      averageAmount: '平均金額',
      matchingScore: '匹配度',
      applicationProgress: '申請進度',
      documents: '所需文件',
      submitApplication: '提交申請',
      searchInvestors: '搜尋投資者',
      contactInvestor: '聯繫投資者',
      createProfile: '創建檔案',
      totalOpportunities: '總機會',
      successRate: '成功率',
      pendingApplications: '待審核申請',
      filterByCategory: '按類別篩選',
      filterByStage: '按階段篩選',
      viewDetails: '查看詳情',
    },
    en: {
      title: 'Green Financing Assistant',
      opportunities: 'Financing Opportunities',
      applications: 'Applications',
      compliance: 'Compliance Check',
      investors: 'Investor Connections',
      availableOpportunities: 'Available Opportunities',
      activeApplications: 'Active Applications',
      fundingSuccess: 'Funding Success Rate',
      averageAmount: 'Average Amount',
      matchingScore: 'Matching Score',
      applicationProgress: 'Application Progress',
      documents: 'Required Documents',
      submitApplication: 'Submit Application',
      searchInvestors: 'Search Investors',
      contactInvestor: 'Contact Investor',
      createProfile: 'Create Profile',
      totalOpportunities: 'Total Opportunities',
      successRate: 'Success Rate',
      pendingApplications: 'Pending Applications',
      filterByCategory: 'Filter by Category',
      filterByStage: 'Filter by Stage',
      viewDetails: 'View Details',
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

  const OpportunityCards = () => {
    // 模擬數據
    const mockOpportunities = [
      {
        id: '1',
        title: '綠色能源轉型基金',
        provider: 'Climate Investment Fund',
        type: 'grant',
        amount: '$2M',
        category: 'renewable_energy',
        stage: 'open',
        matching: 95,
        deadline: '2024-03-15',
        description: '支持企業向可再生能源轉型的專項資助',
      },
      {
        id: '2',
        title: '永續發展貸款',
        provider: 'Green Bank International',
        type: 'loan',
        amount: '$5M',
        category: 'sustainability',
        stage: 'evaluating',
        matching: 88,
        deadline: '2024-04-01',
        description: '低利率永續發展專案貸款',
      },
      {
        id: '3',
        title: 'ESG影響投資',
        provider: 'Impact Capital Partners',
        type: 'equity',
        amount: '$10M',
        category: 'impact_investment',
        stage: 'initial_review',
        matching: 92,
        deadline: '2024-02-28',
        description: '專注於高ESG評分企業的股權投資',
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
        {mockOpportunities.map(opportunity => (
          <GlassCard
            key={opportunity.id}
            theme={theme}
            hover={true}
            clickable={true}
            onClick={() => setSelectedOpportunity(opportunity.id)}
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
                  {opportunity.title}
                </h3>
                <div
                  style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    marginBottom: '4px',
                  }}
                >
                  {opportunity.provider}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      padding: '2px 6px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {opportunity.type}
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      background: `${colors.primary}33`,
                      color: colors.primary,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {opportunity.category}
                  </span>
                </div>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  minWidth: '120px',
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
                  {opportunity.amount}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: glassTheme.light.success,
                  }}
                >
                  {t.matchingScore}: {opportunity.matching}%
                </div>
              </div>
            </div>

            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.5',
              }}
            >
              {opportunity.description}
            </p>

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
                截止日期: {new Date(opportunity.deadline).toLocaleDateString()}
              </div>
              <GlassButton
                theme={theme}
                variant="primary"
                onClick={e => {
                  e?.stopPropagation();
                  setShowApplicationWizard(true);
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                }}
              >
                {t.submitApplication}
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  const ApplicationsList = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      <GlassCard theme={theme} style={{ padding: '24px' }}>
        <h3
          style={{
            margin: '0 0 20px 0',
            color: colors.text,
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          {t.activeApplications}
        </h3>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          {[
            {
              id: '1',
              title: '太陽能板場融資',
              stage: 'submitted',
              progress: 75,
              deadline: '2024-03-01',
            },
            {
              id: '2',
              title: '碳信貸款申請',
              stage: 'review',
              progress: 40,
              deadline: '2024-02-15',
            },
            {
              id: '3',
              title: '綠色債券發行',
              stage: 'draft',
              progress: 20,
              deadline: '2024-04-15',
            },
          ].map(app => (
            <GlassCard key={app.id} theme={theme} style={{ padding: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 4px 0',
                      color: colors.text,
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {app.title}
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                    }}
                  >
                    截止: {new Date(app.deadline).toLocaleDateString()}
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background:
                      app.stage === 'submitted'
                        ? `${colors.success}33`
                        : app.stage === 'review'
                          ? `${colors.warning}33`
                          : `${colors.textSecondary}33`,
                    color:
                      app.stage === 'submitted'
                        ? colors.success
                        : app.stage === 'review'
                          ? colors.warning
                          : colors.textSecondary,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {app.stage}
                </div>
              </div>

              <div
                style={{
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                    }}
                  >
                    {t.applicationProgress}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text,
                    }}
                  >
                    {app.progress}%
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
                      width: `${app.progress}%`,
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
                  gap: '8px',
                }}
              >
                <GlassButton
                  theme={theme}
                  variant="ghost"
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                >
                  {t.documents}
                </GlassButton>
                <GlassButton
                  theme={theme}
                  variant="primary"
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                >
                  編輯
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const StatsOverview = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.accent,
            marginBottom: '8px',
          }}
        >
          156
        </div>
        <div
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          {t.totalOpportunities}
        </div>
      </GlassCard>

      <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: glassTheme.light.success,
            marginBottom: '8px',
          }}
        >
          78%
        </div>
        <div
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          {t.successRate}
        </div>
      </GlassCard>

      <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.warning,
            marginBottom: '8px',
          }}
        >
          12
        </div>
        <div
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          {t.pendingApplications}
        </div>
      </GlassCard>

      <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: '8px',
          }}
        >
          $3.2M
        </div>
        <div
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          {t.averageAmount}
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
            ? 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #27ae60 100%)',
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
              {t.createProfile}
            </GlassButton>
            <GlassButton theme={theme} variant="primary">
              {t.searchInvestors}
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
          <TabButton tab="opportunities" label={t.opportunities} />
          <TabButton tab="applications" label={t.applications} />
          <TabButton tab="compliance" label={t.compliance} />
          <TabButton tab="investors" label={t.investors} />
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
        {activeTab === 'opportunities' && (
          <div>
            <StatsOverview />
            <OpportunityCards />
          </div>
        )}

        {activeTab === 'applications' && <ApplicationsList />}

        {activeTab === 'compliance' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.compliance}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              合規檢查工具將在這裡顯示...
            </div>
          </GlassCard>
        )}

        {activeTab === 'investors' && (
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 20px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.investors}
            </h3>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
              }}
            >
              投資者連接平台將在這裡顯示...
            </div>
          </GlassCard>
        )}
      </main>

      {/* Modals */}
      {selectedOpportunity && (
        <GlassModal
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>融資機會詳情</h2>
            <p>詳細的融資機會資訊: {selectedOpportunity}</p>
          </div>
        </GlassModal>
      )}

      {showApplicationWizard && (
        <GlassModal
          isOpen={showApplicationWizard}
          onClose={() => setShowApplicationWizard(false)}
          theme={theme}
          size="xl"
        >
          <div style={{ color: colors.text }}>
            <h2>融資申請嚮導</h2>
            <p>逐步引導完成融資申請流程...</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  GreenFinancingAssistantUI,
};
