import React, { useMemo, memo } from 'react';
import {
  ExternalLink,
  Zap,
  Key,
  Crown,
  GraduationCap,
  Languages,
  Mountain,
  Factory,
  LucideIcon,
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
type HighlightLevel = 'core' | 'leader';

interface Partner {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly url?: string;
  readonly icon: React.ReactElement<{ className?: string }>;
  readonly tags: readonly string[];
  readonly highlight?: HighlightLevel;
}

interface CardStyleConfig {
  readonly cardStyle: string;
  readonly iconBg: string;
  readonly iconColor: string;
}

// ==================== CONSTANTS ====================
const PARTNERS: readonly Partner[] = [
  {
    id: 'jun-ai-key',
    name: 'JunAiKey 君愛元鑰',
    role: '數位主權・核心本源',
    description: 'AVOS 系統的靈魂中樞。以愛為鑰，賦予數據生命，是所有資產的「元點 (Origin)」。',
    icon: <Key className="w-6 h-6" />,
    tags: ['The Core', 'Sovereignty', 'Origin'],
    highlight: 'core',
  },
  {
    id: 'esg-sunshine',
    name: '善向永續 壽司博士',
    role: '知識權威・壽司博士領航',
    description:
      '由 壽司博士 (Dr. Sushi) 領軍，提供全台最權威的 ESG 方法學與教育資源，是系統的智慧大腦。',
    url: 'https://www.esgsunshine.com/',
    icon: <GraduationCap className="w-6 h-6" />,
    tags: ['Knowledge', 'Dr. Sushi', 'Education'],
    highlight: 'leader',
  },
  {
    id: 'adan-wang',
    name: '王道阿丹',
    role: '商業策略・影響力總帥',
    description: '雙核歸一的戰略領袖。融合 Stan哥 的社群號召力與深層商業智慧，引領生態系擴張。',
    icon: <Crown className="w-6 h-6" />,
    tags: ['Strategy', 'Influencer', 'Commander'],
  },
  {
    id: 'lingo-step',
    name: 'LingoStep 語文步驟',
    role: '全球語言橋樑',
    description: '打破語言藩籬，將台灣的 ESG 故事轉化為國際標準語言，連結世界資本。',
    url: 'https://www.lingostep.co',
    icon: <Languages className="w-6 h-6" />,
    tags: ['Global', 'Communication', 'Bridge'],
  },
  {
    id: 'freetime-gears',
    name: 'Freetimegears',
    role: '實體場域體驗',
    description: '將數位 ESG 積分轉化為真實的戶外體驗與綠色消費，連接人與自然。',
    url: 'https://www.freetimegears.com.tw/',
    icon: <Mountain className="w-6 h-6" />,
    tags: ['Outdoor', 'Experience', 'O2O'],
  },
  {
    id: 'samwells',
    name: '山衛科技 (Samwells)',
    role: '工業數據基石',
    description: '提供高精度的製造業檢測數據與技術支援，確保碳盤查的科學性。',
    url: 'https://www.samwells.com/h/Index?key=icm3i',
    icon: <Factory className="w-6 h-6" />,
    tags: ['Tech', 'Industrial Data', 'Precision'],
  },
] as const;

const TIFFANY_BLUE = '#0df2ee';

const STYLE_CONFIGS: Record<string, CardStyleConfig> = {
  core: {
    cardStyle:
      'bg-gradient-to-b from-primary/30 to-black border border-primary shadow-[0_0_40px_rgba(13,242,238,0.2)] transform md:-translate-y-2 hover:shadow-[0_0_60px_rgba(13,242,238,0.3)]',
    iconBg: 'bg-primary text-black border-primary shadow-[0_0_15px_#0df2ee]',
    iconColor: 'text-black',
  },
  leader: {
    cardStyle:
      'bg-gradient-to-b from-neutral-800 to-black border border-primary/50 shadow-[0_0_20px_rgba(13,242,238,0.05)] hover:shadow-[0_0_30px_rgba(13,242,238,0.1)]',
    iconBg: 'bg-neutral-800 text-primary border-primary/50',
    iconColor: 'text-primary',
  },
  default: {
    cardStyle:
      'bg-neutral-900/40 border border-white/5 hover:border-primary/50 hover:bg-neutral-900/60',
    iconBg: 'bg-black text-primary border-primary/20 group-hover:bg-primary/10',
    iconColor: 'text-primary',
  },
};

// ==================== UTILITY FUNCTIONS ====================
const getCardStyles = (highlight?: HighlightLevel): CardStyleConfig => {
  return (STYLE_CONFIGS[highlight ?? 'default'] ?? STYLE_CONFIGS.default) as CardStyleConfig;
};

// ==================== SUB-COMPONENTS ====================
interface PartnerCardProps {
  readonly partner: Partner;
}

const PartnerCard = memo(({ partner }: PartnerCardProps) => {
  const { cardStyle, iconBg, iconColor } = useMemo(
    () => getCardStyles(partner.highlight),
    [partner.highlight]
  );

  const handleCardClick = () => {
    if (partner.url) {
      window.open(partner.url, '_blank', 'noopener, noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && partner.url) {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className={`
                group relative flex flex-col justify-between
                p-5 rounded-xl transition-all duration-500
                ${cardStyle}
                ${partner.url ? 'cursor-pointer' : ''}
                focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-black
            `}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={partner.url ? 0 : undefined}
      role={partner.url ? 'link' : 'article'}
      aria-label={`${partner.name}: ${partner.role}`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full border transition-colors duration-300 ${iconBg}`}
              aria-hidden="true"
            >
              {React.cloneElement(partner.icon, {
                className: `w-6 h-6 ${iconColor}`,
              })}
            </div>
            <div>
              <h3
                className={`font-bold text-lg ${partner.highlight === 'core'
                  ? 'text-primary'
                  : 'text-gray-100 group-hover:text-primary transition-colors'
                  }`}
              >
                {partner.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono tracking-wide">{partner.role}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed border-l-2 border-primary/20 pl-3">
          {partner.description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Partner tags">
          {partner.tags.map(tag => (
            <span
              key={tag}
              className={`
                                text-[10px] px-2 py-0.5 rounded border
                                ${partner.highlight === 'core'
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-white/5 text-gray-500 border-white/5 group-hover:border-primary/20 group-hover:text-gray-400'
                }
                            `}
              role="listitem"
            >
              #{tag}
            </span>
          ))}
        </div>

        {partner.url ? (
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/5 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded transition-all group-hover:shadow-[0_0_15px_rgba(13,242,238,0.1)] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Visit ${partner.name} website`}
          >
            <span>Access Portal</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        ) : (
          <div
            className={`
                        flex items-center justify-center gap-2 w-full py-2.5 
                        text-xs font-bold uppercase tracking-widest rounded cursor-default
                        ${partner.highlight === 'core'
                ? 'bg-primary text-black shadow-[0_0_15px_rgba(13,242,238,0.4)]'
                : 'bg-neutral-800 border border-white/5 text-gray-600'
              }
                    `}
          >
            <span>{partner.highlight === 'core' ? 'System Core Active' : 'Internal Node'}</span>
          </div>
        )}
      </div>
    </article>
  );
});

PartnerCard.displayName = 'PartnerCard';

// ==================== MAIN COMPONENT ====================
export const StrategicPartners: React.FC = memo(() => {
  const partnerCards = useMemo(
    () => PARTNERS.map(partner => <PartnerCard key={partner.id} partner={partner} />),
    []
  );

  return (
    <section
      className="w-full bg-black/60 border border-primary/30 rounded-xl p-8 backdrop-blur-md shadow-2xl shadow-black/50"
      aria-labelledby="strategic-partners-heading"
    >
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-black rounded-lg border border-primary/20">
            <Zap className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="strategic-partners-heading"
              className="text-2xl font-bold text-white tracking-widest uppercase"
            >
              Sovereign Alliance{' '}
              <span className="text-primary text-sm font-normal normal-case ml-2">
                / 數位主權生態系
              </span>
            </h2>
            <div
              className="h-0.5 w-full bg-gradient-to-r from-primary to-transparent mt-1"
              aria-hidden="true"
            ></div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-primary font-mono border border-primary/30 px-3 py-1 rounded-full bg-primary/5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
          <span role="status" aria-live="polite">
            ECOSYSTEM INTEGRITY: 100%
          </span>
        </div>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Strategic partners"
      >
        {partnerCards}
      </div>
    </section>
  );
});

StrategicPartners.displayName = 'StrategicPartners';
