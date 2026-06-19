import { ChainedDataBlock } from '../types/omni-report.types.js';
// Classified under: Platform Experience Layer
/**
 * 💡 Omni-Component Core: Typst Report Generation Service
 * --------------------------------------------------
 * [Protocol] Layout & Render
 *
 * Core Responsibilities:
 * 1. Transform 4+1 protocol data into Typst markup.
 * 2. Inject 4+1 verification tokens and Hash Lock information.
 * 3. Generate publication-quality PDF source code.
 */

export class TypstService {
  /**
   * Generate report content (Typst Format)
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
   * Generate report header
   */
  private static generateHeader(company: string, year: number): string {
    return `
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: align(right)[
    #text(8pt, gray)[${company} ${year} Sustainability Report | AI Generated]
  ],
  footer: [
    #align(center)[
      #text(8pt)[#counter(page).display()]
    ]
  ]
)

#set text(font: "Noto Sans CJK TC", size: 11pt)

= ${company} ${year} Annual Sustainability Report
#v(1cm)

== 1. Data Trust Declaration
This report is generated using the *4+1 Digital Trust Protocol* of the *ESGss JunAiKey* system.
All data marked #text(emerald)[● Verified] has been secured by immutable hash locks.

#v(0.5cm)
`;
  }

  /**
   * Format individual data block
   */
  private static formatDataBlock(block: ChainedDataBlock): string {
    const { data, hash_lock } = block;

    return `
=== Indicator Disclosure: ${data.indicatorId}
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
      *Disclosure Value* \
      #text(24pt, weight: "bold")[${data.value} ${data.unit}]
    ],
    [
      *4+1 Verification Status* \
      #if "${data.currentStatus.trustworthy}" == "active" or "${data.currentStatus.trustworthy}" == "success" [
        #text(emerald)[● Locked (Immutable)]
      ] else [
        #text(red)[● Auditing (Pending)]
      ] \
      #text(7pt, font: "Courier")[Hash: ${hash_lock.substring(0, 16)}...]
    ]
  )
  
  #v(5pt)
  #text(8pt, gray)[Source: ${data.sourceOrigin} | Version: ${data.version}]
]
`;
  }

  /**
   * Generate report footer and GRI index placeholder
   */
  private static generateFooter(): string {
    return `
#pagebreak()
== 2. GRI Content Index (Partial)
#table(
  columns: (auto, 1fr, auto),
  inset: 10pt,
  align: horizon,
  [*GRI Indicator*], [*Disclosure Title*], [*Verification Code*],
  [302-1], [Energy Consumption], [0x774A...],
  [305-1], [Scope 1 Emissions], [0x991F...]
)

#v(2cm)
#align(center)[
  #image("../assets/junaikey-logo.png", width: 30%)
  #text(10pt, gray)[Provided by JunAiKey Omni-Component Core Technology]
]
`;
  }
}
