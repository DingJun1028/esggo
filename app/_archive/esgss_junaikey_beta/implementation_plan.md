# Phase 24: Intelligent Workflow & Task Matrix Coordination

Implement an intelligent workflow system that dynamically decomposes complex ESG tasks into an orchestrated matrix of agent-led subtasks, ensuring alignment with the 24 MECE services and 5T Protocol.

## User Review Required

> [!IMPORTANT]
> The `TaskDecompositionEngine` will now rely on the Gemini API for dynamic task splitting. This requires active API connectivity. A fallback to the previous static decomposition will be implemented for offline/error scenarios.

## Proposed Changes

### Integrity Passport Core

#### [MODIFY] [IntegrityPassportService.ts](file:///c:/Project/esgss_junaikey_beta/src/services/IntegrityPassportService.ts)
- Update `PassportData` to include `evolutionHistory: RankEvolutionRecord[]`.
- Implement `evolveRank(userId: string)`:
    - Calculates rank based on new criteria:
        - **Bronze**: Initial state.
        - **Silver**: Score ≥ 200 + 1 Crystal.
        - **Gold**: Score ≥ 400 + 3 Crystals.
        - **Platinum**: Score ≥ 600 + 5 Crystals.
        - **Diamond**: Score ≥ 800 + 10 Crystals.
        - **Transcended**: Score ≥ 1000 + 24 Crystals.
- Refactor `determineRank` to accept both score and crystal count.

---

### Backend Schema (NCB Sync)

#### [MODIFY] [OmniDataAdapter.ts](file:///c:/Project/esgss_junaikey_beta/src/services/data/OmniDataAdapter.ts)
- Ensure rank evolution events are recorded in the `action_logs` or a dedicated evolution table.

---

### Frontend Store

#### [MODIFY] [useIntegrityPassport.ts](file:///c:/Project/esgss_junaikey_beta/src/store/useIntegrityPassport.ts)
- Add `evolutionHistory` to the state.
- Update `fetchPassport` and `sealCrystal` to handle the new data structure.

## Verification Plan

### Automated Tests
- [ ] `scripts/test_phase_22.ts`:
    - Mock a user with a high score but 0 crystals. Verify rank is limited.
    - Simulate calling `sealCrystal` multiple times.
    - Verify rank evolves automatically as criteria are met.
    - Assert `evolutionHistory` contains valid entries.

### Manual Verification
- [ ] Check the `IntegrityPassport` UI to ensure the rank badge updates correctly after crystallization.
