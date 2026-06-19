/**
 * GameController.ts
 * 遊戲系統控制器：處理所有遊戲相關的 HTTP 請求
 * 
 * 端點分類：
 * - 卡牌管理（3個）
 * - 牌組管理（5個）
 * - 戰鬥系統（4個）
 * - AI 養成（3個）
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../services/ErrorHandler.js';
import { CardService } from '../services/game/CardService.js';
import { DeckService } from '../services/game/DeckService.js';
import { BattleEngine } from '../services/game/BattleEngine.js';
import { AIDecisionService } from '../services/game/AIDecisionService.js';
import { AICompanionService } from '../services/game/AICompanionService.js';

export class GameController {
    // ===== 卡牌管理 =====

    /**
     * GET /api/game/cards/collection
     * 獲取玩家卡牌收藏
     */
    static getCardCollection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id; // 從 JWT 中間件獲取
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { rarity, element, card_type, sort, page, limit } = req.query;

        const result = await CardService.getCardCollection({
            userId,
            rarity: rarity as any,
            element: element as any,
            cardType: card_type as any,
            sort: sort as any,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    });

    /**
     * GET /api/game/cards/:cardId
     * 獲取單張卡牌詳情
     */
    static getCardDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { cardId } = req.params;

        const card = await CardService.getCardDetails(userId, cardId);

        res.status(200).json({
            success: true,
            data: card,
        });
    });

    /**
     * POST /api/game/cards/:cardId/enhance
     * 強化卡牌
     */
    static enhanceCard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { cardId } = req.params;
        const { enhancement_type, resource_cost } = req.body;

        const result = await CardService.enhanceCard({
            userId,
            cardId,
            enhancementType: enhancement_type,
            resourceCost: resource_cost,
        });

        res.status(200).json({
            success: true,
            data: result,
            message: '卡牌強化成功',
        });
    });

    /**
     * POST /api/game/cards/:cardId/favorite
     * 切換收藏狀態
     */
    static toggleFavorite = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { cardId } = req.params;

        const result = await CardService.toggleFavorite(userId, cardId);

        res.status(200).json({
            success: true,
            data: result,
        });
    });

    /**
     * GET /api/game/cards/statistics
     * 獲取卡牌統計
     */
    static getCardStatistics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const stats = await CardService.getCardStatistics(userId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    });

    // ===== 牌組管理 =====

    /**
     * GET /api/game/decks
     * 獲取玩家所有牌組
     */
    static getDecks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const decks = await DeckService.getDecks(userId);

        res.status(200).json({
            success: true,
            data: decks,
        });
    });

    /**
     * GET /api/game/decks/:deckId
     * 獲取牌組詳情
     */
    static getDeckDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { deckId } = req.params;

        const deck = await DeckService.getDeckDetails(userId, deckId);

        res.status(200).json({
            success: true,
            data: deck,
        });
    });

    /**
     * POST /api/game/decks
     * 創建新牌組
     */
    static createDeck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { deck_name, description, deck_type, cards } = req.body;

        const newDeck = await DeckService.createDeck({
            userId,
            deckName: deck_name,
            description,
            deckType: deck_type,
            cards,
        });

        res.status(201).json({
            success: true,
            data: newDeck,
            message: '牌組創建成功',
        });
    });

    /**
     * PUT /api/game/decks/:deckId
     * 更新牌組
     */
    static updateDeck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { deckId } = req.params;
        const { deck_name, description, deck_type, cards } = req.body;

        const updatedDeck = await DeckService.updateDeck({
            userId,
            deckId,
            deckName: deck_name,
            description,
            deckType: deck_type,
            cards,
        });

        res.status(200).json({
            success: true,
            data: updatedDeck,
            message: '牌組更新成功',
        });
    });

    /**
     * DELETE /api/game/decks/:deckId
     * 刪除牌組
     */
    static deleteDeck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { deckId } = req.params;

        await DeckService.deleteDeck(userId, deckId);

        res.status(200).json({
            success: true,
            message: '牌組刪除成功',
        });
    });

    /**
     * POST /api/game/decks/:deckId/activate
     * 啟用牌組
     */
    static activateDeck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { deckId } = req.params;

        const activatedDeck = await DeckService.activateDeck(userId, deckId);

        res.status(200).json({
            success: true,
            data: activatedDeck,
            message: '牌組已啟用',
        });
    });

    // ===== 戰鬥系統 =====

    /**
     * POST /api/game/battle/start
     * 開始新戰鬥
     */
    static startBattle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { battle_type, difficulty, deck_id, opponent_id } = req.body;

        // 獲取當前牌組（如果未指定）
        let deckId = deck_id;
        if (!deckId) {
            const activeDeck = await DeckService.getActiveDeck(userId);
            if (!activeDeck) {
                throw new AppError('請先創建並啟用一個牌組', 400);
            }
            deckId = activeDeck.id;
        }

        // PVE 模式：對手為 AI
        let opponentId = opponent_id;
        let opponentDeckId = null;

        if (battle_type === 'PVE') {
            // 創建 AI 對手（暫時使用預設牌組）
            opponentId = 'ai_opponent';
            opponentDeckId = deckId; // 暫時使用相同牌組
        }

        const battleState = await BattleEngine.initializeBattle({
            player1Id: userId,
            player2Id: opponentId,
            deck1Id: deckId,
            deck2Id: opponentDeckId || deckId,
            battleType: battle_type,
            difficulty,
        });

        res.status(201).json({
            success: true,
            data: battleState,
            message: '戰鬥開始',
        });
    });

    /**
     * POST /api/game/battle/:battleId/action
     * 執行戰鬥動作
     */
    static executeBattleAction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { battleId } = req.params;
        const { action_type, card_id, target } = req.body;

        const updatedState = await BattleEngine.executeTurn(battleId, userId, {
            actionType: action_type,
            cardId: card_id,
            target,
        });

        res.status(200).json({
            success: true,
            data: updatedState,
        });
    });

    /**
     * GET /api/game/battle/:battleId
     * 獲取戰鬥狀態
     */
    static getBattleState = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { battleId } = req.params;
        const state = await BattleEngine.loadBattleState(battleId);

        res.status(200).json({
            success: true,
            data: state,
        });
    });

    /**
     * GET /api/game/battle/history
     * 獲取戰鬥歷史
     */
    static getBattleHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        // TODO: 實作戰鬥歷史查詢
        throw new AppError('功能開發中', 501);
    });

    // ===== AI 養成 =====

    /**
     * GET /api/game/ai/companion
     * 獲取 AI 數位分身
     */
    static getAICompanion = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const aiCompanion = await AICompanionService.getAICompanion(userId);

        res.status(200).json({
            success: true,
            data: aiCompanion,
        });
    });

    /**
     * POST /api/game/ai/companion/train
     * 訓練 AI
     */
    static trainAI = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { training_type, training_data } = req.body;

        const result = await AICompanionService.trainAI({
            userId,
            trainingType: training_type,
            trainingData: training_data,
        });

        res.status(200).json({
            success: true,
            data: result,
            message: 'AI 訓練完成',
        });
    });

    /**
     * PUT /api/game/ai/companion/strategy
     * 更新 AI 策略
     */
    static updateAIStrategy = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const { strategy } = req.body;

        const result = await AICompanionService.updateStrategy({
            userId,
            strategy,
        });

        res.status(200).json({
            success: true,
            data: result,
            message: 'AI 策略更新成功',
        });
    });

    /**
     * GET /api/game/ai/companion/suggestions
     * 獲取 AI 成長建議
     */
    static getAIGrowthSuggestions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('未授權', 401);
        }

        const suggestions = await AICompanionService.getGrowthSuggestions(userId);

        res.status(200).json({
            success: true,
            data: suggestions,
        });
    });
}
