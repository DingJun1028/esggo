/**
 * 🎮 ARPG 善向永續村 - NPC 角色對話系統
 * 
 * 功能：
 * - NPC 角色管理
 * - 對話樹系統
 * - 任務觸發機制
 * - 互動式對話 UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Scroll, Map, Lock, Zap, Database, Activity,
    User, Box, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Sword, Shield, Coins, Gift, Tree, Hammer, Star,
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
    MessageCircle, UserPlus, CheckCircle, AlertCircle,
    BookOpen, Sparkles, Heart, Eye
} from 'lucide-react';
import { omniPriest } from '@/services/OmniPriestService';
import { OmniEntityPrefix } from '@/utils/OmniUUIDGenerator.js';

// ============================================================================
// 🎯 類型定義
// ============================================================================

// 村莊區域
type VillageZone =
    | 'VILLAGE'      // 善向永續村廣場
    | 'HUT'          // 我的小屋
    | 'GUILD'        // 公會
    | 'WILD'         // 荒野
    | 'ALTAR'        // 祭壇
    | 'TOWER';       // 輪迴塔

// 對話選項
interface DialogueOption {
    id: string;
    text: string;
    nextNode: string | null;
    action?: () => void;
    condition?: () => boolean;
    lockedMessage?: string;
}

// 對話節點
interface DialogueNode {
    id: string;
    speaker: string;
    portrait: string;
    text: string;
    options: DialogueOption[];
    mood?: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited';
}

// NPC 定義
interface NPC {
    id: string;
    name: string;
    zone: VillageZone;
    role: string;
    portrait: string;
    color: string;
    dialogues: Record<string, DialogueNode>;
    questGiver: boolean;
    unlocked: boolean;
}

// 對話狀態
interface DialogueState {
    isActive: boolean;
    currentNPC: NPC | null;
    currentNode: string;
    history: string[];
}

// ============================================================================
// 🗣️ NPC 角色數據
// ============================================================================

const NPC_DATA: NPC[] = [
    {
        id: 'dr-thoth',
        name: 'Dr. Thoth 壽司博士',
        zone: 'VILLAGE',
        role: '引導者',
        portrait: '𓅝',
        color: 'aqua',
        questGiver: true,
        unlocked: true,
        dialogues: {
            greeting: {
                id: 'greeting',
                speaker: 'Dr. Thoth',
                portrait: '𓅝',
                text: '歡迎回來，英雄！我是掌管智慧與知識的 Dr. Thoth。在這片永續之地，您的每一個選擇都將被銘記於區塊鏈之上。',
                mood: 'neutral',
                options: [
                    { id: 'ask-quest', text: '有什麼任務嗎？', nextNode: 'quest-intro' },
                    { id: 'ask-guide', text: '村莊該怎麼探索？', nextNode: 'village-guide' },
                    { id: 'ask-bye', text: '我再四處看看', nextNode: null }
                ]
            },
            'quest-intro': {
                id: 'quest-intro',
                speaker: 'Dr. Thoth',
                portrait: '𓅝',
                text: '目前村民們正面臨「碳足跡計算」的難題。若您願意幫助他們理解範疇一與範疇二的差異，將獲得豐厚的經驗值與聲望！',
                mood: 'excited',
                options: [
                    { id: 'accept-quest', text: '我願意幫忙！', nextNode: 'quest-accepted' },
                    { id: 'ask-detail', text: '能詳細說明嗎？', nextNode: 'quest-detail' },
                    { id: 'decline', text: '讓我考慮一下', nextNode: null }
                ]
            },
            'quest-detail': {
                id: 'quest-detail',
                speaker: 'Dr. Thoth',
                portrait: '𓅝',
                text: '範疇一是直接排放，例如公司車輛燃燒的汽油。範疇二是間接排放，例如外購電力。這是計算碳足跡的基礎！',
                mood: 'neutral',
                options: [
                    { id: 'back-accept', text: '我懂了，願意接受！', nextNode: 'quest-accepted' },
                    { id: 'back-ask', text: '還有其他問題', nextNode: 'quest-intro' }
                ]
            },
            'quest-accepted': {
                id: 'quest-accepted',
                speaker: 'Dr. Thoth',
                portrait: '𓅝',
                text: '太好了！前往公會找 Scroll Scholar，他會引導您完成後續的學習。記住：真實、透明、可追溯是 5T 協議的核心！',
                mood: 'happy',
                options: [
                    { id: 'complete', text: '我這就去！', nextNode: null }
                ]
            },
            'village-guide': {
                id: 'village-guide',
                speaker: 'Dr. Thoth',
                portrait: '𓅝',
                text: '使用鍵盤方向鍵移動！🏠小屋存放您的收藏，📜公會接受任務，🌲荒野進行實作，🔮祭壇執行儀式。還有🗼輪迴塔等您挑戰！',
                mood: 'neutral',
                options: [
                    { id: 'got-it', text: '了解了！', nextNode: null }
                ]
            }
        }
    },
    {
        id: 'scroll-scholar',
        name: 'Scroll Scholar 捲軸學者',
        zone: 'GUILD',
        role: '知識守護者',
        portrait: '📜',
        color: 'purple',
        questGiver: true,
        unlocked: false,
        dialogues: {
            greeting: {
                id: 'greeting',
                speaker: 'Scroll Scholar',
                portrait: '📜',
                text: '知識是力量的源泉！我是掌管所有 ESG 知識的 Scroll Scholar。每一張知識卡牌都蘊含著改變世界的力量。',
                mood: 'neutral',
                options: [
                    { id: 'learn-card', text: '什麼是知識卡牌？', nextNode: 'card-info' },
                    { id: 'ask-quest', text: '有新的挑戰嗎？', nextNode: 'quest-offer' },
                    { id: 'bye', text: '再見', nextNode: null }
                ]
            },
            'card-info': {
                id: 'card-info',
                speaker: 'Scroll Scholar',
                portrait: '📜',
                text: '知識卡牌分為四類：🌿 E (環境) - 綠色、💖 S (社會) - 粉色、🏛️ G (治理) - 藍色、✨ Omni (奧秘) - 金色。每張卡牌都有稀有度與 5T 認證狀態！',
                mood: 'excited',
                options: [
                    { id: 'back-main', text: '回到主題', nextNode: 'greeting' }
                ]
            },
            'quest-offer': {
                id: 'quest-offer',
                speaker: 'Scroll Scholar',
                portrait: '📜',
                text: '我這裡有一張關於「生物多樣性」的稀有卡牌。不過要獲得它，您需要通過我的知識試煉！',
                mood: 'neutral',
                options: [
                    { id: 'accept-trial', text: '接受試煉！', nextNode: 'trial-start' },
                    { id: 'maybe', text: '讓我準備一下', nextNode: null }
                ]
            },
            'trial-start': {
                id: 'trial-start',
                speaker: 'Scroll Scholar',
                portrait: '📜',
                text: '試煉內容：解釋 GRI 304-1 與 304-3 的差異。限時 30 秒！準備好了嗎？',
                mood: 'neutral',
                options: [
                    { id: 'start-timer', text: '準備好了！', nextNode: null },
                    { id: 'cancel', text: '再等一下', nextNode: null }
                ]
            }
        }
    },
    {
        id: 'forest-spirit',
        name: 'Forest Spirit 森林精靈',
        zone: 'WILD',
        role: '自然守護者',
        portrait: '🌳',
        color: 'emerald',
        questGiver: true,
        unlocked: false,
        dialogues: {
            greeting: {
                id: 'greeting',
                speaker: 'Forest Spirit',
                portrait: '🌳',
                text: '沙沙...歡迎來到荒野。我是守護這片森林的精靈。我能感受每一棵樹的呼吸，每一朵花的脈動。',
                mood: 'neutral',
                options: [
                    { id: 'nature-talk', text: '能教我自然知識嗎？', nextNode: 'nature-lesson' },
                    { id: 'ask-help', text: '森林需要幫助嗎？', nextNode: 'help-request' },
                    { id: 'bye', text: '很榮幸見到您', nextNode: null }
                ]
            },
            'nature-lesson': {
                id: 'nature-lesson',
                speaker: 'Forest Spirit',
                portrait: '🌳',
                text: '永續不只是口號，而是與自然的和諧共生。種一棵樹、減少一次性塑料、選擇公共交通...每一個小行動都能產生巨大改變！',
                mood: 'happy',
                options: [
                    { id: 'learn-more', text: '我想更深入了解', nextNode: 'deep-nature' },
                    { id: 'back', text: '謝謝您', nextNode: null }
                ]
            },
            'deep-nature': {
                id: 'deep-nature',
                speaker: 'Forest Spirit',
                portrait: '🌳',
                text: '在 ESG 中，「S」不僅是人類社會，也包含我們與自然生態的關係。生物多樣性、森林保護、海洋永續...這都是我們的責任！',
                mood: 'excited',
                options: [
                    { id: 'quest-offer', text: '有我可以幫忙的嗎？', nextNode: 'help-request' },
                    { id: 'complete', text: '我會記住的', nextNode: null }
                ]
            },
            'help-request': {
                id: 'help-request',
                speaker: 'Forest Spirit',
                portrait: '🌳',
                text: '東邊的生態池受到了污染。請幫我收集 5 個淨化道具，我會贈予您「生命之樹」卡牌作為感謝！',
                mood: 'sad',
                options: [
                    { id: 'accept-clean', text: '我會幫忙！', nextNode: 'clean-quest-accepted' },
                    { id: 'later', text: '我現在有事', nextNode: null }
                ]
            },
            'clean-quest-accepted': {
                id: 'clean-quest-accepted',
                speaker: 'Forest Spirit',
                portrait: '🌳',
                text: '謝謝您！淨化道具可以在公會交換。完成後回到這裡，我會為您祝福！🌟',
                mood: 'happy',
                options: [
                    { id: 'complete', text: '一定完成任務！', nextNode: null }
                ]
            }
        }
    },
    {
        id: 'altar-keeper',
        name: 'Altar Keeper 祭壇守護者',
        zone: 'ALTAR',
        role: '儀式主持者',
        portrait: '🔮',
        color: 'pink',
        questGiver: true,
        unlocked: false,
        dialogues: {
            greeting: {
                id: 'greeting',
                speaker: 'Altar Keeper',
                portrait: '🔮',
                text: '歡迎來到永恆祭壇！在這裡，知識將被永遠銘刻於區塊鏈之上。每一張封印的卡牌都是不可篡改的真理。',
                mood: 'neutral',
                options: [
                    { id: 'ask-seal', text: '什麼是封印儀式？', nextNode: 'seal-info' },
                    { id: 'ask-5t', text: '5T 協議是什麼？', nextNode: '5t-explain' },
                    { id: 'bye', text: '再見', nextNode: null }
                ]
            },
            'seal-info': {
                id: 'seal-info',
                speaker: 'Altar Keeper',
                portrait: '🔮',
                text: '封印儀式需要通過 5T 驗證：1.Tangible-賦予定義 2.Traceable-標註來源 3.Trackable-記錄路徑 4.Transparent-公開公式 5.Trustworthy-雜湊鎖定',
                mood: 'excited',
                options: [
                    { id: 'witness', text: '我想見證封印！', nextNode: 'witness-seal' },
                    { id: 'back', text: '了解了', nextNode: 'greeting' }
                ]
            },
            '5t-explain': {
                id: '5t-explain',
                speaker: 'Altar Keeper',
                portrait: '🔮',
                text: '5T 是善向永續的核心協議：真實(Traceable)、溯源(Traceable)、追蹤(Trackable)、透明(Transparent)、可信(Trustworthy)。這是 Web3 時代的信任基石！',
                mood: 'neutral',
                options: [
                    { id: 'back', text: '受教了', nextNode: 'greeting' }
                ]
            },
            'witness-seal': {
                id: 'witness-seal',
                speaker: 'Altar Keeper',
                portrait: '🔮',
                text: '此刻！區塊鏈上正有一張新的 ESG 知識卡正在被封印。讓我們共同見證這不可篡改的一刻！',
                mood: 'excited',
                options: [
                    { id: 'witness', text: '✨ 我見證！', nextNode: null }
                ]
            }
        }
    },
    {
        id: 'tower-guardian',
        name: 'Tower Guardian 塔之守衛',
        zone: 'TOWER',
        role: '試煉考官',
        portrait: '🗼',
        color: 'red',
        questGiver: true,
        unlocked: false,
        dialogues: {
            greeting: {
                id: 'greeting',
                speaker: 'Tower Guardian',
                portrait: '🗼',
                text: '哼！又一個挑戰者嗎？我是無限輪迴塔的守衛。只有通過層層試煉，才能獲得真正的力量！',
                mood: 'angry',
                options: [
                    { id: 'ask-tower', text: '輪迴塔是什麼？', nextNode: 'tower-intro' },
                    { id: 'challenge', text: '我要挑戰！', nextNode: 'challenge-accept' },
                    { id: 'leave', text: '我還沒準備好', nextNode: null }
                ]
            },
            'tower-intro': {
                id: 'tower-intro',
                speaker: 'Tower Guardian',
                portrait: '🗼',
                text: '無限輪迴塔共有 100 層，每層都有不同的 ESG 知識試煉。戰勝敵人、回答問題、收集寶藏...每過 10 層都有稀有獎勵！',
                mood: 'neutral',
                options: [
                    { id: 'rewards', text: '有哪些獎勵？', nextNode: 'tower-rewards' },
                    { id: 'to-challenge', text: '我要挑戰！', nextNode: 'challenge-accept' }
                ]
            },
            'tower-rewards': {
                id: 'tower-rewards',
                speaker: 'Tower Guardian',
                portrait: '🗼',
                text: '每 10 層：傳說卡牌碎片、专属稱號、限定外觀。第 50 層：傳說 Omni 卡牌！第 100 層：完整「永恆之心」徽章！',
                mood: 'neutral',
                options: [
                    { id: 'burning', text: '我熱血沸騰了！', nextNode: 'challenge-accept' }
                ]
            },
            'challenge-accept': {
                id: 'challenge-accept',
                speaker: 'Tower Guardian',
                portrait: '🗼',
                text: '很好！那就讓我看看你的實力！第一層的敵人是「碳排放小惡魔」，準備好了嗎？',
                mood: 'neutral',
                options: [
                    { id: 'enter', text: '進入戰鬥！', nextNode: null },
                    { id: 'wait', text: '讓我準備一下', nextNode: null }
                ]
            }
        }
    }
];

// ============================================================================
// 🎭 NPC 角色組件
// ============================================================================

const NPCCharacter = ({
    npc,
    isNearby,
    onInteract
}: {
    npc: NPC;
    isNearby: boolean;
    onInteract: () => void;
}) => {
    const getColorClass = () => {
        switch (npc.color) {
            case 'aqua': return 'from-aqua-500 to-blue-600';
            case 'purple': return 'from-purple-500 to-indigo-600';
            case 'emerald': return 'from-emerald-500 to-green-600';
            case 'pink': return 'from-pink-500 to-rose-600';
            case 'red': return 'from-red-500 to-orange-600';
            default: return 'from-aqua-500 to-blue-600';
        }
    };

    return (
        <motion.div
            className="absolute z-40 cursor-pointer"
            initial={{ scale: 0 }}
            animate={{
                scale: isNearby ? 1 : 0.9,
                y: isNearby ? 0 : 5
            }}
            whileHover={{ scale: 1.1 }}
            onClick={onInteract}
        >
            {/* NPC 頭像 */}
            <div className={`
                w-16 h-16 rounded-full
                bg-gradient-to-br ${getColorClass()}
                flex items-center justify-center
                shadow-[0_0_20px_rgba(0,255,255,0.5)]
                border-2 ${isNearby ? 'border-white' : 'border-white/30'}
                relative
            `}>
                {/* 互動提示 */}
                {isNearby && (
                    <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-aqua-500 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        按 E 互動
                    </motion.div>
                )}

                {/* 頭像圖示 */}
                <span className="text-3xl">{npc.portrait}</span>

                {/* 任務標記 */}
                {npc.questGiver && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border border-white">
                        <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            {/* 名稱標籤 */}
            <div className="mt-1 text-center">
                <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded">
                    {npc.name}
                </span>
            </div>
        </motion.div>
    );
};

