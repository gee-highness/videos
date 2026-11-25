# Device-story posts: the whole workflow

How the 3D-device image sequences and videos (`ads/lunch-rush`, `ads/close-the-day`, `ads/every-screen`) are made, and everything learned
while making them. Follow this for any future post so it comes out right first time.

## 1. Start the local stack (never capture from production)
Production's demo sign-in is slow/stale ("Waking the demo up" loader in every shot), so capture from a local stack.
1. MongoDB (port 27117, database `servo_showcase`), then the API: `cd servo-api && .venv/bin/python run.py` (port 8000).
2. Web: `NEXT_PUBLIC_DEMO_URL=http://localhost:3000 npm run dev`. **That variable is essential**: the home-page showcase loads its app
   frames from `NEXT_PUBLIC_DEMO_URL` (default: production), so without it every capture fails with "no frame".
3. Warm the routes once with `curl` (`/pos/cashier`, `/pos/server`, `/pos/dashboard`, `/pos/management/*`, `/customer-menu/servo-demo/menu`):
   first compiles take 5-25 s and make captures time out.
4. Don't edit app source while a capture runs: the dev server recompiles and the frames vanish.
5. Processes get reaped when a container restarts: check `curl localhost:8000/api/health` before every run. Kill by pid (never `pkill -f`).

## 2. Data: seed, dress, tick
```
cd servo-api && set -a && . ./.env && set +a
python scripts/seed_demo_tenant.py --reset            # orders, staff, stock, suppliers (plain picture tiles)
python scripts/dress_demo_look.py                     # THE LOOK: real photos, warm light design, logo, tagline, banner photo
for t in 12:30 12:40 12:50 13:00 13:10 13:20 13:30 13:38; do python scripts/demo_tick.py --daily --now 2026-10-20T$t; done
```
- **Always run `dress_demo_look.py` after a `--reset`** (a reset puts the plain tiles back). It copies the public demo's dish and category photos and
  design from production's public endpoints (read only) and adds what production lacks: flame logo, tagline, WhatsApp link, food-photo banner,
  and the warm light theme (cream `#FFF8EC`, amber `#F5A300`, ember `#D9480F`, cards with shadow, pill buttons).
- The container clock is usually outside trading hours, so a real-time tick creates nothing. Tick at simulated lunch times (above) and give the
  browser the same time with `FAKE_NOW` (Playwright `ctx.clock.install`), so ticket ages read "20m" instead of "-372m".
- **Waiter view needs READY orders**, or it shows "No Orders Ready". After ticking, mark two preparing orders ready (`orders.status = "ready"`).

## 3. Capture
`ads/devices/capture-all.sh [baseUrl] [FAKE_NOW]` runs waiter, kitchen, cashier, guest, manager **sequentially**. One role alone:
`FAKE_NOW=... NODE_PATH=$(npm root) node ads/devices/capture.js http://localhost:3000 manager`.
- Four+ in parallel overload a 4-core box (load 12): the sign-in never finishes and shots show the "Signing in..." loader. Max 2-3, or sequential.
- The script waits for the sign-in text to go and gives clicks 30 s. If a shot still shows a loader, a modal or empty data: **reject it and re-run**.
- The last showcase stage (manager) has no turn of its own: `capture.js` clamps the scroll (or manager shots are cropped at the top) and takes no
  "right" pose (borrowing the waiter stage's turn shows its sign-in loader). Use the manager "left" pose instead.
- The guest "home" shots use the menu page (the real home route is only the welcome modal).
- Devices are shrunk to 80% in the scene (`window.__servoFit`, set by `capture.js`; `FIT=0.8` env to change) so rotated/tilted poses are never clipped by the canvas. After capturing, check no shot has solid pixels touching its edge (alpha > 150 in the outer 2 px rows/columns) before composing.
- Toast popups ("Item added", "Report Generated") are hidden by CSS during capture.
- **Look at every PNG** before composing. Reject: loader, welcome modal, empty states, cut-off devices, overlapping text.

## 4. Compose the slides
`python3 ads/devices/trim.py && node ads/devices/make-stories.js` -> `ads/<slug>/images/` (1080x1080) and `images/status/` (1080x1920).
Each slide takes its own gradient from `PALETTES` in `make-stories.js` (ember, amber, teal, berry, ocean, plum), cycling so neighbours differ,
the call-to-action slide is always ember. White text stays readable on all of them; chip text uses the palette's deep `ink`. Add a palette there.
Copy and calendar per story live in `ads/<slug>/CAMPAIGN.md`.

### Other promo sets (same palette)
- `ads/theme.js` holds the shared palettes. The generators in `ads/ask`, `ads/story` and `ads/launch/interim` read them (`vars(i)` sets CSS variables on
  `<body>`; slides use `var(--c1) var(--c2) var(--c3)` and `var(--ink)`).
- Sets with no generator (the launch posts `ads/launch/images/p01-p14`) are retinted by `python3 ads/recolor.py <folder> --palettes ember,amber,teal,berry,ocean --first 1`.
  It only recolours the large purple background touching the image border (plus letter counters inside it) and turns lilac text cream; chips, cards,
  screenshots and device frames stay as drawn. Run it ONCE per original (it works from the purple); `git checkout` the folder to start over.
- The guest phone screens in `ads/story/raw` come from `node ads/story/capture-guest.js` (places and then removes a test order on the local stack); the phone poster in the ask-status image is `public/showcase/guest.webp`. Re-run both after any menu redesign. The ask feed image still embeds `src/lib/og-assets/tablet.jpg` (till screen, unchanged).

## 5. Videos
`node ads/video/make-video.js <imagesDir> <out.mp4> [--seconds 2.6] [--first 3] [--last 4]` (dynamic style by default; `--classic` for the old one).
Dynamic style = a centred camera move (push in / pull out, small enough to stay inside the slides' 3% clear edge: pans and edge drifts crop devices) and a different transition (slide, circle-open, smooth, wipe,
zoom, diagonal) on every slide, a punch-in on the opening slide, a calm ease on the call to action, and an amber progress bar filling across the
video (bottom edge on square; just under WhatsApp's top bar on tall). Most viewers watch muted: the slides carry all the copy.
- Facebook: `ads/<slug>/images` -> `ads/<slug>/video/<slug>-facebook.mp4`.
- WhatsApp Status: `ads/<slug>/images/status` -> `<slug>-whatsapp.mp4` with `--seconds 2.6 --first 3 --last 4`; keep it <= 30 s.
- Check with `ffprobe` (h264, yuv420p, faststart, size) and look at 3 extracted frames. Keep files under ~15 MB.
- Music: none (needs a licensed track from the owner; do not fetch one).

## 6. Customer app fixes that came out of this work
- The menu page passed the logo width as a bare number, which Chakra reads as a size token (80 = 320 px). Now `"80px"`.
- The "Aa" accessibility button sits bottom right above the cart (it used to hide the top-right corner of banners and the logo).
- The financial report no longer filters to the signed-in manager's own sales (it showed "No Data Available" for managers); the employee filter still works.
- The demo seed's banner is a real photo (`BANNER_PHOTO`), not the purple gradient.

## 7. Ship
Commit images and videos (not raw `shots/`, which are git-ignored scratch), push to the working branch, update `ads/README.md`, send the files to
the owner. Remind them: the PRODUCTION demo only looks like this after its secrets and `DEMO_REFRESH=on` are set and "Demo weekly reset" is run
(and a reset there also needs `dress_demo_look.py` pointed at the production database).
