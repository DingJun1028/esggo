import React, { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Wifi,
  WifiOff,
  Settings,
  Download,
  Share
} from 'lucide-react';

interface RealtimeData {
  totalEmission: number;
  pendingReviews: number;
  dataCompleteness: number;
  activeAlerts: number;
  liveMetrics: Array<{
    metric: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface LiveReading {
  id: string;
  metric: { name: string; unit: string };
  org: { name: string };
  value: number;
  calculated_value?: number;
  status: string;
  timestamp: string;
}

const RealtimeDashboard: React.FC = () => {
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    totalEmission: 0,
    pendingReviews: 0,
    dataCompleteness: 0,
    activeAlerts: 0,
    liveMetrics: []
  });

  const [liveReadings, setLiveReadings] = useState<LiveReading[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d'>('24h');
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 初始化即時連接
  useEffect(() => {
    initializeRealtime();
    loadInitialData();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const initializeRealtime = useCallback(async () => {
    try {
      const realtimeChannel = supabase
        .channel('esg-dashboard')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'esg_readings'
        }, handleReadingChange)
        .on('presence', { event: 'sync' }, () => {
          setIsConnected(true);
        })
        .on('presence', { event: 'leave' }, () => {
          setIsConnected(false);
        })
        .subscribe();

      setChannel(realtimeChannel);
    } catch (error) {
      console.error('Realtime initialization failed:', error);
    }
  }, []);

  const handleReadingChange = useCallback((payload: any) => {
    console.log('Realtime update:', payload);
    setLastUpdate(new Date());

    // 更新即時數據
    loadLiveData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadLiveData()
      ]);
    } catch (error) {
      console.error('Initial data load failed:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data: stats, error } = await supabase.rpc('get_realtime_stats');
      if (error) throw error;

      if (stats) {
        setRealtimeData(prev => ({
          ...prev,
          totalEmission: stats.totalEmission || 0,
          pendingReviews: stats.pendingReviews || 0,
          dataCompleteness: stats.dataCompleteness || 0,
          activeAlerts: stats.activeAlerts || 0
        }));
      }
    } catch (error) {
      console.error('Stats load failed:', error);
    }
  };

  const loadLiveData = async () => {
    try {
      // 獲取即時讀數
      const { data: readings, error: readingsError } = await supabase
        .from('esg_readings')
        .select(`
          id, value, calculated_value, status, created_at,
          metric:metric_definitions(name, unit),
          org:org_units(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      if (readingsError) throw readingsError;

      const formattedReadings = readings?.map(r => ({
        id: r.id,
        metric: r.metric,
        org: r.org,
        value: r.value,
        calculated_value: r.calculated_value,
        status: r.status,
        timestamp: r.created_at
      })) || [];

      setLiveReadings(formattedReadings);

      // 獲取即時指標
      const { data: metrics, error: metricsError } = await supabase.rpc('get_live_metrics');
      if (!metricsError && metrics) {
        setRealtimeData(prev => ({
          ...prev,
          liveMetrics: metrics
        }));
      }

    } catch (error) {
      console.error('Live data load failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatValue = (value: number, unit?: string) => {
    const formatted = value.toLocaleString();
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    return `${days} 天前`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      {/* 頂部狀態欄 */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? '即時連接' : '連接中斷'}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            最後更新: {formatTimeAgo(lastUpdate.toISOString())}
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '1h' | '24h' | '7d')}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1h">最近1小時</option>
            <option value="24h">最近24小時</option>
            <option value="7d">最近7天</option>
          </select>
          <button
            onClick={loadLiveData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </button>
        </div>
      </div>

      {/* 核心指標卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">即時碳排總量</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {realtimeData.totalEmission.toFixed(1)} tCO₂e
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">待審核項目</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {realtimeData.pendingReviews}
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">數據完整度</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {realtimeData.dataCompleteness}%
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">活躍告警</p>
              <h3 className="text-2xl font-bold text-red-600">
                {realtimeData.activeAlerts}
              </h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">系統狀態</p>
              <h3 className="text-2xl font-bold text-green-600">正常</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 即時指標趨勢 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  即時指標趨勢
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {realtimeData.liveMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(metric.trend)}
                      <div>
                        <h4 className="font-medium text-slate-900">{metric.metric}</h4>
                        <p className="text-sm text-slate-500">
                          較前一期 {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">當前值</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 即時數據流 */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                即時數據流
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {liveReadings.map((reading) => (
                <div key={reading.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reading.status)}
                      <span className="text-sm font-medium text-slate-900">
                        {reading.metric.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatTimeAgo(reading.timestamp)}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mb-1">
                    {reading.org.name}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">
                      {formatValue(reading.calculated_value || reading.value, reading.metric.unit)}
                    </span>
                    {reading.calculated_value && (
                      <span className="text-xs text-slate-500">
                        原始: {formatValue(reading.value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作欄 */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
            <Settings className="h-4 w-4" />
            自定義儀表板
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <BarChart3 className="h-4 w-4" />
            查看完整報告
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;