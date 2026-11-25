// Slideshow videos from the composed pictures: slow push-in on each slide and a short cross-fade. No sound (most people watch muted).
// Usage: node marketing/make-videos.mjs   -> marketing/out/video/<set>-<size>.mp4
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { SETS } from "./slides.mjs";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "marketing/out/video"); fs.mkdirSync(out, { recursive: true });
const SEC = 3.4, FADE = 0.45, FPS = 24;
for (const [key, set] of Object.entries(SETS)) for (const [size, W, H] of [["9x16", 1080, 1920], ["1x1", 1080, 1080]]) {
  const ids = [...set.slides.map((s) => s.id), key.slice(0, 2) + "-cta"];
  const files = ids.map((id) => path.join(root, "marketing/out", key, `${id}-${size}.png`));
  const args = ["-y", "-loglevel", "error"];
  files.forEach((f) => args.push("-i", f)); // one frame each: zoompan makes the frames of the push-in itself
  const framesOf = (i) => Math.round((SEC + FADE + (i === files.length - 1 ? 2.2 : 0)) * FPS);
  let fc = files.map((_, i) => `[${i}:v]zoompan=z='1.0+0.035*on/${framesOf(i)}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${framesOf(i)}:s=${W}x${H}:fps=${FPS},format=yuv420p,setsar=1[v${i}]`).join(";");
  let last = "v0", t = SEC;
  for (let i = 1; i < files.length; i++) { fc += `;[${last}][v${i}]xfade=transition=${["fade", "slideleft", "fade", "smoothleft"][i % 4]}:duration=${FADE}:offset=${(t).toFixed(2)}[x${i}]`; last = `x${i}`; t += SEC; }
  args.push("-filter_complex", fc, "-map", `[${last}]`, "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-threads", "4", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(out, `${key}-${size}.mp4`));
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  console.log("video", key, size);
}
