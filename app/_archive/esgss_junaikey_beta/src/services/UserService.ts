/**
 * 👤 User Service
 * --------------------------------------------------
 * Handles user-specific data persistence via Firebase Firestore.
 * - Daily News Generation & Caching
 * - AI Garden State (Cultivation)
 * - North Star Goals
 */
import { db } from './firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { omniLogger, LogCategory } from '../2-infra/logging/OmniLogger.js';
import { IIntelNode } from '../types/intelligence.js';
import { SubscriptionTier } from '../types/core/index.js';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  northStar?: {
    goal: string;
    deadline?: number;
    progress: number;
    metrics: string[];
  };
  subscriptionTier: SubscriptionTier;
  createdAt: number;
  lastLoginAt: number;
  onboardingCompleted?: boolean;
  archetype?: string;
}

export interface UserNewsFeed {
  date: string; // YYYY-MM-DD
  news: IIntelNode[];
  generatedAt: number;
}

export class UserService {
  private static USERS_COLLECTION = 'users';

  /**
   * 🟢 Sync User Profile on Login
   * Creates if new, updates lastLogin if exists.
   */
  static async syncUserProfile(user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  }): Promise<UserProfile> {
    if (!user.email) throw new Error('User email required');

    const userRef = doc(db, this.USERS_COLLECTION, user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      await updateDoc(userRef, { lastLoginAt: Date.now() });
      return snap.data() as UserProfile;
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Traveler',
        subscriptionTier: SubscriptionTier.FREE,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      await setDoc(userRef, newProfile);
      omniLogger.info(LogCategory.AGENT, `✨ New User Profile Created: ${user.uid}`);
      return newProfile;
    }
  }

  /**
   * 📰 Get Daily Unique News
   * Checks for today's news in `users/{uid}/daily_news/{date}`.
   * If missing, generates 3 fresh items and saves them.
   */
  static async getDailyNews(uid: string): Promise<IIntelNode[]> {
    const todayStr: string = new Date().toISOString().split('T')[0] || new Date().toDateString();
    const newsRef = doc(db, UserService.USERS_COLLECTION, uid, 'daily_news', todayStr);

    try {
      const snap = await getDoc(newsRef);

      if (snap.exists()) {
        omniLogger.info(LogCategory.SYSTEM, '📰 Loaded Cached Daily News');
        return (snap.data() as UserNewsFeed).news;
      }

      // Generate Fresh News (Mock for now, would be AI Agent later)
      omniLogger.info(LogCategory.SYSTEM, '🎲 Generating Fresh Daily News');
      const freshNews = this.generateMockNews(todayStr);

      await setDoc(newsRef, {
        date: todayStr,
        news: freshNews,
        generatedAt: Date.now(),
      });

      return freshNews;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to fetch daily news', { error });
      return [];
    }
  }

  /**
   * 🌱 Save AI Garden State
   */
  static async saveAiData(uid: string, aiState: any): Promise<void> {
    const gardenRef = doc(db, this.USERS_COLLECTION, uid, 'features', 'ai_garden');
    await setDoc(gardenRef, { ...aiState, updatedAt: Date.now() }, { merge: true });
  }

  /**
   * 🌟 Update North Star Logic
   */
  static async updateNorthStar(uid: string, goal: string): Promise<void> {
    await this.updateUserProfile(uid, {
      northStar: {
        goal,
        progress: 0,
        metrics: [],
        // @ts-ignore - Adding startedAt if needed, or stick to interface
        startedAt: Date.now(),
      },
    });
  }

  /**
   * 🔄 Update User Profile
   * Allows partial updates to the user profile.
   */
  static async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, uid);
    try {
      await updateDoc(userRef, { ...data, updatedAt: Date.now() });
      omniLogger.info(LogCategory.AGENT, `👤 User Profile Updated: ${uid}`, { fields: Object.keys(data) });
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, `❌ Failed to update User Profile: ${uid}`, { error });
      throw error;
    }
  }

  // --- Helpers ---

  private static generateMockNews(date: string): IIntelNode[] {
    // Generate 3 random news items based on "today" to simulate unique content
    // In real implementation, this calls IntelligenceService with strict 4+1 Protocol
    return [
      {
        uuid: `news-${date}-1`,
        version: '1.0',
        timestamp: Date.now(),
        status: 'Trustworthy',
        label: `Market Trend ${date}`,
        sourceType: 'S5',
        evidence: {
          tangible: {
            metric: '15%',
            visual_grade: 'GOLD',
            glow_intensity: 50,
          },
          traceable: {
            source_origin: 'Global Market',
            verification_links: [],
          },
          trackable: {
            lifecycle_hooks: [],
            pathway: ['Market', 'APAC'],
          },
          transparent: {
            formula: 'Trend_Algo_v1',
            validation_standard: 'ISO-Standard',
          },
          trustworthy: {
            hash_lock: '0xMockHash1',
            is_frozen: true,
          },
        },
        data: { title: 'Green Energy Surge', summary: 'Solar adoption up 15% in APAC region.' },
      } as unknown as IIntelNode, // Cast for brevity in mock
      // Add more...
    ];
  }
}
