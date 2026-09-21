'use client';

// Web Audio synthesizer for ambient harmonic preview of tracks
class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChord(notes: number[] = [261.63, 311.13, 392.0, 523.25], trackId: string, onStop?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    // Smooth fade in
    masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 2.5);
    filter.connect(masterGain);

    this.activeOscillators = notes.map((freq, index) => {
      const osc = this.ctx!.createOscillator();
      // Alternating warm waveforms
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      
      // Subtle vibrato/detune for organic warmth
      osc.detune.setValueAtTime((index - 1.5) * 4, this.ctx!.currentTime);

      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = 0.25 / notes.length;
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      return osc;
    });

    // Auto fadeout after 12 seconds preview unless manually stopped
    const stopTimer = setTimeout(() => {
      if (this.currentTrackId === trackId && this.isPlaying) {
        this.stop();
        if (onStop) onStop();
      }
    }, 12000);

    return () => clearTimeout(stopTimer);
  }

  stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          this.activeOscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.activeOscillators = [];
          if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
          }
        }, 450);
      } catch {
        this.activeOscillators = [];
        this.gainNode = null;
      }
    }
    this.isPlaying = false;
    this.currentTrackId = null;
  }

  getCurrentState() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
    };
  }
}

export const audioSynth = new SoundEngine();
