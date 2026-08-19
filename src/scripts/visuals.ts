// The stage draws the melody as a score: pitch up the vertical axis, time along
// the horizontal. Each note is a mark joined to the one before it, so a typed
// word leaves a visible contour — two players hear different things and also
// *see* different shapes, which is what makes the difference legible to a room
// watching someone else play.
//
// Pitch was on the horizontal axis first, which drew every phrase as one flat
// line. Pitch has to be the vertical axis or there is no contour to read.

import { pitchRange } from "./tuning.ts";

const { lowest, highest } = pitchRange();

// Pixels per second. A pure fraction of the width bunched every phrase into a
// corner on a desktop; a fixed rate swept a phone clean in under two seconds.
// Scaled with a floor and a ceiling, a phrase stays readable at both marking
// viewports.
function speedFor(width: number): number {
  return Math.min(300, Math.max(120, width / 6));
}

type Mark = {
  spawnX: number;
  y: number;
  born: number;
  radius: number;
  hue: number;
  letter: string;
  sustained: boolean;
};

type Glow = { x: number; y: number; hue: number; active: boolean };

export type Stage = {
  addNote(letter: string, midi: number, sustained: boolean): void;
  setGlow(glow: Glow | null): void;
};

// Narrowing a `| null` const doesn't reach inside the render closure, so the
// check happens behind a return type that is already non-null.
function require2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("this browser gave us no 2d context to draw on");
  return context;
}

export function createStage(canvas: HTMLCanvasElement): Stage {
  const context = require2d(canvas);
  const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
  const marks: Mark[] = [];
  let glow: Glow | null = null;
  let width = 0;
  let height = 0;
  let frame = 0;
  let placed = 0;

  function resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // High notes sit high on the stage, the way they sit high on a staff.
  function yForMidi(midi: number): number {
    const position = (midi - lowest) / (highest - lowest);
    return height * (0.82 - position * 0.62);
  }

  function hueForMidi(midi: number): number {
    const position = (midi - lowest) / (highest - lowest);
    return 268 - position * 228; // violet in the low register, amber at the top
  }

  // Scrolling, the mark's age carries it leftward, so time reads left to right.
  // Standing still, notes step across a fixed score instead of gliding.
  function xAt(mark: Mark, now: number): number {
    if (stillness.matches) return mark.spawnX;
    return mark.spawnX - ((now - mark.born) / 1000) * speedFor(width);
  }

  // Marks fade out as they reach the left edge rather than on a timer, so the
  // fade matches what the eye sees whatever the screen is wide.
  function fadeAt(x: number): number {
    return Math.min(1, Math.max(0, x / (width * 0.22)));
  }

  function draw(now: number): void {
    frame = requestAnimationFrame(draw);
    const calm = stillness.matches;

    // A wash rather than a hard clear leaves a short motion trail. At 26% the
    // residue never reached zero and every faded mark left a permanent ghost,
    // so it has to be steep enough to actually converge on the background.
    context.fillStyle = calm ? "#0b0812" : "rgb(11 8 18 / 55%)";
    context.fillRect(0, 0, width, height);

    for (let index = marks.length - 1; index >= 0; index -= 1) {
      if (xAt(marks[index], now) < -60) marks.splice(index, 1);
    }

    // Restroked every frame: drawn once at spawn, the trail wash erased it
    // within a few frames and the phrase lost its line.
    for (let index = 1; index < marks.length; index += 1) {
      const from = marks[index - 1];
      const to = marks[index];
      const x = xAt(to, now);
      context.globalAlpha = fadeAt(x) * 0.5;
      context.strokeStyle = `hsl(${to.hue} 70% 66%)`;
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(xAt(from, now), from.y);
      context.lineTo(x, to.y);
      context.stroke();
    }

    for (const mark of marks) {
      const x = xAt(mark, now);
      const fade = fadeAt(x);
      context.globalAlpha = fade;
      context.fillStyle = `hsl(${mark.hue} 82% ${mark.sustained ? 62 : 72}%)`;
      context.beginPath();
      context.arc(x, mark.y, mark.radius * (0.7 + fade * 0.3), 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = fade * 0.85;
      context.fillStyle = "#0b0812";
      context.font = `600 ${Math.round(mark.radius * 1.05)}px system-ui, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(mark.letter, x, mark.y + 1);
    }
    context.globalAlpha = 1;

    if (glow?.active) {
      const gradient = context.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 90);
      gradient.addColorStop(0, `hsl(${glow.hue} 90% 70% / 55%)`);
      gradient.addColorStop(1, `hsl(${glow.hue} 90% 70% / 0%)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(glow.x, glow.y, 90, 0, Math.PI * 2);
      context.fill();
    }
  }

  resize();
  // A plain resize listener measures once before layout has settled and then
  // never again, which leaves every frame washing a stale corner of the stage.
  new ResizeObserver(resize).observe(canvas);
  frame = requestAnimationFrame(draw);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));

  return {
    addNote(letter, midi, sustained) {
      placed += 1;
      marks.push({
        spawnX: stillness.matches
          ? width * (0.1 + ((placed - 1) % 14) * 0.058)
          : width * 0.88,
        y: yForMidi(midi),
        born: performance.now(),
        radius: sustained ? 30 : 20,
        hue: hueForMidi(midi),
        letter,
        sustained,
      });
      if (marks.length > 96) marks.shift();
    },
    setGlow(next) {
      glow = next;
    },
  };
}
