/**
 * ZKP 審計驗證標籤 (ZKPAuditBadge)
 * --------------------------------------------------
 * [核心功能] 在審計追蹤表中展示 ZKP 驗證狀態
 * [交互] 點擊觸發 ZKPIntegrityService 進行即時驗證
 */

import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ZKPIntegrityService, ZKPProof, ZKPVerificationResult } from '@/omni/services/ZKPIntegrityService';

interface ZKPAuditBadgeProps {
    proof?: ZKPProof;
    onVerify?: (result: ZKPVerificationResult) => void;
}

export const ZKPAuditBadge: React.FC<ZKPAuditBadgeProps> = ({ proof, onVerify }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<ZKPVerificationResult | null>(null);

    if (!proof) return null;

    const handleVerify = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isVerifying) return;

        setIsVerifying(true);
        try {
            const vResult = await ZKPIntegrityService.verifyProof(proof);
            setResult(vResult);
            if (onVerify) onVerify(vResult);
        } catch (error) {
            console.error('[ZKPAuditBadge] Verification error:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    const getStatusDisplay = () => {
        if (isVerifying) {
            return (
                <div className="flex items-center gap-1 text-aqua-400 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] font-bold uppercase">Verifying...</span>
                </div>
            );
        }

        if (result) {
            return result.valid ? (
                <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">Verified</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-rose-400">
                    <XCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">Invalid</span>
                </div>
            );
        }

        return (
            <div
                onClick={handleVerify}
                className="flex items-center gap-1 text-slate-400 hover:text-aqua-400 cursor-pointer transition-colors group"
            >
                <Shield size={14} className="group-hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]" />
                <span className="text-[10px] font-bold uppercase">Audit ZKP</span>
            </div>
        );
    };

    return (
        <div className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50">
            {getStatusDisplay()}
        </div>
    );
};
