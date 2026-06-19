// ESGss JunAiKey - Impact Restoration Lab UI
// 2.3 影響修復實驗室 - 液態玻璃風格設計

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { ImpactRestorationLab } from '../../../types/services';

interface ImpactRestorationLabUIProps {
  data: ImpactRestorationLab;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const ImpactRestorationLabUI: React.FC<ImpactRestorationLabUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<
    'projects' | 'simulations' | 'blockchain' | 'protocols'
  >('projects');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const translations = {
    'zh-TW': {
      title: '影響修復實驗室',
      projects: '修復項目',
      simulations: '模擬分析',
      blockchain: '區塊鏈證明',
      protocols: '治癒協議',
      activeProjects: '活躍項目',
      environmentalImpact: '環境影響',
      restorationProgress: '修復進度',
      blockchainVerified: '區塊鏈驗證',
      viewDetails: '查看詳情',
      createProject: '創建項目',
      runSimulation: '運行模擬',
      verifyOnChain: '鏈上驗證',
      systemHealing: '系統性治癒',
    },
    en: {
      title: 'Impact Restoration Lab',
      projects: 'Restoration Projects',
      simulations: 'Simulation Analysis',
      blockchain: 'Blockchain Proof',
      protocols: 'Healing Protocols',
      activeProjects: 'Active Projects',
      environmentalImpact: 'Environmental Impact',
      restorationProgress: 'Restoration Progress',
      blockchainVerified: 'Blockchain Verified',
      viewDetails: 'View Details',
      createProject: 'Create Project',
      runSimulation: 'Run Simulation',
      verifyOnChain: 'Verify On-Chain',
      systemHealing: 'System Healing',
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

  const ProjectsGrid = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
      }}
    >
      {data.projects?.map(project => (
        <GlassCard
          key={project.id}
          theme={theme}
          hover={true}
          clickable={true}
          onClick={() => setSelectedProject(project.id)}
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
                fontSize: '18px',
                fontWeight: '600',
                flex: 1,
              }}
            >
              {project.title}
            </h3>
            <div
              style={{
                padding: '4px 8px',
                background:
                  project.status === 'completed'
                    ? `${glassTheme.light.success}33`
                    : project.status === 'implementation'
                      ? `${glassTheme.light.warning}33`
                      : `${glassTheme.light.primary}33`,
                color:
                  project.status === 'completed'
                    ? glassTheme.light.success
                    : project.status === 'implementation'
                      ? glassTheme.light.warning
                      : colors.primary,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {project.status}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
              }}
            >
              位置: {project.location.region}, {project.location.country}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
              }}
            >
              影響類型: {project.impactArea.type}
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
                修復進度
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.accent,
                }}
              >
                {project.progress}%
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
                區塊鏈驗證
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color:
                    project.status === 'completed'
                      ? glassTheme.light.success
                      : colors.textSecondary,
                }}
              >
                {project.status === 'completed' ? '✓' : '-'}
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
              狀態: {project.status}
            </div>
            <GlassButton
              theme={theme}
              variant="primary"
              style={{
                padding: '4px 12px',
                fontSize: '12px',
              }}
            >
              {t.viewDetails}
            </GlassButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const SimulationsView = () => (
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
          模擬分析引擎
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {data.simulations?.map(simulation => (
            <GlassCard key={simulation.id} theme={theme} style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {simulation.scenario}
                </h4>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: glassTheme.light.primary,
                  }}
                >
                  {simulation.confidence}%
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
                項測修復效果分析
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                  color: colors.textSecondary,
                }}
              >
                {simulation.results.slice(0, 4).map((result, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px',
                      background: `${colors.border}33`,
                      borderRadius: '4px',
                    }}
                  >
                    {result.indicator}: {result.improvement > 0 ? '+' : ''}
                    {result.improvement}%
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const BlockchainView = () => (
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
          區塊鏈證明錨定
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '16px',
          }}
        >
          {data.blockchainProofs?.map(proof => (
            <GlassCard key={proof.id} theme={theme} style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  項目 #{proof.projectId}
                </h4>
                <div
                  style={{
                    padding: '4px 8px',
                    background: proof.verified
                      ? `${glassTheme.light.success}33`
                      : `${glassTheme.light.warning}33`,
                    color: proof.verified ? glassTheme.light.success : glassTheme.light.warning,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {proof.verified ? '已驗證' : '待驗證'}
                </div>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                }}
              >
                交易哈希: {proof.transactionHash.slice(0, 10)}...{proof.transactionHash.slice(-10)}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  marginBottom: '12px',
                }}
              >
                區塊: #{proof.blockNumber} | 時間: {new Date(proof.timestamp).toLocaleString()}
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
                  檢視證明
                </GlassButton>
                {!proof.verified && (
                  <GlassButton
                    theme={theme}
                    variant="primary"
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                    }}
                  >
                    驗證
                  </GlassButton>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const ProtocolsView = () => (
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
          系統性治癒協議
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '16px',
          }}
        >
          {data.healingProtocols?.map(protocol => (
            <GlassCard key={protocol.id} theme={theme} style={{ padding: '20px' }}>
              <div
                style={{
                  marginBottom: '16px',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {protocol.name}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.5',
                  }}
                >
                  {protocol.description}
                </p>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  marginBottom: '12px',
                }}
              >
                適用影響類型: {protocol.applicableImpactTypes.join(', ')}
              </div>

              <div
                style={{
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '8px',
                  }}
                >
                  治癒步驟:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {protocol.steps.slice(0, 3).map((step, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: '12px',
                        color: colors.text,
                        padding: '4px',
                        background: `${colors.border}33`,
                        borderRadius: '4px',
                      }}
                    >
                      {step.order}. {step.title}
                    </div>
                  ))}
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
                  案例研究: {protocol.caseStudies.length} 個
                </div>
                <GlassButton
                  theme={theme}
                  variant="primary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                  }}
                >
                  應用協議
                </GlassButton>
              </div>
            </GlassCard>
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
            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            : 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
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
              {t.createProject}
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
          <TabButton tab="projects" label={t.projects} />
          <TabButton tab="simulations" label={t.simulations} />
          <TabButton tab="blockchain" label={t.blockchain} />
          <TabButton tab="protocols" label={t.protocols} />
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
        {activeTab === 'projects' && <ProjectsGrid />}
        {activeTab === 'simulations' && <SimulationsView />}
        {activeTab === 'blockchain' && <BlockchainView />}
        {activeTab === 'protocols' && <ProtocolsView />}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <GlassModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>項目詳細資訊</h2>
            <p>詳細的修復項目資訊: {selectedProject}</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  ImpactRestorationLabUI,
};
