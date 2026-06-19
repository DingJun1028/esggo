import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import {
  Users,
  BookOpen,
  Shield,
  Globe,
  ShoppingBag,
  Database,
  Heart,
  Gift,
  MessageCircle,
  Zap,
  Activity,
  Sword,
} from 'lucide-react';
import { usePartnerAffinity } from '@/hooks/usePartnerAffinity';
import { useSovereignSystem } from '@/contexts/SovereignContext';
import { SovereignAllianceMissions } from './SovereignAllianceMissions';

interface PartnerLocation {
  id: string;
  name: string;
  role: string;
  description: string;
  ultimateSkill: string; // New field for "Ultimate Skill"
  x: number; // 0-100% position
  y: number; // 0-100% position
  icon: React.ReactNode;
  color: string;
  dialogs: string[];
}

const LOCATIONS: PartnerLocation[] = [
  {
    id: 'jun_ai_key',
    name: 'The Core Architect',
    role: '智能永續 · 核心架構 (The Guardian)',
    description:
      'Budget Approval & Value Anchoring: Guides "Omni-Component Core" adoption. Ensures all architecture follows the 4+1 Protocol.',
    ultimateSkill: '價值創造支撐 (Value Creation Order): Audits SROI and releases resources.',
    x: 50,
    y: 50,
    icon: <Shield size={32} />,
    color: 'emerald',
    dialogs: [
      'Welcome home, Pioneer. The Core is stable.',
      "Remember: If it's not traceable, it doesn't exist.",
      'Your actions are being recorded in the immutable ledger.',
    ],
  },
  {
    id: 'dr_sushi',
    name: 'The Founding Visionary',
    role: '智能永續 · 壽司博士 (The Visionary)',
    description:
      'Vision Definition & Value Audit: Transforms contradictions into value. Balances growth with impact.',
    ultimateSkill:
      '睿智決策簽署 (Compassionate Wisdom Sign-off): Converts profit into inclusive assets.',
    x: 20,
    y: 30,
    icon: <BookOpen size={28} />,
    color: 'blue',
    dialogs: [
      'Knowledge is the only resource that grows when shared.',
      'We must balance the needs of the shareholders with the voice of the forest.',
      'True vision sees the opportunity in every risk.',
    ],
  },
  {
    id: 'adan_wang',
    name: 'The Strategic Navigator',
    role: '智能永續 · 策略導航 (The Strategist)',
    description:
      'Global Planning & Path Optimization: Identifies key risks & opportunities via Double Materiality.',
    ultimateSkill: '萬能元鑰 (Omni-Key): Activates full-path resonance.',
    x: 80,
    y: 30,
    icon: <Users size={28} />,
    color: 'purple',
    dialogs: [
      'Strategy without execution is hallucination.',
      "I've analyzed the double materiality; the path is clear.",
      "Don't just look at the profit, look at the impact vector.",
    ],
  },
  {
    id: 'tech_vanguard',
    name: 'The Tech Vanguard',
    role: '智能永續 · 技術長 (The Oracle)',
    description:
      'Underlying Verification & Zero-Hallucination Guard: Solves data bottlenecks and unlocks Carbon Asset Computing.',
    ultimateSkill: '雙重鎖定 (Twin-Lock): Ensures data immutability.',
    x: 50,
    y: 85,
    icon: <Database size={28} />,
    color: 'red',
    dialogs: [
      'The hash-lock on this carbon credit is verified. Zero-knowledge proof accepted.',
      'Bottleneck detected in the verification layer. Rerouting through the Omni-Core.',
      "We don't just store data; we crystalize it into immutable assets.",
      'Protocol V6.0 is live. Entropy is falling.',
    ],
  },
  {
    id: 'catalyst_ceo',
    name: 'The Catalyst of Execution',
    role: '智能永續 · 執行長 (The Executor)',
    description:
      'Practice Promotion & Efficiency Acceleration: Significantly boosts village construction speed and energy conversion.',
    ultimateSkill:
      '高標高效指令 (High-Standard Efficiency Command): Reduces global cooldowns by 50%.',
    x: 80,
    y: 60,
    icon: <Zap size={28} />,
    color: 'amber',
    dialogs: [
      "Speed is a feature. Let's build.",
      "Efficiency isn't just about saving time, it's about saving the planet.",
      'Action is the only truth.',
    ],
  },
  {
    id: 'systems_coo',
    name: 'The Systems Orchestrator',
    role: '智能永續 · 營運長 (The Orchestrator)',
    description:
      'Meridian Maintenance & Agent Management: Ensures system stability and resource flow.',
    ultimateSkill: '自動挖礦協議 (Auto-Mining Protocol): 24/7 Knowledge Point (KP) mining.',
    x: 20,
    y: 60,
    icon: <Activity size={28} />,
    color: 'cyan',
    dialogs: [
      'The system flow is optimal.',
      'Resource allocation complete. No waste detected.',
      'Orchestrating the chaos into a symphony of data.',
    ],
  },
];

const AFFINITY_GIFT_BOOST = 50;
const AFFINITY_TALK_BOOST = 10;

