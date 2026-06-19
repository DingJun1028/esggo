import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Truck,
  Factory,
  CloudRain,
  Wind,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Save,
  Calculator,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// 碳排放係數表（簡易版）
const EMISSION_FACTORS = {
  // 範疇一 - 固定燃燒源
  scope1_fixed: {
    'natural_gas': { factor: 2.02, unit: 'kg CO2e/m³', name: '天然氣' },
    'diesel': { factor: 2.68, unit: 'kg CO2e/L', name: '柴油' },
    'gasoline': { factor: 2.31, unit: 'kg CO2e/L', name: '汽油' },
    'lpg': { factor: 1.51, unit: 'kg CO2e/L', name: '液化石油氣' },
    'coal': { factor: 2.42, unit: 'kg CO2e/kg', name: '煤炭' },
  },
  // 範疇一 - 移動燃燒源
  scope1_mobile: {
    'diesel_vehicle': { factor: 2.68, unit: 'kg CO2e/L', name: '柴油車輛' },
    'gasoline_vehicle': { factor: 2.31, unit: 'kg CO2e/L', name: '汽油車輛' },
  },
  // 範疇一 - 逸散排放
  scope1_fugitive: {
    'refrigerant_r410a': { factor: 2088, unit: 'kg CO2e/kg', name: '冷媒 R410A' },
    'refrigerant_r134a': { factor: 1430, unit: 'kg CO2e/kg', name: '冷媒 R134A' },
    'fire_extinguisher': { factor: 1.0, unit: 'kg CO2e/kg', name: '滅火器' },
  },
  // 範疇二 - 外購電力
  scope2_electricity: {
    'taiwan_grid': { factor: 0.509, unit: 'kg CO2e/kWh', name: '台灣電網' },
    'industrial_grid': { factor: 0.42, unit: 'kg CO2e/kWh', name: '工業用電' },
  },
};

// 碳盤查數據類型
interface CarbonData {
  scope: 'scope1' | 'scope2' | 'scope3';
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissionValue: number; // kg CO2e
  source: string;
  notes: string;
  year: number;
  verified: boolean;
}

interface CarbonInventoryFormProps {
  scope: 'scope1' | 'scope2' | 'scope3';
  onSubmit: (data: CarbonData) => void;
  onCancel: () => void;
}

