import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { triviaService } from '../services/esgTriviaService';
import {
  type TriviaQuestion,
  TriviaDifficulty,
  Rarity,
  CardType,
  type OmniCard,
  type QuizChallenge,
} from '../../shared/types';
import { omniClient } from '../api/omniClient';
import { ESGKnowledgeBase } from '../types/omniCore';
import { Search, BookOpen, Shield, Globe, Award, Leaf, Scale, Zap as ZapIcon, Info } from 'lucide-react';

// Mock Data for Demo
const MOCK_CARDS: OmniCard[] = [
  {
    id: 'card_sun_power',
    name: 'Solar Vanguard',
    type: CardType.ESG,
    rarity: Rarity.RARE,
    artwork: '☀️',
    description: 'Grants +10% efficiency in renewable energy tasks.',
    flavorText: 'Harness the power of the closest star.',
    effects: [],
    isEquipped: false,
  },
  {
    id: 'card_ocean_guardian',
    name: 'Ocean Guardian',
    type: CardType.ESG,
    rarity: Rarity.EPIC,
    artwork: '🌊',
    description: 'Protects marine ecosystems, unblocking water-related paths.',
    flavorText: 'The depths hold secrets of sustainability.',
    effects: [],
    isEquipped: false,
  },
  {
    id: 'card_policy_maker',
    name: 'Global Policymaker',
    type: CardType.ESG,
    rarity: Rarity.LEGENDARY,
    artwork: '⚖️',
    description: 'Allows influence over G-governance parameters.',
    flavorText: 'Rules are meant to be rewritten for the better.',
    effects: [],
    isEquipped: false,
  },
];

