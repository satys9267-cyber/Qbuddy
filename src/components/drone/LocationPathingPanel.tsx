import React from 'react';
import { DroneTelemetry, DroneWaypoint, Parcel } from '../../types/cadastre';
import { 
  Navigation, 
  MapPin, 
  Box, 
  ArrowRight, 
  Check, 
  RotateCw, 
  ShieldCheck, 
  Compass,
  Play,
  CornerDownRight
} from 'lucide-react';

interface LocationPathingPanelProps {
  drone: DroneTelemetry;
  waypoints: DroneWaypoint[];
  selectedParcel: Parcel | null;
  onWaypointSelect: (wp: DroneWaypoint) => void;
  onTriggerAction: (action: string) => void;
}

export const LocationPathingPanel: React.FC<LocationPathingPanelProps> = ({
  drone,
  waypoints,
  selectedParcel,
  onWaypointSelect,
  onTriggerAction,
}) => {
  return (
    <div className="h-56 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 flex gap-4 font-mono text-xs select-none shadow-xl shrink-0">
      {/* 1. Location & Coordinates Card */}
      <div className="w-64 bg-slate-900/70 border border-slate-800/90 rounded-lg p-2.5 flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Navigation className="w-3.5 h-3.5 animate-pulse" />
            <span>LOCATION &amp; PATHING</span>
          </div>
          <span className="text-[10px] text-slate-400">GNSS RTK</span>
        </div>

        <div className="space-y-1.5 text-[11px] my-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Latitude:</span>
            <span className="text-cyan-300 font-bold">{drone.lat.toFixed(6)}° N</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Longitude:</span>
            <span className="text-cyan-300 font-bold">{drone.lng.toFixed(6)}° E</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Altitude AGL:</span>
            <span className="text-emerald-400 font-bold">{drone.altitudeAglM} m</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Altitude MSL:</span>
            <span className="text-slate-200">{drone.altitudeMslM} m</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Compass Heading:</span>
            <span className="text-amber-400 font-bold">{drone.headingDeg}° SE</span>
          </div>
        </div>

        {/* Quick flight commands */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800">
          <button
            onClick={() => onTriggerAction('HOVER_SCAN')}
            className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 rounded text-[10px] text-cyan-300 font-bold transition-colors text-center"
          >
            HOVER &amp; SCAN
          </button>
          <button
            onClick={() => onTriggerAction('RETURN_HOME')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[10px] text-slate-300 font-bold transition-colors text-center"
          >
            RETURN HOME
          </button>
        </div>
      </div>

      {/* 2. 3D Spline Pathing Diagram & Waypoints (Matching Video 1) */}
      <div className="flex-1 bg-slate-900/70 border border-slate-800/90 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            3D WAYPOINT TRAJECTORY ({waypoints.length} WAYPOINTS)
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            MISSION PROGRESS: 50%
          </span>
        </div>

        {/* Horizontal Waypoint sequence pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {waypoints.map((wp) => {
            const isActive = wp.status === 'ACTIVE';
            const isCompleted = wp.status === 'COMPLETED';

            return (
              <div
                key={wp.id}
                onClick={() => onWaypointSelect(wp)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all flex flex-col gap-0.5 ${
                  isActive
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)] scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[11px]">WP-{wp.index}</span>
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {wp.action.replace('_', ' ')}
                </div>
                <div className="text-[8px] text-slate-500 font-mono">
                  {wp.alt}m | {wp.speedKmh}km/h
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive 3D Trajectory Curve visualization preview */}
        <div className="h-14 bg-slate-950/90 rounded border border-slate-800 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
            {/* Height contour grid lines */}
            <line x1="0" y1="15" x2="400" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="35" x2="400" y2="35" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
            
            {/* Spline Path */}
            <path
              d="M 20 45 C 80 15, 120 40, 180 20 S 280 40, 380 15"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
            {/* Waypoint dots */}
            <circle cx="20" cy="45" r="4" fill="#10b981" />
            <circle cx="100" cy="27" r="4" fill="#10b981" />
            <circle cx="180" cy="20" r="5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="260" cy="34" r="4" fill="#f59e0b" />
            <circle cx="340" cy="22" r="4" fill="#64748b" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[8px] text-slate-500 font-mono">
            3D ELEVATION CORRIDOR (NAKSHA STANDARD)
          </span>
        </div>
      </div>

      {/* 3. Polygo Model & Cadastral Topology Inspector (Matching Video 1) */}
      <div className="w-72 bg-slate-900/70 border border-slate-800/90 rounded-lg p-2.5 flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>POLYGO MODEL</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            VALID
          </span>
        </div>

        {/* 3D Wireframe Cube Illustration */}
        <div className="relative h-20 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-center overflow-hidden">
          <svg className="w-24 h-20" viewBox="0 0 100 80">
            {/* 3D Isometric Wireframe Box */}
            <polygon points="50,10 85,25 50,40 15,25" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="1.2" />
            <polygon points="15,25 50,40 50,70 15,55" fill="rgba(0,240,255,0.08)" stroke="#00f0ff" strokeWidth="1.2" />
            <polygon points="50,40 85,25 85,55 50,70" fill="rgba(0,240,255,0.2)" stroke="#00f0ff" strokeWidth="1.2" />
            <circle cx="50" cy="40" r="2" fill="#ffffff" />
          </svg>
          <div className="absolute top-1 left-2 text-[9px] text-cyan-300 font-bold">
            {selectedParcel ? `PARCEL ${selectedParcel.parcelNumber}` : 'INSPECTING TARGET'}
          </div>
        </div>

        {/* Parcel stats readout */}
        <div className="space-y-1 text-[10px] text-slate-300 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Area:</span>
            <span className="text-cyan-300 font-bold">{selectedParcel ? `${selectedParcel.areaSqMeters} m²` : '482.5 m²'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Perimeter:</span>
            <span className="text-slate-200">{selectedParcel ? `${selectedParcel.perimeterMeters} m` : '89.4 m'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Validation:</span>
            <span className="text-emerald-400 font-bold">TOPOLOGY PASS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
