'use client';

import { useState } from 'react';
import {
  Zap, Gift, Copy, CheckCircle, Plus, Star, TrendingUp, Users,
  Award, X, ExternalLink, Clock, Tag, RefreshCw, Shield, Coins
} from 'lucide-react';
import {
  AGENTS, REFERRAL_CODES, GOODCOIN_REWARDS, TIER_CONFIG,
  type Agent, type AgentTier, type ReferralCode
} from '../../lib/advisor-data';

const BLUE = '#003262';
const GOLD = '#FDB515';

type Tab = 'overview' | 'codes' | 'wallet' | 'leaderboard' | 'apply';

export default function AgentsPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemResult, setRedeemResult] = useState<null | { ok: boolean; msg: string; coins?: number }>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [myCoins] = useState(1250);
  const [showApply, setShowApply] = useState(false);
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyOrg, setApplyOrg] = useState('');
  const [applyRegion, setApplyRegion] = useState('');
  const [applyBio, setApplyBio] = useState('');
  const [applied, setApplied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    setRedeemResult(null);
    await new Promise(r => setTimeout(r, 1200));
    const found = REFERRAL_CODES.find(c => c.code.toUpperCase() === redeemCode.toUpperCase() && c.status === 'active');
    if (found) {
      const coins = Math.floor(found.goodCoinReward * found.bonusMultiplier);
      setRedeemResult({ ok: true, msg: `✓ 兌換成功！獲得 ${coins} 善向幣`, coins });
    } else {
      setRedeemResult({ ok: false, msg: '✗ 無效推廣碼或已過期，請確認代碼正確性' });
    }
    setRedeeming(false);
  };

  const handleApply = () => {
    if (!applyName.trim() || !applyEmail.trim()) return;
    setApplied(true);
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: '代理總覽' },
    { key: 'codes', label: '推廣碼庫' },
    { key: 'wallet', label: '善向幣錢包' },
    { key: 'leaderboard', label: '排行榜' },
    { key: 'apply', label: '申請代理' },
  ];

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Zap size={20} color={GOLD} />
            <span style={{ color: '#A8C8E8', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              Sustainability Alliance · Agent Zone · 善向幣 GoodCoin™
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 800, margin: '0 0 8px' }}>
            代理專區 & 永續聯盟
          </h1>
          <p style={{ color: '#A8C8E8', fontSize: 12, margin: '0 0 14px', lineHeight: 1.6 }}>
            加入永續聯盟代理網絡，透過推廣 ESG GO 平台獲得善向幣，兌換諮詢服務與課程折抵
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { l: '活躍代理', v: AGENTS.filter(a => a.status === 'active').length },
              { l: '推廣碼總數', v: REFERRAL_CODES.length },
              { l: '我的善向幣', v: `${myCoins.toLocaleString()} 幣` },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 15 }}>{s.v}</span>
                <span style={{ color: '#A8C8E8', fontSize: 12 }}>{s.l}</span>
              </div>
            ))}
            {/* GoodCoin Badge */}
            <div style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #E6A500 100%)`, borderRadius: 10, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Gift size={15} color={BLUE} />
              <span style={{ color: BLUE, fontWeight: 900, fontSize: 13 }}>善向幣 GoodCoin™</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto', display: 'flex', padding: '0 16px', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              color: tab === t.key ? BLUE : '#64748B',
              borderBottom: tab === t.key ? `3px solid ${GOLD}` : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1050, margin: '0 auto', padding: '24px 16px' }}>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Alliance Intro */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, borderRadius: 16, padding: '24px', border: `2px solid ${GOLD}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Shield size={24} color={GOLD} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>永續聯盟代理推廣體系</div>
                  <div style={{ color: '#A8C8E8', fontSize: 12, marginTop: 2 }}>Sustainability Alliance · ESG GO 正式授權代理網絡</div>
                </div>
              </div>
              <p style={{ color: '#A8C8E8', fontSize: 12, lineHeight: 1.8, margin: '0 0 16px' }}>
                成為 ESG GO 永續聯盟代理，每成功推廣一位企業客戶加入平台，即可獲得對應的<strong style={{ color: GOLD }}>善向幣（GoodCoin™）</strong>。善向幣可用於兌換顧問諮詢時間、課程折抵與其他增值服務。代理層級越高，每次推廣獲得的善向幣乘數越高。
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                {(Object.entries(TIER_CONFIG) as [AgentTier, typeof TIER_CONFIG[AgentTier]][]).map(([tier, cfg]) => (
                  <div key={tier} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 9, padding: '11px 13px', border: `1px solid ${cfg.color}40` }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 13, marginBottom: 3 }}>
                      {cfg.icon} {cfg.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#A8C8E8' }}>推薦數 ≥ {cfg.minReferrals} 人</div>
                    <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, marginTop: 3 }}>× {cfg.multiplier} 倍善向幣</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {AGENTS.map(agent => {
                const tierCfg = TIER_CONFIG[agent.tier];
                return (
                  <div key={agent.id} style={{ background: '#fff', borderRadius: 12, border: `2px solid ${tierCfg.color}30`, overflow: 'hidden' }}>
                    <div style={{ background: tierCfg.bg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${tierCfg.color}20` }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${tierCfg.color} 0%, ${tierCfg.color}99 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                        {agent.name.slice(0, 1)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#111', fontSize: 14 }}>{agent.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{agent.region}</div>
                      </div>
                      <span style={{ background: tierCfg.bg, color: tierCfg.color, border: `1.5px solid ${tierCfg.color}`, borderRadius: 6, padding: '2px 9px', fontSize: 10, fontWeight: 800 }}>
                        {tierCfg.icon} {tierCfg.label}
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6, margin: '0 0 10px' }}>{agent.bio}</p>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                        {agent.specialties.map(s => (
                          <span key={s} style={{ background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                        {[{ l: '成功推薦', v: `${agent.referrals} 人` }, { l: '善向幣餘額', v: `${agent.goodCoins.toLocaleString()} 幣` }].map(s => (
                          <div key={s.l} style={{ background: '#F8FAFC', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: BLUE }}>{s.v}</div>
                            <div style={{ fontSize: 10, color: '#64748B' }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      {/* Referral Code */}
                      <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px dashed #E2E8F0' }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>專屬推廣碼</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, fontFamily: 'monospace', marginTop: 2 }}>{agent.code}</div>
                        </div>
                        <button onClick={() => handleCopy(agent.code)} style={{ background: copiedCode === agent.code ? '#DCFCE7' : '#EBF2FF', border: 'none', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: copiedCode === agent.code ? '#16A34A' : BLUE, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
                          {copiedCode === agent.code ? <><CheckCircle size={12} />已複製</> : <><Copy size={12} />複製</>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Codes ── */}
        {tab === 'codes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Redeem Box */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, borderRadius: 14, padding: '22px', border: `2px solid ${GOLD}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Gift size={20} color={GOLD} />
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>輸入推廣碼 · 獲得善向幣</div>
              </div>
              <p style={{ color: '#A8C8E8', fontSize: 12, margin: '0 0 14px', lineHeight: 1.6 }}>
                輸入您的永續聯盟推廣碼或代理專屬碼，立即兌換善向幣（GoodCoin™）。善向幣可用於兌換顧問諮詢時間、課程折扣等服務。
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  value={redeemCode}
                  onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="輸入推廣碼（例：ALLIANCE-GREEN-2025）"
                  style={{ flex: 1, minWidth: 200, padding: '11px 14px', borderRadius: 9, border: `2px solid ${GOLD}50`, fontSize: 13, outline: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}
                />
                <button onClick={handleRedeem} disabled={redeeming || !redeemCode.trim()} style={{ padding: '11px 22px', borderRadius: 9, background: GOLD, border: 'none', color: BLUE, fontWeight: 900, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <Gift size={15} />{redeeming ? '驗證中...' : '立即兌換'}
                </button>
              </div>
              {redeemResult && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 9, background: redeemResult.ok ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)', border: `1.5px solid ${redeemResult.ok ? '#16A34A' : '#DC2626'}`, fontSize: 13, color: redeemResult.ok ? '#DCFCE7' : '#FEE2E2', fontWeight: 700 }}>
                  {redeemResult.msg}
                  {redeemResult.ok && redeemResult.coins && (
                    <span style={{ marginLeft: 12, background: GOLD, color: BLUE, borderRadius: 5, padding: '2px 10px', fontSize: 12 }}>+{redeemResult.coins} 善向幣</span>
                  )}
                </div>
              )}
            </div>

            {/* Active Codes */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: BLUE, margin: '4px 0 0' }}>永續聯盟現行推廣碼</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REFERRAL_CODES.map(rc => (
                <div key={rc.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    {/* Code Block */}
                    <div style={{ background: '#EBF2FF', borderRadius: 9, padding: '10px 16px', border: '2px dashed #003262', minWidth: 220 }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, marginBottom: 3 }}>推廣碼</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: BLUE, fontFamily: 'monospace', letterSpacing: 1 }}>{rc.code}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#111', fontSize: 13 }}>{rc.campaign}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>發行：{rc.agentName} · 效期至 {rc.expiresAt}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDB51540', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>
                          +{rc.goodCoinReward} × {rc.bonusMultiplier}x = {Math.floor(rc.goodCoinReward * rc.bonusMultiplier)} 善向幣
                        </span>
                        <span style={{ background: '#DCFCE7', color: '#16A34A', borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 700 }}>現行有效</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>已使用 {rc.uses}/{rc.maxUses}</div>
                      <div style={{ height: 5, width: 80, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ height: '100%', width: `${(rc.uses / rc.maxUses) * 100}%`, background: BLUE, borderRadius: 3 }} />
                      </div>
                      <button onClick={() => handleCopy(rc.code)} style={{ background: copiedCode === rc.code ? '#DCFCE7' : BLUE, border: 'none', borderRadius: 7, padding: '7px 14px', cursor: 'pointer', color: copiedCode === rc.code ? '#16A34A' : '#fff', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
                        {copiedCode === rc.code ? <><CheckCircle size={13} />已複製</> : <><Copy size={13} />複製</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Wallet ── */}
        {tab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Balance Card */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 60%, #2E5D9E 100%)`, borderRadius: 16, padding: '28px', border: `3px solid ${GOLD}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Gift size={28} color={GOLD} />
                <div>
                  <div style={{ color: '#A8C8E8', fontSize: 12, fontWeight: 700 }}>善向幣 GoodCoin™ 餘額</div>
                  <div style={{ color: '#fff', fontSize: 42, fontWeight: 900, lineHeight: 1.1 }}>
                    {myCoins.toLocaleString()}
                    <span style={{ fontSize: 16, color: GOLD, marginLeft: 8 }}>幣</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ color: '#A8C8E8', fontSize: 10, marginBottom: 3 }}>本月獲得</div>
                  <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>+480</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ color: '#A8C8E8', fontSize: 10, marginBottom: 3 }}>累計兌換</div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>350</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ color: '#A8C8E8', fontSize: 10, marginBottom: 3 }}>代理等級乘數</div>
                  <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>× 1.5x</div>
                </div>
              </div>
            </div>

            {/* Redeem Rewards */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: BLUE, marginBottom: 12 }}>可兌換項目</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {GOODCOIN_REWARDS.map(r => {
                  const canRedeem = myCoins >= r.coins;
                  return (
                    <div key={r.title} style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${canRedeem ? '#E2E8F0' : '#F1F5F9'}`, padding: 18, opacity: canRedeem ? 1 : 0.6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111', fontSize: 13 }}>{r.title}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{r.category}</div>
                        </div>
                        <div style={{ background: canRedeem ? '#FFFBEB' : '#F1F5F9', color: canRedeem ? '#92400E' : '#94A3B8', borderRadius: 7, padding: '4px 10px', textAlign: 'center', border: canRedeem ? `1.5px solid ${GOLD}` : '1.5px solid #E2E8F0' }}>
                          <div style={{ fontSize: 16, fontWeight: 900 }}>{r.coins}</div>
                          <div style={{ fontSize: 9, fontWeight: 700 }}>善向幣</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5, margin: '0 0 12px' }}>{r.desc}</p>
                      <button disabled={!canRedeem} style={{ width: '100%', padding: '9px', borderRadius: 8, background: canRedeem ? BLUE : '#F1F5F9', color: canRedeem ? '#fff' : '#94A3B8', border: 'none', cursor: canRedeem ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700 }}>
                        {canRedeem ? '立即兌換' : `尚差 ${r.coins - myCoins} 幣`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction Log */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: BLUE, marginBottom: 10 }}>善向幣交易記錄</h3>
              <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                {[
                  { type: 'earn', desc: '推廣碼 ALLIANCE-GREEN-2025 兌換', amount: +300, date: '2026-05-13', code: 'ALLIANCE-GREEN-2025' },
                  { type: 'earn', desc: '成功引薦企業客戶：測試公司', amount: +200, date: '2026-05-10', code: 'SME-TRANSFORM-25' },
                  { type: 'redeem', desc: '兌換：諮詢加值券 30 分鐘', amount: -100, date: '2026-05-08', code: '' },
                  { type: 'bonus', desc: '代理升等獎勵（銅牌→白銀）', amount: +250, date: '2026-04-30', code: '' },
                  { type: 'earn', desc: '推廣碼 BERKELEY-ESG-2025 兌換', amount: +600, date: '2026-04-15', code: 'BERKELEY-ESG-2025' },
                ].map((tx, i) => (
                  <div key={i} style={{ padding: '12px 18px', borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: tx.amount > 0 ? '#EAFAF1' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {tx.amount > 0 ? <TrendingUp size={16} color="#16A34A" /> : <Gift size={16} color="#DC2626" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#111', fontSize: 12 }}>{tx.desc}</div>
                      {tx.code && <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'monospace', marginTop: 2 }}>{tx.code}</div>}
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={9} />{tx.date}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: tx.amount > 0 ? '#16A34A' : '#DC2626', flexShrink: 0 }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Leaderboard ── */}
        {tab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, borderRadius: 14, padding: '20px 22px', border: `2px solid ${GOLD}40`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Award size={28} color={GOLD} />
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>永續聯盟代理排行榜</div>
                <div style={{ color: '#A8C8E8', fontSize: 12, marginTop: 2 }}>依累計推薦數與善向幣排名 · 每月更新</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...AGENTS].sort((a, b) => b.referrals - a.referrals).map((agent, i) => {
                const tierCfg = TIER_CONFIG[agent.tier];
                const rankColor = i === 0 ? GOLD : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#E2E8F0';
                return (
                  <div key={agent.id} style={{ background: '#fff', borderRadius: 12, border: `2px solid ${i === 0 ? GOLD : '#E2E8F0'}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: rankColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontWeight: 900, fontSize: 18, color: i < 3 ? BLUE : '#64748B' }}>#{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#111', fontSize: 14 }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{agent.region} · 推廣碼：<span style={{ fontFamily: 'monospace', color: BLUE }}>{agent.code}</span></div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                        {agent.specialties.map(s => <span key={s} style={{ background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{agent.referrals}</div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>成功推薦</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#B8860B', marginTop: 3 }}>{agent.goodCoins.toLocaleString()} 幣</div>
                      <span style={{ background: tierCfg.bg, color: tierCfg.color, border: `1px solid ${tierCfg.color}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 800 }}>
                        {tierCfg.icon} {tierCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Apply ── */}
        {tab === 'apply' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            {applied ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', textAlign: 'center', border: `2px solid ${GOLD}` }}>
                <CheckCircle size={56} color="#16A34A" style={{ margin: '0 auto 16px', display: 'block' }} />
                <div style={{ fontWeight: 800, color: '#16A34A', fontSize: 20, marginBottom: 8 }}>申請已送出！</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 20 }}>
                  感謝您申請成為 ESG GO 永續聯盟代理。我們將在 3-5 個工作天內審核您的申請，並發送確認通知至您的 Email。
                </div>
                <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', border: `1.5px solid ${GOLD}` }}>
                  <div style={{ fontWeight: 700, color: '#92400E', fontSize: 13, marginBottom: 4 }}>審核通過後，您將獲得：</div>
                  <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.8 }}>
                    ✓ 專屬推廣碼<br />✓ 銅牌代理資格（初始 × 1.0 倍善向幣）<br />✓ 500 善向幣迎新獎勵<br />✓ 代理後台存取權限
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', background: BLUE, color: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>申請成為永續聯盟代理</div>
                  <div style={{ fontSize: 12, color: '#A8C8E8', lineHeight: 1.6 }}>
                    加入 ESG GO 永續聯盟，共同推廣台灣 ESG 生態系發展，每次成功推薦均可獲得善向幣
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    {[{ label: '姓名 *', val: applyName, set: setApplyName, placeholder: '請輸入真實姓名' }, { label: 'Email *', val: applyEmail, set: setApplyEmail, placeholder: 'your@email.com' }, { label: '所屬機構/公司', val: applyOrg, set: setApplyOrg, placeholder: '公司或機構名稱' }, { label: '推廣地區', val: applyRegion, set: setApplyRegion, placeholder: '例：台北市、新竹縣' }].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 5 }}>{f.label}</label>
                        <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 5 }}>ESG 背景與推廣理念（50字以上）</label>
                    <textarea value={applyBio} onChange={e => setApplyBio(e.target.value)} placeholder="請簡述您的 ESG 相關背景、經驗，以及希望如何推廣永續聯盟..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 12, outline: 'none', resize: 'vertical', minHeight: 100, boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  {/* GoodCoin Preview */}
                  <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '13px 16px', border: `1.5px solid ${GOLD}40`, marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: 12, marginBottom: 6 }}>申請通過後即可獲得</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['🎁 迎新善向幣 500 幣', '🥉 銅牌代理資格', '📣 專屬推廣碼', '📊 代理後台'].map(i => (
                        <span key={i} style={{ background: '#fff', border: `1px solid ${GOLD}40`, color: '#78350F', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{i}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleApply} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                    <Zap size={15} />提交代理申請
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}