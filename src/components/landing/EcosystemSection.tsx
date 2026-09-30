import React from 'react';
import { 
  Cpu, 
  MapPin, 
  Smartphone, 
  Send, 
  Layers, 
  ShieldCheck, 
  FileCheck2, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface EcosystemSectionProps {
  onNavigateTo: (view: 'COMMAND' | 'DISPATCH' | 'MOBILE_FIELD' | 'REGISTRY') => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onNavigateTo }) => {
  const modules = [
    {
      icon: Layers,
      title: 'Mission Command Center',
      tag: 'DESKTOP WEB-GIS',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      description:
        '3D orthorectified imagery viewer, live drone flight trajectory, Recharts analytics, and planar topology inspection.',
      actionView: 'COMMAND' as const,
      actionText: 'Open Satellite Map',
    },
    {
      icon: Send,
      title: 'Drone Dispatch & Verification',
      tag: 'LOGISTICS & HANDOVER',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      description:
        'Autonomous flight dispatch of cadastral notices, boundary marker pegs, with SMS OTP, digital e-signature, and photo proof.',
      actionView: 'DISPATCH' as const,
      actionText: 'View Dispatch Queue',
    },
    {
      icon: Smartphone,
      title: 'QBuddy Mobile Field GT',
      tag: 'AR TABLET APP',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      description:
        'In-situ augmented reality parcel projection on live streets, CORS RTK 0.02m GNSS lock, and physical parcel QR code plate scanner.',
      actionView: 'MOBILE_FIELD' as const,
      actionText: 'Launch Mobile Tablet',
    },
    {
      icon: FileCheck2,
      title: 'Cadastre & Landowner Registry',
      tag: 'BHU-AADHAAR ULPIN',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      description:
        'Integrated citizen registry, mutation records, deed tracking, tax status, and one-click GeoJSON / CSV exports.',
      actionView: 'REGISTRY' as const,
      actionText: 'Explore Cadastre Ledger',
    },
  ];

  return (
    <section id="ecosystem" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      <div className="flex flex-col items-center text-center mb-12 space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
          END-TO-END CADASTRE ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          The QBuddy Platform Ecosystem.
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Four interconnected subsystems uniting aerial drone sensing, ground-truth consensus, and citizen verification into one unified cadastral pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                    {mod.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {mod.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateTo(mod.actionView)}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-all"
              >
                <span>{mod.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
