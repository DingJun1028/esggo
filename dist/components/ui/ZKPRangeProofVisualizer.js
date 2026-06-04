'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Shield, CheckCircle2, XCircle, Search, Database, Cpu, Zap, Fingerprint } from 'lucide-react';
import { verifySnarkJSProof } from '../../lib/crypto-proof';
import { motion, AnimatePresence } from 'framer-motion';
export function ZKPRangeProofVisualizer({ proof, title = 'ZKP 隱私區間驗證 (SNARK)', onVerify }) {
    const [result, setResult] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const handleVerify = async () => {
        setIsVerifying(true);
        const startTime = Date.now();
        let isValid = false;
        if (proof.snarkProof && proof.publicSignals) {
            isValid = await verifySnarkJSProof(null, proof.publicSignals, proof.snarkProof);
        }
        else {
            // Fallback delay if no snark proof is present
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        const timeTaken = Date.now() - startTime;
        const verifyResult = {
            valid: isValid,
            steps: [
                { name: 'Public Signals 結構檢查', passed: !!proof.publicSignals && proof.publicSignals.length >= 4, input: 'Array length >= 4' },
                { name: 'Groth16 證明解析 (pi_a, pi_b, pi_c)', passed: !!proof.snarkProof, input: proof.snarkProof?.protocol || 'None' },
                { name: '雙線性配對驗證 (Bilinear Pairing)', passed: isValid, input: 'e(A, B) = e(C, 1) * e(VK.a, VK.b)' }
            ],
            timeTaken
        };
        setResult(verifyResult);
        setIsVerifying(false);
        if (onVerify)
            onVerify(verifyResult.valid);
    };
    return (_jsxs(Card, { className: "max-w-md w-full overflow-hidden border-berkeley-blue/20", children: [_jsx(CardHeader, { className: "bg-slate-50/50 border-b border-slate-100/50 pb-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(CardTitle, { className: "text-berkeley-blue flex items-center gap-2", children: [_jsx(Shield, { size: 20, className: "text-berkeley-blue" }), title] }), _jsx(Badge, { variant: result ? (result.valid ? 'verified' : 'error') : 'default', children: result ? (result.valid ? '驗證通過' : '驗證失敗') : '待驗證' })] }) }), _jsxs(CardContent, { className: "space-y-4 pt-6", children: [_jsxs("div", { className: "p-3 bg-primary-50/50 rounded-lg border border-primary-100", children: [_jsx("p", { className: "text-[10px] font-black text-berkeley-blue/50 uppercase tracking-widest mb-1", children: "Public Claim (\u5408\u898F\u5BA3\u544A)" }), _jsxs("p", { className: "text-sm font-semibold text-berkeley-blue", children: ["\u6578\u64DA\u4F4D\u65BC\u5340\u9593: ", _jsxs("span", { className: "text-primary-700", children: ["[", proof.min, ", ", proof.max, "]"] })] }), _jsxs("div", { className: "mt-2 flex items-center gap-2 text-[11px] text-slate-500 overflow-hidden", children: [_jsx(Database, { size: 12 }), _jsxs("span", { className: "truncate font-mono", children: ["Commitment: ", proof.commitment.commitment.substring(0, 24), "..."] })] })] }), proof.publicSignals && (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1", children: [_jsx(Fingerprint, { size: 12 }), " \u516C\u958B\u8A0A\u865F (Public Signals)"] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded p-2 text-center", children: [_jsx("p", { className: "text-[9px] text-slate-400 uppercase font-bold", children: "InRange[0]" }), _jsx("p", { className: "text-xs font-mono font-bold text-berkeley-blue", children: proof.publicSignals[0] })] }), _jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded p-2 text-center", children: [_jsx("p", { className: "text-[9px] text-slate-400 uppercase font-bold", children: "Commitment Hash" }), _jsx("p", { className: "text-xs font-mono font-bold text-berkeley-blue truncate", children: proof.publicSignals[3] })] })] })] })), proof.snarkProof && (_jsxs("div", { className: "p-3 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden", children: [_jsxs("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1", children: [_jsx(Cpu, { size: 12 }), " SNARK Proof (Groth16)"] }), _jsxs("div", { className: "text-[9px] font-mono text-slate-500 space-y-1", children: [_jsxs("p", { className: "truncate", children: ["pi_a: [", proof.snarkProof.pi_a[0].substring(0, 16), "...]"] }), _jsxs("p", { className: "truncate", children: ["pi_b: [[", proof.snarkProof.pi_b[0][0].substring(0, 16), "...]]"] }), _jsxs("p", { className: "truncate", children: ["pi_c: [", proof.snarkProof.pi_c[0].substring(0, 16), "...]"] })] })] })), _jsxs("div", { className: "pt-2", children: [_jsxs(Button, { className: "w-full h-10 shadow-sm", onClick: handleVerify, disabled: isVerifying, children: [isVerifying ? _jsx(Zap, { size: 16, className: "animate-spin mr-2" }) : _jsx(Search, { size: 16, className: "mr-2" }), isVerifying ? '驗證零知識電路中...' : '執行 ZKP 驗證 (Verify)'] }), _jsx("p", { className: "text-[10px] text-center text-slate-400 mt-2 italic", children: "* \u9A57\u8B49\u8005\u50C5\u9700\u4F7F\u7528 Public Signals \u8207 Proof \u5373\u53EF\u9A57\u8B49\uFF0C\u7121\u9700 Blinding Factor\u3002" })] }), _jsx(AnimatePresence, { children: result && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "space-y-2 pt-2 border-t border-slate-100 overflow-hidden", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2", children: "\u9A57\u8B49\u8DEF\u5F91 (Audit Trail)" }), result.steps.map((step, idx) => (_jsxs("div", { className: "flex items-start gap-3 text-xs p-2 rounded hover:bg-slate-50 transition-colors", children: [step.passed ? (_jsx(CheckCircle2, { size: 14, className: "text-verified mt-0.5" })) : (_jsx(XCircle, { size: 14, className: "text-error mt-0.5" })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-slate-700", children: step.name }), _jsx("span", { className: step.passed ? "text-verified font-mono" : "text-error font-mono", children: step.passed ? "MATCH" : "FAIL" })] }), _jsxs("p", { className: "text-[10px] text-slate-400 font-mono mt-0.5 truncate", children: ["IN: ", step.input] })] })] }, idx))), result.valid && (_jsxs("div", { className: "mt-3 p-2 bg-verified/5 rounded border border-verified/10 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-verified animate-pulse" }), _jsxs("span", { className: "text-[11px] font-bold text-verified uppercase", children: ["\u5340\u9593\u8AA0\u4FE1\u78BA\u8A8D: ", proof.inRange ? 'TRUE' : 'FALSE'] })] })), _jsxs("div", { className: "text-[9px] text-center text-slate-400 font-mono", children: ["Total Verification Time: ", result.timeTaken, "ms | 5T v1.1.0"] })] })) })] })] }));
}
//# sourceMappingURL=ZKPRangeProofVisualizer.js.map