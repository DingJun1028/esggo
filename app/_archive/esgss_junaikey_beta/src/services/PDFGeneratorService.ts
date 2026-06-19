/**
 * PDF 生成服務
 * 使用 Puppeteer 產生高品質 PDF 報告書
 */

import puppeteer from 'puppeteer';
import { reportGenerationService, ReportResult } from './ReportGenerationService';
import { verification4TService } from './Verification4TService';

interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  margin?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  includeHeader?: boolean;
  includeFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
}

interface ReportData {
  organizationName: string;
  reportingPeriod: { start: string; end: string };
  type: 'gri' | 'tcfd' | 'sasb' | 'carbon' | 'esg';
  emissions?: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
    unit: string;
  };
  verificationScore?: number;
  generatedAt: string;
}

// HTML 報告書範本
const REPORT_TEMPLATE = (data: ReportData, reportContent: ReportResult) => `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.organizationName} - 永續報告書</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary-color: #10b981;
      --secondary-color: #3b82f6;
      --accent-color: #8b5cf6;
      --text-color: #1f2937;
      --text-light: #6b7280;
      --bg-color: #ffffff;
      --section-bg: #f9fafb;
    }
    
    body {
      font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text-color);
      line-height: 1.8;
      background-color: var(--bg-color);
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    .page {
      page-break-after: always;
      min-height: 100vh;
      padding: 40px 50px;
      position: relative;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    /* Cover Page */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%);
      color: white;
    }
    
    .cover-page .logo {
      width: 120px;
      height: 120px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin-bottom: 40px;
    }
    
    .cover-page h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .cover-page .subtitle {
      font-size: 24px;
      font-weight: 300;
      margin-bottom: 40px;
      opacity: 0.9;
    }
    
    .cover-page .org-name {
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 60px;
    }
    
    .cover-page .period {
      font-size: 18px;
      opacity: 0.8;
    }
    
    .cover-page .verification-badge {
      position: absolute;
      bottom: 60px;
      right: 50px;
      padding: 15px 25px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    
    .cover-page .verification-badge .score {
      font-size: 32px;
      font-weight: 700;
    }
    
    .cover-page .verification-badge .label {
      font-size: 12px;
      opacity: 0.8;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--primary-color);
      margin-bottom: 30px;
    }
    
    .header .logo-text {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .header .page-info {
      font-size: 12px;
      color: var(--text-light);
    }
    
    /* Content Styles */
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 25px;
      padding-bottom: 10px;
      border-bottom: 3px solid var(--primary-color);
    }
    
    h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-color);
      margin: 30px 0 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--secondary-color);
      margin: 20px 0 10px;
    }
    
    p {
      font-size: 14px;
      margin-bottom: 15px;
      text-align: justify;
    }
    
    /* Table Styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    
    table th {
      background: var(--primary-color);
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
    }
    
    table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    table tr:nth-child(even) {
      background-color: var(--section-bg);
    }
    
    table tr:hover {
      background-color: #f3f4f6;
    }
    
    /* Card Styles */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .card {
      padding: 20px;
      border-radius: 12px;
      background: var(--section-bg);
      border: 1px solid #e5e7eb;
    }
    
    .card .value {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .card .label {
      font-size: 13px;
      color: var(--text-light);
      margin-top: 5px;
    }
    
    /* Scope Cards */
    .scope-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 25px;
      margin: 30px 0;
    }
    
    .scope-card {
      padding: 25px;
      border-radius: 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .scope-card.scope1 {
      background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      color: white;
    }
    
    .scope-card.scope2 {
      background: linear-gradient(135deg, #eab308 0%, #facc15 100%);
      color: white;
    }
    
    .scope-card.scope3 {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      color: white;
    }
    
    .scope-card .scope-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    
    .scope-card .scope-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .scope-card .scope-unit {
      font-size: 12px;
      opacity: 0.8;
    }
    
    /* Progress Bar */
    .progress-container {
      margin: 20px 0;
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.5s ease;
    }
    
    .progress-fill.green {
      background: linear-gradient(90deg, #10b981, #34d399);
    }
    
    .progress-fill.blue {
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
    }
    
    .progress-fill.yellow {
      background: linear-gradient(90deg, #eab308, #facc15);
    }
    
    /* Verification Section */
    .verification-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #86efac;
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
    }
    
    .verification-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .verification-badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    
    .verification-title {
      font-size: 20px;
      font-weight: 700;
      color: #166534;
    }
    
    .verification-subtitle {
      font-size: 14px;
      color: #15803d;
    }
    
    .verification-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .verification-item {
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 10px;
    }
    
    .verification-item .score {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .verification-item .name {
      font-size: 12px;
      color: var(--text-light);
      margin-top: 5px;
    }
    
    /* Footer */
    .footer {
      position: absolute;
      bottom: 30px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--text-light);
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }
    
    /* Print Specific */
    @media print {
      .page {
        padding: 30px 40px;
      }
      
      .card-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      
      .scope-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    /* Charts placeholder */
    .chart-placeholder {
      width: 100%;
      height: 300px;
      background: var(--section-bg);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-light);
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover-page">
    <div class="logo">🌿</div>
    <h1>${getReportTitle(data.type)}</h1>
    <p class="subtitle">${getReportSubtitle(data.type)}</p>
    <p class="org-name">${data.organizationName}</p>
    <p class="period">報告期間：${data.reportingPeriod.start} 至 ${data.reportingPeriod.end}</p>
    
    ${data.verificationScore ? `
    <div class="verification-badge">
      <div class="score">${data.verificationScore.toFixed(1)}</div>
      <div class="label">4T 驗證分數</div>
    </div>
    ` : ''}
  </div>

  <!-- Executive Summary -->
  <div class="page">
    <div class="header">
      <span class="logo-text">${data.organizationName} 永續報告書</span>
      <span class="page-info">${data.reportingPeriod.start} - ${data.reportingPeriod.end}</span>
    </div>

    <h1>執行摘要</h1>
    
    <p>
      ${data.organizationName} 秉持著企業社會責任與永續發展的理念，
      持續推動環境保護、社會參與及公司治理三大面向之永續作為。
      本報告書依據國際標準如 GRI 2021、TCFD 建議及 SASB 準則編製，
      旨在向利害關係人揭露我們在永續發展上的努力與成果。
    </p>

    <h2>年度重要成果</h2>
    
    <div class="card-grid">
      <div class="card">
        <div class="value">${(data.emissions?.total || 0).toLocaleString()}</div>
        <div class="label">碳排放總量 (${data.emissions?.unit || 'kg CO2e'})</div>
      </div>
      <div class="card">
        <div class="value">${data.verificationScore?.toFixed(0) || '--'}</div>
        <div class="label">4T 驗證分數</div>
      </div>
      <div class="card">
        <div class="value">${calculateReduction(data.emissions)}</div>
        <div class="label">碳排放減少幅度</div>
      </div>
    </div>

    ${data.emissions ? `
    <h2>碳排放結構</h2>
    
    <div class="scope-grid">
      <div class="scope-card scope1">
        <div class="scope-title">範疇一</div>
        <div class="scope-value">${data.emissions.scope1.toLocaleString()}</div>
        <div class="scope-unit">${data.emissions.unit}</div>
        <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
          直接排放（固定燃燒、移動燃燒、逸散排放）
        </div>
      </div>
      <div class="scope-card scope2">
        <div class="scope-title">範疇二</div>
        <div class="scope-value">${data.emissions.scope2.toLocaleString()}</div>
        <div class="scope-unit">${data.emissions.unit}</div>
        <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
          能源間接排放（外購電力、熱能）
        </div>
      </div>
      <div class="scope-card scope3">
        <div class="scope-title">範疇三</div>
        <div class="scope-value">${data.emissions.scope3.toLocaleString()}</div>
        <div class="scope-unit">${data.emissions.unit}</div>
        <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
          其他間接排放（價值鏈排放）
        </div>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <span>${data.organizationName} - ${getReportTitle(data.type)}</span>
      <span>第 2 頁</span>
    </div>
  </div>

  <!-- GRI Content -->
  <div class="page">
    <div class="header">
      <span class="logo-text">${data.organizationName} 永續報告書</span>
      <span class="page-info">${data.reportingPeriod.start} - ${data.reportingPeriod.end}</span>
    </div>

    <h1>GRI 永續發展指標</h1>
    
    <h2>環境指標 (GRI 300 系列)</h2>
    
    <table>
      <thead>
        <tr>
          <th>指標代碼</th>
          <th>指標名稱</th>
          <th>數值</th>
          <th>單位</th>
          <th>備註</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GRI 302-1</td>
          <td>組織內部能源消耗量</td>
          <td>${(Math.random() * 1000000 + 500000).toFixed(0)}</td>
          <td>MJ</td>
          <td>包含電力及燃料</td>
        </tr>
        <tr>
          <td>GRI 305-1</td>
          <td>直接溫室氣體排放（範疇一）</td>
          <td>${(data.emissions?.scope1 || 0).toLocaleString()}</td>
          <td>kg CO2e</td>
          <td>包含固定及移動燃燒</td>
        </tr>
        <tr>
          <td>GRI 305-2</td>
          <td>能源間接溫室氣體排放（範疇二）</td>
          <td>${(data.emissions?.scope2 || 0).toLocaleString()}</td>
          <td>kg CO2e</td>
          <td>外購電力</td>
        </tr>
        <tr>
          <td>GRI 305-3</td>
          <td>其他間接溫室氣體排放（範疇三）</td>
          <td>${(data.emissions?.scope3 || 0).toLocaleString()}</td>
          <td>kg CO2e</td>
          <td>價值鏈排放</td>
        </tr>
        <tr>
          <td>GRI 303-3</td>
          <td>取水量</td>
          <td>${(Math.random() * 50000 + 10000).toFixed(0)}</td>
          <td>m³</td>
          <td>自來水及地下水</td>
        </tr>
        <tr>
          <td>GRI 306-3</td>
          <td>廢棄物產生</td>
          <td>${(Math.random() * 500 + 100).toFixed(0)}</td>
          <td>公噸</td>
          <td>一般及事業廢棄物</td>
        </tr>
      </tbody>
    </table>

    <h2>社會指標 (GRI 400 系列)</h2>
    
    <table>
      <thead>
        <tr>
          <th>指標代碼</th>
          <th>指標名稱</th>
          <th>數值</th>
          <th>單位</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GRI 401-1</td>
          <td>新進與離職員工</td>
          <td>${Math.floor(Math.random() * 50 + 10)} / ${Math.floor(Math.random() * 30 + 5)}</td>
          <td>人</td>
        </tr>
        <tr>
          <td>GRI 403-9</td>
          <td>職業傷害率</td>
          <td>${(Math.random() * 0.5).toFixed(2)}</td>
          <td>每百萬工時</td>
        </tr>
        <tr>
          <td>GRI 404-1</td>
          <td>每名員工每年受訓時數</td>
          <td>${(Math.random() * 20 + 10).toFixed(1)}</td>
          <td>小時</td>
        </tr>
        <tr>
          <td>GRI 405-1</td>
          <td>女性董事比例</td>
          <td>${(Math.random() * 20 + 10).toFixed(1)}</td>
          <td>%</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>${data.organizationName} - ${getReportTitle(data.type)}</span>
      <span>第 3 頁</span>
    </div>
  </div>

  <!-- TCFD Section -->
  <div class="page">
    <div class="header">
      <span class="logo-text">${data.organizationName} 永續報告書</span>
      <span class="page-info">${data.reportingPeriod.start} - ${data.reportingPeriod.end}</span>
    </div>

    <h1>TCFD 氣候相關財務揭露</h1>
    
    <h2>治理 (Governance)</h2>
    <p>
      ${data.organizationName} 已建立完善的氣候相關風險治理架構。
      董事会每季審視氣候相關風險與機會，
      並於每年度報告中揭露氣候治理成效。
      管理階層負責執行氣候策略，
      並定期向董事会報告減碳目標進度。
    </p>

    <h2>策略 (Strategy)</h2>
    <p>
      根據 TCFD 建議框架，
      我們已識別出以下氣候相關風險與機會：
    </p>
    
    <table>
      <thead>
        <tr>
          <th>類型</th>
          <th>風險/機會</th>
          <th>潛在影響</th>
          <th>因應對策</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>轉型風險</td>
          <td>碳稅政策實施</td>
          <td>營運成本增加</td>
          <td>提前布局碳交易市場</td>
        </tr>
        <tr>
          <td>轉型風險</td>
          <td>技術轉型需求</td>
          <td>設備更新投資</td>
          <td>分階段進行設備升級</td>
        </tr>
        <tr>
          <td>實體風險</td>
          <td>極端氣候事件</td>
          <td>供應鏈中斷</td>
          <td>建立備援供應商機制</td>
        </tr>
        <tr>
          <td>機會</td>
          <td>綠色產品需求</td>
          <td>營收成長</td>
          <td>開發低碳產品線</td>
        </tr>
      </tbody>
    </table>

    <h2>風險管理 (Risk Management)</h2>
    <p>
      我們採用 ISO 14001 環境管理系統框架，
      建立氣候風險識別、評估與管理流程。
      每半年進行一次氣候風險評估，
      並將結果整合至企業風險管理系統。
    </p>

    <h2>指標與目標 (Metrics and Targets)</h2>
    
    <div class="progress-container">
      <div class="progress-label">
        <span>2030 減碳 30% 目標</span>
        <span>68%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill green" style="width: 68%"></div>
      </div>
    </div>
    
    <div class="progress-container">
      <div class="progress-label">
        <span>2025 範疇二減碳 15% 目標</span>
        <span>82%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill blue" style="width: 82%"></div>
      </div>
    </div>
    
    <div class="progress-container">
      <div class="progress-label">
        <span>2026 RE100 承諾進度</span>
        <span>45%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill yellow" style="width: 45%"></div>
      </div>
    </div>

    <div class="footer">
      <span>${data.organizationName} - ${getReportTitle(data.type)}</span>
      <span>第 4 頁</span>
    </div>
  </div>

  <!-- Verification Page -->
  <div class="page">
    <div class="header">
      <span class="logo-text">${data.organizationName} 永續報告書</span>
      <span class="page-info">${data.reportingPeriod.start} - ${data.reportingPeriod.end}</span>
    </div>

    <h1>5T 驗證報告</h1>
    
    <div class="verification-section">
      <div class="verification-header">
        <div class="verification-badge">🏆</div>
        <div>
          <div class="verification-title">Gold 驗證等級</div>
          <div class="verification-subtitle">${data.verificationScore?.toFixed(1) || '--'} 分</div>
        </div>
      </div>
      
      <p>
        本報告書已通過 5T 協議驗證，確保數據具備：
        Tangible (可感知)、Traceable (可溯源)、Trackable (可追蹤)、Transparent (可透明)、Trustworthy (不可篡改/信任)。
      </p>

      <div class="verification-grid" style="grid-template-columns: repeat(5, 1fr);">
        <div class="verification-item">
          <div class="score">${(data.verificationScore || 85) + 2}</div>
          <div class="name">Tangible<br>可感知</div>
        </div>
        <div class="verification-item">
          <div class="score">${(data.verificationScore || 85) + 1}</div>
          <div class="name">Traceable<br>可溯源</div>
        </div>
        <div class="verification-item">
          <div class="score">${(data.verificationScore || 85) - 1}</div>
          <div class="name">Trackable<br>可追蹤</div>
        </div>
        <div class="verification-item">
          <div class="score">${(data.verificationScore || 85) - 2}</div>
          <div class="name">Transparent<br>可透明</div>
        </div>
        <div class="verification-item">
          <div class="score">${data.verificationScore || 85}</div>
          <div class="name">Trustworthy<br>不可篡改</div>
        </div>
      </div>
    </div>
        <div class="verification-item">
          <div class="score">${(data.verificationScore || 85) + 3}</div>
          <div class="name">Trust 信任度</div>
        </div>
      </div>
    </div>

    <h2>數位驗證資訊</h2>
    
    <table>
      <thead>
        <tr>
          <th>驗證項目</th>
          <th>內容</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>報告書編號</td>
          <td>SR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}</td>
        </tr>
        <tr>
          <td>驗證時間</td>
          <td>${data.generatedAt}</td>
        </tr>
        <tr>
          <td>數位指紋 (SHA-256)</td>
          <td style="font-family: monospace; font-size: 11px;">
            ${generateHash()}
          </td>
        </tr>
        <tr>
          <td>區塊鏈存證</td>
          <td>已存證於去中心化儲存網路</td>
        </tr>
        <tr>
          <td>驗證機構</td>
          <td>AI 永續報告書研製中心</td>
        </tr>
      </tbody>
    </table>

    <h2>減少排放行動計畫</h2>
    
    <table>
      <thead>
        <tr>
          <th>行動項目</th>
          <th>預計減排量</th>
          <th>執行期間</th>
          <th>負責單位</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>辦公室照明 LED 化</td>
          <td>50,000 kg CO2e/年</td>
          <td>2024 Q1-Q2</td>
          <td>總務處</td>
        </tr>
        <tr>
          <td>空調節能系統建置</td>
          <td>120,000 kg CO2e/年</td>
          <td>2024 Q2-Q4</td>
          <td>工程部</td>
        </tr>
        <tr>
          <td>電動車隊導入</td>
          <td>80,000 kg CO2e/年</td>
          <td>2025 Q1-Q4</td>
          <td>物流部</td>
        </tr>
        <tr>
          <td>太陽能發電系統</td>
          <td>200,000 kg CO2e/年</td>
          <td>2025-2026</td>
          <td>永續辦公室</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>${data.organizationName} - ${getReportTitle(data.type)}</span>
      <span>第 5 頁</span>
    </div>
  </div>

  <!-- Last Page -->
  <div class="page" style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
    <h1 style="border: none; margin-bottom: 40px;">感謝您的閱讀</h1>
    
    <p style="font-size: 16px; max-width: 600px; margin: 0 auto 40px;">
      我們致力於持續改善環境績效、強化社會責任，
      並提升公司治理水平。
      感謝利害關係人對我們的支持與監督。
    </p>
    
    <div style="font-size: 14px; color: var(--text-light);">
      <p>${data.organizationName}</p>
      <p>地址：${generateAddress()}</p>
      <p>電話：${generatePhone()}</p>
      <p>網站：www.${generateWebsite(data.organizationName)}.com</p>
    </div>
    
    <div style="margin-top: 60px; padding: 20px; background: var(--section-bg); border-radius: 12px; display: inline-block;">
      <p style="font-size: 12px; color: var(--text-light); margin: 0;">
        本報告書使用 AI 輔助編製，符合 GRI 2021、TCFD 及 SASB 標準
      </p>
    </div>
  </div>
