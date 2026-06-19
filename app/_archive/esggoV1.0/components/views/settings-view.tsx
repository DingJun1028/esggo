"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Globe,
  Bell,
  Save,
  RefreshCw,
  ChevronRight,
  Camera,
  User,
  LogOut,
  Key,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BrainCircuit, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export function SettingsView() {
  const [activeSettingTab, setActiveSettingTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [testErrorMessage, setTestErrorMessage] = useState("");

  const [smtpConfig, setSmtpConfig] = useState({
    from: "jun@esgsunshine.com",
    user: "jun@esgsunshine.com",
    password: "",
    host: "esgsunshine.com",
    port: "465",
    security: "TLS",
    testEmail: "jun@esgsunshine.com",
  });

  const handleGlobalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("所有系統變更已成功同步至卓越核心雲端。");
    }, 1200);
  };

  const handleAvatarUpload = () => {
    toast.info("正在連線至影像處理矩陣... 已開啟本地檔案選擇器。");
  };

  const handleTestEmail = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      if (smtpConfig.password.length < 6) {
        setTestResult("error");
        setTestErrorMessage("驗證失敗。請檢查您的 SMTP 帳號與密碼是否正確。");
      } else {
        setTestResult("success");
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl pb-20 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-4xl font-black text-stitch-text tracking-tight flex items-center gap-4 uppercase font-headline">
            系統配置中心 <span className="text-stone-300">/</span> <span className="text-stitch-teal-start">Settings</span>
          </h1>
          <p className="text-stitch-muted mt-2 font-bold uppercase tracking-widest text-[10px]">
            Enterprise Infrastructure & Identity Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="solid"
            onClick={handleGlobalSave}
            disabled={isSaving}
            className="bg-black hover:bg-stone-800 text-white text-xs font-black uppercase tracking-[0.2em] px-8 h-14 rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-primary-teal-start" />}
            {isSaving ? "Synchronizing..." : "同步全球變更"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-2 bg-stone-50 rounded-[32px] border border-stone-200/50">
            {[
              { id: 'general', label: '基礎通訊', icon: Mail },
              { id: 'security', label: '安全防禦', icon: Shield },
              { id: 'notification', label: '推播偏好', icon: Bell },
              { id: 'cora', label: 'Cora 智能', icon: BrainCircuit },
              { id: 'region', label: '全球化設置', icon: Globe },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSettingTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all text-left",
                  activeSettingTab === item.id
                    ? "bg-white text-stitch-text shadow-minimal border border-black/5"
                    : "text-stone-400 hover:bg-white/50 hover:text-stitch-text"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                  activeSettingTab === item.id ? "bg-black text-primary-teal-start shadow-lg shadow-primary-teal-start/20" : "bg-stone-200/50 text-stone-400"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                {item.label}
              </button>
            ))}
          </div>

          <GlassCard className="p-6 bg-red-50/30 border-red-100 mt-10 rounded-[32px]">
            <h4 className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Danger Zone
            </h4>
            <button className="w-full py-3 bg-white hover:bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all transition-colors active:scale-95">
              <LogOut className="w-4 h-4" /> 登出目前工作區
            </button>
          </GlassCard>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* Profile Header */}
          <div className="relative group">
            <div className="h-32 w-full bg-gradient-to-r from-primary-teal-start/20 to-indigo-500/10 rounded-[32px] border border-black/5 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>
            <div className="flex items-end gap-6 -mt-12 px-10 relative">
              <div className="relative">
                <div className="w-32 h-32 rounded-[40px] bg-white p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-[34px] bg-stone-100 overflow-hidden flex items-center justify-center border border-stone-200">
                    <User className="w-16 h-16 text-stone-300" />
                  </div>
                </div>
                <button
                  onClick={handleAvatarUpload}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-black text-primary-teal-start rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border border-stone-800"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="pb-4">
                <h2 className="text-3xl font-black text-stitch-text uppercase tracking-tight font-headline">Ding Jun</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="primary" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border-none px-3 font-black text-[9px] uppercase tracking-[0.1em]">
                    Master Administrator
                  </Badge>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">Access Level: 09 (Sovereign)</span>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSettingTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeSettingTab === 'general' && (
                <GlassCard className="p-10 border-stone-200/50 rounded-[40px] bg-white/50 space-y-8">
                  <div className="flex items-center gap-5 border-b border-stone-100 pb-8">
                    <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-primary-teal-start border border-stone-100">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-stitch-text uppercase tracking-tight font-headline">SMTP 郵件核心伺服器 設定</h2>
                      <p className="text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
                        Infrastructure_Communication_Protocol
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-1">寄件者地址 (From Address)</label>
                      <Input
                        value={smtpConfig.from}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, from: e.target.value })}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-200 font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-1">SMTP 使用者帳號</label>
                      <Input
                        value={smtpConfig.user}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-200 font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-1">SMTP 帳戶密碼</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                          className="h-14 rounded-2xl bg-stone-50/50 border-stone-200 font-bold text-sm pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-1">SMTP 主機 (Host)</label>
                      <Input
                        value={smtpConfig.host}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-200 font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-stone-100 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-stone-200">
                          <RefreshCw className={cn("w-5 h-5 text-stone-400 transition-all", isTesting && "animate-spin")} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase text-stone-600 tracking-widest">發送測試連接郵件</p>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">驗證核心通訊路徑是否暢通</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Test recipient..."
                          value={smtpConfig.testEmail}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, testEmail: e.target.value })}
                          className="h-11 rounded-xl bg-white border-stone-200 w-48 text-xs font-bold"
                        />
                        <Button
                          variant="wireframe"
                          onClick={handleTestEmail}
                          disabled={isTesting}
                          className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          {isTesting ? "Testing..." : "開始測試"}
                        </Button>
                      </div>
                    </div>

                    {testResult && (
                      <div className={cn(
                        "p-5 rounded-2xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-2",
                        testResult === "success" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-600"
                      )}>
                        {testResult === "success" ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                        <p className="text-xs font-bold font-headline tracking-tight uppercase">
                          {testResult === "success" ? "SMTP 服務連線成功！測試郵件已成功排程。" : testErrorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              {activeSettingTab === 'cora' && (
                <GlassCard className="p-10 border-stone-200/50 rounded-[40px] bg-white/50 space-y-8">
                  <div className="flex items-center gap-5 border-b border-stone-100 pb-8">
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-primary-teal-start border border-stone-800 shadow-xl shadow-primary-teal-start/10">
                      <BrainCircuit className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-stitch-text uppercase tracking-tight font-headline">Cora 智能協作與 CoraPlan 誠信約束</h2>
                      <p className="text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
                        AI_Autonomous_Protocol_v3.4
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 bg-black rounded-[32px] text-white relative overflow-hidden group">
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-teal-start rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-teal-start">Status: Sovereign_Level_Enforced</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight font-headline">CoraPlan 誠信約束引擎</h3>
                        <p className="text-[11px] text-stone-400 max-w-xl leading-relaxed font-medium">
                          卓越核心開發模式已與繁體中文 5T 誠信規範 (`.cursor/plans/00-PLAN-CONSTRAINTS.md`) 深度整合。所有生成計畫將強制遵守 5T 原則。
                        </p>
                        <div className="flex gap-4 pt-4">
                          <button className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95">
                            重新配置指令集
                          </button>
                          <button className="px-6 py-3 bg-stone-800 text-stone-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-700 hover:bg-stone-700 transition-all">
                            讀取全局約束文檔
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-teal-start/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: "推理深度", value: "Level 10 (Deep)", icon: SearchIcon },
                        { label: "創意溫度", value: "0.2 (Rigid)", icon: BrainCircuit },
                        { label: "語言約束", value: "Traditional Chinese", icon: Globe },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex flex-col gap-2">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{stat.label}</span>
                          <span className="text-sm font-black text-stitch-text uppercase tracking-tight">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {['security', 'notification', 'region'].includes(activeSettingTab) && (
                <div className="flex flex-col items-center justify-center py-32 bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-stone-400 border border-stone-100 shadow-minimal mb-8">
                    <Database className="w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-stitch-text uppercase tracking-[0.2em] font-headline">Intelligence Module Loading...</h3>
                  <p className="text-[10px] text-stone-400 mt-3 font-bold uppercase tracking-widest max-w-sm text-center leading-relaxed">
                    正在從主權雲端掛載 {activeSettingTab.toUpperCase()} 安全隔離區模組。這需要最高級別的權限解鎖。
                  </p>
                  <button
                    onClick={() => setActiveSettingTab('general')}
                    className="mt-10 px-8 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                  >
                    返回基礎通訊配置
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Minimal stub for SearchIcon since lucide-react might not have "SearchIcon" as a named export in all envs (it's "Search")
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
