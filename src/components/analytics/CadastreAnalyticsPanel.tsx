import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BatteryCharging, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Layers,
  X
} from 'lucide-react';

// Verification Trends Data over flight timeline (08:00 to 15:00)
const VERIFICATION_TRENDS_DATA = [
  { time: '08:00', aiExtracted: 12, groundTruthed: 2, flagged: 1 },
  { time: '09:00', aiExtracted: 38, groundTruthed: 15, flagged: 3 },
  { time: '10:00', aiExtracted: 74, groundTruthed: 42, flagged: 5 },
  { time: '11:00', aiExtracted: 118, groundTruthed: 84, flagged: 7 },
  { time: '12:00', aiExtracted: 156, groundTruthed: 128, flagged: 10 },
  { time: '13:00', aiExtracted: 198, groundTruthed: 165, flagged: 11 },
  { time: '14:00', aiExtracted: 242, groundTruthed: 215, flagged: 12 },
  { time: '15:00', aiExtracted: 285, groundTruthed: 268, flagged: 14 },
];

// Drone Battery Efficiency Data (% vs minutes, power draw in Watts, flight speed)
const BATTERY_EFFICIENCY_DATA = [
  { minute: 0, battery: 100, powerWatts: 380, speedKmh: 0, efficiencyScore: 98 },
  { minute: 5, battery: 94, powerWatts: 510, speedKmh: 45, efficiencyScore: 96 },
  { minute: 10, battery: 88, powerWatts: 540, speedKmh: 120, efficiencyScore: 94 },
  { minute: 15, battery: 82, powerWatts: 580, speedKmh: 179, efficiencyScore: 92 },
  { minute: 20, battery: 75, powerWatts: 490, speedKmh: 65, efficiencyScore: 95 },
  { minute: 25, battery: 69, powerWatts: 470, speedKmh: 40, efficiencyScore: 97 },
  { minute: 30, battery: 62, powerWatts: 500, speedKmh: 50, efficiencyScore: 95 },
  { minute: 35, battery: 55, powerWatts: 520, speedKmh: 55, efficiencyScore: 93 },
  { minute: 40, battery: 48, powerWatts: 510, speedKmh: 48, efficiencyScore: 94 },
];

// Cadastral Land-Use Composition
const LAND_USE_DATA = [
  { name: 'Residential', value: 54, color: '#06b6d4' },
  { name: 'Commercial', value: 24, color: '#10b981' },
  { name: 'Mixed Use', value: 14, color: '#f59e0b' },
  { name: 'Public Utility', value: 8, color: '#8b5cf6' },
];

interface CadastreAnalyticsPanelProps {
  onClose?: () => void;
  isOpen: boolean;
}

export const CadastreAnalyticsPanel: React.FC<CadastreAnalyticsPanelProps> = ({
  onClose,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'TRENDS' | 'BATTERY' | 'LANDUSE'>('TRENDS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono text-xs select-none">
      <div className="bg-slate-950 border border-cyan-500/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  CADASTRAL ANALYTICS &amp; DRONE FLIGHT TELEMETRY
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RECHARTS DATA ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time parcel extraction velocity, field ground-truth completion rates, and hexacopter battery discharge curves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('TRENDS')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'TRENDS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Parcel Verification Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('BATTERY')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'BATTERY'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>Drone Battery Efficiency Over Time</span>
          </button>

          <button
            onClick={() => setActiveTab('LANDUSE')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LANDUSE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Land Use Composition</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: VERIFICATION TRENDS */}
          {activeTab === 'TRENDS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">TOTAL PARCELS EXTRACTED</span>
                  <span className="text-xl font-bold text-cyan-400">285 Parcels</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">↑ 98.4% AI Accuracy</span>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">GROUND-TRUTHED (RTK GNSS)</span>
                  <span className="text-xl font-bold text-emerald-400">268 Verified</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">94.0% Completion Rate</span>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">FLAGGED FOR FIELD REVIEW</span>
                  <span className="text-xl font-bold text-amber-400">14 Parcels</span>
                  <span className="text-[10px] text-amber-400 mt-1 block">Encroachments &amp; Shadow Discrepancies</span>
                </div>
              </div>

              {/* Area Chart: Verification Velocity */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                    Cumulative Extraction &amp; Field Verification Timeline
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Survey Block: Sector 4</span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VERIFICATION_TRENDS_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="aiExtractedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="groundTruthedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#020617',
                          borderColor: '#38bdf8',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      <Area
                        type="monotone"
                        dataKey="aiExtracted"
                        name="AI Extracted Parcels"
                        stroke="#00f0ff"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#aiExtractedGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="groundTruthed"
                        name="Field Ground-Truthed"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#groundTruthedGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="flagged"
                        name="Flagged / Disputed"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={0.3}
                        fill="#f59e0b"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BATTERY EFFICIENCY */}
          {activeTab === 'BATTERY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">BATTERY DISCHARGE RATE</span>
                  <span className="text-xl font-bold text-emerald-400">1.3% / min</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Nominal 6S LiPo 24.8V</span>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">CRUISING POWER CONSUMPTION</span>
                  <span className="text-xl font-bold text-cyan-400">510 Watts</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">LiDAR + 4K Gimbal Active</span>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">ESTIMATED REMAINING TIME</span>
                  <span className="text-xl font-bold text-amber-400">34 Minutes</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Safe Return to Base (RTL) Guaranteed</span>
                </div>
              </div>

              {/* Line Chart: Battery vs Flight Time & Power Consumption */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                    Battery % &amp; Propulsion Power Draw vs Flight Minutes
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Q-AeroScan X4 Telemetry</span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={BATTERY_EFFICIENCY_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="minute"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        unit="m"
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#10b981"
                        tick={{ fill: '#10b981', fontSize: 11 }}
                        unit="%"
                        domain={[0, 100]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#f59e0b"
                        tick={{ fill: '#f59e0b', fontSize: 11 }}
                        unit="W"
                        domain={[200, 700]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#020617',
                          borderColor: '#10b981',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="battery"
                        name="Battery Level (%)"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981' }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="powerWatts"
                        name="Power Draw (Watts)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="speedKmh"
                        name="Drone Speed (km/h)"
                        stroke="#00f0ff"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAND USE COMPOSITION */}
          {activeTab === 'LANDUSE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pie Chart */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-2">
                    Zoning Distribution Ratio
                  </span>
                  <div className="h-60 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={LAND_USE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {LAND_USE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#020617',
                            borderColor: '#38bdf8',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* List of Breakdown */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-center gap-3">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                    Cadastre Area Breakdown
                  </span>
                  {LAND_USE_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white font-bold">{item.name}</span>
                      </div>
                      <span className="text-cyan-300 font-bold">{item.value}% of surveyed area</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
          <span>Data grounded in Survey of India CORS Network &amp; DILRMP NAKSHA pilot.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
