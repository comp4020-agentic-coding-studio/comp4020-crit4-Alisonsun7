# Crit 4 — An instrument

**What was the breakthrough that moved the work forward?**

A. The first breakthrough was deciding what the instrument should actually be. I
started from two existing browser instruments, Typatone and Patatap, and my
first instruction was simply to reproduce them. Claude did not agree to copy
them and explained that both are the authored work of other people, and that
this repository becomes public at the crit cutoff, so copying their code or
sounds would be presenting someone else's work as mine. I accepted this and
changed the request. Instead of a copy, I asked for the two sites to be studied
and written up in a `reference` folder, and for the instrument itself to be a
new design in the same family. This turned out to be a better outcome than my
original request, because writing down what the two sites do well forced me to
decide what part of my own version was actually mine.

B. The second breakthrough was learning that a passing test suite does not mean
the work is finished. At one point all 29 automated tests were green, but when I
listened to the instrument it did not sound like music. Every letter from a to z
had been mapped as a rising ramp across the alphabet, which passed every check
and still spread a normal English word across five octaves, so typing a word
produced large jumps instead of a melody. I asked Claude to think harder about
the design rather than to fix a bug, and the mapping was redesigned so that
vowels and consonants are voiced separately. Because English alternates vowels
and consonants naturally, a typed word then arrived with a shape already in it.
No test would have found this problem, and I only found it by listening.

**What did this work change about who I want to be as a software developer?**

In Crit 1 I wrote that I was uneasy about letting Claude execute and modify code
directly, and in Crit 2 I found that the quality of my prompt strongly affected
the quality of the result. This Crit changed something further. I now understand
that the checks I ask the agent to write are not the same thing as the work being
correct, and that I have to inspect the result with my own eyes and ears before I
believe it.

Two things this week made that concrete. The visual part of the instrument was
drawing pitch along the horizontal axis, so every phrase was drawn as a flat
line and there was no shape to see. All the tests still passed. Later I asked
whether two local preview URLs were serving the same files, and it turned out
that the copy I had been opening in my browser was an older build that did not
contain the most recent fix. In both cases the automated checks were green and
the thing in front of me was still wrong.

So the developer I want to be is one who treats a green check as the beginning
of verification rather than the end of it. I also want to be more careful about
authorship. Asking to copy two existing websites was not something I had thought
of as a problem, and being told why it was one is the part of this week I expect
to remember longest.
