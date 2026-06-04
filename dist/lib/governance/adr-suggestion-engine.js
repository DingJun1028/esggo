import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
export function analyzeTypeChanges(sourceDir = 'src') {
    const changes = [];
    const files = readdirSync(sourceDir, { recursive: true })
        .filter((f) => typeof f === 'string' && f.endsWith('.ts'))
        .map((f) => resolve(sourceDir, f));
    files.forEach((file) => {
        const content = readFileSync(file, 'utf-8');
        const typeMatches = content.match(/export\s+(type|interface)\s+(\w+)/g);
        if (typeMatches) {
            typeMatches.forEach((match) => {
                const typeName = match.split(/\s+/).pop();
                changes.push({
                    file,
                    type: 'modified',
                    schemaName: typeName
                });
            });
        }
    });
    return changes;
}
export function generateADRSuggestion(changes) {
    const maxAdr = Math.max(7, ...(() => {
        const adrFiles = readdirSync('adr')
            .filter(f => f.startsWith('adr-'))
            .map(f => parseInt(f.split('-')[1]))
            .filter(n => !isNaN(n));
        return adrFiles.length ? adrFiles : [7];
    })());
    return {
        adrNumber: maxAdr + 1,
        title: 'AtomicFunction Governance Integration',
        rationale: 'Ensure type-safe skill execution aligns with memory-fragmented knowledge principle',
        impact: 'All atomic functions must expose context and payload explicitly',
        relatedTypes: changes
            .filter(c => c.schemaName)
            .map(c => c.schemaName)
    };
}
//# sourceMappingURL=adr-suggestion-engine.js.map