import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Code, RefreshCw, CheckCircle } from 'lucide-react';

interface ReportViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'json' | 'text'>('json');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('api_token') || 'sk-omnipotent-key-2026';
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || 'Failed to generate report');
      }

      const data = await response.json();
      setReportData(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on open if empty
  React.useEffect(() => {
    if (isOpen && !reportData && !loading) {
      generateReport();
    }
  }, [isOpen]);

  const handleDownload = () => {
    if (!reportData) return;
    const blob = new Blob(
      [typeof reportData === 'string' ? reportData : JSON.stringify(reportData, null, 2)],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni_esg_report_${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-5xl h-[85vh] bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">奧秘 ESG 誠信報告</h2>
                <p className="text-xs text-cyan-400/60 font-mono">區塊鏈錨定 • 不可變 • 已驗證</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-800 rounded-lg p-1 flex mr-4">
                <button
                  onClick={() => {
                    setFormat('json');
                    setReportData(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${format === 'json' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Code className="w-3 h-3" /> JSON
                </button>
                <button
                  onClick={() => {
                    setFormat('text');
                    setReportData(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${format === 'text' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <FileText className="w-3 h-3" /> 文字
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative bg-black/40">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mb-4"
                />
                <p className="text-cyan-400 animate-pulse font-mono">正在合成真相...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                <p className="text-xl font-bold mb-2">生成失敗</p>
                <p className="font-mono bg-red-900/10 p-4 rounded-lg border border-red-500/20">
                  {error}
                </p>
                <button
                  onClick={generateReport}
                  className="mt-4 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/50 rounded hover:bg-red-600/40 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> 重試
                </button>
              </div>
            ) : reportData ? (
              <div className="h-full overflow-auto p-6 font-mono text-sm">
                {format === 'json' ? (
                  <pre className="text-green-400/90 whitespace-pre-wrap">
                    {JSON.stringify(reportData, null, 2)}
                  </pre>
                ) : (
                  <pre className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {typeof reportData === 'string'
                      ? reportData
                      : JSON.stringify(reportData, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>選擇格式以初始化報告生成。</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-500/20 bg-gray-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-emerald-400/80">
              {reportData && (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>密碼學驗證</span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateReport}
                disabled={loading}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm font-medium border border-gray-700"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 包含最新數據
              </button>
              <button
                onClick={handleDownload}
                disabled={!reportData || loading}
                className="px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm font-bold shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" /> 下載報告
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
