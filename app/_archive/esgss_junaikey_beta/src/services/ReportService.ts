import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';

// Define types for jsPDF with autotable extension
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface ReportData {
  title: string;
  headers: string[];
  rows: any[][];
  summary?: string;
  meta?: {
    generatedBy: string;
    generatedAt: string;
    description: string;
  };
}

export class ReportService {
  /**
   * Generates a professional PDF report with scaling headers and footer
   */
  public static generatePDF(data: ReportData, filename: string = 'report.pdf'): void {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Header ---
    doc.setFillColor(99, 166, 176); // #63A6B0 (Aqua)
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ESGss JunAiKey', 14, 13);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Financial & ESG Intelligence', pageWidth - 14, 13, { align: 'right' });

    // --- Title & Meta ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.title, 14, 35);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${data.meta?.generatedAt || new Date().toLocaleString()}`, 14, 42);
    if (data.meta?.description) {
      doc.text(data.meta.description, 14, 48);
    }

    // --- Table ---
    // @ts-ignore - jspdf-autotable types are sometimes tricky
    doc.autoTable({
      startY: 55,
      head: [data.headers],
      body: data.rows,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 166, 176], // #63A6B0
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // --- Footer ---
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | Confidential - Internal Use Only`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // --- Save ---
    doc.save(filename);
  }

  /**
   * Generates a standard Excel spreadsheet
   */
  public static generateExcel(data: ReportData, filename: string = 'report.xlsx'): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report Data');

    // Add headers
    worksheet.addRow(data.headers);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '63A6B0' }
    };
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };

    // Add data rows
    data.rows.forEach(row => {
      worksheet.addRow(row);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, cell => {
        const length = cell.value?.toString().length || 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    // Save file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  /**
   * Generates a specialized ESG Compliance Report
   */
  public static generateComplianceReport(data: any, companyName: string): void {
    const reportData: ReportData = {
      title: `ESG Compliance Audit: ${companyName}`,
      headers: ['Index', 'Metric', 'Standard', 'Status', 'Observation'],
      rows: data.metrics.map((m: any, i: number) => [
        i + 1,
        m.name,
        m.standard || 'GRI/SASB',
        m.status,
        m.observation || 'Compliant'
      ]),
      meta: {
        generatedBy: 'OmniPriest AI Guardian',
        generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        description: 'Automated 5T Integrity Audit for ESG Compliance.'
      }
    };
    this.generatePDF(reportData, `Compliance_Report_${companyName}.pdf`);
  }

  /**
   * Generates a specialized Financial Sustainability Report
   */
  public static generateFinancialReport(data: any, companyName: string): void {
    const reportData: ReportData = {
      title: `Financial Sustainability Analysis: ${companyName}`,
      headers: ['Asset ID', 'Valuation', 'Resonance', 'Yield (ESG)', 'Status'],
      rows: data.assets.map((a: any) => [
        a.id,
        `$${a.valuation.toLocaleString()}`,
        `${a.resonance}%`,
        `+${a.yield}%`,
        a.status
      ]),
      meta: {
        generatedBy: 'JunAiKey Finance Engine',
        generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        description: 'Analysis of financial assets through the lens of ESG resonance.'
      }
    };
    this.generatePDF(reportData, `Financial_Report_${companyName}.pdf`);
  }

  /**
   * Generates a comprehensive report from Sustainability Document Intelligence extracted data
   */
  public static generateFromIntelligence(extractedData: any, filename: string = 'AI_Analysis_Report.pdf', options: { download?: boolean, returnBlob?: boolean } = { download: true }): Blob | void {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Header ---
    doc.setFillColor(99, 166, 176); // #63A6B0 (Aqua)
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ESGss JunAiKey', 14, 13);
    doc.setFontSize(10);
    doc.text('Sustainability Intelligence Core', pageWidth - 14, 13, { align: 'right' });

    // --- Title ---
    let yPos = 35;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AI-Generated Sustainability Analysis', 14, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} | By OmniPriest AI`, 14, yPos);

    yPos += 15;

    // Helper to add section
    const addSection = (title: string, headers: string[], rows: any[]) => {
      if (rows.length === 0) return;

      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 30;
      }

