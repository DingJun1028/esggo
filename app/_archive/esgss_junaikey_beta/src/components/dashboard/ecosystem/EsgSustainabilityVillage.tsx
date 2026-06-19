import React, { useState } from 'react';
import {
  Key,
  GraduationCap,
  Crown,
  Languages,
  Mountain,
  Factory,
  X,
  ExternalLink,
  MapPin,
  Users,
  Store,
  Library,
  Landmark,
  Tent,
  Zap,
} from 'lucide-react';
import { Button, Badge, Dialog, DialogContent } from '@/components/ui';

// ==================== TYPE DEFINITIONS ====================
interface VillageBuilding {
  id: string;
  name: string;
  type: string; // e.g., "Town Hall", "Library"
  partnerName: string;
  description: string;
  icon: React.ReactNode;
  color: string; // Hex color for highlights
  gridPos: string; // Tailwind grid position classes (e.g., "col-span-2 row-span-2")
  url?: string;
  quests: string[]; // List of available "missions" or interaction points
  coordinates: { x: number; y: number }; // For visual placement calculation
}

// ==================== DATA: THE VILLAGE MAP ====================
const VILLAGE_BUILDINGS: VillageBuilding[] = [
  {
    id: 'core-town-hall',
    name: 'The Golden Town Hall',
    type: 'Governance Center',
    partnerName: 'JunAiKey 萬能元鑰',
    description:
      'The heart of the village. All digital sovereignty decrees and 4+1 Protocol verifications happen here.',
    icon: <Landmark size={32} />,
    color: '#FFD700',
    gridPos: 'col-span-2 row-span-2',
    quests: ['Verify 4+1 Protocol Status', 'Issue Digital Identity', 'Review Constitution'],
    coordinates: { x: 50, y: 50 },
  },
  {
    id: 'sushi-library',
    name: 'Great Library of Sushi',
    type: 'Knowledge Archive',
    partnerName: 'ESG Sunshine Dr. Sushi',
    description:
      'A vast repository of ESG methodologies. Scholars gather here to study the ancient and future laws of sustainability.',
    icon: <Library size={28} />,
    color: '#34D399',
    gridPos: 'col-span-1 row-span-1',
    url: 'https://www.esgsunshine.com/',
    quests: ['Read "The Green Paper"', "Attend Dr. Sushi's Lecture", 'Search GRI Standards'],
    coordinates: { x: 20, y: 30 },
  },
  {
    id: 'adan-war-room',
    name: 'Strategy War Room',
    type: 'Command Center',
    partnerName: 'Adan Wang (Commander)',
    description:
      'Where the village elders plan the expansion of the ecosystem. Maps of the known world line the walls.',
    icon: <Crown size={28} />,
    color: '#F87171', // Red
    gridPos: 'col-span-1 row-span-1',
    quests: ['View Strategic Roadmap', 'Join the Vanguard', 'Resource Allocation'],
    coordinates: { x: 80, y: 30 },
  },
  {
    id: 'lingo-tower',
    name: 'Tower of Tongues',
    type: 'Communications Spire',
    partnerName: 'LingoStep',
    description:
      "A high-tech spire broadcasting the village's achievements to the world in every language known to man.",
    icon: <Languages size={28} />,
    color: '#60A5FA', // Blue
    gridPos: 'col-span-1 row-span-2',
    url: 'https://www.lingostep.co',
    quests: ['Translate Impact Report', 'Global Broadcast', 'Learn Business English'],
    coordinates: { x: 85, y: 70 },
  },
  {
    id: 'freetime-guild',
    name: "Adventurer's Guild",
    type: 'Marketplace',
    partnerName: 'Freetime Gears',
    description:
      'Where digital tokens transform into real-world gear. Adventurers prepare for their journeys into nature here.',
    icon: <Tent size={28} />,
    color: '#A3E635', // Lime
    gridPos: 'col-span-1 row-span-1',
    url: 'https://www.freetimegears.com.tw/',
    quests: ['Redeem Impact Points', 'Buy Sustainable Gear', 'Organize Hiking Trip'],
    coordinates: { x: 15, y: 80 },
  },
  {
    id: 'samwells-foundry',
    name: 'The Tech Foundry',
    type: 'Industrial Hub',
    partnerName: 'Samwells',
    description:
      'The noise of machines never stops. Here, raw data is refined into precise measurements for the carbon ledgers.',
    icon: <Factory size={28} />,
    color: '#818CF8', // Indigo
    gridPos: 'col-span-1 row-span-1',
    url: 'https://www.samwells.com',
    quests: ['Calibrate Sensors', 'Upload Production Data', 'Optimize Efficiency'],
    coordinates: { x: 35, y: 85 },
  },
];

