import { OmniWuzuoNoteService } from "./wuzuo-note";
import { OmniKnowledgeBridge } from "./omni-knowledge-bridge";
import { OmniCoreVerifier } from "./omni-verifier";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 📦 OmniBackup - 萬能備份與還原服務
 * 
 * 支援 5T 協議的完整知識資產備份包生成。
 */
export class OmniBackup {
    /**
     * 生成完整的備份套件 (JSON 格式)
     * 包含所有筆記、5T 證據與誠信簽名
     */
    public static async generateFullBackup(): Promise<{
        id: string;
        timestamp: number;
        version: string;
        content: any;
        securitySeal: string;
    }> {
        const notes = await OmniWuzuoNoteService.getAllNotes();
        const backupId = `OBK-${uuidv4().slice(0, 8)}`;
        const timestamp = Date.now();

        const backupPackage = {
            id: backupId,
            timestamp,
            version: "8.2.5",
            content: {
                notes,
                count: notes.length
            }
        };

        // 建立安全封印 (Security Seal)
        const seal = OmniCoreVerifier.generateHashLock({
            uuid: backupId,
            metric_code: "SYSTEM_BACKUP",
            value: JSON.stringify(backupPackage.content),
            reporting_year: new Date().getFullYear(),
            source_origin: "OmniBackup_Service",
            formula: "BACKUP_SUM_HASH",
            timestamp: timestamp
        });

        return {
            ...backupPackage,
            securitySeal: seal
        };
    }

    /**
     * 下載備份檔案 (Browser side)
     */
    public static async downloadBackup() {
        if (typeof window === 'undefined') return;

        const backup = await this.generateFullBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `InfoOne_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * ☁️ 同步至雲端 (Supabase Storage)
     * 利用 5T 協議確保雲端資產的絕對安全性。
     */
    public static async syncToCloud(): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Supabase configuration missing');
            }

            const supabase = createClient(supabaseUrl, supabaseKey);
            const backup = await this.generateFullBackup();
            const fileName = `backup_${backup.id}_${backup.timestamp}.json`;

            const { data, error } = await supabase.storage
                .from('omni-backups')
                .upload(fileName, JSON.stringify(backup), {
                    contentType: 'application/json',
                    upsert: true
                });

            if (error) throw error;

            omniLogger.info(LogCategory.SYSTEM, `OmniBackup: Cloud Sync Successful -> ${fileName}`);

            return {
                success: true,
                url: `${supabaseUrl}/storage/v1/object/public/omni-backups/${fileName}`
            };
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `OmniBackup: Cloud Sync Failed -> ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}
