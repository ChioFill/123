import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDateStr: string; // '2026-10-03'
  targetTimeStr: string; // '20:00'
  isDarkMode: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateStr,
  targetTimeStr,
  isDarkMode,
}) => {
  const calculateRemaining = (): TimeRemaining => {
    const [year, month, day] = targetDateStr.split('-').map(Number);
    const [hours, minutes] = targetTimeStr.split(':').map(Number);
    const target = new Date(year, month - 1, day, hours, minutes, 0).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutesRemaining = Math.floor((diff / 1000 / 60) % 60);
    const hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { days, hours: hoursRemaining, minutes: minutesRemaining, seconds, isPast: false };
  };

  const [remaining, setRemaining] = useState<TimeRemaining>(calculateRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr, targetTimeStr]);

  const timeBlocks = [
    { label: 'Дней', value: remaining.days },
    { label: 'Часов', value: remaining.hours },
    { label: 'Минут', value: remaining.minutes },
    { label: 'Секунд', value: remaining.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-widest text-rose-400 font-semibold">
        <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>До нашего незабываемого свидания осталось:</span>
        <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeBlocks.map((block, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-b from-[#21111a] to-[#160c13] border-rose-500/25 text-rose-50 shadow-rose-950/40'
                : 'bg-gradient-to-b from-white to-rose-50/70 border-rose-200 text-rose-950 shadow-rose-100'
            }`}
          >
            <span className="font-romantic text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-rose-400 to-rose-600">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-rose-400/90 mt-1 uppercase tracking-wider">
              {block.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-rose-400/80 flex items-center justify-center gap-1.5">
        <Clock size={13} />
        <span>
          Встреча назначена на {targetDateStr === '2026-10-03' ? '3 октября 2026' : targetDateStr} в {targetTimeStr}
        </span>
      </div>
    </div>
  );
};
