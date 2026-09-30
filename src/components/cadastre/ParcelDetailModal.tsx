import React, { useEffect, useState } from 'react';
import { Parcel } from '../../types/cadastre';
import QRCode from 'qrcode';
import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  Download, 
  Smartphone,
  Layers,
  Printer
} from 'lucide-react';

interface ParcelDetailModalProps {
  parcel: Parcel | null;
  onClose: () => void;
  onDispatchOrder: (parcel: Parcel) => void;
  onOpenInFieldApp: (parcel: Parcel) => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({
  parcel,
  onClose,
  onDispatchOrder,
  onOpenInFieldApp,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!parcel) return;
    // Generate QR code encoding ULPIN and verification payload
    const qrPayload = JSON.stringify({
      ulpin: parcel.ulpin,
      parcelId: parcel.parcelNumber,
      owner: parcel.owner.name,
      khata: parcel.owner.khataNo,
      survey: parcel.owner.surveyNumber,
      area: parcel.areaSqMeters,
      checksum: 'SIH26012-VERIFIED-AUTH',
    });

    QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 140,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error(err));
  }, [parcel]);

  if (!parcel) return null;

  const downloadGeoJSON = () => {
    const geojson = {
      type: 'Feature',
      properties: {
        parcelNumber: parcel.parcelNumber,
        ulpin: parcel.ulpin,
        owner: parcel.owner.name,
        areaSqM: parcel.areaSqMeters,
        confidence: parcel.confidenceScore,
        validationStatus: parcel.validationStatus,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [parcel.coordinates.map((c) => [c.lng, c.lat])],
      },
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcel-${parcel.parcelNumber}-${parcel.ulpin}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printSurveyCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-black text-sm">
              {parcel.parcelNumber.slice(-3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  PARCEL #{parcel.parcelNumber}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    parcel.validationStatus === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : parcel.validationStatus === 'NEEDS_GROUND_TRUTH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : parcel.validationStatus === 'ENCROACHMENT_FLAGGED'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  }`}
                >
                  {parcel.validationStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 font-bold mt-0.5">
                ULPIN: {parcel.ulpin}
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

        {/* Modal Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PARCEL AREA</span>
              <span className="text-sm font-bold text-cyan-300">
                {parcel.areaSqMeters} m²
              </span>
              <span className="text-[9px] text-slate-500 block">
                {(parcel.areaSqMeters * 10.7639).toFixed(1)} sq ft
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PERIMETER</span>
              <span className="text-sm font-bold text-slate-200">
                {parcel.perimeterMeters} m
              </span>
              <span className="text-[9px] text-slate-500 block">Boundary Length</span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">LAND USE</span>
              <span className="text-sm font-bold text-emerald-400">
                {parcel.landUse}
              </span>
              <span className="text-[9px] text-slate-500 block">Master Plan Zone</span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">AI CONFIDENCE</span>
              <span className="text-sm font-bold text-cyan-400">
                {parcel.confidenceScore}%
              </span>
              <span className="text-[9px] text-slate-500 block">U-Net Segmenter</span>
            </div>
          </div>

          {/* Owner & Legal Records Box + QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="sm:col-span-2 space-y-2">
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner &amp; Cadastral Deed Registry</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Registered Owner:</span>
                  <span className="font-bold text-white">{parcel.owner.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="text-cyan-300">{parcel.owner.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Survey Number:</span>
                  <span className="text-slate-200">{parcel.owner.surveyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Khata Account:</span>
                  <span className="text-slate-200">{parcel.owner.khataNo}</span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[10px]">Property Address:</span>
                <span className="text-slate-300 text-[11px]">{parcel.owner.propertyAddress}</span>
              </div>
            </div>

            {/* Official Signed Parcel QR Code (Matches Field App Flow) */}
            <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-xl shadow-lg">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR for ${parcel.ulpin}`}
                  className="w-24 h-24 object-contain"
                />
              )}
              <span className="text-[9px] text-slate-900 font-bold font-mono mt-1 text-center">
                SCAN FOR FIELD GT
              </span>
              <span className="text-[8px] text-slate-500 font-mono">
                {parcel.ulpin.slice(0, 10)}...
              </span>
            </div>
          </div>

          {/* Per-Edge AI Confidence & Ground Truthing Notes */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Per-Edge Geometric Confidence &amp; Ground Truthing Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {parcel.edgesConfidence.map((edge) => (
                <div
                  key={edge.edgeIndex}
                  className={`p-2 rounded border flex flex-col justify-between ${
                    edge.flagged
                      ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span>EDGE #{edge.edgeIndex + 1}</span>
                    <span className="font-bold">{edge.confidence}%</span>
                  </div>
                  {edge.flagged && (
                    <span className="text-[8px] text-amber-400 mt-1 leading-tight">
                      {edge.reason || 'Low visual contrast'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {parcel.groundTruthData && (
              <div className="mt-2 p-2 bg-emerald-950/30 border border-emerald-600/40 rounded text-[10px] text-emerald-300 flex items-center justify-between">
                <span>
                  Verified by: <b>{parcel.groundTruthData.surveyorName}</b> (RTK ±{parcel.groundTruthData.gnssAccuracyMeters}m)
                </span>
                <span>{parcel.groundTruthData.verifiedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadGeoJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>GeoJSON</span>
            </button>
            <button
              onClick={printSurveyCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Card</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenInFieldApp(parcel);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-semibold transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Open in Field App</span>
            </button>
            <button
              onClick={() => {
                onDispatchOrder(parcel);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Drone</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
