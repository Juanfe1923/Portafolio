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
  private chordTimer: ReturnType<typeof setInterval> | null = null;
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
   * Generates a warm, clearly audible, celestial ambient synthesizer soundscape.
   * Uses audible mid-range frequencies (220Hz - 660Hz) with gentle filter sweeps,
   * perfectly audible on laptop, desktop, and mobile speakers without distortion.
   */
  public startAmbient() {
    const ctx = this.getOrCreateContext();
    if (!ctx || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const now = ctx.currentTime;

      // Master ambient volume (healthy, audible 0.32 level)
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.linearRampToValueAtTime(0.32, now + 1.2);
      master.connect(ctx.destination);
      this.masterGain = master;

      // Filter: Open lowpass (2400 Hz) so mid-high harmonics sing clearly
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(1.5, now);
      filter.connect(master);
      this.ambientFilter = filter;

      // Celestial ambient chord progression (Dmaj9 ⇄ Gmaj9)
      const chordA = [
        { f: 146.83, type: "sine" as OscillatorType, vol: 0.28 },    // D3
        { f: 220.0, type: "triangle" as OscillatorType, vol: 0.22 }, // A3
        { f: 277.18, type: "sine" as OscillatorType, vol: 0.24 },   // C#4
        { f: 329.63, type: "triangle" as OscillatorType, vol: 0.20 }, // E4
        { f: 440.0, type: "sine" as OscillatorType, vol: 0.16 },    // A4
        { f: 554.37, type: "sine" as OscillatorType, vol: 0.12 },   // C#5
      ];

      this.ambientOscillators = [];
      this.ambientGains = [];

      chordA.forEach((note, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = note.type;
        // Subtle chorus detuning
        const detune = (idx % 2 === 0 ? 1 : -1) * (idx * 3.5);
        osc.frequency.setValueAtTime(note.f, now);
        osc.detune.setValueAtTime(detune, now);

        g.gain.setValueAtTime(note.vol, now);
        osc.connect(g);
        g.connect(filter);
        osc.start(now);

        this.ambientOscillators.push(osc);
        this.ambientGains.push(g);
      });

      // Smooth ambient chord breath cycle every 8 seconds
      let chordStep = 0;
      this.chordTimer = setInterval(() => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientFilter) return;
        const t = this.ctx.currentTime;
        chordStep = (chordStep + 1) % 2;

        // Filter breath
        const targetFreq = chordStep === 0 ? 2600 : 1800;
        this.ambientFilter.frequency.setTargetAtTime(targetFreq, t, 2.5);

        // Gentle shift to Gmaj9 chord and back
        const baseFreqs =
          chordStep === 0
            ? [146.83, 220.0, 277.18, 329.63, 440.0, 554.37] // Dmaj9
            : [196.0, 246.94, 293.66, 370.0, 440.0, 587.33]; // Gmaj9

        this.ambientOscillators.forEach((osc, i) => {
          if (baseFreqs[i]) {
            osc.frequency.setTargetAtTime(baseFreqs[i], t, 2.0);
          }
        });
      }, 8000);
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

      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.6);
      }

      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
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
    } catch {}
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playTone(523.25, "sine", 0.12, 0.25);
    setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.25), 90);
    setTimeout(() => this.playTone(783.99, "sine", 0.18, 0.28), 180);
  }

  public playClick() {
    this.playTone(680, "triangle", 0.06, 0.20);
  }

  public playHover() {
    this.playTone(420, "sine", 0.04, 0.10);
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
    } catch {}
  }
}

export const soundManager = new SoundManager();
