export interface IComponentCore {
    readonly uuid: string;
    readonly version: string;
    readonly timestamp: number;
    evidence: string;
}
export declare class QkpHealingAgent {
    private readonly botSignature;
    private readonly core;
    constructor();
    /**
     * 初始化 Agent：訂閱 omniAgentBus，實現異步非阻塞式「無作妙德」治療循環
     */
    private initializeAgent;
    /**
     * 執行降維自癒與共識對齊演算法
     */
    private executeHealingWorkflow;
}
export declare const qkpHealingAgent: QkpHealingAgent;
//# sourceMappingURL=qkp-healing-agent.d.ts.map