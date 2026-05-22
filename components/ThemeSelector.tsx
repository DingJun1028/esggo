'use client';
import { useState, useEffect } from 'react';
import { Palette, Star, StarOff, Check, Heart } from 'lucide-react';
import {
  THEMES, applyTheme, getSavedTheme, getFavoriteThemes,
  saveFavoriteTheme, removeFavoriteTheme, type ThemeId
} from '../lib/theme-config';

interface ThemeSelectorProps {
  collapsed?: boolean;
}

export default function ThemeSelector({ collapsed }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeId>('minimal-blue');
  const [favorites, setFavorites] = useState<ThemeId[]>(['minimal-blue']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getSavedTheme();
    setCurrent(saved);
    applyTheme(saved);
    setFavorites(getFavoriteThemes());
  }, []);

  if (!mounted) return null;

  const handleSelect = (id: ThemeId) => {
    setCurrent(id);
    applyTheme(id);
    setOpen(false);
  };

  const toggleFavorite = (e: React.MouseEvent, id: ThemeId) => {
    e.stopPropagation();
    const favs = getFavoriteThemes();
    if (favs.includes(id)) {
      removeFavoriteTheme(id);
      setFavorites(favs.filter(f => f !== id));
    } else {
      saveFavoriteTheme(id);
      setFavorites([...favs, id]);
    }
  };

  const currentTheme = THEMES.find(t => t.id === current);
  const favoriteThemes = THEMES.filter(t => favorites.includes(t.id));
  const otherThemes = THEMES.filter(t => !favorites.includes(t.id));

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        title={collapsed ? `主題：${currentTheme?.name}` : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: collapsed ? '8px 10px' : '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: open ? 'var(--bg-active)' : 'var(--bg-hover)',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          transition: 'all 0.15s',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <span style={{ fontSize: '14px', flexShrink: 0 }}>{currentTheme?.emoji}</span>
        {!collapsed && (
          <>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: 500, color: 'var(--text-primary)' }}>
              {currentTheme?.name}
            </span>
            <Palette size={12} style={{ flexShrink: 0 }} />
          </>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: collapsed ? '100%' : 0,
            marginLeft: collapsed ? '8px' : 0,
            width: '260px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={14} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>外觀主題</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>點 ★ 加入最愛</span>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {favoriteThemes.length > 0 && (
                <div>
                  <div style={{ padding: '8px 14px 4px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={10} fill="currentColor" /> 我的最愛
                  </div>
                  {favoriteThemes.map(theme => (
                    <ThemeItem
                      key={theme.id}
                      theme={theme}
                      isCurrent={current === theme.id}
                      isFavorite={true}
                      onSelect={() => handleSelect(theme.id)}
                      onToggleFav={(e) => toggleFavorite(e, theme.id)}
                    />
                  ))}
                </div>
              )}

              {otherThemes.length > 0 && (
                <div>
                  {favoriteThemes.length > 0 && (
                    <div style={{ padding: '8px 14px 4px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      其他主題
                    </div>
                  )}
                  {otherThemes.map(theme => (
                    <ThemeItem
                      key={theme.id}
                      theme={theme}
                      isCurrent={current === theme.id}
                      isFavorite={false}
                      onSelect={() => handleSelect(theme.id)}
                      onToggleFav={(e) => toggleFavorite(e, theme.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-hover)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                主題偏好已自動儲存至本機
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ThemeItemProps {
  theme: (typeof THEMES)[0];
  isCurrent: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFav: (e: React.MouseEvent) => void;
}

function ThemeItem({ theme, isCurrent, isFavorite, onSelect, onToggleFav }: ThemeItemProps) {
  const [hover, setHover] = useState(false);

  const previewColors = [
    theme.vars['--accent-primary'],
    theme.vars['--accent-gold'],
    theme.vars['--bg-primary'],
    theme.vars['--bg-card'],
  ];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        background: hover || isCurrent ? 'var(--bg-hover)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
        {previewColors.map((c, i) => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '3px', background: c, border: '1px solid rgba(0,0,0,0.08)' }} />
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: isCurrent ? 600 : 400, color: 'var(--text-primary)' }}>
            {theme.emoji} {theme.name}
          </span>
          {isCurrent && <Check size={11} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {theme.description}
        </div>
      </div>

      <button
        onClick={onToggleFav}
        title={isFavorite ? '從最愛移除' : '加入最愛'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#f59e0b' : '#d1d5db', flexShrink: 0, padding: '2px', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
      >
        <Star size={13} fill={isFavorite ? '#f59e0b' : 'none'} />
      </button>
    </button>
  );
}