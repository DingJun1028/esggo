"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/lib/context/app-context";
import { useAuth } from "@/components/layout/firebase-provider";
import {
  Settings,
  Award,
  Trophy,
  CheckCircle,
  Target,
  ShieldCheck,
  Building2,
  Calendar,
  Globe,
  Plus,
  Activity,
  Zap,
  TrendingUp,
  Database,
  FileText,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export function ProfileView() {
  const { user, profileData, isOnline } = useAuth();
  const { t, language } = useTranslation();
  const { globalEsgData, companyProfile, setCompanyProfile, achievements, addNotification } =
    useAppContext();

  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editDraft, setEditDraft] = useState({
    name: companyProfile.name,
    industry: companyProfile.industry,
    reportYear: companyProfile.reportYear,
    goals: [...companyProfile.goals],
  });

  const openSettings = () => {
    setEditDraft({
      name: companyProfile.name,
      industry: companyProfile.industry,
      reportYear: companyProfile.reportYear,
      goals: [...companyProfile.goals],
    });
    setShowSettings(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setCompanyProfile((prev) => ({
      ...prev,
      name: editDraft.name,
      industry: editDraft.industry,
      reportYear: editDraft.reportYear,
      goals: editDraft.goals.filter((g) => g.trim() !== ""),
    }));
    setIsSaving(false);
    setShowSettings(false);
    addNotification({
      type: "success",
      title: language === "zh" ? "公司資料已更新" : "Company Profile Updated",
      message:
        language === "zh"
          ? "變更已儲存並同步至本地"
          : "Changes saved and synced locally",
    });
  };

  const updateGoal = (index: number, value: string) => {
    setEditDraft((prev) => {
      const goals = [...prev.goals];
      goals[index] = value;
      return { ...prev, goals };
    });
  };

  const addGoal = () => {
    if (editDraft.goals.length < 5) {
      setEditDraft((prev) => ({ ...prev, goals: [...prev.goals, ""] }));
    }
  };

  const removeGoal = (index: number) => {
    setEditDraft((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSettings(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      {language === "zh" ? "編輯公司資料" : "Edit Company Profile"}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {language === "zh" ? "儲存後立即生效" : "Changes take effect immediately"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {t.profile.name}
                  </label>
                  <input
                    type="text"
                    value={editDraft.name}
                    onChange={(e) =>
                      setEditDraft((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder={language === "zh" ? "公司名稱" : "Company name"}
                  />
                </div>

                {/* Industry */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {t.profile.industry}
                  </label>
                  <input
                    type="text"
                    value={editDraft.industry}
                    onChange={(e) =>
                      setEditDraft((p) => ({ ...p, industry: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    placeholder={language === "zh" ? "產業類別" : "Industry"}
                  />
                </div>

                {/* Report Year */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {t.profile.year}
                  </label>
                  <input
                    type="number"
                    value={editDraft.reportYear}
                    onChange={(e) =>
                      setEditDraft((p) => ({
                        ...p,
                        reportYear: parseInt(e.target.value) || p.reportYear,
                      }))
                    }
                    min={2020}
                    max={2030}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {t.profile.goals}
                    </label>
                    {editDraft.goals.length < 5 && (
                      <button
                        onClick={addGoal}
                        className="text-[10px] font-black text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        {language === "zh" ? "新增目標" : "Add goal"}
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {editDraft.goals.map((goal, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={goal}
                          onChange={(e) => updateGoal(i, e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                          placeholder={language === "zh" ? "例：2030 碳中和" : "e.g. Carbon Neutral 2030"}
                        />
                        <button
                          onClick={() => removeGoal(i)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-emerald-500/20"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving
                    ? language === "zh"
                      ? "儲存中..."
                      : "Saving..."
                    : language === "zh"
                      ? "儲存變更"
                      : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <section className="relative pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-transparent -mx-10 h-64 -z-10" />
        <div className="flex flex-col md:flex-row items-center gap-6 px-4">
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl relative z-10"
              />
            ) : (
              <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-600 border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-black z-10 uppercase">
                {user?.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20">
              <ShieldCheck className="w-6 h-6 text-[#009E9D]" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {user?.displayName || t.profile.proWriter}
            </h1>
            <p className="text-slate-500 font-bold">{user?.email || "user@infoone.esg"}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <Badge className="bg-emerald-600 text-white border-none py-1.5 px-4 rounded-xl flex items-center gap-2">
                <Trophy className="w-4 h-4" /> {profileData?.role || t.profile.esgMaster}
              </Badge>
              {profileData?.lastLogin && (
                <Badge
                  variant="outline"
                  className="text-slate-400 border-slate-100 py-1.5 px-4 rounded-xl flex items-center gap-2 bg-white/50"
                >
                  <Calendar className="w-3 h-3" />
                  {new Date(profileData.lastLogin?.seconds * 1000).toLocaleDateString()}{" "}
                  {language === "zh" ? "同步" : "synced"}
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={openSettings}
            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm active:scale-95"
            title={language === "zh" ? "編輯公司資料" : "Edit company profile"}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Context */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-emerald-600" /> {t.profile.companyContext}
              </h2>
              <button
                onClick={openSettings}
                className="text-xs font-black text-[#009E9D] hover:underline uppercase tracking-widest"
              >
                {t.common.edit}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.profile.name}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{companyProfile.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.profile.industry}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{companyProfile.industry}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.profile.year}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {companyProfile.reportYear} {t.profile.annualReport}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.profile.goals}
                </div>
                <div className="space-y-2">
                  {companyProfile.goals.map((goal, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl"
                    >
                      <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8 space-y-6 bg-slate-900 border-none text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3" /> {t.profile.achievements}
              </div>
              <div className="space-y-6">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black tracking-tight">{ach.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {ach.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-white/10 rounded-xl text-xs font-black hover:bg-white/20 transition-all border border-white/10">
                {t.profile.viewAllAchievements}
              </button>
            </GlassCard>

            <GlassCard className="p-8 space-y-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" /> {t.profile.recentActivity}
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: FileText,
                    text:
                      language === "zh"
                        ? "發布了 2024 生態多樣性報告"
                        : "Published 2024 Biodiversity Report",
                    date: language === "zh" ? "2 小時前" : "2 hrs ago",
                  },
                  {
                    icon: Database,
                    text:
                      language === "zh"
                        ? "連結了 Q4 供應鏈數據源"
                        : "Connected Q4 Supply Chain Sources",
                    date: language === "zh" ? "昨天" : "Yesterday",
                  },
                  {
                    icon: Target,
                    text:
                      language === "zh"
                        ? "完成了 GRI 302 指標對齊"
                        : "Completed GRI 302 Alignment",
                    date: language === "zh" ? "3 天前" : "3 days ago",
                  },
                ].map((act, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <act.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{act.text}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                        {act.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="space-y-8">
          <GlassCard className="p-8 space-y-8 border-[#009E9D]/30 bg-white">
            <div className="text-center space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {t.profile.monthlyPoints}
              </div>
              <div className="text-6xl font-black text-slate-900 tracking-tighter">1,280</div>
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                <TrendingUp className="w-4 h-4" /> {t.profile.vsLastMonth} 24.5%
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              {[
                {
                  label: t.profile.completedReports,
                  value: globalEsgData.completedReports,
                  icon: FileText,
                  color: "text-emerald-600",
                },
                {
                  label: t.profile.linkedSources,
                  value: globalEsgData.linkedSourcesCount,
                  icon: Database,
                  color: "text-sky-600",
                },
                {
                  label: t.profile.avgTrustScore,
                  value: `${globalEsgData.trustScore}%`,
                  icon: ShieldCheck,
                  color: "text-violet-600",
                },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" /> {t.profile.nextReward}
              </div>
              <div className="text-[11px] font-bold text-emerald-700 leading-relaxed">
                {t.profile.rewardDesc}
              </div>
              <div className="mt-3 h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%]" />
              </div>
            </div>
          </GlassCard>

          {/* Infrastructure Health Card */}
          <GlassCard className="p-6 space-y-4 border-slate-200 bg-slate-50/30">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#009E9D]" /> Security Infrastructure
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      isOnline ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">
                    Firestore DB
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400">
                  {isOnline ? "OPERATIONAL" : "DISCONNECTED"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">
                    Cloud Storage
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400">READY</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">
                    Genkit Logic
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400">INSTRUMENTED</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                ZKP Connection
              </span>
              <Badge className="bg-slate-900 text-white text-[8px] h-4 rounded-md">
                VERIFIED
              </Badge>
            </div>
          </GlassCard>

          <button className="w-full py-5 bg-white border border-slate-200 rounded-3xl text-sm font-black text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
            <Plus className="w-5 h-5" /> {t.profile.joinTeam}
          </button>
        </div>
      </div>
    </div>
  );
}
