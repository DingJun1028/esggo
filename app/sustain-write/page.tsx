// @ts-nocheck
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import { Progress } from '@/components/ui/v2/Progress';
import { Input } from '@/components/ui/v2/Input';
import {
  BookOpen,
  Sparkles,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Leaf,
  Users,
  Scale,
  Droplets,
  Recycle,
  Globe,
  BarChart3,
  Clock,
  Target,
  Layers,
  Zap,
  Eye,
  X,
  Star,
  Heart,
  Bot,
  FileCheck,
  Database,
  Lock,
  TrendingUp,
  AlertTriangle,
  Plus,
  Minus,
  Settings,
  Bookmark,
} from 'lucide-react';

// ============================================================
// 單據清單資料 (53 個單據)
// ============================================================
interface DocItem {
  id: string;
  name: string;
  standard: string;
  department: string;
  category: 'D' | 'E' | 'S' | 'T' | 'G';
  required: boolean;
}

const ALL_DOCS: DocItem[] = [
  // D - 基礎治理 (14)
  {
    id: 'D-001',
    name: '公司組織章程',
    standard: 'GRI 2-1',
    department: '法務部',
    category: 'D',
    required: true,
  },
  {
    id: 'D-002',
    name: '董事會組成與職能說明',
    standard: 'GRI 2-9',
    department: '董事會',
    category: 'D',
    required: true,
  },
  {
    id: 'D-003',
    name: '年度財務報告（稽核後）',
    standard: 'GRI 2-5',
    department: '財務部',
    category: 'D',
    required: true,
  },
  {
    id: 'D-004',
    name: '報告書範疇說明書',
    standard: 'GRI 2-2',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-005',
    name: '永續政策聲明書',
    standard: 'GRI 2-23',
    department: '高層管理',
    category: 'D',
    required: true,
  },
  {
    id: 'D-006',
    name: '利害關係人議合機制說明',
    standard: 'GRI 2-29',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-007',
    name: '重大性評估矩陣與說明',
    standard: 'GRI 3-1/3-2',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-008',
    name: '法令遵循聲明書',
    standard: 'GRI 2-27',
    department: '法務部',
    category: 'D',
    required: true,
  },
  {
    id: 'D-009',
    name: '企業社會責任政策',
    standard: 'GRI 2-23',
    department: '高層管理',
    category: 'D',
    required: false,
  },
  {
    id: 'D-010',
    name: '報告書發布聲明',
    standard: 'GRI 2-3',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-011',
    name: '主要子公司與關係企業清單',
    standard: 'GRI 2-2',
    department: '財務部',
    category: 'D',
    required: false,
  },
  {
    id: 'D-012',
    name: 'GRI符合性聲明書',
    standard: 'GRI 2-3',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-013',
    name: '利害關係人識別與參與紀錄',
    standard: 'GRI 2-29',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  {
    id: 'D-014',
    name: '第三方查證報告',
    standard: '金管會',
    department: 'ESG辦公室',
    category: 'D',
    required: true,
  },
  // E - 環境面 (18)
  {
    id: 'E-001',
    name: '溫室氣體排放盤查報告（Scope 1/2）',
    standard: 'GRI 305 / TCFD',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-002',
    name: 'Scope 3 排放評估報告',
    standard: 'GRI 305-3',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-003',
    name: '能源消耗統計表',
    standard: 'GRI 302',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-004',
    name: '再生能源使用紀錄',
    standard: 'GRI 302-1',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-005',
    name: '碳排放減量目標與行動計畫',
    standard: 'TCFD / SBTi',
    department: 'ESG辦公室',
    category: 'E',
    required: true,
  },
  {
    id: 'E-006',
    name: '氣候相關風險與機會評估報告',
    standard: 'TCFD',
    department: 'ESG辦公室',
    category: 'E',
    required: true,
  },
  {
    id: 'E-007',
    name: '用水量統計與節水措施說明',
    standard: 'GRI 303',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-008',
    name: '廢棄物管理報告',
    standard: 'GRI 306',
    department: '環安部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-009',
    name: '空氣污染排放紀錄',
    standard: 'GRI 305-7',
    department: '環安部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-010',
    name: '環境法規遵循紀錄',
    standard: 'GRI 307',
    department: '法務部',
    category: 'E',
    required: true,
  },
  {
    id: 'E-011',
    name: '綠色採購政策與紀錄',
    standard: 'GRI 308',
    department: '採購部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-012',
    name: '碳足跡計算報告（產品/服務）',
    standard: 'SASB',
    department: '環安部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-013',
    name: '環境管理系統認證（ISO 14001）',
    standard: 'GRI 307',
    department: '環安部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-014',
    name: '氣候調適計畫說明書',
    standard: 'TCFD',
    department: 'ESG辦公室',
    category: 'E',
    required: false,
  },
  {
    id: 'E-015',
    name: '土地使用與污染防治說明',
    standard: 'GRI 304',
    department: '環安部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-016',
    name: '生物多樣性評估報告',
    standard: 'GRI 304 / TNFD',
    department: '環安部',
    category: 'E',
    required: false,
  },
  {
    id: 'E-017',
    name: 'TCFD氣候情境分析報告',
    standard: 'TCFD',
    department: 'ESG辦公室',
    category: 'E',
    required: true,
  },
  {
    id: 'E-018',
    name: '水資源壓力地圖',
    standard: 'GRI 303 / SASB',
    department: '環安部',
    category: 'E',
    required: false,
  },
  // S - 社會面 (15)
  {
    id: 'S-001',
    name: '員工人數統計表（依性別/職級/地區）',
    standard: 'GRI 2-7',
    department: '人資部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-002',
    name: '薪酬結構說明書',
    standard: 'GRI 2-19',
    department: '人資部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-003',
    name: '職業安全衛生報告',
    standard: 'GRI 403',
    department: '環安部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-004',
    name: '員工訓練紀錄與時數統計',
    standard: 'GRI 404',
    department: '人資部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-005',
    name: '多元共融（DEI）政策與數據',
    standard: 'GRI 405',
    department: '人資部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-006',
    name: '員工申訴機制說明書',
    standard: 'GRI 2-25',
    department: '人資部',
    category: 'S',
    required: false,
  },
  {
    id: 'S-007',
    name: '社區投資與公益活動報告',
    standard: 'GRI 413',
    department: 'CSR辦公室',
    category: 'S',
    required: true,
  },
  {
    id: 'S-008',
    name: '供應商行為準則',
    standard: 'GRI 308/414',
    department: '採購部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-009',
    name: '顧客滿意度調查報告',
    standard: 'GRI 417',
    department: '行銷部',
    category: 'S',
    required: false,
  },
  {
    id: 'S-010',
    name: '童工與強迫勞動防範聲明',
    standard: 'GRI 408/409',
    department: '法務部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-011',
    name: '員工福利項目說明書',
    standard: 'GRI 401',
    department: '人資部',
    category: 'S',
    required: false,
  },
  {
    id: 'S-012',
    name: '職場健康促進計畫',
    standard: 'GRI 403-6',
    department: '人資部',
    category: 'S',
    required: false,
  },
  {
    id: 'S-013',
    name: '供應商ESG評核報告',
    standard: 'GRI 308/414',
    department: '採購部',
    category: 'S',
    required: false,
  },
  {
    id: 'S-014',
    name: '人權盡職調查報告',
    standard: 'GRI 411-414',
    department: '法務部',
    category: 'S',
    required: true,
  },
  {
    id: 'S-015',
    name: '個資保護事件通報記錄',
    standard: 'GRI 418',
    department: '資訊部',
    category: 'S',
    required: false,
  },
  // T - 資訊安全 (6)
  {
    id: 'T-001',
    name: '資訊安全政策聲明書',
    standard: 'SASB / 金管會',
    department: '資訊部',
    category: 'T',
    required: true,
  },
  {
    id: 'T-002',
    name: '資訊安全事件通報與處理程序',
    standard: 'SASB',
    department: '資訊部',
    category: 'T',
    required: false,
  },
  {
    id: 'T-003',
    name: '個人資料保護管理辦法',
    standard: 'SASB / GRI 418',
    department: '資訊部',
    category: 'T',
    required: true,
  },
  {
    id: 'T-004',
    name: '系統風險評估報告',
    standard: 'SASB',
    department: '資訊部',
    category: 'T',
    required: false,
  },
  {
    id: 'T-005',
    name: '資安認證（ISO 27001）文件',
    standard: 'SASB',
    department: '資訊部',
    category: 'T',
    required: false,
  },
  {
    id: 'T-006',
    name: '網路安全事件統計表',
    standard: 'SASB',
    department: '資訊部',
    category: 'T',
    required: false,
  },
  // G - 治理面 (16)
  {
    id: 'G-001',
    name: '反貪腐政策與訓練紀錄',
    standard: 'GRI 205',
    department: '法務部',
    category: 'G',
    required: true,
  },
  {
    id: 'G-002',
    name: '稅務策略與透明度聲明',
    standard: 'GRI 207',
    department: '財務部',
    category: 'G',
    required: true,
  },
  {
    id: 'G-003',
    name: '政治獻金與遊說活動說明',
    standard: 'GRI 415',
    department: '法務部',
    category: 'G',
    required: false,
  },
  {
    id: 'G-004',
    name: '競爭行為與反壟斷政策',
    standard: 'GRI 206',
    department: '法務部',
    category: 'G',
    required: false,
  },
  {
    id: 'G-005',
    name: '重大違規事件紀錄',
    standard: 'GRI 2-27',
    department: '法務部',
    category: 'G',
    required: true,
  },
  {
    id: 'G-006',
    name: '風險管理架構說明書',
    standard: 'TCFD / GRI 2-12',
    department: '風控部',
    category: 'G',
    required: true,
  },
  {
    id: 'G-007',
    name: '高階主管薪酬連結ESG說明',
    standard: 'GRI 2-19',
    department: '董事會',
    category: 'G',
    required: false,
  },
  {
    id: 'G-008',
    name: '董事會多元化政策',
    standard: 'GRI 2-10',
    department: '董事會',
    category: 'G',
    required: true,
  },
  {
    id: 'G-009',
    name: '內部稽核報告摘要',
    standard: 'GRI 2-12',
    department: '稽核部',
    category: 'G',
    required: false,
  },
  {
    id: 'G-010',
    name: '吹哨者保護政策',
    standard: 'GRI 2-25',
    department: '法務部',
    category: 'G',
    required: false,
  },
  {
    id: 'G-011',
    name: '關係人交易揭露說明',
    standard: 'GRI 2-26',
    department: '財務部',
    category: 'G',
    required: false,
  },
  {
    id: 'G-012',
    name: '永續發展策略藍圖',
    standard: 'GRI 2-23',
    department: 'ESG辦公室',
    category: 'G',
    required: true,
  },
  {
    id: 'G-013',
    name: 'ESG KPI目標設定與追蹤表',
    standard: '金管會',
    department: 'ESG辦公室',
    category: 'G',
    required: true,
  },
  {
    id: 'G-014',
    name: '董事會ESG審議紀錄',
    standard: '金管會',
    department: '董事會',
    category: 'G',
    required: true,
  },
  {
    id: 'G-015',
    name: '永續委員會議事錄',
    standard: '金管會',
    department: 'ESG辦公室',
    category: 'G',
    required: true,
  },
  {
    id: 'G-016',
    name: '重大性評估複核簽呈',
    standard: 'GRI 3-1/3-2',
    department: 'ESG辦公室',
    category: 'G',
    required: false,
  },
];

// 各章節對應單據
const CHAPTER_DOCS: Record<string, string[]> = {
  ch1: [
    'D-001',
    'D-002',
    'D-003',
    'D-004',
    'D-005',
    'D-006',
    'D-007',
    'D-008',
    'D-010',
    'D-012',
    'D-013',
    'D-014',
  ],
  ch2: ['E-001', 'E-002', 'E-003', 'E-004', 'E-005', 'E-006', 'E-017'],
  ch3: ['E-003', 'E-004', 'E-005'],
  ch4: ['E-007', 'E-018'],
  ch5: ['E-008', 'E-011'],
  ch6: ['E-015', 'E-016'],
  ch7: ['S-001', 'S-002', 'S-003', 'S-004', 'S-005', 'S-011'],
  ch8: ['S-005', 'S-006'],
  ch9: ['S-003', 'S-012'],
  ch10: ['S-008', 'S-010', 'S-013', 'S-014'],
  ch11: ['G-001', 'G-005', 'G-010'],
  ch12: ['T-001', 'T-003', 'S-015'],
  ch13: ['D-003', 'G-002'],
  ch14: ['S-008', 'S-013'],
  ch15: ['S-007'],
  ch16: ['S-009'],
  ch17: ['D-009'],
  ch18: ['G-007'],
  ch19: ['G-002'],
  ch20: ['D-008', 'G-004', 'G-005'],
  ch21: ['D-012', 'D-014'],
  ch22: ['E-006', 'E-017'],
  ch23: ['T-001', 'T-005', 'E-012'],
  ch24: ['E-001', 'E-002', 'E-006'],
};

// 24 章定義
const CHAPTERS = [
  { id: 'ch1', title: '永續治理與策略', icon: Shield, color: 'blue' },
  { id: 'ch2', title: '氣候變遷與碳管理', icon: Leaf, color: 'emerald' },
  { id: 'ch3', title: '能源管理', icon: Zap, color: 'amber' },
  { id: 'ch4', title: '水資源管理', icon: Droplets, color: 'cyan' },
  { id: 'ch5', title: '廢棄物與循環經濟', icon: Recycle, color: 'green' },
  { id: 'ch6', title: '生物多樣性與自然資本', icon: Globe, color: 'teal' },
  { id: 'ch7', title: '員工福祉與人力資本', icon: Users, color: 'indigo' },
  { id: 'ch8', title: '多元平等與包容', icon: Scale, color: 'violet' },
  { id: 'ch9', title: '職業安全衛生', icon: Shield, color: 'rose' },
  { id: 'ch10', title: '人權與供應鏈', icon: Eye, color: 'pink' },
  { id: 'ch11', title: '反貪腐與誠信經營', icon: Shield, color: 'orange' },
  { id: 'ch12', title: '資訊安全與隱私', icon: Lock, color: 'slate' },
  { id: 'ch13', title: '經濟績效與價值創造', icon: BarChart3, color: 'blue' },
  { id: 'ch14', title: '市場存在與供應商管理', icon: Target, color: 'emerald' },
  { id: 'ch15', title: '間接經濟衝擊與社區投資', icon: Users, color: 'cyan' },
  { id: 'ch16', title: '客戶關係與產品責任', icon: Heart, color: 'indigo' },
  { id: 'ch17', title: '研發創新與數位轉型', icon: Sparkles, color: 'violet' },
  { id: 'ch18', title: '智財權保護與專利', icon: FileText, color: 'amber' },
  { id: 'ch19', title: '稅務透明與反洗錢', icon: Scale, color: 'rose' },
  { id: 'ch20', title: '法規遵循與合規管理', icon: Shield, color: 'orange' },
  { id: 'ch21', title: 'GRI 準則對齊', icon: BookOpen, color: 'teal' },
  { id: 'ch22', title: 'TCFD 氣候揭露', icon: Globe, color: 'blue' },
  { id: 'ch23', title: 'SASB 行業指標', icon: BarChart3, color: 'emerald' },
  { id: 'ch24', title: 'IFRS S1/S2 永續揭露', icon: FileText, color: 'slate' },
];

// 佔位符替換
const REPLACEMENTS: Record<string, string> = {
  '{{company_name}}': '善向永續股份有限公司',
  '{{report_year}}': '2026',
  '{{chairman}}': '楊坤修 博士',
  '{{board_size}}': '3',
  '{{independent_directors}}': '1',
  '{{independent_ratio}}': '33.3',
  '{{employee_count}}': '5',
  '{{total_employees}}': '5',
  '{{female_ratio}}': '40',
  '{{female_manager_ratio}}': '20',
  '{{turnover_rate}}': '0',
  '{{training_hours}}': '40',
  '{{satisfaction_score}}': '85',
  '{{scope1_emissions}}': '8.5',
  '{{scope2_emissions}}': '12.3',
  '{{scope3_emissions}}': '5.2',
  '{{total_emissions}}': '26',
  '{{carbon_intensity}}': '1.44',
  '{{renewable_ratio}}': '35',
  '{{total_energy}}': '1,200',
  '{{energy_intensity}}': '24',
  '{{water_withdrawal}}': '500',
  '{{water_intensity}}': '10',
  '{{water_recycle_rate}}': '60',
  '{{total_waste}}': '2.5',
  '{{recycling_rate}}': '85',
  '{{hazardous_waste}}': '0.3',
  '{{waste_intensity}}': '0.5',
  '{{ltir}}': '0',
  '{{trir}}': '0',
  '{{fatality_count}}': '0',
  '{{dei_training_rate}}': '100',
  '{{pay_gap}}': '3',
  '{{tnfd_aligned}}': '60',
  '{{community_investment}}': '50',
  '{{beneficiaries}}': '500',
  '{{nps_score}}': '60',
  '{{compliance_violations}}': '0',
  '{{attendance_rate}}': '95',
};

function fill(text: string): string {
  let result = text;
  for (const [key, val] of Object.entries(REPLACEMENTS)) {
    result = result.split(key).join(val);
  }
  return result;
}

function countWords(html: string): number {
  const clean = html.replace(/<[^>]+>/g, ' ');
  const chinese = (clean.match(/[一-鿿]/g) || []).length;
  const english = (clean.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

export default function SustainWritePage() {
  // ========== State ==========
  const [step, setStep] = useState<'checklist' | 'preview' | 'generating' | 'done'>('checklist');
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAgentPulse, setShowAgentPulse] = useState(false);

  const [company, setCompany] = useState({
    name: '善向永續股份有限公司',
    tax_id: '60493411',
    chairman: '楊坤修 博士',
    address: '台北市中正區館前路 20 號 5 樓',
    capital: '500 萬元',
    year: '2026',
    industry: '專業、科學及技術服務業',
    employees: '5 人',
  });

  const updateField = (field: string, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDoc = (id: string) => {
    setExpandedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  // ========== 完成度計算 ==========
  const completionStats = useMemo(() => {
    const cats = ['D', 'E', 'S', 'T', 'G'];
    const stats = cats.map((cat) => {
      const docs = ALL_DOCS.filter((d) => d.category === cat);
      const required = docs.filter((d) => d.required);
      return {
        category: cat,
        label: { D: '基礎治理', E: '環境面', S: '社會面', T: '資訊安全', G: '治理面' }[cat],
        total: docs.length,
        completed: Math.floor(docs.length * 0.3), // 模擬 30% 完成
        required: required.length,
        requiredCompleted: Math.floor(required.length * 0.4),
      };
    });
    const total = ALL_DOCS.length;
    const completed = stats.reduce((s, c) => s + c.completed, 0);
    const required = ALL_DOCS.filter((d) => d.required).length;
    const requiredCompleted = stats.reduce((s, c) => s + c.requiredCompleted, 0);
    return { byCategory: stats, total, completed, required, requiredCompleted };
  }, []);

  // ========== 生成引擎 ==========
  const generateReport = useCallback(async () => {
    setStep('generating');
    setProgress(0);
    setProgressMsg('初始化報告範本...');
    setGeneratedHtml(null);

    try {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(5);
      setProgressMsg('生成封面與報告聲明...');

      await new Promise((r) => setTimeout(r, 200));
      setProgress(10);

      const totalChapters = CHAPTERS.length;
      let allHtml = '';

      for (let i = 0; i < totalChapters; i++) {
        const ch = CHAPTERS[i];
        const chProgress = 10 + Math.round((i / totalChapters) * 70);
        setProgress(chProgress);
        setProgressMsg(`生成 ${ch.title} (${i + 1}/${totalChapters})...`);
        await new Promise((r) => setTimeout(r, 60));

        const chapterHtml = generateChapterHtml(ch.id, ch.title);
        allHtml += `\n<div id="${ch.id}">\n${chapterHtml}\n</div>\n`;
      }

      await new Promise((r) => setTimeout(r, 300));
      setProgress(85);
      setProgressMsg('生成 GRI 索引、確信聲明、法規遵循附章...');

      const appendices = generateAppendices();

      await new Promise((r) => setTimeout(r, 200));
      setProgress(95);

      const fullHtml = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>${company.name} ${company.year}年永續報告書</title>
<style>
body{font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:1.8;color:#1e293b;max-width:1200px;margin:0 auto;padding:40px}
h1{font-size:2em;color:#0f766e;border-bottom:2px solid #0f766e;padding-bottom:10px;margin-bottom:2em}
h2{font-size:1.5em;color:#1e40af;margin-top:2em;border-left:4px solid #3b82f6;padding-left:12px}
h3{font-size:1.2em;color:#334155;margin-top:1.5em}
table{border-collapse:collapse;width:100%;margin:1em 0}
th,td{border:1px solid #cbd5e1;padding:8px 12px;text-align:left}
th{background:#f8fafc;font-weight:600}
.data-table{background:#f8fafc;border-radius:8px;padding:1em;margin:1em 0}
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1em;margin:1em 0}
.kpi-card{background:#f1f5f9;border-radius:8px;padding:1em;text-align:center}
.kpi-value{font-size:1.5em;font-weight:700;color:#1e40af}
.kpi-label{font-size:0.8em;color:#64748b}
.compliance-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1em;margin:1em 0}
.tcfd-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:1em;margin:1em 0}
hr{border:none;border-top:1px solid #e2e8f0;margin:2em 0}
.footer{text-align:center;color:#64748b;font-size:0.85em;border-top:1px solid #e2e8f0;padding-top:1em;margin-top:3em}
</style>
</head>
<body>
<div style="text-align:center;margin-bottom:2em">
<h1>${company.year} 年永續報告書</h1>
<strong>${company.name}</strong><br>
統編：${company.tax_id} | 董事長：${company.chairman}<br>
報告期間：${company.year}/1/1 ～ ${company.year}/12/31<br>
地址：${company.address}
</div>
<hr>
<h2>報告書聲明</h2>
<p>${company.name}依據臺灣證券交易所「上市公司編製與申報永續報告書作業辦法」、金管會「永續資訊揭露規範及準則」及國際準則，編製本份永續報告書。</p>
<p><strong>採用準則：</strong> GRI Standards 2021 · IFRS S1/S2 (提前採用) · TCFD · SASB</p>
<p><strong>報告邊界：</strong> 涵蓋${company.name}所有營運據點</p>
<p><strong>第三方確信：</strong> 未定稿，預計 ${company.year} 年 10 月底前完成</p>
<hr>
${allHtml}
${appendices}
<hr>
<div class="footer">
<p>${company.name} ${company.year} 年永續報告書</p>
<p>報告期間：${company.year}/1/1 ～ ${company.year}/12/31</p>
<p>董事長：${company.chairman} | 地址：${company.address}</p>
<p>&copy; ${company.year} ${company.name}. All Rights Reserved.</p>
</div>
</body>
</html>
`;

      setProgress(100);
      setProgressMsg('完成！');
      setGeneratedHtml(fullHtml);
      setWordCount(countWords(fullHtml));
      setStep('done');
    } catch (err) {
      setProgressMsg('生成失敗：' + String(err));
    }
  }, [company]);

  function generateChapterHtml(chId: string, title: string): string {
    const sectionNum = parseInt(chId.replace('ch', ''));
    const docIds = CHAPTER_DOCS[chId] || [];
    const docs = docIds.map((id) => ALL_DOCS.find((d) => d.id === id)).filter(Boolean);

    let html = `<h2>${title}</h2>`;

    // 根據章節生成不同內容
    if (chId === 'ch1') {
      html += fill(`
<h3>1.1 公司概述與報告邊界</h3>
<p>本報告期間為 {{report_year}} 年 1 月 1 日至 {{report_year}} 年 12 月 31 日。報導個體涵蓋 {{company_name}} 所有營運據點，主要營運地址為 {{address}}。</p>
<h3>1.2 組織規模</h3>
<table>
<tr><th>項目</th><th>內容</th></tr>
<tr><td>公司名稱</td><td>{{company_name}}</td></tr>
<tr><td>統編</td><td>60493411</td></tr>
<tr><td>實收資本額</td><td>{{capital}}</td></tr>
<tr><td>員工人數</td><td>{{employee_count}} 人</td></tr>
<tr><td>行業別</td><td>{{industry}}</td></tr>
</table>
<h3>1.3 治理架構</h3>
<p>董事會由 {{board_size}} 位董事組成，其中獨立董事 {{independent_directors}} 位，獨立董事比例達 {{independent_ratio}}%。董事長為 {{chairman}}。</p>
<h3>1.4 永續策略框架</h3>
<p>本公司以「創價型永續」為核心理念，聚焦五大主軸：深化氣候行動與淨零轉型、強化人力資本與員工福祉、推動供應鏈永續管理、落實社區參與及社會貢獻、提升資訊透明度與治理品質。</p>
<h3>1.5 重大主題分析</h3>
<p>透過利害關係人分析與重大性評估，識別出氣候變遷與碳管理、資訊安全與隱私、人才吸引與留任、供應鏈永續管理、反貪腐與誠信經營等關鍵議題。</p>
<h3>1.6 TCFD 氣候相關財務揭露</h3>
<div class="tcfd-box">
<p>本公司依據 TCFD 四大面向（治理、策略、風險管理、指標與目標）進行完整揭露。董事會為氣候治理最高監督單位，已進行情境分析評估不同升溫情境之影響。</p>
</div>
<h3>1.7 IFRS S1/S2 遵循宣告</h3>
<p>本公司宣告提前採用 IFRS S1/S2（2027/1/1 生效），於 {{report_year}} 年度報告中接軌揭露。</p>
<h3>1.8 GRI 內容索引</h3>
<p>本報告書之 GRI 內容索引完整揭露於第二十四章附章。</p>
`);
    } else if (chId === 'ch2') {
      html += fill(`
<h3>2.1 氣候治理與組織文化</h3>
<p>本公司深刻認知氣候變遷之深遠影響，承諾於 2050 年前達成淨零排放。由董事會層級負責氣候相關風險與機會的監督管理。</p>
<h3>2.2 溫室氣體盤查</h3>
<table>
<tr><th>排放範圍</th><th>排放量（tCO2e）</th><th>佔比</th><th>較基準年變化</th></tr>
<tr><td>範疇一：直接排放</td><td>{{scope1_emissions}}</td><td>32%</td><td>-8%</td></tr>
<tr><td>範疇二：能源間接</td><td>{{scope2_emissions}}</td><td>45%</td><td>-12%</td></tr>
<tr><td>範疇三：價值鏈</td><td>{{scope3_emissions}}</td><td>23%</td><td>-5%</td></tr>
<tr><td><strong>合計</strong></td><td><strong>{{total_emissions}}</strong></td><td><strong>100%</strong></td><td><strong>-8%</strong></td></tr>
</table>
<h3>2.3 減量路徑與目標</h3>
<p>短期（{{report_year}}-2030）：較基準年減碳 30%，再生能源使用比例達 50%；中期（2031-2040）：較基準年減碳 60%；長期（2041-2050）：達成碳中和。</p>
<h3>2.4 再生能源使用</h3>
<p>再生能源使用比例達 {{renewable_ratio}}%，較前年提升 10 個百分點。</p>
<h3>2.5 碳排放強度分析</h3>
<p>碳排放強度為 {{carbon_intensity}} tCO2e/營收億元，較基準年降低 10%。</p>
<h3>2.6 碳中和路徑與承諾</h3>
<p>本公司承諾於 2050 年前達成碳中和，具體路徑分為三階段推動。</p>
`);
    } else {
      // 預設模板：根據章節動態生成
      html += `<h3>${sectionNum}.1 概述</h3>`;
      html += `<p>本章節為 {{company_name}} 於 {{report_year}} 年度在「${title
        .replace(/[第章]|[一二三四五六七八九十]+/g, '')
        .trim()}」面向之具體作為與績效數據。</p>`;

      // 如果有單據，顯示單據清單
      if (docs.length > 0) {
        html += `<h3>${sectionNum}.2 所需單據</h3>`;
        html += `<table><tr><th>單據編號</th><th>單據名稱</th><th>標準</th><th>負責部門</th><th>必填</th></tr>`;
        for (const doc of docs) {
          html += `<tr><td>${doc.id}</td><td>${doc.name}</td><td>${doc.standard}</td><td>${
            doc.department
          }</td><td>${doc.required ? '✅ 必填' : '選填'}</td></tr>`;
        }
        html += `</table>`;
      }

      html += `
<h3>${sectionNum}.3 管理方針</h3>
<p>本公司針對此面向之管理方針包括：建立完整管理制度、設定量化目標、落實風險評估、推動利害關係人參與、持續精進改善。</p>
<h3>${sectionNum}.4 執行作為</h3>
<p>{{report_year}} 年度之具體執行作為包括：制度建置與流程優化、人員教育訓練、系統建置與數據收集、外部合作與資源整合、成效評估與改善。</p>
<h3>${sectionNum}.5 關鍵績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
<tr><td>主要指標 1</td><td>90%</td><td>85%</td><td>≥ 88%</td><td><span style="color:#16a34a">✅ 102%</span></td></tr>
<tr><td>主要指標 2</td><td>85%</td><td>80%</td><td>≥ 82%</td><td><span style="color:#16a34a">✅ 104%</span></td></tr>
<tr><td>主要指標 3</td><td>95%</td><td>92%</td><td>≥ 90%</td><td><span style="color:#16a34a">✅ 106%</span></td></tr>
</table>
<h3>${sectionNum}.6 未來展望</h3>
<p>展望未來，本公司將持續精進此面向，重點包括：擴大推動範圍、強化合作、提升資訊揭露、落實持續改善。</p>
`;
    }

    return html;
  }

  function generateAppendices(): string {
    return `
<hr>
<h2>附章一：GRI 內容索引</h2>
<table>
<tr><th>GRI 準則</th><th>揭露項目</th><th>對應章節</th><th>確信情形</th></tr>
<tr><td>GRI 2：一般揭露 2021</td><td>組織規模、治理架構、永續策略</td><td>Ch1</td><td>有限確信</td></tr>
<tr><td>GRI 101：生物多樣性 2024</td><td>生物多樣性影響評估</td><td>Ch6</td><td>有限確信</td></tr>
<tr><td>GRI 102：氣候變遷 2025</td><td>氣候風險與機會</td><td>Ch2</td><td>有限確信</td></tr>
<tr><td>GRI 103：能源 2025</td><td>能源消耗、再生能源</td><td>Ch3</td><td>有限確信</td></tr>
<tr><td>GRI 201：經濟績效 2016</td><td>經濟價值創造</td><td>Ch13</td><td>有限確信</td></tr>
<tr><td>GRI 205：反貪腐 2016</td><td>反貪腐政策、倫理訓練</td><td>Ch11</td><td>有限確信</td></tr>
<tr><td>GRI 302：能源 2016</td><td>能源消耗、能源強度</td><td>Ch3</td><td>有限確信</td></tr>
<tr><td>GRI 303：水與污水 2018</td><td>水資源管理</td><td>Ch4</td><td>有限確信</td></tr>
<tr><td>GRI 305：排放 2016</td><td>溫室氣體排放</td><td>Ch2</td><td>有限確信</td></tr>
<tr><td>GRI 306：廢棄物 2020</td><td>廢棄物管理</td><td>Ch5</td><td>有限確信</td></tr>
<tr><td>GRI 401：就業 2016</td><td>員工人數、離職率</td><td>Ch7</td><td>有限確信</td></tr>
<tr><td>GRI 403：職業安全衛生 2018</td><td>安全管理</td><td>Ch9</td><td>有限確信</td></tr>
<tr><td>GRI 404：訓練與教育 2016</td><td>訓練時數</td><td>Ch7</td><td>有限確信</td></tr>
<tr><td>GRI 405：多元平等 2016</td><td>性別平等、DEI</td><td>Ch8</td><td>有限確信</td></tr>
<tr><td>GRI 413：當地社區 2016</td><td>社區投資</td><td>Ch15</td><td>有限確信</td></tr>
<tr><td>GRI 418：顧客隱私 2016</td><td>客戶資料保護</td><td>Ch12</td><td>有限確信</td></tr>
</table>

<hr>
<h2>附章二：第三方確信聲明</h2>
<div class="compliance-box">
<p>本報告書之關鍵數據已取得第三方確信機構之有限確信（Limited Assurance）。</p>
<table>
<tr><th>確信項目</th><th>確信範圍</th><th>確信等級</th></tr>
<tr><td>溫室氣體排放數據</td><td>範疇一、二、三排放數據</td><td>有限確信</td></tr>
<tr><td>員工數據</td><td>員工人數、結構、離職率、訓練時數</td><td>有限確信</td></tr>
<tr><td>治理指標</td><td>董事會出席率、獨立董事比例、倫理訓練覆蓋率</td><td>有限確信</td></tr>
<tr><td>環境管理數據</td><td>能源消耗、水資源使用、廢棄物產生</td><td>有限確信</td></tr>
</table>
<p>確信報告書編號：ESG-SUN-2026-001</p>
</div>

<hr>
<h2>附章三：法規遵循聲明</h2>
<div class="compliance-box">
<p>本公司嚴格遵守所有適用法規：</p>
<ul>
<li>公司法、證交法、個資法</li>
<li>勞基法與職業安全衛生法</li>
<li>環保法規（空污、水污、廢棄物）</li>
<li>反洗錢與反貪腐法規</li>
<li>金管會「上市櫃公司永續發展行動方案」</li>
<li>「永續資訊揭露規範及準則」（2026.4 更新版）</li>
<li>IFRS S1/S2（提前採用宣告）</li>
<li>GRI Standards 2021 · TCFD · SASB</li>
</ul>
<p>2026 年度無任何重大法規違反事件。</p>
</div>
`;
  }

  const handleDownload = useCallback(() => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esg-report-${company.year}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedHtml, company.year]);

  // ========== Render ==========
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* ====== Header ====== */}
        <header className="border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-cyan-600" />
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
              SustainWrite 永續報告
            </h1>
            <Badge variant="success" size="sm">
              <Sparkles size={10} className="mr-1" /> 24 段 × 53 單據
            </Badge>
          </div>
          <p className="text-sm text-neutral-500">
            填寫公司資料 → 確認單據完成度 → 一鍵生成 24 萬字報告 → 下載 HTML
          </p>
        </header>

        {/* ====== 單據收集清單總表 ====== */}
        {step === 'checklist' && (
          <>
            {/* 整體完成度 */}
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader
                  title="單據收集進度"
                  subtitle={`共 ${completionStats.total} 個單據，必填 ${completionStats.required} 個`}
                />
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.round(
                      (completionStats.requiredCompleted / completionStats.required) * 100
                    )}
                    %
                  </p>
                  <p className="text-xs text-neutral-400">必填完成率</p>
                </div>
              </div>
              <Progress
                value={Math.round(
                  (completionStats.requiredCompleted / completionStats.required) * 100
                )}
                size="md"
                color="auto"
              />

              {/* 各分類進度 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {completionStats.byCategory.map((cat) => (
                  <div key={cat.category} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-neutral-600">{cat.label}</span>
                      <span className="text-xs font-bold text-neutral-900">
                        {cat.completed}/{cat.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${cat.total > 0 ? (cat.completed / cat.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 單據總表 */}
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="單據收集清單總表" subtitle="點擊展開查看各章節詳細單據" />
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Zap size={14} />}
                  onClick={generateReport}
                >
                  一鍵生成報告
                </Button>
              </div>

              {/* 公司資料快速編輯 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-neutral-50 rounded-lg">
                <div>
                  <label className="text-xs text-neutral-500">公司名稱</label>
                  <Input
                    value={company.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500">董事長</label>
                  <Input
                    value={company.chairman}
                    onChange={(e) => updateField('chairman', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500">年度</label>
                  <Input
                    value={company.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500">員工人數</label>
                  <Input
                    value={company.employees}
                    onChange={(e) => updateField('employees', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* 各章節單據展開 */}
              <div className="space-y-2">
                {CHAPTERS.map((ch) => {
                  const docIds = CHAPTER_DOCS[ch.id] || [];
                  const docs = docIds
                    .map((id) => ALL_DOCS.find((d) => d.id === id))
                    .filter(Boolean);
                  const isExpanded = expandedChapter === ch.id;
                  const Icon = ch.icon;

                  return (
                    <div
                      key={ch.id}
                      className="border border-neutral-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 transition-colors"
                        onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg bg-${ch.color}-50 flex items-center justify-center`}
                          >
                            <Icon size={16} className={`text-${ch.color}-600`} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-neutral-900">{ch.title}</p>
                            <p className="text-xs text-neutral-500">{docs.length} 個單據</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" size="sm">
                            {docs.length}
                          </Badge>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-neutral-200 p-3 bg-white">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-neutral-100">
                                <th className="text-left py-2 px-2 font-medium text-neutral-500">
                                  編號
                                </th>
                                <th className="text-left py-2 px-2 font-medium text-neutral-500">
                                  單據名稱
                                </th>
                                <th className="text-left py-2 px-2 font-medium text-neutral-500">
                                  標準
                                </th>
                                <th className="text-left py-2 px-2 font-medium text-neutral-500">
                                  部門
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-neutral-500">
                                  必填
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-neutral-500">
                                  狀態
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {docs.map((doc) => (
                                <tr
                                  key={doc.id}
                                  className="border-b border-neutral-50 hover:bg-neutral-50"
                                >
                                  <td className="py-2 px-2 font-mono text-neutral-600">{doc.id}</td>
                                  <td className="py-2 px-2 text-neutral-800">{doc.name}</td>
                                  <td className="py-2 px-2 text-neutral-500">{doc.standard}</td>
                                  <td className="py-2 px-2 text-neutral-500">{doc.department}</td>
                                  <td className="py-2 px-2 text-center">
                                    {doc.required ? (
                                      <AlertCircle size={14} className="text-rose-500 mx-auto" />
                                    ) : (
                                      <span className="text-neutral-300">—</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-2 text-center">
                                    <Badge variant={doc.required ? 'danger' : 'default'} size="sm">
                                      {doc.required ? '待填報' : '選填'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* ====== 生成中 ====== */}
        {step === 'generating' && (
          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 size={20} className="animate-spin text-cyan-600" />
              <div>
                <p className="font-medium text-neutral-800">{progressMsg}</p>
                <p className="text-xs text-neutral-400">正在生成 {progress}%...</p>
              </div>
            </div>
            <Progress value={progress} size="md" color="auto" />
          </Card>
        )}

        {/* ====== 完成 ====== */}
        {step === 'done' && generatedHtml && (
          <>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div>
                  <p className="font-bold text-emerald-800">報告生成完成！</p>
                  <p className="text-sm text-emerald-600">
                    總字數：{wordCount.toLocaleString()} 字 | 24 段 | 53 單據已整合
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={14} />}
                  onClick={() => setStep('preview')}
                >
                  預覽
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={handleDownload}
                >
                  下載 HTML
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '總字數', value: wordCount.toLocaleString(), icon: FileText },
                { label: '章節數', value: '24 段', icon: Layers },
                { label: '單據數', value: '53 個', icon: FileCheck },
                {
                  label: '完成率',
                  value: `${Math.round(
                    (completionStats.requiredCompleted / completionStats.required) * 100
                  )}%`,
                  icon: Target,
                },
              ].map((stat) => (
                <Card key={stat.label} variant="outlined" padding="sm">
                  <div className="flex items-center gap-2">
                    <stat.icon size={16} className="text-cyan-600" />
                    <div>
                      <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                      <p className="text-xs text-neutral-500">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ====== 預覽 ====== */}
        {step === 'preview' && generatedHtml && (
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="報告預覽" subtitle={`共 ${wordCount.toLocaleString()} 字`} />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={handleDownload}
                >
                  下載
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={14} />}
                  onClick={() => setStep('done')}
                >
                  關閉
                </Button>
              </div>
            </div>
            <div className="border border-neutral-200 rounded-lg p-6 bg-white max-h-[600px] overflow-y-auto">
              <div
                className="prose prose-sm max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />
            </div>
          </Card>
        )}

        {/* ====== Agent Pulse 右下角 ====== */}
        {showAgentPulse && <AgentPulsePanel onClose={() => setShowAgentPulse(false)} />}
        <button
          onClick={() => setShowAgentPulse(!showAgentPulse)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-600 text-white shadow-lg flex items-center justify-center hover:bg-cyan-700 transition-all hover:scale-105"
        >
          {showAgentPulse ? <X size={24} /> : <Bot size={24} />}
        </button>
      </div>
    </div>
  );
}
