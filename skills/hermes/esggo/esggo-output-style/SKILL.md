---
name: esggo-output-style
description: "esggo 任務輸出語言與風格規範：僅繁體中文與英文，不出現韓文。"
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
tags: [esggo, output-style, language, korean-ban]
---

# esggo 任務輸出語言與風格規範

## 語言約束
- **僅使用繁體中文與英文。**
- **不得出現韓文（韓語文字、韓文標點、韓文語句）。**
- 程式碼、註解、變數名、commit message 可依專案慣例使用英文。
- Markdown 文件以繁體中文為主，必要處可穿插英文術語。

## 觸發與行為
| 使用者語句 | 行為 |
|-----------|------|
| 提到「繁體中文」、「英文」、「不出現韓文」等語言偏好 | 立即套用語言約束，全程保持 |
| 「代主自行最佳實踐通」、「最佳實踐」等授權語句 | 進入自主執行模式，不反問，直接推動任務 |
| 「繼續/下一步/全部都是」等推動語句 | 直接接續執行，不澄清 |

## 驗證
- 輸出前 self-check：確認回覆中不包含韓文字符（韓語 Hangul 字符、韓文標點）。
- 涉及雙語內容時，繁體中文與英文混用可接受；韓文不可出現。

## 參考
- `references/esggo-output-style-2026-08-16.md` — 本次語言約束確立 session 記錄

## ソース
本規範源自用戶 2026-08-16 語言偏好指示。
