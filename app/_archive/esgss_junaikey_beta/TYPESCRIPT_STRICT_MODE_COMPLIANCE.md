# TypeScript Strict Mode ???找耨敺拙??
## 璁膩

?祆?隞嗉??? ESGSS JunAiKey 撠?敺之??TypeScript 憿??航炊?啣?潭芋撘?閬抒?系統?找耨敺拚?蝔?
## 靽桀儔?芸???

### 蝚砌?階段嚗??芸?蝝?- 撠蝺刻陌憭望??隤???已完成
#### 1.1 璅∠??曆??圈隤?(TS2307)
**敶梢蝭?**嚗瘜迤撣貉??交芋蝯?撠?蝔??⊥???
**靽桀儔?寞?**嚗?- 靽格迤 import 頝臬?
- 撱箇?蝻箏仃?????隞?
#### 1.2 Promise 撅祆扯赤?隤?(TS2339)
**敶梢蝭?**嚗??甇交?雿葉?航炊?啗赤??Promise 撠情?惇??**靽桀儔?寞?**嚗?- 瘛餃??拍??`await` ?摮?- 雿輻憿??瑁?????銵?
#### 1.3 ?勗? any 憿??航炊 (TS7006)
**敶梢蝭?**嚗協議?貊撩撠???蝢抬?蝜? TypeScript 憿?瑼Ｘ
**靽桀儔?寞?**嚗?- ?箸??協議?豢溶??蝣箇?憿?實作
- 雿輻隞/憿??亙?實作銴??拐辣蝯?

**撌脖耨敺拇?隞?*嚗?- `server/api/jun-ai-key.ts`
- `server/routes/evidenceRoutes.ts`
- `server/routes/marketIntelligenceRoutes.ts`
- `server/services/arvoAgent.ts`
- `server/services/amice.ts`
- `server/services/blockchain.ts`
- `server/services/evidenceService.ts`

### 蝚砌?階段嚗葉?芸?蝝?- ?航撠????憿?憿??望

#### 2.1 unknown 憿?邏輯 (TS18046)
**敶梢蝭?**嚗邏輯??unknown 憿??航撠???隤?**靽桀儔?寞?**嚗?- 雿輻憿?摰? (`instanceof Error`)
- ??摰??閮剖?
#### 2.2 ?航 undefined ?航炊 (TS18048)
**敶梢蝭?**嚗赤??賜 undefined ?澆??湧?銵??航炊
**靽桀儔?寞?**嚗?- 瘛餃?蝛箏潭炎??- 雿輻?舫??(`?.`)
- 雿輻蝛箏澆?雿菟?蝞泵 (`??`)

#### 2.3 餈??潔?摰?航炊 (TS7030)
**敶梢蝭?**嚗??舀??誨蝣潸楝敺更新??**靽桀儔?寞?**嚗?- 瘛餃??身餈???- 雿輻 `never` 憿?璅酉銝?誨蝣?
### 蝚砌?階段嚗??芸?蝝?- Warning 蝑?????憿?
#### 3.1 ESLint 霅血?邏輯
**霅血?憿?**嚗?- `no-magic-numbers`嚗?銵摮????箏虜??- `react-hooks/purity`嚗Ⅱ靽?React Hooks ??瘛冽?
## 憿?實作?雿喳祕頦?
### 雿輻 shared.ts ?曹澈憿?

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

### 邏輯 unknown ?航炊憿?

```typescript
// 銝末??瘜?catch (error: any) {
  return res.status(500).json({ error: error.message });
}

// 憟賜???
catch (error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  return res.status(500).json({ error: err.message });
}
```

### 邏輯 Promise 憿?

```typescript
// 銝末??瘜?const result = await service.getData();
console.log(result.status); // ?航炊嚗roperty 'status' does not exist on type 'Promise<Data>'

// 憟賜???
const result = await service.getData(); // 蝣箔?餈? Promise<T>
console.log(result.status); // 甇?Ⅱ
```

## ESLint 閬?定義

### ??蝯曹?閬?

