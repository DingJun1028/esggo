---
title: TypeScript Strict Mode 憿?摰?亥?摨?category: ?閬?
tags: [TypeScript, Strict Mode, 憿?摰, ESLint, CI/CD]
created: 2024-02-06
updated: 2024-02-06
status: ?脰?銝?priority: 擃?---

# TypeScript Strict Mode 憿?摰?亥?摨?
## ?? ?桅?

- [璁膩](#璁膩)
- [靽桀儔?芸???](#靽桀儔?芸???)
- [?航炊憿?撠銵沘(#?航炊憿?撠銵?
- [靽桀儔璅∪???靘(#靽桀儔璅∪???靘?
- [撌脖耨敺拇?隞嗆??孫(#撌脖耨敺拇?隞嗆???
- [敺耨敺拇?隞嗆??孫(#敺耨敺拇?隞嗆???
- [????閬?](#????閬?)
- [CI/CD 瘚?](#cicd-瘚?)
- [?雿喳祕頦(#?雿喳祕頦?

---

## 璁膩

### ? ?格?

撠?ESGSS JunAiKey 撠???300+ ??TypeScript 憿??航炊系統?批靽桀儔嚗???Strict Mode ??定義??
### ?? ?暹?

| ?? | ?詨?|
|------|------|
| 蝮賡隤斗 | 300+ |
| 撌脖耨敺?| 11 ???菜?隞?|
| 敺耨敺?| ?拚??辣 |
| ?摯摰??? | 2-3 ??|

---

## 靽桀儔?芸???

### ? 蝚砌?階段嚗??芸?蝝?Blocking Errors嚗?
> 撠蝺刻陌憭望??隤歹??閬??唾???
| ?航炊蝣?| 隤芣? | 敶梢蝭? |
|--------|------|----------|
| TS2307 | 璅∠??曆???| ?蝔??⊥??? |
| TS2724 | 撠?銝???| 憿??⊥?閫?? |

### ?? 蝚砌?階段嚗葉?芸?蝝?Runtime Issues嚗?
> ?航撠????憿?憿??望

| ?航炊蝣?| 隤芣? | 敶梢蝭? |
|--------|------|----------|
| TS2339 | Promise 撅祆扯赤?隤?| ???援瞏?|
| TS2345 | ?憿?銝??| 憿??喲??航炊 |
| TS2532 | 撠情?航 undefined | NullPointerException |

### ? 蝚砌?階段嚗??芸?蝝?Warnings嚗?
> 憿?摰霅血?

| ?航炊蝣?| 隤芣? | 敶梢蝭? |
|--------|------|----------|
| TS7006 | ?勗? any 憿? | 蝜?憿?瑼Ｘ |
| TS18046 | unknown 憿? | 憿?銝???|
| TS18048 | ?航 undefined | ???◢??|
| TS7030 | 餈??潔?摰 | 協議瞍? |

---

## ?航炊憿?撠銵?
### TS7006: ?勗? Any 憿?

```
?航炊閮嚗arameter 'xxx' implicitly has an 'any' type.
??嚗協議數據??蝣箇?憿?實作
靽桀儔嚗溶??蝣箇?憿?閮駁?
```

**蝭?**

```typescript
// 靽桀儔??function processData(data) {
  return data.value;
}

// 靽桀儔敺?interface Data {
  value: string;
}
function processData(data: Data): string {
  return data.value;
}
```

### TS18046: Unknown 憿?

```
?航炊閮嚗ariable is of type 'unknown'.
??嚗atch ?憛??航炊瘝?憿?邏輯
靽桀儔嚗蝙?券???銵?```

**蝭?**

```typescript
// 靽桀儔??try {
  await fetchData();
} catch (error) {
  console.log(error.message);
}

// 靽桀儔敺?try {
  await fetchData();
} catch (error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.log(err.message);
}
```

### TS18048: ?航 Undefined

```
?航炊閮嚗bject is possibly 'undefined'.
??嚗赤??賜 undefined ??鞊∪惇??靽桀儔嚗溶?征?潭炎?交??舫??```

**蝭?**

```typescript
// 靽桀儔??const value = items[index].name;

// 靽桀儔敺?const value = items[index]?.name ?? 'Unknown';
```

### TS7030: 餈??潔?摰

```
?航炊閮嚗ot all code paths return a value.
??嚗?訾??舀??誨蝣潸楝敺更新??靽桀儔嚗溶??閮剛???```

**蝭?**

```typescript
// 靽桀儔??function getStatus(code: number) {
  if (code === 200) return 'OK';
}

// 靽桀儔敺?function getStatus(code: number): string {
  if (code === 200) return 'OK';
  return 'Unknown';
}
```

---

## 靽桀儔璅∪???靘?
### 璅∪? 1嚗PI Route 憿?靽桀儔

**?辣**嚗server/api/*.ts`

```typescript
// 靽桀儔??import express from 'express';
const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// 靽桀儔敺?import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({ error: err.message });
  }
});
```

### 璅∪? 2嚗ervice 憿?靽桀儔

**?辣**嚗server/services/*.ts`

```typescript
// 靽桀儔??class DataService {
  async fetchData(query) {
    const result = await db.query(query);
    return result.rows;
  }
}

// 靽桀儔敺?interface QueryParams {
  limit?: number;
  offset?: number;
}

interface DataRow {
  id: number;
  name: string;
}

class DataService {
  async fetchData(query: QueryParams): Promise<DataRow[]> {
    const result = await db.query('SELECT * FROM data LIMIT $1 OFFSET $2', 
      [query.limit ?? 10, query.offset ?? 0]);
    return result.rows as DataRow[];
  }
}
```

### 璅∪? 3嚗rror Handling 憿?靽桀儔

```typescript
// ??航炊邏輯撌亙?賣
function handleError(error: unknown, context: string): Error {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[${context}]`, err);
  return err;
}

// 雿輻蝭?
try {
  await riskyOperation();
} catch (error: unknown) {
  throw handleError(error, 'riskyOperation');
}
```

---

## 撌脖耨敺拇?隞嗆???
| # | ?辣 | 靽桀儔?交? | 銝餉?靽桀儔?批捆 |
|---|------|----------|--------------|
| 1 | `server/api/jun-ai-key.ts` | 2024-02-06 | Request/Response 憿??nknown 邏輯 |
| 2 | `server/routes/evidenceRoutes.ts` | 2024-02-06 | Express 憿??隤日???銵?|
| 3 | `server/routes/marketIntelligenceRoutes.ts` | 2024-02-06 | catch 憛?unknown 憿? |
| 4 | `server/services/arvoAgent.ts` | 2024-02-06 | ARVOContext?RVOAction 隞 |
| 5 | `server/services/amice.ts` | 2024-02-06 | 鈭辣憿?實作 |
| 6 | `server/services/blockchain.ts` | 2024-02-06 | ethers.js ?琿?憿? |
| 7 | `server/services/evidenceService.ts` | 2024-02-06 | Evidence?CRResult 憿? |
| 8 | `server/api/verification.ts` | 2024-02-06 | Request/Response 憿? |
| 9 | `server/services/MarketIntelligenceCrawler.ts` | 2024-02-06 | unknown 憿??撘?any |
| 10 | `server/services/AnalysisService.ts` | 2024-02-06 | TrendDataPoint 憿? |
| 11 | `server/services/AdaptiveRiskMatrixService.ts` | 2024-02-06 | ?航 undefined ?航炊 |

---

## 敺耨敺拇?隞嗆???
### 擃合約

| ?辣 | ?航炊??| 銝餉??? |
|------|--------|----------|
| `scripts/omni-healer.ts` | 1 | TS2345 |
| `scripts/query-diary.ts` | 2 | TS2345 |
| `scripts/seal-integrity.ts` | 2 | TS2613, TS7006 |
| `server/server.ts` | 50+ | 憭車憿??航炊 |

### 銝剖合約

| ?辣 | ?航炊??| 銝餉??? |
|------|--------|----------|
| `server/routes/taskRoutes.ts` | 2 | TS2339 |
| `server/services/CrewAIClient.ts` | 9 | TS2345 |
| `server/services/ConsensusGovernanceService.ts` | 1 | TS2322 |

---

## ????閬?

### ??憿?實作定義

1. **蝳迫雿輻?勗? any**

```typescript
// ???航炊
function process(data) { }

// ??甇?Ⅱ
interface Data { id: number; }
function process(data: Data) { }
```

2. **蝯曹??航炊邏輯**

```typescript
// ??? catch ?憛??蝙??unknown 憿?
catch (error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
}
```

3. **?舫??雿?*

```typescript
// 雿輻?舫??蝛箏澆?雿?const value = obj?.property ?? defaultValue;
```

### ?? 隞?Ⅳ Review 皜

- [ ] ??協議?賊????蝢?- [ ] ???catch ?憛迤蝣箄???unknown 憿?
- [ ] ???Promise 餈??潮?迤蝣箇?憿?璅酉
- [ ] 瘝?雿輻?勗? any
- [ ] ?舫撅祆找蝙?典?賊???

---

## CI/CD 瘚?

### GitHub Actions 撌乩?瘚?

```yaml
name: TypeScript Type Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run TypeScript type check
        run: npm run type-check
        
      - name: Run ESLint
        run: npm run lint
```

### npm Scripts

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:strict": "tsc --noEmit --strict",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

---

## ?雿喳祕頦?
### 1. ?曹澈憿?實作

撱箇? `server/types/shared.ts` ?葉蝞∠??憿?嚗?
```typescript
// server/types/shared.ts
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface TypedError extends Error {
  code?: string;
  statusCode?: number;
}
```

### 2. ESLint 閬??蔭

```javascript
// eslint.config.js
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'consistent-return': 'error',
    'no-magic-numbers': 'warn',
  }
}
```

### 3. 雿輻 eslint-disable 閬?

?嗅??嗆??瘙??蕭?亥郎??嚗?
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// TODO: ?券?瑽?畾菜??琿?憿?
const data: any = await fetchData();
```

---

## ??皞?
### ?折??

- `TYPESCRIPT_STRICT_MODE_COMPLIANCE.md` - 摰靽桀儔??
- `.github/workflows/typescript-typecheck.yml` - CI/CD ?蔭
- `scripts/fix-types-batch.ps1` - ?寥?靽桀儔?單

### 憭鞈?

- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [ESLint 閬?](https://eslint.org/docs/rules/)
- [TypeScript ?航炊蝣澆??(https://typescript.tv/errors/)

---

## ?舐鼠???
### ?銵?鞎砌犖

- **?垢**嚗??澆???- **敺垢**嚗?蝡舀瑽???
### ?賊????

- GitHub Issues: 璅惜 `typescript-strict-mode`
- Slack: `#typescript-strict-mode`

---

*?敺?堆?2024-02-06*
*???嚗1.0*

