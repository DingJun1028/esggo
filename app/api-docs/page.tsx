'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Code,
  Copy,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Search,
  Lock,
  Zap,
  FileText,
  Terminal,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Database,
  Users,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';

/* ─── Types ─── */
interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
  example?: string;
}

/* ─── Mock Data ─── */
const API_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'api-001',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: '用戶登入，取得 JWT Token',
    category: '認證',
    auth: false,
    params: [
      { name: 'email', type: 'string', required: true, description: '用戶電子郵件' },
      { name: 'password', type: 'string', required: true, description: '用戶密碼' },
    ],
    response: '{ "token": "eyJ...", "user": { "id": "...", "email": "..." } }',
    example:
      'curl -X POST https://api.esggo.com/v1/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email":"user@example.com","password":"..."}\'',
  },
  {
    id: 'api-002',
    method: 'GET',
    path: '/api/v1/esg-data',
    description: '取得 ESG 數據列表',
    category: 'ESG 數據',
    auth: true,
    params: [
      { name: 'page', type: 'integer', required: false, description: '頁碼' },
      { name: 'limit', type: 'integer', required: false, description: '每頁數量' },
    ],
    response: '{ "data": [...], "total": 100, "page": 1 }',
    example:
      'curl -X GET https://api.esggo.com/v1/esg-data?page=1&limit=20 \\\n  -H "Authorization: Bearer eyJ..."',
  },
  {
    id: 'api-003',
    method: 'POST',
    path: '/api/v1/reports/generate',
    description: '生成 ESG 報告',
    category: '報告',
    auth: true,
    params: [
      { name: 'template', type: 'string', required: true, description: '報告模板 (GRI/SASB/TCFD)' },
      { name: 'data_ids', type: 'array', required: true, description: '數據 ID 列表' },
    ],
    response: '{ "report_id": "rep-xxx", "status": "generating", "estimated_time": "15-20 min" }',
    example:
      'curl -X POST https://api.esggo.com/v1/reports/generate \\\n  -H "Authorization: Bearer eyJ..." \\\n  -H "Content-Type: application/json" \\\n  -d \'{"template":"GRI","data_ids":["data-001","data-002"]}\'',
  },
  {
    id: 'api-004',
    method: 'POST',
    path: '/api/v1/vault/seal',
    description: '執行 5T 協議封印',
    category: '信任機制',
    auth: true,
    params: [
      { name: 'evidence_id', type: 'string', required: true, description: '證據 ID' },
      { name: 'type', type: 'string', required: true, description: '密封類型 (5t-seal)' },
    ],
    response: '{ "hash_lock": "0xabc...", "status": "Trustworthy", "timestamp": 1705564800 }',
    example:
      'curl -X POST https://api.esggo.com/v1/vault/seal \\\n  -H "Authorization: Bearer eyJ..." \\\n  -H "Content-Type: application/json" \\\n  -d \'{"evidence_id":"evt-001","type":"5t-seal"}\'',
  },
  {
    id: 'api-005',
    method: 'GET',
    path: '/api/v1/notifications',
    description: '取得通知列表',
    category: '通知',
    auth: true,
    params: [
      {
        name: 'status',
        type: 'string',
        required: false,
        description: '過濾狀態 (unread/read/all)',
      },
    ],
    response: '{ "notifications": [...], "unread_count": 5 }',
    example:
      'curl -X GET https://api.esggo.com/v1/notifications?status=unread \\\n  -H "Authorization: Bearer eyJ..."',
  },
  {
    id: 'api-006',
    method: 'POST',
    path: '/api/v1/ai/chat',
    description: 'AI 助手對話',
    category: 'AI',
    auth: true,
    params: [
      { name: 'message', type: 'string', required: true, description: '用戶訊息' },
      { name: 'session_id', type: 'string', required: false, description: '會話 ID' },
    ],
    response: '{ "response": "...", "session_id": "sess-xxx", "suggestions": [...] }',
    example:
      'curl -X POST https://api.esggo.com/v1/ai/chat \\\n  -H "Authorization: Bearer eyJ..." \\\n  -H "Content-Type: application/json" \\\n  -d \'{"message":"如何開始碳盤查？"}\'',
  },
];

const CATEGORIES = [
  { id: 'all', label: '全部', icon: Globe },
  { id: '認證', label: '認證', icon: Lock },
  { id: 'ESG 數據', label: 'ESG 數據', icon: Database },
  { id: '報告', label: '報告', icon: FileText },
  { id: '信任機制', label: '信任機制', icon: ShieldCheck },
  { id: '通知', label: '通知', icon: Bell },
  { id: 'AI', label: 'AI', icon: Zap },
];

/* ─── Components ─── */

