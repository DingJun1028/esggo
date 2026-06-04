'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThemeStore } from '../lib/theme-store';
export default function ThemeSwitcher() {
    const { sidebarTheme, setSidebarTheme } = useThemeStore();
    const themes = [
        {
            id: 'light',
            label: '淺色',
            bg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-600',
            activeBg: 'bg-[#003262]',
            activeBorder: 'border-[#003262]',
            activeText: 'text-white',
            icon: 'bg-white border-gray-300',
        },
        {
            id: 'dark',
            label: '深色',
            bg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-600',
            activeBg: 'bg-[#003262]',
            activeBorder: 'border-[#FDB515]',
            activeText: 'text-[#FDB515]',
            icon: 'bg-[#003262] border-blue-800',
        },
        {
            id: 'glass',
            label: '液態',
            bg: 'bg-white/40 backdrop-blur-xl',
            border: 'border-white/60',
            text: 'text-gray-600',
            activeBg: 'bg-white/60 backdrop-blur-xl',
            activeBorder: 'border-[#FDB515]/50',
            activeText: 'text-[#FDB515]',
            icon: 'bg-white/60 backdrop-blur-sm border-white/60',
        },
    ];
    return (_jsxs("div", { className: "flex items-center gap-2 p-3 border-t border-gray-100", children: [_jsx("span", { className: "text-xs text-gray-500 font-medium flex-shrink-0", children: "\u4E3B\u984C" }), _jsx("div", { className: "flex gap-1.5 flex-1", children: themes.map((theme) => (_jsxs("button", { onClick: () => setSidebarTheme(theme.id), title: `${theme.label}主題`, className: `flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${sidebarTheme === theme.id
                        ? `${theme.activeBg} ${theme.activeBorder} ${theme.activeText} shadow-sm`
                        : `${theme.bg} ${theme.border} ${theme.text} hover:border-gray-300`}`, children: [_jsx("span", { className: `w-3 h-3 rounded-sm border ${theme.icon} inline-block flex-shrink-0` }), theme.label] }, theme.id))) })] }));
}
//# sourceMappingURL=ThemeSwitcher.js.map