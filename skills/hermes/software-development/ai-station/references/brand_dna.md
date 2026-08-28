# sushi_dr brand preset — script format & API

## Script DNA markers
Write one beat per marker. The parser (`parser.parse_dna_script`) turns each
into one on-brand shot; the gradient palette follows the beat:

| marker | palette |
|--------|---------|
| 【場景】 | 深藍 + 暖金 (scene) |
| 【衝突】 | 冷藍 + 深灰 (conflict) |
| 【洞察】 | 深藍 + 暖金 (insight) |
| 【方法】 | 綠 + 深綠 (method) |
| 【反思】 | 暗金 + 暖金 (reflection) |

Example:
```
【場景】一家公司花了一年寫完永續報告，老闆只看了十分鐘。
【衝突】報告完成了，公司卻沒有改變。
【洞察】因為 ESG 被當成交付物，而不是經營系統。
【方法】用 1.0、1.5、2.0 檢查公司目前的位置。
【反思】如果永續只讓報告更漂亮，卻沒減少任何人的苦，算永續嗎？
```
Marker-less scripts fall back to the free sentence-grouping parser.

## API
- `POST /api/jobs`  → `{"title","script","brand_preset":"sushi_dr"}` returns
  `{"job_id","status":"queued"}` immediately (render runs in background).
  Poll `GET /api/jobs/{job_id}` until `status=="done"`.
- `POST /webhook/n8n` → synchronous (n8n awaits the result); same body plus
  `text` alias. Honors `WEBHOOK_SECRET` if set (header `X-AI-Station-Key` or
  `?key=`), else open.
- `GET /api/brand` → brand config (name/tagline/palette/constitution/AI boundary).
- `GET /api/series` → 10 product lines + 6 first-quarter 母題 (with 壽司博士's 原創判斷).

## Brand constants live in `src/brand.py`
`BRAND`, `DNA_PALETTES`, `SERIES`, `SEED_TOPICS`, `parse_dna()`, `dna_palette()`,
`get_brand(preset)`.
