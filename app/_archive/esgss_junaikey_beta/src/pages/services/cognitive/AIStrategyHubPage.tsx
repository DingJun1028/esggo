import React, { useState } from 'react';
import { StitchConversationTemplate } from '@/components/layout/StitchConversationTemplate';
import { BrainCircuit, Send, FileText, Target, Zap } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { useLanguage } from '@/contexts/LanguageContext';

const AIStrategyHubPage: React.FC = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([
        { role: 'ai', content: 'Greeting. I am the AI Strategy Architect. Please define your strategic goals for this quarter.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
        setMessages(newMessages);
        setInputValue('');

        // Simulate AI response (Mock)
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Analyzing strategic parameters: "${inputValue}"...\n\n### Strategy Generated\nBased on your input, I recommend focusing on **Scope 3 Decarbonization** and **Supply Chain Resilience**. \n\nSuggested Actions:\n1. Audit Tier 1 suppliers.\n2. Implement blockchain tracing for raw materials.`
            }]);
        }, 1000);
    };

    const GuidancePanel = () => (
        <div className="space-y-6">
            <CyberCard
                title="Strategy Context"
                value="Global"
                description="Current strategic focus area."
                icon={<Target className="text-amber-500" />}
                status="Active"
            />
            <CyberCard
                title="Intelligence Level"
                value="Gemini 2.0"
                description="Model capability: High Reasoning."
                icon={<BrainCircuit className="text-[#63a6b0]" />}
                status="Online"
            />

            <div className="opacity-70 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                    <span>COMPUTE_ETHICS</span>
                    <span className="text-emerald-500">OPTIMIZED</span>
                </div>
                <div className="flex justify-between">
                    <span>HALLUCINATION_RATE</span>
                    <span className="text-emerald-500">0.02%</span>
                </div>
            </div>
        </div>
    );

    return (
        <StitchConversationTemplate
            title="AI Strategy Hub"
            subtitle="INTELLIGENCE_FORGE_V2"
            headerIcon={<BrainCircuit size={32} />}
            guidancePanel={<GuidancePanel />}
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            placeholder="Describe your ESG strategic goals..."
        />
    );
};

export default AIStrategyHubPage;