export const KnowledgeLibrary: React.FC = () => {
  // State for Knowledge Base Management
  const [selectedKB, setSelectedKB] = useState<string>('default_kb');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // V7.2 Omni-Library Expansion
  const [activeTab, setActiveTab] = useState<
    'cards' | 'archives' | 'regulations' | 'yearbooks' | 'cases' | 'esg_points'
  >('cards');

  // MOCK DATA for V7.2 (Englishized)
  const ARCHIVES = [
    {
      id: 'arc_01',
      type: 'Sustainability Report',
      company: 'TSMC',
      year: '2025',
      title: '2025 TSMC Sustainability Report (Verified)',
      status: 'Verified',
    },
    {
      id: 'arc_02',
      type: 'ESG Report',
      company: 'Delta Electronics',
      year: '2025',
      title: 'Delta 2025 ESG Annual Report',
      status: 'Verified',
    },
    {
      id: 'arc_03',
      type: 'CSR Report',
      company: 'MediaTek',
      year: '2024',
      title: 'MediaTek 2024 CSR Report',
      status: 'Archived',
    },
    {
      id: 'arc_04',
      type: 'Sustainability Report',
      company: 'Fubon Financial',
      year: '2024',
      title: 'Fubon 2024 Sustainability Development Report',
      status: 'Archived',
    },
    {
      id: 'arc_05',
      type: 'ESG Report',
      company: 'CTBC Financial',
      year: '2024',
      title: 'CTBC 2024 ESG Report',
      status: 'Archived',
    },
    {
      id: 'arc_06',
      type: 'Sustainability Report',
      company: 'CSC',
      year: '2023',
      title: 'CSC 2023 Sustainability Report',
      status: 'Historical',
    },
  ];

  const REGULATIONS = [
    {
      id: 'reg_01',
      code: 'TW-CCRA-2023',
      title: 'Climate Change Response Act',
      authority: 'Ministry of Environment',
      date: '2023-01-10',
      impact: 'Critical',
    },
    {
      id: 'reg_02',
      code: 'EU-CBAM',
      title: 'EU Carbon Border Adjustment Mechanism (CBAM)',
      authority: 'European Commission',
      date: '2023-10-01',
      impact: 'Extreme',
    },
    {
      id: 'reg_03',
      code: 'IFRS-S1',
      title: 'IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information',
      authority: 'ISSB',
      date: '2023-06-26',
      impact: 'Global Standard',
    },
    {
      id: 'reg_04',
      code: 'IFRS-S2',
      title: 'IFRS S2 Climate-related Disclosures',
      authority: 'ISSB',
      date: '2023-06-26',
      impact: 'Global Standard',
    },
    {
      id: 'reg_05',
      code: 'TW-FSC-RR',
      title: 'Sustainability Development Roadmap for Listed Companies',
      authority: 'FSC',
      date: '2022-03-03',
      impact: 'High',
    },
  ];

  const YEARBOOKS = [
    {
      id: 'yb_2025',
      title: '2025 Taiwan ESG Enterprise Yearbook',
      coverage: 'Top 100 Enterprises',
      publisher: 'ESGss Excellence Academy',
      pages: 320,
    },
    {
      id: 'yb_2024',
      title: '2024 Taiwan ESG Enterprise Yearbook',
      coverage: 'Top 100 Enterprises',
      publisher: 'ESGss Excellence Academy',
      pages: 312,
    },
    {
      id: 'yb_2023',
      title: '2023 Taiwan ESG Enterprise Yearbook',
      coverage: 'Top 80 Enterprises',
      publisher: 'ESGss Excellence Academy',
      pages: 298,
    },
    {
      id: 'yb_2022',
      title: '2022 Taiwan ESG Enterprise Yearbook',
      coverage: 'Top 50 Enterprises',
      publisher: 'ESGss Excellence Academy',
      pages: 275,
    },
    {
      id: 'yb_2021',
      title: '2021 Taiwan ESG Enterprise Yearbook',
      coverage: 'Top 50 Enterprises',
      publisher: 'ESGss Excellence Academy',
      pages: 250,
    },
  ];
  // State for Trivia Quiz
  const [selectedCard, setSelectedCard] = useState<OmniCard | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<QuizChallenge | null>(null);
  const [quizFinished, setQuizFinished] = useState<{ passed: boolean; score: number } | null>(null);

  // Trivia Handlers
  const handleCardClick = (card: OmniCard) => {
    setSelectedCard(card);
    setQuizFinished(null);
    const challenge = triviaService.generateChallengeForCard('partner_1', card as any);
    setActiveChallenge(challenge);
  };

  const handleAnswer = (index: number) => {
    if (!activeChallenge) return;
    const result = triviaService.submitAnswer(activeChallenge, index);
    setActiveChallenge({ ...activeChallenge }); // Force update
    if (result.finished) {
      setQuizFinished({
        passed: result.challenge.passed,
        score: result.challenge.score,
      });
    }
  };

  const resetQuiz = () => {
    setSelectedCard(null);
    setActiveChallenge(null);
    setQuizFinished(null);
  };

  // KB Handlers
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await omniClient.retrieveKnowledge({
        kbId: selectedKB,
        query: searchQuery,
        topK: 5,
      });
      setSearchResults((response as any).results || []);
    } catch (err) {
      omniLogger.error(LogCategory.SYSTEM, '[KnowledgeLibrary] Vector search failed:', { error: err });
    }
  };

  // V7.3 Case Studies (Englishized)
  const CASE_STUDIES = [
    {
      id: 'case_01',
      company: 'Patagonia',
      title: 'Purpose-Driven: Earth Tax',
      industry: 'Retail',
      outcome: 'Brand Loyalty +150%',
      summary:
        'Through the "Earth Tax" initiative, 1% of revenue is donated to environmental protection organizations. The "Don\'t Buy This Jacket" campaign emphasized durability, successfully translating brand values into high-engagement community belief.',
    },
    {
      id: 'case_02',
      company: 'Ørsted',
      title: 'Black to Green: Energy Transition',
      industry: 'Energy',
      outcome: 'Carbon Reduction 86%',
      summary:
        'Formerly DONG Energy (Danish Oil and Natural Gas), it completely transformed into a global leader in offshore wind power within a decade. It proved that traditional energy majors can successfully achieve 100% green transition with rising net profits.',
    },
    {
      id: 'case_03',
      company: 'Unilever',
      title: 'Sustainable Living Plan (USLP)',
      industry: 'FMCG',
      outcome: 'Cost Avoidance > 1B Euro',
      summary:
        'Integrated sustainability into the core of 400+ brands. By reducing packaging and waste, it not only lowered supply chain risks but also saved over 1 billion euros in operating costs, proving ESG correlates with profitability.',
    },
    {
      id: 'case_04',
      company: 'Interface',
      title: 'Mission Zero',
      industry: 'Manufacturing',
      outcome: 'Achieved Carbon Neutrality',
      summary:
        'Inspired by "The Ecology of Commerce", Ray Anderson led this carpet manufacturer to pursue "Mission Zero", pledging to eliminate all negative environmental impacts by 2020, and successfully reached it.',
    },
    {
      id: 'case_05',
      company: 'Tesla',
      title: 'Accelerating the Transition',
      industry: 'Automotive',
      outcome: 'Market Cap Exceeds Top 9 Peers Combined',
      summary:
        'Broke the myth that electric vehicles are low-performance or short-range. Through Model S/3/Y, it proved green products can be high-performance and desirable, single-handedly accelerating the global electrification of the auto industry.',
    },
  ];

  const handleDownload = (title: string) => {
    alert(`Accessing: ${title}\n(Simulated: Connecting to Data Vault Secure Reader...)`);
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-900 text-white font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Omni-Library
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30 flex items-center gap-1">
            🔓 FULL ACCESS GRANTED
          </span>
        </h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('esg_points')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'esg_points' ? 'bg-slate-800 text-purple-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" /> ESG 知識點 (New)
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'cards' ? 'bg-slate-800 text-emerald-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          Knowledge Cards
        </button>
        <button
          onClick={() => setActiveTab('archives')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'archives' ? 'bg-slate-800 text-cyan-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          Enterprise Archives
        </button>
        <button
          onClick={() => setActiveTab('regulations')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'regulations' ? 'bg-slate-800 text-yellow-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          Regulations
        </button>
        <button
          onClick={() => setActiveTab('yearbooks')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'yearbooks' ? 'bg-slate-800 text-purple-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          Yearbooks
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'cases' ? 'bg-slate-800 text-pink-400 border-t border-x border-white/10' : 'text-slate-400 hover:text-white'}`}
        >
          Case Studies (New)
        </button>
      </div>

      {/* Search Section (Global) */}
      <div className="mb-8 bg-slate-800/30 p-4 rounded-xl border border-white/5 flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab === 'cards' ? 'Knowledge Cards' : activeTab === 'archives' ? 'Enterprise Reports' : activeTab === 'regulations' ? 'Regulations' : activeTab === 'yearbooks' ? 'Yearbooks' : 'Real Cases'}...`}
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none text-white placeholder-slate-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-white shadow-lg"
        >
          Vector Search
        </button>
      </div>

      {/* --- TAB CONTENT: KNOWLEDGE CARDS --- */}
      {
        activeTab === 'cards' && (
          <>
            <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
              <span>📚</span> Unsealed Archives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {MOCK_CARDS.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`
                                     relative p-6 rounded-xl border border-emerald-500/20 cursor-pointer transition-all duration-300
                                     hover:scale-105 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
                                     bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md group
                                 `}
                >
                  <div className="text-6xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">
                    {card.artwork}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-white group-hover:text-emerald-300">
                    {card.name}
                  </h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-950 border border-slate-700 text-emerald-400`}
                    >
                      {card.rarity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm text-center line-clamp-2 font-light">
                    {card.description}
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      }

      {/* --- TAB CONTENT: ARCHIVES (REPORTS) --- */}
      {
        activeTab === 'archives' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            {ARCHIVES.map(doc => (
              <div
                key={doc.id}
                className="bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center text-cyan-400">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300">
                      {doc.title}
                    </h3>
                    <div className="flex gap-3 text-sm text-slate-400 mt-1">
                      <span className="text-white bg-slate-700 px-2 rounded text-xs py-0.5">
                        {doc.company}
                      </span>
                      <span>• {doc.year}</span>
                      <span>• {doc.type}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc.title)}
                  className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-lg transition-all font-semibold text-sm border border-cyan-500/30"
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )
      }

      {/* --- TAB CONTENT: REGULATIONS --- */}
      {
        activeTab === 'regulations' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            {REGULATIONS.map(reg => (
              <div
                key={reg.id}
                className="bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-yellow-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-400">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-yellow-300">
                      {reg.title}
                    </h3>
                    <div className="flex gap-3 text-sm text-slate-400 mt-1">
                      <span className="text-yellow-500/80 font-mono">{reg.code}</span>
                      <span>• {reg.authority}</span>
                      <span>• Effective: {reg.date}</span>
                      <span className="text-red-400 bg-red-900/20 px-1 rounded text-xs">
                        {reg.impact}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(reg.title)}
                  className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white rounded-lg transition-all font-semibold text-sm border border-yellow-500/30"
                >
                  View Full Text
                </button>
              </div>
            ))}
          </div>
        )
      }

      {/* --- TAB CONTENT: YEARBOOKS --- */}
      {
        activeTab === 'yearbooks' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
            {YEARBOOKS.map(book => (
              <div
                key={book.id}
                className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden group hover:border-purple-500/50 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 blur-3xl rounded-full"></div>
                  <h3 className="text-2xl font-black text-white z-10 font-serif tracking-widest">
                    {book.id.split('_')[1]}
                  </h3>
                  <div className="text-purple-300 text-xs tracking-widest uppercase z-10 mt-2">
                    ESG Yearbook
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    Comprehensive analysis of the top {book.coverage} in Taiwan. Published by{' '}
                    {book.publisher}.
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>📄 {book.pages} Pages</span>
                    <span>📥 PDF</span>
                  </div>
                  <button
                    onClick={() => handleDownload(book.title)}
                    className="w-full py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white font-bold transition-all"
                  >
                    Access File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* --- TAB CONTENT: CASE STUDIES (REAL) --- */}
      {
        activeTab === 'cases' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {CASE_STUDIES.map(study => (
              <div
                key={study.id}
                className="bg-slate-800/80 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 hover:border-pink-500/50 transition-all group"
              >
                <div className="w-full md:w-48 h-32 bg-slate-900 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent"></div>
                  <span className="font-black text-xl text-slate-500 group-hover:text-pink-400 transition-colors">
                    {study.company}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-300">
                      {study.title}
                    </h3>
                    <span className="px-2 py-1 bg-pink-900/30 text-pink-300 text-xs rounded border border-pink-500/30">
                      {study.industry}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4 leading-relaxed font-light">{study.summary}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Key Outcome</span>
                      <span className="font-bold text-emerald-400">{study.outcome}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(study.title)}
                      className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white rounded-lg transition-all text-sm font-bold"
                    >
                      Deep Dive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Quiz Modal */}
      {
        selectedCard && activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>🧠</span> Knowledge Unlock Challenge
                  </h2>
                  <p className="text-emerald-400 text-sm mt-1">
                    Target Card: {selectedCard!.name} ({selectedCard!.rarity})
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {!quizFinished ? (
                  <>
                    <div className="mb-6 flex justify-between items-end">
                      <span className="text-slate-400 text-sm">
                        Question {activeChallenge!.currentQuestionIndex + 1} /{' '}
                        {activeChallenge!.questions.length}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded bg-slate-700 ${activeChallenge!.difficulty === TriviaDifficulty.HARD
                          ? 'text-red-400'
                          : activeChallenge!.difficulty === TriviaDifficulty.MEDIUM
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                          }`}
                      >
                        {activeChallenge!.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {(() => {
                      const currentQuestion =
                        activeChallenge!.questions[activeChallenge!.currentQuestionIndex];
                      if (!currentQuestion) {
                        return (
                          <div className="text-center py-8 text-red-400">
                            Error: Failed to load question data (Index:{' '}
                            {activeChallenge!.currentQuestionIndex})
                          </div>
                        );
                      }

                      return (
                        <>
                          <h3 className="text-xl font-medium mb-8 leading-relaxed">
                            {currentQuestion.question}
                          </h3>

                          <div className="grid gap-3">
                            {currentQuestion.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="w-full text-left p-4 rounded-lg bg-slate-700/50 hover:bg-emerald-600/20 hover:border-emerald-500 border border-transparent transition-all group"
                              >
                                <span className="inline-block w-6 h-6 rounded-full bg-slate-600 text-xs text-center leading-6 mr-3 group-hover:bg-emerald-500 group-hover:text-white">
                                  {['A', 'B', 'C', 'D'][idx]}
                                </span>
                                {option}
                              </button>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-6">{quizFinished!.passed ? '🎉' : '📚'}</div>
                    <h2 className="text-3xl font-bold mb-4">
                      {quizFinished!.passed ? 'Unlock Successful!' : 'Unlock Failed'}
                    </h2>
                    <p className="text-slate-300 mb-8 text-lg">
                      {quizFinished!.passed
                        ? `Congratulations! You have demonstrated sufficient ESG knowledge and earned "${selectedCard!.name}".`
                        : `Don't be discouraged! Build more knowledge and try again. Accuracy: ${Math.round((quizFinished!.score / activeChallenge!.questions.length) * 100)}%`}
                    </p>
                    <button
                      onClick={resetQuiz}
                      className={`px-8 py-3 rounded-full font-bold transition-all ${quizFinished!.passed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-600 hover:bg-slate-500 text-white'
                        }`}
                    >
                      {quizFinished!.passed ? 'Claim Card' : 'Close'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};
