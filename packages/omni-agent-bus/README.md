# @esggo/omni-agent-bus — OmniAgentBus 萬能代理總線

OA 萬能分身的「圓通」骨幹：讓 7 子框架（ADK/Genkit/Agent0/CrewAI/AgentReach/DeerFlow/TencentMem）+ 30 蜂群 + Team Memory 經**同一條事件總線**互通。

## 設計哲學（無作妙德圓通無礙）

- **無作**：handler 未註冊不報錯，靜默略過；單 handler 異常不中斷總線
- **圓通**：所有 OA 元件經統一 `publish/subscribe` 主題互通
- **無礙**：訊息流經總線時**自動過 5T Gate**（對齊 `@esggo/omni-agent/src/gates.ts`），未過閘的轉 `.rejected` 主題，不准向下游廣播

## 5T Gate（總線級，對齊 omni-agent gates.ts）

對 `OATaskResult.output` 做內容級驗證：

| 維度 | 最低字數 | 品質特徵 |
|---|---|---|
| traceable | 100 | GRI/ISO/來源/引用 |
| transparent | 150 | %/比率/公開/揭露 |
| tangible | 200 | 完成/建立/數量 |
| trustworthy | 120 | hash/sha/封印/audit |
| trackable | 80 | 年度/日期/monitor |

## 用法

```ts
import { createBus } from '@esggo/omni-agent-bus';

const bus = createBus(true); // 啟用 5T 閘門
bus.subscribe('oa.produce', (msg) => console.log('收:', msg.payload));
bus.subscribe('oa.produce.rejected', (msg) => console.warn('擋下:', msg.payload));
await bus.publish('oa.produce', 'orchestrator', taskResult);
```

## 結構

```
src/
  types.ts   # 共用型別 (對齊 oa-framework / omni-agent, 不依賴 workspace 包)
  bus.ts     # OmniAgentBus + bus5TGate (5T 自動攔截)
  index.ts   # 入口
test/
  smoke.ts   # 過閘廣播 + 未過閘轉 rejected
```

## 驗證

```bash
npx tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0
npx tsx test/smoke.ts                               # OMNI_AGENT_BUS_OK
```

> 注：`pnpm run test` 會被 monorepo 的 workspace deps-status gate 擋（其他包未 build），
> 非本包問題；用 `npx` 直接跑即可。
