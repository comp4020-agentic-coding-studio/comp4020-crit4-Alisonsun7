# Crit 4 - An instrument

**What was the breakthrough that moved the work forward?**

A. The first breakthrough was deciding what the instrument should actually be. I
started from Typatone and Patatap, and my first request was too close to
reproducing them. Claude pushed back because both sites are authored work, and
because this repository becomes public. That made me change the task from
copying to studying. I asked for reference notes instead, with no code, sounds,
assets, or colours taken from either site.

That was a better direction than my original one. It forced me to name what was
mine: typing a word as a melody, vowels and consonants as different voices,
pitch as a vertical line on the stage, and the rule that all sound should be
synthesised in the browser rather than played back from recordings. I think this
was the first real design decision, because it changed the instrument from a
version of someone else's idea into something I could defend.

B. The second breakthrough was realising that green tests were not the same as a
good instrument. At one point all the checks passed, but when I listened to it,
typing did not sound musical. The letters were mapped as one rising alphabetic
ramp, which meant the tests could prove that the notes were in scale while a
normal word still jumped across too many octaves. I asked Claude to think about
the musical design rather than search for a code bug. The mapping became two
ranges instead: vowels low and sustained, consonants higher and shorter. After
that, the shape of a word mattered.

The visual side taught me the same lesson. Pitch was originally drawn across the
horizontal axis, so every phrase looked like a flat line. Only by looking at the
rendered page did I notice that the visual score did not explain the sound.
Moving pitch to the vertical axis made the phrase visible to someone watching
the player, which matters because the crit begins with other people playing the
instrument before I explain it.

C. The third breakthrough came from playing the finished build myself. Typing
sounded good, but dragging sounded wrong. I could hear it before I could explain
it. The reason was that dragging had been designed like a separate instrument:
it used a harsher waveform, a resonant filter, and continuous pitch, while the
keys used softer waveforms and landed on a pentatonic scale. Continuous pitch
sounds acceptable alone, but next to a typed note it can sit between the notes
and feel out of tune.

The fix was not just to make dragging quieter. I put dragging under the same
rules as typing: same scale, softer tone, lower level, less resonance, and a
short glide so it still feels like sliding. Then I added a test for the rule I
had discovered by listening. That is the strongest example from this Crit of my
role in the process: the agent could build and test the audio graph, but it
could not be the ear that decided whether the instrument felt right.

**What did this work change about who I want to be as a software developer?**

In Crit 1 I was still getting comfortable with letting Claude inspect and modify
my code. In Crit 2 I learned that the quality of my prompt affected the quality
of the result. Crit 4 changed the next layer for me: I now understand that I
need to decide what kind of evidence is appropriate for the thing I am building.

For this project, tests were useful but limited. They could check that every
letter maps to a note, that notes stay inside one scale, that punctuation is not
treated as a mistake, that the shipped build contains no audio samples, and that
dragging snaps to the scale. They could not check whether a gesture feels good,
whether latency feels immediate, whether a stranger knows what to do from the
opening screen, or whether the sound is actually musical. The course brief makes
those human judgement parts important, so treating tests as the whole truth
would have been the wrong kind of confidence.

This also changed how I want to direct AI coding tools. I do not want to use an
agent only as something that produces code quickly. I want to use it as a
partner that can hold contracts, run checks, and explain alternatives, while I
stay responsible for authorship, taste, and verification. The moments that
mattered most this week were not the moments where Claude produced the largest
amount of code. They were the moments where I corrected the direction: refusing
to copy reference sites, asking for the tuning to be redesigned instead of
debugged, making sure I was judging the latest build, and trusting my ear when
the drag felt wrong.

So the developer I want to become is one who treats a green check as the start
of verification, not the end. I still want strong tests, but I also want to be
the person who knows when the real harness is a browser, a speaker, another
player, and my own attention.
