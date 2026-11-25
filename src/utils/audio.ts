// Web Audio API Synthesizer & Cosmic Ambient Soundscape Generator
// Engineered for 100% reliable cross-browser playback, zero external assets.

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  // Ambient soundscape nodes
  private masterGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private lfoOsc: OscillatorNode | null = null;
  private chordTimer: ReturnType<typeof setInterval> | null = null;
  private melodyTimer: ReturnType<typeof setInterval> | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("juanfe_sound_enabled");
      this.enabled = saved === "true";

      // Global user gesture unlock listener
      const unlock = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener("click", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getOrCreateContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  public async resumeContext(): Promise<boolean> {
    const ctx = this.getOrCreateContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    return ctx.state === "running";
  }

  public async toggle(): Promise<boolean> {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("juanfe_sound_enabled", String(this.enabled));
    }

    if (this.enabled) {
      await this.resumeContext();
      this.startAmbient();
      this.playChime();
    } else {
      this.stopAmbient();
    }
    return this.enabled;
  }

  /**
   * Generates a subtle, intimate Interstellar-inspired cosmic felt-piano theme:
   * - Iconic A-minor pedal-E5 arpeggio (Fmaj7 -> G6 -> Am -> G/D)
   * - Soft, warm felt-piano timbre with spacious cosmic delay
   * - Gentle sub-bass pad swell underneath, kept subtle and non-fatiguing
   */
  public startAmbient() {
    const ctx = this.getOrCreateContext();
    if (!ctx || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const now = ctx.currentTime;

      // Soft limiter/compressor to prevent any clipping when notes overlap
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, now);
      compressor.knee.setValueAtTime(18, now);
      compressor.ratio.setValueAtTime(4, now);
      compressor.attack.setValueAtTime(0.01, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(ctx.destination);

      // Master ambient volume (rich, clearly audible)
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(0.32, now + 1.2);
      master.connect(compressor);
      this.masterGain = master;

      // Warm lowpass filter for rich organ/piano warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(0.6, now);
      filter.connect(master);
      this.ambientFilter = filter;

      // Spacious cosmic delay/reverb tail
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.45, now);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.32, now);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(1050, now);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(master);

      // Warm sustained organ pad (root + fifth + third) following Fmaj7 -> G6 -> Am -> G
      const bassPads = [
        { root: 87.31, fifth: 130.81, third: 220.00 },  // F2 + C3 + A3
        { root: 98.00, fifth: 146.83, third: 246.94 },  // G2 + D3 + B3
        { root: 110.00, fifth: 164.81, third: 261.63 }, // A2 + E3 + C4
        { root: 98.00, fifth: 146.83, third: 246.94 },  // G2 + D3 + B3
      ];

      this.ambientOscillators = [];
      this.ambientGains = [];

      [bassPads[0].root, bassPads[0].fifth, bassPads[0].third].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx === 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);
        const vols = [0.26, 0.16, 0.08];
        g.gain.setValueAtTime(vols[idx] ?? 0.12, now);
        osc.connect(g);
        g.connect(filter);
        osc.start(now);
        this.ambientOscillators.push(osc);
        this.ambientGains.push(g);
      });

      // Interstellar main melody: starts slow and settles into natural tempo
      const E5 = 659.25;
      const A4 = 440.00;
      const B4 = 493.88;
      const C5 = 523.25;
      const D5 = 587.33;

      const phraseEvents: { freq: number; baseMs: number; chordIdx?: number }[] = [
        { freq: A4, baseMs: 680, chordIdx: 0 }, // Fmaj7: A4
        { freq: E5, baseMs: 920 },              //        E5
        { freq: B4, baseMs: 680, chordIdx: 1 }, // G6:    B4
        { freq: E5, baseMs: 920 },              //        E5
        { freq: C5, baseMs: 680, chordIdx: 2 }, // Am:    C5
        { freq: E5, baseMs: 920 },              //        E5
        { freq: D5, baseMs: 680, chordIdx: 3 }, // G:     D5
        { freq: C5, baseMs: 460 },              //        C5
        { freq: B4, baseMs: 680 },              //        B4
      ];

      let eventIndex = 0;
      let tempoScale = 1.55; // Start slow, then settle smoothly to 1.0 (normal speed)

      const playLongMelodyNote = (freq: number, durationMs: number) => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientFilter) return;
        const t = this.ctx.currentTime;
        const durSec = durationMs / 1000;
        const releaseSec = 0.95;
        const totalSec = durSec + releaseSec;

        const osc = this.ctx.createOscillator();
        const harmonic = this.ctx.createOscillator();
        const harmonicGain = this.ctx.createGain();
        const noteGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        harmonic.type = "triangle";
        harmonic.frequency.setValueAtTime(freq, t);
        harmonicGain.gain.setValueAtTime(0.18, t);

        // Continuous click-free legato envelope (no abrupt setValueAtTime jumps)
        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.linearRampToValueAtTime(0.30, t + 0.09);
        noteGain.gain.linearRampToValueAtTime(0.24, t + durSec * 0.78);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + totalSec);

        osc.connect(noteGain);
        harmonic.connect(harmonicGain);
        harmonicGain.connect(noteGain);

        noteGain.connect(this.ambientFilter);
        noteGain.connect(delay);

        osc.start(t);
        harmonic.start(t);
        osc.stop(t + totalSec + 0.05);
        harmonic.stop(t + totalSec + 0.05);
      };

      const scheduleNextNote = () => {
        if (!this.isAmbientPlaying || !this.ctx) return;

        const ev = phraseEvents[eventIndex];
        const durationMs = Math.round(ev.baseMs * tempoScale);

        if (ev.chordIdx !== undefined) {
          const t = this.ctx.currentTime;
          const pad = bassPads[ev.chordIdx];
          if (this.ambientOscillators[0]) {
            this.ambientOscillators[0].frequency.setTargetAtTime(pad.root, t, 0.35);
          }
          if (this.ambientOscillators[1]) {
            this.ambientOscillators[1].frequency.setTargetAtTime(pad.fifth, t, 0.35);
          }
          if (this.ambientOscillators[2]) {
            this.ambientOscillators[2].frequency.setTargetAtTime(pad.third, t, 0.35);
          }
        }

        playLongMelodyNote(ev.freq, durationMs);

        // Smoothly accelerate from slow intro (1.55x) to normal speed (1.0x)
        if (tempoScale > 1.0) {
          tempoScale = Math.max(1.0, tempoScale - 0.065);
        }

        eventIndex = (eventIndex + 1) % phraseEvents.length;
        this.melodyTimer = setTimeout(scheduleNextNote, durationMs) as unknown as ReturnType<typeof setInterval>;
      };

      this.melodyTimer = setTimeout(scheduleNextNote, 200) as unknown as ReturnType<typeof setInterval>;
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbient() {
    if (!this.ctx || !this.isAmbientPlaying) return;
    try {
      const now = this.ctx.currentTime;
      if (this.chordTimer) {
        clearInterval(this.chordTimer);
        this.chordTimer = null;
      }
      if (this.melodyTimer) {
        clearTimeout(this.melodyTimer);
        clearInterval(this.melodyTimer);
        this.melodyTimer = null;
      }

      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.6);
      }

      setTimeout(() => {
        if (this.lfoOsc) {
          try {
            this.lfoOsc.stop();
            this.lfoOsc.disconnect();
          } catch {
            // LFO ya detenido.
          }
          this.lfoOsc = null;
        }
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // El oscilador ya se detuvo; no hay nada que limpiar.
          }
        });
        this.ambientOscillators = [];
        this.ambientGains = [];
        this.isAmbientPlaying = false;
      }, 700);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  // INSTANT AUDIBLE CONFIRMATION CHIME (When turning ON)
  public playChime() {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, delay: 0 },    // C5
      { f: 659.25, delay: 100 },  // E5
      { f: 783.99, delay: 200 },  // G5
      { f: 1046.5, delay: 320 },  // C6
    ];

    notes.forEach(({ f, delay }) => {
      setTimeout(() => {
        this.playTone(f, "sine", 0.22, 0.28);
      }, delay);
    });
  }

  public playTone(
    freq = 440,
    type: OscillatorType = "sine",
    duration = 0.1,
    volume = 0.25
  ) {
    if (!this.enabled) return;
    try {
      const ctx = this.getOrCreateContext();
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.setTargetAtTime(0.001, now + duration * 0.4, duration * 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Web Audio no disponible en este navegador.
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playTone(523.25, "sine", 0.14, 0.14);
    setTimeout(() => this.playTone(659.25, "sine", 0.14, 0.14), 90);
    setTimeout(() => this.playTone(783.99, "sine", 0.22, 0.16), 180);
  }

  public playClick() {
    this.playTone(580, "sine", 0.05, 0.10);
  }

  public playHover() {
    this.playTone(460, "sine", 0.035, 0.04);
  }

  public playWarp() {
    if (!this.enabled) return;
    try {
      const ctx = this.getOrCreateContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.20, now);
      gain.gain.setTargetAtTime(0.001, now + 0.15, 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Web Audio no disponible en este navegador.
    }
  }
}

export const soundManager = new SoundManager();
