import { IOmniHeart, createOmniHeart, logAuditAction, AuditLogItem } from "@/lib/omni-heart";
import fs from "fs";
import path from "path";

const AUDIT_FILE_PATH = path.join(process.cwd(), "lib/data/squad-audit.json");

export interface SquadAuditRecord extends AuditLogItem {
    id: string;
    details?: any;
}

/**
 * SquadAuditService
 * Provides immutable logging for all Squad Control operations.
 */
export class SquadAuditService {
    private static instance: SquadAuditService;
    private currentHeart: IOmniHeart;

    private constructor() {
        // Initialize or load the last state
        const history = this.loadHistory();
        if (history.length > 0) {
            const lastRecord = history[history.length - 1];
            if (lastRecord) {
                this.currentHeart = createOmniHeart("Squad_Control", "Audit_Trail", "Squad_Audit_Service", lastRecord.hash);
            } else {
                this.currentHeart = createOmniHeart("Squad_Control", "Audit_Trail", "Squad_Audit_Service");
            }
        } else {
            this.currentHeart = createOmniHeart("Squad_Control", "Audit_Trail", "Squad_Audit_Service");
        }
    }

    public static getInstance(): SquadAuditService {
        if (!SquadAuditService.instance) {
            SquadAuditService.instance = new SquadAuditService();
        }
        return SquadAuditService.instance;
    }

    private loadHistory(): SquadAuditRecord[] {
        if (!fs.existsSync(AUDIT_FILE_PATH)) return [];
        try {
            const data = fs.readFileSync(AUDIT_FILE_PATH, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to load audit history:", error);
            return [];
        }
    }

    private saveHistory(records: SquadAuditRecord[]) {
        const dir = path.dirname(AUDIT_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(AUDIT_FILE_PATH, JSON.stringify(records, null, 2));
    }

    /**
     * Log a squad event
     * @param action The action type (e.g., SQUAD_RECRUIT)
     * @param actor The entity performing the action
     * @param details Additional context or data
     */
    public async logEvent(action: string, actor: string, details?: any): Promise<SquadAuditRecord> {
        const { newHeart, logEntry } = logAuditAction(this.currentHeart, action, actor);

        const record: SquadAuditRecord = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            ...logEntry,
            details
        };

        const history = this.loadHistory();
        history.push(record);
        this.saveHistory(history);

        this.currentHeart = newHeart;
        return record;
    }

    public getLogs(): SquadAuditRecord[] {
        return this.loadHistory();
    }
}
