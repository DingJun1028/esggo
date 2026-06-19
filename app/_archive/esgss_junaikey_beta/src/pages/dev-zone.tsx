import React from 'react';
import { Link } from 'react-router-dom';

export default function DevZone() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-emerald-400 mb-4">🛠️ Developer Zone</h1>
          <p className="text-slate-400 text-lg">
            Quick access to all features without login. Click any link below to access directly.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Main App */}
          <Link
            to="/"
            className="block p-6 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-emerald-900/30 hover:to-emerald-800/30 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all hover:scale-105"
          >
            <div className="text-emerald-400 text-sm font-mono mb-2">ROOT</div>
            <div className="text-white font-bold text-xl mb-2">Main App</div>
            <div className="text-slate-400 text-sm">Full application with navigation</div>
          </Link>

          {/* Test Report Hub */}
          <Link
            to="/test-report-hub"
            className="block p-6 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-purple-900/30 hover:to-purple-800/30 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all hover:scale-105"
          >
            <div className="text-purple-400 text-sm font-mono mb-2">TEST</div>
            <div className="text-white font-bold text-xl mb-2">Report Hub Test</div>
            <div className="text-slate-400 text-sm">Direct access to SustainabilityReportHub</div>
          </Link>

          {/* Developer Zone (Current) */}
          <div className="p-6 bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-500/50 rounded-xl">
            <div className="text-emerald-400 text-sm font-mono mb-2">CURRENT</div>
            <div className="text-white font-bold text-xl mb-2">Developer Zone</div>
            <div className="text-slate-400 text-sm">You are here</div>
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-emerald-400 text-3xl font-black mb-2">V7.0</div>
            <div className="text-slate-400">Current Version</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-cyan-400 text-3xl font-black mb-2">Phase 70</div>
            <div className="text-slate-400">Latest Phase</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-purple-400 text-3xl font-black mb-2">✅</div>
            <div className="text-slate-400">All Systems Go</div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">✨ Active Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">Exemplar Report Service (Millennial Exemplar)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">Knowledge Sanctuary</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">ESG Go Gamification (Sustainability Village)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">Cognitive Knowledge Graph</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">Market Intelligence Pulse</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300">Sovereign Mentor</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 Quick Actions</h2>
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Clear Cache & Reload</div>
              <code className="text-emerald-400 font-mono text-sm">
                Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
              </code>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Open DevTools Console</div>
              <code className="text-cyan-400 font-mono text-sm">F12 or Ctrl + Shift + I</code>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Clear LocalStorage (in console)</div>
              <code className="text-purple-400 font-mono text-sm">localStorage.clear()</code>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-400 font-bold mb-2">💡 Debug Tips</div>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• If you see blank screens, check browser console (F12)</li>
            <li>• Try hard refresh (Ctrl+Shift+R) after code changes</li>
            <li>• Make sure dev server is running (npm run dev)</li>
            <li>• Check for Supabase errors (Ignore warnings)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
