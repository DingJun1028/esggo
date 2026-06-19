'use client';
import React from 'react';
import JulesValidator, { ValidationRule } from '@/core/utils/jules-validator';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StandardCalculatorProps {
    standardCode: string; // e.g., '[ISO-14064-1]'
    formulaDescription: string; // e.g., 'Total Emissions = Scope 1 + Scope 2 + Scope 3'
    data: Record<string, any>;
    rules: ValidationRule[];
}

export default function StandardCalculator({ standardCode, formulaDescription, data, rules }: StandardCalculatorProps) {
    const { isValid, errors, karmaScore } = JulesValidator.validate(data, rules);

    return (
        <div className="bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] rounded-xl p-6 relative overflow-hidden group transition-all hover:border-[var(--theme-primary)]/30">
            {/* 動態玻璃光效 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/10 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--theme-primary)]/10 rounded-lg text-[var(--theme-primary)]">
                    <Calculator className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[var(--theme-text-main)] font-semibold flex items-center gap-2">
                        零幻覺驗算 (Zero-Hallucination)
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20">
                            {standardCode}
                        </span>
                    </h4>
                    <p className="text-[var(--theme-text-muted)] text-xs font-mono mt-1">{formulaDescription}</p>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${isValid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                {isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-semibold ${isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isValid ? '驗證通過 (Passed)' : '發現異常 (Anomalies Detected)'}
                        </span>
                        <span className="text-xs font-mono text-[var(--theme-text-muted)]">Karma: {karmaScore}/100</span>
                    </div>

                    {!isValid && (
                        <ul className="text-sm text-rose-600/80 space-y-1 mt-2 list-disc list-inside">
                            {errors.map((err, idx) => (
                                <li key={idx}>[{err.field}] {err.message}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
