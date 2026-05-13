'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Zap, Database, BarChart3, Send, Plus, Search,
  Play, CheckCircle2, Clock, AlertCircle, Loader2,
  MessageSquare, Code2, FileJson, Eye, Globe, Brain,
  Layers, GitBranch, Activity, Sparkles, ArrowRight,
  ChevronDown, ChevronRight, ExternalLink, Copy,
  Download, RefreshCw, Filter, MoreHorizontal,
  TrendingUp, Users, FolderOpen, Clipboard,
} from 'lucide-react';
import {
  genkitFlows, blueWorkspaces, blueRecords, integrationLogs,
  GeminiMessage, BlueRecord, BlueWorkspace,
} from '../../lib/ai-platform-data';

type Tab = 'overview' | 'gemini' | 'genkit' | 'blue' | 'integration';
type GeminiMode = 'text' | 'code' | 'json' | 'vision';

const statusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  todo: '待辦',
  in_progress: '進行中',
  review: '審核中',
  done: '完成',
};

const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '緊急',
};

function OverviewTab() {
  const stats = [
    { label: 'Gemini API 調用', value: '2,847', change: '+12%', icon: Bot, color: '#003262' },
    { label: 'Genkit 工作流執行', value: '1,203', change: '+8%', icon: Zap, color: '#FDB515' },
    { label: 'Blue.cc 記錄', value: '278', change: '+34', icon: Database, color: '#00B140' },
    { label: '整合場景成功率', value: '99.2%', change: '+0.3%', icon: Activity, color: '#C4820A' },
  ];

  const features = [
    {
      icon: Bot,
      title: 'Google Gemini AI',
      desc: '文本生成、多輪對話、代碼生成、圖像分析、JSON 輸出',
      items: ['gemini-2.0-flash-exp', 'Vision API', '串流生成', '結構化輸出'],
      color: '#003262',
      bg: '#EBF2FF',
    },
    {
      icon: Zap,
      title: 'Genkit 工作流',
      desc: '智能摘要、多語言翻譯、情感分析、多步驟研究流程',
      items: ['summarizeFlow', 'translateFlow', 'sentimentFlow', 'researchFlow'],
      color: '#FDB515',
      bg: '#FFFBEB',
    },
    {
      icon: Database,
      title: 'Blue.cc 流程管理',
      desc: '工作空間管理、記錄追蹤、看板視圖、分析儀表板',
      items: ['工作空間管理', '記錄 & 任務', '看板視圖', 'GraphQL API'],
      color: '#00B140',
      bg: '#EBFAF0',
    },
    {
      icon: GitBranch,
      title: '整合場景',
      desc: 'AI 生成任務自動創建、內容摘要翻譯歸檔、智能反饋分析',
      items: ['AI → Blue 自動創建', '摘要 → 翻譯 → 歸檔', '智能客戶反饋', '自動代碼審查'],
      color: '#C4820A',
      bg: '#FFF8EC',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.color + '18' }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-semibold text-green-600">{s.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: f.bg }}>
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.items.map((item) => (
                    <span key={item} className="px-2 py-0.5 rounded-full text-xs font-medium border" style={{ borderColor: f.color + '40', color: f.color, background: f.bg }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#003262] to-[#001a3a] rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-400" />
          5 分鐘快速開始
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { step: '01', title: '設置 API Keys', desc: '配置 GOOGLE_API_KEY 與 BLUE_API_KEY' },
            { step: '02', title: '測試連接', desc: 'npm test 驗證所有服務連接正常' },
            { step: '03', title: '開始整合', desc: 'ai-cli combo 一鍵執行 AI + Blue 組合流程' },
          ].map((s) => (
            <div key={s.step} className="bg-white/10 rounded-lg p-4">
              <div className="text-yellow-400 font-mono text-xs mb-2">STEP {s.step}</div>
              <div className="font-semibold mb-1">{s.title}</div>
              <div className="text-sm text-blue-200">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Activity size={16} className="text-[#003262]" />
            最近整合日誌
          </h3>
          <span className="text-xs text-gray-400">實時同步</span>
        </div>
        <div className="divide-y divide-gray-50">
          {integrationLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-green-500' : log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{log.action}</div>
                <div className="text-xs text-gray-400 mt-0.5">{log.details}</div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{log.timestamp.split(' ')[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeminiTab() {
  const [messages, setMessages] = useState<GeminiMessage[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: '您好！我是 Gemini AI 助手。我可以幫您進行文本生成、代碼編寫、圖像分析和 JSON 結構化輸出。請選擇模式後開始對話！',
      timestamp: new Date(),
      type: 'text',
      model: 'gemini-2.0-flash-exp',
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<GeminiMode>('text');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('javascript');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const modes: { id: GeminiMode; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'text', label: '文本生成', icon: MessageSquare, desc: 'generateText()' },
    { id: 'code', label: '代碼生成', icon: Code2, desc: 'generateCode()' },
    { id: 'json', label: 'JSON 輸出', icon: FileJson, desc: 'generateJSON()' },
    { id: 'vision', label: '圖像分析', icon: Eye, desc: 'analyzeImage()' },
  ];

  const quickPrompts: Record<GeminiMode, string[]> = {
    text: ['解釋 ESG 中的重大性矩陣', '什麼是 GRI 準則？', '說明溫室氣體範疇一二三的差異'],
    code: ['生成 GHG 排放計算函數', '創建 ESG 數據匯出 CSV 腳本', '寫一個供應商評分算法'],
    json: ['輸出 GRI 302 能源數據結構', '生成供應商 ESG 評分 JSON', '產出重大性矩陣 JSON 格式'],
    vision: ['分析台電帳單圖片', '識別環境憑證文件', '解析 ESG 報告封面'],
  };

  const simulateResponse = (userInput: string, currentMode: GeminiMode): string => {
    const responses: Record<GeminiMode, string> = {
      text: `**ESG 永續治理洞察**

根據您的問題「${userInput}」，以下是 Gemini AI 的分析：

**核心概念**
ESG（環境 Environmental、社會 Social、治理 Governance）是現代企業永續發展的三大支柱。對中小企業而言，GRI 2021 準則提供了最具操作性的揭露框架。

**關鍵要點**
- **重大性評估**：識別對利害關係人和企業自身影響最重大的議題
- **數據可溯源性**：每一筆數據需有原始憑證支撐（5T 協議）
- **持續改善循環**：PDCA 管理循環確保永續績效進步

*由 gemini-2.0-flash-exp 生成 | 5T 完整性: ✓*`,
      code: `以下是根據「${userInput}」生成的代碼：

\`\`\`typescript
// ESG GO | AI 自動生成代碼
// GRI 302-1 能源消耗計算模組

interface EnergyData {
  electricity_kwh: number;
  natural_gas_gj: number;
  renewable_kwh: number;
  period: string;
}

interface GHGResult {
  total_mj: number;
  renewable_ratio: number;
  co2_equivalent: number;
  gri_302_compliant: boolean;
}

export function calculateEnergyConsumption(data: EnergyData): GHGResult {
  const ELECTRICITY_FACTOR = 3.6; // MJ per kWh
  const CO2_FACTOR = 0.494;       // kg CO2e per kWh (台灣電力排放係數 2023)
  
  const electricity_mj = data.electricity_kwh * ELECTRICITY_FACTOR;
  const gas_mj = data.natural_gas_gj * 1000;
  const total_mj = electricity_mj + gas_mj;
  const renewable_ratio = (data.renewable_kwh / data.electricity_kwh) * 100;
  const co2_equivalent = data.electricity_kwh * CO2_FACTOR;
  
  return {
    total_mj: Math.round(total_mj),
    renewable_ratio: parseFloat(renewable_ratio.toFixed(2)),
    co2_equivalent: parseFloat(co2_equivalent.toFixed(3)),
    gri_302_compliant: true,
  };
}
\`\`\`

*由 gemini-2.0-flash-exp 生成 | 模式: ${lang}*`,
      json: `以下是根據「${userInput}」生成的 JSON 結構：

\`\`\`json
{
  "disclosure": "GRI 302-1",
  "title": "組織內能源消耗",
  "period": "2024-01-01/2024-12-31",
  "data": {
    "electricity": {
      "value": 5847320,
      "unit": "kWh",
      "source": "台電帳單",
      "evidence_id": "EVD-2024-E001",
      "hash_lock": "sha256:a3f8b2c9..."
    },
    "natural_gas": {
      "value": 1234.5,
      "unit": "GJ",
      "source": "瓦斯公司月結單",
      "evidence_id": "EVD-2024-E002"
    },
    "renewable_energy": {
      "value": 850000,
      "unit": "kWh",
      "certificate": "T-REC",
      "percentage": 14.53
    }
  },
  "5t_integrity": {
    "traceable": true,
    "transparent": true,
    "tangible": true,
    "trustworthy": true,
    "trackable": true
  }
}
\`\`\`

*由 gemini-2.0-flash-exp 生成 | 格式: JSON*`,
      vision: `**圖像分析結果**

針對「${userInput}」的 Vision API 分析：

**識別內容**
- 文件類型：台灣電力股份有限公司電費通知單
- 帳單期間：2024年3月1日 - 2024年3月31日
- 客戶編號：12345678

**提取數據**
| 欄位 | 數值 | 單位 |
|------|------|------|
| 當期用電量 | 48,720 | kWh |
| 最高需量 | 245.3 | kW |
| 電費金額 | 284,532 | 新台幣 |

**5T 驗證**
✅ 可溯源：文件編號已記錄
✅ 不可篡改：SHA-256 哈希已計算

*由 gemini-2.0-flash-exp Vision 生成*`,
    };
    return responses[currentMode];
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: GeminiMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: mode,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));
    const assistantMsg: GeminiMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: simulateResponse(input, mode),
      timestamp: new Date(),
      type: mode,
      model: 'gemini-2.0-flash-exp',
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${mode === m.id ? 'border-[#003262] bg-[#003262]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <m.icon size={16} className={mode === m.id ? 'text-[#003262]' : 'text-gray-400'} />
              <span className={`text-sm font-semibold ${mode === m.id ? 'text-[#003262]' : 'text-gray-700'}`}>{m.label}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">{m.desc}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 flex items-center mr-1">快速提示：</span>
        {quickPrompts[mode].map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="px-3 py-1.5 rounded-full bg-[#003262]/8 text-[#003262] text-xs font-medium hover:bg-[#003262]/15 transition-colors border border-[#003262]/20"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col" style={{ height: '420px' }}>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-gray-700">Gemini AI 對話</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-[#003262]/10 text-[#003262] font-mono">gemini-2.0-flash-exp</span>
          </div>
          <button onClick={() => setMessages(messages.slice(0, 1))} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <RefreshCw size={12} /> 清空
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-[#003262] text-white' : 'bg-gray-50 text-gray-800 border border-gray-200'}`}>
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                {msg.model && (
                  <div className="mt-2 text-xs opacity-60 font-mono">{msg.model}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#003262]" />
                <span className="text-sm text-gray-500">Gemini 正在思考...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          {mode === 'code' && (
            <div className="flex gap-2 mb-2">
              {['typescript', 'javascript', 'python', 'sql'].map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-mono ${lang === l ? 'bg-[#003262] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`輸入${modes.find((m) => m.id === mode)?.label}提示...`}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#003262] bg-gray-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-[#003262] text-white hover:bg-[#002244] disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenkitTab() {
  const [selectedFlow, setSelectedFlow] = useState(genkitFlows[0]);
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('繁體中文');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ flow: string; input: string; output: string; time: string }[]>([]);

  const simulateFlowResult = (flowId: string, inp: string): string => {
    if (flowId === 'summarize') {
      return `**摘要結果**\n\n📌 **核心重點**\n${inp.slice(0, 30)}... 的核心內容可分為以下三點：\n\n1. **主要論點**：文本強調永續治理的重要性，特別是 GRI 2021 框架下的揭露要求\n2. **數據支撐**：涵蓋環境（E）、社會（S）、治理（G）三個維度的量化指標\n3. **行動建議**：建議企業優先完成重大性矩陣評估\n\n📊 **關鍵數字**：覆蓋 34 項 GRI 揭露主題 | 6 大利害關係人群體\n\n*由 Genkit summarizeFlow 執行 | 壓縮率: 85%*`;
    }
    if (flowId === 'translate') {
      return `**翻譯結果** → ${targetLang}\n\n原文（${inp.slice(0, 50)}...）\n\n**譯文**：\n"Environmental, Social and Governance (ESG) sustainability reporting requires organizations to disclose material impacts across three dimensions. The GRI Standards provide the most widely adopted framework for this disclosure globally."\n\n*由 Genkit translateFlow 執行 | 目標語言: ${targetLang}*`;
    }
    if (flowId === 'sentiment') {
      return `**情感分析結果**\n\n🎯 **整體情感**：正向 (Positive)\n📊 **評分**：82 / 100\n\n**維度分析**\n| 維度 | 評分 | 標籤 |\n|------|------|------|\n| 情感傾向 | +0.82 | 強正向 |\n| 關切程度 | 高 | 主動參與 |\n| 緊迫感 | 中 | 合理期待 |\n\n**關鍵詞提取**：永續發展、改善、承諾、透明、合作\n\n*由 Genkit sentimentFlow 執行 | 模型: Gemini 2.0*`;
    }
    return `**深度研究報告：${inp}**\n\n📋 **概覽**\n${inp} 是全球永續發展議程中的核心議題，涉及企業、政府和公民社會的多方協作...\n\n🔍 **關鍵發現**\n1. 全球趨勢：超過 95% 的 Fortune 500 企業已發布永續報告\n2. 台灣現況：金管會要求上市公司 2026 年完成 ISSB 接軌\n3. 中小企業挑戰：數據收集與驗證能力是主要瓶頸\n\n✅ **結論與建議**\n建議採用「漸進式揭露」策略，優先聚焦在重大性議題，再逐步擴展揭露範圍。\n\n*由 Genkit researchFlow 執行 | 多步驟分析完成*`;
  };

  const handleRun = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult('');
    await new Promise((r) => setTimeout(r, 2000));
    const output = simulateFlowResult(selectedFlow.id, input);
    setResult(output);
    setHistory((prev) => [
      { flow: selectedFlow.nameZh, input: input.slice(0, 40) + '...', output: output.slice(0, 60) + '...', time: new Date().toLocaleTimeString('zh-TW') },
      ...prev.slice(0, 4),
    ]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-3">
        <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Zap size={14} className="text-[#FDB515]" />
          選擇工作流
        </h3>
        {genkitFlows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => { setSelectedFlow(flow); setResult(''); setInput(''); }}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedFlow.id === flow.id ? 'border-[#003262] bg-[#003262]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{flow.icon}</span>
              <div>
                <div className={`font-semibold text-sm ${selectedFlow.id === flow.id ? 'text-[#003262]' : 'text-gray-800'}`}>{flow.nameZh}</div>
                <div className="text-xs text-gray-400 font-mono">{flow.name}</div>
              </div>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: flow.color + '15', color: flow.color }}>
                {flow.badge}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">{flow.descriptionZh}</div>
          </button>
        ))}

        {history.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1">
              <Clock size={12} /> 執行歷史
            </h4>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{h.flow}</span>
                    <span className="text-gray-400">{h.time}</span>
                  </div>
                  <div className="text-gray-500 truncate">{h.input}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">{selectedFlow.icon}</span>
              {selectedFlow.nameZh}
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{selectedFlow.name}</code>
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{selectedFlow.inputLabel}</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedFlow.inputPlaceholder}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#003262] bg-gray-50 resize-none"
              />
            </div>

            {selectedFlow.id === 'translate' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">目標語言</label>
                <div className="flex flex-wrap gap-2">
                  {['繁體中文', 'English', '日本語', '한국어', 'Deutsch', 'Français'].map((l) => (
                    <button key={l} onClick={() => setTargetLang(l)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${targetLang === l ? 'bg-[#003262] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={loading || !input.trim()}
              className="w-full py-2.5 rounded-lg bg-[#003262] text-white font-semibold text-sm hover:bg-[#002244] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> 執行中...</> : <><Play size={16} /> 執行 {selectedFlow.name}</>}
            </button>
          </div>
        </div>

        {(result || loading) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                {selectedFlow.outputLabel}
              </h4>
              {result && (
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  <Copy size={12} /> 複製
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 size={20} className="animate-spin text-[#003262]" />
                <span className="text-sm text-gray-500">Genkit {selectedFlow.name} 執行中...</span>
              </div>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4 font-sans">{result}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BlueTab() {
  const [activeWorkspace, setActiveWorkspace] = useState<BlueWorkspace | null>(blueWorkspaces[0]);
  const [view, setView] = useState<'workspaces' | 'records' | 'kanban' | 'analytics'>('workspaces');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [records, setRecords] = useState(blueRecords);

  const filtered = records.filter(
    (r) => (!activeWorkspace || r.workspaceId === activeWorkspace.id) &&
      (r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const kanbanCols = ['todo', 'in_progress', 'review', 'done'] as const;

  const handleCreate = () => {
    if (!newTitle.trim() || !activeWorkspace) return;
    const newRec: BlueRecord = {
      id: `rec-${Date.now()}`,
      title: newTitle,
      workspaceId: activeWorkspace.id,
      status: 'todo',
      priority: 'medium',
      assignee: '待分配',
      tags: ['新增'],
      createdAt: new Date().toISOString().split('T')[0],
      source: 'manual',
    };
    setRecords((prev) => [newRec, ...prev]);
    setNewTitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['workspaces', 'records', 'kanban', 'analytics'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-[#003262] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {v === 'workspaces' ? '工作空間' : v === 'records' ? '記錄列表' : v === 'kanban' ? '看板視圖' : '分析儀表板'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索記錄..."
              className="pl-8 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#003262] bg-white"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-[#003262] text-white text-sm font-medium hover:bg-[#002244] flex items-center gap-2"
          >
            <Plus size={14} /> 新增記錄
          </button>
        </div>
      </div>

      {view === 'workspaces' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueWorkspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => { setActiveWorkspace(ws); setView('records'); }}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 cursor-pointer hover:border-[#003262] hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: ws.color + '18' }}>
                    <FolderOpen size={20} style={{ color: ws.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{ws.name}</div>
                    <div className="text-xs text-gray-400">{ws.lastActivity}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ws.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {ws.status === 'active' ? '運行中' : '已封存'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{ws.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clipboard size={12} /> {ws.records} 記錄</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {ws.tasks} 任務</span>
                <span className="flex items-center gap-1"><Users size={12} /> {ws.members} 成員</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {ws.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-xs" style={{ background: ws.color + '15', color: ws.color }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'records' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-gray-900 text-sm">
              {activeWorkspace ? activeWorkspace.name : '所有工作空間'} — 記錄列表
            </div>
            <span className="text-xs text-gray-400">{filtered.length} 筆記錄</span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((rec) => (
              <div key={rec.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium text-gray-900 text-sm">{rec.title}</span>
                      {rec.source === 'ai_generated' && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700 flex items-center gap-1">
                          <Bot size={10} /> AI 生成
                        </span>
                      )}
                    </div>
                    {rec.aiSummary && (
                      <div className="text-xs text-gray-500 mb-2 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                        🤖 {rec.aiSummary}
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[rec.status]}`}>{statusLabels[rec.status]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[rec.priority]}`}>{priorityLabels[rec.priority]}優先</span>
                      <span className="text-xs text-gray-400">{rec.assignee}</span>
                      {rec.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{rec.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {kanbanCols.map((col) => (
            <div key={col} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[col]}`}>{statusLabels[col]}</span>
                <span className="text-xs text-gray-400 font-mono">{records.filter((r) => r.status === col).length}</span>
              </div>
              <div className="space-y-2">
                {records.filter((r) => r.status === col).map((rec) => (
                  <div key={rec.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-sm font-medium text-gray-800 mb-2 leading-tight">{rec.title}</div>
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[rec.priority]}`}>{priorityLabels[rec.priority]}</span>
                      {rec.source === 'ai_generated' && <Bot size={12} className="text-purple-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-[#003262]" /> 工作空間統計</h4>
            {blueWorkspaces.map((ws) => (
              <div key={ws.id} className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ws.color }} />
                <div className="text-sm text-gray-700 flex-1">{ws.name}</div>
                <div className="text-sm font-mono text-gray-900">{ws.records}</div>
                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${(ws.records / 150) * 100}%`, background: ws.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[#FDB515]" /> AI 生成記錄分析</h4>
            <div className="space-y-3">
              {[
                { label: 'AI 生成記錄', value: records.filter((r) => r.source === 'ai_generated').length, total: records.length, color: '#003262' },
                { label: '完成任務', value: records.filter((r) => r.status === 'done').length, total: records.length, color: '#00B140' },
                { label: '高優先級', value: records.filter((r) => r.priority === 'high' || r.priority === 'critical').length, total: records.length, color: '#FDB515' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-mono font-semibold">{item.value} / {item.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(item.value / item.total) * 100}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus size={18} className="text-[#003262]" /> 新增記錄</h3>
            <div className="space-y-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="記錄標題..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#003262]"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">取消</button>
                <button onClick={handleCreate} disabled={!newTitle.trim()} className="flex-1 py-2 rounded-lg bg-[#003262] text-white text-sm font-medium hover:bg-[#002244] disabled:opacity-50">創建</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationTab() {
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [logs, setLogs] = useState(integrationLogs);

  const scenarios = [
    {
      id: 'ai-task',
      title: 'AI 驅動的項目管理',
      description: '使用 Gemini 生成 ESG 任務 → 自動創建到 Blue.cc 工作空間',
      steps: ['Gemini 分析輸入', 'Genkit 工作流處理', 'Blue.cc 記錄創建', '5T 完整性封印'],
      icons: [Bot, Zap, Database, CheckCircle2],
      color: '#003262',
    },
    {
      id: 'content-pipeline',
      title: '自動內容處理管道',
      description: '內容生成 → Genkit 摘要 → 多語言翻譯 → Blue.cc 歸檔',
      steps: ['Gemini 內容生成', 'summarizeFlow', 'translateFlow', 'Blue.cc 歸檔'],
      icons: [MessageSquare, Brain, Globe, FolderOpen],
      color: '#FDB515',
    },
    {
      id: 'feedback-analysis',
      title: '智能客戶反饋分析',
      description: '批量反饋 → 情感分析 → 分類創建記錄 → 自動生成改進報告',
      steps: ['收集反饋數據', 'sentimentFlow 分析', '分類創建記錄', 'Gemini 報告生成'],
      icons: [Users, Activity, Layers, FileJson],
      color: '#00B140',
    },
    {
      id: 'code-review',
      title: '自動代碼審查追蹤',
      description: '代碼提交 → Gemini 審查 → 自動創建問題追蹤 → 通知分配',
      steps: ['代碼輸入', 'Gemini Code 審查', 'Blue.cc 問題創建', '自動分配通知'],
      icons: [Code2, Eye, GitBranch, TrendingUp],
      color: '#C4820A',
    },
  ];

  const runScenario = async (id: string) => {
    if (runningScenario) return;
    setRunningScenario(id);
    await new Promise((r) => setTimeout(r, 3000));
    setCompletedScenarios((prev) => [...prev, id]);
    setLogs((prev) => [{
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('zh-TW'),
      action: scenarios.find((s) => s.id === id)?.title || id,
      source: 'combo',
      status: 'success',
      details: `整合場景執行成功，所有步驟均已完成並記錄至 Blue.cc`,
    }, ...prev]);
    setRunningScenario(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => {
          const isRunning = runningScenario === sc.id;
          const isDone = completedScenarios.includes(sc.id);
          return (
            <div key={sc.id} className={`bg-white rounded-xl border-2 p-5 transition-all ${isDone ? 'border-green-300' : isRunning ? 'border-[#003262]' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{sc.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{sc.description}</p>
                </div>
                {isDone && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
              </div>

              <div className="flex items-center gap-1 mb-4 flex-wrap">
                {sc.steps.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${isRunning ? 'bg-[#003262]/10 text-[#003262]' : isDone ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                      {React.createElement(sc.icons[i], { size: 12 })}
                      {step}
                    </div>
                    {i < sc.steps.length - 1 && <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => runScenario(sc.id)}
                disabled={!!runningScenario}
                className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${isDone ? 'bg-green-50 text-green-700 border border-green-200' : 'text-white hover:opacity-90 disabled:opacity-50'}`}
                style={{ background: isDone ? undefined : sc.color }}
              >
                {isRunning ? (
                  <><Loader2 size={14} className="animate-spin" /> 執行中...</>
                ) : isDone ? (
                  <><CheckCircle2 size={14} /> 已完成</>
                ) : (
                  <><Play size={14} /> 執行場景</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={16} className="text-[#003262]" />
            整合執行日誌
          </h3>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">實時更新</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-4">
              <span className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${log.source === 'combo' ? 'bg-purple-100 text-purple-700' : log.source === 'gemini' ? 'bg-blue-100 text-blue-700' : log.source === 'genkit' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {log.source.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{log.action}</div>
                <div className="text-xs text-gray-400 mt-0.5">{log.details}</div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{log.timestamp.split(' ')[1] || log.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIPlatformPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'overview', label: '總覽', icon: BarChart3, desc: 'Overview' },
    { id: 'gemini', label: 'Gemini AI', icon: Bot, desc: 'Chat & Generate' },
    { id: 'genkit', label: 'Genkit 工作流', icon: Zap, desc: 'AI Flows' },
    { id: 'blue', label: 'Blue.cc', icon: Database, desc: 'Project Mgmt' },
    { id: 'integration', label: '整合場景', icon: GitBranch, desc: 'Automation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-[#003262] to-[#001a3a] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FDB515] blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                    <Sparkles size={24} className="text-[#FDB515]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">AI Integration Platform</h1>
                    <p className="text-blue-200 text-sm">Gemini API + Genkit AI + Blue.cc 流程管理</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm max-w-xl">
                  一個統一的平台，整合 Google Gemini AI、Genkit 工作流和 Blue.cc 流程管理，讓 AI 驅動您的業務流程。
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  All Services Online
                </div>
                <div className="text-xs text-blue-300 font-mono">v2.0.0 | 5T Certified</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {['Gemini 2.0 Flash', 'Genkit v1', 'Blue.cc GraphQL', 'TypeScript', '5T Protocol'].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/15 text-xs font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#003262] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#003262]/30'}`}
            >
              <tab.icon size={15} />
              {tab.label}
              <span className={`text-xs ${activeTab === tab.id ? 'text-blue-200' : 'text-gray-400'}`}>{tab.desc}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'gemini' && <GeminiTab />}
        {activeTab === 'genkit' && <GenkitTab />}
        {activeTab === 'blue' && <BlueTab />}
        {activeTab === 'integration' && <IntegrationTab />}
      </div>
    </div>
  );
}