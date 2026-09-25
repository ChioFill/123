/**
 * Local Encrypted Vault using Web Cryptography API (AES-GCM 256-bit)
 * Ensures private romantic memories, feedback and confirmations are stored encrypted offline.
 */

const STORAGE_KEY = 'romantic_date_encrypted_vault_v1';
const KEY_SALT_KEY = 'romantic_key_salt';

// Generates or retrieves a persistent device encryption key
async function getDeviceKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  let salt = localStorage.getItem(KEY_SALT_KEY);
  if (!salt) {
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    salt = btoa(String.fromCharCode(...saltBytes));
    localStorage.setItem(KEY_SALT_KEY, salt);
  }

  const basePassphrase = 'OurRomanticDateSecretKey_2026_10_03';
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(basePassphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Helper: Uint8Array to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Base64 to Uint8Array
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptAndSaveData(data: unknown): Promise<{ ciphertext: string; iv: string }> {
  try {
    const key = await getDeviceKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encoded = enc.encode(JSON.stringify(data));

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const cipherBase64 = arrayBufferToBase64(cipherBuffer);
    const ivBase64 = arrayBufferToBase64(iv.buffer);

    const payload = {
      cipher: cipherBase64,
      iv: ivBase64,
      updatedAt: new Date().toISOString(),
      algorithm: 'AES-GCM-256',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ciphertext: cipherBase64, iv: ivBase64 };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

export async function loadAndDecryptData<T>(fallback: T): Promise<T> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!parsed.cipher || !parsed.iv) return fallback;

    const key = await getDeviceKey();
    const cipherBuffer = base64ToArrayBuffer(parsed.cipher);
    const ivBuffer = base64ToArrayBuffer(parsed.iv);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
      key,
      cipherBuffer
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.warn('Decryption failed or first time launch, using fallback:', error);
    return fallback;
  }
}

export function getEncryptedVaultPreview(): { isEncrypted: boolean; preview: string; algorithm: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { isEncrypted: false, preview: 'Хранилище пусто (данные будут зашифрованы при первом сохранении)', algorithm: 'AES-256-GCM' };
    }
    const parsed = JSON.parse(raw);
    return {
      isEncrypted: true,
      preview: parsed.cipher ? parsed.cipher.substring(0, 48) + '...' : 'N/A',
      algorithm: parsed.algorithm || 'AES-GCM-256',
    };
  } catch {
    return { isEncrypted: false, preview: 'Ошибка чтения хранилища', algorithm: 'AES-256-GCM' };
  }
}
