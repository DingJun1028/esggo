import React, { useState } from 'react';
import { Tent, Zap, ClipboardCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  Progress,
  ScrollArea,
  Label,
  RadioGroup,
  RadioGroupItem,
  Badge,
  Separator,
} from '@/components/ui';
import { FeatureGuide } from './FeatureGuide';

// --- Types ---

interface Question {
  id: string;
  text: string;
  category: 'compliance' | 'value';
  options: { label: string; value: number }[];
}

const DIAGNOSTIC_QUESTIONS: Question[] = [
  // Compliance Track (Basic)
  {
    id: 'q1',
    text: 'Does your organization publish an annual ESG or Sustainability Report?',
    category: 'compliance',
    options: [
      { label: 'Yes, compliant with GRI/SASB Standards', value: 10 },
      { label: 'Yes, but not following specific frameworks', value: 6 },
      { label: 'In progress', value: 3 },
      { label: 'No', value: 0 },
    ],
  },
  {
    id: 'q2',
    text: 'Do you track Scope 1 and Scope 2 GHG emissions?',
    category: 'compliance',
    options: [
      { label: 'Yes, with verified data', value: 10 },
      { label: 'Yes, estimates only', value: 7 },
      { label: 'Partial tracking', value: 4 },
      { label: 'No', value: 0 },
    ],
  },
  // Value Track (Creation)
  {
    id: 'q3',
    text: 'Is your sustainability strategy integrated into your core business model?',
    category: 'value',
    options: [
      { label: 'Fully integrated (Regenerative Model)', value: 10 },
      { label: 'Aligned with some business units', value: 7 },
      { label: 'Separate "CSR" department', value: 4 },
      { label: 'Ad-hoc initiatives only', value: 0 },
    ],
  },
  {
    id: 'q4',
    text: 'Does your unified "Civilization Narrative" guide internal culture?',
    category: 'value',
    options: [
      { label: 'Yes, actively lived and measured', value: 10 },
      { label: 'Defined but not fully operational', value: 7 },
      { label: 'Vague mission statement only', value: 3 },
      { label: 'No clear narrative', value: 0 },
    ],
  },
];

