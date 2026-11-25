# Notes for Claude

**When the user says "continue videos":** read `docs/HANDOFF.md` first and do the first unchecked item in its "Next" list (then the next), committing and pushing after each. Keep that file current: tick what is done and add what comes next before you stop.

This repository holds every video the user plans and the tools that make them.
- `TRACKER.md`: every video and its status. Read it first and keep it current.
- Lessons from every job: `docs/LESSONS.md` (read first, add after).
- Stories about real people or events: research first with `.claude/skills/research-desk/` (project `research.md`, FACT / CLAIM / UNVERIFIED).
- Video essays (documentary style): `essay/essay.cjs`, scripts in `projects/<id>/script.md`, guide `docs/ESSAYS.md`, skill `.claude/skills/essay-studio/`.
- Cartoon shorts: `toons/` (kit copied from the gss-lms repository's `scripts/toons/`), skill `.claude/skills/cartoon-studio/` (read its lessons and feedback first).
- Voices are made by the user in Termux with edge-tts (the cloud session cannot reach the Edge voices). Never fake a voice or claim to have listened to audio.
- Renders go to `projects/<id>/out/` and `toons/out/` (not committed). Send finished files to the user as zips.
- The user likes replies in the voice of Jarvis, and short.
- Voices: the main narrator is a woman: en-US-AvaMultilingualNeural (the user's choice, the most natural Edge voice; British alternative en-GB-SoniaNeural). Andrew (en-US-AndrewMultilingualNeural) for a male voice (Andrew sometimes returns empty files; the Termux script retries). The user generates them in Termux and pastes only the say block (no setup lines needed).
- The channel host is Kuina (pronounced "Queena"), a fictional AI-generated presenter: `hosts/kuina/HOST.md`. Use `dress.png` (glam but covered); the alt images are not used in videos.

**Music (standing rule from the user):** the music must be the best it can be in every video. Choose or compose a bed that fits the mood of each section, shape it (intro, build, drop under the voice, outro), duck it under speech, mix it cleanly, and check the loudness. Never ship a flat generic loop. Record what worked in `docs/LESSONS.md`.

**Set (standing rule from the user):** every video is made in the v_me default house: v_me scripts use `"scene": "apartment-default"` and `"background": "apartment"` (repo `gee-highness/v_me`, renderer `npm run performer:render`). The host Kuina is the v_me look `kuina` (`public/avatars/looks/kuina.json`).
