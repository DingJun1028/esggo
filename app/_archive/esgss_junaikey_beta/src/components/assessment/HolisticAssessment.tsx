import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Progress,
  Badge,
} from '@/components/ui';
import { CareerPath } from '../../../shared/types';
import { socialEconomyService } from '@services/socialEconomyService';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Scale, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: { e: number; s: number; g: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'When facing a heavily polluted river near a factory, your first instinct is to...',
    options: [
      {
        text: 'Analyze the chemical composition and design a filtration system.',
        scores: { e: 5, s: 1, g: 2 },
      },
      {
        text: 'Organize the local community to protest and demand action.',
        scores: { e: 2, s: 5, g: 1 },
      },
      {
        text: "Review the factory's compliance reports and file a legal violation.",
        scores: { e: 1, s: 2, g: 5 },
      },
    ],
  },
  {
    id: 2,
    text: 'A company wants to invest in a controversial mining project. You advise them to...',
    options: [
      {
        text: 'Assess the long-term environmental degradation risks.',
        scores: { e: 5, s: 1, g: 2 },
      },
      {
        text: 'Consider the impact on indigenous populations and public relations.',
        scores: { e: 2, s: 5, g: 1 },
      },
      {
        text: 'Evaluate the governance structure and potential corruption risks.',
        scores: { e: 1, s: 2, g: 5 },
      },
    ],
  },
  {
    id: 3,
    text: 'Your ideal vision of a sustainable future looks like...',
    options: [
      {
        text: 'A world powered entirely by renewable, clean energy tech.',
        scores: { e: 5, s: 1, g: 1 },
      },
      {
        text: 'A society with zero poverty and universal education.',
        scores: { e: 1, s: 5, g: 1 },
      },
      {
        text: 'A global economy built on transparency and fair trade.',
        scores: { e: 1, s: 1, g: 5 },
      },
    ],
  },
  {
    id: 4,
    text: 'You discover a colleague is falsifying sustainability data. You...',
    options: [
      {
        text: 'Fix the data yourself using accurate calculation models.',
        scores: { e: 4, s: 1, g: 2 },
      },
      {
        text: 'Talk to them privately to understand their pressure/stress.',
        scores: { e: 1, s: 5, g: 2 },
      },
      {
        text: 'Report the incident to the ethics committee immediately.',
        scores: { e: 1, s: 1, g: 5 },
      },
    ],
  },
  {
    id: 5,
    text: 'Which tool feels most powerful in your hands?',
    options: [
      { text: 'A sophisticated carbon sensor.', scores: { e: 5, s: 0, g: 0 } },
      { text: 'A microphone to amplify voices.', scores: { e: 0, s: 5, g: 0 } },
      { text: 'A gavel to enforce the law.', scores: { e: 0, s: 0, g: 5 } },
    ],
  },
];

