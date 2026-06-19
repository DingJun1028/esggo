/**
 * 🎯 Smart Text Layout System
 * --------------------------------------------------
 * [Core] Automatically adjusts text content based on container width.
 * [Function] Vocabulary priority, smart abbreviation, and aesthetic optimization.
 * [App] HUD, Dashboards, Compact UI Components.
 */

/** Vocabulary Priority Definition */
export enum WordPriority {
  CRITICAL = 0, // Absolute non-deletable (e.g., numbers, key metrics)
  HIGH = 1, // High importance (core concepts)
  MEDIUM = 2, // Medium importance (modifiers)
  LOW = 3, // Low importance (omittable descriptions)
}

/** Word Definition */
export interface SmartWord {
  text: string;
  priority: WordPriority;
  abbreviation?: string; // Abbreviated form
  alternatives?: string[]; // Alternative words (in order of priority)
  isSymbol?: boolean; // Whether it is a symbol (e.g., Ω)
}

/** Layout Configuration */
export interface LayoutConfig {
  maxWidth: number; // Maximum width (character units)
  preferredLineCount?: number; // Preferred line count (default 1)
  allowAbbreviation?: boolean; // Whether to allow abbreviations (default true)
  allowDeletion?: boolean; // Whether to allow deletion of low-priority words (default true)
}

/** Layout Results */
export interface LayoutResult {
  lines: string[];
  score: number; // Aesthetic score (0-100)
  modifications: string[]; // Modification records
}

/**
 * Calculates text width (considering English/CJK differences)
 */
function calculateWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    // CJK characters, full-width symbols = 2 units
    if (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)) {
      width += 2;
    }
    // English characters, numbers, half-width symbols = 1 unit
    else {
      width += 1;
    }
  }
  return width;
}

/**
 * Evaluates layout aesthetics
 */
function calculateAestheticScore(lines: string[], config: LayoutConfig): number {
  const widths = lines.map(calculateWidth);
  const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
  const variance = widths.reduce((sum, w) => sum + Math.pow(w - avgWidth, 2), 0) / widths.length;
  const uniformityScore = Math.max(0, 40 - variance / 2);

  // 2. Avoid orphans (30%)
  const orphanPenalty = lines.filter(line => calculateWidth(line) < 4).length * 15;
  const orphanScore = Math.max(0, 30 - orphanPenalty);

  // 3. Meet preferred line count (20%)
  const preferredLines = config.preferredLineCount || 1;
  const linePenalty = Math.abs(lines.length - preferredLines) * 10;
  const lineScore = Math.max(0, 20 - linePenalty);

  // 4. Visual balance (10%)
  const balanceScore = widths.every(w => w <= config.maxWidth) ? 10 : 0;

  return uniformityScore + orphanScore + lineScore + balanceScore;
}

/**
 * Smart Layout Main Function
 */
export function smartLayout(words: SmartWord[], config: LayoutConfig): LayoutResult {
  const modifications: string[] = [];
  const currentWords = [...words];

  // Default Config
  const finalConfig = {
    allowAbbreviation: true,
    allowDeletion: true,
    preferredLineCount: 1,
    ...config,
  };

  // 1. Calculate original width
  let currentText = currentWords.map(w => w.text).join(' ');
  let currentWidth = calculateWidth(currentText);

  // 2. If width is exceeded, try to optimize
  if (currentWidth > finalConfig.maxWidth) {
    // 2.1 Attempt abbreviation (from low to high priority)
    if (finalConfig.allowAbbreviation) {
      const sortedByPriority = [...currentWords]
        .map((w, idx) => ({ word: w, index: idx }))
        .sort((a, b) => b.word.priority - a.word.priority);

      for (const { word, index } of sortedByPriority) {
        if (!word) continue;
        if (word.abbreviation && currentWidth > finalConfig.maxWidth) {
          const newWord = { ...word, text: word.abbreviation };
          currentWords[index] = newWord;
          modifications.push(`Abbreviate: "${word.text}" → "${word.abbreviation}"`);
          currentText = currentWords.map(w => w.text).join(' ');
          currentWidth = calculateWidth(currentText);
        }
      }
    }

    // 2.2 Attempt alternatives
    if (currentWidth > finalConfig.maxWidth) {
      for (let i = 0; i < currentWords.length; i++) {
        const word = currentWords[i];
        if (word && word.alternatives && word.alternatives.length > 0) {
          for (const alt of word.alternatives) {
            if (calculateWidth(alt) < calculateWidth(word.text)) {
              currentWords[i] = { ...word, text: alt };
              modifications.push(`Replace: "${word.text}" → "${alt}"`);
              currentText = currentWords.map(w => w.text).join(' ');
              currentWidth = calculateWidth(currentText);
              if (currentWidth <= finalConfig.maxWidth) break;
            }
          }
        }
      }
    }

    // 2.3 Attempt deletion of low-priority words
    if (finalConfig.allowDeletion && currentWidth > finalConfig.maxWidth) {
      const sortedByPriority = [...currentWords]
        .map((w, idx) => ({ word: w, index: idx }))
        .sort((a, b) => b.word.priority - a.word.priority);

      for (const { word, index } of sortedByPriority) {
        if (word.priority >= WordPriority.MEDIUM && currentWidth > finalConfig.maxWidth) {
          modifications.push(`Delete: "${word.text}"`);
          currentWords.splice(index, 1);
          currentText = currentWords.map(w => w.text).join(' ');
          currentWidth = calculateWidth(currentText);
        }
      }
    }
  }

  // 3. Smart wrap
  const lines: string[] = [];
  let currentLine = '';

  for (const word of currentWords) {
    const testLine = currentLine ? `${currentLine} ${word.text}` : word.text;
    if (calculateWidth(testLine) <= finalConfig.maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word.text;
    }
  }
  if (currentLine) lines.push(currentLine);

  // 4. Calculate aesthetic score
  const score = calculateAestheticScore(lines, finalConfig);

  return { lines, score, modifications };
}

/**
 * Quickly create smart words
 */
export function createWord(
  text: string,
  priority: WordPriority,
  options?: Omit<SmartWord, 'text' | 'priority'>
): SmartWord {
  return {
    text,
    priority,
    ...options,
  };
}

/**
 * Default vocabulary (Common HUD terms)
 */
export const commonWords = {
  omni: createWord('Omni', WordPriority.HIGH, { abbreviation: 'O' }),
  resonance: createWord('Resonance', WordPriority.HIGH, {
    abbreviation: 'Res',
    alternatives: ['Ω'],
  }),
  index: createWord('Index', WordPriority.MEDIUM, { abbreviation: 'Idx' }),
  system: createWord('System', WordPriority.MEDIUM, { abbreviation: 'Sys' }),
  entropy: createWord('Entropy', WordPriority.HIGH, {
    abbreviation: 'Δ',
    isSymbol: true,
  }),
  total: createWord('Total', WordPriority.LOW),
  minted: createWord('Minted', WordPriority.MEDIUM, { abbreviation: 'M' }),
};
