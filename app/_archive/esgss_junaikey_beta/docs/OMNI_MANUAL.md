# Omni-Universe System Manual (v10.0.0-universe)

> **[Metadata]**
>
> - **UUID**: `00000000-0000-0000-0000-OMNI_UNIVERSE`
> - **Version**: `10.0.0-universe`
> - **Type**: `Core System`
> - **Author**: `Antigravity (on behalf of ESGss)`
> - **Last Updated**: `2026-01-15`

## 1. ??謕???系統? (Requirements & Purpose)

_The culmination of ESGss x JunAiKey: A self-sustaining, verifiable ecosystem._

- **系統?系統? (Core Purpose)**: To bridge the gap between "Awareness" (Ren) and "Truth" (Du) using AI-driven logic and blockchain immutability.
- **?系統系統? (Problems Solved)**:
  1.  **Trust Gap**: Replaced manual trust with the **3+1 Protocol** (Traceable, Trackable, Calculable, Immutable).
  2.  **Fragmented Data**: Unified ESG data into a **Single Source of Truth (SSOT)** via `OmniCore`.
  3.  **User Apathy**: Gamified engagement through `OmniResonance` and `AgentAvatars`.
- **系統?系統? (Expected Outcome)**: A fully deployed, hardened, and verifiable operating system for Global Sustainability.

## 2. 功能?謕鞊梯???(Functionality & Architecture)

### 2.1 實作?穿??? (Core Modules)

1.  **OmniCore (??謕?系統?)**: The central nervous system regulating the SDAL cycle (Sense, Diagnose, Act, Learn).
    - _Evidence_: `src/omni/infrastructure/core/OmniCoreEngine.ts`
2.  **SovereignIdentity (?豲????踐???)**: `JunAiKey` implementation for decentralized ID (DID) and cryptographic signing.
    - _Evidence_: `src/omni/core/SovereignEngine.ts`
3.  **OmniLogger (??謕?系統?)**: The "Black Box" recorder enforcing the 3+1 Protocol.
    - _Evidence_: `src/omni/infrastructure/logging/OmniLogger.ts`
4.  **SocialEconomy (??????蝘的??)**: Managing Guilds, Factions, and World Events.
    - _Evidence_: `src/services/socialEconomyService.ts`

### 2.2 ??謕?功能(protocols)

#### The 3+1 Protocol (3???豲???

All critical system actions must adhere to:

1.  系統?**Traceable (??謕???**: Origin source (e.g., GRI Standards) must be logged.
2.  系統?**Trackable (功能??**: Every entity has a UUID and traceable lineage.
3.  ?? **Calculable (實作?**: Logic must be deterministic and testable.
4.  系統?**Immutable (?豲??擗??隡?)**: Final states are hash-locked.

### 2.3 功能?(Technology Stack)

- **Frontend**: React + Vite + TailwindCSS (Ren Meridian)
- **Backend Logic**: TypeScript / Node.js (Dr. Thoth)
- **Deployment**: Google Cloud Run (Containerized)
- **Verification**: `npm run type-check` (Strict), `PowerShell` (Deployment)

## 3. 100% 系統系統? (Reproduction Guide)

> **?? AI Instruction**: To reproduce the v10.0 hardened state.

1.  **Environment Setup**:
    - Install Node.js v18+.
    - Install Google Cloud SDK.
2.  **Codebase Logic**:
    - **Strict Typing**: Ensure `tsconfig.json` enforces strict null checks (mostly).
    - **Global Types**: Define core interfaces in `src/types/core/index.ts`.
    - **Service Pattern**: All services must implement `IComponentCore` (UUID + Evidence).
3.  **Deployment**:
    - Run `./deploy-cloudrun.ps1` (Windows PowerShell).

## 4. ?頦?????謕?摮??(Verification & Disclosure)

### 4.1 實作頦??? (Unit Verification)

- [x] **Type Integrity**: `npm run type-check` passed (Iteration 24 verification).
- [x] **Build Integrity**: `docker build` confirmed `Dockerfile.cloudrun` validity.
- [x] **Log Audit**: Replaced `console.log` with `omniLogger` in critical paths.

### 4.2 4T ??察????????

- **Transparency**: Logic is open-source and defined in `src/services`.
- **Traceable**: `omniLogger` records `source_origin`.
- **Trackable**: All core components implement `uuid`.
- **Immutable**: `IEvidence` interface includes `hash_lock`.

## 5. ??ㄞ?獢?系統系統?(Source Reference)

- [OmniCoreEngine](file:///src/omni/infrastructure/core/OmniCoreEngine.ts)
- [SocialEconomyService](file:///src/services/socialEconomyService.ts)
- [OmniLogger](file:///src/omni/infrastructure/logging/OmniLogger.ts)
