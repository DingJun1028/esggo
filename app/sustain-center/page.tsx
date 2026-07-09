'use client';

import React, { useEffect, useState } from 'react';
import { OmniDataAnalyticsPanel } from '@/components/omni-data-analytics-panel';
import { InsightGrid } from '@/components/sustain-center/insight-grid';
import { TrustLedger } from '@/components/sustain-center/trust-ledger';
import { HeartbeatMonitor, HeartbeatMetrics } from '@/components/sustain-center/heartbeat-monitor';
import { Loader2, Globe, Activity } from 'lucide-react';
import { OmniDataAnalyticsConfig } from '@/types/esg-charts';

interface DashboardData {
  charts: OmniDataAnalyticsConfig[];
  recentLedgers: Record<string, unknown>[];
  summaryMetrics: {
    totalEmissions: string;
    emissionUnit: string;
    esgScore: string;
    documentsProcessed: number;
  };
}

export default function SustainCenterPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heartbeat, setHeartbeat] = useState<HeartbeatMetrics>({
    wsClients: 0,
    uptime: 0,
    errorCount: 0,
    memoryUsage: 0,
    status: 'Healthy'
  });
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket gateway for Heartbeat
    let ws: WebSocket;
    const connectWs = () => {
      // In production, this might point to wss://gateway...
      const wsUrl = process.env.NEXT_PUBLIC_GATEWAY_WS_URL || 'ws://localhost:8642';
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'HEARTBEAT' || msg.type === 'status') {
            const data = msg.payload || msg.data || msg;
            setHeartbeat(prev => ({
              ...prev,
              wsClients: data.clients ?? prev.wsClients,
              uptime: data.uptime ?? prev.uptime,
              memoryUsage: data.memory?.used_mb ?? data.memory ?? prev.memoryUsage,
              status: data.status || 'Healthy',
              errorCount: data.errors ?? prev.errorCount
            }));
          }
        } catch (e) {}
      };
    };
    
    connectWs();
    const interval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.CLOSED) {
        connectWs();
      }
    }, 5000); // Reconnect loop

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sustain-center/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Failed to load sustain center dashboard', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgBase flex flex-col items-center justify-center text-textSecondary gap-4">
        <Loader2 className="animate-spin text-accentTeal" size={40} />
        <p className="font-mono text-sm animate-pulse">Syncing Holographic ESG Command Center...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center">Failed to load data.</div>;

  // Transform charts data for InsightGrid
  const insights = data.charts
    .filter(c => c.knowledge)
    .map(c => ({
      id: c.id,
      knowledge: c.knowledge!,
      sourceLabel: c.proof.sourceOrigin
    }));

  return (
    <div className="min-h-screen bg-bgBase text-textPrimary selection:bg-accentTeal/30 selection:text-accentTeal">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0f1b21] to-primary border-b border-borderColor/50">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-accentTeal/5 opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="flex items-center gap-2 text-accentGold font-mono text-xs mb-4 bg-accentGold/10 px-3 py-1 rounded-full w-fit border border-accentGold/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentGold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accentGold"></span>
                </span>
                OMNICORE HEART: TRANSCENDED (全通之心圓滿狀態)
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accentTeal to-white drop-shadow-[0_0_15px_rgba(99,166,176,0.3)]">
                萬能永續中心
              </h1>
              <p className="text-textSecondary max-w-xl text-sm leading-relaxed mb-6">
                全景式 ESG 治理與確信樞紐。基於 ESGSonnar 萃取單據智慧，並透過 5T 協議確保所有資產不可篡改，實現無縫顯化的自癒網絡。
              </p>
              <HeartbeatMonitor metrics={heartbeat} connected={wsConnected} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-surface/60 backdrop-blur-xl border border-borderColor/50 p-4 rounded-xl flex flex-col items-end min-w-[140px] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <span className="text-textSecondary text-xs mb-1 flex items-center gap-1"><Globe size={12}/> ESG 總評級</span>
                <span className="text-3xl font-bold text-accentGold">{data.summaryMetrics.esgScore}</span>
              </div>
              <div className="bg-surface/60 backdrop-blur-xl border border-borderColor/50 p-4 rounded-xl flex flex-col items-end min-w-[140px] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <span className="text-textSecondary text-xs mb-1 flex items-center gap-1"><Activity size={12}/> 年度碳排</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-accentTeal">{data.summaryMetrics.totalEmissions}</span>
                  <span className="text-xs text-textSecondary">{data.summaryMetrics.emissionUnit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Section 1: Chart Analytics */}
        <section>
          <OmniDataAnalyticsPanel configs={data.charts} />
        </section>

        {/* Section 2: Knowledge Hub */}
        <section>
          <InsightGrid insights={insights} />
        </section>

        {/* Section 3: 5T Trust Ledger */}
        <section className="pt-4 border-t border-borderColor/30">
          <TrustLedger ledgers={data.recentLedgers} />
        </section>
      </div>
    </div>
  );
}