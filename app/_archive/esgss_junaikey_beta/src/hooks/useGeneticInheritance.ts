import { useState, useCallback, useEffect } from 'react';
import { GeneticEngine, GeneticBlueprint } from '../services/GeneticEngine';

export const useGeneticInheritance = () => {
  const [blueprints, setBlueprints] = useState<GeneticBlueprint[]>(() => {
    const saved = localStorage.getItem('omni_genetic_blueprints');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_genetic_blueprints', JSON.stringify(blueprints));
  }, [blueprints]);

  const synthesizeBlueprint = useCallback((agent: any) => {
    if (agent.level < 10) return null;

    const newBlueprint = GeneticEngine.extractBlueprint(agent);
    const finalBlueprint = GeneticEngine.calculateMutation(newBlueprint);

    setBlueprints(prev => [...prev, finalBlueprint]);
    return finalBlueprint;
  }, []);

  const deleteBlueprint = useCallback((id: string) => {
    setBlueprints(prev => prev.filter(b => b.id !== id));
  }, []);

  return {
    blueprints,
    synthesizeBlueprint,
    deleteBlueprint,
  };
};
