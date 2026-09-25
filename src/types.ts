export type RSVPStatus = 'pending' | 'accepted' | 'rescheduled' | 'declined';

export interface DateDetails {
  date: string; // e.g., '2026-10-03'
  time: string; // e.g., '20:00'
  location: string;
  notes?: string;
  alternativeDate?: string;
  alternativeTime?: string;
  alternativeLocation?: string;
  preferences?: {
    dressCode?: string;
    cuisine?: string;
    atmosphere?: string;
    surprise?: boolean;
    afterDinnerPlan?: string;
  };
  confirmedAt?: string;
  status: RSVPStatus;
  updatedAt: string;
}

export interface EncryptedPayload {
  iv: string; // Base64
  ciphertext: string; // Base64
  timestamp: string;
  checksum: string;
}

export interface CriticalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'celebration';
  timestamp: string;
  read: boolean;
}
