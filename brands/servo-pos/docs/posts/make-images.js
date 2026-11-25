// Builds the Facebook/WhatsApp post images from real app screenshots (capture-shots.js) and catchy layouts.
// Usage: NODE_PATH=$(npm root) node docs/posts/make-images.js
const { chromium } = require("playwright-core");
const path = require("path");
const S = (n) => "file://" + path.join(__dirname, "shots", n + ".png");
const BG = "linear-gradient(135deg,#25165e 0%,#5b3fd6 60%,#7c5cff 100%)";
const base = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.ph{filter:drop-shadow(0 30px 40px rgba(0,0,0,.45));position:absolute}
.tag{position:absolute;background:#FFD54A;color:#25165e;font-weight:800;border-radius:999px;padding:14px 26px;box-shadow:0 10px 24px rgba(0,0,0,.25)}
.chip{position:absolute;background:#fff;color:#25165e;font-weight:800;border-radius:18px;padding:16px 22px;box-shadow:0 14px 30px rgba(0,0,0,.25)}
.brand{position:absolute;font-weight:800;letter-spacing:.22em;color:rgba(255,255,255,.85)}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}`;
const wrap = (w, h, body, bg = BG) => `<html><head><style>${base}</style></head><body><div style="width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${bg};color:#fff">${body}</div></body></html>`;
const ph = (n, x, y, w, rot = 0, z = 1) => `<img class="ph" src="${S(n)}" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);z-index:${z}">`;

