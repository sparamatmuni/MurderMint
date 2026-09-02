// Noir Sound Synthesizer & 1930s Ambient Music Engine using Web Audio API

export type AmbientSoundMode = 'vintage-jazz' | 'mansion-storm' | 'gramophone-ensemble' | 'off';

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

// Ambient Sound Engine State
let ambientMode: AmbientSoundMode = (typeof localStorage !== 'undefined' && localStorage.getItem('murdermint_ambient_mode') as AmbientSoundMode) || 'vintage-jazz';
let ambientVolume = typeof localStorage !== 'undefined' ? parseFloat(localStorage.getItem('murdermint_ambient_volume') || '0.35') : 0.35;
let isAmbientPlaying = false;

// Web Audio Ambient Nodes
let ambientMasterGain: GainNode | null = null;
let jazzGain: GainNode | null = null;
let stormGain: GainNode | null = null;
let fireGain: GainNode | null = null;
let vinylGain: GainNode | null = null;

// Schedulers & Intervals
let jazzSchedulerInterval: number | null = null;
let fireInterval: number | null = null;
let thunderTimeout: number | null = null;
let rainNode: AudioNode | null = null;
let windNode: AudioNode | null = null;
let vinylNode: AudioNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isAudioMuted = !isAudioMuted;
  return isAudioMuted;
}

export function isMuted(): boolean {
  return isAudioMuted;
}

export function setMuted(muted: boolean): void {
  isAudioMuted = muted;
}

// ==========================================
// 1930s AMBIENT JAZZ & MANSION AUDIO ENGINE
// ==========================================

export function getAmbientVolume(): number {
  return ambientVolume;
}

export function setAmbientVolume(vol: number): void {
  ambientVolume = Math.max(0, Math.min(1, vol));
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('murdermint_ambient_volume', ambientVolume.toString());
  }
  if (ambientMasterGain && audioCtx) {
    ambientMasterGain.gain.setTargetAtTime(isAudioMuted || !isAmbientPlaying ? 0 : ambientVolume, audioCtx.currentTime, 0.05);
  }
}

export function getAmbientMode(): AmbientSoundMode {
  return ambientMode;
}

export function isAmbientActive(): boolean {
  return isAmbientPlaying;
}

export function setAmbientMode(mode: AmbientSoundMode): void {
  ambientMode = mode;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('murdermint_ambient_mode', mode);
  }
  if (isAmbientPlaying) {
    stopAmbientAudio();
    if (mode !== 'off') {
      startAmbientAudio();
    }
  }
}

export function toggleAmbientAudio(): boolean {
  if (isAmbientPlaying) {
    stopAmbientAudio();
    return false;
  } else {
    if (ambientMode === 'off') {
      ambientMode = 'vintage-jazz';
    }
    startAmbientAudio();
    return true;
  }
}

export function startAmbientAudio(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (isAmbientPlaying) {
    stopAmbientAudio();
  }

  isAmbientPlaying = true;

  // Master Ambient Gain with 1930s Gramophone Bandpass EQ
  ambientMasterGain = ctx.createGain();
  ambientMasterGain.gain.setValueAtTime(0, ctx.currentTime);
  ambientMasterGain.gain.linearRampToValueAtTime(ambientVolume, ctx.currentTime + 1.2);

  // 1930s Gramophone shellac radio filter (warm low/mid focus, rolled off harsh highs)
  const vintageFilter = ctx.createBiquadFilter();
  vintageFilter.type = 'lowpass';
  vintageFilter.frequency.setValueAtTime(3600, ctx.currentTime);

  const warmHighPass = ctx.createBiquadFilter();
  warmHighPass.type = 'highpass';
  warmHighPass.frequency.setValueAtTime(80, ctx.currentTime);

  ambientMasterGain.connect(vintageFilter);
  vintageFilter.connect(warmHighPass);
  warmHighPass.connect(ctx.destination);

  // 1. Vinyl Record Crackle & Hiss
  initVinylCrackling(ctx, ambientMasterGain);

  // 2. Setup based on selected mode
  if (ambientMode === 'vintage-jazz' || ambientMode === 'gramophone-ensemble') {
    init1930sJazzEngine(ctx, ambientMasterGain);
  }

  if (ambientMode === 'mansion-storm' || ambientMode === 'gramophone-ensemble') {
    initMansionStormEngine(ctx, ambientMasterGain);
  }
}

