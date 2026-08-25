# Process overview

## What I built

I built a browser instrument played by typing, clicking, dragging, or touching. Letters use one minor pentatonic scale: vowels are lower and longer, consonants higher and brighter, so ordinary words become short phrases without a wrong key. Pointer input follows the same scale, while vertical movement changes timbre. All sound is synthesised in-browser from oscillators, filtered noise, and generated reverb. The canvas records both typed and pointer phrases, with pitch vertically and time horizontally.

## How I checked the brief

`spec/crit-4.test.ts` checks the parts that can be automated: every letter plays, pitches stay in one scale, punctuation is silent, spaces rest, no recorded audio ships, the first gesture can start audio, touch does not scroll, and pointer pitches use the same scale.

The rest had to be checked by playing. I kept asking two questions: can someone make a first sound without explanation, and do all inputs feel like the same instrument?

## The moments that mattered

### 1. When passing tests were not enough

The first complete build passed its tests but did not sound musical. Letters `a–z` formed one rising ramp, so valid notes still made ordinary words jump across too wide a range. I asked Claude for a musical redesign rather than a bug fix, producing two narrower ranges: vowels below and consonants above.

The visual feedback exposed the same problem. Pitch was originally horizontal, so phrases looked flat. Moving pitch vertically made the drawing reflect what I could hear.

[`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)

### 2. Making pointer play belong to the same instrument

Typing worked, but dragging initially felt like a different instrument: its timbre was harsher and its continuous pitch could fall between the keyboard notes. I brought it under the same rules by snapping it to the scale, softening the voice, and adding only a short glide.

I then corrected the visual side for the same reason. Dragging originally disappeared as a temporary glow, while typing left a persistent score. The final ribbon records pointer play in the same pitch-and-time space as typed notes.

[`529ac82`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/529ac82) · [`0f62eea`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/0f62eea)

## Still open

I have verified the current build by playing it myself, but I still need to observe whether a stranger can discover both typing and dragging without explanation.
