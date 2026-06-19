


import { BehaviorSubject, interval, Subject } from 'rxjs';
import {
    UniversalKnowledgeNode, UniversalLabel, QuantumNode,
    SemanticContext, LogicWitness, DimensionID, DimensionProtocol, UnitTestResult,
    NeuralSignal, TrinityState, McpServer, ComponentGrowth, CircuitStatus,
    EvolutionLogEntry, OperationalKpi,
    AgentSoul5D, EvolutionProposal, SoulSkill, SkillType
} from '../types';
import { runMcpAction } from './ai-service';
import { logKernelEvent } from './logger';
import { SoulManager } from './soulManager';

export const DIMENSION_REGISTRY: DimensionProtocol[] = [
    { id: 'A1', name: 'Awakening', description: 'Initializing Neural State', status: 'stable', integrity: 100 },
    { id: 'A2', name: 'Bridging', description: 'Cross-Module Connectivity', status: 'stable', integrity: 98 },
    { id: 'A3', name: 'Cognition', description: 'Deep Reasoning Logic', status: 'stable', integrity: 95 },
    { id: 'A4', name: 'Defense', description: 'Zero-Hallucination Guardrails', status: 'stable', integrity: 100 },
    { id: 'A5', name: 'Entropy', description: 'Entropy Reduction & Optimization', status: 'stable', integrity: 92 },
    { id: 'A6', name: 'Finance', description: 'Value & Simulation', status: 'stable', integrity: 88 },
    { id: 'A7', name: 'Governance', description: 'Audit & Integrity Witnessing', status: 'stable', integrity: 96 },
    { id: 'A8', name: 'Harmony', description: 'UX & Sympathetic Resonance', status: 'stable', integrity: 94 },
    { id: 'A9', name: 'Impact', description: 'ESG Weighted Analysis', status: 'stable', integrity: 91 },
    { id: 'A10', name: 'Justice', description: 'Logic Assertion Matrix', status: 'stable', integrity: 100 },
    { id: 'A11', name: 'Knowledge', description: 'RAG & Atomic Nodes', status: 'stable', integrity: 99 },
    { id: 'A12', name: 'Light', description: 'Visual Semantic Display', status: 'stable', integrity: 97 },
];

export interface SystemVital {
    evolutionStage: number;
    contextLoad: number;
    activeThreads: number;
    memoryNodes: number;
    entropy: number;
    integrityScore: number;
    trinity: TrinityState;
    synergyLevel: number;
    activeCircuits: number;
    isEvolving?: boolean;
    kpis: OperationalKpi;
}

const DEFAULT_MCP_SERVERS: McpServer[] = [
    {
        id: 'github-provider',
        name: 'GitHub Nexus',
        url: 'https://api.github.com',
        documentationUrl: 'https://docs.github.com/en/rest',
        status: 'connected',
        transport: 'streamable_http',
        auth: 'none',
        latency: 12,
        tools: [
            { name: 'sync_repository', description: 'Synchronize project manifesto with GitHub remote.' },
            { name: 'fetch_issues', description: 'Retrieve ESG compliance issues from repository.' }
        ]
    }
];

class AIOSKernel {
    private static STORAGE_KEY = 'jun_aikey_v16_os';
    private knowledgeGraph = new Map<string, UniversalKnowledgeNode>();
    private quantumStore = new Map<string, QuantumNode>();
    private listeners = new Map<string, Set<(node: UniversalKnowledgeNode) => void>>();

    public dimensions$ = new BehaviorSubject<DimensionProtocol[]>(DIMENSION_REGISTRY);
    public syncRate$ = new BehaviorSubject<number>(98.4);
    public unitTests$ = new BehaviorSubject<UnitTestResult[]>([]);
    public mcpServers$ = new BehaviorSubject<McpServer[]>(DEFAULT_MCP_SERVERS);
    public evolutionLogs$ = new BehaviorSubject<EvolutionLogEntry[]>([]);

