# OmniLogger - 實作?謕?版本(Omni Manual)

> **[Metadata]**

> - **UUID**: `infrastructure_logger_v6_0`

> - **Version**: `6.0.0`

> - **Type**: `Infrastructure`

> - **Author**: `Omni System`

> - **Last Updated**: `2026-01-14`

## 1. ??謕???系統? (Requirements & Purpose)

- **系統?系統?**: 實作賹??荒筆?雓????????實作畾????系統實作謅?ㄟ??遴?鞊船??系統蹇????系統?功能伍???謚砍蕭??

- **?系統系統?**:
  1.  ???雓?系統系統?系統? `console.log`?謅?ㄟ?荒筐??核心?

  2.  ?實作謕?雓系統?系統?實作?憛??甇???實作豰刈系統?實作?

  3.  ?實作??制???ㄟ頩實作??賜??(Untraceable) 實作????

- **系統?系統?**:
  - ??系統?系統?核心?`trace_id`??

  - ??謕?系統?系統?核心Stack Trace ??Source Origin??

  - 系統系統?實作?謕??Debug ?畾?頩??

## 2. 功能?謕鞊梯???(Functionality & Architecture)

### 2.1 系統?功能

1.  **3+1 ??謕?系統?**: 實作謚迎???`trace_id`, `timestamp`, `source_origin`??

2.  \*_?豲??擗??隡???_: ?頛舀???`Object.freeze()` 系統?實作??雓□??謇tical ?豲??系統? `hash_lock`??

3.  **???????啣???*: 系統? Console (Dev), LocalStorage (Persistence), Hooks (Subscription)??

4.  **實作?謕??*: 實作?謕???謕頩悻???Ⅹ頩????(JSON/CSV) 功能?

### 2.2 ?豯殉?鞊堆??嗉??? (Interfaces)

```typescript

export enum LogLevel {

    DEBUG, INFO, WARN, ERROR, CRITICAL

}



export enum LogCategory {

    SYSTEM, API, UI, DATA, AUTH, AGENT, ...

}



export interface IOmniLogPayload {

    readonly message: string;

    readonly level: LogLevel;

    readonly category: LogCategory;

    readonly source_origin: string; // T1

    readonly trace_id: string;      // T2

    readonly timestamp: number;     // T2

    readonly hash_lock?: string;    // T4

}

```

### 2.3 功能?(Technology Stack)

- **Language**: TypeScript

- **Dependencies**: None (Core Logic), `rxjs` (Legacy Layer).

## 3. 100% 系統系統? (Reproduction Guide)

> **?? AI Instruction**: To reproduce this module, follow these steps exactly.

1.  **File Creation**: Create `src/omni/infrastructure/logging/OmniLogger.ts`.

2.  **Implementation Logic**:
    - Define `LogLevel` and `LogCategory` enums.

    - Implement `OmniLoggerService` class.

    - Implement `logPayload` method:
      - Create `LogEntry` with unique ID.

      - Apply `Object.freeze(entry)`.

      - Push to private `logs` array.

      - Persist to `localStorage` if needed.

    - Implement `generateHashLock` using simple checksum or crypto.

    - Integrate `isProduction` check using safe `import.meta.env`.

3.  **Singleton Export**: Export `const omniLogger = new OmniLoggerService();`.

## 4. ?頦?????謕?摮??(Verification & Disclosure)

### 4.1 實作頦??? (Unit Verification)

- [ ] **Test Case 1**: `omniLogger.info` creates a log entry. -> Expect `logs.length` increases.

- [ ] **Test Case 2**: Production mode hides console debug. -> Expect `console.log` not called when `isProduction = true`.

- [ ] **Test Case 3**: Immutability check. -> Expect modifying log entry throws Error.

### 4.2 4T ??察???????? (3+1 Protocol)

- **Traceable**: `source_origin` is mandatory in Payload.

- **Trackable**: `trace_id` is auto-generated if missing.

- **Calculable**: `hash_lock` verification available.

- **Immutable**: runtime `Object.freeze()` enforced.

## 5. ??ㄞ?獢?系統系統?(Source Reference)

- [OmniLogger.ts](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/omni/infrastructure/logging/OmniLogger.ts)
