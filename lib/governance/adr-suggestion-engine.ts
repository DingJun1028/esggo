import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * 智能 ADR 建議引擎 (ADR Suggestion Engine)
 * 分析程式碼變更，自動生成 ADR 建議與版本追蹤
 */

export interface TypeChange {
  file: string;
  type: 'added' | 'modified' | 'removed';
  schemaName?: string;
}

export interface ADRSuggestion {
  adrNumber: number;
  title: string;
  rationale: string;
  impact: string;
  relatedTypes: string[];
}

export function analyzeTypeChanges(sourceDir: string = 'src'): TypeChange[] {
  const changes: TypeChange[] = [];
  const files = readdirSync(sourceDir, { recursive: true })
    .filter((f) => typeof f === 'string' && f.endsWith('.ts'))
    .map((f) => resolve(sourceDir, f as string));

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

export function generateADRSuggestion(changes: TypeChange[]): ADRSuggestion {
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
      .map(c => c.schemaName as string)
  };
}