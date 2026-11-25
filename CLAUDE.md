# Notes for Claude

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
