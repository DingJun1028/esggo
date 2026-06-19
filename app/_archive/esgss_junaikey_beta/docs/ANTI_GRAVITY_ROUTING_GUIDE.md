# Anti-gravity Design System - Routing Guide
# 反重力設計系統 - 路由設置指南

## 📋 概述

本文檔說明如何配置和使用 Anti-gravity Design System 的路由系統，包括 10 個儀表板的路由配置。

## 🗂️ 文件結構

```
src/
├── config/
│   ├── antigravity-routes.config.ts      # 路由配置定義
│   └── antigravity-router.config.tsx     # React Router 配置
├── pages/
│   ├── landing/
│   │   ├── LandingPage.tsx              # 入口頁面
│   │   └── LandingPage.css              # 入口頁面樣式
│   ├── start/
│   │   ├── StartPage.tsx                # 開始頁面（儀表板導覽）
│   │   └── StartPage.css                # 開始頁面樣式
│   └── demo/
│       ├── AntiGravityDemoPage.tsx      # 演示頁面
│       └── AntiGravityDemoPage.css      # 演示頁面樣式
```

## 🎯 10 個儀表板路由

| # | 儀表板 | 路徑 | 組件 | 狀態 |
|---|--------|------|------|------|
| 1 | JunAiKey 儀表板 | `/dashboard/junaikey` | `JunAiKeyDashboard` | ✅ 已實現 |
| 2 | North Star 儀表板 | `/dashboard/northstar` | `NorthStarDashboard` | ✅ 已實現 |
| 3 | Omni 儀表板 | `/dashboard/omni` | `OmniDashboard` | ✅ 已實現 |
| 4 | ESG 儀表板 | `/dashboard/esg` | `ESGReportCenterPage` | ✅ 已實現 |
| 5 | 設置儀表板 | `/dashboard/settings` | `PlaceholderDashboard` | ⏳ 開發中 |
| 6 | 安全儀表板 | `/dashboard/security` | `PlaceholderDashboard` | ⏳ 開發中 |
| 7 | 報告儀表板 | `/dashboard/reports` | `PlaceholderDashboard` | ⏳ 開發中 |
| 8 | 用戶儀表板 | `/dashboard/users` | `PlaceholderDashboard` | ⏳ 開發中 |
| 9 | 集成儀表板 | `/dashboard/integrations` | `PlaceholderDashboard` | ⏳ 開發中 |
| 10 | 監控儀表板 | `/dashboard/monitoring` | `PlaceholderDashboard` | ⏳ 開發中 |

## 🚀 使用方法

### 1. 在應用中引入路由器

```tsx
import { AntiGravityRouter } from '@/config/antigravity-router.config';

function App() {
  return <AntiGravityRouter />;
}
```

### 2. 導航到儀表板

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/dashboard/junaikey');
  };
  
  return <button onClick={handleNavigate}>前往 JunAiKey 儀表板</button>;
}
```

### 3. 使用路由配置

```tsx
import { antigravityRoutes, getRouteByPath } from '@/config/antigravity-routes.config';

// 獲取所有路由
console.log(antigravityRoutes);

// 根據路徑獲取路由配置
const route = getRouteByPath('/dashboard/junaikey');
console.log(route);
```

## 🔧 路由配置文件

### antigravity-routes.config.ts

這個文件定義了所有 10 個儀表板的路由配置：

```typescript
export interface RouteConfig {
  id: string;
  path: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
  component?: React.ComponentType;
  order: number;
}

export const antigravityRoutes: RouteConfig[] = [
  // 10 個儀表板配置...
];
```

### antigravity-router.config.tsx

這個文件配置了 React Router 的路由：

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/start',
    element: <StartPage />,
  },
  // 10 個儀表板路由...
]);
```

## 📝 添加新儀表板

### 步驟 1: 在 `antigravity-routes.config.ts` 中添加路由配置

```typescript
{
  id: 'new-dashboard',
  path: '/dashboard/new-dashboard',
  title: '新儀表板',
  titleEn: 'New Dashboard',
  description: '新儀表板描述',
  descriptionEn: 'New dashboard description',
  icon: <Dashboard />,
  color: '#63A2B0',
  order: 11,
}
```

