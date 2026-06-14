'use client';

import React from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { Shield, Activity, Cpu, Eye, Globe, Database, Network, Zap } from 'lucide-react';

interface MatrixNodeProps {
  id: string;
  name: string;
  description: string;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean]; // Traceable, Transparent, Tangible, Trustworthy, Trackable
  tags: string[];
}

const matrixData = [
  {
    category: '感知。UI 基礎 (Perception / Core UI)',
    icon: <Eye size={24} className="text-cyan-400" />,
    description: '液態玻璃介面與萬能組件庫，提供最高標準的美學與功能感知。',
    nodes: [
      {
        id: 'ui-001',
        name: 'OmniBaseCard',
        description: '提供液態玻璃與毛玻璃視覺基礎。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['UI', 'Layout'],
      },
      {
        id: 'ui-002',
        name: 'OmniTable',
        description: '萬能數據表格，支援全維度狀態呈現。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['UI', 'Data View'],
      },
      {
        id: 'ui-003',
        name: 'OmniChart',
        description: '高度動態的數據視覺化引擎。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['UI', 'Visualization'],
      },
      {
        id: 'ui-004',
        name: 'OmniCommandPalette',
        description: '全域命令輸入與快捷指令列。',
        fiveTStatus: [false, true, true, false, true],
        tags: ['UI', 'Command'],
      },
      {
        id: 'ui-005',
        name: 'OmniSearchBar',
        description: '全站統一的模糊搜尋與過濾元件。',
        fiveTStatus: [false, true, true, false, false],
        tags: ['UI', 'Search'],
      },
      {
        id: 'ui-006',
        name: 'AiStyleSelector',
        description: 'AI 驅動的設計風格與主題切換器。',
        fiveTStatus: [false, true, true, false, false],
        tags: ['UI', 'Theme'],
      },
      {
        id: 'ui-007',
        name: 'OmniCardsDemo',
        description: '卡片佈局與視覺動效的展示畫廊。',
        fiveTStatus: [false, false, true, false, false],
        tags: ['UI', 'Demo'],
      },
    ],
  },
  {
    category: '指揮。代理協作 (Command / Swarm Agents)',
    icon: <Cpu size={24} className="text-emerald-400" />,
    description: '多模態智能代理蜂群的調度中樞與協作介面。',
    nodes: [
      {
        id: 'cmd-001',
        name: 'OmniAgentCard',
        description: '單一代理的實體化封裝與能力展示。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'UI'],
      },
      {
        id: 'cmd-002',
        name: 'OmniThinkingChain',
        description: '呈現代理連序思維推理的透明化過程。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Reasoning'],
      },
      {
        id: 'cmd-003',
        name: 'OmniLHubWidget',
        description: 'L-Hub 代理共識網路的即時監控小工具。',
        fiveTStatus: [true, true, true, true, false],
        tags: ['Agent', 'Consensus'],
      },
      {
        id: 'cmd-004',
        name: 'OmniAgentPulse',
        description: '代理活動與心跳狀態的即時監測脈搏。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Agent', 'Monitor'],
      },
      {
        id: 'cmd-005',
        name: 'OmniAllianceHub',
        description: '多代理結盟與任務分配的協作樞紐。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Collaboration'],
      },
      {
        id: 'cmd-006',
        name: 'ThinkTankControl',
        description: '高級智庫代理的控制面板與參數設定。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Control'],
      },
      {
        id: 'cmd-007',
        name: 'SkillBookUI',
        description: '代理技能書與知識庫的視覺化介面。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Agent', 'Knowledge'],
      },
    ],
  },
  {
    category: '全知。防禦與安全 (Omniscience / Security & 5T)',
    icon: <Shield size={24} className="text-rose-400" />,
    description: '5T 協議合規性與 ZKP 零知識證明的守護陣列。',
    nodes: [
      {
        id: 'sec-001',
        name: 'ShieldOfAbsoluteTruth',
        description: '絕對真實的數據封印與防篡改徽章。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', '5T'],
      },
      {
        id: 'sec-002',
        name: 'OmniJulesPassiveGuard',
        description: 'Jules 萬能因果協議的被動防禦引擎。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'Jules'],
      },
      {
        id: 'sec-003',
        name: 'OmniZKPBadge',
        description: '零知識證明 (ZKP) 狀態的視覺化驗證。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'ZKP'],
      },
      {
        id: 'sec-004',
        name: 'OmniDefenseDashboard',
        description: '全域安全防禦與異常活動的監控儀表板。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'Dashboard'],
      },
      {
        id: 'sec-005',
        name: 'OmniAuthOmni',
        description: '高階權限與身份驗證的控制模組。',
        fiveTStatus: [true, false, true, true, true],
        tags: ['Security', 'Auth'],
      },
      {
        id: 'sec-006',
        name: 'Protocol5TStrip',
        description: '5T 協議狀態的輕量化狀態橫幅。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Security', 'UI'],
      },
    ],
  },
  {
    category: '全域。數據與整合 (Global / Data & Integration)',
    icon: <Network size={24} className="text-indigo-400" />,
    description: '無縫橋接外部資料與內部矩陣的資料管線與 API 閘道。',
    nodes: [
      {
        id: 'dat-001',
        name: 'HermesIntegrations',
        description: '各類第三方平台與 ERP 系統的串接管理。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Integration', 'API'],
      },
      {
        id: 'dat-002',
        name: 'DataVisualizer',
        description: '全局資料流與智能節點拓樸的可視化工具。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Data', 'Topology'],
      },
      {
        id: 'dat-003',
        name: 'VaultOmniTable',
        description: '高安全性資料金庫的專用檢視表。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Data', 'Vault'],
      },
      {
        id: 'dat-004',
        name: 'HermesEvolutionPanel',
        description: 'Hermes 資料管線的演化與效能面板。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Pipeline'],
      },
      {
        id: 'dat-005',
        name: 'ScraperControl',
        description: '網頁爬蟲與非結構化數據擷取控制器。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Scraper'],
      },
      {
        id: 'dat-006',
        name: 'OmniMatrixInput',
        description: '支援多維度數據輸入與矩陣映射的表單。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Input'],
      },
      {
        id: 'dat-007',
        name: 'ApolloStudioConsole',
        description: 'Apollo GraphQL 整合與 API 測試終端。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Data', 'GraphQL'],
      },
    ],
  },
  {
    category: '全息。永續與報告 (Hologram / Sustainability & Reports)',
    icon: <Globe size={24} className="text-amber-400" />,
    description: 'ESG 報告、指標計算與永續成果的全息投影層。',
    nodes: [
      {
        id: 'hol-001',
        name: 'OmniSustainWriteEditor',
        description: '高擬真、自動化生成的 ESG 報告編輯器。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Editor'],
      },
      {
        id: 'hol-002',
        name: 'OmniBookCaseRegistry',
        description: '16 維度組件註冊表與知識資產的展示櫃。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Registry', 'Knowledge'],
      },
      {
        id: 'hol-003',
        name: 'OmniKpiCard',
        description: '永續 KPI 的關鍵指標動態追蹤卡片。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Report', 'KPI'],
      },
      {
        id: 'hol-004',
        name: 'OmniBlueDashboard',
        description: 'ESG 藍圖與長期減碳目標的全息儀表板。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Dashboard'],
      },
      {
        id: 'hol-005',
        name: 'OmniEvidenceUploader',
        description: '支援 5T 封印的碳盤查證據上傳器。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Evidence'],
      },
      {
        id: 'hol-006',
        name: 'NoteSearch',
        description: '永續報告與知識庫的深度語義搜尋。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Report', 'Search'],
      },
    ],
  },
];