const IMAGES = {
  "fb-p01-teaser": [1200, 630, `<div class="blob" style="right:-140px;top:-140px;width:560px;height:560px"></div>
    <div class="brand" style="left:70px;top:60px;font-size:26px">SERVO POS</div>
    <div style="position:absolute;left:70px;top:130px;font-weight:800;font-size:84px;line-height:1.02">Your restaurant.<br>Your own app.</div>
    <div style="position:absolute;left:70px;top:350px;font-size:32px;line-height:1.35;max-width:620px;opacity:.95">Your name, your logo, your colours, on your guests' phones.</div>
    <div class="tag" style="left:70px;top:492px;font-size:30px">First 5 restaurants: 6 months FREE</div>
    ${ph("bistro-home", 800, 50, 300, 6, 2)}${ph("midnight-book", 960, 180, 250, 12, 1)}
    <div class="tag" style="left:380px;top:50px;font-size:22px;padding:8px 20px;background:#fff">Lands Monday 19 Oct</div>`],
  "fb-p01-teaser-square": [1080, 1080, `<div class="blob" style="right:-200px;top:-200px;width:700px;height:700px"></div>
    <div class="brand" style="left:70px;top:64px;font-size:28px">SERVO POS</div>
    <div style="position:absolute;left:70px;top:120px;font-weight:800;font-size:96px;line-height:1.02">Your restaurant.<br>Your own app.</div>
    ${ph("bistro-home", 90, 400, 420, -5, 2)}${ph("fresh-home", 400, 450, 400, 5, 1)}${ph("midnight-home", 690, 400, 370, 10, 0)}
    <div class="tag" style="left:70px;bottom:50px;font-size:34px;z-index:5">First 5 restaurants: 6 months FREE</div>
    <div class="tag" style="right:60px;bottom:50px;font-size:28px;background:#fff;z-index:5">Lands Monday</div>`],
  "fb-p26-own-app": [1200, 630, `<div class="blob" style="left:-160px;bottom:-200px;width:560px;height:560px"></div>
    <div style="position:absolute;left:64px;top:70px;font-weight:800;font-size:68px;line-height:1.05;max-width:560px">Pick a look.<br>Make it yours.<br>Press Publish.</div>
    <div style="position:absolute;left:64px;top:372px;font-size:28px;line-height:1.4;max-width:520px;opacity:.95">Logo, colours, tabs, home screen, pages. No app store. No developer.</div>
    <div class="tag" style="left:64px;top:500px;font-size:26px">On Standard and Multi-branch</div>
    ${ph("classic-home", 640, 70, 250, -6, 1)}${ph("bistro-home", 800, 30, 270, 2, 3)}${ph("midnight-home", 960, 90, 250, 8, 2)}`],
  "fb-p27-rewards": [1200, 630, `<div class="blob" style="right:-120px;top:-160px;width:520px;height:520px"></div>
    <div style="position:absolute;left:64px;top:60px;font-weight:800;font-size:66px;line-height:1.05;max-width:600px">Your rewards.<br>Your rules.</div>
    <div class="chip" style="left:64px;top:300px;font-size:28px">⭐ Points per E spent: you decide</div>
    <div class="chip" style="left:110px;top:390px;font-size:28px">🎁 Your own rewards, pictures and all</div>
    <div class="chip" style="left:64px;top:480px;font-size:28px;background:#FFD54A">📈 Double points on a slow Tuesday</div>
    ${ph("bistro-rewards", 830, 40, 310, 5, 1)}`],
  "fb-p28-six-looks": [1200, 630, `<div style="position:absolute;left:0;right:0;top:34px;text-align:center;font-weight:800;font-size:54px">Pick your look, then make it yours</div>
    ${["classic-home", "bistro-home", "fresh-home", "midnight-home"].map((n, i) => ph(n, 40 + i * 290, 130, 260, 0, 1)).join("")}
    <div class="tag" style="left:50%;transform:translateX(-50%);bottom:18px;font-size:24px;z-index:5">servo-pos.vercel.app/app-gallery</div>`],
  "fb-p29-bookings": [1200, 630, `<div class="blob" style="right:-120px;bottom:-200px;width:560px;height:560px"></div>
    <div style="position:absolute;left:64px;top:60px;font-weight:800;font-size:64px;line-height:1.05;max-width:620px">Book a table,<br>right in your app.</div>
    <div class="chip" style="left:64px;top:290px;font-size:27px">✅ No double bookings, ever</div>
    <div class="chip" style="left:100px;top:376px;font-size:27px">⏳ Waitlist that fills cancellations</div>
    <div class="chip" style="left:64px;top:462px;font-size:27px">🪑 Seat the guest at their table</div>
    ${ph("midnight-book", 830, 40, 310, -5, 1)}`],
  "fb-p09-pricing": [1200, 630, `<div style="position:absolute;left:0;right:0;top:28px;text-align:center;font-weight:800;font-size:50px">Simple monthly prices, all in E</div>
    ${[["Starter", "E350", "Till, kitchen screen, table QR, stock and reports"], ["Standard", "E750", "Everything in Starter + your own customer app", 1], ["Multi-branch", "E1,200", "For restaurants with more than one branch"]].map(([n, p, d, hot], i) =>
      `<div style="position:absolute;left:${60 + i * 370}px;top:${hot ? 112 : 142}px;width:340px;height:${hot ? 400 : 360}px;border-radius:28px;background:${hot ? "#fff" : "rgba(255,255,255,.14)"};color:${hot ? "#25165e" : "#fff"};padding:30px;box-shadow:0 20px 40px rgba(0,0,0,.3)">
        ${hot ? '<div style="position:absolute;top:-16px;left:30px;background:#FFD54A;color:#25165e;font-weight:800;border-radius:999px;padding:6px 16px;font-size:18px">Includes your own app</div>' : ""}
        <div style="font-weight:800;font-size:30px">${n}</div><div style="font-weight:800;font-size:64px;margin:14px 0 4px">${p}</div><div style="opacity:.8;font-size:20px;margin-bottom:18px">per month</div><div style="font-size:23px;line-height:1.35">${d}</div></div>`).join("")}
    <div class="tag" style="left:50%;transform:translateX(-50%);bottom:28px;font-size:26px">First 5 restaurants: 6 months FREE</div>`],
};

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  for (const [name, [w, h, body]] of Object.entries(IMAGES)) {
    const page = await b.newPage({ viewport: { width: w, height: h } });
    const html = path.join(__dirname, "shots", `.${name}.html`);
    require("fs").writeFileSync(html, wrap(w, h, body));
    await page.goto("file://" + html);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, name + ".png") });
    require("fs").unlinkSync(html);
    console.log("made", name);
  }
  await b.close();
})();
