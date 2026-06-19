import { IOmniAtom, IGnosisPrediction, IOmniGnosisAtom, IOmniVector } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🧮 Gnosis Vector Utilities
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        const a = vecA[i] || 0;
        const b = vecB[i] || 0;
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 📦 Gnosis Vector Store (Mock implementation of Vector Retrieval)
 */
export class GnosisVectorStore {
    private vectors: IOmniVector[] = [];

    // Simple hash-based mock embedding generator
    public vectorize(text: string): number[] {
        const dimensions = 16;
        const vec = new Array(dimensions).fill(0);
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            vec[i % dimensions] += charCode * (i + 1);
        }
        // Normalize
        const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return norm === 0 ? vec : vec.map(v => v / norm);
    }

    public addDocument(payload: string, metadata: Record<string, any> = {}): string {
        const id = `vec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const values = this.vectorize(payload);

        this.vectors.push({ id, values, payload, metadata });
        omniLogger.info(LogCategory.SYSTEM, `GnosisVectorStore: Added document [${id}] with dimension ${values.length}`);
        return id;
    }

    public semanticSearch(query: string, topK: number = 3, threshold: number = 0.5): (IOmniVector & { score: number })[] {
        const queryVector = this.vectorize(query);

        const scoredVectors = this.vectors.map(vec => ({
            ...vec,
            score: cosineSimilarity(queryVector, vec.values)
        }));

        const results = scoredVectors
            .filter(v => v.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        omniLogger.info(LogCategory.SYSTEM, `GnosisVectorStore: Executed semantic search for "${query.substring(0, 15)}...". Found ${results.length} results above threshold ${threshold}.`);
        return results;
    }
}

/**
 * 🔮 GnosisEngine: The Prescriptive Intelligence Core
 * Simulates future ESG states based on 5T protocol history.
 */
export class GnosisEngine {
    /**
     * 🧠 Forecast: Generate a predictive atom based on current state.
     */
    public static forecast<T>(baseAtom: IOmniAtom<T>, scenario: string): IOmniGnosisAtom<T> {
        omniLogger.info(LogCategory.SYSTEM, `Gnosis: Initiating future-state simulation for Atom ${baseAtom.uuid}...`);

        const prediction: IGnosisPrediction = {
            targetUuid: baseAtom.uuid,
            probability: 0.85 + (Math.random() * 0.1), // Sentient Confidence
            timeHorizon: "2026-Q4",
            scenario: scenario,
            impactDelta: baseAtom.impactMetric?.includes('+') ? 15 : -10 // Projected change
        };

        const gnosisAtom: IOmniGnosisAtom<T> = {
            ...baseAtom,
            predictions: [prediction],
            status: "Potential" // Gnosis results start as potential futures
        };

        omniLogger.info(LogCategory.SYSTEM, `Gnosis: Simulation complete. Probability: ${(prediction.probability * 100).toFixed(2)}%`);
        return gnosisAtom;
    }

    /**
     * 🧬 DistillTrend: Analyze multiple atoms to find emerging ESG patterns.
     */
    public static distillTrend(atoms: IOmniAtom<Record<string, unknown>>[]): string[] {
        const trends: string[] = [];
        if (atoms.length > 5) trends.push("Accelerated Decarbonization Pattern Detected");
        if (atoms.some(a => a.domainRef.includes('HR'))) trends.push("Social Harmony Resonance Increasing");

        return trends;
    }

    /**
     * 👁️ SynthesizeOmniscience: Aggregate and distill predictive insights from relevant vector responses.
     */
    public static synthesizeOmniscience(vectors: IOmniVector[]): string {
        if (vectors.length === 0) return "No sufficient resonance detected for synthesis.";

        const baseInsights = vectors.map(v => v.metadata?.insight).filter(Boolean);

        if (baseInsights.length > 0) {
            return `Synthesized Gnosis: Aggregated ${baseInsights.length} cognitive streams. Primary trajectory aligns with [${baseInsights[0].substring(0, 20)}...] and shows harmonic resonance across ${vectors.length} temporal points.`;
        }

        return `Gnosis synthesized based on ${vectors.length} data atoms. The system favors an evolving sustainability trajectory.`;
    }
}
