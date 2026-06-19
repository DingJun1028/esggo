// ESGss JunAiKey - Carbon Inventory Management UI
// 2.2 碳盤存管理 - 液態玻璃風格設計

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { CarbonInventoryManagement } from '../../../types/services';

interface CarbonInventoryManagementUIProps {
  data: CarbonInventoryManagement;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const CarbonInventoryManagementUI: React.FC<CarbonInventoryManagementUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'hotspots' | 'reduction'>(
    'overview'
  );
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showHotspotModal, setShowHotspotModal] = useState(false);

  const translations = {
    'zh-TW': {
      title: '碳盤存管理',
      overview: '總覽',
      inventory: '盤存明細',
      hotspots: '熱點分析',
      reductionPathways: '減量路徑',
      totalEmissions: '總排放量',
      scope1: '範疇1',
      scope2: '範疇2',
      scope3: '範疇3',
      baselineYear: '基準年',
      currentYear: '當前年',
      reductionPercentage: '減量百分比',
      emissions: '噸CO₂e',
      identifyHotspots: '識別熱點',
      viewReport: '檢視報告',
      addSource: '新增排放源',
      recalculate: '重新計算',
      exportData: '匯出資料',
    },
    en: {
      title: 'Carbon Inventory Management',
      overview: 'Overview',
      inventory: 'Inventory',
      hotspots: 'Hotspots',
      reductionPathways: 'Reduction Pathways',
      totalEmissions: 'Total Emissions',
      scope1: 'Scope 1',
      scope2: 'Scope 2',
      scope3: 'Scope 3',
      baselineYear: 'Baseline Year',
      currentYear: 'Current Year',
      reductionPercentage: 'Reduction %',
      emissions: 'tCO₂e',
      identifyHotspots: 'Identify Hotspots',
      viewReport: 'View Report',
      addSource: 'Add Source',
      recalculate: 'Recalculate',
      exportData: 'Export Data',
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

  const EmissionsSummary = () => {
    const latestInventory = data.inventory;
    if (!latestInventory) return null;

    return (
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
              fontSize: '14px',
              color: colors.textSecondary,
              marginBottom: '8px',
            }}
          >
            {t.totalEmissions}
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: colors.accent,
            }}
          >
            {latestInventory.total.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            {t.emissions}
          </div>
        </GlassCard>

        <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              color: colors.textSecondary,
              marginBottom: '8px',
            }}
          >
            {t.scope1}
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: glassTheme.light.error,
            }}
          >
            {latestInventory.scope1.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            {((latestInventory.scope1 / latestInventory.total) * 100).toFixed(1)}%
          </div>
        </GlassCard>

        <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              color: colors.textSecondary,
              marginBottom: '8px',
            }}
          >
            {t.scope2}
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: glassTheme.light.warning,
            }}
          >
            {latestInventory.scope2.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            {((latestInventory.scope2 / latestInventory.total) * 100).toFixed(1)}%
          </div>
        </GlassCard>

        <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              color: colors.textSecondary,
              marginBottom: '8px',
            }}
          >
            {t.scope3}
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: glassTheme.light.primary,
            }}
          >
            {latestInventory.scope3.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            {((latestInventory.scope3 / latestInventory.total) * 100).toFixed(1)}%
          </div>
        </GlassCard>

        {latestInventory.reductionPercentage && (
          <GlassCard theme={theme} style={{ padding: '20px', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                marginBottom: '8px',
              }}
            >
              {t.reductionPercentage}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: glassTheme.light.success,
              }}
            >
              -{latestInventory.reductionPercentage.toFixed(1)}%
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              vs {t.baselineYear} {latestInventory.baselineYear}
            </div>
          </GlassCard>
        )}
      </div>
    );
  };

  const InventoryTable = () => (
    <GlassCard theme={theme} style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
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
          排放源清單
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <GlassButton theme={theme} variant="secondary">
            {t.addSource}
          </GlassButton>
          <GlassButton theme={theme} variant="primary">
            {t.recalculate}
          </GlassButton>
        </div>
      </div>

      <div
        style={{
          overflowX: 'auto',
          borderRadius: '8px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                排放源
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                範疇
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                排放量
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                百分比
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {data.emissionSources?.slice(0, 10).map(source => (
              <tr
                key={source.id}
                style={{
                  borderBottom: `1px solid ${colors.border}33`,
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    color: colors.text,
                  }}
                >
                  {source.name}
                </td>
                <td
                  style={{
                    padding: '12px',
                    color: colors.textSecondary,
                    textTransform: 'uppercase',
                  }}
                >
                  {source.category}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.text,
                    fontWeight: '500',
                  }}
                >
                  {source.emissions.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                  }}
                >
                  {data.inventory
                    ? ((source.emissions / data.inventory.total) * 100).toFixed(2)
                    : '0.00'}
                  %
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <GlassButton
                    theme={theme}
                    variant="ghost"
                    onClick={() => setSelectedSource(source.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                    }}
                  >
                    詳情
                  </GlassButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );

  const HotspotsAnalysis = () => (
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
          排放熱點分析
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {data.hotspots?.slice(0, 6).map((hotspot, index) => (
            <GlassCard
              key={hotspot.id}
              theme={theme}
              hover={true}
              clickable={true}
              onClick={() => setShowHotspotModal(true)}
              style={{ padding: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text,
                      marginBottom: '4px',
                    }}
                  >
                    {index + 1}. {hotspot.sourceName}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                    }}
                  >
                    {data.emissionSources.find(s => s.id === hotspot.sourceId)?.category || 'N/A'}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: glassTheme.light.error,
                  }}
                >
                  {hotspot.emissions.toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                  color: colors.textSecondary,
                }}
              >
                <div>
                  <span>占比: </span>
                  <span
                    style={{
                      fontWeight: '500',
                      color: colors.text,
                    }}
                  >
                    {hotspot.percentageOfTotal.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span>減量潛力: </span>
                  <span
                    style={{
                      fontWeight: '500',
                      color: glassTheme.light.success,
                    }}
                  >
                    {hotspot.reductionPotential}%
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const ReductionPathways = () => (
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
          減量路徑
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '16px',
          }}
        >
          {data.reductionPathways?.map(pathway => (
            <GlassCard key={pathway.id} theme={theme} style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    flex: 1,
                  }}
                >
                  {pathway.title}
                </h4>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: glassTheme.light.success,
                  }}
                >
                  {pathway.targetReduction}%
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
                {pathway.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: colors.textSecondary,
                }}
              >
                <span>時程: {pathway.timeframe}</span>
                <span>預估節省: ${pathway.totalCost.toLocaleString()}</span>
              </div>

              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {pathway.initiatives.slice(0, 3).map((initiative, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 6px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                      borderRadius: '4px',
                      fontSize: '10px',
                    }}
                  >
                    {initiative.name}
                  </span>
                ))}
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
            ? 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
            : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
              {t.exportData}
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
          <TabButton tab="inventory" label={t.inventory} />
          <TabButton tab="hotspots" label={t.hotspots} />
          <TabButton tab="reduction" label={t.reductionPathways} />
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
        {activeTab === 'overview' && <EmissionsSummary />}
        {activeTab === 'inventory' && <InventoryTable />}
        {activeTab === 'hotspots' && <HotspotsAnalysis />}
        {activeTab === 'reduction' && <ReductionPathways />}
      </main>

      {/* Modals */}
      {selectedSource && (
        <GlassModal
          isOpen={!!selectedSource}
          onClose={() => setSelectedSource(null)}
          theme={theme}
          size="md"
        >
          <div style={{ color: colors.text }}>
            <h2>排放源詳情</h2>
            <p>詳細資訊: {selectedSource}</p>
          </div>
        </GlassModal>
      )}

      {showHotspotModal && (
        <GlassModal
          isOpen={showHotspotModal}
          onClose={() => setShowHotspotModal(false)}
          theme={theme}
          size="lg"
        >
          <div style={{ color: colors.text }}>
            <h2>熱點詳細分析</h2>
            <p>詳細的熱點分析資訊</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  CarbonInventoryManagementUI,
};
