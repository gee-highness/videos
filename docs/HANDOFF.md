# Handoff: where the videos work stands (read this when the user says "continue videos")

Updated 25 Nov 2026. Read in this order: this file, `TRACKER.md`, `docs/LESSONS.md`, `docs/ESSAYS.md` (all directives), then the project files named below. Do the first unchecked item in "Next", one at a time, and tick it here when done. Commit and push to `main` after every step (the stop hook asks for it).

## State of es01 (The Real Housewives of London feud, ~9:50, 16:9 + 9:16)
- Research done: `projects/es01/research.md` (FACT / CLAIM / UNVERIFIED, sources, corrections).
- Script final: `projects/es01/script.md` (85 shots, 10 chapters, cards, quotes, music cues, sfx, clips with fallbacks, 8 `[host]` appearances). Plan: `plan.md`. Posting kit: `post.md`.
- Voices in: `projects/es01/voice/` (Ava, 67 lines). Never insert a narrated shot (it renumbers the voices); `[when]` shots are safe.
- Pictures in: `projects/es01/img/` (60 Creative Commons photos; credits in `image-credits.md`).
- Press screenshots: `projects/es01/media/` is NOT committed (public repo). If it is empty, run `NODE_PATH=/home/user/gss-lms/node_modules node essay/capture.cjs es01` (uses `capture.json`).
- Still missing (optional; typed fallbacks render instead): 3 Hayu clips (`media-download.sh`, `media-notes.md`) and 4 post screenshots (`post-sza.png`, `post-questlove.png`, `post-vybz.png`, `post-huger.png`).
- Host: confidential (private v_me repo, `hosts/kuina/`; copy locally to `hosts/kuina/`, git-ignored). A still photo in a framed window or full frame.
- Last full render was a draft with placeholder pictures; the render with photos + host was stopped before finishing.

## Notes (Nov 25 2026)
- es01 final: animated host clips are rendered by `node essay/host-vme.cjs es01` (v_me, slow: about 2-3 s per frame), then `node essay/essay.cjs render es01 --vertical`. `projects/*/host/` is git-ignored (it embeds the private look). Stand-ins and stickers: `projects/es01/media-notes.md`.

## Next
- [ ] **Animated host.** Details are confidential: see the private v_me repo (`hosts/kuina/`).
- [ ] **Host images.** Character sheet and thumbnail pose: kept in the private repo, not here.
- [ ] **Final render of es01:** `node essay/essay.cjs render es01 --vertical` (about 25 minutes; run it in the background and wait with Monitor). Check the contact sheets of both versions, the loudness (`ffmpeg -af volumedetect`), and frames at every host appearance and every screenshot.
- [ ] **Send the user** `out/es01.mp4`, `out/es01-9x16.mp4`, `out/es01-chapters.txt` and `post.md` (SendUserFile), and update `TRACKER.md` (status `checked`).
- [ ] When the user sends clips or post screenshots: unzip into a fresh folder, copy into `projects/es01/media/` with the names in `media.md`, set the clip times in `script.md`, re-render.
- [ ] **v_me as the studio** (plan saved in `docs/STUDIO_PLAN.md`, not started): format spec + es01 conversion first.
- [x] **es03 (bride and DJ song reel):** finished and checked 26 Nov 2026 (`projects/es03/out/es03-9x16.mp4`, 1:44, -16.2 LUFS). Left: the user listens, confirms the "people are split" line, posts with `post.md`.
- [ ] **es02 (Westville dog attack reel + two cartoon skits on the host's TV):** everything is built except the voices. When `Downloads/es02-all-voices.zip` arrives: unzip into a fresh folder; copy `es02/*.mp3` to `projects/es02/voice/`, `nb01/*.mp3` to `toons/voice/nb01/`, `nb02/*.mp3` to `toons/voice/nb02/`; render the skits (`node toons/engine.cjs nb01`, `nb02`: about 2 min each) and copy `toons/out/nb01.mp4`, `nb02.mp4` to `projects/es02/media/`; set the `[clip]` ranges in `projects/es02/script.md` to the real durations; `node essay/host-vme.cjs es02 --scale 0.5 --v-only --still` to check framing, then without `--still` (about 40 minutes, background, never pkill); `node essay/essay.cjs render es02 --vertical-only`; check frames and loudness; send. Needs the v_me clone at /home/user/v_me (see LESSONS 2026-11-26) and `hosts/kuina/` copied locally.
- [ ] Next video: pick from the ideas in `TRACKER.md` (or the user's topic), follow `.claude/skills/research-desk` and `.claude/skills/essay-studio`.

## How the user works
- Replies as Jarvis, short. Calls the videos repo "videos".
- Makes voices in Termux: give only the `say` block from `projects/<id>/termux.sh` (no setup lines). Termux failures with `speech.platform.bing.com` timeouts are the phone's network (VPN); re-running the block resumes.
- Wants 16:9 and 9:16 every time, engaging, well paced, funny, with real media where possible, and every fact sourced.
