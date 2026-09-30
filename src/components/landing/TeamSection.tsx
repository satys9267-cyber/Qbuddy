import React from 'react';
import { Award, ShieldCheck, Landmark, CheckCircle2 } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section id="the-team" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none border-t border-slate-900">
      <div className="flex flex-col items-center text-center mb-12 space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
          SMART INDIA HACKATHON 2026
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          The Engineering Team &bull; SIH26012.
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Designed for the Ministry of Rural Development (DoLR) and Survey of India to accelerate the NAKSHA urban cadastral initiative across 152+ Urban Local Bodies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Problem Statement SIH26012</h3>
          <p className="text-xs text-slate-400 mb-3">
            AI-Based Automated Urban Parcel Mapping and Cadastral Feature Extraction System using Drone Imagery.
          </p>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            Organization: Ministry of Rural Development (DoLR)
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Institutional Technical Alignment</h3>
          <p className="text-xs text-slate-400 mb-3">
            Grounded in Survey of India CORS network, Bhuvan / Bhoonidhi satellite archives, and standard 14-digit Bhu-Aadhaar ULPIN assignment.
          </p>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            Standard: DILRMP NAKSHA Framework
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Active Learning &amp; DPDP Act</h3>
          <p className="text-xs text-slate-400 mb-3">
            Field corrections retrain regional vision models. Citizen identity hashes adhere to the Digital Personal Data Protection Act 2023.
          </p>
          <span className="text-[10px] font-mono text-amber-400 font-bold">
            Auditability: SHA-256 Tamper-Proof Logs
          </span>
        </div>
      </div>

      <div className="mt-16 text-center text-xs text-slate-600 font-mono">
        © 2026 QBuddy &bull; Smart India Hackathon Entry &bull; Developed by Team Ventura
      </div>
    </section>
  );
};
