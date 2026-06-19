'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, User, ArrowRight, Database, Globe, Shield } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function AgentKnowledgeHubPage() {
    const { t, locale } = useLanguage();

    const knowledgeModules = [
        {
            id: 'personal',
            title: locale === 'zh-TW' ? '代理個人知識庫' : 'Agent Personal Knowledge Base',
            subtitle: locale === 'zh-TW' 
                ? '每個代理的專屬知識聖殿，使用 UUID 區分知識條目。包含收藏、結晶化等功能。'
                : 'Each agent\'s personal knowledge sanctuary, distinguished by UUID. Includes favorites, crystallization and more.',
            icon: User,
            href: '/agency/knowledge/personal',
            color: 'from-aqua to-blue-500',
            stats: {
                label: locale === 'zh-TW' ? '代理數' : 'Agents',
                value: '4'
            }
        },
        {
            id: 'shared',
            title: locale === 'zh-TW' ? '代理共享知識庫' : 'Agent Shared Knowledge Base',
            subtitle: locale === 'zh-TW'
                ? '跨代理共享的知識庫，讓知識在不同代理間流轉。建立、分享、發現新知識。'
                : 'Cross-agent shared knowledge base, enabling knowledge flow between agents. Create, share, discover.',
            icon: Globe,
            href: '/agency/knowledge/shared',
            color: 'from-purple-500 to-pink-500',
            stats: {
                label: locale === 'zh-TW' ? '共享條目' : 'Shared Entries',
                value: '156+'
            }
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "代理知識庫樞紐" : "Agent Knowledge Hub"}
                subtitle={locale === 'zh-TW' 
                    ? "管理代理的個人知識庫和共享知識庫" 
                    : "Manage agent personal knowledge bases and shared knowledge bases"}
                category="Agency"
            />

            <main className="max-w-5xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {knowledgeModules.map((module, index) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link 
                                href={module.href}
                                className="block group"
                            >
                                <div className="liquid-glass border border-white/10 rounded-[3rem] p-10 h-full hover:border-aqua/30 transition-all relative overflow-hidden">
                                    {/* 背景漸變效果 */}
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${module.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
                                    
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <module.icon size={32} className="text-white" />
                                        </div>

                                        <h3 className="text-2xl font-black mb-3 group-hover:text-aqua transition-colors">
                                            {module.title}
                                        </h3>
                                        
                                        <p className="text-gray-400 mb-8 leading-relaxed">
                                            {module.subtitle}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Database size={16} className="text-gray-600" />
                                                <span className="text-sm text-gray-500">
                                                    {module.stats.label}: <span className="font-black text-aqua">{module.stats.value}</span>
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-aqua group-hover:gap-3 transition-all">
                                                <span className="text-xs font-black uppercase tracking-widest">
                                                    {locale === 'zh-TW' ? '進入' : 'Enter'}
                                                </span>
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* 說明區域 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 liquid-glass border border-white/10 rounded-[3rem] p-8"
                >
                    <div className="flex items-start gap-4">
                        <div className="size-12 rounded-2xl bg-aqua/20 flex items-center justify-center flex-shrink-0">
                            <Shield size={24} className="text-aqua" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black mb-2">
                                {locale === 'zh-TW' ? '知識庫功能說明' : 'Knowledge Base Features'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                                <div>
                                    <p className="font-bold text-gray-300 mb-1">{locale === 'zh-TW' ? '個人知識庫' : 'Personal Knowledge Base'}</p>
                                    <ul className="space-y-1">
                                        <li>• {locale === 'zh-TW' ? 'UUID 區分知識條目' : 'UUID for knowledge entries'}</li>
                                        <li>• {locale === 'zh-TW' ? '收藏功能' : 'Favorites feature'}</li>
                                        <li>• {locale === 'zh-TW' ? '知識結晶化' : 'Knowledge crystallization'}</li>
                                        <li>• {locale === 'zh-TW' ? '從共享庫匯入' : 'Import from shared'}</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-300 mb-1">{locale === 'zh-TW' ? '共享知識庫' : 'Shared Knowledge Base'}</p>
                                    <ul className="space-y-1">
                                        <li>• {locale === 'zh-TW' ? '跨代理知識共享' : 'Cross-agent sharing'}</li>
                                        <li>• {locale === 'zh-TW' ? '公開/私人設定' : 'Public/Private settings'}</li>
                                        <li>• {locale === 'zh-TW' ? '存取統計' : 'Access statistics'}</li>
                                        <li>• {locale === 'zh-TW' ? '領域分類' : 'Domain categorization'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
