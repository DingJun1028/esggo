import { intelligenceForge, IComponentCore } from './IntelligenceForge';

export interface IStressMetrics {
    artifactsGenerated: number;
    artifactsPerSecond: number;
    memoryUsageMB: number;
    averageForgeTimeMs: number;
    lastForgeTimeMs: number;
    validArtifacts: number;    // 5T Validated
    invalidArtifacts: number;  // 5T Violation
    networkLatencyMs: number;  // [Phase 8] Simulated Mesh Latency
    congestionLevel: number;   // [Phase 8] 0-1
}

class StressTestService {
    private isRunning: boolean = false;
    private metrics: IStressMetrics = {
        artifactsGenerated: 0,
        artifactsPerSecond: 0,
        memoryUsageMB: 0,
        averageForgeTimeMs: 0,
        lastForgeTimeMs: 0,
        validArtifacts: 0,
        invalidArtifacts: 0,
        networkLatencyMs: 0,
        congestionLevel: 0
    };
    private intervalId: NodeJS.Timeout | null = null;
    private startTime: number = 0;
    private totalForgeTime: number = 0;
    private listeners: ((metrics: IStressMetrics) => void)[] = [];
    private meshSimulationActive: boolean = false;

    public subscribe(callback: (metrics: IStressMetrics) => void): () => void {
        this.listeners.push(callback);
        // Initial notify with current metrics
        callback({ ...this.metrics });

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notifyListeners(): void {
        const currentMetrics = { ...this.metrics };
        this.listeners.forEach(callback => callback(currentMetrics));
    }

    /**
     * [Phase 8] Simulate Planetary Mesh Congestion
     */
    public simulateMeshCongestion(active: boolean, level: number = 0.5): void {
        this.meshSimulationActive = active;
        this.metrics.congestionLevel = active ? level : 0;
        this.metrics.networkLatencyMs = active ? level * 500 : 0; // Up to 500ms delay
        this.notifyListeners();
    }

    public igniteFoundry(batchSize: number = 10, intervalMs: number = 1000): void {
        if (this.isRunning) return;

        console.log(`🔥 Igniting Data Foundry... Batch: ${batchSize}, Interval: ${intervalMs}ms`);
        this.isRunning = true;
        this.startTime = Date.now();
        this.metrics = {
            ...this.metrics,
            artifactsGenerated: 0,
            artifactsPerSecond: 0,
            averageForgeTimeMs: 0,
            lastForgeTimeMs: 0,
            validArtifacts: 0,
            invalidArtifacts: 0
        };

        this.intervalId = setInterval(async () => {
            if (!this.isRunning) return;

            const batchStart = performance.now();

            // Mass Forge / Distributed Forge
            for (let i = 0; i < batchSize; i++) {
                const artifact = this.meshSimulationActive
                    ? await this.forgeDistributedEvidence()
                    : await this.generateChaosArtifact();

                if (this.validateArtifact(artifact)) {
                    this.metrics.validArtifacts++;
                } else {
                    this.metrics.invalidArtifacts++;
                }
            }

            const batchEnd = performance.now();
            const batchDuration = batchEnd - batchStart;

            // Update Metrics
            this.metrics.artifactsGenerated += batchSize;
            this.metrics.lastForgeTimeMs = batchDuration / batchSize;
            this.totalForgeTime += batchDuration;
            this.metrics.averageForgeTimeMs = this.totalForgeTime / this.metrics.artifactsGenerated;

            const elapsedTimeSec = (Date.now() - this.startTime) / 1000;
            this.metrics.artifactsPerSecond = this.metrics.artifactsGenerated / (elapsedTimeSec || 1);

            // Mock memory usage
            // @ts-ignore
            if (performance.memory) {
                // @ts-ignore
                this.metrics.memoryUsageMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            }

            this.notifyListeners();
        }, intervalMs);
    }

    public coolDown(): void {
        console.log('❄️ Cooling down Data Foundry...');
        this.isRunning = false;
        this.meshSimulationActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.notifyListeners();
    }

    /**
     * [Phase 8] Forge Distributed Evidence (Simulate Mesh Verification)
     */
    public async forgeDistributedEvidence(): Promise<IComponentCore> {
        // Add simulated mesh latency
        if (this.meshSimulationActive) {
            const jitter = Math.random() * 50;
            await new Promise(resolve => setTimeout(resolve, this.metrics.networkLatencyMs + jitter));
        }

        const base = await this.generateChaosArtifact();

        // Simulate multi-node consensus metadata
        return {
            ...base,
            metadata: {
                ...(base as any).metadata,
                consensus_nodes: ['Alpha', 'Beta', 'Gamma'],
                verification_rounds: 3,
                is_planetary_mesh: true
            }
        } as IComponentCore;
    }

    public async generateChaosArtifact(): Promise<IComponentCore> {
        // Chaos inputs: random impact/relevance, potential edge cases
        const impact = Math.random() * 120 - 10; // Range -10 to 110 (Test bounds)
        const relevance = Math.random() * 100;
        const chaosFactor = Math.random();

        let entropy = 1.0;
        if (chaosFactor > 0.95) entropy = 0; // Test divide by zero protection in R_s
        if (chaosFactor > 0.98) entropy = -5; // Test negative entropy

        return await intelligenceForge.forgeEvidence(
            "Chaos Engine",
            `Chaos Shard ${Date.now().toString().slice(-6)}`,
            impact,
            relevance
        ); // IntelligenceForge handles the R_s calculation safety
    }

    public getStatus(): boolean {
        return this.isRunning;
    }

    public getMetrics(): IStressMetrics {
        return { ...this.metrics };
    }

    /**
     * 5T Protocol Integrity Check
     */
    private validateArtifact(artifact: IComponentCore): boolean {
        // Traceable
        if (!artifact.uuid || !artifact.source_origin) return false;

        // Trackable
        if (!artifact.timestamp || !Array.isArray(artifact.evidence)) return false;

        // Transparent
        if (typeof artifact.resonance_rs !== 'number' || isNaN(artifact.resonance_rs)) return false;

        // Trustworthy (Immutability)
        if (!Object.isFrozen(artifact)) return false;

        return true;
    }
}

export const stressTestService = new StressTestService();
