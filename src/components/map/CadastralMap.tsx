import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { 
  Parcel, 
  BuildingFootprint, 
  DroneTelemetry, 
  DroneWaypoint 
} from '../../types/cadastre';
import { 
  Layers, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Crosshair,
  Map as MapIcon,
  Satellite,
  Navigation,
  RotateCcw
} from 'lucide-react';

interface CadastralMapProps {
  parcels: Parcel[];
  buildings: BuildingFootprint[];
  drone: DroneTelemetry;
  waypoints: DroneWaypoint[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
  hoveredParcelId: string | null;
  setHoveredParcelId: (id: string | null) => void;
  flashActive?: boolean;
  mapStateOverride?: { zoomLevel: number; is3DTilt: boolean } | null;
}

export const CadastralMap: React.FC<CadastralMapProps> = ({
  parcels,
  buildings,
  drone,
  waypoints,
  selectedParcel,
  onSelectParcel,
  hoveredParcelId,
  setHoveredParcelId,
  flashActive = false,
  mapStateOverride = null,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const parcelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const pathPolylineRef = useRef<L.Polyline | null>(null);
  const waypointsGroupRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Map state
  const [baseMapType, setBaseMapType] = useState<'SATELLITE' | 'DARK' | 'OSM'>('SATELLITE');
  const [is3DTilt, setIs3DTilt] = useState<boolean>(true);
  const [showParcels, setShowParcels] = useState<boolean>(true);
  const [showFlightPath, setShowFlightPath] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(17);

  // Tile layer URLs
  const TILE_URLS = {
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const TILE_ATTRIBUTIONS = {
    SATELLITE: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    DARK: '&copy; <a href="https://carto.com/">CARTO</a>',
    OSM: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [drone.lat, drone.lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 20,
      minZoom: 14,
    });

    const tileLayer = L.tileLayer(TILE_URLS[baseMapType], {
      attribution: TILE_ATTRIBUTIONS[baseMapType],
      maxZoom: 20,
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;

    // Layer groups for parcels & waypoints
    const parcelsGroup = L.layerGroup().addTo(map);
    parcelsLayerGroupRef.current = parcelsGroup;

    const waypointsGroup = L.layerGroup().addTo(map);
    waypointsGroupRef.current = waypointsGroup;

    leafletMapRef.current = map;

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // 2. Handle Base Map Tile Switcher (Satellite vs Dark vs OSM)
  useEffect(() => {
    if (!leafletMapRef.current || !baseTileLayerRef.current) return;
    baseTileLayerRef.current.setUrl(TILE_URLS[baseMapType]);
  }, [baseMapType]);

  // 3. Render Cadastral Parcels Layer
  useEffect(() => {
    if (!parcelsLayerGroupRef.current || !leafletMapRef.current) return;
    parcelsLayerGroupRef.current.clearLayers();

    if (!showParcels) return;

    parcels.forEach((parcel) => {
      const isSelected = selectedParcel?.id === parcel.id;
      const isHovered = hoveredParcelId === parcel.id;

      let color = '#00e5ff';
      let fillColor = 'rgba(0, 229, 255, 0.35)';

      if (parcel.validationStatus === 'VERIFIED') {
        color = '#10b981';
        fillColor = 'rgba(16, 185, 129, 0.4)';
      } else if (parcel.validationStatus === 'NEEDS_GROUND_TRUTH') {
        color = '#f59e0b';
        fillColor = 'rgba(245, 158, 11, 0.4)';
      } else if (parcel.validationStatus === 'ENCROACHMENT_FLAGGED') {
        color = '#f43f5e';
        fillColor = 'rgba(244, 63, 94, 0.45)';
      }

      const latLngs = parcel.coordinates.map((c) => [c.lat, c.lng] as [number, number]);

      const polygon = L.polygon(latLngs, {
        color: color,
        weight: isSelected ? 3.5 : isHovered ? 2.8 : 1.8,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.6 : isHovered ? 0.5 : 0.35,
        dashArray: parcel.validationStatus === 'NEEDS_GROUND_TRUTH' ? '6, 6' : undefined,
      });

      // Tooltip / Label matching demo video
      polygon.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: ${color};">
          PARCEL #${parcel.parcelNumber} (${parcel.areaSqMeters} m²)
        </div>`,
        { permanent: false, direction: 'center', className: 'bg-slate-950 border border-slate-700 p-1 text-xs' }
      );

      polygon.on('click', () => {
        onSelectParcel(parcel);
      });

      polygon.on('mouseover', () => {
        setHoveredParcelId(parcel.id);
      });

      polygon.on('mouseout', () => {
        setHoveredParcelId(null);
      });

      parcelsLayerGroupRef.current?.addLayer(polygon);

      // Centroid permanent label marker
      const labelIcon = L.divIcon({
        className: 'custom-parcel-label',
        html: `<div style="
          transform: translate(-50%, -50%);
          background: rgba(2, 6, 23, 0.85);
          border: 1px solid ${color};
          color: ${color};
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.6);
        ">PARCEL ${parcel.parcelNumber}</div>`,
        iconSize: [0, 0],
      });

      const labelMarker = L.marker([parcel.center.lat, parcel.center.lng], {
        icon: labelIcon,
        interactive: false,
      });

      parcelsLayerGroupRef.current?.addLayer(labelMarker);
    });
  }, [parcels, selectedParcel, hoveredParcelId, showParcels]);

  // 4. Update Drone Marker & Scanning Cone in Real Time
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const droneIconHtml = `
      <div style="
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transform: translate(-50%, -50%);
      ">
        <!-- Radar Scan Circle -->
        <div style="
          position: absolute;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 1.5px solid #00f0ff;
          background: radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <!-- Rotated Drone Fuselage & Propellers -->
        <div style="transform: rotate(${drone.headingDeg}deg); transition: transform 0.3s ease;">
          <svg width="34" height="34" viewBox="0 0 100 100">
            <!-- Arms -->
            <line x1="20" y1="20" x2="80" y2="80" stroke="#38bdf8" stroke-width="8" />
            <line x1="20" y1="80" x2="80" y2="20" stroke="#38bdf8" stroke-width="8" />
            <!-- Rotor blades -->
            <circle cx="20" cy="20" r="14" fill="#00f0ff" fill-opacity="0.5" stroke="#ffffff" stroke-width="3" />
            <circle cx="80" cy="80" r="14" fill="#00f0ff" fill-opacity="0.5" stroke="#ffffff" stroke-width="3" />
            <circle cx="20" cy="80" r="14" fill="#00f0ff" fill-opacity="0.5" stroke="#ffffff" stroke-width="3" />
            <circle cx="80" cy="20" r="14" fill="#00f0ff" fill-opacity="0.5" stroke="#ffffff" stroke-width="3" />
            <!-- Body -->
            <circle cx="50" cy="50" r="18" fill="#0f172a" stroke="#00f0ff" stroke-width="4" />
            <polygon points="50,30 58,45 42,45" fill="#f59e0b" />
          </svg>
        </div>
      </div>
    `;

    const customDroneIcon = L.divIcon({
      className: 'drone-live-marker',
      html: droneIconHtml,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    });

    if (!droneMarkerRef.current) {
      droneMarkerRef.current = L.marker([drone.lat, drone.lng], {
        icon: customDroneIcon,
        zIndexOffset: 1000,
      }).addTo(leafletMapRef.current);
    } else {
      droneMarkerRef.current.setLatLng([drone.lat, drone.lng]);
      droneMarkerRef.current.setIcon(customDroneIcon);
    }
  }, [drone.lat, drone.lng, drone.headingDeg]);

