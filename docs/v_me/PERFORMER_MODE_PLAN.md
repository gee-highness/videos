# Performer Mode — Implementation Plan

> **Status: implemented** (P0–P5). Usage and the script reference are in
> [`PERFORMER_MODE.md`](PERFORMER_MODE.md). Deviations from this plan: the
> look-direction field is `target` (because `at` is the start time); `offset`
> is relative to the time a cue would otherwise start; the performer applies
> frames to the VRM directly instead of writing `AppComponent`'s tracking
> targets (performer mode simply skips the tracking loop).

**Goal:** let V-Me's avatar be driven by an imported *performance script*
(`*.vme.json`) instead of the webcam and microphone, so a script author (a
person, or Claude) can write a scene — lines of dialogue, expressions,
gestures, walking, camera cuts, captions — and V-Me performs it and renders it
to a finished video (e.g. a 9:16 short).

An example script lives at
[`performances/how-vme-was-built.vme.json`](../performances/how-vme-was-built.vme.json).

---

## 1. How the avatar is driven today

Everything flows through `AppComponent` (`src/app/app.component.ts`):

| Channel | Written by | Consumed in |
|---|---|---|
| Head rotation `targetPitch/Yaw/Roll` | `startFaceTracking()` callback (Kalidokit `Face.solve`) | `startSmoothUpdateLoop()` → `threeService.updateHeadRotation()` |
| Head translation `targetTx/Ty/Tz` | face transform matrix | same loop |
| Blendshapes `targetBlendshapes` (ARKit names: `jawOpen`, `mouthPucker`, `eyeBlinkLeft`…) | MediaPipe `faceBlendshapes` | loop maps ARKit → VRM (`aa`, `ou`, `ih`, `oh`, `blinkLeft`, `happy`…) → `threeService.applyBlendshape()` |
| Body/hand pose `targetPoseRotations` (Kalidokit bone names → Euler) | Kalidokit `Pose.solve` / `Hand.solve` | loop → `threeService.updatePoseRotation()` |
| Expressions (`happy`, `angry`, `sad`, `relaxed`, `surprised`) | UI / keys 1-5 | `threeService.setExpressionTarget()` |
| Gestures (`wave`, `nod`, `shake`, `bow`) | UI buttons | `threeService.playGesture()` |
| Walking | `InputSource` (`KeyboardInputSource`, `JoystickInputSource`, `DPadInputSource`) → `WalkController` | `EnvironmentService.update(dt)` |
| Camera | `setCameraPreset()`; in walk mode `SelfieRig` / `PlacedRig` (markers such as `stand-tv`) | `EnvironmentService` |
| Recording | `toggleRecording()` → `canvas.captureStream(24)` + `MediaRecorder` → WebM download | — |

**What this means:** every channel already goes through a *target → smooth →
apply* pipeline. A performer only needs to write the same targets. The
tracking code does not need to change.

### Gaps found during review

1. **No avatar file is shipped.** `public/avatars/avatars.json` references
   `avatars/default.vrm`, which is not in the repo. Headless rendering needs a
   bundled VRM whose licence allows redistribution.
2. **Loading an avatar starts webcam tracking automatically**
   (`loadBundledModel` → `startFaceTracking`). Performer mode must skip this.
3. **The loop zeroes all targets while `isCameraEnabled` is false.** Performer
   mode must bypass that branch.
4. **Audio lip-sync is not wired.** The `AudioAnalyzerService` from commit
   `ef2c6b9` no longer exists. `services/camera.service.ts` contains an unused
   `AnalyserNode` volume meter that can be reused. Today the mouth moves only
   through webcam `jawOpen`.
5. **The render loop runs on wall-clock time.** It uses `performance.now()`,
   throttled to 30 fps. That is fine live, but a headless render needs a
   controllable clock to get frame-perfect output.
6. **The recorder is fixed at 24 fps, 2.5 Mbps WebM, sized to the window.**
   Shorts need 1080×1920 at 30 fps.
7. **The gesture set is small** (4 gestures). Scripts will want `point`,
   `shrug`, `think`, `clap`, `present`, `thumbsUp`.
8. **`EnvironmentService.setupInputAndControls` hard-codes its input
   sources.** It needs an injection point for a scripted input source.

---

## 2. Architecture

```
 .vme.json ──► PerformanceLoader (validate + resolve timing)
                     │
                     ▼
              PerformanceTimeline  (pure, deterministic: sample(t) → AvatarFrame)
                     │
         ┌───────────┼──────────────┬──────────────┬─────────────┐
         ▼           ▼              ▼              ▼             ▼
   head/blendshapes  pose/gestures  ScriptedInput   CameraDirector  Captions
   (AppComponent     (updatePose-   Source →        (presets, rigs, overlay
    targets)         Rotation)      WalkController  cuts, dolly)    (DOM/canvas)
                     ▲
   PerformerAudio ───┘  (plays line audio → AnalyserNode / viseme track → mouth)
                     │
                     ▼
              PerformanceClock  (realtime | fixed-step render)
                     │
                     ▼
     Recorder: live MediaRecorder  OR  frame-exact render (Playwright + ffmpeg)
```

