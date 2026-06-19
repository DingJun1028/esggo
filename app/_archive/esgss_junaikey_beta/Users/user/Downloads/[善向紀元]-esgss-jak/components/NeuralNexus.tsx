
import React, { useEffect, useState, useRef } from 'react';
import { universalIntelligence } from '../services/evolutionEngine';
import { NeuralSignal } from '../types';

interface Particle {
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    vx: number;
    vy: number;
    life: number;
}

/**
 * NeuralNexus (神經聯結點)
 * 全域覆蓋層，視覺化系統內的訊號流動與群體共識。
 */
export const NeuralNexus: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const sub = universalIntelligence.neuralPulse$.subscribe(signal => {
            spawnParticles(signal);
        });
        return () => sub.unsubscribe();
    }, []);

    const spawnParticles = (signal: NeuralSignal) => {
        const count = Math.floor(signal.intensity * 20);
        const newParticles: Particle[] = [];
        
        // Spawn from random screen edges or specific module zones if mapped
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        
        if (side === 0) { startX = Math.random() * window.innerWidth; startY = -20; }
        else if (side === 1) { startX = window.innerWidth + 20; startY = Math.random() * window.innerHeight; }
        else if (side === 2) { startX = Math.random() * window.innerWidth; startY = window.innerHeight + 20; }
        else { startX = -20; startY = Math.random() * window.innerHeight; }

        const colorMap = {
            DATA_COLLISION: 'rgba(16, 185, 129, 0.6)',  // Emerald
            LOGIC_RESONANCE: 'rgba(139, 92, 246, 0.6)', // Purple
            ENTROPY_PURGE: 'rgba(251, 191, 36, 0.6)',   // Gold
            RUNE_ACTIVATION: 'rgba(59, 130, 246, 0.6)'  // Blue
        };

        const color = colorMap[signal.type] || 'rgba(255, 255, 255, 0.5)';

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: `${signal.id}-${i}`,
                x: startX,
                y: startY,
                size: Math.random() * 3 + 1,
                color,
                opacity: 1,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0
            });
        }
        setParticles(prev => [...prev, ...newParticles].slice(-100));
    };

    useEffect(() => {
        let frame: number;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const update = () => {
            setParticles(prev => 
                prev.map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    opacity: p.opacity - 0.01,
                    life: p.life - 0.01
                })).filter(p => p.life > 0)
            );
            
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace('0.6', p.opacity.toString());
                ctx.fill();
                
                // Add a faint trail
                if (p.life > 0.5) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
                    ctx.strokeStyle = p.color.replace('0.6', (p.opacity * 0.2).toString());
                    ctx.stroke();
                }
            });

            frame = requestAnimationFrame(update);
        };

        update();
        return () => cancelAnimationFrame(frame);
    }, [particles]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-[200] opacity-50"
        />
    );
};
