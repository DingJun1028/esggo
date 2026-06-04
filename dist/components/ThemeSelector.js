'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Palette, Star, Check, Heart } from 'lucide-react';
import { THEMES, applyTheme, getSavedTheme, getFavoriteThemes, saveFavoriteTheme, removeFavoriteTheme } from '../lib/theme-config';
export default function ThemeSelector({ collapsed, currentTheme, onSelect }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState('minimal-blue');
    const [favorites, setFavorites] = useState(['minimal-blue']);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        const saved = getSavedTheme();
        setCurrent(saved);
        applyTheme(saved);
        setFavorites(getFavoriteThemes());
    }, []);
    if (!mounted)
        return null;
    const handleSelect = (id) => {
        setCurrent(id);
        applyTheme(id);
        setOpen(false);
        if (onSelect)
            onSelect(id);
    };
    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        const favs = getFavoriteThemes();
        if (favs.includes(id)) {
            removeFavoriteTheme(id);
            setFavorites(favs.filter(f => f !== id));
        }
        else {
            saveFavoriteTheme(id);
            setFavorites([...favs, id]);
        }
    };
    const activeTheme = currentTheme || current;
    const activeThemeObj = THEMES.find(t => t.id === activeTheme);
    const favoriteThemes = THEMES.filter(t => favorites.includes(t.id));
    const otherThemes = THEMES.filter(t => !favorites.includes(t.id));
    return (_jsxs("div", { style: { position: 'relative' }, children: [_jsxs("button", { onClick: () => setOpen(!open), title: collapsed ? `主題：${activeThemeObj?.name}` : undefined, style: {
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
                }, children: [_jsx("span", { style: { fontSize: '14px', flexShrink: 0 }, children: activeThemeObj?.emoji }), !collapsed && (_jsxs(_Fragment, { children: [_jsx("span", { style: { flex: 1, textAlign: 'left', fontWeight: 500, color: 'var(--text-primary)' }, children: activeThemeObj?.name }), _jsx(Palette, { size: 12, style: { flexShrink: 0 } })] }))] }), open && (_jsxs(_Fragment, { children: [_jsx("div", { style: { position: 'fixed', inset: 0, zIndex: 40 }, onClick: () => setOpen(false) }), _jsxs("div", { style: {
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
                        }, children: [_jsxs("div", { style: { padding: '12px 14px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(Palette, { size: 14, style: { color: 'var(--accent-primary)' } }), _jsx("span", { style: { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }, children: "\u5916\u89C0\u4E3B\u984C" }), _jsx("span", { style: { fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }, children: "\u9EDE \u2605 \u52A0\u5165\u6700\u611B" })] }), _jsxs("div", { style: { maxHeight: '360px', overflowY: 'auto' }, children: [favoriteThemes.length > 0 && (_jsxs("div", { children: [_jsxs("div", { style: { padding: '8px 14px 4px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx(Heart, { size: 10, fill: "currentColor" }), " \u6211\u7684\u6700\u611B"] }), favoriteThemes.map(theme => (_jsx(ThemeItem, { theme: theme, isCurrent: activeTheme === theme.id, isFavorite: true, onSelect: () => handleSelect(theme.id), onToggleFav: (e) => toggleFavorite(e, theme.id) }, theme.id)))] })), otherThemes.length > 0 && (_jsxs("div", { children: [favoriteThemes.length > 0 && (_jsx("div", { style: { padding: '8px 14px 4px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }, children: "\u5176\u4ED6\u4E3B\u984C" })), otherThemes.map(theme => (_jsx(ThemeItem, { theme: theme, isCurrent: activeTheme === theme.id, isFavorite: false, onSelect: () => handleSelect(theme.id), onToggleFav: (e) => toggleFavorite(e, theme.id) }, theme.id)))] }))] }), _jsx("div", { style: { padding: '10px 14px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-hover)' }, children: _jsx("div", { style: { fontSize: '10px', color: 'var(--text-muted)' }, children: "\u4E3B\u984C\u504F\u597D\u5DF2\u81EA\u52D5\u5132\u5B58\u81F3\u672C\u6A5F" }) })] })] }))] }));
}
function ThemeItem({ theme, isCurrent, isFavorite, onSelect, onToggleFav }) {
    const [hover, setHover] = useState(false);
    const previewColors = [
        theme.vars['--accent-primary'],
        theme.vars['--accent-gold'],
        theme.vars['--bg-primary'],
        theme.vars['--bg-card'],
    ];
    return (_jsxs("button", { onClick: onSelect, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: hover || isCurrent ? 'var(--bg-hover)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
        }, children: [_jsx("div", { style: { display: 'flex', gap: '3px', flexShrink: 0 }, children: previewColors.map((c, i) => (_jsx("div", { style: { width: '12px', height: '12px', borderRadius: '3px', background: c, border: '1px solid rgba(0,0,0,0.08)' } }, i))) }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsxs("span", { style: { fontSize: '13px', fontWeight: isCurrent ? 600 : 400, color: 'var(--text-primary)' }, children: [theme.emoji, " ", theme.name] }), isCurrent && _jsx(Check, { size: 11, style: { color: 'var(--accent-primary)', flexShrink: 0 } })] }), _jsx("div", { style: { fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: theme.description })] }), _jsx("button", { onClick: onToggleFav, title: isFavorite ? '從最愛移除' : '加入最愛', style: { background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#f59e0b' : '#d1d5db', flexShrink: 0, padding: '2px', display: 'flex', alignItems: 'center', borderRadius: '4px' }, children: _jsx(Star, { size: 13, fill: isFavorite ? '#f59e0b' : 'none' }) })] }));
}
//# sourceMappingURL=ThemeSelector.js.map