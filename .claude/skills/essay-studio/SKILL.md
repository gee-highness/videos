---
name: essay-studio
description: Make documentary-style video essays (narration over cinematic AI stills with slow push and pan, crossfades, monospace captions in black boxes, an ambient bed) from a text script, with voices made in Termux. Use when the user asks for a video essay, a documentary-style video, a narrated explainer, "videos like Internet Education", a script on a topic, or to render, check or update one in projects/.
---

# Essay studio

Read `docs/ESSAYS.md` first (the look, the script shape, the file format, the commands) and `TRACKER.md` (what exists and what is next).

## Workflow
1. **Pick and research:** take the topic from `TRACKER.md` or the user. Find the real sources; write down each number with its source. Never invent or stretch a number.
2. **Plan:** fill in `projects/<id>/plan.md` from `essay/templates/plan.md` (viewer, takeaway, titles, sources, chapters, checklist).
3. **Script:** write `projects/<id>/script.md` in the shape from `docs/ESSAYS.md`: the promise, the turn, the authority, the number, the open loop, then the body, the counterpoint, the turn and a callback. Lines must sound spoken: short sentences, plain words, contractions, no advert language. About 145 words a minute.
3b. **Check and plan:** `node essay/essay.cjs check <id>` must report no pacing problems; then `node essay/essay.cjs plan <id>`; send the user `termux.sh` (or paste its contents) and `prompts.md`.
4. **Voices:** unzip the user's zip into a fresh folder, check no file is 0 bytes (give a retry block for just those), copy into `projects/<id>/voice/`.
5. **Images:** the user's images go into `projects/<id>/img/NN.ext`. Run `check`.
6. **Render:** `render <id> --vertical`. Look at the contact sheet and frames from several shots; measure loudness (`ffmpeg -af volumedetect`). You cannot hear audio; say so and ask the user to listen.
7. **Record:** update `TRACKER.md`; commit and push.

## Rules
- Truth first: sources in the front matter, numbers said the way the source says them.
- No real people's likenesses, no logos, no copyrighted characters in image prompts.
- Captions always on; the hook lands in the first 10 seconds.
