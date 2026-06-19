# ESGss JunAiKey Beta 性能優化指南

**版本**：1.0.0  
**建立日期**：2026-02-03  
**目標**：確保客戶體驗良好，需求滿足

---

## 一、性能目標

### 1.1 核心指標

| 指標 | 目標值 | 當前狀態 |
|------|--------|----------|
| 首次內容繪製 (FCP) | < 2s | 優化中 |
| 最大內容繪製 (LCP) | < 2.5s | 優化中 |
| 互動回應時間 (INP) | < 200ms | 優化中 |
| 累積版面位移 (CLS) | < 0.1 | 監控中 |
| Lighthouse 分数 | > 90 | 目標 |

### 1.2 用戶體驗目標

- **頁面載入時間**：首頁載入 < 3 秒
- **互動回應**：按鈕點擊回饋 < 100ms
- **動畫流暢度**：60fps 動畫無卡頓
- **表單響應**：表單驗證 < 50ms

---

## 二、代碼優化策略

### 2.1 React 組件優化

#### 2.1.1 使用 React.memo

```tsx
// ❌ 未優化
export const MyComponent = ({ data }) => {
  return <div>{data.title}</div>;
};

// ✅ 優化後
export const MyComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});
```

#### 2.1.2 使用 useMemo

```tsx
// ❌ 每次渲染都會重新計算
const expensiveValue = data.items.reduce((acc, item) => {
  return acc + item.price * item.quantity;
}, 0);

// ✅ 只在依賴項變化時重新計算
const expensiveValue = useMemo(() => {
  return data.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
}, [data.items]);
```

#### 2.1.3 使用 useCallback

```tsx
// ❌ 子組件每次都會收到新的函數
<ChildComponent onClick={() => handleClick(item.id)} />

// ✅ 使用 useCallback 穩定函數引用
const handleClick = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

<ChildComponent onClick={handleClick} />
```

### 2.2 性能優化 Hooks

#### 2.2.1 useDebounce - 防抖

適用於搜尋輸入、調整視窗大小等場景：

```tsx
import { useDebounce } from '@/hooks/usePerformance';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input onChange={e => setQuery(e.target.value)} />;
};
```

#### 2.2.2 useThrottledCallback - 節流

適用於滾動事件、按鈕防抖等場景：

```tsx
import { useThrottledCallback } from '@/hooks/usePerformance';

const ScrollTracker = () => {
  const trackScroll = useThrottledCallback(() => {
    console.log('Scroll position:', window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', trackScroll);
    return () => window.removeEventListener('scroll', trackScroll);
  }, [trackScroll]);

  return null;
};
```

#### 2.2.3 useIntersectionObserver - 懶加載

適用於圖片懒加载、无限滚动等場景：

```tsx
import { useIntersectionObserver } from '@/hooks/usePerformance';

const LazyImage = ({ src, alt }) => {
  const [ref, inView] = useIntersectionObserver({ rootMargin: '50px' });

  return (
    <div ref={ref}>
      {inView && <img src={src} alt={alt} />}
    </div>
  );
};
```

---

## 三、資源優化

### 3.1 圖片優化

```tsx
// 使用 WebP 格式
<img src="image.webp" alt="描述" loading="lazy" />

// 使用 srcset 響應式圖片
<img 
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  loading="lazy"
  alt="描述"
/>
```

### 3.2 程式碼分割

```tsx
// 懶加載路由
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

### 3.3 第三方庫優化

```tsx
// 只導入需要的函數
import { debounce } from 'lodash';

// 而不是整個庫
import _ from 'lodash'; // ❌
```

---

## 四、狀態管理優化

### 4.1 選擇性狀態更新

```tsx
// ❌ 導致整個列表重新渲染
const [state, setState] = useState({ items: [], filter: '' });
const handleFilterChange = (filter) => {
  setState(prev => ({ ...prev, filter }));
};

