'use client';
import { useState, useMemo } from 'react';
import { Globe, Calculator, AlertTriangle, CheckCircle, TrendingUp, Download, Plus, Trash2 } from 'lucide-react';

interface CBAmProduct {
  id: string;
  productName: string;
  cnCode: string;
  sector: string;
  annualExportTons: number;
  directEmissions: number;
  indirectEmissions: number;
  paidCarbonPrice: number;
  euEtsPrice: number;
}

const SECTORS = [
  { id: 'steel', name: '鋼鐵', cn: '7208-7229', factor: 1.89 },
  { id: 'aluminum', name: '鋁', cn: '7601-7616', factor: 6.72 },
  { id: 'cement', name: '水泥', cn: '2523', factor: 0.83 },
  { id: 'fertilizer', name: '化學肥料', cn: '3102-3105', factor: 2.40 },
  { id: 'electricity', name: '電力', cn: '2716', factor: 0.50 },
  { id: 'hydrogen', name: '氫氣', cn: '2804.10', factor: 0.00 },
];

const DEFAULT_ETS_PRICE = 65; // EUR/tCO₂e

export default function CBAMCalculatorPage() {
  const [products, setProducts] = useState<CBAmProduct[]>([
    {
      id: '1',
      productName: '熱軋鋼板',
      cnCode: '7208.37',
      sector: 'steel',
      annualExportTons: 5000,
      directEmissions: 1.89,
      indirectEmissions: 0.32,
      paidCarbonPrice: 0,
      euEtsPrice: DEFAULT_ETS_PRICE,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<CBAmProduct>>({ euEtsPrice: DEFAULT_ETS_PRICE, paidCarbonPrice: 0 });

  const calculations = useMemo(() => {
    return products.map(p => {
      const totalEmissions = (p.directEmissions + p.indirectEmissions) * p.annualExportTons;
      const netEmissions = Math.max(0, totalEmissions - (p.paidCarbonPrice / p.euEtsPrice) * p.annualExportTons * (p.directEmissions + p.indirectEmissions));
      const cbamCost = netEmissions * p.euEtsPrice;
      const adjustedCbamCost = Math.max(0, totalEmissions * p.euEtsPrice - p.paidCarbonPrice * p.annualExportTons);
      return {
        ...p,
        totalEmissions: Math.round(totalEmissions * 10) / 10,
        cbamCertificates: Math.round(netEmissions * 10) / 10,
        estimatedCost: Math.round(adjustedCbamCost),
        costPerTon: p.annualExportTons > 0 ? Math.round((adjustedCbamCost / p.annualExportTons) * 10) / 10 : 0,
        riskLevel: adjustedCbamCost > 500000 ? 'high' : adjustedCbamCost > 100000 ? 'medium' : 'low',
      };
    });
  }, [products]);

  const totalCBAmCost = calculations.reduce((acc, c) => acc + c.estimatedCost, 0);
  const totalEmissions = calculations.reduce((acc, c) => acc + c.totalEmissions, 0);

  const addProduct = () => {
    if (!newProduct.productName || !newProduct.sector) return;
    const sector = SECTORS.find(s => s.id === newProduct.sector);
    setProducts(prev => [...prev, {
      id: Date.now().toString(),
      productName: newProduct.productName ?? '',
      cnCode: newProduct.cnCode ?? sector?.cn ?? '',
      sector: newProduct.sector ?? 'steel',
      annualExportTons: newProduct.annualExportTons ?? 0,
      directEmissions: newProduct.directEmissions ?? sector?.factor ?? 0,
      indirectEmissions: newProduct.indirectEmissions ?? 0,
      paidCarbonPrice: newProduct.paidCarbonPrice ?? 0,
      euEtsPrice: newProduct.euEtsPrice ?? DEFAULT_ETS_PRICE,
    }]);
    setNewProduct({ euEtsPrice: DEFAULT_ETS_PRICE, paidCarbonPrice: 0 });
    setShowAddForm(false);
  };

  const riskColors = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };
  const riskBg = { high: '#fef2f2', medium: '#fef3c7', low: '#dcfce7' };
  const riskLabel = { high: '高風險', medium: '中風險', low: '低風險' };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>CBAM 碳邊境稅試算器</h1>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>EU Carbon Border Adjustment Mechanism · 歐盟碳邊境調整機制 · 2026年正式課徵</p>
          </div>
        </div>
        {/* Alert Banner */}
        <div style={{ padding: '12px 16px', background: '#fef3c7', border: '1.5px solid #fde68a', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '13px', color: '#92400e' }}>
            <strong>重要時程提醒：</strong>CBAM 過渡期（2023-2025年）僅需申報，2026年起正式課徵。台灣出口商應立即建立碳足跡追蹤機制。
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: '預估年度 CBAM 費用', value: `€${totalCBAmCost.toLocaleString()}`, sub: '歐元/年', color: '#dc2626', desc: '依當前歐盟 ETS 碳價試算' },
          { label: '出口碳排總量', value: `${totalEmissions.toLocaleString()}`, sub: 'tCO₂e/年', color: '#003262', desc: '直接+間接排放合計' },
          { label: '台幣換算（估）', value: `NT$${Math.round(totalCBAmCost * 35).toLocaleString()}`, sub: '新台幣', color: '#7c3aed', desc: '以 €1 ≈ NT$35 估算' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: '13px', fontWeight: 500, marginLeft: '4px' }}>{s.sub}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1.5px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>出口商品 CBAM 試算</span>
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>{products.length} 項商品</span>
          </div>
          <button onClick={() => setShowAddForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#003262', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={13} />新增商品
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['商品名稱', 'CN 稅號', '產業別', '年出口量(噸)', '直接排放(tCO₂e/噸)', '間接排放(tCO₂e/噸)', '總碳排(tCO₂e)', '預估CBAM費用', '風險', '操作'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calculations.map((calc, i) => {
                const sector = SECTORS.find(s => s.id === calc.sector);
                return (
                  <tr key={calc.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{calc.productName}</td>
                    <td style={{ padding: '12px', fontSize: '12px', fontFamily: 'monospace', color: '#374151' }}>{calc.cnCode}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 600, background: '#e0f2fe', color: '#0369a1' }}>{sector?.name}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#374151', textAlign: 'right' }}>{calc.annualExportTons.toLocaleString()}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#374151', textAlign: 'right' }}>{calc.directEmissions}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#374151', textAlign: 'right' }}>{calc.indirectEmissions}</td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 700, color: '#003262', textAlign: 'right' }}>{calc.totalEmissions.toLocaleString()}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: riskColors[calc.riskLevel as keyof typeof riskColors] }}>€{calc.estimatedCost.toLocaleString()}</div>
                      <div style={{ fontSize: '10px', color: '#9ca3af' }}>€{calc.costPerTon}/噸</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: riskBg[calc.riskLevel as keyof typeof riskBg], color: riskColors[calc.riskLevel as keyof typeof riskColors] }}>
                        {riskLabel[calc.riskLevel as keyof typeof riskLabel]}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => setProducts(prev => prev.filter(p => p.id !== calc.id))} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowAddForm(false)}>
          <div style={{ background: 'white', borderRadius: '18px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>新增出口商品</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af' }}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'productName', label: '商品名稱 *', placeholder: '例：熱軋鋼板', type: 'text' },
                { key: 'cnCode', label: 'CN 稅號', placeholder: '例：7208.37', type: 'text' },
                { key: 'annualExportTons', label: '年出口量（噸）', placeholder: '5000', type: 'number' },
                { key: 'directEmissions', label: '直接排放係數（tCO₂e/噸）', placeholder: '1.89', type: 'number' },
                { key: 'indirectEmissions', label: '間接排放係數（tCO₂e/噸）', placeholder: '0.32', type: 'number' },
                { key: 'paidCarbonPrice', label: '已支付碳價（EUR/tCO₂e）', placeholder: '0', type: 'number' },
                { key: 'euEtsPrice', label: 'EU ETS 碳價（EUR/tCO₂e）', placeholder: '65', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                  {f.key === 'sector' ? (
                    <select style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }} onChange={e => setNewProduct(p => ({ ...p, sector: e.target.value }))}>
                      {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder} onChange={e => setNewProduct(p => ({ ...p, [f.key]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>產業別 *</label>
                <select onChange={e => setNewProduct(p => ({ ...p, sector: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
                  {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name} — 預設係數 {s.factor} tCO₂e/噸</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
                <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '9px', fontSize: '13px', cursor: 'pointer' }}>取消</button>
                <button onClick={addProduct} style={{ flex: 2, padding: '10px', background: 'linear-gradient(135deg, #0369a1, #003262)', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>加入試算</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reduction Tips */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', marginBottom: '14px' }}>🌱 CBAM 費用減量建議</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { title: '導入再生能源', desc: '採購綠電或自建太陽能可降低間接排放係數，直接減少 CBAM 計費基礎', saving: '可節省 20-40%', color: '#16a34a' },
            { title: '製程低碳化', desc: '採用電弧爐（EAF）替代高爐煉鋼等低碳製程，大幅降低直接排放係數', saving: '可節省 30-60%', color: '#003262' },
            { title: '取得碳抵消額度', desc: '購買台灣碳交所認可的碳抵消額度，可用於抵減 CBAM 申報量', saving: '可節省 10-25%', color: '#7c3aed' },
          ].map(tip => (
            <div key={tip.title} style={{ padding: '14px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937', marginBottom: '6px' }}>{tip.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '8px' }}>{tip.desc}</div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: tip.color, background: `${tip.color}15`, padding: '2px 8px', borderRadius: '5px' }}>{tip.saving}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}