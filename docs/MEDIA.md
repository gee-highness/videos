# Getting media (images and video) for a video

The cloud machine cannot download from Wikimedia or YouTube, so the user's phone (Termux) does the downloads. The tool is `essay/media-kit.cjs`.

## The steps
1. **Brief:** write `projects/<id>/media-brief.json` (format at the top of `essay/media-kit.cjs`): Openverse searches, exact Wikimedia Commons files (key, file name, author, licence, note), Commons videos, and YouTube searches.
   - Find Commons files for a person or topic with `curl "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=NAME&srnamespace=6&format=json"` (curl works; Python urllib gets a 429) and `list=categorymembers&cmtitle=Category:NAME`.
   - Read each Commons file page with a web-fetch agent for the licence and author (CC BY, CC BY-SA, CC0 only). Note the size: under about 1200 px wide is an inset, not full screen.
   - YouTube links cannot be searched from here: use `yt-dlp` search queries (`ytsearch6:`) in the brief; the phone finds the videos.
2. **Build:** `node essay/media-kit.cjs <id>` writes `media-download.sh` (the Termux block: Commons images via `Special:FilePath?width=2400`, Commons videos, YouTube searches with `--match-filter duration`, `--write-info-json`), `media-candidates.md` (Openverse results with licence and creator) and `image-credits.md`. Give the user the whole block and ask for `<id>-media.zip`. Warn about big files (a 3-minute 1080p Commons video is about 67 MB: Wi-Fi).
3. **Ingest:** unzip into a fresh folder, then `node essay/media-kit.cjs <id> ingest <folder>`: copies to `projects/<id>/media/raw/` (git-ignored), writes `media-review.md` (size, length, title, uploader, link) and contact sheets in `media-review/`. LOOK at every sheet; drop wrong people, full films, watermarks, low quality.
4. **Use:** images become `[cut word img]` pictures (copy to `img/<name>.png`), `[shot]` cards or the base picture of a shot; clips are `[clip] file 0:03-0:20 mute | Title, Uploader` B-roll (or `sound` with the voice ducked). Keep every clip under 25 s and about 25 s of borrowed footage per 90-second part, always credited on screen and in the description, always with the narrator talking over it.
5. **Credits:** fill `image-credits.md` into the post description. CC BY and BY-SA need the author, the licence and a note that images were cropped or recoloured.

## Rules
- Real people: public figures (a tribute, a news story) may appear in licensed or credited material; never private people, never AI faces of real people, never news-agency photos or recent social posts we cannot clear.
- Prefer Commons, Openverse CC0/BY/BY-SA, NASA, government and official trailers. Never rip full films or paid streams.
- Footage is evidence and decoration for the narration, not the content. If a clip carries the whole shot, shorten it.
- Record what worked (queries that found good material, sites that blocked) in `docs/LESSONS.md`.

Worked example: `projects/es04/media-brief.json` (the Pete Edochie tribute).
