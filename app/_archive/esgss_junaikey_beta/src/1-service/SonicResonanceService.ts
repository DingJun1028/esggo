import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 🎵 Sonic Resonance Service
 * --------------------------------------------------
 * [Core] Auditory Sensory Layer
 * [Goal] Provide an immersive ethereal soundscape that reacts to the Sovereign Soul's state.
 */
export class SonicResonanceService {
    private static audioContext: AudioContext | null = null;
    private static masterGain: GainNode | null = null;
    private static isMuted: boolean = false;

    /**
     * Initialize the Sonic Field
     */
    public static init() {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // Low baseline volume

            omniLogger.info(LogCategory.SYSTEM, 'Sonic Resonance Field Initialized');
        } catch (e) {
            omniLogger.error(LogCategory.SYSTEM, 'Sonic Resonance failed to initialize', { error: e });
        }
    }

    /**
     * Play a "Crystallization" chime
     */
    public static playCrystallize() {
        this.playTone(880, 0.5, 'sine'); // A5
        setTimeout(() => this.playTone(1320, 0.8, 'sine'), 100); // E6
    }

    /**
     * Play a "Resonance Shift" sweep
     */
    public static playResonanceShift() {
        this.playTone(220, 1.5, 'triangle', true); // Sweep from A3
    }

    private static playTone(freq: number, duration: number, type: OscillatorType, sweep: boolean = false) {
        if (!this.audioContext || !this.masterGain || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const g = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        if (sweep) {
            osc.frequency.exponentialRampToValueAtTime(freq * 2, this.audioContext.currentTime + duration);
        }

        g.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

        osc.connect(g);
        g.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }

    public static toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
        }
        return this.isMuted;
    }
}
