# 🚀 ESGss JunAiKey 快速參考卡

**版本**: v8.2.0-sentient-tangible  
**哲學**: 上善若水 · 反重力開發  
**更新**: 2026年2月6日

---

## 🌊 核心哲學速查

### 兩大律則

1. **自然共鳴律**: 道法自然，系統毅然，上善若水，善向永續
2. **誠信閉環律**: 以終為始，始終如一，無始無終，善向永續

### 5T 協議

| T | 原則 | 實踐 |
|---|------|------|
| **T**angible | 可感知 | 視覺反饋 |
| **T**raceable | 可追溯 | 版本控制 |
| **T**rackable | 可追蹤 | 日誌記錄 |
| **T**ransparent | 可驗算 | 算法公開 |
| **T**rustworthy | 值得信賴 | 加密保護 |

---

## 💻 常用命令

### 開發命令

```bash
# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 運行測試
npm test

# 代碼檢查
npm run lint

# 代碼格式化
npm run format

# 系統治癒
npm run heal

# 驗證強化
npm run verify-all
```

### Docker 命令

```bash
# 啟動所有服務
docker-compose up --build

# 停止所有服務
docker-compose down

# 查看日誌
docker-compose logs -f
```

### Git 工作流

```bash
# 創建功能分支
git checkout -b feature/your-feature-name

# 提交變更
git add .
git commit -m "feat(scope): description"

# 推送分支
git push origin feature/your-feature-name
```

---

## 🎨 設計系統速查

### Aqua 青主題色系

```css
--aqua-primary: #63A2B0;      /* 主色 */
--aqua-secondary: #4A8895;    /* 輔助色 */
--eternal-gold: #FFD700;      /* 點綴 */
--glass-bg: rgba(99, 162, 176, 0.1);
--glass-border: rgba(99, 162, 176, 0.2);
```

### 常用 CSS 類

```html
<!-- 液態玻璃卡片 -->
<div class="liquid-glass-card p-6">...</div>

<!-- 主題色按鈕 -->
<button class="btn-aqua">執行</button>

<!-- 漸層背景 -->
<div class="bg-gradient-to-br from-aqua-50 to-blue-50">...</div>
```

---

## 📂 項目結構

```
esgss_junaikey_beta/
├── src/
│   ├── components/          # React 組件
│   ├── pages/              # 頁面組件
│   ├── services/           # 業務邏輯
│   ├── hooks/              # 自定義 Hooks
│   ├── types/              # TypeScript 類型
│   └── omni/               # Omni 核心系統
├── server/                 # Express 後端
│   ├── routes/            # API 路由
│   ├── services/          # 後端服務
│   └── middleware/        # 中間件
├── docs/                   # 文檔
└── scripts/               # 工具腳本
```

---

## 🔧 TypeScript 速查

### 常用接口

```typescript
// ESG 指標
interface ESGMetrics {
  environmental: number;
  social: number;
  governance: number;
}

// 5T 證據
interface IEvidenceMap {
  tangible: string;
  traceable: string;
  trackable: string;
  transparent: string;
  trustworthy: 'Trustworthy';
}

// 組件 Props
interface ComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}
```

### React 組件模板

```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="liquid-glass-card">
      <h3>{title}</h3>
    </div>
  );
};
```

---

## 🎯 Commit Message 規範

```
<type>(<scope>): <subject>

Types:
  feat     - 新功能
  fix      - 修復
  docs     - 文檔
  style    - 格式
  refactor - 重構
  test     - 測試
  chore    - 雜項

Examples:
  feat(esg): add carbon calculator
  fix(auth): resolve token expiration
  docs(readme): update installation
```

---

## 🧪 測試速查

```typescript
// 單元測試範例
import { describe, it, expect } from 'vitest';

describe('calculateESGScore', () => {
  it('should calculate correct score', () => {
    const metrics = { environmental: 90, social: 80, governance: 85 };
    const score = calculateESGScore(metrics);
    expect(score).toBe(85);
  });
});
```

---

## 🔒 環境變數

```env
# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Server
NODE_ENV=development
PORT=3000
```

---

## 📊 性能檢查清單

- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] API < 200ms
- [ ] 代碼分割已實施
- [ ] 圖片優化完成

---

## 🔐 安全檢查清單

- [ ] Rate Limiting 啟用
- [ ] JWT 認證完善
- [ ] HTTPS 強制啟用
- [ ] SQL Injection 防護
- [ ] XSS 防護
- [ ] CSRF 保護
- [ ] 環境變數隔離

---

## 🎮 常用 API 端點

```
POST   /api/auth/login           # 登入
POST   /api/auth/register        # 註冊
GET    /api/esg/metrics/:userId  # 獲取 ESG 指標
POST   /api/ai/chat              # AI 對話
POST   /api/reports/generate     # 生成報告
```

---

## 📚 重要文檔鏈接

- [開發指南](./docs/ANTIGRAVITY_DEV_GUIDE.md)
- [系統架構](./ARCHITECTURE.md)
- [API 文檔](./docs/API_DOCUMENTATION.md)
- [文檔索引](./docs/DOCUMENTATION_INDEX.md)

---

## 🆘 常見問題快速解答

### Q: 如何啟動開發環境？
```bash
npm install
npm run dev
```

### Q: 構建失敗怎麼辦？
```bash
# 清除緩存
rm -rf node_modules dist
npm install
npm run build
```

### Q: 如何添加新路由？
1. 在 `src/pages/` 創建組件
2. 在 `App.tsx` 添加路由
3. 在 `navigation.config.ts` 更新導航

###Q: 如何遵循 5T 協議？
```typescript
const evidence: IEvidenceMap = {
  tangible: "Visual metrics displayed",
  traceable: "Source: User-Input",
  trackable: "Lifecycle tracked",
  transparent: "Algorithm: E = (E+S+G)/3",
  trustworthy: "Trustworthy"
};
```

---

## 🌟 最佳實踐提示

1. **代碼可讀性** > 簡潔性
2. **類型安全** > 靈活性
3. **單一職責** > 多功能
4. **測試優先** > 事後補測
5. **文檔同步** > 代碼更新

---

*上善若水，善向永續* 🌿
