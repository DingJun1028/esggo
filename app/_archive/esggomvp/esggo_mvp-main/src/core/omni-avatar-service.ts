/**
 * 🏛️ OmniAvatarService (v9.0 Sentient Edition)
 * 定位: 數位分身服務核心 — 負責引導、生成與演化
 * 哲學: 「初次共鳴」— 建立用戶在善向紀元的溯源點
 */

import { v4 as uuidv4 } from 'uuid';
import { userTwinsApi, DigitalTwin } from '../lib/ncb-service';
import { gnosisEngine } from './gnosis-vector-engine';
import { IVirtueFingerprint } from './omni-types';

export class OmniAvatarService {
    private static instance: OmniAvatarService;

    private constructor() { }

    public static getInstance(): OmniAvatarService {
        if (!OmniAvatarService.instance) {
            OmniAvatarService.instance = new OmniAvatarService();
        }
        return OmniAvatarService.instance;
    }

    /**
     * 🌀 First Resonance: 初次共鳴與分身顯化
     */
    public async manifestFirstResonance(
        userId: string,
        nickname: string,
        input: string
    ): Promise<DigitalTwin> {
        // 1. 生成初始六德指紋 (基於輸入內容的語義分析，此處為初始模擬)
        const initialVirtues: IVirtueFingerprint = {
            wisdom: 5,
            benevolence: 5,
            courage: 5,
            integrity: 5,
            temperance: 5,
            harmony: 5
        };

        // 2. 建立分身原子
        const twin: Omit<DigitalTwin, 'id'> = {
            twin_uuid: `twin-${uuidv4().substring(0, 8)}`,
            nickname,
            avatar_type: 'SENTIENT',
            level: 1,
            exp: 0,
            rank: 'Init_Spark',
            virtues: JSON.stringify(initialVirtues),
            nature_law: '道法自然，系統毅然，上善若水，善向永續。',
            closing_law: '以終為始，始終如一，無始無終，善向永續。',
            user_id: userId,
            metadata: JSON.stringify({
                resonance_origin: input,
                awakened_at: new Date().toISOString()
            })
        };

        // 3. 寫入雲端 NCBDB
        const { data } = await userTwinsApi.upsert(twin);

        // 4. 刻印入 Gnosis 向量雲端 (RAG 溯源)
        await gnosisEngine.ingrainAtom({
            uuid: twin.twin_uuid,
            timestamp: Date.now(),
            payload: { nickname, virtues: initialVirtues, resonance: input },
            domainRef: 'UserTwin_Core',
            status: 'Trustworthy',
            tags: ['digital_twin', 'awakening'],
            evidence: {
                logic: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'First Resonance Logic' }
            }
        } as any);

        return data;
    }

    /**
     * ⬆️ Evolve: 分身演化與屬性更新
     */
    public async evolveVirtues(
        id: number,
        userId: string,
        updates: Partial<IVirtueFingerprint>
    ): Promise<boolean> {
        try {
            // 取得現有分身
            const { data: twins } = await userTwinsApi.getByUserId(userId);
            if (!twins || twins.length === 0) return false;

            const current = twins[0];
            const currentVirtues: IVirtueFingerprint = JSON.parse(current.virtues);

            // 合併更新
            const updatedVirtues = { ...currentVirtues, ...updates };

            // 寫入更新
            await userTwinsApi.upsert({
                id: current.id,
                virtues: JSON.stringify(updatedVirtues)
            });

            return true;
        } catch (error) {
            console.error('[AvatarService] Evolution failed:', error);
            return false;
        }
    }
}

export const avatarService = OmniAvatarService.getInstance();
