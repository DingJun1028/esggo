/**
 * PDF Generator – ESG Resource Summary
 * Supports both preview mode (autoprint:false) and download mode (autoprint:true).
 */
import type { ISustainabilityResource } from '@/data/sustainability-library-db';

const AQUA = '#63a6b0';

export interface PdfOptions {
  /** 載入後自動觸發列印對話框（下載模式用），預設 true */
  autoprint?: boolean;
}

// ─── Public API ────────────────────────────────────────────────────────────

/** 產生資源的 HTML 摘要頁面字串，供 API route 回傳或直接嵌入 iframe */
export function generateResourcePdfHtml(
  resource: ISustainabilityResource,
  options: PdfOptions = {},
): string {
  const autoprint = options.autoprint ?? true;
  return buildHtml(resource, autoprint);
}

/** 在用戶端開啟新視窗並觸發瀏覽器列印/存為 PDF */
export function downloadResourceAsPdf(resource: ISustainabilityResource): void {
  if (typeof window === 'undefined') return;

  const html = generateResourcePdfHtml(resource, { autoprint: true });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank');
  if (!win) {
    // popup blocked → fallback: blob download
    const a = document.createElement('a');
    a.href = url;
    a.download = `ESG-${resource.id}-summary.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ─── HTML Builder ──────────────────────────────────────────────────────────

function buildHtml(res: ISustainabilityResource, autoprint: boolean): string {
  const catColors: Record<string, string> = {
    Yearbook: '#22d3ee',
    Report: '#a78bfa',
    Regulation: '#f87171',
    Template: '#fbbf24',
    CaseStudy: '#34d399',
  };
  const catColor = catColors[res.category] ?? AQUA;

  const scoreColor =
    (res.esg_score ?? 0) >= 95 ? '#34d399' :
      (res.esg_score ?? 0) >= 85 ? AQUA :
        (res.esg_score ?? 0) >= 75 ? '#fbbf24' :
          '#f87171';

  const tagsHtml = (res.tags ?? [])
    .map(t => `<span class="tag">#&nbsp;${t.replace(/_/g, ' ')}</span>`)
    .join('');

  const regionFlag: Record<string, string> = {
    Taiwan: '🇹🇼', USA: '🇺🇸', EU: '🇪🇺', Global: '🌐', APAC: '🌏',
  };
  const flag = regionFlag[res.region] ?? '🌍';

  const dateStr = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const fiveT = [
    { k: 'Traceable', l: '可溯源', c: '#34d399' },
    { k: 'Trackable', l: '可追蹤', c: '#22d3ee' },
    { k: 'Transparent', l: '可驗算', c: '#a78bfa' },
    { k: 'Tangible', l: '可感知', c: '#fbbf24' },
    { k: 'Trustworthy', l: '不可篡改', c: '#f87171' },
  ];
  const fiveTHtml = fiveT
    .map(t => `<span class="badge5t" style="border-color:${t.c}33;color:${t.c}">
            <span class="dot" style="background:${t.c}"></span>${t.k} · ${t.l}
        </span>`)
    .join('');

  const autoprintScript = autoprint
    ? `<script>window.addEventListener('load',()=>{setTimeout(()=>window.print(),800);})<\/script>`
    : '';

  return /* html */`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ESG Summary — ${res.title_zh}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Noto+Sans+TC:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 15mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
  body {
    font-family: 'Inter','Noto Sans TC',system-ui,sans-serif;
    background: #0a0f1a;
    color: #e2e8f0;
    padding: 32px;
    min-height: 100vh;
  }
  .page {
    max-width: 800px; margin: 0 auto;
    background: linear-gradient(135deg,#0d1b2a,#112233);
    border: 1px solid rgba(99,166,176,0.2);
    border-radius: 16px;
    overflow: hidden;
  }
  /* Header */
  .header {
    background: linear-gradient(135deg,${AQUA}22,${AQUA}08);
    padding: 28px 32px 24px;
    border-bottom: 1px solid ${AQUA}33;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-dot { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg,${AQUA},#ffd700); }
  .brand-name { font-size: 13px; font-weight: 900; color: ${AQUA}; letter-spacing: 0.1em; text-transform: uppercase; }
  .brand-sub { font-size: 9px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.05em; }
  .print-date { font-size: 10px; color: rgba(255,255,255,0.3); text-align: right; }
  /* Category badge */
  .cat-badge {
    display: inline-block; padding: 3px 12px;
    border-radius: 999px; font-size: 9px; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.1em;
    background: ${catColor}22; color: ${catColor}; border: 1px solid ${catColor}44;
    margin-bottom: 8px;
  }
  /* Body */
  .body { padding: 28px 32px; }
  .title-zh { font-size: 22px; font-weight: 900; color: #fff; line-height: 1.3; margin-bottom: 4px; }
  .title-en { font-size: 13px; font-weight: 600; font-style: italic; color: ${AQUA}aa; margin-bottom: 12px; }
  .author { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 16px; }
  .meta-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 999px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 600;
  }
  /* Description */
  .desc { font-size: 12px; line-height: 1.8; color: rgba(255,255,255,0.55); margin-bottom: 24px; }
  /* ESG Score */
  .score-section { margin-bottom: 24px; }
  .section-label { font-size: 9px; font-weight: 900; color: ${AQUA}; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 10px; }
  .score-card {
    display: flex; align-items: center; gap: 16px;
    padding: 14px 20px; border-radius: 12px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(99,166,176,0.12);
  }
  .score-num { font-size: 36px; font-weight: 900; color: ${scoreColor}; line-height: 1; }
  .score-bar-wrap { flex: 1; }
  .score-bar-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 999px; background: ${scoreColor}; width: ${res.esg_score ?? 0}%; }
  .score-label { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 4px; }
  .standard-tag {
    padding: 4px 10px; border-radius: 8px;
    background: ${AQUA}12; border: 1px solid ${AQUA}22;
    font-size: 9px; font-weight: 700; color: ${AQUA};
  }
  /* Tags */
  .tags-section { margin-bottom: 24px; }
  .tag {
    display: inline-block; padding: 3px 10px; margin: 2px;
    background: ${AQUA}12; border: 1px solid ${AQUA}30;
    border-radius: 999px; font-size: 9px; color: ${AQUA}; font-weight: 700;
  }
  /* 5T */
  .fivet-section { margin-bottom: 24px; }
  .fivet-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .badge5t {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 8px;
    background: rgba(255,255,255,0.03); border: 1px solid;
    font-size: 9px; font-weight: 700;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  /* Footer */
  .footer {
    padding: 16px 32px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 9px; color: rgba(255,255,255,0.2);
  }
  /* No-print download link */
  .dl-hint {
    text-align: center; padding: 16px;
    font-size: 11px; color: rgba(99,166,176,0.6);
  }
  a { color: ${AQUA}; }
</style>
${autoprintScript}
</head>
<body>

<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-dot"></div>
      <div>
        <div class="brand-name">ESG GO</div>
        <div class="brand-sub">Sustainability Library · 5T Protocol</div>
      </div>
    </div>
    <div class="print-date">
      <div>列印日期</div>
      <div style="font-weight:700;color:rgba(255,255,255,0.4)">${dateStr}</div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">
    <span class="cat-badge">${res.category}</span>

    <h1 class="title-zh">${res.title_zh}</h1>
    ${res.title_en ? `<p class="title-en">${res.title_en}</p>` : ''}
    <p class="author">by ${res.author}</p>

    <div class="meta-pills">
      <span class="pill">${flag} ${res.region}</span>
      <span class="pill">📅 ${res.year}</span>
      ${res.pages ? `<span class="pill">📄 ${res.pages} 頁</span>` : ''}
      ${res.language ? `<span class="pill">🌐 ${res.language}</span>` : ''}
    </div>

    <p class="desc">${res.description_zh ?? ''}</p>

    ${res.esg_score ? `
    <div class="score-section">
      <div class="section-label">ESG Score</div>
      <div class="score-card">
        <div class="score-num">${res.esg_score}</div>
        <div class="score-bar-wrap">
          <div class="score-bar-track"><div class="score-bar-fill"></div></div>
          <div class="score-label">綜合永續評分 / 100</div>
        </div>
        ${res.standard ? `<span class="standard-tag">${res.standard}</span>` : ''}
      </div>
    </div>` : ''}

    ${tagsHtml ? `
    <div class="tags-section">
      <div class="section-label">Keywords</div>
      ${tagsHtml}
    </div>` : ''}

    <div class="fivet-section">
      <div class="section-label">5T Protocol Compliance</div>
      <div class="fivet-grid">${fiveTHtml}</div>
    </div>

    ${res.url ? `
    <div class="no-print" style="margin-top:16px">
      <div class="section-label">原始連結</div>
      <a href="${res.url}" target="_blank" rel="noopener">${res.url}</a>
    </div>` : ''}
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>ESG GO | InfoOne · JunAiKey · 服務即教學，知識即資產</span>
    <span>ID: ${res.id} · 上善若水 ♾️</span>
  </div>
</div>

${!autoprint ? `
<div class="dl-hint no-print">
  按下 <strong>Ctrl+P</strong>（macOS: ⌘+P）→ 選擇「另存為 PDF」即可下載
</div>` : ''}

</body>
</html>`;
}
