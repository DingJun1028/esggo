
import { OmniSpaceDocument } from '@/types/esg-go/omni-sync.types';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * Service for managing user digital assets (reports, badges, evidence)
 * Pillars: 3. User Verification & Storage
 */
export class UserAssetService {
    // In-memory mock storage for beta (replace with Supabase/API later)
    private static assets: OmniSpaceDocument[] = [
        {
            id: 'asset-mock-1',
            name: 'ESG_Report_2023_Final.pdf',
            type: 'pdf',
            size_bytes: 2048576,
            contact_id: 'current-user', // Mock user ID
            file_hash: 'sha256-mock-hash-1',
            is_locked: true,
            verification_status: 'verified',
            uploaded_at: '2025-12-15T10:00:00Z'
        }
    ];

    /**
     * Add a new asset to the user's vault
     */
    static async addAsset(asset: Omit<OmniSpaceDocument, 'id' | 'uploaded_at' | 'verification_status'>): Promise<OmniSpaceDocument> {
        try {
            const newAsset: OmniSpaceDocument = {
                ...asset,
                id: `asset-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                uploaded_at: new Date().toISOString(),
                verification_status: 'pending', // Pending OmniKey verification
                is_locked: asset.is_locked || false
            };

            this.assets.unshift(newAsset);
            omniLogger.info(LogCategory.BUSINESS, 'User asset added', { assetId: newAsset.id, type: newAsset.type });
            return newAsset;
        } catch (error) {
            omniLogger.error(LogCategory.BUSINESS, 'Failed to add user asset', { error });
            throw error;
        }
    }

    /**
     * Retrieve assets for a specific user
     */
    static async getAssets(contactId: string = 'current-user'): Promise<OmniSpaceDocument[]> {
        // specific filter for mocked user
        return this.assets.filter(a => a.contact_id === contactId);
    }

    /**
     * Update verification status (simulating OmniKey/Blockchain verification)
     */
    static async verifyAsset(assetId: string, status: 'verified' | 'rejected'): Promise<OmniSpaceDocument | null> {
        const asset = this.assets.find(a => a.id === assetId);
        if (asset) {
            asset.verification_status = status;
            asset.is_locked = status === 'verified';
            return asset;
        }
        return null;
    }
}
