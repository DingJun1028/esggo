
import { IComponentCore } from '@/types/core';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { ncb } from '@/lib/ncb/client';

/**
 * 💾 Evidence Persistence Layer
 * -----------------------------
 * Abstracts the storage mechanism for Evidence Vault.
 * Supports NoCodeBackend (NCB) and In-Memory Map.
 */
export interface IEvidencePersistence {
    save(asset: IComponentCore): Promise<void>;
    get(uuid: string): Promise<IComponentCore | undefined>;
    getAll(): Promise<IComponentCore[]>;
}

export class NcbEvidencePersistence implements IEvidencePersistence {
    async save(asset: IComponentCore): Promise<void> {
        // Prepare data for NCB (convert JSON objects to strings if needed, 
        // though NCB client/proxy might handle objects if it's JSON type)
        const payload = {
            uuid: asset.uuid,
            version: asset.version,
            timestamp: asset.timestamp,
            status: asset.status,
            evidence: JSON.stringify(asset.evidence),
            data: asset.data ? JSON.stringify(asset.data) : null,
            rpg_stats: asset.rpgStats ? JSON.stringify(asset.rpgStats) : null,
            vitals: asset.vitals ? JSON.stringify(asset.vitals) : null,
            esg: asset.esg ? JSON.stringify(asset.esg) : null,
            omni_attrs: asset.omniAttrs ? JSON.stringify(asset.omniAttrs) : null,
            resonance_rs: asset.resonance_rs,
            meridian: asset.meridian,
            virtues: asset.virtues ? JSON.stringify(asset.virtues) : null,
        };

        const { error } = await ncb
            .from('omni_assets')
            .insert(payload);

        if (error) {
            omniLogger.error(LogCategory.DATA, `[Persistence] Failed to save asset ${asset.uuid} to NCB`, error);
            throw error;
        }
        omniLogger.info(LogCategory.DATA, `[Persistence] Saved asset ${asset.uuid} to NoCodeBackend.`);
    }

    async get(uuid: string): Promise<IComponentCore | undefined> {
        const { data, error } = await ncb
            .from('omni_assets')
            .eq('uuid', uuid)
            .single();

        if (error) {
            // Not found is usually not an error in some clients, but let's check error structure
            omniLogger.error(LogCategory.DATA, `[Persistence] Failed to get asset ${uuid} from NCB`, error);
            return undefined;
        }

        if (!data) return undefined;

        return this.mapToComponentCore(data);
    }

    async getAll(): Promise<IComponentCore[]> {
        const { data, error } = await ncb
            .from('omni_assets')
            .order('timestamp', { ascending: false });

        if (error) {
            omniLogger.error(LogCategory.DATA, '[Persistence] Failed to get all assets from NCB', error);
            throw error;
        }

        if (!data || !Array.isArray(data)) return [];

        return data.map(item => this.mapToComponentCore(item));
    }

    private mapToComponentCore(row: any): IComponentCore {
        return {
            uuid: row.uuid,
            version: row.version,
            timestamp: Number(row.timestamp),
            status: row.status,
            evidence: typeof row.evidence === 'string' ? JSON.parse(row.evidence) : row.evidence,
            data: row.data && typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
            rpgStats: row.rpg_stats && typeof row.rpg_stats === 'string' ? JSON.parse(row.rpg_stats) : row.rpg_stats,
            vitals: row.vitals && typeof row.vitals === 'string' ? JSON.parse(row.vitals) : row.vitals,
            esg: row.esg && typeof row.esg === 'string' ? JSON.parse(row.esg) : row.esg,
            omniAttrs: row.omni_attrs && typeof row.omni_attrs === 'string' ? JSON.parse(row.omni_attrs) : row.omni_attrs,
            resonance_rs: row.resonance_rs,
            meridian: row.meridian,
            virtues: row.virtues && typeof row.virtues === 'string' ? JSON.parse(row.virtues) : row.virtues,
        } as IComponentCore;
    }
}

export class InMemoryEvidencePersistence implements IEvidencePersistence {
    private storage: Map<string, IComponentCore> = new Map();

    async save(asset: IComponentCore): Promise<void> {
        this.storage.set(asset.uuid, asset);
        omniLogger.info(LogCategory.DATA, `[Persistence] Saved asset ${asset.uuid} to memory.`);
    }

    async get(uuid: string): Promise<IComponentCore | undefined> {
        return this.storage.get(uuid);
    }

    async getAll(): Promise<IComponentCore[]> {
        return Array.from(this.storage.values());
    }
}

// Default to NCB in Phase 15 migration
export const evidencePersistence = new NcbEvidencePersistence();
