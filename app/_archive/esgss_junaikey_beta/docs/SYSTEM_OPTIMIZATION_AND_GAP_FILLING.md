# ESGss JunAiKey 系統優化完善與缺口補齊方案

## 目錄
1. [現況分析](#現況分析)
2. [效能優化](#效能優化)
3. [UI/UX 改善](#uiux-改善)
4. [功能強化](#功能強化)
5. [程式碼品質](#程式碼品質)
6. [錯誤處理](#錯誤處理)
7. [安全性強化](#安全性強化)
8. [無障礙存取](#無障礙存取)
9. [監控與日誌](#監控與日誌)
10. [國際化支援](#國際化支援)

---

## 現況分析

### 已完成功能清單

| 類別 | 功能 | 狀態 | 行數 |
|------|------|------|------|
| CRM 與專案管理 | CRMProjectManagementPage.tsx | ✅ 完成 | 900+ |
| 代理聯盟分潤 | AgencyAlliancePage.tsx | ✅ 完成 | 1100+ |
| 行政財務管理 | AdministrativeFinancePage.tsx | ✅ 完成 | 950+ |
| 服務流程文件 | CRM/Agency 服務流程 | ✅ 完成 | 850+/1200+ |
| 銷售計畫 | ESGSS_JUNAIKEY_SALES_PLAN.md | ✅ 完成 | 1200+ |

### 缺口識別

```
系統缺口分析：

1. 效能缺口
   ├─ 大型組件無程式碼分割 ✅ 已補齊
   ├─ 缺乏虛擬滾動優化 ⏳ 待處理
   └─ 圖片未優化處理 ⏳ 待處理

2. 功能缺口
   ├─ 無離線支援 ⏳ 待處理
   ├─ 無即時協作功能 ⏳ 待處理
   └─ 無工作流程自動化 ⏳ 待處理

3. 體驗缺口 ✅ 已補齊
   ├─ 載入狀態統一 ✅ 已補齊
   ├─ 統一錯誤邊界 ✅ 已補齊
   └─ 引導教學系統 ✅ 已補齊

4. 品質缺口
   ├─ 部分組件缺 TypeScript 類型 ⏳ 待處理
   └─ 缺少單元測試覆蓋 ⏳ 待處理

5. 安全缺口 ✅ 已補齊
   ├─ Rate Limiting ✅ 已補齊
   ├─ 輸入驗證 ✅ 已補齊
   └─ 敏感資料脫敏 ✅ 已補齊
```

### 2026-02-09 缺口補齊完成

| 缺口項目 | 狀態 | 檔案位置 |
|---------|------|---------|
| ErrorBoundary 統一錯誤邊界 | ✅ 完成 | `src/components/ui/ErrorBoundary.tsx` |
| Toast 通知系統 | ✅ 完成 | `src/components/ui/Toast.tsx` |
| Tour 引導教學 | ✅ 完成 | `src/components/ui/Tour.tsx` |
| Rate Limiting 增強版 | ✅ 完成 | `server/middleware/rateLimitersEnhanced.ts` |
| 輸入驗證工具 | ✅ 完成 | `server/utils/validators.ts` |
| UI 組件匯出整合 | ✅ 完成 | `src/components/ui/index.ts` |

---

## 效能優化

### 1. 程式碼分割策略

```typescript
// 優化前：全部一起載入
const Dashboard = () => import('./pages/Dashboard');

// 優化後：按路由分割
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')),
    loading: <DashboardSkeleton />,
  },
  {
    path: '/reports',
    component: React.lazy(() => import(/* webpackChunkName: "reports" */ './pages/Reports')),
    loading: <ReportSkeleton />,
  },
];
```

### 2. 組件 lazy 載入

```typescript
// 大型頁面採用 lazy loading
const AgencyAlliancePage = React.lazy(() => import('./pages/esg-go/AgencyAlliancePage'));
const CRMProjectManagementPage = React.lazy(() => import('./pages/esg-go/CRMProjectManagementPage'));
const AdministrativeFinancePage = React.lazy(() => import('./pages/admin/AdministrativeFinancePage'));
const SustainabilityReportPage = React.lazy(() => import('./pages/esg/SustainabilityReportPage'));

// 使用 Suspense 包裝
<Suspense fallback={<GlobalLoading />}>
  <Routes>{/* ... */}</Routes>
</Suspense>
```

### 3. 虛擬滾動優化

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// 大型列表使用虛擬滾動
const VirtualizedTable: React.FC<{ data: any[] }> = ({ data }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <TableRow data={data[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. 圖片優化

```typescript
import { Image } from '@unpic/react';

// 使用 Unpic 進行圖片優化
<Image
  src="https://example.com/partner-logo.png"
  layout="constrained"
  width={120}
  height={60}
  alt="合作夥伴標誌"
  loading="lazy"
  decoding="async"
/>

// 響應式圖片
<picture>
  <source srcSet="/image-lg.webp 1200w, /image-md.webp 800w, /image-sm.webp 400w" />
  <img src="/image-lg.jpg" alt="響應式圖片" loading="lazy" />
</picture>
```

### 5. 快取策略

```typescript
// Service Worker 快取策略
const CACHE_STRATEGIES = {
  // 靜態資源：Cache First
  static: {
    strategy: 'CacheFirst',
    cacheName: 'static-resources',
    maxAge: '1 year',
  },
  
  // API 響應：Network First
  api: {
    strategy: 'NetworkFirst',
    cacheName: 'api-cache',
    maxAge: '5 minutes',
    networkTimeout: '10 seconds',
  },
  
  // 使用者資料：Stale While Revalidate
  userData: {
    strategy: 'StaleWhileRevalidate',
    cacheName: 'user-data',
    maxAge: '1 minute',
  },
};
```

---

## UI/UX 改善

### 1. 全域 Loading 狀態

```typescript
// GlobalLoading.tsx
import { Loader2 } from 'lucide-react';

export const GlobalLoading: React.FC = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <div className="absolute inset-0 w-12 h-12 animate-ping text-blue-300 opacity-25" />
      </div>
      <p className="text-gray-700 font-medium">載入中，請稍候...</p>
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-progress" />
      </div>
    </div>
  </div>
);

// CSS 動畫
@keyframes progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}
```

### 2. 統一錯誤邊界

```typescript
// ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // 发送到错误追踪服务
    errorTracker.captureException(error, { extra: errorInfo });
  }
  
  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };
  
  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">發生錯誤</h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || '發生未預期的錯誤，請稍後再試。'}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={20} />
              重新整理
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 3. Toast 通知系統

```typescript
// useToast.ts
import { create } from 'zustand';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Toast 組件
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="text-green-500" />,
    error: <AlertCircle className="text-red-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    info: <Info className="text-blue-500" />,
  };
  
  const bgColors: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[320px] ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1">
            <p className="font-medium text-gray-800">{toast.title}</p>
            {toast.message && (
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};
```

### 4. 互動式引導教學

```typescript
// useTour.ts
import { create } from 'zustand';
import { ReactNode } from 'react';

interface TourStep {
  target: string;
  title: string;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourStore {
  isOpen: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

export const useTour = create<TourStore>((set) => ({
  isOpen: false,
  currentStep: 0,
  steps: [],
  startTour: (steps) => set({ isOpen: true, steps, currentStep: 0 }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),
  endTour: () => set({ isOpen: false, steps: [], currentStep: 0 }),
}));

// 引導步驟範例
const dashboardTourSteps: TourStep[] = [
  {
    target: '#stat-cards',
    title: '數據總覽',
    content: '這裡顯示本月的關鍵指標，包括營收、支出、淨利潤等。',
    position: 'bottom',
  },
  {
    target: '#budget-section',
    title: '預算管理',
    content: '追蹤各部門預算使用情況，確保開支在控制範圍內。',
    position: 'right',
  },
  {
    target: '#quick-actions',
    title: '快捷操作',
    content: '常用功能快速入口，讓您迅速完成日常任務。',
    position: 'left',
  },
];
```

### 5. 深色模式支援

```typescript
// useTheme.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          set({ resolvedTheme: systemTheme });
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          set({ resolvedTheme: theme });
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
    }),
    { name: 'theme-storage' }
  )
);

// 深色模式樣式
@layer base {
  .dark {
    --color-bg-primary: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-bg-tertiary: #334155;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: #94a3b8;
    --color-border: #334155;
  }
}
```

---

## 功能強化

### 1. 離線支援

```typescript
// hooks/useOffline.ts
import { create } from 'zustand';

interface OfflineStore {
  isOnline: boolean;
  pendingActions: Array<{ id: string; action: () => Promise<any> }>;
  setOnline: (status: boolean) => void;
  addPendingAction: (action: () => Promise<any>) => void;
  processPendingActions: () => Promise<void>;
}

export const useOffline = create<OfflineStore>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingActions: [],
  setOnline: (status) => set({ isOnline: status }),
  addPendingAction: (action) =>
    set((state) => ({
      pendingActions: [...state.pendingActions, { id: crypto.randomUUID(), action }],
    })),
  processPendingActions: async () => {
    const { pendingActions } = get();
    for (const { action } of pendingActions) {
      await action();
    }
    set({ pendingActions: [] });
  },
}));

// 監聽網路狀態
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useOffline.getState().setOnline(true));
  window.addEventListener('offline', () => useOffline.getState().setOnline(false));
}
```

### 2. 即時協作功能

```typescript
// hooks/useRealtime.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  color: string;
}

export const useRealtime = (channelId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const channel = supabase.channel(`room:${channelId}`, {
      config: {
        presence: { key: 'user_id' },
      },
    });
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: Collaborator[] = Object.values(state).flat() as Collaborator[];
        setCollaborators(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: userId,
            name: userName,
            color: getRandomColor(),
          });
          setIsConnected(true);
        }
      });
    
    return () => {
      channel.unsubscribe();
    };
  }, [channelId]);
  
  const updateCursor = useCallback((x: number, y: number) => {
    supabase.channel(`room:${channelId}`).track({
      id: userId,
      name: userName,
      cursor: { x, y },
      color: userColor,
    });
  }, [channelId]);
  
  return { collaborators, isConnected, updateCursor };
};
```

### 3. 自動化工作流程

```typescript
// workflows/types.ts
interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
}

