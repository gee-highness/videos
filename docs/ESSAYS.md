# Video essays: how they are made

## The look (reference: "The AI Take Over Has Completely Backfired and I Can't Be Happier", Internet Education)
What we could measure from a frame and the description (Gemini could not watch the full video; anything about pacing and sound below is our own choice):
- **Pictures:** AI-generated cinematic stills, never real footage. Muted, foggy, symmetrical and eye-level, with lots of empty space. 1990s offices, CRT screens, lone white humanoid robots seen from behind. Palette teal-grey `#4B5E5B`, beige-grey `#9EA292`, charcoal `#1C2523`, CRT cyan `#67B7C7`. Fine film grain, soft haze. Every image is a still with a slow push or pan.
- **Captions:** a monospace font (we use Noto Sans Mono), white text on a near-black box (about 85% opaque) behind each line, two lines of at most ~40 characters, centred near the bottom, shown as whole phrases rather than word by word.
- **Voice:** one calm narrator. We use Edge `en-US-AndrewMultilingualNeural` at `-4%` (alternative: `en-GB-RyanNeural`). The engine trims Edge's long pause after each sentence to about 0.45 s.
- **Sound:** a quiet ambient bed under the voice (a soft synthesised pad unless you add `music.mp3`).
- **Pacing (our default):** one image per 1 to 3 sentences, so shots run about 4 to 10 s, with 0.6 s crossfades.

## The script shape (from the opening we could read)
1. **The promise:** what everyone was sold, in one confident paragraph.
2. **The turn:** "On paper it made sense. In practice…" (one short line).
3. **Authority:** year + institution + topic + plain finding ("In 2025, researchers at MIT looked at…").
4. **The number:** one stark statistic, said simply.
5. **The open loop:** "…and this is why." Then the body: two or three reasons, a counterpoint, a turn, and a callback to the opening image.

Titles: a big claim plus a feeling ("…Quietly Stalled. Here's What the Numbers Say", "…Backfired and I Can't Be Happier").

**Truth rule:** every number and source must be checked against the original before posting, and said as the source says it. The reference video overstated its source (the MIT report found 95% of organisations getting no measurable return, not that billions "yielded no results"); we don't. Put the sources in the script's front matter and in the video description.

## Planning (do this first)
Copy `essay/templates/plan.md` to `projects/<id>/plan.md` and fill it in: who the viewer is, the one sentence they leave with, three title options, a source table with every number exactly as it will be said, the chapters with target lengths, and the engagement checklist. The script is written from the plan; `projects/es01/plan.md` is a filled-in example.

## Pacing and engagement rules (the `check` command tests the first four)
- **Hook:** a number, a question or a `[card]` within the first 15 seconds, and an open loop ("so what went wrong?") that a later chapter pays off.
- **Something new at least every 60 seconds:** a chapter, a card, a question to the viewer, or a `[pause]` before a key line.
- **Shots 4 to 8 seconds**, none over 11; one to two sentences per picture.
- **Chapters** (`# Title`) every 1 to 3 minutes; they become title cards and YouTube chapters (`out/<id>-chapters.txt`).
- **For everyone:** plain words, sentences under ~20 words, every idea paired with an everyday example anyone can picture, one "you" question per chapter, and the ending calls back to the opening picture.
- **Sound:** the music ducks under the voice and rises in pauses and chapter cards on its own.

## `script.md` format
```
---
title: The video's title
style: retro-office            # a key in essay/styles.json (retro-office, archive-noir, or add one)
voice: en-US-AndrewMultilingualNeural
rate: -4%
music: pad                     # pad, none, or a file in the project folder, e.g. music.mp3
sources: where every number comes from
---
# Chapter title                 (a title card on screen + a YouTube chapter; the first one starts at 0:00)
## note                          (only for you; not shown or spoken)
[img] what the picture shows (the style's master prompt is added for you)
What the narrator says over this picture. One or two sentences.
[card] 95% | of organisations: no measurable return     (a statistic on screen for this shot)
[pause 0.8]                      (a beat of silence after this shot, before the next line)
[quote] SPEAKER | "their exact words"   (someone's words on screen; replaces captions for that shot; a shot can be only a quote, with no narration)
[music sneaky]                   (the music changes here and plays until the next [music]; moods: calm glam sneaky tension drama triumph island none)
[sfx boom]  [sfx pop end]  [sfx notify +0.9 x0.7]   (a sound effect at the start of the narration, at its end, or N seconds in; xN = volume)

[img same] {move:in}
Keeps the previous picture with a new camera move (in, out, panL, panR, up, down, hold).
```
About 145 words is one minute. A 10-minute essay is about 1,450 words and 90 to 120 shots.

