import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music as MusicIcon,
    Volume2,
    VolumeX,
    Sliders,
    Play,
    Square,
    Activity,
    Wind,
    Globe,
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 💡 Phase 32: Sentient Symphony (Generative Audio Soundscapes)
 * 核心：使用 Web Audio API 生成即時音頻，並用 Canvas 視覺化 (Cymatics)。
 * 注意：瀏覽器需要使用者互動才能啟動 AudioContext。
 */

// --- Types ---
interface IAudioTrack {
    id: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
    label: string;
    icon: React.ElementType;
    volume: number; // 0-100
    isMuted: boolean;
    frequency: number; // Base Hz
    waveType: OscillatorType;
}

const SentientSymphonyPage = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [tracks, setTracks] = useState<IAudioTrack[]>([
        { id: 'ENVIRONMENT', label: 'ENV (Bass)', icon: Wind, volume: 80, isMuted: false, frequency: 110, waveType: 'sine' },
        { id: 'SOCIAL', label: 'SOC (Melody)', icon: Globe, volume: 60, isMuted: false, frequency: 440, waveType: 'triangle' },
        { id: 'GOVERNANCE', label: 'GOV (Rhythm)', icon: ShieldCheck, volume: 90, isMuted: false, frequency: 220, waveType: 'square' },
    ]);

    // Audio Nodes Refs (to update continuously)
    const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
    const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
    const analyserRef = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    // --- Audio Logic ---

    const initAudio = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.connect(ctx.destination);

        analyserRef.current = analyser;
        setAudioContext(ctx);
        return { ctx, analyser };
    };

    const startAudio = () => {
        let ctx = audioContext;
        let analyser = analyserRef.current;

        if (!ctx) {
            const init = initAudio();
            ctx = init.ctx;
            analyser = init.analyser;
        }

        if (ctx?.state === 'suspended') {
            ctx.resume();
        }

        // Create Oscillators for each track
        tracks.forEach(track => {
            if (!ctx || !analyser) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = track.waveType;
            osc.frequency.setValueAtTime(track.frequency, ctx.currentTime);

            // LFO for "Breathing" effect
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.5; // 0.5 Hz
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 50;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            // Connect
            osc.connect(gain);
            gain.connect(analyser); // Connect to Master/Analyser

            // Initial Volume
            gain.gain.setValueAtTime(track.isMuted ? 0 : track.volume / 100 * 0.1, ctx.currentTime);

            osc.start();

            oscillatorsRef.current.set(track.id, osc);
            gainNodesRef.current.set(track.id, gain);
        });

        setIsPlaying(true);
        drawVisualizer();
    };

    const stopAudio = () => {
        oscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorsRef.current.clear();
        gainNodesRef.current.clear();
        setIsPlaying(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const updateVolume = (id: string, vol: number) => {
        setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: vol } : t));
        const gainNode = gainNodesRef.current.get(id);
        const track = tracks.find(t => t.id === id);
        if (gainNode && track && !track.isMuted) {
            gainNode.gain.setTargetAtTime(vol / 100 * 0.1, audioContext!.currentTime, 0.1);
        }
    };

    const toggleMute = (id: string) => {
        let isNowMuted = false;
        setTracks(prev => prev.map(t => {
            if (t.id === id) {
                isNowMuted = !t.isMuted;
                return { ...t, isMuted: isNowMuted };
            }
            return t;
        }));

        const gainNode = gainNodesRef.current.get(id);
        const track = tracks.find(t => t.id === id);
        if (gainNode && track) {
            const targetVol = isNowMuted ? 0 : track.volume / 100 * 0.1;
            gainNode.gain.setTargetAtTime(targetVol, audioContext!.currentTime, 0.1);
        }
    };

    // --- Visualizer (Cymatics Simulation) ---
    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            analyserRef.current!.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = Math.min(cx, cy) - 20;

            // Draw Geometric Pattern (Mandala)
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#eab308'; // Gold (Cymatics style)
            ctx.beginPath();

            for (let i = 0; i < bufferLength; i++) {
                const amp = dataArray[i] || 0;
                const angle = (i / bufferLength) * Math.PI * 2;

                // Radius modulated by frequency amplitude & harmonics
                const r = radius * 0.2 + (amp / 255.0) * radius * 0.8;

                // Create symmetry (4-fold)
                for (let k = 0; k < 4; k++) {
                    const symAngle = angle + (Math.PI / 2) * k;
                    const x = cx + Math.cos(symAngle) * r;
                    const y = cy + Math.sin(symAngle) * r;
                    if (i === 0 && k === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();

            // Inner Glow - Safe Array Access
            const midFreq = dataArray[10] || 0;
            ctx.fillStyle = `rgba(234, 179, 8, ${midFreq / 500})`;
            ctx.fill();

            animationFrameRef.current = requestAnimationFrame(render);
        };
        render();
    };

    // --- Resize Canvas ---
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    // --- UI ---

    return (
        <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden flex flex-col">

            {/* Header */}
            <header className="h-24 border-b border-white/10 flex items-center justify-between px-8 z-20 backdrop-blur-md bg-black/40">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <MusicIcon className={`text-yellow-500 w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-[0.2em] text-yellow-100 uppercase">
                                SENTIENT SYMPHONY
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-yellow-500/60" />
                                <span className="text-[10px] text-yellow-500/60 uppercase tracking-widest font-bold">
                                    AUDIO ENGINE: {isPlaying ? 'RUNNING' : 'STANDBY'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={isPlaying ? stopAudio : startAudio}
                        className={`flex items-center space-x-3 px-8 py-3 rounded-full font-black tracking-widest transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)]'}`}
                    >
                        {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isPlaying ? 'STOP ENGINE' : 'HARMONIZE'}</span>
                    </button>
                </div>
            </header>

            {/* Main Visualizer Area */}
            <div className="flex-1 relative" ref={containerRef}>
                <canvas ref={canvasRef} className="absolute inset-0 z-10" />

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center opacity-50">
                            <Activity className="w-16 h-16 mx-auto mb-4 text-white/20" />
                            <p className="tracking-widest text-sm">Awaiting Sonic Activation...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mixer Console */}
            <div className="h-64 bg-[#111] border-t-4 border-yellow-500/20 p-6 z-20">
                <div className="flex items-center space-x-2 mb-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <Sliders className="w-4 h-4" />
                    <span>Resonance Mixer</span>
                </div>

                <div className="flex justify-center space-x-12">
                    {tracks.map(track => (
                        <div key={track.id} className="flex flex-col items-center w-24 space-y-4">

                            {/* Icon & Label */}
                            <div className={`p-3 rounded-full ${track.isMuted ? 'bg-slate-800 text-slate-600' : 'bg-yellow-900/20 text-yellow-400'} transition-colors`}>
                                <track.icon className="w-6 h-6" />
                            </div>

                            {/* Volume Slider (Vertical) */}
                            <div className="h-24 w-2 bg-slate-800 rounded-full relative group cursor-pointer">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-yellow-500 rounded-full transition-all group-hover:bg-yellow-400"
                                    style={{ height: `${track.volume}%` }}
                                />
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={track.volume}
                                    onChange={(e) => updateVolume(track.id, parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-center space-y-1">
                                <span className={`text-[10px] font-mono ${track.isMuted ? 'text-slate-600' : 'text-yellow-200'}`}>{track.label}</span>
                                <button
                                    onClick={() => toggleMute(track.id)}
                                    className={`p-2 rounded hover:bg-white/10 ${track.isMuted ? 'text-red-500' : 'text-slate-400'}`}
                                >
                                    {track.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SentientSymphonyPage;
