import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Download,
  X,
  Eye,
  Sparkles,
  Table,
  Loader2,
  ChevronRight,
} from 'lucide-react';

// 範本類型
type TemplateType = 'simple' | 'standard' | 'professional';

// Excel 模板定義
interface ExcelTemplate {
  name: string;
  description: string;
  rowCount: number;
  columns: string[];
  category: string;
}

const TEMPLATES: Record<TemplateType, ExcelTemplate> = {
  simple: {
    name: '簡易版碳盤查',
    description: '適合中小企業快速盤查，涵蓋基本排放數據',
    rowCount: 30,
    columns: [
      '年度',
      '範疇',
      '排放源類別',
      '燃料/能源類型',
      '消耗量',
      '單位',
      '排放係數',
      '排放量(kg CO2e)',
      '備註',
    ],
    category: 'carbon',
  },
  standard: {
    name: '標準版碳盤查',
    description: '符合 GRI 標準的中階盤查，包含範疇一、二、三',
    rowCount: 80,
    columns: [
      '年度',
      '範疇',
      '排放源類別',
      '子類別',
      '燃料/能源類型',
      '消耗量',
      '單位',
      '排放係數',
      '排放量(kg CO2e)',
      '數據來源',
      '驗證狀態',
      '備註',
    ],
    category: 'carbon',
  },
  professional: {
    name: '專業版 ESG 盤查',
    description: '完整 ESG 數據收集，包含環境、社會、治理三大面向',
    rowCount: 150,
    columns: [
      // 環境指標
      '年度',
      '指標類別',
      'GRI 指標代碼',
      '指標名稱',
      '數值',
      '單位',
      // 社會指標
      '員工總數',
      '女性員工比例',
      '管理職女性比例',
      '平均受訓時數',
      // 治理指標
      '獨立董事比例',
      '薪資報酬比率',
      // 碳排放
      '範疇一排放',
      '範疇二排放',
      '範疇三排放',
      '總排放量',
      // 通用
      '數據來源',
      '驗證狀態',
      '備註',
    ],
    category: 'esg',
  },
};

interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

interface ExcelUploaderProps {
  templateType?: TemplateType;
  onParse: (data: ParsedRow[]) => void;
  onClose: () => void;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  templateType = 'standard',
  onParse,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedRow[] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(templateType);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  // 下載範本
  const handleDownloadTemplate = (type: TemplateType) => {
    const template = TEMPLATES[type];
    // 生成 CSV 格式的範本
    const csvContent = [
      template.columns.join(','),
      ...Array.from({ length: 3 }, () =>
        template.columns.map(() => '').join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 處理拖放
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await processFile(droppedFile);
    }
  }, []);

  // 處理檔案選擇
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  // 處理檔案
  const processFile = async (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      alert('請上傳 Excel (.xlsx, .xls) 或 CSV 檔案');
      return;
    }

    setFile(file);
    setIsProcessing(true);
    setShowTemplateSelector(false);

