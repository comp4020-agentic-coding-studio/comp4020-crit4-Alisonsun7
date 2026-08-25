# Process overview

## What I built

I built a browser instrument played by typing, clicking, dragging, or touching. Letters use one minor pentatonic scale: vowels are lower and longer, consonants higher and brighter, so ordinary words become short phrases without a wrong key. Pointer input follows the same scale, while vertical movement changes timbre. All sound is synthesised in-browser from oscillators, filtered noise, and generated reverb. The canvas records both typed and pointer phrases, with pitch vertically and time horizontally.

## How I checked the brief

I split verification into what tests could prove and what had to be experienced. `spec/crit-4.test.ts` checks mappings, scale membership, rests, silence for punctuation, absence of recorded audio, touch behaviour, and pointer pitches. I then played the deployed interaction to judge the parts the tests could not: whether the first gesture makes sense, whether words sound musical, and whether keyboard and pointer play feel like one instrument.

## The moments that mattered

### 1. Grounding the build before generating it

I carried forward the useful parts of my earlier `CLAUDE.md` rather than starting from a blank harness, including the Astro base-path rule needed for GitHub Pages. I also changed my original request to reproduce Typatone and Patatap after Claude raised the authorship problem. Instead, I used them as references and wrote down the principles I wanted to keep without taking their code, sounds, or visual identity. This gave the agent clearer constraints before the instrument was built.

[`51e772e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/51e772e) · [`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)

### 2. Rejecting a build that passed its tests

The first complete version was mechanically correct but did not sound musical. Letters `a–z` formed one wide rising ramp, so every pitch was valid while ordinary words jumped across too much range. I asked Claude to redesign the musical mapping rather than search for a bug. Splitting vowels and consonants into two narrower ranges made words sound more coherent when I played them.

The visual result exposed the same limit of automated checking: pitch was horizontal, so phrases looked flat. Moving pitch to the vertical axis made the score reflect the contour I could hear.

[`7775771`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/7775771)

### 3. Making pointer play obey the same musical rules

Once typing worked, dragging still felt like a separate instrument. Its voice was harsher and continuous pitch could fall between the notes available to the keyboard, undermining the idea that there is no wrong input. I corrected the interaction rather than treating pointer play as an extra effect: drag now snaps to the same scale, uses a softer voice, and keeps only a short glide.

I verified it by playing both input modes back-to-back, while the spec test samples pointer positions to check that the pitch never leaves the scale. This gave human judgement and automated checking different jobs: listening judged whether the interaction felt coherent; the test guarded the rule that every generated pitch remained valid.

[`529ac82`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/529ac82)

### 4. Giving pointer play the same visual consequence

The sound was now coherent, but playing revealed another mismatch: typed notes remained as a visible score while drag gestures disappeared as a temporary glow. The process write-up made this inconsistency obvious. I changed the visual model so pointer play leaves a persistent ribbon in the same score space as typed notes.

The ribbon is sampled by the drawing loop rather than only on pointer movement, because holding a note still counts as playing. This made typing and dragging feel like different gestures inside one instrument rather than separate features, and gave both the same lasting visual consequence.

[`0f62eea`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-Alisonsun7/commit/0f62eea)
