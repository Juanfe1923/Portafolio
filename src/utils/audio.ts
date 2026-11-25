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
   * Generates a soft, warm, non-fatiguing lo-fi/ambient soundscape:
   * - Velvety pure-sine pad with gentle breathing LFO
   * - 4-chord progression (Fmaj9 -> Em7 -> Dm9 -> Cmaj9)
   * - Delicate pentatonic bell/kalimba notes with a warm echo
   */
  public startAmbient() {
    const ctx = this.getOrCreateContext();
    if (!ctx || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const now = ctx.currentTime;

      // Master ambient volume (soft, relaxing 0.11 level)
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(0.11, now + 1.8);
      master.connect(ctx.destination);
      this.masterGain = master;

      // Warm lowpass filter so there are zero harsh highs
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(0.7, now);
      filter.connect(master);
      this.ambientFilter = filter;

      // Gentle breathing LFO modulating the filter cutoff (0.12 Hz = ~8s breath)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.12, now);
      lfoGain.gain.setValueAtTime(280, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.lfoOsc = lfo;

      // Soft delay echo for airy melody plucks
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.42, now);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.28, now);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(1200, now);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(master);

      // Warm 4-chord progression (Fmaj9 -> Em7 -> Dm9 -> Cmaj9)
      const chords = [
        [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9
        [164.81, 196.0, 246.94, 293.66, 392.0], // Em7
        [146.83, 220.0, 261.63, 329.63, 392.0], // Dm9
        [130.81, 196.0, 246.94, 293.66, 329.63], // Cmaj9
      ];

      this.ambientOscillators = [];
      this.ambientGains = [];

      chords[0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = "sine";
        const detune = (idx % 2 === 0 ? 1 : -1) * (idx * 2.2);
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        const vol = idx === 0 ? 0.24 : 0.14 - idx * 0.015;
        g.gain.setValueAtTime(Math.max(0.06, vol), now);
        osc.connect(g);
        g.connect(filter);
        osc.start(now);

        this.ambientOscillators.push(osc);
        this.ambientGains.push(g);
      });

      // Smooth chord progression every 6.5 seconds
      let chordStep = 0;
      this.chordTimer = setInterval(() => {
        if (!this.isAmbientPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        chordStep = (chordStep + 1) % chords.length;
        const nextChord = chords[chordStep];

        this.ambientOscillators.forEach((osc, i) => {
          if (nextChord[i]) {
            osc.frequency.setTargetAtTime(nextChord[i], t, 1.8);
          }
        });
      }, 6500);

      // Delicate pentatonic bell/kalimba notes for a musical, relaxing feel
      const melodyScale = [523.25, 587.33, 659.25, 783.99, 880.0, 987.77]; // C5 D5 E5 G5 A5 B5
      let melodyIdx = 0;

      const triggerSoftNote = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.masterGain) return;
        const t = this.ctx.currentTime;
        const freq = melodyScale[melodyIdx % melodyScale.length];
        melodyIdx = (melodyIdx + 1 + Math.floor(Math.random() * 2)) % melodyScale.length;

        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        noteOsc.type = "sine";
        noteOsc.frequency.setValueAtTime(freq, t);

        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime(0.16, t + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, t + 2.4);

        noteOsc.connect(noteGain);
        noteGain.connect(this.masterGain);
        noteGain.connect(delay);

        noteOsc.start(t);
        noteOsc.stop(t + 2.5);
      };

      // Play first gentle note after 1s, then every 2.8s
      setTimeout(triggerSoftNote, 1000);
      this.melodyTimer = setInterval(triggerSoftNote, 2800);
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
