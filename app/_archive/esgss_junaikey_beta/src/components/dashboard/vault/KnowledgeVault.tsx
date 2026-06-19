import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Search,
  Filter,
  Cpu,
  Zap,
  Lock,
  Shield,
  ShieldCheck,
  Terminal,
  History,
  FileText,
  Share2,
  Bot,
  Box,
  Fingerprint,
  Scan,
  UserCheck,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { LogEntry, LogCategory } from '@/services/omniLogger';

import type { Language } from '@/types';

interface KnowledgeVaultProps {
  logs: LogEntry[];
  systemHealth?: any;
  language?: Language;
}

type ViewMode = 'CORE' | 'LINK' | 'IDENTITY';

// Omni Tags System
const OMNI_TAGS: Record<string, { color: string; label: string }> = {
  SYSTEM: { color: 'text-cyan-400 border-cyan-500/30', label: 'SYS_CORE' },
  SECURITY: { color: 'text-amber-400 border-amber-500/30', label: 'SEC_NET' },
  AI: { color: 'text-purple-400 border-purple-500/30', label: 'PSI_LINK' },
  USER: { color: 'text-emerald-400 border-emerald-500/30', label: 'HUMAN_IO' },
  DEFAULT: { color: 'text-gray-400 border-gray-500/30', label: 'RAW_DAT' },
};