type WorkflowTrigger =
  | { type: 'schedule'; cron: string }
  | { type: 'event'; eventName: string }
  | { type: 'webhook'; path: string }
  | { type: 'manual' };

type WorkflowAction =
  | { type: 'send_email'; to: string; template: string }
  | { type: 'create_task'; projectId: string; title: string }
  | { type: 'update_status'; recordId: string; status: string }
  | { type: 'notify_slack'; channel: string; message: string }
  | { type: 'webhook'; url: string; method: string };

// 工作流範例：自動化客戶通知
const customerNotificationWorkflow: Workflow = {
  id: 'wf-customer-notify',
  name: '客戶通知自動化',
  trigger: { type: 'event', eventName: 'order.completed' },
  conditions: [
    { field: 'order.amount', operator: '>', value: 100000 },
  ],
  actions: [
    {
      type: 'send_email',
      to: '{{customer.email}}',
      template: 'order-confirmation',
    },
    {
      type: 'create_task',
      projectId: 'proj-001',
      title: '新訂單客戶 follow-up - {{customer.name}}',
    },
    {
      type: 'notify_slack',
      channel: '#sales',
      message: '🎉 新訂單！{{customer.name}} 購買了 NT${{order.amount}}',
    },
  ],
  isActive: true,
};
```

---

## 程式碼品質

### 1. 統一類型定義

```typescript
// types/common.ts

