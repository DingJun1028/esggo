"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Github, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/auth-context";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [devClicks, setDevClicks] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, loginAsDeveloper, user } = useAuth();

  // Handle Developer Channel Bypass
  useEffect(() => {
    const handleDevBypass = async () => {
      if (searchParams.get("channel") === "dev") {
        await loginAsDeveloper();
        router.push("/");
      }
    };
    handleDevBypass();
  }, [searchParams, loginAsDeveloper, router]);

  // If already logged in, redirect home
  if (user) {
    router.push("/");
  }

  const handleLogin = async (provider: string) => {
    setIsLoading(provider);

    if (provider === "google") {
      try {
        await loginWithGoogle();
        router.push("/");
      } catch (err) {
        console.error("Google login failed:", err);
        import("sonner").then(({ toast }) => toast.error("Google 登入失敗，請稍後再試或聯繫管理員。"));
        setIsLoading(null);
      }
    } else {
      // Simulation for other providers
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 selection:bg-primary-teal-start/20 relative overflow-hidden font-sans">
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 bg-[#F8F9FA]/50" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-premium border border-black/5 p-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shadow-minimal relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary-teal-start translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
              <Sparkles className="w-8 h-8 text-white relative z-10" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div
                onClick={async () => {
                  const next = devClicks + 1;
                  if (next >= 5) {
                    await loginAsDeveloper();
                    router.push("/");
                  } else {
                    setDevClicks(next);
                  }
                }}
                className="px-3 py-1 bg-matte-enterprise rounded border border-stone-100 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary-teal-start animate-pulse" />
                <span className="text-[10px] font-black text-stone-400 tracking-widest uppercase">Enterprise_Gateway_v4.3</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">
              Omni_Terminal
            </h1>
            <p className="text-stone-400 text-[11px] font-bold uppercase tracking-tight opacity-60">
              Anchoring Global Sustainability with 5T Integrity
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("google")}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-4 bg-white border border-stone-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-50 hover:border-black transition-all disabled:opacity-50 group group-hover:shadow-minimal"
          >
            {isLoading === "google" ? (
              <div className="w-4 h-4 border-2 border-stone-200 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">使用 Google 帳號登入</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleLogin("github")}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-4 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:brightness-125 transition-all disabled:opacity-50 group"
          >
            {isLoading === "github" ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">使用 GitHub 帳號登入</span>
              </>
            )}
          </button>

          <div className="relative py-8 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-stone-100" />
            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">通訊協議同步 / Protocol Sync</span>
            <div className="flex-1 h-[1px] bg-stone-100" />
          </div>

          <button
            onClick={() => handleLogin("email")}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-4 bg-matte-enterprise border border-stone-100 text-stone-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:border-stone-200 hover:text-black transition-all disabled:opacity-50 group"
          >
            {isLoading === "email" ? (
              <div className="w-4 h-4 border-2 border-stone-200 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Mail className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:translate-x-1 transition-transform">企業身份驗證登入</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest leading-loose">
            訪問此終端即表示您同意<br />
            <a href="#" className="text-stone-400 hover:text-black underline underline-offset-4 transition-colors">永續服務條款</a>
            &nbsp;與&nbsp;
            <a href="#" className="text-stone-400 hover:text-black underline underline-offset-4 transition-colors">5T 隱私協議</a>
          </p>
          <div className="flex justify-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 rounded-full bg-black" />
            <div className="w-1 h-1 rounded-full bg-black" />
            <div className="w-1 h-1 rounded-full bg-black" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