    // 模擬解析過程
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 生成模擬解析數據
    const parsedRows = generateMockParsedData(file.name);
    setPreviewData(parsedRows);
    setIsProcessing(false);
  };

  // 生成模擬解析數據（實際開發時應替換為真正的 Excel 解析）
  const generateMockParsedData = (filename: string): ParsedRow[] => {
    const rows: ParsedRow[] = [];
    const rowCount = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < rowCount; i++) {
      const hasError = Math.random() > 0.8;
      const hasWarning = Math.random() > 0.7;

      rows.push({
        rowNumber: i + 2, // Excel 行號（標題行為1）
        data: {
          年度: '2024',
          範疇: ['範疇一', '範疇二', '範疇三'][Math.floor(Math.random() * 3)],
          排放源類別: ['固定燃燒', '移動燃燒', '外購電力'][Math.floor(Math.random() * 3)],
          消耗量: (Math.random() * 10000).toFixed(2),
          單位: ['kWh', 'L', 'm³'][Math.floor(Math.random() * 3)],
          排放量: (Math.random() * 5000).toFixed(2),
        },
        errors: hasError ? ['排放係數缺失'] : [],
        warnings: hasWarning ? ['數值異常偏高，建議確認'] : [],
        isValid: !hasError,
      });
    }

    return rows;
  };

  // 提交解析結果
  const handleSubmit = () => {
    if (previewData) {
      onParse(previewData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-3xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">批次資料上傳</h2>
              <p className="text-sm text-slate-400">上傳 Excel 或 CSV 檔案進行批次處理</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Template Selector */}
            {showTemplateSelector && (
              <motion.div
                key="template-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <p className="text-sm text-slate-400">
                  選擇資料模板，或直接上傳已有格式的檔案：
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {(Object.keys(TEMPLATES) as TemplateType[]).map((type) => {
                    const template = TEMPLATES[type];
                    const isSelected = selectedTemplate === type;

                    return (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTemplate(type)}
                        className={`p-6 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Table className="w-6 h-6 text-blue-400" />
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div className="font-bold text-white mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                          {template.description}
                        </div>
                        <div className="text-xs text-slate-500">
                          {template.rowCount} 欄位
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDownloadTemplate(selectedTemplate)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition-all"
                  >
                    <Download className="w-4 h-4" />
                    下載範本
                  </button>
                </div>
              </motion.div>
            )}

            {/* File Upload Area */}
            {!showTemplateSelector && (
              <motion.div
                key="file-upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Processing State */}
                {isProcessing && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                    <p className="text-lg font-bold text-white">正在解析檔案...</p>
                    <p className="text-sm text-slate-400 mt-2">
                      請稍候，系統正在處理 {file?.name}
                    </p>
                  </div>
                )}

                {/* Preview Data */}
                {!isProcessing && previewData && (
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                      <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                      <div className="flex-1">
                        <p className="font-bold text-white">{file?.name}</p>
                        <p className="text-xs text-slate-400">
                          {previewData.length} 筆資料
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {previewData.filter((r) => r.isValid).length === previewData.length ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle className="w-4 h-4" />
                            全部有效
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <AlertCircle className="w-4 h-4" />
                            需確認
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Data Preview Table */}
                    <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-white/5">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                #
                              </th>
                              {[
                                '年度',
                                '範疇',
                                '排放源類別',
                                '消耗量',
                                '單位',
                                '排放量',
                                '狀態',
                              ].map((header) => (
                                <th
                                  key={header}
                                  className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {previewData.slice(0, 10).map((row) => (
                              <tr key={row.rowNumber} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-slate-400">
                                  {row.rowNumber}
                                </td>
                                <td className="px-4 py-3 text-white">
                                  {row.data.年度}
                                </td>
                                <td className="px-4 py-3 text-white">
                                  {row.data.範疇}
                                </td>
                                <td className="px-4 py-3 text-white">
                                  {row.data.消耗量}
                                </td>
                                <td className="px-4 py-3 text-slate-400">
                                  {row.data.單位}
                                </td>
                                <td className="px-4 py-3 text-blue-400 font-medium">
                                  {row.data.排放量}
                                </td>
                                <td className="px-4 py-3">
                                  {row.isValid ? (
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                      有效
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                      錯誤
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {previewData.length > 10 && (
                        <div className="p-3 text-center text-xs text-slate-400 border-t border-white/5">
                          顯示前 10 筆，共 {previewData.length} 筆
                        </div>
                      )}
                    </div>

                    {/* AI Analysis Summary */}
                    <div className="p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-purple-400">
                            AI 分析摘要
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-slate-300">
                            <li>• 已成功解析 {previewData.length} 筆資料</li>
                            <li>• 發現 {previewData.filter((r) => !r.isValid).length} 筆資料需要確認</li>
                            <li>• 建議：範疇二數據佔總排放量 68%，優化用電效率為首要減排目標</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dropzone (when no file selected) */}
                {!isProcessing && !previewData && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <UploadCloud
                      className={`w-16 h-16 mx-auto mb-4 ${
                        isDragging ? 'text-blue-400' : 'text-slate-600'
                      }`}
                    />
                    <p className="text-lg font-bold text-white mb-2">
                      拖放檔案到這裡
                    </p>
                    <p className="text-sm text-slate-400 mb-6">
                      或點擊下方按鈕選擇檔案
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <label className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl cursor-pointer transition-all">
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        選擇檔案
                      </label>
                      <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                      >
                        更換範本
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                      支援 Excel (.xlsx, .xls) 和 CSV 格式，最大 10MB
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {previewData && !isProcessing && (
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-slate-900/50">
            <button
              onClick={() => {
                setFile(null);
                setPreviewData(null);
                setShowTemplateSelector(true);
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
            >
              重新上傳
            </button>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                確認匯入
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExcelUploader;
