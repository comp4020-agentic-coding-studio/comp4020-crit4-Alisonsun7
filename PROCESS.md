# Process overview

## What I built

**An instrument** - a browser instrument played by typing, clicking, dragging,
or touching the stage. Each letter plays a note from one minor pentatonic scale,
so there is no key that can sound wrong. Vowels are voiced low, long, and round;
consonants are higher, shorter, and brighter. Because English naturally moves
between vowels and consonants, typing a real word produces a phrase with rhythm
and contour before I add any fixed beat.

Dragging is another way into the same instrument rather than a separate effect.
The horizontal position chooses a pitch, snapped to the same scale as the
letters, and the vertical position changes brightness. The note glides quickly
between scale degrees, so it still feels like a slide without landing out of
tune. This matters because the brief asks for mouse, keyboard, or touch to be
playable with no failure state, not just for one input to be polished.

All sound is generated live in the page. There are no recorded audio files in
the shipped build: the voices are oscillators and filtered noise, and the room
sound is a generated impulse response. The canvas draws the typed notes as a
score, with pitch on the vertical axis and time moving across the screen, so a
word leaves a visible line as well as a sound. Dragging draws on that same
score: a ribbon at the height of the pitch it is playing, so holding a note
draws a level band and sliding draws a step, and the ribbon stays on the stage
after the pointer is released instead of disappearing with the gesture. The
opening screen says "touch, click, drag, or type" and disappears after the first
gesture, which makes the first sound the first thing the page invites.

## How I checked the brief

The course brief is not only a technical checklist. It asks whether a stranger
can make sound before I explain anything, whether the gesture feels expressive,
and whether two players produce different results. I treated the automated
checks as contracts for the parts a machine can hold: no audio samples in
`dist/`, a live `AudioContext`, every letter mapped to a scale degree, punctuation
handled as silence rather than error, whitespace as a rest, and drag pitches
snapped to the same scale.

The other parts had to be checked by playing. That is why the process includes
listening to the finished build, comparing the typed voice with the drag voice,
and making sure I was judging the latest built version at
`http://localhost:4412/comp4020-crit4-Alisonsun7/` rather than an older preview.
The main open question is still the one the crit itself is designed to answer:
what happens when someone else plays it cold, before I say anything.

## The moments that mattered

### 1. Carrying the harness forward without carrying it blindly

The `CLAUDE.md` for this Crit came from my Assignment 1 repository rather than
from the starter template. This was not a straight copy. The template's own
`CLAUDE.md` had changed since Assignment 1, so I kept the stack knowledge that
was still useful, brought in the newer template guidance, and restated the Astro
base path rule. That rule matters because the site deploys under a project path
on GitHub Pages: if the base path is wrong, the site can look correct locally
while the live version cannot load its files.

Keeping the harness and stack swap as separate early commits also made the
process easier to account for. The repository shows when the working context was
set up and when the actual instrument work began.

Cited: [`51e772e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/51e772e)
- the harness carried forward, and
[`a6547fd`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/a6547fd)
- replacing the starter build tooling with Astro.

### 2. Turning Typatone and Patatap into references, not material

My original request was to reproduce Typatone and Patatap. Claude pushed back
and explained that copying their code, sounds, or visual identity into a public
course repository would make someone else's authored work look like mine. I
changed the request instead of trying to get around that. The two sites became
precedents to study, and I asked for written notes on what made them work.

That changed the project in a good way. The reference notes forced me to say
what the new instrument would own: words as melodies rather than percussion,
vowels and consonants as different voices, pitch drawn vertically so a phrase
has a visible contour, and no samples at all. The agent still helped build it,
but the boundary between influence and copying became explicit.

Cited: [`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)
- the first full instrument commit, including `reference/NOTES.md`, the tuning,
the live audio graph, and the stage drawing.

### 3. Finding the musical problem after the tests passed

At one point the automated tests were green and the instrument still did not
sound like music. The first tuning mapped `a` to `z` as one rising ramp across
the alphabet. That passed the checks I had asked for, including the check that
every pitch belonged to the same scale, but ordinary words jumped across too
many octaves. It was technically consonant and musically weak.

