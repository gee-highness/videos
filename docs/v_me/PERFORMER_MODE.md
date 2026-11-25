# Performer Mode

Drive V-Me's avatar from an **imported performance script** (`*.vme.json`)
instead of a webcam and microphone, then render it to a finished video.
A script can be written by hand or by Claude: dialogue, expressions, gestures,
walking, camera moves and captions. See
[`PERFORMER_MODE_PLAN.md`](PERFORMER_MODE_PLAN.md) for the design rationale.

```
script.vme.json ─► validate ─► (TTS → line audio) ─► Performer (browser) ─► live preview / WebM
                                                          └─► headless render ─► MP4 + SRT
```

## Quick start

```bash
npm install
npm run performer:validate -- performances/how-vme-was-built.vme.json

# Live: open the app in performer mode, then Import… or press "Example"
npm start                                   # http://localhost:3000/?performer=1
#   ?script=performances/how-vme-was-built.vme.json&autoplay=1   (auto-load / auto-play)

# Video: frame-exact headless render to MP4 (+ .srt). The first run downloads Piper
# and a small neural voice (~80 MB, once) and speaks the lines with it.
npm run performer:render -- performances/how-vme-was-built.vme.json --scale 0.5
```

The avatar is `public/avatars/default.vrm` (pixiv's VRM1 sample, redistribution
allowed). Drop your own `.vrm` in `public/avatars/`, list it in `avatars.json`,
and set `setup.avatar` to its id or URL.

## Commands

| Command | What it does |
|---|---|
| `npm run performer:validate -- <script…>` | Checks scripts; prints readable errors |
| `npm run performer:tts -- <script> [--engine piper]` | Generates line audio + `<name>.resolved.json` |
| `npm run performer:smoke` | Browser smoke test: tracking page, auto-load, file import, scrubbing, WebM recording |
| `npm run performer:render -- <script> [opts]` | Headless render to `out/<name>.mp4` |
| `npm run performer:voices -- <script>` | Prints (and saves as `<name>.termux.sh`) the Termux block that makes the Edge voices |
| `npm run performer:voices -- <script> --import <zip>` | Brings the voices in and checks every line (missing, empty, text changed) |

Render options: `--out`, `--scale 0.5` (render size factor), `--fps`,
`--engine piper|file|command|espeak|none`, `--music bed.mp3` (ducked under the
voice), `--stills 1,4.5,9` (JPEG stills only, for quick visual checks), `--build`,
`--verbose`.

**Speed:** without a GPU, WebGL runs in software (~5 s/frame at 1080×1920,
~0.5 s/frame at `--scale 0.4`). Use `--scale 0.4` to iterate, then render at
`--scale 1` on a machine with a GPU for the final cut.

### Voices

**Default: Piper**, a neural, fully offline text-to-speech engine. On first use
the scripts download (from GitHub releases) the standalone Piper binary
(~20 MB) and one small voice (~58 MB) into `~/.cache/vme` (override with
`VME_CACHE_DIR`). After that nothing needs the network, and a line is
synthesised in a fraction of a second.

The voice comes from `setup.voice.voiceId` (default **`en-gb-southern_english_female-low`**,
the smallest female voice available: British English, ~58 MB). `rate` (1 = natural pace) changes speed.

| `voiceId` | Voice |
|---|---|
| `en-gb-southern_english_female-low` | British English, female (default; smallest female voice) |
| `en-gb-alan-low` | British English, male, calm |
| `en-us-ryan-low` | US English, male |
| `en-us-amy-low`, `en-us-lessac-low`, `en-us-kathleen-low` | US English, female |
| `en-us-ryan-medium`, `en-us-lessac-medium` | Same download size, smoother 22 kHz output; choose these if you want the most natural sound |

Other options: `PIPER_MODEL=/path/voice.onnx` (any Piper voice you downloaded),
`PIPER_BIN=/path/to/piper`, or another engine with `--engine`:

| Engine | Use |
|---|---|
| `piper` | Default (see above) |
| `file` | Use the `audio` paths already in the script (record your own voice) |
| `command` | `VME_TTS_COMMAND='mytts --text "{text}" --out "{out}"'` for any other TTS |
| `espeak` | Robotic. Only used as an automatic fallback when Piper cannot be set up (and the render says so) |
| `none` | Silent; the avatar still talks using a synthetic mouth |

Piper speaks at about 2.3 words per second (≈ 137 wpm) including pauses.
If `rhubarb` is on the PATH it is run on each line to get exact mouth shapes
(Tier B lip-sync); otherwise the mouth is derived from the audio itself (Tier A).
Browser `speechSynthesis` cannot be recorded, so recordings always use audio files.

### Edge voices without the phone

