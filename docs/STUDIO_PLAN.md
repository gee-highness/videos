# Plan (saved for later): v_me as the studio for this repo

Owner's idea (Nov 2026): make v_me the software that produces any media made in this repo. Verdict: yes, if v_me becomes the studio that drives the production lines and does not swallow them.

## What v_me would own
- **One project format:** one script where each shot has a type: avatar scene, still with push and pan, clip, screenshot, quote card, cartoon. Today essays use `script.md` and v_me uses `.vme.json`.
- **One place to work:** project browser, timeline, preview, host / house / camera, consistent UI/UX.
- **One media library:** sources, credits and the SUBSTITUTE stickers beside the shots (see `docs/MEDIA_SOURCES.md`).

## What stays behind it (render backends v_me calls)
The essay compositor (`essay/`), the SVG cartoon engine (`toons/`), the orchestra (`orchestra/`), ffmpeg.

## Limits
1. The Android app cannot run Node and ffmpeg: editor and preview live in the app; heavy renders run in a cloud session or on a desktop.
2. 3D is slow in the cloud (software WebGL, about 2.3 s per frame at 540x960): avatar renders belong on a GPU (desktop or phone).

## Order
1. Define the shared project format (shot types) and convert one essay (es01) to it.
2. Studio section in v_me: open a project, preview its shots; avatar shots render live in the app.
3. v_me calls the essay, cartoon and orchestra engines for export.
4. Move cartoon drawing into v_me later, only if it earns its place.

Status: not started (waiting for the owner's go). First milestone: the format spec plus es01 converted, to approve before any app work.
