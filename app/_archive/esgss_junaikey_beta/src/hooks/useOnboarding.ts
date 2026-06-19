import { useState, useEffect, useCallback } from 'react';
import { SubscriptionTier, View } from '@/types/core';

interface OnboardingState {
  hasClaimedWelcomePack: boolean;
  hasCompletedGuide: boolean;
  trialExpiry?: number;
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('esgss_onboarding_state');
    return saved
      ? JSON.parse(saved)
      : {
          hasClaimedWelcomePack: false,
          hasCompletedGuide: false,
        };
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    localStorage.setItem('esgss_onboarding_state', JSON.stringify(state));
  }, [state]);

  const startOnboarding = useCallback(() => {
    if (!state.hasClaimedWelcomePack) {
      setShowWelcomeModal(true);
    } else if (!state.hasCompletedGuide) {
      setShowGuide(true);
    }
  }, [state.hasClaimedWelcomePack, state.hasCompletedGuide]);

  const claimWelcomePack = useCallback(() => {
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    setState(prev => ({
      ...prev,
      hasClaimedWelcomePack: true,
      trialExpiry: expiry,
    }));
    setShowWelcomeModal(false);
    setShowGuide(true); // Automatically start guide after claiming
  }, []);

  const completeGuide = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasCompletedGuide: true,
    }));
    setShowGuide(false);
  }, []);

  const isTrialActive = state.trialExpiry ? Date.now() < state.trialExpiry : false;

  return {
    showWelcomeModal,
    setShowWelcomeModal,
    showGuide,
    setShowGuide,
    state,
    startOnboarding,
    claimWelcomePack,
    completeGuide,
    isTrialActive,
  };
};
