// Synthesized Web Audio API sound generator for Aetheria

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeAmbientNodes: { [key: string]: { stop: () => void } } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('aetheria_sound_muted');
      this.isMuted = storedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheria_sound_muted', String(this.isMuted));
    }
    if (this.isMuted) {
      this.stopAllAmbient();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  public playQuestComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio chords: C5, E5, G5, B5, C6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch (e) {}
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 440, t: 0 },
        { f: 554.37, t: 0.1 },
        { f: 659.25, t: 0.2 },
        { f: 880, t: 0.3 },
        { f: 1108.73, t: 0.45 },
      ];
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.15, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.45);
      });
    } catch (e) {}
  }

  public playSpellCast() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  public playBossHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Synthesized Ambient Soundscapes
  public startRainAmbient() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.activeAmbientNodes['rain']) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink-like filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      this.activeAmbientNodes['rain'] = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (err) {}
        }
      };
    } catch (e) {}
  }

  public stopRainAmbient() {
    if (this.activeAmbientNodes['rain']) {
      this.activeAmbientNodes['rain'].stop();
      delete this.activeAmbientNodes['rain'];
    }
  }

  public startFireAmbient() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.activeAmbientNodes['fire']) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Crackle bursts
        const r = Math.random();
        data[i] = r > 0.985 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.03;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      this.activeAmbientNodes['fire'] = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (err) {}
        }
      };
    } catch (e) {}
  }

  public stopFireAmbient() {
    if (this.activeAmbientNodes['fire']) {
      this.activeAmbientNodes['fire'].stop();
      delete this.activeAmbientNodes['fire'];
    }
  }

  public startDroneAmbient() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.activeAmbientNodes['drone']) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, this.ctx.currentTime); // Om frequency
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(138.1, this.ctx.currentTime); // Binaural 2Hz drift

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.activeAmbientNodes['drone'] = {
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch (err) {}
        }
      };
    } catch (e) {}
  }

  public stopDroneAmbient() {
    if (this.activeAmbientNodes['drone']) {
      this.activeAmbientNodes['drone'].stop();
      delete this.activeAmbientNodes['drone'];
    }
  }

  public stopAllAmbient() {
    Object.keys(this.activeAmbientNodes).forEach((key) => {
      this.activeAmbientNodes[key].stop();
    });
    this.activeAmbientNodes = {};
  }
}

export const sound = new SoundEngine();
