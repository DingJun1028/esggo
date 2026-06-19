// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-1. Berkeley TSISDA (Replicated from Berkeley Certification Academy)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
    GlassCard,
    GlassButton,
    GlassInput,
    GlassModal,
    glassTheme,
} from '../../components/ui/GlassComponents';
import { Course, Certificate, BerkeleyTSISDAProps } from '../../types/berkeley';

// 模擬課程數據 (Mock Data)
const MOCK_COURSES: Course[] = [
    {
        id: 'TSISDA-101',
        title: 'TSISDA 永續發展策略',
        description: '深入探討 TSISDA 框架下的永續發展策略與實踐。',
        category: 'Strategy',
        difficulty: 'intermediate',
        duration: 12,
        modules: [],
        prerequisites: [],
        tags: ['TSISDA', 'ESG'],
        rating: 4.9,
        enrollmentCount: 150,
        activeEnrollments: 50,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
    },
];

const MOCK_CERTIFICATES: Certificate[] = [];

export const BerkeleyTSISDA: React.FC<BerkeleyTSISDAProps> = ({
    theme = 'light',
}) => {
    const colors = glassTheme[theme as keyof typeof glassTheme] || glassTheme.light;
    const [activeTab, setActiveTab] = useState<'catalog' | 'my_learning' | 'certificates'>('catalog');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const t = {
        title: 'TSISDA 永續發展學院', // Updated Title
        subtitle: 'Berkeley TSISDA Program',
        tabs: {
            catalog: '課程目錄',
            my_learning: '我的學習',
            certificates: '證書成就',
        },
        difficulty: {
            beginner: '入門',
            intermediate: '進階',
            advanced: '高階',
        },
        actions: {
            viewDetails: '查看詳情',
            enroll: '立即註冊',
            continue: '繼續學習',
            download: '下載證書',
        },
        meta: {
            students: '學員',
            rating: '評分',
            hours: '小時',
            instructor: '講師',
        },
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'beginner':
                return colors.success;
            case 'intermediate':
                return colors.warning;
            case 'advanced':
                return colors.error;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background:
                    theme === 'light'
                        ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
                        : 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
                color: colors.text,
                fontFamily: '"SF Pro Display", "Inter", sans-serif',
            }}
        >
            {/* Header */}
            <header
                style={{
                    padding: '40px 32px',
                    background: `url('/assets/berkeley-bg.jpg') center/cover no-repeat`,
                    position: 'relative',
                    borderBottom: `1px solid ${colors.border}`,
                    height: '280px', // Increased height for buttons
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                {/* Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: theme === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                    }}
                />

                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '24px',
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: '#003262', // Berkeley Blue
                                color: '#FDB515', // Berkeley Gold
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                            }}
                        >
                            EST. 1868
                        </div>
                        <h1
                            style={{
                                fontSize: '36px',
                                fontWeight: '800',
                                margin: 0,
                                color: theme === 'light' ? '#003262' : 'white',
                            }}
                        >
                            {t.title}
                        </h1>
                        <div style={{ fontSize: '16px', color: colors.textSecondary, marginTop: '8px', marginBottom: '24px' }}>
                            {t.subtitle}
                        </div>

                        {/* NEW: Schematic Visuals */}
                        <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{
                                    height: '120px',
                                    background: 'rgba(255,255,255,0.5)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${colors.border}`
                                }}>
                                    {/* Placeholder for tsisda_strategy_diagram */}
                                    <span style={{ fontSize: '40px', opacity: 0.5 }}>🌐</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>全球永續策略</div>
                            </div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{
                                    height: '120px',
                                    background: 'rgba(255,255,255,0.5)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${colors.border}`
                                }}>
                                    {/* Placeholder for brochure_schematic */}
                                    <img
                                        src="/assets/brochure_schematic.png"
                                        alt="Brochure"
                                        style={{ height: '60px', opacity: 0.8 }}
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                    <span style={{ fontSize: '40px', opacity: 0.5, display: 'none' }}>📄</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>專業課程簡章</div>
                            </div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{
                                    height: '120px',
                                    background: 'rgba(255,255,255,0.5)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${colors.border}`
                                }}>
                                    {/* Placeholder for registration_icon */}
                                    <span style={{ fontSize: '40px', opacity: 0.5 }}>🚀</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>立即啟動未來</div>
                            </div>
                        </div>

                        {/* NEW: Requested Action Buttons */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <GlassButton theme={theme} variant="primary" onClick={() => alert('即將推出：了解課程 (Coming Soon: Course Info)')}>
                                了解課程
                            </GlassButton>
                            <GlassButton theme={theme} variant="secondary" onClick={() => alert('即將推出：這取簡章 (Coming Soon: Brochure Request)')}>
                                索取簡章
                            </GlassButton>
                            <GlassButton theme={theme} variant="accent" onClick={() => alert('即將推出：立即報名 (Coming Soon: Registration)')}>
                                立即報名
                            </GlassButton>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>TSISDA</div>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>認證體系</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Global</div>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>國際接軌</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Tabs */}
                <div
                    style={{
                        marginBottom: '32px',
                        borderBottom: `1px solid ${colors.border}`,
                        display: 'flex',
                        gap: '32px',
                    }}
                >
                    {Object.entries(t.tabs).map(([key, label]) => (
                        <div
                            key={key}
                            onClick={() => setActiveTab(key as keyof typeof t.tabs)}
                            style={{
                                padding: '16px 0',
                                cursor: 'pointer',
                                borderBottom:
                                    activeTab === key ? `2px solid ${colors.primary}` : '2px solid transparent',
                                color: activeTab === key ? colors.primary : colors.textSecondary,
                                fontWeight: activeTab === key ? '600' : '400',
                                transition: 'all 0.2s',
                                fontSize: '16px',
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Catalog View - Reused Logic */}
                {activeTab === 'catalog' && (
                    <div>
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                            <GlassInput
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="搜尋課程關鍵字..."
                                theme={theme}
                                style={{ width: '300px' }}
                            />
                            <GlassButton theme={theme} variant="secondary">
                                篩選條件 ▼
                            </GlassButton>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '32px',
                            }}
                        >
                            {MOCK_COURSES.map(course => (
                                <GlassCard
                                    key={course.id}
                                    theme={theme}
                                    style={{
                                        padding: '0',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    hover
                                    clickable
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <div
                                        style={{
                                            height: '160px',
                                            background: `linear-gradient(120deg, ${colors.primary}22, ${colors.accent}22)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: '64px', opacity: 0.2 }}>🎓</span>
                                    </div>
                                    <div
                                        style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    background: `${colors.background}88`,
                                                    border: `1px solid ${colors.border}`,
                                                }}
                                            >
                                                {course.category}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    color: getDifficultyColor(course.difficulty),
                                                }}
                                            >
                                                {t.difficulty[course.difficulty as keyof typeof t.difficulty]}
                                            </span>
                                        </div>
                                        <h3
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                                lineHeight: '1.4',
                                            }}
                                        >
                                            {course.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: colors.textSecondary,
                                                marginBottom: '24px',
                                                flex: 1,
                                            }}
                                        >
                                            {course.description}
                                        </p>

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontSize: '12px',
                                                color: colors.textSecondary,
                                                borderTop: `1px solid ${colors.border}`,
                                                paddingTop: '16px',
                                            }}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                ⭐ {course.rating}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                👥 {course.enrollmentCount}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                🕒 {course.duration} {t.meta.hours}
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Learning (Placeholder) */}
                {activeTab === 'my_learning' && (
                    <GlassCard theme={theme} style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                        <h3>目前沒有進行中的課程</h3>
                        <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
                            探索目錄以開始您的學習之旅。
                        </p>
                        <GlassButton theme={theme} variant="primary" onClick={() => setActiveTab('catalog')}>
                            前往課程目錄
                        </GlassButton>
                    </GlassCard>
                )}

                {/* Certificates View */}
                {activeTab === 'certificates' && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px',
                            color: colors.textSecondary
                        }}
                    >
                        尚無證書
                    </div>
                )}
                {/* Instructors & Mentors Section - Always visible at bottom */}
                <div style={{ marginTop: '64px', marginBottom: '64px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
                        頂尖師資陣容 (Meet your Instructors)
                    </h2>
                    <div style={{
                        background: `rgba(255,255,255,0.5)`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        padding: '40px',
                        border: `1px solid ${colors.border}`,
                        textAlign: 'center'
                    }}>
                        <img
                            src="/assets/instructors_new.png"
                            alt="Instructors"
                            style={{ maxWidth: '100%', borderRadius: '12px' }}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '64px', marginBottom: '32px', textAlign: 'center' }}>
                        矽谷輔導業師 (Meet your Mentors)
                    </h2>
                    <div style={{
                        background: `rgba(255,255,255,0.5)`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        padding: '40px',
                        border: `1px solid ${colors.border}`,
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src="/assets/mentors_new.png"
                            alt="Mentors"
                            style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '24px' }}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />

                        {/* Google Logo Integration */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '16px',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '50px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            position: 'absolute',
                            bottom: '40px',
                            right: '40px'
                        }}>
                            <img
                                src="/assets/google_logo.svg"
                                alt="Google"
                                style={{ height: '24px' }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"; // Fallback to CDN
                                }}
                            />
                            <span style={{ fontWeight: 'bold', color: '#5f6368', fontSize: '14px' }}>Mentorship Partner</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Course Detail Modal */}
            {selectedCourse && (
                <GlassModal
                    isOpen={!!selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    theme={theme}
                    size="lg"
                >
                    <div style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: '32px', margin: '16px 0', color: colors.text }}>
                            {selectedCourse.title}
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                            <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedCourse(null)}>
                                關閉
                            </GlassButton>
                            {/* Reusing the new actions here? Or keeping Enroll? */}
                            <GlassButton theme={theme} variant="primary">
                                {t.actions.enroll}
                            </GlassButton>
                        </div>
                    </div>
                </GlassModal>
            )}
        </div>
    );
};
