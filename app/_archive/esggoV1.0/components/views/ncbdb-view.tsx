'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Search,
  Filter,
  Download,
  Share2,
  Shield,
  Activity,
  FileText,
  Lock,
  Zap,
  Globe,
  BarChart3,
  MoreVertical,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ServiceExplanationCard } from '@/components/ui/service-explanation-card';
import { Badge } from '@/components/ui/badge';

const NCB_DATA = [
  {
    id: "NCB-2026-001",
    title: "供應商 A 社會責任風險評估",
    category: "Social",
    status: "Verified",
    integrity: 99.8,
    timestamp: "2026-03-20 14:30",
    hash: "0x7a...f2e1",
    tags: ["Supplier", "Audit", "S"]
  },
  {
    id: "NCB-2026-002",
    title: "公司治理守則合規性申報",
    category: "Governance",
    status: "Sealed",
    integrity: 100.0,
    timestamp: "2026-03-18 09:15",
    hash: "0x3b...a9c4",
    tags: ["Policy", "G"]
  },
  {
    id: "ERP-2026-04-01-01",
    title: "能源消耗數據 (ERP 同步)",
    category: "Environment",
    status: "Verified",
    integrity: 99.5,
    timestamp: "2026-04-02 09:30:12",
    hash: "hl_erp_9a2b3c4d5e6f",
    tags: ["ERP", "Energy"],
    source: "SAP S/4HANA"
  },
  {
    id: "HR-2026-04-01-01",
    title: "員工訓練指標 (HR 同步)",
    category: "Social",
    status: "Verified",
    integrity: 99.2,
    timestamp: "2026-04-02 10:15:45",
    hash: "hl_hr_f1e2d3c4b5a6",
    tags: ["HR", "Training"],
    source: "Workday"
  },
  {
    id: "ENC-001",
    title: "範疇一排放數據加密存證",
    category: "Carbon",
    status: "Verified",
    integrity: 99.9,
    timestamp: "2026-03-24 14:20:00",
    hash: "0x8f2d...b1a7",
    tags: ["Carbon", "Emission"],
    source: "IoT-Sensor-A9"
  },
  {
    id: "NCB-2026-003",
    title: "員工職安教育訓練紀錄",
    category: "Social",
    status: "Verified",
    integrity: 98.5,
    timestamp: "2026-03-15 16:45",
    hash: "0x9d...e5b8",
    tags: ["Training", "Safety"]
  },
  {
    id: "NCB-2026-004",
    title: "反貪腐與內部控制審核",
    category: "Governance",
    status: "Audit Pass",
    integrity: 99.2,
    timestamp: "2026-03-12 11:00",
    hash: "0x1f...d7a2",
    tags: ["Compliance", "Audit"]
  }
];