export function OmniUltimateMatrix() {
  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-700">
      <div className="relative mb-6">
        <h2 className="text-3xl font-black text-white tracking-wider flex items-center gap-3">
          <Zap size={32} className="text-cyan-400" />
          萬能元件。終極矩陣 (Omni Component Ultimate Matrix)
        </h2>
        <p className="text-slate-400 mt-3 font-medium max-w-3xl leading-relaxed">
          The 16-Dimensional Governance Architectural Matrix. 本矩陣映射了 ESGGO
          平台的「神聖三位一體」架構，確保每一個「功能設施 (Facilities)」與「萬能元件 (Omni
          Components)」 皆符合 5T 協議 (Traceable, Transparent, Tangible, Trustworthy, Trackable)
          的至高標準，實現「無作妙德，圓通無礙」的運行境界。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {matrixData.map((category, idx) => (
          <OmniBaseCard
            key={idx}
            variant="glass"
            className="p-6 border-cyan-500/20 bg-gradient-to-br from-black/60 to-cyan-950/20 relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-cyan-500/20 pb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{category.category}</h3>
                <p className="text-sm text-cyan-400/70 mt-1">{category.description}</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {category.nodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-cyan-500/40 transition-colors duration-300 mb-4 last:mb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-cyan-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      {node.name}
                    </h4>
                    <div className="flex gap-2">
                      {node.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{node.description}</p>

                  {/* 5T Protocol Status Strip */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 mr-2">5T Protocol:</span>
                    {['Traceable', 'Transparent', 'Tangible', 'Trustworthy', 'Trackable'].map(
                      (t, i) => {
                        const isActive = node.fiveTStatus[i] as boolean;
                        return (
                          <div
                            key={t}
                            title={t}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-600 border border-slate-700'
                            }`}
                          >
                            {t[0]}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </OmniBaseCard>
        ))}
      </div>
    </div>
  );
}
