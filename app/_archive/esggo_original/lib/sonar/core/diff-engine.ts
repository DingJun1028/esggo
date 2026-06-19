/**
 * ESGSonar | Version Difference Engine
 * Handles comparison between regulation/report versions.
 */

export type DiffMode = 'word' | 'line' | 'char';

export interface DiffResult {
  added: string[];
  removed: string[];
  changed: boolean;
  count: number;
  unifiedDiff?: string;
  esgTags?: string[];
}

export class DiffEngine {
  /**
   * Simple line-based comparison
   */
  static compareLines(oldText: string, newText: string): DiffResult {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    const added = newLines.filter(l => !oldLines.includes(l) && l.trim().length > 0);
    const removed = oldLines.filter(l => !newLines.includes(l) && l.trim().length > 0);

    return {
      added,
      removed,
      changed: added.length > 0 || removed.length > 0,
      count: added.length + removed.length,
      esgTags: this.detectESGTags([...added, ...removed])
    };
  }

  /**
   * Structured JSON comparison
   */
  static compareJSON(oldObj: any, newObj: any): boolean {
    return JSON.stringify(oldObj) !== JSON.stringify(newObj);
  }

  /**
   * Detect ESG-related keywords in changes
   */
  private static detectESGTags(texts: string[]): string[] {
    const tags = new Set<string>();
    const content = texts.join(' ').toLowerCase();

    const patterns = {
      'E': ['碳', '排放', '能源', '再生', '廢棄物', '污染', '氣候', 'environment', 'carbon', 'emission'],
      'S': ['人權', '勞工', '安全', '培訓', '社區', '多元', 'social', 'human rights', 'safety', 'diversity'],
      'G': ['治理', '董事', '風險', '合規', '道德', '透明', 'governance', 'board', 'risk', 'compliance']
    };

    Object.entries(patterns).forEach(([category, keywords]) => {
      if (keywords.some(k => content.includes(k))) {
        tags.add(category);
      }
    });

    return Array.from(tags);
  }
}
