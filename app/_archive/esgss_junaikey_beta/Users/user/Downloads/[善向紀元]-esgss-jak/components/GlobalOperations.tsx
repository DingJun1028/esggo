
import React, { useState, useMemo } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
// Fix: Added missing Globe icon to lucide-react imports
import { MapPin, Wind, Zap, AlertTriangle, Factory, X, MousePointer2, TrendingUp, Activity, ShieldCheck, Loader2, Search, ExternalLink, Maximize2, Target, Gauge, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { performMapQuery } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';

interface Location {
  id: string;
  name: string;
  region: string;
  x: number; 
  y: number; 
  status: 'optimal' | 'warning' | 'critical';
  metrics: {
    co2: string;
    energy: string;
    output: string;
    trend: { time: string; value: number }[];
  };
}

const MOCK_TREND = [
    { time: '08:00', value: 40 }, { time: '10:00', value: 35 }, { time: '12:00', value: 55 },
    { time: '14:00', value: 48 }, { time: '16:00', value: 42 }, { time: '18:00', value: 30 }
];

const LOCATIONS: Location[] = [
  { id: 'tpe', name: 'Taipei HQ', region: 'APAC', x: 82, y: 45, status: 'optimal', metrics: { co2: '120t', energy: '450kWh', output: '100%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value + 10 })) } },
  { id: 'ber', name: 'Berlin Plant', region: 'EMEA', x: 52, y: 32, status: 'optimal', metrics: { co2: '340t', energy: '890kWh', output: '98%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value + 20 })) } },
  { id: 'aus', name: 'Austin R&D', region: 'NA', x: 22, y: 42, status: 'warning', metrics: { co2: '85t', energy: '320kWh', output: '85%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value - 5 })) } },
  { id: 'hcm', name: 'Ho Chi Minh', region: 'APAC', x: 78, y: 55, status: 'critical', metrics: { co2: '560t', energy: '1.2MWh', output: '110%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value * 1.5 })) } },
];

interface MapPinProps extends InjectedProxyProps {
    location: Location;
    isSelected: boolean;
    onClick: (loc: Location) => void;
}

const MapPinBase: React.FC<MapPinProps> = ({ location, isSelected, onClick, trackInteraction, isAgentActive }) => {
    const statusColor = location.status === 'critical' ? 'bg-rose-500' : location.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
    
    return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker z-20"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          onClick={(e) => { 
              e.stopPropagation(); 
              trackInteraction?.('click', { locId: location.id });
              onClick(location); 
          }}
        >
          <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${statusColor} ${isSelected ? 'scale-150' : 'scale-100'}`} />
          <div className={`relative rounded-full border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 ${statusColor} ${isSelected ? 'w-10 h-10 border-white scale-110' : 'w-5 h-5 border-white/40 group-hover/marker:scale-125 group-hover/marker:border-white'}`}>
              {isSelected && <Target className="absolute inset-0 m-auto w-5 h-5 text-white animate-spin-slow" />}
          </div>
          
          {/* Label Preview on Hover */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900/90 border border-white/10 rounded text-[9px] font-black text-white whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity z-30 pointer-events-none">
              {location.name.toUpperCase()}
          </div>
        </div>
    );
};

const GeoSpatialAgent = withUniversalProxy(MapPinBase);

export const GlobalOperations: React.FC = () => {
  const { addToast } = useToast();
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerifySite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLoc) return;
    setIsVerifying(true);
    setVerificationResult(null);
    addToast('info', `Initiating Google Maps Grounding for ${selectedLoc.name}...`, 'AI Geo-Audit');
    
    try {
        const result = await performMapQuery(`${selectedLoc.name} in ${selectedLoc.region}`, 'zh-TW');
        setVerificationResult(result);
        addToast('success', 'Geospatial verification sequence complete.', 'System');
    } catch (e) {
        addToast('error', 'Verification service transient fault.', 'Error');
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] relative rounded-[3rem] overflow-hidden bg-slate-950 border border-white/5 select-none shadow-2xl group/map" onClick={() => { setSelectedLoc(null); setVerificationResult(null); }}>
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <svg width="100%" height="100%" className="fill-celestial-blue">
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" opacity="0.5" /></pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-grid)" />
         </svg>
      </div>

      {/* World Map Background Simulation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] grayscale pointer-events-none transition-all duration-1000 group-hover/map:opacity-[0.05]">
          <Globe className="w-[800px] h-[800px] animate-spin-slow" />
      </div>

      {/* Map Pins */}
      {LOCATIONS.map((loc) => (
        <GeoSpatialAgent key={loc.id} id={`geo-${loc.id}`} label={loc.name} location={loc} isSelected={selectedLoc?.id === loc.id} onClick={setSelectedLoc} />
      ))}

      {/* Detail Overlay Drawer */}
      {selectedLoc && (
        <div 
            className="absolute bottom-6 right-6 w-[450px] glass-panel p-8 rounded-[2.5rem] border border-white/20 animate-slide-up backdrop-blur-3xl bg-slate-900/90 z-50 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col gap-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-black/40 border border-white/10 ${selectedLoc.status === 'critical' ? 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                        <Factory className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="zh-main text-2xl text-white tracking-tighter">{selectedLoc.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                            <MapPin className="w-3 h-3 text-celestial-blue" /> {selectedLoc.region} • FACILITY_ID: 0x{selectedLoc.id.toUpperCase()}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => { setSelectedLoc(null); setVerificationResult(null); }} 
                    className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Metric Cells */}
            <div className="grid grid-cols-2 gap-3">
                <OmniEsgCell mode="list" label="Carbon Flow" value={selectedLoc.metrics.co2} icon={Wind} color={selectedLoc.status === 'critical' ? 'rose' : 'emerald'} />
                <OmniEsgCell mode="list" label="Energy Demand" value={selectedLoc.metrics.energy} icon={Zap} color="gold" />
            </div>

            {/* Real-time Trend Chart */}
            <div className="bg-black/40 rounded-[2rem] border border-white/5 p-6 h-48 relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-400" /> Emission_Intensity_Pulse
                    </div>
                    <span className="text-[10px] font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">LIVE_TELEMETRY</span>
                </div>
                <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={100}>
                        <AreaChart data={selectedLoc.metrics.trend}>
                            <defs>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} fill="url(#colorTrend)" strokeWidth={2} />
                            <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Grounding Verification Section */}
            <div className="pt-2 border-t border-white/5">
                {!verificationResult ? (
                    <button 
                        onClick={handleVerifySite}
                        disabled={isVerifying}
                        className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-celestial-gold active:scale-95 disabled:opacity-50 group/btn"
                    >
                        {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-celestial-blue group-hover/btn:animate-pulse" />}
                        <span className="text-sm font-black uppercase tracking-widest">Verify via Google Maps AI</span>
                    </button>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden shadow-inner">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-20 h-20 text-emerald-400" /></div>
                            <div className="text-[10px] font-black text-emerald-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
                                <ShieldCheck className="w-4 h-4 shadow-[0_0_10px_#10b981]" /> AI_GROUNDED_VERIFICATION_SUCCESS
                            </div>
                            <p className="text-xs text-gray-200 leading-relaxed italic font-medium">
                                {verificationResult.text}
                            </p>
                            {verificationResult.sources?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {verificationResult.sources.map((s: any, idx: number) => {
                                        const uri = s.maps?.uri || s.web?.uri;
                                        if (!uri) return null;
                                        return (
                                            <a 
                                                key={idx} 
                                                href={uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-celestial-blue hover:bg-white/10 flex items-center gap-1.5 transition-all shadow-lg"
                                            >
                                                <MapPin className="w-2.5 h-2.5" /> {s.maps?.title || "Live Context"}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Floating HUD */}
      <div className="absolute top-8 left-8 flex flex-col gap-6 text-[10px] text-celestial-blue font-mono z-10">
          <div className="flex flex-col gap-2 p-4 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /> <span>KERNEL_OPERATIONAL_STABLE</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" /> <span>MAPS_GROUNDING_2.5_FLASH</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> <span>RISK_DETECTION_ACTIVE</span></div>
          </div>
          
          <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md space-y-4">
              <div className="flex justify-between gap-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  <span>Global_Sync_Status</span>
                  <span className="text-emerald-400">99.8%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '99.8%' }} />
              </div>
          </div>
      </div>

      {/* Helper Legend */}
      <div className="absolute bottom-8 left-8 flex gap-4 pointer-events-none">
          <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
              <MousePointer2 className="w-4 h-4 text-gray-500" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Click_Pin_to_Inspect</span>
          </div>
      </div>
    </div>
  );
};