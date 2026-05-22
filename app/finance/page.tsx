'use client';
import { useState } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, BarChart2, Shield, Leaf, Users, Building } from 'lucide-react';

const TCFD_PILLARS = [
  { id: 'governance', title: '治理', icon: Building, desc: '董事會與管理層對氣候相關風險與機會的監督。', completion: 85, items: ['董事會 ESG 審議紀錄', '管理層氣候報告職責', 'ESG 委員會章程'] },
  { id: 'strategy', title: '策略', icon: TrendingUp, desc: '氣候相關風險與機會對組織業務、策略及財務規劃的實質性影響。', completion: 72, items: ['1.5°C 情境分析', '碳價格影響評估', '轉型機會識別'] },
  { id: 'risk', title: '風險管理', icon: AlertTriangle, desc: '組織如何識別、評估和管理氣候相關風險的流程。', completion: 90, items: ['物理風險評估框架', '轉型風險矩陣', '供應鏈氣候壓力測試'] },
  { id: 'metrics', title: '指標與目標', icon: BarChart2, desc: '評估和管理氣候相關風險與機會所使用的指標與目標。', completion: 78, items: ['GHG 盤查 Scope 1/2/3', 'SBTi 目標設定', '碳強度 KPI'] },
];

const ESG_ROI = [
  { initiative: '太陽能屋頂安裝', investment: 5000000, annualSaving: 800000, carbonReduction: 120, roi: 16, year: 2022 },
  { initiative: 'LED 全面升級', investment: 800000, annualSaving: 200000, carbonReduction: 30, roi: 25, year: 2023 },
  { initiative: '廢水回收系統', investment: 2000000, annualSaving: 350000, carbonReduction: 15, roi: 17.5, year: 2023 },
  { initiative: '綠色供應鏈轉型', investment: 3000000, annualSaving: 500000, carbonReduction: 85, roi: 16.7, year: 2024 },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'tcfd' | 'roi' | 'risk'>('tcfd');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>永續財務 Finance Hub</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>TCFD 四大支柱 · ESG ROI 分析 · 碳風險情境</p>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'ESG 投資總額', value: 'NT$1,080萬', color: '#003262', icon: DollarSign },
          { label: '年度節省金額', value: 'NT$185萬', color: '#22c55e', icon: TrendingUp },
          { label: '碳減量成果', value: '250 tCO₂e', color: '#3b7ea1', icon: Leaf },
          { label: 'TCFD 完成率', value: `${Math.round(TCFD_PILLARS.reduce((a, p) => a + p.completion, 0) / TCFD_PILLARS.length)}%`, color: '#8b5cf6', icon: Shield },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{s.label}</span>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[{ id: 'tcfd', label: 'TCFD 四大支柱' }, { id: 'roi', label: 'ESG ROI 分析' }, { id: 'risk', label: '碳風險情境' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: activeTab === t.id ? '#003262' : '#f1f5f9', color: activeTab === t.id ? '#fff' : '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'tcfd' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {TCFD_PILLARS.map(p => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon size={20} color="#003262" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', margin: 0 }}>TCFD {p.title}</h3>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>完成率 {p.completion}%</div>
                </div>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: `${p.completion}%`, height: '100%', background: p.completion >= 85 ? '#22c55e' : p.completion >= 70 ? '#f59e0b' : '#ef4444', borderRadius: '4px', transition: 'width 0.5s' }} />
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>{p.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {p.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roi' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['ESG 投資項目', '投資金額 (NT$)', '年度節省 (NT$)', '碳減量 (tCO₂e)', 'ROI (%)', '投資年度'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ESG_ROI.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{r.initiative}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{r.investment.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#22c55e', fontWeight: '700' }}>{r.annualSaving.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#3b7ea1', fontWeight: '700' }}>{r.carbonReduction}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: r.roi >= 20 ? '#22c55e' : r.roi >= 15 ? '#f59e0b' : '#ef4444' }}>{r.roi}%</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>{r.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'risk' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { scenario: '1.5°C 情境', impact: '低影響', carbonCost: 'NT$120萬/年', transitionRisk: '中等', physicalRisk: '低', color: '#22c55e', note: '符合 SBTi 目標，財務衝擊最小' },
            { scenario: '2.0°C 情境', impact: '中度影響', carbonCost: 'NT$250萬/年', transitionRisk: '高', physicalRisk: '中等', color: '#f59e0b', note: '需要加速減碳投資，碳稅支出增加' },
            { scenario: '4.0°C 情境', impact: '嚴重影響', carbonCost: 'NT$580萬/年', transitionRisk: '極高', physicalRisk: '高', color: '#ef4444', note: '廠房淹水風險、供應鏈斷鏈、碳稅重壓' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: `2px solid ${s.color}30`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.scenario}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>{s.impact}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: '碳成本', value: s.carbonCost },
                  { label: '轉型風險', value: s.transitionRisk },
                  { label: '物理風險', value: s.physicalRisk },
                ].map((m, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>{m.label}</span>
                    <span style={{ color: '#1e293b', fontWeight: '700' }}>{m.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0, padding: '12px', background: `${s.color}10`, borderRadius: '8px' }}>{s.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}