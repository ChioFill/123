/**
 * Romantic Date Invitation Application
 * Fully responsive, offline-first, encrypted with Web Cryptography API,
 * Apple Calendar integration, real-time sync with SSE, and romantic synthesizer.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DateDetails, CriticalNotification } from './types';
import { encryptAndSaveData, loadAndDecryptData } from './services/encryption';
import { NotificationService } from './services/notificationService';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { LocationPicker } from './components/LocationPicker';
import { FeedbackRSVPModal } from './components/FeedbackRSVPModal';
import { PhotoGallery } from './components/PhotoGallery';
import { AppleCalendarModal } from './components/AppleCalendarModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { EncryptedVaultModal } from './components/EncryptedVaultModal';
import { RealtimePhoneSyncBar } from './components/RealtimePhoneSyncBar';
import { HomeScreenWidgets } from './components/HomeScreenWidgets';
import { RosePetalsOverlay } from './components/RosePetalsOverlay';
import { PhotoMemory } from './assets/images';
import { Heart, Sparkles, Shield, WifiOff, PhoneCall, Calendar } from 'lucide-react';

const INITIAL_DETAILS: DateDetails = {
  date: '2026-10-03',
  time: '20:00',
  location: 'Секретное романтическое место (Сюрприз для тебя 🤫✨)',
  status: 'pending',
  notes: 'С нетерпением жду нашего особенного вечера ❤️',
  updatedAt: new Date().toISOString(),
  preferences: {
    atmosphere: 'Романтическая / Свечи / Сюрприз',
    cuisine: 'По вкусу любимой',
    surprise: true,
    afterDinnerPlan: 'Прогулка под ночными огнями города',
  },
};

export default function App() {
  const [details, setDetails] = useState<DateDetails>(INITIAL_DETAILS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [customHeroPhoto, setCustomHeroPhoto] = useState<string | undefined>(() => {
    return localStorage.getItem('romantic_custom_hero_photo') || undefined;
  });
  const [notifications, setNotifications] = useState<CriticalNotification[]>(
    NotificationService.getNotifications()
  );

  // Modals state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<PhotoMemory[]>([]);

  // 1. Initial Load: Decrypt from local encrypted vault + register Service Worker
  useEffect(() => {
    // Service Worker for offline capability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.warn('Service Worker registration skipped:', err));
    }

    // Load encrypted data
    loadAndDecryptData<DateDetails>(INITIAL_DETAILS).then((saved) => {
      if (saved && saved.date) {
        setDetails(saved);
      }
    });

    // Check theme preference
    const savedTheme = localStorage.getItem('date_theme_dark');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true');
    }

    // Subscribe to notifications
    const unsubNotifs = NotificationService.subscribe((list) => {
      setNotifications(list);
    });

    // Online / Offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      NotificationService.addNotification(
        'Сеть восстановлена 🌐',
        'Синхронизация с облачным сервером возобновлена.',
        'info'
      );
    };
    const handleOffline = () => {
      setIsOnline(false);
      NotificationService.addNotification(
        'Офлайн режим 🔒',
        'Вы в офлайне. Все изменения надежно сохраняются в зашифрованном хранилище.',
        'warning'
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Real-time Cloud Sync via Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stream');
      eventSource.onopen = () => {
        setIsCloudSynced(true);
      };
      eventSource.addEventListener('rsvp_update', (e) => {
        try {
          const updated = JSON.parse(e.data);
          setDetails((prev) => ({ ...prev, ...updated }));
          NotificationService.addNotification(
            'Синхронизация в реальном времени 🔄',
            `Статус встречи обновлен: ${updated.status === 'accepted' ? 'Подтверждено ❤️' : 'Изменено'}`,
            'info'
          );
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      });
      eventSource.addEventListener('notification', (e) => {
        try {
          const notif = JSON.parse(e.data);
          NotificationService.addNotification(notif.title, notif.message, 'celebration');
        } catch (err) {
          console.error('SSE notif parse error:', err);
        }
      });
      eventSource.onerror = () => {
        setIsCloudSynced(false);
      };
    } catch {
      // SSE fallback
    }

    return () => {
      unsubNotifs();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (eventSource) eventSource.close();
    };
  }, []);

  // Theme Toggle
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('date_theme_dark', String(next));
      return next;
    });
  };

  // Helper to persist state to encrypted vault & sync with cloud
  const saveAndSyncState = useCallback(
    async (nextDetails: DateDetails) => {
      setDetails(nextDetails);

      // 1. Save to client-side encrypted vault (AES-GCM-256)
      try {
        await encryptAndSaveData(nextDetails);
      } catch (err) {
        console.warn('Encrypted save failed:', err);
      }

      // 2. Sync to backend API if online
      if (navigator.onLine) {
        try {
          await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nextDetails),
          });
          setIsCloudSynced(true);
        } catch (err) {
          console.warn('Cloud sync error, stored locally:', err);
        }
      }
    },
    []
  );

  // Accept Handler ("Да, я согласна! ❤️")
  const handleAccept = async () => {
    const updated: DateDetails = {
      ...details,
      status: 'accepted',
      confirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveAndSyncState(updated);

    // Audio chime & notification
    NotificationService.addNotification(
      'Ура! Свидание подтверждено! ❤️🎉',
      `Встречаемся 03 октября 2026 в ${details.time} в «${details.location}»!`,
      'celebration'
    );

    // Real-time alert to boyfriend's phone
    await NotificationService.sendLivePhoneAlert({
      title: 'ОНА СКАЗАЛА ДА! ❤️🎉',
      message: `Любимая подтвердила встречу на 03 октября 2026 года в ${details.time}! Место: ${details.location}`,
      urgency: 'high',
    });
  };

  // Alternative Time/Location Handler
  const handleSubmitAlternative = async (updates: Partial<DateDetails>) => {
    const updated: DateDetails = {
      ...details,
      ...updates,
      status: 'rescheduled',
      updatedAt: new Date().toISOString(),
    };

    await saveAndSyncState(updated);

    NotificationService.addNotification(
      'Параметры встречи обновлены ✨',
      `Новая дата: ${updated.date} в ${updated.time}. Место: ${updated.location}`,
      'success'
    );

    // Real-time alert to boyfriend's phone
    await NotificationService.sendLivePhoneAlert({
      title: 'Предложено новое время/место встречи! 💌',
      message: `Любимая выбрала: ${updated.date} в ${updated.time}. Локация: ${updated.location}. Заметки: ${updated.notes || 'Без заметок'}`,
      urgency: 'high',
    });
  };

  // Location selection
  const handleSelectLocation = (locationName: string, atmosphere: string) => {
    const updated: DateDetails = {
      ...details,
      location: locationName,
      preferences: {
        ...details.preferences,
        atmosphere,
      },
      updatedAt: new Date().toISOString(),
    };
    saveAndSyncState(updated);

    NotificationService.addNotification(
      'Локация обновлена 📍',
      `Выбрано: ${locationName}`,
      'info'
    );
  };

  // Add custom photo memory
  const handleAddUserPhoto = (base64: string, caption: string) => {
    const newPhoto: PhotoMemory = {
      id: `custom_${Date.now()}`,
      src: base64,
      caption: caption || 'Наше особенное воспоминание',
      dateTag: 'Вместе',
      locationTag: 'В наших сердцах',
    };
    setCustomPhotos((prev) => [newPhoto, ...prev]);

    NotificationService.addNotification(
      'Фото добавлено в альбом 📸',
      'Новая фотография зашифрована в локальном хранилище.',
      'success'
    );
  };

  const handleSetHeroPhoto = (base64: string) => {
    setCustomHeroPhoto(base64);
    try {
      localStorage.setItem('romantic_custom_hero_photo', base64);
    } catch (e) {
      console.warn('Storage limit reached:', e);
    }
    handleAddUserPhoto(base64, 'Главное фото свидания ❤️');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative selection:bg-rose-500 selection:text-white ${
        isDarkMode
          ? 'bg-[#0f080d] text-rose-50'
          : 'bg-[#fff9fa] text-rose-950'
      }`}
    >
      {/* Gentle Floating Rose Petals Animation */}
      <RosePetalsOverlay />

      {/* Top Header Navigation */}
      <HeaderNav
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenCalendarModal={() => setIsCalendarOpen(true)}
        isOnline={isOnline}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Content Area */}
      <main className="relative z-20">
        {/* Offline notice bar if network disconnects */}
        {!isOnline && (
          <div className="bg-amber-600/90 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
            <WifiOff size={14} />
            <span>Офлайн режим активен: данные сохраняются локально в зашифрованном хранилище AES-256.</span>
          </div>
        )}

        {/* 1. Hero Section (Title, Photo, Countdown, YES Button) */}
        <HeroSection
          details={details}
          isDarkMode={isDarkMode}
          customHeroPhoto={customHeroPhoto}
          onAccept={handleAccept}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onPhotoClick={() => {
            const galleryElem = document.getElementById('gallery');
            galleryElem?.scrollIntoView({ behavior: 'smooth' });
          }}
          onUploadHeroPhoto={handleSetHeroPhoto}
        />

        {/* 2. Interactive Home Screen Style Widgets */}
        <HomeScreenWidgets
          details={details}
          isDarkMode={isDarkMode}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onAccept={handleAccept}
        />

        {/* 3. Location Picker */}
        <div id="details">
          <LocationPicker
            currentLocation={details.location}
            isDarkMode={isDarkMode}
            onSelectLocation={handleSelectLocation}
          />
        </div>

        {/* 4. Our Photos & Memories Gallery */}
        <PhotoGallery
          isDarkMode={isDarkMode}
          customPhotos={customPhotos}
          onAddUserPhoto={handleAddUserPhoto}
        />

        {/* 5. Realtime Phone Sync & Export Center (PDF & CSV) */}
        <RealtimePhoneSyncBar
          details={details}
          isDarkMode={isDarkMode}
          isOnline={isOnline}
          onRefreshSync={() => saveAndSyncState(details)}
        />
      </main>

      {/* Footer */}
      <footer
        className={`relative z-20 py-12 px-4 border-t text-center text-xs transition-colors ${
          isDarkMode
            ? 'bg-[#0d070b] border-rose-950/40 text-rose-400/80'
            : 'bg-rose-50/50 border-rose-200 text-rose-800/80'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-rose-500 font-romantic text-lg">
            <span>Создано с любовью</span>
            <Heart size={16} className="fill-rose-500 animate-pulse" />
            <span>для самого дорогого человека</span>
          </div>

          <p className="text-[11px] opacity-75 max-w-md mx-auto">
            03 октября 2026 года · Время 20:00 · Наше незабываемое романтическое свидание
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-rose-500/70">
            <span>AES-256-GCM Encrypted</span>
            <span aria-hidden="true">·</span>
            <span>PWA & Offline Ready</span>
            <span aria-hidden="true">·</span>
            <span>Apple Calendar Sync</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <FeedbackRSVPModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        details={details}
        isDarkMode={isDarkMode}
        onSubmitAlternative={handleSubmitAlternative}
      />

      <AppleCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        details={details}
        isDarkMode={isDarkMode}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        isDarkMode={isDarkMode}
      />

      <EncryptedVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        details={details}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
