// ESG AI助手組件 - 整合JunAiKey智庫能力
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import {
    MessageCircle, Send, Bot, User, X, Sparkles,
    Lightbulb, AlertTriangle, TrendingUp, Target,
    RefreshCw, Minimize2, Maximize2
} from 'lucide-react';
import { esgAiService, ESGChatMessage } from '../services/esgAiService';

interface ESGAiAssistantProps {
    language: Language;
    companyData?: any;
    esgData?: any;
    isOpen: boolean;
    onClose: () => void;
}

export const ESGAiAssistant: React.FC<ESGAiAssistantProps> = ({
    language,
    companyData,
    esgData,
    isOpen,
    onClose
}) => {
    const [messages, setMessages] = useState<ESGChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isZh = language === 'zh-TW';

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChat = async () => {
        const welcomeMessage: ESGChatMessage = {
            id: 'welcome',
            role: 'assistant',
            content: isZh
                ? `您好！我是ESG智慧助手JunAiKey。我可以幫助您：

• 📊 分析ESG數據表現
• 💡 提供永續發展建議
• 🔍 識別風險和機會
• 📈 生成ESG策略建議
• 🤖 回答ESG相關問題

請告訴我您需要什麼幫助？`
                : `Hello! I'm the ESG AI Assistant JunAiKey. I can help you with:

• 📊 ESG data analysis
• 💡 Sustainability recommendations
• 🔍 Risk and opportunity identification
• 📈 ESG strategy suggestions
• 🤖 Answer ESG-related questions

What can I help you with?`,
            timestamp: Date.now()
        };

        setMessages([welcomeMessage]);
        await esgAiService.initializeESGKnowledge();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!currentMessage.trim() || isLoading) return;

        const userMessage: ESGChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: currentMessage.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            // 增強用戶問題，加入ESG上下文
            const enhancedMessage = await enhanceMessageWithContext(currentMessage, esgData);

            const response = await esgAiService.chatWithESGAi(enhancedMessage);

            const assistantMessage: ESGChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI對話失敗:', error);
            const errorMessage: ESGChatMessage = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: isZh
                    ? '抱歉，我現在無法處理您的請求。請稍後再試。'
                    : 'Sorry, I cannot process your request right now. Please try again later.',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const enhanceMessageWithContext = async (message: string, esgData?: any): Promise<string> => {
        if (!esgData) return message;

        const contextPrompt = isZh
            ? `基於以下ESG數據上下文回答用戶問題：\n\n${JSON.stringify(esgData, null, 2)}\n\n用戶問題：${message}`
            : `Answer the user's question based on the following ESG data context:\n\n${JSON.stringify(esgData, null, 2)}\n\nUser question: ${message}`;

        return contextPrompt;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        initializeChat();
    };

    const getQuickSuggestions = () => {
        if (isZh) {
            return [
                '分析我的碳排放表現',
                '提供社會影響改進建議',
                '評估治理風險',
                '生成ESG報告建議'
            ];
        } else {
            return [
                'Analyze my carbon emissions',
                'Provide social impact recommendations',
                'Assess governance risks',
                'Generate ESG report suggestions'
            ];
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
        }`}>
            {/* 聊天窗口 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">

                {/* 標題欄 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                ESG AI助手
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                JunAiKey 萬能智庫
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* 消息區域 */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg h-fit">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] p-3 rounded-lg ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    }`}>
                                        <div className="whitespace-pre-wrap text-sm">
                                            {message.content}
                                        </div>
                                        <div className={`text-xs mt-2 ${
                                            message.role === 'user'
                                                ? 'text-blue-100'
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="p-2 bg-blue-500 rounded-lg h-fit">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '思考中...' : 'Thinking...'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* 快速建議 */}
                        {messages.length === 1 && !isLoading && (
                            <div className="px-4 pb-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    {isZh ? '快速開始：' : 'Quick start:'}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getQuickSuggestions().map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentMessage(suggestion)}
                                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 輸入區域 */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={isZh ? '輸入您的ESG問題...' : 'Ask your ESG question...'}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!currentMessage.trim() || isLoading}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={clearChat}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                                    title={isZh ? '清除對話' : 'Clear chat'}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};