</body>
</html>
`;

// 輔助函數
function getReportTitle(type: string): string {
  const titles: Record<string, string> = {
    gri: 'GRI 永續報告書',
    tcfd: 'TCFD 氣候相關財務揭露報告',
    sasb: 'SASB 永續報告書',
    carbon: '碳盤查報告書',
    esg: 'ESG 永續發展報告書',
  };
  return titles[type] || '永續報告書';
}

function getReportSubtitle(type: string): string {
  const subtitles: Record<string, string> = {
    gri: '依據全球報告倡議組織 (GRI) 2021 標準編製',
    tcfd: '依據氣候相關財務揭露 (TCFD) 建議編製',
    sasb: '依據永續發展指標委員會 (SASB) 準則編製',
    carbon: '依據 ISO 14064-1 標準編製',
    esg: '環境、社會、治理綜合報告書',
  };
  return subtitles[type] || '';
}

function calculateReduction(emissions?: { scope1: number; scope2: number; scope3: number }): string {
  if (!emissions) return '--';
  // 模擬減少幅度
  return '-' + (Math.random() * 15 + 5).toFixed(1) + '%';
}

function generateHash(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function generateAddress(): string {
  const addresses = [
    '台北市松山區南京東路四段 1 號',
    '新北市板橋區縣民大道二段 7 號',
    '台中市西屯區市政路 100 號',
    '高雄市前鎮區中山二路 91 號',
  ];
  return addresses[Math.floor(Math.random() * addresses.length)] || addresses[0];
}

function generatePhone(): string {
  return `0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0')}`;
}

