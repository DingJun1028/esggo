'use client';

import { Suspense, useState, useCallback } from 'react';
import {
  Zap, Play, CheckCircle, XCircle, Clock, ArrowRight,
  Brain, Layers, Globe, BarChart3, FileText, Users,
  AlertTriangle, RefreshCw, ChevronRight, Activity,
  TrendingUp, DollarSign, Timer, Star, Settings,
  Send, Plus, Eye, Download
} from 'lucide-react';
import {
  WorkflowOrchestrator,
  WorkflowRun,
  WorkflowStep,
  ScenarioType
} from '../../lib/workflow-engine';

const orchestrator = new WorkflowOrchestrator();

const SERVICE_COLORS: Record<string, string> = {
  gemini: 'bg-blue-100 text-blue-700 border-blue-200',
  genkit: 'bg-purple-100 text-purple-700 border-purple-200',
  bluecc: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  boostspace: 'bg-orange-100 text-orange-700 border-orange-200',
  internal: 'bg-gray-100 text-gray-700 border-gray-200',
};

const SERVICE_LABELS: Record<string, string> = {
  gemini: 'Gemini AI',
  genkit: 'Genkit',
  bluecc: 'Blue.cc',
  boostspace: 'Boostspace',
  internal: '內部',
};

const SCENARIOS = [
  {
    id: 'esg-compliance' as ScenarioType,
    title: 'ESG 合規性自動分析',
    description: '自動掃描報告文本，識別 GRI/SASB/TCFD 合規缺口，建立改善任務',
    icon: Shield2,
    services: ['gemini', 'genkit', 'bluecc', 'boostspace'],
    estimatedTime: '45 秒',
    roi: '節省 8 小時/次',
    color: 'from-[#003262] to-[#1a5f9e]',
    steps: 4,
  },
  {
    id: 'content-pipeline' as ScenarioType,
    title: '永續內容創作流水線',
    description: '一鍵生成多語言永續報告章節，自動建立審核任務並多平台發佈',
    icon: FileText,
    services: ['gemini', 'genkit', 'bluecc', 'boostspace'],
    estimatedTime: '60 秒',
    roi: '產出效率 ×10',
    color: 'from-[#FDB515] to-[#e5a314]',
    steps: 6,
  },
  {
    id: 'sustainability-report' as ScenarioType,
    title: '永續報告書自動生成',
    description: '輸入 ESG 指標數據，AI 自動生成符合 GRI 標準的報告草稿與執行摘要',
    icon: FileText,
    services: ['gemini', 'genkit', 'bluecc', 'boostspace'],
    estimatedTime: '90 秒',
    roi: '節省 40 小時/份',
    color: 'from-green-600 to-green-500',
    steps: 4,
  },
];

function Shield2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StepCard({ step, index }: { step: WorkflowStep; index: number }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      step.status === 'completed' ? 'bg-green-50 border-green-200' :
      step.status === 'running' ? 'bg-blue-50 border-blue-200' :
      step.status === 'failed' ? 'bg-red-50 border-red-200' :
      'bg-gray-50 border-gray-200'
    }`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        step.status === 'completed' ? 'bg-green-500 text-white' :
        step.status === 'running' ? 'bg-blue-500 text-white' :
        step.status === 'failed' ? 'bg-red-500 text-white' :
        'bg-gray-300 text-gray-600'
      }`}>
        {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
         step.status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
         step.status === 'failed' ? <XCircle className="w-4 h-4" /> :
         index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-[#1a1a2e]">{step.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${SERVICE_COLORS[step.service]}`}>
            {SERVICE_LABELS[step.service]}
          </span>
        </div>
        {step.duration && (
          <div className="text-xs text-gray-500">{(step.duration / 1000).toFixed(1)}s</div>
        )}
        {step.error && (
          <div className="text-xs text-red-600 mt-1">{step.error}</div>
        )}
      </div>
    </div>
  );
}

