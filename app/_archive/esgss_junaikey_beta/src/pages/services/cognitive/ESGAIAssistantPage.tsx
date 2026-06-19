import React, { useState } from 'react';
import { StitchConversationTemplate } from '@/components/layout/StitchConversationTemplate';
import { Bot, Sparkles, BookOpen, Scale } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';

const ESGAIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([
        { role: 'ai', content: 'Greetings. I am Dr. Thoth, the Omni-Mind Guardian. How may I assist your sustainability journey today?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
        setMessages(newMessages);
        setInputValue('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Processing inquiry: "${inputValue}"...\n\nAccording to the **GRI 305 Standards**, Scope 3 emissions must be calculated using verified activity data. I recommend referencing the **GHG Protocol Corporate Value Chain Standard**.\n\nWould you like me to generate a calculation template?`
            }]);
        }, 1200);
    };

    const GuidancePanel = () => (
        <div className="space-y-6">
            <CyberCard
                title="Persona"
                value="Dr. Thoth"
                description="Specialized in global reporting standards (GRI, SASB, TCFD)."
                icon={<Bot className="text-[#63a6b0]" />}
                status="Active"
            />

            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase opacity-50">Knowledge Base Stats</h4>
                <div className="flex items-center justify-between text-xs font-mono p-3 rounded bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-amber-500" />
                        <span>STANDARDS</span>
                    </div>
                    <span>142</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono p-3 rounded bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                        <Scale size={14} className="text-emerald-500" />
                        <span>REGULATIONS</span>
                    </div>
                    <span>89</span>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase opacity-50 mb-3">Suggested Prompts</h4>
                <div className="flex flex-wrap gap-2">
                    {["How to calculate Scope 3?", "GRI 403 requirements", "SBTi target setting"].map(prompt => (
                        <button
                            key={prompt}
                            onClick={() => setInputValue(prompt)}
                            className="px-3 py-1.5 text-xs rounded-full border border-white/10 hover:bg-white/10 transition-colors text-left"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <StitchConversationTemplate
            title="ESG AI Assistant"
            subtitle="DR. THOTH • OMNI-MIND"
            headerIcon={<Sparkles size={32} />}
            guidancePanel={<GuidancePanel />}
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            placeholder="Ask Dr. Thoth about standards, metrics, or strategy..."
        />
    );
};

export default ESGAIAssistantPage;