export const EsgWorldMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<PartnerLocation | null>(null);
  const [showInteractDialog, setShowInteractDialog] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const { affinities, boostAffinity } = usePartnerAffinity();
  const { igniteResonance, mintComponent } = useSovereignSystem();

  const randomDialog = useMemo(() => {
    if (!selectedLocation) return '';
    // Stable index based on ID to avoid purity issues
    const seed = selectedLocation.id.length % selectedLocation.dialogs.length;
    return selectedLocation.dialogs[seed];
  }, [selectedLocation]);

  const handleInteract = (action: 'TALK' | 'GIFT' | 'DRAW' | 'MISSIONS') => {
    if (!selectedLocation) return;

    if (action === 'MISSIONS') {
      setShowMissions(true);
      setShowInteractDialog(false); // Close dialog, open missions
      return;
    }

    // Simulate interaction result
    boostAffinity(
      selectedLocation.id,
      action === 'GIFT' ? AFFINITY_GIFT_BOOST : AFFINITY_TALK_BOOST
    );
    // In real app, show result toast/dialog
    setShowInteractDialog(false);
  };

  return (
    <Card className="w-full bg-slate-950 border-slate-800 overflow-hidden relative min-h-[500px]">
      {/* Missions Overlay */}
      {showMissions && selectedLocation && (
        <div className="absolute inset-0 z-50 bg-slate-950 animate-in fade-in zoom-in-95 duration-300">
          <SovereignAllianceMissions
            mentorIdFilter={selectedLocation.id}
            onClose={() => setShowMissions(false)}
          />
        </div>
      )}

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <CardHeader className="relative z-10 pointer-events-none">
        <CardTitle className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
          <Globe size={16} /> World Map: ESG Sustainability Village
        </CardTitle>
      </CardHeader>

      <div className="relative w-full h-[450px]">
        {LOCATIONS.map(loc => {
          const affinity = affinities[loc.id] || { level: 0, exp: 0 };
          return (
            <Popover key={loc.id}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowInteractDialog(true);
                  }}
                  className={`
                                    absolute transform -translate-x-1/2 -translate-y-1/2
                                    flex flex-col items-center group transition-all hover:scale-110
                                `}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <div
                    className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
                                    bg-slate-900 border-2 border-${loc.color}-500/50 group-hover:border-${loc.color}-400
                                    text-${loc.color}-400
                                `}
                  >
                    {loc.icon}
                  </div>
                  <div className="mt-2 bg-slate-900/80 px-2 py-1 rounded text-xs font-bold text-slate-200 border border-slate-700 backdrop-blur-sm">
                    {loc.name}
                  </div>
                  {/* Affinity Heart */}
                  <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border border-rose-500/50 flex items-center justify-center w-6 h-6 z-20">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                    <span className="text-[8px] ml-0.5 text-white">{affinity.level}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-slate-900 border-slate-700 w-64 p-4 z-50">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-100">{loc.name}</h4>
                  <p className="text-xs text-slate-400">{loc.description}</p>
                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-emerald-500 text-emerald-500 hover:bg-emerald-900/20"
                      onClick={() => handleInteract('TALK')}
                    >
                      <MessageCircle size={12} className="mr-1" /> Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-amber-500 text-amber-500 hover:bg-amber-900/20"
                      onClick={() => handleInteract('MISSIONS')}
                    >
                      <Sword size={12} className="mr-1" /> Ops
                    </Button>
                    {loc.id === 'adan_wang' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-purple-400"
                        onClick={() => handleInteract('DRAW')}
                      >
                        Draw
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {/* Interaction Dialog (Mock) */}
      <Dialog open={showInteractDialog} onOpenChange={setShowInteractDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLocation?.icon} {selectedLocation?.name}
            </DialogTitle>
            <DialogDescription>{selectedLocation?.role}</DialogDescription>
            <div className="mt-2 inline-block px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded text-xs text-purple-200 font-mono">
              [SKILL] {selectedLocation?.ultimateSkill}
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 italic text-slate-300">
              &quot;
              {randomDialog}
              &quot;
            </div>

            <div className="flex justify-center flex-col gap-2 pt-4">
              <Button
                className="bg-primary hover:bg-primary/80 text-black font-bold w-full"
                onClick={() => handleInteract('MISSIONS')}
              >
                <Sword className="mr-2" size={16} /> VIEW MISSIONS
              </Button>

              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-900/20 w-full text-xs font-mono"
                onClick={() => {
                  if (selectedLocation?.id === 'jun_ai_key') {
                    igniteResonance(); // Trigger Sovereign Engine
                  } else {
                    // Generic mint for other roles
                    mintComponent(
                      { action: 'skill_use', role: selectedLocation?.id },
                      'WorldMap_Interaction'
                    );
                  }
                  setShowInteractDialog(false);
                }}
              >
                <Zap className="mr-2" size={12} /> ACTIVATE:{' '}
                {selectedLocation?.ultimateSkill.split(':')[0]}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <Heart size={16} className="text-rose-500" />
              Current Interaction increases Affinity. Reach Level 10 for True Ending.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
