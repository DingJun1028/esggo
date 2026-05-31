// app/App_modified.tsx (Updated with TopBar and SideBar)
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, GitBranch, Zap, Layers, Crown, ChevronLeft, ChevronRight, Menu, Book, Plus, Sun, Moon, X, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import SkillTreeView from './components/SkillTreeView';
import StoryView from './components/StoryView';
import { LiquidGlassUI } from '../components/brand/LiquidGlassUI_modified'; // Import modified LiquidGlassUI
import FloatingKey from '../components/FloatingKey'; // Import the new FloatingKey component

const voiceLines = [
  '「任務已接入，開始建立全域上下文。」',
  '「資訊並不混亂，只是尚未被正確排序。」',
  '「答案從不是終點。現在，輸出結果。」',
  '「將目標轉化為結果。」',
];

export default function App() {
  const [currentView, setCurrentView] = useState<'card' | 'skillTree' | 'story'>('card');
  const [currentVoiceLine, setCurrentVoiceLine] = useState(0);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false); // For desktop floating menu
  const [showSidebar, setShowSidebar] = useState(false); // For mobile sidebar
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVoiceLine((prev) => (prev + 1) % voiceLines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleMobileFunctionKey = () => {
    alert('Mobile Specialized Function Key Activated!');
    // Implement specific mobile action here
  };

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
  };

  // Common button classes for navigation
  const navButtonClasses = (view: 'card' | 'skillTree' | 'story') =>
    `w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
      currentView === view
        ? (theme === 'dark' ? 'bg-[#55C7FF]/20 text-[#55C7FF]' : 'bg-blue-100 text-blue-700')
        : (theme === 'dark' ? 'text-[#8FA9C2] hover:bg-[#16324F]' : 'text-gray-700 hover:bg-gray-200')
    }`;

  if (currentView === 'skillTree') {
    return (
      <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-[#070B14]' : 'bg-gray-100'}`}>
        <button
          onClick={() => setCurrentView('card')}
          className={`absolute top-4 left-4 z-50 px-4 py-2 ${theme === 'dark' ? 'bg-[#101C2E]/80 text-[#55C7FF]' : 'bg-gray-200 text-gray-800'} rounded-lg border ${theme === 'dark' ? 'border-[#55C7FF]/50' : 'border-gray-400'} hover:${theme === 'dark' ? 'bg-[#16324F]' : 'bg-gray-300'} transition-colors flex items-center gap-2 backdrop-blur-sm`}
        >
          <ChevronLeft className="w-4 h-4" />
          返回角色卡
        </button>
        <SkillTreeView />
      </div>
    );
  }

  if (currentView === 'story') {
    return <StoryView onBack={() => setCurrentView('card')} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#070B14]' : 'bg-gray-100'} flex flex-col relative overflow-hidden`}
    >
      {/* Particle Background - simplified for brevity, theme-awareness would be complex */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${theme === 'dark' ? 'bg-[#55C7FF]' : 'bg-blue-500'} rounded-full`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* TopBar */}
      <LiquidGlassUI resonance={0.7} theme={theme} className="w-full h-16 flex items-center justify-between p-4 md:px-8 z-40 rounded-none">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white" onClick={() => setShowSidebar(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'}`}>ESGGO OmniAgent</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop Nav - hidden on mobile */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => setCurrentView('card')}
              className={navButtonClasses('card')}
            >
              <Home className="w-4 h-4" />
              角色卡
            </button>
            <button
              onClick={() => setCurrentView('skillTree')}
              className={navButtonClasses('skillTree')}
            >
              <GitBranch className="w-4 h-4" />
              技能樹
            </button>
            <button
              onClick={() => setCurrentView('story')}
              className={navButtonClasses('story')}
            >
              <Book className="w-4 h-4" />
              背景故事
            </button>
          </div>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center shadow-lg`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </motion.button>
        </div>
      </LiquidGlassUI>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* SideBar (Mobile Only - overlay) */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed inset-y-0 left-0 w-64 ${theme === 'dark' ? 'bg-[#0D1524]/95' : 'bg-white/95'} z-50 p-4 border-r ${theme === 'dark' ? 'border-[#22344B]/50' : 'border-gray-300/50'} backdrop-blur-md md:hidden`}
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowSidebar(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-2">
                <button onClick={() => { setCurrentView('card'); setShowSidebar(false); }} className={navButtonClasses('card')}>
                  <Home className="w-4 h-4" />
                  角色卡
                </button>
                <button onClick={() => { setCurrentView('skillTree'); setShowSidebar(false); }} className={navButtonClasses('skillTree')}>
                  <GitBranch className="w-4 h-4" />
                  技能樹
                </button>
                <button onClick={() => { setCurrentView('story'); setShowSidebar(false); }} className={navButtonClasses('story')}>
                  <Book className="w-4 h-4" />
                  背景故事
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-auto">
          <LiquidGlassUI resonance={1.0} theme={theme} className="w-full max-w-[1280px] h-full flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Left Panel - Character Visual */}
            <LiquidGlassUI resonance={0.9} theme={theme} className="w-full md:w-[520px] relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 opacity-20">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 ${theme === 'dark' ? 'border-[#55C7FF]/30' : 'border-blue-300/30'} animate-spin-slow`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border ${theme === 'dark' ? 'border-[#55C7FF]/20' : 'border-blue-300/20'}`} style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 ${theme === 'dark' ? 'bg-[#55C7FF]' : 'bg-blue-500'} rounded-full`}
                    initial={{
                      x: Math.random() * 500,
                      y: 600,
                      opacity: 0,
                    }}
                    animate={{
                      y: [600, Math.random() * 200],
                      x: [null, Math.random() * 500],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>

              {/* Grid Floor */}
              <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${theme === 'dark' ? 'from-[#55C7FF]/10' : 'from-blue-300/10'} to-transparent`}>
                <div className={`grid grid-cols-8 h-full opacity-30`}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`border-r ${theme === 'dark' ? 'border-[#55C7FF]/20' : 'border-blue-300/20'}`}></div>
                  ))}
                </div>
              </div>

              {/* Character Placeholder */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-center"
                >
                  <LiquidGlassUI resonance={0.5} theme={theme} className="w-64 h-64 rounded-full flex items-center justify-center mb-4">
                    <Crown className={`w-32 h-32 ${theme === 'dark' ? 'text-[#55C7FF]' : 'text-blue-500'}`} />
                  </LiquidGlassUI>
                  <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'} text-sm tracking-wider`}>Character Illustration</div>
                  <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-xs mt-1`}>Placeholder</div>
                </motion.div>
              </div>

              {/* Top Left Label */}
              <div className="absolute top-6 left-6 z-20">
                <div className={`\${theme === 'dark' ? 'text-[#8DB9D8]' : 'text-blue-800'} text-xs font-medium tracking-[0.08em]`}>
                  AWAKENED FORM
                </div>
              </div>

              {/* Bottom Label */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-[11px] font-mono`}>
                  UNIT ID // OA-Ω // OMNIAGENT
                </div>
              </div>
            </LiquidGlassUI>

            {/* Right Panel - Content */}
            <div className="flex-1 flex flex-col gap-4 md:gap-5">
              {/* Header Section */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className={`text-3xl md:text-[44px] font-bold \${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} leading-tight`}>
                      OmniAgent
                    </h1>
                    <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-700'} mt-1`}>
                      <div className="font-medium">全域覺醒代理者</div>
                      <div className="text-sm">The Awakened Universal Agent</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-[#F4C95D] to-[#E8B84A] text-[#070B14] text-xs font-bold rounded-full">
                      SSR
                    </span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-[#9B7CFF] to-[#7B5FCF] text-white text-xs font-bold rounded-full">
                      AWAKENED
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['全能型', '戰術統御', '多工協同', '結果導向'].map((tag) => (
                    <span key={tag} className={`px-3 py-1 \${theme === 'dark' ? 'bg-[#16324F] text-[#55C7FF]' : 'bg-blue-100 text-blue-700'} text-xs rounded-full border \${theme === 'dark' ? 'border-[#55C7FF]/30' : 'border-blue-300/30'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[220px]">
                {/* Radar Chart Placeholder */}
                <LiquidGlassUI resonance={0.8} theme={theme} className="w-full lg:w-[260px]">
                  <div className={`\${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} font-semibold mb-3`}>核心能力指數</div>
                  <div className="flex items-center justify-center h-40">
                    <div className="relative w-40 h-40">
                      {/* Hexagon Radar - simplified for theme, colors should be dynamic */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const size = (i + 1) * 20;
                        return (
                          <polygon
                            key={size}
                            points="50,10 90,30 90,70 50,90 10,70 10,30"
                            fill="none"
                            stroke={theme === 'dark' ? '#22344B' : '#ccc'}
                            strokeWidth="0.5"
                            transform={`scale(${size / 100})`}
                            style={{ transformOrigin: '50% 50%' }}
                          />
                        );
                      })}
                      {/* Stat Shape */}
                      <polygon
                        points="50,12 87,32 87,68 50,86 13,68 13,32"
                        fill={theme === 'dark' ? '#55C7FF' : '#3B82F6'}
                        fillOpacity="0.2"
                        stroke={theme === 'dark' ? '#55C7FF' : '#3B82F6'}
                        strokeWidth="2"
                      />
                    </svg>
                    {/* Labels */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>感知</div>
                    <div className={`absolute top-[20%] right-0 translate-x-6 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>解析</div>
                    <div className={`absolute bottom-[20%] right-0 translate-x-6 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>推演</div>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>執行</div>
                    <div className={`absolute bottom-[20%] left-0 -translate-x-6 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>協同</div>
                    <div className={`absolute top-[20%] left-0 -translate-x-6 text-[9px] \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'}`}>進化</div>
                  </div>
                </div>
              </div>
            </LiquidGlassUI>

            {/* Stats List */}
            <LiquidGlassUI resonance={0.8} theme={theme} className="flex-1 space-y-2.5">
              {[
                { label: '感知力', rank: 'SSS', value: 98 },
                { label: '解析力', rank: 'SSS+', value: 99 },
                { label: '推演力', rank: 'SS', value: 94 },
                { label: '執行力', rank: 'SSS', value: 97 },
                { label: '協同力', rank: 'SS+', value: 96 },
                { label: '進化力', rank: 'EX', value: 100 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className={`w-14 \${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'} text-sm`}>{stat.label}</div>
                  <div className={`w-12 \${theme === 'dark' ? 'text-[#F4C95D]' : 'text-yellow-600'} text-xs font-bold`}>{stat.rank}</div>
                  <div className={`flex-1 h-2 \${theme === 'dark' ? 'bg-[#16324F]' : 'bg-blue-100'} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full \${theme === 'dark' ? 'bg-gradient-to-r from-[#55C7FF] to-[#3B82F6]' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
                    />
                  </div>
                  <div className={`w-8 text-right \${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} text-sm font-semibold`}>{stat.value}</div>
                </div>
              ))}
            </LiquidGlassUI>
          </div>

          {/* Skills Section */}
          <div className="space-y-3">
            <div className={`\${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} font-semibold text-lg`}>Skill Loadout</div>

            {/* Skill Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Brain, nameEN: 'Meta Parse', nameZH: '萬象解析', type: '解析 / 主動', desc: '快速拆解內容，標記核心資訊與風險節點。' },
                { icon: Layers, nameEN: 'Parallel Mind', nameZH: '多線程思維', type: '統御 / 主動', desc: '同步維持多條任務鏈，提升流程穩定性。' },
                { icon: GitBranch, nameEN: 'Causal Engine', nameZH: '因果推演', type: '預測 / 主動', desc: '模擬多條路徑，預判成本、結果與風險。' },
                { icon: Sparkles, nameEN: 'Context Domain', nameZH: '上下文領域展開', type: '領域 / EX', desc: '強制關聯碎片資訊，建立高密度決策場。' },
              ].map((skill) => (
                <motion.div
                  key={skill.nameEN}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`bg-[#101C2E]/80 rounded-2xl p-3.5 backdrop-blur-sm border \${theme === 'dark' ? 'border-[#22344B]/50 hover:border-[#55C7FF]/50' : 'border-gray-300 hover:border-blue-400'} transition-colors cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <skill.icon className={`w-5 h-5 \${theme === 'dark' ? 'text-[#55C7FF]' : 'text-blue-500'}`} />
                    <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-[10px]`}>{skill.type}</div>
                  </div>
                  <div className={`\${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} text-sm font-semibold mb-0.5`}>{skill.nameEN}</div>
                  <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-700'} text-xs mb-2`}>{skill.nameZH}</div>
                  <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-[10px] leading-tight`}>{skill.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Ultimate Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r \${theme === 'dark' ? 'from-[#9B7CFF]/20 to-[#55C7FF]/20' : 'from-purple-200/50 to-blue-200/50'} rounded-2xl p-4 backdrop-blur-sm border-2 \${theme === 'dark' ? 'border-[#9B7CFF]/50' : 'border-purple-400/50'} relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r \${theme === 'dark' ? 'from-[#9B7CFF]/10 to-[#55C7FF]/10' : 'from-purple-200/30 to-blue-200/30'} animate-pulse`}></div>
              <div className="relative flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full \${theme === 'dark' ? 'bg-gradient-to-br from-[#9B7CFF] to-[#55C7FF]' : 'bg-gradient-to-br from-purple-500 to-blue-500'} flex items-center justify-center`}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 \${theme === 'dark' ? 'text-[#F4C95D]' : 'text-yellow-600'} text-xs font-bold rounded`}>ULTIMATE</span>
                    <span className={`px-2 py-0.5 \${theme === 'dark' ? 'text-[#9B7CFF]' : 'text-purple-600'} text-xs font-bold rounded`}>AWAKENED</span>
                  </div>
                  <div className={`\${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} text-lg font-bold`}>Oracle Act</div>
                  <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-700'} text-sm`}>神諭執行</div>
                  <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-xs mt-1`}>不只輸出答案，直接將理解轉化為可落地結果。</div>
                </div>
                <div className={`\${theme === 'dark' ? 'text-[#F4C95D]' : 'text-yellow-600'} text-2xl font-bold`}>100%</div>
              </div>
            </motion.div>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[132px]">
            {/* Voice Line */}
            <LiquidGlassUI resonance={0.8} theme={theme} className="relative overflow-hidden">
              <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'} text-xs font-semibold mb-2`}>Voice Line</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVoiceLine}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`\${theme === 'dark' ? 'text-[#F4FBFF]' : 'text-gray-900'} text-sm leading-relaxed`}
                >
                  {voiceLines[currentVoiceLine]}
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-1 justify-center mt-3">
                {voiceLines.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentVoiceLine(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors \${i === currentVoiceLine ? (theme === 'dark' ? 'bg-[#55C7FF]' : 'bg-blue-500') : (theme === 'dark' ? 'bg-[#22344B] hover:bg-[#55C7FF]/50' : 'bg-gray-300 hover:bg-blue-400')}`}
                  />
                ))}
              </div>
            </LiquidGlassUI>

            {/* Overview */}
            <LiquidGlassUI resonance={0.8} theme={theme} className="relative overflow-hidden">
              <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'} text-xs font-semibold mb-2`}>Overview</div>
              <div className={`\${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'} text-xs leading-relaxed`}>
                OmniAgent 是一個能理解需求、規劃流程、協同工具並驗證結果的全能代理核心。
              </div>
            </LiquidGlassUI>

            {/* Status */}
            <LiquidGlassUI resonance={0.8} theme={theme} className="font-mono text-[10px]">
              <div className={`\${theme === 'dark' ? 'text-[#8FA9C2]' : 'text-gray-600'} font-semibold mb-2`}>Awakening Status</div>
              <div className={`space-y-1 \${theme === 'dark' ? 'text-[#6E88A6]' : 'text-gray-500'}`}>
                <div>STATUS      <span className={`\${theme === 'dark' ? 'text-[#55C7FF]' : 'text-blue-500'}`}>AWAKENED</span></div>
                <div>SYNC RATE   <span className={`\${theme === 'dark' ? 'text-[#55C7FF]' : 'text-blue-500'}`}>99.7%</span></div>
                <div>ERROR DRIFT <span className={`\${theme === 'dark' ? 'text-[#55C7FF]' : 'text-blue-500'}`}>0.02%</span></div>
                <div>MODE        <span className={`\${theme === 'dark' ? 'text-[#9B7CFF]' : 'text-purple-500'}`}>OMNI ASCENSION</span></div>
              </div>
            </LiquidGlassUI>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('skillTree')}
              className={`py-3 \${theme === 'dark' ? 'bg-gradient-to-r from-[#55C7FF]/20 to-[#3B82F6]/20 text-[#55C7FF]' : 'bg-blue-100/50 text-blue-700'} rounded-2xl border \${theme === 'dark' ? 'border-[#55C7FF]/50 hover:border-[#55C7FF]' : 'border-blue-300/50 hover:border-blue-500'} transition-all backdrop-blur-sm flex items-center justify-center gap-2`}
            >
              <GitBranch className="w-4 h-4" />
              技能樹
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('story')}
              className={`py-3 \${theme === 'dark' ? 'bg-gradient-to-r from-[#9B7CFF]/20 to-[#55C7FF]/20 text-[#9B7CFF]' : 'bg-purple-100/50 text-purple-700'} rounded-2xl border \${theme === 'dark' ? 'border-[#9B7CFF]/50 hover:border-[#9B7CFF]' : 'border-purple-300/50 hover:border-purple-500'} transition-all backdrop-blur-sm flex items-center justify-center gap-2`}
            >
              <Book className="w-4 h-4" />
              背景故事
            </motion.button>
          </div>
        </div>
      </LiquidGlassUI>
      
      {/* FloatingKey (now acts as the 428 Floating Function Key) */}
      <FloatingKey />

      {/* Floating Menu Button (Desktop) - Replaced by TopBar's desktop nav */}
      {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowDesktopMenu(!showDesktopMenu)}
        className={`fixed top-4 right-4 w-12 h-12 ${theme === 'dark' ? 'bg-gradient-to-br from-[#55C7FF] to-[#3B82F6]' : 'bg-gradient-to-br from-blue-500 to-blue-700'} rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'shadow-[#55C7FF]/50' : 'shadow-blue-500/50'} z-50 hidden md:flex`}
      >
        <Menu className="w-6 h-6 text-white" />
      </motion.button> */}

      {/* Floating Menu (Desktop) - Replaced by TopBar's desktop nav */}
      {/* <AnimatePresence>
        {showDesktopMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className={`fixed top-20 right-4 ${theme === 'dark' ? 'bg-[#101C2E]/95' : 'bg-white/95'} rounded-2xl p-4 border ${theme === 'dark' ? 'border-[#22344B]/50' : 'border-gray-300/50'} backdrop-blur-md z-50 min-w-[200px] hidden md:block`}
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('card');
                  setShowDesktopMenu(false);
                }}
                className={navButtonClasses('card')}
              >
                角色卡
              </button>
              <button
                onClick={() => {
                  setCurrentView('skillTree');
                  setShowDesktopMenu(false);
                }}
                className={navButtonClasses('skillTree')}
              >
                技能樹
              </button>
              <button
                onClick={() => {
                  setCurrentView('story');
                  setShowDesktopMenu(false);
                }}
                className={navButtonClasses('story')}
              >
                背景故事
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Mobile Specialized Function Key (moved to FloatingKey component) */}
      {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMobileFunctionKey}
        className={`fixed bottom-4 right-4 w-14 h-14 ${theme === 'dark' ? 'bg-gradient-to-br from-[#E8B84A] to-[#F4C95D]' : 'bg-gradient-to-br from-yellow-500 to-yellow-700'} rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'shadow-[#F4C95D]/50' : 'shadow-yellow-500/50'} z-50 md:hidden`}
      >
        <Plus className="w-7 h-7 text-white" />
      </motion.button> */}
    </div>
  );
}