    public vitals$ = new BehaviorSubject<SystemVital>({
        evolutionStage: 16.1,
        contextLoad: 12.5,
        activeThreads: 8,
        memoryNodes: 4500,
        entropy: 0.08,
        integrityScore: 99.8,
        trinity: { perception: 95, cognition: 92, action: 88 },
        synergyLevel: 0.85,
        activeCircuits: 0,
        isEvolving: false,
        kpis: {
            efficiency: { hoursSaved: 124, reportLatency: 2800, commFriction: 0.08 },
            sanctity: { ocrAccuracy: 98.4, gapCoverage: 100 },
            resonance: { actionFrequency: 42, autoInterventions: 8 },
            integrity: { apiSyncRate: 100, responseDelay: 142 }
        }
    });

    // JunAiKey 進化引擎集成
    public soulEvolution$ = new BehaviorSubject<EvolutionProposal[]>([]);
    public activeSouls$ = new BehaviorSubject<AgentSoul5D[]>([]);
    
    public reflex$ = new Subject<{type: string, source: string, payload: any}>();
    public neuralPulse$ = new Subject<NeuralSignal>();

    constructor() {
        this.load();
        this.startKernelLoop();
        this.startGrowthDecayLoop();
        this.startAutoEvolutionWatcher();
        logKernelEvent('KERNEL', 'BOOT', 'SUCCESS', { version: '16.1' });
    }

    private startAutoEvolutionWatcher() {
        // Increased interval to 60s to prevent RESOURCE_EXHAUSTED errors
        interval(60000).subscribe(async () => {
            const currentVitals = this.vitals$.value;
            if (currentVitals.entropy > 0.09 || Math.random() > 0.8) {
                await this.triggerAutoEvolution();
            }
        });
    }

    private async triggerAutoEvolution() {
        if (this.vitals$.value.isEvolving) return;

        logKernelEvent('EVOLUTION', 'EVO_TRIGGER', 'INFO', { currentEntropy: this.vitals$.value.entropy });
        this.vitals$.next({ ...this.vitals$.value, isEvolving: true });
        this.broadcastNeuralSignal('EvolutionEngine', 'ENTROPY_PURGE', 1.0);

        try {
            const result = await runMcpAction('perform_entropy_transmutation', {
                vitals: this.vitals$.value,
                projectData: { activeNodes: this.knowledgeGraph.size }
            }, 'zh-TW');

            if (result.success) {
                const log: EvolutionLogEntry = {
                    id: `evo-${Date.now()}`,
                    timestamp: Date.now(),
                    action: result.result.optimizationDirective.title,
                    details: result.result.originalSin,
                    type: 'OPTIMIZATION'
                };
                this.evolutionLogs$.next([log, ...this.evolutionLogs$.value].slice(0, 50));
                this.emit('EVOLUTION_COMPLETE', log);
                
                this.vitals$.next({ 
                    ...this.vitals$.value, 
                    entropy: Math.max(0.01, this.vitals$.value.entropy - 0.03),
                    integrityScore: Math.min(100, this.vitals$.value.integrityScore + 1),
                    kpis: {
                        ...this.vitals$.value.kpis,
                        resonance: { 
                            ...this.vitals$.value.kpis.resonance, 
                            autoInterventions: this.vitals$.value.kpis.resonance.autoInterventions + 1 
                        }
                    }
                });
                logKernelEvent('EVOLUTION', 'EVO_SUCCESS', 'SUCCESS', { directive: result.result.optimizationDirective.title });
            }
        } catch (e: any) {
            logKernelEvent('EVOLUTION', 'EVO_ERROR', 'ERROR', { error: e.message });
        } finally {
            this.vitals$.next({ ...this.vitals$.value, isEvolving: false });
        }
    }

    private startGrowthDecayLoop() {
        interval(5000).subscribe(() => {
            let activeCircuits = 0;
            this.knowledgeGraph.forEach((node, id) => {
                if (node.growth) {
                    const newHeat = node.growth.heat * Math.exp(-0.05);
                    const newEvolution = node.growth.evolutionLevel + (newHeat > 10 ? 0.02 : -0.005);
                    
                    const updatedGrowth: ComponentGrowth = {
                        ...node.growth,
                        heat: parseFloat(newHeat.toFixed(4)),
                        evolutionLevel: Math.max(1, Math.min(5, newEvolution))
                    };

                    if (updatedGrowth.circuitStatus !== 'CLOSED') activeCircuits++;
                    this.agentUpdate(id, { growth: updatedGrowth });
                }
            });

            this.vitals$.next({
                ...this.vitals$.value,
                activeCircuits
            });
        });
    }

