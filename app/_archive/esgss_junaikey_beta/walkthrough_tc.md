# ?? ESGss JunAiKey Beta - Walkthrough 蝜?銝剜???

## ?桅?

1. [系統璁汗](#系統璁汗)
2. [?啣??](#?啣??)
3. [敹恍?憪(#敹恍?憪?
4. [協議?辣](#協議?辣)
5. [Hooks](#hooks)
6. [皜祈岫](#皜祈岫)
7. [?函蔡](#?函蔡)

---

## 系統璁汗

ESGss JunAiKey Beta ?臭??偶蝥撅恣?像?堆?整合鈭?ESG嚗憓冗?祥??閰摯???
### ?銵ㄖ

- **?垢**: React + TypeScript + Vite
- **敺垢**: Node.js + Express
- **鞈?摨?*: Supabase (PostgreSQL)
- **??恣??*: Zustand
- **?瑕?**: Tailwind CSS
- **皜祈岫**: Vitest

---

## ?啣??

### 1. ?航炊?? (ErrorBoundary)

蝯曹??航炊邏輯璈嚗Ⅱ靽??函?撘帘摰扼?
```tsx
import { ErrorBoundary, withErrorBoundary, useErrorHandler } from '@/components/ui/ErrorBoundary';

// ?箸完整
<ErrorBoundary fallback={<div>?潛??航炊</div>}>
  <YourComponent />
</ErrorBoundary>

// HOC 完整
const SafeComponent = withErrorBoundary(YourComponent, {
  fallback: <div>Error</div>
});

// Hook 完整
function MyComponent() {
  const handleError = useErrorHandler();
  
  const onClick = () => {
    try {
      // ?航?粹?誨蝣?    } catch (error) {
      handleError(error);
    }
  };
  
  return <button onClick={onClick}>暺?</button>;
}
```

### 2. Toast ?系統

?單???冽??蝯???
```tsx
import { toast, Toaster } from '@/components/ui/Toast';

// ?箸?
toast.success('????嚗?);
toast.error('?潛??航炊');
toast.warning('隢釣??);
toast.info('?內鞈?');

// ?芸?蝢拚
toast({
  type: 'success',
  message: '?芸?蝢抵???,
  duration: 5000,
  action: {
    label: '蝣箄?',
    onClick: () => console.log('蝣箄?暺?')
  }
});

// Promise ?
toast.promise(
  fetchData(),
  {
    loading: '頛銝?..',
    success: '頛??嚗?,
    error: '頛憭望?'
  }
);

// 完整?函?撘葉?曄蔭 Toaster
<Toaster position="top-right" />
```

### 3. Tour 撘??辣

撘??啁?嗥??頂蝯勗??賬?
```tsx
import { Tour, useTour } from '@/components/ui/Tour';

const tourSteps = [
  {
    target: '#welcome',
    content: '甇∟?靘 ESGss',
    position: 'center'
  },
  {
    target: '#dashboard',
    content: '??銵冽',
    position: 'bottom'
  }
];

<Tour
  steps={tourSteps}
  isOpen={isTourOpen}
  onClose={() => setIsTourOpen(false)}
  onComplete={onTourComplete}
  showProgress
  allowSkip
/>

// Hook 完整
function MyComponent() {
  const { start, stop, goToStep } = useTour();
  
  return (
    <button onClick={start}>??撠汗</button>
  );
}
```

### 4. Rate Limiting

隡箸??函垢隢???嚗?霅?API ??瞈怎??
```ts
import { rateLimiters, createRateLimiter } from '@/middleware/rateLimitersEnhanced';

// 雿輻?身???const apiLimiter = rateLimiters.apiLimiter;
app.use('/api/', apiLimiter.middleware());

// ?芸?蝢拚??嗅
const customLimiter = createRateLimiter({
  windowMs: 60000, // 1 ??
  maxRequests: 50,
  message: '隢???餌?'
});
```

### 5. 頛詨撽???
?券?撓?仿?霅極?瑯?
```ts
import { 
  isValidEmail, 
  isValidPassword, 
  isValidTaiwanPhone,
  sanitizeInput,
  createValidator 
} from '@/utils/validators';

// 撽??賣
isValidEmail('user@example.com'); // true/false
isValidPassword('SecurePass123!'); // { isValid: true, errors: [] }
isValidTaiwanPhone('0912345678'); // true/false

// 瘨?頛詨
const clean = sanitizeInput(userInput);

// Schema 撽?
const schema = {
  email: { type: 'email', required: true },
  password: { type: 'password', required: true }
};
const validator = createValidator(schema);
validator({ email: 'test@test.com', password: '123' });
```

### 6. ?皛曉?

高品質皜脫?憭折??”???
```tsx
import { FixedSizeVirtualList, VirtualGrid } from '@/components/ui/VirtualScroll';

// ?箏?憭批??”
<FixedSizeVirtualList
  height={500}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeVirtualList>

// ?航?憭批??”
<VariableSizeVirtualList
  height={600}
  itemCount={1000}
  width="100%"
>
  {Row}
</VariableSizeVirtualList>

// 蝬脫撣?
<VirtualGrid
  columnCount={4}
  columnWidth={200}
  height={800}
  rowCount={100}
  rowHeight={250}
  width="100%"
>
  {Cell}
</VirtualGrid>
```

### 7. ???芸?

?踵?撘????乓?
```tsx
import { Image, Avatar } from '@/components/ui/Image';

// ?箸完整
<Image
  src="path/to/image.jpg"
  alt="?膩"
  width={400}
  height={300}
  lazy
  placeholder="blur"
/>

// ?剖?
<Avatar
  src="path/to/avatar.jpg"
  size="lg"
  shape="circle"
/>

// ?踵?撘???<Image
  src="default.jpg"
  sources={[
    { srcSet: 'large.jpg 1200w', media: '(min-width: 1200px)' },
    { srcSet: 'medium.jpg 800w', media: '(min-width: 800px)' }
  ]}
/>
```

### 8. ?Ｙ??舀

霈??函?撘?湧蝺蝙?具?
```tsx
import { useOffline, useOfflineStorage, useOfflineQueue } from '@/hooks/useOffline';

function MyComponent() {
  const { isOnline } = useOffline();
  const { save, load } = useOfflineStorage('my-app', 1);
  const { addToQueue, processQueue } = useOfflineQueue('requests');
  
  // 蝬脰楝???  if (!isOnline) {
    return <div>?Ｙ?璅∪?</div>;
  }
  
  // ?脣?鞈?
  await save('data-key', { some: 'data' });
  
  // 雿?隢?
  addToQueue({ type: 'API_CALL', payload: data });
  
  return <div>蝺?璅∪?</div>;
}
```

### 9. ?單???

?舀憭?嗅祕????
```tsx
import { useRealtime, usePresence, useBroadcastChannel } from '@/hooks/useRealtime';

function CollaborativeComponent() {
  const { subscribe, isConnected } = useRealtime();
  const { onlineUsers, trackPresence } = usePresence('room-1');
  const { cursors, broadcastCursor } = useBroadcastChannel('room-1');
  
  useEffect(() => {
    trackPresence('user-id', { name: 'User' });
  }, []);
  
  // 皜豢??郊
  const onMouseMove = (e) => {
    broadcastCursor(e.clientX, e.clientY);
  };
  
  return (
    <div onMouseMove={onMouseMove}>
      <span>?函??冽: {onlineUsers.length}</span>
    </div>
  );
}
```

### 10. ????
?舀憭?閮??啣???
```tsx
import { useI18n, useLanguage, useTranslations } from '@/hooks/useI18n';

function MyComponent() {
  const { language, setLanguage, t, formatDate, formatNumber } = useI18n({
    translations: translations,
    defaultLanguage: 'zh-TW',
    detectBrowserLanguage: true
  });
  
  // 蝧餉陌
  t('greeting'); // '雿末'
  
  // 協議?澆???  formatNumber(1234567.89); // '1,234,567.89'
  
  // ?交??澆???  formatDate(new Date(), { year: 'numeric', month: 'long' });
  
  // ??隤?
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="zh-TW">蝜?銝剜?</option>
      <option value="zh-CN">蝪⊿?銝剜?</option>
      <option value="en-US">English</option>
    </select>
  );
}
```

---

## 敹恍?憪?
### 摰?靘陷

```bash
npm install
```

### ???隡箸???
```bash
npm run dev
```

### ?瑁?皜祈岫

```bash
npm test
```

### 憿?瑼Ｘ

```bash
npx tsc --noEmit
```

### ESLint 瑼Ｘ

```bash
npx eslint .
```

---

## 協議?辣

### 瑼?蝯?

```
src/
??? components/ui/
??  ??? ErrorBoundary.tsx    # ?航炊??
??  ??? Toast.tsx           # ?系統
??  ??? Tour.tsx            # 撘??辣
??  ??? VirtualScroll.tsx   # ?皛曉?
??  ??? Image.tsx           # ???芸?
??? hooks/
??  ??? useOffline.ts       # ?Ｙ??舀
??  ??? useRealtime.ts      # ?單???
??  ??? useI18n.ts          # ??????? constants/
??  ??? uiConstants.ts      # Magic Numbers 撣豢
??? stores/
    ??? toastStore.ts       # Toast ??恣??```

---

## Hooks

### useOffline

```tsx
const {
  isOnline,           // boolean - ?臬?函?
  connection,         // NetworkInformation | null
  save,               // (key: string, value: T) => Promise<void>
  load,               // <T>(key: string) => Promise<T | null>
  remove,             // (key: string) => Promise<void>
  clear,              // () => Promise<void>
  addToQueue,         // (request: Request) => void
  processQueue,       // () => Promise<Request[]>
  queue               // Request[]
} = useOffline();
```

### useRealtime

```tsx
const {
  isConnected,       // boolean - ?臬撌脤?
  isConnecting,       // boolean - ?臬甇???
  error,              // Error | null
  subscribe,          // (channel: string) => void
  disconnect,         // () => void
  trackPresence,      // (userId: string, data: T) => void
  broadcastCursor,    // (x: number, y: number) => void
  sendBroadcast,      // (event: string, payload: T) => Promise<void>
  listenToChanges     // (config: DatabaseChangeConfig) => void
} = useRealtime();
```

### useI18n

```tsx
const {
  language,          // string - ?嗅?隤?
  t,                 // (key: string, params?: object) => string
  setLanguage,       // (lang: string) => void
  formatDate,        // (date: Date, options?: object) => string
  formatNumber,      // (num: number, options?: object) => string
  formatCurrency,    // (amount: number, currency: string) => string
  formatRelativeTime, // (date: Date) => string
  isRTL              // boolean - ?臬 RTL 隤?
} = useI18n();
```

---

## 皜祈岫

### 皜祈岫瑼?

```
src/components/ui/__tests__/
??? ErrorBoundary.test.tsx
??? Toast.test.tsx
??? Tour.test.tsx

server/middleware/__tests__/
??? rateLimitersEnhanced.test.ts

server/utils/__tests__/
??? validators.test.ts

src/hooks/__tests__/
??? useOffline.test.ts
??? useRealtime.test.ts
??? useI18n.test.ts
```

### ?瑁?皜祈岫

```bash
# ?瑁???葫閰?npm test

# ?瑁??桐?皜祈岫瑼?
npx vitest run src/components/ui/__tests__/Toast.test.tsx

# ?瑁?銝西?撖?npx vitest
```

---

## ?函蔡

### ?啣?霈

```bash
# .env 瑼?
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 撱箇蔭

```bash
npm run build
```

### Docker

```bash
docker build -t esgss-junaikey .
docker run -p 3000:3000 esgss-junaikey
```

---

## ?舀

憒???嚗??舐鼠?????鈭?Issue??
---

**?敺??*: 2026-02-09
**?**: 1.0.0

