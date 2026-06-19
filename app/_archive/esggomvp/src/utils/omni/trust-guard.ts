// import { createHash } from 'crypto'; // Removed for browser compatibility
import { IComponentCore, ISealedData, ILifecycleEvent } from '../../types/omni/core.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🔒 InfoOne 信之核心：雜湊鎖定與資料封裝 (The Immutable Fortress)
 *
 * 這個模組負責執行 5T 協議中的 "Trust" (信) 與 "Truth" (真)。
 * 確保進入資料庫前，所有資料都被打上不可磨滅的防偽印記。
 */

const SECRET_SALT = process.env.OMNI_SECRET_SALT || 'fallback_omni_salt_2026';

/**
 * 產生數位指紋 (SHA-256)
 * @param payload 任意需要被 Hash 的資料
 * @param prevHash 前一個區塊的 Hash (形成鏈結)，若為創世節點則傳空字串
 */
export const generateSignature = (payload: any, prevHash: string = ''): string => {
    const payloadString = JSON.stringify(payload);
    let hash = 0;
    const hData = payloadString + prevHash + SECRET_SALT;
    for (let i = 0; i < hData.length; i++) {
        const char = hData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `SG_${Math.abs(hash).toString(16)}`;
};

/**
 * 執行封存儀式 (The Sealing Ceremony)
 * 1. 計算指紋
 * 2. 設定 isFrozen 與 lock_timestamp
 * 3. 執行 JavaScript `Object.freeze` 防止記憶體竄改
 * 
 * @param coreData 準備被封存的 IComponentCore 資料
 * @param prevHash 上一個被封存節點的 Hash
 */
export const sealData = <T>(coreData: IComponentCore<T>, prevHash: string = ''): Readonly<ISealedData<T>> => {
    // 確認資料尚未被凍結
    if (coreData.isFrozen) {
        throw new Error('OmniGuard: The data is already frozen and cannot be sealed again.');
    }

    // 1. 打包 Payload
    const payloadToSeal: IComponentCore<T> = {
        ...coreData,
        isFrozen: true,
    };

    // 2. 產生數位指紋
    const signature = generateSignature(payloadToSeal, prevHash);

    // 3. 寫入自己身上的簽章
    payloadToSeal.hash_signature = signature;
    payloadToSeal.previous_hash = prevHash;

    // 4. 打包為 ISealedData 結構
    const sealedData: ISealedData<T> = {
        payload: payloadToSeal,
        signature,
        previous_hash: prevHash,
        lock_timestamp: Date.now()
    };

    // 5. 終極信賴：在記憶體層面凍結物件，禁止任何 JS 屬性修改
    const deepFrozenData = deepFreeze(sealedData);
    return deepFrozenData;
};

/**
 * 將新動作寫入生命週期軌跡 (Lifecycle Tracker)
 */
export const appendLifecycleEvent = <T>(
    coreData: IComponentCore<T>,
    eventDetails: Omit<ILifecycleEvent<T>, 'timestamp'>
): IComponentCore<T> => {
    if (coreData.isFrozen) {
        throw new Error('OmniGuard: Cannot append lifecycle events to frozen data.');
    }

    const updatedEvents = [
        ...coreData.lifecycle_events,
        { ...eventDetails, timestamp: Date.now() }
    ];

    return { ...coreData, lifecycle_events: updatedEvents };
};

/**
 * 初始化一筆全新的空白資料節點 (Data Genesis)
 */
export const createGenesisNode = <T>(
    initialData: T,
    originId: string,
    extractionMethod: 'OCR' | 'IoT' | 'Manual' | 'Agent',
    creatorId: string
): IComponentCore<T> => {
    return {
        uuid: `omni-node-${uuidv4()}`,
        version: 'v0.1.0-draft',
        timestamp: Date.now(),
        evidence: {
            origin_id: originId,
            origin_hash: generateSignature(originId), // 簡易的發票/憑證 ID 假 Hash
            extraction_method: extractionMethod
        },
        lifecycle_events: [{
            event: 'CREATED',
            actor_id: creatorId,
            timestamp: Date.now(),
            reason: 'Genesis Inception'
        }],
        data: initialData,
        isFrozen: false
    };
};

/**
 * 工具函數：深度凍結物件 (Deep Freeze)
 */
function deepFreeze<T extends Record<string, any>>(object: T): Readonly<T> {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self
    for (const name of propNames) {
        const value = object[name];

        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}
