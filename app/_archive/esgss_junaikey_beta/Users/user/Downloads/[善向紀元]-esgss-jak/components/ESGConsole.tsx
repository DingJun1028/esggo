import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, FileText, CheckCircle, AlertCircle, Search, Plus, Download, Filter } from 'lucide-react';

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Reading {
  id: string;
  org: { name: string };
  metric: { name: string; unit: string };
  value: number;
  calculated_value?: number;
  status: string;
  period_start: string;
}

interface Stats {
  totalEmission: number;
  pendingReviews: number;
  dataCompleteness: number;
}

const ESGConsole: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalEmission: 0, pendingReviews: 0, dataCompleteness: 0 });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 獲取統計數據
      const { data: statsData } = await supabase.rpc('get_esg_stats');
      if (statsData) {
        setStats(statsData);
      }

      // 獲取讀數數據
      let query = supabase
        .from('esg_readings')
        .select(`
          id,
          value,
          calculated_value,
          status,
          period_start,
          metric:metric_definitions(name, unit),
          org:org_units(name)
        `)
        .eq('status', 'approved') // 預設只顯示已核准數據
        .order('created_at', { ascending: false })
        .limit(50);

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data: readingsData, error } = await query;
      if (error) throw error;

      setReadings(readingsData || []);
    } catch (error) {
      console.error('載入數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (readingId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase.rpc('process_approval', {
        reading_id: readingId,
        action: action
      });

      if (error) throw error;

      // 重新載入數據
      loadData();
    } catch (error) {
      console.error('審核操作失敗:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      review: "bg-amber-100 text-amber-700 border-amber-200",
      draft: "bg-slate-100 text-slate-600 border-slate-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200",
      locked: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.draft}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredReadings = readings.filter(reading =>
    reading.org?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.metric?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      {/* 頂部導航 */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">善向永續數據中台</h1>
          <p className="text-slate-500 text-sm">Sunshine ESG Data Hub • CSO View</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
            <Download size={16} />
            匯出報表
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
            <Plus size={16} />
            新增數據
          </button>
        </div>
      </header>

      {/* 核心指標卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">本月總碳排 (Estimated)</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalEmission.toFixed(2)} <span className="text-lg text-slate-400 font-normal">tCO2e</span></h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><BarChart3 size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">待審核項目</p>
            <h3 className="text-3xl font-bold text-amber-600">{stats.pendingReviews}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><AlertCircle size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">資料完整度</p>
            <h3 className="text-3xl font-bold text-emerald-600">{stats.dataCompleteness}%</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">指標覆蓋</p>
            <h3 className="text-3xl font-bold text-blue-600">15</h3>
            <p className="text-xs text-slate-500 mt-1">個活躍指標</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><FileText size={24} /></div>
        </div>
      </div>

      {/* 數據列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={18} /> ESG 數據總覽
          </h3>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">所有狀態</option>
              <option value="approved">已核准</option>
              <option value="review">審核中</option>
              <option value="draft">草稿</option>
              <option value="rejected">已駁回</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜尋廠區或指標..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">組織單位</th>
                <th className="px-6 py-4">指標項目</th>
                <th className="px-6 py-4 text-right">原始數值</th>
                <th className="px-6 py-4 text-right">碳排換算 (tCO2e)</th>
                <th className="px-6 py-4 text-center">狀態</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReadings.map((reading) => (
                <tr key={reading.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{reading.org?.name}</td>
                  <td className="px-6 py-4 text-slate-600">{reading.metric?.name}</td>
                  <td className="px-6 py-4 text-right font-mono">
                    {reading.value.toLocaleString()} <span className="text-slate-400 text-xs">{reading.metric?.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-indigo-900">
                    {reading.calculated_value ? reading.calculated_value.toFixed(3) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(reading.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">詳情</button>
                      {reading.status === 'review' && (
                        <>
                          <button
                            onClick={() => handleApproval(reading.id, 'approve')}
                            className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                          >
                            核准
                          </button>
                          <button
                            onClick={() => handleApproval(reading.id, 'reject')}
                            className="text-rose-600 hover:text-rose-800 font-medium text-sm"
                          >
                            駁回
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReadings.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">無數據</h3>
            <p className="mt-1 text-sm text-slate-500">目前沒有符合條件的 ESG 數據</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGConsole;