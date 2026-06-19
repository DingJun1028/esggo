/**
 * 🤖 AI Analysis Assistant
 * 
 * 永續報告書 AI 智能分析助手
 * 
 * Features:
 * - Natural language queries about ESG data
 * - Sentiment analysis
 * - Gap detection
 * - Compliance checking
 * - Recommendations generation
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Send,
    Bot,
    User,
    FileText,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    TrendingUp,
    BarChart3,
    Search,
    RefreshCw,
    Copy,
    ThumbsUp,
    ThumbsDown,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

// ============================================
// Types & Interfaces
// ============================================

export interface AIInsight {
    id: string;
    type: 'opportunity' | 'risk' | 'recommendation' | 'finding';
    title: string;
    description: string;
    confidence: number;
    evidence: string[];
    relatedIndicators: string[];
    priority: 'critical' | 'high' | 'medium' | 'low';
    actionable: boolean;
    suggestedActions?: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    insights?: AIInsight[];
}

interface AIAnalysisAssistantProps {
    documentContent?: string;
    extractedData?: any;
    onInsightClick?: (insight: AIInsight) => void;
    onGenerateReport?: (section: string) => void;
}

// ============================================
// Pre-defined Analysis Prompts
// ============================================

const ANALYSIS_PROMPTS = {
    environmental: [
        '分析碳排放趨勢與減量成效',
        '評估能源使用效率',
        '檢查水資源管理政策',
        '分析廢棄物處理與回收'
    ],
    social: [
        '評估員工多元化程度',
        '分析職安事件統計',
        '檢視培訓投資效益',
        '評估社區參與影響'
    ],
    governance: [
        '分析公司治理結構',
        '檢查風險管理機制',
        '評估資訊透明度',
        '分析貪污防治措施'
    ],
    general: [
        '生成年度報告書摘要',
        '識別重大揭露缺口',
        '對比業界最佳實務',
        '提供改進建議'
    ]
};

// ============================================
// Main Component
// ============================================

export const AIAnalysisAssistant: React.FC<AIAnalysisAssistantProps> = ({
    documentContent,
    extractedData,
    onInsightClick,
    onGenerateReport
}) => {
    const core = useRef(useCallback(() => 
        ComponentCoreFactory.create('AIAnalysisAssistant'), []
    )()).current;

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `您好！我是永續報告書 AI 助手 🤖

我可以幫您：
• 分析 ESG 數據與趨勢
• 識別揭露缺口與風險
• 生成智能建議
• 撰寫報告書內容

請輸入您的問題或選擇分析項目。`,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState(ANALYSIS_PROMPTS.general);
    const [activeInsights, setActiveInsights] = useState<AIInsight[]>([]);

    // ========================================
    // AI Analysis Engine (Simulated)
    // ========================================

    const generateAIResponse = async (query: string): Promise<ChatMessage> => {
        setIsAnalyzing(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = generateMockAnalysis(query);
        const insights = generateMockInsights(query);

        setIsAnalyzing(false);

        return {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            insights
        };
    };

    const generateMockAnalysis = (query: string): { content: string } => {
        const analyses: Record<string, string> = {
            'carbon': `根據分析結果：

📊 **碳排放分析摘要**

**範疇一排放**
- 2024 年直接排放：12,500 tCO2e
- 較基準年減少：15%
- 減量幅度符合 SBTi 目標路徑

**範疇二排放**
- 2024 年排放：45,000 tCO2e
- 採用 location-based 方法計算
- 年減率：約 5.2%

**建議行動**
1. 加速再生能源購電協議 (PPA)
2. 提高能源效率投資
3. 探索碳移除技術`,
            'diversity': `**多元化與包容性分析**

✅ **亮點表現**
- 女性主管比例：38%，超越產業標竿
- 女性董事比例：33%，符合多元治理要求

📈 **趨勢觀察**
- 三年來女性管理階層成長 12%
- 基層女性同仁佔比維持穩定

🎯 **改進建議**
- 增加基層女性晉升輔導計畫
- 實施同工同酬審查机制`,
            'default': `根據您的問題，我已進行初步分析：

🔍 **分析結果**

您的報告書在以下面向表現優異：
• 碳排放揭露完整度達 92%
• 公司治理結構符合國際標準
• 員工滿意度領先同業

⚠️ **需要注意的缺口**
• 部分 GRI 指標揭露深度不足
• 供應鏈永續性評估待加強
• 氣候風險財務影響量化不足

💡 **建議優先處理**
1. 完成 TCFD 氣候情境分析
2. 加強供應商盡職調查
3. 建立碳排放即時監測系統`
        };

        const key = Object.keys(analyses).find(k => query.toLowerCase().includes(k));
        return { content: key ? analyses[key] : analyses.default };
    };

    const generateMockInsights = (query: string): AIInsight[] => {
        return [
            {
                id: `insight-${Date.now()}-1`,
                type: 'opportunity',
                title: '再生能源採購機會',
                description: '透過 PPA 協議可降低範疇二排放達 30%',
                confidence: 0.92,
                evidence: ['電力消耗佔總排放 65%', '目前再生能源比例僅 15%'],
                relatedIndicators: ['GRI 302', 'GRI 305'],
                priority: 'high',
                actionable: true,
                suggestedActions: ['評估 PPA 方案', '制定再生能源路徑圖']
            },
            {
                id: `insight-${Date.now()}-2`,
                type: 'risk',
                title: '碳費成本風險',
                description: '2025 年碳費開徵後，預估年度成本增加 NT$5,000 萬',
                confidence: 0.88,
                evidence: ['碳費費率草案', '排放量數據'],
                relatedIndicators: ['GRI 305'],
                priority: 'critical',
                actionable: true,
                suggestedActions: ['提前進行碳定價內部化', '建立碳成本預算']
            },
            {
                id: `insight-${Date.now()}-3`,
                type: 'recommendation',
                title: '擴大 SBTi 範疇',
                description: '建議將範疇三排放納入減量目標',
                confidence: 0.85,
                evidence: ['投資人要求日益增加', '同業已開始佈局'],
                relatedIndicators: ['GRI 305'],
                priority: 'medium',
                actionable: true,
                suggestedActions: ['進行範疇三排放盤查', '制定供應商減排計畫']
            }
        ];
    };

    // ========================================
    // Handlers
    // ========================================

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        const response = await generateAIResponse(userMessage.content);
        setMessages(prev => [...prev, response]);

        if (response.insights) {
            setActiveInsights(prev => [...response.insights!, ...prev]);
        }
    };

    const handleQuestionClick = (question: string) => {
        setInputValue(question);
    };

    const handleInsightAction = (insight: AIInsight) => {
        onInsightClick?.(insight);
    };

    // ========================================
    // Render Functions
    // ========================================

    const renderMessage = (message: ChatMessage) => (
        <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                flex gap-3 mb-4
                ${message.role === 'user' ? 'flex-row-reverse' : ''}
            `}
        >
            {/* Avatar */}
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.role === 'assistant' 
                    ? 'bg-[#63a6b0]/20' 
                    : 'bg-white/10'
                }
            `}>
                {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 text-[#63a6b0]" />
                ) : (
                    <User className="w-5 h-5 text-slate-400" />
                )}
            </div>

            {/* Content */}
            <div className={`
                max-w-[75%] rounded-2xl px-4 py-3
                ${message.role === 'assistant'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-[#63a6b0]/20 border border-[#63a6b0]/30'
                }
            `}>
                <div className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                    {message.content}
                </div>

                {/* Insights Attachment */}
                {message.insights && message.insights.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold text-[#63a6b0] uppercase tracking-wider">
                            AI 分析洞察
                        </p>
                        {message.insights.map((insight) => (
                            <motion.div
                                key={insight.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                onClick={() => handleInsightAction(insight)}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                                    {insight.type === 'risk' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                                    {insight.type === 'recommendation' && <Lightbulb className="w-4 h-4 text-[#63a6b0]" />}
                                    <span className={`
                                        text-xs font-bold uppercase
                                        ${insight.priority === 'critical' ? 'text-red-400' : 
                                          insight.priority === 'high' ? 'text-amber-400' : 
                                          insight.priority === 'medium' ? 'text-[#63a6b0]' : 'text-slate-400'}
                                    `}>
                                        {insight.priority}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-white">{insight.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );

    // ========================================
    // Render
    // ========================================

    return (
        <div
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="AIAnalysisAssistant"
            className="flex flex-col h-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#63a6b0]/20 rounded-xl">
                        <Sparkles className="w-5 h-5 text-[#63a6b0]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">AI 分析助手</h3>
                        <p className="text-[10px] text-slate-400">JunAiKey Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="刷新">
                        <RefreshCw className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="複製對話">
                        <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Quick Analysis Categories */}
            <div className="px-4 py-3 border-b border-white/10">
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">快速分析</p>
                <div className="flex flex-wrap gap-2">
                    {['碳排放', '多元化', '治理', '風險'].map((category) => (
                        <button
                            key={category}
                            onClick={() => handleQuestionClick(`分析${category}相關數據`)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 hover:bg-[#63a6b0]/20 hover:border-[#63a6b0]/50 transition-colors"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <AnimatePresence>
                    {messages.map(renderMessage)}
                </AnimatePresence>

                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#63a6b0]/20 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-[#63a6b0] animate-spin" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">AI 正在分析</span>
                                <span className="flex gap-1">
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-1.5 h-1.5 bg-[#63a6b0] rounded-full"
                                    />
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                                        className="w-1.5 h-1.5 bg-[#63a6b0] rounded-full"
                                    />
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
                                        className="w-1.5 h-1.5 bg-[#63a6b0] rounded-full"
                                    />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Suggested Questions */}
            <AnimatePresence>
                {messages.length <= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="px-4 py-3 border-t border-white/10"
                    >
                        <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">您可以問我</p>
                        <div className="space-y-2">
                            {suggestedQuestions.map((question, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleQuestionClick(question)}
                                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 transition-colors"
                                >
                                    {question}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="輸入您的問題..."
                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#63a6b0]/50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isAnalyzing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#63a6b0] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4d9e9f] transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                    AI 分析僅供參考，請以官方揭露為準
                </p>
            </div>
        </div>
    );
};

export default AIAnalysisAssistant;
