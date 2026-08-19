// The tuning is a pure function of the text, deliberately separate from the
// audio graph so the contracts that make this playable — one scale, a bounded
// range, no input that can be refused — are testable without a browser.

export const VOWELS = "aeiouy";
export const CONSONANTS = "bcdfghjklmnpqrstvwxz";
export const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export type Voice = "vowel" | "consonant";

// A minor pentatonic. Every letter lands on a degree of this one scale, which
// is what makes any typing consonant: "no way to play it wrong" is a property
// of the tuning, not something a check can enforce after the fact.
//
// Two ladders, not one ramp. A single a-to-z ramp spans five octaves, so real
// words leap instead of singing. Vowels sit low and carry the line; consonants
// sit above them and articulate it. English alternates the two, so a typed word
// arrives already shaped — that is where the melody comes from.
const VOWEL_LADDER = [45, 48, 50, 52, 55, 57]; // A2 C3 D3 E3 G3 A3
const CONSONANT_LADDER = [60, 62, 64, 67, 69, 72, 74, 76]; // C4 D4 E4 G4 A4 C5 D5 E5

export function voiceForLetter(letter: string): Voice | null {
  const lower = letter.toLowerCase();
  if (VOWELS.includes(lower)) return "vowel";
  if (CONSONANTS.includes(lower)) return "consonant";
  return null;
}

export function midiForLetter(letter: string): number | null {
  const lower = letter.toLowerCase();
  const vowelIndex = VOWELS.indexOf(lower);
  if (vowelIndex !== -1) return VOWEL_LADDER[vowelIndex];

  const consonantIndex = CONSONANTS.indexOf(lower);
  if (consonantIndex === -1) return null;
  // Twenty consonants share eight steps, in pairs. Collisions are the point:
  // a narrow range is what keeps a word a contour rather than a scatter.
  const step = Math.floor((consonantIndex * CONSONANT_LADDER.length) / CONSONANTS.length);
  return CONSONANT_LADDER[step];
}

export function pitchRange(): { lowest: number; highest: number } {
  return {
    lowest: VOWEL_LADDER[0],
    highest: CONSONANT_LADDER[CONSONANT_LADDER.length - 1],
  };
}

export function frequencyForMidi(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export type NoteEvent = { kind: "note"; letter: string; midi: number; voice: Voice };
export type RestEvent = { kind: "rest" };
export type PlayEvent = NoteEvent | RestEvent;

export function eventForKey(key: string): PlayEvent | null {
  if (/^\s$/.test(key)) return { kind: "rest" };
  const midi = midiForLetter(key);
  const voice = voiceForLetter(key);
  if (midi === null || voice === null) return null;
  return { kind: "note", letter: key.toLowerCase(), midi, voice };
}

// Whitespace rests, letters sound, anything else passes silently. Nothing a
// player can type is treated as a mistake.
export function phraseFor(text: string): PlayEvent[] {
  const events: PlayEvent[] = [];
  for (const character of text) {
    const event = eventForKey(character);
    if (event) events.push(event);
  }
  return events;
}
