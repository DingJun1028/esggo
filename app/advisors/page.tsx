'use client';

import { useState } from 'react';
import {
  Users, Star, MapPin, Globe, Clock, CheckCircle, MessageSquare,
  Phone, ChevronDown, ChevronRight, Award, Zap, X, Calendar, Search
} from 'lucide-react';
import { ADVISORS, type Advisor, type AdvisorStatus } from '../../lib/advisor-data';

const BLUE = '#003262';
const GOLD = '#FDB515';

const STATUS_MAP: Record<AdvisorStatus, { label: string; color: string; bg: string; dot: string }> = {
  available: { label: '可預約', color: '#16A34A', bg: '#DCFCE7', dot: '#16A34A' },
  busy: { label: '忙碌中', color: '#D97706', bg: '#FEF3C7', dot: '#D97706' },
  unavailable: { label: '暫不可預約', color: '#94A3B8', bg: '#F1F5F9', dot: '#94A3B8' },
};

const MODULE_COLORS: Record<string, { color: string; bg: string }> = {
  '健檢解讀': { color: BLUE, bg: '#EBF2FF' },
  '揭露輔導': { color: '#2E8B57', bg: '#EAFAF1' },
  '資料盤點': { color: '#B8860B', bg: '#FFFBEB' },
  '客戶問卷/標案回覆': { color: '#4B0082', bg: '#F5F0FF' },
  '1:1 Expert Hour': { color: '#DC2626', bg: '#FEF2F2' },
};

