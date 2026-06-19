import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorldLocation, LocationID } from '../types';
import { PartnerAffinity } from '../types/aiPartner';
import { Map, MapPin, Navigation, Info, Sparkles, X, ArrowRight } from 'lucide-react';
import { affinityService, PARTNER_IDS, InteractionResult } from '../services/affinityService';

// Mock Data for Locations (Updated IDs to match service)
const LOCATIONS: WorldLocation[] = [
  {
    id: 'esg_tower',
    name: 'ESG Tower',
    description: 'One-stop decision support center, home of Dr. Thoth.',
    partnerId: PARTNER_IDS.ESG_SUNSHINE,
    coordinates: { x: 50, y: 50 },
    availableActions: ['TALK', 'QUEST'],
  },
  {
    id: 'wangdao_citadel',
    name: 'Wangdao Citadel',
    description: 'Ancient dojo for cultivating the Ren-Du meridians, holding business wisdom.',
    partnerId: PARTNER_IDS.WANGDAO,
    coordinates: { x: 20, y: 30 },
    availableActions: ['TALK', 'GIFT', 'FORTUNE'],
  },
  {
    id: 'samwells_lab',
    name: 'Samwells Lab',
    description: 'High-tech testing center, seeing through all structures and risks.',
    partnerId: PARTNER_IDS.SAMWELLS,
    coordinates: { x: 80, y: 30 },
    availableActions: ['TALK', 'QUEST'],
  },
  {
    id: 'freetime_cabin',
    name: 'Freetime Cabin',
    description: "Explorer's rest station, providing premium Freetimegears.",
    partnerId: PARTNER_IDS.FREETIME,
    coordinates: { x: 20, y: 70 },
    availableActions: ['TALK', 'GIFT'],
  },
  {
    id: 'lingostep_hub',
    name: 'Lingostep Hub',
    description: 'Global communication hub, breaking language barriers.',
    partnerId: PARTNER_IDS.LINGOSTEP,
    coordinates: { x: 80, y: 70 },
    availableActions: ['TALK', 'QUEST'],
  },
];

