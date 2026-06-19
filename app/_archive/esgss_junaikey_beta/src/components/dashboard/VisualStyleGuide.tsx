import React from 'react';
import {
  BlurOn,
  Palette,
  MatchWord,
  Opacity,
  Widgets,
  AutoAwesome,
  VerifiedUser,
  Code,
  Share,
  Terminal,
  TextFields,
  BlurLinear,
  Layers,
  Search,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * 🎨 Visual & Style Guide (v0.1)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" Branding Handbook.
 * Codifies all design tokens, components, and interaction laws for JunAiKey.
 */
export const VisualStyleGuide = () => {
  return (
    <div className="bg-[#102221] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed top-[-10%] left-[-5%] size-[40%] bg-[#0df2df]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] size-[30%] bg-[#0df2df]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-3xl bg-[#102221]/60 border-b border-white/5 px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="size-11 flex items-center justify-center rounded-xl bg-[#0df2df] text-[#102221] shadow-[0_0_15px_rgba(13,242,223,0.5)]">
              <BlurOn className="font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter leading-none">
                ESGss JunAiKey
              </h2>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#0df2df]/80 mt-1 italic">
                Visual Identity v0.1
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            {['Colors', 'Typography', 'Components', 'Glass Specs'].map(item => (
              <a
                key={item}
                className="text-[11px] font-black uppercase tracking-widest hover:text-[#0df2df] transition-colors cursor-pointer"
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black uppercase italic">DingJun Hong</p>
              <p className="text-[10px] text-[#0df2df]/60 font-black tracking-widest uppercase italic">
                System Architect
              </p>
            </div>
            <div
              className="size-11 rounded-full bg-cover bg-center border-2 border-[#0df2df]/30 ring-4 ring-black/40"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
              }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 p-10 relative z-10">
        {/* Side Navigation */}
        <aside className="hidden lg:flex w-72 flex-col gap-6">
          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 sticky top-32 shadow-2xl">
            <h3 className="mb-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#0df2df]/60 italic">
              Documentation Hub
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { icon: Palette, label: 'Core Colors', active: true },
                { icon: MatchWord, label: 'Typography' },
                { icon: Opacity, label: 'Liquid Glass' },
                { icon: Widgets, label: 'UI Components' },
                { icon: AutoAwesome, label: 'Motion & FX' },
              ].map((link, i) => (
                <button
                  key={i}
                  className={`flex items-center gap-5 rounded-2xl px-5 py-4 transition-all group ${link.active ? 'bg-[#0df2df]/10 text-[#0df2df] border border-[#0df2df]/20 shadow-inner' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                >
                  <link.icon
                    className={`text-xl group-hover:scale-110 transition-transform ${link.active ? 'drop-shadow-[0_0_5px_#0df2df]' : ''}`}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-[#0df2df]/5 border border-[#0df2df]/10 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest italic text-white/30 mb-2">
                Build: STABLE v0.1.4
              </p>
              <div className="flex justify-center gap-1">
                <div className="size-1 rounded-full bg-[#0df2df] animate-pulse" />
                <div className="size-1 rounded-full bg-[#0df2df] animate-pulse delay-75" />
                <div className="size-1 rounded-full bg-[#0df2df] animate-pulse delay-150" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-12 pb-32">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-[3rem] backdrop-blur-3xl bg-white/[0.03] border border-[#0df2df]/20 shadow-3xl">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('https://api.readyplayer.me/v1/assets/9482d8d8-7b9c-47fc-8f6b-77e84128f6d6')",
              }}
            />
            <div className="relative z-10 flex flex-col gap-8 p-16 md:p-24 overflow-hidden">
              {/* Decorative Gradient Sweep */}
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#0df2df]/20 to-transparent blur-[120px] pointer-events-none" />

              <div className="inline-flex items-center gap-3 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#0df2df] italic w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0df2df] animate-ping" />
                Design System Handbook
              </div>
              <h1 className="max-w-4xl text-6xl font-black leading-none tracking-tighter md:text-8xl italic uppercase text-white">
                Visual & Style{' '}
                <span className="text-[#0df2df] block mt-4 drop-shadow-[0_0_20px_#0df2df40]">
                  Guide v1.0
                </span>
              </h1>
              <p className="max-w-xl text-xl text-white/40 leading-relaxed font-light italic tracking-tight text-justify">
                A futuristic aesthetic handbook defining the Tiffany Blue Liquid Glass interface
                standards for the next generation of ESG analytical tools and blockchain-ready
                identity protocols.
              </p>
              <div className="flex flex-wrap gap-6 pt-8">
                <button className="flex items-center justify-center rounded-2xl bg-[#0df2df] px-12 py-5 text-sm font-black text-[#102221] transition-all hover:scale-110 shadow-[0_15px_40px_rgba(13,242,223,0.4)] uppercase tracking-widest active:scale-95">
                  Explore System
                </button>
                <button className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-12 py-5 text-sm font-black text-white backdrop-blur-3xl transition-all hover:bg-white/10 uppercase tracking-widest active:scale-95">
                  Download Assets
                </button>
              </div>
            </div>
          </section>

          {/* Color System Section */}
          <section id="colors" className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-4">
                <span className="w-2 h-8 bg-[#0df2df] rounded-full" /> Core Color System
              </h2>
              <span className="text-[10px] font-black text-[#0df2df] uppercase tracking-[0.3em] italic">
                Brand DNA / UI Tokens
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'Tiffany Cyan',
                  hex: '#0DF2DF',
                  desc: 'Primary brand color. High-emphasis actions and key glowing elements.',
                  primary: true,
                },
                {
                  name: 'Liquid Tint',
                  hex: 'RGBA(13, 242, 223, 0.2)',
                  desc: 'Used for secondary containers, glass refractions, and subtle overlays.',
                  secondary: true,
                },
                {
                  name: 'Deep Obsidian',
                  hex: '#111817',
                  desc: 'The primary background surface. Provides depth and contrast.',
                  dark: true,
                },
                {
                  name: 'Ghost White',
                  hex: '#F8F8F8',
                  desc: 'Standard typography and icon color. Maximum legibility.',
                  light: true,
                },
              ].map((color, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="group flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-[#0df2df]/40"
                >
                  <div
                    className={`h-40 w-full rounded-2xl shadow-inner transition-transform group-hover:scale-95 ${color.primary ? 'bg-[#0df2df] shadow-[0_0_30px_rgba(13,242,223,0.4)]' : color.secondary ? 'bg-[#0df2df]/20 border border-[#0df2df]/40' : color.dark ? 'bg-[#111817] border border-white/5' : 'bg-[#F8F8F8]'}`}
                  />
                  <div className="space-y-3">
                    <h3 className="text-lg font-black italic text-white uppercase tracking-tight">
                      {color.name}
                    </h3>
                    <p className="text-[10px] text-[#0df2df] font-black uppercase tracking-widest italic">
                      {color.hex}
                    </p>
                    <p className="text-[11px] leading-relaxed text-white/30 font-light italic">
                      {color.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Typography & Glass System */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Typography */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                <TextFields className="text-[#0df2df]" />
                <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
                  Typography Hierarchy
                </h2>
              </div>
              <div className="rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.03] p-12 flex flex-col gap-12 border border-white/5 shadow-3xl">
                <div className="space-y-3">
                  <span className="text-[9px] uppercase font-black tracking-[0.4em] text-[#0df2df]/40 italic">
                    Heading 1 / 80px Black
                  </span>
                  <h1 className="text-6xl font-black italic uppercase leading-none text-white tracking-tighter">
                    Modern ESG UI
                  </h1>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] uppercase font-black tracking-[0.4em] text-[#0df2df]/40 italic">
                    Heading 2 / 40px Bold
                  </span>
                  <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                    System Standard v1.0
                  </h2>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] uppercase font-black tracking-[0.4em] text-[#0df2df]/40 italic">
                    Body Text / 16px Light Italic
                  </span>
                  <p className="text-lg font-light italic leading-relaxed text-white/40 tracking-tight text-justify">
                    ESGss JunAiKey uses a custom high-end Traditional Chinese font (Noto Sans TC)
                    paired with Space Grotesk for a technical yet elegant appearance that bridges
                    humanity and AI logic.
                  </p>
                </div>
              </div>
            </div>

            {/* Glass Specs */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                <BlurLinear className="text-[#0df2df]" />
                <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
                  Liquid Glass Spec
                </h2>
              </div>
              <div className="rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.03] p-12 flex flex-col gap-10 border border-[#0df2df]/20 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 size-40 bg-[#0df2df]/5 rounded-full blur-3xl pointer-events-none" />

                {[
                  { label: 'Blur Radius', val: '20px', sub: 'Backdrop Filter', progress: 70 },
                  {
                    label: 'Refraction Opacity',
                    val: '0.18',
                    sub: 'Border Gradient',
                    progress: 18,
                  },
                ].map((spec, i) => (
                  <div key={i} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black italic text-white uppercase">
                          {spec.label}
                        </span>
                        <span className="text-[9px] text-[#0df2df] font-black uppercase tracking-widest italic">
                          {spec.sub}
                        </span>
                      </div>
                      <span className="font-black italic text-[#0df2df] text-xl tracking-tighter">
                        {spec.val}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${spec.progress}%` }}
                        className="h-full bg-[#0df2df] shadow-[0_0_10px_#0df2df]"
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-8 flex gap-6">
                  <div className="flex-1 rounded-[2rem] bg-white/5 p-8 text-center border border-white/10 shadow-xl group">
                    <div className="mb-6 flex justify-center">
                      <div className="size-20 rounded-full bg-gradient-to-br from-[#0df2df]/20 to-transparent border border-[#0df2df]/40 shadow-[0_0_20px_#0df2df20] animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic group-hover:text-white transition-colors">
                      Surface Refraction
                    </span>
                  </div>
                  <div className="flex-1 rounded-[2rem] bg-white/5 p-8 text-center border border-white/10 shadow-xl group">
                    <div className="mb-6 flex justify-center">
                      <div className="size-20 rounded-[1.5rem] bg-[#111817]/80 border border-[#0df2df]/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Layers className="text-[#0df2df]" sx={{ fontSize: '32px' }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic group-hover:text-white transition-colors">
                      Layer Depth FX
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Component Sandbox */}
          <section id="components" className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-4">
                <span className="w-2 h-8 bg-[#0df2df] rounded-full" /> UI Component Sandbox
              </h2>
              <span className="text-[10px] font-black text-[#0df2df] uppercase tracking-[0.3em] italic">
                Live Interactive Previews
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Buttons */}
              <div className="flex flex-col gap-8 rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.03] p-10 border border-white/5 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  01. Buttons & Controls
                </span>
                <div className="flex flex-col gap-5">
                  <button className="w-full h-16 rounded-2xl bg-[#0df2df] text-[#102221] font-black uppercase text-[11px] tracking-widest shadow-[0_10px_25px_rgba(13,242,223,0.3)] active:scale-95 transition-all">
                    Primary Action
                  </button>
                  <button className="w-full h-16 rounded-2xl border-2 border-[#0df2df]/40 bg-[#0df2df]/10 text-[#0df2df] font-black uppercase text-[11px] tracking-widest hover:bg-[#0df2df]/20 active:scale-95 transition-all">
                    Outline Glow
                  </button>
                  <button className="w-full h-16 rounded-2xl bg-white/5 text-white/40 font-black uppercase text-[11px] tracking-widest hover:text-white hover:bg-white/10 active:scale-95 transition-all">
                    Secondary Glass
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-8 rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.03] p-10 border border-white/5 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  02. Intelligent Inputs
                </span>
                <div className="flex flex-col gap-5">
                  <div className="relative group">
                    <input
                      className="w-full h-16 rounded-2xl border border-white/10 bg-black/40 px-6 pr-14 text-[11px] font-black uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:border-[#0df2df]/50 transition-all"
                      placeholder="Search Database..."
                      type="text"
                    />
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0df2df] transition-colors" />
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl bg-[#0df2df]/5 border border-[#0df2df]/20 p-5 shadow-inner">
                    <Verified className="text-[#0df2df]" sx={{ fontSize: '24px' }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#0df2df] uppercase italic tracking-widest">
                        System Verified
                      </span>
                      <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
                        ON-CHAIN VALID
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tracking */}
              <div className="flex flex-col gap-8 rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.03] p-10 border border-white/5 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  03. Telemetry Indicators
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-black/40 border border-white/5 group hover:border-[#0df2df]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-2 rounded-full bg-[#0df2df] animate-ping" />
                      <span className="text-[11px] font-black uppercase tracking-tight text-white italic">
                        Real-time Node
                      </span>
                    </div>
                    <span className="text-[12px] font-black italic text-[#0df2df] tracking-tighter">
                      84% ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-black/40 border border-white/5 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-2 rounded-full bg-white/20" />
                      <span className="text-[11px] font-black uppercase tracking-tight text-white/60 italic">
                        Archived Hub
                      </span>
                    </div>
                    <span className="text-[12px] font-black italic text-white/30 tracking-tighter">
                      OFFLINE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="mt-20 rounded-[3rem] backdrop-blur-3xl bg-white/[0.03] p-16 border-t-[3px] border-[#0df2df]/30 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left shadow-3xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center md:justify-start gap-4 text-[#0df2df] font-black text-2xl uppercase italic tracking-tighter">
                <VerifiedUser sx={{ fontSize: '32px' }} />
                <span>ESGss JunAiKey Elite</span>
              </div>
              <p className="text-[11px] text-white/30 font-black uppercase tracking-widest italic leading-relaxed">
                © 2024 Design System Documentation. All technical laws and aesthetic standards
                Reserved by DingJun Hong and the JunAi Intelligence Group.
              </p>
            </div>
            <div className="flex gap-6">
              {[Code, Share, Terminal].map((icon, idx) => (
                <button
                  key={idx}
                  className="size-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-[#0df2df] hover:text-[#102221] transition-all hover:scale-110 active:scale-95 shadow-xl"
                >
                  <icon.default sx={{ fontSize: '24px' }} />
                </button>
              ))}
            </div>
          </footer>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
