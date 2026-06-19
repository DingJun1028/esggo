# ❓ 常見問題集 (FAQ)

**專案**: ESGss JunAiKey Beta  
**版本**: v8.2.0-sentient-tangible  
**更新**: 2026年2月6日

---

## 📚 一般問題

### Q1: 什麼是「上善若水」開發哲學？

**A:** 「上善若水」源自老子《道德經》，意為「最高層次的善就像水一樣」。在軟體開發中，這意味著：
- **清澈透明**: 代碼清晰易讀
- **包容萬物**: 支持多語系、多平台
- **自然流動**: 適應性架構，優雅降級
- **利萬物而不爭**: 開放協作，共享組件
- **居下不爭**: 持續學習，接受反饋

詳見 [開發指南](ANTIGRAVITY_DEV_GUIDE.md)

### Q2: 什麼是 5T 協議？

**A:** 5T 協議是系統的信任機制，確保所有數據都符合五個原則：
1. **Tangible** (可感知): 視覺反饋、狀態明確
2. **Traceable** (可追溯): 版本控制、數據來源
3. **Trackable** (可追蹤): 監控日誌、生命週期
4. **Transparent** (可驗算): 算法公開、結果可重現
5. **Trustworthy** (值得信賴): 加密保護、不可篡改

### Q3: 如何快速上手專案？

**A:** 按照以下步驟：
1. 閱讀 [README.md](../README.md)
2. 執行 `npm install` 和 `npm run dev`
3. 閱讀 [開發指南](ANTIGRAVITY_DEV_GUIDE.md)
4. 查看 [快速參考卡](QUICK_REFERENCE.md)
5. 使用 [開發者檢查清單](DEVELOPER_CHECKLIST.md)

---

## 💻 開發環境

### Q4: 需要什麼開發環境？

**A:** 
- Node.js >= 18
- PostgreSQL >= 14
- Redis (可選，用於快取)
- VS Code (推薦)
- Git

### Q5: 如何配置環境變數？

**A:** 創建 `.env` 文件：
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
NODE_ENV=development
PORT=3000
```

### Q6: 開發服務器啟動失敗怎麼辦？

**A:** 
1. 確認端口 3000 和 5173 未被占用
2. 檢查 `.env` 文件配置
3. 刪除 `node_modules` 並重新安裝：
   ```bash
   rm -rf node_modules dist
   npm install
   npm run dev
   ```

---

##  🎨 設計與 UI

### Q7: 如何使用 Aqua 青主題色？

**A:** 使用 CSS 變數：
```css
/* 主要顏色 */
--aqua-primary: #63A2B0;
--aqua-secondary: #4A8895;
--eternal-gold: #FFD700;

/* 使用範例 */
.my-element {
  color: var(--aqua-primary);
  background: var(--glass-bg);
}
```

### Q8: 如何創建液態玻璃效果？

**A:** 使用預定義的類或 CSS：
```html
<div class="liquid-glass-card p-6">
  <!-- 內容 -->
