/**
 * DigitalAvatarService.ts
 * -----------------------
 * 數位分身核心服務：同步用戶永續實踐與能力矩陣
 */

import crypto from 'crypto';

export interface AvatarAttributes {
    wisdom: number;      // 智
    benevolence: number; // 仁
    courage: number;     // 勇
    integrity: number;   // 誠
    temperance: number;  // 節
    harmony: number;     // 和
}

export interface DigitalAvatar {
    uuid: string;
    userId: string;
    name: string;
    level: number;
    xp: number;
    attributes: AvatarAttributes;
    equippedAssets: string[];
    status: 'Awakened' | 'Hibernating' | 'Transcended';
    lastUpdate: number;
    hashLock?: string;
}

export class DigitalAvatarService {
    private static instance: DigitalAvatarService;

    static getInstance(): DigitalAvatarService {
        if (!DigitalAvatarService.instance) {
            DigitalAvatarService.instance = new DigitalAvatarService();
        }
        return DigitalAvatarService.instance;
    }

    /**
     * 初始化分身
     */
    async awakenAvatar(userId: string, name: string): Promise<DigitalAvatar> {
        return {
            uuid: `avatar-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            name,
            level: 1,
            xp: 0,
            attributes: {
                wisdom: 10,
                benevolence: 10,
                courage: 10,
                integrity: 10,
                temperance: 10,
                harmony: 10
            },
            equippedAssets: [],
            status: 'Awakened',
            lastUpdate: Date.now()
        };
    }

    /**
     * 同步屬性變動 (基於活動類型)
     */
    syncAttribute(avatar: DigitalAvatar, type: 'Learning' | 'CarbonAudit' | 'Governance' | 'Community', value: number): DigitalAvatar {
        const newAttributes = { ...avatar.attributes };
        let xpGained = value * 10;

        switch (type) {
            case 'Learning':
                newAttributes.wisdom += value;
                break;
            case 'CarbonAudit':
                newAttributes.temperance += value;
                newAttributes.integrity += value;
                break;
            case 'Governance':
                newAttributes.integrity += value;
                newAttributes.courage += value;
                break;
            case 'Community':
                newAttributes.benevolence += value;
                newAttributes.harmony += value;
                break;
        }

        // Level Up Logic
        let newLevel = avatar.level;
        let newXp = avatar.xp + xpGained;
        const xpToNext = avatar.level * 1000;

        if (newXp >= xpToNext) {
            newLevel++;
            newXp -= xpToNext;
        }

        return {
            ...avatar,
            attributes: newAttributes,
            level: newLevel,
            xp: newXp,
            lastUpdate: Date.now()
        };
    }

    /**
     * 執行誠信快照 (5T 快照)
     */
    async snapshot(avatar: DigitalAvatar): Promise<DigitalAvatar> {
        const dataToHash = JSON.stringify({
            uid: avatar.uuid,
            lvl: avatar.level,
            attr: avatar.attributes,
            assets: avatar.equippedAssets
        });

        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        return {
            ...avatar,
            hashLock: `sha256-${hash}`
        };
    }
}

export const digitalAvatarService = DigitalAvatarService.getInstance();
