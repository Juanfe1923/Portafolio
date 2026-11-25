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

      // Master ambient volume (subtle & intimate)
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(0.10, now + 1.5);
      master.connect(ctx.destination);
      this.masterGain = master;

      // Warm lowpass filter for felt-piano softness
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1150, now);
      filter.Q.setValueAtTime(0.6, now);
      filter.connect(master);
      this.ambientFilter = filter;

      // Spacious cosmic delay/reverb tail
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.36, now);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.34, now);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(950, now);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(master);

      // Subtle warm organ bass pad (root + fifth)
      const bassPads = [
        { root: 87.31, fifth: 130.81 },  // F2 + C3
        { root: 98.00, fifth: 146.83 },  // G2 + D3
        { root: 110.00, fifth: 164.81 }, // A2 + E3
        { root: 98.00, fifth: 146.83 },  // G2 + D3
      ];

      this.ambientOscillators = [];
      this.ambientGains = [];

      [bassPads[0].root, bassPads[0].fifth].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(idx === 0 ? 0.18 : 0.10, now);
        osc.connect(g);
        g.connect(filter);
        osc.start(now);
        this.ambientOscillators.push(osc);
        this.ambientGains.push(g);
      });

      // Iconic 4-bar arpeggio sequence (6 eighth-notes per bar at ~340ms)
      const E5 = 659.25;
      const A4 = 440.00;
      const B4 = 493.88;
      const C5 = 523.25;
      const D5 = 587.33;

      const bars: number[][] = [
        [A4, E5, A4, E5, A4, E5], // Bar 1: Fmaj7
        [B4, E5, B4, E5, B4, E5], // Bar 2: G6
        [C5, E5, C5, E5, C5, E5], // Bar 3: Am
        [D5, E5, D5, B4, C5, B4], // Bar 4: G/Em turnaround
      ];

      let barIndex = 0;
      let stepIndex = 0;

      const playFeltPianoNote = (freq: number, accent: boolean) => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientFilter) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const harmonic = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        harmonic.type = "triangle";
        harmonic.frequency.setValueAtTime(freq, t);

        const harmonicGain = this.ctx.createGain();
        harmonicGain.gain.setValueAtTime(0.18, t);

        const peak = accent ? 0.24 : 0.16;
        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime(peak, t + 0.022);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, t + 1.45);

        osc.connect(noteGain);
        harmonic.connect(harmonicGain);
        harmonicGain.connect(noteGain);

        noteGain.connect(this.ambientFilter);
        noteGain.connect(delay);

        osc.start(t);
        harmonic.start(t);
        osc.stop(t + 1.5);
        harmonic.stop(t + 1.5);
      };

      const tickArpeggio = () => {
        if (!this.isAmbientPlaying || !this.ctx) return;

        // Update bass pad smoothly at the start of each bar
        if (stepIndex === 0) {
          const t = this.ctx.currentTime;
          const pad = bassPads[barIndex];
          if (this.ambientOscillators[0]) {
            this.ambientOscillators[0].frequency.setTargetAtTime(pad.root, t, 0.35);
          }
          if (this.ambientOscillators[1]) {
            this.ambientOscillators[1].frequency.setTargetAtTime(pad.fifth, t, 0.35);
          }
        }

        const noteFreq = bars[barIndex][stepIndex];
        playFeltPianoNote(noteFreq, stepIndex === 0 || stepIndex === 3);

        stepIndex++;
        if (stepIndex >= 6) {
          stepIndex = 0;
          barIndex = (barIndex + 1) % bars.length;
        }
      };

      // Start gently after 350ms, repeating every 340ms
      setTimeout(tickArpeggio, 350);
      this.melodyTimer = setInterval(tickArpeggio, 340);
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
