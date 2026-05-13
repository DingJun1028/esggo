import Link from 'next/link';
import { BookOpenText, Smartphone, Layers, Boxes, ArrowLeft } from 'lucide-react';

const principles = [
  '手機優先：先定義 360-768px 的操作節奏，再擴展平板與桌面。',
  '一致語彙：色彩、間距、字級與互動狀態全域統一。',
  '漸進揭露：保留 5 個核心底部導覽，並提供可展開的完整快捷清單。',
  '可驗證設計：每個關鍵模組都可對應到 5T / GRI 使用情境。',
];

const breakpoints = [
  { name: 'Mobile', size: '< 640px', notes: '單欄、可觸控快捷、強化可讀性' },
  { name: 'Tablet', size: '640px - 1024px', notes: '雙欄/自適應網格、保留流動導覽' },
  { name: 'Desktop', size: '> 1024px', notes: '側欄導覽、資訊密度提升、工作流並排' },
];

const atomic = [
  {
    level: 'Atoms',
    desc: '顏色 Token、字級、按鈕、標籤、圖示、輸入框、狀態點。',
  },
  {
    level: 'Molecules',
    desc: '快捷按鈕組、表單欄位組、數據指標卡、狀態訊息列。',
  },
  {
    level: 'Organisms',
    desc: 'MobileNav、Sidebar、Page Header、KPI 區塊、資料表區塊。',
  },
  {
    level: 'Templates',
    desc: 'Dashboard Template、Academy Template、Audit Template。',
  },
  {
    level: 'Pages',
    desc: '控制台、永續學院、稽核日誌、發布中心等業務頁面。',
  },
];

export default function AcademyWhitepaperPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title-block">
              <div className="page-icon">
                <BookOpenText size={18} color="#fff" />
              </div>
              <h1 className="page-title">柏克萊學院 UI/UX 設計白皮書</h1>
            </div>
            <div className="page-meta">
              <span className="badge badge-blue">Whitepaper</span>
              <span className="badge badge-gold">Atomic Design</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Berkeley Academy · Global RWD v1.0</span>
            </div>
          </div>
          <Link href="/academy" className="btn btn-secondary">
            <ArrowLeft size={14} />
            返回學院
          </Link>
        </div>
      </div>

      <div className="rwd-grid-auto" style={{ marginBottom: 18 }}>
        <div className="atom-card">
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Smartphone size={16} color="var(--berkeley-blue)" />
            手機版缺口補齊
          </div>
          <div className="section-sub" style={{ marginTop: 8 }}>
            由「僅 5 個快捷功能」升級為「5 個核心 + 可捲動快捷 + 全功能展開」，提升跨模組到達率與任務切換效率。
          </div>
        </div>
        <div className="atom-card">
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} color="var(--berkeley-blue)" />
            全域 RWD 設計策略
          </div>
          <div className="section-sub" style={{ marginTop: 8 }}>
            建立共用 RWD utility（容器、網格、橫向捲動）與全域 token，減少頁面間風格分裂與斷點不一致。
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="section-title">設計原則</div>
        <div className="rwd-grid-auto" style={{ marginTop: 12 }}>
          {principles.map((item) => (
            <div key={item} className="info-row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="section-title">RWD 斷點規格</div>
        <div className="rwd-grid-auto" style={{ marginTop: 12 }}>
          {breakpoints.map((bp) => (
            <div key={bp.name} className="atom-card">
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{bp.name}</div>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 6px' }}>{bp.size}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{bp.notes}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Boxes size={16} color="var(--berkeley-blue)" />
          原子組件設計（Atomic Design）
        </div>
        <div className="table-wrap rwd-scroll-x" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>層級</th>
                <th>設計定義</th>
              </tr>
            </thead>
            <tbody>
              {atomic.map((item) => (
                <tr key={item.level}>
                  <td style={{ fontWeight: 700 }}>{item.level}</td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
