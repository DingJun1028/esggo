import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Eye,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Zap,
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';
import { Language } from '../../types';
import { UniversalAgentContext } from '../../contexts/UniversalAgentContext';

interface VerificationClaim {
  id: string;
  claim: string;
  category: 'environmental' | 'social' | 'governance' | 'financial';
  source: string;
  confidence: number;
  verificationStatus: 'verified' | 'questionable' | 'debunked' | 'pending';
  evidence: string[];
  lastVerified: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: 'climate' | 'market' | 'regulatory' | 'technological';
  timeHorizon: 'short' | 'medium' | 'long';
  variables: Record<string, number>;
  outcomes: ScenarioOutcome[];
  probability: number;
  impact: 'positive' | 'neutral' | 'negative' | 'severe';
}

interface ScenarioOutcome {
  metric: string;
  baseline: number;
  projected: number;
  confidence: number;
  timeframe: string;
}

interface IntelligenceMetrics {
  hallucinationRate: number;
  verificationAccuracy: number;
  predictionConfidence: number;
  dataFreshness: number;
  coverage: number;
}

const ZeroHallucinationVerifier: React.FC<{
  claims: VerificationClaim[];
  language: Language;
}> = ({ claims, language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'questionable': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'debunked': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'pending': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'questionable': return <AlertTriangle className="w-4 h-4" />;
      case 'debunked': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesCategory = selectedCategory === 'all' || claim.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      claim.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {language === 'zh-TW' ? '零幻覺查證系統' : 'ZERO HALLUCINATION VERIFICATION'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'zh-TW' ? '搜尋聲明...' : 'Search claims...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">{language === 'zh-TW' ? '所有類別' : 'All Categories'}</option>
            <option value="environmental">{language === 'zh-TW' ? '環境' : 'Environmental'}</option>
            <option value="social">{language === 'zh-TW' ? '社會' : 'Social'}</option>
            <option value="governance">{language === 'zh-TW' ? '治理' : 'Governance'}</option>
            <option value="financial">{language === 'zh-TW' ? '財務' : 'Financial'}</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredClaims.map((claim) => (
          <motion.div
            key={claim.id}
            className={`border rounded-lg p-3 ${getStatusColor(claim.verificationStatus)}`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(claim.verificationStatus)}
                <span className="text-white font-medium text-sm">{claim.claim}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getRiskColor(claim.riskLevel)}`}>
                  {claim.riskLevel.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {claim.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>{claim.source}</span>
              <span>{new Date(claim.lastVerified).toLocaleDateString()}</span>
            </div>

            <div className="text-xs text-gray-300 mb-2">
              <span className="text-cyan-400">
                {language === 'zh-TW' ? '證據' : 'Evidence'}:
              </span>
              {claim.evidence.length > 0 ? (
                <span className="ml-1">
                  {claim.evidence.slice(0, 2).join(', ')}
                  {claim.evidence.length > 2 && ` ${language === 'zh-TW' ? '等' : 'etc.'}`}
                </span>
              ) : (
                <span className="ml-1 text-gray-500">
                  {language === 'zh-TW' ? '無證據' : 'No evidence'}
                </span>
              )}
            </div>

            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full ${
                  claim.verificationStatus === 'verified' ? 'bg-green-400' :
                  claim.verificationStatus === 'questionable' ? 'bg-yellow-400' :
                  claim.verificationStatus === 'debunked' ? 'bg-red-400' : 'bg-gray-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${claim.confidence}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClaims.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          {language === 'zh-TW' ? '未找到匹配的聲明' : 'No matching claims found'}
        </div>
      )}
    </div>
  );
};

const FutureProjectionSandbox: React.FC<{
  scenarios: SimulationScenario[];
  language: Language;
}> = ({ scenarios, language }) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'climate': return 'text-green-400 border-green-400/30';
      case 'market': return 'text-blue-400 border-blue-400/30';
      case 'regulatory': return 'text-purple-400 border-purple-400/30';
      case 'technological': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-400 bg-green-500/10';
      case 'neutral': return 'text-gray-400 bg-gray-500/10';
      case 'negative': return 'text-orange-400 bg-orange-500/10';
      case 'severe': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const runSimulation = async (scenarioId: string) => {
    setIsRunning(true);
    setSelectedScenario(scenarioId);
    // Simulate running simulation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunning(false);
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {language === 'zh-TW' ? '未來推演沙盒' : 'FUTURE PROJECTION SANDBOX'}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {scenarios.length} {language === 'zh-TW' ? '情境' : 'scenarios'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              className={`border rounded-lg p-3 cursor-pointer ${getScenarioColor(scenario.type)} ${
                selectedScenario === scenario.id ? 'ring-2 ring-cyan-400' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1">{scenario.name}</h4>
                  <p className="text-gray-300 text-xs mb-2">{scenario.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded ${getImpactColor(scenario.impact)}`}>
                    {scenario.impact.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {scenario.probability}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{scenario.timeHorizon} term</span>
                <span>{scenario.type}</span>
              </div>

              <div className="mt-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    runSimulation(scenario.id);
                  }}
                  disabled={isRunning}
                  className={`w-full py-1 px-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                    isRunning && selectedScenario === scenario.id
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                  whileHover={!isRunning || selectedScenario !== scenario.id ? { scale: 1.05 } : {}}
                  whileTap={!isRunning || selectedScenario !== scenario.id ? { scale: 0.95 } : {}}
                >
                  {isRunning && selectedScenario === scenario.id ? (
                    <>
                      <Activity className="w-3 h-3 animate-pulse" />
                      {language === 'zh-TW' ? '運行中...' : 'Running...'}
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      {language === 'zh-TW' ? '運行模擬' : 'Run Simulation'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scenario Details */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          {selectedScenario ? (
            (() => {
              const scenario = scenarios.find(s => s.id === selectedScenario);
              if (!scenario) return null;

              return (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">{scenario.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{scenario.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">
                      {language === 'zh-TW' ? '關鍵變數' : 'Key Variables'}
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(scenario.variables).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="text-sm text-cyan-400 font-mono">
                            {value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">
                      {language === 'zh-TW' ? '預測結果' : 'Projected Outcomes'}
                    </h4>
                    <div className="space-y-2">
                      {scenario.outcomes.map((outcome, index) => (
                        <div key={index} className="bg-gray-700/50 rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-white">{outcome.metric}</span>
                            <span className="text-xs text-gray-400">{outcome.timeframe}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">
                              {outcome.baseline} → {outcome.projected}
                            </span>
                            <span className={`font-medium ${
                              outcome.projected > outcome.baseline ? 'text-green-400' :
                              outcome.projected < outcome.baseline ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              ({outcome.confidence}% {language === 'zh-TW' ? '信心' : 'confidence'})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'zh-TW' ? '選擇一個情境來查看詳細資訊' : 'Select a scenario to view details'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IntelligenceMetricsDashboard: React.FC<{
  metrics: IntelligenceMetrics;
  language: Language;
}> = ({ metrics, language }) => {
  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400 font-bold">
          {language === 'zh-TW' ? '智慧指標儀表板' : 'INTELLIGENCE METRICS DASHBOARD'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            key: 'hallucinationRate',
            label: language === 'zh-TW' ? '幻覺率' : 'Hallucination Rate',
            value: metrics.hallucinationRate,
            thresholds: { good: 1, warning: 5 },
            suffix: '%'
          },
          {
            key: 'verificationAccuracy',
            label: language === 'zh-TW' ? '驗證準確性' : 'Verification Accuracy',
            value: metrics.verificationAccuracy,
            thresholds: { good: 95, warning: 85 },
            suffix: '%'
          },
          {
            key: 'predictionConfidence',
            label: language === 'zh-TW' ? '預測信心' : 'Prediction Confidence',
            value: metrics.predictionConfidence,
            thresholds: { good: 80, warning: 60 },
            suffix: '%'
          },
          {
            key: 'dataFreshness',
            label: language === 'zh-TW' ? '資料新鮮度' : 'Data Freshness',
            value: metrics.dataFreshness,
            thresholds: { good: 90, warning: 70 },
            suffix: '%'
          },
          {
            key: 'coverage',
            label: language === 'zh-TW' ? '覆蓋率' : 'Coverage',
            value: metrics.coverage,
            thresholds: { good: 85, warning: 65 },
            suffix: '%'
          }
        ].map((metric) => (
          <div key={metric.key} className="text-center">
            <div className={`text-2xl font-bold ${getMetricStatus(metric.value, metric.thresholds)}`}>
              {metric.value}{metric.suffix}
            </div>
            <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FoundationalIntelligence: React.FC<{ language: Language }> = ({ language }) => {
  const [verificationClaims] = useState<VerificationClaim[]>([
    {
      id: 'vc1',
      claim: language === 'zh-TW' ? '2025年全球碳排放將減少5%' : 'Global carbon emissions will decrease by 5% in 2025',
      category: 'environmental',
      source: 'IPCC Report 2024',
      confidence: 92,
      verificationStatus: 'verified',
      evidence: ['Satellite monitoring data', 'Ground station measurements', 'Emission trading data'],
      lastVerified: Date.now() - 86400000,
      riskLevel: 'low'
    },
    {
      id: 'vc2',
      claim: language === 'zh-TW' ? '台灣再生能源占比將達25%' : 'Taiwan renewable energy share will reach 25%',
      category: 'environmental',
      source: 'Taiwan Government Report',
      confidence: 78,
      verificationStatus: 'questionable',
      evidence: ['Government projections', 'Industry reports'],
      lastVerified: Date.now() - 172800000,
      riskLevel: 'medium'
    },
    {
      id: 'vc3',
      claim: language === 'zh-TW' ? '企業ESG評分提升會增加股價15%' : 'ESG rating improvement increases stock price by 15%',
      category: 'financial',
      source: 'MSCI Research',
      confidence: 45,
      verificationStatus: 'debunked',
      evidence: ['Historical market data shows only 3-5% correlation'],
      lastVerified: Date.now() - 259200000,
      riskLevel: 'high'
    }
  ]);

  const [simulationScenarios] = useState<SimulationScenario[]>([
    {
      id: 'scenario1',
      name: language === 'zh-TW' ? '氣候轉型加速情境' : 'Accelerated Climate Transition Scenario',
      description: language === 'zh-TW'
        ? '全球各國加快減碳進度，技術創新加速'
        : 'Countries accelerate decarbonization, technology innovation speeds up',
      type: 'climate',
      timeHorizon: 'long',
      variables: { temperature: 1.5, emission_reduction: 50, renewable_adoption: 80 },
      outcomes: [
        { metric: 'Global Temperature Rise', baseline: 2.4, projected: 1.8, confidence: 75, timeframe: '2050' },
        { metric: 'Carbon Price', baseline: 50, projected: 120, confidence: 65, timeframe: '2030' },
        { metric: 'Renewable Energy Share', baseline: 25, projected: 60, confidence: 80, timeframe: '2040' }
      ],
      probability: 35,
      impact: 'positive'
    },
    {
      id: 'scenario2',
      name: language === 'zh-TW' ? '地緣政治風險情境' : 'Geopolitical Risk Scenario',
      description: language === 'zh-TW'
        ? '貿易緊張加劇，供應鏈中斷風險增加'
        : 'Trade tensions intensify, supply chain disruption risks increase',
      type: 'market',
      timeHorizon: 'medium',
      variables: { trade_tension: 80, supply_disruption: 60, commodity_prices: 40 },
      outcomes: [
        { metric: 'Supply Chain Cost', baseline: 100, projected: 150, confidence: 70, timeframe: '2026' },
        { metric: 'Commodity Prices', baseline: 100, projected: 130, confidence: 60, timeframe: '2025' },
        { metric: 'Market Volatility', baseline: 20, projected: 45, confidence: 55, timeframe: '2025' }
      ],
      probability: 55,
      impact: 'negative'
    },
    {
      id: 'scenario3',
      name: language === 'zh-TW' ? 'AI治理新規情境' : 'AI Governance New Regulations Scenario',
      description: language === 'zh-TW'
        ? '各國推出AI倫理和安全新規範'
        : 'Countries introduce new AI ethics and safety regulations',
      type: 'regulatory',
      timeHorizon: 'short',
      variables: { regulatory_pressure: 90, compliance_cost: 70, innovation_pace: 40 },
      outcomes: [
        { metric: 'AI Compliance Cost', baseline: 10, projected: 25, confidence: 85, timeframe: '2026' },
        { metric: 'Innovation Investment', baseline: 100, projected: 80, confidence: 60, timeframe: '2027' },
        { metric: 'AI Safety Incidents', baseline: 50, projected: 20, confidence: 70, timeframe: '2028' }
      ],
      probability: 75,
      impact: 'neutral'
    }
  ]);

  const [intelligenceMetrics] = useState<IntelligenceMetrics>({
    hallucinationRate: 0.8,
    verificationAccuracy: 94.2,
    predictionConfidence: 76.5,
    dataFreshness: 87.3,
    coverage: 91.7
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {language === 'zh-TW' ? '基礎智慧' : 'FOUNDATIONAL INTELLIGENCE'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {language === 'zh-TW'
              ? '零幻覺查證系統與未來推演沙盒的完美融合'
              : 'Perfect fusion of zero-hallucination verification and future projection sandbox'
            }
          </p>
        </motion.div>

        {/* Intelligence Metrics */}
        <div className="mb-8">
          <IntelligenceMetricsDashboard metrics={intelligenceMetrics} language={language} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <ZeroHallucinationVerifier claims={verificationClaims} language={language} />
          <FutureProjectionSandbox scenarios={simulationScenarios} language={language} />
        </div>

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '即時驗證' : 'REAL-TIME VERIFICATION'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '對ESG聲明進行即時真實性驗證'
                : 'Real-time verification of ESG claims'
              }
            </p>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '開始驗證' : 'START VERIFICATION'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '趨勢分析' : 'TREND ANALYSIS'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '基於大數據的ESG趨勢預測'
                : 'Big data-based ESG trend forecasting'
              }
            </p>
            <motion.button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '分析趨勢' : 'ANALYZE TRENDS'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Brain className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '智慧洞察' : 'INTELLIGENCE INSIGHTS'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? 'AI驅動的ESG智慧洞察生成'
                : 'AI-driven ESG intelligence insights'
              }
            </p>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '生成洞察' : 'GENERATE INSIGHTS'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '預測建模' : 'PREDICTIVE MODELING'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '先進的ESG預測建模工具'
                : 'Advanced ESG predictive modeling tools'
              }
            </p>
            <motion.button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '建立模型' : 'BUILD MODEL'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FoundationalIntelligence;