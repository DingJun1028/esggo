import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Link, Copy, Check } from 'lucide-react';

interface VerificationBadgeProps {
  reportId: string;
  merkleRoot: string;
  timestamp: Date;
  txHash?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  reportId,
  merkleRoot,
  timestamp,
  txHash,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock hash if not provided (simulation mode)
  const displayHash = txHash || `0x${Math.random().toString(16).substr(2, 40)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="inline-flex flex-col relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer
                ${isHovered ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}
            `}
      >
        <ShieldCheck className={`w-4 h-4 ${isHovered ? 'text-emerald-400' : 'text-slate-400'}`} />
        <span
          className={`text-xs font-medium ${isHovered ? 'text-emerald-300' : 'text-slate-400'}`}
        >
          {isHovered ? 'Blockchain Verified' : 'Verified'}
        </span>
      </div>

      {/* Hover Popup Card */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow-2xl z-50 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <img
                src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=025"
                alt="Polygon"
                className="w-4 h-4"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              Polygon Amoy
            </span>
            <span className="text-[10px] text-slate-500">{timestamp.toLocaleDateString()}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
                Merkle Root
              </label>
              <code className="block bg-black/40 p-1.5 rounded text-[10px] text-emerald-200/80 font-mono truncate">
                {merkleRoot.substring(0, 32)}...
              </code>
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
                Transaction Hash
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/40 p-1.5 rounded text-[10px] text-blue-300/80 font-mono truncate">
                  {displayHash}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <a
              href={`https://amoy.polygonscan.com/tx/${displayHash}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-2 mt-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs rounded transition-colors flex items-center justify-center gap-2"
            >
              <Link className="w-3 h-3" />
              View on Block Explorer
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VerificationBadge;
