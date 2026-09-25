/**
 * Romantic Audio Engine with Web Audio API Synthesizer
 * Works 100% offline, cross-platform on iOS Safari, Android Chrome, and Desktop.
 * Provides multiple track variations (alternative romantic compositions).
 */

export interface TrackOption {
  id: string;
  title: string;
  description: string;
  tempo: number; // BPM
  scale: number[]; // Frequencies in Hz
}

export const TRACK_OPTIONS: TrackOption[] = [
  {
    id: 'track_sonata',
    title: 'Мелодия для неё',
    description: 'Нежное романтическое фортепиано в тональности F-мажор',
    tempo: 72,
    scale: [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, // C4 to C5
      587.33, 659.25, 698.46, 783.99 // C5 to G5
    ]
  },
  {
    id: 'track_starlight',
    title: 'Звёздный вечер под луной',
    description: 'Мягкий атмосферный эмбиент с тёплыми переливами',
    tempo: 60,
    scale: [
      220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25
    ]
  },
  {
    id: 'track_lofi',
    title: 'Уютный вечер на двоих',
    description: 'Бархатные неосоул аккорды и тёплое звучание',
    tempo: 80,
    scale: [
      196.00, 246.94, 293.66, 349.23, 392.00, 440.00, 493.88, 587.33
    ]
  }
];

class RomanticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrack: TrackOption = TRACK_OPTIONS[0];
  private volume = 0.45;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private noteIndex = 0;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private trackListeners: Set<(track: TrackOption) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeTrack(listener: (track: TrackOption) => void) {
    this.trackListeners.add(listener);
    return () => this.trackListeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  private notifyTrack() {
    this.trackListeners.forEach((fn) => fn(this.currentTrack));
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.notify();
    this.scheduleNotes();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setTrack(trackId: string) {
    const found = TRACK_OPTIONS.find((t) => t.id === trackId);
    if (found) {
      this.currentTrack = found;
      this.noteIndex = 0;
      this.notifyTrack();
    }
  }

  public getCurrentTrack(): TrackOption {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNotes() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const scale = this.currentTrack.scale;
    // Harmonic note selection
    const chordBase = [0, 2, 4, 7];
    const baseFreq = scale[this.noteIndex % scale.length];
    const octaveHigher = baseFreq * (Math.random() > 0.5 ? 1.5 : 1.25);

    this.playTone(baseFreq, 1.8, 'sine', 0.28);
    this.playTone(octaveHigher, 1.4, 'triangle', 0.15);

    // Occasional gentle sub-bass / pad warmth
    if (this.noteIndex % 4 === 0) {
      this.playTone(baseFreq * 0.5, 3.2, 'sine', 0.22);
    }

    this.noteIndex++;
    const intervalMs = (60 / this.currentTrack.tempo) * 1000 * (Math.random() > 0.3 ? 0.75 : 1.5);
    this.timer = window.setTimeout(() => this.scheduleNotes(), intervalMs);
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', peakGain = 0.3) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Smooth envelope attack and release
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const romanticAudio = new RomanticAudioSynthesizer();