function WorkflowContent() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'runs' | 'services' | 'metrics'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [currentRun, setCurrentRun] = useState<WorkflowRun | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const [complianceInput, setComplianceInput] = useState({
    company: '台灣科技股份有限公司',
    reportText: '本公司致力於溫室氣體減排，範疇一排放量為 1,250 噸 CO₂e，範疇二為 890 噸 CO₂e。再生能源使用比例達 38%，並取得 ISO 14001 環境管理體系認證。',
  });

  const [contentInput, setContentInput] = useState({
    topic: '供應鏈 ESG 管理與透明度',
    targetAudience: '機構投資人與利害關係人',
    languages: ['英文', '日文'],
  });

  const [reportInput, setReportInput] = useState({
    company: '台灣科技股份有限公司',
    year: '2024',
    metrics: {
      scope1: 1250,
      scope2: 890,
      renewableEnergy: 38,
      waterUsage: 45000,
      employees: 2847,
    },
  });

  const handleRunWorkflow = useCallback(async () => {
    if (!selectedScenario || isRunning) return;
    setIsRunning(true);

    try {
      let run: WorkflowRun;
      if (selectedScenario === 'esg-compliance') {
        run = await orchestrator.runESGComplianceWorkflow(complianceInput);
      } else if (selectedScenario === 'content-pipeline') {
        run = await orchestrator.runContentPipelineWorkflow(contentInput);
      } else {
        run = await orchestrator.runSustainabilityReportWorkflow(reportInput);
      }
      setCurrentRun(run);
      setRuns(orchestrator.getRuns());
      setActiveTab('runs');
    } finally {
      setIsRunning(false);
    }
  }, [selectedScenario, isRunning, complianceInput, contentInput, reportInput]);

  const metrics = orchestrator.getMetrics();

  const serviceDefs = [
    {
      name: 'Google Gemini AI',
      key: 'gemini',
      icon: Brain,
      color: 'bg-blue-500',
      status: 'connected',
      description: '大語言模型 · 多模態分析',
      capabilities: ['文本生成', '合規分析', '報告撰寫', '圖像解析', 'JSON 結構化輸出'],
      usage: '4,250 次本月',
    },
    {
      name: 'Firebase Genkit',
      key: 'genkit',
      icon: Zap,
      color: 'bg-purple-500',
      status: 'connected',
      description: 'AI 工作流編排引擎',
      capabilities: ['智能摘要', '多語言翻譯', '情感分析', '多步驟研究', '串流生成'],
      usage: '1,830 次本月',
    },
    {
      name: 'Blue.cc',
      key: 'bluecc',
      icon: Layers,
      color: 'bg-cyan-500',
      status: 'connected',
      description: '專案與任務管理平台',
      capabilities: ['任務建立', '專案追蹤', '團隊協作', '進度報告', '審核流程'],
      usage: '320 次本月',
      token: '5aec931e...44b',
    },
    {
      name: 'Boostspace',
      key: 'boostspace',
      icon: Globe,
      color: 'bg-orange-500',
      status: process.env.BOOSTSPACE_API_KEY ? 'connected' : 'pending',
      description: '自動化流程協調平台 (2600+ 工具)',
      capabilities: ['場景觸發', '多平台整合', '資料路由', 'Webhook 管理', '通知發送'],
      usage: '156 次本月',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Header */}
      <div className="bg-[#003262] text-white px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDB515] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#003262]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI 自動化工作流中心</h1>
              <p className="text-[#7aadde] text-xs">Gemini + Genkit + Blue.cc + Boostspace · 四合一整合引擎</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {serviceDefs.map(s => (
              <div key={s.key} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span className="text-xs font-medium">{s.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {[
            { id: 'scenarios', label: '應用場景', icon: Play },
            { id: 'runs', label: `執行記錄 (${runs.length})`, icon: Activity },
            { id: 'services', label: '服務整合', icon: Settings },
            { id: 'metrics', label: '效益分析', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-[#003262]' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '可用工作流', value: '6', icon: Zap, color: 'text-[#003262]' },
                { label: '已連接服務', value: '4', icon: Globe, color: 'text-green-600' },
                { label: '本月節省時間', value: '127h', icon: Timer, color: 'text-[#FDB515]' },
                { label: '本月節省成本', value: 'NT$85K', icon: DollarSign, color: 'text-purple-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-[#e8e4d8] shadow-sm">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Diagram */}
            <div className="bg-white rounded-2xl p-6 border border-[#e8e4d8] shadow-sm">
              <h3 className="font-bold text-[#003262] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                工作流架構圖
              </h3>
              <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
                {[
                  { label: 'ESG GO\nOmni_Terminal', color: 'bg-[#003262]', text: 'text-white' },
                  { label: '', isArrow: true },
                  { label: 'Boostspace\n協調中心', color: 'bg-orange-500', text: 'text-white' },
                  { label: '', isArrow: true },
                  { label: 'Gemini AI\n大語言模型', color: 'bg-blue-500', text: 'text-white' },
                  { label: '', isBidirectional: true },
                  { label: 'Genkit\nAI 工作流', color: 'bg-purple-500', text: 'text-white' },
                  { label: '', isBidirectional: true },
                  { label: 'Blue.cc\n專案管理', color: 'bg-cyan-500', text: 'text-white' },
                ].map((node, i) => (
                  node.isArrow || node.isBidirectional ? (
                    <div key={i} className="flex items-center text-gray-400 font-bold text-lg flex-shrink-0">
                      {node.isBidirectional ? '⟷' : '→'}
                    </div>
                  ) : (
                    <div key={i} className={`${node.color} ${node.text} rounded-xl px-4 py-3 text-center text-xs font-semibold whitespace-pre-line flex-shrink-0`}>
                      {node.label}
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-3 gap-6">
              {SCENARIOS.map(scenario => (
                <div
                  key={scenario.id}
                  className={`bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedScenario === scenario.id
                      ? 'border-[#003262] shadow-lg shadow-[#003262]/10'
                      : 'border-[#e8e4d8] hover:border-[#003262]/40'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className={`bg-gradient-to-br ${scenario.color} p-5 text-white`}>
                    <div className="flex items-start justify-between">
                      <scenario.icon className="w-8 h-8" />
                      <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{scenario.estimatedTime}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mt-3">{scenario.title}</h3>
                    <p className="text-sm opacity-80 mt-1">{scenario.description}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-1 flex-wrap mb-3">
                      {scenario.services.map(s => (
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${SERVICE_COLORS[s]}`}>
                          {SERVICE_LABELS[s]}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {scenario.roi}
                      </div>
                      <div className="text-xs text-gray-400">{scenario.steps} 個步驟</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            {selectedScenario && (
              <div className="bg-white rounded-2xl border border-[#e8e4d8] p-6 shadow-sm">
                <h3 className="font-bold text-[#003262] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  工作流參數設定 — {SCENARIOS.find(s => s.id === selectedScenario)?.title}
                </h3>

                {selectedScenario === 'esg-compliance' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">公司名稱</label>
                      <input
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={complianceInput.company}
                        onChange={e => setComplianceInput(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">報告文本（節錄）</label>
                      <textarea
                        rows={3}
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30 resize-none"
                        value={complianceInput.reportText}
                        onChange={e => setComplianceInput(p => ({ ...p, reportText: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {selectedScenario === 'content-pipeline' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">主題</label>
                      <input
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={contentInput.topic}
                        onChange={e => setContentInput(p => ({ ...p, topic: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">目標受眾</label>
                      <input
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={contentInput.targetAudience}
                        onChange={e => setContentInput(p => ({ ...p, targetAudience: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">翻譯語言</label>
                      <div className="flex gap-2">
                        {['英文', '日文', '韓文', '西班牙文'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setContentInput(p => ({
                              ...p,
                              languages: p.languages.includes(lang)
                                ? p.languages.filter(l => l !== lang)
                                : [...p.languages, lang],
                            }))}
                            className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                              contentInput.languages.includes(lang)
                                ? 'bg-[#003262] text-white border-[#003262]'
                                : 'border-[#e8e4d8] text-gray-600'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario === 'sustainability-report' && (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">公司名稱</label>
                      <input
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={reportInput.company}
                        onChange={e => setReportInput(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">報告年度</label>
                      <input
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={reportInput.year}
                        onChange={e => setReportInput(p => ({ ...p, year: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">範疇一 (噸 CO₂e)</label>
                      <input
                        type="number"
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={reportInput.metrics.scope1 as number}
                        onChange={e => setReportInput(p => ({ ...p, metrics: { ...p.metrics, scope1: +e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">範疇二 (噸 CO₂e)</label>
                      <input
                        type="number"
                        className="w-full border border-[#e8e4d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/30"
                        value={reportInput.metrics.scope2 as number}
                        onChange={e => setReportInput(p => ({ ...p, metrics: { ...p.metrics, scope2: +e.target.value } }))}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleRunWorkflow}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-[#003262] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#002244] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" />工作流執行中...</>
                    ) : (
                      <><Play className="w-5 h-5" />啟動工作流</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Runs Tab */}
        {activeTab === 'runs' && (
          <div className="space-y-6">
            {runs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e8e4d8] p-16 text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">尚無執行記錄</p>
                <p className="text-gray-400 text-sm mt-1">請先在「應用場景」頁面選擇並啟動工作流</p>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="mt-4 bg-[#003262] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002244] transition-colors"
                >
                  前往場景選擇
                </button>
              </div>
            ) : (
              runs.slice().reverse().map(run => (
                <div key={run.id} className="bg-white rounded-2xl border border-[#e8e4d8] overflow-hidden shadow-sm">
                  <div className={`px-6 py-4 flex items-center justify-between ${
                    run.status === 'completed' ? 'bg-green-50 border-b border-green-100' :
                    run.status === 'running' ? 'bg-blue-50 border-b border-blue-100' :
                    'bg-red-50 border-b border-red-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      {run.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : run.status === 'running' ? (
                        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <div>
                        <div className="font-bold text-[#1a1a2e]">{run.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(run.startedAt).toLocaleString('zh-TW')}
                          {run.completedAt && ` · 耗時 ${((run.completedAt - run.startedAt) / 1000).toFixed(1)}s`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        run.status === 'completed' ? 'bg-green-100 text-green-700' :
                        run.status === 'running' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {run.status === 'completed' ? '已完成' : run.status === 'running' ? '執行中' : '失敗'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 gap-3">
                    {run.steps.map((step, i) => (
                      <StepCard key={step.id} step={step} index={i} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-2 gap-6">
            {serviceDefs.map(service => (
              <div key={service.key} className="bg-white rounded-2xl border border-[#e8e4d8] overflow-hidden shadow-sm">
                <div className={`${service.color} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <service.icon className="w-8 h-8" />
                    <div className={`flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1`}>
                      <div className={`w-2 h-2 rounded-full ${service.status === 'connected' ? 'bg-green-300' : 'bg-yellow-300'}`} />
                      <span className="text-xs font-medium">
                        {service.status === 'connected' ? '已連接' : '待配置'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-3">{service.name}</h3>
                  <p className="text-sm opacity-80">{service.description}</p>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-500 mb-2">核心能力</div>
                    <div className="flex flex-wrap gap-1.5">
                      {service.capabilities.map(cap => (
                        <span key={cap} className="text-xs bg-[#f0ede6] text-[#003262] px-2 py-1 rounded-lg">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#e8e4d8]">
                    <div className="text-xs text-gray-500">{service.usage}</div>
                    {service.token && (
                      <div className="text-xs font-mono text-gray-400">Token: {service.token}</div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${service.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '總執行次數', value: runs.length || 0, suffix: '次', icon: Activity, color: 'text-[#003262]' },
                { label: '成功率', value: runs.length > 0 ? Math.round((runs.filter(r => r.status === 'completed').length / runs.length) * 100) : 100, suffix: '%', icon: CheckCircle, color: 'text-green-600' },
                { label: '節省時間（本月）', value: 127, suffix: 'h', icon: Timer, color: 'text-[#FDB515]' },
                { label: '節省成本（本月）', value: 85, suffix: 'K', icon: DollarSign, color: 'text-purple-600' },
              ].map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#e8e4d8] shadow-sm text-center">
                  <m.icon className={`w-8 h-8 ${m.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-bold ${m.color}`}>{m.value}{m.suffix}</div>
                  <div className="text-sm text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#e8e4d8] p-6 shadow-sm">
                <h3 className="font-bold text-[#003262] mb-4">ROI 效益分析</h3>
                <div className="space-y-4">
                  {[
                    { label: 'ESG 合規分析', before: '8h/次', after: '45s/次', saving: '節省 99.8%', color: 'bg-[#003262]', pct: 100 },
                    { label: '永續報告撰寫', before: '40h/份', after: '90s/份', saving: '節省 99.9%', color: 'bg-green-500', pct: 100 },
                    { label: '多語言翻譯', before: '4h/篇', after: '30s/篇', saving: '節省 99.8%', color: 'bg-[#FDB515]', pct: 100 },
                    { label: '內容審核任務建立', before: '30min/次', after: '5s/次', saving: '節省 99.7%', color: 'bg-purple-500', pct: 100 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[#1a1a2e]">{item.label}</span>
                        <span className="text-green-600 font-semibold text-xs">{item.saving}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span>人工: {item.before}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-[#003262] font-medium">AI: {item.after}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e8e4d8] p-6 shadow-sm">
                <h3 className="font-bold text-[#003262] mb-4">年度效益預估</h3>
                <div className="space-y-4">
                  {[
                    { label: '人工成本節省', value: 'NT$1,200,000', desc: '假設 6 人 × 200h/年' },
                    { label: '效率提升', value: '×15', desc: 'AI 處理速度 vs 人工' },
                    { label: '合規風險降低', value: '85%', desc: '減少人為遺漏' },
                    { label: '報告品質提升', value: '+40%', desc: 'GRI 合規率提升' },
                    { label: '市場競爭優勢', value: '顯著', desc: '首批導入 AI ESG 的中小企業' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#f8f7f4] rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-[#1a1a2e]">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                      <div className="text-lg font-bold text-[#003262]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003262] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#003262] font-medium">載入工作流引擎...</p>
        </div>
      </div>
    }>
      <WorkflowContent />
    </Suspense>
  );
}