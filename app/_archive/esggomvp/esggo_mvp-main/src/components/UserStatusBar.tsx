'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Award, Coins, Gem, Shield } from 'lucide-react';

export default function UserStatusBar() {
    const { locale, t } = useLanguage();

    // Mock User Data
    const userData = {
        id: '4208',
        level: 12,
        exp: 8450,
        maxExp: 10000,
        karmaCoins: 1250,
        gems: 45
    };

    const expPercentage = Math.min(100, Math.max(0, (userData.exp / userData.maxExp) * 100));

    return (
        <div className="hidden lg:flex h-10 w-full bg-[var(--theme-surface-2)] border-b border-[var(--theme-glass-border)] items-center justify-between px-8 text-xs font-medium text-[var(--theme-text-sub)]">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2" title={locale === 'zh-TW' ? '玩家編號' : 'Player ID'}>
                    <Shield size={14} className="text-[var(--primary)]" />
                    <span>ID: #{userData.id}</span>
                </div>

                <div className="flex items-center gap-2" title={locale === 'zh-TW' ? '目前等級' : 'Current Level'}>
                    <Award size={14} className="text-amber-500" />
                    <span>Lv.{userData.level}</span>
                </div>

                <div className="flex items-center gap-3 w-48" title={locale === 'zh-TW' ? '經驗值' : 'Experience Points'}>
                    <span className="shrink-0 flex items-center gap-1">
                        EXP
                    </span>
                    <div className="flex-1 h-1.5 bg-[var(--theme-surface)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                            style={{ width: `${expPercentage}%` }}
                        />
                    </div>
                    <span className="shrink-0 text-[10px] text-[var(--theme-text-muted)]">
                        {userData.exp.toLocaleString()} / {userData.maxExp.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2" title={locale === 'zh-TW' ? '善向幣' : 'Karma Coins'}>
                    <Coins size={14} className="text-yellow-400" />
                    <span className="text-[var(--text-main)] font-bold">{userData.karmaCoins.toLocaleString()}</span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">{locale === 'zh-TW' ? '善向幣' : 'Karma Coins'}</span>
                </div>

                <div className="flex items-center gap-2" title={locale === 'zh-TW' ? '永續寶石' : 'Sustainable Gems'}>
                    <Gem size={14} className="text-emerald-400" />
                    <span className="text-[var(--text-main)] font-bold">{userData.gems.toLocaleString()}</span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">{locale === 'zh-TW' ? '永續寶石' : 'Gems'}</span>
                </div>
            </div>
        </div>
    );
}
