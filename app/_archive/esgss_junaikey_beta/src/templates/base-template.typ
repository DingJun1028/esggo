// 💡 ESGss JunAiKey: 永續報告基礎模板 (Standard Template)
// [協議] 表現層 - 出版級美學定義

#let esg_report(
  title: "",
  company: "",
  year: "",
  author: "JunAiKey AI Engine",
  body
) = {
  // 頁面配置
  set page(
    paper: "a4",
    margin: (x: 2.5cm, y: 3cm),
    fill: white,
  )

  // 字體與排版配置
  set text(
    font: ("Inter", "Noto Sans CJK TC"),
    size: 11pt,
    lang: "zh",
    region: "tw"
  )

  show heading: set text(fill: rgb("#1e293b"))
  
  // 封面
  align(center + horizon)[
    #text(32pt, weight: "black", fill: rgb("#10b981"))[#title] \
    #v(1cm)
    #text(18pt, weight: "bold")[#company] \
    #text(14pt, gray)[#year 年度 永續報告書]
    
    #v(5cm)
    #text(9pt, gray)[報告生成日期：#datetime.today().display()] \
    #text(9pt, gray)[數位指紋：0x774AB9...2026]
  ]

  pagebreak()

  // 目錄
  outline(indent: auto)
  pagebreak()

  // 正文內容
  body
}

// 主題色定義
#let color_emerald = rgb("#10b981")
#let color_blue = rgb("#3b82f6")
#let color_slate = rgb("#1e293b")

// 通用卡片組件
#let data_card(title, value, unit, status, hash) = {
  rect(
    width: 100%,
    inset: 15pt,
    radius: 10pt,
    stroke: 0.5pt + luma(240),
    fill: luma(252)
  )[
    #stack(
      dir: ltr,
      spacing: 1fr,
      [
        #text(9pt, gray, weight: "bold")[#upper(title)] \
        #v(5pt)
        #text(24pt, weight: "black", fill: color_slate)[#value]
        #text(10pt, gray)[#unit]
      ],
      [
        #align(right)[
          #if status == "verified" [
            #circle(radius: 3pt, fill: color_emerald)
            #text(9pt, color_emerald, weight: "bold")[ VERIFIED]
          ] else [
            #circle(radius: 3pt, fill: rgb("#ef4444"))
            #text(9pt, rgb("#ef4444"), weight: "bold")[ AUDITING]
          ] \
          #v(5pt)
          #text(7pt, font: "Courier", gray)[LOCK: #hash]
        ]
      ]
    )
  ]
}
