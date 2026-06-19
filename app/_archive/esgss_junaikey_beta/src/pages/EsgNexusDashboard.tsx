/**
 * ESG Dashboard with Real NCB Data
 * Uses Google Stitch design system with 5T Protocol
 * Phase 15: Real-World Business Data Integration
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Users,
  Shield,
  TrendingUp,
  Activity,
  Lock,
  Eye,
  Search,
  Globe,
  Zap,
} from 'lucide-react';
import { ncb } from '@/lib/ncb/client';
import { OmniDataAdapter } from '@/services/data/OmniDataAdapter';

interface EsgReading {
  id: string;
  metric_id: string;
  value: number;
  calculated_value: number;
  status: string;
}

interface MetricDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  description: string;
}

interface EsgMetric {
  id: string;
  code: string;
  name: string;
  category: 'Environmental' | 'Social' | 'Governance';
  value: number;
  calculated_value: number;
  status: string;
}

/**
 * ESG Nexus Dashboard - Real Data from NCB
 */
export default function EsgNexusDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [readings, setReadings] = useState<EsgMetric[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Connection timeout - please check NCB connection');
      }
    }, 10000);

    fetchEsgData();

    return () => clearTimeout(timeout);
  }, []);

  const fetchEsgData = async () => {
    try {
      setLoading(true);

      const metricsData = await OmniDataAdapter.getMetricDefinitions();
      const readingsDataRaw = await ncb.from('esg_readings').select('*');
      const readingsData = Array.isArray(readingsDataRaw.data) ? readingsDataRaw.data : [];

      const mappedReadings: EsgMetric[] = readingsData.map((r: any) => {
        const metric = metricsData.find((m: any) => m.code === r.metric_id);
        return {
          id: r.id,
          code: r.metric_id,
          name: metric?.name || r.metric_id,
          category: (metric?.category || 'Environmental') as
            | 'Environmental'
            | 'Social'
            | 'Governance',
          value: r.value,
          calculated_value: r.calculated_value,
          status: r.status,
        };
      });

      setMetrics(metricsData);
      setReadings(mappedReadings);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch ESG data:', err);
      setError('Failed to connect to NCB database');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Environmental':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'Social':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'Governance':
        return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      default:
        return 'from-slate-500/20 to-slate-400/20 border-slate-500/30';
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const envMetrics = readings.filter(r => r.category === 'Environmental');
  const socialMetrics = readings.filter(r => r.category === 'Social');
  const govMetrics = readings.filter(r => r.category === 'Governance');

  const envAvg =
    envMetrics.length > 0
      ? envMetrics.reduce((a, b) => a + (b.calculated_value || b.value), 0) / envMetrics.length
      : 0;
  const socialAvg =
    socialMetrics.length > 0
      ? socialMetrics.reduce((a, b) => a + (b.calculated_value || b.value), 0) /
        socialMetrics.length
      : 0;
  const govAvg =
    govMetrics.length > 0
      ? govMetrics.reduce((a, b) => a + (b.calculated_value || b.value), 0) / govMetrics.length
      : 0;
  const overallScore = (envAvg + socialAvg + govAvg) / 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Loading ESG Data from NCB...</p>
        </div>
      </div>
    );
  }

  if (error || readings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
            <p className="text-slate-300">{error || 'No data available from NCB'}</p>
            <button
              onClick={() => {
                setError(null);
                fetchEsgData();
              }}
              className="mt-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30"
            >
              Retry Connection
            </button>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            ESG Nexus Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Demo Mode - Waiting for NCB Connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              ESG Nexus Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Real-time ESG metrics from NoCodeBackend</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-sm">5T Verified</span>
            </div>
            <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm">NCB Connected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="col-span-1 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-mono">OVERALL SCORE</span>
            </div>
            <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(1)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-mono">ENVIRONMENTAL</span>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(envAvg)}`}>{envAvg.toFixed(1)}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-mono">SOCIAL</span>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(socialAvg)}`}>
              {socialAvg.toFixed(1)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-mono">GOVERNANCE</span>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(govAvg)}`}>{govAvg.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          5T Protocol Status
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { id: 'tangible', label: 'Tangible', icon: Eye, color: '#63a6b0', status: 'Active' },
            {
              id: 'traceable',
              label: 'Traceable',
              icon: Search,
              color: '#3b82f6',
              status: 'Verified',
            },
            {
              id: 'trackable',
              label: 'Trackable',
              icon: Activity,
              color: '#10b981',
              status: 'Syncing',
            },
            {
              id: 'transparent',
              label: 'Transparent',
              icon: Globe,
              color: '#8b5cf6',
              status: 'Public',
            },
            {
              id: 'trustworthy',
              label: 'Trustworthy',
              icon: Lock,
              color: '#ffd700',
              status: 'Locked',
            },
          ].map(item => (
            <div
              key={item.id}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center"
            >
              <item.icon className="w-8 h-8 mx-auto mb-2" style={{ color: item.color }} />
              <div className="font-bold text-sm">{item.label}</div>
              <div className="text-xs text-slate-400 mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4">ESG Metrics Detail</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5" /> Environmental ({envMetrics.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {envMetrics.map(metric => (
              <div
                key={metric.id}
                className={`bg-gradient-to-br ${getCategoryColor(metric.category)} border rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-slate-400">{metric.code}</span>
                  <span className="text-xs px-2 py-1 bg-slate-800/50 rounded">{metric.status}</span>
                </div>
                <div className="text-xl font-bold">{metric.name}</div>
                <div
                  className={`text-3xl font-bold mt-2 ${getScoreColor(metric.calculated_value || metric.value)}`}
                >
                  {(metric.calculated_value || metric.value)?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Social ({socialMetrics.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {socialMetrics.map(metric => (
              <div
                key={metric.id}
                className={`bg-gradient-to-br ${getCategoryColor(metric.category)} border rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-slate-400">{metric.code}</span>
                  <span className="text-xs px-2 py-1 bg-slate-800/50 rounded">{metric.status}</span>
                </div>
                <div className="text-xl font-bold">{metric.name}</div>
                <div
                  className={`text-3xl font-bold mt-2 ${getScoreColor(metric.calculated_value || metric.value)}`}
                >
                  {(metric.calculated_value || metric.value)?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Governance ({govMetrics.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {govMetrics.map(metric => (
              <div
                key={metric.id}
                className={`bg-gradient-to-br ${getCategoryColor(metric.category)} border rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-slate-400">{metric.code}</span>
                  <span className="text-xs px-2 py-1 bg-slate-800/50 rounded">{metric.status}</span>
                </div>
                <div className="text-xl font-bold">{metric.name}</div>
                <div
                  className={`text-3xl font-bold mt-2 ${getScoreColor(metric.calculated_value || metric.value)}`}
                >
                  {(metric.calculated_value || metric.value)?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
