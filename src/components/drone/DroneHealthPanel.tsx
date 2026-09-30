import React, { useState } from 'react';
import { DroneTelemetry } from '../../types/cadastre';
import { 
  Battery, 
  Wifi, 
  Video, 
  Thermometer, 
  Disc, 
  Radio, 
  Compass, 
  Flame, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Crosshair
} from 'lucide-react';

interface DroneHealthPanelProps {
  drone: DroneTelemetry;
  onChangeSensorMode: (mode: DroneTelemetry['sensorMode']) => void;
}

export const DroneHealthPanel: React.FC<DroneHealthPanelProps> = ({
  drone,
  onChangeSensorMode,
}) => {
  const [showThermal, setShowThermal] = useState(false);

  return (
    <div className="w-80 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 font-mono text-xs select-none shadow-xl shrink-0 overflow-y-auto max-h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200 tracking-wider text-sm">DRONE HEALTH</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 font-bold">
          {drone.callsign.split(' ')[0]}
        </span>
      </div>

      {/* Connection & Network Status (Matching Video 1) */}
      <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
          <span>Connection Status</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
            99% UPLINK
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Cell Data 5G:</span>
          <span className="text-cyan-400 font-bold">48.2 Mbps (Encrypted)</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">CORS RTK:</span>
          <span className="text-emerald-400 font-bold">{drone.rtkStatus} (±0.02m)</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">GNSS Constellation:</span>
          <span className="text-slate-200">{drone.satellitesLocked} Sats (NavIC+GPS)</span>
        </div>
      </div>

      {/* Dual Battery & Efficiency Gauges (Matching Video 1: 5% & 65% rings) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Battery Capacity Ring */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center justify-center relative">
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
                stroke={drone.batteryPercent > 30 ? '#10b981' : '#ef4444'}
                strokeWidth="5"
                fill="none"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * drone.batteryPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-base font-black text-emerald-300 leading-none">
                {drone.batteryPercent}%
              </span>
              <span className="text-[8px] text-slate-400">{drone.batteryVoltage}V</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 uppercase">Battery Pack</span>
        </div>

        {/* Mission Swarm Routine Ring */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center justify-center relative">
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
                stroke="#00f0ff"
                strokeWidth="5"
                fill="none"
                strokeDasharray="163"
                strokeDashoffset="57"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-base font-black text-cyan-300 leading-none">65%</span>
              <span className="text-[8px] text-slate-400">SWARM RT</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 uppercase">Routine Phase</span>
        </div>
      </div>

      {/* Motor RPMs & Propeller Load */}
      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 text-[10px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="uppercase font-bold">Motor Propulsion RPM</span>
          <span className="text-cyan-400 font-mono">AVG 8,510 RPM</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {drone.motorRpm.map((rpm, idx) => (
            <div key={idx} className="flex flex-col items-center bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-[8px] text-slate-500">M-{idx + 1}</span>
              <span className="text-[10px] text-cyan-300 font-bold font-mono">{rpm}</span>
              {/* Load bar */}
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full" 
                  style={{ width: `${(rpm / 10000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Gimbal Camera HUD (Optical vs Thermal FLIR) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            4K Gimbal Feed
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => {
                setShowThermal(false);
                onChangeSensorMode('OPTICAL_4K');
              }}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                !showThermal ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => {
                setShowThermal(true);
                onChangeSensorMode('THERMAL_FLIR');
              }}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                showThermal ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400'
              }`}
            >
              THERMAL
            </button>
          </div>
        </div>

        {/* Video Screen Simulation */}
        <div className={`relative h-28 rounded overflow-hidden border border-slate-700/80 flex items-center justify-center ${
          showThermal 
            ? 'bg-gradient-to-tr from-purple-900 via-amber-700 to-yellow-400' 
            : 'bg-slate-900'
        }`}>
          {/* Simulated aerial camera texture */}
          {!showThermal ? (
            <div 
              className="absolute inset-0 opacity-40 bg-cover bg-center"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#0284c7 1px, #0f172a 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}
            />
          ) : (
            <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-black" />
          )}

          {/* HUD Reticle Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Crosshair className="w-10 h-10 text-cyan-400/80 animate-pulse stroke-[1.2]" />
            <div className="w-20 h-20 border border-cyan-400/30 rounded-full" />
          </div>

          {/* On-screen telemetry stamp */}
          <div className="absolute top-1.5 left-2 text-[8px] font-mono text-cyan-300 drop-shadow flex flex-col">
            <span>REC [LIVE 60FPS]</span>
            <span>FOV: 84° | PITCH: -60°</span>
          </div>

          <div className="absolute bottom-1.5 right-2 text-[8px] font-mono text-emerald-400 drop-shadow flex flex-col text-right">
            <span>TARGET: PARCEL 18562</span>
            <span>ALT: 120m AGL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
