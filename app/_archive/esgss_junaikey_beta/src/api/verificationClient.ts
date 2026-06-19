import axios from 'axios';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { ImpactProof } from '@/types/core';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Verification Client (Frontend Adapter)
 * Connects to the 5T Sentinel Verification API.
 */
export const verificationClient = {
  /**
   * Verify an asset by UUID.
   * @param uuid The unique identifier of the asset.
   */
  verifyAsset: async (uuid: string): Promise<ImpactProof> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/verification/${uuid}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Verification failed');
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, '[verificationClient] Verification Client Error:', { error })
      throw error;
    }
  },
};
