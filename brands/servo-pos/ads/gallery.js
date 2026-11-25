// "Your own app" gallery for WhatsApp Status (1080x1920): the six app-builder looks as phone renders (ads/one-screen/shoot-looks.js).
// Output: ads/app-gallery/images/status/gNN-*.png. Phones come from the public /app-gallery page: SAMPLE restaurant, say so on every slide.
// Usage: NODE_PATH=$(npm root) node ads/gallery.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { vars } = require("./theme");

const RAW = path.join(__dirname, "app-gallery", "raw");
const W = 1080, H = 1920, FOOT = "Sample restaurant · sample data · the real app builder";
const LOOKS = [
  ["classic", "Classic", "Bright, friendly and clear."], ["bistro", "Bistro", "Warm and classic, with a big welcome photo."],
  ["fresh", "Fresh", "Playful and rounded, leafy green."], ["midnight", "Midnight", "Dark and elegant, gold touches."],
  ["street", "Street", "Loud, bold and fast."], ["minimal", "Minimal", "Quiet, spacious and simple."],
];
const img = (n, x, y, h) => `<img src="file://${path.join(RAW, n + ".png")}" style="position:absolute;left:${x}px;top:${y}px;height:${h}px;filter:drop-shadow(0 26px 34px rgba(0,0,0,.35))">`;
const ar = 820 / 1600;
const common = (head, extra) => `<div class="brand">SERVO POS</div><div class="h">${head}</div>${extra}<div class="tag">Pick your look: servo-pos.vercel.app/app-gallery</div><div class="foot">${FOOT}</div>`;

const SLIDES = [];
// overview: six phones, two rows of three
SLIDES.push(common("Pick a look. Make it yours.", (() => {
  const h = 440, w = h * ar, gap = 30, x0 = (W - (3 * w + 2 * gap)) / 2;
  return LOOKS.map(([id], k) => img(id + "-home", x0 + (k % 3) * (w + gap), 560 + Math.floor(k / 3) * (h + 24), h)).join("") + `<div class="chip" style="top:1505px">Six looks to start from</div>`;
})()));
// one slide per look: home + menu
for (const [id, name, blurb] of LOOKS) {
  const h = 760, w = h * ar, gap = 40, x0 = (W - (2 * w + gap)) / 2;
  SLIDES.push(common(`The ${name} look.`, `<div class="sub">${blurb}</div>` + img(id + "-home", x0, 640, h) + img(id + "-menu", x0 + w + gap, 640, h) + `<div class="chip" style="top:1470px">Home and menu</div>`));
}
// call to action (offer text exactly as docs/POSTING_PLAN.md section 3)
const CTA = `<div class="brand">SERVO POS</div><div class="h" style="top:330px;font-size:112px">Your restaurant. Your own app.</div>
<div class="sub" style="top:760px;font-size:42px;font-weight:600">Your name, logo and colours on your guests' phones. No app store. Included on Standard and Multi-branch. Starter has the plain menu page.</div>
<div class="tag" style="top:1130px;font-size:46px;padding:22px 40px">servo-pos.vercel.app/app-gallery</div>
<div class="tag" style="top:1280px;background:#FFD54A;font-size:38px;padding:16px 32px">First 5 restaurants: 6 months free</div>
<div class="tag" style="top:1390px;background:rgba(255,255,255,.18);color:#fff;font-size:32px;padding:14px 28px">Restaurants 6 to 10: 3 months free</div>
<div style="position:absolute;left:64px;top:1540px;font-size:36px;font-weight:700">Rather chat? WhatsApp us: +268 7934 2380</div><div class="foot">${FOOT}</div>`;
SLIDES.push(CTA);

const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,sans-serif;width:${W}px;height:${H}px;overflow:hidden}
.s{position:relative;width:${W}px;height:${H}px;background:linear-gradient(160deg,var(--c1),var(--c2) 58%,var(--c3));color:#fff}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.h{position:absolute;left:64px;right:64px;top:290px;font-size:96px;font-weight:800;line-height:1.05}
.sub{position:absolute;left:64px;right:64px;top:430px;font-size:42px;line-height:1.3;opacity:.95}
.chip{position:absolute;left:64px;background:#fff;color:var(--ink);font-weight:800;border-radius:22px;padding:16px 26px;font-size:32px;box-shadow:0 14px 30px rgba(0,0,0,.28)}
.tag{position:absolute;left:64px;top:1610px;background:#fff;color:var(--ink);font-weight:800;border-radius:999px;font-size:34px;padding:18px 34px;white-space:nowrap}
.foot{position:absolute;left:64px;top:1750px;font-size:24px;opacity:.75}`;

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const dir = path.join(__dirname, "app-gallery", "images", "status");
  fs.mkdirSync(dir, { recursive: true });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  const names = ["overview", ...LOOKS.map((l) => l[0]), "cta"];
  for (const [i, body] of SLIDES.entries()) {
    const f = path.join(dir, ".tmp.html");
    const cta = i === SLIDES.length - 1;
    fs.writeFileSync(f, `<html><head><style>${css}</style></head><body style="${vars(cta ? 0 : i + 1)}"><div class="s">${body}</div></body></html>`);
    await page.goto("file://" + f);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, `g${String(i + 1).padStart(2, "0")}-${names[i]}.png`) });
    fs.unlinkSync(f);
  }
  console.log(`${SLIDES.length} slides`);
  await b.close();
})();
