/**
 * OmniHermes | RAG Engine (Simulated)
 * Handles document fragment indexing and retrieval for grounding.
 */

export interface DocFragment {
  id: string;
  source: string;
  text: string;
  metadata: Record<string, any>;
  date?: string;
  category?: string;
}

// Global in-memory store for prototype
export const KNOWLEDGE_BASE: DocFragment[] = [
  {
    id: 'f1',
    source: 'ESG_GO_Brand_Specification.pdf',
    text: 'ESG GO 採用 5T 誠信協議，包含 Tangible, Traceable, Trackable, Transparent, Trustworthy。',
    metadata: { type: 'policy', version: '1.0' },
    date: '2024-01-01',
    category: 'Standard'
  }
];

export async function addToKnowledgeBase(fragments: DocFragment[]) {
  // Simulate delay for vectorization
  await new Promise(r => setTimeout(r, 1000));
  KNOWLEDGE_BASE.unshift(...fragments);
  console.log(`[RAG Engine] Indexed ${fragments.length} new fragments. Total: ${KNOWLEDGE_BASE.length}`);
  return true;
}

export async function searchKnowledgeBase(query: string, limit = 3): Promise<DocFragment[]> {
  // Simulated semantic search: Basic keyword matching for prototype
  const keywords = query.toLowerCase().split(/\s+/);
  
  return KNOWLEDGE_BASE
    .filter(f => keywords.some(k => f.text.toLowerCase().includes(k)))
    .slice(0, limit);
}

/**
 * Grounding Prompt Builder
 */
export async function buildGroundingContext(query: string): Promise<string> {
  const results = await searchKnowledgeBase(query);
  if (results.length === 0) return "";

  return `
[CONTEXT FROM KNOWLEDGE BASE]
${results.map(r => `Source: ${r.source}\nContent: ${r.text}`).join('\n---\n')}
[END CONTEXT]
`;
}
