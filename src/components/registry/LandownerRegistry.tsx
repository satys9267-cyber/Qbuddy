import React, { useState } from 'react';
import { Parcel } from '../../types/cadastre';
import { 
  FileText, 
  Search, 
  Download, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

interface LandownerRegistryProps {
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onDispatchOrder: (parcel: Parcel) => void;
  onOpenInFieldApp: (parcel: Parcel) => void;
}

export const LandownerRegistry: React.FC<LandownerRegistryProps> = ({
  parcels,
  onSelectParcel,
  onDispatchOrder,
  onOpenInFieldApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [landUseFilter, setLandUseFilter] = useState<string>('ALL');

  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      p.parcelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.khataNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.validationStatus === statusFilter;
    const matchesLandUse = landUseFilter === 'ALL' || p.landUse === landUseFilter;

    return matchesSearch && matchesStatus && matchesLandUse;
  });

  const exportCsv = () => {
    const headers = [
      'Parcel Number',
      'ULPIN',
      'Owner Name',
      'Phone',
      'Survey Number',
      'Khata Number',
      'Area SqM',
      'Perimeter M',
      'Land Use',
      'AI Confidence',
      'Validation Status',
      'Tax Status',
      'Property Address',
    ];

    const rows = filteredParcels.map((p) => [
      `"${p.parcelNumber}"`,
      `"${p.ulpin}"`,
      `"${p.owner.name}"`,
      `"${p.owner.phone}"`,
      `"${p.owner.surveyNumber}"`,
      `"${p.owner.khataNo}"`,
      p.areaSqMeters,
      p.perimeterMeters,
      `"${p.landUse}"`,
      `${p.confidenceScore}%`,
      `"${p.validationStatus}"`,
      `"${p.owner.taxStatus}"`,
      `"${p.owner.propertyAddress}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadastral-registry-naksha-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 flex flex-col gap-4 overflow-y-auto select-none font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base font-bold text-white tracking-wide">
              CADASTRAL PARCEL &amp; LANDOWNER REGISTRY
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Bhu-Aadhaar ULPIN database, customer details extraction, title deed status, and ground-truth records.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Cadastre CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Parcel ID, ULPIN, Owner Name, Khata or Survey No..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Ground-Truth</option>
            <option value="AI_EXTRACTED">AI Extracted</option>
            <option value="NEEDS_GROUND_TRUTH">Needs Ground Truth</option>
            <option value="ENCROACHMENT_FLAGGED">Encroachment Flagged</option>
          </select>

          {/* Land Use Filter */}
          <select
            value={landUseFilter}
            onChange={(e) => setLandUseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Land Uses</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Mixed Use">Mixed Use</option>
            <option value="Public Utility">Public Utility</option>
          </select>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Parcel / ULPIN</th>
                <th className="p-3">Registered Owner</th>
                <th className="p-3">Survey &amp; Khata</th>
                <th className="p-3">Area (m²)</th>
                <th className="p-3">Land Use</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Cadastre Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredParcels.map((parcel) => (
                <tr
                  key={parcel.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectParcel(parcel)}
                >
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">
                      #{parcel.parcelNumber}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      {parcel.ulpin}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-slate-200">
                      {parcel.owner.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{parcel.owner.phone}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="text-slate-300">
                      {parcel.owner.surveyNumber}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {parcel.owner.khataNo}
                    </div>
                  </td>

                  <td className="p-3 font-mono">
                    <div className="text-slate-200 font-bold">
                      {parcel.areaSqMeters} m²
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {(parcel.areaSqMeters * 10.7639).toFixed(0)} sqft
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {parcel.landUse}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span
                        className={
                          parcel.confidenceScore > 90
                            ? 'text-emerald-400'
                            : parcel.confidenceScore > 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {parcel.confidenceScore}%
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
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
                  </td>

                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectParcel(parcel)}
                        title="View on Map"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenInFieldApp(parcel)}
                        title="Field Ground Truth"
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDispatchOrder(parcel)}
                        title="Dispatch Drone Notice"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
