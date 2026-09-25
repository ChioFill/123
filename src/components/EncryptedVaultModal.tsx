import React from 'react';
import { X, ShieldCheck, Lock, Key, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getEncryptedVaultPreview } from '../services/encryption';
import { DateDetails } from '../types';

interface EncryptedVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DateDetails;
  isDarkMode: boolean;
}

export const EncryptedVaultModal: React.FC<EncryptedVaultModalProps> = ({
  isOpen,
  onClose,
  details,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const vault = getEncryptedVaultPreview();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 transition-all ${
          isDarkMode
            ? 'bg-[#180e15] border-rose-500/30 text-rose-50'
            : 'bg-white border-rose-200 text-rose-950'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
            isDarkMode ? 'border-rose-800 text-rose-400 hover:text-white' : 'border-rose-200 text-rose-500'
          }`}
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={30} />
          </div>
          <h3 className="font-romantic text-2xl sm:text-3xl font-bold">
            Зашифрованное офлайн-хранилище
          </h3>
          <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-rose-300/80' : 'text-rose-800/80'}`}>
            Все приватные ответы, заметки и фотографии шифруются на клиенте с помощью Web Cryptography API.
          </p>
        </div>

        {/* Security Badges */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div
            className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-[#12080f] border-rose-950' : 'bg-rose-50/50 border-rose-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold mb-1">
              <Lock size={14} />
              <span>Шифрование</span>
            </div>
            <p className="text-[11px] opacity-75 font-mono">AES-GCM-256 (Военный стандарт)</p>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-[#12080f] border-rose-950' : 'bg-rose-50/50 border-rose-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
              <Key size={14} />
              <span>Деривация ключа</span>
            </div>
            <p className="text-[11px] opacity-75 font-mono">PBKDF2 SHA-256 100k итераций</p>
          </div>
        </div>

        {/* Encrypted preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Database size={13} />
              <span>Зашифрованный шифротекст в памяти (Ciphertext)</span>
            </span>
            <span className="text-emerald-500 text-[10px] flex items-center gap-1">
              <CheckCircle2 size={12} /> Защищено
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border font-mono text-[11px] break-all max-h-24 overflow-y-auto leading-relaxed select-all ${
              isDarkMode ? 'bg-[#0f070c] border-rose-900/40 text-emerald-400/90' : 'bg-slate-900 text-emerald-400'
            }`}
          >
            {vault.preview}
          </div>
          <p className="text-[10px] text-rose-400/70 mt-1">
            Даже при отсутствии интернета данные сохраняются в безопасности и не могут быть прочитаны третьими лицами.
          </p>
        </div>

        {/* Status indicator */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Офлайн-синхронизация активна: данные загружаются мгновенно без сети!</span>
        </div>
      </div>
    </div>
  );
};
