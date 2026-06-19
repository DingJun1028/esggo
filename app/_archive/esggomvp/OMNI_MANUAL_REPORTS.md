# 📊 OMNI_MANUAL: Sustainable Report Center (SRC)

> **Version**: v10.5.0 (Stabilized)
> **Protocol**: 5T-Sentinel (Virtuous Forging)
> **Status**: TRANSCENDED & PERSISTENT
> **Shield**: Sentinel Rate-Limited & Redis-Cached

## 1. Overview
The Sustainable Report Center (SRC) is the master synthesis engine of the InfoOne ecosystem. It transforms sub-atomic indicators from all 24 MECE domains into "Impact Crystals"—legally defensible, 5T-compliant disclosure documents.

## 2. AI Report Wizard (引導精靈)
The AI Wizard provides sentient chapter-by-chapter guidance to ensure your report meets GRI 2026 standards.
- **Guidance**: Context-aware writing tips based on the current chapter.
- **Industry Benchmarking**: Comparing performance against 5 industry peers and 3 global best practices.
- **Option Weaver**: Choose between Conservative, Progressive, or Visionary writing paths to weave your narrative.
- **Fact-Check Center**: Real-time detection of exaggerated claims (Anti-Fluff) and consistency checks.
- **Auto-Save Resilience**: All progress is instantly engraved in "無作妙德 (WuzuoNote)" draft archives.
- **Resilience**: Operates via Heuristic Protocal even if the Sentient AI layer is temporarily isolated.

## 2. The Virtuous Forging Flow
Every report manifests through the following sequence:

1. **Indicator Inception**: Raw data points (indicators) are ingested via OmniAPI.
2. **Weaving Synthesis**: The `OmniForge Weaver` aggregates indicators into thematic sections (Environmental, Social, Governance).
3. **Sentient Audit**: `GeminiService` performs a logic consistency and compliance audit.
4. **5T Sealing**: The `ReportService` generates a 5T evidence chain:
    - **Tangible**: Rendered as a High-Fidelity Magazine UI.
    - **Traceable**: Anchored to a unique source origin hash.
    - **Trackable**: Lifecycle hooks monitor every revision.
    - **Transparent**: Formulas and methodology are explicitly disclosed.
    - **Trustworthy**: Locked with a SHA-256 integrity seal.

## 3. Supported Frameworks
The SRC supports adaptive mapping to international standards:
- **GRI 2026**: (Global Reporting Initiative)
- **SASB**: (Sustainability Accounting Standards Board)
- **TCFD**: (Task Force on Climate-related Financial Disclosures)
- **ESGss-Universal**: The internal InfoOne standard.

## 4. Technical Integration
Developers should use the `ReportService` class for all manifestations:

```typescript
const report = await ReportService.generateEliteReport("Annual_Manifest", indicators, {
    format: 'PDF',
    frameworks: ['GRI', 'TCFD']
});
// 💾 Persistence: Automatically archived to NoCodeBackend.
// ⚡ Performance: Backed by L1/L2 Redis Caching layer.
```

## 5. 5T Voucher System (單據自動化)
To maintain 5T integrity, raw physical evidence must be manifested as Vouchers.
1. **Upload**: Drag/drop utility bills (PDF/Image) into the Evidence Drawer.
2. **Extraction**: AI/Heuristic layers extract metrics (kWh, m3, Cost).
3. **Database**: Vouchers and Reports are archived in the NoCodeBackend 5T-DB (Instance: `54686_esg_go_mvp_v13`).
4. **Resilience**: Every lookup reflects a tiered caching strategy (L1 Memory / L2 Redis).
5. **Reference**: Use `ReportService.getWizardContext()` to auto-fill metrics into the report.

```typescript
const voucher = await OmniVoucherService.processVoucher(billBuffer, 'PDF', 'ELECTRICITY');
// Status: Trustworthy Seal applied & Sentinel Shield Verified.
```

## 6. Sentient Quality Control (真實性識別)
The SRC includes a built-in Fact-Check center to prevent "Greenwashing" or unsupported claims.
- **Alert**: Triggered if narrative deviates from historical data trends.
- **Proof-Lock**: Requires a 5T Voucher reference to clear high-priority alerts.
- **Benchmarking**: Cross-validates claims against industry-standard KPIs stored in `IntelGuardian`.
- **Sentinel Shield**: API endpoints protected by `@upstash/ratelimit` to prevent automated extraction/abuse.

---
*Verified by Dr. Thoth - The Future is Documented.*
