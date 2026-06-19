import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';

interface BoardQuestion {
    id: string;
    question: string;
    category: 'ESG_PERFORMANCE' | 'RISK' | 'COMPLIANCE' | 'STRATEGIC';
    suggestedAnswer: string;
    dataPoints: string[];
}

const mockQuestions: BoardQuestion[] = [
    {
        id: '1',
        question: "What is our current Scope 3 emissions reduction progress?",
        category: 'ESG_PERFORMANCE',
        suggestedAnswer: "We've achieved a 12% reduction in Scope 3 emissions YoY, exceeding the Q1 target of 10%. Key drivers include supplier engagement (15 suppliers now carbon-neutral) and logistics optimization.",
        dataPoints: ['Scope 3: -12% YoY', '15 suppliers certified', 'Logistics efficiency +8%']
    },
    {
        id: '2',
        question: "Are we exposed to any emerging ESG risks in the supply chain?",
        category: 'RISK',
        suggestedAnswer: "Alert: 2 critical suppliers located in regions with high water stress. Mitigation plan initiated, including dual-sourcing strategy and water stewardship audits scheduled for Q2.",
        dataPoints: ['2 High-Risk Suppliers', 'Mitigation: Dual-Sourcing', 'Audit Timeline: Q2 2026']
    },
    {
        id: '3',
        question: "What's our regulatory compliance status post-CSRD implementation?",
        category: 'COMPLIANCE',
        suggestedAnswer: "Fully compliant. All 12 mandatory ESRS disclosure requirements met. Third-party assurance completed by [Audit Firm]. No material gaps identified.",
        dataPoints: ['CSRD: Compliant', '12/12 ESRS Met', 'External Assurance: ✓']
    }
];

export const BoardCopilotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<BoardQuestion | null>(null);
    const [customQuery, setCustomQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleQuestionSelect = (question: BoardQuestion) => {
        setSelectedQuestion(question);
    };

    const handleCustomQuery = async () => {
        if (!customQuery.trim()) return;
        setIsProcessing(true);

        // Mock AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSelectedQuestion({
            id: 'custom',
            question: customQuery,
            category: 'STRATEGIC',
            suggestedAnswer: `[AI-Generated Response] Based on current ESG data indicators, here's a synthesized answer: ${customQuery} relates to our overall sustainability strategy framework...`,
            dataPoints: ['Data Point 1', 'Data Point 2', 'Data Point 3']
        });

        setIsProcessing(false);
        setCustomQuery('');
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Brain className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-bold">
                    Board Copilot
                </span>
                <span className="absolute -top-1 -right-1 size-3 bg-emerald-400 rounded-full animate-pulse" />
            </motion.button>

            {/* Main Widget */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-violet-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                                        <Brain size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic">Board Copilot</h2>
                                        <p className="text-xs text-slate-400">AI-Powered Q&A Preparation for Executive Meetings</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Anticipated Questions */}
                                <section>
                                    <h3 className="text-sm font-bold uppercase text-white/60 mb-4 flex items-center gap-2">
                                        <MessageSquare size={16} className="text-purple-400" />
                                        Anticipated Board Questions
                                    </h3>
                                    <div className="space-y-3">
                                        {mockQuestions.map((q) => (
                                            <motion.button
                                                key={q.id}
                                                onClick={() => handleQuestionSelect(q)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedQuestion?.id === q.id
                                                        ? 'bg-purple-500/10 border-purple-500/50'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                                whileHover={{ x: 4 }}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-white mb-1">{q.question}</p>
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 uppercase font-bold">
                                                            {q.category.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    {selectedQuestion?.id === q.id && (
                                                        <CheckCircle2 size={16} className="text-purple-400 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>

                                {/* Custom Query */}
                                <section>
                                    <h3 className="text-sm font-bold uppercase text-white/60 mb-4 flex items-center gap-2">
                                        <Sparkles size={16} className="text-amber-400" />
                                        Ask Custom Question
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customQuery}
                                            onChange={(e) => setCustomQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCustomQuery()}
                                            placeholder="e.g., What's our DEI progress against industry benchmarks?"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition-colors"
                                            disabled={isProcessing}
                                        />
                                        <button
                                            onClick={handleCustomQuery}
                                            disabled={isProcessing || !customQuery.trim()}
                                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm transition-all"
                                        >
                                            {isProcessing ? 'Processing...' : 'Ask AI'}
                                        </button>
                                    </div>
                                </section>

                                {/* Answer Display */}
                                {selectedQuestion && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-6"
                                    >
                                        <h3 className="text-sm font-bold uppercase text-purple-400 mb-4 flex items-center gap-2">
                                            <Brain size={16} />
                                            AI-Generated Talking Points
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-white/40 uppercase font-bold mb-2">Question</p>
                                                <p className="text-sm font-bold text-white">{selectedQuestion.question}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-white/40 uppercase font-bold mb-2">Suggested Answer</p>
                                                <p className="text-sm text-white/80 leading-relaxed">{selectedQuestion.suggestedAnswer}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-white/40 uppercase font-bold mb-2">Key Data Points</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedQuestion.dataPoints.map((point, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold"
                                                        >
                                                            {point}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.section>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
                                <p className="text-[10px] text-slate-500 italic">
                                    🔒 Powered by Dr. Thoth's Knowledge Vault | Answers synthesized from verified 5T data
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
