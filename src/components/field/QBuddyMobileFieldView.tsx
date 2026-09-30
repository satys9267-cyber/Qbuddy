import React, { useState, useEffect } from 'react';
import { Parcel } from '../../types/cadastre';
import confetti from 'canvas-confetti';
import { 
  QrCode, 
  CheckCircle2, 
  Crosshair, 
  Smartphone, 
  Compass, 
  Camera, 
  Layers, 
  Radio, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle,
  Send,
  Upload,
  RefreshCw,
  Eye
} from 'lucide-react';

interface QBuddyMobileFieldViewProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
  onConfirmFieldVerification: (parcelId: string, notes?: string) => void;
}

export const QBuddyMobileFieldView: React.FC<QBuddyMobileFieldViewProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel,
  onConfirmFieldVerification,
}) => {
  const currentParcel = selectedParcel || parcels[0];
  
  // AR & Scanner States matching Video 2
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [qrDetected, setQrDetected] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [arOverlayMode, setArOverlayMode] = useState<'3D_POLYGON' | 'WIRE' | 'OFF'>('3D_POLYGON');
  const [notes, setNotes] = useState('');

  // GNSS Accuracy Simulation (Fluctuates between 0.02m and 0.04m RTK lock)
  const [gnssAccuracy, setGnssAccuracy] = useState('00.34m');

  useEffect(() => {
    const timer = setInterval(() => {
      const acc = (0.02 + Math.random() * 0.02).toFixed(2);
      setGnssAccuracy(`00.${acc.replace('.', '')}m`);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const triggerQrScan = () => {
    setIsScanningQr(true);
    setQrDetected(false);
    setShowConfirmationModal(false);
    setSyncComplete(false);

    // Simulate scanning camera finding the QR code plate after 1.2 seconds
    setTimeout(() => {
      setQrDetected(true);
      setTimeout(() => {
        setIsScanningQr(false);
        setShowConfirmationModal(true);
      }, 700);
    }, 1200);
  };

  const handleSyncToCadastre = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      onConfirmFieldVerification(currentParcel.id, notes || 'Verified with centimeter-level RTK GNSS');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setShowConfirmationModal(false);
        setSyncComplete(false);
      }, 2000);
    }, 1400);
  };

  return (
    <div className="flex-1 bg-slate-950 p-3 sm:p-6 flex flex-col items-center justify-center font-mono text-xs select-none overflow-y-auto">
      {/* Rugged Tablet Housing Frame (Matching Video 2) */}
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col gap-3">
        {/* Rugged Tablet Bumper Accents */}
        <div className="absolute top-2 left-4 w-3 h-3 rounded-full bg-slate-600" />
        <div className="absolute top-2 right-4 w-3 h-3 rounded-full bg-slate-600" />
        <div className="absolute bottom-2 left-4 w-3 h-3 rounded-full bg-slate-600" />
        <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-slate-600" />

        {/* Tablet Top Status Bar */}
        <div className="h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white text-xs tracking-wider">
              QBuddy Mobile
            </span>
            <span className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
              SURVEYOR TABLET
            </span>
          </div>

          {/* GNSS Accuracy HUD (Matching Video 2 circular meter) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-full text-emerald-300 text-[11px] font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>GNSS: {gnssAccuracy} (RTK 0.2m FIX)</span>
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:block">
              SURVEYOR: <b>Character Ana (SOI-2810)</b>
            </div>
          </div>
        </div>

        {/* Tablet Main Screen: Real-World AR Camera View */}
        <div className="relative h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Simulated Street Camera Background Scene */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(2,6,23,0.7) 100%),
                radial-gradient(ellipse at 50% 80%, #334155 0%, #0f172a 100%)`,
            }}
          >
            {/* Perspective street lines */}
            <svg className="w-full h-full absolute inset-0 opacity-40">
              <line x1="100" y1="480" x2="420" y2="220" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 6" />
              <line x1="860" y1="480" x2="540" y2="220" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 6" />
              <line x1="480" y1="480" x2="480" y2="220" stroke="#fbbf24" strokeWidth="2" strokeDasharray="12 8" />
            </svg>
          </div>

          {/* 3D AR Parcel Projection Layer onto the Street (Matching Video 2) */}
          {arOverlayMode !== 'OFF' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 800 480">
                {/* 3D Perspective Cadastral Polygon on the Ground */}
                <polygon
                  points="280,390 520,380 620,280 200,290"
                  fill={
                    currentParcel.validationStatus === 'VERIFIED'
                      ? 'rgba(16, 185, 129, 0.45)'
                      : 'rgba(0, 240, 255, 0.4)'
                  }
                  stroke={
                    currentParcel.validationStatus === 'VERIFIED' ? '#10b981' : '#00f0ff'
                  }
                  strokeWidth="3.5"
                  className="animate-pulse"
                />

                {/* AR Grid overlay on the parcel */}
                <line x1="280" y1="390" x2="620" y2="280" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                <line x1="520" y1="380" x2="200" y2="290" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

                {/* 4 Corner RTK Peg Markers */}
                <circle cx="280" cy="390" r="5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
                <circle cx="520" cy="380" r="5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
                <circle cx="620" cy="280" r="5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
                <circle cx="200" cy="290" r="5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />

                {/* In-ground floating holographic text */}
                <text
                  x="400"
                  y="340"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  PARCEL {currentParcel.parcelNumber} (ACCURACY: 0.03m)
                </text>
              </svg>
            </div>
          )}

          {/* QR Code Detection Crosshairs (Video 2 animation) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isScanningQr && (
              <div className="relative flex flex-col items-center justify-center">
                {/* Glowing green QR detection reticle */}
                <div
                  className={`w-52 h-52 border-2 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    qrDetected
                      ? 'border-emerald-400 bg-emerald-500/20 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.6)]'
                      : 'border-cyan-400 bg-cyan-500/10'
                  }`}
                >
                  <QrCode
                    className={`w-28 h-28 ${
                      qrDetected ? 'text-emerald-300 animate-bounce' : 'text-cyan-400 animate-pulse'
                    }`}
                  />
                  {/* Laser scan line sweep */}
                  <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                </div>
                <span className="mt-3 px-3 py-1 bg-slate-950/90 border border-emerald-500 text-emerald-300 rounded font-bold text-xs">
                  {qrDetected ? 'PARCEL QR LOCKED' : 'SCANNING PARCEL QR PLATE...'}
                </span>
              </div>
            )}
          </div>

          {/* Top AR Controls bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            {/* Parcel selector pill */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white flex items-center gap-2 shadow-lg">
              <span className="text-slate-400">Target:</span>
              <select
                value={currentParcel.id}
                onChange={(e) => {
                  const p = parcels.find((item) => item.id === e.target.value);
                  if (p) onSelectParcel(p);
                }}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    Parcel #{p.parcelNumber} ({p.landUse})
                  </option>
                ))}
              </select>
            </div>

            {/* AR Mode & Camera Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setArOverlayMode(
                    arOverlayMode === '3D_POLYGON' ? 'WIRE' : arOverlayMode === 'WIRE' ? 'OFF' : '3D_POLYGON'
                  )
                }
                className="px-2.5 py-1.5 bg-slate-950/90 hover:bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>AR: {arOverlayMode}</span>
              </button>

              <button
                onClick={triggerQrScan}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Parcel QR</span>
              </button>
            </div>
          </div>

          {/* Bottom HUD Bar in Camera: Accuracy, Offset & Surveyor Check */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 flex items-center gap-4 text-xs shadow-lg">
              <div>
                <span className="text-slate-400 block text-[9px]">AI BOUNDARY OFFSET</span>
                <span className="text-emerald-400 font-bold">±0.03m (PASSED)</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[9px]">SURVEY STATUS</span>
                <span
                  className={`font-bold ${
                    currentParcel.validationStatus === 'VERIFIED'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {currentParcel.validationStatus}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmationModal(true)}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify &amp; Ground Truth</span>
            </button>
          </div>

          {/* Modal: Instant Boundary Confirmation (Direct Match to Video 2 at timestamp 00:15!) */}
          {showConfirmationModal && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-950 border-2 border-emerald-500/80 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                {/* Modal Title matching Video 2 */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-sm font-bold tracking-wide">
                      Instant Boundary Confirmation
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Table Breakdown matching Video 2 */}
                <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Parcel ID:</span>
                    <span className="text-cyan-300 font-bold">{currentParcel.parcelNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Surveyor:</span>
                    <span className="text-slate-200 font-bold">Character Ana</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Survey Code:</span>
                    <span className="text-slate-200 font-mono">287044</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Delimitation:</span>
                    <span className="text-slate-200 font-mono">2010.7-24-3.54</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GNSS Accuracy:</span>
                    <span className="text-emerald-400 font-bold font-mono">60ms (±0.03m RTK)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Owner Name:</span>
                    <span className="text-white font-bold">{currentParcel.owner.name}</span>
                  </div>
                </div>

                {/* Surveyor Notes & Field Observation */}
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">
                    FIELD GROUND-TRUTHING OBSERVATION:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Boundary compound wall verified. No encroachment."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Sync Action Area */}
                {syncComplete ? (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Data Synchronized!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSyncToCadastre}
                    disabled={isSyncing}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Syncing to Cadastre...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Field Verified &bull; Sync to Cadastre</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
