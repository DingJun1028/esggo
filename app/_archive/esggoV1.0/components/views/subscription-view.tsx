"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/context/auth-context";
import { doc, getDoc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Check,
  X,
  Zap,
  Building2,
  CreditCard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Globe,
  Leaf,
  Award,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────── */
/*  Design Tokens — Luxury Cream Light Mode                   */
/* ─────────────────────────────────────────────────────────── */
const CREAM = "#FAF9F6";
const INK = "#1A1A18";
const FOREST = "#1B4332";
const FOREST_LIGHT = "#2D6A4F";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F0D080";
const MUTED = "#6B6B63";
const BORDER = "#E8E4DC";
const CARD_BG = "#FFFFFF";
const SOFT_SURFACE = "#F4F1EB";

/* ─────────────────────────────────────────────────────────── */
/*  Data                                                       */
/* ─────────────────────────────────────────────────────────── */
const TIERS = [
  {
    id: "starter",
    name: "初階啟航版",
    nameEn: "Starter",
    badge: "中小企業首選",
    description: "適合剛開始探索 ESG 數據與合規要求的小型企業，建立基礎數據資產庫。",
    price: "9,900",
    accent: FOREST_LIGHT,
    accentBg: "rgba(45,106,79,0.07)",
    buttonStyle: "outline",
    buttonText: "免費試用 14 天",
    popular: false,
    icon: Leaf,
    features: [
      { name: "基本碳盤查管理 (Scope 1, 2)", included: true },
      { name: "標準 ESG 報告初稿生成", included: true },
      { name: "單一使用者存取權限", included: true },
      { name: "基礎數據可視化看板", included: true },
      { name: "SRC 雲端儲存空間 (10GB)", included: false },
      { name: "5T 協議數位誠信認證", included: false },
    ],
  },
  {
    id: "pro",
    name: "專業增長版",
    nameEn: "Professional",
    badge: "最高性價比",
    description: "針對有供應鏈承諾與國際框架（GRI, SASB）合規進階需求的成長期企業。",
    price: "29,900",
    accent: GOLD,
    accentBg: "rgba(201,168,76,0.08)",
    buttonStyle: "solid",
    buttonText: "立即升級專業版",
    popular: true,
    icon: Award,
    features: [
      { name: "完整供應鏈盤查 (Scope 1, 2, 3)", included: true },
      { name: "國際合規框架對齊 (GRI, SASB)", included: true },
      { name: "5 名團隊成員協力權限", included: true },
      { name: "AI 自動化數據異常監測", included: true },
      { name: "SRC 雲端儲存空間 (100GB)", included: true },
      { name: "5T 協議數位誠信認證", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "企業旗艦版",
    nameEn: "Enterprise",
    badge: "客製化方案",
    description: "大型集團、多節點跨國企業或需要高強度系統集成與客製化開發之首選。",
    price: "聯繫專員",
    accent: FOREST,
    accentBg: "rgba(27,67,50,0.07)",
    buttonStyle: "outline",
    buttonText: "諮詢解決方案",
    popular: false,
    icon: Building2,
    features: [
      { name: "多據點 / 供應鏈實時管理圖譜", included: true },
      { name: "客製化 ESG 合規指標看板", included: true },
      { name: "無上限使用者帳號授權", included: true },
      { name: "API 深度對接 ERP 系統", included: true },
      { name: "SRC 雲端儲存空間 (不限容量)", included: true },
      { name: "專屬資安顧問與技術支援", included: true },
    ],
  },
];

const COMPARISON_FEATURES = [
  {
    category: "核心功能比較",
    items: [
      { name: "碳盤查管理範圍", starter: "Scope 1, 2", pro: "Scope 1, 2, 3", enterprise: "多據點 + 供應鏈" },
      { name: "合規框架報告", starter: "基礎模板", pro: "GRI, SASB 專業導出", enterprise: "完全客製化模組" },
      { name: "團隊協作人數", starter: "1 名", pro: "5 名", enterprise: "無上限" },
    ],
  },
  {
    category: "AI 與數位誠信",
    items: [
      { name: "AI 數據預警系統", starter: false, pro: "實時監控", enterprise: "專屬模型訓練" },
      { name: "SRC 儲存空間", starter: "10GB", pro: "100GB", enterprise: "無限容量" },
      { name: "5T 協議誠信驗證", starter: false, pro: true, enterprise: true },
      { name: "API 系統集成", starter: false, pro: false, enterprise: true },
    ],
  },
];

const GUARANTEES = [
  { icon: ShieldCheck, title: "軍規級數據加密", desc: "所有 ESG 底層數據皆通過 ZKP 隱私保護協議與區塊鏈加密。" },
  { icon: Globe, title: "全球框架支援", desc: "隨時更新國際 CSRD / GRI 規範，確保企業始終保持合規。" },
  { icon: TrendingUp, title: "高投報永續轉型", desc: "平均為企業節省 40% 的 ESG 報告撰寫成本，提升 25% 數據公信力。" },
];

const ENTERPRISE_LOGOS = ["台積電", "聯發科", "鴻海精密", "台灣大哥大", "中華電信"];

/* ─────────────────────────────────────────────────────────── */
/*  Sub-components                                             */
/* ─────────────────────────────────────────────────────────── */
function CreamBadge({ children, accent = FOREST }: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border"
      style={{ color: accent, borderColor: `${accent}30`, backgroundColor: `${accent}0D` }}
    >
      {children}
    </span>
  );
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-6 my-2">
      <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
      {label && <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: MUTED }}>{label}</span>}
      <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Component                                             */
/* ─────────────────────────────────────────────────────────── */
export function SubscriptionView() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [currentPlan, setCurrentPlan] = useState<string>("starter");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Load current subscription from Firestore
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "subscriptions", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setCurrentPlan(data.plan ?? "starter");
          setBillingCycle(data.billingCycle ?? "yearly");
        }
      } catch (e) {
        console.error("[Subscription] Load error:", e);
      }
    };
    load();
  }, [user]);

  const handleSelectPlan = async (tierId: string) => {
    if (!user || tierId === currentPlan) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      const batch = writeBatch(db);

      // 1. Update Detailed Subscription Data
      batch.set(doc(db, "subscriptions", user.uid), {
        plan: tierId,
        billingCycle,
        updatedAt: serverTimestamp(),
        userId: user.uid,
        status: tierId === "starter" ? "trial" : "active",
      }, { merge: true });

      // 2. Sync to User Profile for immediate UI gating
      batch.set(doc(db, "users", user.uid), {
        subscription: tierId,
        subscriptionUpdatedAt: serverTimestamp(),
      }, { merge: true });

      await batch.commit();

      setCurrentPlan(tierId);
      setSavedMsg(`已切換至「${TIERS.find(t => t.id === tierId)?.name}」方案`);
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (e) {
      console.error("[Subscription] Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const faqs = [
    { q: "升級後可以立即使用所有功能嗎？", a: "是的，升級後您的帳戶將立即啟用所有對應方案的功能模組，無需等待。" },
    { q: "年繳方案是否支援退款？", a: "前 30 天提供無條件退款保障。30 天後，將依照剩餘月份比例退還款項。" },
    { q: "企業版能否整合我們的 ERP 系統？", a: "企業旗艦版包含完整 API 深度對接服務，我們的技術顧問將全程協助您完成系統整合。" },
  ];

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: CREAM, color: INK, fontFamily: "'Inter', 'Noto Serif TC', serif" }}
    >
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto pt-16 pb-12 px-6 text-center"
      >
        <CreamBadge accent={FOREST}>
          <Leaf className="w-3 h-3" />
          ESG GO Subscription Plans
        </CreamBadge>

        <h1
          className="mt-8 text-5xl md:text-6xl font-black tracking-tighter leading-[1.05]"
          style={{ color: INK }}
        >
          選擇最適合您的
          <br />
          <span style={{ color: FOREST }}>ESG 指揮官</span>{" "}
          <span style={{ color: GOLD }}>方案</span>
        </h1>
        <p className="mt-6 text-lg font-medium leading-relaxed max-w-2xl mx-auto" style={{ color: MUTED }}>
          不論您是初探永續轉型的小型企業，還是需要高度合規的大型集團，我們都提供對應的數位化工具，助您建立最堅實的 5T 數位誠信數據。
        </p>

        {/* Billing Toggle */}
        <div className="mt-12 flex items-center justify-center">
          <div
            className="flex items-center p-1.5 rounded-full"
            style={{ backgroundColor: SOFT_SURFACE, border: `1px solid ${BORDER}` }}
          >
            {(["monthly", "yearly"] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className="relative px-7 py-2.5 rounded-full text-sm font-black transition-all duration-300 flex items-center gap-2"
                style={{
                  backgroundColor: billingCycle === cycle ? CARD_BG : "transparent",
                  color: billingCycle === cycle ? INK : MUTED,
                  boxShadow: billingCycle === cycle ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {cycle === "monthly" ? "月繳方案" : "年繳方案"}
                {cycle === "yearly" && (
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: GOLD, color: "#fff" }}
                  >
                    省 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Pricing Cards ── */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TIERS.map((tier, idx) => {
          const TierIcon = tier.icon;
          const isActive = tier.id === currentPlan;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn("relative flex flex-col", tier.popular && "lg:-mt-4 lg:mb-0")}
            >
              {tier.popular && (
                <div
                  className="absolute -top-4 inset-x-0 flex justify-center z-10"
                >
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full"
                    style={{ backgroundColor: GOLD, color: "#fff" }}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1.5" />
                    {tier.badge}
                  </span>
                </div>
              )}

              <div
                className="flex-1 flex flex-col p-8 rounded-3xl transition-all duration-500"
                style={{
                  backgroundColor: CARD_BG,
                  border: `1.5px solid ${tier.popular ? GOLD : BORDER}`,
                  boxShadow: tier.popular
                    ? `0 8px 40px rgba(201,168,76,0.12), 0 2px 8px rgba(0,0,0,0.06)`
                    : "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Icon + Name */}
                <div className="mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: tier.accentBg }}
                  >
                    <TierIcon className="w-7 h-7" style={{ color: tier.accent }} />
                  </div>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: tier.accent }}
                  >
                    {tier.nameEn}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight" style={{ color: INK }}>
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed" style={{ color: MUTED }}>
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {tier.id === "enterprise" ? (
                    <p className="text-3xl font-black tracking-tight" style={{ color: INK }}>
                      {tier.price}
                    </p>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black self-start mt-1.5" style={{ color: MUTED }}>NT$</span>
                      <span className="text-5xl font-black tracking-tighter" style={{ color: INK }}>
                        {billingCycle === "yearly"
                          ? (parseInt(tier.price.replace(/\D/g, "")) * 0.8).toLocaleString()
                          : tier.price}
                      </span>
                      <span className="text-sm font-bold ml-1" style={{ color: MUTED }}>/ 月</span>
                    </div>
                  )}
                  {billingCycle === "yearly" && tier.id !== "enterprise" && (
                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
                      ✦ 已套用年度優惠折扣
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feat.included ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${FOREST}15` }}
                        >
                          <Check className="w-3 h-3" style={{ color: FOREST }} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: SOFT_SURFACE }}
                        >
                          <X className="w-3 h-3" style={{ color: MUTED }} strokeWidth={2.5} />
                        </div>
                      )}
                      <span
                        className="text-sm font-medium"
                        style={{ color: feat.included ? INK : MUTED }}
                      >
                        {feat.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  disabled={isActive || saving}
                  onClick={() => handleSelectPlan(tier.id)}
                  className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-[0.12em] transition-all duration-300 flex items-center justify-center gap-2 group"
                  style={
                    isActive
                      ? { backgroundColor: SOFT_SURFACE, color: MUTED, cursor: "default" }
                      : tier.buttonStyle === "solid"
                        ? {
                          backgroundColor: FOREST,
                          color: "#fff",
                          boxShadow: `0 4px 16px rgba(27,67,50,0.25)`,
                        }
                        : {
                          backgroundColor: "transparent",
                          color: INK,
                          border: `1.5px solid ${BORDER}`,
                        }
                  }
                >
                  {saving && !isActive ? (
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : isActive ? (
                    "目前使用的方案"
                  ) : (
                    <>
                      {tier.buttonText}
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Saved Toast ── */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-black text-white shadow-lg"
            style={{ backgroundColor: FOREST }}
          >
            ✦ {savedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Enterprise Logos ── */}
      <div className="max-w-5xl mx-auto px-6 mt-20">
        <Divider label="值得信賴的企業夥伴" />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          {ENTERPRISE_LOGOS.map((name) => (
            <div
              key={name}
              className="px-6 py-3 rounded-xl text-sm font-black tracking-wider"
              style={{ backgroundColor: SOFT_SURFACE, color: MUTED, border: `1px solid ${BORDER}` }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <div className="text-center mb-12">
          <CreamBadge accent={MUTED}>功能對比矩陣</CreamBadge>
          <h2 className="mt-6 text-4xl font-black tracking-tighter" style={{ color: INK }}>
            深入比較各方案規格
          </h2>
          <p className="mt-3 font-medium" style={{ color: MUTED }}>
            為您的企業量身選擇最符合需求的永續發展工具
          </p>
        </div>

        <div
          className="overflow-hidden rounded-3xl"
          style={{ border: `1px solid ${BORDER}`, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 p-6"
            style={{ backgroundColor: FOREST, color: "#fff" }}
          >
            <div className="text-xs font-black uppercase tracking-[0.2em] self-center">技術指標</div>
            {TIERS.map((t) => (
              <div key={t.id} className="text-center text-xs font-black uppercase tracking-[0.2em]">
                {t.name}
              </div>
            ))}
          </div>

          {COMPARISON_FEATURES.map((section, sidx) => (
            <div key={sidx} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ backgroundColor: SOFT_SURFACE, color: MUTED }}
              >
                {section.category}
              </div>
              {section.items.map((item, iidx) => (
                <div
                  key={iidx}
                  className="grid grid-cols-1 md:grid-cols-4 px-6 py-5 transition-colors"
                  style={{
                    borderBottom: iidx < (section?.items?.length || 0) - 1 ? `1px solid ${BORDER}` : "none",
                    backgroundColor: CARD_BG,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SOFT_SURFACE)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = CARD_BG)}
                >
                  <div className="text-sm font-bold" style={{ color: INK }}>{item.name}</div>
                  {[item.starter, item.pro, item.enterprise].map((val, vidx) => (
                    <div key={vidx} className="text-center text-sm font-medium" style={{ color: MUTED }}>
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="w-5 h-5 mx-auto" style={{ color: FOREST }} strokeWidth={2.5} />
                        ) : (
                          <span style={{ color: BORDER }}>—</span>
                        )
                      ) : (
                        val
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee Cards ── */}
      <div className="max-w-5xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {GUARANTEES.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-2xl"
              style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${FOREST}10` }}
              >
                <ItemIcon className="w-5 h-5" style={{ color: FOREST }} />
              </div>
              <div>
                <h4 className="text-sm font-black" style={{ color: INK }}>{item.title}</h4>
                <p className="mt-1 text-xs font-medium leading-relaxed" style={{ color: MUTED }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-3xl mx-auto px-6 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tight" style={{ color: INK }}>常見問題</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{ border: `1px solid ${openFaq === i ? GOLD : BORDER}`, backgroundColor: CARD_BG }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-black" style={{ color: INK }}>{faq.q}</span>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-4"
                  style={{ color: MUTED, transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm font-medium leading-relaxed" style={{ color: MUTED }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Enterprise CTA Banner ── */}
      <div className="max-w-5xl mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-12 flex flex-col md:flex-row items-center gap-10"
          style={{ backgroundColor: FOREST, color: "#fff" }}
        >
          {/* Decorative gold stripe */}
          <div
            className="absolute top-0 right-0 w-64 h-full opacity-10"
            style={{ background: `linear-gradient(135deg, transparent 40%, ${GOLD})` }}
          />

          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Globe className="w-10 h-10" style={{ color: GOLD_LIGHT }} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black tracking-tight">需要大規模部屬或客製化對接？</h3>
            <p className="mt-3 text-base font-medium leading-relaxed opacity-75">
              我們的顧問團隊將協助您評估現有 ERP 架構，規劃最符合您產業屬性的 5T 數位誠信數據鏈。立即預約專家諮詢，開啟您的全方位永續之戰。
            </p>
          </div>

          <button
            className="flex-shrink-0 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: `0 4px 20px rgba(201,168,76,0.4)` }}
          >
            預約專家諮詢
          </button>
        </motion.div>
      </div>
    </div>
  );
}
