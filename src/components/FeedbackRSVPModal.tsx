import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Send, Heart, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { DateDetails } from '../types';

interface FeedbackRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DateDetails;
  isDarkMode: boolean;
  onSubmitAlternative: (updates: Partial<DateDetails>) => Promise<void>;
}

export const FeedbackRSVPModal: React.FC<FeedbackRSVPModalProps> = ({
  isOpen,
  onClose,
  details,
  isDarkMode,
  onSubmitAlternative,
}) => {
  const [selectedDate, setSelectedDate] = useState(details.date || '2026-10-03');
  const [selectedTime, setSelectedTime] = useState(details.time || '20:00');
  const [selectedLocation, setSelectedLocation] = useState(details.location || '');
  const [notes, setNotes] = useState(details.notes || '');
  const [atmosphere, setAtmosphere] = useState(details.preferences?.atmosphere || 'Романтическая / Свечи');
  const [cuisine, setCuisine] = useState(details.preferences?.cuisine || 'Итальянская');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitAlternative({
        date: selectedDate,
        time: selectedTime,
        location: selectedLocation,
        notes,
        status: 'rescheduled',
        preferences: {
          atmosphere,
          cuisine,
          surprise: details.preferences?.surprise ?? true,
          afterDinnerPlan: details.preferences?.afterDinnerPlan || 'Вечерняя прогулка',
        },
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickTimes = ['18:00', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 my-8 transition-all ${
          isDarkMode
            ? 'bg-[#180e15] border-rose-500/30 text-rose-50'
            : 'bg-white border-rose-200 text-rose-950'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
            isDarkMode
              ? 'border-rose-800/40 text-rose-400 hover:text-white hover:bg-rose-900/30'
              : 'border-rose-200 text-rose-500 hover:bg-rose-50'
          }`}
          aria-label="Закрыть форму"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle size={36} />
            </div>
            <h3 className="font-romantic text-2xl sm:text-3xl font-bold mb-2">
              Твои пожелания отправлены! ❤️
            </h3>
            <p className="text-xs sm:text-sm text-rose-400 max-w-xs">
              Я уже получил уведомление на свой телефон в режиме реального времени и с радостью подстроюсь под тебя!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-500 font-semibold mb-1">
                <Sparkles size={13} className="text-amber-400" />
                <span>Альтернативный вариант встречи</span>
              </div>
              <h3 className="font-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Выбери удобное время и место
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-rose-300/80' : 'text-rose-800/80'}`}>
                Если 03 октября в 20:00 тебе неудобно — просто выбери другой день, время или любимое место:
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-rose-400 flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Дата свидания</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium ${
                  isDarkMode
                    ? 'bg-[#12080f] border-rose-800 text-rose-100'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950'
                }`}
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-rose-400 flex items-center gap-1.5">
                <Clock size={14} />
                <span>Время встречи</span>
              </label>

              {/* Quick time chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                        : isDarkMode
                        ? 'bg-[#140b12] border-rose-900/50 text-rose-300 hover:border-rose-600'
                        : 'bg-white border-rose-200 text-rose-800 hover:border-rose-400'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDarkMode
                    ? 'bg-[#12080f] border-rose-800 text-rose-100'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950'
                }`}
              />
            </div>

            {/* Location Preference */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-rose-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>Где бы ты хотела встретиться?</span>
                </span>
                <span className="text-[11px] text-rose-400/80 font-normal">
                  (По умолчанию: сюрприз)
                </span>
              </label>

              {/* Quick suggestion buttons */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedLocation('Секретное место (Романтический сюрприз 🤫✨)')}
                  className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                    selectedLocation.includes('сюрприз') || selectedLocation.includes('Секретное')
                      ? 'bg-rose-600 text-white border-rose-500'
                      : isDarkMode
                      ? 'bg-[#140b12] border-rose-900/50 text-rose-300 hover:border-rose-600'
                      : 'bg-white border-rose-200 text-rose-800 hover:border-rose-400'
                  }`}
                >
                  🎁 Оставить сюрпризом
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLocation('Панорамный ресторан')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-rose-900/40 text-rose-300/80 hover:text-white hover:border-rose-500 transition-colors"
                >
                  Панорамный ресторан
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLocation('Терраса на крыше')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-rose-900/40 text-rose-300/80 hover:text-white hover:border-rose-500 transition-colors"
                >
                  Терраса на крыше
                </button>
              </div>

              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Секретное место (Романтический сюрприз) или напиши своё..."
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDarkMode
                    ? 'bg-[#12080f] border-rose-800 text-rose-100 placeholder-rose-700'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950 placeholder-rose-400'
                }`}
              />
            </div>

            {/* Cuisine / Atmosphere preference */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1 text-rose-400">Кухня / Блюда</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isDarkMode
                      ? 'bg-[#12080f] border-rose-800 text-rose-100'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <option value="Итальянская">Итальянская (паста, пицца)</option>
                  <option value="Французская">Французская / Десерты</option>
                  <option value="Японская / Морепродукты">Японская / Суши</option>
                  <option value="Грузинская">Грузинская и сытная</option>
                  <option value="Авторская / Fine Dining">Авторская кухня</option>
                  <option value="Сладкий кофе и десерты">Кофе и десерты</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1 text-rose-400">Атмосфера</label>
                <select
                  value={atmosphere}
                  onChange={(e) => setAtmosphere(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isDarkMode
                      ? 'bg-[#12080f] border-rose-800 text-rose-100'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <option value="Романтическая / Свечи">Романтика & Свечи</option>
                  <option value="Тихая и уединённая">Тихая и уединённая</option>
                  <option value="С видом на город">С видом на ночной город</option>
                  <option value="На свежем воздухе">На свежем воздухе</option>
                </select>
              </div>
            </div>

            {/* Note / Message */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-rose-400 flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500 fill-rose-500" />
                <span>Твоё послание для меня:</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Любое пожелание, намёк на наряд или просто тёплые слова..."
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none ${
                  isDarkMode
                    ? 'bg-[#12080f] border-rose-800 text-rose-100 placeholder-rose-700'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950 placeholder-rose-400'
                }`}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Отправка на телефон...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Отправить ответ на телефон в реальном времени 📲</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-rose-400/80 mt-2">
                Данные мгновенно синхронизируются и сохраняются в зашифрованном хранилище.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
