import { readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import {
  CONSONANTS,
  LETTERS,
  VOWELS,
  midiForLetter,
  phraseFor,
  pitchRange,
  voiceForLetter,
} from "../src/scripts/tuning.ts";

// Tests for crit 4's published spec ("An instrument"). The lines a machine can
// hold are here; the ones only a person can judge are named in PROCESS.md and
// answered at the crit, not faked with a check.
//
// https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/crits/04-instrument/

const DIST = resolve("dist");

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

const shipped = filesUnder(DIST);

// Stated independently of the implementation: a test that imported the scale
// would only prove the code agrees with itself.
const ROOT_MIDI = 45;
const MINOR_PENTATONIC = [0, 3, 5, 7, 10];

describe("spec: there is no way to play it wrong", () => {
  it("refuses no letter — every key a player reaches for sounds", () => {
    for (const letter of LETTERS) {
      expect(midiForLetter(letter), `"${letter}" produced no note`).not.toBeNull();
      expect(voiceForLetter(letter), `"${letter}" produced no voice`).not.toBeNull();
    }
  });

  it("puts every letter on a degree of one scale, so no pairing is sour", () => {
    for (const letter of LETTERS) {
      const midi = midiForLetter(letter) as number;
      const semitone = (((midi - ROOT_MIDI) % 12) + 12) % 12;
      expect(
        MINOR_PENTATONIC,
        `"${letter}" (midi ${midi}) sits ${semitone} semitones above the root, outside the scale`,
      ).toContain(semitone);
    }
  });

  it("treats punctuation as silence rather than as a mistake", () => {
    expect(phraseFor("!?,.;:()").filter((event) => event.kind === "note")).toHaveLength(0);
  });

  it("rests on whitespace, so a space between words is heard as phrasing", () => {
    expect(phraseFor("a b").map((event) => event.kind)).toEqual(["note", "rest", "note"]);
  });
});

describe("spec: it is expressive", () => {
  it("gives two different words two different melodies", () => {
    const pitches = (text: string) =>
      phraseFor(text)
        .filter((event) => event.kind === "note")
        .map((event) => (event as { midi: number }).midi);
    expect(pitches("alison")).not.toEqual(pitches("griffiths"));
  });

  it("stays inside a range a person can hear as a melody", () => {
    // A single a-to-z ramp spans five octaves and scatters instead of singing.
    const { lowest, highest } = pitchRange();
    expect(highest - lowest).toBeLessThanOrEqual(36);
    for (const letter of LETTERS) {
      const midi = midiForLetter(letter) as number;
      expect(midi).toBeGreaterThanOrEqual(lowest);
      expect(midi).toBeLessThanOrEqual(highest);
    }
  });

  it("voices vowels below consonants, so a typed word arrives already shaped", () => {
    const midiOf = (letters: string) => [...letters].map((l) => midiForLetter(l) as number);
    expect(Math.max(...midiOf(VOWELS))).toBeLessThan(Math.min(...midiOf(CONSONANTS)));
  });
});

describe("spec: the browser is the instrument", () => {
  it("ships no recorded audio — nothing here is played back", () => {
    const recordings = shipped.filter((path) =>
      [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".opus", ".weba"].includes(
        extname(path).toLowerCase(),
      ),
    );
    expect(recordings, "a sample in dist/ means the page is a player, not an instrument").toEqual(
      [],
    );
  });

  it("synthesises sound in the page", () => {
    const scripts = shipped
      .filter((path) => [".js", ".html"].includes(extname(path).toLowerCase()))
      .map((path) => readFileSync(path, "utf8"));
    expect(
      scripts.some((source) => source.includes("AudioContext")),
      "nothing shipped opens an audio context, so the page cannot make a sound",
    ).toBe(true);
  });
});

describe("spec: a stranger can play it uninstructed", () => {
  const home = new JSDOM(readFileSync(join(DIST, "index.html"), "utf8")).window.document;

  it("opens with an invitation to the first sound", () => {
    const invitation = home.querySelector("#overlay");
    expect(invitation, "the opening screen says nothing, so nothing prompts a first press").toBeTruthy();
    expect(invitation?.textContent?.trim()).not.toBe("");
  });

  it("offers a stage to play on", () => {
    expect(home.querySelector("canvas#stage")).toBeTruthy();
  });

  it("lets touch play it instead of scrolling the page", () => {
    // Without this the first drag on a phone pans the page and makes no sound.
    // Small stylesheets get inlined into the page, so both are shipped styles.
    const styles = shipped
      .filter((path) => [".css", ".html"].includes(extname(path).toLowerCase()))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    expect(styles.replace(/\s+/g, "")).toContain("touch-action:none");
  });
});
