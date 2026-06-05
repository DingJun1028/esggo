import { ISwarmSyncService, SwarmSyncCallbacks } from './ISwarmSyncService';
import { AgentTask, SwarmAgent } from '../agent/types';
import { dcListSwarmAgentTasks } from '../dataconnect-services';

export class WebSocketSwarmSyncService implements ISwarmSyncService {
    private ws: WebSocket | null = null;
    private callbacks: SwarmSyncCallbacks | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    connect(callbacks: SwarmSyncCallbacks): void {
        this.callbacks = callbacks;
        this.initializeWebSocket();
        // 初始化時，先進行一次強制同步（RESTful fallback），確保畫面有初始資料
        this.forceSync();
    }

    private initializeWebSocket() {
        const wsUrl = process.env.NEXT_PUBLIC_SWARM_WS_URL || 'wss://api.esggo.com/swarm';
        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                this.callbacks?.onStatusChange(true);
                console.log('[SwarmSync] WebSocket connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'TASK_UPDATE' && data.tasks) {
                        const mappedTasks = this.mapTasks(data.tasks);
                        this.callbacks?.onTasksUpdated(mappedTasks);
                        this.callbacks?.onAgentsUpdated(this.deriveAgents(mappedTasks));
                    }
                } catch (err) {
                    console.error('[SwarmSync] Failed to parse message', err);
                }
            };

            this.ws.onclose = () => {
                this.callbacks?.onStatusChange(false);
                // 簡單的斷線重連機制
                this.reconnectTimeout = setTimeout(() => this.initializeWebSocket(), 5000);
            };

            this.ws.onerror = () => {
                this.callbacks?.onError('WebSocket connection error');
                this.ws?.close();
            };
        } catch (err) {
            this.callbacks?.onError('Failed to initialize WebSocket');
        }
    }

    disconnect(): void {
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.callbacks = null;
    }

    async forceSync(): Promise<void> {
        try {
            const remoteTasks = await dcListSwarmAgentTasks();
            const mappedTasks = this.mapTasks(remoteTasks);
            this.callbacks?.onTasksUpdated(mappedTasks);
            this.callbacks?.onAgentsUpdated(this.deriveAgents(mappedTasks));
        } catch (error) {
            this.callbacks?.onError(error instanceof Error ? error.message : String(error));
        }
    }

    private mapTasks(remoteTasks: unknown[]): AgentTask[] {
        return remoteTasks.map(t => ({
            id: t.id, title: t.title, taskType: t.taskType as any, status: (t as any).status as any,
            skillKey: t.skillKey || undefined, createdAt: t.createdAt, updatedAt: t.updatedAt,
            tenantId: 'default', actorId: 'system', inputRefIds: [], policyDecisionId: 'none', requiresHumanReview: false
        }));
    }

    private deriveAgents(tasks: AgentTask[]): SwarmAgent[] {
        return [
            {
                id: 'agt-z0', name: 'Z0-Compliance', role: 'Regulatory Auditor',
                status: tasks.some(t => (t as any).status === 'approved_for_execution') ? 'processing' : 'active',
                persona: 'compliance', color: '#003262', t5_score: 98
            },
            {
                id: 'agt-h1', name: 'H1-Harmony', role: 'Social Impact Analyst',
                status: 'active', persona: 'harmony', color: '#10B981', t5_score: 94
            },
            {
                id: 'agt-v4', name: 'V4-Vault', role: 'Security & ZKP Guard',
                status: 'idle', persona: 'innovation', color: '#8B5CF6', t5_score: 99
            },
        ];
    }
}