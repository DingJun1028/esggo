/**
 * ESG GO | Strongly Typed API Client (OmniSync Bridge)
 * Wraps all backend calls with Bi-directional TypeScript safety.
 * Bridges legacy calls to the new 5T / tRPC architecture.
 */
async function fetcher(url, body) {
    // Bridge: If the old URL is called, we can internally redirect to the new vault/trpc logic if needed
    // For now, we maintain the same fetch structure but ensure it points to the standard endpoints
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.content || `API Error: ${res.status}`);
    }
    return res.json();
}
export const omniApiClient = {
    /**
     * OmniCore Seal (T4/T5)
     * Bridges to /api/vault-omni/engrave
     */
    seal: (payload) => fetcher('/api/vault-omni/engrave', {
        formula: payload.formula,
        impactMetric: payload.impact_metric || payload.metric,
        sourceOrigin: payload.source_origin || payload.source,
        evidenceData: { policyId: payload.policyId }
    }),
    /**
     * OmniCore Verify (T4)
     * Bridges to /api/vault-omni/verify
     */
    verify: (payload) => {
        const uuid = payload.uuid || payload.component;
        return fetcher(`/api/vault-omni/verify?uuid=${uuid}`, {});
    },
    /**
     * OmniAgent Vision Scan
     * Bridges to existing vision logic or new Alchemy
     */
    scanVision: (fileId, fileType) => fetcher('/api/omniagent/vision', { fileId, fileType }),
    /**
     * OmniAgent Alchemy Extraction
     * Bridges to the new UCC Engine-backed Alchemy
     */
    extractMetrics: (fileId) => fetcher('/api/omniagent/alchemy', { fileId }),
};
//# sourceMappingURL=api-client.js.map