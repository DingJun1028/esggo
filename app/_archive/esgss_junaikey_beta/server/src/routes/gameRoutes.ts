/**
 * gameRoutes.ts
 * 遊戲系統路由配置
 * 
 * 路由結構：
 * - /api/game/cards/* - 卡牌管理
 * - /api/game/decks/* - 牌組管理
 * - /api/game/battle/* - 戰鬥系統
 * - /api/game/ai/* - AI 養成
 */

import { Router } from 'express';
import { GameController } from '../controllers/GameController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { apiRateLimiter } from '../middleware/security.js';

const router = Router();

// 所有遊戲路由都需要身份驗證
router.use(authenticateJWT);

// ===== 卡牌管理路由 =====
router.get('/cards/collection', GameController.getCardCollection);
router.get('/cards/statistics', GameController.getCardStatistics);
router.get('/cards/:cardId', GameController.getCardDetails);
router.post('/cards/:cardId/enhance', GameController.enhanceCard);
router.post('/cards/:cardId/favorite', GameController.toggleFavorite);

// ===== 牌組管理路由 =====
router.get('/decks', GameController.getDecks);
router.get('/decks/:deckId', GameController.getDeckDetails);
router.post('/decks', GameController.createDeck);
router.put('/decks/:deckId', GameController.updateDeck);
router.delete('/decks/:deckId', GameController.deleteDeck);
router.post('/decks/:deckId/activate', GameController.activateDeck);

// ===== 戰鬥系統路由 =====
router.post('/battle/start', apiRateLimiter, GameController.startBattle);
router.post('/battle/:battleId/action', apiRateLimiter, GameController.executeBattleAction);
router.get('/battle/:battleId', GameController.getBattleState);
router.get('/battle/history', GameController.getBattleHistory);

// ===== AI 養成路由 =====
router.get('/ai/companion', GameController.getAICompanion);
router.get('/ai/companion/suggestions', GameController.getAIGrowthSuggestions);
router.post('/ai/companion/train', GameController.trainAI);
router.put('/ai/companion/strategy', GameController.updateAIStrategy);

export default router;
