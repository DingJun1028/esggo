# ESGGO 聖典文獻 — 02：Sunshine Web 網站記憶碎片

> **來源：** `C:\Project\esg-sunshine-web\` — ESG Sunshine 善向永續官方網站  
> **技術棧：** Next.js 16 + React 18 + TypeScript + Tailwind CSS + Supabase  
> **部署平台：** Vercel  
> **版本：** 0.1.0  

---

## 一、網站總覽

### 平台定位
ESG Sunshine 善向永續官方網站，是 ESGGO 平台的 **對外門戶與行銷展示平台**。結合國際頂尖商學院（Berkeley Haas）與矽谷實業家國際視野與在地實務經驗，提供永續轉型的全方位服務展示。

### 核心資訊
- **標題：** ESG Sunshine 善向永續 | 建構永續轉型新典範
- **描述：** 結合國際頂尖商學院與矽谷實業家國際視野與在地實務經驗，提供永續轉型的全方位服務
- **關鍵詞：** ESG, 永續發展, Berkeley, 國際認證, 永續轉型, 企業社會責任
- **Logo：** `https://cdn.imgchest.com/files/ae1d769340b0.png`

---

## 二、技術架構

### 技術棧
| 類別 | 技術 |
|------|------|
| 框架 | Next.js 16.0.8 |
| UI 函式庫 | React 18.2.0 |
| 語言 | TypeScript 5.6.3 |
| 樣式 | Tailwind CSS 3.4.14 |
| 資料庫 | Supabase (@supabase/supabase-js ^2.90.1) |
| 圖標 | lucide-react 0.263.1 |
| 郵件 | Resend ^6.7.0 |
| 程式碼品質 | ESLint ^9.39.1 |

### 專案結構
```
esg-sunshine-web/
├── app/
│   ├── layout.tsx          # 根佈局（LanguageProvider + 字體預載入）
│   ├── page.tsx            # 首頁（Hero + About + Services + Testimonials + Contact）
│   ├── actions.ts          # Server Actions（Newsletter 訂閱、Contact 表單）
│   ├── about/
│   │   └── page.tsx        # 關於我們頁面
│   ├── courses/
│   │   └── berkeley-tsisda/
│   │       └── page.tsx    # Berkeley TSISDA 課程頁面
│   └── api/
│       └── cron/
│           └── keep-alive/
│               └── route.ts  # Vercel Cron Job（每日保活）
├── components/
│   ├── Header.tsx          # 導航列（含多層下拉選單、語系切換）
│   ├── Footer.tsx          # 頁尾（聯絡資訊、社交連結、導航連結）
│   ├── Hero.tsx            # 首頁 Hero 區（統計數據、CTA、影片彈窗）
│   ├── About.tsx           # 關於區塊（使命、成就、核心價值）
│   ├── Services.tsx        # 服務項目（6 大服務卡片）
│   ├── Contact.tsx         # 聯絡表單（含驗證、Supabase 寫入、Resend 通知）
│   ├── Testimonials.tsx    # 學員見證
│   ├── NewsletterBanner.tsx # 電子報訂閱橫幅
│   ├── PromoBundle.tsx     # 促銷組合
│   ├── ScrollToTop.tsx     # 回到頂部按鈕
│   └── PageTransition.tsx  # 頁面過渡動畫
├── contexts/
│   └── LanguageContext.tsx # 語系上下文（中/英雙語）
├── locales/
│   ├── zh-TW.ts            # 繁體中文翻譯
│   └── en.ts               # 英文翻譯
├── lib/
│   ├── supabase.ts         # Supabase 客戶端初始化
│   └── api/
│       └── contact.ts      # Contact API 輔助
├── supabase_schema.sql     # Supabase 資料庫 Schema
└── vercel.json             # Vercel 部署配置（含 Cron Job）
```

---

## 三、頁面功能

### 3.1 首頁 (`/`)

**佈局結構：**
```
PageTransition
  └─ Header（固定頂部導航）
  ├─ iframe（Fouita 嵌入 widget，桌面端顯示）
  ├─ Hero（主視覺區）
  ├─ About（關於我們）
  ├─ Services（服務項目）
  ├─ Testimonials（學員見證）
  ├─ Contact（聯絡表單）
  ├─ Footer（頁尾）
  ├─ ScrollToTop（回到頂部）
  └─ NewsletterBanner（電子報訂閱）
```

**Hero 區特色：**
- 動態背景元素（浮動漸變圓形）
- 統計數據展示（20年+ 經驗、50+ 講師、100+ 項目、500+ 學員）
- 快速行動按鈕（下載手冊、觀看介紹）
- 影片彈窗（Coming Soon）
- CTA：立即報名 / 了解更多

### 3.2 關於我們 (`/about`)

