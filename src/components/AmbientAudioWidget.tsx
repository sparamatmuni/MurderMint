import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Disc, 
  CloudRain, 
  Flame, 
  Radio, 
  Sliders, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  getAmbientMode, 
  setAmbientMode, 
  isAmbientActive, 
  toggleAmbientAudio, 
  getAmbientVolume, 
  setAmbientVolume, 
  toggleMute, 
  isMuted,
  playClickSound,
  AmbientSoundMode 
} from '../utils/sound';

interface AmbientAudioWidgetProps {
  variant?: 'compact' | 'expanded' | 'minimal';
  className?: string;
}

export const AmbientAudioWidget: React.FC<AmbientAudioWidgetProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState<AmbientSoundMode>('vintage-jazz');
  const [volume, setVolume] = useState(0.35);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPlaying(isAmbientActive());
    setCurrentMode(getAmbientMode());
    setVolume(getAmbientVolume());
    setIsSfxMuted(isMuted());

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTogglePlay = () => {
    playClickSound();
    const nextState = toggleAmbientAudio();
    setIsPlaying(nextState);
  };

  const handleModeChange = (mode: AmbientSoundMode) => {
    playClickSound();
    setAmbientMode(mode);
    setCurrentMode(mode);
    if (!isPlaying && mode !== 'off') {
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setAmbientVolume(val);
  };

  const handleToggleSfx = () => {
    const next = toggleMute();
    setIsSfxMuted(next);
    if (!next) {
      playClickSound();
    }
  };

  const getModeLabel = (mode: AmbientSoundMode) => {
    switch (mode) {
      case 'vintage-jazz':
        return '1930s Parlor Jazz';
      case 'mansion-storm':
        return 'Mansion Rain & Hearth';
      case 'gramophone-ensemble':
        return 'Grand Noir Ensemble';
      default:
        return 'Ambience Off';
    }
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      {variant === 'minimal' ? (
        <button
          type="button"
          id="btn-ambient-minimal-toggle"
          onClick={handleTogglePlay}
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-[#2A1B12] text-[#D4AF37] border-[#C99738] shadow-[0_0_12px_rgba(201,151,56,0.3)]'
              : 'bg-[#120B07] text-[#BAAFA1] border-[#4A3322] hover:border-[#785822]'
          }`}
          title={isPlaying ? 'Pause 1930s Gramophone' : 'Play 1930s Bungalow Ambience'}
        >
          <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin text-[#D4AF37]' : ''}`} style={{ animationDuration: '4s' }} />
        </button>
      ) : (
        <div className="inline-flex items-center rounded-lg bg-[#120B07] border border-[#5A3E2B] p-0.5 shadow-md">
          <button
            type="button"
            id="btn-ambient-toggle-audio"
            onClick={handleTogglePlay}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-antique font-bold tracking-wide transition-all cursor-pointer select-none ${
              isPlaying
                ? 'bg-[#2A1B12] text-[#D4AF37] border border-[#C99738]/60 shadow-[0_0_10px_rgba(201,151,56,0.25)]'
                : 'text-[#BAAFA1] hover:text-[#F7EFE2] hover:bg-[#1E140D]'
            }`}
            title={isPlaying ? 'Pause Vintage Ambience' : 'Play 1930s Bungalow Ambience'}
          >
            <Disc className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'animate-spin text-[#D4AF37]' : 'text-[#BAAFA1]'}`} style={{ animationDuration: '4s' }} />
            <span className="hidden sm:inline">
              {isPlaying ? getModeLabel(currentMode) : 'Gramophone'}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-2.5 bg-[#D4AF37] animate-pulse rounded-full" />
                <span className="w-1 h-3.5 bg-[#D4AF37] animate-pulse rounded-full" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-[#D4AF37] animate-pulse rounded-full" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </button>

          {/* Expand Settings Menu Button */}
          <button
            type="button"
            id="btn-ambient-settings-menu"
            onClick={() => {
              playClickSound();
              setIsOpen(!isOpen);
            }}
            className="p-1.5 text-[#BAAFA1] hover:text-[#D4AF37] hover:bg-[#1E140D] rounded-md transition-colors cursor-pointer"
            title="Audio Atmosphere Settings"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="ambient-audio-popover"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-[#1E140D] border-2 border-[#C99738] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 animate-fade-in backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#4A3322] mb-3">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin text-[#D4AF37]' : 'text-[#BAAFA1]'}`} style={{ animationDuration: '4s' }} />
              <h4 className="font-antique font-bold text-sm text-[#F7EFE2] tracking-wide">
                Vintage Bungalow Audio
              </h4>
            </div>
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`text-[11px] font-typewriter px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                isPlaying 
                  ? 'bg-[#9B2226] text-[#F7EFE2] border-[#D4AF37]/50' 
                  : 'bg-[#2A1B12] text-[#D4AF37] border-[#785822]'
              }`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>

          {/* Soundscapes Selector */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#BAAFA1] block">
              Atmosphere Selection
            </span>

            {/* Mode 1: 1930s Parlor Jazz */}
            <button
              type="button"
              id="ambient-option-jazz"
              onClick={() => handleModeChange('vintage-jazz')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                currentMode === 'vintage-jazz' && isPlaying
                  ? 'bg-[#2A1B12] border-[#C99738] text-[#F7EFE2]'
                  : 'bg-[#120B07] border-[#3E291C] text-[#BAAFA1] hover:border-[#5A3E2B]'
              }`}
            >
              <Music className={`w-4 h-4 mt-0.5 shrink-0 ${currentMode === 'vintage-jazz' && isPlaying ? 'text-[#D4AF37]' : 'text-[#BAAFA1]'}`} />
              <div>
                <div className="text-xs font-antique font-bold text-[#F7EFE2]">
                  1930s Parlor Jazz
                </div>
                <div className="text-[10px] text-[#BAAFA1] font-sans">
                  Smoky Rhodes chords, acoustic walking bass, brushed snare & 78 RPM vinyl crackle
                </div>
              </div>
            </button>

            {/* Mode 2: Mansion Rain & Hearth */}
            <button
              type="button"
              id="ambient-option-storm"
              onClick={() => handleModeChange('mansion-storm')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                currentMode === 'mansion-storm' && isPlaying
                  ? 'bg-[#2A1B12] border-[#C99738] text-[#F7EFE2]'
                  : 'bg-[#120B07] border-[#3E291C] text-[#BAAFA1] hover:border-[#5A3E2B]'
              }`}
            >
              <CloudRain className={`w-4 h-4 mt-0.5 shrink-0 ${currentMode === 'mansion-storm' && isPlaying ? 'text-[#D4AF37]' : 'text-[#BAAFA1]'}`} />
              <div>
                <div className="text-xs font-antique font-bold text-[#F7EFE2]">
                  Mansion Rain & Hearth
                </div>
                <div className="text-[10px] text-[#BAAFA1] font-sans">
                  Crackling fireplace embers, midnight rain against glass, howling veranda wind
                </div>
              </div>
            </button>

            {/* Mode 3: Grand Noir Ensemble */}
            <button
              type="button"
              id="ambient-option-ensemble"
              onClick={() => handleModeChange('gramophone-ensemble')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                currentMode === 'gramophone-ensemble' && isPlaying
                  ? 'bg-[#2A1B12] border-[#C99738] text-[#F7EFE2]'
                  : 'bg-[#120B07] border-[#3E291C] text-[#BAAFA1] hover:border-[#5A3E2B]'
              }`}
            >
              <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${currentMode === 'gramophone-ensemble' && isPlaying ? 'text-[#D4AF37]' : 'text-[#BAAFA1]'}`} />
              <div>
                <div className="text-xs font-antique font-bold text-[#F7EFE2]">
                  Grand Noir Ensemble
                </div>
                <div className="text-[10px] text-[#BAAFA1] font-sans">
                  Complete vintage immersion: Parlor jazz accompanied by the stormy hearth
                </div>
              </div>
            </button>
          </div>

          {/* Volume Control */}
          <div className="pt-3 border-t border-[#4A3322] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-typewriter text-[#BAAFA1] flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Ambient Volume</span>
              </span>
              <span className="font-mono text-[#D4AF37] text-[11px]">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#120B07] rounded-lg"
            />
          </div>

          {/* SFX Mute Checkbox */}
          <div className="pt-3 mt-3 border-t border-[#4A3322] flex items-center justify-between">
            <span className="text-xs text-[#BAAFA1] font-sans">Sound Effects (Dice, Footsteps)</span>
            <button
              type="button"
              onClick={handleToggleSfx}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isSfxMuted
                  ? 'bg-[#120B07] text-[#BAAFA1] border-[#4A3322]'
                  : 'bg-[#2A1B12] text-[#D4AF37] border-[#785822]'
              }`}
              title={isSfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isSfxMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
