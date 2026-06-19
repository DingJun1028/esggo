/**
 * 📝 TypstGenerator - Professional ESG Document Typesetting
 * 
 * Responsibility: Converting structured ESG data and dialogue transcripts into Typst DSL.
 * Follows 5T Protocol: Transparent (Explicit formulas) & Tasteful (Premium layout).
 */

export interface ITypstDraftData {
    title: string;
    author: string;
    transcript: Array<{ role: string; content: string }>;
    summary: string[];
    metrics: Array<{ name: string; value: string; unit: string; confidence: number }>;
}

export class TypstGenerator {
    /**
     * Returns the transparency formula for a given metric (5T: Transparent).
     */
    public static getFormulaByMetric(metric: string): string {
        const formulas: Record<string, string> = {
            '電力消耗': '$E = AD \times EF_{grid}$',
            '碳排放': '$GHG = \sum (Activity \times Factor)$',
            '水資源': '$W = \sum (Consumption - Recycle)$'
        };
        return formulas[metric] || '$Value = \text{Extracted Data}$';
    }

    /**
     * Generates a complete Typst file content based on the provided ESG draft data.
     */
    public static generate(data: ITypstDraftData): string {
        const header = this.generateHeader(data);
        const transcriptSection = this.generateTranscript(data.transcript);
        const summarySection = this.generateSummary(data.summary);
        const metricsSection = this.generateMetrics(data.metrics);

        return `${header}\n${summarySection}\n${metricsSection}\n${transcriptSection}`;
    }

    private static generateHeader(data: ITypstDraftData): string {
        return `
#set page(paper: "a4", margin: 2cm)
#set text(font: "PingFang TC", size: 10pt)

#align(center)[
  #text(size: 24pt, weight: "bold", fill: rgb("#63a6b0"))[${data.title}]
]

#grid(
  columns: (1fr, 1fr),
  column-gap: 1cm,
  [ *Author:* ${data.author} ],
  [ *Date:* #datetime.today().display() ]
)

#line(length: 100%, stroke: 0.5pt + rgb("#63a6b0"))
`;
    }

    private static generateSummary(summary: string[]): string {
        return `
== 永續精靈焦點摘要 (Sprite Insights)

${summary.map(s => `- ${s}`).join('\n')}
`;
    }

    private static generateMetrics(metrics: ITypstDraftData['metrics']): string {
        const rows = metrics.map(m => `  [${m.name}], [${m.value} ${m.unit}], [${(m.confidence * 100).toFixed(0)}%],`).join('\n');

        return `
== 5T 數據指標 (Verified Metrics)

#table(
  columns: (1fr, 100pt, 60pt),
  inset: 10pt,
  align: horizon,
  fill: (x, y) => if y == 0 { rgb("#63a6b0").lighten(80%) },
  [*指標名稱*], [*數值*], [*信任度*],
${rows}
)
`;
    }

    private static generateTranscript(transcript: ITypstDraftData['transcript']): string {
        const dialogue = transcript.map(t => {
            const color = t.role === 'Sprite' ? 'rgb("#63a6b0")' : 'rgb("#ffd700")';
            return `#block(inset: 8pt, fill: ${color}.lighten(95%), radius: 4pt)[
  *${t.role}:* ${t.content}
]`;
        }).join('\n\n');

        return `
== 數位分身對話實錄 (Dialogue Transcript)

${dialogue}
`;
    }
}
