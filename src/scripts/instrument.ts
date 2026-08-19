// The audio graph. Nothing here is a recording: every sound is oscillators and
// filtered noise built at press time, and even the room is a noise burst shaped
// into an impulse response. That is the spec's "the browser is the instrument".

import { createStage } from "./visuals.ts";
import { eventForKey, frequencyForMidi, pitchRange } from "./tuning.ts";

const canvas = document.querySelector<HTMLCanvasElement>("canvas#stage");
const overlay = document.querySelector<HTMLElement>("#overlay");
if (!canvas) throw new Error("no #stage canvas to play on");

const stage = createStage(canvas);
const { lowest, highest } = pitchRange();

let audio: AudioContext | null = null;
let master: GainNode;
let reverbSend: GainNode;
let voices = 0;

// Vertical position is the one continuous control: low on the stage is dark and
// close, high is bright and distant. It shapes every voice, so where the player
// happens to be holding the mouse already changes what they hear.
let brightness = 0.5;

// A room, synthesised. Noise decaying over two seconds is a serviceable plate,
// and it keeps the promise that nothing is loaded from a file.
function buildRoom(context: AudioContext): AudioBuffer {
  const length = Math.floor(context.sampleRate * 2);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const samples = impulse.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      const progress = index / length;
      samples[index] = (Math.random() * 2 - 1) * (1 - progress) ** 2.6;
    }
  }
  return impulse;
}

// Built on the first gesture, because a context created before one is born
// suspended — and a first press that only unlocks the audio makes no sound,
// which is exactly the moment the crit watches for.
function ensureAudio(): AudioContext {
  if (audio) {
    if (audio.state === "suspended") void audio.resume();
    return audio;
  }
  const context = new AudioContext();
  const ceiling = context.createDynamicsCompressor();
  ceiling.threshold.value = -10;
  ceiling.ratio.value = 12;
  ceiling.connect(context.destination);

  master = context.createGain();
  master.gain.value = 0.9;
  master.connect(ceiling);

  const room = context.createConvolver();
  room.buffer = buildRoom(context);
  room.connect(master);
  reverbSend = context.createGain();
  reverbSend.gain.value = 0.35;
  reverbSend.connect(room);

  audio = context;
  return context;
}

function cutoffNow(): number {
  return 520 + brightness * 3400;
}

function playNote(letter: string, midi: number, sustained: boolean): void {
  const context = ensureAudio();
  if (voices > 22) return; // a mashed keyboard should thicken, not distort
  voices += 1;

  const now = context.currentTime;
  const frequency = frequencyForMidi(midi);
  const decay = sustained ? 1.9 : 0.55;
  const peak = sustained ? 0.22 : 0.15;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoffNow() * (sustained ? 1 : 1.7), now);
  filter.Q.value = 1.2;

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(peak, now + (sustained ? 0.035 : 0.008));
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  filter.connect(envelope);
  envelope.connect(master);
  envelope.connect(reverbSend);

  const sources: AudioScheduledSourceNode[] = [];

  const fundamental = context.createOscillator();
  fundamental.type = sustained ? "sine" : "triangle";
  fundamental.frequency.value = frequency;
  fundamental.connect(filter);
  sources.push(fundamental);

  const partial = context.createOscillator();
  partial.type = sustained ? "triangle" : "sine";
  partial.frequency.value = frequency * (sustained ? 2.002 : 3.01);
  const partialGain = context.createGain();
  partialGain.gain.value = sustained ? 0.3 : 0.16;
  partial.connect(partialGain).connect(filter);
  sources.push(partial);

  // Consonants get a breath of noise, the way a consonant is a burst of air.
  if (!sustained) {
    const grainLength = Math.floor(context.sampleRate * 0.05);
    const grain = context.createBuffer(1, grainLength, context.sampleRate);
    const samples = grain.getChannelData(0);
    for (let index = 0; index < grainLength; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * (1 - index / grainLength) ** 3;
    }
    const breath = context.createBufferSource();
    breath.buffer = grain;
    const band = context.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = frequency * 2.4;
    band.Q.value = 0.9;
    const breathGain = context.createGain();
    breathGain.gain.value = 0.5;
    breath.connect(band).connect(breathGain).connect(envelope);
    sources.push(breath);
  }

  for (const source of sources) {
    source.start(now);
    source.stop(now + decay + 0.05);
  }
  fundamental.onended = () => {
    voices -= 1;
    envelope.disconnect();
    filter.disconnect();
  };

  stage.addNote(letter, midi, sustained);
  reveal();
}

// The drag voice. Continuous rather than quantised: with no target pitch there
// is nothing to miss, so sliding is expressive instead of out of tune.
type Drag = { osc: OscillatorNode; sub: OscillatorNode; gain: GainNode; filter: BiquadFilterNode };
let drag: Drag | null = null;

function midiForX(x: number): number {
  const position = Math.min(Math.max((x / window.innerWidth - 0.12) / 0.76, 0), 1);
  return lowest + position * (highest - lowest);
}

function startDrag(x: number): void {
  const context = ensureAudio();
  if (drag) return;
  const now = context.currentTime;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoffNow();
  filter.Q.value = 3;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.09);

  const osc = context.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = frequencyForMidi(midiForX(x));

  const sub = context.createOscillator();
  sub.type = "sine";
  sub.frequency.value = osc.frequency.value / 2;
  const subGain = context.createGain();
  subGain.gain.value = 0.45;

  osc.connect(filter);
  sub.connect(subGain).connect(filter);
  filter.connect(gain);
  gain.connect(master);
  gain.connect(reverbSend);
  osc.start(now);
  sub.start(now);

  drag = { osc, sub, gain, filter };
  reveal();
}

function moveDrag(x: number): void {
  if (!audio || !drag) return;
  const target = frequencyForMidi(midiForX(x));
  // A short glide rather than a jump: this is the theremin's whole character.
  drag.osc.frequency.setTargetAtTime(target, audio.currentTime, 0.05);
  drag.sub.frequency.setTargetAtTime(target / 2, audio.currentTime, 0.05);
  drag.filter.frequency.setTargetAtTime(cutoffNow(), audio.currentTime, 0.08);
}

function stopDrag(): void {
  if (!audio || !drag) return;
  const { osc, sub, gain } = drag;
  const now = audio.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc.stop(now + 0.32);
  sub.stop(now + 0.32);
  drag = null;
}

function reveal(): void {
  overlay?.classList.add("is-hidden");
}

window.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  const played = eventForKey(event.key);
  if (!played) return;
  if (event.key === " ") event.preventDefault(); // a space is a rest, not a scroll
  if (played.kind === "note") playNote(played.letter, played.midi, played.voice === "vowel");
  else reveal();
});

canvas.addEventListener("pointerdown", (event) => {
  canvas.setPointerCapture(event.pointerId);
  brightness = 1 - event.clientY / window.innerHeight;
  startDrag(event.clientX);
  stage.setGlow({ x: event.clientX, y: event.clientY, hue: 200, active: true });
});

canvas.addEventListener("pointermove", (event) => {
  brightness = 1 - event.clientY / window.innerHeight;
  if (!drag) return;
  moveDrag(event.clientX);
  stage.setGlow({ x: event.clientX, y: event.clientY, hue: 200, active: true });
});

for (const ending of ["pointerup", "pointercancel", "pointerleave"] as const) {
  canvas.addEventListener(ending, () => {
    stopDrag();
    stage.setGlow(null);
  });
}
