import React, { useState, useEffect, useRef } from 'react';
import { 
  Parcel, 
  BuildingFootprint, 
  DroneTelemetry, 
  DroneWaypoint, 
  DispatchOrder 
} from './types/cadastre';
import { MapSnapshot } from './types/snapshot';
import { 
  INITIAL_PARCELS, 
  BUILDING_FOOTPRINTS, 
  INITIAL_DRONE, 
  INITIAL_WAYPOINTS, 
  INITIAL_DISPATCH_ORDERS 
} from './data/mockCadastreData';
import { Header } from './components/common/Header';
import { HeroSection } from './components/landing/HeroSection';
import { CinematicPreviewSection } from './components/media/CinematicPreviewSection';
import { ApplicationModelSection } from './components/media/ApplicationModelSection';
import { EcosystemSection } from './components/landing/EcosystemSection';
import { TeamSection } from './components/landing/TeamSection';
import { CadastralMap } from './components/map/CadastralMap';
import { RealTypeMetricsPanel } from './components/drone/RealTypeMetricsPanel';
import { DroneHealthPanel } from './components/drone/DroneHealthPanel';
import { LocationPathingPanel } from './components/drone/LocationPathingPanel';
import { ParcelDetailModal } from './components/cadastre/ParcelDetailModal';
import { DispatchOrderManager } from './components/dispatch/DispatchOrderManager';
import { QBuddyMobileFieldView } from './components/field/QBuddyMobileFieldView';
import { LandownerRegistry } from './components/registry/LandownerRegistry';
import { CadastreAnalyticsPanel } from './components/analytics/CadastreAnalyticsPanel';
import { MapSnapshotGalleryModal } from './components/map/MapSnapshotGalleryModal';
import { 
  BarChart3, 
  Layers, 
  Send, 
  Smartphone, 
  FileText, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  Images,
  X
} from 'lucide-react';

// Initial preloaded historical snapshots
const INITIAL_SNAPSHOTS: MapSnapshot[] = [
  {
    id: 'snap-hist-01',
    title: 'Morning Initial Aerial Cadastral Sweep',
    timestamp: '2026-09-30T08:30:00.000Z',
    timeFormatted: '08:30:00 AM',
    droneCoords: {
      lat: 18.5208,
      lng: 18.5204 + 0.0015,
      alt: 120,
      heading: 142,
      speedKmh: 179,
    },
    mapState: {
      zoomLevel: 1.0,
      is3DTilt: true,
    },
    selectedParcelNumber: '18562',
    parcelsCount: 8,
    verifiedCount: 2,
    notes: 'Initial orthomosaic alignment with Survey of India CORS benchmark.',
  },
  {
    id: 'snap-hist-02',
    title: 'Midday RTK Verification & Discrepancy Inspection',
    timestamp: '2026-09-30T11:45:00.000Z',
    timeFormatted: '11:45:20 AM',
    droneCoords: {
      lat: 18.5218,
      lng: 18.5204 + 0.0019,
      alt: 95,
      heading: 210,
      speedKmh: 45,
    },
    mapState: {
      zoomLevel: 1.4,
      is3DTilt: true,
    },
    selectedParcelNumber: '18588',
    parcelsCount: 8,
    verifiedCount: 4,
    notes: 'Tree canopy shadow edge flagged on parcel 18588.',
  },
];

