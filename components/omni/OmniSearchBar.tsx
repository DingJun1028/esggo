import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_GRI_RESULTS = [
  { id: 'GRI-201', title: '經濟績效 (Economic Performance)' },
  { id: 'GRI-302', title: '能源 (Energy)' },
  { id: 'GRI-305', title: '排放 (Emissions)' },
  { id: 'GRI-403', title: '職業健康與安全 (Occupational Health and Safety)' },
  { id: 'GRI-413', title: '當地社區 (Local Communities)' },
];

export default function OmniSearchBar({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filtered = MOCK_GRI_RESULTS.filter(i => 
    i.id.toLowerCase().includes(value.toLowerCase()) || 
    i.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative w-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <div 
        className={`flex items-center gap-2 px-3 py-2 transition-colors rounded-lg ${
          isFocused ? 'shadow-[0_0_12px_rgba(6,182,212,0.3)]' : ''
        }`}
        style={{
          background: 'var(--glass-frosted)',
          border: isFocused ? '1px solid var(--accent-primary)' : '1px solid var(--sidebar-border)',
        }}
      >
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="搜尋 GRI 指標、模組..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsSearching(true);
            setTimeout(() => setIsSearching(false), 300);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            fontSize: 11, color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit',
          }}
        />
        {isSearching && <Loader2 size={12} className="animate-spin text-cyan-500" />}
      </div>

      <AnimatePresence>
        {isFocused && value && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: 8,
              background: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)',
              borderRadius: 8, zIndex: 100, overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div style={{
              padding: '6px 12px', borderBottom: '1px solid var(--sidebar-border)',
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)'
            }}>
              GRI 智慧補全 (GRI Tracker)
            </div>
            {filtered.length > 0 ? (
              <ul style={{ maxHeight: 200, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0 }}>
                {filtered.map(item => (
                  <li 
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    style={{
                      padding: '8px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2,
                      borderBottom: '1px solid rgba(255,255,255,0.02)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>{item.id}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
                無 GRI 指標匹配。將執行全站搜尋...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
