import React from 'react';
import { MapSnapshot } from '../../types/snapshot';
import { 
  Camera, 
  Clock, 
  RotateCcw, 
  Trash2, 
  Download, 
  X, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Navigation,
  Compass,
  Eye
} from 'lucide-react';

interface MapSnapshotGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: MapSnapshot[];
  onRestoreSnapshot: (snapshot: MapSnapshot) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
}

export const MapSnapshotGalleryModal: React.FC<MapSnapshotGalleryModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  onRestoreSnapshot,
  onDeleteSnapshot,
}) => {
  if (!isOpen) return null;

  const downloadSnapshotJson = (snap: MapSnapshot) => {
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadastral-snapshot-${snap.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono text-xs select-none">
      <div className="bg-slate-950 border border-cyan-500/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  CADASTRAL VIEWPORT SNAPSHOT GALLERY
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {snapshots.length} SAVED VIEWPOINTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Review historical survey passes, restore drone vantage coordinates, and inspect cadastral boundary changes over time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {snapshots.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Camera className="w-10 h-10 text-slate-600 stroke-[1.5]" />
              <p className="text-sm">No map snapshots captured yet.</p>
              <p className="text-xs text-slate-600 max-w-sm">
                Click the <b>"Capture Snapshot"</b> button in the Command Center header to record the current aerial vantage point and cadastral layout.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] group"
                >
                  {/* Top info row */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h3 className="font-bold text-white text-xs sm:text-sm">
                          {snap.title}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {snap.timeFormatted}
                      </span>
                    </div>

                    {/* Simulated SVG Thumbnail Preview */}
                    <div className="relative h-28 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center mb-3">
                      <svg className="w-full h-full" viewBox="0 0 300 120">
                        {/* Dark satellite ground grid */}
                        <rect width="300" height="120" fill="#09131f" />
                        <line x1="0" y1="60" x2="300" y2="60" stroke="#1e293b" strokeWidth="1" />
                        <line x1="150" y1="0" x2="150" y2="120" stroke="#1e293b" strokeWidth="1" />
                        {/* Cadastral polygons */}
                        <polygon points="60,40 120,30 140,80 70,85" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" strokeWidth="1.2" />
                        <polygon points="150,35 220,25 240,75 165,80" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="1.2" />
                        <polygon points="80,90 155,85 170,115 90,118" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" strokeWidth="1.2" />
                        {/* Drone position marker */}
                        <circle cx="140" cy="55" r="4" fill="#ffffff" stroke="#00f0ff" strokeWidth="1.5" />
                        <polygon points="140,51 143,58 137,58" fill="#f59e0b" />
                        <text x="148" y="58" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                          {snap.droneCoords.alt}m AGL
                        </text>
                      </svg>
                      <div className="absolute bottom-1 right-2 text-[8px] text-slate-500 font-mono">
                        ZOOM: {snap.mapState.zoomLevel.toFixed(1)}x &bull; {snap.mapState.is3DTilt ? '3D' : '2D'}
                      </div>
                    </div>

                    {/* Snapshot Telemetry Stats */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Drone Vantage:</span>
                        <span className="font-bold text-cyan-300">
                          {snap.droneCoords.lat.toFixed(4)}°N, {snap.droneCoords.lng.toFixed(4)}°E
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Speed &amp; Heading:</span>
                        <span className="font-bold text-slate-200">
                          {snap.droneCoords.speedKmh} km/h &bull; {snap.droneCoords.heading}°
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Cadastre Coverage:</span>
                        <span className="text-emerald-400 font-bold">
                          {snap.parcelsCount} Parcels ({snap.verifiedCount} RTK Fix)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target Parcel:</span>
                        <span className="text-amber-400 font-bold">
                          {snap.selectedParcelNumber ? `Parcel #${snap.selectedParcelNumber}` : 'Full ULB Overview'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => downloadSnapshotJson(snap)}
                      title="Download Snapshot JSON"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteSnapshot(snap.id)}
                        title="Delete from Gallery"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onRestoreSnapshot(snap);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Viewpoint</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
          <span>Snapshots persist in local state with full telemetry metadata.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
