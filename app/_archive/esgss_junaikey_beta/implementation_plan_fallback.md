# Implementation Plan - Mock Data Fallback

## Problem

The local PostgreSQL database is offline (`ECONNREFUSED`), preventing the `TruthDashboard` from loading data. This causes the "incorrect screen" issue.

## Solution

Implement a **Mock Data Fallback** mechanism. When the API call fails or the backend DB is unreachable, the frontend (or backend service) should return static example data so the user can verify the UI design and interactions.

## Proposed Changes

### Backend (`server/services/CarbonService.ts` or `server/routes/...`)

- Modify `getEmissionFactors` to return an error or empty list, but better:
- **Frontend Approach (Safer for demo):** Modify `src/pages/TruthDashboard.tsx` to catch API errors and use a local `MOCK_DATA` constant if the fetch fails.

### Frontend (`src/pages/TruthDashboard.tsx`)

1. Define `MOCK_EMISSION_FACTORS` and `MOCK_CARBON_DATA`.
2. Update the `useEffect` / data fetching logic:
   ```typescript
   try {
     const data = await fetch('/api/carbon/...');
     // ...
   } catch (err) {
     console.warn('Backend unavailable, using MOCK data');
     setData(MOCK_DATA);
   }
   ```

## Verification

- Refresh the page.
- Dashboard should display charts/tables using mock data instead of blank/error state.

