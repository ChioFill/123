import React, { useState } from 'react';
import { Camera, Heart, Sparkles, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MEMORY_PHOTOS, PhotoMemory } from '../assets/images';

interface PhotoGalleryProps {
  isDarkMode: boolean;
  onAddUserPhoto?: (base64: string, caption: string) => void;
  customPhotos?: PhotoMemory[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  isDarkMode,
  customPhotos = [],
  onAddUserPhoto,
}) => {
  const allPhotos = [...MEMORY_PHOTOS, ...customPhotos];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);

  // Keyboard navigation & Escape to close
  React.useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev === null ? null : (prev - 1 + allPhotos.length) % allPhotos.length));
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev === null ? null : (prev + 1) % allPhotos.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, allPhotos.length]);

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + allPhotos.length) % allPhotos.length);
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % allPhotos.length);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddUserPhoto) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAddUserPhoto(result, 'Наш любимый момент');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="gallery" className="py-14 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Camera size={14} className="text-rose-500" />
          <span>Наши фотографии & воспоминания</span>
        </div>
        <h2 className="font-romantic text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-pink-300 mb-3">
          Каждый кадр с тобой — самый тёплый
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'}`}>
          Наши улыбки, уютные вечера и мгновения, которые хочется пересматривать снова и снова.
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        {allPhotos.map((photo, idx) => {
          // Slight playful rotation for polaroid effect
          const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];
          const rotationClass = rotations[idx % rotations.length];

          return (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className={`group relative p-3 sm:p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:z-20 cursor-pointer ${rotationClass} hover:rotate-0 ${
                isDarkMode
                  ? 'bg-[#1b0f16] border border-rose-500/25 shadow-rose-950/40'
                  : 'bg-white border border-rose-200 shadow-rose-100'
              }`}
            >
              {/* Little red heart pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose-600 border-2 border-white dark:border-[#1b0f16] shadow-md flex items-center justify-center z-10">
                <Heart size={10} className="text-white fill-white" />
              </div>

              {/* Photo */}
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-rose-950/20 relative">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-rose-950/10 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Caption */}
              <div className="mt-3.5 text-center px-1">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-rose-400 font-semibold uppercase tracking-wider mb-1">
                  <span>{photo.dateTag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{photo.locationTag}</span>
                </div>
                <p
                  className={`font-romantic text-sm sm:text-base leading-snug line-clamp-2 ${
                    isDarkMode ? 'text-rose-100' : 'text-rose-950'
                  }`}
                >
                  «{photo.caption}»
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add extra memory button */}
      <div className="mt-10 flex justify-center">
        <label
          className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            isDarkMode
              ? 'bg-[#180e14] border-rose-800/50 text-rose-300 hover:text-white hover:border-rose-500'
              : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 shadow-sm'
          }`}
        >
          <Plus size={15} className="text-rose-500" />
          <span>Добавить ещё одно наше совместное фото в зашифрованный альбом</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out select-none"
        >
          {/* Top-right close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-1.5 text-xs font-semibold z-50 shadow-lg cursor-pointer"
            aria-label="Закрыть фото"
            title="Закрыть (Esc или клик по фото)"
          >
            <X size={18} />
            <span>Закрыть (Esc)</span>
          </button>

          {/* Navigation arrows */}
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors z-50 cursor-pointer shadow-lg"
            aria-label="Предыдущее фото"
            title="Предыдущее фото"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors z-50 cursor-pointer shadow-lg"
            aria-label="Следующее фото"
            title="Следующее фото"
          >
            <ChevronRight size={26} />
          </button>

          <div
            onClick={closeLightbox}
            className="max-w-3xl max-h-[85vh] flex flex-col items-center cursor-pointer"
            title="Нажмите на фотографию или фон, чтобы закрыть"
          >
            <img
              src={allPhotos[selectedPhotoIndex].src}
              alt={allPhotos[selectedPhotoIndex].caption}
              className="max-h-[70vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20 hover:opacity-95 transition-opacity"
            />
            <div className="mt-4 text-center max-w-lg">
              <p className="text-white font-romantic text-xl font-bold">
                «{allPhotos[selectedPhotoIndex].caption}»
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-rose-300 mt-1">
                <span>{allPhotos[selectedPhotoIndex].dateTag}</span>
                <span>•</span>
                <span>{allPhotos[selectedPhotoIndex].locationTag}</span>
              </div>
              <p className="text-[11px] text-white/60 mt-1.5">
                (Нажмите в любое место или на фото, чтобы закрыть)
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
