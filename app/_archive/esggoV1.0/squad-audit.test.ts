import { describe, it, expect, beforeAll } from "vitest";
import { SquadAuditService } from "./lib/services/squad-audit";
import fs from "fs";
import path from "path";

describe("SquadAuditService Hash-Chain Integrity", () => {
    const auditService = SquadAuditService.getInstance();
    const AUDIT_FILE = path.join(process.cwd(), "lib/data/squad-audit.json");

    it("should generate a valid genesis block if history is empty", async () => {
        // Clear history for testing if needed or just use current state
        const initialLogs = auditService.getLogs();
        const record = await auditService.logEvent("TEST_GENESIS", "Tester", { msg: "Hello" });

        expect(record.action).toBe("TEST_GENESIS");
        expect(record.hash).toMatch(/^SHA256:/);
        if (initialLogs.length === 0) {
            expect(record.parentHash).toBe(""); // Or whatever the genesis parent state is
        }
    });

    it("should maintain a verifiable chain of hashes", async () => {
        const record1 = await auditService.logEvent("EVENT_1", "Tester");
        const record2 = await auditService.logEvent("EVENT_2", "Tester");

        expect(record2.parentHash).toBe(record1.hash);
        expect(record2.hash).not.toBe(record1.hash);
    });

    it("should persist records to the filesystem", () => {
        expect(fs.existsSync(AUDIT_FILE)).toBe(true);
        const data = JSON.parse(fs.readFileSync(AUDIT_FILE, "utf-8"));
        expect(data.length).toBeGreaterThan(0);
        const lastRecord = data[data.length - 1];
        expect(lastRecord.action).toBe("EVENT_2");
    });
});