export const KnowledgeVault: React.FC<KnowledgeVaultProps> = ({
  logs = [],
  systemHealth,
  language = 'zh-TW',
}) => {
  const isZh = language === 'zh-TW';
  const [viewMode, setViewMode] = useState<ViewMode>('CORE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registerStep, setRegisterStep] = useState(0);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details &&
          JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory ? log.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchQuery, selectedCategory]);

  const categories = Array.from(new Set(logs.map(log => log.category)));

  const handleRegister = () => {
    setRegisterStep(1);
    setTimeout(() => setRegisterStep(2), 1500);
    setTimeout(() => {
      setIsRegistered(true);
      setRegisterStep(3);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-4 lg:p-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <Database className="text-indigo-500" size={32} />
            {isZh ? '全域智庫' : 'OMNI THINK TANK'}
            {isRegistered && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
                ID: {isZh ? '千面人格' : 'THOUSAND_FACES'}
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 font-mono text-xs mt-1 tracking-widest uppercase pl-11">
            {isZh ? '水晶記憶與身份登記中心' : 'Crystal Memory & Identity Registry'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
          <Button
            variant={viewMode === 'CORE' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('CORE')}
            className={viewMode === 'CORE' ? 'bg-indigo-600' : 'text-gray-400'}
          >
            <Box size={14} className="mr-2" /> {isZh ? '核心' : 'CORE'}
          </Button>
          <Button
            variant={viewMode === 'LINK' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('LINK')}
            className={viewMode === 'LINK' ? 'bg-indigo-600' : 'text-gray-400'}
          >
            <Bot size={14} className="mr-2" /> {isZh ? '神經連結' : 'NEURAL LINK'}
          </Button>
          <Button
            variant={viewMode === 'IDENTITY' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('IDENTITY')}
            className={viewMode === 'IDENTITY' ? 'bg-indigo-600' : 'text-gray-400'}
          >
            <Fingerprint size={14} className="mr-2" /> {isZh ? '身份' : 'IDENTITY'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT PANEL: VISUALIZATION */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <Card className="flex-1 bg-black/40 border-indigo-500/30 backdrop-blur-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-700" />

            {/* Interactive Visual based on Mode */}
            <div className="relative z-10 flex-1 h-full min-h-[300px] flex items-center justify-center perspective-[1000px]">
              <AnimatePresence mode="wait">
                {viewMode === 'CORE' && (
                  <motion.div
                    key="core"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative w-48 h-48 preserve-3d"
                  >
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                    <motion.div
                      animate={{ rotateY: 360, rotateX: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-2 border-indigo-400/30 bg-indigo-900/10 transform rotate-45 backdrop-blur-sm shadow-[0_0_30px_indigo]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Database size={48} className="text-white drop-shadow-[0_0_10px_white]" />
                    </div>
                  </motion.div>
                )}

                {viewMode === 'IDENTITY' && (
                  <motion.div
                    key="identity"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-40 h-40 mb-6">
                      <div className="absolute inset-0 border-4 border-dashed border-emerald-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-2 border-2 border-emerald-500/50 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isRegistered ? (
                          <ShieldCheck
                            size={64}
                            className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                          />
                        ) : (
                          <Fingerprint size={64} className="text-gray-500" />
                        )}
                      </div>
                      {registerStep === 1 && (
                        <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-full" />
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {isRegistered
                          ? isZh
                            ? '身份已驗證'
                            : 'IDENTITY VERIFIED'
                          : isZh
                            ? '未登記實體'
                            : 'UNREGISTERED ENTITY'}
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        {isRegistered
                          ? isZh
                            ? '協定: 千面人格'
                            : 'Protocol: Thousand Faces'
                          : isZh
                            ? '訪問受限'
                            : 'Access Restricted'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: DATA & INTERACTION */}
        <div className="flex-1 flex flex-col gap-4 bg-gray-900/30 rounded-2xl border border-white/5 p-4 overflow-hidden">
          {/* IDENTITY REGISTRATION MODE */}
          {viewMode === 'IDENTITY' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
              {!isRegistered ? (
                <>
                  <div className="text-center space-y-4 max-w-md">
                    <Shield size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-2xl font-bold text-white">
                      {isZh ? '需要安全協定' : 'Security Protocol Required'}
                    </h3>
                    <p className="text-gray-400">
                      {isZh
                        ? '要訪問全域智庫的深層結構，您必須在系統核心登記您的認知特徵。'
                        : "To access the Omni Think Tank's deeper layers, you must register your cognitive signature with the System Core."}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleRegister}
                    disabled={registerStep > 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-widest px-8 py-6 h-auto text-lg glow-button"
                  >
                    {registerStep === 0 && (isZh ? '初始化登記' : 'INITIALIZE REGISTRATION')}
                    {registerStep === 1 && (isZh ? '掃描生物特徵...' : 'SCANNING BIOMETRICS...')}
                    {registerStep === 2 &&
                      (isZh ? '驗證突觸模式...' : 'VERIFYING SYNAPSE PATTERNS...')}
                    {registerStep === 3 && (isZh ? '准許訪問' : 'ACCESS GRANTED')}
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <UserCheck size={24} className="text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-emerald-300">
                          {isZh ? '身份已激活' : 'Identity Active'}
                        </h4>
                        <p className="text-xs text-emerald-500/70 font-mono">
                          Session: SECURE_ENCRYPTED_SHA256
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      {isZh ? '管理' : 'MANAGE'}
                    </Button>
                  </div>

                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">
                    Registered Omni-Tags
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(OMNI_TAGS).map(([key, config]) => (
                      <div
                        key={key}
                        className={`p-3 rounded border bg-black/40 flex items-center justify-between ${config.color.replace('text-', 'border-')}`}
                      >
                        <span className={`font-bold ${config.color.split(' ')[0]}`}>{key}</span>
                        <Badge variant="secondary" className="bg-white/5">
                          {config.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CORE / DATA MODE */}
          {viewMode !== 'IDENTITY' && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <Input
                    placeholder={isZh ? '搜尋阿卡西紀錄...' : 'Search Akashic Records...'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-black/50 border-gray-700 pl-10 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === null ? 'primary' : 'outline'}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                    className="text-xs"
                  >
                    {isZh ? '全部' : 'ALL'}
                  </Button>
                  {categories.slice(0, 3).map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'primary' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                      size="sm"
                      className="text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Logs List with Omni Tags */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => {
                    const tagConfig = OMNI_TAGS[log.category] ||
                      OMNI_TAGS['DEFAULT'] || { color: 'text-gray-400', label: 'UNKNOWN' };
                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all group flex gap-4"
                      >
                        <div className="w-16 flex flex-col items-center justify-center pt-1">
                          <span className="font-mono text-[10px] text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <div
                            className={`h-full w-0.5 mt-2 bg-gradient-to-b from-gray-800 to-transparent`}
                          />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 rounded-sm font-mono border-opacity-50 ${tagConfig.color}`}
                            >
                              {tagConfig.label}
                            </Badge>
                            <span className="text-xs text-indigo-300/60 font-mono tracking-wider">
                              :: {log.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 font-sans leading-relaxed">
                            {log.message}
                          </p>
                          {!!log.details && (
                            <div className="mt-2 p-2 rounded bg-black/40 border border-white/5 text-[10px] text-gray-500 font-mono overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <Database size={48} className="mb-4 text-indigo-900" />
                    <p>{isZh ? '未發現記憶紀錄' : 'No Memory Records Found'}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
