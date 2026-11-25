# Plan: more videos

Builds on `make-video.js` (slow push-in, crossfades, ffmpeg only). No new tooling needed except where noted.
Queue after the 4 device-story videos (lunch-rush, close-the-day × Facebook 1080x1080, WhatsApp 1080x1920) ship.

## Batch A: reuse existing image sets (cheap, no new capture)
| # | Video | Source images | Formats | Length |
|---|---|---|---|---|
| 1 | every-screen | `ads/every-screen/images` (+`status/`) | FB + WhatsApp | ~25 s |
| 2 | story (one busy evening) | `ads/story/images` (10 slides) | FB + WhatsApp | ~30 s |
| 3 | launch teaser (founding 10 spots) | pick 5 strongest of `ads/launch/images` | FB + WhatsApp | 15 s |
| 4 | ask the public | `ads/ask/images` (+status) | WhatsApp | 15 s |

Output: `ads/<slug>/video/<slug>-facebook.mp4` and `-whatsapp.mp4`. WhatsApp ≤ 30 s (`--seconds 2.6 --first 3 --last 4`).

## Batch B: short loops (new, small)
- 6 s silent loop per role (guest phone, till, kitchen, waiter, owner laptop) from the trimmed device PNGs: slow 360° feel using the front/left/right/back poses as 4 frames, `--seconds 1.2 --fade 0.4`. Good for ad creatives and the website hero.
- Needs a `--loop` flag in `make-video.js` (last frame fades to first). Small change.

## Batch C: with sound / captions (ask the user first)
- Burn captions (one line per slide, from `CAMPAIGN.md`) with ffmpeg `drawtext`; add `--captions captions.json`.
- Optional royalty-free music bed: needs a licensed track from the user; do not fetch one.

## Batch D: later, depends on traction
- `spotlight/` testimonial video: only after 2+ restaurants have real results and consent (see `docs/POSTING_PLAN.md` section 3).
- Real screen recording of a live order (Playwright `recordVideo` against the local demo): phone, 20 s, cart → pay → kitchen ticket. Highest trust, highest effort.

## Order of work
1. Finish the 4 device-story videos (in progress).
2. Batch A (4 videos, ~8 files). Verify each with ffprobe (h264, yuv420p, faststart) and eyeball 3 frames.
3. Batch B after adding `--loop`.
4. Ask the user before C and D.
5. Update `ads/README.md` (status column, posting order), commit to `ccr-e2e361f6-2yhwrj`, deliver via `SendUserFile`. PR only on request.

## Rules
- Keep every file under ~15 MB (WhatsApp/Facebook friendly); lower `--fps 24` or CRF if over.
- Claims stay within `docs/POSTING_PLAN.md` section 3.
- Demo data must be fresh (re-seed + tick) before any new capture.
