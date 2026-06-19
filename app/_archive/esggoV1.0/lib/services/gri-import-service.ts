import * as XLSX from "xlsx";
import { z } from "zod";
import { generateContentHash, TrustMetadata, sealReport } from "./trust-protocol";
import { FirestoreService } from "./firestore-service";

export const GriIndicatorSchema = z.object({
    code: z.string(), // e.g., "GRI 302-1"
    name: z.string(), // e.g., "Energy consumption within the organization"
    category: z.enum(["Environment", "Social", "Governance", "General"]),
    description: z.string().optional(),
    unit: z.string().optional(),
    dataType: z.enum(["Number", "String", "Boolean", "Date"]).default("String"),
});

export type GriIndicator = z.infer<typeof GriIndicatorSchema>;

export class GriImportService {
    /**
     * Parses an Excel file (from File object or ArrayBuffer) and returns a list of GRI indicators.
     */
    async parseGriExcel(data: ArrayBuffer): Promise<GriIndicator[]> {
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error("Excel 檔案中找不到任何工作表");

        const worksheet = workbook.Sheets[firstSheetName];
        if (!worksheet) throw new Error(`找不到工作表: ${firstSheetName}`);

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        // Map raw data to our schema
        return (rawData as any[]).map((row: any) => {
            const code = String(row["揭露項代號"] || row["GRI Code"] || row["Code"] || "");
            const name = String(row["揭露項名稱"] || row["Indicator Name"] || row["Name"] || "");
            const categoryRaw = String(row["類別"] || row["Category"] || "");

            let category: GriIndicator["category"] = "General";
            if (categoryRaw.includes("環境") || categoryRaw.toLowerCase().includes("env")) category = "Environment";
            else if (categoryRaw.includes("社會") || categoryRaw.toLowerCase().includes("soc")) category = "Social";
            else if (categoryRaw.includes("治理") || categoryRaw.toLowerCase().includes("gov")) category = "Governance";

            return {
                code,
                name,
                category,
                description: String(row["說明"] || row["Description"] || ""),
                unit: String(row["單位"] || row["Unit"] || ""),
                dataType: "Number" as const,
            };
        }).filter(indicator => indicator.code && indicator.name);
    }

    /**
     * Groups indicators by category for UI display
     */
    groupByCategory(indicators: GriIndicator[]) {
        const groups: Record<string, GriIndicator[]> = {};
        indicators.forEach(curr => {
            const cat = curr.category || "General";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(curr);
        });
        return groups;
    }

    /**
     * Commits a batch of indicators to the vault with forensic sealing.
     */
    async commitToVault(indicators: GriIndicator[]): Promise<{ batchId: string; metadata: TrustMetadata }> {
        const batchId = `gri_batch_${Date.now()}`;
        const contentString = JSON.stringify(indicators);

        // Generate forensic seal
        const metadata = await sealReport(contentString);

        // Persist to Global Vault (Firestore)
        try {
            await FirestoreService.saveVaultBatch({
                id: batchId,
                type: 'GRI_IMPORT',
                timestamp: Date.now(),
                indicators,
                metadata
            });
        } catch (error) {
            console.error("Failed to sync to Firestore Vault, falling back to local storage.", error);
            // Fallback to local storage for offline support
            if (typeof window !== 'undefined') {
                const vaultData = JSON.parse(localStorage.getItem('esg_vault_data') || '[]');
                vaultData.push({
                    id: batchId,
                    type: 'GRI_IMPORT',
                    timestamp: Date.now(),
                    indicators,
                    metadata
                });
                localStorage.setItem('esg_vault_data', JSON.stringify(vaultData));
            }
        }

        return { batchId, metadata };
    }
}

export const griImportService = new GriImportService();
