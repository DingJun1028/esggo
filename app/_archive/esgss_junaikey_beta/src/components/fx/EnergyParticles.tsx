import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
}

interface EnergyParticlesProps {
    isActive: boolean;
    color?: string;
    intensity?: number;
}

/**
 * ✨ EnergyParticles Component
 * High-performance canvas-based particle system for visual flair.
 * Used during 5T verification and Soul Resonance events.
 */
export const EnergyParticles: React.FC<EnergyParticlesProps> = ({
    isActive,
    color = '#63a6b0',
    intensity = 1
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        if (!isActive) {
            particlesRef.current = [];
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize handler
        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + 10,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                size: Math.random() * 3 + 1,
                color,
                life: 1.0
            };
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Add new particles based on intensity
            if (Math.random() < 0.2 * intensity) {
                particlesRef.current.push(createParticle());
            }

            // Update and draw particles
            particlesRef.current.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;
                p.size *= 0.99;

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Remove dead particles
                if (p.life <= 0) {
                    particlesRef.current.splice(index, 1);
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isActive, color, intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />
    );
};