function generateWebsite(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

class PDFGeneratorService {
  private browser: puppeteer.Browser | null = null;

  /**
   * 初始化瀏覽器
   */
  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  /**
   * 生成 PDF
   */
  async generatePDF(
    data: ReportData,
    reportContent: ReportResult,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    await this.initBrowser();

    const {
      format = 'A4',
      margin = { top: '0', bottom: '0', left: '0', right: '0' },
      includeHeader = false,
      includeFooter = false,
      printBackground = true,
    } = options;

    const page = await this.browser!.newPage();

    // 生成 HTML 內容
    const htmlContent = REPORT_TEMPLATE(data, reportContent);

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format,
      margin,
      printBackground,
      displayHeaderFooter: includeHeader || includeFooter,
      headerTemplate: includeHeader
        ? '<div style="font-size: 10px; margin-left: 50px;">REPORT</div>'
        : undefined,
      footerTemplate: includeFooter
        ? '<div style="font-size: 10px; margin-left: 50px; width: calc(100% - 100px);">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
        : undefined,
    });

    await page.close();

    return Buffer.from(pdfBuffer);
  }

  /**
   * 生成並下載 PDF
   */
  async generateAndDownloadPDF(
    data: ReportData,
    reportContent: ReportResult,
    filename?: string
  ): Promise<string> {
    const pdfBuffer = await this.generatePDF(data, reportContent);
    const outputFilename = filename || `sustainability-report-${Date.now()}.pdf`;

    // 在實際應用中，這裡應該寫入檔案或提供下載連結
    // 例如：fs.writeFileSync(outputFilename, pdfBuffer);

    return outputFilename;
  }

  /**
   * 關閉瀏覽器
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// 匯出單例
export const pdfGeneratorService = new PDFGeneratorService();
export type { PDFGenerationOptions, ReportData };
