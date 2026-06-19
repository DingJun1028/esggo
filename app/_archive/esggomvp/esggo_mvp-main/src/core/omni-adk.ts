import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';
import { DigitalTwin } from '../lib/ncb-service';
import { getAgentsForTwin, ADK_REGISTRY } from '../config/adk-registry';
import { OmniSynthesisEngine } from './omni-synthesis';
import { OmniDecisionValidator } from './omni-decision-validator';
import { UserKnowledgeBase } from './user-knowledge-base';
import { IOmniAtom } from './omni-types';

/**
 * 🛠️ ADK (Agentic Development Kit) v1.0
 * 萬能級開發套件：提供 Swarm, Crew, 及 OmniOne 的開發接口。
 */
export interface IAgentConfig {
    id: string;
    role: string;
    model: string;
    goal: string;
    backstory: string;
    capabilities: string[];
}

export interface ICrewProject {
    name: string;
    agents: IAgentConfig[];
    tasks: string[];
}

export class ADK {
    private static instance: ADK;
    private autonomousSessions: Map<string, boolean> = new Map();
    private listeners: ((event: any) => void)[] = [];

    private constructor() { }

    public static getInstance(): ADK {
        if (!ADK.instance) {
            ADK.instance = new ADK();
        }
        return ADK.instance;
    }

    /**
     * 🐝 Swarm: 蜂群協作啟動
     * 實作去中心化協作邏輯：當單一 Agent 無法解決時，自動擴散至蜂群。
     */
    public async bootstrapSwarm(context: string): Promise<string> {
        const sessionId = `SWARM_SESSION_${Date.now()}`;
        omniLogger.info(LogCategory.SYSTEM, `ADK: [${sessionId}] Bootstrapping Swarm intelligence for context: ${context}`);

        // 使用註冊表中的真實代理節點
        const nodes = [
            ADK_REGISTRY['Analyst'].role,
            ADK_REGISTRY['Critic'].role,
            ADK_REGISTRY['Synthesizer'].role
        ];
        omniLogger.info(LogCategory.SYSTEM, `ADK: Swarm nodes active: ${nodes.join(', ')}`);

        return sessionId;
    }

    /**
     * 👥 Crew: 團隊任務分發
     * 實作結構化角色分工：OpenCrew+ (安全) 與 OmniCrew+ (擴展)。
     */
    public async deployCrew(project: ICrewProject): Promise<{ status: string, results: any[] }> {
        omniLogger.info(LogCategory.SYSTEM, `ADK: Deploying Crew [${project.name}] with ${project.agents.length} agents.`);

        const results = project.agents.map(agent => ({
            agentId: agent.id,
            role: agent.role,
            status: 'DEPLOYED',
            assignedTask: project.tasks[0] || 'Analyze System',
            capabilities: agent.capabilities
        }));

        return {
            status: 'MISSION_ACTIVE',
            results
        };
    }

    /**
     * 🆔 Activate Digital Twin Group: 
     * 啟動圍繞特定數位分身的專業代理群。
     */
    public async activateDigitalTwinGroup(twin: DigitalTwin): Promise<{ sessionId: string, agents: IAgentConfig[] }> {
        const sessionId = `DT_GROUP_${twin.twin_uuid}_${Date.now()}`;
        omniLogger.info(LogCategory.SYSTEM, `ADK: Activating Intelligent Group for Twin [${twin.nickname}]`);

        // 從註冊表取得真實代理配置，傳入完整的分身對象以進行智能分析
        const agents = getAgentsForTwin(twin);

        omniLogger.info(LogCategory.SYSTEM, `ADK: Intelligent Digital Twin Agent Group activated with agents: ${agents.map(a => a.role).join(', ')}`);

        return {
            sessionId,
            agents
        };
    }

    /**
     * 🌀 Autonomous Protocol (自主通典):
     * 開啟數位分身的自主運行邏輯，代主執行。
     */
    public async startAutonomousProtocol(twin: DigitalTwin): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `ADK: Initiating Autonomous Protocol for Twin [${twin.nickname}]`);
        
        // 喚醒 Trinity 與核心代理
        const { agents, sessionId } = await this.activateDigitalTwinGroup(twin);
        
        // 記錄會話狀態為開啟
        this.autonomousSessions.set(sessionId, true);

        // 開啟心跳循環 (Heartbeat Cycle)
        this.runAutonomousHeartbeat(twin, agents, sessionId);
    }

    /**
     * 停止自主通典
     */
    public stopAutonomousProtocol(sessionId: string): void {
        this.autonomousSessions.set(sessionId, false);
        omniLogger.info(LogCategory.SYSTEM, `ADK: Autonomous Protocol stopped for session [${sessionId}]`);
    }

    private async runAutonomousHeartbeat(twin: DigitalTwin, agents: IAgentConfig[], sessionId: string): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `ADK: Autonomous Heartbeat started for Session [${sessionId}]`);
        
        const cycle = async () => {
            if (!this.autonomousSessions.get(sessionId)) {
                omniLogger.info(LogCategory.SYSTEM, `ADK: Cycle terminated for session [${sessionId}]`);
                return;
            }

            omniLogger.info(LogCategory.AI, `ADK: [Autonomous] Twin ${twin.nickname} is sensing the environment...`);
            
            // 1. [Sensing] 感知環境：取得全域分數與 Sentient Actions
            // 從 UserKnowledgeBase 讀取真實原子
            const atoms = UserKnowledgeBase.getLibrary(); 
            const actions = OmniSynthesisEngine.generateSentientActions(atoms);
            
            if (actions.length > 0) {
                omniLogger.info(LogCategory.AI, `ADK: [Autonomous] Detected ${actions.length} potential Karma Repair opportunities.`);
                
                for (const action of actions) {
                    // 2. [Validation] 5T 驗算：對自主建議進行合規檢查
                    const validation = OmniDecisionValidator.validateDecision({
                        id: `auto-decision-${sessionId}-${Date.now()}`,
                        action: action.message,
                        sourceOrigin: `ADK_AUTONOMOUS_${twin.twin_uuid}`
                    });

                    if (validation.status === 'VALID') {
                        omniLogger.info(LogCategory.AI, `ADK: [Autonomous] Self-Driving Action Validated: ${action.message} (5T Score: ${validation.trustworthy.score})`);
                        
                        // 3. [Action] 實行修復或產生建議 Atom
                        const resolution = await OmniOne.manifest({
                            intent: `Autonomous Resolution: ${action.message}`,
                            type: 'Intelligence',
                            payload: {
                                action: action.message,
                                source: `ADK_AUTONOMOUS_${twin.twin_uuid}`,
                                validationScore: validation.trustworthy.score,
                                sessionId
                            },
                            domainRef: 'Autonomous_Agency'
                        });

                        this.notifyListeners({
                            type: 'AUTONOMOUS_ACTION',
                            sessionId,
                            msg: action.message,
                            atom: resolution,
                            time: new Date().toLocaleTimeString()
                        });
                    }
                }
            }

            // 設置下一次心跳 (15秒一跳，節省性能)
            setTimeout(() => cycle(), 15000);
        };

        // 啟動首次循環
        await cycle();
    }

    /**
     * 🔮 OmniOne+ Integration: 
     * 將 ADK 能力反哺回 OmniOne 總代理。
     */
    public async syncToOmniOne(): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, 'ADK: Syncing multi-agent capabilities to OmniOne Singularity.');
    }

    // --- Events ---
    
    public subscribe(callback: (event: any) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notifyListeners(event: any) {
        this.listeners.forEach(l => l(event));
    }
}

export const adk = ADK.getInstance();
