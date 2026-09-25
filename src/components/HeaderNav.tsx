import React from 'react';
import { Heart, Sun, Moon, Bell, ShieldCheck, Wifi, WifiOff, Calendar, Download } from 'lucide-react';
import { AudioPlayerWidget } from './AudioPlayerWidget';

interface HeaderNavProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenVault: () => void;
  onOpenCalendarModal: () => void;
  isOnline: boolean;
  isCloudSynced: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isDarkMode,
  onToggleTheme,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenVault,
  onOpenCalendarModal,
  isOnline,
  isCloudSynced,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b duration-200">
      <div
        className={`w-full ${
          isDarkMode
            ? 'bg-[#0f090d]/80 border-rose-950/40 text-rose-100'
            : 'bg-white/80 border-rose-100 text-rose-950'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 flex items-center justify-center shadow-lg shadow-rose-600/25">
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <span className="font-romantic text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300">
                Для Моей Любимой
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-rose-400/90 font-medium">
                <span>03 Октября 2026</span>
                <span aria-hidden="true">·</span>
                <span>20:00</span>
              </div>
            </div>
          </div>

          {/* Center / Audio Widget */}
          <div className="hidden sm:block">
            <AudioPlayerWidget isDarkMode={isDarkMode} />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Cloud Sync Status Indicator */}
            <div
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                !isOnline
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : isCloudSynced
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
              title={
                !isOnline
                  ? 'Офлайн режим (данные в защищенном хранилище)'
                  : isCloudSynced
                  ? 'Облачная синхронизация в реальном времени активна'
                  : 'Синхронизация...'
              }
            >
              {!isOnline ? (
                <>
                  <WifiOff size={12} />
                  <span>Офлайн</span>
                </>
              ) : (
                <>
                  <Wifi size={12} className="text-emerald-400" />
                  <span>Cloud Sync</span>
                </>
              )}
            </div>

            {/* Encrypted Vault Button */}
            <button
              onClick={onOpenVault}
              className={`p-2 rounded-xl transition-all border ${
                isDarkMode
                  ? 'bg-[#180e14] border-rose-900/40 text-rose-300 hover:text-white hover:border-rose-500/40'
                  : 'bg-rose-50/80 border-rose-200 text-rose-700 hover:text-rose-950 hover:border-rose-300'
              }`}
              title="Зашифрованное хранилище AES-256-GCM"
              aria-label="Зашифрованное хранилище"
            >
              <ShieldCheck size={17} className="text-emerald-500" />
            </button>

            {/* Apple Calendar Quick Button */}
            <button
              onClick={onOpenCalendarModal}
              className={`p-2 rounded-xl transition-all border ${
                isDarkMode
                  ? 'bg-[#180e14] border-rose-900/40 text-rose-300 hover:text-white hover:border-rose-500/40'
                  : 'bg-rose-50/80 border-rose-200 text-rose-700 hover:text-rose-950 hover:border-rose-300'
              }`}
              title="Синхронизация с Apple Календарем"
              aria-label="Синхронизация с Apple Календарем"
            >
              <Calendar size={17} className="text-rose-400" />
            </button>

            {/* Critical Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-2 rounded-xl transition-all border ${
                isDarkMode
                  ? 'bg-[#180e14] border-rose-900/40 text-rose-300 hover:text-white hover:border-rose-500/40'
                  : 'bg-rose-50/80 border-rose-200 text-rose-700 hover:text-rose-950 hover:border-rose-300'
              }`}
              title="Уведомления об изменениях"
              aria-label="Уведомления"
            >
              <Bell size={17} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#0f090d]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl transition-all border ${
                isDarkMode
                  ? 'bg-[#180e14] border-rose-900/40 text-amber-300 hover:border-amber-400/40'
                  : 'bg-rose-50/80 border-rose-200 text-purple-900 hover:border-rose-300'
              }`}
              title={isDarkMode ? 'Включить светлую тему' : 'Включить ночную тему'}
              aria-label="Переключить тему оформления"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Audio widget strip */}
        <div className="sm:hidden px-4 pb-2 flex justify-center">
          <AudioPlayerWidget isDarkMode={isDarkMode} />
        </div>
      </div>
    </header>
  );
};
