'use client';

import { useI18n } from '../i18n/I18nProvider';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

const FIVE_T = [
  { symbol: 'T¹', label: 'Traceable', zh: '可溯源', color: '#63a6b0' },
  { symbol: 'T²', label: 'Transparent', zh: '可驗算', color: '#52C41A' },
  { symbol: 'T³', label: 'Tangible', zh: '可感知', color: '#ffd700' },
  { symbol: 'T⁴', label: 'Trustworthy', zh: '不可篡改', color: '#a78bfa' },
  { symbol: 'T⁵', label: 'Trackable', zh: '可追蹤', color: '#38b2ac' },
];

// 首頁 Hero 區塊（多語系）。品牌標語「深貫廣通 無縫接軌」由 i18n 驅動，
// 右上角提供語言切換器。
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section
      style={{
        textAlign: 'center',
        padding: '80px 32px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景光暈 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(99,166,176,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 語言切換器 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <LanguageSwitcher />
      </div>

      {/* 主標題（shimmer 漸層大字） */}
      <div
        style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #63a6b0, #ffd700, #63a6b0)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 'clamp(42px, 6vw, 72px)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 16,
          animation: 'shimmer 3s linear infinite',
        }}
      >
        {t('hero.title')}
      </div>

      {/* 品牌標語：深貫廣通 無縫接軌 */}
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#ffd700',
          maxWidth: 560,
          margin: '0 auto 12px',
          lineHeight: 1.6,
          letterSpacing: '0.04em',
        }}
      >
        {t('brand.tagline')}
      </p>

      <p
        style={{
          fontSize: 18,
          color: '#94a3b8',
          maxWidth: 520,
          margin: '0 auto 12px',
          lineHeight: 1.7,
        }}
      >
        {t('hero.subtitle')}
      </p>
      <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto 40px' }}>
        {t('hero.description')}
      </p>

      {/* 5T 指示器 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {FIVE_T.map((item) => (
          <div
            key={item.symbol}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${item.color}40`,
              borderRadius: 12,
              padding: '8px 16px',
              minWidth: 80,
              transition: 'transform 0.2s, border-color 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`;
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.symbol}</span>
            <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.zh}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