function MethodBadge({ method }: { method: string }) {
  const colors = {
    GET: 'bg-emerald-50 text-emerald-600',
    POST: 'bg-blue-50 text-blue-600',
    PUT: 'bg-amber-50 text-amber-600',
    DELETE: 'bg-rose-50 text-rose-600',
  };
  return (
    <span
      className={cn(
        'text-[10px] font-black px-2 py-0.5 rounded',
        colors[method as keyof typeof colors]
      )}
    >
      {method}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <OmniBaseCard className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
      >
        <MethodBadge method={endpoint.method} />
        <code className="text-xs font-mono text-[#003262] flex-1 truncate">{endpoint.path}</code>
        {endpoint.auth && <Lock size={12} className="text-amber-500" />}
        <span className="text-[10px] text-slate-400 hidden md:block">{endpoint.description}</span>
        {expanded ? (
          <ChevronDown size={14} className="text-slate-400" />
        ) : (
          <ChevronRight size={14} className="text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-50 space-y-4">
              <p className="text-xs text-slate-500">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.params && endpoint.params.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#003262] mb-2">參數</h4>
                  <div className="space-y-1">
                    {endpoint.params.map((param) => (
                      <div key={param.name} className="flex items-center gap-2 text-xs">
                        <code className="font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                          {param.name}
                        </code>
                        <span className="text-slate-400">{param.type}</span>
                        {param.required && (
                          <span className="text-[9px] font-bold text-rose-500">必填</span>
                        )}
                        <span className="text-slate-400 truncate">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response */}
              {endpoint.response && (
                <div>
                  <h4 className="text-xs font-bold text-[#003262] mb-2">回應</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-[10px] font-mono text-slate-600 overflow-x-auto">
                    {endpoint.response}
                  </pre>
                </div>
              )}

              {/* Example */}
              {endpoint.example && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#003262]">範例</h4>
                    <button
                      onClick={() => handleCopy(endpoint.example!)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-600 transition-colors"
                    >
                      {copied ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                      {copied ? '已複製' : '複製'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 rounded-lg p-3 text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {endpoint.example}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OmniBaseCard>
  );
}

/* ─── Main Page ─── */
export default function APIDocsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEndpoints = API_ENDPOINTS.filter((ep) => {
    if (activeCategory !== 'all' && ep.category !== activeCategory) return false;
    if (
      searchQuery &&
      !ep.path.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ep.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg breathing-glow">
                <Code size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">API 文檔</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Developer Documentation · 完整示例 · RESTful API
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <OmniBadge variant="success" size="sm" icon={<CheckCircle2 size={10} />}>
                v1.0.0
              </OmniBadge>
              <OmniBadge variant="primary" size="sm" icon={<ShieldCheck size={10} />}>
                5T 驗證
              </OmniBadge>
            </div>
          </div>
        </header>

        {/* ─── Quick Start ─── */}
        <OmniBaseCard className="p-5">
          <h3 className="text-base font-bold text-[#003262] mb-3 flex items-center gap-2">
            <Terminal size={16} className="text-blue-500" />
            快速開始
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-xs font-bold text-[#003262] mb-2">1. 取得 API Key</h4>
              <p className="text-[10px] text-slate-400 mb-2">
                在管理後台的 API 設定中產生您的 API Key。
              </p>
              <code className="text-[9px] font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded block">
                Authorization: Bearer {'<your-api-key>'}
              </code>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-xs font-bold text-[#003262] mb-2">2. 基礎 URL</h4>
              <p className="text-[10px] text-slate-400 mb-2">所有 API 請求都使用以下基礎 URL。</p>
              <code className="text-[9px] font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded block">
                https://api.esggo.com/v1
              </code>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-xs font-bold text-[#003262] mb-2">3. 5T 驗證</h4>
              <p className="text-[10px] text-slate-400 mb-2">
                所有數據寫入操作都需要通過 5T 協議驗證。
              </p>
              <code className="text-[9px] font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded block">
                X-5T-Hash-Lock: {'<hash>'}
              </code>
            </div>
          </div>
        </OmniBaseCard>

        {/* ─── Search & Filter ─── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋 API 端點..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                    activeCategory === cat.id
                      ? 'bg-[#003262] text-white'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Endpoints ─── */}
        <div className="space-y-3">
          {filteredEndpoints.map((endpoint) => (
            <EndpointCard key={endpoint.id} endpoint={endpoint} />
          ))}
          {filteredEndpoints.length === 0 && (
            <div className="text-center py-12">
              <Globe size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-sm text-slate-400">沒有找到符合條件的 API 端點</p>
            </div>
          )}
        </div>

        {/* ─── SDK & Resources ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: 'SDK 下載',
              desc: 'Python / JavaScript / Java',
              color: 'text-emerald-600',
            },
            {
              icon: FileText,
              title: ' OpenAPI 規格',
              desc: 'Swagger / Postman Collection',
              color: 'text-blue-600',
            },
            {
              icon: Users,
              title: '開發者社群',
              desc: 'Discord / GitHub Discussions',
              color: 'text-violet-600',
            },
          ].map((resource) => {
            const Icon = resource.icon;
            return (
              <motion.button
                key={resource.title}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-slate-100 p-4 text-left hover:shadow-md transition-all"
              >
                <Icon size={20} className={cn('mb-2', resource.color)} />
                <h4 className="text-sm font-bold text-[#003262]">{resource.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{resource.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