// ============================================================================
// 💬 對話框組件
// ============================================================================

const DialogueBox = ({
    dialogue,
    onOptionClick,
    onClose
}: {
    dialogue: DialogueNode;
    onOptionClick: (option: DialogueOption) => void;
    onClose: () => void;
}) => {
    return (
        <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* 對話框 */}
            <motion.div
                className="w-full max-w-2xl mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
            >
                {/* 說話者資訊 */}
                <div className="flex items-center mb-4">
                    <div className={`
                        w-16 h-16 rounded-full
                        bg-gradient-to-br from-aqua-500 to-blue-600
                        flex items-center justify-center
                        border-2 border-white shadow-lg mr-4
                    `}>
                        <span className="text-3xl">{dialogue.portrait}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{dialogue.speaker}</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">Lv.5</span>
                            <span className="text-xs text-aqua-400">友好度：❤️❤️❤️❤️♡</span>
                        </div>
                    </div>
                </div>

                {/* 對話內容 */}
                <div className="bg-[#0a0f14]/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-4">
                    <p className="text-lg text-slate-200 leading-relaxed">
                        {dialogue.text}
                    </p>
                </div>

                {/* 選項列表 */}
                <div className="space-y-2">
                    {dialogue.options.map((option) => (
                        <motion.button
                            key={option.id}
                            onClick={() => onOptionClick(option)}
                            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-aqua-500/20 border border-white/20 hover:border-aqua-500/50 rounded-xl transition-all group"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <span className="text-aqua-400 mr-3 group-hover:text-aqua-300">
                                    →
                                </span>
                                <span className="text-slate-200 group-hover:text-white">
                                    {option.text}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* 關閉按鈕 */}
                <button
                    onClick={onClose}
                    className="mt-4 text-slate-500 hover:text-slate-300 text-sm flex items-center"
                >
                    <span className="mr-1">esc</span> 關閉對話
                </button>
            </motion.div>
        </motion.div>
    );
};

// ============================================================================
// 🎮 主頁面組件 (整合 NPC 系統)
// ============================================================================

const RPGVillagePage = () => {
    // 核心狀態
    const [currentZone, setCurrentZone] = useState<VillageZone>('VILLAGE');
    const [charPosition, setCharPosition] = useState({ x: 1, y: 1, direction: 'down' });
    const [isMoving, setIsMoving] = useState(false);

    // NPC 狀態
    const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
    const [dialogueState, setDialogueState] = useState<DialogueState>({
        isActive: false,
        currentNPC: null,
        currentNode: '',
        history: []
    });

    // 區域 NPC 映射
    const zoneNPCs = NPC_DATA.filter(npc => npc.zone === currentZone);

    // 鍵盤導航處理
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // 對話中阻擋移動
        if (dialogueState.isActive) {
            if (e.key === 'Escape') {
                closeDialogue();
            }
            return;
        }

        if (isMoving) return;

        const zonePositions: Record<VillageZone, { row: number; col: number }> = {
            'VILLAGE': { row: 1, col: 1 },
            'HUT': { row: 0, col: 0 },
            'GUILD': { row: 0, col: 2 },
            'WILD': { row: 2, col: 1 },
            'ALTAR': { row: 1, col: 2 },
            'TOWER': { row: 1, col: 0 }
        };

        let newZone: VillageZone | null = null;

        switch (e.key) {
            case 'ArrowUp':
                if (currentZone === 'VILLAGE') newZone = 'GUILD';
                else if (['GUILD'].includes(currentZone)) newZone = 'VILLAGE';
                setCharPosition(prev => ({ ...prev, direction: 'up' }));
                break;
            case 'ArrowDown':
                if (['GUILD'].includes(currentZone)) newZone = 'VILLAGE';
                else if (currentZone === 'VILLAGE') newZone = 'WILD';
                setCharPosition(prev => ({ ...prev, direction: 'down' }));
                break;
            case 'ArrowLeft':
                if (currentZone === 'VILLAGE') newZone = 'TOWER';
                else if (currentZone === 'GUILD') newZone = 'VILLAGE';
                else if (currentZone === 'ALTAR') newZone = 'VILLAGE';
                setCharPosition(prev => ({ ...prev, direction: 'left' }));
                break;
            case 'ArrowRight':
                if (currentZone === 'VILLAGE') newZone = 'GUILD';
                else if (currentZone === 'TOWER') newZone = 'VILLAGE';
                else if (currentZone === 'GUILD') newZone = 'ALTAR';
                setCharPosition(prev => ({ ...prev, direction: 'right' }));
                break;
            case 'e':
            case 'E':
                if (nearbyNPC) {
                    startDialogue(nearbyNPC);
                }
                break;
        }

        if (newZone && newZone !== currentZone) {
            setIsMoving(true);
            setCharPosition(prev => ({
                ...prev,
                x: zonePositions[newZone!].col,
                y: zonePositions[newZone!].row
            }));
            setTimeout(() => {
                setCurrentZone(newZone!);
                setIsMoving(false);
                setNearbyNPC(null);
            }, 300);
        }

        // 檢查附近 NPC
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            checkNearbyNPC();
        }
    }, [currentZone, isMoving, nearbyNPC, dialogueState.isActive]);

    // 鍵盤事件監聽
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // 檢查附近 NPC
    const checkNearbyNPC = useCallback(() => {
        const nearby = zoneNPCs.find(npc => npc.zone === currentZone);
        setNearbyNPC(nearby || null);
    }, [currentZone, zoneNPCs]);

    // 開始對話
    const startDialogue = (npc: NPC) => {
        setDialogueState({
            isActive: true,
            currentNPC: npc,
            currentNode: 'greeting',
            history: []
        });
    };

    // 處理對話選項
    const handleDialogueOption = (option: DialogueOption) => {
        // 執行選項動作
        if (option.action) {
            option.action();
        }

        // 移動到下一節點或關閉
        if (option.nextNode && dialogueState.currentNPC) {
            const nextNodeId = option.nextNode;
            setDialogueState(prev => ({
                ...prev,
                currentNode: nextNodeId,
                history: [...prev.history, prev.currentNode]
            }));

            // --- Omni-Priest Resonance Trigger ---
            // If selecting a quest-related action, trigger resonance
            if (option.id.includes('quest') || option.id.includes('accept') || option.id.includes('witness')) {
                omniPriest.handleRequest({
                    command: `VILLAGE_INTERACTION_${option.id.toUpperCase()}`,
                    payload: {
                        npc: dialogueState.currentNPC.id,
                        zone: currentZone,
                        action: option.text
                    },
                    userTier: 'Sovereign'
                });
            }
        } else {
            // Closing interaction - also a minor resonance event for completion
            if (dialogueState.currentNPC) {
                omniPriest.handleRequest({
                    command: `VILLAGE_LEAVE_${dialogueState.currentNPC.id.toUpperCase()}`,
                    payload: { npc: dialogueState.currentNPC.id, zone: currentZone },
                    userTier: 'Sovereign'
                });
            }
            closeDialogue();
        }
    };

    // 關閉對話
    const closeDialogue = () => {
        setDialogueState({
            isActive: false,
            currentNPC: null,
            currentNode: '',
            history: []
        });
    };

    // 獲取當前對話節點
    const getCurrentDialogueNode = (): DialogueNode | null => {
        if (!dialogueState.currentNPC) return null;
        return dialogueState.currentNPC.dialogues[dialogueState.currentNode] || null;
    };

    return (
        <div className="fixed inset-0 bg-[#0a0f14] text-slate-200 font-sans overflow-hidden">
            {/* 標題欄 */}
            <header className="h-14 border-b border-white/10 bg-[#0a0f14]/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center space-x-4">
                    <h1 className="text-lg font-bold tracking-wider text-aqua-400">
                        🎮 ARPG 善向永續村
                    </h1>
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                        {currentZone}
                    </span>
                </div>

                {/* 操作提示 */}
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↑↓←→</kbd>
                        移動
                    </span>
                    <span className="flex items-center">
                        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">E</kbd>
                        互動
                    </span>
                </div>
            </header>

            {/* 主遊戲區域 */}
            <div className="flex-1 relative">
                {/* 背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f1520] to-slate-900">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

                {/* 🎮 角色 */}
                <motion.div
                    className="absolute z-40"
                    animate={{
                        x: charPosition.x * 100,
                        y: charPosition.y * 80,
                        scale: isMoving ? 1.1 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-aqua-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.6)] border-2 border-white/40">
                        <User className="w-8 h-8 text-white" />
                    </div>
                </motion.div>

                {/* 🗣️ NPC 角色 */}
                {zoneNPCs.map((npc) => (
                    <NPCCharacter
                        key={npc.id}
                        npc={npc}
                        isNearby={nearbyNPC?.id === npc.id}
                        onInteract={() => startDialogue(npc)}
                    />
                ))}

                {/* 區域標籤 */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                    <span className="text-aqua-400 font-mono">
                        📍 {currentZone}
                    </span>
                </div>

                {/* NPC 列表提示 */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                    <div className="text-[10px] text-slate-400 mb-1">NPC</div>
                    <div className="flex space-x-2">
                        {zoneNPCs.map(npc => (
                            <span key={npc.id} className="text-lg" title={npc.name}>
                                {npc.portrait}
                            </span>
                        ))}
                        {zoneNPCs.length === 0 && (
                            <span className="text-slate-500 text-sm">此區域無 NPC</span>
                        )}
                    </div>
                </div>

                {/* 區域內容 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        {currentZone === 'VILLAGE' && (
                            <motion.div
                                key="village"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="text-6xl mb-4">🏰</div>
                                <h2 className="text-2xl font-bold text-white">善向永續村廣場</h2>
                                <p className="text-slate-400 text-sm">尋找 NPC 進行互動 (按 E)</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 💬 對話框 */}
            <AnimatePresence>
                {dialogueState.isActive && getCurrentDialogueNode() && (
                    <DialogueBox
                        dialogue={getCurrentDialogueNode()!}
                        onOptionClick={handleDialogueOption}
                        onClose={closeDialogue}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default RPGVillagePage;
