import React, { useState } from 'react';
import { Smartphone, Send, FileSpreadsheet, FileText, Check, Share2, RefreshCw, MessageSquare, Radio } from 'lucide-react';
import { DateDetails } from '../types';
import { exportInvitationToPDF, exportRSVPToCSV } from '../services/exportService';
import { NotificationService } from '../services/notificationService';

interface RealtimePhoneSyncBarProps {
  details: DateDetails;
  isDarkMode: boolean;
  isOnline: boolean;
  onRefreshSync: () => void;
}

export const RealtimePhoneSyncBar: React.FC<RealtimePhoneSyncBarProps> = ({
  details,
  isDarkMode,
  isOnline,
  onRefreshSync,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [showTelegramConfig, setShowTelegramConfig] = useState(false);

  const handleSendToPhone = async () => {
    setIsSending(true);
    try {
      const statusText =
        details.status === 'accepted'
          ? 'Она сказала ДА! Свидание подтверждено ❤️'
          : details.status === 'rescheduled'
          ? `Она предложила новое время/место: ${details.date} ${details.time}, ${details.location}`
          : 'Новый просмотр приглашения на свидание!';

      await NotificationService.sendLivePhoneAlert({
        title: 'Уведомление от любимой ❤️',
        message: `${statusText}\nЗаметки: ${details.notes || 'Без заметок'}\nЛокация: ${details.location}`,
        telegramChatId: telegramChatId || undefined,
        urgency: 'high',
      });

      NotificationService.addNotification(
        'Отправлено на телефон 📲',
        'Уведомление в режиме реального времени успешно доставлено.',
        'success'
      );

      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Привет, любимый! Я посмотрела наше приглашение на свидание: ${
        details.status === 'accepted' ? 'Я согласна на 03 октября в 20:00! ❤️' : `Хочу предложить: ${details.date} в ${details.time} (${details.location})`
      }`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Привет, любимый! Ответ по поводу свидания 03.10.2026: ${
        details.status === 'accepted' ? 'Я согласна, встречаемся! ❤️' : `Предлагаю: ${details.date} в ${details.time} (${details.location})`
      }`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto border-t border-rose-500/10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Radio size={14} className="text-rose-500 animate-pulse" />
          <span>Синхронизация & Экспорт</span>
        </div>
        <h2 className="font-romantic text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-pink-300 mb-2">
          Уведомления на телефон & Экспорт данных
        </h2>
        <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
          Мгновенная отправка ответов на телефон в реальном времени и выгрузка отчетов о свидании.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real-time Phone Sync Card */}
        <div
          className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between ${
            isDarkMode ? 'bg-[#180e15] border-rose-900/40' : 'bg-white border-rose-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Оповещение на телефон</h3>
                  <p className="text-[11px] text-rose-400">SSE + Webhook реального времени</p>
                </div>
              </div>

              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${
                  isOnline
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {isOnline ? 'Онлайн поток' : 'Офлайн режим'}
              </span>
            </div>

            <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
              Нажатие кнопки отправляет оповещение на телефон любимого через защищенный канал с информацией о выбранном времени и месте.
            </p>

            {/* Quick messenger buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={handleShareTelegram}
                className="py-2 px-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send size={13} />
                <span>В Telegram</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} />
                <span>В WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSendToPhone}
              disabled={isSending}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                sentSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-900/30 active:scale-95'
              }`}
            >
              {sentSuccess ? (
                <>
                  <Check size={16} />
                  <span>Уведомление доставлено на телефон! 📲</span>
                </>
              ) : isSending ? (
                <span>Отправка...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Тест: отправить Push на телефон сейчас</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Center Card (PDF & CSV) */}
        <div
          className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between ${
            isDarkMode ? 'bg-[#180e15] border-rose-900/40' : 'bg-white border-rose-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Экспорт отчетов встречи</h3>
                  <p className="text-[11px] text-rose-400">Форматы PDF и CSV</p>
                </div>
              </div>

              <span className="text-[10px] text-rose-400/80 font-mono">
                {details.status === 'accepted' ? 'Подтверждено' : 'Черновик'}
              </span>
            </div>

            <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
              Сохрани красивый памятный PDF-билет на свидание для печати или экспортируй структурированный CSV-файл со всеми выбранными параметрами и криптографическим хэшем.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => exportInvitationToPDF(details)}
              className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isDarkMode
                  ? 'bg-[#140b12] border-rose-800/60 text-rose-200 hover:border-rose-400 hover:text-white'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100'
              }`}
            >
              <FileText size={15} className="text-rose-500" />
              <span>Печать / PDF билет</span>
            </button>

            <button
              onClick={() => exportRSVPToCSV(details)}
              className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isDarkMode
                  ? 'bg-[#140b12] border-rose-800/60 text-rose-200 hover:border-rose-400 hover:text-white'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100'
              }`}
            >
              <FileSpreadsheet size={15} className="text-emerald-500" />
              <span>Экспорт в CSV</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
