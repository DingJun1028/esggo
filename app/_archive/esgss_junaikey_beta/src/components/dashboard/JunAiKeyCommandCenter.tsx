import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

/**
 * 🧠 JunAiKey Command Center
 * 
 * A natural language interface for triggering system skills.
 * "Don't click menus, just ask."
 */
export const JunAiKeyCommandCenter: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDispatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsProcessing(true);
        setResult(null);
        setError(null);

        try {
            // Call the new NL dispatch endpoint
            const response = await apiService.dispatchSkill(prompt);

            if (response.success) {
                setResult(response);
            } else {
                setError(response.message || 'Skill execution failed.'); // Basic error handling
            }
        } catch (err: any) {
            setError(err.message || 'Failed to dispatch command.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-1">
            <div className="relative overflow-hidden rounded-2xl border border-[#63a6b0]/30 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_30px_rgba(99,166,176,0.15)]">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#63a6b0]/20 bg-[#63a6b0]/5">
                    <div className="p-2 rounded-lg bg-[#63a6b0]/10">
                        <Sparkles className="w-5 h-5 text-[#63a6b0] animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">JunAiKey Command Center</h3>
                        <p className="text-xs text-[#63a6b0]/80 font-mono">NATURAL LANGUAGE INTERFACE // V1.0</p>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6">
                    <form onSubmit={handleDispatch} className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Terminal className="w-5 h-5 text-slate-500 group-focus-within:text-[#63a6b0] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isProcessing}
                            placeholder="Type a command... (e.g., 'Sync my profile', 'Generate ESG insight')"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-4 pl-12 pr-14 text-white placeholder-slate-500 focus:outline-none focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] transition-all font-mono"
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isProcessing}
                            className="absolute inset-y-2 right-2 px-3 flex items-center justify-center rounded-lg bg-[#63a6b0] hover:bg-[#528d96] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-900 font-bold"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>

                    {/* Result Display */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10"
                            >
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold text-green-300">
                                            Executed: <span className="font-mono text-white">{result.intent}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">
                                            {result.result?.message || 'Command processed successfully.'}
                                        </p>
                                        {/* Optional: Show raw data for debug */}
                                        {result.result?.data && (
                                            <pre className="mt-2 p-2 rounded bg-black/30 text-xs text-green-400/80 overflow-x-auto font-mono">
                                                {JSON.stringify(result.result.data, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer / Hints */}
                <div className="px-6 py-3 bg-slate-950/30 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Try: "Sync achievements"</span>
                    <span>AI-Powered Skill Dispatch</span>
                </div>
            </div>
        </div>
    );
};
