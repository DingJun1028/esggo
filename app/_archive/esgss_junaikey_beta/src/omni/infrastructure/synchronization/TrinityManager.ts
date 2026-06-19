import { IInfoOneTrinity, InfoOnePayload, Protocol5T, IOmniComponent, IOmniKB, IOmniTag } from '../../core/types/InfoOne.types.ts';
import { ITransparentFormula } from '../../core/types/Evidence.types.ts';
import { omniLogger, LogCategory } from '../logging/OmniLogger.ts';
import { TrustworthyLock } from '../../../utils/TrustworthyLock.ts';

/**
 * 🏛️ 奧秘三位一體管理器 / Trinity Manager
 * --------------------------------------------------
 * [TC] 負責協調元件、智庫與標籤的生命週期與資料同步。
 * [EN] Coordinates lifecycle and data sync between Component, KB, and Tag.
 */
export class TrinityManager {
    private static instance: TrinityManager;
    private trinityMap: Map<string, IInfoOneTrinity> = new Map();
    private readonly STORAGE_KEY = 'TRINITY_VAULT_BETA';

    private constructor() {
        this.loadFromStorage();
    }

    public static getInstance(): TrinityManager {
        if (!TrinityManager.instance) {
            TrinityManager.instance = new TrinityManager();
        }
        return TrinityManager.instance;
    }

    /**
     * 🛠️ 鍛造三位一體主體 / Forge Trinity Entity
     */
    public forge(
        component: IOmniComponent,
        knowledge: IOmniKB,
        identity: IOmniTag,
        evidenceId?: string,
        formula?: ITransparentFormula
    ): IInfoOneTrinity {
        const uuid = `TRINITY-${crypto.randomUUID()}`;

        // 同步證據 ID 與公式到知識條目中 [Traceable & Transparent]
        const kbPatch: any = { ...knowledge };
        if (evidenceId) kbPatch.evidenceId = evidenceId;
        if (formula) kbPatch.formula = formula;

        const manager = this; // Capture manager for lock to trigger persistence

        const trinity: IInfoOneTrinity = {
            uuid,
            version: '1.0.0-GENESIS',
            timestamp: Date.now(),
            component,
            knowledge: kbPatch as IOmniKB,
            identity,

            lock () {
                if (this.isLocked()) return;

                // 執行 5T 雜湊鎖定 (Hash Lock)
                const payload = {
                    uuid: this.uuid,
                    componentId: this.component.id,
                    knowledgeId: this.knowledge.id,
                    identityId: this.identity.id
                };

                (this as any)._hash = TrustworthyLock.generateHashSync(payload);
                Object.freeze(this.component);
                Object.freeze(this.knowledge);
                Object.freeze(this.identity);
                Object.freeze(this);

                omniLogger.info(LogCategory.SYSTEM, `[Trinity] Entity ${this.uuid} has been SEALED.`);
                manager.saveToStorage();
            },

            isLocked () {
                return Object.isFrozen(this);
            }
        };

        this.trinityMap.set(uuid, trinity);
        omniLogger.debug(LogCategory.SYSTEM, `[Trinity] Forged new entity: ${uuid}`);
        return trinity;
    }

    /**
     * 持久化存儲 (Persistence Storage)
     */
    private saveToStorage(): void {
        try {
            const data: Record<string, any> = {};
            this.trinityMap.forEach((t, uuid) => {
                data[uuid] = {
                    uuid: t.uuid,
                    version: t.version,
                    timestamp: t.timestamp,
                    component: t.component,
                    knowledge: t.knowledge,
                    identity: t.identity,
                    _hash: (t as any)._hash,
                    isLocked: t.isLocked()
                };
            });

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[Trinity] Persistence failed', error);
        }
    }

    /**
     * 從存儲載入 (Load from Storage)
     */
    private loadFromStorage(): void {
        try {
            if (typeof localStorage === 'undefined') return;

            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return;

            const data = JSON.parse(raw);
            const manager = this;

            Object.keys(data).forEach(uuid => {
                const item = data[uuid];
                const trinity: IInfoOneTrinity = {
                    ...item,
                    lock () {
                        if (this.isLocked()) return;
                        (this as any)._hash = TrustworthyLock.generateHashSync({
                            uuid: this.uuid,
                            componentId: this.component.id,
                            knowledgeId: this.knowledge.id,
                            identityId: this.identity.id
                        });
                        Object.freeze(this.component);
                        Object.freeze(this.knowledge);
                        Object.freeze(this.identity);
                        Object.freeze(this);
                        manager.saveToStorage();
                    },
                    isLocked () {
                        return item.isLocked || Object.isFrozen(this);
                    }
                };

                // Re-apply freeze if it was locked
                if (item.isLocked) {
                    Object.freeze(trinity.component);
                    Object.freeze(trinity.knowledge);
                    Object.freeze(trinity.identity);
                    Object.freeze(trinity);
                }

                this.trinityMap.set(uuid, trinity);
            });

            omniLogger.info(LogCategory.SYSTEM, `[Trinity] Loaded ${this.trinityMap.size} entities from vault.`);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[Trinity] Failed to load from vault', error);
        }
    }

    /**
     * 🔍 尋回三位一體主體 / Retrieve Trinity Entity
     */
    public getTrinity(uuid: string): IInfoOneTrinity | undefined {
        return this.trinityMap.get(uuid);
    }

    /**
     * 🔄 同步三位一體狀態 / Sync Trinity State
     */
    public sync(uuid: string, payload: Partial<InfoOnePayload>): void {
        const trinity = this.trinityMap.get(uuid);
        if (!trinity) {
            omniLogger.error(LogCategory.SYSTEM, `[Trinity] Cannot sync. UUID ${uuid} not found.`);
            return;
        }

        if (trinity.isLocked()) {
            omniLogger.warn(LogCategory.SYSTEM, `[Trinity] Sync blocked. Entity ${uuid} is LOCKED.`);
            return;
        }

        omniLogger.debug(LogCategory.SYSTEM, `[Trinity] Syncing entity ${uuid}...`);

        // Apply sync logic (can be expanded)
        if (payload.knowledge) {
            Object.assign(trinity.knowledge, payload.knowledge);
        }

        this.saveToStorage();
    }
}
