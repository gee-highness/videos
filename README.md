# Videos

Everything for making videos: the list of videos (`TRACKER.md`), and two production lines that turn a text script into a finished MP4. Voices come from free Microsoft Edge voices, made on a phone in Termux; everything else runs from the command line (Node and ffmpeg; the cartoon line also uses Playwright's Chromium).

| Line | Looks like | Folder | Guide |
|---|---|---|---|
| **Video essays** | Documentary narration over cinematic AI stills, slow push and pan, crossfades, monospace captions in black boxes, a quiet ambient bed (the "AI take over backfired" look) | `essay/`, `projects/<id>/` | `docs/ESSAYS.md` |
| **Cartoon shorts** | Hand-drawn ink cartoons drawn in code, several voices, sound effects and a tune, 15 to 30 s | `toons/` | `.claude/skills/cartoon-studio/` |

## One-time setup in Termux (phone)
```
pkg update -y && pkg install -y python zip
pip install edge-tts
termux-setup-storage
```

## Video essay in five steps
1. Write `projects/<id>/script.md` (format in `docs/ESSAYS.md`).
2. `node essay/essay.cjs plan <id>` → `prompts.md` (an image prompt per shot) and `termux.sh` (the voice lines).
3. Paste `termux.sh` into Termux, send back `Downloads/<id>-voice.zip` → unzip into `projects/<id>/voice/`. Make the images from `prompts.md` → `projects/<id>/img/01.png`, `02.png`...
4. `node essay/essay.cjs check <id>` (what is still missing), then `node essay/essay.cjs render <id> --vertical`.
5. Look at `projects/<id>/out/<id>-sheet.jpg`, watch the video, update `TRACKER.md`.

Missing images render as labelled placeholders and missing voices render silent (timed from the text), so you can draft before anything is ready.

## Cartoon short
`node toons/voice.cjs <id>` prints the Termux block; voices go in `toons/voice/<id>/`; `node toons/engine.cjs <id>` renders to `toons/out/`.
