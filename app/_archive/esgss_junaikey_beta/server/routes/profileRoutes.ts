// server/routes/profileRoutes.ts

import express from 'express';
import * as profileService from '../services/profileService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Protect all routes in this file
router.use(authenticateToken);

/**
 * GET /api/profile/leaderboard
 * Retrieves the leaderboard.
 */
router.get('/leaderboard',
  cacheMiddleware({ ttl: 3600, keyPrefix: 'leaderboard' }),
  asyncHandler(async (req, res) => {
    const leaderboard = await profileService.calculateLeaderboard();
    res.json(leaderboard);
  })
);

/**
 * GET /api/profile/:userId
 * Retrieves a user profile.
 */
router.get('/:userId',
  cacheMiddleware({ ttl: 1800, keyPrefix: 'profile', useUserContext: true }),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const profile = await profileService.getUserProfile(userId);
    res.json(profile);
  })
);

/**
 * PUT /api/profile/:userId
 * Updates a user profile.
 */
router.put('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const updatedProfile = await profileService.updateUserProfile(userId, updates);

  // Invalidate cache
  await invalidateCache('profile:*');
  await invalidateCache('leaderboard');

  res.json(updatedProfile);
}));

export default router;

