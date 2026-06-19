'use client';

import React, { useState } from 'react';
import { Moon, Sun, Droplets } from 'lucide-react';

const THEMES = [
    { id: 'aqua', label: 'Aqua', icon: Droplets, class: 'theme-aqua' },
    { id: 'solar', label: 'Solar Glass', icon: Sun, class: 'theme-solar' },
    { id: 'moonlight', label: 'Moonlight', icon: Moon, class: 'theme-moonlight' },
] as const;

type ThemeId = typeof THEMES[number]['id'];

export default function ThemeToggle() {
    const [active, setActive] = useState<ThemeId>('aqua');

    const handleChange = (id: ThemeId) => {
        setActive(id);
        // 移除舊 theme class，套用新 theme class
        document.documentElement.className = document.documentElement.className
            .split(' ')
            .filter(c => !THEMES.some(t => t.class === c))
            .concat(THEMES.find(t => t.id === id)!.class)
            .join(' ');
    };

    return (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-omni-card-bg border border-omni-glass-border">
            {THEMES.map(t => {
                const Icon = t.icon;
                const isActive = t.id === active;
                return (
                    <button
                        key={t.id}
                        onClick={() => handleChange(t.id)}
                        title={t.label}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-omni-primary/20 text-omni-primary shadow-[0_0_8px_var(--theme-primary,rgba(99,102,241,0.4))]'
                            : 'text-omni-text-muted hover:text-omni-text-main hover:bg-omni-surface'
                            }`}
                    >
                        <Icon size={14} />
                    </button>
                );
            })}
        </div>
    );
}
