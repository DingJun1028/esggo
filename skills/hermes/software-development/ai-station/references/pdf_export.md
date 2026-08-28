# HTML -> PDF (headless Chrome, Windows)

Used to turn `proposal_card.html` (brand-styled card) into `proposal_card.pdf`.

## Working recipe (Chrome on Windows, headless)
```bash
PROF=$(mktemp -d)
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless --disable-gpu --no-sandbox \
  --user-data-dir="$PROF" \
  --kiosk-printing \
  --print-to-pdf="C:/abs/path/proposal_card.pdf" \
  "file:///c/Project/aistation/proposal_card.html"
```
Verify: header `%PDF-1.4`, valid `%%EOF` trailer, non-zero size.

## Pitfalls (this build)
- `--print-to-pdf` with NO `--kiosk-printing` silently produced **no file** (exit 0,
  nothing written). Adding `--kiosk-printing` fixed it.
- `--no-pdf-header-footer` flag is **unsupported** on this Chrome version
  (errors / no output) — drop it; trim the header/footer in CSS if needed.
- Must pass an **absolute output path**. A relative path resolved unpredictably.
- Always pass `--user-data-dir` to a fresh temp dir (writable profile).
- Old `--headless` (not `--headless=new`) + `--kiosk-printing` is the combo that worked.

## Alternatives if Chrome is unavailable
- Python libs (`weasyprint`/`reportlab`/`fpdf`) were NOT installed in the venv and
  WeasyPrint needs system GTK libs on Windows — avoid unless already present.
- `wkhtmltopdf` not installed on this box.
- Fallback: render a high-res screenshot PNG via `--screenshot` then wrap in PDF
  (loses text selectability — only if PDF fidelity is unimportant).
