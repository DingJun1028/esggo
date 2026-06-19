/**
 * 🌍 ESG-04 氣候風險分析整合組件
 * Climate Risk Analysis Integration Component
 * 
 * 整合現有資源:
 * - OSClimateService (氣候風險服務)
 * - esg.ts assessClimateRisk() 方法
 * - ComplianceRiskMonitoring (合規風險監控)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  Zap,
  FileText,
  BarChart3,
  Shield
} from 'lucide-react';

import { osClimateService } from '@/services/integration/OSClimateService';
import { ESGService } from '@/services/esg';
import { governanceManager } from '@/services/GovernanceManager';
import { useTheme } from '@/hooks/useTheme';

// TCFD 風險類型
interface ClimateRiskData {
  physical: {
    acute: number;      // 急性風險 (0-100)
    chronic: number;    // 慢性風險 (0-100)
  };
  transition: {
    policy: number;    // 政策風險 (0-100)
    technology: number; // 技術風險 (0-100)
    market: number;     // 市場風險 (0-100)
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallRisk: number;
  opportunities: number;
}

// OS-Climate 數據
interface OSClimateData {
  city: string;
  hazardType: 'FLOOD' | 'DROUGHT' | 'HEATWAVE' | 'WILDFIRE';
  riskScore: number;
  timeline: '2030' | '2050';
}

interface ClimateRiskDashboardProps {
  companyName?: string;
  showTCFD?: boolean;
  showScenarioAnalysis?: boolean;
}

export const ClimateRiskDashboard: React.FC<ClimateRiskDashboardProps> = ({
  companyName = 'Company',
  showTCFD = true,
  showScenarioAnalysis = true
}) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [riskData, setRiskData] = useState<ClimateRiskData | null>(null);
  const [osClimateData, setOSClimateData] = useState<OSClimateData[]>([]);
  const [complianceRisks, setComplianceRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'physical' | 'transition' | 'tcfd'>('overview');

  // 載入氣候風險數據
  const loadClimateData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. 計算氣候風險 (使用現有 assessClimateRisk 方法)
      const mockExposure = {
        physical: {
          acute: Math.floor(Math.random() * 60) + 20,
          chronic: Math.floor(Math.random() * 50) + 30,
        },
        transition: {
          policy: Math.floor(Math.random() * 70) + 20,
          technology: Math.floor(Math.random() * 50) + 20,
          market: Math.floor(Math.random() * 60) + 15,
        },
      };
      
      const riskAssessment = ESGService.assessClimateRisk(mockExposure);
      setRiskData(riskAssessment);

      // 2. 載入 OS-Climate 數據
      const cityRisks = await osClimateService.getCityClimateRisks('Taipei');
      setOSClimateData(cityRisks);

      // 3. 載入合規風險 (TCFD 相關)
      const risks = governanceManager.getComplianceRisks()
        .filter(r => r.regulation.includes('Climate') || r.regulation.includes('TCFD'));
      setComplianceRisks(risks);

    } catch (error) {
      console.error('Failed to load climate risk data:', error);
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  useEffect(() => {
    loadClimateData();
    // 每 5 分鐘刷新
    const interval = setInterval(loadClimateData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadClimateData]);

  // 風險等級顏色
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-emerald-500 bg-emerald-500/20 border-emerald-500/50';
      default: return 'text-slate-500 bg-slate-500/20 border-slate-500/50';
    }
  };

  // 風險進度條
  const RiskProgressBar: React.FC<{ value: number; label: string; color: string }> = ({ 
    value, label, color 
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        <span className="ml-3 text-slate-400">{t('system.loading')}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${
      isDark ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'
    } overflow-hidden`}>
      {/* 標題 */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Thermometer className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">{t('climate.title')}</h3>
              <p className="text-xs text-slate-400">{companyName} - Climate Risk Assessment</p>
            </div>
          </div>
          {riskData && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(riskData.riskLevel)}`}>
              {riskData.riskLevel.toUpperCase()} RISK
            </div>
          )}
        </div>
      </div>

      {/* 標籤導航 */}
      <div className="flex border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'overview', label: t('dashboard.overview'), icon: BarChart3 },
          { id: 'physical', label: t('climate.physical'), icon: Globe },
          { id: 'transition', label: t('climate.transition'), icon: Zap },
          { id: 'tcfd', label: t('climate.tcfd'), icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id 
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 內容區域 */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && riskData && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* 總體風險分數 */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{t('climate.title')}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{riskData.overallRisk}</div>
                <div className="text-xs text-slate-400">{t('esg.score')} (0-100)</div>
              </div>

              {/* 實體風險 */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{t('climate.physical')}</span>
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {riskData.physical.acute + riskData.physical.chronic}
                </div>
                <div className="text-xs text-slate-400">Acute + Chronic</div>
              </div>

              {/* 轉型風險 */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{t('climate.transition')}</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {riskData.transition.policy + riskData.transition.technology + riskData.transition.market}
                </div>
                <div className="text-xs text-slate-400">Policy + Tech + Market</div>
              </div>

              {/* 機會評估 */}
              <div className={`p-4 rounded-xl md:col-span-3 ${
                isDark ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-emerald-400">{t('climate.mitigation')}</div>
                    <div className="text-sm text-slate-400">
                      {t('esg.opportunities')}: {riskData.opportunities} / 100
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'physical' && riskData && (
            <motion.div
              key="physical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="font-medium text-white">{t('climate.physical')}</h4>
              <RiskProgressBar 
                value={riskData.physical.acute} 
                label={t('climate.adaptation')} 
                color="text-blue-400" 
              />
              <RiskProgressBar 
                value={riskData.physical.chronic} 
                label="Chronic Risk" 
                color="text-cyan-400" 
              />
              
              {/* OS-Climate 數據 */}
              <div className="mt-4">
                <h5 className="text-sm text-slate-400 mb-2">OS-Climate Hazard Analysis</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {osClimateData.map((data, idx) => (
                    <div key={idx} className={`p-2 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      <div className="text-xs text-slate-400">{data.hazardType}</div>
                      <div className="text-lg font-bold text-white">{data.riskScore}</div>
                      <div className="text-[10px] text-slate-500">{data.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transition' && riskData && (
            <motion.div
              key="transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="font-medium text-white">{t('climate.transition')}</h4>
              <RiskProgressBar 
                value={riskData.transition.policy} 
                label={t('compliance.standards')} 
                color="text-amber-400" 
              />
              <RiskProgressBar 
                value={riskData.transition.technology} 
                label={t('game.title')} 
                color="text-purple-400" 
              />
              <RiskProgressBar 
                value={riskData.transition.market} 
                label={t('intelligence.competitors')} 
                color="text-pink-400" 
              />
            </motion.div>
          )}

          {activeTab === 'tcfd' && showTCFD && (
            <motion.div
              key="tcfd"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h4 className="font-medium text-white">TCFD {t('climate.tcfd')}</h4>
              </div>

              {/* TCFD 四大支柱進度 */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { pillar: 'Governance', score: 85 },
                  { pillar: 'Strategy', score: 72 },
                  { pillar: 'Risk Management', score: 68 },
                  { pillar: 'Metrics & Targets', score: 90 },
                ].map(item => (
                  <div key={item.pillar} className={`p-3 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{item.pillar}</span>
                      <span className={item.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 合規風險 */}
              {complianceRisks.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm text-slate-400 mb-2">{t('compliance.audit')}</h5>
                  <div className="space-y-2">
                    {complianceRisks.map((risk, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${
                        isDark ? 'bg-slate-800' : 'bg-slate-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">{risk.regulation}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            risk.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {risk.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部操作欄 */}
      <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          Last updated: {new Date().toLocaleString()}
        </span>
        <button 
          onClick={loadClimateData}
          className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          {t('system.loading')} Refresh
        </button>
      </div>
    </div>
  );
};

export default ClimateRiskDashboard;
