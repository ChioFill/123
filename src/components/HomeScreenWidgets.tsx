import React from 'react';
import { Heart, Clock, Sparkles, Music, CloudMoon, Calendar, Check, ExternalLink } from 'lucide-react';
import { DateDetails } from '../types';
import { romanticAudio } from '../services/audioPlayer';

interface HomeScreenWidgetsProps {
  details: DateDetails;
  isDarkMode: boolean;
  onOpenFeedback: () => void;
  onOpenCalendar: () => void;
  onAccept: () => void;
}

export const HomeScreenWidgets: React.FC<HomeScreenWidgetsProps> = ({
  details,
  isDarkMode,
  onOpenFeedback,
  onOpenCalendar,
  onAccept,
}) => {
  const isAccepted = details.status === 'accepted';
  const track = romanticAudio.getCurrentTrack();
  const isAudioPlaying = romanticAudio.getIsPlaying();

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Sparkles size={14} className="text-amber-400" />
          <span>Быстрый доступ</span>
        </div>
        <h2 className="font-romantic text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-pink-300 mb-2">
          Виджеты для главного экрана
        </h2>
        <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
          Интерактивные карточки быстрого доступа в стиле iOS и Android для мгновенного контроля встречи.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: RSVP Status */}
        <div
          onClick={isAccepted ? onOpenCalendar : onAccept}
          className={`p-4 rounded-3xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md flex flex-col justify-between ${
            isAccepted
              ? 'bg-gradient-to-br from-emerald-950/40 via-[#180e15] to-[#180e15] border-emerald-500/30'
              : isDarkMode
              ? 'bg-[#180e15] border-rose-900/40 hover:border-rose-500/40'
              : 'bg-white border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Статус</span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isAccepted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {isAccepted ? <Check size={14} /> : <Heart size={14} />}
            </div>
          </div>
          <div>
            <span className="font-romantic text-lg font-bold block leading-tight">
              {isAccepted ? 'Встреча подтверждена' : 'Ждёт ответа'}
            </span>
            <p className="text-[11px] text-rose-400/90 mt-1">
              {isAccepted ? 'Свидание 03 октября ❤️' : 'Нажми, чтобы согласиться'}
            </p>
          </div>
        </div>

        {/* Widget 2: Time & Location */}
        <div
          onClick={onOpenFeedback}
          className={`p-4 rounded-3xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md flex flex-col justify-between ${
            isDarkMode
              ? 'bg-[#180e15] border-rose-900/40 hover:border-rose-500/40'
              : 'bg-white border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Время & Место</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <div>
            <span className="font-romantic text-xl font-bold block leading-tight text-rose-400">
              {details.time}
            </span>
            <p className="text-[11px] text-rose-300 truncate mt-1" title={details.location}>
              {details.location}
            </p>
          </div>
        </div>

        {/* Widget 3: Weather Forecast for Oct 3 */}
        <div
          className={`p-4 rounded-3xl border transition-all duration-300 shadow-md flex flex-col justify-between ${
            isDarkMode ? 'bg-[#180e15] border-rose-900/40' : 'bg-white border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Погода 3 октября</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CloudMoon size={14} />
            </div>
          </div>
          <div>
            <span className="font-romantic text-xl font-bold block leading-tight text-amber-400">
              +14°C · Ясно
            </span>
            <p className="text-[11px] text-rose-300 mt-1">
              Звёздное небо & идеальный осенний вечер для свидания
            </p>
          </div>
        </div>

        {/* Widget 4: Music Widget */}
        <div
          onClick={() => romanticAudio.togglePlay()}
          className={`p-4 rounded-3xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md flex flex-col justify-between ${
            isDarkMode
              ? 'bg-[#180e15] border-rose-900/40 hover:border-rose-500/40'
              : 'bg-white border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Музыка</span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isAudioPlaying ? 'bg-pink-500 text-white animate-pulse' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              <Music size={14} />
            </div>
          </div>
          <div>
            <span className="font-romantic text-sm font-bold block leading-tight truncate">
              {track.title}
            </span>
            <p className="text-[11px] text-rose-400/90 mt-1">
              {isAudioPlaying ? 'Сейчас играет ♪' : 'Нажми для включения'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
