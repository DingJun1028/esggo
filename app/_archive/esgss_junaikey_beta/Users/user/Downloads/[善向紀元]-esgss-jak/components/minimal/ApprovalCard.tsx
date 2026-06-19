
import React from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

interface ApprovalCardProps {
    toolName: string;
    args: any;
    onApprove: () => void;
    onReject: () => void;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ toolName, args, onApprove, onReject, status }) => {
    return (
        <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-xl overflow-hidden animate-fade-in shadow-2xl">
            {/* Header */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">HITL Approval Required</span>
            </div>
            
            {/* Body */}
            <div className="p-4">
                <div className="text-sm font-bold text-white mb-1">Tool: <span className="font-mono text-celestial-blue">{toolName}</span></div>
                <div className="bg-black/30 rounded-lg p-2 mb-4 border border-white/5">
                    <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap">
                        {JSON.stringify(args, null, 2)}
                    </pre>
                </div>
                
                {status === 'pending' ? (
                    <div className="flex gap-3">
                        <button 
                            onClick={onReject}
                            className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors border border-red-500/30 flex items-center justify-center gap-1"
                        >
                            <XCircle className="w-3 h-3" /> Reject
                        </button>
                        <button 
                            onClick={onApprove}
                            className="flex-1 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors border border-emerald-500/30 flex items-center justify-center gap-1"
                        >
                            <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                    </div>
                ) : (
                    <div className={`text-center text-xs font-bold py-2 rounded-lg border ${status === 'approved' || status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {status.toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
};
