import React, { useState } from 'react';
import { X, Bell, CheckCheck, Sparkles, ShieldAlert, Heart, Volume2 } from 'lucide-react';
import { CriticalNotification } from '../types';
import { NotificationService } from '../services/notificationService';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CriticalNotification[];
  isDarkMode: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  isDarkMode,
}) => {
  const [hasPushPermission, setHasPushPermission] = useState(
    'Notification' in window ? Notification.permission === 'granted' : false
  );

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const granted = await NotificationService.requestPushPermission();
    setHasPushPermission(granted);
    if (granted) {
      NotificationService.addNotification(
        'Push-уведомления включены 🔔',
        'Теперь ты мгновенно узнаешь обо всех подтверждениях и изменениях.',
        'success'
      );
    }
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
  };

  const getIconForType = (type: CriticalNotification['type']) => {
    switch (type) {
      case 'celebration':
        return <Heart size={16} className="text-rose-500 fill-rose-500" />;
      case 'warning':
        return <ShieldAlert size={16} className="text-amber-500" />;
      case 'success':
        return <CheckCheck size={16} className="text-emerald-500" />;
      default:
        return <Sparkles size={16} className="text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l ${
          isDarkMode
            ? 'bg-[#180e15] border-rose-900/40 text-rose-50'
            : 'bg-white border-rose-200 text-rose-950'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-rose-500/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-romantic text-xl font-bold">Центр уведомлений</h3>
                <p className="text-[11px] text-rose-400">Критические изменения и статусы</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full border transition-colors ${
                isDarkMode ? 'border-rose-800 text-rose-400 hover:text-white' : 'border-rose-200 text-rose-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Push permission banner */}
          {!hasPushPermission && (
            <div
              className={`p-3.5 rounded-2xl border mb-4 text-xs ${
                isDarkMode ? 'bg-rose-950/30 border-rose-800/50' : 'bg-rose-50 border-rose-200'
              }`}
            >
              <p className="font-semibold mb-1 text-rose-400">Включить Push-уведомления?</p>
              <p className="text-[11px] opacity-80 mb-2">
                Получай мгновенные подтверждения прямо на экран телефона или компьютера.
              </p>
              <button
                onClick={handleRequestPush}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition-colors"
              >
                Разрешить уведомления
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="space-y-2.5">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-rose-400/70 py-8">Пока нет новых уведомлений</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs ${
                    !item.read
                      ? isDarkMode
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                        : 'bg-rose-50/70 border-rose-300 shadow-sm'
                      : isDarkMode
                      ? 'bg-[#140b12] border-rose-900/30 opacity-75'
                      : 'bg-white border-rose-100 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{getIconForType(item.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-400">{item.title}</span>
                        <span className="text-[10px] opacity-60">
                          {new Date(item.timestamp).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-rose-500/10 flex items-center justify-between">
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1"
          >
            <CheckCheck size={14} />
            <span>Прочитать все</span>
          </button>

          <span className="text-[10px] text-rose-400/70">Система оповещений активна</span>
        </div>
      </div>
    </div>
  );
};
