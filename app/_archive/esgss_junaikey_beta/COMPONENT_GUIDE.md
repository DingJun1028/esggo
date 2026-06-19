# 元件???

**?**: v1.0  
**?敺??*: 2026-02-06

---

## 閮剛?系統閬?

### 銝駁???
- **銝餉**: `#63A2B0` (Aqua Cyan)
- **???*: `#0a0f0f` (瘛梯?)
- **撘瑁矽??*: `#0df2df` (鈭桅???

### 閮剛???

1. **?餌?????(Glassmorphism)** - 雿輻 `backdrop-blur` ??透明?
2. **瞍貉???** - 雿輻 `bg-gradient-to-br`
3. **????** - 雿輻 `shadow-[0_0_30px_rgba(...)]`

---

## EntropyForge 元件?瘚?

### 1. ?萄遣元件撉冽

```typescript
import React from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const handleClick = () => {
    omniLogger.info(LogCategory.UI, 'Component clicked', { component: 'MyComponent' });
    onAction?.();
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

export default MyComponent;
```

### 2. 瘛餃????

```typescript
import { motion } from 'framer-motion';

export const MyAnimatedComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      {title}
    </motion.div>
  );
};
```

### 3. ?航炊??靽風

```typescript
import { withErrorBoundary } from '@/components/common/GlobalErrorBoundary';

const MyProtectedComponent = () => {
  return <div>Component content</div>;
};

export default withErrorBoundary(MyProtectedComponent);
```

---

## Artifact 多元核心??

### 蝯?實作

```typescript
interface IAcceptanceArtifact {
  uuid: string;
  timestamp: number;
  version: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  evidence: {
    traceable: boolean;
    trustworthy: boolean;
    tangible: boolean;
  };
  virtues: {
    intelligence: number;
    benevolence: number;
    integrity: number;
    courage: number;
    temperance: number;
    harmony: number;
  };
}

interface IComponentCore {
  uuid: string;
  timestamp: number;
  version: string;
  status: 'active' | 'inactive' | 'archived';
  evidence: Record<string, unknown>;
  lock?: {
    locked: boolean;
    lockedAt?: number;
  };
}
```

### 多元核心?寞?

```typescript
import { IAcceptanceArtifact } from '@/types/core';

export const createArtifact = (data: Partial<IAcceptanceArtifact>): IAcceptanceArtifact => {
  return {
    uuid: crypto.randomUUID(),
    timestamp: Date.now(),
    version: '1.0.0',
    status: 'draft',
    evidence: {
      traceable: true,
      trustworthy: true,
      tangible: true,
    },
    virtues: {
      intelligence: 0,
      benevolence: 0,
      integrity: 0,
      courage: 0,
      temperance: 0,
      harmony: 0,
    },
    ...data,
  };
};
```

---

## Network Mocking 蝭?

### 雿輻 MSW (Mock Service Worker)

```typescript
import { setupWorker, rest } from 'msw';

const handlers = [
  rest.get('/api/agents', (req, res, ctx) => {
    return res(
      ctx.json({
        agents: [
          {
            id: 'agent_001',
            name: '??撣思誨??,
            role: 'analyst',
            status: 'active',
          },
        ],
      })
    );
  }),
];

export const worker = setupWorker(...handlers);
```

### ?扯 Mock

```typescript
// ??啣?雿輻
const mockAgents = [
  { id: '1', name: 'Agent A', role: 'analyst' },
  { id: '2', name: 'Agent B', role: 'writer' },
];

export const fetchMockAgents = async (): Promise<typeof mockAgents> => {
  // 璅⊥蝬脰楝撱園
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAgents;
};
```

---

## 元件皜??憿?
### 協議元件 (Core)

| 元件?迂 | 頝臬? | 隤芣? |
|---------|------|------|
| GlobalErrorBoundary | `src/components/common/GlobalErrorBoundary.tsx` | ?典??航炊?? |
| OmniThemeProvider | `src/omni/infrastructure/ui/OmniThemeProvider.tsx` | 銝駁?????|

### ESG 元件 (ESG)

| 元件?迂 | 頝臬? | 隤芣? |
|---------|------|------|
| ESGChecklistPanel | `src/components/ESG/ESGChecklistPanel.tsx` | ESG 瑼Ｘ皜 |
| TaiwanESGTimelineTracker | `src/components/ESG/TaiwanESGTimelineTracker.tsx` | ??蝺蕭頩?|

### Dashboard 元件

| 元件?迂 | 頝臬? | 隤芣? |
|---------|------|------|
| EvidenceVault | `src/components/dashboard/EvidenceVault.tsx` | 霅?摨?|
| BusinessIntelligenceDashboard | `src/components/dashboard/BusinessIntelligenceDashboard.tsx` | BI ?銵冽 |

### Mobile 元件

| 元件?迂 | 頝臬? | 隤芣? |
|---------|------|------|
| PersonalEsgDashboard | `src/components/mobile/PersonalEsgDashboard.tsx` | ?犖 ESG ?銵冽 |
| SustainabilityAchievementMobile | `src/components/mobile/SustainabilityAchievementMobile.tsx` | 永續?停 |

---

## ?雿喳祕頦?
### 1. 憿?實作

```typescript
// ??甇?Ⅱ
interface Props {
  title: string;
  count: number;
  items: string[];
  onSelect: (id: string) => void;
}

// ???航炊 - ?踹?雿輻 any
interface BadProps {
  data: any;
}
```

### 2. 雿輻 OmniLogger

```typescript
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// ??甇?Ⅱ
omniLogger.info(LogCategory.UI, 'User clicked button', { buttonId: 'submit' });

// ???航炊 - ?踹?雿輻 console.log
console.log('User clicked'); // 隢蝙??omniLogger
```

### 3. ?航炊邏輯

```typescript
import { SystemError } from '@/omni/infrastructure/errors/SystemError';

// ??甇?Ⅱ
try {
  await fetchData();
} catch (error) {
  if (error instanceof SystemError) {
    throw error;
  }
  throw new SystemError('VALIDATION_FAILED', { originalError: error });
}
```

---

## 撣貉???

### Q: 憒?瘛餃??啁?元件憿?嚗?
??`src/types/core.ts` 銝剖?蝢拇?????嗅??函?隞嗡葉雿輻??
### Q: 憒?邏輯 API ?航炊嚗?
雿輻 `SystemError` 憿嚗蒂?? `GlobalErrorBoundary` ???
### Q: 憒?鞎Ｙ?啁?隞塚?

1. ??`src/components/` 銝撱箸?桅?
2. ?萄儐?祆???蝯????蝭?3. 瘛餃?摰????蝢?4. 蝺典神?桀?皜祈岫

---

## ?賊?鞈?

- [API Reference](./API_REFERENCE.md)
- [?函蔡??](./DEPLOYMENT_GUIDE.md)
- [系統閬](../docs/SYSTEM_MASTER_PLAN.md)

