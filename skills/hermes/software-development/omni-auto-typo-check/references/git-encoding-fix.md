# Windows Git 中文檔名編碼衝突處理

## 問題描述
Windows Git 預設使用系統語系編碼（GBK）處理中文檔名，與 UTF-8 內容或檔案內容衝突。

## 症狀
- 提交中文檔名時，檔名被錯誤編碼為亂碼
- Git log 中顯示亂碼檔名
- `git status` 顯示異常檔案名稱

## 解決方案

### 1. 建立 .gitattributes 設定檔
```bash
# .gitattributes 內容
*.md text working-tree-encoding=UTF-8
*.txt text working-tree-encoding=UTF-8
*.sh text eol=lf
*.png binary
```

### 2. 重新設定檔案編碼
```bash
git add .gitattributes
git add "正確的中文檔名.md"  # 避免使用亂碼檔名
git commit -m "fix: add gitattributes for UTF-8 support"
```

### 3. 防止未來問題
- 總是先提交 `.gitattributes`
- 使用 ASCII 或英文檔名作為備用方案
- 考慮使用 Markdown 內嵌 ASCII 流程圖代替 PNG 檔案

## 相關參考
- [Git 官方文件：working-tree-encoding](https://github.com/git/git/blob/master/Documentation/technical/protocol-v2.txt)
- [Microsoft Docs: Git on Windows](https://git-scm.com/docs/git-config)