// 基礎類型
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// 使用者相關
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

// 分頁查詢參數
interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 篩選查詢參數
interface FilterParams<T = Record<string, any>> extends PaginationParams {
  filters?: Partial<T>;
  search?: string;
}

// 通用 CRUD 介面
interface CrudService<T, CreateDto, UpdateDto> {
  findAll(params: FilterParams<T>): Promise<PaginatedResponse<T>>;
  findOne(id: string): Promise<T>;
  create(dto: CreateDto): Promise<T>;
  update(id: string, dto: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### 2. 自訂 Hooks 規範

```typescript
// hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const { immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetcher, onSuccess, onError]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { data, loading, error, refetch: execute };
}
```

### 3. 統一 API 錯誤處理

```typescript
// lib/api-client.ts
import { ApiError } from '@/types/common';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'API Error');
    }
    
    return response.json();
  }
  
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  
  put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

---

## 錯誤處理

### 1. 全域錯誤處理器

```typescript
// lib/error-handler.ts
import { errorTracker } from '@/services/errorTracker';

type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

interface ErrorContext {
  userId?: string;
  userRole?: string;
  pageUrl?: string;
  userAgent?: string;
  timestamp?: string;
  extra?: Record<string, any>;
}

class ErrorHandler {
  private context: ErrorContext = {};
  
  setContext(context: Partial<ErrorContext>) {
    this.context = { ...this.context, ...context };
  }
  
  captureMessage(message: string, level: ErrorLevel = 'info') {
    errorTracker.captureMessage(message, {
      level,
      ...this.context,
    });
  }
  
  captureException(error: Error, extra?: Record<string, any>) {
    errorTracker.captureException(error, {
      ...this.context,
      ...extra,
    });
  }
  
  captureBreadcrumb(category: string, message: string, data?: Record<string, any>) {
    errorTracker.addBreadcrumb({
      category,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
  
  // 處理 Promise rejection
  init() {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      this.captureException(error, {
        reason: 'unhandledrejection',
      });
    });
    
    window.addEventListener('error', (event) => {
      if (event.error) {
        this.captureException(event.error, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    });
  }
}

export const errorHandler = new ErrorHandler();
```

### 2. 表單驗證

```typescript
// lib/validation.ts
import { z } from 'zod';

// Zod 驗證 schema
export const partnerSchema = z.object({
  name: z.string().min(2, '姓名至少2個字'),
  email: z.string().email('請輸入有效的電子郵件'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  company: z.string().optional(),
  type: z.enum(['individual', 'agency', 'enterprise', 'consultant']),
  level: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']),
});

export const commissionSchema = z.object({
  partnerId: z.string().uuid('無效的合作夥伴 ID'),
  orderAmount: z.number().positive('訂單金額必須為正數'),
  commissionRate: z.number().min(0).max(1),
  description: z.string().optional(),
});

// 使用 Hook
export function usePartnerForm() {
  const form = useForm({
    schema: partnerSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      type: 'individual',
      level: 'bronze',
    },
  });
  
  return form;
}
```

---

## 安全性強化

### 1. Rate Limiting

```typescript
// middleware/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 創建 rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

export async function rateLimitMiddleware(
  request: Request,
  identifier: string
): Promise<Response | null> {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': '60',
      },
    });
  }
  
  return null;
}
```

### 2. 輸入消毒

```typescript
// lib/sanitization.ts
import DOMPurify from 'isomorphic-dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
}

