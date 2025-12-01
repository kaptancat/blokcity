
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private rainNode: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private rainGain: GainNode | null = null;

  private initialized = false;

  init() {
    if (this.initialized) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.6; // Increased volume
    this.initialized = true;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = val;
    }
  }

  playTone(freq: number, type: OscillatorType = 'sine', duration = 0.1) {
    if (!this.ctx || !this.masterGain) return;
    this.resume(); // Ensure context is running
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClap() {
    this.playTone(150, 'triangle', 0.05); // Quick low thud
    setTimeout(() => this.playTone(800, 'square', 0.1), 20); // Higher snap
  }

  playSuccess() {
    this.playTone(440, 'sine', 0.1);
    setTimeout(() => this.playTone(554, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(659, 'sine', 0.2), 200);
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(120, 'sawtooth', 0.3), 150);
  }
  
  playLaunchRumble() {
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime); // Low frequency
    osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 4); // Pitch up

    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.5); // Fade in
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 4); // Fade out

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 4);
  }

  playBulldozerImpact() {
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    // Low crunch
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);

    // High metallic hit
    this.playTone(1200, 'triangle', 0.1);
  }

  playBuildingCollapse() {
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const noise = this.ctx.createBufferSource();
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;
    noise.buffer = buffer;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
    noise.stop(this.ctx.currentTime + 1.5);
  }


  // Ambience
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  toggleAmbience(weather: 'CLEAR' | 'RAIN' | 'SNOW') {
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    // Stop existing
    if (this.windNode) { try { this.windNode.stop(); } catch(e){} this.windNode = null; }
    if (this.rainNode) { try { this.rainNode.stop(); } catch(e){} this.rainNode = null; }

    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    // Always play a faint wind in background
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (weather === 'RAIN' || weather === 'SNOW') {
        if (weather === 'RAIN') {
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            gain.gain.value = 0.25;
            this.rainNode = source;
            this.rainGain = gain;
        } else {
            // Snow is windy
            filter.type = 'bandpass';
            filter.frequency.value = 400;
            gain.gain.value = 0.2;
            this.windNode = source;
            this.windGain = gain;
        }
    } else {
        // Clear weather light wind
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        gain.gain.value = 0.05;
        this.windNode = source;
        this.windGain = gain;
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }
}

export const audioService = new AudioService();
