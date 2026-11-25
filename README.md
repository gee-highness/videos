# Videos

Everything to do with video, for every project: documentary video essays, voiced cartoon shorts, avatar performances, the orchestra that scores them, the channel host, and the plans and campaign documents behind them. One repo, sorted by what it is and by brand.

- **Where is X?** See [`INDEX.md`](INDEX.md) (one table of every folder).
- **What is the state of every video?** [`TRACKER.md`](TRACKER.md).
- **What do I do next?** [`docs/HANDOFF.md`](docs/HANDOFF.md) ("continue videos" starts there).
- **What went wrong before and how was it fixed?** [`docs/LESSONS.md`](docs/LESSONS.md).
- **House rules for the assistant:** [`CLAUDE.md`](CLAUDE.md).

## Contents
1. [The five production lines](#the-five-production-lines)
2. [Standing rules](#standing-rules)
3. [Setup](#setup)
4. [Voices (Termux)](#voices-termux)
5. [Video essays](#video-essays)
6. [Cartoon shorts](#cartoon-shorts)
7. [v_me performances](#v_me-performances)
8. [The orchestra (music)](#the-orchestra-music)
9. [The host](#the-host)
10. [Brands](#brands)
11. [Working method](#working-method)
12. [Troubleshooting](#troubleshooting)
13. [Credits and licences](#credits-and-licences)

## The five production lines

| Line | Output | Where | Guide |
|---|---|---|---|
| **Video essays** | 10-minute documentary narration over stills, slow push and pan, crossfades, captions in black boxes, a scored bed; 16:9 and 9:16 | `essay/`, `projects/<id>/` | [`docs/ESSAYS.md`](docs/ESSAYS.md), skill `essay-studio` |
| **Cartoon shorts** | 15 to 40 s hand-drawn ink cartoons drawn in code, several voices, sound effects, orchestral tune; 1080x1920 | `toons/` | [`docs/toons/README.md`](docs/toons/README.md), skill `cartoon-studio` |
| **v_me performances** | A 3D avatar acts a `.vme.json` script (dialogue, gestures, walking, camera) in the default house, rendered to MP4 | `performances/v_me/` (engine in repo `gee-highness/v_me`) | [`docs/v_me/PERFORMER_MODE.md`](docs/v_me/PERFORMER_MODE.md) |
| **Orchestra** | A scored soundtrack from real recorded instruments, used by essays and cartoons | `orchestra/` | [Orchestra](#the-orchestra-music) |
| **Campaign material** | Ad plans, captions, posting rules, marketing video scripts | `brands/<brand>/` | each brand's `CAMPAIGN.md` / plan |

Research for anything about real people or events goes through the skill `research-desk` first (facts labelled FACT / CLAIM / UNVERIFIED, every figure sourced).

## Standing rules
These come from the owner and apply to every video.
1. **Music is the best it can be.** Every video is scored by the orchestra, shaped per section (intro, build, duck under the voice, outro), loudness-checked. Never a flat loop.
2. **Every video is made in the v_me default house** (`scene: apartment-default`, `background: apartment`).
3. **The host** is confidential (see [The host](#the-host)); glam but covered, never revealing.
4. **Voices are made by the owner in Termux** (Microsoft Edge voices). Never fake a voice, never claim to have listened to audio. Checks are by measurement (loudness, spectrograms) and by frames.
5. **Always 16:9 and 9:16** for essays; cartoons are 9:16. Mobile first.
6. **Pace for a first-time viewer.** If a short feels fast, slow it: lower voice tempo, longer pauses, hold captions (gs01 went from 25 s to 37 s this way).
7. **Facts are sourced; no invented testimonials, numbers or results.** Demo screens say "demo data". Offer wording comes from the brand's posting plan, word for word.
8. **Replies are short and in Jarvis's voice.** Finished files are sent as files (renders are not committed).
9. **Commit and push after every stage.** Keep `TRACKER.md` and `docs/HANDOFF.md` current before stopping.

## Setup

**On the machine that renders** (a cloud session or a computer):
- Node 20+ (22 used), `ffmpeg` and `ffprobe` on the PATH.
- Playwright's Chromium for cartoons and captures (`require('playwright')`; if the project's Playwright wants another build, set `CHROMIUM_PATH`).
- `npm install` is only needed for the cartoon line (`playwright`); the essay and orchestra code use Node and ffmpeg only.
- Python 3 with Pillow and NumPy only for painting avatar textures (kept in the private v_me repo).

**On the phone** (voices), once:
```
pkg update -y && pkg install -y python zip
pip install edge-tts
termux-setup-storage
```

## Footage and media
Every way to get pictures, screenshots and clips (what works, what is blocked, how to pace Wikimedia Commons, the owner's-phone route) is in [`docs/MEDIA_SOURCES.md`](docs/MEDIA_SOURCES.md). If the exact media cannot be had, use an honest substitute and add a `[sticker ...]` line under that shot: the engine shows a tilted yellow **SUBSTITUTE** label for the whole shot. Never fake a post or a clip.

## Voices (Termux)
The cloud cannot reach the Edge voices, so the owner makes them on a phone.
- Narrator: `en-US-AvaMultilingualNeural` (British alternative `en-GB-SoniaNeural`). Male voice: `en-US-AndrewMultilingualNeural` (it sometimes returns empty files; the scripts retry). Cartoon episodes name their own voices in `EP.voices`.
- The assistant prints only the `say` block (no setup lines). The owner pastes it into Termux and sends back the zip from `Downloads/`.
- Timeouts to `speech.platform.bing.com` are the phone's network (VPN); run the block again, it resumes.
- Files land in `projects/<id>/voice/01.mp3 ...` (essays) or `toons/voice/<id>/01.mp3 ...` (cartoons).

## Video essays
```
node essay/essay.cjs plan <id>              # prompts.md (image prompt per shot) + termux.sh (voice lines)
node essay/essay.cjs media <id>             # media.md + media-download.sh (clips and screenshots needed)
node essay/capture.cjs <id>                 # press-page screenshots listed in capture.json
node essay/essay.cjs check <id>             # missing files, length, chapters, pacing report
node essay/essay.cjs render <id> --vertical # out/<id>.mp4 (16:9) and out/<id>-9x16.mp4
node essay/essay.cjs render <id> --to 12    # only the first 12 shots, for a quick look
```
1. Research (if it is about real people or events): skill `research-desk` writes `projects/<id>/research.md`.
2. Write `projects/<id>/script.md` (format, directives and pacing rules in `docs/ESSAYS.md`: shots, cards, quotes, `[host]`, `[music mood]`, `[sfx name]`, clips with fallbacks).
3. `plan`, then voices from Termux, then images (AI stills from `prompts.md`, or stock/CC photos with credits in `image-credits.md`).
4. `check`, then `render`. Missing images render as labelled placeholders and missing voices render silent, so drafts work from the start.
5. Look at `out/<id>-sheet.jpg`, extract frames at host appearances and screenshots, check loudness, update `TRACKER.md`.

A 10-minute essay takes about 25 minutes to render; run it in the background. `projects/*/media/` (press screenshots) is not committed because this repo is public. Renders go to `projects/<id>/out/` (ignored by git).

Current essays: **es01** The Real Housewives of London (10:08, voiced, pictures in), **es00** the AI-takeover pilot (scripted).

## Cartoon shorts
Ink-on-paper cartoons drawn by small JavaScript functions as SVG, rendered frame by frame with Playwright, voiced with Edge voices, with synthesised cartoon sound effects and an orchestral tune.
```
node toons/voice.cjs <id>                    # prints the Termux block for the episode's voices
node toons/engine.cjs <id>                   # toons/out/<id>.mp4, <id>-720.mp4, <id>-sheet.jpg
node toons/engine.cjs <id> --stills 1,5,9    # PNG stills to check the drawing
node toons/engine.cjs <id> --audio-only      # remix sound without redrawing
node toons/engine.cjs <id> --style chalk     # ink, chalk, neon, cutout, signpaint
node toons/cutdowns.cjs <id>                 # 15-second cut-downs (lines kept in toons/cuts.json)
node toons/compile.cjs <slug> "<Title>" <id> <id> ...   # YouTube compilation
```
- **Episodes** are `toons/ep/<id>.js`. With `auto: true` everything times itself from the voice files: `voiceTempo` (below 1 is slower), per-line `gap` (seconds of pause), `caps` (captions; a third value holds a caption until a later line), `sx` (sound effects at line offsets), scene `tail`. Set `ep.mood` for the music (default `comedy`).
- **Episodes in the repo:** `gs01` to `gs10` (GSS-LMS "Cartoon High"), `sv01` to `sv08` (Servo POS "Small Business News"). Voices in `toons/voice/<id>/`, logos in `toons/logos/`.
- **Rules** (humour on the situation, one idea, one call to action, offer wording, "demo data") are in `docs/toons/README.md` and each brand's plan. Original shorts ideas and market research: `docs/studio/`.
- Look at the contact sheet before sending; renders are not committed.

## v_me performances
v_me is the 3D avatar studio (repo `gee-highness/v_me`). A performance is a `.vme.json` script: setup (avatar look, set, lighting, voice), then cues (`say`, `gesture`, `expression`, `walk`, `camera`, `caption`, `music`, `sfx`, `transition` ...).
- Scripts and Termux voice scripts: `performances/v_me/`. Guides: `docs/v_me/PERFORMER_MODE.md`, `AI_SCRIPT_AUTHORING_GUIDE.md` (give it to an AI to write scripts), `AI_SKILL.md`.
- Render (in the v_me repo): `npm run performer:validate -- <script>`, then `npm run performer:render -- <script> --out out/x.mp4` (add `--stills 1,4 --scale 0.6` for a quick look; software WebGL is slow, so run one render at a time).
- Every script here uses the default house: `"scene": "apartment-default"`, `"background": "apartment"`.

## The orchestra (music)
`orchestra/orchestra.cjs` plays a composed score on real recorded instruments (VSCO 2 Community Edition, CC0): string sections, harp, horns, trumpet, trombone, tuba, flute, oboe, clarinet, bassoon, timpani, cymbals, gong, glockenspiel.
- **Samples:** `bash orchestra/fetch.sh` downloads and converts only what the score uses to `orchestra/samples/` (about 1 GB, not committed). The first essay or cartoon render runs it automatically.
- **Moods:** `calm glam sneaky tension drama triumph island sad wonder comedy none`. Each is a small composition (intro, theme, answer, fuller second half, cadence), not a loop.
- **Mix:** players seated across the stereo stage, a concert-hall reverb, bed normalised to about -21 LUFS (essays) or -27 LUFS (cartoons, so the voices lead), then a gentle limiter. Essays duck the bed under the narrator.
- **Hits:** `boom sting riser ding chime womp hush thud` are played by the orchestra; other effects (pop, shutter, notify ...) stay synthesised in `essay/score.cjs`, which is also the fallback when the samples cannot be fetched.
- **Use:** essays set `music:` in the front matter and `[music mood]` lines in the script; cartoons set `ep.mood`. Demo: `node orchestra/orchestra.cjs out.wav calm glam drama triumph`.
- **Checking (no listening):** `ffmpeg -i out.wav -af ebur128=peak=true -f null -` for loudness and true peak, and `showspectrumpic` for a spectrogram. The owner judges the sound.

## The host
The channel's presenter is a fictional AI-generated woman. Her details, photos, look and tools are **confidential**: they are not in this public repo but in the private repo `gee-highness/v_me` (`hosts/kuina/`); see `hosts/README.md`. Scripts reference her through the front matter (`host:` and `host_name:`) and the `[host]` directives in `docs/ESSAYS.md`.

## Brands
- `brands/servo-pos/` Servo POS (restaurant POS): `ads/<campaign>/CAMPAIGN.md`, `ads/devices/WORKFLOW.md` (capture, compose, video, every pitfall), `ads/NEXT_POSTS.md`, `docs/POSTING_PLAN.md` (offer ladder and rules), `docs/FACEBOOK_PROMPTS.md`, post documents.
- `brands/gss-lms/` GSS-LMS (school LMS): Cartoon High plan and captions, `marketing/` video scripts and captions.
- Heavy pictures and rendered ads (about 400 MB) stay in the private `servo-pos` and `gss-lms` repos because this repo is public; `INDEX.md` lists them.

## Working method
1. Read `TRACKER.md`, `docs/HANDOFF.md`, `docs/LESSONS.md`.
2. Do the first unchecked "Next" item; make the assets; **look at every frame sheet and measure every audio track**.
3. Update `TRACKER.md` (status moves: `idea` > `scripted` > `voiced` > `images` > `rendered` > `checked` > `posted`) and `docs/HANDOFF.md`; add lessons to `docs/LESSONS.md`.
4. Commit and push; send the finished files to the owner.

## Troubleshooting
| Problem | Fix |
|---|---|
| Voice block times out in Termux | Phone network or VPN; run it again, it resumes |
| Empty voice file (Andrew) | The script retries; re-run the block |
| Render says samples missing | `bash orchestra/fetch.sh` (needs `git` and network) |
| Playwright cannot find Chromium | Set `CHROMIUM_PATH` to a Chromium binary |
| Two renders at once are slow or fail | Software WebGL and ffmpeg are heavy: one render at a time |
| A short feels too fast | Lower `voiceTempo`, raise `gap` values, hold captions, lengthen `tail` |
| Out of disk | Delete `projects/*/out`, `toons/out`, `orchestra/samples` (it re-downloads) |

## Credits and licences
- Orchestra samples: VSCO 2 Community Edition, Versilian Studios, CC0.
- Essay photographs: Creative Commons, credited per project in `projects/<id>/image-credits.md`.
- Cartoons, host, scripts and code: the owner's.
