# Plan: device stories → images → 4 videos

Goal: 3 device stories (lunch-rush, close-the-day, every-screen) as image sequences, plus 4 videos:
2 stories × (WhatsApp 1080x1920, Facebook 1080x1080). Everything is already in the repo; only the generated assets are missing.

## State at hand-off
- PR #75 merged (taps fix, demo auto-refresh). Tooling exists: `ads/devices/capture.js`, `trim.py`, `make-stories.js`, `ads/video/make-video.js`, `ads/<slug>/CAMPAIGN.md`.
- `ads/devices/shots/trim/` holds STALE early guest shots (welcome modal / blank). Overwrite them.
- Production demo is stale until the user adds secrets + `DEMO_REFRESH=on` and runs "Demo weekly reset". Captures MUST come from the local stack, not production.

## Step 0: local stack (scratchpad: /tmp/claude-0/-home-user-servo-pos/cab24929-9759-5c16-8517-4504cbf3e72b/scratchpad/)
1. Start mongod (stack/mongo/bin/mongod, dbpath stack/data, port 27117) if not running.
2. API: `cd servo-api && .venv/bin/python run.py` (DATABASE_NAME=servo_showcase, port 8000). Verify `curl localhost:8000/api/health`.
3. Re-seed then tick so data looks live: `python scripts/seed_demo_tenant.py --reset` then `python scripts/demo_tick.py --force-daily` (check `--help`).
4. Web: `npm run dev` (port 3000), `.env.local` already points to the local API.
5. NOTE: scratchpad `lib.js` login targets PRODUCTION; capture.js must use the local URL. Check before running.
6. Avoid `pkill -f` patterns (kills own shell); kill by pid. Avoid foreground sleep >; no relative globs with rm.

## Step 1: capture (per role: guest, cashier, kitchen, waiter, manager)
- `SCREENS=<role> node ads/devices/capture.js` — run 3 processes in parallel (software GL is slow).
- Expect: transparent device PNGs, dev badge hidden, "Start Ordering" modal dismissed, poses settled (long waits).
- View every shot (Read the PNG). Reject: blank, loader, modal, overlapping text, cut-off device.

## Step 2: trim + compose
- `python3 ads/devices/trim.py`, then `node ads/devices/make-stories.js`.
- Outputs per story: `ads/<slug>/images/` (1080x1080) and `images/status/` (1080x1920).
- Read each slide; fix layout/copy in make-stories.js; re-run until clean. Copy per `ads/<slug>/CAMPAIGN.md`.

## Step 3: videos (4)
For lunch-rush and close-the-day:
- Facebook: `node ads/video/make-video.js ads/<slug>/images → ads/<slug>/video/<slug>-facebook.mp4`
- WhatsApp: same from `images/status/` → `<slug>-whatsapp.mp4`, `--seconds 2.6 --first 3 --last 4`, total ≤ 30 s.
- Verify with ffprobe (resolution, duration, h264, yuv420p, faststart); extract a few frames to eyeball.
- every-screen: images only unless user asks for videos.

## Step 4: ship
- Commit images + videos (check sizes; keep each file reasonable, no raw captures beyond trimmed set).
- Push to branch `ccr-e2e361f6-2yhwrj`; PR only when the user asks; ask before merging.
- `SendUserFile` the 4 videos (+ image sets) to the user, with a one-line caption each.
- Update `ads/README.md` with the file list and posting order.

## Done when
- No stale/modal shots remain; all slides viewed and clean; 4 mp4s play, correct sizes; files delivered; user told what is pending (secrets for live demo refresh).
