import React from 'react';
import { LayoutGrid, Calendar, CheckSquare, Layers, Settings, Activity } from 'lucide-react';

type ViewMode = 'tactical' | 'temporal' | 'execution' | 'impact';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'tactical', icon: LayoutGrid, label: 'Tactical Ops' }, // 儀表板
    { id: 'temporal', icon: Calendar, label: 'Temporal Nexus' }, // 日曆
    { id: 'execution', icon: CheckSquare, label: 'Task Matrix' }, // 任務
    { id: 'impact', icon: Layers, label: 'Impact Initiatives' }, // 專案
  ] as const;

  return (
    <div className="w-20 lg:w-64 flex flex-col justify-between bg-slate-950/50 backdrop-blur-xl border-r border-slate-800 h-screen py-6 transition-all duration-300">
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celestial-purple to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="hidden lg:block font-bold text-xl text-white tracking-tight">JunAiKey</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewMode)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="hidden lg:block text-sm font-medium">
                {item.label}
              </span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_currentColor]" />}
            </button>
          );
        })}
      </nav>

      {/* Settings (Bottom) */}
      <div className="px-3 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block text-sm">System Config</span>
        </button>
      </div>
    </div>
  );
};