export const WorldMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [affinityMap, setAffinityMap] = useState<Record<string, PartnerAffinity>>({});
  const [lastInteraction, setLastInteraction] = useState<InteractionResult | null>(null);

  const refreshAffinity = useCallback(() => {
    const data = affinityService.getAllAffinity();
    const map: Record<string, PartnerAffinity> = {};
    data.forEach(a => (map[a.partnerId] = a));
    setAffinityMap(map);
  }, []);

  useEffect(() => {
    refreshAffinity();
  }, [refreshAffinity]);

  const handleLocationClick = useCallback((loc: WorldLocation) => {
    setSelectedLocation(loc);
    setLastInteraction(null);
  }, []);

  const handleAction = useCallback(
    (action: string) => {
      if (!selectedLocation) return;

      if (action === 'FORTUNE') {
        const fortune = Math.random() > 0.5 ? 'Great Blessing' : 'Good Blessing';
        setLastInteraction({
          success: true,
          message: `[Wangdao Fortune] Your fortune today: ${fortune} - Favored: Driving change; Avoid: Rigid adherence.`,
          affinityGained: 10,
        });
        // Also update affinity behind scenes
        affinityService.performInteraction(selectedLocation.partnerId, 'CHAT');
        refreshAffinity();
        return;
      }

      const type = action === 'TALK' ? 'CHAT' : action === 'GIFT' ? 'GIFT' : 'QUEST';
      // Mock Gift Cost
      const params = action === 'GIFT' ? { value: 50 } : undefined;

      const result = affinityService.performInteraction(selectedLocation.partnerId, type, params);
      setLastInteraction(result);
      refreshAffinity();
    },
    [selectedLocation, refreshAffinity]
  );

  const handleEnter = useCallback(() => {
    if (!selectedLocation) return;

    // Navigation logic based on location
    switch (selectedLocation.id) {
      case 'esg_tower':
        navigate('/');
        break;
      case 'wangdao_citadel':
        navigate('/career');
        break;
      case 'samwells_lab':
        navigate('/skills');
        break;
      case 'freetime_cabin':
        navigate('/cabin');
        break;
      // case 'lingostep_hub': navigate('/news'); break;
      case 'lingostep_hub':
        navigate('/map');
        alert('Lingostep Hub is under construction! (Try News Center for now)');
        break;
      default:
        break;
    }
  }, [selectedLocation, navigate]);

  const currentAffinity = selectedLocation ? affinityMap[selectedLocation.partnerId] : null;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-100px)] overflow-hidden bg-[#0a0f1c] text-white rounded-3xl border border-slate-700 shadow-2xl">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {/* Abstract Grid/Map Graphic */}
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-[#0a0f1c] to-[#0a0f1c]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* Connection Lines (Visual candy) */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line
            x1="50%"
            y1="50%"
            x2="20%"
            y2="30%"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1="50%"
            y1="50%"
            x2="80%"
            y2="30%"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1="50%"
            y1="50%"
            x2="20%"
            y2="70%"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1="50%"
            y1="50%"
            x2="80%"
            y2="70%"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      <h2 className="absolute top-8 left-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 z-10 flex items-center gap-3">
        <span className="text-4xl text-white">🗺️</span> ESG World Map{' '}
        <span className="text-sm text-slate-500 font-mono ml-2">v1.2</span>
      </h2>

      {/* Location Pins */}
      {LOCATIONS.map(loc => (
        <button
          key={loc.id}
          onClick={() => handleLocationClick(loc)}
          style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 transition-all duration-300 ${selectedLocation?.id === loc.id ? 'scale-125 z-50' : 'hover:scale-110'}`}
        >
          <div
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors relative
                        ${selectedLocation?.id === loc.id ? 'border-amber-500 bg-slate-700' : 'border-slate-600 hover:border-cyan-400'}
                    `}
          >
            <span className="text-2xl">
              {loc.id === 'esg_tower'
                ? '🗼'
                : loc.id === 'wangdao_citadel'
                  ? '🏯'
                  : loc.id === 'samwells_lab'
                    ? '🔬'
                    : loc.id === 'freetime_cabin'
                      ? '⛺'
                      : '🌐'}
            </span>

            {/* Status Indicator */}
            {(affinityMap[loc.partnerId]?.level ?? 0) >= 5 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-slate-900 animate-bounce"
                title="Max Affinity!"
              ></div>
            )}
          </div>
          <div
            className={`absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 bg-slate-900/90 px-3 py-1 rounded text-sm font-bold border border-slate-700 transition-opacity ${selectedLocation?.id === loc.id ? 'opacity-100 text-amber-400' : 'opacity-0 group-hover:opacity-100 text-slate-300'}`}
          >
            {loc.name}
          </div>
        </button>
      ))}

      {/* Interaction Panel (Sidebar or Modal) */}
      {selectedLocation && (
        <div className="absolute right-0 top-0 h-full w-96 bg-slate-900/95 border-l border-slate-700 p-6 shadow-2xl animate-slideInRight z-30 backdrop-blur-md flex flex-col">
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mt-8 text-center flex-1">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-700 to-slate-800 mb-4 flex items-center justify-center text-4xl border-2 border-slate-600 shadow-inner">
              {selectedLocation.id === 'esg_tower'
                ? '🗼'
                : selectedLocation.id === 'wangdao_citadel'
                  ? '🏯'
                  : selectedLocation.id === 'samwells_lab'
                    ? '🔬'
                    : selectedLocation.id === 'freetime_cabin'
                      ? '⛺'
                      : '🌐'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{selectedLocation.name}</h3>
            <p className="text-slate-400 text-sm mb-6">{selectedLocation.description}</p>

            {/* Affinity Bar */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-300">
                  Friendship (Lv.{currentAffinity?.level || 1})
                </span>
                <span className="text-xs text-slate-500">
                  {currentAffinity?.currentExp || 0}/{currentAffinity?.maxExp || 100} EXP
                </span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                  style={{
                    width: `${((currentAffinity?.currentExp || 0) / (currentAffinity?.maxExp || 100)) * 100}%`,
                  }}
                ></div>
              </div>
              {(currentAffinity?.level || 0) >= 5 && (
                <div className="mt-2 text-xs text-amber-400 font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> Partner Maxed!
                </div>
              )}
            </div>

            {/* Interaction Feedback */}
            {lastInteraction && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm border ${lastInteraction.success ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' : 'bg-red-900/30 border-red-500/50 text-red-200'} animate-fade-in`}
              >
                {lastInteraction.message}
                {lastInteraction.affinityGained > 0 && (
                  <span className="block font-bold mt-1 text-pink-400">
                    +{lastInteraction.affinityGained} Friendship
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedLocation.availableActions.map(action => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-blue-500 transition-all text-sm font-bold flex flex-col items-center gap-1 group active:scale-95"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {action === 'TALK'
                      ? '💬'
                      : action === 'GIFT'
                        ? '🎁'
                        : action === 'FORTUNE'
                          ? '🥠'
                          : '⚔️'}
                  </span>
                  {action === 'FORTUNE' ? 'Daily Fortune' : action}
                </button>
              ))}
            </div>

            <button
              onClick={handleEnter}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Enter Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
