// src/components/report/ReportPrepWizard.tsx
import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Upload,
  FileText,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  ScanLine,
} from 'lucide-react';

interface PrepItem {
  id: string;
  category: 'E' | 'S' | 'G';
  title: string;
  description: string;
  type: 'upload_ocr' | 'form_input';
  status: 'pending' | 'completed';
  required: boolean;
}

const INITIAL_ITEMS: PrepItem[] = [
  // E - Environment
  {
    id: 'e1',
    category: 'E',
    title: '電費單據 (12個月)',
    description: '請上傳去年1-12月電費單 PDF 以供 OCR 辨識用電量與碳排計算。',
    type: 'upload_ocr',
    status: 'pending',
    required: true,
  },
  {
    id: 'e2',
    category: 'E',
    title: 'ISO 14064-1 查證聲明書',
    description: '若已完成查證，請上傳聲明書掃描檔。',
    type: 'upload_ocr',
    status: 'pending',
    required: false,
  },
  {
    id: 'e3',
    category: 'E',
    title: '水資源使用紀錄',
    description: '請上傳自來水費單或輸入年度用水量。',
    type: 'form_input',
    status: 'pending',
    required: true,
  },

  // S - Social
  {
    id: 's1',
    category: 'S',
    title: '勞工退休金提撥紀錄',
    description: '請上傳勞保局核發之提撥證明。',
    type: 'upload_ocr',
    status: 'pending',
    required: true,
  },
  {
    id: 's2',
    category: 'S',
    title: '員工教育訓練日誌',
    description: '請填寫年度教育訓練場次與參與人次。',
    type: 'form_input',
    status: 'pending',
    required: true,
  },
  {
    id: 's3',
    category: 'S',
    title: '職業災害統計表',
    description: '請上傳職安署申報之職災統計數據。',
    type: 'upload_ocr',
    status: 'pending',
    required: true,
  },

  // G - Governance
  {
    id: 'g1',
    category: 'G',
    title: '董事會會議紀錄',
    description: '請上傳年度董事會簽到簿與議事錄摘要。',
    type: 'upload_ocr',
    status: 'pending',
    required: true,
  },
  {
    id: 'g2',
    category: 'G',
    title: '誠信經營守則',
    description: '確認已簽署並發布誠信經營守則。',
    type: 'form_input',
    status: 'pending',
    required: true,
  },
];

export const ReportPrepWizard: React.FC = () => {
  const [items, setItems] = useState<PrepItem[]>(INITIAL_ITEMS);
  const [expandedCategory, setExpandedCategory] = useState<'E' | 'S' | 'G' | null>('E');

  const handleComplete = (id: string) => {
    setItems(items.map(item => (item.id === id ? { ...item, status: 'completed' } : item)));
  };

  const handleSimulateUpload = (id: string) => {
    // Simulate OCR processing
    alert('模擬：正在進行光學字元辨識 (OCR)...\n解析成功！數據已自動填入資料庫。');
    handleComplete(id);
  };

  const progress = Math.round(
    (items.filter(i => i.status === 'completed').length / items.length) * 100
  );

  const renderCategory = (category: 'E' | 'S' | 'G', title: string, colorClass: string) => {
    const categoryItems = items.filter(i => i.category === category);
    const isExpanded = expandedCategory === category;
    const completedCount = categoryItems.filter(i => i.status === 'completed').length;

    return (
      <div className="mb-4 bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden transition-all">
        <button
          onClick={() => setExpandedCategory(isExpanded ? null : category)}
          className={`w-full flex items-center justify-between p-4 ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-900 ${colorClass}`}
            >
              {category}
            </span>
            <div className="text-left">
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="text-xs text-slate-400">
                完成進度: {completedCount}/{categoryItems.length}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="text-slate-400" />
          ) : (
            <ChevronRight className="text-slate-400" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {categoryItems.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${item.status === 'completed' ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-slate-900 border-slate-700'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                    <span
                      className={`font-bold ${item.status === 'completed' ? 'text-emerald-300' : 'text-slate-200'}`}
                    >
                      {item.title}
                    </span>
                    {item.required && (
                      <span className="text-[10px] bg-red-900/40 text-red-300 px-1.5 rounded border border-red-500/20">
                        必填
                      </span>
                    )}
                    {item.type === 'upload_ocr' && (
                      <span className="text-[10px] bg-indigo-900/40 text-indigo-300 px-1.5 rounded border border-indigo-500/20 flex items-center gap-1">
                        <ScanLine className="w-3 h-3" /> OCR
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 pl-7">{item.description}</p>
                </div>

                {item.status !== 'completed' && (
                  <button
                    onClick={() => handleSimulateUpload(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                      item.type === 'upload_ocr'
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {item.type === 'upload_ocr' ? (
                      <Upload className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    {item.type === 'upload_ocr' ? '上傳辨識' : '填寫數據'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-fit">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-emerald-400" />
            報告資料準備引導 (Data Wizard)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            請依照清單完成資料蒐集，系統將自動擷取內容。
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-emerald-400">{progress}%</div>
          <div className="text-xs text-slate-500">準備完成度</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="space-y-2">
        {renderCategory('E', '環境範疇 (Environmental)', 'bg-emerald-400')}
        {renderCategory('S', '社會範疇 (Social)', 'bg-indigo-400')}
        {renderCategory('G', '治理範疇 (Governance)', 'bg-amber-400')}
      </div>

      {progress === 100 && (
        <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in">
          <div className="p-2 bg-emerald-500 rounded-full text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-300">所有資料準備就緒！</h4>
            <p className="text-emerald-400/70 text-sm">
              您現在可以切換至「生成設定」開始製作報告。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
