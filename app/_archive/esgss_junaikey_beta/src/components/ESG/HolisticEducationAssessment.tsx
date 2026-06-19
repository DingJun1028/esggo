/**
 * 🎓 全人教育測評系統 (Holistic Education Assessment System)
 * --------------------------------------------------
 * [功能] C4 - ESG 知識測評與用戶畫像生成
 * [風格] 高端未來感 (Holographic / Radar / Neon)
 * [語言] 繁體中文支援 (核心標識符為英文)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Brain,
  Target,
  Activity,
  Zap,
  Hexagon,
  ChevronRight,
  Shield,
} from 'lucide-react';

const CATEGORY_WEIGHT = 0.33;
const RECOMMENDATION_LIMIT = 5;
import { OmniUUIDGenerator, OmniEntityPrefix } from '@/utils/OmniUUIDGenerator';
import { TrustworthyLock, SealedData } from '@/utils/TrustworthyLock';

export interface QuestionnaireOption {
  id: string;
  content: string;
  score: number;
  tags: string[];
}

export interface QuestionnaireItem {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'rating';
  options: QuestionnaireOption[];
  category: 'Environmental' | 'Social' | 'Governance' | 'General';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserProfile {
  id: string;
  knowledgeLevel: {
    environmental: number;
    social: number;
    governance: number;
    total: number;
  };
  interestTags: string[];
  learningPreferences: string[];
  recommendedTopics: string[];
  evidence?: SealedData<any>;
}

export const HolisticEducationAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'Start' | 'Assessment' | 'Result'>('Start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerRecord, setAnswerRecord] = useState<Map<string, string[]>>(new Map());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const questionList: QuestionnaireItem[] = [
    {
      id: 'Q1',
      question: '您對以下哪個永續議題最感興趣？',
      type: 'single',
      category: 'General',
      difficulty: 'Beginner',
      options: [
        {
          id: 'A',
          content: '氣候變遷與碳中和 (Climate & Net Zero)',
          score: 10,
          tags: ['環境', '氣候', '碳排放'],
        },
        {
          id: 'B',
          content: '社會公平與人權 (DEI & Human Rights)',
          score: 10,
          tags: ['社會', '人權', 'DEI'],
        },
        {
          id: 'C',
          content: '公司治理與透明度 (Governance)',
          score: 10,
          tags: ['治理', '透明度', '合規'],
        },
        {
          id: 'D',
          content: '循環經濟 (Circular Economy)',
          score: 10,
          tags: ['環境', '循環經濟', '資源'],
        },
      ],
    },
    {
      id: 'Q2',
      question: '您認為企業實踐 ESG 最大的挑戰是什麼？',
      type: 'single',
      category: 'General',
      difficulty: 'Intermediate',
      options: [
        {
          id: 'A',
          content: '缺乏明確的衡量標準 (Metrics)',
          score: 15,
          tags: ['指標', '量化', '標準'],
        },
        {
          id: 'B',
          content: '短期成本與長期效益的平衡 (Trade-offs)',
          score: 15,
          tags: ['財務', '策略', '平衡'],
        },
        {
          id: 'C',
          content: '供應鏈管理的複雜性 (Supply Chain)',
          score: 15,
          tags: ['供應鏈', '管理', '風險'],
        },
        {
          id: 'D',
          content: '利害關係人的期待管理 (Stakeholders)',
          score: 15,
          tags: ['溝通', '利害關係人', '期待'],
        },
      ],
    },
    {
      id: 'Q3',
      question: '您希望透過 ESG 學習獲得什麼？（可複選）',
      type: 'multiple',
      category: 'General',
      difficulty: 'Beginner',
      options: [
        {
          id: 'A',
          content: '提升專業知識 (Domain Knowledge)',
          score: 5,
          tags: ['學習', '知識', '專業'],
        },
        {
          id: 'B',
          content: '實務應用技能 (Practical Skills)',
          score: 5,
          tags: ['實務', '技能', '應用'],
        },
        {
          id: 'C',
          content: '產業趨勢洞察 (Industry Insight)',
          score: 5,
          tags: ['趨勢', '洞察', '產業'],
        },
        {
          id: 'D',
          content: '認證與資格 (Certifications)',
          score: 5,
          tags: ['認證', '資格', '證照'],
        },
      ],
    },
    {
      id: 'Q4',
      question: '您對「創價型 ESG (CSV)」的理解程度？',
      type: 'rating',
      category: 'General',
      difficulty: 'Advanced',
      options: [
        { id: '1', content: '完全不了解 (N/A)', score: 0, tags: ['初學者'] },
        { id: '2', content: '略有耳聞 (Beginner)', score: 5, tags: ['初學者'] },
        { id: '3', content: '基本了解 (Intermediate)', score: 10, tags: ['中級'] },
        { id: '4', content: '深入理解 (Advanced)', score: 15, tags: ['高級'] },
        { id: '5', content: '專家水平 (Expert)', score: 20, tags: ['專家'] },
      ],
    },
    {
      id: 'Q5',
      question: '您偏好的學習方式是？',
      type: 'single',
      category: 'General',
      difficulty: 'Beginner',
      options: [
        { id: 'A', content: '深度報告閱讀 (Deep Dive)', score: 10, tags: ['閱讀', '文字', '深度'] },
        {
          id: 'B',
          content: '視覺化圖表與影片 (Visual Learning)',
          score: 10,
          tags: ['視覺', '影片', '圖像'],
        },
        { id: 'C', content: '互動式模擬 (Simulation)', score: 10, tags: ['互動', '遊戲', '實作'] },
        {
          id: 'D',
          content: 'AI 顧問諮詢 (AI Consultation)',
          score: 10,
          tags: ['對話', 'AI', '即時'],
        },
      ],
    },
  ];

  const submitAnswer = async (questionId: string, optionIds: string[]) => {
    const newRecord = new Map(answerRecord);
    newRecord.set(questionId, optionIds);
    setAnswerRecord(newRecord);

    if (currentQuestionIndex < questionList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const profile = await generateUserProfile(newRecord, questionList);
      setUserProfile(profile);
      setCurrentStep('Result');
    }
  };

  const generateUserProfile = async (
    answers: Map<string, string[]>,
    questions: QuestionnaireItem[]
  ): Promise<UserProfile> => {
    let totalScore = 0;
    const tagSet = new Set<string>();
    const categoryScores = { Environmental: 0, Social: 0, Governance: 0 };

    answers.forEach((selectedOptionIds, questionId) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      selectedOptionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
        if (!option) return;

        totalScore += option.score;
        option.tags.forEach(tag => tagSet.add(tag));

        if (question.category !== 'General') {
          categoryScores[question.category] += option.score;
        } else {
          categoryScores.Environmental += option.score * CATEGORY_WEIGHT;
          categoryScores.Social += option.score * CATEGORY_WEIGHT;
          categoryScores.Governance += option.score * CATEGORY_WEIGHT;
        }
      });
    });

    const interestTags = Array.from(tagSet);
    const recommendedTopics = generateRecommendedTopics(interestTags);
    const userId = OmniUUIDGenerator.generate(OmniEntityPrefix.CERT);

    const baseProfile = {
      id: userId,
      knowledgeLevel: {
        environmental: Math.min(100, Math.round(categoryScores.Environmental * 2)),
        social: Math.min(100, Math.round(categoryScores.Social * 2)),
        governance: Math.min(100, Math.round(categoryScores.Governance * 2)),
        total: Math.min(100, totalScore),
      },
      interestTags,
      learningPreferences: interestTags.filter(t => ['閱讀', '視覺', '互動', '對話'].includes(t)),
      recommendedTopics,
    };

    // 🔴 5T 協議整合：將測評結果進行不可篡改封存 (Seal)
    const evidence = await TrustworthyLock.seal(baseProfile, 'esgss://assessment/v3');

    return {
      ...baseProfile,
      evidence,
    };
  };

  const generateRecommendedTopics = (tags: string[]): string[] => {
    const topicMap: Record<string, string[]> = {
      環境: ['碳中和實務', '循環經濟案例', '綠色金融'],
      社會: ['DEI 最佳實踐', '供應鏈人權', '社區參與'],
      治理: ['董事會效能', '風險管理', '資訊揭露'],
      氣候: ['氣候風險評估', 'TCFD 框架', '淨零路徑'],
    };

    const recommendations = new Set<string>();
    tags.forEach(tag => {
      Object.entries(topicMap).forEach(([keyword, topics]) => {
        if (tag.includes(keyword)) {
          topics.forEach(topic => recommendations.add(topic));
        }
      });
    });

    return Array.from(recommendations).slice(0, RECOMMENDATION_LIMIT);
  };

  return (
    <div className="holistic-assessment-container p-6 bg-slate-950 min-h-screen text-slate-100 font-sans relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <AnimatePresence mode="wait">
        {currentStep === 'Start' && (
          <StartScreen key="start" onStart={() => setCurrentStep('Assessment')} />
        )}
        {currentStep === 'Assessment' && (
          <AssessmentScreen
            key="assessment"
            question={questionList[currentQuestionIndex]!}
            questionIndex={currentQuestionIndex + 1}
            totalQuestions={questionList.length}
            onSubmitAnswer={submitAnswer}
          />
        )}
        {currentStep === 'Result' && userProfile && (
          <ResultScreen key="result" profile={userProfile} />
        )}
      </AnimatePresence>
    </div>
  );
};

const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -20 }}
    className="max-w-2xl w-full text-center z-10"
  >
    <div className="relative inline-block mb-8">
      <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 animate-pulse"></div>
      <Hexagon className="w-24 h-24 text-primary-400 relative z-10" strokeWidth={1} />
      <GraduationCap className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
    </div>

    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-500 mb-6 tracking-tight">
      全人教育測評 V_3.0
    </h1>
    <p className="text-xl text-slate-400 mb-10 font-light tracking-wide">
      ESG 知識光譜分析・自適應路徑擬定
    </p>

    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 mb-10 text-left relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-blue-500"></div>
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="text-primary-400" size={18} />
        SYSTEM MODULES
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'ESG Core Competency Eval',
          'Interest Domain ID',
          'Learning Style Analysis',
          'Adaptive Path Generation',
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-slate-400 text-sm p-3 bg-slate-950/50 rounded border border-slate-800"
          >
            <CheckCircle className="text-primary-500/80" size={16} />
            {item}
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={onStart}
      className="px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 mx-auto group"
    >
      初始化測評 (INITIALIZE)
      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

const AssessmentScreen: React.FC<{
  question: QuestionnaireItem;
  questionIndex: number;
  totalQuestions: number;
  onSubmitAnswer: (questionId: string, optionIds: string[]) => void;
}> = ({ question, questionIndex, totalQuestions, onSubmitAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelection = (optionId: string) => {
    if (question.type === 'multiple') {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleConfirm = () => {
    if (selectedOptions.length > 0) {
      onSubmitAnswer(question.id, selectedOptions);
      setSelectedOptions([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-3xl w-full z-10"
    >
      <div className="mb-8 flex items-end gap-4">
        <div className="text-6xl font-black text-slate-800/50 absolute -top-20 left-0 -z-10 select-none">
          Q.{questionIndex}
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono text-primary-400 mb-2">
            <span>測評進度 (PROGRESS)</span>
            <span>{Math.round((questionIndex / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-white/5 px-4 py-2 rounded-bl-2xl border-b border-l border-white/10 text-xs font-bold text-slate-400 flex gap-4">
          <span className="text-primary-400">TYPE: {question.type}</span>
          <span>LV: {question.difficulty}</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8 mt-2 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map(option => (
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
              whileTap={{ scale: 0.99 }}
              key={option.id}
              onClick={() => handleSelection(option.id)}
              className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between group ${
                selectedOptions.includes(option.id)
                  ? 'border-primary-500 bg-primary-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-slate-700 bg-slate-950/50 text-slate-400 hover:border-primary-500/50 hover:text-white'
              }`}
            >
              <span className="font-medium tracking-wide">{option.content}</span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary-400 bg-primary-400'
                    : 'border-slate-600 group-hover:border-primary-400'
                }`}
              >
                {selectedOptions.includes(option.id) && (
                  <CheckCircle className="text-slate-900" size={14} />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={selectedOptions.length === 0}
        className="w-full py-4 bg-slate-800 text-slate-400 text-lg font-bold rounded-xl hover:bg-primary-600 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {questionIndex === totalQuestions ? '完成測評 (COMPLETE)' : '下一題 (NEXT)'}
      </button>
    </motion.div>
  );
};

const ResultScreen: React.FC<{ profile: UserProfile }> = ({ profile }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-5xl w-full z-10"
  >
    <div className="text-center mb-10">
      <div className="inline-block p-4 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
        <Award className="w-12 h-12 text-yellow-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">測評已完成 (ASSESSMENT COMPLETE)</h1>
      <p className="text-slate-400 font-mono text-sm">用戶識別碼 (USER ID): {profile.id}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="text-primary-400" /> KNOWLEDGE SPECTRUM
        </h2>
        <div className="space-y-6">
          <KnowledgeBar
            title="Environmental (E)"
            score={profile.knowledgeLevel.environmental}
            color="bg-emerald-500"
          />
          <KnowledgeBar
            title="Social (S)"
            score={profile.knowledgeLevel.social}
            color="bg-blue-500"
          />
          <KnowledgeBar
            title="Governance (G)"
            score={profile.knowledgeLevel.governance}
            color="bg-purple-500"
          />

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-end justify-between">
              <span className="text-slate-400 text-sm">TOTAL SCORE</span>
              <span className="text-4xl font-black text-white">{profile.knowledgeLevel.total}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2">
              <div
                className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${profile.knowledgeLevel.total}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="text-pink-400" /> INTEREST TAGS
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interestTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-950/30 text-pink-300 border border-pink-500/30 rounded-md text-xs font-bold tracking-wide"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" /> RECOMMENDED PATHS
          </h2>
          <div className="space-y-3">
            {profile.recommendedTopics.map((topic, index) => (
              <div
                key={index}
                className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 hover:border-primary-500/30 transition-all cursor-pointer group"
              >
                <span className="text-slate-300 text-sm group-hover:text-primary-300 transition-colors">
                  {topic}
                </span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-primary-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 🔴 5T 誠信錨點 UI */}
        {profile.evidence && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-[primary]/20 rounded-2xl p-6">
            <h2 className="text-sm font-black text-[primary] mb-4 flex items-center gap-2 tracking-widest uppercase">
              <Shield size={16} /> 5T PROOF ANCHOR
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                  Hash Lock (SHA-256)
                </div>
                <div className="text-[11px] font-mono break-all text-slate-300 tracking-wider">
                  {profile.evidence.hash_lock}
                </div>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  封存時間 (Sealed At)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {new Date(profile.evidence.sealed_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  協議版本 (Protocol Version)
                </span>
                <span className="text-[10px] font-mono text-[primary]">v10.0-SENTIENT</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const KnowledgeBar: React.FC<{ title: string; score: number; color: string }> = ({
  title,
  score,
  color,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{title}</span>
      <span className="text-sm font-mono text-white">{score}/100</span>
    </div>
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className={`h-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  </div>
);
