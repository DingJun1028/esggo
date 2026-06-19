// ESGss JunAiKey - Ecological Collaboration Services UI
// 5-1. 柏克萊認證學院 (Berkeley Certification Academy)
// 設計風格：Liquid Glass (液態玻璃) | 語言：繁體中文 (Traditional Chinese)

import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
} from '../../../components/ui/GlassComponents';
import { BerkeleyCertificationAcademy, Course, Certificate } from '../../../types/services-part4';

interface BerkeleyCertificationAcademyUIProps {
  data?: BerkeleyCertificationAcademy;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

// 模擬課程數據
const MOCK_COURSES: Course[] = [
  {
    id: 'CS-101',
    title: 'ESG 策略與實踐基礎',
    description: '深入了解環境、社會和治理的核心原則及其對現代企業的影響。',
    category: 'Foundations',
    difficulty: 'beginner',
    duration: 12, // hours
    modules: [],
    prerequisites: [],
    tags: ['ESG', 'Strategy'],
    rating: 4.8,
    enrollmentCount: 1250,
    activeEnrollments: 450,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'CS-201',
    title: '高階碳盤查與減量技術',
    description: '掌握 Scope 1, 2, 3 碳排放計算方法與科學基礎減量目標 (SBTi) 設定。',
    category: 'Technical',
    difficulty: 'advanced',
    duration: 24,
    modules: [],
    prerequisites: ['CS-101'],
    tags: ['Carbon', 'Climate Change'],
    rating: 4.9,
    enrollmentCount: 850,
    activeEnrollments: 320,
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'CS-301',
    title: '綠色供應鏈管理認證',
    description: '建立與管理可持續供應鏈，降低風險並提升生態系價值。',
    category: 'Management',
    difficulty: 'intermediate',
    duration: 18,
    modules: [],
    prerequisites: [],
    tags: ['Supply Chain', 'Management'],
    rating: 4.7,
    enrollmentCount: 600,
    activeEnrollments: 210,
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-01-12'),
  },
];

// 模擬證書數據
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-001',
    userId: 'USER-123',
    courseId: 'CS-101',
    type: 'completion',
    issuedAt: new Date('2023-12-20'),
    credentialId: 'BCA-2023-9988',
    verificationUrl: 'https://berkeley.edu/verify/BCA-2023-9988',
    metadata: {
      score: 95,
      completionTime: 10,
      instructor: 'Dr. Sarah Chen',
      skills: ['ESG Basics', 'Strategic Planning'],
      level: 'gold',
    },
  },
];

export const BerkeleyCertificationAcademyUI: React.FC<BerkeleyCertificationAcademyUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_learning' | 'certificates'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const t = {
    title: '柏克萊認證學院',
    subtitle: 'Berkeley Certification Academy',
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
            ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' // 淺灰白 (Academic)
            : 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)', // 深藍綠 (Professional)
        color: colors.text,
        fontFamily: '"SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '40px 32px',
          background: `url('/assets/berkeley-bg.jpg') center/cover no-repeat`, // 示意背景
          position: 'relative',
          borderBottom: `1px solid ${colors.border}`,
          height: '200px',
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
            <div style={{ fontSize: '16px', color: colors.textSecondary, marginTop: '8px' }}>
              {t.subtitle}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12</div>
              <div style={{ fontSize: '12px', color: colors.textSecondary }}>專業認證</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2.5k+</div>
              <div style={{ fontSize: '12px', color: colors.textSecondary }}>全球校友</div>
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
              onClick={() => setActiveTab(key as any)}
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

        {/* Catalog View */}
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
              探索目錄以開始您的 ESG 學習之旅。
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            {MOCK_CERTIFICATES.map(cert => (
              <GlassCard
                key={cert.id}
                theme={theme}
                style={{
                  padding: '32px',
                  border: `2px solid ${colors.accent}`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    fontSize: '48px',
                    opacity: 0.1,
                  }}
                >
                  🎖️
                </div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: colors.textSecondary,
                      marginBottom: '8px',
                    }}
                  >
                    Certificate of Completion
                  </div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#003262',
                      margin: '0 0 8px 0',
                    }}
                  >
                    ESG 策略與實踐基礎
                  </h2>
                  <div style={{ fontSize: '14px' }}>Issued to User 123</div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginBottom: '24px',
                    background: `${colors.background}55`,
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div>Date</div>
                    <div style={{ fontWeight: 'bold', color: colors.text }}>
                      {cert.issuedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div>Credential ID</div>
                    <div style={{ fontWeight: 'bold', color: colors.text }}>
                      {cert.credentialId}
                    </div>
                  </div>
                </div>

                <GlassButton theme={theme} variant="primary" style={{ width: '100%' }}>
                  {t.actions.download}
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        )}
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
            <span
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: `${colors.primary}22`,
                color: colors.primary,
                fontWeight: 'bold',
              }}
            >
              {selectedCourse.category}
            </span>
            <h2 style={{ fontSize: '32px', margin: '16px 0', color: colors.text }}>
              {selectedCourse.title}
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '32px',
                fontSize: '14px',
                color: colors.textSecondary,
              }}
            >
              <span>
                ⭐ {selectedCourse.rating} ({selectedCourse.enrollmentCount} 評價)
              </span>
              <span>🕒 {selectedCourse.duration} 總時數</span>
              <span>📊 {t.difficulty[selectedCourse.difficulty as keyof typeof t.difficulty]}</span>
            </div>

            <div
              style={{
                background: `${colors.background}55`,
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '32px',
              }}
            >
              <h4 style={{ margin: '0 0 12px 0' }}>課程簡介</h4>
              <p style={{ lineHeight: '1.6', color: colors.text }}>{selectedCourse.description}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <GlassButton theme={theme} variant="ghost" onClick={() => setSelectedCourse(null)}>
                取消
              </GlassButton>
              <GlassButton theme={theme} variant="primary" style={{ padding: '8px 32px' }}>
                {t.actions.enroll}
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

export default {
  BerkeleyCertificationAcademyUI,
};
