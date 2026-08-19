# Precedent notes

Two browser instruments worth studying before building one, and what I took from
each. These are my own observations from playing them — no code, assets, sounds
or palettes from either are reproduced here or anywhere in this repo. They are
someone else's authored work; the point of reading them is to build something
different on purpose.

- **Patatap** — Jono Brandel, with sound by Lullatone. A key press fires a
  percussive voice and an animated mark at the same time.
- **Typatone** — same authors. Typing produces a melody rather than percussion,
  so writing a word becomes playing a phrase.

## What they get right

**The first sound is free.** Neither asks you to choose an instrument, pick a
key, or press play. The input a visitor already has their hands on *is* the
interface, so the gap between arriving and making a sound is one gesture. This
is the thing our brief is judged on first — "where the first sound comes from" —
and it is a design decision, not a technical one.

**Nothing you do is wrong.** Both constrain the note material so any input is
consonant. That is what makes a stranger relax: there is no wrong key to press,
so exploring costs nothing. The constraint lives in the mapping, not in a
correction after the fact.

**Sound and image are one event.** A press produces both, tightly coupled in
time. The visual isn't decoration — it confirms that *you* caused the sound,
which is what invites the second press.

## What I deliberately did differently

- **Pitch is the vertical axis, time the horizontal.** The stage draws the phrase
  as a score, so a typed word leaves a contour. My first version put pitch on
  the horizontal axis and drew every phrase as one flat line — the shape only
  reads if pitch is vertical. This makes "two players sound different" something
  the *room* can see while someone else plays, which matters because the crit is
  a pod playing in front of each other.
- **Vowels and consonants are voiced differently.** Vowels sit low, long and
  round; consonants sit above them, short and bright. English alternates the two,
  so a real word arrives already shaped — the rhythm comes from the language
  rather than from a metronome. This is the part I'd defend as mine.
- **No samples at all.** Every voice is oscillators and filtered noise built at
  press time, and even the reverb is a noise burst shaped into an impulse
  response in code. The brief says the browser *is* the instrument; shipping
  recordings would make it a player.
- **A drag voice as well as keys.** Continuous pitch on pointer drag, so a phone
  or a trackpad is a real way in and not a degraded one. With no target pitch
  there is nothing to miss, which keeps the no-wrong-notes promise on that input
  too.

## Left for the crit, not for a test

Latency, whether a gesture feels expressive rather than tiring, and whether
music actually emerges without guidance. None of these show up in a check — the
tuning contracts in `spec/crit-4.test.ts` are the most a test can hold.
