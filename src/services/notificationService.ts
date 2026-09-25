import { CriticalNotification } from '../types';

export class NotificationService {
  private static listeners: Set<(notifications: CriticalNotification[]) => void> = new Set();
  private static notifications: CriticalNotification[] = [
    {
      id: 'init-1',
      title: 'Приглашение готово ❤️',
      message: 'Все детали свидания на 3 октября 2026 года успешно подготовлены.',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  public static getNotifications(): CriticalNotification[] {
    return this.notifications;
  }

  public static subscribe(fn: (notifications: CriticalNotification[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private static notifyListeners() {
    this.listeners.forEach((fn) => fn([...this.notifications]));
  }

  public static addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'celebration' = 'info') {
    const item: CriticalNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.notifications.unshift(item);
    this.notifyListeners();

    // Trigger local push notification if allowed
    this.triggerPushNotification(title, message);

    // Play subtle chime sound
    this.playChimeSound(type === 'celebration' ? 880 : 520);
  }

  public static markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notifyListeners();
  }

  public static async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  public static triggerPushNotification(title: string, body: string) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
              body,
              icon: '/icon-192.svg',
              badge: '/icon-192.svg',
              vibrate: [200, 100, 200],
            } as unknown as NotificationOptions);
          });
        } else {
          new Notification(title, {
            body,
            icon: '/icon-192.svg',
          });
        }
      } catch (err) {
        console.warn('Push notification delivery error:', err);
      }
    }
  }

  // Play pleasant acoustic chime using Web Audio API
  public static playChimeSound(freq = 600) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Send real-time notification to boyfriend's phone / backend
  public static async sendLivePhoneAlert(params: {
    title: string;
    message: string;
    urgency?: 'normal' | 'high';
    telegramBotToken?: string;
    telegramChatId?: string;
  }) {
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (e) {
      console.warn('Real-time backend notify fallback:', e);
      return { success: false };
    }
  }
}
