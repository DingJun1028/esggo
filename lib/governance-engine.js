"use strict";
/**
 * ESG GO | Governance Engine (Stakeholder Resonance)
 * Manages decentralized voting and calculates alignment between
 * internal strategy and external stakeholder expectations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.governanceEngine = exports.GovernanceEngine = void 0;
const crypto_proof_1 = require("./crypto-proof");
class GovernanceEngine {
    static getInstance() {
        if (!GovernanceEngine.instance) {
            GovernanceEngine.instance = new GovernanceEngine();
        }
        return GovernanceEngine.instance;
    }
    /**
     * Casts a cryptographically sealed vote.
     */
    async castVote(vote) {
        const id = `VOTE-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const timestamp = new Date().toISOString();
        const hashLock = await (0, crypto_proof_1.sha256)(`${id}:${vote.topicId}:${vote.priorityScore}:${timestamp}`);
        return {
            ...vote,
            id,
            timestamp,
            hashLock
        };
    }
    /**
     * Calculates resonance between internal weights and external votes.
     */
    calculateResonance(topics, votes) {
        return topics.map(topic => {
            const topicVotes = votes.filter(v => v.topicId === topic.id);
            const avgStakeholderPriority = topicVotes.length > 0
                ? topicVotes.reduce((acc, v) => acc + v.priorityScore, 0) / topicVotes.length
                : 3; // Neutral default
            // Resonance = 100 - (abs(diff) / max_diff * 100)
            const diff = Math.abs(topic.internalWeight - avgStakeholderPriority);
            const resonance = Math.round(100 - (diff / 4) * 100);
            return {
                topicId: topic.id,
                label: topic.label,
                internalPriority: topic.internalWeight,
                stakeholderPriority: avgStakeholderPriority,
                resonance
            };
        });
    }
    /**
     * Get overall resonance index.
     */
    getOverallResonanceIndex(results) {
        if (results.length === 0)
            return 0;
        return Math.round(results.reduce((acc, r) => acc + r.resonance, 0) / results.length);
    }
}
exports.GovernanceEngine = GovernanceEngine;
exports.governanceEngine = GovernanceEngine.getInstance();
//# sourceMappingURL=governance-engine.js.map