# ESGGO 善向永續 萬能系統 — 雙向同步 TypeScript 終始矩陣

> 目的：避免「邊寫邊翻」造成的字串散落，唯一字源（SSOT）集中於 `platform/config/i18n-matrix.ts`。

## 使用方式

### 1. 引用字彙
```ts
import { t, TERMS } from "@/platform/config/i18n-matrix";

const label = t("actions.save", "zh"); // 儲存
const enLabel = t("actions.save", "en"); // Save
```

### 2. 取得整組詞彙
```ts
import { getTerms } from "@/platform/config/i18n-matrix";

const zhTerms = getTerms("zh");
const enTerms = getTerms("en");
```

### 3. 在元件內使用（React Server / Client 皆可）
- Server Component：直接 import 使用
- Client Component：建議包裝一個 `useI18n` hook，但字彙仍由 `i18n-matrix.ts` 提供

## 擴充規則

1. 新增詞彙必須加入 `TERMS` 物件，禁止在元件內硬編譯中文
2. API route 的 `message` / `error` 欄位，優先回傳 `zh`，必要時可擴充 `en`
3. 新增 namespace 時，同步更新型別 `TermKey`、`NestedTerm`
4. 修改任何使用者可見字串前，先查詢 `platform/config/i18n-matrix.ts` 是否已存在

## 編碼慣例矩陣

| 維度 | 慣例 | 範例 |
|------|------|------|
| TS 變數/函式 | camelCase | `isPluginEnabled` |
| DB 欄位/JSON key | snake_case | `omni_notes` |
| Route/URL 路徑 | kebab-case | `/omni-center` |
| CSS class | kebab-case | `card-token` |
| Enum/Type | PascalCase | `Lang` |

## 雙向同步矩陣

| 來源 | 預設語言 | 用途 |
|------|----------|------|
| `TERMS.xxx.zh` | 繁體中文 | UI 預設呈現、報表、通知 |
| `TERMS.xxx.en` | 英文 | SEO、API fallback、debug log |

## 維護原則

- 單一檔案：`platform/config/i18n-matrix.ts`
- 任何成員改動都必須同步更新此檔案
- 後續若要拆檔，請維持 `platform/config/` 為唯一入口
