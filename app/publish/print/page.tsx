"use client";

import React, { useState } from 'react';

/**
 * 🖨️ SustainWrite™ 高水準 PDF 列印匯出頁面 (Print View)
 * 支援「品牌特色調色盤 (Brand Color Palettes)」與高階列印優化
 */

const THEMES = {
  'aqua': { name: '上善若水 (ESGGO 原生)', primary: '#63a6b0', secondary: '#f0f9fa', text: '#1e293b' },
  'forest': { name: '自然共生 (綠色)', primary: '#2f855a', secondary: '#f0fff4', text: '#1a202c' },
  'ocean': { name: '深海湛藍 (科技/金融)', primary: '#1e3a8a', secondary: '#eff6ff', text: '#0f172a' },
  'sunset': { name: '夕陽餘暉 (溫暖/活力)', primary: '#c2410c', secondary: '#fff7ed', text: '#2d3748' },
  'corporate': { name: '沈穩黑白 (極簡經典)', primary: '#171717', secondary: '#f5f5f5', text: '#000000' }
};

export default function PrintReportPage() {
  const [themeId, setThemeId] = useState<keyof typeof THEMES>('aqua');
  const [logoUrl, setLogoUrl] = useState<string>(''); // LOGO URL state
  const activeTheme = THEMES[themeId];

  // 處理本機圖片上傳
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="print-container min-h-screen bg-white p-8 max-w-4xl mx-auto font-serif"
      style={{ 
        '--brand-primary': activeTheme.primary,
        '--brand-secondary': activeTheme.secondary,
        '--brand-text': activeTheme.text
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
          @page { margin: 2cm; size: A4 portrait; }
        }
        .print-container { color: var(--brand-text); }
        h1, h2, h3, h4 { color: var(--brand-primary); page-break-after: avoid; }
        p, table, img, svg { page-break-inside: avoid; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; border-color: var(--brand-primary); }
        th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
        th { background-color: var(--brand-secondary); font-weight: bold; color: var(--brand-primary); }
        .border-brand { border-color: var(--brand-primary); }
        .bg-brand-light { background-color: var(--brand-secondary); }
        
        .control-panel {
          position: fixed; top: 20px; right: 20px;
          padding: 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: sans-serif;
          display: flex; flex-direction: column; gap: 10px; z-index: 50; width: 300px;
        }
      `}} />

      {/* 控制面板 (列印時隱藏) */}
      <div className="no-print control-panel">
        <label className="text-sm font-bold text-slate-700">🎨 選擇品牌調色盤：</label>
        <select 
          className="border p-2 rounded text-sm outline-none"
          value={themeId}
          onChange={(e) => setThemeId(e.target.value as keyof typeof THEMES)}
        >
          {Object.entries(THEMES).map(([id, t]) => (
            <option key={id} value={id}>{t.name}</option>
          ))}
        </select>
        
        <label className="text-sm font-bold text-slate-700 mt-2">🖼️ 上傳企業 LOGO (本機檔案)：</label>
        <input 
          type="file" 
          accept="image/*"
          className="text-sm"
          onChange={handleLogoUpload}
        />

        <div className="bg-amber-50 border-l-4 border-amber-500 p-2 mt-2 text-xs text-amber-800">
          <strong>💡 儲存為 PDF 技巧：</strong>
          點擊下方按鈕後，請在瀏覽器列印視窗中，將「目的地 (Destination)」更改為「<strong>另存為 PDF (Save as PDF)</strong>」。
        </div>

        <button 
          className="mt-2 p-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition"
          onClick={() => window.print()}
        >
          🖨️ 列印 / 匯出高水準 PDF
        </button>
      </div>

      {/* 封面 (Cover Page) */}
      <div className="flex flex-col items-center justify-center h-screen page-break">
        {logoUrl ? (
          <img src={logoUrl} alt="Company Logo" className="h-24 mb-12 object-contain" />
        ) : (
          <div className="h-24 w-24 mb-12 rounded-full border-4 flex items-center justify-center border-brand text-brand font-bold text-3xl">
            ESG
          </div>
        )}
        <h1 className="text-5xl font-bold mb-8 text-center leading-tight">2026 年度<br/>企業永續報告書<br/><span className="text-2xl font-normal opacity-70">(ESG Sustainability Report)</span></h1>
        <p className="text-xl mt-12 opacity-80">依循 GRI、CSRD、TCFD 雙重重大性編製</p>
        <p className="text-md mt-4 opacity-60">由 SustainWrite™ 零算力引擎自動化生成</p>
      </div>

      {/* 目錄與章節 (Table of Contents & Chapters) */}
      <div className="page-break">
        <h2 className="text-3xl font-bold border-b-2 border-brand pb-2 mb-8">目錄 (Table of Contents)</h2>
        <ul className="text-lg space-y-4">
          <li className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>1. 董事長與執行長致辭</span> <span>P. 3</span></li>
          <li className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>2. 關於本報告書與重大性分析</span> <span>P. 5</span></li>
          <li className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>3. 氣候變遷與能源管理 (附趨勢圖表)</span> <span>P. 18</span></li>
        </ul>
      </div>

      {/* 內文範例 (Content Example with Charts) */}
      <div className="page-break content-section mt-12">
        <h2 className="text-3xl font-bold mb-6">3. 氣候變遷與能源管理</h2>
        <p className="mb-6 leading-relaxed text-justify text-lg">
          在當前快速變動的地緣政治與極端氣候威脅下，本集團將永續發展視為企業韌性的最高戰略防線。我們不僅依循 GRI 準則的要求進行全面性揭露，更前瞻性地將 CSRD 之雙重重大性原則內化至董事會層級的決策流程中。
        </p>
        
        <div className="avoid-break my-10 bg-brand-light p-6 rounded-lg border border-brand">
          <h4 className="font-bold mb-4 text-xl">年度關鍵績效指標 (KPIs) 趨勢追蹤</h4>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>年度</th>
                <th>溫室氣體排放量 (tCO2e)</th>
                <th>能源密集度 (GJ/百萬)</th>
                <th>減碳預算執行率</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border-t">2024 (基準)</td><td className="border-t">125,000</td><td className="border-t">15.2</td><td className="border-t">85%</td></tr>
              <tr><td className="border-t">2025</td><td className="border-t">110,000</td><td className="border-t">13.5</td><td className="border-t">92%</td></tr>
              <tr><td className="border-t font-bold">2026 (預估)</td><td className="border-t font-bold" style={{ color: activeTheme.primary }}>95,000</td><td className="border-t font-bold">11.0</td><td className="border-t font-bold">100%</td></tr>
            </tbody>
          </table>
          <p className="text-sm opacity-70 mt-2">*註：上述數據皆已透過第三方確信機構 (Assurance) 完成驗證，並符合 ISAE 3000 標準。</p>
        </div>

        <p className="mb-6 leading-relaxed text-justify text-lg">
          透過導入先進的數位化監控系統與物聯網技術，我們得以即時追蹤每一項措施的執行軌跡與資源消耗狀況，確保過程的絕對透明與可控。
        </p>
      </div>
    </div>
  );
}
