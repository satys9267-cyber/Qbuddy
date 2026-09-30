export interface GeoCoordinate {
  lat: number;
  lng: number;
  alt?: number; // Altitude in meters
}

export interface ParcelVertex {
  id: string;
  x: number; // percentage or relative coords
  y: number;
  lat: number;
  lng: number;
}

export type ParcelStatus = 'VERIFIED' | 'AI_EXTRACTED' | 'NEEDS_GROUND_TRUTH' | 'DISPUTED' | 'ENCROACHMENT_FLAGGED';
export type LandUseType = 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial' | 'Public Utility' | 'Green Space';

export interface Parcel {
  id: string;
  parcelNumber: string; // e.g., "18562"
  ulpin: string; // Unique Land Parcel Identification Number (Bhu-Aadhaar 14-char standard)
  coordinates: GeoCoordinate[];
  center: GeoCoordinate;
  screenCoords: { x: number; y: number }[]; // 0-100 normalized for crisp rendering
  areaSqMeters: number;
  perimeterMeters: number;
  buildingCount: number;
  confidenceScore: number; // 0 - 100
  validationStatus: ParcelStatus;
  landUse: LandUseType;
  owner: {
    name: string;
    phone: string;
    aadhaarHash: string;
    khataNo: string;
    surveyNumber: string;
    registrationDate: string;
    taxStatus: 'PAID' | 'DUE' | 'EXEMPT';
    propertyAddress: string;
  };
  edgesConfidence: {
    edgeIndex: number;
    confidence: number;
    flagged: boolean;
    reason?: string;
  }[];
  groundTruthData?: {
    surveyorName: string;
    surveyorId: string;
    verifiedAt: string;
    gnssAccuracyMeters: number;
    boundaryConfirmed: boolean;
    handoverOtpVerified: boolean;
    photoEvidenceUrl?: string;
    notes?: string;
  };
}

export interface BuildingFootprint {
  id: string;
  parcelId: string;
  polygon: { x: number; y: number }[];
  floors: number;
  heightMeters: number;
  isEncroaching: boolean;
  builtUpAreaSqM: number;
  roofType: string;
}

export interface DroneWaypoint {
  id: string;
  index: number;
  lat: number;
  lng: number;
  alt: number; // meters AGL
  speedKmh: number;
  action: 'SCAN_PARCEL' | 'FLY_BY' | 'HOVER' | 'DISPATCH_DROP' | 'RETURN';
  targetParcelId?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface DroneTelemetry {
  id: string;
  callsign: string;
  model: string;
  status: 'IN_FLIGHT' | 'HOVERING' | 'SCANNING' | 'RETURNING' | 'DOCKED' | 'DISPATCHED';
  batteryPercent: number;
  batteryVoltage: number;
  batteryTempC: number;
  speedKmh: number;
  altitudeAglM: number;
  altitudeMslM: number;
  lat: number;
  lng: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  satellitesLocked: number;
  rtkStatus: 'FIX' | 'FLOAT' | 'SINGLE' | 'NONE';
  gnssAccuracyM: number;
  connectionType: '5G_ENCRYPTED' | 'RF_MESH' | 'SATELLITE_UPLINK';
  signalPercent: number;
  motorRpm: [number, number, number, number];
  cameraGimbalPitch: number;
  sensorMode: 'OPTICAL_4K' | 'THERMAL_FLIR' | 'LIDAR_NDSM' | 'MULTISPECTRAL';
  distanceCoveredKm: number;
  totalFlightTimeSec: number;
  activeMissionId?: string;
}

export type DispatchOrderStatus = 
  | 'QUEUED' 
  | 'DISPATCHING' 
  | 'EN_ROUTE' 
  | 'ARRIVED_AT_PARCEL' 
  | 'AWAITING_VERIFICATION' 
  | 'HANDOVER_VERIFIED' 
  | 'FAILED';

export interface DispatchOrder {
  id: string;
  orderNumber: string;
  parcelId: string;
  ulpin: string;
  recipientName: string;
  recipientPhone: string;
  customerAddress: string;
  dispatchType: 'CADASTRAL_TITLE_NOTICE' | 'LEGAL_DEED_DELIVERY' | 'SURVEY_MARKER_BEACON' | 'EMERGENCY_FIELD_KIT';
  weightKg: number;
  assignedDroneId: string;
  status: DispatchOrderStatus;
  verificationMethod: 'OTP' | 'DIGITAL_SIGNATURE' | 'BIOMETRIC_GEO_PHOTO';
  otpCode: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  proofSignatureData?: string;
  proofPhotoUrl?: string;
  notes?: string;
}