const defaultOptions: SanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  allowedAttributes: {
    '*': ['class'],
    'a': ['href', 'target'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  return DOMPurify.sanitize(html, {
    ...defaultOptions,
    ...options,
  });
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // 移除 <> 標籤
    .replace(/javascript:/gi, '') // 移除 javascript: 協議
    .replace(/on\w+=/gi, '') // 移除事件處理器
    .trim();
}

// SQL 注入防護（使用參數化查詢）
export async function safeQuery(
  query: string,
  params: any[]
): Promise<any[]> {
  // 假設使用 Prisma 或類似的 ORM
  return prisma.$queryRawUnsafe(query, ...params);
}
```

### 3. 敏感資料脫敏

```typescript
// lib/data-masking.ts
interface MaskingOptions {
  showFirst?: number;
  showLast?: number;
  maskChar?: string;
}

export function maskEmail(email: string, options: MaskingOptions = {}): string {
  const { showFirst = 2, showLast = 2, maskChar = '*' } = options;
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, showFirst) + maskChar.repeat(Math.max(0, local.length - showFirst - showLast)) + local.slice(-showLast);
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string, options: MaskingOptions = {}): string {
  const { showFirst = 4, showLast = 4, maskChar = '*' } = options;
  return phone.slice(0, showFirst) + maskChar.repeat(Math.max(0, phone.length - showFirst - showLast)) + phone.slice(-showLast);
}

export function maskIdNumber(idNumber: string): string {
  return idNumber.slice(0, 4) + '****' + idNumber.slice(-2);
}

export function maskBankAccount(account: string): string {
  const showFirst = 4;
  const showLast = 4;
  return account.slice(0, showFirst) + '****' + account.slice(-showLast);
}
```

---

## 無障礙存取

### 1. 鍵盤導航

```typescript
// components/ui/AccessibleMenu.tsx
import { useEffect, useRef } from 'react';

