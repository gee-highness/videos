# Notes for Claude

**When the user says "continue videos":** read `docs/HANDOFF.md` first and do the first unchecked item in its "Next" list (then the next), committing and pushing after each. Keep that file current: tick what is done and add what comes next before you stop.

This repository holds every video the user plans and the tools that make them, for every project and repo (see `INDEX.md` for where everything lives). Video work done in another repo is copied here and sorted by brand.
- `TRACKER.md`: every video and its status. Read it first and keep it current.
- Lessons from every job: `docs/LESSONS.md` (read first, add after).
- Stories about real people or events: research first with `.claude/skills/research-desk/` (project `research.md`, FACT / CLAIM / UNVERIFIED).
- Video essays (documentary style): `essay/essay.cjs`, scripts in `projects/<id>/script.md`, guide `docs/ESSAYS.md`, skill `.claude/skills/essay-studio/`.
- Cartoon shorts: `toons/` (kit copied from the gss-lms repository's `scripts/toons/`), skill `.claude/skills/cartoon-studio/` (read its lessons and feedback first).
- Voices are made by the user in Termux with edge-tts (the cloud session cannot reach the Edge voices). Never fake a voice or claim to have listened to audio.
- Renders go to `projects/<id>/out/` and `toons/out/` (not committed). Send finished files to the user as zips.
- The user likes replies in the voice of Jarvis, and short.
- Voices: the main narrator is a woman: en-US-AvaMultilingualNeural (the user's choice, the most natural Edge voice; British alternative en-GB-SoniaNeural). Andrew (en-US-AndrewMultilingualNeural) for a male voice (Andrew sometimes returns empty files; the Termux script retries). The user generates them in Termux and pastes only the say block (no setup lines needed).
- The channel host is confidential: her photos, look and notes are NOT in this public repo (private repo `gee-highness/v_me`, `hosts/kuina/`; copy to `hosts/kuina/` locally, git-ignored). Never commit them, never describe her appearance in public files. Videos use `dress.png` (glam but covered).

**Music (standing rule from the user):** the music must be the best it can be in every video. Choose or compose a bed that fits the mood of each section, shape it (intro, build, drop under the voice, outro), duck it under speech, mix it cleanly, and check the loudness. Never ship a flat generic loop. Record what worked in `docs/LESSONS.md`.

**Set (standing rule from the user):** every video is made in the v_me default house: v_me scripts use `"scene": "apartment-default"` and `"background": "apartment"` (repo `gee-highness/v_me`, renderer `npm run performer:render`).

**UI/UX (standing rule from the user):** every video has the best UI and UX it can: captions and stickers big enough to read on a phone, inside safe areas, never overlapping faces or key content; clear hierarchy and consistent layout between shots; strong contrast; pacing a first-time viewer can follow; and the 9:16 version designed for the phone, not just cropped. Check every shot of both formats at phone size (frames) before sending, and fix what looks cramped, small or cluttered.

**Reel limit and edit (standing rule from the user):** every upload is a Reel with a hard limit of 90 seconds (set `limit:` in the script front matter; confirm the platform cap with the user). Plan the time before writing: if the story needs more, split it into two uploads with `[part 2]` (part 1 ends on a cliffhanger end card) or cut the least relevant material (mark it `[low]`; the renderer drops `[low]` shots when a part runs over). `node essay/essay.cjs check <id>` reports each part's length. Edits must follow what is said and shown: a new picture on the key word (`[cut word img]`, 1.5 to 3 s per picture), a tag, source chip or card where it helps (`[tag]`, `[src]`, `[card]`), a whoosh on every cut, bold word-by-word captions (style `pop`), and a host who varies (tight, point, present, nod). Never ship a static grey sequence. After every render run `node essay/essay.cjs kit <id>` for the captions, pinned comment, hashtags and cover frame.

**Media (standing rule from the user):** for every video, get as much relevant, licensed media as possible (images and short video) with `essay/media-kit.cjs` (guide `docs/MEDIA.md`): write a media brief, give the user the Termux download block, ingest the zip, look at the contact sheets, then use the best material as word-timed cuts and credited cutaways. Always credit; keep borrowed footage short.
