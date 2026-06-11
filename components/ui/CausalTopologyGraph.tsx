import React, { useState, useEffect } from 'react';

export type TopologyPhase = 'cause' | 'process' | 'heal' | 'effect';
export type NodeStatus = 'idle' | 'processing' | 'success' | 'failed' | 'healing';

export interface CausalNode {
    id: string;
    phase: TopologyPhase;
    title: string;
    subtitle: string;
    status: NodeStatus;
}

interface CausalTopologyGraphProps {
    taskId?: string;
    executionId?: string;
    agentStatus?: NodeStatus;
    zkpStatus?: NodeStatus;
    vaultStatus?: NodeStatus;
    healingStatus?: NodeStatus;
}

/**
 * 🎨 轉寫章節三：因果律拓樸圖 (Causal Topology Graph)
 * 液態現實 UI (Liquid Reality UI) 的核心組件。
 * 將 Agent 協作、ZKP 校驗與 5T 封印可視化為「因、循、果」的物理流動。
 */
export const CausalTopologyGraph: React.FC<CausalTopologyGraphProps> = ({
    taskId = 'task_omni_01',
    executionId,
    agentStatus,
    zkpStatus,
    vaultStatus,
    healingStatus
}) => {
    const [nodes, setNodes] = useState<CausalNode[]>([
        { id: 'n1', phase: 'cause', title: 'OmniAgent 蜂群', subtitle: '意圖共鳴與草稿生成', status: 'idle' },
        { id: 'n2', phase: 'process', title: 'ZK-Privacy Engine', subtitle: 'Pedersen 同態加法校驗', status: 'idle' },
        { id: 'n3', phase: 'effect', title: 'Evidence Vault', subtitle: '5T Hash Lock 永恆封印', status: 'idle' },
    ]);

    // 模擬因果律流動的狀態機 (神經形態反饋)
    useEffect(() => {
        // 若外部有傳入真實狀態，則與 orchestrator.ts 的執行狀態強綁定
        if (agentStatus || zkpStatus || vaultStatus || healingStatus) {
            const newNodes: CausalNode[] = [
                { id: 'n1', phase: 'cause', title: 'OmniAgent 蜂群', subtitle: '意圖共鳴與草稿生成', status: agentStatus || 'idle' },
                { id: 'n2', phase: 'process', title: 'ZK-Privacy Engine', subtitle: 'Pedersen 同態加法校驗', status: zkpStatus || 'idle' },
            ];
            if (healingStatus && healingStatus !== 'idle') {
                newNodes.push({ id: 'nh', phase: 'heal', title: 'Healing Guardian', subtitle: '自動修補與數據重取', status: healingStatus });
            }
            newNodes.push({ id: 'n3', phase: 'effect', title: 'Evidence Vault', subtitle: '5T Hash Lock 永恆封印', status: vaultStatus || 'idle' });

            setNodes(newNodes);
            return;
        }

        // 否則執行展示用的模擬序列
        const sequence = async () => {
            // 因 (Cause) - Agent 開始處理
            setNodes(prev => prev.map(n => n.id === 'n1' ? { ...n, status: 'processing' } : n));
            await new Promise(r => setTimeout(r, 1500));
            setNodes(prev => prev.map(n => n.id === 'n1' ? { ...n, status: 'success' } : n));

            // 循 (Process) - ZKP 零知識驗算
            setNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'processing' } : n));
            await new Promise(r => setTimeout(r, 1500));

            // 模擬 30% 機率 ZKP 失敗，動態展示 HealingGuardian 的紅轉藍動畫
            const isSimulatedFailure = Math.random() < 0.3;
            if (isSimulatedFailure) {
                setNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'failed' } : n));
                await new Promise(r => setTimeout(r, 600)); // 停頓展示紅色錯誤

                // 動態插入 Healing 節點 (初始為紅色 failed，以便觸發過渡動畫)
                setNodes(prev => {
                    const cause = prev.find(n => n.id === 'n1')!;
                    const process = prev.find(n => n.id === 'n2')!;
                    const effect = prev.find(n => n.id === 'n3')!;
                    return [cause, process, { id: 'nh', phase: 'heal', title: 'Healing Guardian', subtitle: '數據斷層修補中...', status: 'failed' }, effect];
                });
                await new Promise(r => setTimeout(r, 100)); // 讓 DOM 渲染初始態

                // 觸發紅轉藍動畫 (failed -> healing)
                setNodes(prev => prev.map(n => n.id === 'nh' ? { ...n, status: 'healing' } : n));
                await new Promise(r => setTimeout(r, 2500)); // 修補中

                // 修復成功，所有節點轉綠
                setNodes(prev => prev.map(n => n.id === 'nh' ? { ...n, status: 'success' } : n));
                setNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'success' } : n));
            } else {
                setNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'success' } : n));
            }

            // 果 (Effect) - 5T 封印刻印
            setNodes(prev => prev.map(n => n.id === 'n3' ? { ...n, status: 'processing' } : n));
            await new Promise(r => setTimeout(r, 1000));
            setNodes(prev => prev.map(n => n.id === 'n3' ? { ...n, status: 'success' } : n));
        };

        sequence();
    }, [taskId, executionId, agentStatus, zkpStatus, vaultStatus, healingStatus]);

    const getStatusColor = (status: NodeStatus) => {
        switch (status) {
            case 'processing': return 'border-blue-400 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse scale-[1.02] ring-1 ring-blue-400/50';
            case 'healing': return 'border-indigo-400 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse scale-[1.02] ring-1 ring-indigo-400/50';
            case 'success': return 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.05] ring-2 ring-emerald-400/50';
            case 'failed': return 'border-rose-400 bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-[0.98] ring-2 ring-rose-500/50';
            default: return 'border-gray-500/50 bg-white/5 opacity-80';
        }
    };

    return (
        <div className="relative w-full p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* 神經形態背景光暈 */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)] animate-spin-slow pointer-events-none" />

            <h3 className="text-xl font-bold text-white mb-8 relative z-10 tracking-wider">
                🌌 因果律動態鏈路 (Causal Link) <span className="text-xs font-mono text-cyan-400 bg-cyan-900/40 px-2 py-1 rounded ml-2">Task: {taskId}</span>
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.id}>
                        {/* 節點卡片 (液態玻璃擬態) */}
                        <div className={`flex flex-col items-center justify-center p-6 w-64 rounded-xl border backdrop-blur-md transition-all duration-700 ease-out ${getStatusColor(node.status)}`}>
                            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                {node.phase === 'cause' ? '因 (Cause)' : node.phase === 'process' ? '循 (Process)' : node.phase === 'heal' ? '修 (Heal)' : '果 (Effect)'}
                            </span>
                            <h4 className="text-lg font-bold text-gray-100 text-center">{node.title}</h4>
                            <p className="text-sm text-gray-400 text-center mt-2">{node.subtitle}</p>
                        </div>

                        {/* 流動連線邊緣 (Edges) */}
                        {index < nodes.length - 1 && (
                            <div className="flex-1 w-full md:w-auto h-8 md:h-1 flex items-center justify-center">
                                <div className="relative h-full w-1 md:w-full md:h-1 rounded-full bg-gray-700/50 overflow-hidden">
                                    <div className={`absolute inset-0 transition-opacity duration-1000 ${nodes[index].status === 'success' ? 'opacity-100 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'opacity-0'}`} />
                                    <div className={`absolute inset-0 transition-opacity duration-1000 ${nodes[index].status === 'processing' ? 'opacity-100 bg-gradient-to-r from-blue-500/20 to-blue-400/80 animate-pulse' : 'opacity-0'}`} />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CausalTopologyGraph;