interface AccessibleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AccessibleMenu: React.FC<AccessibleMenuProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const focusableElements = useRef<HTMLElement[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      // 獲取所有可聚焦元素
      focusableElements.current = Array.from(
        menuRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || []
      );
      
      // 聚焦第一個元素
      focusableElements.current[0]?.focus();
      
      // 鎖定 body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'Tab') {
        const first = focusableElements.current[0];
        const last = focusableElements.current[focusableElements.current.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="選單"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
```

### 2. 螢幕閱讀器支援

```typescript
// components/ui/ScreenReaderOnly.tsx
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
}) => (
  <span className="sr-only">{children}</span>
);

// 使用範例
<button
  onClick={handleDelete}
  aria-label="刪除專案"
  aria-describedby="delete-confirm"
>
  <Trash2 size={20} />
</button>
<span id="delete-confirm" className="sr-only">
  刪除後將無法恢復，確定要刪除嗎？
</span>
```

### 3. 高對比度支援

```typescript
// styles/accessibility.css
@media (prefers-contrast: more) {
  :root {
    --color-primary: #0000ff;
    --color-secondary: #666666;
    --color-border: #000000;
    --color-text: #000000;
    --color-background: #ffffff;
  }
  
  .btn-primary {
    border: 2px solid currentColor;
  }
  
  input,
  select,
  textarea {
    border: 2px solid currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 監控與日誌

### 1. 效能監控

```typescript
// lib/performance.ts
interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  
  measureLCP() {
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
    if (lcp) {
      const value = lcp.startTime;
      this.recordMetric({
        name: 'LCP',
        value,
        rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
      });
    }
  }
  
  measureFID() {
    const fid = performance.getEntriesByType('first-input')[0] as PerformanceEventTiming;
    if (fid) {
      const value = fid.processingStart - fid.startTime;
      this.recordMetric({
        name: 'FID',
        value,
        rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
      });
    }
  }
  
  measureCLS() {
    const cls = performance.getEntriesByType('layout-shift') as PerformanceEntry[];
    const totalCLS = cls.reduce((sum, entry) => sum + (entry as any).value, 0);
    
    this.recordMetric({
      name: 'CLS',
      value: totalCLS,
      rating: totalCLS < 0.1 ? 'good' : totalCLS < 0.25 ? 'needs-improvement' : 'poor',
    });
  }
  
  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // 发送到监控服务
    analytics.trackPerformance(metric);
    
    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
  
  getReport() {
    return this.metrics;
  }
}

export const perfMonitor = new PerformanceMonitor();
```

### 2. 使用者行為追蹤

```typescript
// lib/analytics.ts
interface EventProperties {
  [key: string]: string | number | boolean;
}

interface UserJourney {
  timestamp: string;
  page: string;
  action: string;
  properties?: EventProperties;
}

class Analytics {
  private journey: UserJourney[] = [];
  private userId: string;
  private sessionId: string;
  
  constructor() {
    this.userId = this.getOrCreateUserId();
    this.sessionId = this.getOrCreateSessionId();
  }
  
  trackPageView(page: string, properties?: EventProperties) {
    this.journey.push({
      timestamp: new Date().toISOString(),
      page,
      action: 'page_view',
      properties,
    });
    
    // 发送到分析服务
    this.send('page_view', { page, ...properties });
  }
  
  trackEvent(action: string, properties?: EventProperties) {
    this.journey.push({
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action,
      properties,
    });
    
    this.send(action, properties);
  }
  
  private async send(event: string, properties?: EventProperties) {
    // 发送到 Google Analytics / Mixpanel 等
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          properties,
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  
  getJourney() {
    return this.journey;
  }
}

export const analytics = new Analytics();
```

---

## 國際化支援

### 1. i18n 配置

```typescript
// i18n/config.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯資源
const resources = {
  'zh-TW': {
    translation: {
      common: {
        loading: '載入中...',
        save: '儲存',
        cancel: '取消',
        delete: '刪除',
        edit: '編輯',
        confirm: '確認',
        search: '搜尋',
        filter: '篩選',
        export: '匯出',
        import: '匯入',
      },
      dashboard: {
        title: '儀表板',
        welcome: '歡迎回來',
        overview: '總覽',
        recentActivity: '最近活動',
      },
      finance: {
        revenue: '營收',
        expenses: '支出',
        profit: '利潤',
        budget: '預算',
        invoice: '發票',
        payroll: '薪資',
      },
    },
  },
  'en-US': {
    translation: {
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back',
        overview: 'Overview',
        recentActivity: 'Recent Activity',
      },
      finance: {
        revenue: 'Revenue',
        expenses: 'Expenses',
        profit: 'Profit',
        budget: 'Budget',
        invoice: 'Invoice',
        payroll: 'Payroll',
      },
    },
  },
};

// 初始化 i18n
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    supportedLngs: ['zh-TW', 'en-US'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18next;
```

### 2. 數字與日期格式化

```typescript
// lib/formatters.ts
const numberFormatters: Record<string, Intl.NumberFormat> = {
  'zh-TW': new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }),
  'en-US': new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }),
};

const dateFormatters: Record<string, Intl.DateTimeFormat> = {
  'zh-TW': new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }),
  'en-US': new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }),
};

export function formatCurrency(
  amount: number,
  locale: string = 'zh-TW'
): string {
  return numberFormatters[locale]?.format(amount) || amount.toLocaleString();
}

export function formatDate(
  date: Date | string,
  locale: string = 'zh-TW'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateFormatters[locale]?.format(d) || d.toLocaleDateString();
}

export function formatRelativeTime(
  date: Date | string,
  locale: string = 'zh-TW'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (Math.abs(minutes) < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (Math.abs(hours) < 24) {
    return rtf.format(-hours, 'hour');
  } else {
    return rtf.format(-days, 'day');
  }
}
```

---

## 實施優先順序

```
優化項目優先順序：

P0 - 高優先（立即實施）✅ 已完成
├─ 全域錯誤邊界 ✅ 已完成
├─ Toast 通知系統 ✅ 已完成
├─ Loading 狀態優化 ✅ 已完成
├─ API 錯誤處理 ✅ 已完成
└─ 敏感性資料脫敏 ✅ 已完成

P1 - 中優先（2 週內完成）✅ 已完成
├─ 深色模式支援 ✅ 已完成
├─ Rate Limiting ✅ 已完成
├─ 表單驗證 ✅ 已完成
├─ 程式碼分割 ✅ 已完成
└─ 無障礙鍵盤導航 ✅ 已完成

P2 - 低優先（持續優化）⏳ 待處理
├─ 國際化支援 ⏳ 待處理
├─ 離線功能 ⏳ 待處理
├─ 即時協作 ⏳ 待處理
├─ 效能監控 ⏳ 待處理
└─ 自動化工作流程 ⏳ 待處理
```

---

## 2026-02-09 缺口補齊實作

### 新增檔案清單

| 檔案路徑 | 功能說明 | 行數 |
|---------|---------|------|
| `src/components/ui/ErrorBoundary.tsx` | 統一錯誤邊界組件 | 300+ |
| `src/components/ui/Toast.tsx` | Toast 通知系統 | 400+ |
| `src/components/ui/Tour.tsx` | 互動式引導教學 | 450+ |
| `server/middleware/rateLimitersEnhanced.ts` | 增強版 Rate Limiting | 250+ |
| `server/utils/validators.ts` | 輸入驗證工具 | 500+ |

### 使用範例

#### ErrorBoundary 使用

```tsx
import { ErrorBoundary } from '@/components/ui';

// 包裝整個應用
const App = () => (
  <ErrorBoundary 
    onError={(error, errorInfo) => {
      console.error('App Error:', error);
      // 發送到錯誤追蹤服務
    }}
  >
    <MainContent />
  </ErrorBoundary>
);

// 或使用自定義 fallback
const AppWithCustomFallback = () => (
  <ErrorBoundary 
    fallback={<CustomErrorPage />}
  >
    <MainContent />
  </ErrorBoundary>
);
```

#### Toast 通知使用

```tsx
import { toast, ToastContainer } from '@/components/ui';

// 在 App 根元件中放置 ToastContainer
const App = () => (
  <>
    <MainContent />
    <ToastContainer position="top-right" />
  </>
);

// 使用 toast 通知
const MyComponent = () => {
  const handleSuccess = () => {
    toast.success('操作成功', '資料已成功儲存');
  };
  
  const handleError = () => {
    toast.error('發生錯誤', '請稍後再試');
  };
  
  const handleWarning = () => {
    toast.warning('提醒', '請注意以下事項');
  };
  
  const handleInfo = () => {
    toast.info('通知', '系統將於今晚進行維護');
  };
  
  return (
    <button onClick={handleSuccess}>Success</button>
    <button onClick={handleError}>Error</button>
    <button onClick={handleWarning}>Warning</button>
    <button onClick={handleInfo}>Info</button>
  );
};
```

#### Tour 引導使用

```tsx
import { TourController, useTour } from '@/components/ui';

const dashboardTour = {
  id: 'dashboard-tour',
  name: '系統導覽',
  description: '快速了解系統主要功能',
  steps: [
    {
      target: '#nav-sidebar',
      title: '導航選單',
      content: '左側選單包含所有系統功能，包括首頁、專案管理、數據分析等。',
      position: 'right',
    },
    {
      target: '#dashboard-stats',
      title: '數據總覽',
      content: '這裡顯示本月的關鍵指標，包括營收、支出、淨利潤等。',
      position: 'bottom',
    },
    {
      target: '#quick-actions',
      title: '快捷操作',
      content: '常用功能快速入口，讓您迅速完成日常任務。',
      position: 'left',
    },
  ],
};

const DashboardPage = () => (
  <>
    <DashboardContent />
    <TourController tour={dashboardTour} />
  </>
);

// 或手動控制 tour
const MyPage = () => {
  const { startTour, endTour, nextStep, prevStep } = useTour();
  
  return (
    <div>
      <button onClick={() => startTour(myTourSteps)}>開始導覽</button>
      <button onClick={endTour}>結束導覽</button>
      
      <TourTooltip />
    </div>
  );
};
```

#### Rate Limiting 使用

```typescript
import { 
  apiRateLimiter,
  readLimiter,
  writeLimiter,
  sensitiveOperationLimiter,
  aiChatLimiter,
  createCustomRateLimiter,
} from '@/middleware/rateLimitersEnhanced';

// 在 Express 路由中使用
import express from 'express';
const router = express.Router();

// API 路由 - 一般限制
router.get('/api/data', apiRateLimiter, getDataHandler);

// 讀取密集型路由
router.get('/api/reports', readLimiter, getReportsHandler);

// 寫入路由
router.post('/api/data', writeLimiter, createDataHandler);

// 敏感操作路由
router.post('/api/auth/login', sensitiveOperationLimiter, loginHandler);
router.post('/api/auth/reset-password', sensitiveOperationLimiter, resetPasswordHandler);

// AI Chat 路由
router.post('/api/ai/chat', aiChatLimiter, chatHandler);

// 自定義限制器
const customLimiter = createCustomRateLimiter({
  windowMs: 60 * 1000, // 1 分鐘
  max: 10,
  message: '自定義限制已超出',
});
router.get('/api/custom', customLimiter, customHandler);
```

#### 輸入驗證使用

```typescript
import { 
  validateEmail,
  validatePassword,
  validateTaiwanPhone,
  sanitizeInput,
  xssFilter,
  validateObject,
  emailSchema,
} from '@/utils/validators';

// 單一欄位驗證
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  
  // 驗證電子郵件
  const emailResult = validateEmail(email);
  if (!emailResult.success) {
    return res.status(400).json({
      success: false,
      errors: emailResult.errors,
    });
  }
  
  // 驗證密碼
  const passwordResult = validatePassword(password);
  if (!passwordResult.success) {
    return res.status(400).json({
      success: false,
      errors: passwordResult.errors,
    });
  }
  
  // 驗證通過，繼續處理
  // ...
};

// 使用 Zod Schema 驗證物件
const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().regex(/^09\d{8}$/),
});

const createUserHandler = async (req, res) => {
  const result = validateObject(createUserSchema, req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.errors,
    });
  }
  
  const validatedData = result.data;
  // 使用 validatedData 進行後續處理
};

// 輸入消毒
const sanitizeHandler = (req, res) => {
  const sanitizedBody = sanitizeRequestBody(req.body, {
    trim: true,
    escapeHtml: true,
  });
  
  // 使用消毒後的資料
};

// XSS 過濾
const xssHandler = (req, res) => {
  const userInput = req.body.content;
  
  if (detectXss(userInput)) {
    return res.status(400).json({
      success: false,
      error: '輸入包含潛在危險內容',
    });
  }
  
  const safeInput = xssFilter(userInput);
  // 使用安全的輸入
};
```

---

**文件資訊**
- 版本：v1.1
- 日期：2025 年 2 月
- 更新：2026 年 2 月 9 日 - 缺口補齊
- 撰寫：ESGss JunAiKey 技術團隊

**下次審核：2026 年 Q1**
