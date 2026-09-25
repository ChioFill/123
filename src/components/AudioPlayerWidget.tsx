import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, ChevronDown } from 'lucide-react';
import { romanticAudio, TRACK_OPTIONS, TrackOption } from '../services/audioPlayer';

interface AudioPlayerWidgetProps {
  isDarkMode: boolean;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ isDarkMode }) => {
  const [isPlaying, setIsPlaying] = useState(romanticAudio.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<TrackOption>(romanticAudio.getCurrentTrack());
  const [volume, setVolume] = useState(romanticAudio.getVolume());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBars, setAudioBars] = useState<number[]>([4, 8, 14, 6, 12, 18, 9, 5]);

  useEffect(() => {
    const unsubPlaying = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    const unsubTrack = romanticAudio.subscribeTrack((t) => {
      setCurrentTrack(t);
    });

    // Simple visualizer tick
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        const raw = romanticAudio.getVisualizerData();
        const bars = [
          Math.max(4, (raw[0] || 30) / 10),
          Math.max(4, (raw[2] || 60) / 8),
          Math.max(4, (raw[4] || 90) / 7),
          Math.max(4, (raw[6] || 40) / 9),
          Math.max(4, (raw[8] || 80) / 8),
          Math.max(4, (raw[10] || 50) / 9),
          Math.max(4, (raw[12] || 70) / 7),
          Math.max(4, (raw[14] || 30) / 10),
        ];
        setAudioBars(bars);
      }, 100);
    } else {
      setAudioBars([4, 4, 4, 4, 4, 4, 4, 4]);
    }

    return () => {
      unsubPlaying();
      unsubTrack();
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    romanticAudio.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    romanticAudio.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      romanticAudio.setVolume(volume || 0.4);
    } else {
      setIsMuted(true);
      romanticAudio.setVolume(0);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    romanticAudio.setTrack(trackId);
    setIsDropdownOpen(false);
    if (!isPlaying) {
      romanticAudio.play();
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full border transition-all shadow-sm ${
          isDarkMode
            ? 'bg-[#1a0f15]/90 border-rose-500/30 text-rose-100 hover:border-rose-400/50'
            : 'bg-white/95 border-rose-200 text-rose-950 hover:border-rose-300'
        }`}
      >
        {/* Play / Pause button */}
        <button
          onClick={handleTogglePlay}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md shadow-rose-600/30"
          title={isPlaying ? 'Приостановить музыку' : 'Включить романтическую мелодию'}
          aria-label={isPlaying ? 'Приостановить' : 'Воспроизвести'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        {/* Track Title and wave */}
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium"
        >
          <Disc3
            size={16}
            className={`text-rose-500 ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />
          <div className="max-w-[110px] sm:max-w-[150px] truncate">
            <span className="block truncate font-semibold">{currentTrack.title}</span>
            <span className="text-[10px] text-rose-400/80 hidden sm:block">Альтернативные треки</span>
          </div>
          <ChevronDown size={14} className="text-rose-400 opacity-80" />
        </div>

        {/* Animated Sound Bars */}
        <div className="hidden md:flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
          {audioBars.map((height, i) => (
            <span
              key={i}
              className="w-1 bg-gradient-to-t from-rose-600 to-pink-400 rounded-full transition-all duration-100"
              style={{ height: `${Math.min(16, height)}px` }}
            />
          ))}
        </div>

        {/* Volume slider */}
        <div className="hidden lg:flex items-center gap-1.5 pl-1 border-l border-rose-300/20">
          <button
            onClick={handleToggleMute}
            className="text-rose-400 hover:text-rose-600 transition-colors"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-rose-200 dark:bg-rose-900/60 rounded-lg appearance-none cursor-pointer accent-rose-500"
            title="Громкость музыки"
          />
        </div>
      </div>

      {/* Alternative Tracks Dropdown */}
      {isDropdownOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isDarkMode
              ? 'bg-[#1d1017] border-rose-500/30 text-rose-50'
              : 'bg-white border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 border-b border-rose-500/20 mb-1">
            <Music size={13} />
            <span>Выбор фоновой мелодии</span>
          </div>
          <div className="space-y-1">
            {TRACK_OPTIONS.map((track) => {
              const isSelected = track.id === currentTrack.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                      : isDarkMode
                      ? 'hover:bg-rose-950/40 text-rose-200'
                      : 'hover:bg-rose-50 text-rose-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {isSelected && isPlaying ? (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-rose-300/40 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold leading-tight">{track.title}</p>
                    <p className="text-[11px] opacity-70 mt-0.5 leading-snug">{track.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-rose-500/20 px-2 text-[10px] text-rose-400/80 flex items-center justify-between">
            <span>Синтезируется прямо в браузере</span>
            <span className="font-semibold text-emerald-400">100% Офлайн</span>
          </div>
        </div>
      )}
    </div>
  );
};
