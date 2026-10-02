/**
 * Web Audio API Synthesizer for Cyber Vengeance Sound FX
 * Generates futuristic sci-fi sound design natively in-browser without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breachmirror_audio_enabled');
      this.enabled = saved !== null ? saved === 'true' : true;
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('breachmirror_audio_enabled', String(val));
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playSuccess();
    }
    return this.enabled;
  }

  // Futuristic high-frequency radar sweep / blip ping
  public playBlip(freq: number = 880): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext failure gracefully ignored
    }
  }

  // Target lock-on chirp
  public playTargetLock(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.05);
      osc.frequency.setValueAtTime(1040, now + 0.1);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Tactical countermeasure laser strike / honeytoken deploy
  public playCountermeasure(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  // DEFCON state change siren pulse
  public playDefconAlert(level: number): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Lower DEFCON = higher pitch and more urgent pulse
      const baseFreq = level === 1 ? 920 : level === 2 ? 740 : 540;
      osc.type = 'square';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200, now + 0.12);
      osc.frequency.linearRampToValueAtTime(baseFreq, now + 0.24);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  // Airlock depressurize & secret purge swoosh
  public playPurge(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // White noise buffer for steam / airlock swoosh
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);
    } catch {}
  }

  // Harmonic success resolution
  public playSuccess(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      [440, 554.37, 659.25].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.05, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28 + idx * 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.3 + idx * 0.04);
      });
    } catch {}
  }

  /**
   * OUT-OF-THE-BOX THREAT SOUND DESIGN
   * Layer 1: Sub-Bass Infrasonic Drop (140Hz -> 38Hz rumble)
   * Layer 2: Dissonant Tritone Klaxon (Diminished 5th frequency tension: 466.16Hz & 659.25Hz)
   * Layer 3: High-Frequency Digital Packet Intrusion Glitch
   * Layer 4: Optional Cybernetic AI Voice Annunciation
   */
  public playThreatAlarm(
    severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' = 'CRITICAL',
    options?: { voiceAlert?: boolean; threatName?: string }
  ): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. SUB-BASS RUMBLE (Shockwave thud)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      const subFilter = ctx.createBiquadFilter();

      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(160, now);
      subFilter.frequency.exponentialRampToValueAtTime(45, now + 0.45);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.45);

      subGain.gain.setValueAtTime(0.18, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.5);

      // 2. DISSONANT TRITONE KLAXON (Evolutionary Alert Trigger)
      // Pitch shifts based on severity
      const baseA = severity === 'CRITICAL' ? 466.16 : severity === 'HIGH' ? 392.0 : 329.63;
      const baseB = severity === 'CRITICAL' ? 659.25 : severity === 'HIGH' ? 554.37 : 466.16;

      [baseA, baseB].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // 14Hz Vibrato warble
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(14, now);
        lfoGain.gain.setValueAtTime(18, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Pulsating envelope
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.12, now + 0.1);
        gain.gain.setValueAtTime(0.02, now + 0.22);
        gain.gain.setValueAtTime(0.11, now + 0.28);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.55);
        osc.stop(now + 0.55);
      });

      // 3. DIGITAL PACKET GLITCH DISPERSION
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High density digital burst
        data[i] = (Math.random() * 2 - 1) * (i % 200 < 50 ? 1 : 0.15);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2400, now);
      bandpass.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      bandpass.Q.setValueAtTime(6.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);

      // 4. BIONIC CYBER VOICE WARNING (Speech Synthesis)
      if (options?.voiceAlert && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const phrase = options.threatName 
            ? `Security Alert: ${options.threatName} detected.`
            : `Warning: Critical threat vector active.`;
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.rate = 1.15;
          utterance.pitch = 0.85; // Robotic baritone
          utterance.volume = 0.85;
          window.speechSynthesis.cancel(); // Cancel stale speech
          window.speechSynthesis.speak(utterance);
        } catch {
          // Voice fallback
        }
      }
    } catch {}
  }

  // High-frequency Threat Sonar Sweep
  public playThreatSonar(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Correct answer chime for handbook quiz
  public playQuizSuccess(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25 + idx * 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + 0.25 + idx * 0.06);
      });
    } catch {}
  }

  // Gentle Try Again sound for handbook quiz
  public playQuizTryAgain(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      [349.23, 311.13].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.05, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + idx * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + 0.25 + idx * 0.1);
      });
    } catch {}
  }

  // Voice narration for Executive Policy Briefings
  public speakBriefing(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundEngine();
