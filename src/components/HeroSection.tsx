import React from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar, MapPin, CheckCircle2, SlidersHorizontal, ArrowDown } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { DateDetails } from '../types';
import couplePhoto from '../assets/images/hero_girl_photo_1790361474971.jpg';
import { Camera, Gift } from 'lucide-react';

interface HeroSectionProps {
  details: DateDetails;
  isDarkMode: boolean;
  customHeroPhoto?: string;
  onAccept: () => void;
  onOpenFeedback: () => void;
  onOpenCalendar: () => void;
  onPhotoClick?: () => void;
  onUploadHeroPhoto?: (base64: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  isDarkMode,
  customHeroPhoto,
  onAccept,
  onOpenFeedback,
  onOpenCalendar,
  onPhotoClick,
  onUploadHeroPhoto,
}) => {
  const isAccepted = details.status === 'accepted';
  const activePhoto = customHeroPhoto || couplePhoto;

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadHeroPhoto) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUploadHeroPhoto(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerRomanticConfetti = () => {
    // Multi-color rose and golden confetti explosion
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#e11d48', '#fda4af', '#f43f5e', '#fb7185'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#fbbf24', '#f59e0b', '#ffffff'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#be123c', '#e11d48', '#ffccd5'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#ffe4e6', '#ec4899'],
    });
  };

  const handleAcceptClick = () => {
    triggerRomanticConfetti();
    onAccept();
  };

  return (
    <section className="relative pt-6 pb-14 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      {/* Subtle top romantic kicker */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium mb-4 transition-colors border border-rose-500/20 bg-rose-500/10 text-rose-300">
        <Sparkles size={13} className="text-amber-400" />
        <span>Особенное приглашение только для тебя</span>
        <Heart size={12} className="text-rose-400 fill-rose-400" />
      </div>

      {/* Main Title */}
      <h1 className="font-romantic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-pink-300 max-w-3xl leading-[1.1] mb-4">
        Любимая, пойдёшь со мной на свидание?
      </h1>

      <p
        className={`text-base sm:text-lg max-w-2xl font-light leading-relaxed mb-6 ${
          isDarkMode ? 'text-rose-200/90' : 'text-rose-900/90'
        }`}
      >
        Я приготовил для нас особенный романтический вечер: тёплую атмосферу, вкусный ужин, приятную музыку
        и моменты, которые останутся в сердце навсегда.
      </p>

      {/* Photo Showcase Card */}
      <div className="relative my-4 group">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div
          className={`relative w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden border p-2 shadow-2xl transition-transform duration-300 hover:scale-[1.02] ${
            isDarkMode ? 'bg-[#1a0e16] border-rose-500/30' : 'bg-white border-rose-200'
          }`}
        >
          <div
            onClick={onPhotoClick}
            className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-rose-950/20 cursor-pointer"
            title="Нажмите, чтобы открыть фото на весь экран"
          >
            <img
              src={activePhoto}
              alt="Моя любимая"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-widest block">
                Моя муза ❤️
              </span>
              <p className="text-white text-xs sm:text-sm font-medium drop-shadow">
                Твой взгляд и твоя улыбка освещают всё вокруг
              </p>
            </div>
          </div>

          {/* Quick upload button to swap with exact local file if desired */}
          {onUploadHeroPhoto && (
            <div className="mt-2 text-center">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors">
                <Camera size={13} />
                <span>Заменить фото на оригинал 📷</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer
        targetDateStr={details.date}
        targetTimeStr={details.time}
        isDarkMode={isDarkMode}
      />

      {/* Date & Location Summary Chips */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium mb-8">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${
            isDarkMode
              ? 'bg-[#1d1017] border-rose-800/40 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <Calendar size={15} className="text-rose-500" />
          <span>{details.date === '2026-10-03' ? '03 октября 2026' : details.date}</span>
          <span className="opacity-50">·</span>
          <span>{details.time}</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border max-w-md truncate ${
            isDarkMode
              ? 'bg-[#1d1017] border-rose-800/40 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
          title={details.location}
        >
          <Gift size={15} className="text-rose-500 shrink-0" />
          <span className="truncate">{details.location || 'Секретное место (Романтический сюрприз 🤫✨)'}</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
        {/* Main "YES" Button */}
        <button
          onClick={handleAcceptClick}
          className={`relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto ${
            isAccepted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-900/40 ring-2 ring-emerald-400'
              : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white hover:from-rose-500 hover:to-pink-500 shadow-rose-900/50 hover:shadow-rose-600/50 hover:scale-105 active:scale-95'
          }`}
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          {isAccepted ? (
            <>
              <CheckCircle2 size={22} className="text-white fill-emerald-600" />
              <span>Да, я согласна! Встреча подтверждена ❤️</span>
            </>
          ) : (
            <>
              <Heart size={22} className="text-white fill-white animate-bounce" />
              <span>Да, я согласна! ❤️</span>
            </>
          )}
        </button>

        {/* Alternative Time / Place Button */}
        <button
          onClick={onOpenFeedback}
          className={`px-6 py-4 rounded-2xl font-medium text-sm sm:text-base border transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto ${
            isDarkMode
              ? 'bg-[#1b0f16] border-rose-500/30 text-rose-200 hover:bg-rose-950/60 hover:border-rose-400'
              : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 shadow-sm'
          }`}
        >
          <SlidersHorizontal size={17} className="text-rose-400" />
          <span>Выбрать другое время или место ✨</span>
        </button>
      </div>

      {/* If Accepted, show quick Apple Calendar reminder */}
      {isAccepted && (
        <div className="mt-5 animate-in fade-in slide-in-from-top-3 duration-300">
          <button
            onClick={onOpenCalendar}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4 decoration-rose-500/50"
          >
            <Calendar size={14} />
            <span>Синхронизировать с Apple Календарем для напоминания</span>
          </button>
        </div>
      )}

      {/* Down arrow anchor */}
      <a
        href="#details"
        className="mt-12 text-rose-400/60 hover:text-rose-400 transition-colors flex flex-col items-center gap-1 text-xs"
      >
        <span>Узнать подробности плана</span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
};
