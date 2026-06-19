import { ChainedDataBlock } from '@/types/omni-report.types';
// Classified under: 平台體驗層 (Platform Experience Layer)
/**
 * 💡 奧秘組件心核：Typst 報告生成服務
 * --------------------------------------------------
 * [協議] 表現層 (Layout & Render)
 *
 * 核心職責：
 * 1. 將 3+1 協議數據轉化為 Typst 標記。
 * 2. 注入 3+1 驗證標記與 Hash Lock 資訊。
 * 3. 生成出版級質感的 PDF 原始碼。
 */

export class TypstService {
  /**
   * 生成報告內容 (Typst Format)
   */
  static generateReportSource(
    companyName: string,
    year: number,
    dataBlocks: ChainedDataBlock[]
  ): string {
    const header = this.generateHeader(companyName, year);
    const body = dataBlocks.map(block => this.formatDataBlock(block)).join('\n');
    const footer = this.generateFooter();

    return `${header}\n${body}\n${footer}`;
  }

  /**
   * 生成報告表頭
   */
  private static generateHeader(company: string, year: number): string {
    return `
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: align(right)[
    #text(8pt, gray)[${company} ${year} 永續報告書 | AI 生成]
  ],
  footer: [
    #align(center)[
      #text(8pt)[#counter(page).display()]
    ]
  ]
)

#set text(font: "Noto Sans CJK TC", size: 11pt)

= ${company} ${year} 年度永續經營報告
#v(1cm)

== 1. 數據信託宣告
本報告採用 *ESGss JunAiKey* 系統之 *3+1 數位信託協議* 生成。
所有標註 #text(emerald)[● Verified] 之數據皆已通過不可篡改雜湊鎖定。

#v(0.5cm)
`;
  }

  /**
   * 格式化單個數據區塊
   */
  private static formatDataBlock(block: ChainedDataBlock): string {
    const { data, hash_lock } = block;

    return `
=== 指標揭露：${data.indicatorId}
#rect(
  width: 100%,
  inset: 12pt,
  radius: 8pt,
  stroke: 0.5pt + gray.lighten(50%),
  fill: luma(250)
)[
  #grid(
    columns: (1fr, 1fr),
    gutter: 10pt,
    [
      *揭露數值* \
      #text(24pt, weight: "bold")[${data.value} ${data.unit}]
    ],
    [
      *3+1 驗證狀態* \
      #if "${data.currentStatus.trustworthy}" == "active" or "${data.currentStatus.trustworthy}" == "success" [
        #text(emerald)[● 已鎖定 (Immutable)]
      ] else [
        #text(red)[● 稽核中 (Pending)]
      ] \
      #text(7pt, font: "Courier")[Hash: ${hash_lock.substring(0, 16)}...]
    ]
  )
  
  #v(5pt)
  #text(8pt, gray)[數據來源：${data.sourceOrigin} | 版本：${data.version}]
]
`;
  }

  /**
   * 生成報告頁尾與 GRI 索引預留
   */
  private static generateFooter(): string {
    return `
#pagebreak()
== 2. GRI 內容索引 (部分)
#table(
  columns: (auto, 1fr, auto),
  inset: 10pt,
  align: horizon,
  [*GRI 指標*], [*揭露標題*], [*驗證碼*],
  [302-1], [能源消耗], [0x774A...],
  [305-1], [範疇一排放], [0x991F...]
)

#v(2cm)
#align(center)[
  #image("../assets/junaikey-logo.png", width: 30%)
  #text(10pt, gray)[JunAiKey 奧秘組件心核技術提供]
]
`;
  }
}