  // 5. Render Flight Trajectory Polyline & Waypoint Markers
  useEffect(() => {
    if (!leafletMapRef.current || !waypointsGroupRef.current) return;
    waypointsGroupRef.current.clearLayers();

    if (!showFlightPath) {
      if (pathPolylineRef.current) {
        pathPolylineRef.current.remove();
        pathPolylineRef.current = null;
      }
      return;
    }

    const latLngs = waypoints.map((w) => [w.lat, w.lng] as [number, number]);

    if (pathPolylineRef.current) {
      pathPolylineRef.current.setLatLngs(latLngs);
    } else {
      pathPolylineRef.current = L.polyline(latLngs, {
        color: '#fbbf24',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.9,
      }).addTo(leafletMapRef.current);
    }

    // Waypoint dots
    waypoints.forEach((wp) => {
      const isCurrent = wp.status === 'ACTIVE';
      const color = isCurrent ? '#00f0ff' : wp.status === 'COMPLETED' ? '#10b981' : '#f59e0b';

      const wpIcon = L.divIcon({
        className: 'wp-node',
        html: `
          <div style="
            background: #020617;
            border: 2px solid ${color};
            color: #ffffff;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 9px;
            font-weight: bold;
            box-shadow: 0 0 10px ${color};
          ">
            ${wp.index}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const wpMarker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
      wpMarker.bindTooltip(`WP-${wp.index}: ${wp.action.replace('_', ' ')} (${wp.alt}m AGL)`);
      waypointsGroupRef.current?.addLayer(wpMarker);
    });
  }, [waypoints, showFlightPath]);

  // 6. Handle Map State Override (from Snapshot Restoration)
  useEffect(() => {
    if (mapStateOverride && leafletMapRef.current) {
      setIs3DTilt(mapStateOverride.is3DTilt);
      leafletMapRef.current.setZoom(Math.round(15 + mapStateOverride.zoomLevel * 2));
      leafletMapRef.current.panTo([drone.lat, drone.lng]);
    }
  }, [mapStateOverride]);

  // Map Controls
  const handleZoom = (delta: number) => {
    if (!leafletMapRef.current) return;
    leafletMapRef.current.setZoom(leafletMapRef.current.getZoom() + delta);
  };

  const handleRecenter = () => {
    if (!leafletMapRef.current) return;
    leafletMapRef.current.setView([drone.lat, drone.lng], 17);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none border border-slate-800/80 rounded-2xl shadow-2xl">
      {/* 3D Perspective Tilt Perspective Wrapper */}
      <div 
        className="w-full h-full transition-transform duration-300 ease-out origin-center"
        style={{
          perspective: is3DTilt ? '1000px' : 'none',
        }}
      >
        <div
          className="w-full h-full transition-transform duration-200 ease-out origin-center"
          style={{
            transform: is3DTilt ? 'rotateX(25deg) scale(1.04)' : 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Leaflet Connected Map Container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
      </div>

      {/* Camera Shutter Flash Overlay on Snapshot Capture */}
      {flashActive && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-[2px] pointer-events-none flex items-center justify-center transition-all duration-300">
          <div className="flex flex-col items-center gap-2 text-slate-950 font-mono font-bold">
            <div className="w-16 h-16 rounded-full border-4 border-slate-950 flex items-center justify-center animate-ping">
              <div className="w-6 h-6 rounded-full bg-slate-950" />
            </div>
            <span className="text-xs tracking-widest uppercase px-3 py-1 rounded bg-slate-950 text-white">
              CADASTRAL SNAPSHOT CAPTURED
            </span>
          </div>
        </div>
      )}

      {/* Top Banner: Extraction Status */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-1.5 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/60 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>CONNECTED MAP &bull; 100% VALIDATED</span>
        </div>
      </div>

      {/* Top Left: Active Base Layer Badge & Coordinates */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl text-slate-200 font-mono text-xs flex items-center gap-2 shadow-lg">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>LAYER: {baseMapType} IMAGERY</span>
        </div>
      </div>

      {/* Bottom Left: Scale Bar & Telemetry Readout */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex flex-col gap-1 font-mono text-[10px] text-slate-400 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">DRONE LAT:</span>
          <span className="text-white">{drone.lat.toFixed(5)}°N</span>
          <span className="text-cyan-400 font-bold ml-1">LNG:</span>
          <span className="text-white">{drone.lng.toFixed(5)}°E</span>
        </div>
        <div className="flex items-center gap-2">
          <span>ALTITUDE:</span>
          <span className="text-emerald-400 font-bold">{drone.altitudeAglM}m AGL</span>
          <span>|</span>
          <span>SPEED: <b className="text-cyan-300">{drone.speedKmh} km/h</b></span>
        </div>
        <div className="flex items-center gap-2 pt-0.5 text-[9px] text-slate-500">
          <span>ZOOM: {currentZoom}x</span>
          <span>&bull;</span>
          <span>GRID: NAKSHA 1:500</span>
        </div>
      </div>

      {/* Bottom Right: Interactive Map Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        {/* Layer Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Switch Map Imagery Source"
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 rounded-xl border border-slate-700 shadow-lg transition-colors flex items-center justify-center"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute bottom-12 right-0 w-60 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3 shadow-2xl z-30 text-xs font-mono">
              <div className="text-[11px] font-bold text-cyan-300 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>MAP TILES &amp; LAYERS</span>
                <span className="text-[9px] text-slate-500">REALTIME</span>
              </div>

              {/* Base Map Selectors */}
              <div className="py-2 space-y-1.5 border-b border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Base Imagery</span>
                <button
                  onClick={() => setBaseMapType('SATELLITE')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    baseMapType === 'SATELLITE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>1. Esri World Satellite</span>
                  {baseMapType === 'SATELLITE' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
                <button
                  onClick={() => setBaseMapType('DARK')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    baseMapType === 'DARK' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>2. CartoDB Dark GIS</span>
                  {baseMapType === 'DARK' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
                <button
                  onClick={() => setBaseMapType('OSM')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    baseMapType === 'OSM' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>3. OpenStreetMap Streets</span>
                  {baseMapType === 'OSM' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              </div>

              {/* Vector Layer Toggles */}
              <div className="pt-2 space-y-2 text-slate-300">
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Cadastral Parcels</span>
                  <input
                    type="checkbox"
                    checked={showParcels}
                    onChange={(e) => setShowParcels(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Drone Flight Trajectory</span>
                  <input
                    type="checkbox"
                    checked={showFlightPath}
                    onChange={(e) => setShowFlightPath(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 3D Perspective Tilt Button */}
        <button
          onClick={() => setIs3DTilt(!is3DTilt)}
          title={is3DTilt ? 'Switch to 2D Ortho View' : 'Switch to 3D Perspective'}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-lg transition-all ${
            is3DTilt
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
              : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          {is3DTilt ? '3D TILT' : '2D ORTHO'}
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(1)}
          title="Zoom In"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(-1)}
          title="Zoom Out"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Recenter on Drone */}
        <button
          onClick={handleRecenter}
          title="Recenter on Drone Position"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-white rounded-xl border border-slate-700 shadow-lg transition-colors"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
