import React from 'react';
import { DroneTelemetry } from '../../types/cadastre';
import { Activity, Gauge, Cpu, CheckCircle2, Shield, Layers, HardDrive } from 'lucide-react';

interface RealTypeMetricsProps {
  drone: DroneTelemetry;
  totalParcelsCount: number;
  verifiedCount: number;
}

export const RealTypeMetricsPanel: React.FC<RealTypeMetricsProps> = ({
  drone,
  totalParcelsCount,
  verifiedCount,
}) => {
  return (
    <div className="w-72 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 font-mono text-xs select-none shadow-xl shrink-0 overflow-y-auto max-h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200 tracking-wider text-sm">REAL TYPE</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
          RT-TELEMETRY
        </span>
      </div>

      {/* Top Gauges: Speed & Range (Matching Video 1) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Speed Gauge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#1e293b"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#00f0ff"
                strokeWidth="5"
                fill="none"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * Math.min(drone.speedKmh, 200)) / 200}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-cyan-300 leading-none">
                {drone.speedKmh}
              </span>
              <span className="text-[8px] text-slate-400">km/h</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-tight">Drone Velocity</span>
        </div>

        {/* Range Gauge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#1e293b"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="5"
                fill="none"
                strokeDasharray="163"
                strokeDashoffset="35"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-emerald-300 leading-none">200</span>
              <span className="text-[8px] text-slate-400">km</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-tight">Mission Radius</span>
        </div>
      </div>

      {/* Cadastral Scan Telemetry Rows (Matching Video 1) */}
      <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Cadastre coverage:</span>
          <span className="text-cyan-400 font-bold">{(drone.distanceCoveredKm * 0.98).toFixed(4)} km²</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Payload range:</span>
          <span className="text-slate-200">5.3° F stability</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Total area scanned:</span>
          <span className="text-emerald-400 font-bold">2,757.3K m²</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">LiDAR nDSM density:</span>
          <span className="text-slate-200">0.05K pts/m²</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Boundary fence len:</span>
          <span className="text-cyan-300">18.432 km</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Edge confidence:</span>
          <span className="text-emerald-400 font-bold">98.432%</span>
        </div>
      </div>

      {/* AI Extraction & Validation Engine Status */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            AI Extraction Model
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            100% PASS
          </span>
        </div>
        <div className="text-[10px] text-slate-300">
          SegFormer + HiSup Cadastral Edge Segmenter
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-full animate-pulse" />
        </div>
      </div>

      {/* Planar Topology & Node Validation */}
      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[10px] space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>PostGIS Topology:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ST_Polygonize Clean
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Gaps / Overlaps:</span>
          <span className="text-emerald-400 font-bold">0 detected</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Parcels Extracted:</span>
          <span className="text-cyan-300 font-bold">{parcelsCount(totalParcelsCount, verifiedCount)}</span>
        </div>
      </div>
    </div>
  );
};

function parcelsCount(total: number, verified: number) {
  return `${total} (${verified} Ground-Truthed)`;
}