// ==================== COMPONENT: BUILDING CARD ====================
const BuildingCard: React.FC<{
  building: VillageBuilding;
  onClick: (b: VillageBuilding) => void;
}> = ({ building, onClick }) => {
  return (
    <div
      onClick={() => onClick(building)}
      className={`
                group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 
                hover:border-[${building.color}] hover:bg-[${building.color}]/5 hover:shadow-[0_0_20px_${building.color}30]
                transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-4
                ${building.gridPos}
            `}
      style={{
        // Dynamic border color on hover using style for variable color
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Background Glow */}
      <div
        className={`absolute inset-0 bg-[${building.color}]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Icon */}
      <div
        className={`mb-3 p-4 rounded-full bg-black/60 border border-white/10 group-hover:scale-110 transition-transform duration-300`}
        style={{ color: building.color, borderColor: `${building.color}40` }}
      >
        {building.icon}
      </div>

      {/* Label */}
      <div className="text-center z-10">
        <h3 className="text-sm font-bold text-gray-200 group-hover:text-white uppercase tracking-wider mb-1">
          {building.name}
        </h3>
        <p
          className="text-[10px] text-gray-500 font-mono group-hover:text-[${building.color}]"
          style={{ color: building.color }}
        >
          {building.partnerName}
        </p>
      </div>

      {/* "Visit" Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
        <Badge className="bg-white/10 backdrop-blur-sm text-[9px] hover:bg-white/20">VISIT</Badge>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export const EsgSustainabilityVillage: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<VillageBuilding | null>(null);

  return (
    <section className="w-full relative">
      {/* Village Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/30">
            <MapPin className="text-[#FFD700]" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-100 uppercase tracking-widest">
              ESG World Good Village
            </h2>
            <p className="text-[10px] text-emerald-500 font-mono tracking-wider">
              SUSTAINABILITY_ECOSYSTEM_V1.0
            </p>
          </div>
        </div>

        {/* Village Stats */}
        <div className="flex gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Population</span>
            <span className="text-xs font-mono text-gray-300">8,421 Villagers</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Happiness</span>
            <span className="text-xs font-mono text-[#FFD700]">99.8%</span>
          </div>
        </div>
      </div>

      {/* The Isometric Village Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4 h-[500px] w-full p-4 bg-[#0a0f1e] rounded-[32px] border border-white/5 relative overflow-hidden shadow-inner">
        {/* Decorative Grid Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {VILLAGE_BUILDINGS.map(building => (
          <BuildingCard key={building.id} building={building} onClick={setSelectedBuilding} />
        ))}
      </div>

      {/* Building Interaction Modal */}
      {selectedBuilding && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBuilding(null)}
        >
          <div
            className="bg-[#0f172a] w-full max-w-lg rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Abstract Header Art */}
            <div className="h-32 w-full relative overflow-hidden bg-black">
              <div
                className="absolute inset-0 opacity-30"
                style={{ backgroundColor: selectedBuilding.color }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {React.cloneElement(selectedBuilding.icon as React.ReactElement<any>, {
                  size: 64,
                  className: 'text-white/20',
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-4 right-4 rounded-full h-8 w-8 p-0 bg-black/40 hover:bg-black/60 text-white border border-white/10"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="items-start gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                    {selectedBuilding.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/10 text-gray-400 text-[10px] uppercase tracking-wider"
                    >
                      {selectedBuilding.type}
                    </Badge>
                    <span className="text-[10px] text-emerald-500 font-mono">
                      // {selectedBuilding.partnerName}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-8 border-l-2 border-white/10 pl-4">
                {selectedBuilding.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Available Missions
                </h4>
                {selectedBuilding.quests.map((quest, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#FFD700] transition-colors" />
                      <span className="text-xs text-gray-300 font-mono">{quest}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#FFD700] text-black text-[9px] hover:bg-[#FFD700]">
                        START
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                {selectedBuilding.url ? (
                  <Button
                    className="bg-white text-black hover:bg-gray-200 font-bold tracking-wide"
                    onClick={() => window.open(selectedBuilding.url, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-2" />
                    Visit Partner Site
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-800 text-gray-500 cursor-not-allowed">
                    Access Restricted (Internal)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
