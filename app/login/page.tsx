"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (provider: string) => {
    setIsLoading(provider);
    // Simulate login delay
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 selection:bg-[#009E9D]/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#009E9D]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#219EBC]/10 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E9D] to-[#00C2A8] flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 relative">
            E
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
            Welcome to ESG GO
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Sign in to access your sustainability dashboard
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleLogin("google")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>

          <button
            onClick={() => handleLogin("github")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#24292F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "github" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Github className="w-5 h-5" />
            )}
            Continue with GitHub
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with email</span>
            </div>
          </div>

          <button
            onClick={() => handleLogin("email")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "email" ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Mail className="w-5 h-5 text-slate-500" />
            )}
            Continue with Email
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-slate-800">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-slate-800">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
