# MPT (MoneyPrinterTurbo) v1.3.5 影片生成修復鏈

部署在 VPS 161.118.248.180 (`/opt/esggo/apps/mpt`)，Docker image `ghcr.io/harry0703/moneyprinterturbo:latest`。
所有 patch 放 `/opt/esggo/apps/mpt/patches/`，透過 `docker-compose.esggo.yml` 的 `x-common-volumes` 掛載進容器。

## 根因：video_source 預設是 hardcoded，不是從 config.toml 讀
API 請求的 `video_source` 預設值在 **兩個地方**硬編碼為 `"pexels"`：
- `app/models/schema.py:92` → `video_source: Optional[str] = "pexels"`  ← **這個才是 API 實際用的預設**
- `webui/Main.py:1277` → `video_source = params.get("video_source") or "pexels"`

`config.toml` 的 `video_source = "pixabay"` **不會被 API 層讀取**。改 config 沒用，必須 patch `schema.py`。

## 用戶 key 狀態
- Pexels key（用戶給的 `Krbun...`）→ API 回 **401 無效**
- Pixabay key（`57271756-...`）→ **有效**
→ 解法是改用 pixabay 源（不是修 pexels key）。

## 必做 patch（按重要性）
1. **schema.py:92** → `video_source: Optional[str] = "pixabay"`  ← 根治
2. **material.py** `search_videos_pexels` / `search_videos_pixabay` 內的 aspect 篩選：
   原 `if (_matches_video_aspect(w,h,aspect) and w == video_width and h == video_height)` 過嚴
   → 改為只比對寬高比 `if _matches_video_aspect(w,h,aspect)`（pexels/pixabay 回傳非標準解析度會全被濾掉）
3. **llm.py** `generate_terms` → 強制產**英文**搜尋詞（pexels/pixabay 對中文詞組回空）
4. **Main.py** → `page_title="萬能自動影音 OmniAutoVideo"` + `resolve_ui_language(..., default_language="zh-TW")`
5. **task.py + video.py**（選用）→ local 素材 fall back

## compose volume 縮排陷阱
`x-common-volumes` 內的掛載項必須是 **2 空格** `  - ./patches/X.py:...`。
若寫成 6 空格 `      - ./patches/Main.py:...`（從別的 block 複製貼上），YAML 解析時該項**靜默失效** → 容器內看不到 patch。
驗證：`docker inspect moneyprinterturbo-webui --format '{{json .Mounts}}'` 確認 Main.py 在列表內。

## zh-TW.json 重建（繁中 UI）
- **opencc 位置（2026-08-26 實證）**：VPS 宿主可裝（`pip3 install --break-system-packages opencc-python-reimplemented`）；webui/api 容器**都沒有** opencc（兩者皆 `ModuleNotFoundError: No module named 'opencc'`）。
- 正確流程：
  1. `docker cp moneyprinterturbo-webui:/MoneyPrinterTurbo/webui/i18n/zh.json /opt/esggo/apps/mpt/zh_src.json`
  2. 宿主 `pip3 install --break-system-packages opencc-python-reimplemented`
  3. 宿主 `python3` 用 `OpenCC('s2twp')` 把 `zh_src.json` 的 `Translation` 值全轉繁中 → 寫 `zh-TW.json`
  4. **重導向後務必 `ls -la zh-TW.json` 確認 size > 0**（見下方致命坑）
- **致命坑**：`bash gen.sh > zh-TW.json` 若腳本 stdout 為空/報錯，會把 bind-mount 檔**截斷成 0 字節** → 容器內 i18n 讀到空檔、UI 不顯示繁中。本輪因此毀檔，靠 `zh_src.json` 重建救回。每次重建後確認 size > 0 再重啟 webui。
- config.toml 設 `language = "zh-TW"` + Main.py `default_language="zh-TW"` 雙保險。

## 驗收信號
- 成功：任務日誌出現 `search_videos_pixabay - searching videos on pixabay` + `found total videos: N, ... found duration: X.0 seconds`
- 失敗：仍出 `failed to download video materials from pexels` = schema.py patch 未生效，或 24h 搜尋快取命中舊空結果（清 `/MoneyPrinterTurbo/storage/*cache*` 重試）
- 端到端：filedrop 上傳 txt → 解析 → MPT 生成 `combined-1.mp4`，任務 `state:1, progress:100`