I corrected the agent by asking for a design rethink instead of a bug fix. The
mapping was rebuilt as two narrower ladders: vowels below, consonants above.
That made a typed word behave more like a phrase, because the structure comes
from the word itself. The same issue appeared visually. Pitch was originally on
the horizontal axis, so every phrase looked flat. Moving pitch to the vertical
axis made the visual line match the thing I was trying to hear.

Cited: [`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)
- the two-range tuning, score-style drawing, and `spec/crit-4.test.ts`, which
holds the parts of the spec that can be checked mechanically.

### 4. Writing failures into the harness instead of only fixing them

Several failures were useful enough to record in `CLAUDE.md`. Creating an
`AudioContext` before the first user gesture leaves it suspended, so the first
press can silently unlock audio instead of making the first sound. A browser
screenshot showed a grey block that looked like a rendering bug, but the cause
was an old headless Chrome flag rather than the canvas code. A plain resize
listener measured the canvas before layout had settled, leaving the stage with
stale dimensions.

These were not just local bugs. They were ways an agent could confidently fix
the wrong thing. Writing them into the harness meant the next pass had better
grounding: first sound must be real, screenshots need browser-context checks,
and canvas sizing needs `ResizeObserver`.

### 5. Fixing the drag voice because I played the build

The most important correction came after the build looked finished. Typing
sounded good to me, but dragging sounded bad. The tests could not tell me that,
because the drag technically responded and the typed notes were in scale.

The problem was that drag had been designed like a different instrument. It used
a sawtooth wave, a resonant filter, and continuous pitch, while the keys used
soft sine/triangle voices and fixed scale degrees. A continuous pitch can sound
acceptable alone, but next to a typed note it lands between the notes of the
scale. That broke the instrument's central promise that there is no wrong note.

The fix was to bring drag under the same rules as the keys: same scale, softer
waveform family, lower level, less filter resonance, and a short glide to keep
the sliding feel. After that, I added a test over 201 drag positions so the
"no wrong notes" rule applies to pointer play as well as typing.

Cited: [`529ac82`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/529ac82)
- the drag voice rebuilt, the scale snapping added to tuning, and the test that
holds the new rule.

### 6. Closing the gap my own written account had admitted

Writing the process overview made me name what was still weak, and once it was
written down it was hard to leave alone. I had said the site was strongest on
keyboard play, because typing left a readable phrase on the score while dragging
left only a glow that died with the gesture. So the next thing I asked for was
the thing my own document had identified: a persistent ribbon for drag and
touch.

Two decisions in that change were mine rather than the agent's. The first was
which coordinate system the ribbon belongs to. Drag pitch comes from the
pointer's horizontal position, but the score's horizontal axis is time, so
drawing at the pointer would have put the ribbon in a different space from every
note beside it. It had to be drawn in score space instead: vertical position for
the snapped pitch, horizontal position for time. The second was that the ribbon
has to be sampled by the drawing loop rather than by pointer movement, because
holding still is also playing. A movement-driven trail stops recording at
exactly the moment a note is being held.

Cited: [`0f62eea`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/0f62eea)
- the drag ribbon added to the stage, drawn under the note marks so typed
letters stay readable.

### 7. Updating the written account after the design changed

The documentation was updated after the drag fix rather than left describing the
older instrument, and updated again after the ribbon. This matters because the
process overview should account for the current prototype, not a previous
version that happened to pass earlier checks. The final process and reflection
now treat listening and looking as part of the method, not as a final polish
step.

Cited: [`61936a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/61936a1)
- the process and reflection updated after the drag correction.

## What is still open

The open item now is human testing. I have played the current build myself, and
that is what found both the drag problem and the missing visual record, but I
have not yet watched another person arrive cold and discover it without help.
The crit format makes that visible, so I would treat the first thirty seconds of
someone else's play as the final test rather than something I can fake with
another automated check.

The specific thing I would watch for is whether a stranger discovers dragging at
all. Typing is the obvious invitation, and now that pointer play leaves the same
kind of visible record as typing, the question is whether anyone gets far enough
to see it. That is a discoverability problem rather than an audio or a drawing
problem, and it is not one I can answer by playing my own build.