### 2.1 Driver mode

Add `driverMode: 'tracking' | 'performer'` to `AppComponent`.

- `tracking` (default) keeps today's behaviour exactly.
- `performer` does not start the camera or MediaPipe. Each loop tick calls
  `performance.sample(clock.now())` and writes the result into the existing
  `target*` fields, then the unchanged smoothing and apply code runs.

A **hybrid** option (tracking for the body, script for the mouth, expressions
and camera) is cheap to add later. The performer writes only the channels a
cue touches.

### 2.2 `AvatarFrame` (the one contract)

```ts
interface AvatarFrame {
  head?: { pitch: number; yaw: number; roll: number };      // radians
  headOffset?: { x: number; y: number; z: number };
  blendshapes?: Record<string, number>;   // ARKit names, 0..1 (reuses the existing map)
  visemes?: Partial<Record<'aa'|'ih'|'ou'|'ee'|'oh', number>>; // applied directly to VRM
  expressions?: Record<string, number>;   // VRM expression weights
  pose?: Record<string, { x: number; y: number; z: number }>; // Kalidokit bone names
  eyeTarget?: { x: number; y: number };   // → threeService.setEyeLookAt
  move?: { dx: number; dz: number; run: boolean };           // → ScriptedInputSource
  camera?: CameraDirective;
  caption?: string | null;
}
```

### 2.3 New files

| File | Responsibility |
|---|---|
| `src/app/performer/performance.models.ts` | Script types (`PerformanceScript`, `Cue`), `AvatarFrame` |
| `src/app/performer/performance.schema.json` | JSON Schema, used by the UI importer and the CLI validator |
| `src/app/performer/performance-loader.ts` | Parse, validate, resolve `at`/`after` into absolute times, measure audio durations |
| `src/app/performer/performance-timeline.ts` | **Pure** `sample(t): AvatarFrame`. Envelopes (attack/hold/release), easing, layering. No DOM, fully unit-testable |
| `src/app/performer/procedural.ts` | Idle life: blinks (seeded random), micro head sway, breathing, gaze saccades, so the avatar never looks frozen |
| `src/app/performer/pose-library.ts` | Named poses/gestures as bone keyframes (`point`, `shrug`, `think`, `clap`, `present`, `thumbsUp`, plus ports of wave/nod/shake/bow) |
| `src/app/performer/performer-audio.service.ts` | Loads line audio, schedules it on one `AudioContext`, exposes a `MediaStreamAudioDestinationNode` for recording, drives lip-sync, and optionally reuses the ring-mod voice modulation |
| `src/app/performer/lipsync.ts` | (a) amplitude and band-energy → `aa/ih/ou/ee/oh`; (b) timed viseme track (Rhubarb/TTS phonemes) when available |
| `src/app/performer/scripted-input-source.ts` | `implements InputSource`. Feeds `WalkController` from the timeline (`walkTo` marker, `walk` direction) |
| `src/app/performer/camera-director.ts` | Camera cues: presets (`closeup`, …), placed rigs at markers, `orbit`, `dolly`, hard cuts vs. eased moves |
| `src/app/performer/performance-clock.ts` | `RealtimeClock` and `FixedStepClock` (advanced manually by the renderer) |
| `src/app/performer/performer.service.ts` | Orchestrates everything; exposes the `window.vme` automation API |
| `src/app/performer/captions.component.ts` | Styled caption overlay drawn onto the canvas, so it is recorded |
| `scripts/validate-performance.mjs` | CLI validator: `node scripts/validate-performance.mjs performances/x.vme.json` |
| `scripts/tts-performance.mjs` | Generates audio for every `say` cue (engine is pluggable), writes `*.wav` plus durations/visemes back into a resolved script |
| `scripts/render-performance.mjs` | Headless Playwright render → PNG frames → ffmpeg (audio mux, captions, 9:16) → `out/<title>.mp4` |

### 2.4 Changes to existing files (kept minimal)

- `app.component.ts`: add `driverMode`; gate `startFaceTracking()`; bypass
  the `!isCameraEnabled` zeroing in performer mode; let the loop take its time
  from `PerformanceClock`; add an *Import performance* button, play/pause/scrub
  controls and *Record performance*; recording pulls audio from
  `PerformerAudioService` in place of the microphone.
- `three-scene.service.ts`: `setRenderSize(w, h)` for a fixed 1080×1920 canvas;
  `renderOnce()` for the fixed-step render; make `applyIdleAnimation` switchable
  so it does not fight the procedural layer.
