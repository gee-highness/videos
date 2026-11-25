# Media notes for es01 (read with media.md)

## Clips: what each one is for, and what to check
- `hayu-monologue.mp4` (Hayu's "Karen delivers a monologue to remember in part 1 of the #RHOLDN reunion"): plays full frame with its sound in the chapter "The read", right after the history lesson, with the lines as captions. **Watch it once** and set the times in `script.md` (`[clip] ... 0:00-0:30` is the part used; the `[subs]` times are seconds into that part). If the file is missing, the video uses the typed quote cards instead (that is on purpose).
- `hayu-hell.mp4` ("Oh, Karen wasn't done by the way", Hayu): meant to be the Part 2 "hell is not a place for Amanda ... I got Jesus" moment. **Check it is that moment**; if it is another one, use the Part 2 clip embedded in the Reality Tea article (https://www.realitytea.com/2026/11/23/rhol-reunion-part-2-karen-amanda-hell-dig/) instead and keep the same file name. Missing file: the typed quote stays.
- `hayu-backstage.mp4` ("Amanda and Karen take some time to reflect backstage at the reunion", Hayu): silent B-roll under the narrator's reunion intro. Optional: the video works without it.
- Optional: a short clip of The View segment (a fan upload exists: https://www.youtube.com/shorts/uWE2SxTXwRY; prefer ABC's own clip if you find one). Add `[when the-view.mp4]` + `[clip]` lines before the Whoopi line in `script.md`.

## Posts (screenshot them on your phone: Instagram and X need a login)
Look in each person's Instagram, or open the Complex article, which embeds several of them: https://www.complex.com/pop-culture/a/bernadette-giacomazzo/sza-vybz-kartel-questlove-low-budget-vagina-amanda
- `post-sza.png`: SZA, "Oh I'm starting episode one TONIGHT ... Ain't seen nobody cleared this crazy since Phaedra."
- `post-questlove.png`: Questlove, "This is the first time I've paid attention to housewives ... She brung the ruckus!"
- `post-vybz.png`: Vybz Kartel's post about the "low budget" song
- `post-huger.png`: Karen Huger, "From one Karen to another darling, I had to put my tea down for that one. Take your crown."
Crop to the post only (no phone status bar, no notifications). Until you add them, the typed quotes appear instead.

## Rules for borrowed media
- Each clip under ~25 s, about 70 s of footage in the whole video, every clip credited on screen (done automatically from the `|` credit).
- Commentary around every clip (the narrator explains or reacts; the clip is never just played).
- Screenshots show the headline only, with the publisher named on screen.
- YouTube may still flag the video for a claim; that is the publisher's choice, not an error.

## Stand-ins used in the posted cut (Nov 2026), each with a SUBSTITUTE sticker on screen
| Wanted | Used instead | To replace with the real thing |
|---|---|---|
| `hayu-backstage.mp4` (reunion footage, shot 31) | CC BY 2.0 photo of Katherine Ryan (the host), `media/katherine-ryan.jpg` | add the clip, restore the `[clip]` line, remove the `[shot]` and `[sticker]` lines |
| Instagram post, SZA (shot 72) | CC BY-SA 4.0 portrait `media/post-sza.jpg`, her words quoted | add `post-sza.png`, use `[shot] post-sza.png | Instagram, SZA`, drop the sticker |
| Instagram post, Questlove (shot 73) | CC BY-SA 3.0 portrait `media/post-questlove.jpg`, words quoted | same with `post-questlove.png` |
| Instagram post, Karen Huger (shot 75) | CC0 portrait `media/post-huger.png`, words quoted | same with `post-huger.png` |
| Instagram post, Vybz Kartel (shot 74) | none (Wikimedia refused the download); the AI dancehall still and the narration carry the shot | add `post-vybz.png` and a `[shot]` line |
| `hayu-monologue.mp4`, `hayu-hell.mp4` | typed quote cards over AI stills (the script's own `[unless]` fallbacks) | add the clips; the `[when]` shots take over |
