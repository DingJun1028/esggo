import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Badge } from '@/components/ui';
import { BOSS_LIST, BossEnemy } from '@/data/bosses';
import { Sword, Shield, Zap, AlertTriangle, Skull, HeartPulse } from 'lucide-react';
import { useSovereignSystem } from '@/contexts/SovereignContext';
import { useAgentRpg } from '@/hooks/useAgentRpg';

interface CombatDecisionInterfaceProps {
  bossId: string;
  onVictory: () => void;
  onDefeat: () => void;
  onClose: () => void;
}

export const CombatDecisionInterface: React.FC<CombatDecisionInterfaceProps> = ({
  bossId,
  onVictory,
  onDefeat,
  onClose,
}) => {
  const { entropyLevel, mintComponent } = useSovereignSystem();
  const { gainXp, addBadge } = useAgentRpg();
  const [boss, setBoss] = useState<BossEnemy | null>(null);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp] = useState(100);
  const [combatLog, setCombatLog] = useState<string[]>([
    'Encounter started! SYSTEM ALERT: High Entropy Entity detected.',
  ]);
  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    if (BOSS_LIST[bossId]) {
      // Deep copy to reset state
      setBoss(JSON.parse(JSON.stringify(BOSS_LIST[bossId])));
    }
  }, [bossId]);

  const addLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handlePlayerAction = (action: 'ATTACK' | 'DEFEND' | 'SKILL') => {
    if (!boss || !isPlayerTurn) return;

    let dmg = 0;
    let logMsg = '';

    switch (action) {
      case 'ATTACK':
        dmg = Math.floor(Math.random() * 50) + 30;
        logMsg = `You launched a Data Probe! Dealt ${dmg} damage.`;
        break;
      case 'DEFEND':
        logMsg = 'You fortified your Compliance Firewall. Incoming damage reduced.';
        break;
      case 'SKILL':
        dmg = 150;
        logMsg = 'ULTIMATE: Sovereign Audit! The lies shatter. Dealt 150 damage.';
        break;
    }

    // Apply Player Damage
    const newHp = Math.max(0, boss.hp - dmg);
    setBoss(prev => (prev ? { ...prev, hp: newHp } : null));
    addLog(logMsg);

    // Check Victory
    if (newHp <= 0) {
      addLog(`Victory! ${boss.name} has been neutralized.`);

      // Award RPG Rewards
      addBadge({ id: 'badge_boss_greenwashing', name: 'Greenwashing Slayer' });
      gainXp(5000); // Massive XP for boss kill

      setTimeout(onVictory, 2000);
      return;
    }

    // Check Phase Transition
    const phase = boss.phases.find(p => p.triggerHp >= newHp && p.triggerHp < boss.hp);
    if (phase) {
      addLog(`BOSS ALERT: "${phase.dialogue}"`);
    }

    setIsPlayerTurn(false);
    setTimeout(() => handleBossTurn(newHp, action === 'DEFEND'), 1500);
  };

  const handleBossTurn = (currentBossHp: number, isDefending: boolean) => {
    if (!boss) return;

    // Boss Attack
    let dmg = boss.entropy;
    if (isDefending) dmg = Math.floor(dmg / 2);

    // Random variance
    dmg += Math.floor(Math.random() * 20);

    setPlayerHp(prev => {
      const newHp = Math.max(0, prev - dmg);
      if (newHp <= 0) {
        addLog('CRITICAL FAILURE. System Overwhelmed.');
        setTimeout(onDefeat, 2000);
        return 0;
      }
      return newHp;
    });

    addLog(`${boss.name} used Entropy Lash! You took ${dmg} damage.`);
    setTurn(prev => prev + 1);
    setIsPlayerTurn(true);
  };

  if (!boss) return <div className="text-red-500">Boss not found</div>;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <Card className="max-w-4xl w-full bg-slate-950 border-red-900/50 shadow-[0_0_100px_rgba(220,38,38,0.2)] animate-in zoom-in-95 duration-500 flex flex-col overflow-hidden">
        {/* Header / Combat Status */}
        <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-gradient-to-r from-red-950/20 to-slate-950">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
              <Skull size={32} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-100 flex items-center gap-2">
                {boss.name}{' '}
                <Badge variant="destructive" className="bg-red-900 text-red-200">
                  BOSS
                </Badge>
              </h2>
              <p className="text-red-400 text-sm">{boss.title}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs uppercase mb-1">Turn Count</div>
            <div className="text-2xl font-mono font-bold text-slate-200">{turn}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
          {/* Left: Boss Visual & Stats */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Enemy Integrity</span>
                <span className="text-red-400 font-mono">
                  {boss.hp} / {boss.maxHp}
                </span>
              </div>
              <Progress
                value={(boss.hp / boss.maxHp) * 100}
                className="h-4 bg-slate-900 border border-slate-700"
              />
              {/* Note: Standard Progress component might need color override via style or class if strictly limited. Assuming default is fine or using style prop for simplicity if needed, but keeping it standard shadcn first. */}
            </div>

            <div className="min-h-[200px] flex items-center justify-center rounded-xl bg-slate-900/50 border border-slate-800">
              {/* Placeholder for Boss Animation/Image */}
              <div className="text-center space-y-4 opacity-50">
                <Skull size={64} className="mx-auto text-red-800" />
                <p className="text-sm text-slate-500 italic">"{boss.description}"</p>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="flex gap-2 justify-center">
              {boss.weakness.map(w => (
                <Badge key={w} variant="outline" className="border-red-500/50 text-red-300 gap-1">
                  <AlertTriangle size={12} /> Weak: {w}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Player Controls & Log */}
          <div className="flex-1 flex flex-col space-y-6">
            {/* Player HP */}
            <div className="bg-slate-900 p-4 rounded-xl border border-blue-900/30">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <HeartPulse className="text-emerald-400" size={20} />
                  <span className="font-bold text-slate-200">System Stability</span>
                </div>
                <span className="font-mono text-emerald-400">
                  {playerHp} / {playerMaxHp}
                </span>
              </div>
              <Progress value={(playerHp / playerMaxHp) * 100} className="h-2 bg-slate-800" />
            </div>

            {/* Combat Log */}
            <div className="flex-1 bg-black/50 rounded-lg p-4 font-mono text-xs text-slate-400 overflow-hidden border border-slate-800">
              {combatLog.map((log, i) => (
                <div key={i} className={`mb-1 ${i === 0 ? 'text-white font-bold' : 'opacity-70'}`}>
                  {i === 0 && '> '} {log}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-12 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800"
                onClick={() => handlePlayerAction('ATTACK')}
                disabled={!isPlayerTurn}
              >
                <Sword className="mr-2 h-4 w-4" /> Data Spike
              </Button>
              <Button
                className="h-12 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800"
                onClick={() => handlePlayerAction('DEFEND')}
                disabled={!isPlayerTurn}
              >
                <Shield className="mr-2 h-4 w-4" /> Firewall
              </Button>
              <Button
                className="col-span-2 h-14 bg-amber-600 hover:bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)]"
                onClick={() => handlePlayerAction('SKILL')}
                disabled={!isPlayerTurn}
              >
                <Zap className="mr-2 h-5 w-5" /> EXECUTE: SROI AUDIT
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
