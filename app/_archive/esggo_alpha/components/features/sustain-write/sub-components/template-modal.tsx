import { motion, AnimatePresence } from "motion/react";
import { X, Library, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateModalProps {
  showTemplateModal: boolean;
  setShowTemplateModal: (show: boolean) => void;
  title: string;
  applyTemplate: (templateContent: string) => void;
}

const TEMPLATES = [
  {
    id: "standard-intro",
    name: "標準導言 (GRI對齊)",
    desc: "符合 GRI 2-1 組織說明的標準描述結構。",
    content: "本報告書為【公司名稱】(以下簡稱本公司) 發布之永續報告書，旨在向利害關係人說明本公司在環境 (Environmental)、社會 (Social) 與公司治理 (Governance) 三大面向的策略、作為與績效。本公司秉持誠信透明的原則，透過定期的資訊揭露，展現我們對永續發展的承諾與實踐。"
  },
  {
    id: "performance-summary",
    name: "績效摘要 (量化聚焦)",
    desc: "適合用於章節開頭，強調該領域的核心量化指標。",
    content: "在【年份】年度，本公司於【領域】領域達成以下關鍵績效：\n1. 【指標一】：較前一年度成長/減少 X%，達成設定目標之 Y%。\n2. 【指標二】：累計投入資源達 Z 萬元，受益人次/範圍達 W。\n3. 【指標三】：取得【相關認證或獎項】，展現卓越管理能力。\n\n我們將持續優化管理機制，確保達成中長期目標。"
  },
  {
    id: "management-approach",
    name: "管理方針 (DMA)",
    desc: "GRI 3 實質性主題管理方針標準框架。",
    content: "【管理目的】\n本公司深知【主題】對營運及利害關係人之重要性，特制定相關管理方針，以有效辨識風險與機會。\n\n【政策與承諾】\n我們承諾遵守相關法規，並自願性遵循國際標準，包含：【列舉標準】。\n\n【權責單位】\n由【部門名稱】負責推動相關專案，並定期向【董事會/永續委員會】呈報執行進度。\n\n【評估與調整機制】\n透過年度績效評核與內外部稽核，持續檢視管理措施之有效性，並作為次年度目標設定之依據。"
  },
  {
    id: "case-study",
    name: "專案亮點 (案例分享)",
    desc: "用於詳細描述單一成功專案或倡議。",
    content: "【專案名稱：XXXX】\n\n【背景與動機】\n因應【外部趨勢或內部需求】，本公司發起此專案，期望解決【核心問題】。\n\n【執行策略】\n本專案於【時間】啟動，共分為【X】個階段執行：\n- 階段一：...\n- 階段二：...\n\n【成果與影響力】\n專案成功觸及【數量】名受眾，創造了【具體影響力說明】。我們預計於次年將此成功模式複製至其他營運據點。"
  }
];

export function TemplateModal({
  showTemplateModal,
  setShowTemplateModal,
  title,
  applyTemplate
}: TemplateModalProps) {
  if (!showTemplateModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">零算力模板庫 (Template Library)</h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                選擇適合「{title}」的標準寫作框架
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTemplateModal(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          <div className="grid gap-4">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-bold text-slate-800 text-sm">{template.name}</h4>
                  </div>
                  <button
                    onClick={() => {
                      applyTemplate(template.content);
                      setShowTemplateModal(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 hover:border-indigo-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 應用此模板
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium">{template.desc}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <pre className="text-xs text-slate-600 font-sans whitespace-pre-wrap leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                    {template.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
