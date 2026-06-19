export interface SwarmTask {
    id: string;
    goal: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    subtasks: Subtask[];
    result?: SwarmResult;
    createdAt: number;
    updatedAt: number;
}

export interface Subtask {
    id: string;
    description: string;
    assignedAgentId?: string; // ID of the agent (e.g., 'writer-agent', 'auditor-agent')
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    dependencies: string[]; // IDs of other subtasks that must be completed first
    result?: string;
    retryCount: number;
}

export interface SwarmResult {
    summary: string;
    artifacts: string[]; // Paths or IDs of generated content
    metrics: {
        totalDuration: number;
        qualityScore: number;
    }
}

export interface AgentCapability {
    id: string;
    name: string;
    description: string;
    keywords: string[]; // e.g., ["write", "report", "text"]
}
