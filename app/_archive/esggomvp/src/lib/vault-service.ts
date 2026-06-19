/**
 * 🔒 Vault Service — ESG GO Omni Layer (Truth Module)
 * 
 * 處理 Evidence Vault 的數據流與 Hash，遵循「真」的設計哲學。
 * 此 Service 負責將資料寫入 NCB (或暫存 Mock) 並確保溯源屬性。
 */

import { ncbFetch } from './ncb-utils';

export interface EvidenceRecord {
    id?: number;
    title: string;
    description: string;
    uploader_id: string; // 關聯的使用者
    file_url?: string;
    file_hash: string; // SHA-256
    status: 'pending' | 'verified' | 'rejected';
    created_at?: string;
}

export const vaultService = {
    /**
     * 取得已上傳的證據列表
     */
    async getEvidenceList(): Promise<EvidenceRecord[]> {
        try {
            // Attempt to fetch from NoCodeBackend
            const { data, error } = await ncbFetch<any>('/api/data/list/evidence_vault');
            if (data) {
                return data;
            }
            if (error) throw new Error(error);
            return [];
        } catch (error) {
            console.warn("Vault API not yet configured. Returning mock data.");
            // Mock data fallback before NCB table is ready
            return [
                {
                    id: 1,
                    title: "2025 Carbon Emissions Report (Scope 1&2)",
                    description: "Initial data from facility sensors.",
                    uploader_id: "user_mock_001",
                    file_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    status: "verified",
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Supplier Water Usage Spreadsheet",
                    description: "Q3 supplier data.",
                    uploader_id: "user_mock_001",
                    file_hash: "a9993e364706816aba3e25717850c26c9cd0d89d",
                    status: "pending",
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];
        }
    },

    /**
     * 上傳新證據
     */
    async uploadEvidence(record: Omit<EvidenceRecord, 'id' | 'created_at'>): Promise<EvidenceRecord> {
        try {
            const { data, error } = await ncbFetch<any>('/api/data/create/evidence_vault', {
                method: 'POST',
                body: JSON.stringify(record)
            });
            if (data) return data;
            throw new Error(error || "Unknown upload error");
        } catch (error) {
            console.warn("Vault API not yet configured. Simulating successful upload.");
            return {
                ...record,
                id: Math.floor(Math.random() * 1000) + 10,
                created_at: new Date().toISOString()
            };
        }
    }

};
