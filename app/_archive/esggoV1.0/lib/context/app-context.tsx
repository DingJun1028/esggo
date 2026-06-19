"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useEternalMemory } from "@/hooks/use-eternal-memory-store";
import { User } from "firebase/auth";
import { GetCurrentUserData } from "@dataconnect/generated";

type Language = "zh" | "en" | "ja";

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOmniOpen: boolean;
  setIsOmniOpen: (isOpen: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isDailyBriefingOpen: boolean;
  setIsDailyBriefingOpen: (isOpen: boolean) => void;
  dataIntegrityPoints: number;
  setDataIntegrityPoints: React.Dispatch<React.SetStateAction<number>>;
  complianceTokens: number;
  setComplianceTokens: React.Dispatch<React.SetStateAction<number>>;
  savedDrafts: Record<string, { content: string; lastModified: number; status?: "modifying" | "modified" | "submitted" }>;
  setSavedDrafts: React.Dispatch<React.SetStateAction<Record<string, { content: string; lastModified: number; status?: "modifying" | "modified" | "submitted" }>>>;
  collectedIntel: any[];
  setCollectedIntel: React.Dispatch<React.SetStateAction<any[]>>;
  // Professional Analytical Metrics
  analyticalMetrics: {
    systemHarmony: number;
    dataPurity: number;
    governanceWisdom: number;
    ecosystemCoordination: number;
  };
  updateAnalyticalMetric: (metric: "systemHarmony" | "dataPurity" | "governanceWisdom" | "ecosystemCoordination", increment: number) => void;
  isGreenComputingMode: boolean;
  setIsGreenComputingMode: (enabled: boolean) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  // Firebase Auth State
  user: User | null;
  fdcUser: GetCurrentUserData['user'] | null;
  authLoading: boolean;
  activePersonaId: string;
  setActivePersonaId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("daily-briefing"); // Default to dashboard
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOmniOpen, setIsOmniOpen] = useState(false);
  const [lang, setLang] = useState<Language>("zh");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState(false);

  // Omni Memory (Zustand)
  const {
    activePersonaId,
    dataIntegrityPoints,
    complianceTokens,
    engrave
  } = useEternalMemory();

  // Shadow setters for backward compatibility if needed, or direct mapping
  const setActivePersonaId = (id: string) => engrave('activePersonaId', id);
  const setDataIntegrityPoints = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(dataIntegrityPoints) : val;
    engrave('dataIntegrityPoints', nextVal);
  };
  const setComplianceTokens = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(complianceTokens) : val;
    engrave('complianceTokens', nextVal);
  };

  // Firebase Auth
  const { user, fdcUser, loading: authLoading } = useAuth();

  // State initialization with localStorage
  const [savedDrafts, setSavedDrafts] = useState<Record<string, { content: string; lastModified: number; status?: "modifying" | "modified" | "submitted" }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("esggo_savedDrafts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved drafts", e);
        }
      }
    }
    return {};
  });

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("esggo_geminiApiKey");
      if (stored) return stored;
    }
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  });

  const [collectedIntel, setCollectedIntel] = useState<any[]>([]);
  const [isGreenComputingMode, setIsGreenComputingMode] = useState(false);

  const [analyticalMetrics, setAnalyticalMetrics] = useState({
    systemHarmony: 0,
    dataPurity: 0,
    governanceWisdom: 0,
    ecosystemCoordination: 0,
  });

  // Persistence effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("esggo_geminiApiKey", geminiApiKey);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("esggo_savedDrafts", JSON.stringify(savedDrafts));
    }
  }, [savedDrafts]);

  const updateAnalyticalMetric = (metric: keyof typeof analyticalMetrics, increment: number) => {
    setAnalyticalMetrics(prev => ({
      ...prev,
      [metric]: Math.min(100, Math.max(0, prev[metric] + increment))
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        isOmniOpen,
        setIsOmniOpen,
        lang,
        setLang,
        showNotifications,
        setShowNotifications,
        isDailyBriefingOpen,
        setIsDailyBriefingOpen,
        dataIntegrityPoints,
        setDataIntegrityPoints,
        complianceTokens,
        setComplianceTokens,
        savedDrafts,
        setSavedDrafts,
        collectedIntel,
        setCollectedIntel,
        analyticalMetrics,
        updateAnalyticalMetric,
        isGreenComputingMode,
        setIsGreenComputingMode,
        geminiApiKey,
        setGeminiApiKey,
        user,
        fdcUser,
        authLoading,
        activePersonaId,
        setActivePersonaId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
