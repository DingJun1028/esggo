---
name: scripts-bearer-token-handling
description: Handle API bearer tokens in bash automation scripts.
---

# Script Bearer Token Handling（OA-Team / ESG-GO）

## 核心規則
- 腳本本體**不可**留明文 Bearer token。token 存在 Vault / key 檔案，由腳本執行時動態讀取，放進 curl header。
- `.admin-key` 檔案特性（本次所得）：ASCII、無換行、35 字元（`sk-mem...8De2`）。
- 腳本身份**必須**有換行；否則 `git diff` 會捎帶「No newline at end of file」雜訊進 diff。

## Vault 讀取模式（bash）
```bash
KEY_FILE_CANDIDATES=(
  "/opt/esggo/.../.admin-key"   # VPS
  "/c/Users/dingj/.../.admin-key" # 本機
  "/c/Project/.../.admin-key"   # 另一本機候選
)
KEY=""
for kf in "${KEY_FILE_CANDIDATES[@]}"; do
  [ -f "$kf" ] && KEY=$(cat "$kf") && break
done
[ -z "$KEY" ] && { echo "[ERROR] No admin key" >&2; exit 1; }
```

## curl header 動態組裝
```bash
curl -sf --max-time 30 "http://127.0.0.1:8420/v3/..." \
  -H "Authorization: Bearer $KEY" \
  -o "$IMPORT_FILE" 2>>"$LOG_FILE"
```

## 替換空缺範例（git 追蹤腳本）
- 原：`-H "Authorization: Bearer ***"`
- 改：`-H "Authorization: Bearer $KEY"`
- 同時補上檔案尾換行。

## 核對清單（寫完腳本後）
- [ ] Bearer token 明文不在腳本中
- [ ] KEY 來源為 Vault/key 檔案（非環境變數硬植）
- [ ] 檔案尾有換行（`cat -A` 最後一行需帶 `$` 終結）
- [ ] `bash -n` 語法檢查通過
- [ ] `git diff` 顯示變更僅為 token 處理，不含無意義雜訊
