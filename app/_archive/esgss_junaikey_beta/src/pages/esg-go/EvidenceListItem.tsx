import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, Link, MoreVertical } from 'lucide-react';
import { EvidenceItem } from '@/types/esg_go_schema';

interface EvidenceListItemProps {
  item: EvidenceItem;
  userTier: 'LITE' | 'PRO';
  onGenerateLink: (item: EvidenceItem) => void;
}

export const EvidenceListItem = memo(forwardRef<HTMLDivElement, EvidenceListItemProps>(({ item, userTier, onGenerateLink }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="size-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-[#63a6b0]">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#63a6b0] transition-colors">
              {item.fileName}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-slate-500 bg-black/20 px-1.5 py-0.5 rounded">
                {new Date(item.uploadDate).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Lock size={8} /> SHA-256 Verified
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-mono text-white/20 uppercase">Hash Fingerprint</p>
            <p className="text-[9px] font-mono text-[#63a6b0] max-w-[100px] truncate">
              {item.hash_sha256}
            </p>
          </div>

          {/* Generate Secure Link */}
          <button
            onClick={() => onGenerateLink(item)}
            className="px-3 py-1.5 rounded-lg bg-[#63a6b0]/10 hover:bg-[#63a6b0] text-[#63a6b0] hover:text-white transition-all text-[10px] font-bold border border-[#63a6b0]/30 flex items-center gap-1.5"
            title="Generate shareable secure link"
          >
            <Link size={12} />
            {userTier === 'PRO' ? 'SHARE' : 'SHARE (PRO)'}
          </button>

          <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}));

EvidenceListItem.displayName = 'EvidenceListItem';