export const EsgHealthCheck: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Questions, 2: Result
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Calculate Scores
  const calculateScores = () => {
    let compScore = 0;
    let compMax = 0;
    let valScore = 0;
    let valMax = 0;

    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const score = answers[q.id] || 0;
      if (q.category === 'compliance') {
        compScore += score;
        compMax += 10;
      } else {
        valScore += score;
        valMax += 10;
      }
    });

    // Avoid division by zero
    compMax = compMax || 1;
    valMax = valMax || 1;

    return {
      compliance: Math.round((compScore / compMax) * 100),
      value: Math.round((valScore / valMax) * 100),
    };
  };

  const handleStart = () => setStep(1);

  const handleAnswer = (qid: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const handleNext = () => {
    if (step < DIAGNOSTIC_QUESTIONS.length) {
      // In a real app we might paginate.
      // Here we show all Qs in one scroll area, so 'Next' simply means 'Finish'
    }
    setStep(2); // Go directly to results for MVP
  };

  const handleRetake = () => {
    setAnswers({});
    setStep(1);
  };

  const scores = calculateScores();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 relative">
        <div className="absolute right-0 top-0">
          <FeatureGuide
            title="ESG Holistic Assessment"
            description="A rapid diagnostic tool to evaluate your organization's sustainability maturity across two critical dimensions: Compliance (doing things right) and Value Creation (doing the right things)."
            benefits={[
              'Instant Baseline: Get a clear snapshot of where you stand in minutes.',
              "Dual-Lens Analysis: Unlike other tools, we measure both 'Defense' (Compliance) and 'Offense' (Value).",
              'Actionable Roadmap: Receive AI-generated next steps based on your specific gaps.',
            ]}
            howToUse={[
              'Start Assessment: Click start to begin the questionnaire.',
              'Answer Honestly: Select the options that best reflect your CURRENT status.',
              'Review Results: Analyze your Compliance vs. Value scores and read the recommended actions.',
            ]}
          />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          ESG Holistic Assessment
        </h2>
        <p className="text-muted-foreground">
          Evaluate your organization's "Health" across Compliance and Value-Creation dimensions.
        </p>
      </div>

      {/* STEP 0: INTRO */}
      {step === 0 && (
        <Card className="max-w-2xl mx-auto border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-primary" />
              Ready for your Check-up?
            </CardTitle>
            <CardDescription>
              This AI-enhanced diagnostic tool analyzes 4 key dimensions to generate your initial
              Health Score. No confidential data upload required for this phase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-1">Compliance Track</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>GRI / SASB Alignment</li>
                  <li>Carbon Compliance</li>
                  <li>Regulatory Risk</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-1">Value-Creation Track</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Civilization Narrative</li>
                  <li>Regenerative Business Model</li>
                  <li>Social Innovation</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStart} className="w-full md:w-auto">
              Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 1: QUESTIONS */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment in Progress</CardTitle>
            <CardDescription>Please answer honestly for the best results.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-8">
                {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant={q.category === 'compliance' ? 'default' : 'secondary'}>
                        {q.category === 'compliance' ? 'Compliance' : 'Value'}
                      </Badge>
                      <h3 className="font-medium text-lg leading-none pt-1">
                        {idx + 1}. {q.text}
                      </h3>
                    </div>
                    <RadioGroup
                      onValueChange={val => handleAnswer(q.id, parseInt(val))}
                      value={answers[q.id]?.toString()}
                      className="space-y-2 pl-2"
                    >
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${optIdx}`} />
                          <Label
                            htmlFor={`${q.id}-${optIdx}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={Object.keys(answers).length < DIAGNOSTIC_QUESTIONS.length}
            >
              Reveal Health Score
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: RESULTS */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid md:grid-cols-2 gap-6">
            {/* SCORE CARD 1 */}
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-500">Compliance Health</CardTitle>
                <CardDescription>Alignment with regulations & standards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold">{scores.compliance}%</div>
                <Progress
                  value={scores.compliance}
                  className="h-2 bg-blue-900"
                  indicatorClassName="bg-blue-500"
                />
                <p className="text-sm text-muted-foreground">
                  {scores.compliance > 80
                    ? 'Excellent. Your foundation is solid.'
                    : scores.compliance > 50
                      ? 'Moderate. Gaps exist in data verification.'
                      : 'Critical. Immediate regulatory risks detected.'}
                </p>
              </CardContent>
            </Card>

            {/* SCORE CARD 2 */}
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="text-green-500">Value-Creation Power</CardTitle>
                <CardDescription>Innovation, Culture & Narrative strength</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold">{scores.value}%</div>
                <Progress
                  value={scores.value}
                  className="h-2 bg-green-900"
                  indicatorClassName="bg-green-500"
                />
                <p className="text-sm text-muted-foreground">
                  {scores.value > 80
                    ? 'Visionary. You are a market leader.'
                    : scores.value > 50
                      ? 'Emerging. Good initiatives, but needs integration.'
                      : 'Dormant. Sustainability is treated as a cost center.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ACTION PLAN */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended AI Action Plan (90-Day Sprint)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scores.compliance < 80 && (
                  <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-500/10 border-blue-500/20">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-400">Formalize Data Collection</h4>
                      <p className="text-sm">
                        Your compliance score indicates gaps. Use the{' '}
                        <strong>TrustProtocol Service</strong> to start immutably recording Scope 1
                        & 2 data.
                      </p>
                    </div>
                  </div>
                )}
                {scores.value < 80 && (
                  <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-400">
                        Develop Civilization Narrative
                      </h4>
                      <p className="text-sm">
                        Unlock higher valuation by integrating ESG into your brand story. Use the{' '}
                        <strong>Agent Forge</strong> to design a "Chief Narrative Officer" agent.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center p-4">
                  <Button size="lg" variant="outline" onClick={handleRetake}>
                    Retake Assessment
                  </Button>
                  <Button size="lg" className="ml-4">
                    Generate Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