```javascript
// eslint.config.js
module.exports = {
  rules: {
    // TypeScript ?賊?
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    
    // React Hooks
    'react-hooks/purity': 'error',
    
    // ?雿喳祕頦?    'no-magic-numbers': 'warn',
    'consistent-return': 'error',
  }
}
```

### 雿輻 ESLint Disable 閮餉圾??蝭?
?嗅?撠??嗆??瘙???蕭?交?鈭郎??嚗?嚗?
1. ?刻酉閫?葉隤芣???
2. 閮剖? TODO 追蹤
3. 摰? review

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// TODO: ?券?瑽?畾菜??琿?憿? - ?賊? issue: #123
const data: any = await fetchData();
```

## CI/CD 憿?摰瑼Ｘ瘚?

### GitHub Actions ?蔭

```yaml
# .github/workflows/type-check.yml
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
        
      - name: Upload type check results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: type-check-results
          path: type-check-results/
```

### npm scripts ?蔭

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

## ?之憿?霈閮?

### 霈 #001: arvoAgent.ts 憿?重構
**?交?**嚗?024-XX-XX
**?膩**嚗 ARVO Agent 憿溶???渡?憿?實作
**敶梢蝭?**嚗?- ?啣? `ARVOContext`?ARVOAction`?ARVOParsedResponse` 蝑???- 蝘駁??撘?any 憿?
- 瘛餃??航炊憿?摰?

### 霈 #002: amice.ts 憿?實作
**?交?**嚗?024-XX-XX
**?膩**嚗 AMICE ??瘛餃?憿?實作
**敶梢蝭?**嚗?- ?啣?鈭辣憿?實作 (`SystemAlertPayload`, `AgentTaskPayload`, etc.)
- 瘛餃?蝪賢?撽?憿?

### 霈 #003: blockchain.ts 憿??寥?**?交?**嚗?024-XX-XX
**?膩**嚗?憛???瘛餃? ethers.js 憿?
**敶梢蝭?**嚗?- 雿輻 `JsonRpcProvider` ??`Wallet` 憿?
- 瘛餃? `BlockchainError` 隞

## 敺??隤斗???
### 擃合約
- [ ] server/api/verification.ts - unknown 憿?邏輯
- [ ] server/controllers/agentController.ts - ?憿?實作
- [ ] server/controllers/metricsController.ts - ?憿?實作

### 銝剖合約
- [ ] scripts/*.ts - ?單?辣憿?靽桀儔
- [ ] server/services/MarketIntelligenceCrawler.ts - unknown 憿?邏輯

### 雿合約
- [ ] ESLint 霅血?邏輯
- [ ] 擳?協議??

## 皜祈岫蝑

### 憿?皜祈岫
蝣箔??啁?憿?實作銝?整合?暹??嚗?
```typescript
// type.test.ts
import { expectTypeOf } from 'vitest';
import { ARVOAgent } from './arvoAgent';

describe('ARVOAgent types', () => {
  it('should have correct method signatures', () => {
    const agent = new ARVOAgent({});
    
    expectTypeOf(agent.process)
      .parameters.toMatchTypeOf<[string, Record<string, unknown>]>();
    
    expectTypeOf(agent.process)
      .returns.toMatchTypeOf<Promise<{
        status: 'success' | 'error';
        response?: string;
        error?: string;
      }>>();
  });
});
```

## 蝯?

??系統?抒?憿?靽桀儔嚗?獢迤?券郊? TypeScript Strict Mode ??閬?皞迨???閬?

1. **品牌??**嚗蝙??CI/CD 瘚?蝣箔?瘥活?漱?賡?憿?瑼Ｘ
2. **????**嚗遣蝡絞銝????皞??雿喳祕頦?3. **摰? review**嚗??炎?亙??芸?憿?實作

## ?舐鼠

憒?憿??賊???嚗??舐鼠嚗?- 鞎痊鈭綽????
- ?賊? Issue嚗??亦? GitHub Issues 璅惜 `typescript-strict-mode`

