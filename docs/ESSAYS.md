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
# Section name (only for you; not spoken)
[img] what the picture shows (the style's master prompt is added for you)
What the narrator says over this picture. One to three sentences.

[img same] {move:in}
Keeps the previous picture with a new camera move (in, out, panL, panR, up, down, hold).
```
About 145 words is one minute. A 10-minute essay is about 1,450 words and 90 to 120 shots.

## Commands
| Command | Does |
|---|---|
| `node essay/essay.cjs plan <id>` | writes `prompts.md` (one prompt per shot, style added) and `termux.sh` (every voice line, retries built in) |
| `node essay/essay.cjs check <id>` | lists missing images and voice files, word count and estimated length |
| `node essay/essay.cjs render <id>` | renders `out/<id>.mp4` (1920x1080) and `out/<id>-sheet.jpg` |
| `... render <id> --vertical` | also `out/<id>-9x16.mp4` (1080x1920: the picture over a blurred copy, captions in the middle) |
| `... render <id> --to 12` | only the first 12 shots, for a quick look |

Rendering speed here: about 1.7 seconds of work per second of video (a 10-minute essay takes about 17 minutes).

## New style
Add an entry to `essay/styles.json`: `prompt` (added to every image prompt), `grade` (an ffmpeg colour filter), `zoom`, `moves`, `pad` (the notes of the ambient bed in Hz), and `captions`. Keep the captions block unless the look needs different captions.