### 步驟 2: 在 `antigravity-router.config.tsx` 中添加路由

```typescript
{
  path: '/dashboard/new-dashboard',
  element: <NewDashboard />,
}
```

### 步驟 3: 在 `StartPage.tsx` 中添加儀表板卡片

```typescript
const dashboards: DashboardItem[] = [
  // ... 現有儀表板
  {
    id: 'new-dashboard',
    title: language === 'zh-TW' ? '新儀表板' : 'New Dashboard',
    description: language === 'zh-TW' ? '新儀表板描述' : 'New dashboard description',
    icon: <Dashboard />,
    path: '/dashboard/new-dashboard',
    color: '#63A2B0',
  },
];
```

## 🔍 調試路由

### 檢查路由是否正確配置

```typescript
import { getAllRoutePaths } from '@/config/antigravity-routes.config';

console.log('所有路由路徑:', getAllRoutePaths());
```

### 測試導航

```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function TestNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div>
      <p>當前路徑: {location.pathname}</p>
      <button onClick={() => navigate('/dashboard/junaikey')}>
        前往 JunAiKey 儀表板
      </button>
    </div>
  );
}
```

## 📊 路由狀態

### 已實現的儀表板 (4 個)

1. **JunAiKey 儀表板** - `/dashboard/junaikey`
   - 組件: `JunAiKeyDashboard`
   - 狀態: ✅ 已實現

2. **North Star 儀表板** - `/dashboard/northstar`
   - 組件: `NorthStarDashboard`
   - 狀態: ✅ 已實現

3. **Omni 儀表板** - `/dashboard/omni`
   - 組件: `OmniDashboard`
   - 狀態: ✅ 已實現

4. **ESG 儀表板** - `/dashboard/esg`
   - 組件: `ESGReportCenterPage`
   - 狀態: ✅ 已實現

### 開發中的儀表板 (6 個)

5. **設置儀表板** - `/dashboard/settings`
   - 組件: `PlaceholderDashboard`
   - 狀態: ⏳ 開發中

6. **安全儀表板** - `/dashboard/security`
   - 組件: `PlaceholderDashboard`
   - 狀態: ⏳ 開發中

7. **報告儀表板** - `/dashboard/reports`
   - 組件: `PlaceholderDashboard`
   - 狀態: ⏳ 開發中

8. **用戶儀表板** - `/dashboard/users`
   - 組件: `PlaceholderDashboard`
   - 狀態: ⏳ 開發中

9. **集成儀表板** - `/dashboard/integrations`
   - 組件: `PlaceholderDashboard`
   - 狀態: ⏳ 開發中

10. **監控儀表板** - `/dashboard/monitoring`
    - 組件: `PlaceholderDashboard`
    - 狀態: ⏳ 開發中

## 🎨 佔位符組件

對於尚未實現的儀表板，使用 `PlaceholderDashboard` 組件：

```tsx
const PlaceholderDashboard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>{description}</p>
    <p style={{ color: '#999', marginTop: '20px' }}>
      此儀表板正在開發中...
    </p>
  </div>
);
```

## 📚 相關文檔

- [設計系統文檔](./ANTI_GRAVITY_DESIGN_SYSTEM.md)
- [快速開始指南](./ANTI_GRAVITY_QUICK_START.md)
- [項目結構文檔](./ANTI_GRAVITY_PROJECT_STRUCTURE.md)
- [完整總結文檔](./ANTI_GRAVITY_COMPLETE_SUMMARY.md)

## 🤝 貢獻

如果您想要實現尚未完成的儀表板，請按照以下步驟：

1. 創建儀表板組件
2. 在 `antigravity-router.config.tsx` 中更新路由
3. 在 `antigravity-routes.config.ts` 中更新配置
4. 測試路由是否正常工作

## 📄 許可證

MIT License

---

**Anti-gravity Design System** - 讓您的界面輕盈起來！
