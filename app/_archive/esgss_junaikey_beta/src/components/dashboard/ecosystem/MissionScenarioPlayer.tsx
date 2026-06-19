import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { SCENARIO_MAP, ScenarioStage } from '@/data/challenges';
import { MessageCircle, ArrowRight, XCircle, CheckCircle } from 'lucide-react';

interface MissionScenarioPlayerProps {
  scenarioId: string; // e.g. 'ilan_forest'
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

export const MissionScenarioPlayer: React.FC<MissionScenarioPlayerProps> = ({
  scenarioId,
  onComplete,
  onClose,
}) => {
  // Dynamic lookup
  const scenarioData = SCENARIO_MAP[scenarioId];
  const [currentStageId, setCurrentStageId] = useState<string>('start');

  if (!scenarioData) {
    return <div className="p-4 text-red-500">Error: Scenario '{scenarioId}' not found.</div>;
  }

  const stage = scenarioData[currentStageId];

  const handleOptionClick = (option: ScenarioStage['options'][0]) => {
    if (option.nextStageId === 'COMPLETE') {
      onComplete(true);
    } else if (option.nextStageId === 'FAILED') {
      onComplete(false);
    } else {
      setCurrentStageId(option.nextStageId);
    }
  };

  if (!stage) {
    return <div className="p-4 text-red-500">Error: Stage '{currentStageId}' not found.</div>;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="max-w-2xl w-full bg-slate-900 border-amber-500/30 shadow-[0_0_50px_rgba(217,119,6,0.2)] animate-in zoom-in-95 duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center border border-amber-500">
                <MessageCircle className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{stage.speaker}</h3>
                <Badge variant="outline" className="text-xs text-slate-500 border-slate-700">
                  Sequence: {stage.id}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500" onClick={onClose}>
              <XCircle size={20} />
            </Button>
          </div>

          {/* Narrative */}
          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 min-h-[120px] flex items-center">
            <p className="text-lg text-slate-300 leading-relaxed font-serif">{stage.text}</p>
          </div>

          {/* Choices */}
          <div className="space-y-3">
            {stage.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 transition-all group flex justify-between items-center"
              >
                <span className="text-slate-200 group-hover:text-amber-100 font-medium">
                  {option.text}
                </span>
                {option.impact && (
                  <div className="flex gap-2 text-xs opacity-50 group-hover:opacity-100">
                    {option.impact.e !== undefined && (
                      <span className={option.impact.e > 0 ? 'text-green-400' : 'text-red-400'}>
                        E {option.impact.e > 0 ? '+' : ''}
                        {option.impact.e}
                      </span>
                    )}
                    {option.impact.s !== undefined && (
                      <span className={option.impact.s > 0 ? 'text-blue-400' : 'text-red-400'}>
                        S {option.impact.s > 0 ? '+' : ''}
                        {option.impact.s}
                      </span>
                    )}
                    {option.impact.g !== undefined && (
                      <span className={option.impact.g > 0 ? 'text-purple-400' : 'text-red-400'}>
                        G {option.impact.g > 0 ? '+' : ''}
                        {option.impact.g}
                      </span>
                    )}
                  </div>
                )}
                <ArrowRight
                  className="text-slate-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  size={16}
                />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