- **In the deployed app:** import a script and press nothing else. Every `say` line without audio is spoken by the
  app's `/api/tts` function (same Edge voices, `setup.voice.edge` / `edgeRate`, or `voice` per line). The title shows
  "Making voices 3/7…". Lines that fail stay silent and are listed as warnings.
- **On the command line:** with the `termux` engine, any line not yet made in Termux is made by `scripts/lib/edge-say.mjs`
  (the `msedge-tts` library) when this machine can reach the voice service. The Termux route below still works when it cannot.

### How the avatar moves (animation system)

Everything below happens on its own; scripts only add what they want on top. It is a pure function of time, so a
video renders the same every time.

- **Adaptive idle:** breathing (a visible inhale just before each line, shallower while talking), posture from the
  current emotion (slumped when sad, upright when happy, tense shoulders when angry), organic sway, weight shifts from
  foot to foot every 7–13 s, eye fixations (eye contact or short glances away; toward on-screen media), the head
  following the eyes 0.2 s later, blinks (random, with big glances and at the end of phrases; half and double blinks),
  resting hands with finger micro-motion, and after a quiet while a fidget: look around, touch hair, roll shoulders,
  stretch the neck, sigh, rub hands, tap fingers, rock, check nails, smile to oneself, stretch.
- **Speech:** head beats on stressed syllables (measured from the voice), a head tilt on questions, a softer smile
  while talking, small hand beats.
- **Auto gestures from the words** (anticipating each word slightly): hello/bye → wave; I/me/my → hand on chest;
  you → open palm; one…five → counting fingers; this/here/look (with media on screen) → present toward it; no/not →
  head shake; yes/exactly → nod; huge/everything → arms wide; tiny/a bit → pinch; think/maybe/why → chin; love → heart;
  wow/amazing → cheer; wait/stop → palm; come/follow/subscribe → beckon; perfect → chef's kiss; a question → palms up.
  Explicit gestures always win; auto gestures never overlap them.
- **Follow-through:** every bone eases to its target on a damped spring (heavier parts lag a little and settle).

```jsonc
"setup": { "animation": {
  "personality": "bubbly",   // calm | bubbly | confident | shy | energetic | sleepy | sassy | professional
  "energy": 0.75,            // 0..1
  "eyeContact": 0.8,         // 0..1
  "handsRest": "front",      // sides | front | behind | hips | crossed
  "autoGestures": true, "fidgets": true, "smoothing": true
} }
```
An Avatar Studio look carries its own `motion` (personality, energy, hands); the script's `animation` overrides it.

Gestures (`{ "do": "gesture", "name": … }`): nod, shake, bow, wave, point, present, thumbsUp, think, clap, shrug,
selfPoint, offerPalm, palmsUp, wide, pinch, count1–count5, beckon, stop, airQuotes, heart, peace, facepalm, salute,
fistPump, cheer, shy, gasp, laugh, headTilt, leanIn, lookAround, stretch, dance, bounce, sigh, hairTouch, chefKiss,
twoThumbs, beat. Poses (`{ "do": "pose", "name": … }`): rest, openArms, handsClasped, thinking, armsCrossed,
handsOnHips, handsBehind, handOnChest, handsFront.

### Avatar Studio and characters

🧍 **Avatar** (studio header) or **🧍 Avatar Studio** (tracking mode) opens the Avatar Studio: start from a character
(Claude, Zola, Amara, Kai, Lumi, Nala), a bundled CC0 model, or an imported VRM; mix hair, face and eyes between
models; set colours (target colours for skin, hair, eyes, clothes, or any material), body proportions, a resting face,
accessories (26+, including afro, afro puffs, space buns, box braids, edges, holo visor, holo ring, holo wings), shading
style, hair physics and personality. **Use in this video** puts the look inline in the script, so it renders anywhere.

### Picking voices in the app

The **🎙 Voices** tab lists every voice the script uses (the main voice, plus one per extra character). For each:
pick any of the Edge voices (South African English, isiZulu, Afrikaans and the natural "multilingual" hosts are at the
top; all 318 are listed below them), press ▶ to hear it, set the speed, then **Apply voices**. Only lines whose voice
or speed changed are made again. **Copy Termux block** / **⬇ Termux .sh** gives the phone block for the same voices,
and **⬇ Script with these voices** saves the script so the command line and Termux use them too. In Termux, running
the block again redoes only lines whose words, voice or speed changed (each `line-NNN.txt` holds `voice|rate|text`).

### Termux voices (Microsoft Edge neural voices, made on the phone)

The Edge voices sound the most natural, but a cloud machine usually cannot reach
the Edge voice service. So the phone makes them:

1. Set `"setup": { "voice": { "engine": "termux", "edge": "en-US-EmmaMultilingualNeural", "edgeRate": "+15%" } }`.
   A line can use another voice with `"voice": "en-GB-RyanNeural"` on its `say` cue (a second character).
2. `npm run performer:voices -- performances/my-video.vme.json` prints a block. Paste it into Termux
   (first time: `pkg upgrade -y && pkg install -y python zip && pip install edge-tts && termux-setup-storage`).
   It saves `Downloads/vme/<name>-voices.zip`. Running it again only redoes lines that are missing, empty or changed.
3. Send the zip back, then `npm run performer:voices -- performances/my-video.vme.json --import my-video-voices.zip`.
4. `npm run performer:render -- performances/my-video.vme.json` (the `termux` engine is picked automatically).

The renderer converts each `line-NNN.mp3` to WAV for exact timing and lip-sync. A full render refuses to run with
missing, empty or out-of-date lines (it never ships a silent or substitute voice); `--stills` goes ahead silently.
Useful voices: Emma (`en-US-EmmaMultilingualNeural`, host), Ava, Andrew, Ryan (`en-GB-RyanNeural`, narrator),
Leah and Luke (`en-ZA-…`, South African English), isiZulu `zu-ZA-ThandoNeural` / `zu-ZA-ThembaNeural`, Afrikaans `af-ZA-AdriNeural` / `af-ZA-WillemNeural`.

### Media: web pages, images and video clips (VTuber mode)

A `media` cue puts something on screen with the avatar, like a VTuber reacting to or presenting content.
It stays until its `duration` runs out, the next `media` cue, or `{ "do": "media", "src": null }`.

```jsonc
{ "do": "media", "screenshot": "https://example.com/article", "fullPage": true, "layout": "corner", "title": "The article", "credit": "example.com" }
{ "do": "media", "screenshot": "https://example.com", "selector": "main img", "layout": "pip" }
{ "do": "media", "src": "clips/my-phone-video.mp4", "clipStart": 4, "volume": 0.3, "layout": "split" }
{ "do": "media", "video": "https://www.youtube.com/watch?v=…", "layout": "media", "duration": 6 }
{ "do": "media", "src": "images/chart.png", "fit": "contain", "zoom": [1, 1.12] }
{ "do": "media", "src": null }
```

| Layout | Look |
|---|---|
| `corner` (default) | Media fills the frame; the avatar is cut out and sits bottom right (`side: "left"`, `avatarScale`) |
| `full` | Media fills the frame behind the full-size cut-out avatar |
| `split` | Media on top (`split`: share of the height, default 0.52), avatar below |
| `pip` | The avatar in its own scene, media in a card near the top (`cardAspect`) |
| `media` | Media only (a clip or image on its own) |

Other fields: `fit` (`cover`/`contain`), `zoom` `[from, to]` (Ken Burns, default `[1, 1.08]`), `pan`
(`down`/`up`/`left`/`right`; tall screenshots scroll down by themselves), `title` (a label), `credit`
(source line in small print), `accent` (label colour), `clipStart` and `volume` (video; default 0.35, 0 mutes).

How the renderer gets the media (cached in `<script dir>/media/`):

- `screenshot`: a headless browser opens the page at phone width (so text stays readable), unpins sticky
  headers, and captures the view, the whole page (`fullPage`, up to about 3 500 px of page) or one element
  (`selector`). A page that answers with a block or bot check stops the render with a message: take that
  screenshot on the phone and use it as `src`.
- `src` URLs are downloaded; `video` page URLs use `yt-dlp` when it is installed.
- Video files become exact frames at the script's frame rate, and their sound is mixed in under the voice.

Only use media you may use: your own, public domain, openly licensed (put the licence in `credit`), or
short clips you comment on. Respect each site's rules about automated access.

## Script format

```jsonc
{
  "version": 1,
  "meta": { "title": "…", "format": { "width": 1080, "height": 1920, "fps": 30 } },
  "setup": {
    "avatar": "bundled-1",              // id from avatars.json, or a .vrm URL
    "scene": "studio",                  // "studio" | "apartment-default"
    "background": "living-room",        // 3D apartment rooms: living-room (default) | tv | kitchen | bedroom | dining | apartment | a saved spot id
                                        // flat: none | greenScreen | studio | streamingRoom | neonCity | nature
    "spots": [],                        // your own apartment spots (📍 Spots tab), usable as backgrounds
    "lighting": "studioSoft",
    "camera": "closeup",                // closeup | halfbody | fullbody
    "props": { "sunglasses": false },
    "voice": { "voiceId": "en-gb-southern_english_female-low", "rate": 1.0, "modulationHz": 0 },
    "idle": { "blink": true, "breathe": true, "sway": 0.3, "seed": 42 }
  },
  "cues": [ … ]
}
```

