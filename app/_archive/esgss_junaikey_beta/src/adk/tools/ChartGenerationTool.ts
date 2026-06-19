/**
 * Google ADK Tool: Chart Generation Tool
 * ========================================
 * 自動生成圖表並嵌入到報告中
 * 支援趨勢圖、對比圖、分布圖等
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'radar' | 'heatmap';
  title: string;
  data: any;
  caption?: string;
}

export interface GeneratedChart {
  svgContent: string;
  filepath: string;
  embedCode: string;
}

export class ChartGenerationTool {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'reports', 'adk-generated', 'charts');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 生成趨勢線圖
   */
  generateTrendChart(config: {
    title: string;
    years: number[];
    values: number[];
    label: string;
    target?: number;
  }): GeneratedChart {
    const { title, years, values, label, target } = config;

    const width = 600;
    const height = 400;
    const padding = { top: 60, right: 80, bottom: 60, left: 80 };

    const maxValue = Math.max(...values, target || 0) * 1.1;
    const minValue = Math.min(...values) * 0.9;

    const xScale = (width - padding.left - padding.right) / (years.length - 1);
    const yScale = (height - padding.top - padding.bottom) / (maxValue - minValue);

    // 生成路徑點
    const points = years.map((year, i) => {
      const x = padding.left + i * xScale;
      const y = height - padding.bottom - (values[i] - minValue) * yScale;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;

    // 生成 SVG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="${width}" height="${height}" fill="#f8f9fa" rx="8"/>
  
  <!-- 標題 -->
  <text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e293b">
    ${title}
  </text>
  
  <!-- Y軸網格線 -->
  ${[0, 0.25, 0.5, 0.75, 1]
    .map(ratio => {
      const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
      const value = (minValue + ratio * (maxValue - minValue)).toFixed(0);
      return `
  <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
        stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="${padding.left - 10}" y="${y + 5}" text-anchor="end" font-size="12" fill="#64748b">
    ${value}
  </text>`;
    })
    .join('')}
  
  <!-- X軸標籤 -->
  ${years
    .map((year, i) => {
      const x = padding.left + i * xScale;
      return `
  <text x="${x}" y="${height - padding.bottom + 25}" text-anchor="middle" font-size="12" fill="#64748b">
    ${year}
  </text>`;
    })
    .join('')}
  
  <!-- 趨勢線 -->
  <path d="${pathD}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  
  <!-- 數據點 -->
  ${years
    .map((year, i) => {
      const x = padding.left + i * xScale;
      const y = height - padding.bottom - (values[i] - minValue) * yScale;
      return `
  <circle cx="${x}" cy="${y}" r="5" fill="#3b82f6"/>
  <circle cx="${x}" cy="${y}" r="8" fill="#3b82f6" opacity="0.2"/>
  <text x="${x}" y="${y - 15}" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">
    ${values[i]}
  </text>`;
    })
    .join('')}
  
  ${
    target
      ? `
  <!-- 目標線 -->
  ${(() => {
    const targetY = height - padding.bottom - (target - minValue) * yScale;
    return `
  <line x1="${padding.left}" y1="${targetY}" x2="${width - padding.right}" y2="${targetY}" 
        stroke="#ef4444" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${width - padding.right + 10}" y="${targetY + 5}" font-size="12" fill="#ef4444">
    目標: ${target}
  </text>`;
  })()}
  `
      : ''
  }
  
  <!-- 圖例 -->
  <g transform="translate(${padding.left}, ${height - 25})">
    <rect x="0" y="0" width="15" height="3" fill="#3b82f6"/>
    <text x="20" y="5" font-size="11" fill="#64748b">${label}</text>
    ${
      target
        ? `
    <line x1="100" y1="1.5" x2="115" y2="1.5" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="120" y="5" font-size="11" fill="#64748b">目標值</text>
    `
        : ''
    }
  </g>
</svg>`;

    return this.saveSVG(svg, `trend_${this.sanitizeFilename(title)}`);
  }

  /**
   * 生成對比條形圖
   */
  generateComparisonChart(config: {
    title: string;
    companies: string[];
    scores: number[];
    metric: string;
  }): GeneratedChart {
    const { title, companies, scores, metric } = config;

    const width = 600;
    const height = 400;
    const padding = { top: 60, right: 40, bottom: 80, left: 100 };

    const maxScore = Math.max(...scores) * 1.1;
    const barHeight = 40;
    const barSpacing = 20;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f8f9fa" rx="8"/>
  
  <!-- 標題 -->
  <text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e293b">
    ${title}
  </text>
  
  <!-- 條形圖 -->
  ${companies
    .map((company, i) => {
      const barWidth = (scores[i] / maxScore) * (width - padding.left - padding.right);
      const y = padding.top + i * (barHeight + barSpacing);
      const color = i === companies.length - 1 ? '#8b5cf6' : '#60a5fa'; // 最後一個（我們公司）用紫色

      return `
  <!-- 公司名稱 -->
  <text x="${padding.left - 10}" y="${y + barHeight / 2 + 5}" text-anchor="end" font-size="14" fill="#1e293b">
    ${company}
  </text>
  
  <!-- 條形 -->
  <rect x="${padding.left}" y="${y}" width="${barWidth}" height="${barHeight}" 
        fill="${color}" rx="4"/>
  
  <!-- 分數 -->
  <text x="${padding.left + barWidth + 10}" y="${y + barHeight / 2 + 5}" font-size="14" font-weight="bold" fill="#1e293b">
    ${scores[i]}
  </text>`;
    })
    .join('')}
  
  <!-- X軸與單位 -->
  <text x="${width / 2}" y="${height - 20}" text-anchor="middle" font-size="12" fill="#64748b">
    ${metric}
  </text>
</svg>`;

    return this.saveSVG(svg, `comparison_${this.sanitizeFilename(title)}`);
  }

  /**
   * 生成圓餅圖
   */
  generatePieChart(config: {
    title: string;
    data: { label: string; value: number }[];
  }): GeneratedChart {
    const { title, data } = config;

    const width = 600;
    const height = 400;
    const centerX = width / 2 - 100;
    const centerY = height / 2 + 20;
    const radius = 120;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

    let currentAngle = -90; // Start at top

    const slices = data.map((item, i) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathD = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const labelAngle = (startAngle + endAngle) / 2;
      const labelRad = (labelAngle * Math.PI) / 180;
      const labelX = centerX + (radius + 40) * Math.cos(labelRad);
      const labelY = centerY + (radius + 40) * Math.sin(labelRad);

      return {
        pathD,
        color: colors[i % colors.length],
        label: item.label,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
        labelX,
        labelY,
      };
    });

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f8f9fa" rx="8"/>
  
  <!-- 標題 -->
  <text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e293b">
    ${title}
  </text>
  
  <!-- 圓餅切片 -->
  ${slices
    .map(
      slice => `
  <path d="${slice.pathD}" fill="${slice.color}" stroke="#fff" stroke-width="2"/>
  <text x="${slice.labelX}" y="${slice.labelY}" text-anchor="middle" font-size="11" fill="#1e293b">
    ${slice.percentage}%
  </text>
  `
    )
    .join('')}
  
  <!-- 圖例 -->
  <g transform="translate(${width - 180}, 80)">
    ${data
      .map(
        (item, i) => `
    <rect x="0" y="${i * 30}" width="15" height="15" fill="${colors[i % colors.length]}" rx="2"/>
    <text x="20" y="${i * 30 + 12}" font-size="12" fill="#1e293b">${item.label}</text>
    <text x="20" y="${i * 30 + 24}" font-size="10" fill="#64748b">${item.value}</text>
    `
      )
      .join('')}
  </g>
</svg>`;

    return this.saveSVG(svg, `pie_${this.sanitizeFilename(title)}`);
  }

  /**
   * 保存 SVG 文件
   */
  private saveSVG(svgContent: string, basename: string): GeneratedChart {
    const filename = `${basename}.svg`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, svgContent, 'utf-8');

    const embedCode = `![${basename}](${filepath.replace(/\\/g, '/')})`;

    return {
      svgContent,
      filepath,
      embedCode,
    };
  }

  /**
   * 清理文件名
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  /**
   * 生成儀表板圖
   */
  generateDashboardChart(config: {
    title: string;
    score: number;
    maxScore: number;
  }): GeneratedChart {
    const { title, score, maxScore } = config;
    const percentage = (score / maxScore) * 100;

    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2 + 20;
    const radius = 100;

    const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees
    const rad = (angle * Math.PI) / 180;
    const needleX = centerX + radius * 0.8 * Math.cos(rad);
    const needleY = centerY + radius * 0.8 * Math.sin(rad);

    // Color based on score
    const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f8f9fa" rx="8"/>
  
  <!-- 標題 -->
  <text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e293b">
    ${title}
  </text>
  
  <!-- 半圓背景 -->
  <path d="M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}" 
        fill="none" stroke="#e2e8f0" stroke-width="20" stroke-linecap="round"/>
  
  <!-- 分數弧 -->
  <path d="M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${needleX} ${needleY}" 
        fill="none" stroke="${color}" stroke-width="20" stroke-linecap="round"/>
  
  <!-- 中心圓 -->
  <circle cx="${centerX}" cy="${centerY}" r="10" fill="#1e293b"/>
  
  <!-- 指針 -->
  <line x1="${centerX}" y1="${centerY}" x2="${needleX}" y2="${needleY}" 
        stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  
  <!-- 分數顯示 -->
  <text x="${centerX}" y="${centerY + 50}" text-anchor="middle" font-size="36" font-weight="bold" fill="${color}">
    ${score}
  </text>
  <text x="${centerX}" y="${centerY + 75}" text-anchor="middle" font-size="14" fill="#64748b">
    / ${maxScore}
  </text>
  
  <!-- 刻度標籤 -->
  <text x="${centerX - radius - 20}" y="${centerY + 5}" font-size="12" fill="#64748b">0</text>
  <text x="${centerX}" y="${centerY - radius - 10}" text-anchor="middle" font-size="12" fill="#64748b">${maxScore / 2}</text>
  <text x="${centerX + radius + 20}" y="${centerY + 5}" text-anchor="end" font-size="12" fill="#64748b">${maxScore}</text>
</svg>`;

    return this.saveSVG(svg, `dashboard_${this.sanitizeFilename(title)}`);
  }
}

// 導出單例
export const chartGenerationTool = new ChartGenerationTool();