export function stopAmbientAudio(): void {
  isAmbientPlaying = false;

  if (jazzSchedulerInterval) {
    clearInterval(jazzSchedulerInterval);
    jazzSchedulerInterval = null;
  }
  if (fireInterval) {
    clearInterval(fireInterval);
    fireInterval = null;
  }
  if (thunderTimeout) {
    clearTimeout(thunderTimeout);
    thunderTimeout = null;
  }

  if (ambientMasterGain && audioCtx) {
    try {
      ambientMasterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    } catch {}
  }
}

// 1. Vinyl Surface Noise & Gramophone Needle Hiss
function initVinylCrackling(ctx: AudioContext, master: GainNode) {
  try {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.012;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 2.5;

    vinylGain = ctx.createGain();
    vinylGain.gain.value = 0.08;

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(vinylGain);
    vinylGain.connect(master);

    whiteNoise.start();
    vinylNode = whiteNoise;
  } catch {}
}

// 2. 1930s Noir Jazz Progression Synthesizer (Walking Bass, Velvet Rhodes Chords & Brushes)
function init1930sJazzEngine(ctx: AudioContext, master: GainNode) {
  jazzGain = ctx.createGain();
  jazzGain.gain.value = 0.28;
  jazzGain.connect(master);

  // 1930s Film Noir Chord Progressions (D minor 9 -> G 13 -> C maj7 -> A 7b9)
  const chordProgressions: { notes: number[]; bass: number; name: string }[] = [
    { notes: [293.66, 349.23, 440.00, 523.25, 659.25], bass: 73.42, name: 'Dm9' },    // D3, F4, A4, C5, E5 | D2 bass
    { notes: [293.66, 392.00, 493.88, 659.25], bass: 98.00, name: 'G13' },             // D4, G4, B4, E5 | G2 bass
    { notes: [261.63, 329.63, 392.00, 493.88, 587.33], bass: 65.41, name: 'Cmaj9' },  // C4, E4, G4, B4, D5 | C2 bass
    { notes: [220.00, 277.18, 329.63, 392.00, 466.16], bass: 110.00, name: 'A7b9' },  // A3, C#4, E4, G4, Bb4 | A2 bass
  ];

  let chordIndex = 0;
  let beat = 0;

  const playJazzBeat = () => {
    if (!isAmbientPlaying || !ctx) return;
    const now = ctx.currentTime;
    const chord = chordProgressions[chordIndex];

    // Every 4 beats, switch chord
    if (beat === 0) {
      // Warm Rhodes / Velvet Piano Chord
      chord.notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);

        const chordDuration = 3.6;
        gain.gain.setValueAtTime(0.04, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

        osc.connect(gain);
        if (jazzGain) gain.connect(jazzGain);

        osc.start(now + i * 0.03);
        osc.stop(now + chordDuration);
      });
    }

    // Walking Acoustic Upright Bass (Every beat)
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';

    // Walking bass intervals
    const bassSteps = [1, 1.25, 1.33, 1.5];
    const bassFreq = chord.bass * bassSteps[beat % 4];
    bassOsc.frequency.setValueAtTime(bassFreq, now);

    bassGain.gain.setValueAtTime(0.12, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    bassOsc.connect(bassGain);
    if (jazzGain) bassGain.connect(jazzGain);

    bassOsc.start(now);
    bassOsc.stop(now + 0.85);

    // Vintage Brushed Snare / Hi-Hat Swing Tap (Beats 2 and 4)
    if (beat === 1 || beat === 3) {
      const brushOsc = ctx.createOscillator();
      const brushGain = ctx.createGain();
      brushOsc.type = 'sawtooth';
      brushOsc.frequency.setValueAtTime(1400, now);

      brushGain.gain.setValueAtTime(0.02, now);
      brushGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      brushOsc.connect(brushGain);
      if (jazzGain) brushGain.connect(jazzGain);

      brushOsc.start(now);
      brushOsc.stop(now + 0.12);
    }

    beat = (beat + 1) % 4;
    if (beat === 0) {
      chordIndex = (chordIndex + 1) % chordProgressions.length;
    }
  };

  playJazzBeat();
  jazzSchedulerInterval = window.setInterval(playJazzBeat, 950);
}