A JSON Schema lives at `src/app/performer/performance.schema.json`; editors
that honour `"$schema"` will autocomplete cues.

### Timing

- `at` — absolute start (seconds).
- Without `at`, a cue starts when the previous **blocking** cue ends.
  `say`, `walkTo`, `walk` and `wait` block; everything else overlaps
  unless `"wait": true`.
- `offset` — shift from the time the cue would otherwise start.
- `after: "<mark>"` — start at a `mark` cue.
- A `say` lasts as long as its audio (or an estimate without audio).

### Cues

| `do` | Fields | Notes |
|---|---|---|
| `say` | `text`, `audio?`, `emotion?`, `caption?` | Lip-synced; subtitle defaults to `text` (`false` hides it) |
| `expression` | `name` (happy, angry, sad, relaxed, surprised), `weight?`, `duration?`, `fadeIn?`, `fadeOut?` | |
| `gesture` | `name`, `hand?`, `speed?` | nod, shake, bow, wave, point, present, thumbsUp, think, clap, shrug |
| `pose` | `name` (rest, openArms, handsClasped, thinking) or `bones`, `duration?` | |
| `look` | `target`: camera/left/right/up/down/`{x,y}`, `duration?` | Head + eyes; resets roll |
| `head` | `pitch?`, `yaw?`, `roll?` (degrees), `duration?` | Only the named fields change. Pitch up+, yaw toward the viewer's right+, roll clockwise+ |
| `walkTo` | `marker`, `run?` | Apartment scene. Markers: `spawn-default`, `spot-tv`, `spot-kitchen`, `spot-dining` |
| `walk` | `direction {dx,dz}`, `seconds`, `run?` | |
| `camera` | `preset` \| `rig` (`follow`, `selfie`) \| `marker` (camera stand), `move` (cut/ease/dolly/orbit), `duration?`, `orbit?` (absolute azimuth °), `fov?` | |
| `background` / `lighting` | `value` | |
| `prop` | `name`, `value` (bool) | e.g. sunglasses |
| `emoji` | `value` \| null | Floating emoji |
| `caption` | `text` \| null, `style` (title/lower-third/subtitle) | Persists until replaced or `null` |
| `voice` | `modulationHz` | Ring-mod "voice disguise" from this point |
| `wait` | `seconds` | |
| `mark` | `name` | |

## Automation API

With `?performer=1` the page exposes `window.vme` (this is what the renderer uses):

```ts
await vme.load(script | url)       // parse, load audio + avatar, resolve timing
vme.renderFrame(t)                 // fixed-step render of the frame at t seconds
vme.frameData('image/jpeg', 0.92)  // the composited frame (captions included)
vme.play(); vme.pause(); vme.seek(t); vme.stop()
vme.duration; vme.state; vme.resolved
```

## How it works (files)

| File (`src/app/performer/`) | Role |
|---|---|
| `performance-loader.ts` | Validate + resolve relative timing (pure) |
| `performance-timeline.ts` | `sample(t)` → `AvatarFrame`; deterministic (pure) |
| `pose-library.ts`, `procedural.ts` | Gestures/poses; blinks, breathing, sway, saccades |
| `lipsync.ts` | WAV parsing, audio → visemes, Rhubarb mapping |
| `performer.service.ts` | Applies frames to the VRM, scene, camera, environment; transport; recording |
| `performer-audio.ts` | Decodes/analyses/plays line audio; voice modulation |
| `camera-director.ts`, `caption-renderer.ts`, `scripted-input-source.ts` | Shots, burned-in captions, scripted walking |
| `performer.component.ts` | UI: import, scrub, cue list, JSON editor, record |

Changes to existing files are small: `ThreeSceneService` (`performerMode`,
explicit `tick()`, fixed render size, offline backgrounds; VRM1 models are no
longer turned away from the camera), `EnvironmentService` (inject an input
source, external camera, follow avatar), and three extra floor markers in the
apartment.

## Fixes to existing systems found while testing

Performer Mode exposed bugs in the apartment and walking code that nobody had
hit before. All are fixed: floor colliders were vertical planes; ground friction
cancelled the commanded walking speed (to about 1/24); `EnvironmentStore.init()`
did not wait for the default apartment to load; the walk animator looked bones
up by exact node name so it silently did nothing on most VRMs; the on-screen
joystick and the device-orientation listener were never disposed; and
lip-sync produced NaN for audio whose hop size was odd.

## Tests

`npm test` runs the pure specs (loader, timeline, pose library, lip-sync) in headless Chrome
(`CHROME_BIN` must point at a Chrome/Chromium).
