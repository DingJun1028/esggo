import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Progress,
  Badge,
} from '@/components/ui';
import {
  Activity,
  Zap,
  Scale,
  Shield,
  TrendingUp,
  Sparkles,
  Wind,
  Users,
  Briefcase,
} from 'lucide-react';
import { useAgentRpg } from '../../hooks/useAgentRpg';

export const AttributeResonance: React.FC = () => {
  const { profile, activeAttributes } = useAgentRpg();

  const resonances = [
    {
      label: 'Eco-Awareness (E)',
      attr: 'ecoAwareness',
      drift: profile.drift.e,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500',
      icon: Wind,
      desc: 'Multiplied by Environmental Alignment',
    },
    {
      label: 'Ethical Bias (S)',
      attr: 'ethicalBias',
      drift: profile.drift.s,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500',
      icon: Users,
      desc: 'Multiplied by Social Alignment',
    },
    {
      label: 'Compute Power (G)',
      attr: 'computePower',
      drift: profile.drift.g,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      icon: Briefcase,
      desc: 'Multiplied by Governance Integrity',
    },
  ];

  return (
    <Card className="bg-slate-900/60 border-white/5 backdrop-blur-2xl overflow-hidden shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-primary">
            <Scale className="w-4 h-4" />
            Attribute Resonance
          </CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] bg-cyan-500/5 text-cyan-400 border-cyan-500/20"
          >
            Live Sync
          </Badge>
        </div>
        <CardDescription className="text-[11px] text-slate-500">
          Drift mapping to neural stats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {resonances.map(res => {
          const baseValue = profile.attributes[res.attr as keyof typeof profile.attributes] || 0;
          const resonantValue = activeAttributes[res.attr as keyof typeof activeAttributes] || 0;
          const multiplier = 1 + res.drift / 100;

          return (
            <div key={res.label} className="space-y-2 group">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${res.color}`}
                  >
                    <res.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-300">{res.label}</div>
                    <div className="text-[9px] text-slate-500">{res.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black flex items-center gap-1 justify-end">
                    <span className="text-slate-500 line-through font-normal">
                      {baseValue.toFixed(0)}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-700" />
                    <span className={res.color}>{resonantValue.toFixed(1)}</span>
                  </div>
                  <div className="text-[9px] font-bold text-cyan-500/80">
                    x{multiplier.toFixed(2)} Mult
                  </div>
                </div>
              </div>
              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full transition-all duration-1000 ease-out ${res.bgColor}`}
                  style={{ width: `${Math.min(res.drift, 100)}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-white/5">
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 text-[10px] text-primary font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              System Feedback
            </div>
            <p className="text-[10px] text-slate-400 italic">
              High drift values amplify specific neural pathways. Train your agent in the Neural Lab
              to maximize resonance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
