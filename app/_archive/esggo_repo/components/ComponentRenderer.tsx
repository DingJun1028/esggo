'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrandCard, BrandButton, BrandBadge, BrandStatusDot } from '@/components/brand';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AtomicComponent {
  id: number;
  name: string;
  type: string;
  category: string;
  props_schema: string;
  styles: string;
  description: string;
  is_active: boolean;
}

export interface ToolSpec {
  id: number;
  tool_id: string;
  name: string;
  expert_route: string;
  ui_component: string;
  position_zone: string;
  is_active: boolean;
}

interface ComponentRendererProps {
  zone?: string;
  className?: string;
}

export function ComponentRenderer({ zone, className }: ComponentRendererProps) {
  const [tools, setTools] = useState<ToolSpec[]>([]);
  const [atoms, setAtoms] = useState<AtomicComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDynamicConfig() {
      try {
        const instance = process.env.NEXT_PUBLIC_NCB_INSTANCE || '54686_esggowiki';
        
        // Fetch both tools and components from the public-data API
        const [toolsRes, atomsRes] = await Promise.all([
          fetch(`https://app.nocodebackend.com/api/public-data/${instance}/tools_specs`),
          fetch(`https://app.nocodebackend.com/api/public-data/${instance}/atomic_components`)
        ]);

        const toolsData = await toolsRes.json();
        const atomsData = await atomsRes.json();

        if (toolsData.data) setTools(toolsData.data);
        if (atomsData.data) setAtoms(atomsData.data);
      } catch (error) {
        console.error('Failed to load dynamic components:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDynamicConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 border border-white/10 rounded-[2rem] bg-current/5">
        <LucideIcons.Loader2 className="animate-spin text-cyan-500" size={32} />
        <span className="ml-4 font-mono text-sm tracking-widest uppercase opacity-50">Syncing OmniCore...</span>
      </div>
    );
  }

  // Filter tools by zone if provided
  const activeTools = tools.filter(t => t.is_active && (!zone || t.position_zone === zone));

  if (activeTools.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-12 border border-dashed border-white/20 rounded-[2rem] bg-current/5 gap-4">
        <LucideIcons.Database className="text-emerald-500/50" size={48} />
        <div className="text-center space-y-2">
          <p className="font-mono text-sm tracking-widest uppercase text-emerald-400">Awaiting Dynamic Injection</p>
          <p className="text-xs opacity-50 uppercase">Zone [{zone || 'Global'}] is currently empty. Configure in NCB Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)}>
      {activeTools.map(tool => {
        // Find matching atomic component for UI
        const atom = atoms.find(a => a.name === tool.ui_component && a.is_active);
        
        return (
          <motion.div 
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <BrandCard 
              variant="glass" 
              className={cn(
                "relative overflow-hidden transition-all duration-700 hover:shadow-cyan-500/20 hover:border-cyan-500/40 rounded-[2rem]",
                atom?.styles || "p-8"
              )}
            >
              {/* Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />
              
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <LucideIcons.Cpu size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <BrandStatusDot status="active" pulse size="sm" />
                      <h4 className="font-black uppercase tracking-widest text-sm">{tool.name}</h4>
                    </div>
                    <p className="text-[10px] opacity-40 font-mono mt-1">{tool.tool_id}</p>
                  </div>
                </div>
                {atom && (
                  <BrandBadge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                    {atom.name}
                  </BrandBadge>
                )}
              </div>

              {/* Tool Content / Description */}
              <div className="text-sm opacity-60 mb-8 min-h-[3rem] relative z-10 leading-relaxed">
                {atom?.description || "A dynamic tool component waiting for configuration."}
              </div>

              {/* Tool Action */}
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-current/10 relative z-10">
                <div className="flex items-center gap-2">
                  <LucideIcons.Waypoints size={14} className="text-indigo-400 opacity-70" />
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                    {tool.expert_route || 'Default Route'}
                  </span>
                </div>
                <BrandButton variant="primary" size="sm" className="rounded-full px-6 text-[10px] tracking-widest">
                  Invoke Tool
                </BrandButton>
              </div>
            </BrandCard>
          </motion.div>
        );
      })}
    </div>
  );
}
