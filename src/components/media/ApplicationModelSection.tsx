import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Smartphone, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Download,
  Film
} from 'lucide-react';

interface ApplicationModelSectionProps {
  onExploreMap: () => void;
  theme?: 'dark' | 'light';
}

export const ApplicationModelSection: React.FC<ApplicationModelSectionProps> = ({
  onExploreMap,
  theme = 'dark',
}) => {
  const [activeModelVideo, setActiveModelVideo] = useState<'app' | 'video'>('app');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const modelVideos = {
    app: {
      url: '/videos/app.mp4',
      title: 'QBuddy Mobile App & Field Verification Architecture',
      subtitle: 'Native field surveyor workflow: live AR parcel delimitation, physical QR plate scan, and encrypted RTK sync.',
      badge: 'APP.MP4 DEMO',
      duration: 'Surveyor Field Edition',
    },
    video: {
      url: '/videos/video.mp4',
      title: 'Full Mission Flight & System Architecture',
      subtitle: 'End-to-end aerial mission execution: orthophoto stitching, automated SegFormer parcelization, and cloud cadastre consensus.',
      badge: 'VIDEO.MP4 CORE',
      duration: 'Cadastre Drone Hub',
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

  const handleSelectVideo = (key: 'app' | 'video') => {
    setActiveModelVideo(key);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <section 
      id="application-model" 
      className={`relative py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-colors ${
        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 space-y-4 select-none">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-md ${
          theme === 'dark'
            ? 'bg-slate-900 border border-slate-700/80 text-cyan-400'
            : 'bg-white border border-slate-300 text-cyan-700 shadow-sm'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>APPLICATION MODEL &bull; ARCHITECTURE DEMO</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-sans">
          Application Model Showcase.
        </h2>

        <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Explore the working field application walkthrough alongside the full autonomous flight operations engine — powered by deep multi-task spatial AI and centimeter GNSS control.
        </p>

        {/* Video Selector Toggle Pills */}
        <div className={`flex items-center gap-2 p-1.5 rounded-full shadow-lg border ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => handleSelectVideo('app')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeModelVideo === 'app'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Model (app.mp4)</span>
          </button>

          <button
            onClick={() => handleSelectVideo('video')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeModelVideo === 'video'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>System Flight (Video.mp4)</span>
          </button>
        </div>
      </div>

      {/* Video Container Box */}
      <div className={`relative rounded-3xl overflow-hidden border shadow-[0_20px_60px_rgba(0,0,0,0.7)] max-w-5xl mx-auto group ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
      }`}>
        {/* Top title bar */}
        <div className={`h-12 border-b px-4 sm:px-6 flex items-center justify-between text-xs font-mono ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-sm">{modelVideos[activeModelVideo].title}</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-[10px]">
              {modelVideos[activeModelVideo].badge}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:block">
            {modelVideos[activeModelVideo].duration}
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={modelVideos[activeModelVideo].url}
            className="w-full h-full object-contain"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Big Center Play Overlay */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.6)] transform transition-transform hover:scale-110">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Floating Controls Bar */}
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-slate-200 font-mono text-xs opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 hover:text-cyan-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-cyan-400 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[11px] text-slate-400 hidden sm:inline-block truncate max-w-md">
                {modelVideos[activeModelVideo].subtitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:text-cyan-400 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specs Grid */}
        <div className={`p-4 sm:p-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold">Offline-First Field Sync</h4>
              <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Local SQLite cache queues boundary confirmations and syncs with append-only ledger when 5G reconnects.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold">Survey of India CORS</h4>
              <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Centimeter positioning via reference base stations ensures boundaries conform to Indian geospatial policy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold">Automated Topology Cleaner</h4>
              <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Planar graph vectorization removes sliver polygons and detects encroachments with zero boundary overlap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
