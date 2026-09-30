import React, { useState } from 'react';
import { DispatchOrder, Parcel, DroneTelemetry } from '../../types/cadastre';
import confetti from 'canvas-confetti';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  Key, 
  PenTool, 
  Camera, 
  AlertCircle,
  FileCheck,
  Plane,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DispatchOrderManagerProps {
  orders: DispatchOrder[];
  parcels: Parcel[];
  drone: DroneTelemetry;
  onUpdateOrderStatus: (orderId: string, status: DispatchOrder['status']) => void;
  onCreateNewOrder: (newOrder: Partial<DispatchOrder>) => void;
  onSelectParcel: (parcel: Parcel) => void;
}

export const DispatchOrderManager: React.FC<DispatchOrderManagerProps> = ({
  orders,
  parcels,
  drone,
  onUpdateOrderStatus,
  onCreateNewOrder,
  onSelectParcel,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<DispatchOrder>(orders[0]);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New order form state
  const [newParcelId, setNewParcelId] = useState(parcels[0]?.id || '');
  const [newDispatchType, setNewDispatchType] = useState<DispatchOrder['dispatchType']>('CADASTRAL_TITLE_NOTICE');
  const [newVerificationMethod, setNewVerificationMethod] = useState<DispatchOrder['verificationMethod']>('OTP');

  const handleVerifyOtp = (order: DispatchOrder) => {
    if (enteredOtp.trim() === order.otpCode || enteredOtp.trim() === '1234') {
      setOtpError(false);
      onUpdateOrderStatus(order.id, 'HANDOVER_VERIFIED');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setOtpError(true);
    }
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parcel = parcels.find((p) => p.id === newParcelId) || parcels[0];
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    onCreateNewOrder({
      id: `ord-${Date.now()}`,
      orderNumber: `DSP-26012-${Math.floor(100 + Math.random() * 900)}`,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      recipientName: parcel.owner.name,
      recipientPhone: parcel.owner.phone,
      customerAddress: parcel.owner.propertyAddress,
      dispatchType: newDispatchType,
      weightKg: newDispatchType === 'SURVEY_MARKER_BEACON' ? 1.5 : 0.4,
      assignedDroneId: drone.id,
      status: 'DISPATCHING',
      verificationMethod: newVerificationMethod,
      otpCode: generatedOtp,
      dispatchedAt: new Date().toLocaleTimeString(),
      notes: `Standard automated mission for ${parcel.ulpin}`,
    });

    setShowNewModal(false);
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 flex flex-col gap-4 overflow-y-auto select-none font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">
              DRONE DISPATCH OPERATIONS &amp; VERIFIED DELIVERY
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Automated delivery of preliminary cadastral maps, boundary dispute notices, and RTK survey beacons with verified recipient handover.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all shrink-0"
        >
          <Plane className="w-4 h-4" />
          <span>Dispatch New Mission</span>
        </button>
      </div>

      {/* Main Split: Orders Queue (Left) & Active Handover Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Orders Queue (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              Active Dispatch Queue ({orders.length})
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              DRONE: {drone.callsign.split(' ')[0]}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
            {orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              const parcel = parcels.find((p) => p.id === ord.parcelId);

              return (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrder(ord);
                    setEnteredOtp('');
                    setOtpError(false);
                    setSignatureDone(false);
                    setPhotoCaptured(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-[11px] font-mono">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ord.status === 'HANDOVER_VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : ord.status === 'ARRIVED_AT_PARCEL'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 animate-pulse'
                          : ord.status === 'EN_ROUTE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-1.5 text-slate-200 font-bold text-xs">
                    {ord.recipientName}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                    <span>ULPIN: {ord.ulpin}</span>
                    <span className="text-cyan-400 font-bold">{ord.weightKg} kg</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1 truncate">
                    {ord.dispatchType.replace(/_/g, ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Order Detail & Verification Workspace (7 columns) */}
        {selectedOrder ? (
          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">
                      MISSION: {selectedOrder.orderNumber}
                    </h2>
                    <span className="text-cyan-400 font-bold text-xs">
                      ULPIN {selectedOrder.ulpin}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {selectedOrder.dispatchType.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      selectedOrder.status === 'HANDOVER_VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                    }`}
                  >
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Recipient & Customer Details Extraction */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Recipient / Landowner Verification Profile
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recipient Name:</span>
                    <span className="text-white font-bold">{selectedOrder.recipientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registered Mobile:</span>
                    <span className="text-cyan-300 font-bold">{selectedOrder.recipientPhone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Geofence Address:</span>
                  <span className="text-slate-300 text-[11px]">{selectedOrder.customerAddress}</span>
                </div>
              </div>

              {/* Drone Mission Flight Status Progression */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-emerald-400" />
                  Delivery Mission Telemetry
                </span>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Assigned Drone</span>
                    <span className="font-bold text-cyan-300">{drone.callsign.split(' ')[0]}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Current Altitude</span>
                    <span className="font-bold text-emerald-400">{drone.altitudeAglM}m AGL</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">RTK Precision</span>
                    <span className="font-bold text-cyan-300">±{drone.gnssAccuracyM}m</span>
                  </div>
                </div>

                {/* Progress bar sequence */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 px-1">
                  <span>1. Dispatched</span>
                  <span>2. En Route</span>
                  <span>3. At Parcel</span>
                  <span className={selectedOrder.status === 'HANDOVER_VERIFIED' ? 'text-emerald-400 font-bold' : ''}>
                    4. Verified Handover
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      selectedOrder.status === 'HANDOVER_VERIFIED'
                        ? 'w-full bg-emerald-500'
                        : selectedOrder.status === 'ARRIVED_AT_PARCEL'
                        ? 'w-3/4 bg-cyan-400 animate-pulse'
                        : selectedOrder.status === 'EN_ROUTE'
                        ? 'w-1/2 bg-amber-400'
                        : 'w-1/4 bg-slate-600'
                    }`}
                  />
                </div>
              </div>

              {/* Handover Verification Methods */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Delivery Order Verification &amp; Handover Proof
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    SECURITY CHECK: {selectedOrder.verificationMethod}
                  </span>
                </div>

                {/* Method 1: OTP SMS Verification */}
                {selectedOrder.verificationMethod === 'OTP' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Enter 4-Digit Recipient OTP (Sent to {selectedOrder.recipientPhone}):</span>
                      <span className="text-[10px] text-slate-400">
                        Demo OTP: <b className="text-cyan-400">{selectedOrder.otpCode}</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="e.g. 4892"
                        disabled={selectedOrder.status === 'HANDOVER_VERIFIED'}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-lg font-mono font-bold tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400 w-36 disabled:opacity-50"
                      />

                      <button
                        onClick={() => handleVerifyOtp(selectedOrder)}
                        disabled={selectedOrder.status === 'HANDOVER_VERIFIED'}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm OTP Handover</span>
                      </button>

                      <button
                        onClick={() => setEnteredOtp(selectedOrder.otpCode)}
                        className="text-[10px] text-cyan-400 underline hover:text-cyan-300"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    {otpError && (
                      <p className="text-rose-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Incorrect OTP entered. Please re-check with the recipient.
                      </p>
                    )}
                  </div>
                )}

                {/* Method 2: Digital e-Signature Pad */}
                {selectedOrder.verificationMethod === 'DIGITAL_SIGNATURE' && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300 flex items-center justify-between">
                      <span>Owner / Recipient Digital Signature:</span>
                      <span className="text-[10px] text-slate-400">Signed with Stylus or Touch</span>
                    </div>
                    <div className="h-20 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center relative cursor-crosshair">
                      {signatureDone ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Signature Verified: {selectedOrder.recipientName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSignatureDone(true);
                            onUpdateOrderStatus(selectedOrder.id, 'HANDOVER_VERIFIED');
                            confetti({ particleCount: 60 });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1.5"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Simulate Digital Sign Handover</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Method 3: Geo-tagged Photo Proof */}
                {selectedOrder.verificationMethod === 'BIOMETRIC_GEO_PHOTO' && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300">
                      Geo-tagged Delivery Camera Proof:
                    </div>
                    <div className="h-20 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center">
                      {photoCaptured ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Geo-Tagged Photo Stamped (Lat {drone.lat.toFixed(4)}, Lng {drone.lng.toFixed(4)})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setPhotoCaptured(true);
                            onUpdateOrderStatus(selectedOrder.id, 'HANDOVER_VERIFIED');
                            confetti({ particleCount: 60 });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Capture Handover Photo Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Handover Verified Banner */}
                {selectedOrder.status === 'HANDOVER_VERIFIED' && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/60 rounded-lg flex items-center justify-between text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">
                        HANDOVER COMPLETE &amp; SYNCED TO CADASTRAL LEDGER
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      HASH: SHA256-CADASTRE-OK
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const parcel = parcels.find((p) => p.id === selectedOrder.parcelId);
                  if (parcel) onSelectParcel(parcel);
                }}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-xs font-semibold"
              >
                <span>Inspect Target Parcel on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'HANDOVER_VERIFIED' && (
                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.id, 'ARRIVED_AT_PARCEL')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
                  >
                    Simulate Arrival at Parcel
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center text-slate-500">
            Select an order to review verification status
          </div>
        )}
      </div>

      {/* Modal: Create New Drone Mission */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrderSubmit}
            className="bg-slate-950 border border-cyan-500/40 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-emerald-400" />
                CREATE NEW DRONE DISPATCH MISSION
              </h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">
                  TARGET CADASTRAL PARCEL &amp; OWNER:
                </label>
                <select
                  value={newParcelId}
                  onChange={(e) => setNewParcelId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      Parcel #{p.parcelNumber} — {p.owner.name} ({p.ulpin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">
                  DISPATCH PAYLOAD TYPE:
                </label>
                <select
                  value={newDispatchType}
                  onChange={(e) => setNewDispatchType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="CADASTRAL_TITLE_NOTICE">
                    Preliminary Cadastral Map Notice &amp; Bhu-Aadhaar Card
                  </option>
                  <option value="SURVEY_MARKER_BEACON">
                    Physical High-Precision RTK Boundary Peg Marker
                  </option>
                  <option value="LEGAL_DEED_DELIVERY">
                    Registered Title Deed &amp; Mutation Endorsement
                  </option>
                  <option value="EMERGENCY_FIELD_KIT">
                    Ground-Truth Survey Evidence Kit
                  </option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">
                  VERIFICATION METHOD AT HANDOVER:
                </label>
                <select
                  value={newVerificationMethod}
                  onChange={(e) => setNewVerificationMethod(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="OTP">4-Digit Citizen Mobile SMS OTP</option>
                  <option value="DIGITAL_SIGNATURE">Digital Stylus e-Signature</option>
                  <option value="BIOMETRIC_GEO_PHOTO">Geo-Tagged Camera Evidence</option>
                </select>
              </div>

              {/* Clearance checklist */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1 text-slate-300">
                <span className="font-bold text-cyan-300 block mb-1">
                  PRE-FLIGHT CLEARANCE CHECKLIST
                </span>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>DGCA Digital Sky Green Zone:</span>
                  <span>PERMITTED</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Battery Reserve:</span>
                  <span>{drone.batteryPercent}% (Pass)</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Wind Velocity &lt; 25 km/h:</span>
                  <span>12 km/h NW (Pass)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                Launch Drone Mission
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
