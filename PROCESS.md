# Process overview

## What I built

**An instrument** — a browser instrument that is played by typing. Each letter
plays a note from a single minor pentatonic scale, so there is no key that can
sound wrong. Vowels are voiced low, long and round, and consonants are voiced
higher, shorter and brighter. Because English alternates vowels and consonants,
typing a real word produces a phrase that already has a shape, and the rhythm
comes from the word itself rather than from a fixed beat. Dragging on the screen
plays a continuous sliding note instead, so a phone or a trackpad is also a way
to play it. None of the sound is recorded. Every note is built from oscillators
and filtered noise at the moment the key is pressed, and even the reverb is
generated in code. The background draws each note as a mark, with pitch as the
vertical position and time moving from right to left, so a typed word leaves a
visible line.

## The moments that mattered

### 1. Carrying the harness forward

The `CLAUDE.md` for this Crit came from my Assignment 1 repository rather than
from the starter template. This was not a straight copy, because the template's
own `CLAUDE.md` had been rewritten and made shorter since Assignment 1. I kept
the accumulated notes about the stack that I had built up in earlier weeks, took
the template's new section about the link preview card, and restated the Astro
base path rule that the current template no longer mentions. That rule matters
because the site is deployed under a project path on GitHub Pages, and if the
base path is wrong the site looks correct locally while every file fails to load
on the live URL. Committing the harness on its own and before any prototype code
means the first commit in the repository shows where it came from.

Cited: [`51e772e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/51e772e)
— the harness carried forward, and
[`a6547fd`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/a6547fd)
— replacing the starter's build tooling with Astro, kept from Assignment 1.

### 2. Deciding not to copy the two websites I started from

My original instruction was to reproduce Typatone and Patatap. Claude declined
and explained that both are the authored work of other people and that this
repository becomes public at the cutoff, so shipping their code, sounds or
colours would be presenting someone else's work as my own. I changed the request
instead of repeating it. I asked for the two sites to be studied and written up
in a `reference` folder, with no code or assets taken from either, and for the
instrument to be a new design that sits in the same family. Writing
`reference/NOTES.md` was more useful than a copy would have been, because it
required me to name the three things that are actually mine: pitch drawn on the
vertical axis so a phrase has a readable shape, vowels and consonants voiced
differently, and no recorded sound anywhere in the project.

### 3. Realising that 29 passing tests did not mean it made music

At one point every automated check was green and the instrument still did not
sound like music. The first version mapped the letters a to z as one rising ramp
across the alphabet. This satisfied every test I had asked for, including the
test that every pitch belongs to one scale, but it spread an ordinary English
word across five octaves, so typing a word produced jumps rather than a melody.
I asked Claude to think harder about the design rather than to look for a bug,
and the mapping was rebuilt as two separate ranges, with vowels below and
consonants above. This was a design change and not a bug fix, and no test I
could have written would have caught it.

The same thing happened with the visual side. Pitch was originally drawn along
the horizontal axis, which meant every phrase was drawn as a flat line with no
shape to read. I only found this by looking at the rendered page, and the fix
was to make pitch vertical and let time move sideways.

Cited: [`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)
— the instrument, the two-range tuning, the score drawing, and
`spec/crit-4.test.ts`, which holds the part of the published spec that a test can
actually check.

### 4. Writing the failures into the harness instead of just fixing them

Three problems this week were worth recording rather than only repairing, so
they went into `CLAUDE.md` as facts. An `AudioContext` created before the user's
first click is created in a suspended state, which means the first key press only
unlocks the audio and makes no sound, and for this brief that first sound is the
whole point. A screenshot showed a grey rectangle over the page that looked
exactly like a rendering bug, and Claude rewrote working code trying to fix it
before we found that the cause was an old Chrome headless flag and not our code
at all. A canvas measured with a plain resize listener is measured once before
the layout has settled and then never again, so the drawing was using stale
dimensions. Writing these down changes what the next attempt starts from,
instead of leaving the same mistake available to be made again.

## What I know is still open

The parts of the spec that no test can hold are latency, whether playing it
feels expressive rather than tiring, and whether music emerges for someone with
no instructions. Those are judged by playing it.


/comp4020:ship



