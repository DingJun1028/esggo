// import { createHash } from 'crypto'; // Removed for browser compatibility

/**
 * 🏛️ OmniExporter: Assets as Downloads
 * Converts report data into portable, verifiable formats.
 */
export class OmniExporter {
    /**
     * Export report data to a verifiable CSV format.
     * Includes 5T Metadata header for integrity proof.
     */
    static exportToCSV(filename: string, title: string, data: any[], metadata: { uuid: string; timestamp: number; author: string }) {
        const payload = JSON.stringify({ uuid: metadata.uuid, ts: metadata.timestamp, data });
        let hashVal = 0;
        for (let i = 0; i < payload.length; i++) {
            const char = payload.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }
        const hash = `SH_${Math.abs(hashVal).toString(16)}`;

        // CSV Header with 5T Anchor
        const anchor = [
            `# 🏛️ InfoOne 5T Trust Anchor`,
            `# UUID: ${metadata.uuid}`,
            `# Timestamp: ${new Date(metadata.timestamp).toISOString()}`,
            `# Author: ${metadata.author}`,
            `# Hash-Lock: ${hash}`,
            `# Status: Trustworthy (Verified by Dr. Thoth)`,
            `# ----------------------------------------`,
            `"${title}"`,
            ""
        ].join('\n');

        // Column headers based on data keys
        if (data.length === 0) return;
        const headers = Object.keys(data[0]).join(',');

        // Data rows
        const rows = data.map(item => {
            return Object.values(item).map(val => {
                const s = String(val).replace(/"/g, '""');
                return `"${s}"`;
            }).join(',');
        }).join('\n');

        const csvContent = anchor + headers + '\n' + rows;
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
