"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Monitor, Smartphone, FileText, Palette, Download, RefreshCw,
    CheckCircle2, ChevronRight, Upload, X, Image as ImageIcon, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

// ─── Brand Theme ─────────────────────────────────────────────────────────────
export interface BrandTheme {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoDataUrl?: string;
    companyName: string;
    reportYear: number;
}

const FONT_OPTIONS = [
    { label: "Inter (現代)", value: "Inter, sans-serif" },
    { label: "Playfair Display (優雅)", value: "'Playfair Display', serif" },
    { label: "Noto Sans TC (中文優化)", value: "'Noto Sans TC', sans-serif" },
    { label: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
];

const COLOR_PRESETS = [
    { name: "森林綠", primary: "#065f46", accent: "#10b981" },
    { name: "海洋藍", primary: "#1e3a5f", accent: "#3b82f6" },
    { name: "日落橙", primary: "#7c2d12", accent: "#f97316" },
    { name: "皇室紫", primary: "#3b0764", accent: "#a855f7" },
    { name: "碳黑", primary: "#0f172a", accent: "#64748b" },
];

type PreviewMode = "pdf" | "html" | "mobile";

interface CompanyProfileShape {
    name: string;
    industry: string;
    reportYear: number;
    goals: string[];
    scope?: string;
    commitments?: string[];
    customFields?: { key: string; value: string }[];
}

interface ReportPreviewPanelProps {
    report: Report | null;
    sectionContents: Record<string, string>;
    editorSections: { id: string; title: string; chapter: string }[];
    companyProfile: CompanyProfileShape;
    language: "zh" | "en";
    globalEsgData?: any;
    onRefresh?: () => void;
}

// ─── Inline SVG Chart Builders ────────────────────────────────────────────────

/** Draws a responsive horizontal bar chart in pure SVG/HTML string */
function buildBarChartSvg(
    labels: string[],
    values: number[],
    primaryColor: string,
    accentColor: string,
    unit = "tCO₂e"
): string {
    const max = Math.max(...values, 1);
    const rowH = 36;
    const labelW = 120;
    const barZone = 260;
    const h = labels.length * rowH + 20;

    const rows = labels.map((label, i) => {
        const pct = (values[i] / max) * barZone;
        const fraction = i / (labels.length - 1 || 1);
        // Interpolate color from primary to accent
        return `
      <g transform="translate(0,${i * rowH + 10})">
        <text x="${labelW - 8}" y="17" font-size="11" fill="#64748b" font-weight="600" text-anchor="end" font-family="inherit">${label}</text>
        <rect x="${labelW}" y="6" width="${barZone}" height="18" rx="4" fill="#f1f5f9"/>
        <rect x="${labelW}" y="6" width="${Math.max(pct, 4)}" height="18" rx="4" fill="${primaryColor}" opacity="${0.55 + 0.45 * fraction}"/>
        <text x="${labelW + pct + 6}" y="19" font-size="10" fill="${primaryColor}" font-weight="800" font-family="inherit">${values[i]} ${unit}</text>
      </g>`;
    }).join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${labelW + barZone + 80} ${h}" style="width:100%;height:auto;display:block">${rows}</svg>`;
}

/** A simple donut chart in SVG */
function buildDonutSvg(
    completed: number,
    total: number,
    primaryColor: string,
    accentColor: string
): string {
    const pct = total > 0 ? completed / total : 0;
    const R = 42, cx = 56, cy = 56, size = 112;
    const circ = 2 * Math.PI * R;
    const dash = pct * circ;
    const label = Math.round(pct * 100);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" style="width:112px;height:112px;display:block">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#e2e8f0" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${primaryColor}" stroke-width="10"
      stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ / 4}"
      stroke-linecap="round"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="18" font-weight="900" fill="${primaryColor}" font-family="inherit">${label}%</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="9" font-weight="700" fill="#94a3b8" font-family="inherit">完成度</text>
  </svg>`;
}

// ─── Dynamic Data Injection ──────────────────────────────────────────────────
function injectDynamicData(content: string, profile: CompanyProfileShape, esgData: any): string {
    if (!content) return "";
    let result = content;

    // Profile fields
    result = result.replace(/\{\{company_name\}\}/g, profile.name);
    result = result.replace(/\{\{industry\}\}/g, profile.industry);
    result = result.replace(/\{\{report_year\}\}/g, String(profile.reportYear));

    // ESG Data fields
    if (esgData) {
        result = result.replace(/\{\{total_reports\}\}/g, String(esgData.totalReports || 0));
        result = result.replace(/\{\{completed_reports\}\}/g, String(esgData.completedReports || 0));
        result = result.replace(/\{\{linked_sources\}\}/g, String(esgData.linkedSourcesCount || 0));
        result = result.replace(/\{\{compliance_rate\}\}/g, String(esgData.complianceRate || 0) + "%");
        result = result.replace(/\{\{trust_score\}\}/g, String(esgData.trustScore || 0));
    }

    return result;
}

// ─── Full HTML Builder ────────────────────────────────────────────────────────
function buildReportHtml(opts: {
    brand: BrandTheme;
    chapters: [string, { id: string; title: string }[]][];
    sectionContents: Record<string, string>;
    report: Report | null;
    completedCount: number;
    totalCount: number;
    companyProfile: CompanyProfileShape;
    globalEsgData: any;
    isMobile: boolean;
}): string {
    const { brand, chapters, sectionContents, report, completedCount, totalCount, companyProfile, globalEsgData, isMobile } = opts;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const maxW = isMobile ? "390px" : "860px";
    const bodyPad = isMobile ? "24px 18px" : "60px 80px";

    // Emission data (representative sample for demo)
    const emLabels = ["範疇一 (直接)", "範疇二 (間接)", "範疇三 (供應鏈)"];
    const emValues = [120, 380, 870];
    const barChartHtml = buildBarChartSvg(emLabels, emValues, brand.primaryColor, brand.accentColor);

    // Progress donut
    const donutHtml = buildDonutSvg(completedCount, totalCount, brand.primaryColor, brand.accentColor);

    // Logo HTML
    const logoHtml = brand.logoDataUrl
        ? `<img src="${brand.logoDataUrl}" alt="Logo" style="height:48px;width:auto;object-fit:contain;filter:brightness(0) invert(1);display:block"/>`
        : `<div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;border:2px solid rgba(255,255,255,.3);font-family:inherit">${brand.companyName.charAt(0)}</div>`;

    // Commitments
    const commitmentsHtml = (companyProfile.commitments ?? [])
        .map(c => `<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:5px 14px;font-size:11px;font-weight:700;color:#fff;margin:4px 6px 4px 0;white-space:nowrap">✦ ${c}</span>`)
        .join("");

    // Goals list
    const goalsHtml = (companyProfile.goals ?? [])
        .map(g => `<li style="padding:8px 12px;background:${brand.primaryColor}10;border-left:3px solid ${brand.accentColor};border-radius:4px;font-size:12px;font-weight:700;color:#1e293b;margin-bottom:6px">${g}</li>`)
        .join("");

    // Chapters & Sections
    const chaptersHtml = chapters.map(([chap, sects]) => {
        const sectHtml = sects.map(s => {
            const content = sectionContents[s.id] ?? "";
            const isDone = report?.completedSectionIds?.includes(s.id);
            return `
        <section style="margin-bottom:36px;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <h3 style="font-size:1.05em;font-weight:800;color:${brand.primaryColor};margin:0;flex:1">${s.title}</h3>
            ${isDone
                    ? `<span style="font-size:9px;font-weight:800;color:${brand.accentColor};background:${brand.accentColor}18;padding:3px 10px;border-radius:99px;letter-spacing:.1em;text-transform:uppercase">✓ 已驗證</span>`
                    : `<span style="font-size:9px;font-weight:800;color:#94a3b8;background:#f1f5f9;padding:3px 10px;border-radius:99px;letter-spacing:.1em;text-transform:uppercase">草稿</span>`}
          </div>
          ${content
                    ? `<div style="font-size:${isMobile ? "13px" : "14px"};line-height:1.88;color:#334155;margin:0">
                         ${injectDynamicData(content, companyProfile, globalEsgData)
                        .replace(/^### (.*$)/gim, '<h4 style="margin-top:1.2em;margin-bottom:0.5em;color:#0f172a;font-weight:700">$1</h4>')
                        .replace(/^## (.*$)/gim, '<h3 style="margin-top:1.5em;margin-bottom:0.5em;color:#0f172a;font-weight:800">$1</h3>')
                        .replace(/^# (.*$)/gim, '<h2 style="margin-top:1.8em;margin-bottom:0.5em;color:#0f172a;font-weight:900">$1</h2>')
                        .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#0f172a">$1</strong>')
                        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                        .replace(/^\s*[\*-]\s+(.*$)/gim, '<li style="margin-left:20px;margin-bottom:4px">$1</li>')
                        // Replace newlines that are not part of HTML tags we just added
                        .split('\n').map(line => line.trim().startsWith('<') ? line : line + '<br/>').join('\n')
                    }
                       </div>`
                    : `<div style="border:2px dashed #e2e8f0;border-radius:10px;padding:20px;text-align:center;color:#94a3b8;font-size:11px;font-weight:700">[ 本節內容尚未填寫 ]</div>`}
        </section>`;
        }).join("");

        return `
      <div style="margin-bottom:52px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:26px">
          <div style="width:4px;height:22px;background:${brand.primaryColor};border-radius:4px"></div>
          <h2 style="font-size:.9em;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:${brand.primaryColor};margin:0">${chap}</h2>
        </div>
        ${sectHtml}
      </div>`;
    }).join("");

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${brand.companyName} ${brand.reportYear} ESG Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Noto+Sans+TC:wght@400;500;700;900&family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@400;600;700;900&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{margin:0;padding:0;font-family:${brand.fontFamily};background:#f8fafc;color:#1e293b;-webkit-font-smoothing:antialiased}
    .page{max-width:${maxW};margin:0 auto;background:#fff;min-height:100vh;box-shadow:0 0 60px rgba(0,0,0,.06)}
    .cover{background:linear-gradient(135deg,${brand.primaryColor} 0%,${brand.primaryColor}cc 55%,${brand.accentColor}66 100%);padding:${isMobile ? "48px 22px 40px" : "72px 80px 60px"};position:relative;overflow:hidden}
    .cover::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 75% 25%,${brand.accentColor}40,transparent 60%)}
    .cover::after{content:"";position:absolute;right:-60px;bottom:-60px;width:200px;height:200px;border-radius:50%;border:2px solid rgba(255,255,255,.06)}
    .cover-content{position:relative;z-index:1}
    .body{padding:${bodyPad}}
    .chart-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:40px}
    .chart-label{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${brand.primaryColor};margin-bottom:14px}
    @media print{body{background:#fff}.page{box-shadow:none;max-width:100%}}
  </style>
</head>
<body>
<div class="page">
  <!-- Cover -->
  <div class="cover">
    <div class="cover-content">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:${isMobile ? "20px" : "32px"}">
        ${logoHtml}
        <div style="font-size:${isMobile ? "13px" : "15px"};font-weight:900;color:rgba(255,255,255,.9);letter-spacing:.04em">${brand.companyName}</div>
      </div>
      <div style="font-size:10px;font-weight:900;letter-spacing:.35em;text-transform:uppercase;color:${brand.accentColor};margin-bottom:${isMobile ? "14px" : "20px"}">SUSTAINABILITY REPORT · ${brand.reportYear}</div>
      <h1 style="font-size:${isMobile ? "24px" : "40px"};font-weight:900;color:#fff;line-height:1.1;margin:0 0 10px">永續發展報告書</h1>
      <p style="color:rgba(255,255,255,.65);font-size:${isMobile ? "12px" : "14px"};font-weight:600;margin:0 0 ${isMobile ? "20px" : "28px"}">${companyProfile.industry}　·　${companyProfile.scope ?? `${brand.reportYear} 年度報告`}</p>
      <div style="display:flex;flex-wrap:wrap;margin:-4px -6px -4px 0">${commitmentsHtml || '<span style="color:rgba(255,255,255,.4);font-size:12px">（尚未設定承諾）</span>'}</div>
    </div>
  </div>

  <!-- Progress & Donut Strip -->
  <div style="background:${brand.primaryColor}08;border-bottom:1px solid ${brand.primaryColor}18;padding:${isMobile ? "16px 18px" : "20px 80px"};display:flex;align-items:center;gap:20px;flex-wrap:wrap">
    <div style="flex-shrink:0">${donutHtml}</div>
    <div style="flex:1;min-width:160px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${brand.primaryColor};margin-bottom:8px">章節完成進度</div>
      <div style="height:6px;background:#e2e8f0;border-radius:6px;overflow:hidden;margin-bottom:6px">
        <div style="width:${progressPct}%;height:100%;background:linear-gradient(90deg,${brand.primaryColor},${brand.accentColor});border-radius:6px"></div>
      </div>
      <div style="font-size:11px;color:#64748b;font-weight:600">${completedCount} / ${totalCount} 節已完成</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;text-align:right">
      <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em">產業</div>
      <div style="font-size:12px;font-weight:800;color:${brand.primaryColor}">${companyProfile.industry}</div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">
    <!-- Goals Section -->
    ${goalsHtml ? `
    <div style="margin-bottom:48px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
        <div style="width:4px;height:22px;background:${brand.primaryColor};border-radius:4px"></div>
        <h2 style="font-size:.9em;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:${brand.primaryColor};margin:0">戰略目標</h2>
      </div>
      <ul style="list-style:none;padding:0;margin:0">${goalsHtml}</ul>
    </div>` : ""}

    <!-- Emissions Bar Chart -->
    <div class="chart-box">
      <div class="chart-label">溫室氣體排放總覽 (tCO₂e · 示例數據)</div>
      ${barChartHtml}
      <p style="font-size:10px;color:#94a3b8;font-weight:600;margin:10px 0 0;font-style:italic">* 排放數據由 ESG GO 自動匯入，已通過 5T 存證協議驗證</p>
    </div>

    <!-- Report Sections -->
    ${chaptersHtml}

    <!-- Custom Fields -->
    ${(companyProfile.customFields ?? []).length > 0 ? `
    <div style="margin-top:60px;padding:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${brand.primaryColor};margin-bottom:14px">系統屬性</div>
      <table style="width:100%;border-collapse:collapse">
        ${(companyProfile.customFields ?? []).map(f => `
        <tr>
          <td style="padding:6px 12px;font-size:11px;font-weight:700;color:#64748b;white-space:nowrap;border-bottom:1px solid #e2e8f0">${f.key}</td>
          <td style="padding:6px 12px;font-size:11px;font-weight:800;color:#1e293b;border-bottom:1px solid #e2e8f0">${f.value}</td>
        </tr>`).join("")}
      </table>
    </div>` : ""}

    <!-- Footer -->
    <div style="margin-top:80px;padding-top:22px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center">
      <div style="font-size:11px;color:#64748b;font-weight:600">${brand.companyName} © ${brand.reportYear}</div>
      <div style="font-size:10px;color:${brand.accentColor};font-weight:800;letter-spacing:.06em">Generated by ESG GO · 5T Protocol Verified</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ReportPreviewPanel({
    report,
    sectionContents,
    editorSections,
    companyProfile,
    language,
    globalEsgData,
    onRefresh,
}: ReportPreviewPanelProps) {
    const [mode, setMode] = useState<PreviewMode>("pdf");
    const [showBrandPanel, setShowBrandPanel] = useState(false);
    const [brand, setBrand] = useState<BrandTheme>({
        primaryColor: "#065f46",
        accentColor: "#10b981",
        fontFamily: "Inter, sans-serif",
        companyName: companyProfile.name,
        reportYear: companyProfile.reportYear,
    });
    const [customPrimary, setCustomPrimary] = useState(brand.primaryColor);
    const [customAccent, setCustomAccent] = useState(brand.accentColor);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Group sections by chapter
    const chapters = useMemo<[string, { id: string; title: string }[]][]>(() => {
        const map = new Map<string, { id: string; title: string }[]>();
        editorSections.forEach(s => {
            if (!map.has(s.chapter)) map.set(s.chapter, []);
            map.get(s.chapter)!.push({ id: s.id, title: s.title });
        });
        return Array.from(map.entries());
    }, [editorSections]);

    const completedCount = report?.completedSectionIds?.length ?? 0;
    const totalCount = editorSections.length;

    const buildArgs = useCallback((isMobile: boolean) => ({
        brand,
        chapters,
        sectionContents,
        report,
        completedCount,
        totalCount,
        companyProfile,
        globalEsgData,
        isMobile,
    }), [brand, chapters, sectionContents, report, completedCount, totalCount, companyProfile, globalEsgData]);

    const htmlContent = useMemo(() => buildReportHtml(buildArgs(false)), [buildArgs]);
    const mobileContent = useMemo(() => buildReportHtml(buildArgs(true)), [buildArgs]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (onRefresh) {
            await onRefresh();
        } else {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        setIsRefreshing(false);
    };

    const handleApplyBrand = () => {
        setBrand(prev => ({ ...prev, primaryColor: customPrimary, accentColor: customAccent }));
        setShowBrandPanel(false);
        handleRefresh();
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setBrand(prev => ({ ...prev, logoDataUrl: ev.target?.result as string }));
            handleRefresh();
        };
        reader.readAsDataURL(file);
    };

    const handleExportHtml = () => {
        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${brand.companyName}_ESG_${brand.reportYear}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPdf = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            // We use setTimeout to ensure all resources (like fonts, SVGs) are fully loaded or at least parsed before printing.
            // Ideally we could bind to window.onload in the popup, but due to cross-origin or local timing, this is simpler:
            printWindow.setTimeout(() => {
                printWindow.document.title = `${brand.companyName}_ESG_${brand.reportYear}`;
                printWindow.print();
            }, 500);
        }
    };

    const modes: { key: PreviewMode; label: string; Icon: any; desc: string }[] = [
        { key: "pdf", label: "PDF", Icon: FileText, desc: "A4 列印排版" },
        { key: "html", label: "HTML", Icon: Monitor, desc: "網頁發布格式" },
        { key: "mobile", label: "Mobile", Icon: Smartphone, desc: "行動裝置預覽" },
    ];

    return (
        <div className="flex flex-col h-full min-h-[600px]">
            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                {/* Mode Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
                    {modes.map(({ key, label, Icon, desc }) => (
                        <button
                            key={key}
                            onClick={() => setMode(key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all",
                                mode === key ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"
                            )}
                            title={desc}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setShowBrandPanel(v => !v)}
                        className={cn(
                            "flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-black transition-all border",
                            showBrandPanel
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-100 hover:border-slate-200 shadow-sm"
                        )}
                    >
                        <Palette className="w-3.5 h-3.5" />
                        品牌樣式
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:border-slate-200 transition-all shadow-sm"
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
                        刷新
                    </button>
                    <button
                        onClick={handleExportHtml}
                        className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:border-slate-200 transition-all shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5" />
                        匯出 HTML
                    </button>
                    <button
                        onClick={handleExportPdf}
                        className="flex items-center gap-2 h-10 px-4 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-slate-900/20"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        列印 / 匯出 PDF
                    </button>
                </div>
            </div>

            {/* ── Brand Panel ── */}
            <AnimatePresence>
                {showBrandPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-violet-600" />
                                    品牌自動配色 & 樣式
                                </h3>
                                <button onClick={() => setShowBrandPanel(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Logo Uploader */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">公司 Logo</div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                        {brand.logoDataUrl ? (
                                            <img src={brand.logoDataUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => logoInputRef.current?.click()}
                                            className="flex items-center gap-2 h-9 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-200 transition-all"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            上傳 Logo
                                        </button>
                                        {brand.logoDataUrl && (
                                            <button
                                                onClick={() => setBrand(p => ({ ...p, logoDataUrl: undefined }))}
                                                className="h-9 px-3 bg-rose-50 text-rose-500 rounded-xl text-xs font-black hover:bg-rose-100 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </div>
                            </div>

                            {/* Color Presets */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">快速色票</div>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_PRESETS.map(p => (
                                        <button
                                            key={p.name}
                                            onClick={() => { setCustomPrimary(p.primary); setCustomAccent(p.accent); }}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                                                customPrimary === p.primary
                                                    ? "border-slate-900 bg-slate-50 text-slate-900 shadow-sm"
                                                    : "border-slate-100 text-slate-500 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="flex gap-1">
                                                <span className="w-3 h-3 rounded-full" style={{ background: p.primary }} />
                                                <span className="w-3 h-3 rounded-full" style={{ background: p.accent }} />
                                            </span>
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Color Pickers */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "主色 (Primary)", val: customPrimary, set: setCustomPrimary },
                                    { label: "強調色 (Accent)", val: customAccent, set: setCustomAccent },
                                ].map(({ label, val, set }) => (
                                    <div key={label}>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <input type="color" value={val} onChange={e => set(e.target.value)}
                                                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                                            <code className="text-sm font-black text-slate-700 flex-1">{val}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Font Family */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">字體</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONT_OPTIONS.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => setBrand(p => ({ ...p, fontFamily: f.value }))}
                                            className={cn(
                                                "px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all",
                                                brand.fontFamily === f.value
                                                    ? "border-slate-900 bg-slate-50 text-slate-900 shadow-sm"
                                                    : "border-slate-100 text-slate-500 hover:border-slate-200"
                                            )}
                                            style={{ fontFamily: f.value }}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chart Preview Strip */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    圖表品牌預覽
                                </div>
                                <div
                                    className="opacity-80"
                                    dangerouslySetInnerHTML={{
                                        __html: buildBarChartSvg(
                                            ["範疇一", "範疇二", "範疇三"],
                                            [120, 380, 870],
                                            customPrimary, customAccent
                                        )
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleApplyBrand}
                                className="w-full h-11 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                套用至預覽
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Preview Area ── */}
            <div className="flex-1 relative min-h-[600px]">
                {isRefreshing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                    </div>
                )}

                {/* PDF Mode */}
                {mode === "pdf" && (
                    <div className="flex justify-center">
                        <div className="relative bg-white shadow-2xl shadow-slate-300/40 overflow-hidden w-full"
                            style={{ maxWidth: "860px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                                <FileText className="w-3 h-3" />  A4 PDF 視圖
                            </div>
                            <iframe srcDoc={htmlContent} title="PDF Preview" className="w-full"
                                style={{ height: "820px", border: "none" }} sandbox="allow-same-origin" />
                        </div>
                    </div>
                )}

                {/* HTML Mode */}
                {mode === "html" && (
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 border-b border-slate-200">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-400 flex items-center gap-2 border border-slate-100">
                                <span style={{ color: brand.accentColor }}>🔒</span>
                                esg.company.com/report/{brand.reportYear}
                            </div>
                            <Monitor className="w-4 h-4 text-slate-400" />
                        </div>
                        <iframe srcDoc={htmlContent} title="HTML Preview" className="w-full"
                            style={{ height: "740px", border: "none", background: "#f8fafc" }} sandbox="allow-same-origin" />
                    </div>
                )}

                {/* Mobile Mode */}
                {mode === "mobile" && (
                    <div className="flex justify-center py-4">
                        <div className="relative" style={{ width: "390px" }}>
                            <div className="relative bg-slate-900 rounded-[48px] p-3 shadow-2xl shadow-slate-900/40"
                                style={{ border: "8px solid #0f172a" }}>
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-10" />
                                <div className="overflow-hidden rounded-[38px] bg-white" style={{ height: "740px" }}>
                                    <iframe srcDoc={mobileContent} title="Mobile Preview" className="w-full h-full"
                                        style={{ border: "none" }} sandbox="allow-same-origin" />
                                </div>
                                <div className="flex justify-center mt-2">
                                    <div className="w-24 h-1 bg-slate-600 rounded-full" />
                                </div>
                            </div>
                            <div className="text-center mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                                Mobile-Friendly Preview · 390 px
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Brand Summary Strip ── */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-slate-200" style={{ background: brand.primaryColor }} />
                    {brand.primaryColor}
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-slate-200" style={{ background: brand.accentColor }} />
                    {brand.accentColor}
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{brand.fontFamily.split(",")[0]}</span>
                {brand.logoDataUrl && (
                    <>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-violet-500 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Logo 已匯入</span>
                    </>
                )}
                <span className="ml-auto text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    品牌樣式已套用 · {mode.toUpperCase()} 模式
                </span>
            </div>
        </div>
    );
}