export const CarbonInventoryForm: React.FC<CarbonInventoryFormProps> = ({
  scope,
  onSubmit,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [notes, setNotes] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [calculatedEmission, setCalculatedEmission] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 根據範疇和類別獲取子類別選項
  const getSubcategoryOptions = () => {
    if (scope === 'scope1') {
      if (category === 'fixed') return Object.keys(EMISSION_FACTORS.scope1_fixed);
      if (category === 'mobile') return Object.keys(EMISSION_FACTORS.scope1_mobile);
      if (category === 'fugitive') return Object.keys(EMISSION_FACTORS.scope1_fugitive);
    }
    if (scope === 'scope2' && category === 'electricity') {
      return Object.keys(EMISSION_FACTORS.scope2_electricity);
    }
    return [];
  };

  // 計算排放量
  const calculateEmission = async () => {
    if (!quantity || !subcategory) return;

    setIsCalculating(true);
    const qty = parseFloat(quantity);
    
    // 查找排放係數
    let factor = 0;
    if (scope === 'scope1') {
      if (category === 'fixed') factor = EMISSION_FACTORS.scope1_fixed[subcategory as keyof typeof EMISSION_FACTORS.scope1_fixed]?.factor || 0;
      if (category === 'mobile') factor = EMISSION_FACTORS.scope1_mobile[subcategory as keyof typeof EMISSION_FACTORS.scope1_mobile]?.factor || 0;
      if (category === 'fugitive') factor = EMISSION_FACTORS.scope1_fugitive[subcategory as keyof typeof EMISSION_FACTORS.scope1_fugitive]?.factor || 0;
    }
    if (scope === 'scope2' && category === 'electricity') {
      factor = EMISSION_FACTORS.scope2_electricity[subcategory as keyof typeof EMISSION_FACTORS.scope2_electricity]?.factor || 0;
    }

    const emission = qty * factor;
    setCalculatedEmission(emission);

    // AI 建議生成
    await new Promise(resolve => setTimeout(resolve, 500));
    setAiSuggestion(generateAISuggestion(scope, emission));
    setIsCalculating(false);
  };

  // 生成 AI 建議
  const generateAISuggestion = (scope: string, emission: number): string => {
    if (scope === 'scope1') {
      if (emission > 10000) return '建議評估使用再生能源或改善燃料效率，可考慮安裝太陽能板。';
      if (emission > 5000) return '建議優化生產流程，定期維護設備以減少能源浪費。';
      return '排放量控制良好，建議持續監控並記錄減量措施。';
    }
    if (scope === 'scope2') {
      if (emission > 50000) return '建議評估契約容量優化或轉用綠電憑證，可考慮簽訂綠電購電合約(PPA)。';
      if (emission > 20000) return '建議更換為高效率LED照明和節能空調系統。';
      return '用電效率良好，建議持續追蹤並參與需量反應。';
    }
    return '建議建立完整的碳排放追蹤系統，以便未來進行減排規劃。';
  };

  // 提交表單
  const handleSubmit = () => {
    if (!subcategory || !quantity) return;

    let factor = 0;
    if (scope === 'scope1') {
      if (category === 'fixed') factor = EMISSION_FACTORS.scope1_fixed[subcategory as keyof typeof EMISSION_FACTORS.scope1_fixed]?.factor || 0;
      if (category === 'mobile') factor = EMISSION_FACTORS.scope1_mobile[subcategory as keyof typeof EMISSION_FACTORS.scope1_mobile]?.factor || 0;
      if (category === 'fugitive') factor = EMISSION_FACTORS.scope1_fugitive[subcategory as keyof typeof EMISSION_FACTORS.scope1_fugitive]?.factor || 0;
    }
    if (scope === 'scope2' && category === 'electricity') {
      factor = EMISSION_FACTORS.scope2_electricity[subcategory as keyof typeof EMISSION_FACTORS.scope2_electricity]?.factor || 0;
    }

    const emission = parseFloat(quantity) * factor;

    const data: CarbonData = {
      scope,
      category,
      subcategory,
      quantity: parseFloat(quantity),
      unit,
      emissionFactor: factor,
      emissionValue: emission,
      source: 'manual',
      notes,
      year,
      verified: false,
    };

    onSubmit(data);
  };

  // 範疇標籤
  const scopeLabels = {
    scope1: { icon: Factory, color: 'text-red-400', bg: 'bg-red-500/20', label: '範疇一' },
    scope2: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: '範疇二' },
    scope3: { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/20', label: '範疇三' },
  };

  const scopeInfo = scopeLabels[scope];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-2xl ${scopeInfo.bg} flex items-center justify-center`}>
          <scopeInfo.icon className={`w-8 h-8 ${scopeInfo.color}`} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            碳盤查數據輸入 <span className={`${scopeInfo.color}`}>{scopeInfo.label}</span>
          </h2>
          <p className="text-slate-400 text-sm">
            輸入您的碳排放數據，系統將自動計算並提供減排建議
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step >= s
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-20 h-1 mx-2 rounded ${
                  step > s ? 'bg-blue-500' : 'bg-slate-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Category */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-white">選擇排放類別</h3>
            
            {scope === 'scope1' && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'fixed', icon: Factory, label: '固定燃燒源', desc: '鍋爐、發電機等' },
                  { id: 'mobile', icon: Truck, label: '移動燃燒源', desc: '公司車輛等' },
                  { id: 'fugitive', icon: CloudRain, label: '逸散排放', desc: '冷媒、滅火器等' },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCategory(item.id);
                      setStep(2);
                    }}
                    className={`p-6 rounded-2xl border transition-all ${
                      category === item.id
                        ? 'bg-blue-500/20 border-blue-500'
                        : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <item.icon className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="font-bold text-white">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </motion.button>
                ))}
              </div>
            )}

            {scope === 'scope2' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCategory('electricity');
                  setStep(2);
                }}
                className={`p-6 rounded-2xl border transition-all w-full ${
                  category === 'electricity'
                    ? 'bg-yellow-500/20 border-yellow-500'
                    : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                }`}
              >
                <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                <div className="font-bold text-white">外購電力</div>
                <div className="text-xs text-slate-400">電力購買與使用</div>
              </motion.button>
            )}

            {scope === 'scope3' && (
              <div className="p-8 text-center">
                <Truck className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">範疇三數據收集</h3>
                <p className="text-slate-400 mb-6">
                  範疇三包含所有其他間接排放，如員工通勤、商務差旅、物流運輸等。
                </p>
                <button
                  onClick={() => {
                    setCategory('value_chain');
                    setStep(2);
                  }}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all"
                >
                  開始輸入範疇三數據
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Enter Data */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-white">輸入排放數據</h3>

            {/* Subcategory Selection */}
            {scope === 'scope1' && (
              <div className="grid grid-cols-3 gap-3">
                {getSubcategoryOptions().map((key) => {
                  const info = EMISSION_FACTORS[
                    category as keyof typeof EMISSION_FACTORS
                  ]?.[key as keyof typeof EMISSION_FACTORS.scope1_fixed];
                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSubcategory(key);
                        setUnit(info?.unit || '');
                      }}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        subcategory === key
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-white">{info?.name}</div>
                      <div className="text-xs text-slate-400">
                        係數: {info?.factor} {info?.unit}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {scope === 'scope2' && (
              <div className="grid grid-cols-2 gap-3">
                {getSubcategoryOptions().map((key) => {
                  const info = EMISSION_FACTORS.scope2_electricity[key as keyof typeof EMISSION_FACTORS.scope2_electricity];
                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSubcategory(key);
                        setUnit(info?.unit || '');
                      }}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        subcategory === key
                          ? 'bg-yellow-500/20 border-yellow-500'
                          : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-white">{info?.name}</div>
                      <div className="text-xs text-slate-400">
                        係數: {info?.factor} {info?.unit}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Quantity Input */}
            {subcategory && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      數量
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="輸入數量"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      單位
                    </label>
                    <input
                      type="text"
                      value={unit}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-800/30 border border-white/10 rounded-xl text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      資料年度
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    備註說明
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="輸入任何補充說明..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                上一步
              </button>
              <button
                onClick={calculateEmission}
                disabled={!subcategory || !quantity}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                {isCalculating ? '計算中...' : '計算排放量'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Calculation Result */}
            {calculatedEmission !== null && (
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/30 rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">計算結果</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black text-white">
                        {calculatedEmission.toFixed(2)}
                      </span>
                      <span className="text-slate-400">kg CO2e</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
                  </div>
                </div>

                {/* AI Suggestion */}
                {aiSuggestion && (
                  <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-yellow-400">AI 建議</p>
                        <p className="text-sm text-slate-300 mt-1">{aiSuggestion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Data Summary */}
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">排放類別</span>
                <span className="text-white font-medium">{scopeLabels[scope].label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">排放源</span>
                <span className="text-white font-medium">{subcategory}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">數量</span>
                <span className="text-white font-medium">{quantity} {unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">年度</span>
                <span className="text-white font-medium">{year}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                確認儲存
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CarbonInventoryForm;
