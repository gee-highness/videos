// The two "Ask the public" images as 1080x1920 for WhatsApp Status and Stories (make-images.js makes the 1080x1080 feed versions).
// WhatsApp covers roughly the top 170 px and bottom 200 px, so content stays between.
// Usage: NODE_PATH=$(npm root) node ads/ask/make-status.js   (writes images/status/)
const { chromium } = require("playwright-core");
const { vars } = require("../theme");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "images", "status");
fs.mkdirSync(OUT, { recursive: true });
const asset = (...p) => "file://" + path.join(__dirname, "..", "..", ...p);
const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.s{width:1080px;height:1920px;position:relative;overflow:hidden;background:linear-gradient(160deg,var(--c1) 0%,var(--c2) 58%,var(--c3) 100%);color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.h{position:absolute;left:64px;right:64px;font-weight:800;line-height:1.03}
.tag{position:absolute;background:#FFD54A;color:var(--ink);font-weight:800;border-radius:999px;padding:18px 36px;font-size:38px;box-shadow:0 12px 28px rgba(0,0,0,.28);white-space:nowrap}
.chip{position:absolute;background:#fff;color:var(--ink);font-weight:800;border-radius:24px;padding:20px 30px;font-size:36px;box-shadow:0 16px 34px rgba(0,0,0,.28);white-space:nowrap}
.phone{position:absolute;background:#0b0b0f;border:6px solid #8a8780;border-radius:64px;padding:13px;box-shadow:0 40px 70px rgba(0,0,0,.5)}
.phone img{display:block;width:100%;height:100%;border-radius:50px;object-fit:cover;object-position:top}
.pad{position:absolute;background:#17181d;border:5px solid #565966;border-radius:44px;padding:18px;box-shadow:0 40px 70px rgba(0,0,0,.5)}
.pad img{display:block;width:100%;height:100%;border-radius:22px;object-fit:cover}
.tile{position:absolute;left:64px;width:952px;height:140px;border-radius:30px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);display:flex;align-items:center;gap:28px;padding:0 34px;font-weight:700;font-size:40px;line-height:1.15}
.tile b{flex:0 0 76px;height:76px;border-radius:50%;background:#FFD54A;color:var(--ink);display:flex;align-items:center;justify-content:center;font-size:40px}
.foot{position:absolute;left:64px;bottom:196px;font-size:26px;opacity:.85}`;
const SLIDES = {
  "p01-imagine": `<div class="s"><div class="blob" style="right:-260px;top:-240px;width:900px;height:900px"></div><div class="blob" style="left:-300px;bottom:-320px;width:760px;height:760px"></div>
    <div class="brand">SERVO POS</div>
    <div class="h" style="top:290px;font-size:98px">Imagine your favourite restaurant on this.</div>
    <div class="chip" style="left:64px;top:770px">📱 Order ahead, skip the queue</div>
    <div class="chip" style="left:64px;top:880px;background:#FFD54A">🧾 Watch your order being made</div>
    <div class="chip" style="left:64px;top:990px">⭐ Earn rewards every visit</div>
    <div class="tag" style="left:64px;top:1130px;font-size:34px">Which restaurant? Reply here 👇</div>
    <div class="pad" style="left:50px;top:1290px;width:500px;height:375px;transform:rotate(-4deg)"><img src="${asset("src", "lib", "og-assets", "tablet.jpg")}"></div>
    <div class="phone" style="left:610px;top:1230px;width:380px;height:480px;transform:rotate(5deg)"><img src="${asset("public", "showcase", "guest.webp")}"></div>
    <div class="foot">Demo screens, Servo Demo Kitchen</div></div>`,
  "p02-poll": `<div class="s"><div class="blob" style="right:-260px;top:-240px;width:900px;height:900px"></div>
    <div class="brand">SERVO POS</div>
    <div class="h" style="top:290px;font-size:76px">Your favourite restaurant has its own app. What do you use first?</div>
    ${["Order ahead and skip the queue", "Track my order live", "Earn points and rewards", "Book a table or join the waitlist", "See the full menu with pictures", "Something else (tell us!)"].map((t, i) => `<div class="tile" style="top:${640 + i * 160}px"><b>${i + 1}</b>${t}</div>`).join("")}
    <div class="foot" style="font-size:30px">Reply with a number. Two if you can't choose.</div></div>`,
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, [name, html]] of Object.entries(SLIDES).entries()) {
    const f = path.join(__dirname, `.${name}.html`);
    fs.writeFileSync(f, `<html><head><style>${css}</style></head><body style="${vars(i)}">${html}</body></html>`);
    await p.goto("file://" + f); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, name + ".png") });
    fs.unlinkSync(f); console.log("saved", name);
  }
  await b.close();
})();
