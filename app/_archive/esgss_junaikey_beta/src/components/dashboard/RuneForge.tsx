import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  Hexagon,
  Zap,
  Database,
  Layers,
  Lock,
  Cpu,
  Orbit,
  ArrowUpRight,
  RefreshCcw,
  Activity,
  Info,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Switch,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui';

// ==================== TYPE DEFINITIONS ====================
interface ChartDataPoint {
  readonly name: string;
  readonly efficiency: number;
  readonly tokens: number;
  readonly fill: string;
}

interface StatusCardProps {
  readonly icon: React.ElementType;
  readonly title: string;
  readonly value: React.ReactNode;
  readonly subtitle: string;
  readonly variant?: 'emerald' | 'yellow' | 'blue' | 'default';
  readonly showProgress?: boolean;
  readonly progressValue?: number;
}

// ==================== UTILITY FUNCTIONS ====================
const generateData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      name: `${i}:00`,
      efficiency: Math.floor(Math.random() * 30) + 70,
      tokens: Math.floor(Math.random() * 500) + 1200,
      fill: 'hsl(var(--chart-1))',
    });
  }
  return data;
};

// ==================== SUB-COMPONENTS ====================
const StatusCard = memo<StatusCardProps>(
  ({
    icon: Icon,
    title,
    value,
    subtitle,
    variant = 'default',
    showProgress = false,
    progressValue = 0,
  }) => {
    const iconColors = {
      emerald: 'text-emerald-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
      default: 'text-white',
    };

    const borderClasses = {
      emerald: 'neon-border-emerald',
      yellow: 'neon-border-gold',
      blue: '',
      default: '',
    };

    return (
      <Card
        className={`bg-neutral-900/50 border-neutral-800 ${borderClasses[variant]} backdrop-blur-sm`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <Icon className={iconColors[variant]} size={16} aria-hidden="true" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${iconColors[variant]}`}>{value}</div>
          {showProgress && (
            <Progress
              value={progressValue}
              className="h-1 mt-2 bg-neutral-800"
              aria-label={`${title} progress`}
            />
          )}
          <p className="text-[10px] text-neutral-500 mt-2 font-mono uppercase">{subtitle}</p>
        </CardContent>
      </Card>
    );
  }
);

StatusCard.displayName = 'StatusCard';

// ==================== MAIN COMPONENT ====================
export const RuneForge = memo(() => {
  const [data, setData] = useState<ChartDataPoint[]>(generateData);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [entropy, setEntropy] = useState(64);
  const [activeStrategy, setActiveStrategy] = useState('Balanced');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [
          ...prev.slice(1),
          {
            name: new Date().toLocaleTimeString().slice(-5),
            efficiency: Math.floor(Math.random() * 20) + 75,
            tokens: Math.floor(Math.random() * 400) + 1300,
            fill: 'hsl(var(--chart-1))',
          },
        ];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEntropyReduction = useCallback(() => {
    setIsOptimizing(true);
    setTimeout(() => {
      setEntropy(prev => Math.max(prev - 15, 20));
      setIsOptimizing(false);
    }, 2000);
  }, []);

  const handleStrategyChange = useCallback((value: string) => {
    setActiveStrategy(value.toUpperCase());
  }, []);

  const swarmBars = useMemo(
    () =>
      [...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full ${i < 6 ? 'bg-yellow-500' : 'bg-neutral-800'}`}
          aria-hidden="true"
        />
      )),
    []
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 p-6 font-sans">
      <style>{`
        .bg-matrix {
          background-image: radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.05) 1px, transparent 0);
          background-size: 40px 40px;
        }
        .neon-border-emerald { box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); }
        .neon-border-gold { box-shadow: 0 0 15px rgba(234, 179, 8, 0.2); border-color: rgba(234, 179, 8, 0.4); }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8 bg-matrix relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg" aria-hidden="true">
                <Hexagon
                  className="text-emerald-500 animate-[spin_10s_linear_infinite]"
                  size={32}
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter">
                RUNE<span className="text-emerald-500">FORGE</span>
              </h1>
            </div>
            <p className="text-neutral-400 mt-1 flex items-center gap-2 font-mono text-sm">
              <Activity size={14} className="text-yellow-500" aria-hidden="true" />
              ESG & AI Fusion System: Resource Optimization Module v5.0
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-4">
            <Badge
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 px-3 py-1 bg-emerald-950/20"
            >
              ESG Core: Active
            </Badge>
            <Badge
              variant="outline"
              className="border-yellow-500/50 text-yellow-500 px-3 py-1 bg-yellow-950/20"
            >
              AI Reasoning: Synchronized
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" role="list">
          <StatusCard
            icon={Database}
            title="記憶核心熵值"
            value={`${entropy}%`}
            subtitle="Entropy Reduction Active"
            variant="emerald"
            showProgress
            progressValue={entropy}
          />
          <StatusCard
            icon={Orbit}
            title="Swarm 協作強度"
            value={
              <>
                8.42 <span className="text-xs font-normal text-gray-400">Sps</span>
              </>
            }
            subtitle="Cluster Load Balancing"
            variant="yellow"
          />
          <StatusCard
            icon={Shield}
            title="Vector DB 健康度"
            value="99.98%"
            subtitle="PGVector Index Optimized"
            variant="blue"
          />
          <StatusCard
            icon={Zap}
            title="RUNE 資源效率"
            value="x12.4"
            subtitle="Vs. Baseline Architecture"
            variant="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <Card className="bg-neutral-900/40 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-200">
                  <Activity size={18} className="text-emerald-500" aria-hidden="true" />{' '}
                  系統運行趨勢
                </CardTitle>
                <CardDescription className="text-gray-500">
                  實時監控資源利用率與 AI 推理消耗
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTok" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#525252"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid #262626',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorEff)"
                        strokeWidth={2}
                        name="資源效率 %"
                      />
                      <Area
                        type="monotone"
                        dataKey="tokens"
                        stroke="#eab308"
                        fillOpacity={1}
                        fill="url(#colorTok)"
                        strokeWidth={2}
                        name="推理 Tokens"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-neutral-900/40 border-neutral-800 p-4 flex items-center justify-between hover:bg-neutral-900/60 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-full text-blue-500" aria-hidden="true">
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-300">MECE 組件狀態</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      12 DIMENSIONS SYNCED
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500 border-none"
                >
                  SECURE
                </Badge>
              </Card>
              <Card className="bg-neutral-900/40 border-neutral-800 p-4 flex items-center justify-between hover:bg-neutral-900/60 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 bg-purple-500/10 rounded-full text-purple-500"
                    aria-hidden="true"
                  >
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-300">系統安全協議</div>
                    <div className="text-[10px] text-neutral-500 font-mono">JWT & RBAC ACTIVE</div>
                  </div>
                </div>
                <ArrowUpRight className="text-neutral-600" size={16} aria-hidden="true" />
              </Card>
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="bg-neutral-900/40 border-neutral-800 h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-200">
                  <Cpu size={18} className="text-yellow-500" aria-hidden="true" /> 控制矩陣
                </CardTitle>
                <CardDescription className="text-gray-500">手動觸發系統優化程序</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">
                      熵減程序 (Summarization)
                    </span>
                    <Badge
                      className={`${isOptimizing ? 'bg-yellow-500 text-black animate-pulse' : 'bg-neutral-800 text-gray-400'} border-none`}
                    >
                      {isOptimizing ? 'RUNNING' : 'READY'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 flex gap-2 h-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onClick={handleEntropyReduction}
                    disabled={isOptimizing}
                    aria-label={
                      isOptimizing ? 'Entropy reduction in progress' : 'Execute entropy reduction'
                    }
                  >
                    <RefreshCcw size={16} className={isOptimizing ? 'animate-spin' : ''} />
                    執行長短期記憶壓縮
                  </Button>
                  <p className="text-[10px] text-neutral-500 italic text-center">
                    * 將滑動窗口摘要注入向量資料庫以優化上下文
                  </p>
                </div>

                <div className="h-px bg-neutral-800" aria-hidden="true" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">RUNE 策略模式</span>
                    <span className="text-xs text-yellow-500 font-mono font-bold">
                      {activeStrategy}
                    </span>
                  </div>
                  <Tabs
                    defaultValue="balanced"
                    onValueChange={handleStrategyChange}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 bg-neutral-950 border border-neutral-800 p-1 w-full h-9">
                      <TabsTrigger
                        value="eco"
                        className="data-[state=active]:bg-emerald-800/50 data-[state=active]:text-emerald-100 text-[10px]"
                      >
                        ECO
                      </TabsTrigger>
                      <TabsTrigger
                        value="balanced"
                        className="data-[state=active]:bg-neutral-800 text-[10px]"
                      >
                        BAL
                      </TabsTrigger>
                      <TabsTrigger
                        value="boost"
                        className="data-[state=active]:bg-yellow-800/50 data-[state=active]:text-yellow-100 text-[10px]"
                      >
                        BOOST
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500" aria-hidden="true" />
                      <span className="text-xs text-gray-400">自動資源調度</span>
                    </div>
                    <Switch defaultChecked aria-label="Toggle automatic resource scheduling" />
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info
                      size={16}
                      className="text-emerald-500 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed">
                      當前系統正在應用「一體兩面」融合策略。ESG 數據透過感知核心實時注入， 由 AI
                      認知核心進行 MECE 維度分析，結果已鏡像至所有 RUNE 節點。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <footer className="flex justify-center pt-8 pb-4">
          <div className="flex items-center gap-2 cursor-pointer group">
            <Hexagon
              size={12}
              className="text-neutral-600 group-hover:text-emerald-500 transition-colors"
            />
            <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
              Powered by AIOS Ultimate Matrix V5.0
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
});

RuneForge.displayName = 'RuneForge';

export default RuneForge;
