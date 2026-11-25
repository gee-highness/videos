# Where footage and media come from

Every way to get pictures, screenshots and clips for a video, what works from a cloud session, what does not, and what to do instead. Read this before you promise a clip. Add to it after every job.

## The rule for stand-ins (owner's rule)
If the exact media cannot be had, use the closest honest substitute and **put a sticker on that part of the video** saying so. In `script.md`:
```
[sticker file photo of Katherine Ryan, the host. The reunion clip was not available]
```
The line goes under the shot. The engine shows a tilted yellow **SUBSTITUTE** label (plus your text) for the whole shot, 16:9 and 9:16. Never present a stand-in as the real thing, never make a fake screenshot of a post or a fake clip, and keep the credit line on screen too (`[shot] file | credit | url`).

## What works from a cloud session
| Source | Gets | How | Notes |
|---|---|---|---|
| **Press pages** (Bravo, Yahoo/HELLO!, PEOPLE, The Tab, Reality Tea, Complex, Wikipedia) | headline screenshots, tables | `node essay/capture.cjs <id>` (Playwright; list in `projects/<id>/capture.json`, modes `headline` or `selector`) | Show the headline only and name the publisher on screen |
| **Wikimedia Commons** | free-licence photos and a few videos (CC0, CC BY, CC BY-SA, public domain) | `python3 essay/tools/commons.py search "<name>"`, then `get "<File title>" out.jpg`, then `credit "<File title>"` | **Rate limited (429).** Send a User-Agent, wait 5 s or more between calls, use standard widths (320, 500, 960, 1280, 1920, 3840), back off 45 s on a 429. If the API keeps refusing, stop and try again later. Video search is poor for entertainment topics. Credit: author, licence, "via Wikimedia Commons" + the file page URL. CC BY-SA needs the credit on screen (the engine does it) |
| **Wikipedia infoboxes and tables** | screenshots | `capture.cjs`, mode `selector` | Credit "Wikipedia" |
| **Stock photos** (Creative Commons) | scene pictures | method in `docs/ESSAYS.md` ("Stock photos instead of AI images"); `projects/<id>/stock-queries.json`; credits in `image-credits.md` | Keep every credit |
| **AI stills** | scene pictures | `node essay/essay.cjs plan <id>` writes `prompts.md`; the owner makes them | The default look of an essay |
| **The owner's phone** | anything behind a login: Instagram, TikTok, X, YouTube clips | the owner screenshots or downloads; `media.md` lists exact file names and `media-download.sh` is a Termux script (`pip install yt-dlp`) that fetches the clips on the phone | Unzip into a fresh folder, copy to `projects/<id>/media/` with the listed names |
| **Public-domain video** (NASA, US government, Internet Archive) | space, military, archive footage | search Commons with `--video`, or archive.org | Only when it truly fits the story |

## What does NOT work (do not retry, do not work around)
| Source | Why | Instead |
|---|---|---|
| **YouTube / Shorts** (yt-dlp, curl) | "Sign in to confirm you're not a bot". Do not use cookies or tricks | The owner downloads on the phone (`media-download.sh`). Until then: `[when file]` / `[unless file]` fallbacks (typed quote over an AI still), or a stand-in with a sticker |
| **Instagram, X, TikTok posts** | need a login; embeds do not render for a headless browser | The owner's phone screenshots. Stand-in: a free-licence portrait of the person with the **quote typed beside it as a quote, not styled as a screenshot**, plus a sticker |
| **Streaming services** (Hayu, Peacock, Bravo) | DRM, paywalled, and not ours to copy | Short, credited clips the owner supplies; otherwise AI stills with typed quotes |
| **Pexels, Pixabay, Unsplash APIs** | need an API key we do not have | Ask the owner for a key (`request_credential`), or use Commons |
| **Fabricated media** | a faked post, quote card dressed as a screenshot, or invented clip would mislead | Never. Use a stand-in plus the sticker |

## Rules for borrowed media (every video)
- Clips short (each under about 25 s; about 70 to 90 s of borrowed footage in a whole video), always credited on screen, always with commentary around them.
- Screenshots show the headline only, with the publisher named.
- Real people: facts and quotes sourced (`research.md`); portraits only with a free licence and credit.
- Record each stand-in in `projects/<id>/media-notes.md` ("what we wanted / what is there instead / how to replace it") so the real thing can be dropped in later: add the file with the listed name, remove the `[sticker]` line, re-render.

## Sources log
Add a line per job: what was tried, what worked, what was blocked, so the next video starts ahead.
- es01 (Nov 2026): press screenshots by `capture.cjs` worked (10 pages). YouTube blocked yt-dlp. Instagram embeds not capturable. Commons found CC portraits of SZA (CC BY-SA 4.0), Questlove (CC BY-SA 3.0), Vybz Kartel (CC BY 4.0), Karen Huger (CC0, small), Katherine Ryan (CC BY 2.0); the Commons API and thumbnails rate-limited us after a burst of requests (429), so downloads must be paced.
