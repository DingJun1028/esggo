import React, { useState, useEffect, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Wind,
  Droplets,
  Truck,
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  Database,
  FileJson,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Eye,
  StickyNote,
  AlertTriangle,
  Cpu,
  Scan,
  UserCircle2,
  Terminal,
  Activity,
  LayoutDashboard,
  Settings,
  Hexagon,
  Fingerprint,
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
// Config PDF.js worker
import { OmniLabel, OmniLabelFactory } from '@/types';
import { OmniEsgManager } from '@/omni/services/OmniEsgManager';
import { Network } from 'lucide-react';

// Config PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface CarbonInput {
  electricity_kwh: number;
  water_l: number;
  transport_km: number;
}

interface EvidenceSnippet {
  text: string;
  imageUrl?: string;
  integrity?: {
    score: number;
    flags: string[];
    keywords: string[];
  };
}

interface TraceableSource {
  electricity: string;
  electricity_snippet?: EvidenceSnippet;
  water: string;
  water_snippet?: EvidenceSnippet;
  transport: string;
  transport_snippet?: EvidenceSnippet;
}

export const MentorDemoPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<CarbonInput>({
    electricity_kwh: 0,
    water_l: 0,
    transport_km: 0,
  });

  const [sources, setSources] = useState<TraceableSource>({
    electricity: '',
    water: '',
    transport: '',
  });

  const [ocrStatus, setOcrStatus] = useState<Record<string, string>>({});
  const [processingField, setProcessingField] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hashLock, setHashLock] = useState<string | null>(null);

  // 🟠 Transparent Formula (ISO-14064-1 Ref)
  const COEFF_ELEC = 0.495; // kgCO2e/kWh
  const COEFF_WATER = 0.00015; // kgCO2e/L
  const COEFF_TRANS = 0.082; // kgCO2e/km (Air Freight avg)

  // 🌟 Awakening OmniLabels (Permanent Sync)
  const awakenedLabels = useRef({
    electricity: OmniEsgManager.awakenOmniLabel(OmniLabelFactory.esgMetric('E')),
    water: OmniEsgManager.awakenOmniLabel(OmniLabelFactory.esgMetric('E')),
    transport: OmniEsgManager.awakenOmniLabel(OmniLabelFactory.esgMetric('G')), // Governance/Supply Chain
  }).current;

  // 📝 Omni-Log Integration
  // 📝 Omni-Log Integration
  const logToOmni = (msg: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') => {
    omniLogger.info(LogCategory.SYSTEM, `[MentorPortal] ${msg}`, {
      level,
      timestamp: Date.now(),
      context: { component: 'MentorDemoPortal', protocol: '5T' },
    });
  };

  // 🟢 Real OCR Handler & Forensic Analyzer
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof CarbonInput
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingField(type);
    setOcrStatus(prev => ({ ...prev, [type]: 'Initializing Analysis...' }));
    logToOmni(`Starting Forensic OCR for ${type}: ${file.name}`);

    try {
      const sourceType =
        type === 'electricity_kwh' ? 'electricity' : type === 'water_l' ? 'water' : 'transport';

      let text = '';
      let snippetImage = '';

      // 1. Image/PDF Extraction
      if (file.type === 'application/pdf') {
        setOcrStatus(prev => ({ ...prev, [type]: 'Parsing PDF Structure...' }));
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport } as any).promise;
          snippetImage = canvas.toDataURL('image/png');
          setOcrStatus(prev => ({ ...prev, [type]: 'Recognizing Text...' }));
          const { data } = await Tesseract.recognize(snippetImage, 'eng+chi_tra');
          text = data.text;
        }
      } else {
        setOcrStatus(prev => ({ ...prev, [type]: 'Scanning Image...' }));
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise(resolve => (reader.onload = resolve));
        snippetImage = reader.result as string;
        const { data } = await Tesseract.recognize(file, 'eng+chi_tra');
        text = data.text;
      }

      setOcrStatus(prev => ({ ...prev, [type]: 'Analyzing Integrity...' }));

      // 🕵️ Forensic Scoring Logic
      let confidenceScore = 0;
      const integrityFlags: string[] = [];
      const detectedKeywords: string[] = [];

      // A. Keyword Check
      const BILL_KEYWORDS = [
        'Bill',
        'Invoice',
        'Statement',
        'Period',
        'Meter',
        'Reading',
        'Consumption',
        'Total',
        'Tax',
        'VAT',
        'Amount',
        'Due',
        '電費',
        '收據',
        '繳費',
        '度數',
        '經常',
        '流動',
        '本期',
        '台電',
        '水費',
        '費率',
        '單價',
        '金額',
        '合計',
      ];

      BILL_KEYWORDS.forEach(kw => {
        if (new RegExp(kw, 'i').test(text)) {
          confidenceScore += 10;
          detectedKeywords.push(kw);
        }
      });
      if (confidenceScore > 60) confidenceScore = 60; // Cap keyword score

      // B. Context Check (Number close to Unit)
      const lines = text.split('\n');
      let extractedValue = 0;
      let matchedLine = '';

      let typeKeywords: RegExp[] = [];
      if (type === 'electricity_kwh') typeKeywords = [/kWh/i, /度/];
      else if (type === 'water_l') typeKeywords = [/L/i, /m3/i, /度/, /Water/i];
      else typeKeywords = [/km/i, /Distance/i, /Logistics/i];

      // Find best line match
      const targetLine = lines.find(
        line => typeKeywords.some(kw => kw.test(line)) && /\d/.test(line)
      );

      if (targetLine) {
        confidenceScore += 30; // High bonus for context match
        const nums = targetLine.match(/\d+[.,]?\d*/g);
        if (nums) {
          const val = parseFloat(nums[0].replace(/,/g, ''));
          if (val > 0) {
            extractedValue = val;
            matchedLine = targetLine.trim();
          }
        }
      }

      // Fallback extraction
      if (extractedValue === 0) {
        const allNums = text.match(/\d+[.,]?\d*/g)?.map(n => parseFloat(n.replace(/,/g, ''))) || [];
        if (allNums.length > 0) {
          extractedValue = allNums.find(n => n > 100 && n < 100000) || 0;
          matchedLine = `(Auto-detected best match): ... ${extractedValue} ...`;
        }
      }

      // C. Integrity Penalties
      if (detectedKeywords.length < 2) {
        integrityFlags.push('Low Keyword Density');
        confidenceScore -= 20;
      }

      confidenceScore = Math.max(0, Math.min(100, confidenceScore));

      setInputs(prev => ({ ...prev, [type]: extractedValue }));
      setSources(prev => ({
        ...prev,
        [sourceType]: file.name,
        [`${sourceType}_snippet`]: {
          text: matchedLine || 'No explicit metric-keyword correlation found.',
          imageUrl: snippetImage,
          integrity: {
            score: confidenceScore,
            flags: integrityFlags,
            keywords: detectedKeywords.slice(0, 5),
          },
        },
      }));

      const verifiedStatus = confidenceScore < 50 ? 'Low Trust' : 'Verified';
      setOcrStatus(prev => ({ ...prev, [type]: verifiedStatus }));
      logToOmni(`Forensic Result for ${type}: Score=${confidenceScore}%, Val=${extractedValue}`);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[MentorDemoPortal] Error', { error });
      setOcrStatus(prev => ({ ...prev, [type]: 'Failed' }));
      logToOmni(`OCR Failed for ${type}`, 'ERROR');
    } finally {
      setProcessingField(null);
    }
  };

  const calculateImpact = async () => {
    setIsCalculating(true);
    logToOmni('Initiating 5T Verification Process...');

    await new Promise(r => setTimeout(r, 600));
    logToOmni('Hook: Raw Data Ingested (Status: Received)');

    await new Promise(r => setTimeout(r, 600));
    logToOmni('Hook: 5T Validation Check (Status: Valid)');

    const carbonTotal =
      inputs.electricity_kwh * COEFF_ELEC +
      inputs.water_l * COEFF_WATER +
      inputs.transport_km * COEFF_TRANS;

    const evidencePayload = {
      timestamp: Date.now(),
      protocol: '5T-v1.0',
      inputs,
      sources,
      result: carbonTotal.toFixed(4),
    };

    const mockHash =
      '0x' +
      Array.from(JSON.stringify(evidencePayload))
        .reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0)
        .toString(16) +
      'f83a91...';

    setResult(evidencePayload);
    setHashLock(mockHash);
    setIsCalculating(false);
    setStep(2);
    logToOmni(`Target Locked (Trustworthy). Hash: ${mockHash}`);
  };

  // 🧬 High-Density Antigravity Input Module
  const AntigravityInputModule = ({
    label,
    icon: Icon,
    type,
    value,
    status,
    sourceSnippet,
    omniLabel,
  }: any) => {
    const isProcessing = processingField === type;
    const isVerified = status && status.includes('Verified');
    const isWarning = status && status.includes('Low Trust');
    const isAwakened = omniLabel?.awakeningState === 'awakened';

    return (
      <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-[#0abab5]/30">
        {/* Holographic Gradient Overlay */}
        <div className="absolute inset-0 bg-[#0abab5]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Header: High Density Data Strip */}
        <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#0abab5]" />
            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase font-mono">
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAwakened && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400">
                <Network className="w-3 h-3 animate-pulse" />
                <span className="text-[9px] font-mono tracking-wider">SYNC</span>
              </div>
            )}
            {isVerified && <Badge type="success">Verified</Badge>}
            {isWarning && <Badge type="warning">Review</Badge>}
            {!status && <Badge type="neutral">Idle</Badge>}
          </div>
        </div>

        {/* Core: Interactive Zone */}
        <div className="p-3 grid grid-cols-12 gap-3 items-stretch">
          {/* A. Drop Zone (Compact) */}
          <div
            className={`col-span-4 relative border border-dashed rounded-lg transition-all flex flex-col items-center justify-center p-2 cursor-pointer
                    ${isProcessing ? 'border-[#0abab5] bg-[#0abab5]/10' : 'border-slate-700 hover:border-[#0abab5] hover:bg-slate-800'}
                `}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              onChange={e => handleFileUpload(e, type as keyof CarbonInput)}
              disabled={!!processingField}
            />
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-[#0abab5] animate-spin" />
            ) : sources[
              type === 'electricity_kwh'
                ? 'electricity'
                : type === 'water_l'
                  ? 'water'
                  : 'transport'
            ] ? (
              <CheckCircle2 className="w-5 h-5 text-[#0abab5]" />
            ) : (
              <UploadCloud className="w-5 h-5 text-slate-500 group-hover:text-[#0abab5]" />
            )}
            <span className="text-[9px] text-slate-500 mt-1 font-mono uppercase">
              {sources[
                type === 'electricity_kwh'
                  ? 'electricity'
                  : type === 'water_l'
                    ? 'water'
                    : 'transport'
              ]
                ? 'Updated'
                : 'Upload'}
            </span>
          </div>

          {/* B. Value Display (Digital) */}
          <div className="col-span-8 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-slate-500 font-mono uppercase">Captured Metric</span>
              <span className="text-[9px] text-[#0abab5] font-mono">
                {type === 'transport_km' ? 'KM' : type === 'water_l' ? 'L' : 'kWh'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={e => setInputs({ ...inputs, [type]: Number(e.target.value) })}
                className="w-full bg-black/50 border border-slate-700 rounded-lg px-2 py-1.5 text-lg font-mono text-white text-right focus:border-[#0abab5] transition-colors"
              />
              {/* Glow effect for value */}
              {value > 0 && (
                <div className="absolute inset-0 shadow-[0_0_15px_rgba(10,186,181,0.2)] pointer-events-none rounded-lg" />
              )}
            </div>
          </div>

          {/* C. Forensic Snippet (Collapsible/Dense) */}
          <div className="col-span-12">
            {sourceSnippet?.text ? (
              <div className="flex gap-2 bg-black/60 rounded border border-slate-800 p-2 relative overflow-hidden">
                {/* Scan line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0abab5]/10 to-transparent w-[200%] animate-[shimmer_2s_infinite] pointer-events-none" />

                {sourceSnippet.imageUrl && (
                  <div className="w-8 h-8 rounded bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-700 relative">
                    <img
                      src={sourceSnippet.imageUrl}
                      className="w-full h-full object-cover opacity-80"
                      alt="Evidence"
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-1 ${sourceSnippet.integrity.score > 50 ? 'bg-[#0abab5]' : 'bg-red-500'}`}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#0abab5] font-bold uppercase">
                      FORENSIC MATCH
                    </span>
                    <span
                      className={`text-[9px] font-mono ${sourceSnippet.integrity.score > 50 ? 'text-[#0abab5]' : 'text-red-400'}`}
                    >
                      TRUST: {sourceSnippet.integrity.score}%
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono italic truncate">
                    "{sourceSnippet.text}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[40px] border border-dashed border-slate-800 rounded bg-black/20 flex items-center justify-center">
                <span className="text-[9px] text-slate-600 font-mono uppercase">
                  Waiting for signal...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 📘 Service Guide Module (Instructional Layer)
  const ServiceGuideModule = () => (
    <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#0abab5]" />
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Scan className="w-5 h-5 text-[#0abab5]" />
        服務流程導引{' '}
        <span className="text-xs text-slate-500 font-mono font-normal uppercase tracking-wider">
          Service Workflow Guide
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            id: '01',
            title: '上傳佐證 (Upload)',
            desc: '上傳水電單/物流單據，系統支援 PDF 與 圖片格式。',
            icon: UploadCloud,
          },
          {
            id: '02',
            title: '智能鑑識 (Forensic)',
            desc: 'AI 自動掃描單據真偽，確認關鍵字與數值的一致性。',
            icon: Search,
          },
          {
            id: '03',
            title: '5T 驗證 (Verify)',
            desc: '執行 ISO-14064-1 透明運算，並鎖定雜湊值 (Hash)。',
            icon: ShieldCheck,
          },
          {
            id: '04',
            title: '生成證書 (Certify)',
            desc: '獲得不可篡改的數位足跡證書，存入奧秘筆記。',
            icon: FileJson,
          },
        ].map((step, idx) => (
          <div
            key={step.id}
            className="relative group p-4 bg-black/40 rounded-xl border border-white/5 hover:border-[#0abab5]/30 transition-all"
          >
            <div className="absolute -top-3 -right-3 text-[40px] font-black text-white/5 group-hover:text-[#0abab5]/10 font-mono transition-colors">
              {step.id}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <step.icon className="w-5 h-5 text-[#0abab5]" />
              <h3 className="font-bold text-slate-200 text-sm">{step.title}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            {idx < 3 && (
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-4 h-4 text-slate-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const Badge = ({
    children,
    type,
  }: {
    children: React.ReactNode;
    type: 'success' | 'warning' | 'neutral';
  }) => {
    const colors = {
      success: 'bg-[#0abab5]/10 text-[#0abab5] border-[#0abab5]/20',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return (
      <span
        className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wide ${colors[type]}`}
      >
        {children}
      </span>
    );
  };

  const FloatingSideRail = () => {
    const [activeSection, setActiveSection] = useState('Core');

    return (
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4">
        <div className="p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {[
            { icon: LayoutDashboard, label: 'Core', id: 'Core' },
            { icon: Activity, label: 'Live', id: 'Live' },
            { icon: ShieldCheck, label: 'Trust', id: 'Trust' },
            { icon: Database, label: 'Vault', id: 'Vault' },
            { icon: Settings, label: 'Config', id: 'Config' },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group relative p-3 rounded-xl transition-all cursor-pointer duration-300
                                ${activeSection === item.id
                  ? 'bg-[#0abab5] text-black shadow-[0_0_20px_rgba(10,186,181,0.5)] scale-110'
                  : 'hover:bg-white/5 text-slate-500 hover:text-[#0abab5] hover:scale-105'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {/* Tooltip */}
              <div className="absolute left-[calc(100%+15px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/90 border border-white/10 rounded-lg text-[10px] text-[#0abab5] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none uppercase tracking-widest font-mono shadow-xl z-50">
                {item.label}
                {activeSection === item.id && <span className="text-white ml-2 opacity-50">●</span>}
              </div>
            </div>
          ))}
        </div>
        {/* Decorative Rail Line */}
        <div className="w-[1px] h-32 bg-gradient-to-b from-[#0abab5]/0 via-[#0abab5]/50 to-[#0abab5]/0 mx-auto rounded-full opacity-50" />
      </div>
    );
  };

  const FloatingTopNav = () => (
    <div className="fixed top-6 inset-x-6 z-[60] flex items-center justify-between pointer-events-none">
      {/* Pointer events auto for children */}

      {/* Breadcrumb / Path */}
      <div className="pointer-events-auto flex items-center gap-4 bg-black/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl transition-all hover:border-[#0abab5]/30 group">
        <div className="flex items-center gap-2 text-[#0abab5]">
          <Hexagon className="w-5 h-5 fill-[#0abab5]/20 animate-spin-slow group-hover:text-white transition-colors" />
          <span className="text-xs font-black tracking-widest uppercase font-mono group-hover:text-white transition-colors">
            Antigravity OS
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono uppercase tracking-wider">
          <span className="hover:text-[#0abab5] transition-colors cursor-pointer">Network</span>
          <ArrowRight className="w-3 h-3 opacity-30" />
          <span className="hover:text-[#0abab5] transition-colors cursor-pointer">SupplyChain</span>
          <ArrowRight className="w-3 h-3 opacity-30" />
          <span className="text-white font-bold bg-[#0abab5]/10 px-2 py-0.5 rounded border border-[#0abab5]/20">
            Footprint_v7
          </span>
        </div>
      </div>

      {/* Center: Essential Status */}
      <div className="hidden lg:flex pointer-events-auto items-center gap-8 bg-black/60 backdrop-blur-md border border-white/5 px-8 py-3 rounded-full shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0abab5] animate-pulse shadow-[0_0_10px_#0abab5]" />
          <span className="text-[10px] font-bold text-[#0abab5] uppercase tracking-tighter font-mono">
            Verified Connection
          </span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-400 uppercase font-mono font-medium">
            Latency:
          </span>
          <span className="text-[10px] text-white font-mono font-bold">14ms</span>
        </div>
      </div>

      {/* Right: User & Protocol */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-2xl shadow-2xl hover:border-[#0abab5]/30 transition-all cursor-pointer">
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-[#0abab5] font-mono uppercase tracking-wider">
              Auth Architect
            </span>
            <span className="text-sm font-black text-white tracking-tight">DingJun</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0abab5] to-[#098b88] flex items-center justify-center shadow-[0_0_20px_rgba(10,186,181,0.4)] border border-white/20">
            <UserCircle2 className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-slate-200 p-6 pt-36 pb-24 pl-28 font-sans selection:bg-[#0abab5]/30 overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(10,186,181,0.05),transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 grid-lines opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <FloatingTopNav />
      <FloatingSideRail />

      <div className="max-w-[1600px] mx-auto relative z-10 transition-all duration-700">
        {/* Antigravity Header (Refined for context) */}
        <header className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#0abab5]/60 mb-1">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase">
              Session ID: ANT-7026-X
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-4">
            <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              綠色供應鏈
            </span>
            <div className="flex items-center gap-4">
              <span className="text-slate-800 hidden lg:block">/</span>
              <span className="text-[#0abab5]">數位足跡</span>
              <span className="text-xl text-slate-600 font-medium tracking-normal mt-1">
                Digital Footprint Protocol
              </span>
            </div>
          </h1>
        </header>

        {/* 📘 Service Workflow Guide */}
        <ServiceGuideModule />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-320px)]">
          {/* LEFT: Data Ingestion Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Status Bar */}
            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center">
              <Activity className="w-5 h-5 text-[#0abab5]" />
              <div className="h-8 w-[1px] bg-white/10" />
              {[
                { label: '可感知 (Tangible)', icon: CheckCircle2, active: true },
                { label: '可溯源 (Traceable)', icon: Search, active: true },
                { label: '可追蹤 (Trackable)', icon: ArrowRight, active: true },
                { label: '可透明驗算 (Transparent)', icon: FileJson, active: true },
                { label: '不可篡改 (Trustworthy)', icon: Lock, active: step === 2 },
              ].map((t, i) => (
                <div
                  key={t.label}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${t.active ? 'bg-[#0abab5]/10 text-[#0abab5] border border-[#0abab5]/20' : 'bg-black/20 text-slate-600 border border-transparent'}`}
                >
                  <t.icon className="w-3 h-3" />
                  {t.label}
                </div>
              ))}
            </div>

            {/* Input Grid (Dense) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AntigravityInputModule
                label="製造用電 (Manufacturing Power)"
                icon={Leaf}
                type="electricity_kwh"
                value={inputs.electricity_kwh}
                status={ocrStatus['electricity_kwh']}
                sourceSnippet={sources.electricity_snippet}
                omniLabel={awakenedLabels.electricity}
              />
              <AntigravityInputModule
                label="工業用水 (Process Water)"
                icon={Droplets}
                type="water_l"
                value={inputs.water_l}
                status={ocrStatus['water_l']}
                sourceSnippet={sources.water_snippet}
                omniLabel={awakenedLabels.water}
              />
              <AntigravityInputModule
                label="跨國物流 (Global Logistics)"
                icon={Truck}
                type="transport_km"
                value={inputs.transport_km}
                status={ocrStatus['transport_km']}
                sourceSnippet={sources.transport_snippet}
                omniLabel={awakenedLabels.transport}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Save Draft Button */}
              <button
                onClick={() => logToOmni('Draft Saved locally (Simulated)')}
                disabled={isCalculating || step === 2}
                className="w-full py-6 bg-transparent border border-[#0abab5]/30 hover:bg-[#0abab5]/10 text-[#0abab5] font-bold text-lg rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                <StickyNote className="w-5 h-5" />
                <span>存成草稿 (SAVE DRAFT)</span>
              </button>

              {/* Confirm & Submit Button */}
              <button
                onClick={calculateImpact}
                disabled={isCalculating || step === 2}
                className="w-full py-6 bg-[#0abab5] hover:brightness-110 text-black font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(10,186,181,0.3)] hover:shadow-[0_0_60px_rgba(10,186,181,0.5)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] w-[200%] animate-[shimmer_3s_infinite]" />
                {isCalculating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>運算中 (PROCESSING)...</span>
                  </>
                ) : step === 2 ? (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    <span>已鎖定 (LOCKED)</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-6 h-6" />
                    <span>確認送出 (CONFIRM)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Live Feed & Console */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            {/* A. Live Formula (Transparent) */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                  <FileJson className="w-4 h-4" /> 即時驗算{' '}
                  <span className="text-[9px] font-mono text-slate-600">Live Calculation</span>
                </span>
                <span className="text-[9px] font-mono text-[#0abab5]">ISO-14064-1</span>
              </div>
              <div className="font-mono text-xs text-slate-500 space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>用電 (ELEC)</span>
                  <span className="text-[#0abab5]">
                    {inputs.electricity_kwh || 0} * {COEFF_ELEC}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>用水 (WATER)</span>
                  <span className="text-[#0abab5]">
                    {inputs.water_l || 0} * {COEFF_WATER}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>物流 (LOGISTICS)</span>
                  <span className="text-[#0abab5]">
                    {inputs.transport_km || 0} * {COEFF_TRANS}
                  </span>
                </div>
              </div>

              {/* Result Display */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  預估碳衝擊 (Estimated Impact)
                </div>
                <div className="text-4xl font-black text-white tracking-tighter">
                  {result?.result || '0.0000'} <span className="text-lg text-[#0abab5]">kg</span>
                </div>
              </div>
            </div>

            {/* B. Omni-Notes (The Black Box) */}
            <div className="flex-1 bg-black rounded-2xl border border-white/10 p-4 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#0abab5]" />

              <div className="flex items-center gap-2 mb-4">
                <StickyNote className="w-4 h-4 text-[#0abab5]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  奧秘筆記串流 (Omni-Notes Stream)
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px]">
                {/* Initial Log */}
                <div className="flex gap-2 opacity-50">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-slate-400">System Initialized. User: DingJun</span>
                </div>

                {/* OCR Logs */}
                {Object.entries(ocrStatus).map(([key, status], i) => (
                  <div
                    key={i}
                    className="flex gap-2 animate-in slide-in-from-left-2 fade-in duration-300"
                  >
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span
                      className={
                        status.includes('Failed') || status.includes('Low')
                          ? 'text-red-400'
                          : 'text-[#0abab5]'
                      }
                    >
                      {(key.split('_')[0] || '').toUpperCase()} :: {status}
                    </span>
                  </div>
                ))}

                {step === 2 && (
                  <div className="p-3 bg-[#0abab5]/10 border border-[#0abab5]/20 rounded mt-2">
                    <div className="text-[#0abab5] font-bold mb-1">HASH GENERATED (雜湊生成)</div>
                    <div className="break-all text-[#0abab5] opacity-75">{hashLock}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDemoPortal;