**內容區塊：**
1. **定位區塊：** 平台定位與介紹
2. **信念區塊：** 三大核心信念（CheckCircle2 圖標卡片）
3. **使命區塊：** 圖文並茂的使命說明
4. **願景區塊：** 願景目標列表 + 結尾語
5. **CTA 區塊：** 「與我們一起建構永續文明」

### 3.3 課程頁面 (`/courses/berkeley-tsisda`)

Berkeley × TSISDA 國際永續策略人才培訓課程專屬頁面。

---

## 四、組件設計

### 4.1 Header 導航列

**核心功能：**
- 固定頂部（sticky），滾動時背景模糊效果
- 多層下拉選單（Services / Courses / Decision Platform / Intelligence Analysis / Health Check / Sustainability Report / Public Welfare）
- 語系切換（中/英）
- 行動端漢堡選單
- CTA 按鈕：認證課程 / 立即報名

**導航結構：**
```typescript
const navigation = [
  { name: '關於我們', href: '/about', icon: Users },
  { name: '服務項目', href: '#services', hasDropdown: true, dropdownKey: 'services' },
  { name: '認證課程', href: '#courses', hasDropdown: true, dropdownKey: 'courses' },
  { name: '決策資訊平台', href: '/decision-platform', hasDropdown: true },
  { name: '情報與轉型分析', href: '/intelligence-analysis', hasDropdown: true },
  { name: 'ESG健檢與資訊管理', href: '/health-check-management', hasDropdown: true },
  { name: '永續報告與碳資產', href: '#sustainability-report', hasDropdown: true },
  { name: '公益與夥伴活動', href: '/public-welfare', hasDropdown: true },
]
```

### 4.2 Footer 頁尾

**內容：**
- Logo + 平台描述
- 聯絡資訊（電話、Email、地址）
- 社交連結（Facebook、LinkedIn、Instagram、Twitter、YouTube）
- 導航連結區塊
- 版權聲明 + 法律連結

### 4.3 Contact 聯絡表單

**功能：**
- 表單驗證（必填欄位、Email 格式）
- Supabase 寫入（`esg_sunshine_contact_messages`）
- Resend 郵件通知（管理員通知 + 用戶確認信）
- 提交狀態反饋（成功/錯誤）

**表單欄位：**
```typescript
interface ContactFormData {
  name: string;        // 必填
  job_title?: string;
  email: string;       // 必填
  phone?: string;
  company_name?: string;
  subject: string;     // 預設「課程諮詢」
  message: string;     // 必填
}
```

---

## 五、國際化 (i18n)

### 語系支援
- **繁體中文（zh-TW）：** 預設語系
- **英文（en）：** 完整翻譯

### 翻譯結構
```typescript
interface Translations {
  header: { nav, servicesDropdown, coursesDropdown, ... }
  hero: { badge, title, subtitle, features, buttons, stats, ... }
  about: { badge, title, subtitle, mission, achievements, values, ... }
  services: { badge, title, subtitle, highlights, items, ... }
  // ... 更多區塊
}
```

### 語系切換
- 透過 `LanguageContext` 全域管理
- `LanguageSwitcher` 組件提供切換功能
- URL 前綴區分（`/en/` 為英文版）

---

## 六、資料庫設計

### Supabase Schema