export function NCBDBView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredData = useMemo(() => {
    return NCB_DATA.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="optimal" styleType="soft" className="mb-4 px-3 py-1 flex items-center gap-1.5 w-fit">
            <Database className="w-3.5 h-3.5" />
            5T Protocol Enabled
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-stitch-text tracking-tight uppercase">
            NCBDB <span className="text-stitch-teal-start">存證核心數據庫</span>
          </h1>
          <p className="text-stitch-muted mt-3 text-lg max-w-2xl font-medium">
            基於非同質化存證 (NCB) 技術的 ESG 數據核對中心。透過 5T 存證鏈，確保每一筆 ESG 數據皆具備不可竄改性與端到端的可追溯特性。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Download Data" className="p-3 rounded-xl bg-white border border-stitch-border text-stitch-muted hover:bg-stitch-shallow-gray transition-colors shadow-minimal">
            <Download className="w-5 h-5" />
          </button>
          <button aria-label="Share Data" className="p-3 rounded-xl bg-white border border-stitch-border text-stitch-muted hover:bg-stitch-shallow-gray transition-colors shadow-minimal">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 rounded-xl bg-stitch-text text-white font-black hover:opacity-90 transition-all shadow-minimal active:scale-95 flex items-center gap-2 uppercase tracking-widest text-xs">
            <Zap className="w-4 h-4 text-emerald-400" />
            啟動實時審核
          </button>
        </div>
      </div>

      {/* Service Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceExplanationCard
          title="數據存證透明化"
          description="將原始 ESG 數據存錄於鏈上實體塊，確保每一筆申報皆有不可抹滅的數位足跡。"
          icon={<Database className="w-6 h-6" />}
          stats={{ label: "總存證條目", value: "1,284", unit: "Entries" }}
          features={["實時存證", "不可篡改性", "數據指紋"]}
          color="var(--color-stitch-gold)"
        />
        <ServiceExplanationCard
          title="信賴等級分析系統"
          description="依據存證鏈之完整度分級，動態計算該數據在審核端的權重影響值。"
          icon={<Shield className="w-6 h-6" />}
          stats={{ label: "平均信賴度", value: "99.4", unit: "%" }}
          features={["AI 信賴檢測", "5P 驗證合規", "异常自動標記"]}
          color="var(--color-stitch-gold)"
        />
        <ServiceExplanationCard
          title="跨網存錄節點"
          description="部署於全球之核心網點，確保數據讀取的全天候高可用性與多中心對齊。"
          icon={<Globe className="w-6 h-6" />}
          stats={{ label: "活動節點數", value: "12", unit: "Nodes" }}
          features={["全球對齊", "異地存備", "高可用性"]}
          color="var(--color-stitch-gold)"
        />
        <ServiceExplanationCard
          title="自動化審計工作流"
          description="AI 協作產出的審計建議書，簡短而精確地對齊各國永續規範。"
          icon={<Activity className="w-6 h-6" />}
          stats={{ label: "待處理任務", value: "8", unit: "Tasks" }}
          features={["AI 審計對標", "報告一致性", "自動補齊建議"]}
          color="var(--color-stitch-gold)"
        />
      </div>

      {/* Main Content Area */}
      <GlassCard className="p-0 overflow-hidden border-black/5 shadow-minimal">
        {/* Toolbar */}
        <div className="p-6 border-b border-stitch-border bg-stitch-shallow-gray/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stitch-muted" />
            <input
              type="text"
              placeholder="搜尋 存證 ID 或 議題名稱..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-stitch-border bg-white focus:outline-none focus:ring-4 focus:ring-stitch-primary/10 focus:border-stitch-primary transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {["All", "Social", "Governance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                  ? "bg-stitch-primary text-white shadow-minimal"
                  : "bg-white text-stitch-muted border border-stitch-border hover:bg-stitch-shallow-gray"
                  }`}
              >
                {cat === "All" ? "全部議題" : cat}
              </button>
            ))}
            <div className="h-6 w-px bg-stitch-border mx-2 hidden md:block" />
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-stitch-muted border border-stitch-border bg-white hover:bg-stitch-shallow-gray transition-all">
              <Filter className="w-4 h-4" />
              進階過濾
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stitch-shallow-gray/50 border-b border-stitch-border">
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">存證 ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">主題內容 / 標籤</th>
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">數據完整度</th>
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">封存狀態</th>
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">鏈上時間戳</th>
                <th className="px-8 py-5 text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em]">操作項目</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stitch-border">
              {filteredData.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-stitch-shallow-gray/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-black text-stitch-muted bg-stitch-shallow-gray px-2 py-1 rounded-md">{item.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="font-bold text-stitch-text group-hover:text-stitch-primary transition-colors text-sm">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${item.category === 'Social' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                          {item.category}
                        </span>
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[9px] text-stitch-muted font-bold">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-stitch-shallow-gray rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-stitch-primary to-stitch-secondary"
                          style={{ width: `${item.integrity}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-stitch-text">{item.integrity}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Sealed' ? 'bg-emerald-500' : 'bg-blue-500'
                        } shadow-minimal`} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${item.status === 'Sealed' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>{item.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-stitch-text font-black">{item.timestamp}</span>
                      <span className="text-[9px] text-stitch-muted font-mono tracking-tighter bg-stitch-shallow-gray px-1.5 py-0.5 rounded w-fit">{item.hash}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1">
                      <button aria-label="View Document" className="p-2.5 rounded-xl hover:bg-white hover:shadow-minimal text-stitch-muted hover:text-stitch-primary transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button aria-label="External Link" className="p-2.5 rounded-xl hover:bg-white hover:shadow-minimal text-stitch-muted hover:text-stitch-primary transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button aria-label="More Options" className="p-2.5 rounded-xl hover:bg-white hover:shadow-minimal text-stitch-muted hover:text-stitch-primary transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(filteredData?.length || 0) === 0 && (
          <div className="p-24 flex flex-col items-center justify-center text-center bg-stitch-shallow-gray/20">
            <div className="w-20 h-20 rounded-[2rem] bg-white shadow-minimal flex items-center justify-center mb-6 border border-black/5">
              <Search className="w-8 h-8 text-stitch-muted/20" />
            </div>
            <h3 className="text-lg font-black text-stitch-text uppercase tracking-widest">無匹配之存證數據</h3>
            <p className="text-xs text-stitch-muted mt-2 font-medium max-w-xs mx-auto">
              請更換檢索關鍵字或調整過濾條件，或嘗試重新對齊鏈上數據節點。
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-stitch-border bg-stitch-shallow-gray/30 flex items-center justify-between">
          <p className="text-[10px] font-black text-stitch-muted uppercase tracking-widest">
            當前顯示 {filteredData?.length || 0} 筆存證紀錄 / 資料庫共 1,284 筆
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-stitch-border bg-white text-[10px] font-black text-stitch-muted cursor-not-allowed uppercase tracking-widest">上一頁</button>
            <button className="px-4 py-2 rounded-xl border border-stitch-border bg-white text-[10px] font-black text-stitch-text hover:bg-stitch-shallow-gray uppercase tracking-widest transition-all">下一頁</button>
          </div>
        </div>
      </GlassCard>

      {/* 5T Protocol Integrity Check Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-10 border-black/5 shadow-minimal">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
              <Shield className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stitch-text uppercase tracking-tight">5T Protocol 通訊協議</h3>
              <p className="text-xs text-stitch-muted font-bold mt-1 uppercase tracking-widest">核實當前數據集與鏈上共識之一致性</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Tangible (有形性)", status: "Pass", desc: "數據具備真實物理憑證來源，而非僅由軟體邏輯生成。" },
              { label: "Traceable (可溯性)", status: "Pass", desc: "數據來源路徑完整，可從源頭企業端追溯至報告端。" },
              { label: "Trackable (可控性)", status: "Pass", desc: "數據生命週期皆受版本控制，任何變動皆有跡可循。" },
              { label: "Transparent (透明性)", status: "Pass", desc: "計算邏輯完全開源且透明，任何人皆可重複驗證公式。" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-stitch-shallow-gray/50 border border-stitch-border hover:border-emerald-200 transition-colors group">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shadow-minimal group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stitch-text text-sm uppercase tracking-tight">{item.label}</span>
                    <Badge variant="optimal" styleType="soft" className="text-[9px] py-0.5 px-2 font-black">{item.status}</Badge>
                  </div>
                  <p className="text-[11px] text-stitch-muted mt-1.5 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-10 bg-stitch-text text-white border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-stitch-primary opacity-5 -mr-40 -mt-40 group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-minimal">
                <BarChart3 className="w-7 h-7 text-stitch-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">數據完整度解析器</h3>
                <p className="text-xs text-white/50 font-bold mt-1 uppercase tracking-widest">AI 動態解析與潛在風險預警系統</p>
              </div>
            </div>

            <div className="space-y-8 flex-grow">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-white/80">數據集異常指標 (Anomaly Index)</span>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase">Low Risk</span>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[15%] shadow-minimal" />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                  當前存證集之數據熵值穩定，未偵測到由外部惡意注入或邏輯衝突產生的高能量偏離點。
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-white/80">報告核對一致性 (Report Alignment)</span>
                  <span className="text-[10px] font-black text-stitch-secondary bg-stitch-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">88.5%</span>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div className="h-full bg-stitch-secondary w-[88.5%] shadow-minimal" />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                  本數據集與 2026 年度永續報告草稿之對標完成度。剩餘 11.5% 需手動校準 GRI 附錄細節。
                </p>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm mt-auto">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <p className="text-[10px] text-amber-100 font-bold leading-relaxed uppercase tracking-widest">
                  警告：節點 Node-C 目前處於脫機校準狀態，暫時由 Node-A 代理存錄，這可能導致 3-5ms 的時延增長。
                </p>
              </div>
            </div>

            <button className="mt-10 w-full py-5 rounded-2xl bg-stitch-primary text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-stitch-text transition-all shadow-minimal active:scale-95">
              下載完整存證協議合規報告
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
