# Crit 4 - An instrument

**What was the breakthrough that moved the work forward?**

The breakthrough was realising that this project could only be judged by playing it, not by checking whether the implementation satisfied the spec.

The first complete version passed its tests, but it still did not sound musical. Every note belonged to the same scale, yet mapping `a–z` as one wide rising sequence made ordinary words jump unpredictably. I asked Claude to rethink the musical design rather than debug the code. Vowels became lower and sustained, while consonants became higher and shorter.

The same judgement was needed again for pointer play. Dragging technically worked, but its harsher voice and continuous pitch made it feel like a different instrument. Snapping it to the same scale fixed the sound, and later I noticed the same inconsistency visually: typing left a persistent score while dragging disappeared. Adding the ribbon made both interactions leave the same kind of musical trace.

The breakthrough was therefore not one feature. It was learning to keep playing the result until the parts that were technically correct also felt coherent.

**What did this work change about who I want to be as a software developer?**

This Crit changed how I think about evidence. Automated tests were valuable because they could prove things such as every letter producing a valid note, no recorded samples shipping, and pointer pitches staying inside the scale. But none of them could tell me whether a word sounded musical or whether two interactions felt like the same instrument.

I want to use AI for implementation and mechanical verification without outsourcing judgement to it. A green test suite should tell me what has been checked, not that the work is finished. I want to remain responsible for authorship, taste, and the final decision to accept or reject what the agent produces.

For this project, the real harness was not only the test suite. It was also the browser, the speaker, the screen, and another person encountering the instrument without explanation.
