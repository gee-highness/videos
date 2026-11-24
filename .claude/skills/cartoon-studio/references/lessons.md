# Lessons (read before every job; add a line after every job)

Format: date, what happened, what to do. Newest at the bottom.

- 2026-11-15 The Edge voices cannot be reached from the cloud session (WebSocket blocked by the network); the user generates them in Termux and sends a zip. Fix Termux installs with `pkg upgrade -y` then `pip install edge-tts`.
- 2026-11-15 Default Edge speed sounded slow to the user: every voice is generated at `--rate=+15%`.
- 2026-11-15 `atempo` inside the same ffmpeg graph as `adelay` + `amix` produced silence: speed each line up in its own step (the engine does).
- 2026-11-16 Wobble filters must be fixed to the 1080x1920 frame (`filterUnits="userSpaceOnUse"`) or long texts render badly.
- 2026-11-16 The news ticker is drawn phrase by phrase, only what is on screen, with widths estimated at 22.4 px per letter (canvas measuring was unreliable on some frames).
- 2026-11-17 Side-by-side review strips join frame edges and make the scrolling ticker look garbled: crop one frame at full size before believing a ticker bug.
- 2026-11-17 Three of 131 voice files came back empty (0 bytes). Always check sizes; give the user a retry block with `until [ -s file ]; do ...; done` for just those.
- 2026-11-17 Automatic timing (`auto: true`) made the 11 new episodes possible in one session: never hand-type line times again.
- 2026-11-17 A background command that starts its own `&` job gets killed when it returns: run queues as plain sequential commands with `run_in_background`.
- 2026-11-17 Episodes came out 48 to 68 s because the voices are slower than estimated; plan about 0.45 s per word for Ryan at +15%.
- 2026-11-17 The goat first looked like a sheep: horns, beard and a slimmer body fixed it. Check new animals at full size.
- 2026-11-17 The first chalk board (green) swallowed the Venda Khona green: every style must keep brand colours readable.
- 2026-11-17 Load shedding had been absent for 500+ days by October 2026: do not use it as a joke.
- 2026-11-17 Styles first missed hand-picked light tints (floors, sand, money notes, soft bubbles): `restyle` now maps any light fill to the style's paper colour. After adding a style, check scenes with floors and props, not just characters.
- 2026-11-17 Cut-downs come out 14.5 to 17.5 s when built from whole lines; Servo's 6-second end line eats a third of a short: original shorts use a 2-second end line ("Servo. Try the live demo.").
- 2026-11-17 Two YouTube compilations (8 episodes each, about 8 minutes) take about 5 minutes each to encode with `-preset veryfast`.
- 2026-11-17 On dark styles (chalk, neon) the brand green highlight words were unreadable: highlighted words switch to the brand's light accent (`accentOnInk`) after the tint mapping (doing it before let the tint mapping turn the light accent dark again).
- 2026-11-23 GSS-LMS shorts: the user asked for "well thought out, targeted, captivating, informative, humorous, perfectly paced". Plan the market first (buyer, influencers, local pains, real feature per pain, demo role per short), then write. Pacing tools: `gap` per voice line (0.15 to 0.25 for quick back-and-forth, 0.45 to 0.7 before a punchline or after the product line); app rows pop in spread over the narrator's line (`K.appScene`). Estimated lengths came out 24 to 33 s; trim product lines to one breath with three facts.
- 2026-11-23 The project's own Playwright may want a browser build that is not installed: engine.cjs now launches `/opt/pw-browsers/chromium` (or `CHROMIUM_PATH`) when it exists.
- 2026-11-23 Edge voices leave about 0.9 s of silence after every full stop plus 0.2 s at the start and 0.75 s at the end of each file: one-word lines lasted 1.7 s and the GSS shorts ran 29 to 42 s. engine.cjs now cleans every line once (trim both ends, inner pauses cut to about 0.4 s, speed-up applied) and times the episode from the cleaned files: 22 to 31 s.