export default function App() {
  // Theme state: 'dark' vs 'light' with working toggle button
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Navigation & View state
  const [activeDashboardView, setActiveDashboardView] = useState<'COMMAND' | 'DISPATCH' | 'MOBILE_FIELD' | 'REGISTRY'>('COMMAND');

  // Core Cadastre Data state
  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [buildings] = useState<BuildingFootprint[]>(BUILDING_FOOTPRINTS);
  const [drone, setDrone] = useState<DroneTelemetry>(INITIAL_DRONE);
  const [waypoints, setWaypoints] = useState<DroneWaypoint[]>(INITIAL_WAYPOINTS);
  const [orders, setOrders] = useState<DispatchOrder[]>(INITIAL_DISPATCH_ORDERS);

  // Inspection & Interaction states
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);

  // Map Snapshots Gallery & Visual Flash State
  const [snapshots, setSnapshots] = useState<MapSnapshot[]>(INITIAL_SNAPSHOTS);
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [mapStateOverride, setMapStateOverride] = useState<{ zoomLevel: number; is3DTilt: boolean } | null>(null);
  const [snapshotToast, setSnapshotToast] = useState<{
    id: string;
    title: string;
    time: string;
    coords: string;
  } | null>(null);

  // Real-Time Drone Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Refs for smooth scrolling
  const dashboardRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Simulation tick: updates drone coordinates and active waypoint smoothly
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = 600 / simSpeed;
    const interval = setInterval(() => {
      setDrone((prev) => {
        const headingWobble = (Math.random() - 0.5) * 1.5;
        const newHeading = Math.round((prev.headingDeg + headingWobble) % 360);
        const rpmNoise = () => Math.round(8500 + (Math.random() - 0.5) * 60);

        const step = 0.00004 * simSpeed;
        let newLat = prev.lat + Math.sin((prev.headingDeg * Math.PI) / 180) * step;
        let newLng = prev.lng + Math.cos((prev.headingDeg * Math.PI) / 180) * step;

        if (newLat > 18.523) newLat = 18.5204;
        if (newLng > 73.860) newLng = 73.8567;

        const newBattery = Math.max(15, +(prev.batteryPercent - 0.01 * simSpeed).toFixed(1));

        return {
          ...prev,
          lat: newLat,
          lng: newLng,
          headingDeg: newHeading,
          motorRpm: [rpmNoise(), rpmNoise(), rpmNoise(), rpmNoise()],
          batteryPercent: newBattery,
          distanceCoveredKm: +(prev.distanceCoveredKm + 0.01 * simSpeed).toFixed(2),
        };
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLaunchSystem = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Capture Map Snapshot Handler
  const handleCaptureSnapshot = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 450);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString();
    const snapId = `snap-${Date.now()}`;
    const snapTitle = selectedParcel 
      ? `Parcel #${selectedParcel.parcelNumber} Focus Viewpoint` 
      : `Sector 4 Cadastral Pass #${snapshots.length + 1}`;

    const newSnapshot: MapSnapshot = {
      id: snapId,
      title: snapTitle,
      timestamp: now.toISOString(),
      timeFormatted,
      droneCoords: {
        lat: drone.lat,
        lng: drone.lng,
        alt: drone.altitudeAglM,
        heading: drone.headingDeg,
        speedKmh: drone.speedKmh,
      },
      mapState: {
        zoomLevel: 1.2,
        is3DTilt: true,
      },
      selectedParcelNumber: selectedParcel?.parcelNumber,
      parcelsCount: parcels.length,
      verifiedCount: parcels.filter((p) => p.validationStatus === 'VERIFIED').length,
      notes: `Captured at ${drone.altitudeAglM}m AGL altitude. GNSS RTK lock: ±${drone.gnssAccuracyM}m.`,
    };

    setSnapshots((prev) => [newSnapshot, ...prev]);

    setSnapshotToast({
      id: snapId,
      title: snapTitle,
      time: timeFormatted,
      coords: `${drone.lat.toFixed(4)}°N, ${drone.lng.toFixed(4)}°E`,
    });

    setTimeout(() => {
      setSnapshotToast((prev) => (prev?.id === snapId ? null : prev));
    }, 4500);
  };

  // Restore historical snapshot viewpoint
  const handleRestoreSnapshot = (snap: MapSnapshot) => {
    setDrone((prev) => ({
      ...prev,
      lat: snap.droneCoords.lat,
      lng: snap.droneCoords.lng,
      altitudeAglM: snap.droneCoords.alt,
      headingDeg: snap.droneCoords.heading,
      speedKmh: snap.droneCoords.speedKmh,
    }));

    if (snap.selectedParcelNumber) {
      const match = parcels.find((p) => p.parcelNumber === snap.selectedParcelNumber);
      if (match) setSelectedParcel(match);
    }

    setMapStateOverride({
      zoomLevel: snap.mapState.zoomLevel,
      is3DTilt: snap.mapState.is3DTilt,
    });

    setSnapshotToast({
      id: `restore-${Date.now()}`,
      title: `Restored Viewpoint: ${snap.title}`,
      time: snap.timeFormatted,
      coords: `Vantage: ${snap.droneCoords.lat.toFixed(4)}°N, ${snap.droneCoords.lng.toFixed(4)}°E`,
    });

    setTimeout(() => setSnapshotToast(null), 3500);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetSimulation = () => {
    setDrone(INITIAL_DRONE);
    setWaypoints(INITIAL_WAYPOINTS);
  };

  const handleUpdateOrderStatus = (orderId: string, status: DispatchOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleCreateNewOrder = (newOrder: Partial<DispatchOrder>) => {
    setOrders((prev) => [newOrder as DispatchOrder, ...prev]);
    setActiveDashboardView('DISPATCH');
  };

  const handleConfirmFieldVerification = (parcelId: string, notes?: string) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          return {
            ...p,
            validationStatus: 'VERIFIED',
            confidenceScore: 99.8,
            groundTruthData: {
              surveyorName: 'Character Ana (SOI-2810)',
              surveyorId: 'SOI-SURV-2810',
              verifiedAt: new Date().toLocaleString(),
              gnssAccuracyMeters: 0.03,
              boundaryConfirmed: true,
              handoverOtpVerified: true,
              notes: notes || 'Field RTK GNSS verified on site.',
            },
          };
        }
        return p;
      })
    );
  };

  const handleWaypointSelect = (wp: DroneWaypoint) => {
    setDrone((prev) => ({
      ...prev,
      lat: wp.lat,
      lng: wp.lng,
      altitudeAglM: wp.alt,
    }));
    setWaypoints((prev) =>
      prev.map((item) =>
        item.id === wp.id
          ? { ...item, status: 'ACTIVE' }
          : item.index < wp.index
          ? { ...item, status: 'COMPLETED' }
          : { ...item, status: 'PENDING' }
      )
    );
  };

  const handleTriggerAction = (action: string) => {
    if (action === 'RETURN_HOME') {
      handleResetSimulation();
    } else if (action === 'HOVER_SCAN') {
      setDrone((prev) => ({ ...prev, speedKmh: 0, status: 'SCANNING' }));
    }
  };

  const verifiedParcelsCount = parcels.filter((p) => p.validationStatus === 'VERIFIED').length;

  return (
    <div className={`min-h-screen w-full font-sans select-none antialiased overflow-x-hidden relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Minimalist Sticky Single-Line Header with Working Theme Toggle */}
      <Header
        onNavClick={scrollToSection}
        onLaunchSystem={handleLaunchSystem}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Hero Section: Quote, Bold Typography, Clean Pills */}
      <HeroSection
        onLaunchSystem={handleLaunchSystem}
        onExplorePlatform={() => scrollToSection('cinematic-preview')}
      />

      {/* 3. Cinematic Vision Video Preview (Features vision-1 and vision-2) */}
      <CinematicPreviewSection
        onLaunchCommandCenter={handleLaunchSystem}
      />

      {/* 4. NEW: Application Model & System Architecture Section (Features app.mp4 and video.mp4!) */}
      <ApplicationModelSection
        onExploreMap={handleLaunchSystem}
        theme={theme}
      />

      {/* 5. Ecosystem Overview Section */}
      <EcosystemSection
        onNavigateTo={(view) => {
          setActiveDashboardView(view);
          handleLaunchSystem();
        }}
      />

      {/* 6. Live Interactive Mission Command Center & Connected Satellite Map */}
      <section
        id="satellite-map"
        ref={dashboardRef}
        className="py-12 px-3 sm:px-6 max-w-7xl mx-auto w-full select-none"
      >
        {/* Dashboard Navigation Bar & Controls */}
        <div className={`backdrop-blur-md border rounded-2xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-2xl transition-colors ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Sub-view switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveDashboardView('COMMAND')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeDashboardView === 'COMMAND'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/60 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Command Center</span>
            </button>

            <button
              onClick={() => setActiveDashboardView('DISPATCH')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeDashboardView === 'DISPATCH'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>2. Dispatch &amp; Handover</span>
            </button>

            <button
              onClick={() => setActiveDashboardView('MOBILE_FIELD')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeDashboardView === 'MOBILE_FIELD'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>3. QBuddy Mobile AR</span>
            </button>

            <button
              onClick={() => setActiveDashboardView('REGISTRY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeDashboardView === 'REGISTRY'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>4. Cadastre Registry</span>
            </button>
          </div>

          {/* Right Action Group: Snapshot Capture, Gallery, Analytics & Flight Sim */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* CAPTURE MAP SNAPSHOT BUTTON */}
            <button
              onClick={handleCaptureSnapshot}
              title="Capture instantaneous aerial snapshot and save viewpoint to local state gallery"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-400 border border-amber-500/60 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all active:scale-95 group"
            >
              <Camera className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Capture Map Snapshot</span>
            </button>

            {/* SNAPSHOT GALLERY BUTTON */}
            <button
              onClick={() => setShowGalleryModal(true)}
              title="Review saved historical viewpoints of the cadastral layout"
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                theme === 'dark'
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <Images className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gallery</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                {snapshots.length}
              </span>
            </button>

            {/* Recharts Analytics Modal Trigger */}
            <button
              onClick={() => setShowAnalyticsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-400 border border-cyan-500/50 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Recharts Analytics</span>
            </button>

            {/* Flight Simulator Play / Pause */}
            <div className={`flex items-center p-1 rounded-xl border gap-1 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`p-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 ${
                  isSimulating
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[10px] hidden sm:inline">{isSimulating ? 'LIVE' : 'PAUSED'}</span>
              </button>

              <button
                onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 5 : 1)}
                className="px-2 py-1 rounded text-[10px] font-mono text-cyan-400 hover:bg-slate-800"
              >
                {simSpeed}x
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-1.5 text-slate-400 hover:text-white rounded"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Command Center */}
        {activeDashboardView === 'COMMAND' && (
          <div className="flex flex-col gap-3 min-h-[680px]">
            {/* Top Half: HUD Left + Center Map + HUD Right */}
            <div className="flex gap-3 h-[520px]">
              {/* Left HUD: Real Type & Extraction Engine */}
              <div className="hidden md:flex">
                <RealTypeMetricsPanel
                  drone={drone}
                  totalParcelsCount={parcels.length}
                  verifiedCount={verifiedParcelsCount}
                />
              </div>

              {/* Center: Interactive Connected Leaflet Satellite Cadastral Map */}
              <div className="flex-1 relative min-w-0">
                <CadastralMap
                  parcels={parcels}
                  buildings={buildings}
                  drone={drone}
                  waypoints={waypoints}
                  selectedParcel={selectedParcel}
                  onSelectParcel={(p) => setSelectedParcel(p)}
                  hoveredParcelId={hoveredParcelId}
                  setHoveredParcelId={setHoveredParcelId}
                  flashActive={flashActive}
                  mapStateOverride={mapStateOverride}
                />
              </div>

              {/* Right HUD: Drone Health, Battery & Gimbal Sensor Feed */}
              <div className="hidden lg:flex">
                <DroneHealthPanel
                  drone={drone}
                  onChangeSensorMode={(mode) =>
                    setDrone((prev) => ({ ...prev, sensorMode: mode }))
                  }
                />
              </div>
            </div>

            {/* Bottom: Location & Pathing + 3D Polygo Model Inspector */}
            <LocationPathingPanel
              drone={drone}
              waypoints={waypoints}
              selectedParcel={selectedParcel}
              onWaypointSelect={handleWaypointSelect}
              onTriggerAction={handleTriggerAction}
            />
          </div>
        )}

        {/* View 2: Dispatch & Verified Handover */}
        {activeDashboardView === 'DISPATCH' && (
          <div className="min-h-[640px] flex">
            <DispatchOrderManager
              orders={orders}
              parcels={parcels}
              drone={drone}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onCreateNewOrder={handleCreateNewOrder}
              onSelectParcel={(p) => {
                setSelectedParcel(p);
                setActiveDashboardView('COMMAND');
              }}
            />
          </div>
        )}

        {/* View 3: Mobile Field AR Tablet */}
        {activeDashboardView === 'MOBILE_FIELD' && (
          <div className="min-h-[640px] flex">
            <QBuddyMobileFieldView
              parcels={parcels}
              selectedParcel={selectedParcel}
              onSelectParcel={setSelectedParcel}
              onConfirmFieldVerification={handleConfirmFieldVerification}
            />
          </div>
        )}

        {/* View 4: Cadastre Registry */}
        {activeDashboardView === 'REGISTRY' && (
          <div className="min-h-[640px] flex">
            <LandownerRegistry
              parcels={parcels}
              onSelectParcel={(p) => {
                setSelectedParcel(p);
                setActiveDashboardView('COMMAND');
              }}
              onDispatchOrder={(p) => {
                setSelectedParcel(p);
                setActiveDashboardView('DISPATCH');
              }}
              onOpenInFieldApp={(p) => {
                setSelectedParcel(p);
                setActiveDashboardView('MOBILE_FIELD');
              }}
            />
          </div>
        )}
      </section>

      {/* 7. The Team & SIH26012 Institutional Alignment Section */}
      <TeamSection />

      {/* 8. Recharts Analytics Modal */}
      <CadastreAnalyticsPanel
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />

      {/* 9. Map Snapshot Historical Viewpoints Gallery Modal */}
      <MapSnapshotGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        snapshots={snapshots}
        onRestoreSnapshot={handleRestoreSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
      />

      {/* 10. Parcel Detail Modal */}
      <ParcelDetailModal
        parcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
        onDispatchOrder={(p) => {
          setSelectedParcel(p);
          setActiveDashboardView('DISPATCH');
        }}
        onOpenInFieldApp={(p) => {
          setSelectedParcel(p);
          setActiveDashboardView('MOBILE_FIELD');
        }}
      />

      {/* 11. Floating Visual Notification Toast for Snapshot Capture */}
      {snapshotToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md border border-amber-500/60 rounded-2xl p-4 shadow-[0_10px_35px_rgba(245,158,11,0.3)] max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-5 font-mono text-xs select-none">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate">
                Snapshot Recorded!
              </span>
              <button
                onClick={() => setSnapshotToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-amber-300 font-bold text-[11px] truncate mt-0.5">
              {snapshotToast.title}
            </p>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
              <span>{snapshotToast.time}</span>
              <span>&bull;</span>
              <span className="text-cyan-400">{snapshotToast.coords}</span>
            </div>
            <button
              onClick={() => {
                setShowGalleryModal(true);
                setSnapshotToast(null);
              }}
              className="mt-2 text-[10px] font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
            >
              <span>View in Gallery ({snapshots.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
