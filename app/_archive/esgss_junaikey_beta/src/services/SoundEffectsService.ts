export class SoundEffectsService {
    private static instance: SoundEffectsService;
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    private constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Default volume
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    public static getInstance(): SoundEffectsService {
        if (!SoundEffectsService.instance) {
            SoundEffectsService.instance = new SoundEffectsService();
        }
        return SoundEffectsService.instance;
    }

    private createOscillator(type: OscillatorType, frequency: number, duration: number, time: number = 0) {
        if (!this.audioContext || !this.masterGain) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime + time);

        gain.gain.setValueAtTime(0, this.audioContext.currentTime + time);
        gain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.audioContext.currentTime + time);
        osc.stop(this.audioContext.currentTime + time + duration);
    }

    public playHover() {
        if (this.isMuted) return;
        // High pitched short "tick"
        this.createOscillator('sine', 800, 0.05);
    }

    public playSelect() {
        if (this.isMuted) return;
        // Ascending chime
        this.createOscillator('sine', 440, 0.1);
        this.createOscillator('sine', 554, 0.1, 0.05);
    }

    public playCardResonate() {
        if (this.isMuted) return;
        // Swell effect
        if (!this.audioContext || !this.masterGain) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 1);

        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 1.5);
    }

    public play5TStep(step: number) {
        if (this.isMuted) return;
        // Digital blip escalating in pitch
        const baseFreq = 440 + (step * 110);
        this.createOscillator('square', baseFreq, 0.1);
    }

    public playSuccess() {
        if (this.isMuted) return;
        // Major chord
        this.createOscillator('sine', 440, 0.5); // A4
        this.createOscillator('sine', 554, 0.5, 0.1); // C#5
        this.createOscillator('sine', 659, 0.5, 0.2); // E5
        this.createOscillator('sine', 880, 0.8, 0.3); // A5 (High)
    }

    public playFailure() {
        if (this.isMuted) return;
        // Dissonant low buzz
        this.createOscillator('sawtooth', 110, 0.3);
        this.createOscillator('sawtooth', 103, 0.3);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

export const soundService = SoundEffectsService.getInstance();