- `environment.service.ts`: `setupInputAndControls(..., inputSource?)` to
  inject `ScriptedInputSource`; `getMarker(id)` for `walkTo` and camera cues.
- `movement.controller.ts`: export the `InputSource` interface (it already
  is), no other change.
- `public/avatars/`: add a redistributable default VRM.

---

## 3. The performance script format (`.vme.json`, v1)

```jsonc
{
  "$schema": "../src/app/performer/performance.schema.json",
  "version": 1,
  "meta": {
    "title": "How V-Me was built",
    "author": "Claude",
    "format": { "aspect": "9:16", "width": 1080, "height": 1920, "fps": 30 }
  },
  "setup": {
    "avatar": "bundled-1",            // id from avatars.json, or a URL
    "scene": "studio",                // "studio" | "apartment-default"
    "background": "neonCity",         // none | greenScreen | streamingRoom | neonCity | nature
    "lighting": "studioSoft",
    "camera": "closeup",
    "props": { "sunglasses": false },
    "voice": {
      "engine": "file",               // "file" (pre-rendered) | "speechSynthesis" (preview only)
      "voiceId": "en-gb-southern_english_female-low",     // Piper voice id (see PERFORMER_MODE.md)
      "rate": 1.0,
      "modulationHz": 0               // existing ring-mod "Voice Disguise"
    },
    "idle": { "blink": true, "breathe": true, "sway": 0.3, "seed": 42 }
  },
  "cues": [ /* see below */ ]
}
```

### 3.1 Timing rules

- `at` (seconds) sets an absolute start time.
- Without `at`, a cue starts when the **previous blocking cue ends**.
  `say`, `walkTo` and `wait` block. Everything else is instant/overlay
  unless `"wait": true`.
- `offset` shifts a cue relative to the time it would otherwise start.
- `duration` / `hold` sets how long an expression or pose is held, with
  `fadeIn` / `fadeOut` envelopes (default 0.25 s).

### 3.2 Cue types

| `do` | Fields | Effect |
|---|---|---|
| `say` | `text`, `audio?`, `emotion?`, `caption?` (default = `text`) | Plays line audio, lip-syncs, shows the caption. Duration comes from the audio |
| `expression` | `name`, `weight?`, `duration?`, `fadeIn?`, `fadeOut?` | VRM expression envelope |
| `gesture` | `name` (wave, nod, shake, bow, point, shrug, think, clap, present, thumbsUp), `hand?`, `speed?` | Pose-library clip |
| `pose` | `name` or `bones{}` | Holds a static pose |
| `look` | `target`: `"camera"` \| `"left"` \| `"right"` \| `"up"` \| `"down"` \| `{x,y}`, `duration?` | Head and eye target |
| `head` | `pitch?`, `yaw?`, `roll?` (degrees), `duration?` | Explicit head motion |
| `walkTo` | `marker` (e.g. `stand-tv`, `spawn-default`), `run?` | Scripted walk, via physics (apartment scene) |
| `walk` | `direction {dx,dz}`, `seconds`, `run?` | Scripted walk for a fixed time |
| `camera` | `preset` (`closeup` / `halfbody` / `fullbody`) \| `rig` (`selfie` / `placed`) + `marker?`, `move?` (`cut` / `ease` / `dolly` / `orbit`), `duration?` | Camera direction |
| `background` / `lighting` / `prop` | `value` | Scene changes |
| `emoji` | `value` \| null | Floating emoji (existing feature) |
| `caption` | `text` \| null, `style?` (`title` / `subtitle` / `lower-third`) | On-screen text not tied to speech |
| `voice` | `modulationHz` | Change voice modulation mid-scene |
| `wait` | `seconds` | Pause |
| `mark` | `name` | Named label for `after: "<mark>"` and editor scrubbing |

---

## 4. Voice and lip-sync

**The hard constraint:** browser `speechSynthesis` cannot be routed into Web
Audio or `MediaRecorder`, so it is **preview-only**. Anything recorded must
come from audio files.

Pipeline:

1. `scripts/tts-performance.mjs` walks the `say` cues, generates one WAV per
   line, and writes `performances/<name>.resolved.json` with `audio`,
   `durationSec` and (when the engine provides it) a viseme track. Engines,
   pluggable:
   - **Your own voice:** record lines, name them `line-01.wav`…, no TTS needed.
   - **Piper** (offline neural TTS, runs in the container): no API key.
   - **Gemini TTS**: the project already uses `GEMINI_API_KEY`.
   - Any other provider behind the same small adapter interface.
