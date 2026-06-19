import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BrainCircuit,
  Newspaper,
  MessageSquare,
  TrendingUp,
  Activity,
  CloudFog,
  FlaskConical,
  Map,
  Banknote,
  FileText,
  Lock,
  Contact,
  ShieldAlert,
  PieChart,
  Hammer,
  Grid,
  GitBranch,
  Bell,
  Users,
  GraduationCap,
  Truck,
  Briefcase,
  Globe,
  ChevronRight,
  ShieldCheck,
  Box,
} from 'lucide-react';
import {
  ESG_SERVICES_REGISTRY,
  ServiceCategory,
  ServiceDefinition,
} from '../../services/ServiceRegistry';
import { useLocalization } from '../../contexts/LocalizationContext';

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  BrainCircuit,
  Newspaper,
  MessageSquare,
  TrendingUp,
  Activity,
  CloudFog,
  FlaskConical,
  Map,
  Banknote,
  FileText,
  Lock,
  Contact,
  ShieldAlert,
  PieChart,
  Hammer,
  Grid,
  GitBranch,
  Bell,
  Users,
  GraduationCap,
  Truck,
  Briefcase,
  Globe,
};

// Category names now handled by useLocalization

export const SovereignServicePortal: React.FC = () => {
  const { t } = useLocalization();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const categories: (ServiceCategory | 'All')[] = [
    'All',
    'Cognitive',
    'Excellence',
    'Governance',
    'Agency',
    'Ecosystem',
  ];

  const filteredServices =
    activeCategory === 'All'
      ? ESG_SERVICES_REGISTRY
      : ESG_SERVICES_REGISTRY.filter(s => s.category === activeCategory);

  return (
    <div className="relative min-h-[600px] w-full p-8 rounded-[32px] bg-[var(--color-panel)] backdrop-blur-2xl border border-[var(--color-border)] overflow-hidden shadow-2xl transition-colors duration-700">
      {/* Background Optical Effects (Floating Integrated Aura) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-10 blur-[120px] rounded-full animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)] opacity-10 blur-[120px] rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" />
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
              {t('portal.title')}
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm tracking-[0.2em] font-bold uppercase ml-5 opacity-80">
            {t('portal.subtitle')}
          </p>
        </header>

        {/* Category Navigation (終始矩陣) */}
        <div className="flex flex-wrap gap-4 mb-10">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border shadow-lg ${
                activeCategory === cat
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-slate-900 shadow-[var(--omni-glow)]'
                  : 'bg-[var(--color-panel)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {cat === 'All' ? t('nav.all_pillars') : t(`nav.${cat.toLowerCase()}`)}
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.uuid}
                service={service}
                isHovered={hoveredService === service.uuid}
                onHover={() => setHoveredService(service.uuid)}
                onLeave={() => setHoveredService(null)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ServiceCard: React.FC<{
  service: ServiceDefinition;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}> = ({ service, isHovered, onHover, onLeave }) => {
  const Icon = ICON_MAP[service.icon] || LayoutDashboard;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative h-[240px] p-6 rounded-2xl bg-[var(--color-panel)] backdrop-blur-md border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-[var(--omni-glow)]"
    >
      {/* Liquid Glass Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-700`}
      />

      {/* Logic Gate Status Light */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] opacity-80">
        <div
          className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)] ${
            service.status === 'Trustworthy' ? 'bg-[var(--color-primary)]' : 'bg-amber-400'
          }`}
        />
        <span className="text-[8px] uppercase tracking-tighter text-[var(--color-text-secondary)] font-black">
          5T Gate: {service.status}
        </span>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-panel)] border border-[var(--color-border)] mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-hover:border-[var(--color-primary)]">
          <Icon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>

        <h3 className="text-sm font-black text-[var(--color-text-primary)] mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors uppercase tracking-wide">
          {service.name}
        </h3>

        <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-3 mb-auto font-medium leading-relaxed">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(gate => (
              <div
                key={gate}
                className="w-1.5 h-3 rounded-full bg-[var(--color-primary)] opacity-10 group-hover:opacity-40 transition-opacity"
              />
            ))}
          </div>
          <motion.div
            animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
            className="text-[var(--color-primary)]"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      {/* Evidence Metadata (Optical Popup) - Floating Style */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 p-3 bg-[var(--color-bg)] backdrop-blur-3xl border border-[var(--color-primary)] rounded-xl z-20 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-[var(--color-primary)]" />
                <span className="text-[9px] text-[var(--color-text-primary)] font-black">
                  HASH INTEGRITY
                </span>
              </div>
              <span className="text-[8px] text-[var(--color-primary)] font-mono font-bold tracking-widest">
                {service.evidence.hash.slice(0, 12)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Box className="w-3 h-3 text-[var(--color-secondary)]" />
                <span className="text-[9px] text-[var(--color-text-secondary)] font-bold">
                  SOURCE ORIGIN
                </span>
              </div>
              <span className="text-[8px] text-[var(--color-text-muted)] font-mono">
                {service.evidence.sourceOrigin}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
