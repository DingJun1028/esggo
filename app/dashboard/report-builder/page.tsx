"use client";

import React, { useState } from 'react';

export default function ReportBuilderUI() {
  const [loading, setLoading] = useState(false);
  const [reportDoc, setReportDoc] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 讀取 ProfilePage 儲存的本機資料 (若無則使用預設值)
      const companyInfo = JSON.parse(localStorage.getItem('esg_company_info') || '{"name":"ESGGO 示範企業"}');
      const userInfo = JSON.parse(localStorage.getItem('esg_user_info') || '{"fullName":"陳永續 (Sustainability Manager)"}');

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'task_ui_001',
          companyId: companyInfo.name,
          actorId: userInfo.fullName,
          reportYear: '2026',
          triggerSource: 'user',
          evidenceVault: {
            'elec_bill': '5000000',
            'water_bill': '250000'
          },
          privacyConfig: { isConfidential: true }
        })
      });

      const data = await response.json();
      if (data.success) {
        setReportDoc(data.document);
        setChapters(data.chapters);
      } else {
        alert('生成失敗: ' + data.error);
      }
    } catch (err) {
      alert('發生錯誤');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">🏗️ 永續報告生成器 (SustainWrite Zero-Compute)</h1>
      <p className="text-slate-600 mb-8">透過 5T 治理矩陣與 ZKP 零知識證明，全自動生成企業級 ESG 報告。</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold mb-4">步驟 1：啟動引擎</h2>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 disabled:bg-slate-300 transition-colors"
        >
          {loading ? '⚙️ 零算力引擎運轉中 (ZKP 封印中)...' : '🚀 開始生成 2026 年度報告'}
        </button>
      </div>

      {reportDoc && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4">步驟 2：生成結果預覽</h2>
          <div className="mb-4 flex gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">✅ 已生成 {chapters.length} 個章節</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">🔏 Tri-Sync 異地備援完成</span>
          </div>
          <div className="bg-slate-50 p-6 rounded border border-slate-200 h-[600px] overflow-y-auto font-serif prose max-w-none whitespace-pre-wrap">
            {reportDoc}
          </div>
        </div>
      )}
    </div>
  );
}
