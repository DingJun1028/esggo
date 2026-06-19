/**
 * 📡 Inference Stream: Real-time Sentient Feeds
 * Feeds predictions into the Gnosis UI.
 */

import { IGnosisPrediction } from "@/core/omni-types";

export type InferencePacket = {
    timestamp: number;
    prediction: IGnosisPrediction;
    entropy: number;
}

export class InferenceStream {
    private static listeners: ((packet: InferencePacket) => void)[] = [];

    static subscribe(callback: (packet: InferencePacket) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    static emit(packet: InferencePacket) {
        this.listeners.forEach(l => l(packet));
    }

    /**
     * Start a simulation of real-time predictions.
     */
    static startSimulation(onPacket: (packet: InferencePacket) => void) {
        const interval = setInterval(() => {
            const mockPrediction: IGnosisPrediction = {
                id: `INF-${Date.now()}`,
                horizon: 'Real-time',
                probability: 0.7 + (Math.random() * 0.2),
                impactType: Math.random() > 0.5 ? 'Opportunity' : 'Risk',
                description: 'AI detected a 5T resonance shift in the supply chain node.',
                recommendation: 'Verify SHA-256 integrity in Evidence Vault.',
                signalStrength: Math.random(),
                timestamp: Date.now()
            };

            const packet: InferencePacket = {
                timestamp: Date.now(),
                prediction: mockPrediction,
                entropy: Math.random() * 0.1
            };

            onPacket(packet);
            this.emit(packet);
        }, 5000);

        return () => clearInterval(interval);
    }
}
