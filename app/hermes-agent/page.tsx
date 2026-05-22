'use client';

import { useState } from 'react';
import { 
  Bot, Terminal, Cpu, Zap, Shield, Globe, Layers, Video, 
  Code, Database, Activity, ExternalLink, ChevronRight, 
  Download, FileJson, MessageSquare, Gauge
} from 'lucide-react';

const repoModules = [
  { path: 'hermes-gateway', desc: 'Node.js 網關 v0.14.0 (支持 VPS 部署)', status: 'Hot' },
  { path: 'vps_adapter', desc: 'Ubuntu 24.04 本地化執行與自動化安裝', status: 'New' },
  { path: 'acp_adapter', desc: 'Zed 編輯器上下文協議適配器', status: 'New' },
  { path: 'agent', desc: 'Auxiliary 輔助客戶端與 Nous 認證', status: 'Stable' },
  { path: 'tools/video_gen', desc: '統一影片生成工具 (Pluggable)', status: 'Hot' },
  { path: 'tinker-atropos', desc: 'RL 強化學習訓練環境子模組', status: 'Research' },
];

const releases = [
  { v: 'v0.14.1', date: 'Today', note: 'ESG Integration: 3 New Skills & Live VPS Fallback' },
  { v: 'v0.14.0', date: '2 days ago', note: 'ACP Registry for Zed & Video Gen' },
  { v: 'v0.13.0', date: 'last week', note: '8 New Locales & Gateway l10n' },
];

export default function HermesAgentPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1200 }}>
      {/* Header */}
      <div className="page-header fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-eyebrow">
              <Bot size={12} style={{ marginRight: 4 }} />
              OmniHermes · v0.14.1 · Self-Improving Agent
            </div>
            <h1 className="page-title">OmniHermes 系統 + ESG Go 系統 ☤</h1>
            <p className="page-sub">超越單純對話的自主代理：具備閉環學習、記憶固化與跨平台調度的 ESG 治理核心</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-gold">v0.14.0 Stable</span>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Last Bump: 2 days ago</div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="glass-dense">
        <div className="tabs" style={{ padding: '0 1.25rem' }}>
          {['overview', 'architecture', 'tools', 'research', 'releases'].map(t => (
            <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--berkeley-blue)' }}>核心能力 (Core Pillars)</h3>
                  <div className="g-auto" style={{ gap: '0.75rem' }}>
                    {[
                      { icon: <Activity size={18} />, t: '閉環學習', d: '透過經驗創造 Skill，並在任務中持續自我優化。' },
                      { icon: <Database size={18} />, t: '方言記憶', d: '具備 FTS5 歷史對話搜尋與 LLM 長期記憶摘要。' },
                      { icon: <Globe size={18} />, t: '20+ 平台閘道', d: '一個進程同時驅動 Telegram, Discord, Slack 等。' },
                      { icon: <Layers size={18} />, t: '七大後端', d: '支持 Docker, SSH, Singularity, Modal 與 Daytona。' },
                    ].map(item => (
                      <div key={item.t} className="card card-hover" style={{ padding: '1rem' }}>
                        <div style={{ color: 'var(--california-gold)', marginBottom: 8 }}>{item.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>{item.t}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="info-box info-box-blue" style={{ margin: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: 5 }}>快速部署</div>
                    <code style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.05)', padding: '8px', display: 'block', borderRadius: 4, lineHeight: 1.4 }}>
                      curl -fsSL https://.../install.sh | bash
                    </code>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8 }}>新特性: ACP ADAPTER</div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      v0.14.0 引入了 Zed 編輯器的 ACP 註冊元數據，讓 Hermes 能直接作為 Zed 的 AI 後端，實時同步代碼上下文。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="fade-in">
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>代碼模組地圖 (Source Map)</h3>
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead>
                      <tr><th>模組路徑</th><th>功能定義</th><th>當前狀態</th></tr>
                    </thead>
                    <tbody>
                      {repoModules.map(m => (
                        <tr key={m.path}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--berkeley-blue)' }}>{m.path}</td>
                          <td style={{ fontSize: '0.75rem' }}>{m.desc}</td>
                          <td><span className={`badge badge-sm ${m.status === 'New' ? 'badge-gold' : m.status === 'Research' ? 'badge-purple' : 'badge-blue'}`}>{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="fade-in">
              <div className="g-3">
                <div className="card" style={{ padding: '1rem' }}>
                  <Video size={24} style={{ color: 'var(--esg-purple)', marginBottom: 10 }} />
                  <div style={{ fontWeight: 700 }}>video_generate</div>
                  <p style={{ fontSize: '0.72rem', marginTop: 5 }}>v0.14.0 統一了影片生成接口，支持多供應商插件（如 Luma, Kling）。</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                  <Code size={24} style={{ color: 'var(--berkeley-blue)', marginBottom: 10 }} />
                  <div style={{ fontWeight: 700 }}>agent-browser v0.26</div>
                  <p style={{ fontSize: '0.72rem', marginTop: 5 }}>強化了瀏覽器自動化能力，支持長期空閒守護進程，提升抓取效率。</p>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                  <Shield size={24} style={{ color: 'var(--esg-green)', marginBottom: 10 }} />
                  <div style={{ fontWeight: 700 }}>Secure Sandbox</div>
                  <p style={{ fontSize: '0.72rem', marginTop: 5 }}>硬化容器隔離技術，支持唯讀根文件系統與命名空間隔離。</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--esg-purple)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--esg-purple)', marginBottom: 5 }}>ADVANCED RL</div>
                  <h4 style={{ fontWeight: 700 }}>Trajectory Compression</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                    專為訓練下一代工具調用模型設計。Hermes 能將複雜的任務解決軌跡（Trajectories）壓縮為高效的訓練樣本，並匯出為 ShareGPT 格式。
                  </p>
                </div>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--esg-teal)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--esg-teal)', marginBottom: 5 }}>MODEL TRAINING</div>
                  <h4 style={{ fontWeight: 700 }}>Atropos Integration</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                    整合 `tinker-atropos` 環境，支持在多步 Web 研究任務中進行強化學習（RL）環境模擬與數據生成。
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'releases' && (
            <div className="fade-in">
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>版本</th><th>更新時間</th><th>主要變動</th></tr>
                  </thead>
                  <tbody>
                    {releases.map(r => (
                      <tr key={r.v}>
                        <td style={{ fontWeight: 800, color: 'var(--berkeley-blue)' }}>{r.v}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.date}</td>
                        <td className="td-label">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: 12, border: '1px solid var(--border-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bot size={18} style={{ color: 'var(--berkeley-blue)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--berkeley-blue)', fontFamily: 'monospace' }}>
            OMNIHERMES-AGENT SYSTEM v0.14.1
          </span>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <a href="https://hermes-agent.nousresearch.com/docs/" target="_blank" rel="noreferrer" style={{ fontSize: '0.68rem', color: 'var(--founders-rock)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Terminal size={12} /> Documentation
          </a>
          <a href="https://discord.gg/NousResearch" target="_blank" rel="noreferrer" style={{ fontSize: '0.68rem', color: 'var(--founders-rock)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageSquare size={12} /> Discord
          </a>
        </div>
      </div>
    </div>
  );
}