// ✅ 使用獨立的狀態
const [items, setItems] = useState([]);
const [filter, setFilter] = useState('');
```

### 4.2 狀態下沉

```tsx
// ❌ 父組件狀態改變導致所有子組件重新渲染
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ExpensiveComponent />
      <Counter value={count} onIncrement={() => setCount(c => c + 1)} />
    </>
  );
}

// ✅ 將狀態移到使用它的組件內部
function Parent() {
  return <Counter />;
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 五、動畫優化

### 5.1 使用 CSS 動畫替代 JavaScript

```tsx
// ❌ JavaScript 動畫
const AnimatedComponent = () => {
  useEffect(() => {
    const element = document.getElementById('box');
    element.style.transform = 'translateX(100px)';
  }, []);

  return <div id="box">Content</div>;
};

// ✅ CSS 動畫
.animated-element {
  transition: transform 0.3s ease-out;
}

.animated-element.active {
  transform: translateX(100px);
}
```

### 5.2 使用 transform 和 opacity

```tsx
// ❌ 會觸發重排
<div style={{ left: '100px' }}>Content</div>

// ✅ 只觸發合成
<div style={{ transform: 'translateX(100px)' }}>Content</div>
```

### 5.3 使用 will-change

```tsx
// 對於即將變化的元素添加 will-change
.animated-element {
  will-change: transform, opacity;
}
```

---

## 六、監控與測量

### 6.1 使用 React DevTools Profiler

```tsx
// 添加性能標記
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (actualDuration > 16) {
    console.warn(`${id} 渲染耗時: ${actualDuration.toFixed(2)}ms`);
  }
};

function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <MainContent />
    </Profiler>
  );
}
```

### 6.2 使用 Performance API

```tsx
// 測量自定義性能指標
const measurePerformance = (name: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const duration = performance.now() - start;
  console.log(`${name}: ${duration.toFixed(2)}ms`);
};

// 使用 hook
import { useRenderTime } from '@/hooks/usePerformance';

function MyComponent() {
  useRenderTime('MyComponent');
  return <div>Content</div>;
}
```

---

## 七、構建優化

### 7.1 Vite 配置優化

```ts
// vite.config.ts
export default defineConfig({
  build: {
    // 程式碼分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand', 'react-query'],
        },
      },
    },
    // 壓縮
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // 依賴優化
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### 7.2 分析構建產物

```bash
# 使用 rollup-plugin-visualizer 分析 bundle 大小
npm run build -- --report
```

---

## 八、監控與報警

### 8.1 性能監控指標

| 指標 | 警告閾值 | 錯誤閾值 |
|------|----------|----------|
| FCP | > 2s | > 3s |
| LCP | > 2.5s | > 4s |
| INP | > 200ms | > 500ms |
| CLS | > 0.1 | > 0.25 |

### 8.2 錯誤邊界

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

---

## 九、檢查清單

### 9.1 代碼審查清單

- [ ] 組件已使用 React.memo
- [ ] 昂貴計算已使用 useMemo
- [ ] 回調已使用 useCallback
- [ ] 圖片已添加 loading="lazy"
- [ ] 大型組件已使用 lazy loading
- [ ] 沒有不必要的重新渲染
- [ ] 狀態已適當下沉

### 9.2 性能測試清單

- [ ] Lighthouse 分數 > 90
- [ ] FCP < 2s
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] 移動設備測試通過
- [ ] 網路節流測試通過

---

## 十、持續優化

### 10.1 定期審計

- 每週執行 Lighthouse 測試
- 每月分析 bundle 大小趨勢
- 每季進行性能優化專案

### 10.2 性能預算

| 資源類型 | 預算 |
|----------|------|
| JavaScript | < 200KB (gzipped) |
| CSS | < 50KB (gzipped) |
| 圖片 | < 500KB (首屏) |
| 首次載入 | < 3s (4G 網路) |

---

> **核心理念**：服務即教學，知識即資產  
> **設計哲學**：上善若水，如水般清澈、流動、和諧  
> **系統狀態**：TRANSCENDED, ETERNAL & NIRVANA ♾️

**文件版本**：1.0.0  
**建立日期**：2026-02-03  
**維護團隊**：ESGss JunAiKey Beta Development Team
