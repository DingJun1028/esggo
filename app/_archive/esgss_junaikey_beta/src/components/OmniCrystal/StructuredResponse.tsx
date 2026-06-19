/**
 * 📊 Structured Response Component
 * --------------------------------------------------
 * [核心] 結構化回應組件
 * [功能] 一句話結論 → 圖表總匯 → 詳細分析
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BarChart3, FileText } from 'lucide-react';
import { ChartRenderer, TableView, TwoColumnLayout } from './Visualization';
import type { ChartData, TableData } from './Visualization/types';

export interface StructuredResponse {
  conclusion: string; // 一句話結論
  charts?: ChartData[]; // 圖表數據
  tables?: TableData[]; // 表格數據
  analysis: AnalysisSection[]; // 詳細分析
}

export interface AnalysisSection {
  title: string;
  content: string;
}

interface StructuredResponseProps {
  response: StructuredResponse;
  language?: 'zh-TW' | 'en';
}

export const StructuredResponseView: React.FC<StructuredResponseProps> = ({
  response,
  language = 'zh-TW',
}) => {
  return (
    <div className="structured-response">
      {/* 一句話結論 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="conclusion-section"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} className="text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">
            {language === 'zh-TW' ? '💡 一句話結論' : '💡 Key Conclusion'}
          </span>
        </div>
        <p className="text-base font-medium text-white leading-relaxed">{response.conclusion}</p>
      </motion.div>

      {/* 圖表總匯 */}
      {response.charts && response.charts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="charts-section"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400">
              {language === 'zh-TW' ? '📊 圖表總匯' : '📊 Visual Summary'}
            </span>
          </div>
          <div className="charts-container space-y-4">
            {response.charts.map((chart, index) => (
              <ChartRenderer key={index} data={chart} />
            ))}
          </div>
        </motion.div>
      )}

      {/* 表格數據 */}
      {response.tables && response.tables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="tables-section"
        >
          <div className="space-y-4">
            {response.tables.map((table, index) => (
              <TableView key={index} data={table} />
            ))}
          </div>
        </motion.div>
      )}

      {/* 詳細分析 */}
      {response.analysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="analysis-section"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-purple-400" />
            <span className="text-sm font-bold text-purple-400">
              {language === 'zh-TW' ? '🔍 詳細分析' : '🔍 Detailed Analysis'}
            </span>
          </div>
          <div className="space-y-3">
            {response.analysis.map((section, index) => (
              <div key={index} className="analysis-item">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">{section.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <style>{`
                .structured-response {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .conclusion-section {
                    background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05));
                    border: 1px solid rgba(234, 179, 8, 0.3);
                    border-radius: 12px;
                    padding: 14px;
                }
                
                .charts-section {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05));
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    border-radius: 12px;
                    padding: 14px;
                }
                
                .charts-container {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 8px;
                    padding: 12px;
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .analysis-section {
                    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05));
                    border: 1px solid rgba(168, 85, 247, 0.3);
                    border-radius: 12px;
                    padding: 14px;
                }
                
                .analysis-item {
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 8px;
                    padding: 10px;
                }
            `}</style>
    </div>
  );
};
