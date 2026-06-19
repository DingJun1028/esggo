import React, { useState } from 'react';
import NorthStarDashboard from './NorthStarDashboard';
import { OmniTaskMatrix } from './OmniTaskMatrix';
import SentientLogFeed from './SentientLogFeed';

export default function JunAiKeyDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'matrix'>('dashboard');
  const [showLogs, setShowLogs] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-tr from-[#63a6b0] to-[#ffd700] rounded-sm rotate-45" />
          <h1 className="text-sm font-bold tracking-widest text-slate-200">
            JUNAI KEY <span className="text-[#63a6b0]">BETA</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-xs rounded-full transition-all ${activeTab === 'dashboard' ? 'bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              儀表板
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-1.5 text-xs rounded-full transition-all ${activeTab === 'matrix' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              任務矩陣
            </button>
          </div>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`p-2 rounded-md border transition-all ${showLogs ? 'bg-[#63a6b0]/20 border-[#63a6b0]/50 text-[#63a6b0]' : 'bg-transparent border-white/10 text-slate-500 hover:text-slate-300'}`}
            title="切換感應日誌饋送"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 11h20" />
              <path d="m2 16 3-3-3-3" />
              <path d="M5 21V3" />
              <path d="M22 21V3" />
              <path d="m20 16 2-3-2-3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
          {activeTab === 'dashboard' ? <NorthStarDashboard /> : <OmniTaskMatrix />}
        </div>

        {/* Sentient Log Feed Sidebar */}
        {showLogs && (
          <div className="w-80 h-full border-l border-white/10 bg-black/40 backdrop-blur-sm p-4 hidden lg:block animate-in slide-in-from-right duration-300">
            <SentientLogFeed />
          </div>
        )}
      </div>

      {/* Mobile Log Overlay (optional toggle) */}
      {showLogs && (
        <div className="lg:hidden fixed bottom-4 right-4 w-[calc(100vw-2rem)] h-64 z-50">
          <SentientLogFeed />
        </div>
      )}
    </div>
  );
}