#### 6.1 電子報訂閱表 (`esg_sunshine_newsletter_subscribers`)
```sql
CREATE TABLE IF NOT EXISTS esg_sunshine_newsletter_subscribers (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'homepage',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
- **RLS 策略：** 所有人可插入（訂閱），僅管理員可查看

#### 6.2 聯絡訊息表 (`esg_sunshine_contact_messages`)
```sql
CREATE TABLE IF NOT EXISTS esg_sunshine_contact_messages (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    job_title TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
- **RLS 策略：** 所有人可插入（提交表單），僅管理員可查看/更新

### Supabase 客戶端初始化
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);
```
> 使用 placeholder 值防止建構時崩潰，實際呼叫若缺少環境變數會自然失敗。

---

## 七、Server Actions

### 7.1 電子報訂閱 (`subscribeNewsletter`)
```typescript
// 流程：
// 1. 寫入 Supabase（esg_sunshine_newsletter_subscribers）
// 2. 發送管理員通知信（Resend）
// 3. 發送訂閱確認信（Resend，雙語）
```

### 7.2 聯絡表單提交 (`submitContactMessage`)
```typescript
// 流程：
// 1. 寫入 Supabase（esg_sunshine_contact_messages）
// 2. 發送管理員通知信（Resend）
// 3. 發送用戶確認信（Resend）
```

---

## 八、部署配置

### Vercel 配置 (`vercel.json`)
```json
{
    "crons": [
        {
            "path": "/api/cron/keep-alive",
            "schedule": "0 0 * * *"
        }
    ]
}
```
- **每日 Cron Job：** 呼叫 `/api/cron/keep-alive` 防止服務休眠

---

## 九、設計特色

### 視覺風格
- **漸變背景：** 大量使用 `bg-gradient-to-br` 漸變
- **玻璃擬態：** `backdrop-blur` 效果
- **卡片設計：** 圓角卡片 + 陰影層次
- **動畫：** `animate-float`、`animate-slide-up`、`animate-fade-in`、`animate-rotate-slow`
- **圖標：** lucide-react 統一圖標庫

### 響應式設計
- 桌面端：完整導航列 + 側邊欄
- 行動端：漢堡選單 + 底部導航
- 統計數據圓形排列（桌面端）/ 線性排列（行動端）

### 外部整合
- **Fouita：** 首頁嵌入 iframe widget
- **Berkeley 認證連結：** `corporateinnovation.berkeley.edu`
- **ESG 報名表單：** `esg-form.esgsunshine.com`

---

## 十、服務項目

根據翻譯文件，平台提供以下六大服務：

| 服務 | 特色 |
|------|------|
| ESG 策略諮詢 | 永續策略制定、ESG 風險評估、利害關係人議合、永續目標設定 |
| 國際認證培訓 | Berkeley 認證、專業證照、實務工作坊、線上學習平台 |
| 決策資訊平台 | 一站式綜合性全檢服務、永續轉型實務基礎建設導入 |
| 情報與轉型分析 | 商情洞察、國際整合顧問分析、ESG 再生模型分析 |
| ESG 健檢與資訊管理 | ESG 健檢、ESG 資訊管理系統 |
| 永續報告與碳資產 | 永續報告與實務解方建議、碳資產管理與碳交易 |

---

## 十一、與現有 esggo 項目的關聯

### 11.1 角色定位
Sunshine Web 是 ESGGO 平台的 **前端門戶**，負責：
- 品牌形象展示
- 課程推廣與招生
- 潛在客戶獲取（聯絡表單、電子報）
- 外部利害關係人溝通

### 11.2 與 ESGGO 平台的關係
- **Sunshine Web：** 對外行銷網站（esgsunshine.com）
- **ESGGO Platform：** 內部治理平台（esggo）
- **共同點：** 皆使用 Supabase 作為資料庫、Resend 作為郵件服務
- **差異點：** Sunshine Web 是純前端展示，ESGGO 是完整治理工具

### 11.3 資料共享
- 兩者共用 Supabase 專案
- Sunshine Web 收集的聯絡資訊可匯入 ESGGO 的 Stakeholders 模組
- 電子報訂閱者可作為 ESGGO 平台的潛在用戶

### 11.4 技術共享
- 相同的技術棧（Next.js + TypeScript + Tailwind CSS）
- 相同的設計語言（可複用原子元件庫概念）
- 相同的第三方服務（Supabase、Resend）

---

## 十二、關鍵代碼片段

### LanguageProvider 根佈局
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <LanguageProvider locale="zh-TW">
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

### 導航下拉選單邏輯
```tsx
// components/Header.tsx（簡化版）
const navigation = [
  { name: '關於我們', href: '/about', icon: Users },
  { name: '服務項目', href: '#services', hasDropdown: true, dropdownKey: 'services' },
  // ... 更多導航項
]

// 下拉選單渲染
{item.hasDropdown && item.dropdownKey && (
  <div className="relative" ref={isOpen ? dropdownRef : null}>
    <button onClick={() => setOpenDropdown(isOpen ? null : item.dropdownKey)}>
      <item.icon className="w-4 h-4" />
      <span>{item.name}</span>
      <ChevronDown className={isOpen ? 'rotate-180' : ''} />
    </button>
    {isOpen && (
      <div className="absolute top-full left-0 w-[450px] bg-white rounded-xl shadow-2xl">
        {dropdownItems[item.dropdownKey].map(item => (
          <Link key={item.name} href={item.href}>{item.name}</Link>
        ))}
      </div>
    )}
  </div>
)}
```

### Server Action 聯絡表單
```typescript
// app/actions.ts（簡化版）
export async function submitContactMessage(data: ContactFormData): Promise<ActionResponse> {
    // 1. 寫入 Supabase
    const { error } = await supabase
        .from('esg_sunshine_contact_messages')
        .insert({ ...data, status: 'new' });

    // 2. 發送通知信
    await resend.emails.send({
        from: 'ESG Sunshine Website <noreply@esgsunshine.com>',
        to: adminEmails,
        subject: 'New Contact Message',
        html: `<p>New message from ${data.name}</p>`,
    });

    return { success: true };
}
```

---

> **總結：** Sunshine Web 是 ESGGO 生態系統的對外窗口，以精煉的行銷展示獲取潛在客戶，並透過 Supabase 與 ESGGO 平台共享資料。其組件設計、國際化架構、Server Action 模式都可直接參考應用於 ESGGO 平台的開發。
