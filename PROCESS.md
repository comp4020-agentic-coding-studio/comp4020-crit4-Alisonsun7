# Process overview

<!-- Draft: the facts and citations below are accurate for this repo, but the
     judgement calls are written in my voice as the agent. Rewrite the reasoning
     in your own before the crit — the spec asks you to account for how you
     directed, grounded and corrected the work, and that has to be yours. -->

## What I built

A typing instrument. Letters play a minor pentatonic scale, so no keypress can
be wrong; vowels are voiced low, long and round, consonants high, short and
bright. Because English alternates the two, a typed word arrives already shaped
— the rhythm comes from the language rather than from a metronome. Dragging on
the stage plays a continuous voice instead, so a phone or a trackpad is a real
way in. Nothing is a recording: every voice is oscillators and filtered noise
built at press time, and the reverb is a noise burst shaped into an impulse
response in code. The stage draws pitch up the vertical axis against time along
the horizontal, so a phrase leaves a contour you can read.

## The moments that mattered

1. **The harness came forward before any code.** The starter's `CLAUDE.md` had
   been rewritten shorter between A1 and this week, so carrying mine forward was
   a merge, not a copy: I kept the accumulated stack facts, took the template's
   new link-preview section, and restated the Astro base-path rule the starter
   had dropped — the repo is on Astro, not the starter's Vite, and that fact
   still bites. Committing it first
   ([`51e772e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/51e772e))
   means the first commit answers where the harness came from
   ([`51e772e...a6547fd`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/compare/51e772e...a6547fd)
   carries the stack swap, including the lint tooling the current starter no
   longer ships but whose rules my harness still records).

2. **The spec became tuning contracts, not page assertions.** Most of this
   week's spec is only judgeable by a person, but three lines are properties of
   the *tuning*, which is a pure function: every letter sounds (nothing is
   refused, so there is no fail state), every pitch is a degree of one scale (so
   no pairing is sour), and the range stays inside 36 semitones. I wrote them
   against a scale re-stated independently in the test, so a green result means
   the code agrees with the spec rather than with itself
   ([`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771),
   `spec/crit-4.test.ts`).

3. **Twenty-nine green tests, and the instrument still didn't make music.** The
   first tuning mapped a→z as a ramp across the alphabet, which passed every
   check and spanned five octaves, so real words leapt instead of singing. The
   fix wasn't a bug fix, it was a design change — two ladders instead of one
   ramp, vowels below consonants — and no test would have found it. The same
   went for the stage: pitch was on the horizontal axis, so the contour line
   drew flat every time. I only saw both by rendering a phrase and looking at
   it.

4. **Two dead ends that the checks were blind to.** A canvas measured with a
   `resize` listener is measured once, before layout settles, and then never
   again — every frame painted into a stale box. And a phantom rectangle in a
   screenshot turned out to be old-headless Chrome, not my code; I rewrote
   working code chasing it before switching to `--headless=new`. Both went into
   `CLAUDE.md` as facts rather than into a retry, which is the difference
   between fixing a symptom and changing what the next attempt runs against.

## Left to the crit

Latency, whether a gesture feels expressive rather than tiring, and whether
music emerges without guidance. `reference/NOTES.md` records what I studied in
two existing browser instruments and what I did differently on purpose.
