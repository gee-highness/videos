# Kuina's Neighbourhood (the series brand)

Decided by the user, 27 Nov 2026: the show is **Kuina's Neighbourhood**, made as **Reels for now** (no long podcast episodes yet). Spelling: "Neighbourhood" (South African English).

## What it is
- A Reel series where Kuina (AI-generated host, private look in `hosts/kuina/`) tells a news or culture story fairly and sourced, then lets the street react.
- **The street** is a fictional cartoon neighbourhood on Kuina's TV: Mr Verdict (certain about everything), Gogo Zodwa (the wisdom), Lwazi (the child who asks the obvious question). Cast and style: `toons/lib.js` (`nbVerdict`, `nbGogo`, `nbLwazi`, `nbStreet`, `nbBoard`), episodes `toons/ep/nbNN.js`. Voices: en-ZA-LukeNeural, en-ZA-LeahNeural, en-US-AnaNeural.
- **Rules:** the cartoon characters are fictional and never stand for real people; no jokes about victims or injuries; the satire targets certainty in comment sections and the system, never the hurt. Facts are sourced on screen; `[host]` shots use the locked voice.

## Packaging
- Each story is one or two Reels of at most 90 s (`[part 2]`), plus 15-30 s cut-downs. Same opener/sign-off every time: "Dream big. Check your sources. See you in the next one."
- Hashtags: `#KuinasNeighbourhood` on every post, plus the story and local tags. Cover text names the episode, with the brand in a small tag.
- Title cards: "Kuina's Neighbourhood" with the street name or episode (es02 cards still say "The Neighbourhood"; update them on the next episode, see `projects/es02/illustrations/make.cjs` card() and `toons/ep/nb*.js` `series`).
- Name clash to remember: a US sitcom (*The Neighborhood*) and a band (*The Neighbourhood*) exist: always write "Kuina's Neighbourhood" in full.

## Later
- A video podcast (20-30 min: cold open, the story, a street skit, both sides, what you can do, sign-off) once the Reels have an audience. Not started.