export const HolisticAssessment: React.FC<{ onComplete: (path: CareerPath) => void }> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'analyzing' | 'result'>('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ e: 0, s: 0, g: 0 });
  const [assignedPath, setAssignedPath] = useState<CareerPath | null>(null);

  const handleAnswer = (optionScores: { e: number; s: number; g: number }) => {
    const newScores = {
      e: scores.e + optionScores.e,
      s: scores.s + optionScores.s,
      g: scores.g + optionScores.g,
    };
    setScores(newScores);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      finishQuiz(newScores);
    }
  };

  const finishQuiz = async (finalScores: { e: number; s: number; g: number }) => {
    setStep('analyzing');
    // Simulate API call and "magical" analysis
    setTimeout(async () => {
      // Logic duplicated from service for immediate UI feedback, but in real app service handles it
      try {
        const profile = await socialEconomyService.submitAssessment('current_user', finalScores);
        setAssignedPath(profile.path);
        setStep('result');
      } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, '[HolisticAssessment] Assessment failed', { error: err });
      }
    }, 2000);
  };

  const renderWelcome = () => (
    <Card className="max-w-2xl mx-auto border-emerald-500/50 bg-slate-900/90 text-slate-100 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
      <CardHeader className="text-center">
        <div className="mx-auto bg-emerald-900/50 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
          <GraduationCap size={40} className="text-emerald-400" />
        </div>
        <CardTitle className="text-3xl text-emerald-300 font-serif">
          Holistic Education Assessment
        </CardTitle>
        <CardDescription className="text-slate-400 text-lg">
          "The Sorting Hat of Sustainability"
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>
          Before you embark on your journey to save the world, we must understand the nature of your
          soul. Are you guardians of the <strong className="text-green-400">Environment</strong>,
          champions of <strong className="text-rose-400">Society</strong>, or arbiters of{' '}
          <strong className="text-blue-400">Governance</strong>?
        </p>
        <p className="text-sm text-slate-500 italic">
          This assessment will analyze your ethical framework and problem-solving style to assign
          your Ideal Career Path.
        </p>
      </CardContent>
      <CardFooter className="justify-center pb-8">
        <Button
          size="lg"
          onClick={() => setStep('quiz')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 text-lg animate-pulse"
        >
          Begin Assessment
        </Button>
      </CardFooter>
    </Card>
  );

  const renderQuiz = () => {
    const question = QUESTIONS[currentQ];
    if (!question) return null;
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>
            Question {currentQ + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round((currentQ / QUESTIONS.length) * 100)}%</span>
        </div>
        <Progress value={(currentQ / QUESTIONS.length) * 100} className="h-2 mb-6" />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100 leading-relaxed">
                  {question.text}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.scores)}
                    className="w-full text-left p-4 rounded-lg border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-all group"
                  >
                    <span className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-xs text-slate-500 group-hover:border-emerald-500 group-hover:text-emerald-500">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-slate-300 group-hover:text-white">{opt.text}</span>
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
        <Brain className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-200 mb-2">Analyzing Soul Resonance...</h3>
      <p className="text-slate-500">Aligning with cosmic ESG frequencies...</p>
    </div>
  );

  const renderResult = () => {
    if (!assignedPath) return null;

    let icon = <Brain size={64} />;
    let color = 'emerald';
    if (assignedPath === CareerPath.CARBON_AUDITOR) {
      icon = <Brain size={64} />;
      color = 'text-emerald-400';
    }
    if (assignedPath === CareerPath.IMPACT_INVESTOR) {
      icon = <Heart size={64} />;
      color = 'text-rose-400';
    }
    if (assignedPath === CareerPath.ETHICS_COMPLIANCE) {
      icon = <Scale size={64} />;
      color = 'text-blue-400';
    }

    return (
      <Card className="max-w-2xl mx-auto bg-slate-900 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-transparent to-emerald-500 animate-pulse"></div>
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`mx-auto w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 ${color}`}
          >
            {icon}
          </motion.div>

          <div>
            <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-2">
              Your Career Path Is
            </h2>
            <h1 className={`text-4xl font-bold ${color} mb-4`}>{assignedPath.replace('_', ' ')}</h1>
            <p className="text-slate-300 max-w-md mx-auto">
              Your choices reveal a deep commitment to{' '}
              {assignedPath === CareerPath.CARBON_AUDITOR
                ? 'environmental precision and truth.'
                : assignedPath === CareerPath.IMPACT_INVESTOR
                  ? 'social equity and human connection.'
                  : 'justice, integrity, and structural order.'}
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg max-w-md mx-auto">
            <h4 className="text-slate-400 text-sm uppercase mb-3 text-left font-bold">
              Rewards Unlocked
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-left">
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  200 GSC
                </Badge>
                <span className="text-slate-300 text-sm">Scholarship Fund</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Badge variant="outline" className="border-purple-500 text-purple-500">
                  Legendary
                </Badge>
                <span className="text-slate-300 text-sm">Relevant Legendary Card</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onComplete(assignedPath)}
            className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700"
          >
            Enter Career Dashboard <ArrowRight className="ml-2" size={16} />
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {step === 'welcome' && renderWelcome()}
      {step === 'quiz' && renderQuiz()}
      {step === 'analyzing' && renderAnalyzing()}
      {step === 'result' && renderResult()}
    </div>
  );
};
