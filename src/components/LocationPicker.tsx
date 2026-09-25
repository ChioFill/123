import React, { useState } from 'react';
import { MapPin, Sparkles, Check, Heart, Compass, Gift, HelpCircle, Edit3 } from 'lucide-react';
import romanticDinnerImg from '../assets/images/romantic_dinner_1790359895232.jpg';
import sweetWalkImg from '../assets/images/sweet_walk_date_1790359908942.jpg';

export interface LocationOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  atmosphere: string;
  image: string;
}

export const VENUE_EXAMPLES: LocationOption[] = [
  {
    id: 'panoramic_restaurant',
    name: 'Панорамный ресторан с видом на ночной город',
    tagline: 'Изысканный ужин при свечах',
    description: 'Уютный столик у окна на высоте птичьего полёта, мерцание свечей, изысканная кухня и звон бокалов.',
    atmosphere: 'Романтическая / Свечи / Живой джаз',
    image: romanticDinnerImg,
  },
  {
    id: 'rooftop_garden',
    name: 'Тёплая терраса на крыше под звёздами',
    tagline: 'Мягкие пледы и огни города',
    description: 'Уединённое пространство на высоте, согревающий глинтвейн или авторский чай, гирлянды и звездное небо.',
    atmosphere: 'Уютная / Камерная / Звёздная',
    image: sweetWalkImg,
  },
  {
    id: 'river_embankment',
    name: 'Набережная и уютная кондитерская у воды',
    tagline: 'Шум волн и огни мостов',
    description: 'Неспешная вечерняя прогулка у воды, согревающий кофе, нежнейшие десерты и долгие разговоры обо всём.',
    atmosphere: 'Спокойная / Мечтательная / Свежий воздух',
    image: sweetWalkImg,
  },
  {
    id: 'cozy_lounge',
    name: 'Тихий лаунж при мягком свете торшеров',
    tagline: 'Уединённый уголок только для двоих',
    description: 'Мягкие диваны, приглушённая музыка, полное спокойствие и ощущение, что время остановилось.',
    atmosphere: 'Камерная / Расслабленная / Интимная',
    image: romanticDinnerImg,
  },
];

export const SURPRISE_LOCATION_TEXT = 'Секретное место (Романтический сюрприз 🤫✨)';