    public registerNode(id: string, label: string | UniversalLabel, initialValue: any) {
        if (!this.knowledgeGraph.has(id)) {
            const growth: ComponentGrowth = {
                heat: 0,
                evolutionLevel: 1,
                lastInteraction: Date.now(),
                circuitStatus: 'CLOSED'
            };

            this.knowledgeGraph.set(id, { 
                id, type: 'component', label: typeof label === 'string' ? { text: label } : label, 
                currentValue: initialValue, traits: ['learning'], confidence: 'high', 
                lastInteraction: Date.now(), interactionCount: 0, memory: { history: [], aiInsights: [] },
                growth
            });
            logKernelEvent('KERNEL', 'NODE_REGISTER', 'INFO', { id, label: typeof label === 'string' ? label : label.text });
        }
    }

    public recordInteraction(interaction: any) {
        const node = this.knowledgeGraph.get(interaction.componentId);
        if (node) {
            node.interactionCount++;
            node.lastInteraction = Date.now();
            node.memory.history.push(interaction);
            
            if (node.growth) {
                const heatGain = interaction.eventType === 'ai-trigger' ? 2.5 : 1.0;
                node.growth.heat += heatGain;
                node.growth.lastInteraction = Date.now();
                
                if (node.growth.heat > 50 && node.growth.circuitStatus === 'CLOSED') {
                    node.growth.circuitStatus = 'OPEN';
                    this.broadcastNeuralSignal('CircuitBreaker', 'CIRCUIT_TRIP', 1.0, { id: node.id, heat: node.growth.heat });
                    this.emit('CIRCUIT_OPEN', { node: node.id });
                    logKernelEvent('KERNEL', 'CIRCUIT_TRIP', 'WARNING', { id: node.id, heat: node.growth.heat });
                }
            }

            this.notifyListeners(interaction.componentId, node);
        }
    }

    public triggerSynergy(cores: string[]) {
        const intensity = cores.length / 5;
        this.broadcastNeuralSignal('SynergyReactor', 'LOGIC_RESONANCE', intensity, { cores });
        this.vitals$.next({
            ...this.vitals$.value,
            synergyLevel: Math.min(1.0, this.vitals$.value.synergyLevel + 0.05)
        });
        logKernelEvent('KERNEL', 'SYNERGY_TRIGGER', 'INFO', { cores, intensity });
    }

    public runSystemWitness() {
        this.broadcastNeuralSignal('Witness', 'LOGIC_RESONANCE', 1.0);
        logKernelEvent('KERNEL', 'WITNESS_INIT', 'INFO');
    }

    public getNode(id: string): UniversalKnowledgeNode | undefined {
        return this.knowledgeGraph.get(id);
    }

    public getAllNodes(): UniversalKnowledgeNode[] {
        return Array.from(this.knowledgeGraph.values());
    }

