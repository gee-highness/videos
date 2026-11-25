// Builds the two images for the "Ask the public" campaign (1080x1080) from the real-app screens used in the share card.
// Usage: NODE_PATH=$(npm root) node ads/ask/make-images.js
const { chromium } = require("playwright-core");
const { vars } = require("../theme");
const path = require("path");
const fs = require("fs");
const A = (n) => "file://" + path.join(__dirname, "..", "..", "src", "lib", "og-assets", n);
const OUT = path.join(__dirname, "images");
const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.s{width:1080px;height:1080px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--c1) 0%,var(--c2) 58%,var(--c3) 100%);color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.brand{position:absolute;left:64px;top:56px;font-weight:800;letter-spacing:.22em;font-size:24px;color:rgba(255,255,255,.85)}
.h{position:absolute;left:64px;right:64px;font-weight:800;line-height:1.02}
.tag{position:absolute;background:#FFD54A;color:var(--ink);font-weight:800;border-radius:999px;padding:14px 28px;font-size:30px;box-shadow:0 10px 24px rgba(0,0,0,.25);white-space:nowrap}
.phone{position:absolute;background:#0b0b0f;border:5px solid #8a8780;border-radius:60px;padding:12px;box-shadow:0 36px 60px rgba(0,0,0,.5)}
.phone img{display:block;width:100%;height:100%;border-radius:46px;object-fit:cover}
.pad{position:absolute;background:#17181d;border:4px solid #565966;border-radius:40px;padding:16px;box-shadow:0 36px 60px rgba(0,0,0,.5)}
.pad img{display:block;width:100%;height:100%;border-radius:20px;object-fit:cover}
.chip{position:absolute;background:#fff;color:var(--ink);font-weight:800;border-radius:20px;padding:16px 22px;font-size:26px;box-shadow:0 14px 30px rgba(0,0,0,.25);white-space:nowrap}
.tile{position:absolute;width:456px;height:150px;border-radius:26px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);display:flex;align-items:center;gap:22px;padding:0 26px;font-weight:700;font-size:29px;line-height:1.15}
.tile b{flex:0 0 64px;height:64px;border-radius:50%;background:#FFD54A;color:var(--ink);display:flex;align-items:center;justify-content:center;font-size:34px}
.foot{position:absolute;left:64px;bottom:34px;font-size:22px;opacity:.8}`;
const SLIDES = {
  "p01-imagine": `<div class="s"><div class="blob" style="right:-220px;top:-240px;width:760px;height:760px"></div><div class="blob" style="left:-240px;bottom:-280px;width:660px;height:660px"></div>
    <div class="brand">SERVO POS</div>
    <div class="h" style="top:130px;font-size:92px">Imagine your favourite restaurant on this.</div>
    <div class="chip" style="left:64px;top:560px">📱 Order ahead, skip the queue</div>
    <div class="chip" style="left:64px;top:650px;background:#FFD54A">🧾 Watch your order being made</div>
    <div class="chip" style="left:64px;top:740px">⭐ Earn rewards every visit</div>
    <div class="pad" style="left:520px;top:520px;width:330px;height:250px;transform:rotate(-4deg)"><img src="${A("tablet.jpg")}"></div>
    <div class="phone" style="left:790px;top:470px;width:240px;height:470px;transform:rotate(5deg)"><img src="file://${path.join(__dirname, "..", "..", "public", "showcase", "guest.webp")}"></div>
    <div class="tag" style="left:64px;top:880px">Which restaurant? Tell us below 👇</div>
    <div class="foot" style="left:auto;right:64px;bottom:34px">Demo screens, Servo Demo Kitchen</div></div>`,
  "p02-poll": `<div class="s"><div class="blob" style="right:-220px;top:-240px;width:760px;height:760px"></div>
    <div class="brand">SERVO POS</div>
    <div class="h" style="top:120px;font-size:78px">Your favourite restaurant has its own app. What do you use first?</div>
    <div class="tile" style="left:64px;top:430px"><b>1</b>Order ahead and skip the queue</div>
    <div class="tile" style="left:560px;top:430px"><b>2</b>Track my order live</div>
    <div class="tile" style="left:64px;top:610px"><b>3</b>Earn points and rewards</div>
    <div class="tile" style="left:560px;top:610px"><b>4</b>Book a table or join the waitlist</div>
    <div class="tile" style="left:64px;top:790px"><b>5</b>See the full menu with pictures</div>
    <div class="tile" style="left:560px;top:790px"><b>6</b>Something else (tell us!)</div>
    <div class="foot">Comment a number. Two if you can't choose.</div></div>`,
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [i, [name, html]] of Object.entries(SLIDES).entries()) {
    const f = path.join(__dirname, `.${name}.html`);
    fs.writeFileSync(f, `<html><head><style>${css}</style></head><body style="${vars(i)}">${html}</body></html>`);
    await p.goto("file://" + f); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, name + ".png") });
    fs.unlinkSync(f); console.log("saved", name);
  }
  await b.close();
})();
