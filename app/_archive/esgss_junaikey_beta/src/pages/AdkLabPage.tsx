import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Beaker } from 'lucide-react';
import { BentoLayout } from '../components/layout/BentoLayout';
import { AdkAssistantCard } from '../components/adk/AdkAssistantCard';
import { AdkSidebarCard } from '../components/adk/AdkSidebarCard';
import { SwarmDashboard } from '../components/adk/SwarmDashboard';
import { GuidanceOverlay } from '../components/education/GuidanceOverlay';

const ADK_SERVER_URL = 'http://localhost:4000';

interface ChatMessage {
    role: 'user' | 'agent';
    text: string;
    tools?: string[];
    workflowState?: any;
}

interface HistoryItem {
    session_id: string;
    query: string;
    created_at: string;
}

/**
 * ADK Lab Page - 深貫廣通版 (Bento V3)
 * 具備真實工作流追蹤能力的智能介面
 */
const AdkLabPage: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentWorkflow, setCurrentWorkflow] = useState<any>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [agentMode, setAgentMode] = useState<'Search' | 'Coordinator'>('Search');
    const [showGuidance, setShowGuidance] = useState(false);

    useEffect(() => {
        // Initial message when component mounts
        setMessages([
            { role: 'agent', text: '您好！我是 JunAiKey 的 ADK 研究助手。我可以進行深度的網頁搜索與 ESG 合規性分析。請問今天有什麼我可以幫您的？' }
        ]);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${ADK_SERVER_URL}/api/adk/history`);
            const data = await response.json();
            if (data.success) setHistory(data.data);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkLabPage] Failed to fetch history:', { error })
        }
    };

    const handleSend = async (text: string) => {
        const endpoint = agentMode === 'Search' ? '/api/adk/chat' : '/api/adk/coordinate';

        setMessages(prev => [...prev, { role: 'user', text }]);
        setLoading(true);

        try {
            const response = await fetch(`${ADK_SERVER_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text }),
            });

            if (!response.ok) throw new Error('伺服器連線失敗');

            const result = await response.json();

            if (agentMode === 'Search') {
                setMessages(prev => [...prev, {
                    role: 'agent',
                    text: result.data.text,
                    tools: result.data.sources ? result.data.sources.map((s: any) => s.title) : [],
                    workflowState: result.state
                }]);
                setCurrentWorkflow(result.state);
            } else {
                setMessages(prev => [...prev, {
                    role: 'agent',
                    text: result.response,
                    tools: result.collaborators,
                    workflowState: { steps: [{ name: '協調中', status: 'completed' }] }
                }]);
                setCurrentWorkflow(null); // Clear workflow for coordinator mode
            }
            fetchHistory(); // Refresh history
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[AdkLabPage] Error:', { error })
            setMessages(prev => [...prev, { role: 'agent', text: `抱歉，研究中斷：${error instanceof Error ? error.message : '未知錯誤'}。請確保 ADK 伺服器已啟動。` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header HUD */}
            <header className="h-20 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#81D8D0]/10 p-2 rounded-lg border border-[#81D8D0]/30">
                            <Beaker className="w-5 h-5 text-[#81D8D0]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-100 tracking-wider">ADK LAB</h1>
                            <div className="flex items-center space-x-2 text-[10px] text-[#81D8D0]/80 font-mono">
                                <span className="animate-pulse">● EXPERIMENTAL</span>
                                <span>|</span>
                                <span>BENTO V3</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#81D8D0]">
                        Mode: {agentMode}
                    </div>
                </div>
            </header>

            <BentoLayout>
                {/* Main Content Area - Switches based on Mode */}
                {agentMode === 'Search' ? (
                    <AdkAssistantCard
                        messages={messages}
                        loading={loading}
                        onSend={handleSend}
                        className="h-[calc(100vh-40px)]" // Occupy full height minus padding
                        onGuidanceClick={() => setShowGuidance(true)}
                    />
                ) : (
                    <SwarmDashboard className="h-[calc(100vh-40px)]" />
                )}

                {/* Sidebar Controls */}
                <AdkSidebarCard
                    agentMode={agentMode}
                    setAgentMode={setAgentMode}
                    currentWorkflow={currentWorkflow}
                    history={history}
                    loading={loading}
                    className="h-[calc(100vh-40px)]"
                />
            </BentoLayout>
            <GuidanceOverlay
                isOpen={showGuidance}
                onClose={() => setShowGuidance(false)}
                title="ADK 智能實驗室"
                description="Agent Development Kit (ADK) 是一個基於 5T 協議的 AI 代理開發環境。"
                learningPoints={[
                    "Search Mode: 使用 Google Gemini Flash 2.0 進行實時網頁搜索與摘要。",
                    "Coordinator Mode: 觸發 A2A (Agent-to-Agent) 協議，允許多個 AI 代理協同工作。",
                    "Resonance Score: 顯示系統整體的感知一致性與熵值狀態。"
                ]}
            />
        </div>
    );
};

export default AdkLabPage;
