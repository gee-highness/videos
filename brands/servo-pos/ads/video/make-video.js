// Turns a folder of post images into an MP4 for WhatsApp Status or Facebook: each image gets its own camera move (dynamic style: varied transitions, centred zooms, opening punch-in, progress bar; --classic for the plain push-in), slides crossfade,
// the first and last are held a little longer. Works on any set (1080x1080 for the Facebook feed, 1080x1920 for WhatsApp).
// Usage: node ads/video/make-video.js <imagesDir> <out.mp4> [--seconds 3] [--first 3.5] [--last 4.5] [--fade 0.5] [--zoom 0.045] [--fps 30]
// Needs ffmpeg with libx264 on the PATH. WhatsApp Status plays about 30 s per video, so keep tall sets to 10 slides at ~2.8 s.
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [dir, out] = process.argv.slice(2, 4);
if (!dir || !out) { console.error("usage: make-video.js <imagesDir> <out.mp4> [options]"); process.exit(1); }
const opt = (name, def) => { const i = process.argv.indexOf("--" + name); return i > 0 ? Number(process.argv[i + 1]) : def; };
const SEC = opt("seconds", 3), FIRST = opt("first", SEC + 0.5), LAST = opt("last", SEC + 1.5), FADE = opt("fade", 0.5), ZOOM = opt("zoom", 0.045), FPS = opt("fps", 30);

const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
if (files.length < 2) { console.error("need at least two images in", dir); process.exit(1); }
const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", path.join(dir, files[0])], { encoding: "utf8" });
const [W, H] = probe.stdout.trim().split("x").map(Number);
const dur = files.map((_, i) => (i === 0 ? FIRST : i === files.length - 1 ? LAST : SEC));

const STYLE = process.argv.includes("--classic") ? "classic" : "dynamic";
// Dynamic: a different camera move and transition on every slide, a punch-in on the opening slide and a progress bar that fills as the video plays,
// so a muted, scrolling viewer keeps getting a reason to stay. --classic keeps the plain push-in and cross-fade.
const TRANSITIONS = STYLE === "classic" ? ["fade"] : ["slideleft", "circleopen", "smoothup", "wipeleft", "zoomin", "slideup", "smoothright", "diagtl"];
const total = () => t + dur[files.length - 1] + FADE;

const args = ["-y", "-hide_banner", "-loglevel", "error"];
files.forEach((f) => args.push("-i", path.join(dir, f)));
const parts = [];
files.forEach((_, i) => {
  const frames = Math.round((dur[i] + FADE) * FPS);
  const ctr = "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'";
  // centred zooms only, small enough to stay inside the slides' 3% clear edge: pans and top/bottom drifts would crop devices and text
  const moves = STYLE === "classic"
    ? [[`1+${ZOOM}*on/${frames}`, ctr], [`${1 + ZOOM}-${ZOOM}*on/${frames}`, ctr]]
    : [
        [`1+${ZOOM * 0.8}*on/${frames}`, ctr], // push in
        [`${1 + ZOOM * 0.8}-${ZOOM * 0.8}*on/${frames}`, ctr], // pull out
        [`1+${ZOOM * 0.6}*on/${frames}`, ctr], // slower push in
        [`${1 + ZOOM * 0.8}-${ZOOM * 0.8}*on/${frames}`, ctr], // pull out
      ];
  let [z, xy] = moves[i % moves.length];
  if (STYLE === "dynamic" && i === 0) [z, xy] = [`max(1,${1 + ZOOM * 1.2}-${ZOOM * 1.2}*on/${Math.round(FPS * 0.9)})`, ctr]; // opening punch: settle from a close crop
  if (STYLE === "dynamic" && i === files.length - 1) [z, xy] = [`1+${ZOOM * 0.8}*on/${frames}`, ctr]; // the call to action eases in, calm
  parts.push(`[${i}:v]scale=${W * 2}:${H * 2}:flags=lanczos,zoompan=z='${z}':${xy}:d=${frames}:s=${W}x${H}:fps=${FPS},setsar=1,format=yuv420p[v${i}]`);
});
let last = "v0", t = 0;
for (let i = 1; i < files.length; i++) {
  t += dur[i - 1]; // each clip carries FADE extra seconds, which the next one overlaps
  parts.push(`[${last}][v${i}]xfade=transition=${TRANSITIONS[(i - 1) % TRANSITIONS.length]}:duration=${FADE}:offset=${t.toFixed(3)}[x${i}]`);
  last = `x${i}`;
}
if (STYLE === "dynamic") {
  const barH = Math.round(H * 0.011), barY = H > W ? Math.round(H * 0.062) : H - barH; // tall: below WhatsApp's own top bar; square: the bottom edge
  args.push("-f", "lavfi", "-t", total().toFixed(2), "-i", `color=c=0xFFB020:s=${W}x${barH}:r=${FPS}`);
  parts.push(`[${last}][${files.length}:v]overlay=x='-w+w*t/${total().toFixed(3)}':y=${barY}:shortest=1,format=yuv420p[out]`);
  last = "out";
}
args.push("-filter_complex", parts.join(";"), "-map", `[${last}]`, "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(FPS), "-movflags", "+faststart", "-an", out);
fs.mkdirSync(path.dirname(out), { recursive: true });
const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status || 1);
const info = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration,size", "-of", "csv=p=0", out], { encoding: "utf8" }).stdout.trim().split(",");
console.log(`${out}: ${W}x${H}, ${Number(info[0]).toFixed(1)} s, ${(Number(info[1]) / 1e6).toFixed(1)} MB, ${files.length} slides`);