interface LocationPickerProps {
  currentLocation: string;
  isDarkMode: boolean;
  onSelectLocation: (name: string, atmosphere: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  currentLocation,
  isDarkMode,
  onSelectLocation,
}) => {
  const [customVenue, setCustomVenue] = useState('');
  const [isSavedCustom, setIsSavedCustom] = useState(false);

  const isSurprise =
    !currentLocation ||
    currentLocation === SURPRISE_LOCATION_TEXT ||
    currentLocation.toLowerCase().includes('сюрприз') ||
    currentLocation.toLowerCase().includes('секрет');

  const handleChooseSurprise = () => {
    onSelectLocation(SURPRISE_LOCATION_TEXT, 'Сюрприз от любимого');
    setIsSavedCustom(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVenue.trim()) {
      onSelectLocation(customVenue.trim(), 'По личному желанию любимой');
      setIsSavedCustom(true);
    }
  };

  return (
    <section id="location" className="py-12 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Gift size={14} className="text-rose-500 animate-bounce" />
          <span>Место встречи — Секрет & Сюрприз</span>
        </div>
        <h2 className="font-romantic text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-pink-300 mb-3">
          Куда бы ты хотела сходить?
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-rose-200/85' : 'text-rose-800/85'}`}>
          Точное место остаётся для тебя <b>секретом и сюрпризом</b> 🤫✨ Я уже всё продумал! Но если ты мечтаешь побывать в конкретном месте или хочешь выбрать стиль вечера — напиши своё желание или выбери любой пример ниже.
        </p>
      </div>

      {/* Main Choice Card: Keep as Surprise (Default) */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div
          onClick={handleChooseSurprise}
          className={`relative p-5 sm:p-6 rounded-3xl border cursor-pointer transition-all duration-300 shadow-xl ${
            isSurprise
              ? 'bg-gradient-to-r from-rose-950/60 via-[#23121d] to-pink-950/40 border-rose-500 ring-2 ring-rose-500/40 shadow-rose-900/40 scale-[1.01]'
              : isDarkMode
              ? 'bg-[#180e14] border-rose-900/40 hover:border-rose-500/40'
              : 'bg-white border-rose-200 hover:border-rose-300 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
              <Gift size={24} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
                  Основной вариант (Сюрприз)
                </span>
                {isSurprise && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    <Check size={12} />
                    <span>Выбрано по умолчанию</span>
                  </span>
                )}
              </div>

              <h3 className="font-romantic text-xl sm:text-2xl font-bold mt-1 text-white">
                Оставить в секрете — доверюсь твоему сюрпризу! 🎁🤫
              </h3>

              <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
                Ты просто надеваешь любимый наряд, а маршрут, атмосфера и программа останутся приятной тайной до самой последней минуты.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggest own custom place */}
      <div className="mb-12 max-w-2xl mx-auto">
        <form
          onSubmit={handleCustomSubmit}
          className={`p-5 sm:p-6 rounded-3xl border transition-all ${
            !isSurprise && !VENUE_EXAMPLES.some((v) => v.name === currentLocation)
              ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-lg bg-rose-500/5'
              : isDarkMode
              ? 'bg-[#180e14] border-rose-900/40'
              : 'bg-white border-rose-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-rose-400">
            <Edit3 size={15} />
            <span>Написать своё любимое место или пожелание:</span>
          </div>

          <p className={`text-xs mb-3 ${isDarkMode ? 'text-rose-300/70' : 'text-rose-700/70'}`}>
            Если есть кофейня, ресторан, парк или место, куда тебе очень хочется сходить — просто напиши его название:
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={customVenue}
              onChange={(e) => setCustomVenue(e.target.value)}
              placeholder="Например: Итальянский ресторанчик возле набережной, уютная кофейня..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                isDarkMode
                  ? 'bg-[#12080f] border-rose-800 text-rose-100 placeholder-rose-700'
                  : 'bg-rose-50/50 border-rose-200 text-rose-950 placeholder-rose-400'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
            >
              Предложить моё место ✨
            </button>
          </div>

          {currentLocation && !isSurprise && (
            <div className="mt-3 pt-3 border-t border-rose-500/10 flex items-center justify-between text-xs text-rose-300">
              <span className="truncate">
                📍 Твой текущий выбор: <b>{currentLocation}</b>
              </span>
              <button
                type="button"
                onClick={handleChooseSurprise}
                className="text-[11px] underline text-rose-400 hover:text-white shrink-0 ml-2"
              >
                Вернуть сюрприз
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Examples for Inspiration Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1">
          <Sparkles size={13} className="text-amber-400" />
          <span>Примеры вариантов для вдохновения</span>
        </div>
        <p className={`text-xs max-w-lg mx-auto ${isDarkMode ? 'text-rose-300/70' : 'text-rose-700/70'}`}>
          (Ни один из них не навязан — это лишь идеи того, как может пройти наш вечер)
        </p>
      </div>

      {/* Grid of Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VENUE_EXAMPLES.map((venue) => {
          const isSelected = currentLocation === venue.name;

          return (
            <div
              key={venue.id}
              onClick={() => onSelectLocation(venue.name, venue.atmosphere)}
              className={`group relative rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-xl ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-rose-900/30'
                  : isDarkMode
                  ? 'bg-[#180e14] border-rose-900/40 hover:border-rose-500/40'
                  : 'bg-white border-rose-200 hover:border-rose-300'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-rose-950/20">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-rose-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                  Пример идеи
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white p-1.5 rounded-full shadow-lg flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-widest block">
                    {venue.tagline}
                  </span>
                  <h3 className="text-white font-romantic text-lg sm:text-xl font-bold leading-tight drop-shadow">
                    {venue.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5">
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-rose-200/80' : 'text-rose-900/80'}`}>
                  {venue.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-rose-500/10 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>{venue.atmosphere}</span>
                  </div>

                  <span
                    className={`font-semibold transition-colors ${
                      isSelected ? 'text-rose-400' : 'text-rose-400/60 group-hover:text-rose-400'
                    }`}
                  >
                    {isSelected ? 'Твой выбор ❤️' : 'Выбрать этот вариант →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
