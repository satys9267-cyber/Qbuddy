import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Film, 
  Sparkles, 
  Layers, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CinematicPreviewSectionProps {
  onLaunchCommandCenter: () => void;
}

export const CinematicPreviewSection: React.FC<CinematicPreviewSectionProps> = ({
  onLaunchCommandCenter,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<'video1' | 'video2'>('video1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSources = {
    video1: {
      url: '/videos/vision-1.mp4',
      title: 'Mission Command Center & Cadastral Analytics',
      subtitle: 'Real-time 3D flight pathing, LiDAR nDSM edge detection, and topological parcel validation.',
      badge: 'FLIGHT TELEMETRY HUD',
    },
    video2: {
      url: '/videos/vision-2.mp4',
      title: 'QBuddy Mobile — Rugged Tablet & AR Ground Truthing',
      subtitle: 'Centimeter-level RTK GNSS lock, in-situ AR boundary projection, and instant parcel QR plate scan.',
      badge: 'SURVEYOR FIELD APP',
    },
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSelectVideo = (key: 'video1' | 'video2') => {
    setSelectedVideo(key);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <section id="cinematic-preview" className="relative py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header & Quote */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-emerald-400 text-xs font-mono font-bold shadow-md">
          <Film className="w-3.5 h-3.5" />
          <span>CINEMATIC DEMO PREVIEW &bull; PROTOTYPE IN ACTION</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
          Experience the Vision.
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
          &ldquo;Transforming raw high-resolution drone imagery into legally sound, topologically clean urban cadastral records with centimeter-level human-in-the-loop ground truthing.&rdquo;
        </p>

        {/* Video Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-full shadow-lg">
          <button
            onClick={() => handleSelectVideo('video1')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              selectedVideo === 'video1'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Command Center HUD</span>
          </button>

          <button
            onClick={() => handleSelectVideo('video2')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              selectedVideo === 'video2'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Mobile Field AR</span>
          </button>
        </div>
      </div>

      {/* Main Video Display Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-5xl mx-auto group">
        {/* Top video title bar */}
        <div className="h-12 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold">{videoSources[selectedVideo].title}</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
              {videoSources[selectedVideo].badge}
            </span>
          </div>

          <div className="text-slate-400 text-[11px] hidden md:block">
            SIH26012 NAKSHA ULB PILOT
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoSources[selectedVideo].url}
            className="w-full h-full object-contain"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Big Center Play Button Overlay when paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.6)] transform transition-transform hover:scale-110">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Floating Video Controls */}
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-slate-300 font-mono text-xs opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 hover:text-emerald-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-emerald-400 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                {videoSources[selectedVideo].subtitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:text-emerald-400 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid below player */}
        <div className="p-4 sm:p-6 bg-slate-900/60 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">AI Edge Extraction</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                SegFormer &amp; HiSup polygonization generates closed, shared-edge parcel polygons without overlaps or sliver gaps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">In-Situ AR Projection</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Field surveyors view 3D boundaries overlaid onto live street geometry with centimetre-accurate CORS RTK lock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">Verified Handover</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Instant QR code scan, citizen OTP SMS signature, and append-only tamper-proof cadastral ledger synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
