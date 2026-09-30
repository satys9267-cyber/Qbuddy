export interface MapSnapshot {
  id: string;
  title: string;
  timestamp: string;
  timeFormatted: string;
  droneCoords: {
    lat: number;
    lng: number;
    alt: number;
    heading: number;
    speedKmh: number;
  };
  mapState: {
    zoomLevel: number;
    is3DTilt: boolean;
  };
  selectedParcelNumber?: string;
  parcelsCount: number;
  verifiedCount: number;
  activeMissionId?: string;
  thumbnailSvg?: string;
  notes?: string;
}