// 3. Mansion Storm, Rain & Fireplace Engine
function initMansionStormEngine(ctx: AudioContext, master: GainNode) {
  stormGain = ctx.createGain();
  stormGain.gain.value = 0.22;
  stormGain.connect(master);

  // A. Midnight Rain on Glass Windows (Continuous Pink Noise)
  try {
    const bufferSize = ctx.sampleRate * 2;
    const rainBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = rainBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.06;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 850;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.15;

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    if (stormGain) rainGain.connect(stormGain);

    rainSource.start();
    rainNode = rainSource;
  } catch {}

  // B. Soft Veranda Wind Gusts (Modulated Brownian Noise)
  try {
    const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const wOut = windBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < windBuffer.length; i++) {
      const white = Math.random() * 2 - 1;
      wOut[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = wOut[i];
      wOut[i] *= 0.8;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 240;
    windFilter.Q.value = 1.8;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.18;

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    if (stormGain) windGain.connect(stormGain);

    windSource.start();
    windNode = windSource;
  } catch {}

  // C. Fireplace Hearth Crackling Embers (Random micro bursts)
  fireInterval = window.setInterval(() => {
    if (!isAmbientPlaying || !ctx) return;
    const now = ctx.currentTime;
    if (Math.random() < 0.65) {
      const pop = ctx.createOscillator();
      const popGain = ctx.createGain();
      pop.type = 'triangle';
      pop.frequency.setValueAtTime(300 + Math.random() * 600, now);

      popGain.gain.setValueAtTime(0.04 * Math.random(), now);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + Math.random() * 0.05);

      pop.connect(popGain);
      if (stormGain) popGain.connect(stormGain);

      pop.start(now);
      pop.stop(now + 0.08);
    }
  }, 140);

  // D. Occasional Distant Manor Thunder Roll
  const triggerDistantThunder = () => {
    if (!isAmbientPlaying || !ctx) return;
    const now = ctx.currentTime;
    const thunderOsc = ctx.createOscillator();
    const thunderGain = ctx.createGain();
    thunderOsc.type = 'sine';
    thunderOsc.frequency.setValueAtTime(55, now);
    thunderOsc.frequency.exponentialRampToValueAtTime(32, now + 2.5);

    thunderGain.gain.setValueAtTime(0.01, now);
    thunderGain.gain.linearRampToValueAtTime(0.08, now + 0.8);
    thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    thunderOsc.connect(thunderGain);
    if (stormGain) thunderGain.connect(stormGain);

    thunderOsc.start(now);
    thunderOsc.stop(now + 3.0);

    // Schedule next distant thunder in 25–45 seconds
    thunderTimeout = window.setTimeout(triggerDistantThunder, 25000 + Math.random() * 20000);
  };

  thunderTimeout = window.setTimeout(triggerDistantThunder, 6000);
}

// ==========================================
// GAME SOUND EFFECTS (UI, DICE, ACCUSATIONS)
// ==========================================

// 1. Subtle UI Click
export function playClickSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

// 2. Dice Roll Sound (Rattle & Clatter)
export function playDiceSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 4; i++) {
    const time = now + i * 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220 + Math.random() * 300, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.05);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}

// 3. Movement Footsteps (Deep Wood Floor Thump)
export function playMoveSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

// 4. Evidence Reveal Chime (Mysterious Noir Bell)
export function playEvidenceRevealSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = now + idx * 0.1;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.6);
  });
}

// 5. Dramatic Accusation Sting
export function playAccusationSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [130.81, 164.81, 196.0, 246.94]; // Low dramatic chord

  notes.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  });
}

// 6. Case Solved Victory Chime
export function playVictorySound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major triumphant flourish

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = now + idx * 0.12;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.8);
  });
}

// 7. Error / Wrong Accusation Horn
export function playErrorSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.setValueAtTime(90, now + 0.2);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);
}

// 8. Vintage Parlor Telegraph / Typewriter Keystroke Sound
export function playTelegraphSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}


