'use client';
import { Search } from 'lucide-react';

const modules = [
  { title: '① 健檢解讀', desc: '解讀結果、釐清缺口與優先序', output: 'Top3缺口+90天Roadmap', when: '課前/課中' },
  { title: '② 揭露輔導', desc: '揭露架構、章節建議、內容校準', output: '揭露大綱v1+章節清單', when: '課中/課後' },
  { title: '③ 資料盤點', desc: '資料來源、權責、佐證邏輯', output: '資料清單模板+RACI', when: '課中' },
  { title: '④ 客戶問卷', desc: '拆解題目、回覆策略、風險提示', output: '回覆框架+缺口補件清單', when: '課後/投標前' },
  { title: '⑤ Expert Hour', desc: '針對痛點解題、給下一步', output: '會後行動項目', when: '任何時點' },
];

export default function ConsultingPage() {
  return (
    <div className="fade-in" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <div className="page-eyebrow"><Search size={12} /> Layer A+B+C · 顧問服務</div>
        <h1 className="page-title">顧問服務 Consulting</h1>
        <p className="page-sub">企業健檢 · 平台工具 · 5 大模組顧問輔導</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {modules.map((m, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#003262', color: '#FDB515', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>{m.desc}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>交付物</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{m.output}</div>
            </div>
            <span className="badge badge-blue" style={{ flexShrink: 0 }}>{m.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}