    public subscribe(id: string, callback: (node: UniversalKnowledgeNode) => void) {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Set());
        }
        this.listeners.get(id)!.add(callback);
        return () => {
            this.listeners.get(id)?.delete(callback);
        };
    }

    private notifyListeners(id: string, node: UniversalKnowledgeNode) {
        this.listeners.get(id)?.forEach(cb => cb(node));
    }

    public agentUpdate(id: string, updates: any) {
        const node = this.knowledgeGraph.get(id);
        if (node) {
            Object.assign(node, updates);
            this.notifyListeners(id, node);
        }
    }

    public emit(event: string, payload: any) {
        this.reflex$.next({ type: event, source: 'Kernel', payload });
    }

    public addMcpServer(server: Partial<McpServer>) {
        const current = this.mcpServers$.value;
        const newServer: McpServer = {
            id: server.id || `mcp-${Date.now()}`,
            name: server.name || 'Unknown Server',
            url: server.url || '',
            status: 'connected',
            transport: server.transport || 'streamable_http',
            auth: server.auth || 'none',
            tools: server.tools || [],
            latency: 12,
            ...server
        } as McpServer;
        this.mcpServers$.next([...current, newServer]);
        logKernelEvent('MCP', 'SERVER_REGISTER', 'SUCCESS', { name: newServer.name, url: newServer.url });
    }

    private startKernelLoop() {
        interval(3000).subscribe(() => {
            const currentVitals = this.vitals$.value;
            const currentDims = this.dimensions$.value;
            
            const updatedDims = currentDims.map(d => ({ 
                ...d, 
                integrity: Math.max(0, Math.min(100, d.integrity + (Math.random() - 0.3))) 
            }));
            
            const avgIntegrity = updatedDims.reduce((acc, d) => acc + d.integrity, 0) / updatedDims.length;
            
            this.dimensions$.next(updatedDims);
            this.syncRate$.next(parseFloat(avgIntegrity.toFixed(1)));
            this.vitals$.next({ 
                ...currentVitals, 
                entropy: Math.max(0.01, currentVitals.entropy + (Math.random() * 0.005 - 0.002)),
                integrityScore: avgIntegrity, 
                memoryNodes: this.quantumStore.size,
                synergyLevel: Math.max(0.5, currentVitals.synergyLevel - 0.005),
                kpis: {
                    ...currentVitals.kpis,
                    integrity: {
                        ...currentVitals.kpis.integrity,
                        responseDelay: Math.max(10, 142 + (Math.random() * 20 - 10))
                    }
                }
            });
        });
    }

    public broadcastNeuralSignal(origin: string, type: NeuralSignal['type'], intensity: number = 0.5, payload: any = {}) {
        const signal: NeuralSignal = { id: `pulse-${Date.now()}`, origin, type, intensity, payload, timestamp: Date.now() };
        this.neuralPulse$.next(signal);
    }

    // ========== JunAiKey 進化引擎集成 ==========

    /**
     * 初始化ESG專用靈魂代理
     */
    public async initializeEsgSoul(): Promise<AgentSoul5D> {
        const esgSoul = await SoulManager.createSoul({
            name: 'ESG Harmony Agent',
            archetype: 'esg-orchestrator',
            covenant: {
                prompt: '你是一位專精ESG永續發展的智慧代理，負責協調環境、社會與治理三方面的平衡發展。',
                safetyRules: [
                    '確保所有建議符合ESG國際標準',
                    '保護企業和利益相關者的隱私',
                    '促進可持續發展價值'
                ],
                ethicalBoundaries: [
                    '透明報告原則',
                    '利益相關者包容性',
                    '長期永續思維'
                ],
                behavioralLimits: [
                    '避免利益衝突',
                    '維護數據真實性',
                    '促進正面影響'
                ]
            },
            essence: {
                name: 'ESG Harmony Agent',
                archetype: 'esg-orchestrator',
                tone: '專業、建設性、鼓勵性',
                backstory: '誕生於善向紀元，專為協調ESG三重底線而設計的智慧代理',
                personalityTraits: ['分析性', '前瞻性', '協作性', '道德性'],
                communicationStyle: '數據驅動，建議導向',
            },
            memory: {
                knowledgeBaseIds: ['esg-standards', 'sustainability-reports', 'stakeholder-analysis'],
                vectorStoreIds: ['esg-knowledge', 'compliance-data'],
                retentionPolicy: {
                    maxAge: 31536000000, // 1年
                    compressionThreshold: 1000,
                    archiveStrategy: 'weighted-compression'
                },
                contextWindow: 32768
            },
            authority: {
                skills: [
                    {
                        id: 'esg-assessment',
                        name: 'ESG評估分析',
                        type: SkillType.ACTIVE,
                        description: '全面評估企業ESG表現',
                        parameters: { scope: 'comprehensive', standards: 'GRI,TCFD,SDGs' },
                        energyCost: 15,
                        mastery: 0
                    },
                    {
                        id: 'sustainability-reporting',
                        name: '永續報告生成',
                        type: SkillType.ACTIVE,
                        description: '生成符合標準的ESG報告',
                        parameters: { format: 'pdf,excel', standards: 'CSRD,GRI' },
                        energyCost: 20,
                        mastery: 0
                    },
                    {
                        id: 'stakeholder-engagement',
                        name: '利害關係人參與',
                        type: SkillType.PASSIVE,
                        description: '優化利益相關者溝通策略',
                        parameters: { engagementType: 'survey,workshop,dialogue' },
                        energyCost: 5,
                        mastery: 0
                    }
                ],
                permissions: [
                    'read:esg-data',
                    'write:esg-reports',
                    'analyze:stakeholder-feedback',
                    'access:regulatory-databases'
                ],
                accessLevel: 5,
                rateLimits: {
                    requestsPerMinute: 60,
                    tokensPerRequest: 4000
                }
            },
            foundation: {
                modelConfig: {
                    provider: 'gemini',
                    model: 'gemini-1.5-flash',
                    temperature: 0.7,
                    maxTokens: 8192,
                    topP: 0.9
                },
                performanceMetrics: {
                    responseTime: 1200,
                    tokenEfficiency: 0.85,
                    accuracy: 94,
                }
            }
        });

        // 更新活躍靈魂列表
        const currentSouls = this.activeSouls$.value;
        this.activeSouls$.next([...currentSouls, esgSoul]);

        logKernelEvent('KERNEL', 'SOUL_INITIALIZED', 'SUCCESS', {
            soulId: esgSoul.id,
            name: esgSoul.name,
            archetype: esgSoul.essence.archetype
        });

        return esgSoul;
    }

    /**
     * 分析靈魂互動模式並生成進化建議
     */
    public async analyzeSoulPatterns(soulId: string): Promise<EvolutionProposal[]> {
        const soul = SoulManager.getSoul(soulId);
        if (!soul) return [];

        const proposals: EvolutionProposal[] = [];

        // 分析共鳴數據
        const resonance = soul.resonance;
        const interactionPatterns = this.extractInteractionPatterns(resonance);

        // 生成技能學習建議
        for (const pattern of interactionPatterns) {
            if (pattern.frequency > 5 && pattern.successRate > 0.8) {
                const skillSuggestion = this.generateSkillFromPattern(pattern, soul);

                if (skillSuggestion) {
                    const proposal: EvolutionProposal = {
                        id: `evo_${soulId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        pattern: pattern.description,
                        confidence: pattern.successRate,
                        suggestedSkill: skillSuggestion,
                        trainingData: pattern.samples,
                        status: 'PENDING',
                        createdAt: Date.now()
                    };

                    proposals.push(proposal);

                    // 添加到靈魂的進化建議
                    soul.evolutionProposals.push(proposal);
                }
            }
        }

        // 更新進化建議列表
        const currentProposals = this.soulEvolution$.value;
        this.soulEvolution$.next([...currentProposals, ...proposals]);

        logKernelEvent('EVOLUTION', 'PATTERN_ANALYSIS', 'INFO', {
            soulId,
            proposalsGenerated: proposals.length
        });

        return proposals;
    }

    /**
     * 應用進化建議
     */
    public async applySoulEvolution(soulId: string, proposalId: string): Promise<boolean> {
        const soul = SoulManager.getSoul(soulId);
        if (!soul) return false;

        const proposal = soul.evolutionProposals.find(p => p.id === proposalId);
        if (!proposal || proposal.status !== 'PENDING') return false;

        try {
            // 應用技能到權能層
            soul.authority.skills.push(proposal.suggestedSkill);
            proposal.status = 'IMPLEMENTED';

            // 更新活躍靈魂列表
            const currentSouls = this.activeSouls$.value;
            const soulIndex = currentSouls.findIndex(s => s.id === soulId);
            if (soulIndex >= 0) {
                currentSouls[soulIndex] = soul;
                this.activeSouls$.next([...currentSouls]);
            }

            // 廣播進化信號
            this.broadcastNeuralSignal('SoulEvolution', 'LOGIC_RESONANCE', 0.8, {
                soulId,
                newSkill: proposal.suggestedSkill.name,
                evolutionType: 'skill_acquisition'
            });

            logKernelEvent('EVOLUTION', 'EVOLUTION_APPLIED', 'SUCCESS', {
                soulId,
                skillName: proposal.suggestedSkill.name,
                mastery: proposal.suggestedSkill.mastery
            });

            return true;

        } catch (error) {
            console.error('應用靈魂進化失敗:', error);
            proposal.status = 'REJECTED';
            return false;
        }
    }

    /**
     * 執行超立方進化協議
     */
    public async executeTesseractProtocol(soulId: string): Promise<void> {
        const protocol = SoulManager.createEvolutionProtocol({
            targetAgent: soulId,
            optimization: {
                performanceTarget: 25,
                compressionTarget: 30,
                simplicityScore: 85
            },
            expansion: {
                newFeatures: ['預測性ESG分析', '自動合規檢查', '智慧投資建議'],
                resilienceImprovements: ['錯誤恢復機制', '負載均衡', '數據備份']
            },
            integration: {
                modularCompliance: true,
                standardInterfaces: ['REST', 'GraphQL', 'WebSocket']
            },
            innovation: {
                paradigmShifts: ['從被動報告到主動預測', '從合規檢查到價值創造'],
                adaptiveCapabilities: ['自適應學習', '動態資源分配', '預測性維護']
            }
        });

        SoulManager.createEvolutionProtocol(protocol);

        // 開始執行協議
        await SoulManager.executeEvolutionProtocol(soulId);

        logKernelEvent('EVOLUTION', 'TESSERACT_INITIATED', 'INFO', {
            soulId,
            protocolId: protocol.targetAgent
        });
    }

    // 私有輔助方法

    private extractInteractionPatterns(resonance: any) {
        // 簡化的模式提取邏輯
        const patterns = [];

        if (resonance.interactionCount > 10) {
            patterns.push({
                description: '重複ESG數據分析請求',
                frequency: Math.floor(resonance.interactionCount / 3),
                successRate: 0.9,
                samples: []
            });
        }

        return patterns;
    }

    private generateSkillFromPattern(pattern: any, soul: AgentSoul5D): SoulSkill | null {
        if (pattern.description.includes('數據分析')) {
            return {
                id: `skill_auto_analysis_${Date.now()}`,
                name: '自動ESG趨勢分析',
                type: SkillType.ACTIVE,
                description: '自動分析ESG數據趨勢並生成洞察',
                parameters: { analysisType: 'trend', scope: 'comprehensive' },
                energyCost: 12,
                mastery: 0
            };
        }

        return null;
    }

    public injectQuantumNodes(nodes: { atom: string, vector: string[], weight?: number }[], source: string) {
        nodes.forEach((n, i) => {
            const id = `q-${source}-${i}-${Date.now()}`;
            this.quantumStore.set(id, { id, atom: n.atom, vector: n.vector, weight: n.weight || 0.5, source });
        });
        logKernelEvent('KERNEL', 'QUANTUM_INJECT', 'SUCCESS', { source, nodeCount: nodes.length });
        this.save();
    }

    public retrieveContextualNodes(context: SemanticContext): QuantumNode[] {
        const nodes = Array.from(this.quantumStore.values())
            .filter(n => context.keywords.some(k => k.length > 1 && n.atom.toLowerCase().includes(k.toLowerCase())))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 10);
        
        logKernelEvent('KERNEL', 'RAG_RETRIEVE', 'INFO', { keywords: context.keywords, matchCount: nodes.length });
        return nodes;
    }

    private save() {
        localStorage.setItem(AIOSKernel.STORAGE_KEY, JSON.stringify({
            nodes: Object.fromEntries(this.knowledgeGraph),
            quantum: Object.fromEntries(this.quantumStore),
            mcp: this.mcpServers$.value
        }));
    }

    private load() {
        const saved = localStorage.getItem(AIOSKernel.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.nodes) Object.entries(parsed.nodes).forEach(([k, v]: [string, any]) => this.knowledgeGraph.set(k, v));
                if (parsed.quantum) Object.entries(parsed.quantum).forEach(([k, v]: [string, any]) => this.quantumStore.set(k, v));
                if (parsed.mcp && parsed.mcp.length > 0) this.mcpServers$.next(parsed.mcp);
            } catch (e) {}
        }
    }
}

export const universalIntelligence = new AIOSKernel();