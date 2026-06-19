import React from 'react';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '../../components/ui';
import { Sword, Shield, Zap, Brain, Heart, Activity } from 'lucide-react';

export const AgentCharacterSheet: React.FC = () => {
  const { profile, activeAttributes, gainXp } = useAgentRpg();

  return (
    <Card className="w-full h-full bg-slate-900 text-slate-100 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-emerald-400 font-bold">{profile.title}</CardTitle>
            <p className="text-sm text-slate-400">Level {profile.level}</p>
          </div>
          <Badge variant="outline" className="border-emerald-500 text-emerald-400 text-lg">
            SP: {profile.availableSkillPoints}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar & Basic Stats */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-900 to-slate-800 border-4 border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="text-4xl">🤖</span>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>XP</span>
                <span>
                  {profile.currentXp} / {profile.nextLevelXp}
                </span>
              </div>
              <Progress
                value={(profile.currentXp / profile.nextLevelXp) * 100}
                className="h-2 bg-slate-800"
              />
            </div>

            <button
              onClick={() => gainXp(150)}
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
            >
              [DEBUG: Add XP]
            </button>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatRow
              icon={<Brain size={16} />}
              label="Intelligence"
              value={activeAttributes.intelligence}
              color="text-blue-400"
            />
            <StatRow
              icon={<Zap size={16} />}
              label="Creativity"
              value={activeAttributes.creativity}
              color="text-yellow-400"
            />
            <StatRow
              icon={<Heart size={16} />}
              label="Empathy"
              value={activeAttributes.empathy}
              color="text-rose-400"
            />
            <StatRow
              icon={<Shield size={16} />}
              label="Resilience"
              value={activeAttributes.resilience}
              color="text-slate-400"
            />
            <StatRow
              icon={<Activity size={16} />}
              label="Precision"
              value={activeAttributes.precision}
              color="text-purple-400"
            />
            <StatRow
              icon={<Sword size={16} />}
              label="Speed"
              value={activeAttributes.speed}
              color="text-green-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatRow = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
    <div className={`p-1.5 rounded-md bg-slate-900 ${color}`}>{icon}</div>
    <div className="flex-1">
      <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      <div className={`text-lg font-mono font-bold ${color}`}>{value}</div>
    </div>
  </div>
);
