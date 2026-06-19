/**
 * 🧠 Embeddings Service — Intelligence Layer
 * Responsible for generating vector embeddings for text chunks.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    // 💡 In a production environment, this would call OpenAI, Anthropic, or an Ollama instance.
    // For this implementation, we simulate an embedding vector (384 dimensions) 
    // based on string hash for deterministic "pseudo-vector" behavior.

    const dimensions = 384;
    const embedding = new Array(dimensions).fill(0);

    // Deterministic simulation based on character codes
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        embedding[i % dimensions] += charCode / 1000;
        embedding[(i + 7) % dimensions] += (charCode * 1.5) / 1000;
    }

    // Normalize (optional for mock, but good practice)
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1;
    return embedding.map(val => val / magnitude);
}

/**
 * Calculates cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let mA = 0;
    let mB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += (vecA[i] * vecB[i]);
        mA += (vecA[i] * vecA[i]);
        mB += (vecB[i] * vecB[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    return dotProduct / (mA * mB);
}
