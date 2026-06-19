"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { julesClient } from '@/lib/jules-client';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IComponentCore } from '@/core/gov/IComponentCore';

// ═══════════════════════════════════════════════════════════════════════════
// ESG 服務場景定義
// ═══════════════════════════════════════════════════════════════════════════

type ESGService = {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    description: string;
    prompt: string;
    color: 'aqua' | 'indigo' | 'emerald' | 'amber' | 'rose';
};

const ESG_SERVICES: ESGService[] = [
    {
        id: 'carbon-inventory',
        name: '碳盤查',
        nameEn: 'Carbon Inventory',
        icon: '🌡️',
        description: '溫室氣體排放量化與盤查輔導',
        prompt: '你是一位專業的碳盤查顧問，專精於 ISO 14064 和 GHG Protocol 標準。請協助進行碳排放計算、範疇分類與盤查流程指導。',
        color: 'emerald'
    },
    {
        id: 'esg-report',
        name: 'ESG 報告',
        nameEn: 'ESG Report',
        icon: '📊',
        description: '永續報告編製與 GRI 標準對應',
        prompt: '你是一位資深的 ESG 報告專家，專精於 GRI  Standards、SASB 和 TCFD 框架。請協助編製符合國際標準的永續報告。',
        color: 'indigo'
    },
    {
        id: 'risk-assessment',
        name: '風險評估',
        nameEn: 'Risk Assessment',
        icon: '⚖️',
        description: '氣候變遷與永續風險分析',
        prompt: '你是一位企業永續風險分析師，專精於氣候相關財務揭露 (TCFD) 和企業風險管理 (ERM)。請進行全面的永續風險評估。',
        color: 'rose'
    },
    {
        id: 'green-finance',
        name: '綠色金融',
        nameEn: 'Green Finance',
        icon: '💚',
        description: '永續連結貸款與綠色債券諮詢',
        prompt: '你是一位綠色金融顧問，專精於永續連結融資、綠色債券和 ESG 投資評估。請提供最新的綠色金融趨勢與申請指導。',
        color: 'aqua'
    },
    {
        id: 'supply-chain',
        name: '供應鏈管理',
        nameEn: 'Supply Chain',
        icon: '🔗',
        description: '永續供應鏈與範疇三排放',
        prompt: '你是一位供應鏈永續管理專家，專精於範疇三排放計算、供應商 ESG 評估和綠色採購。請協助優化供應鏈永續性。',
        color: 'amber'
    },
    {
        id: 'impact-metrics',
        name: '影響力指標',
        nameEn: 'Impact Metrics',
        icon: '🎯',
        description: '社會影響力衡量與 SROI',
        prompt: '你是一位影響力衡量專家，專精於社會投資報酬率 (SROI)、SDGs 對應和影響力評估框架。請協助量化社會影響力。',
        color: 'indigo'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// 對話消息類型
// ═══════════════════════════════════════════════════════════════════════════

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isStreaming?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// API Key 設置模態框
// ═══════════════════════════════════════════════════════════════════════════

function ApiKeyModal({
    isOpen,
    onClose,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (key: string) => void;
}) {
    const [apiKey, setApiKey] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900/90 border border-omni-glass-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">🔑 設置 Google Jules API Key</h3>
                <p className="text-omni-text-muted text-sm mb-4">
                    請輸入您的 Google Jules API Key 以啟用 AI 代理服務。
                    <a href="https://jules.google.com" target="_blank" rel="noopener noreferrer" className="text-omni-primary hover:underline ml-1">
                        申請 API Key →
                    </a>
                </p>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="輸入 API Key..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-omni-primary mb-4"
                />
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-omni-surface-2 hover:bg-slate-700 text-white rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={() => onSubmit(apiKey)}
                        className="flex-1 px-4 py-2 bg-omni-primary hover:bg-omni-primary/80 text-white rounded-lg transition-colors"
                    >
                        確認
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// 服務選擇卡片
// ═══════════════════════════════════════════════════════════════════════════

function ServiceCard({
    service,
    isSelected,
    onSelect
}: {
    service: ESGService;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={`
                relative p-4 rounded-xl text-left transition-all duration-300
                ${isSelected
                    ? 'bg-omni-primary/20 border-omni-primary scale-105'
                    : 'bg-slate-800/40 border-transparent hover:bg-slate-800/60 hover:border-slate-600'
                }
                border
            `}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-omni-text-main'}`}>
                        {service.name}
                    </h4>
                    <p className="text-xs text-omni-text-muted mt-1 line-clamp-2">
                        {service.description}
                    </p>
                </div>
            </div>
            {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-omni-primary animate-pulse" />
            )}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// 聊天訊息氣泡
// ═══════════════════════════════════════════════════════════════════════════

function ChatBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`
                    max-w-[80%] px-4 py-3 rounded-2xl
                    ${isUser
                        ? 'bg-omni-primary/20 border border-omni-primary/30 rounded-br-md'
                        : 'bg-slate-800/60 border border-slate-700/50 rounded-bl-md'
                    }
                `}
            >
                <div className="flex items-start gap-2">
                    {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-omni-primary to-blue-500 flex items-center justify-center flex-shrink-0 text-xs">
                            🤖
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-sm text-omni-text-main whitespace-pre-wrap leading-relaxed">
                            {message.content}
                            {message.isStreaming && (
                                <span className="inline-block w-2 h-4 ml-1 bg-omni-primary/60 animate-pulse" />
                            )}
                        </p>
                        <span className="text-[10px] text-omni-text-muted mt-2 block">
                            {new Date(message.timestamp).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    {isUser && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-xs">
                            👤
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// 流式回應模擬組件 (由於 Jules API 目前為非流式，這裡模擬流式效果)
// ═══════════════════════════════════════════════════════════════════════════

function useStreamingResponse(
    message: string,
    service: ESGService | null,
    isActive: boolean
) {
    const [response, setResponse] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isActive || !message || !service) {
            setResponse('');
            setIsComplete(false);
            return;
        }

        // 模擬流式回應
        const fullResponse = generateResponse(message, service);
        let currentIndex = 0;
        setIsComplete(false);

        const interval = setInterval(() => {
            if (currentIndex < fullResponse.length) {
                setResponse(fullResponse.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [message, service, isActive]);

    return { response, isComplete };
}

// 生成模擬回應
function generateResponse(message: string, service: ESGService): string {
    const responses: Record<string, string[]> = {
        'carbon-inventory': [
            `🌡️ **碳盤查輔導** - 感谢您的咨询！

根據您的需求，我建議按照以下步驟進行碳盤查：

**第一步：確定組織邊界**
- 識別營運控制權或財務控制權範圍
- 繪製組織邊界示意圖

**第二步：識別排放源**
- 範疇一：直接排放（自有鍋爐、車輛等）
- 範疇二：間接排放（外購電力、蒸汽）
- 範疇三：其他間接排放（供應鏈、員工通勤）

**第三步：量化排放量**
- 活動數據收集 × 排放係數 = 排放量
- 建議使用官方排放係數庫

**後續服務**
如需更詳細的 ISO 14064 輔導或碳中和路徑規劃，請告訴我具體需求！`,

            `📋 根據您提供的問題，這是碳盤查關鍵要點：

1. **排放源識別**：請先繪製完整的溫室氣體排放來源魚骨圖
2. **數據品質管理**：確保活動數據的準確性和可追溯性
3. **不确定性分析**：計算排放量的不確定度

需要我提供具體的計算模板或排放係數表嗎？`
        ],
        'esg-report': [
            `📊 **ESG 報告編製輔導** - 歡迎諮詢永續報告！

我建議按照以下框架編製報告：

**GRI Standards 核心原則**
- 遵循「報導原則」確保報告品質
- 採用「重大性分析」識別關鍵議題

**建議章節結構**
1. 永續發展愿景與策略
2. 環境保護 (E) - 碳排放、能源管理、水資源
3. 社會責任 (S) - 員工照顧、供應商關係、社區參與
4. 公司治理 (G) - 董事会结构、風險管理、資訊透明度

**TCFD 對應**
- 治理：氣候風險監督機制
- 策略：氣候情境分析
- 風險管理：氣候風險辨識流程
- 指標與目標：碳排放強度目標

如需特定產業的報告範本，請告訴我您的產業別！`,

            `📑 關於 ESG 報告編製，重點提醒：

• **重大性評估**：採用雙重重大性原則，識別對企業和利害關係人最重要的 ESG 議題
• **可比性**：確保數據可與產業基準比較，建議提供三年趨勢數據
• **可靠性**：引入第三方查證增強公信力

您目前最需要協助的是哪個部分？`
        ],
        'risk-assessment': [
            `⚖️ **永續風險評估** - 專業風險分析服務

根據 TCFD 框架，風險評估涵蓋：

**轉型風險**
- 政策與法規：碳稅、環保法規趨嚴
- 市場：低碳產品需求增加
- 技術：清潔技術替代
- 聲譽：利害關係人期望

**實體風險**
- 急性：極端氣候事件（洪水、颶風）
- 慢性：海平面上升、平均溫度升高

**評估方法**
1. 風險識別與篩選
2. 風險分析（可能性 × 影響程度）
3. 風險優先排序
4. 擬定因應對策

**下一步**
請告訴我您的產業和主要擔憂，我們可以進行更詳細的風險矩陣分析！`,

            `🎯 企業永續風險評估關鍵要點：

• 建立氣候風險登錄系統
• 進行供應商氣候韌性評估
• 設定科學基礎減碳目標 (SBTi)
• 購買氣候保險轉移風險

需要我提供風險評估模板或情景分析工具嗎？`
        ],
        'green-finance': [
            `💚 **綠色金融顧問服務**

最新綠色金融商品與趨勢：

**永續連結貸款 (SLL)**
- 與 ESG 指標掛鉤的優惠利率
- 關鍵指標：溫室氣體排放削減、女性主管比例等

**綠色債券**
- 資金用途於綠色項目（再生能源、能源效率）
- 需通過外部審查認證

**ESG 基金與投資**
- 機構投資人 ESG 盡職調查要點
- 碳中和投資組合建構

**申請建議**
1. 先行完成 ESG 評級
2. 準備永續發展相關數據
3. 與金融機構預先溝通

您的企業有融資需求嗎？我可以提供更詳細的輔導！`,

            `💰 綠色金融申請重點：

• 建立完整的 ESG 數據收集系統
• 取得第三方 ESG 評級（如 MSCI、Sustainalytics）
• 制定明確的永續發展里程碑
• 準備 Green Bond Principles 合規文件

需要我提供具體的申請文件模板嗎？`
        ],
        'supply-chain': [
            `🔗 **永續供應鏈管理**

範疇三排放管理關鍵步驟：

**供應商評估**
- 建立供應商 ESG 評分卡
- 進行供應商碳足跡初查
- 識別高風險供應商

**數據收集**
- 發送溫室氣體排放問卷
- 使用供應商數據共享平台
- 採用行业平均排放係數

**改進輔導**
- 協助供應商設定減碳目標
- 提供節能減碳技術建議
- 推動綠色採購

**產業案例**
電子產業：優先輔導前20大供應商
製造產業：聚焦範疇一、二排放密集供應商

請告訴我您的產業類型，我可以提供更具體的供應鏈優化建議！`,

            `📦 供應鏈永續管理要點：

• 建立供應商行為準則 (Supplier Code of Conduct)
• 實施供應商稽核計畫
• 推動包裝減量與物流優化
• 發展循環經濟合作模式

需要我提供供應商評估模板或碳排放計算工具嗎？`
        ],
        'impact-metrics': [
            `🎯 **影響力衡量與 SROI 分析**

社會投資報酬率 (SROI) 分析框架：

**SROI 六大原則**
1. 利害關係人參與
2. 變革理論 (Theory of Change)
3. 價值化衝擊
4. 僅計入可驗證改變
5. 不過度聲稱
6. 透明呈現

**影響力評估步驟**
1. 識別利害關係人（員工、社區、客戶）
2. 繪製影響力路徑圖
3. 定義輸出 (Output) 與成效 (Outcome)
4. 貨幣化價值計算
5. 計算 SROI 倍數

**SDGs 對應**
協助您將企業活動對應至 SDGs 目標與指標

**實務建議**
從小規模試點專案開始，建立影響力衡量文化！

如需進行專案影響力評估，請提供更多專案細節！`,

            `📈 影響力衡量關鍵指標：

• 社會效益貨幣化計算
• 每百萬投資創造的社會價值
• 利害關係人滿意度變化
• 碳排放減少量 (噸 CO2e)
• 弱勢族群受惠人數

需要我提供 SROI 計算模板或 SDGs 對應工具嗎？`
        ]
    };

    const serviceResponses = responses[service.id] || responses['carbon-inventory'];
    return serviceResponses[Math.floor(Math.random() * serviceResponses.length)];
}

// ═══════════════════════════════════════════════════════════════════════════
// 主頁面組件
// ═══════════════════════════════════════════════════════════════════════════

export default function OmniJulesPage() {
    const [selectedService, setSelectedService] = useState<ESGService | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `✨ **歡迎來到 OmniJule 智能代理中心**

我是您的 ESG AI 代理助手，內建於 OMNI 系統的核心決策引擎。

**請先選擇您需要的服務類型：**

🌡️ 碳盤查 - 溫室氣體排放量化
📊 ESG 報告 - 永續報告編製
⚖️ 風險評估 - 永續風險分析
💚 綠色金融 - 永續融資顧問
🔗 供應鏈 - 永續供應鏈管理
🎯 影響力 - 社會影響力衡量

選擇服務後，我可以提供專業的諮詢輔導！`,
            timestamp: Date.now()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // 滾動到最新訊息
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // 檢查 API Key
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedKey = localStorage.getItem('JULES_API_KEY');
            if (!storedKey) {
                setShowApiKeyModal(true);
            } else {
                setApiKey(storedKey);
            }
        }
    }, []);

    // 流式回應處理
    const { response: streamingResponse, isComplete } = useStreamingResponse(
        inputMessage,
        selectedService,
        isProcessing
    );

    // 處理發送訊息
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedService || isProcessing) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: inputMessage.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsProcessing(true);

        // 創建助手訊息佔位
        const assistantMessageId = `assistant-${Date.now()}`;
        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            isStreaming: true
        };
        setMessages(prev => [...prev, assistantMessage]);

        // 等待流式回應完成
        await new Promise<void>((resolve) => {
            const checkComplete = setInterval(() => {
                if (isComplete) {
                    clearInterval(checkComplete);
                    resolve();
                }
            }, 100);
        });

        // 更新最終訊息
        setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
                ? { ...msg, content: streamingResponse, isStreaming: false }
                : msg
        ));

        setIsProcessing(false);
    };

    // 處理 API Key 提交
    const handleApiKeySubmit = (key: string) => {
        if (key.trim()) {
            julesClient.setApiKey(key.trim());
            setApiKey(key.trim());
            setShowApiKeyModal(false);
        }
    };

    // 處理快速提示
    const handleQuickPrompt = (prompt: string) => {
        setInputMessage(prompt);
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-omni-bg relative overflow-hidden">
            {/* 背景效果 */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-omni-primary/10 blur-[150px] animate-float opacity-70" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 flex h-screen">
                {/* 左側：服務選擇面板 */}
                <aside className="w-80 flex-shrink-0 border-r border-omni-glass-border bg-slate-900/30 backdrop-blur-sm">
                    <div className="p-4 border-b border-omni-glass-border">
                        <h2 className="text-lg font-bold text-omni-text-main flex items-center gap-2">
                            🎯 <span className="text-omni-primary">Omni</span>Jule
                        </h2>
                        <p className="text-xs text-omni-text-muted mt-1">ESG AI 代理服務中心</p>
                    </div>
                    <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                        <p className="text-xs text-omni-text-muted px-2 mb-3">
                            選擇服務類型開始對話
                        </p>
                        {ESG_SERVICES.map(service => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                isSelected={selectedService?.id === service.id}
                                onSelect={() => {
                                    setSelectedService(service);
                                    // 添加系統提示
                                    const systemMessage: ChatMessage = {
                                        id: `system-${Date.now()}`,
                                        role: 'assistant',
                                        content: `✅ 已切換至 **${service.name}** 服務\n\n${service.prompt}\n\n請告訴我您的需求，我將為您提供專業輔導！`,
                                        timestamp: Date.now()
                                    };
                                    setMessages(prev => [...prev, systemMessage]);
                                }}
                            />
                        ))}
                    </div>
                </aside>

                {/* 右側：對話區域 */}
                <main className="flex-1 flex flex-col">
                    {/* 標題欄 */}
                    <header className="px-6 py-4 border-b border-omni-glass-border bg-slate-900/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-omni-text-main">
                                    {selectedService ? (
                                        <span className="flex items-center gap-2">
                                            <span>{selectedService.icon}</span>
                                            {selectedService.name}
                                        </span>
                                    ) : (
                                        '🤖 選擇服務開始對話'
                                    )}
                                </h1>
                                <p className="text-sm text-omni-text-muted">
                                    {selectedService ? selectedService.description : '請從左側選擇一項 ESG 服務'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowApiKeyModal(true)}
                                    className="px-3 py-1.5 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-omni-text-muted rounded-lg transition-colors"
                                >
                                    ⚙️ API 設置
                                </button>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs text-emerald-400">Online</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* 訊息區域 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <LiquidGlassContainer
                            coreContext={{
                                uuid: 'jules-chat-container',
                                version: '1.2.0',
                                timestamp: Date.now(),
                                evidence: []
                            }}
                            glowColor={selectedService?.color || 'aqua'}
                            intensity="low"
                            className="h-full p-4"
                        >
                            <div className="space-y-0">
                                {messages.map(message => (
                                    <ChatBubble key={message.id} message={message} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </LiquidGlassContainer>
                    </div>

                    {/* 快速提示 */}
                    {selectedService && (
                        <div className="px-6 py-2 border-t border-omni-glass-border bg-slate-900/20">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => handleQuickPrompt('請提供服務介紹')}
                                    className="px-3 py-1 text-xs bg-slate-800/50 hover:bg-omni-primary/20 text-omni-text-muted hover:text-white rounded-full transition-colors whitespace-nowrap"
                                >
                                    📖 服務介紹
                                </button>
                                <button
                                    onClick={() => handleQuickPrompt('請提供初步評估')}
                                    className="px-3 py-1 text-xs bg-slate-800/50 hover:bg-omni-primary/20 text-omni-text-muted hover:text-white rounded-full transition-colors whitespace-nowrap"
                                >
                                    📋 初步評估
                                </button>
                                <button
                                    onClick={() => handleQuickPrompt('請提供案例參考')}
                                    className="px-3 py-1 text-xs bg-slate-800/50 hover:bg-omni-primary/20 text-omni-text-muted hover:text-white rounded-full transition-colors whitespace-nowrap"
                                >
                                    💡 案例參考
                                </button>
                                <button
                                    onClick={() => handleQuickPrompt('請提供的下一步建議')}
                                    className="px-3 py-1 text-xs bg-slate-800/50 hover:bg-omni-primary/20 text-omni-text-muted hover:text-white rounded-full transition-colors whitespace-nowrap"
                                >
                                    ➡️ 下一步建議
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 輸入區域 */}
                    <div className="p-4 border-t border-omni-glass-border bg-slate-900/30 backdrop-blur-sm">
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder={
                                        selectedService
                                            ? `向 ${selectedService.name} 提問...`
                                            : '請先選擇服務類型'
                                    }
                                    disabled={!selectedService || isProcessing}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-omni-primary resize-none disabled:opacity-50"
                                    rows={2}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!selectedService || !inputMessage.trim() || isProcessing}
                                className="px-6 py-3 bg-omni-primary hover:bg-omni-primary/80 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        處理中...
                                    </>
                                ) : (
                                    <>
                                        ✨ 發送
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-omni-text-muted mt-2 text-center">
                            按 Enter 發送訊息 • Shift + Enter 換行 • 支援流式回應
                        </p>
                    </div>
                </main>
            </div>

            {/* API Key 設置模態框 */}
            <ApiKeyModal
                isOpen={showApiKeyModal}
                onClose={() => apiKey && setShowApiKeyModal(false)}
                onSubmit={handleApiKeySubmit}
            />
        </div>
    );
}