## Clips, screenshots and other media
Put files in `projects/<id>/media/`. All of it is optional: a missing file renders as a labelled placeholder (a missing clip or post never breaks the render).
```
[shot] press-bravo.png | Bravo, 18 Nov 2026        a screenshot floats over the dimmed picture, credited on screen as "Source: ..."
[clip] hayu-monologue.mp4 0:03-0:27 sound | Hayu (YouTube) | https://youtube.com/...    plays full frame (0:03 to 0:27 of the file) with its sound; "mute" for B-roll. Credited as "Clip: ...". The URL feeds `media`
[subs] 0:00 "First line." // 0:08 "Second line."      captions for a clip: seconds into the used part (times optional: lines then share the clip evenly)
[when file.mp4]     keep this shot only if the file exists (a real clip)
[unless file.mp4]   drop this shot if the file exists (the typed-quote fallback for that clip)
```
- A `[shot]` or `[clip]` on a shot that also has a `[quote]` replaces the typed quote when the file exists; otherwise the typed quote stays (so a missing Instagram screenshot costs nothing).
- A `[when]` shot takes the previous shot's number, so adding clips never changes the voice or image numbers already recorded.
- A silent shot with a clip lasts as long as the clip; with narration the clip's sound is ducked under the voice.
- `node essay/capture.cjs <id>` screenshots public pages listed in `projects/<id>/capture.json` (cookie banners removed, cropped to the headline, a block of text or a selector). Instagram, TikTok and X need a login: the user screenshots those.
- `node essay/essay.cjs media <id>` writes `media.md` (every file needed, where it is used, credit, status) and `media-download.sh` (a Termux block that downloads the clips with yt-dlp on the phone).
- Rules: under ~25 s a clip and about 90 s of borrowed footage in total, always credited, always with commentary; screenshots show the headline only. `check` warns past 90 s.

## Music and sound effects
All synthesised in `essay/score.cjs` (nothing to license). Set the opening mood with `music:` in the front matter (a mood name, `pad`, `none` or a file) and change it with `[music mood]` lines. The music ducks under the narrator by itself.

| Mood | Use it for |
|---|---|
| calm | explanations, endings, a fair-minded aside |
| glam | money, luxury, London, fashion |
| sneaky | gossip, scheming, someone about to be found out (tip-toe pizzicato) |
| tension | a feud building, a confrontation coming (drone and heartbeat) |
| drama | the big moment (minor swells and hits) |
| triumph | the internet reacts, a victory lap |
| island | Caribbean roots (offbeat skank, gentle) |
| none | silence before a punchline: silence is a sound effect too |

Sounds: pop, tick, ding, chime, whoosh, womp (a joke falls flat), sting, thud, munch, boom (a reveal), riser (build into a moment; use a negative offset, e.g. `[sfx riser -1.6]`), scratch (record scratch: "wait, what?"), cash (money), shutter (photos), notify (phones, going viral), hush (the room goes quiet).

## Real people
Read `.claude/skills/research-desk/SKILL.md`: research first, label every line FACT / CLAIM / UNVERIFIED, quote people as their words, follow an accusation with the denial, crude words on screen only with an asterisk, no clips and no real faces in images.

## Commands
| Command | Does |
|---|---|
| `node essay/essay.cjs plan <id>` | writes `prompts.md` (one prompt per shot, style added) and `termux.sh` (every voice line, retries built in) |
| `node essay/essay.cjs media <id>` | writes `media.md` and `media-download.sh` (clips and screenshots needed) |
| `node essay/capture.cjs <id>` | screenshots the press pages in `capture.json` into `media/` |
| `node essay/essay.cjs check <id>` | missing images and voice files, length, chapters with times, and a pacing report (long shots, minutes with nothing new, a weak hook) |
| `node essay/essay.cjs render <id>` | renders `out/<id>.mp4` (1920x1080) and `out/<id>-sheet.jpg` |
| `... render <id> --vertical` | also `out/<id>-9x16.mp4`: a native 1080x1920 recomposition with the same audio, timing and content: the pictures are cropped to portrait with panning, screenshots and stat cards are re-sized for the narrow frame, portrait clips (like Hayu's Shorts) fill the whole screen, and the captions are re-wrapped to 24 characters |
| `... render <id> --to 12` | only the first 12 shots, for a quick look |

Rendering speed here: about 1.7 seconds of work per second of video (a 10-minute essay takes about 17 minutes).

## New style
Add an entry to `essay/styles.json`: `prompt` (added to every image prompt), `grade` (an ffmpeg colour filter), `zoom`, `moves`, `pad` (the notes of the ambient bed in Hz), and `captions`. Keep the captions block unless the look needs different captions.

## Vertical (9:16) notes
- A 16:9 picture is cropped to a 9:16 window that slides across it for the pans, so keep the subject near the centre of every AI image.
- A `[card]` and a `[shot]` on the same shot overlap: use one per shot.
- Render time roughly doubles with `--vertical` (two picture builds, one audio mix).