2. Lip-sync, two tiers:
   - **Tier A (ships first):** an `AnalyserNode` on the line's audio. RMS gives
     jaw opening (`aa`). Band-energy ratios choose between `ih`/`ee` (bright),
     `ou`/`oh` (dark). A small attack/release smooths it. This reuses the
     `camera.service.ts` meter logic, and is deterministic in render mode
     because it is computed from decoded PCM, not live playback.
   - **Tier B:** a timed viseme track from Rhubarb Lip Sync (offline, on the
     WAV) or from TTS phoneme timings, mapped to VRM `aa/ih/ou/ee/oh`. This
     makes mouth shapes accurate.
3. The optional voice modulation (ring-mod) is applied in the same audio graph,
   so previews and renders sound identical.

---

## 5. Rendering

### 5.1 Live (in the app)

*Import performance* → *Play* → *Record performance*. This uses the existing
`MediaRecorder` path, with the canvas at the script's resolution, audio from
`PerformerAudioService`, and fps from `meta.format`. Good for quick takes on a
real device with a GPU.

### 5.2 Frame-exact (headless, the "make me a short" path)

`node scripts/render-performance.mjs performances/how-vme-was-built.vme.json`

1. Validate → TTS (if needed) → resolved script.
2. `ng build` → static server → Playwright Chromium opens
   `/?performer=1&render=1`. Performer mode never touches the camera or
   MediaPipe.
3. `await vme.load(resolvedScript)`; then for each frame
   `n = 0..N`: `await vme.renderFrame(n / fps)` → canvas `toBlob` → PNG.
   The clock is fixed-step, so output is identical on every machine,
   regardless of GPU speed.
4. ffmpeg: frames + mixed line audio (+ optional music bed with ducking) →
   H.264 MP4 at 1080×1920, 30 fps, `yuv420p`, `+faststart`. An `.srt` is
   exported from the `say`/`caption` cues (burned in, or kept as a sidecar).

### 5.3 Automation API (`window.vme`, only with `?performer=1`)

```ts
vme.load(script | url): Promise<ResolvedPerformance>
vme.play(); vme.pause(); vme.seek(t); vme.stop()
vme.renderFrame(t): Promise<void>      // fixed-step render
vme.duration: number
vme.state: { t, playing, activeCues }
vme.on('cue' | 'end', cb)
```

This is also how Claude "takes control". Claude writes a `.vme.json`, runs the
renderer, inspects frames (it can view the PNGs), adjusts the script, and
re-renders.

---

## 6. Delivery phases

| Phase | Scope | Done when |
|---|---|---|
| **P0 — Groundwork** | Bundled redistributable VRM; `driverMode`; tracking gated; `?performer=1`; fixed canvas size | App loads the avatar with no camera prompt in performer mode |
| **P1 — Timeline core** | Models, schema, loader, pure `PerformanceTimeline`, procedural idle, expressions/look/head/gesture cues, captions overlay, play/pause/seek UI, JSON import | The example script plays in the browser (silent), unit tests pass for timing resolution and `sample(t)` determinism |
| **P2 — Voice** | `PerformerAudioService`, Tier A lip-sync, `speechSynthesis` preview, `tts-performance.mjs` with a file engine + Piper | Lines play with a moving mouth; audio is included in *Record performance* |
| **P3 — Render pipeline** | `FixedStepClock`, `vme.renderFrame`, `render-performance.mjs`, ffmpeg mux, SRT | One command produces a 9:16 MP4 from the example script |
| **P4 — Body and world** | Pose library (point, shrug, think, clap, present, thumbsUp), `ScriptedInputSource`, `walkTo` markers, `CameraDirector` (placed rigs, dolly, orbit, cuts) | A script can walk the avatar from `spawn-default` to `stand-tv` while the camera cuts |
| **P5 — Polish** | Tier B visemes (Rhubarb), music bed + ducking, hybrid mode, in-app cue list editor with scrubbing, script templates | Accurate mouth shapes; the user edits scripts without touching JSON |

Testing on each phase: `ng test` unit specs for the loader/timeline/lipsync
(pure functions); a Playwright smoke test that renders the first 3 s of the
example script and asserts non-empty frames plus an audio track; ESLint.

---

## 7. Risks and decisions

- **Avatar licensing.** Only bundle a VRM whose licence permits
  redistribution and video use (VRoid sample models and many Booth models have
  explicit terms).
- **Headless WebGL.** Chromium in CI or containers uses SwiftShader (software).
  The fixed-step renderer makes this slow but correct. Budget roughly 0.2–1 s
  per frame at 1080×1920. A 45 s short is 1,350 frames.
- **Gesture conflicts.** `threeService.playGesture` and `applyIdleAnimation`
  write bones directly. Performer mode routes everything through the pose
  layer to prevent the two systems fighting.
- **Mirroring.** Scripts are authored in the avatar's own left/right. The
  performer forces `isMirrored = false` so "raise right hand" means the
  avatar's right.
- **Recommended build order:** P0 → P1 → P2 → P3 first. That already delivers
  "import a script, get a talking-avatar short". P4/P5 add walking and
  cinematography.
