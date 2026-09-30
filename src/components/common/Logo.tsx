import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const QBuddyLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'dark',
}) => {
  const dimensions = {
    sm: { icon: 34, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 44, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 60, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 84, text: 'text-4xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* New QBuddy Emblem matching WhatsApp Image 2026-09-30 at 10.11.55 PM */}
      <div
        style={{ width: dimensions.icon, height: dimensions.icon }}
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(15,118,110,0.35)]"
      >
        <svg
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Deep Teal Q gradient */}
            <linearGradient id="qTealGrad" x1="40" y1="30" x2="180" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#115e59" />
            </linearGradient>

            {/* Sun / Sky Warm Gradient */}
            <radialGradient id="sunGrad" cx="95" cy="50" r="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
            </radialGradient>

            {/* Drone Scan Beam Cone */}
            <linearGradient id="scanBeamNew" x1="165" y1="45" x2="115" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Golden Sun & Soft Cloud behind the Q */}
          <circle cx="95" cy="45" r="28" fill="url(#sunGrad)" opacity="0.85" />
          <path d="M 68 60 Q 75 52 86 54 Q 96 48 108 55 Q 118 52 125 60 Z" fill="#ffffff" opacity="0.6" />

          {/* Birds in flight */}
          <path d="M 45 68 Q 49 65 52 68 Q 55 65 58 68" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 54 58 Q 57 55 60 58 Q 63 55 66 58" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Stacked GIS Strata layers on the left side of Q */}
          <g transform="translate(10, 80) scale(0.65)">
            {/* Layer 1: Base Contour / Vector Grid */}
            <path d="M 30 50 L 90 25 L 140 50 L 80 75 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 50 48 Q 80 35 110 50" stroke="#0ea5e9" strokeWidth="1.2" fill="none" />
            {/* Layer 2: DSM / DTM Elevation Map */}
            <path d="M 30 30 L 90 5 L 140 30 L 80 55 Z" fill="#86efac" fillOpacity="0.85" stroke="#22c55e" strokeWidth="1.5" />
            {/* Layer 3: Orthorectified Imagery Top layer */}
            <path d="M 30 10 L 90 -15 L 140 10 L 80 35 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="80" cy="10" r="3" fill="#ef4444" />
          </g>

          {/* Main Deep Teal Q Ring */}
          <path
            d="M 110 32 C 68 32 34 66 34 108 C 34 150 68 184 110 184 C 126 184 141 179 153 170 L 175 192 C 178 195 184 195 187 192 C 190 189 190 183 187 180 L 166 159 C 178 146 186 128 186 108 C 186 66 152 32 110 32 Z"
            fill="url(#qTealGrad)"
          />

          {/* Inner Lens / Cadastral Map Aperture */}
          <circle cx="110" cy="108" r="54" fill="#0f172a" stroke="#14b8a6" strokeWidth="2.5" />

          {/* Isometric Town & Surveyed Parcel inside the Q */}
          <g transform="translate(110, 108) scale(0.72) translate(-100, -100)">
            {/* Green fields & streets */}
            <polygon points="40,90 100,55 160,90 100,125" fill="#15803d" />
            <polygon points="55,85 95,62 135,85 95,108" fill="#166534" />

            {/* Roads */}
            <line x1="40" y1="90" x2="160" y2="90" stroke="#475569" strokeWidth="8" />
            <line x1="100" y1="55" x2="100" y2="125" stroke="#475569" strokeWidth="8" />

            {/* Buildings inside the town */}
            <rect x="68" y="70" width="14" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="118" y="70" width="14" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="70" y="98" width="14" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="120" y="98" width="14" height="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />

            {/* River curving at right */}
            <path d="M 145 60 Q 130 90 155 120" stroke="#0284c7" strokeWidth="9" fill="none" strokeLinecap="round" />

            {/* Glowing Golden Surveyed Parcel in center */}
            <polygon
              points="82,80 118,80 118,100 82,100"
              fill="rgba(245, 158, 11, 0.45)"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            {/* Crosshair on parcel */}
            <line x1="82" y1="80" x2="118" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="118" y1="80" x2="82" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* Orange Location Pin on the Q's leaf-tail */}
          <g transform="translate(138, 132)">
            <path
              d="M 0 0 C -6 -6 -8 -12 -8 -16 C -8 -21 -4 -25 0 -25 C 4 -25 8 -21 8 -16 C 8 -12 6 -6 0 0 Z"
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="-16" r="3" fill="#ffffff" />
          </g>

          {/* Scanning Beam Cone */}
          <polygon points="172,42 98,92 138,114 180,48" fill="url(#scanBeamNew)" />

          {/* White Drone with Orange Motor highlights */}
          <g transform="translate(174, 44)">
            {/* Propeller arms */}
            <line x1="-18" y1="-6" x2="18" y2="6" stroke="#334155" strokeWidth="2.5" />
            <line x1="-18" y1="6" x2="18" y2="-6" stroke="#334155" strokeWidth="2.5" />

            {/* Rotor blade circles */}
            <ellipse cx="-18" cy="-6" rx="10" ry="3" fill="#94a3b8" fillOpacity="0.5" stroke="#f97316" strokeWidth="1.2" />
            <ellipse cx="18" cy="6" rx="10" ry="3" fill="#94a3b8" fillOpacity="0.5" stroke="#f97316" strokeWidth="1.2" />
            <ellipse cx="-18" cy="6" rx="10" ry="3" fill="#94a3b8" fillOpacity="0.5" stroke="#f97316" strokeWidth="1.2" />
            <ellipse cx="18" cy="-6" rx="10" ry="3" fill="#94a3b8" fillOpacity="0.5" stroke="#f97316" strokeWidth="1.2" />

            {/* Drone Aerodynamic Body */}
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
            {/* Camera gimbal */}
            <circle cx="0" cy="4" r="3.2" fill="#0f172a" />
            <circle cx="0" cy="4" r="1.5" fill="#38bdf8" />
          </g>
        </svg>
      </div>

      {/* Styled Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight font-black">
            {/* Dark Forest Green 'Q' with Orange slash accent */}
            <span className={`font-black text-emerald-400 relative pr-0.5 ${dimensions.text}`}>
              Q
              <span className="absolute bottom-0.5 right-0 w-2 h-1 bg-amber-500 rounded-sm transform rotate-45" />
            </span>
            {/* 'buddy' in clean contrasting text */}
            <span className={`font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} ${dimensions.text}`}>
              buddy
            </span>
          </div>
          <span className={`uppercase font-bold tracking-widest ${dimensions.sub} text-emerald-400/80 mt-0.5`}>
            AI • DRONES • CADASTRE • RESCUE
          </span>
        </div>
      )}
    </div>
  );
};
