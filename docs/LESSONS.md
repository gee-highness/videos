# Lessons (read before every job; add a line after every job)

- 2026-11-24 Edge voices from Termux sometimes come back empty (0 bytes), mostly en-US-AndrewMultilingualNeural: every say() retries up to 5 times and skips files that already exist; always check sizes after unzipping.
- 2026-11-24 Edge leaves ~0.9 s after every full stop and ~0.75 s at the end of each file: the engines trim it (inner pauses to ~0.4 s). Plan about 145 spoken words a minute; with quote cards and chapter holds, a 10-minute video is ~1,100 to 1,450 spoken words.
- 2026-11-24 Film grain (ffmpeg noise) on every frame made a 108 s draft 170 MB: no grain in the grade; AI images already have it.
- 2026-11-24 Vertical captions need ~24 characters a line, landscape ~40.
- 2026-11-24 Rendering speed: about 0.8 s of work per second of video for drafts (ultrafast intermediates, 1.5x zoompan source).
- 2026-11-25 The music and effects are synthesised (essay/score.cjs): no licences. Moods: calm, glam, sneaky, tension, drama, triumph, island, none. I can only measure loudness, not hear it: ask the user to listen.
- 2026-11-25 Quote cards replace captions for that shot (the words are already on screen); a silent quote shot stays up ~0.34 s a word + 1.2 s.
- 2026-11-25 Instagram, TikTok and X cannot be captured here (login walls) and YouTube downloads are blocked or against their terms: the user fetches clips on the phone (yt-dlp in Termux, or a screen recording) and screenshots posts. Public press and Wikipedia pages capture fine once the cookie banners are removed (essay/capture.cjs).
- 2026-11-25 Voice and image files are numbered by shot, so inserting a shot renumbers everything after it and breaks recordings already made. `[when]` shots (clips that exist only when their file does) take the previous shot's number; never insert a narrated shot into a script whose voices exist without telling the user which lines changed.
- 2026-11-25 A letterboxed 9:16 (the 16:9 video over a blurred copy) wastes most of the phone screen: screenshots, cards and portrait clips are tiny. essay.cjs now builds a native 9:16 (portrait crop that pans, bigger cards, portrait clips filling the frame). ASS WrapStyle 2 does not wrap: long card and quote text is wrapped by hand (wrapAss) and shrunk to fit (fit).
- 2026-11-25 Termux voice failures with `Connection timeout to host wss://speech.platform.bing.com` are the phone's network (a VPN, a blocked network), not the script: turn off the VPN or switch network and re-run the block (finished lines are skipped). A stray character before `say(){` also breaks the first line.
- 2026-11-25 The check command estimated 8:45 for es01 but the render is 9:49: silent quote and screenshot shots, chapter holds and the final 2.5 s add about a minute. Trust the render for the real length.
- 2026-11-25 es01 pictures: 60 Creative Commons photos via Openverse + web-fetch agents (Wikimedia blocks the cloud machine directly). Each fetch agent stopped at its 15-turn limit, but the files it saved were complete and in order; match them by expected size when a batch is short. Rejected: a news set with presenters, a TV crew with faces, a concert stage with an artist's name across it.

## Music
- The user wants the music to be the best it can be in every video: matched to each section, shaped, ducked under the voice, loudness checked. Never a flat loop.

## Set
- All videos are made in the v_me default house (`scene: apartment-default`, `background: apartment`), with the confidential host as a v_me look.
- Orchestra (Nov 2026): music now comes from `orchestra/orchestra.cjs` (real recorded sections). Check every score by measurement, not by ear (Claude cannot listen): `ffmpeg -af ebur128` (bed about -21 LUFS, true peak under -1 dB) and a spectrogram (`showspectrumpic`) to see the sections change with the cues. The user judges the sound.
- The host's avatar and textures are confidential: details live in the private v_me repo (`hosts/kuina/`), not here.
- Toons (Nov 2026): cartoon music now comes from the orchestra too (`toons/sfx.cjs` calls `orchestra/orchestra.cjs`, bed at -27 LUFS so the voices lead; set `ep.mood`, default `comedy`). Cartoon sound effects stay synthesised.