export default function AdvisorsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdvisorStatus>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState<string | null>(null);
  const [bookingModule, setBookingModule] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  const filtered = ADVISORS.filter(a => {
    const matchSearch = !search || a.name.includes(search) || a.nameEn.toLowerCase().includes(search.toLowerCase()) || a.specialties.some(s => s.includes(search));
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleBook = () => {
    if (!bookingModule) return;
    setBookingDone(true);
    setTimeout(() => { setShowBooking(null); setBookingDone(false); setBookingModule(''); setBookingNote(''); }, 2000);
  };

  const bookingAdvisor = ADVISORS.find(a => a.id === showBooking);

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Users size={20} color={GOLD} />
            <span style={{ color: '#A8C8E8', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              Advisory Council Zone · Berkeley Haas × TSISDA
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 800, margin: '0 0 10px' }}>
            顧問專區 Advisory Council
          </h1>
          <p style={{ color: '#A8C8E8', fontSize: 12, margin: '0 0 14px', lineHeight: 1.6 }}>
            Berkeley Haas × TSISDA 頂尖 ESG 顧問專家陣容，提供精準諮詢媒合服務
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { l: '認證顧問', v: ADVISORS.length },
              { l: '可預約', v: ADVISORS.filter(a => a.status === 'available').length },
              { l: '總諮詢場次', v: ADVISORS.reduce((a, b) => a + b.sessions, 0) },
              { l: '平均評分', v: (ADVISORS.reduce((a, b) => a + b.rating, 0) / ADVISORS.length).toFixed(1) + '★' },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 15 }}>{s.v}</span>
                <span style={{ color: '#A8C8E8', fontSize: 12 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1050, margin: '0 auto', padding: '24px 16px' }}>
        {/* Service Tiers Banner */}
        <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, borderRadius: 14, padding: '18px 22px', marginBottom: 20, border: `2px solid ${GOLD}30` }}>
          <div style={{ fontWeight: 800, color: GOLD, fontSize: 14, marginBottom: 10 }}>顧問服務架構（3 層）</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {[
              { layer: 'Layer A', title: '企業健檢', desc: '同一套題庫貫穿 BD → 課程 → 結業後', icon: '🩺' },
              { layer: 'Layer B', title: '平台工具', desc: '揭露 + 商情偵測 + 中控儀表板', icon: '🖥️' },
              { layer: 'Layer C', title: '顧問諮詢', desc: '配對 / 輪值 / 加購服務', icon: '💬' },
            ].map(l => (
              <div key={l.layer} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 9, padding: '11px 13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{l.icon}</span>
                  <span style={{ color: GOLD, fontWeight: 800, fontSize: 11 }}>{l.layer}</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{l.title}</span>
                </div>
                <p style={{ color: '#A8C8E8', fontSize: 11, margin: 0, lineHeight: 1.5 }}>{l.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋顧問姓名、專業領域..." style={{ width: '100%', padding: '9px 10px 9px 32px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 12, outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([['all', '全部'], ['available', '可預約'], ['busy', '忙碌'], ['unavailable', '暫不可約']] as [typeof statusFilter, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setStatusFilter(k)} style={{ padding: '7px 12px', borderRadius: 7, border: `1.5px solid ${statusFilter === k ? BLUE : '#E2E8F0'}`, background: statusFilter === k ? BLUE : '#fff', color: statusFilter === k ? '#fff' : '#64748B', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Advisor Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map(advisor => {
            const st = STATUS_MAP[advisor.status];
            const isExpanded = selected === advisor.id;
            return (
              <div key={advisor.id} style={{ background: '#fff', borderRadius: 14, border: `2px solid ${isExpanded ? BLUE : '#E2E8F0'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                {/* Card Top */}
                <div style={{ padding: '18px 18px 14px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    {/* Avatar */}
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, flexShrink: 0, border: `2px solid ${GOLD}` }}>
                      {advisor.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: '#111', fontSize: 14, lineHeight: 1.3 }}>{advisor.name}</div>
                      <div style={{ fontSize: 11, color: '#3B7EA1', fontWeight: 600, marginTop: 1 }}>{advisor.title}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{advisor.org}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={10} color="#94A3B8" />
                          <span style={{ fontSize: 10, color: '#94A3B8' }}>{advisor.country}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={10} fill={GOLD} color={GOLD} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>{advisor.rating}</span>
                          <span style={{ fontSize: 10, color: '#94A3B8' }}>({advisor.sessions} 場)</span>
                        </div>
                        <span style={{ background: st.bg, color: st.color, borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />
                          {st.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                    {advisor.specialties.slice(0, 3).map(s => (
                      <span key={s} style={{ background: '#EBF2FF', color: BLUE, borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{s}</span>
                    ))}
                    {advisor.specialties.length > 3 && (
                      <span style={{ background: '#F1F5F9', color: '#64748B', borderRadius: 5, padding: '2px 8px', fontSize: 10 }}>+{advisor.specialties.length - 3}</span>
                    )}
                  </div>

                  {/* Fee */}
                  <div style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', borderRadius: 7, padding: '6px 10px', marginBottom: 12 }}>
                    💰 {advisor.fee}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => advisor.status === 'available' && setShowBooking(advisor.id)}
                      disabled={advisor.status !== 'available'}
                      style={{ flex: 1, padding: '9px', borderRadius: 8, background: advisor.status === 'available' ? BLUE : '#F1F5F9', color: advisor.status === 'available' ? '#fff' : '#94A3B8', border: 'none', cursor: advisor.status === 'available' ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <Calendar size={13} />預約諮詢
                    </button>
                    <button onClick={() => setSelected(isExpanded ? null : advisor.id)} style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}詳情
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F1F5F9', padding: '14px 18px', background: '#FAFBFD' }}>
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>{advisor.bio}</div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>可協助模組</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {advisor.modules.map(m => {
                          const mc = MODULE_COLORS[m] || { color: '#374151', bg: '#F1F5F9' };
                          return (
                            <span key={m} style={{ background: mc.bg, color: mc.color, borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>{m}</span>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>諮詢語言</div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {advisor.languages.map(l => (
                            <span key={l} style={{ background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 600 }}>{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && bookingAdvisor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '90%', maxWidth: 480 }}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={48} color="#16A34A" style={{ margin: '0 auto 12px', display: 'block' }} />
                <div style={{ fontWeight: 800, color: '#16A34A', fontSize: 18, marginBottom: 6 }}>預約成功！</div>
                <div style={{ color: '#64748B', fontSize: 13 }}>系統將發送確認信至您的 Email</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: BLUE, margin: 0 }}>預約諮詢 — {bookingAdvisor.name}</h3>
                  <button onClick={() => setShowBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#94A3B8" /></button>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 6 }}>選擇諮詢模組 *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {bookingAdvisor.modules.map(m => {
                      const mc = MODULE_COLORS[m] || { color: '#374151', bg: '#F1F5F9' };
                      return (
                        <button key={m} onClick={() => setBookingModule(m)} style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${bookingModule === m ? mc.color : '#E2E8F0'}`, background: bookingModule === m ? mc.bg : '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 12, fontWeight: bookingModule === m ? 700 : 500, color: bookingModule === m ? mc.color : '#374151', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {bookingModule === m && <CheckCircle size={14} color={mc.color} />}{m}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 6 }}>事前描述（公司背景、痛點、期待）</label>
                  <textarea value={bookingNote} onChange={e => setBookingNote(e.target.value)} placeholder="請簡述公司基本背景、主要 ESG 痛點，以及對本次諮詢的期待..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 12, outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleBook} className="btn-primary" style={{ flex: 1 }}>確認預約</button>
                  <button onClick={() => setShowBooking(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}