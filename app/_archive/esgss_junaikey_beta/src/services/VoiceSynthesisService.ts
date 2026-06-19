import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import { behaviorSubject } from '../utils/rx-utils.js'; // Assuming rx-utils exists or similar state management

// Types
export interface IVoiceState {
  isSupported: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

class VoiceSynthesisService {
  private synthesis: SpeechSynthesis | null = null;
  private state = behaviorSubject<IVoiceState>({
    isSupported: false,
    isPlaying: false,
    isMuted: false,
    volume: 1.0,
    voices: [],
    selectedVoice: null,
  });

  private utteranceQueue: string[] = [];
  private isProcessing = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;

      // Initialize support
      this.updateState({ isSupported: true });

      // Load voices (handles async loading in some browsers)
      this.loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      console.warn('⚠️ [VoiceSynthesis] Web Speech API not supported in this environment.');
    }
  }

  // --- Public API ---

  public getState() {
    return this.state.getValue();
  }

  public subscribe(callback: (state: IVoiceState) => void) {
    return this.state.subscribe(callback);
  }

  public speak(text: string, priority: boolean = false) {
    const { isSupported, isMuted } = this.state.getValue();
    if (!isSupported || isMuted || !this.synthesis) return;

    // If priority, cancel current and speak immediately
    if (priority) {
      this.cancel();
      this.utteranceQueue = [text];
      this.processQueue();
    } else {
      this.utteranceQueue.push(text);
      if (!this.isProcessing) {
        this.processQueue();
      }
    }
  }

  public cancel() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.utteranceQueue = [];
      this.isProcessing = false;
      this.updateState({ isPlaying: false });
    }
  }

  public toggleMute() {
    // Resume audio context if needed (browser policy)
    const newState = !this.state.getValue().isMuted;
    this.updateState({ isMuted: newState });
    if (newState) {
      this.cancel();
    } else {
      this.speak('Voice systems online.');
    }
    return newState;
  }

  public setVolume(volume: number) {
    this.updateState({ volume: Math.max(0, Math.min(1, volume)) });
  }

  // --- Private Logic ---

  private loadVoices() {
    if (!this.synthesis) return;

    const voices = this.synthesis.getVoices();

    // Priority: Chinese Taiwan Male Voices -> Chinese Taiwan Generic -> English Fallback
    // Common TW Male Voices: "Microsoft Zhiwei", "Google 國語（臺灣）" (check gender?)
    // Note: 'Google 國語（臺灣）' is often female-sounding, but let's prioritize "TW" first.
    // 'Microsoft Zhiwei Online (Natural) - Chinese (Taiwan)' is Male.

    const preferredVoice =
      voices.find(v => v.lang === 'zh-TW' && (v.name.includes('Zhiwei') || v.name.includes('YunJhe'))) ||
      voices.find(v => v.lang === 'zh-TW' && v.name.includes('Male')) ||
      voices.find(v => v.lang === 'zh-TW') ||
      voices.find(v => v.lang === 'zh-HK') ||
      voices.find(v => v.lang === 'zh-CN') ||
      voices.find(v => v.name.includes('Google US English')) ||
      voices[0];

    this.updateState({
      voices,
      selectedVoice: preferredVoice || null,
    });
  }

  private processQueue() {
    if (this.utteranceQueue.length === 0) {
      this.isProcessing = false;
      this.updateState({ isPlaying: false });
      return;
    }

    this.isProcessing = true;
    this.updateState({ isPlaying: true });

    const text = this.utteranceQueue.shift();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const { selectedVoice, volume } = this.state.getValue();

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.volume = volume;
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch

    utterance.onend = () => {
      this.processQueue();
    };

    utterance.onerror = e => {
      omniLogger.error(LogCategory.SYSTEM, '[VoiceSynthesisService] [VoiceSynthesis] Error:', { error: e });
      this.processQueue();
    };

    this.synthesis?.speak(utterance);
  }

  private updateState(partial: Partial<IVoiceState>) {
    this.state.next({ ...this.state.getValue(), ...partial });
  }
}

export const voiceSynthesis = new VoiceSynthesisService();
