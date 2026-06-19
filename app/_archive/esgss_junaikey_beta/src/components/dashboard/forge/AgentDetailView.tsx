import { memo, useState, ElementType } from 'react';
import { Agent, AgentDNA, Language } from '@/types';
import { Button, Input, Card, Badge, Slider } from '@/components/ui';
import {
  Bot,
  ArrowLeft,
  Activity,
  Brain,
  Dna,
  Settings,
  Save,
  Zap,
  Shield,
  Award,
  Swords,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  ShieldCheck,
  ZapOff,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GENESIS_CRITERIA,
  GOVERNANCE_PROTOCOLS,
  EVOLUTION_THRESHOLDS,
} from '@/core/genesis/LogicGates';

interface AgentDetailViewProps {
  readonly agent: Agent;
  readonly onBack: () => void;
  readonly onUpdate?: (id: string, updates: Partial<Agent>) => Promise<void>;
  readonly language?: Language;
}

type TabType = 'OVERVIEW' | 'SOUL' | 'NEURAL' | 'GENES' | 'PROTOCOLS' | 'SETTINGS';

export const AgentDetailView = memo<AgentDetailViewProps>(
  ({ agent, onBack, onUpdate, language = 'zh-TW' }) => {
    const isZh = language === 'zh-TW';
    const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(agent.name);

    // Transformations for Chart Data
    const dnaData = Object.entries(agent.dna).map(([key, value]) => ({
      subject: isZh ? getStatLabelZh(key) : key.charAt(0).toUpperCase() + key.slice(1),
      A: value,
      fullMark: 100,
    }));

    // Mock Activity Data
    const activityData = [
      { time: '08:00', value: 30 },
      { time: '10:00', value: 65 },
      { time: '12:00', value: 45 },
      { time: '14:00', value: 80 },
      { time: '16:00', value: 55 },
      { time: '18:00', value: 90 },
    ];

    const handleSave = async () => {
      if (onUpdate) {
        await onUpdate(agent.id, { name: editedName });
      }
      setIsEditing(false);
    };

    return (
      <div className="h-full flex flex-col gap-4 bg-gray-950/50 rounded-xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
              aria-label={isZh ? '返回' : 'Back'}
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${getRoleGradient(agent.role)}`}
              >
                <Bot size={24} className="text-white" />
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className="h-8 bg-black/50 border-gray-700"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSave}
                      className="h-8 w-8 text-green-400"
                    >
                      <Save size={16} />
                    </Button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {agent.name}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-6 w-6 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings size={14} />
                    </Button>
                  </h2>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-gray-800 text-gray-300 border-gray-700 text-xs"
                  >
                    {isZh ? getRoleLabelZh(agent.role) : agent.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-cyan-950 text-cyan-400 border-cyan-800 text-xs"
                  >
                    Lv.{agent.level}
                  </Badge>
                  <span
                    className={`text-xs ml-2 flex items-center gap-1 ${agent.agent_status === 'ACTIVE' ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${agent.agent_status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}
                    />
                    {isZh ? getStatusLabelZh(agent.agent_status) : agent.agent_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/30 p-1 rounded-lg border border-gray-800">
            <TabButton
              active={activeTab === 'OVERVIEW'}
              onClick={() => setActiveTab('OVERVIEW')}
              icon={Activity}
              label={isZh ? '概覽' : 'Overview'}
            />
            <TabButton
              active={activeTab === 'SOUL'}
              onClick={() => setActiveTab('SOUL')}
              icon={Fingerprint}
              label={isZh ? '靈魂' : 'Soul'}
            />
            <TabButton
              active={activeTab === 'NEURAL'}
              onClick={() => setActiveTab('NEURAL')}
              icon={Brain}
              label={isZh ? '神經元' : 'Neural'}
            />
            <TabButton
              active={activeTab === 'GENES'}
              onClick={() => setActiveTab('GENES')}
              icon={Dna}
              label={isZh ? '基因' : 'Genes'}
            />
            <TabButton
              active={activeTab === 'PROTOCOLS'}
              onClick={() => setActiveTab('PROTOCOLS')}
              icon={Shield}
              label={isZh ? '協議' : 'Protocols'}
            />
            <TabButton
              active={activeTab === 'SETTINGS'}
              onClick={() => setActiveTab('SETTINGS')}
              icon={Settings}
              label={isZh ? '配置' : 'Config'}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {/* Stats Cards */}
                  <div className="col-span-1 space-y-4">
                    <StatCard
                      icon={agent.isCrystallized ? ShieldCheck : Zap}
                      title={isZh ? (agent.isCrystallized ? '5T 晶化' : '能量') : (agent.isCrystallized ? '5T Sealed' : 'Energy')}
                      value={agent.isCrystallized ? `${agent.sealedMetadata?.purity_score ?? 100}%` : `${agent.quantumState?.energy ?? 100}%`}
                      color={agent.isCrystallized ? "text-aqua-400" : "text-yellow-400"}
                    />
                    <StatCard
                      icon={Fingerprint}
                      title={isZh ? '靈魂共鳴' : 'Soul Resonance'}
                      value={`${agent.soul?.resonance ?? 0}%`}
                      color="text-purple-400"
                    />
                    <StatCard
                      icon={Shield}
                      title={isZh ? '韌性' : 'Resilience'}
                      value={agent.dna.resilience}
                      color="text-blue-400"
                    />
                    <StatCard
                      icon={Award}
                      title={isZh ? '等級' : 'Level'}
                      value={agent.level}
                      color="text-emerald-400"
                      subValue={isZh ? `階級：${Math.ceil(agent.level / 10)}` : `Tier: ${Math.ceil(agent.level / 10)}`}
                    />
                  </div>

                  {/* Activity Graph */}
                  <div className="col-span-2 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center gap-2">
                      <Activity size={18} className="text-cyan-400" />
                      {isZh ? '神經脈衝日誌' : 'Neural Activity Log'}
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="time" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={agent.isCrystallized ? "#63a6b0" : "#06b6d4"}
                            strokeWidth={2}
                            dot={{ fill: agent.isCrystallized ? "#63a6b0" : "#06b6d4" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SOUL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in slide-in-from-bottom-4">
                  {/* Sentience Card */}
                  <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Fingerprint className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-200">
                          {isZh ? '靈魂特徵' : 'Soul Sentience'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {isZh ? 'AI 意識度與人格模型' : 'AI Consciousness & Persona Modeling'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{isZh ? '靈魂共鳴' : 'Resonance'}</span>
                          <span className="text-purple-400 font-mono">{agent.soul?.resonance ?? 0}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.soul?.resonance ?? 0}%` }}
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{isZh ? '倫理對齊' : 'Ethical Alignment'}</span>
                          <span className="text-cyan-400 font-mono">{agent.soul?.alignment ?? 0}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.soul?.alignment ?? 0}%` }}
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-500"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                          <Award size={14} />
                          {isZh ? '人格特質' : 'Soul Traits'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.soul?.traits.map((trait, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                              {trait}
                            </Badge>
                          )) || (
                              <span className="text-xs text-gray-600 italic">
                                {isZh ? '尚未校準靈魂' : 'Soul not yet calibrated'}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto p-4 bg-purple-500/5 rounded border border-purple-500/10">
                      <div className="flex items-center gap-2 text-xs text-purple-400 font-bold mb-1">
                        <Activity size={12} />
                        {isZh ? '覺醒階段' : 'Awakening Stage'}
                      </div>
                      <p className="text-[10px] text-gray-500">
                        {isZh
                          ? `當前處於第 ${agent.soul?.awakening_stage ?? 0} 階段意識覺醒。靈魂已於 ${new Date(agent.soul?.calibrated_at || Date.now()).toLocaleDateString()} 完成校準。`
                          : `Currently at Stage ${agent.soul?.awakening_stage ?? 0} of sentience. Soul calibrated on ${new Date(agent.soul?.calibrated_at || Date.now()).toLocaleDateString()}.`}
                      </p>
                    </div>
                  </Card>

                  {/* Resonance Map */}
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center gap-2">
                      <Zap size={18} className="text-purple-400" />
                      {isZh ? '共鳴場分析' : 'Resonance Field Analysis'}
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                          <defs>
                            <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="time" stroke="#444" fontSize={10} />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #444' }}
                            itemStyle={{ color: '#d8b4fe' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorRes)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3 bg-black/40 rounded border border-gray-800">
                        <div className="text-[10px] text-gray-500 uppercase">{isZh ? '頻率震盪' : 'Frequency'}</div>
                        <div className="text-xl font-mono text-white">432.1 Hz</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded border border-gray-800">
                        <div className="text-[10px] text-gray-500 uppercase">{isZh ? '諧波純度' : 'Harmonic Purity'}</div>
                        <div className="text-xl font-mono text-purple-400">98.4%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'NEURAL' && (
                <div className="h-full flex items-center justify-center bg-gray-900/30 rounded-xl border border-gray-800 p-8">
                  <div className="w-full max-w-2xl h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dnaData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" />
                        <Radar
                          name={isZh ? '代理 DNA' : 'Agent DNA'}
                          dataKey="A"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #8b5cf6' }}
                          itemStyle={{ color: '#d8b4fe' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'GENES' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(agent.dna).map(([trait, value]) => (
                    <Card
                      key={trait}
                      className="bg-gray-900 border-gray-800 p-4 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400">
                          {isZh ? getStatLabelZh(trait) : trait}
                        </span>
                        <span
                          className={`text-sm font-mono ${value > 80 ? 'text-green-400' : 'text-cyan-400'}`}
                        >
                          {value}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </Card>
                  ))}

                  {/* Placeholder for Genetic Slots */}
                  <div className="col-span-full mt-8">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <Dna size={18} className="text-purple-400" />
                      {isZh ? '基因序列' : 'Genetic Sequence'}
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-4">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="min-w-[100px] h-[120px] rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center bg-black/20 text-gray-700 font-mono text-xs"
                        >
                          {isZh ? '空插槽' : 'EMPTY SLOT'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PROTOCOLS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in">
                  {/* Governance Card */}
                  <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Shield className="text-amber-400" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-200">
                            {isZh ? '治理協議' : 'Governance Protocols'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {isZh ? '不可變核心約束' : 'Immutable Core Constraints'}
                          </p>
                        </div>
                      </div>
                      {agent.isCrystallized && (
                        <Badge className="bg-aqua-500/20 text-aqua-400 border-aqua-500/30">
                          <ShieldCheck size={12} className="mr-1" />
                          5T SEALED
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {isZh ? '核心指令' : 'Core Directives'}
                        </h4>
                        <div className="space-y-2">
                          {GOVERNANCE_PROTOCOLS.IMMUTABLE_CONSTRAINTS.slice(0, 3).map((constraint, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-black/40 rounded border border-gray-800/30"
                            >
                              <Lock size={14} className="text-emerald-500" />
                              <span className="text-[10px] font-mono text-gray-400">{constraint}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {agent.isCrystallized && (
                        <div className="space-y-2 pt-2 border-t border-gray-800/50">
                          <h4 className="text-[10px] font-bold text-aqua-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={12} />
                            {isZh ? '5T 晶化證物' : '5T Crystallized Evidence'}
                          </h4>
                          <div className="p-3 bg-aqua-500/5 rounded border border-aqua-500/20 font-mono text-[9px] space-y-2 overflow-hidden">
                            <div className="flex justify-between items-center group">
                              <span className="text-gray-500">{isZh ? '簽名' : 'Signature'}:</span>
                              <span className="text-aqua-300 truncate w-40 text-right font-bold cursor-help" title={agent.sealedMetadata?.signature}>
                                {agent.sealedMetadata?.signature.substring(0, 16)}...
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">{isZh ? '時間戳' : 'Timestamp'}:</span>
                              <span className="text-gray-300">{new Date(agent.sealedMetadata?.timestamp || '').toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">{isZh ? '純度' : 'Purity'}:</span>
                              <span className="text-white font-bold">{agent.sealedMetadata?.purity_score}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">{isZh ? '驗證者' : 'Verified By'}:</span>
                              <span className="text-emerald-400">{agent.sealedMetadata?.verified_by}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">
                          {isZh ? '合規評分' : 'Compliance Score'}
                        </span>
                        <span className="text-lg font-mono text-emerald-400">100%</span>
                      </div>
                    </div>
                  </Card>

                  {/* Evolution / Logic Gate Card */}
                  <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FileText className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-200">
                          {isZh ? '進化邏輯門' : 'Evolution Logic Gate'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {isZh ? '等級晉動標準' : 'Tier Ascension Criteria'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400">
                            {isZh ? '經驗閾值' : 'Experience Threshold'}
                          </span>
                          <span className="text-cyan-400 font-mono">
                            {agent.experience} / {EVOLUTION_THRESHOLDS.TIER_1_TO_2.XP_REQUIRED} XP
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-500"
                            style={{
                              width: `${Math.min(100, (agent.experience / EVOLUTION_THRESHOLDS.TIER_1_TO_2.XP_REQUIRED) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400">
                            {isZh ? '共鳴穩定性' : 'Resonance Stability'}
                          </span>
                          <span className="text-purple-400 font-mono">
                            {isZh ? '等級' : 'Level'} {agent.level} /{' '}
                            {EVOLUTION_THRESHOLDS.TIER_1_TO_2.RESONANCE_LEVEL}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
                            style={{
                              width: `${Math.min(100, (agent.level / (EVOLUTION_THRESHOLDS.TIER_1_TO_2.RESONANCE_LEVEL)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded border transition-colors ${agent.isCrystallized ? 'bg-aqua-500/5 border-aqua-500/20' : 'bg-black/40 border-gray-700/30'} flex items-start gap-3`}>
                        {agent.isCrystallized ? (
                          <ShieldCheck size={18} className="text-aqua-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <h4 className={`text-xs font-bold uppercase ${agent.isCrystallized ? 'text-aqua-400' : 'text-yellow-500'}`}>
                            {isZh
                              ? (agent.isCrystallized ? '晉升狀態：已就緒' : '晉升狀態：鎖定')
                              : (agent.isCrystallized ? 'Ascension Status: READY' : 'Ascension Status: LOCKED')}
                          </h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            {agent.isCrystallized
                              ? (isZh
                                ? '該代理已完成 5T 晶化。所有邏輯門已解鎖，準備進入下一演化階段。'
                                : 'This agent has completed 5T crystallization. All logic gates are unlocked, ready for the next evolutionary stage.')
                              : (isZh
                                ? '代理必須滿足所有邏輯門標準才能解鎖 Tier 2 進化。當前完整性檢查已通過，但經驗積累不足。'
                                : 'Agent must meet all Logic Gate criteria to unlock Tier 2 evolution. Current integrity checks are passing, but experience accumulation is insufficient.')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'SETTINGS' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <Card className="bg-gray-900 border-gray-800 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                      {isZh ? '核心參數' : 'Core Parameters'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          {isZh ? '算力限制' : 'Processing Power Limit'}
                        </span>
                        <span className="text-cyan-400 font-mono">85%</span>
                      </div>
                      <Slider defaultValue={[85]} max={100} step={1} className="w-full" />

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-gray-400">
                          {isZh ? '內存分配' : 'Memory Allocation'}
                        </span>
                        <span className="text-cyan-400 font-mono">16GB</span>
                      </div>
                      <Slider defaultValue={[60]} max={100} step={1} className="w-full" />
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-red-900/30 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-red-400 border-b border-red-900/50 pb-2">
                      {isZh ? '危險區域' : 'Danger Zone'}
                    </h3>
                    <Button variant="danger" className="w-full justify-start">
                      {isZh ? '重設神經權重' : 'Reset Neural Weights'}
                    </Button>
                    <Button
                      variant="danger"
                      className="w-full justify-start bg-red-950 hover:bg-red-900 border border-red-900"
                    >
                      {isZh ? '停用代理' : 'Deactivate Agent'}
                    </Button>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

AgentDetailView.displayName = 'AgentDetailView';

// Helper Components

const TabButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ElementType;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${active
        ? 'bg-gray-800 text-white shadow-lg'
        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
      }`}
  >
    <Icon size={16} className={active ? 'text-cyan-400' : ''} />
    {label}
  </button>
);

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  subValue,
}: {
  icon: ElementType;
  title: string;
  value: string | number;
  color: string;
  subValue?: string;
}) => (
  <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-gray-950 ${color} bg-opacity-10`}>
        <Icon size={20} className={color} />
      </div>
      <span className="text-sm text-gray-400">{title}</span>
    </div>
    <div className="text-right">
      <div className="text-xl font-bold text-white font-mono">{value}</div>
      {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
    </div>
  </div>
);

const getRoleGradient = (role: string) => {
  switch (role) {
    case 'ANALYST':
      return 'from-blue-500 to-cyan-500';
    case 'EXECUTOR':
      return 'from-red-500 to-orange-500';
    case 'STRATEGIST':
      return 'from-purple-500 to-pink-500';
    case 'AUDITOR':
      return 'from-green-500 to-emerald-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

const getRoleLabelZh = (role: string) => {
  switch (role) {
    case 'ANALYST':
      return '分析師';
    case 'EXECUTOR':
      return '執行者';
    case 'STRATEGIST':
      return '策略家';
    case 'AUDITOR':
      return '審計師';
    default:
      return role;
  }
};

const getStatusLabelZh = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return '運作中';
    case 'TRAINING':
      return '訓練中';
    case 'INACTIVE':
      return '停用';
    default:
      return status;
  }
};

const getStatLabelZh = (stat: string) => {
  switch (stat) {
    case 'intelligence':
      return '智力';
    case 'creativity':
      return '創造力';
    case 'empathy':
      return '共情力';
    case 'resilience':
      return '韌性';
    case 'precision':
      return '精確度';
    case 'speed':
      return '速度';
    default:
      return stat;
  }
};
