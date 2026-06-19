import { EvidenceItem, EvidenceStatus } from '@/types/esg_go_schema.js';



export class EvidenceVaultService {
    // 5T Traceable: Fetch evidence from the verifiable ledger (API)
    public async getEvidenceList(): Promise<EvidenceItem[]> {
        const response = await fetch('/api/evidence/mine');
        if (!response.ok) {
            throw new Error('Failed to fetch evidence');
        }
        const data = await response.json();

        // Map backend EvidenceRecord to frontend EvidenceItem
        return data.map((record: any) => ({
            id: record.id.toString(),
            fileName: record.description || record.storage_path.split(/[/\\]/).pop() || 'Unknown File',
            fileSize: 0, // Not currently stored in DB
            fileType: record.data_type,
            uploadDate: new Date(record.created_at).getTime(),
            timestamp: new Date(record.created_at).getTime(),
            source_origin: `User-${record.user_id}`, // Traceable Identity
            hash_sha256: 'Verified (Hidden on Client)', // Hash check is backend-side for now or needs new field
            status: record.status === 'approved' ? 'Verified_Trustworthy' : 'Pending_Verification',
            tags: [record.data_type],
            description: record.description
        }));
    }

    // 5T Trustworthy: Secure upload with Hash Lock
    public async uploadEvidence(file: File, type: string): Promise<EvidenceItem> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data_type', type);
        formData.append('description', file.name); // Store filename as description for now

        const response = await fetch('/api/evidence', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload evidence');
        }

        const record = await response.json();

        return {
            id: record.id.toString(),
            fileName: record.description || file.name,
            fileSize: file.size,
            fileType: record.data_type,
            uploadDate: new Date(record.created_at).getTime(),
            timestamp: new Date(record.created_at).getTime(),
            source_origin: `User-${record.user_id}`,
            hash_sha256: 'Pending Hash Confirmation',
            status: 'Pending_Verification',
            tags: [type],
            description: record.description
        };
    }
}

export const evidenceVaultService = new EvidenceVaultService();
