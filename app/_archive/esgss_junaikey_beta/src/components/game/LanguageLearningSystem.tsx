/**
 * 🌍 語言學習系統 - Language Learning System
 * 
 * 功能：
 * - 多語言 ESG 知識學習
 * - 語言等級進度
 * - 國際化探索
 * - 語言技能加成
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Languages, 
  BookOpen, 
  Award,
  Star,
  Zap,
  ChevronRight,
  Play,
  Headphones,
  Mic,
  FileText,
  Send,
  MessageSquare
} from 'lucide-react';

// 語言定義
interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
  xp: number;
  maxXP: number;
  skills: {
    reading: number;
    writing: number;
    speaking: number;
    listening: number;
  };
  esgTopics: {
    topic: string;
    translatedTitle: string;
    articles: number;
  }[];
}

// 語言學習里程碑
interface LanguageMilestone {
  id: string;
  languageId: string;
  level: string;
  title: string;
  description: string;
  reward: {
    xp: number;
    badge?: string;
  };
  requirements: {
    skill: string;
    value: number;
  }[];
}

// 國際 ESG 文章
interface ESGArticle {
  id: string;
  languageId: string;
  title: string;
  titleEn: string;
  category: 'environmental' | 'social' | 'governance';
  difficulty: number;
  content: string;
  vocabulary: {
    word: string;
    meaning: string;
    example: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

// 語言數據
const LANGUAGES: Language[] = [
  {
    id: 'zh-TW',
    name: '繁體中文',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    code: 'zh-TW',
    level: 'native',
    xp: 10000,
    maxXP: 10000,
    skills: {
      reading: 100,
      writing: 100,
      speaking: 100,
      listening: 100
    },
    esgTopics: [
      { topic: 'tcfd', translatedTitle: '氣候相關財務揭露', articles: 50 },
      { topic: 'gri', translatedTitle: '全球永續報告準則', articles: 45 },
      { topic: 'iso14064', translatedTitle: '溫室氣體盤查', articles: 30 }
    ]
  },
  {
    id: 'en',
    name: '英文',
    nativeName: 'English',
    flag: '🇺🇸',
    code: 'en',
    level: 'advanced',
    xp: 8500,
    maxXP: 10000,
    skills: {
      reading: 85,
      writing: 80,
      speaking: 75,
      listening: 85
    },
    esgTopics: [
      { topic: 'esg', translatedTitle: 'Environmental, Social, Governance', articles: 120 },
      { topic: 'tcfd', translatedTitle: 'Task Force on Climate-related Financial Disclosures', articles: 80 },
      { topic: 'sasb', translatedTitle: 'Sustainability Accounting Standards Board', articles: 65 }
    ]
  },
  {
    id: 'ja',
    name: '日文',
    nativeName: '日本語',
    flag: '🇯🇵',
    code: 'ja',
    level: 'intermediate',
    xp: 5500,
    maxXP: 10000,
    skills: {
      reading: 60,
      writing: 50,
      speaking: 55,
      listening: 60
    },
    esgTopics: [
      { topic: 'esg', translatedTitle: '環境・社会・ガバナンス', articles: 45 },
      { topic: 'tcfd', translatedTitle: '気候関連財務情報開示タスクフォース', articles: 25 },
      { topic: 'ghg', translatedTitle: '温室効果ガス', articles: 35 }
    ]
  },
  {
    id: 'ko',
    name: '韓文',
    nativeName: '한국어',
    flag: '🇰🇷',
    code: 'ko',
    level: 'intermediate',
    xp: 5000,
    maxXP: 10000,
    skills: {
      reading: 55,
      writing: 45,
      speaking: 50,
      listening: 55
    },
    esgTopics: [
      { topic: 'esg', translatedTitle: '환경·사회·지배구조', articles: 40 },
      { topic: 'ghg', translatedTitle: '온실가스', articles: 30 },
      { topic: 'netzero', translatedTitle: '탄소중립', articles: 35 }
    ]
  }
];

// 語言里程碑
const LANGUAGE_MILESTONES: LanguageMilestone[] = [
  {
    id: 'en-beginner',
    languageId: 'en',
    level: 'beginner',
    title: 'ESG 英語入門',
    description: '學會用英文閱讀基礎 ESG 資訊',
    reward: { xp: 500, badge: '📚 ESG Reader' },
    requirements: [{ skill: 'reading', value: 30 }]
  },
  {
    id: 'en-intermediate',
    languageId: 'en',
    level: 'intermediate',
    title: 'ESG 英語專員',
    description: '能夠用英文撰寫簡單的 ESG 報告',
    reward: { xp: 1000, badge: '✍️ ESG Writer' },
    requirements: [{ skill: 'writing', value: 50 }]
  },
  {
    id: 'en-advanced',
    languageId: 'en',
    level: 'advanced',
    title: 'ESG 英語專家',
    description: '能夠用英文進行 ESG 簡報與演講',
    reward: { xp: 2000, badge: '🎤 ESG Speaker' },
    requirements: [{ skill: 'speaking', value: 70 }]
  },
  {
    id: 'ja-n1',
    languageId: 'ja',
    level: 'intermediate',
    title: '日文 ESG 中級',
    description: '能夠閱讀日文 ESG 報告',
    reward: { xp: 1000, badge: '📖 日文閱讀者' },
    requirements: [{ skill: 'reading', value: 50 }]
  },
  {
    id: 'ko-hk',
    languageId: 'ko',
    level: 'intermediate',
    title: '韓文 ESG 中級',
    description: '能夠理解韓文 ESG 新聞',
    reward: { xp: 1000, badge: '📰 韓文理解者' },
    requirements: [{ skill: 'listening', value: 50 }]
  }
];

// 範例文章
const ESG_ARTICLES: ESGArticle[] = [
  {
    id: 'article-1',
    languageId: 'en',
    title: 'What is ESG?',
    titleEn: 'What is ESG?',
    category: 'governance',
    difficulty: 1,
    content: `ESG stands for Environmental, Social, and Governance.

Environmental factors include:
- Climate change and carbon emissions
- Air and water pollution
- Biodiversity and deforestation
- Energy efficiency and waste management

Social factors include:
- Human rights and labor standards
- Diversity and inclusion
- Community relations
- Consumer protection

Governance factors include:
- Board diversity and structure
- Executive compensation
- Shareholder rights
- Business ethics`,

    vocabulary: [
      { word: 'ESG', meaning: '環境、社會、治理', example: 'ESG is becoming important for investors.' },
      { word: 'sustainability', meaning: '永續性', example: 'The company is committed to sustainability.' },
      { word: 'governance', meaning: '治理', example: 'Corporate governance is key to transparency.' }
    ],
    quiz: [
      {
        question: 'What does ESG stand for?',
        options: ['Economic, Social, Governance', 'Environmental, Social, Governance', 'Energy, Safety, Growth', 'Environmental, Sustainability, Growth'],
        answer: 1
      }
    ]
  },
  {
    id: 'article-2',
    languageId: 'ja',
    title: 'ESGとは',
    titleEn: 'What is ESG?',
    category: 'governance',
    difficulty: 2,
    content: `ESGとは、環境（Environmental）、社会（Social）、ガバナンス（Governance）の頭文字です。

環境（E）：
- 気候変動対策
- 廃棄物管理
- 再生可能エネルギー

社会（S）：
- 人権尊重
- 労働基準遵守
- ダイバーシティ

ガバナンス（G）：
- 取締役会の多様性
- 経営陣の報酬
- 株主権利`,

    vocabulary: [
      { word: 'ESG', meaning: '環境、社會、治理', example: 'ESG投資が注目されている。' },
      { word: '気候変動', meaning: '氣候變遷', example: '気候変動対策が重要だ。' },
      { word: 'ガバナンス', meaning: '治理', example: '企業ガバナンスの強化が必要。' }
    ],
    quiz: [
      {
        question: 'ESGの「E」は何ですか？',
        options: ['Energy（エネルギー）', 'Economic（経済）', 'Environmental（環境）', 'Ecology（生態学）'],
        answer: 2
      }
    ]
  },
  {
    id: 'article-3',
    languageId: 'ko',
    title: 'ESG란?',
    titleEn: 'What is ESG?',
    category: 'governance',
    difficulty: 2,
    content: `ESG는 환경(Environmental), 사회(Social), 지배구조(Governance)의 약자입니다.

환경(E):
- 기후변화 대응
- 폐기물 관리
- 재생에너지

사회(S):
- 인권 존중
- 노동 기준 준수
- 다양성과 포용성

지배구조(G):
- 이사회 다양성
- 경영진 보상
- 주주 권리`,

    vocabulary: [
      { word: 'ESG', meaning: '環境、社會、治理', example: 'ESG 투자가 늘고 있다.' },
      { word: '기후변화', meaning: '氣候變遷', example: '기후변화 대응이 시급하다.' },
      { word: '지배구조', meaning: '治理', example: '기업 지배구조 개선이 필요하다.' }
    ],
    quiz: [
      {
        question: 'ESG의「G」는 무엇을 의미하나요?',
        options: ['Growth（성장）', 'Governance（지배구조）', 'Global（글로벌）', 'Green（녹색）'],
        answer: 1
      }
    ]
  }
];

export const LanguageLearningSystem: React.FC<{
  userId: string;
  currentLanguage?: string;
  onLanguageSelect?: (languageId: string) => void;
}> = ({ userId, currentLanguage = 'zh-TW', onLanguageSelect }) => {
  const [activeTab, setActiveTab] = useState<'languages' | 'articles' | 'milestones' | 'practice'>('languages');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ESGArticle | null>(null);

  // 計算語言總進度
  const calculateOverallProgress = () => {
    const totalXP = LANGUAGES.reduce((sum, lang) => sum + lang.xp, 0);
    const maxXP = LANGUAGES.reduce((sum, lang) => sum + lang.maxXP, 0);
    return Math.round((totalXP / maxXP) * 100);
  };

  // 渲染語言卡片
  const renderLanguageCard = (language: Language) => {
    const progress = Math.round((language.xp / language.maxXP) * 100);
    const isSelected = selectedLanguage === language.id;
    const isCurrent = currentLanguage === language.id;

    return (
      <motion.div
        key={language.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => {
          setSelectedLanguage(language.id);
          onLanguageSelect?.(language.id);
        }}
        className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all ${
          isSelected
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500'
            : 'bg-slate-800/50 border-white/10 hover:border-white/30'
        }`}
      >
        <div className="relative p-6">
          {/* 頭部 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{language.flag}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{language.name}</h3>
                {isCurrent && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                    目前語言
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{language.nativeName}</p>
            </div>
          </div>

          {/* 等級 */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              language.level === 'native' ? 'bg-purple-500/20 text-purple-400' :
              language.level === 'advanced' ? 'bg-amber-500/20 text-amber-400' :
              language.level === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {language.level.toUpperCase()}
            </span>
            <span className="text-sm text-slate-500">
              {language.skills.reading}% 閱讀
            </span>
          </div>

          {/* 進度條 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>進度</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
          </div>

          {/* 技能 */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center p-2 bg-slate-700/50 rounded">
              <div className="text-xs text-slate-500">閱讀</div>
              <div className="text-sm font-bold text-cyan-400">{language.skills.reading}%</div>
            </div>
            <div className="text-center p-2 bg-slate-700/50 rounded">
              <div className="text-xs text-slate-500">寫作</div>
              <div className="text-sm font-bold text-green-400">{language.skills.writing}%</div>
            </div>
            <div className="text-center p-2 bg-slate-700/50 rounded">
              <div className="text-xs text-slate-500">口說</div>
              <div className="text-sm font-bold text-amber-400">{language.skills.speaking}%</div>
            </div>
            <div className="text-center p-2 bg-slate-700/50 rounded">
              <div className="text-xs text-slate-500">聽力</div>
              <div className="text-sm font-bold text-purple-400">{language.skills.listening}%</div>
            </div>
          </div>

          {/* ESG 主題 */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-500 mb-2">ESG 學習主題</div>
            <div className="flex flex-wrap gap-1">
              {language.esgTopics.slice(0, 3).map((topic, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                  {topic.translatedTitle}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染文章卡片
  const renderArticleCard = (article: ESGArticle) => {
    const language = LANGUAGES.find(l => l.id === article.languageId);
    const difficultyStars = '⭐'.repeat(article.difficulty);

    return (
      <motion.div
        key={article.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedArticle(article)}
        className="p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/50 cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{language?.flag}</div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{article.title}</h3>
            <p className="text-sm text-slate-400">{article.titleEn}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-amber-400">{difficultyStars}</span>
              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                {article.category}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </motion.div>
    );
  };

  // 渲染里程碑
  const renderMilestone = (milestone: LanguageMilestone) => {
    const language = LANGUAGES.find(l => l.id === milestone.languageId);

    return (
      <motion.div
        key={milestone.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 bg-slate-800/50 rounded-xl border border-white/10"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{language?.flag}</div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{milestone.title}</h3>
            <p className="text-sm text-slate-400">{milestone.description}</p>
            {milestone.reward.badge && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                {milestone.reward.badge}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">+{milestone.reward.xp} XP</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染文章詳情
  const renderArticleDetail = () => {
    if (!selectedArticle) return null;
    const language = LANGUAGES.find(l => l.id === selectedArticle.languageId);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setSelectedArticle(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 頭部 */}
          <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{language?.flag}</span>
              <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
            </div>
            <p className="text-slate-300">{selectedArticle.titleEn}</p>
            <div className="absolute bottom-4 right-4">
              <span className="text-amber-400">{'⭐'.repeat(selectedArticle.difficulty)}</span>
            </div>
          </div>

          {/* 內容 */}
          <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
            {/* 文章內容 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                文章內容
              </h3>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedArticle.content}
                </p>
              </div>
            </div>

            {/* 詞彙表 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-green-400" />
                重點詞彙
              </h3>
              <div className="space-y-2">
                {selectedArticle.vocabulary.map((vocab, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-cyan-400">{vocab.word}</span>
                      <span className="text-xs text-slate-500">- {vocab.meaning}</span>
                    </div>
                    <p className="text-xs text-slate-400 italic">例: {vocab.example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 測驗 */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                測驗
              </h3>
              {selectedArticle.quiz.map((q, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-white mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, j) => (
                      <motion.button
                        key={j}
                        whileHover={{ scale: 1.02 }}
                        className="w-full p-3 bg-slate-700/50 rounded-lg text-left text-slate-300 hover:bg-slate-700"
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部 */}
          <div className="p-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedArticle(null)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold"
            >
              完成學習
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            語言學習系統
          </h1>
          <p className="text-slate-400">用多語言探索全球 ESG 知識</p>
        </motion.div>

        {/* 總進度 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">語言精通度</h2>
              <p className="text-sm text-slate-400">跨語言 ESG 知識探索</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400">
                {calculateOverallProgress()}%
              </div>
              <div className="text-xs text-slate-500">總進度</div>
            </div>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            />
          </div>
        </motion.div>

        {/* Tab 切换 */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          {[
            { key: 'languages', label: '語言', icon: Globe },
            { key: 'articles', label: '文章', icon: FileText },
            { key: 'milestones', label: '里程碑', icon: Award },
            { key: 'practice', label: '練習', icon: Mic }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 內容 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'languages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LANGUAGES.map(language => renderLanguageCard(language))}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                ESG 文章庫
              </h2>
              {ESG_ARTICLES.map(article => renderArticleCard(article))}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                語言里程碑
              </h2>
              {LANGUAGE_MILESTONES.map(milestone => renderMilestone(milestone))}
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-green-400" />
                口說練習
              </h2>
              
              <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 text-center">
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-xl font-bold text-white mb-2">選擇語言開始練習</h3>
                <p className="text-slate-400 mb-4">用口說的方式學習 ESG 專業術語</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {LANGUAGES.slice(1).map(language => (
                    <motion.button
                      key={language.id}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-slate-700 rounded-lg flex items-center gap-2"
                    >
                      <span>{language.flag}</span>
                      <span className="text-white">{language.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 文章詳情彈窗 */}
      {selectedArticle && renderArticleDetail()}
    </div>
  );
};

export default LanguageLearningSystem;
