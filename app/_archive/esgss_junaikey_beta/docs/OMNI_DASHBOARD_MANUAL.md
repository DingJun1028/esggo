# Omni Dashboard - 實作?謕?版本(Omni Manual)

> **[Metadata]**
>
> - **UUID**: `ui_omni_dashboard_v6_0`
> - **Version**: `6.0.0`
> - **Type**: `UI / Composite`
> - **Author**: `Omni System`
> - **Last Updated**: `2026-01-14`

## 1. ??謕???系統? (Requirements & Purpose)

- **系統?系統?**: ??湧炬頩?"Omni-System" 系統荒筐????謕?鞎撚???? (The Interface of Awareness)?謅????蝬踐ㄟ?系統?實作謜???實作鞈歹??謕????系統核心?謕?實作蟡ㄜ??系統?
- **?系統系統?**:
  1.  **????系統?**: 系統? "Tactical" (系統?) ??"Impact" (系統? 實作?圈???實作系統實作????系統?
  2.  \*_?鞈歹??實作?_: 系統? `DisclosureProtocol`?謅????隡??實作?鞊售?豰??桅瑣核心?謕???擳???ㄜ????謕??????????實作?
  3.  **?賹????謕?鞎?*: ?謘???實作賹??系統?(Entropy) ??Resonance (??謕?????謅?????謕???謕?鞎撫???系統?系統?系統?
- **系統?系統?**:
  - **Tactical Board**: 實作謘???系統系統? (Live Feed, Carbon Scope 1/2)??
  - **Impact Board**: ??賃飭?系統?系統賹????系統謚?雓???(ITK Value)??
  - **Uniformity**: ??實作??憸核心??????謕完整謘????? (Glassmorphism + Neon)??

## 2. 功能?謕鞊梯???(Functionality & Architecture)

### 2.1 實作蝘??? (Core Views)

1.  **Tactical Command Center (`TacticalDashboard.tsx`)**:
    - **Focus**: Operational Efficiency, Real-time Alerts.
    - **Widgets**: `OmniEsgCell` (Carbon/Energy), Live System Feed, Seraphim Advisor.
2.  **Omni Impact Dashboard (`OmniImpactDashboard.tsx`)**:
    - **Focus**: Strategic Alignment, Entropy Visualization.
    - **Widgets**: Project Matrix, Entropy Bar Chart, ITK Stream.

### 2.2 ??謕??荒???桅瑣 (Key Components)

- **OmniEsgCell**: 核心??謕雓系統?系統? Hover 實作?????
- **Entropy Monitor**: 系統?實作???蹇???豱實作謜?????($\Delta$)??
- **Seraphim Adivisor**: AI ?頦?????謕?璇?雓蔭蹍??荒???????

### 2.3 功能?(Technology Stack)

- **Framework**: React 18 + Vite
- **Style**: Tailwind CSS (Custom Color Tokens: `celestial-*`)
- **Icons**: Lucide React
- **State**: Zustand (`useAppStore`, `useOmniResonance`)
- **Animation**: CSS Keyframes (`animate-in`, `fade-in`)

## 3. 100% 系統系統? (Reproduction Guide)

> **?? AI Instruction**: To reproduce this module, follow these steps exactly.

1.  **Tactical Implemention**:
    - Create `src/components/TacticalDashboard.tsx`.
    - Layout: Header (System Status) + Grid (Metrics) + Feed (Logs).
    - Data Source: Connect to `useAppStore` for user profile.
    - Interactive: Pass `onOpenNote` callback.

2.  **Impact Implementation**:
    - Create `src/components/OmniImpactDashboard.tsx`.
    - Layout: Header (Decree) + Matrix (Projects) + Sidebar (Entropy).
    - State: Connect to `useOmniResonance` and `useImpactProject`.
    - Visuals: Implement "Entropy Visualization Bar" using random height divs for demo or real data.

3.  **Integration**:
    - Ensure both dashboards are exported and routed in `App.tsx`:
      - `case 'tactical': return <TacticalDashboard />`
      - `case 'impact': return <OmniImpactDashboard />`

## 4. ?頦?????謕?摮??(Verification & Disclosure)

### 4.1 實作頦??? (Unit Verification)

- [ ] **Test Case 1**: Tactical Dashboard loads without crash. -> Render Test.
- [ ] **Test Case 2**: "System Status" displays "OPERATIONAL". -> Data Binding Test.
- [ ] **Test Case 3**: Switching to Impact View renders Entropy Bar. -> Routing/Component Test.

### 4.2 4T ??察???????? (3+1 Protocol)

- **Traceable**: All metrics (e.g., Carbon Value) must trace back to a specific sensor or API.
- **Trackable**: User interactions (e.g., "Consult Seraphim") generate Audit Logs.
- **Calculable**: Entropy value ($\Delta$) matches the formula `1 - Resonance`.
- **Immutable**: Historical dashboard reports are snapshotted (`html2canvas`) and hashed.

## 5. ??ㄞ?獢?系統系統?(Source Reference)

- [TacticalDashboard.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/components/TacticalDashboard.tsx)
- [OmniImpactDashboard.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/components/OmniImpactDashboard.tsx)
