import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Cpu, Satellite } from 'lucide-react';

interface HeroSectionProps {
  onLaunchSystem: () => void;
  onExplorePlatform: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchSystem,
  onExplorePlatform,
}) => {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center text-center select-none">
      {/* Top Centered Badge Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-mono font-medium shadow-sm mb-8 hover:border-emerald-500/50 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="tracking-wide uppercase text-[11px]">
          SIH 2026 CORE ENTRY &bull; PS SIH26012
        </span>
      </div>

      {/* Main Bold, Punchy, Tightly Spaced H1 Headline matching screenshot & brief */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight font-sans leading-[1.08] max-w-4xl">
        One Network.
        <br />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          Smarter Cadastre &amp; Rescue.
        </span>
      </h1>

      {/* Subtitle text with high legibility */}
      <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
        Automating urban parcel mapping, 3D aerial telemetry, and verified ground-truthing using autonomous drone AI and tamper-evident spatial consensus.
      </p>

      {/* Two Clean Pill-Shaped CTA Buttons side-by-side */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onLaunchSystem}
          className="rounded-full px-7 py-3 text-sm font-bold bg-white hover:bg-slate-200 text-slate-950 flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all hover:scale-105 active:scale-95"
        >
          <span>LAUNCH SYSTEM</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>

        <button
          onClick={onExplorePlatform}
          className="rounded-full px-7 py-3 text-sm font-semibold bg-transparent hover:bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all active:scale-95"
        >
          <span>EXPLORE PLATFORM</span>
        </button>
      </div>

      {/* Low-Contrast Technical Telemetry Footer Cards (placed cleanly below hero CTA) */}
      <div className="mt-16 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-left">
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
            <Satellite className="w-3.5 h-3.5" />
            <span className="font-bold text-[10px]">CORS RTK</span>
          </div>
          <div className="text-white font-bold text-sm">± 0.02 m</div>
          <div className="text-[10px] text-slate-500">Centimeter Fix</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-bold text-[10px]">AI SEGMENTER</span>
          </div>
          <div className="text-white font-bold text-sm">98.4% Acc</div>
          <div className="text-[10px] text-slate-500">SegFormer + HiSup</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold text-[10px]">TOPOLOGY</span>
          </div>
          <div className="text-white font-bold text-sm">0 Gaps</div>
          <div className="text-[10px] text-slate-500">PostGIS Shared-Edge</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span className="font-bold text-[10px]">ULPIN CARDS</span>
          </div>
          <div className="text-white font-bold text-sm">Bhu-Aadhaar</div>
          <div className="text-[10px] text-slate-500">14-Digit Standard</div>
        </div>
      </div>
    </section>
  );
};
