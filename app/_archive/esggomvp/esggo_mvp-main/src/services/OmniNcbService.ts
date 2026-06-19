
/**
 * 🛠️ OmniNcbService: NoCodeBackend Bridge
 * Provides a unified persistence layer for ESG Atoms, Results, and Progress.
 */
export class OmniNcbService {
    /**
     * Saves a 5T ESG Atom to the database
     */
    static async saveAtom(atom: any): Promise<boolean> {
        try {
            const res = await fetch('/api/nexus', {
                method: 'POST',
                body: JSON.stringify({
                    operation: 'manifest_asset',
                    params: {
                        intent: atom.intent || 'Atom Manifestation',
                        payload: atom
                    }
                })
            });
            const json = await res.json();
            return json.success;
        } catch (err) {
            console.error("Failed to save atom:", err);
            return false;
        }
    }

    /**
     * Fetches carbon records
     */
    static async getCarbonRecords() {
        const res = await fetch('/api/carbon');
        return res.json();
    }

    /**
     * Saves carbon record
     */
    static async saveCarbonRecord(data: any) {
        const res = await fetch('/api/carbon', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return res.json();
    }
}
