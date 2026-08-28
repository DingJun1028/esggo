# Reference: 墾趣旅遊 FTG 2.0 — worked example

Built in `apps/ftg-2.0/` (index.html + styles.css + app.js). Pushed as commit `f2a7cc737`.
Reused for any future travel / ESG / OA-family landing page.

## Brand positioning
農村生態 / 永續深度旅遊. Brand voice: 墾 (翻土/開創) + 趣 (好奇/歡喜). ESG-aligned (GRI transparency, zero plastic, local procurement).

## Design tokens (in :root)
```
--green: #3c6e47;      --green-deep: #274d31;
--gold: #c9a24b;       --gold-soft: #e3c987;
--cream: #f3ede1;      --ink: #10243f;
--ink-soft: #2b3a4f;   --paper: #fbf8f2;
```
These mirror the OA soul brand palette (永續綠 + 暖金 + 米白 + 深藍) so the family stays visually consistent.

## Section order (single page)
1. Sticky nav (brand + 5 anchors + CTA)
2. Hero: H1 with green-highlighted 墾, two CTAs, 4 stat cards (42 村落 / 180+ 路線 / 96% 回訪 / 0 一次性塑料)
3. Brand story (3 cards: 農村共創 / 生態低痕 / 文化沉浸)
4. Services (3 cards: 慢旅宿行 / 生態向導 / 手藝學徒)
5. Features — DARK block (#ink bg) for rhythm: 6 sustainability pledges (在地採購 / 零廢棄 / 低碳移動 / 公平回饋 / 透明揭露 / 復育參與)
6. Process — 4 numbered steps (說出嚮往 / 客製路線 / 確認出發 / 共創回憶)
7. Contact — green block, form (name/email/topic) + info column
8. Footer

## Interactions (app.js)
- `handleSubmit(e)` → preventDefault + confirmation message + reset
- `IntersectionObserver` reveal: `.card/.feat/.stat/.step` start `opacity:0; translateY(18px)`, fade in on intersect (threshold 0.12)

## Verification (real, this session)
- `browser_navigate(file:///.../ftg-2.0/index.html)` → 39 elements rendered
- `browser_vision` → "渲染完全正常，無破版、無文字溢出、樣式完整；Hero 綠色強調墾字、深色永續區塊對比度良好、表單完整"
- Screenshot: `C:\Users\dingj\AppData\Local\hermes\cache\screenshots\browser_screenshot_2714313e5abd46499c490e2764b27b6f.png`

## Note on hermes verify false-negative
`hermes verify` / `pnpm run test` FAIL for this repo due to prisma generate EPERM + pyyaml METADATA — environment blockers in OTHER sub-projects, not this static page. Static HTML needs no build; browser render = the real passing check.