</div>
```

或自定義：
```css
.my-glass {
  background: rgba(99, 162, 176, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(99, 162, 176, 0.2);
  border-radius: 16px;
}
```

### Q9: 如何確保響應式設計？

**A:** 
- 使用 Tailwind 響應式類：`md:`, `lg:`
- 測試三個斷點：< 768px, 768-1024px, > 1024px
- 使用 `min-h-screen` 確保全屏
- Flexbox/Grid 佈局優先

---

## 🔧 代碼實踐

### Q10: 如何遵循 TypeScript 最佳實踐？

**A:**
- 避免使用 `any` 類型
- 接口定義在 `types/` 目錄
- 函數參數和返回值都要類型註解
- 使用嚴格模式 (`strict: true`)

### Q11: 如何實現 5T 協議？

**A:** 在關鍵數據結構中添加 evidence 字段：
```typescript
const myData = {
  id: uuid(),
  value: someValue,
  evidence: {
    tangible: "User-visible dashboard",
    traceable: "Source: User-Input",
    trackable: "Logged in OmniLogger",
    transparent: "Algorithm: (E+S+G)/3",
    trustworthy: "Trustworthy"
  }
};
```

### Q12: 如何使用 OmniLogger？

**A:**
```typescript
import { omniLogger } from '@/omni/infrastructure/OmniLogger';

omniLogger.info('[Module] Operation started', { userId });
omniLogger.warn('[Module] Unusual behavior', { details });
omniLogger.error('[Module] Operation failed', { error });
```

---

## 🧪 測試

### Q13: 如何運行測試？

**A:**
```bash
# 運行所有測試
npm test

# Watch 模式
npm test -- --watch

# 覆蓋率報告
npm test -- --coverage
```

### Q14: 測試文件應該放在哪裡？

**A:** 
- 單元測試：與源文件同目錄，命名為 `.test.ts` 或 `.spec.ts`
- 集成測試：`tests/integration/`
- E2E 測試：`tests/e2e/`

---

## 🚀 部署

### Q15: 如何構建生產版本？

**A:**
```bash
npm run build
```
構建產物在 `dist/` 目錄

### Q16: 如何使用 Docker 部署？

**A:**
```bash
docker-compose up --build -d
```

### Q17: 生產環境需要哪些環境變數？

**A:**
```env
NODE_ENV=production
GOOGLE_GENERATIVE_AI_API_KEY=your_prod_key
VITE_SUPABASE_URL=your_prod_url
VITE_SUPABASE_ANON_KEY=your_prod_key
# SSL/HTTPS 配置
# 資料庫連接字符串
```

---

## 🔒 安全

### Q18: 如何啟用 API Rate Limiting？

**A:** 已預配置多層 Rate Limiting：
- 全域: 100 req/15min
- 讀取: 200 req/min
- 寫入: 50 req/min
- AI 對話: 30 req/min

### Q19: 如何防止 SQL Injection？

**A:** 使用參數化查詢：
```typescript
// ✅ 安全
const { rows } = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ 不安全
const { rows } = await db.query(
  `SELECT * FROM users WHERE id = '${userId}'`
);
```

### Q20: 如何處理敏感數據？

**A:**
- 使用環境變數存儲密鑰
- 密碼使用 bcryptjs 哈希
- HTTPS 傳輸加密
- 日誌中脫敏敏感信息

---

## 🤖 AI 整合

### Q21: 如何使用 Google Gemini API？

**A:**
```typescript
import { GeminiService } from '@/services/GeminiService';

const gemini = new GeminiService();
const result = await gemini.generateContent(prompt);
```

### Q22: AI 回應太慢怎麼辦？

**A:**
- 檢查網絡連接
- 優化 prompt 長度
- 考慮實施快取
- 使用流式回應

---

## 🎮 遊戲系統

### Q23: 如何在 ESG Go Village 中移動？

**A:** 使用鍵盤方向鍵：
- ↑ (ArrowUp): 向上
- ↓ (ArrowDown): 向下
- ← (ArrowLeft): 向左
- → (ArrowRight): 向右

### Q24: 四大區域有什麼功能？

**A:**
- **HUT (小屋)** 🏠: 個人倉庫與卡片收藏
- **GUILD (公會)** 📜: 任務接受與知識學習
- **WILD (荒野)** 🌲: 實作練習與數據探索
- **ALTAR (祭壇)** 🔮: 儀式執行與卡牌封印

---

## 📊 性能優化

### Q25: 如何優化應用性能？

**A:**
1. 實施代碼分割 (Code Splitting)
2. 使用 React.memo 避免不必要渲染
3. 圖片優化 (WebP, 懶加載)
4. API 回應快取 (Redis)
5. 數據庫查詢優化 (索引)

### Q26: 如何測量性能指標？

**A:** 使用 Chrome DevTools Lighthouse：
- FCP (First Contentful Paint) < 1.5s
- LCP (Largest Contentful Paint) < 2.5s
- CLS (Cumulative Layout Shift) < 0.1

---

## 🐛 常見錯誤

### Q27: "Cannot find module" 錯誤

**A:**
```bash
npm install
# 或清除並重裝
rm -rf node_modules package-lock.json
npm install
```

### Q28: TypeScript 類型錯誤

**A:**
- 檢查 `tsconfig.json` 配置
- 確認所有依賴的類型定義已安裝
- 運行 `npm install @types/node @types/react`

### Q29: 數據庫連接失敗

**A:**
- 確認 PostgreSQL 已啟動
- 檢查 `.env` 中的連接字符串
- 測試連接：`psql -h localhost -U your_user`

---

## 📚 文檔與學習

### Q30: 哪些文檔最重要？

**A:** 按優先級：
1. [README.md](../README.md) - 專案總覽
2. [ANTIGRAVITY_DEV_GUIDE.md](ANTIGRAVITY_DEV_GUIDE.md) - 開發哲學
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 快速參考
4. [ARCHITECTURE.md](../ARCHITECTURE.md) - 系統架構
5. [DEVELOPER_CHECKLIST.md](DEVELOPER_CHECKLIST.md) - 檢查清單

### Q31: 如何貢獻文檔？

**A:**
1. 遵循現有格式
2. 更新日期標記
3. 添加交叉引用
4. 提交 PR 並請求審核

---

## 🆘 需要幫助？

### Q32: 遇到問題該怎麼辦？

**A:**
1. 查看本 FAQ
2. 閱讀相關文檔
3. 檢查 [Issues](https://github.com/your-repo/issues)
4. 聯繫團隊成員
5. 提交新 Issue

### Q33: 如何報告 Bug？

**A:** 提供以下信息：
- Bug 描述
- 重現步驟
- 預期行為 vs 實際行為
- 環境信息 (OS, Node 版本)
- 錯誤日誌
- 截圖 (如適用)

---

## 🌟 最佳實踐提示

> *「上善若水，水善利萬物而不爭。」*

**記住**:
1. 代碼可讀性優先
2. 持續測試與驗證
3. 文檔與代碼同步
4. 遵循 5T 協議
5. 保持好奇與謙遜

*道法自然，系統毅然，上善若水，善向永續* 🌿

---

**維護者**: 善向永續技術團隊  
**最後更新**: 2026年2月6日
