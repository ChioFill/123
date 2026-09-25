import React from 'react';
import { X, Calendar, Bell, Check, ExternalLink, Download, Smartphone } from 'lucide-react';
import { DateDetails } from '../types';
import { downloadAppleCalendarICS, getGoogleCalendarURL } from '../services/calendar';

interface AppleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DateDetails;
  isDarkMode: boolean;
}

export const AppleCalendarModal: React.FC<AppleCalendarModalProps> = ({
  isOpen,
  onClose,
  details,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const eventParams = {
    title: 'Наше особенное свидание ❤️',
    description: `Романтический вечер для двоих.\nМесто: ${details.location}\nЗаметки: ${details.notes || 'Жду нашей встречи!'}\nОбязательно приходи в хорошем настроении! ❤️`,
    location: details.location,
    dateStr: details.date,
    timeStr: details.time,
  };

  const handleDownloadAppleCalendar = () => {
    downloadAppleCalendarICS(eventParams);
  };

  const handleOpenGoogleCalendar = () => {
    window.open(getGoogleCalendarURL(eventParams), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 transition-all ${
          isDarkMode
            ? 'bg-[#180e15] border-rose-500/30 text-rose-50'
            : 'bg-white border-rose-200 text-rose-950'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
            isDarkMode
              ? 'border-rose-800/40 text-rose-400 hover:text-white'
              : 'border-rose-200 text-rose-500 hover:bg-rose-50'
          }`}
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
            <Calendar size={28} />
          </div>
          <h3 className="font-romantic text-2xl sm:text-3xl font-bold">
            Синхронизация с Календарём
          </h3>
          <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-rose-300/80' : 'text-rose-800/80'}`}>
            Событие добавится в твой Apple Calendar или Google Calendar с автоматическими напоминаниями.
          </p>
        </div>

        {/* Event Preview Card */}
        <div
          className={`p-4 rounded-2xl border mb-6 space-y-2.5 ${
            isDarkMode ? 'bg-[#12080f] border-rose-900/40' : 'bg-rose-50/60 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-500">
            <span>Наше особенное свидание ❤️</span>
            <span className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Напоминания активны
            </span>
          </div>

          <div className="text-xs space-y-1">
            <p>
              📅 <b>Дата:</b> {details.date === '2026-10-03' ? '03 октября 2026' : details.date} в {details.time}
            </p>
            <p className="truncate">
              📍 <b>Место:</b> {details.location}
            </p>
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <Bell size={12} />
              <span>Автонапоминание: за 1 день и за 2 часа до встречи</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadAppleCalendar}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download size={16} />
            <span>Добавить в Apple Календарь (.ics) 🍏</span>
          </button>

          <button
            onClick={handleOpenGoogleCalendar}
            className={`w-full py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isDarkMode
                ? 'bg-[#1a0f16] border-rose-800/60 text-rose-200 hover:border-rose-400'
                : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50'
            }`}
          >
            <ExternalLink size={15} />
            <span>Открыть в Google Календаре</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-rose-500/10 text-center">
          <p className="text-[11px] text-rose-400/80 flex items-center justify-center gap-1">
            <Smartphone size={12} />
            <span>Подходит для iPhone, iPad, Mac и Apple Watch</span>
          </p>
        </div>
      </div>
    </div>
  );
};
