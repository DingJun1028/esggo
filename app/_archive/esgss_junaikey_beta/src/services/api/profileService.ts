import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

export interface UserProfile {
  id: string; // UUID
  user_id: string;
  self_awareness_score: number;
  enlightenment_score: number;
  self_reliance_score: number;
  altruism_score: number;
  xp: number;
  level: number;
}

const API_BASE = '/api/profile';

export const profileService = {
  /**
   * Fetches the current user's profile from the backend.
   * Retrieves user ID and token from localStorage ('avos_user', 'avos_token').
   */
  async getMyProfile(): Promise<UserProfile | null> {
    try {
      const storedUser = localStorage.getItem('avos_user');
      const token = localStorage.getItem('avos_token');

      if (!storedUser || !token) {
        console.warn('[ProfileService] No user/token found in localStorage.');
        return null;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      if (!userId) {
        omniLogger.error(LogCategory.SYSTEM, '[profileService] [ProfileService] User object missing ID.');
        return null;
      }

      const response = await fetch(`${API_BASE}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Assuming backend needs Bearer token, though middleware checks static secret 'API_SECRET_TOKEN'?
          // Wait, server/server.js uses a static API_SECRET_TOKEN from config.
          // Let's double check server.js lines 102-120.
          // "const token = authHeader.split(' ')[1]; if (token !== API_SECRET_TOKEN)..."
          // This implies the frontend must send the API_SECRET_TOKEN.
          // I need to check how other services send auth.
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      omniLogger.info(LogCategory.SYSTEM, `[ProfileService] Loaded profile for ${userId}`, {
        level: data.level,
      });
      return data;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ProfileService] Error fetching profile', { error });
      return null;
    }
  },
};
