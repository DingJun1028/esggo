# 蜂民清冊內容完整性檢查

## 必要區塊
- 蜂群總綱
- 1-10 萬能蜂民規格：
  - 職能
  - 規格：輸入 / 輸出 / 推理
  - 能力
  - 應用場景
- 蜂群協作模型（至少列出：單蜂深度、串聯、蜂巢共推理）

## 驗證指令
```bash
grep -E "^## [0-9]+\. 萬能" 蜂民清冊.md
```

## 禁語詞
- 「萮能」→「萬能」
- 「蜑群」→「蜂群」

## assets 規範
- 流程圖統一放在 `docs/`
- 文件名格式：`docs/bee_*.png`
- Markdown 中以 `![](docs/*.png)` 嵌入為主，避免長期仰賴 ASCII 流程圖

## git 送出版控前檢查
```bash
./scripts/check_typo.sh 蜂民清冊.md
python scripts/bee_colony_demo.py
grep -R "蜑群\|萮能" 蜂民清冊.md README.md scripts/ 2>/dev/null || true
ls docs/bee_*.png
```
