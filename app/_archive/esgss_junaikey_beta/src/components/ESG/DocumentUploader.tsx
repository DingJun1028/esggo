/**
 * 📤 文件上傳處理組件
 * --------------------------------------------------
 * [功能] ESG 報告上傳、解析、預覽
 * [整合] DocumentProcessingService, Unstructured, Marker
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  File,
  Image,
  Table2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  Settings,
  FileSpreadsheet,
  Presentation,
  BookOpen,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';
import { EvidenceVault } from '@/services/EvidenceVault';
import keccak256 from 'keccak256';

import {
  DocumentProcessingService,
  ProcessedDocument,
  ProcessingOptions,
  ESGReportData,
} from '@/services/integration/DocumentProcessingService';

// ... (skipping types and component definition start to keep context small if needed, but here I am targeting specific block)

// Actually I will target the Import block and handleFiles separately to be safe.

// ============================================================================
// Types
// ============================================================================

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  result?: ProcessedDocument;
  esgData?: ESGReportData;
  error?: string;
}

// ============================================================================
// Main Component
// ============================================================================

interface DocumentUploaderProps {
  onProcessComplete?: (doc: ProcessedDocument, esgData?: ESGReportData) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onProcessComplete,
  acceptedTypes = ['.pdf', '.docx', '.xlsx', '.pptx', '.html', '.epub'],
  maxFiles = 10,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({
    outputFormat: 'markdown',
    extractTables: true,
    extractImages: true,
    forceOCR: false,
    useLLM: false,
    language: 'zh-TW',
  });

  const service = new DocumentProcessingService({ provider: 'local' });

  const readFileAsBuffer = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result instanceof ArrayBuffer) {
          resolve(Buffer.from(event.target.result));
        } else {
          reject(new Error('Failed to read file as ArrayBuffer.'));
        }
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file drop/select
  const handleFiles = useCallback(
    async (newFiles: FileList) => {
      const trace_id = uuidv4();
      const newUploadedFiles: UploadedFile[] = Array.from(newFiles).map(file => ({
        id: uuidv4(),
        file,
        status: 'pending',
        progress: 0,
      }));

      setFiles(prev => [...prev, ...newUploadedFiles]);

      // Process each file
      for (const uploadedFile of newUploadedFiles) {
        await processFile(uploadedFile, trace_id);
      }
    },
    [maxFiles, options]
  );

  // Process single file
  const processFile = async (uploadedFile: UploadedFile, parent_trace_id?: string) => {
    const trace_id = parent_trace_id || uuidv4();

    setFiles(prev =>
      prev.map(f => (f.id === uploadedFile.id ? { ...f, status: 'processing', progress: 10 } : f))
    );

    try {
      omniLogger.info(LogCategory.INTEGRATION, `組件開始處理文件: ${uploadedFile.file.name}`, {
        trace_id,
        source_origin: 'DocumentUploader.processFile',
      });

      // Read file and compute hash first
      const fileBuffer = await readFileAsBuffer(uploadedFile.file);
      const fileHash = `0x${keccak256(fileBuffer).toString('hex')}`;
      setFiles(prev => prev.map(f => (f.id === uploadedFile.id ? { ...f, progress: 30 } : f)));

      // Simulate progress
      setFiles(prev => prev.map(f => (f.id === uploadedFile.id ? { ...f, progress: 50 } : f)));

      const result = await service.processDocument(uploadedFile.file, options);

      setFiles(prev => prev.map(f => (f.id === uploadedFile.id ? { ...f, progress: 80 } : f)));

      // Extract ESG data
      const esgData = await service.extractESGData(result);

      setFiles(prev => prev.map(f => (f.id === uploadedFile.id ? { ...f, progress: 90 } : f)));

      // [MODIFIED] Phase 21: Deposit to Evidence Vault
      try {
        const evidenceMetadata = await EvidenceVault.deposit(
          fileBuffer,
          uploadedFile.file.name,
          uploadedFile.file.type
        );

        omniLogger.info(LogCategory.KNOWLEDGE, `文件已存入證據庫: ${evidenceMetadata.id}`, {
          trace_id,
          evidenceId: evidenceMetadata.id,
          fileHash: evidenceMetadata.fileHash,
          source_origin: 'DocumentUploader.processFile',
        });

        // Attach evidence metadata to result
        (result as any).evidenceMetadata = evidenceMetadata;
      } catch (vaultError) {
        omniLogger.warn(LogCategory.KNOWLEDGE, '證據庫存儲失敗（非致命）', {
          trace_id,
          error: String(vaultError),
          source_origin: 'DocumentUploader.processFile',
        });
      }

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id ? { ...f, status: 'success', progress: 100, result, esgData } : f
        )
      );

      omniLogger.info(LogCategory.INTEGRATION, `文件組件處理成功: ${uploadedFile.file.name}`, {
        trace_id,
        source_origin: 'DocumentUploader.processFile',
      });

      onProcessComplete?.(result, esgData);
    } catch (error) {
      omniLogger.error(LogCategory.INTEGRATION, `文件組件處理失敗: ${uploadedFile.file.name}`, {
        trace_id,
        error: String(error),
        source_origin: 'DocumentUploader.processFile',
      });

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id ? { ...f, status: 'error', error: String(error) } : f
        )
      );
    }
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Get file icon
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="text-red-400" />;
      case 'docx':
      case 'doc':
        return <FileText className="text-blue-400" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-green-400" />;
      case 'pptx':
      case 'ppt':
        return <Presentation className="text-orange-400" />;
      case 'html':
        return <BookOpen className="text-purple-400" />;
      default:
        return <File className="text-slate-400" />;
    }
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-cyan-500/20 neon-border-cyan animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Upload size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">ESG 文件處理</h2>
            <p className="text-sm text-slate-400">Unstructured + Marker 高階解析</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-all ${
            showSettings
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
          >
            <h4 className="text-sm font-medium text-slate-300 mb-3">處理選項</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={options.extractTables}
                  onChange={e => setOptions(o => ({ ...o, extractTables: e.target.checked }))}
                  className="rounded border-slate-600 bg-slate-700 text-indigo-500"
                />
                提取表格
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={options.extractImages}
                  onChange={e => setOptions(o => ({ ...o, extractImages: e.target.checked }))}
                  className="rounded border-slate-600 bg-slate-700 text-indigo-500"
                />
                提取圖片
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={options.forceOCR}
                  onChange={e => setOptions(o => ({ ...o, forceOCR: e.target.checked }))}
                  className="rounded border-slate-600 bg-slate-700 text-indigo-500"
                />
                強制 OCR
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={options.useLLM}
                  onChange={e => setOptions(o => ({ ...o, useLLM: e.target.checked }))}
                  className="rounded border-slate-600 bg-slate-700 text-indigo-500"
                />
                LLM 增強
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">輸出格式</label>
                <select
                  value={options.outputFormat}
                  onChange={e => setOptions(o => ({ ...o, outputFormat: e.target.value as any }))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                  <option value="html">HTML</option>
                  <option value="chunks">Chunks (RAG)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">語言</label>
                <select
                  value={options.language}
                  onChange={e => setOptions(o => ({ ...o, language: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="zh-TW">繁體中文</option>
                  <option value="zh-CN">簡體中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 group ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99] neon-border-cyan'
            : 'border-slate-700 hover:border-slate-500 bg-slate-800/20'
        }`}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={e => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
          <Upload size={32} className={dragActive ? 'text-cyan-400' : 'text-slate-500'} />
        </div>
        <p className="text-white font-medium mb-1">
          {dragActive ? '放開以開始解析' : '點擊或拖拽文件至此'}
        </p>
        <p className="text-xs text-slate-500">
          支援格式：{acceptedTypes.join(', ')} (最多 {maxFiles} 個檔案)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(file => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                file.status === 'success'
                  ? 'bg-green-500/10 border border-green-500/20'
                  : file.status === 'error'
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-slate-800/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                {getFileIcon(file.file.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {file.status === 'processing' && (
                  <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'processing' && (
                  <Loader2 size={18} className="text-indigo-400 animate-spin" />
                )}
                {file.status === 'success' && (
                  <>
                    <CheckCircle size={18} className="text-green-400" />
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                    >
                      <Eye size={14} className="text-slate-300" />
                    </button>
                  </>
                )}
                {file.status === 'error' && <AlertCircle size={18} className="text-red-400" />}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                >
                  <Trash2 size={14} className="text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedFile?.result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{selectedFile.file.name}</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* ESG Data Summary */}
              {selectedFile.esgData && (
                <div className="mb-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">ESG 數據抽取</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Scope 1:</span>
                      <span className="ml-2 text-white">
                        {selectedFile.esgData.emissions?.scope1?.toLocaleString() || '-'} tCO₂e
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Scope 2:</span>
                      <span className="ml-2 text-white">
                        {selectedFile.esgData.emissions?.scope2?.toLocaleString() || '-'} tCO₂e
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Scope 3:</span>
                      <span className="ml-2 text-white">
                        {selectedFile.esgData.emissions?.scope3?.toLocaleString() || '-'} tCO₂e
                      </span>
                    </div>
                  </div>
                  {selectedFile.esgData.frameworks &&
                    selectedFile.esgData.frameworks.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {selectedFile.esgData.frameworks.map(fw => (
                          <span
                            key={fw}
                            className="px-2 py-0.5 bg-indigo-500/20 rounded text-xs text-indigo-300"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* Document Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4 text-center">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-white">
                    {selectedFile.result.metadata.pageCount}
                  </p>
                  <p className="text-xs text-slate-500">頁數</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-white">
                    {selectedFile.result.metadata.wordCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">字數</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-white">
                    {selectedFile.result.metadata.tableCount}
                  </p>
                  <p className="text-xs text-slate-500">表格</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-white">
                    {selectedFile.result.metadata.imageCount}
                  </p>
                  <p className="text-xs text-slate-500">圖片</p>
                </div>
              </div>

              {/* Markdown Preview */}
              <div className="p-4 bg-slate-800/30 rounded-xl max-h-[300px] overflow-auto">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {selectedFile.result.markdown}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentUploader;