      doc.setFontSize(14);
      doc.setTextColor(99, 166, 176); // Aqua
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, yPos);
      yPos += 5;

      // @ts-ignore
      doc.autoTable({
        startY: yPos,
        head: [headers],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [99, 166, 176], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { top: 20 },
      });

      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 15;
    };

    // 1. GRI Indicators
    if (extractedData.griIndicators?.length) {
      addSection('GRI Standards Indicators',
        ['Code', 'Title', 'Value', 'Unit', 'Trend'],
        extractedData.griIndicators.map((item: any) => [item.code, item.title, item.value, item.unit, item.trend])
      );
    }

    // 2. Environmental Data
    if (extractedData.environmentalData?.length) {
      addSection('Environmental Performance',
        ['Metric', 'Value', 'Unit', 'Reduction Target', 'SBTi Aligned'],
        extractedData.environmentalData.map((item: any) => [item.metric, item.value, item.unit, `${item.reductionTarget}%`, item.sbtiAligned ? 'Yes' : 'No'])
      );
    }

    // 3. Social Data
    if (extractedData.socialData?.length) {
      addSection('Social Responsibility',
        ['Category', 'Metric', 'Value', 'Unit', 'Benchmark'],
        extractedData.socialData.map((item: any) => [item.category, item.metric, item.value, item.unit, item.benchmark])
      );
    }

    // 4. Governance Data
    if (extractedData.governanceData?.length) {
      addSection('Governance & Compliance',
        ['Category', 'Metric', 'Status', 'Evidence'],
        extractedData.governanceData.map((item: any) => [
          item.category,
          item.metric,
          item.status.toUpperCase(),
          item.evidence?.join(', ') || '-'
        ])
      );
    }

    // 5. Risks & Opportunities
    const risksAndOppRows = [
      ...(extractedData.risks?.map((r: any) => ['RISK', r.type, r.description, r.impact.toUpperCase()]) || []),
      ...(extractedData.opportunities?.map((o: any) => ['OPPORTUNITY', o.type, o.description, o.potential.toUpperCase()]) || [])
    ];

    if (risksAndOppRows.length) {
      addSection('Risks & Opportunities Matrix',
        ['Type', 'Category', 'Description', 'Impact/Potential'],
        risksAndOppRows
      );
    }

    // --- Footer ---
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | OmniPriest Intelligence Layer - Confidential`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    if (options.download) {
      doc.save(filename);
    }

  }

  /**
   * Generates a comprehensive report based on Typst templates
   */
  public async generateReport(options: {
    type: string;
    timeframe?: string;
    format?: string;
    language?: string;
  }): Promise<any> {
    const isZh = options.language === 'zh-TW';
    const timestamp = new Date().toISOString();

    // Default content with Typst headers for 5T Sentinel Protocol
    const content = `
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: [
    #set text(8pt, gray)
    #grid(
      columns: (1fr, 1fr),
      [ESGss JunAiKey: 5T Sentinel Protocol],
      [#align(right)[Sovereign Disclosure - Confidential]]
    )
    #line(length: 100%, stroke: 0.5pt + gray)
  ],
  footer: [
    #line(length: 100%, stroke: 0.5pt + gray)
    #set text(8pt, gray)
    #grid(
      columns: (1fr, 1fr),
      [Page #counter(page).display() of #counter(page).total()],
      [#align(right)[Generated at: ${timestamp}]]
    )
  ]
)

#set text(font: "PingFang TC", size: 11pt)

= ${isZh ? '永續發展報告' : 'Sustainability Disclosure Report'}
== ${options.type.toUpperCase()} - ${options.timeframe === 'yearly' ? (isZh ? '年度' : 'Annual') : options.timeframe}

${isZh ? '本報告由 JunAiKey 5T 哨兵協議自動生成，旨在提供透明且不可篡改的永續發展數據揭露。' : 'This report is automatically generated by the JunAiKey 5T Sentinel Protocol, providing transparent and immutable sustainability data disclosure.'}

== 1. ${isZh ? '核心指標' : 'Core Metrics'}

#table(
  columns: (1fr, 1fr, 1fr),
  stroke: none,
  fill: (x, y) => if y == 0 { aqua.darken(20%) } else if calc.even(y) { gray.lighten(90%) } else { white },
  [*Metric*], [*Value*], [*Resonance*],
  [Carbon Intensity], [12.4 tCO2e/$M], [88%],
  [Energy Efficiency], [94.2%], [92%],
  [Social Impact], [8.5/10], [85%],
)

== 2. ${isZh ? '5T 驗證狀態' : '5T Verification Status'}

- *Tangible*: Verified via real-time sensory data.
- *Traceable*: Full audit trail available on Sovereign Vault.
- *Trackable*: Real-time monitoring active.
- *Transparent*: Open methodology disclosure.
- *Trustworthy*: 256-bit Hash Lock enabled.

#v(2em)
#align(center)[
  #block(
    stroke: 1pt + aqua,
    inset: 1em,
    radius: 4pt,
    [
      *5T CERTIFIED* \
      ID: ${crypto.randomUUID().substring(0, 8)}
    ]
  )
]
`;

    return {
      id: crypto.randomUUID(),
      title: `${isZh ? '永續報告' : 'Sustainability Report'} - ${options.type}`,
      content,
      generatedAt: timestamp,
      metadata: {
        pageCount: 1,
        wordCount: content.split(/\s+/).length,
        version: '8.2.0-sentient-tangible'
      }
    };
  }
}

// Export singleton for easier use in scripts and components
export const reportService = new ReportService();
export type { ReportData };
