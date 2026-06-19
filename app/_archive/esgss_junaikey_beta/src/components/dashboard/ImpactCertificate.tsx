import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from '@/components/ui';
import {
  Award,
  ShieldCheck,
  Waves,
  Globe,
  Fingerprint,
  Hash,
  Calendar,
  Sparkles,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpactCertificateProps {
  missionTitle: string;
  xpGained: number;
  impactGained: number;
  synergy: number;
  onClose: () => void;
}

export const ImpactCertificate: React.FC<ImpactCertificateProps> = ({
  missionTitle,
  xpGained,
  impactGained,
  synergy,
  onClose,
}) => {
  const certificateId = `OA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const date = new Date().toLocaleDateString();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-6"
    >
      <Card className="relative w-full max-w-2xl bg-neutral-900 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(13,242,223,0.15)] overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />

        <CardHeader className="text-center border-b border-white/5 pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl scale-150"
              />
              <div className="bg-slate-950 p-4 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(13,242,223,0.3)] relative z-10">
                <Award className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white tracking-widest uppercase text-shadow-cyan">
            Certificate of Impact
          </CardTitle>
          <CardDescription className="text-cyan-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Omni-Agent Governance Protocol v10.0
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-10 pb-12 px-12">
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm italic">
              This document certifies that the designated agent cluster has successfully mitigated
              systemic risk and contributed measurable value to the global ESG ecosystem.
            </p>

            <div className="py-6 space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">{missionTitle}</h3>
              <div className="flex justify-center items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                >
                  Strategic Achievement
                </Badge>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="text-xs text-slate-500 font-mono italic">
                  Verified SDAL Cycle: Success
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Impact Yield
                </div>
                <div className="text-xl font-black text-emerald-400">+{impactGained} pts</div>
              </div>
              <div className="text-center border-x border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Growth Surge
                </div>
                <div className="text-xl font-black text-cyan-400">+{xpGained} XP</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Synergy Mult
                </div>
                <div className="text-xl font-black text-amber-400">x{synergy.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-white/5 pt-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                <Hash className="w-3 h-3" />
                {certificateId}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                <Calendar className="w-3 h-3" />
                {date}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent to-cyan-500" />
              <div className="text-[10px] font-bold text-white uppercase tracking-tighter italic">
                Authorized by OmniCore
              </div>
              <Fingerprint className="w-6 h-6 ml-auto text-cyan-500/40" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="rounded-xl px-10 border-white/10 hover:bg-white/5 h-12 hover:text-cyan-400 transition-colors"
          onClick={() => {}}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          className="rounded-xl px-12 bg-cyan-600 hover:bg-cyan-500 text-white h-12 shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all font-bold"
          onClick={onClose}
        >
          Return to Mission Center
        </Button>
      </div>
    </motion.div>
  );
};
