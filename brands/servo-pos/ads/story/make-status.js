// Builds the "One busy evening" sequence as 1080x1920 images for WhatsApp Status, Stories and Reels covers, from the same real
// demo-app screenshots in ./raw as make-story.js. WhatsApp covers roughly the top 170 px and bottom 200 px, so content stays between.
// Usage: NODE_PATH=$(npm root) node ads/story/make-status.js   (writes images/status/)
const { chromium } = require("playwright-core");
const { vars } = require("../theme");
const path = require("path");
const fs = require("fs");
const R = (n) => "file://" + path.join(__dirname, "raw", n + ".png");
const OUT = path.join(__dirname, "images", "status");
fs.mkdirSync(OUT, { recursive: true });

const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.s{width:1080px;height:1920px;position:relative;overflow:hidden;background:linear-gradient(160deg,var(--c1) 0%,var(--c2) 58%,var(--c3) 100%);color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.step{position:absolute;right:64px;top:194px;font-weight:800;font-size:28px;background:rgba(255,255,255,.16);border-radius:999px;padding:9px 22px}
.h{position:absolute;left:64px;right:64px;top:290px;font-weight:800;font-size:80px;line-height:1.04}
.sub{position:absolute;left:64px;right:64px;top:540px;font-size:36px;line-height:1.35;opacity:.95}
.tag{position:absolute;background:#FFD54A;color:var(--ink);font-weight:800;border-radius:999px;padding:16px 32px;font-size:36px;box-shadow:0 12px 28px rgba(0,0,0,.28);white-space:nowrap}
.chip{position:absolute;background:#fff;color:var(--ink);font-weight:800;border-radius:22px;padding:18px 26px;font-size:32px;box-shadow:0 16px 34px rgba(0,0,0,.28);white-space:nowrap}
.foot{position:absolute;left:64px;bottom:196px;font-size:24px;opacity:.75;letter-spacing:.02em}
.phone{position:absolute;background:#0f0a2a;border-radius:50px;padding:11px;box-shadow:0 34px 60px rgba(0,0,0,.5);overflow:hidden}
.phone img{display:block;width:100%;border-radius:40px}
.cap{position:absolute;text-align:center;font-weight:700;font-size:26px;opacity:.92}
.win{position:absolute;background:#fff;border-radius:18px;box-shadow:0 34px 60px rgba(0,0,0,.5);overflow:hidden}
.win .bar{height:38px;background:#e9e6f7;display:flex;align-items:center;gap:8px;padding:0 16px;font-size:16px;color:#4a4670}
.win .bar i{width:12px;height:12px;border-radius:50%;background:#b9b3e0;display:inline-block}
.win img{display:block;width:100%}`;
const foot = `<div class="foot">Servo Demo Kitchen · demo data · real app screens</div>`;
const phone = (n, x, top, w, crop, rot = 0) => `<div class="phone" style="left:${x}px;top:${top}px;width:${w}px;height:${crop}px;transform:rotate(${rot}deg)"><img src="${R(n)}"></div>`;
const cap = (t, x, top, w) => `<div class="cap" style="left:${x}px;top:${top}px;width:${w}px">${t}</div>`;
const win = (n, x, top, w, url, crop, off = 0) => `<div class="win" style="left:${x}px;top:${top}px;width:${w}px;height:${crop}px"><div class="bar"><i></i><i></i><i></i><span style="margin-left:10px">${url}</span></div><img src="${R(n)}" style="margin-top:-${off}px"></div>`;
const modal = (n, x, top, w) => { const iw = Math.round((w * 2160) / 770); return `<div class="win" style="left:${x}px;top:${top}px;width:${w}px;height:${Math.round((iw * 1350) / 2160) + 38}px"><div class="bar"><i></i><i></i><i></i><span style="margin-left:10px">Take payment</span></div><img src="${R(n)}" style="width:${iw}px;max-width:none;margin-left:-${Math.round((690 / 2160) * iw)}px"></div>`; };
const checks = (items, x, top, w) => `<div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;font-size:38px;line-height:1.3;font-weight:700">${items.map((t) => `<div style="margin-bottom:30px">✔ ${t}</div>`).join("")}</div>`;
const slide = (n, head, sub, body) => `<div class="s"><div class="blob" style="right:-260px;top:-240px;width:800px;height:800px"></div><div class="blob" style="left:-300px;bottom:-320px;width:760px;height:760px"></div><div class="brand">SERVO POS</div><div class="step">${n}/10</div><div class="h">${head}</div>${sub ? `<div class="sub">${sub}</div>` : ""}${body}${foot}</div>`;
// three phones side by side, the middle one a little higher
const trio = (a, b, c, labels, tagText) =>
  phone(a, 40, 740, 320, 760, -1.5) + phone(b, 380, 670, 320, 760) + phone(c, 720, 740, 320, 760, 1.5) +
  cap(labels[0], 40, 1530, 320) + cap(labels[1], 380, 1460, 320) + cap(labels[2], 720, 1530, 320) +
  (tagText ? `<div class="tag" style="left:50%;transform:translateX(-50%);top:1590px">${tagText}</div>` : "");

const SLIDES = {
  "s01-hook": `<div class="s"><div class="blob" style="right:-260px;top:-240px;width:900px;height:900px"></div><div class="blob" style="left:-300px;bottom:-320px;width:760px;height:760px"></div>
    <div class="brand">SERVO POS</div><div class="step">1/10</div>
    <div style="position:absolute;left:64px;right:64px;top:340px;font-weight:800;font-size:124px;line-height:1.02">One busy evening.<br>Three orders.<br>One kitchen.</div>
    <div class="chip" style="left:64px;top:960px">📱 A guest orders ahead from her phone</div>
    <div class="chip" style="left:64px;top:1080px;background:#FFD54A">🧾 A walk-in pays at the till</div>
    <div class="chip" style="left:64px;top:1200px">🍽️ Table 3 sits down to eat</div>
    <div style="position:absolute;left:64px;top:1420px;font-size:42px;font-weight:700">Tap to watch them arrive →</div>${foot}</div>`,
  "s02-guest-phone": slide(2, "Order 1: a guest orders from her phone", "She opens the restaurant's menu link, adds her food and taps Place Order. Nothing to install.",
    trio("m-guest-1-menu", "m-guest-2-cart", "m-guest-3-placed", ["Pick", "Check", "Received ✓"], "Nothing to install")),
  "s03-walkin-till": slide(3, "Order 2: a walk-in at the till", "Tap the dishes. The total and 15% VAT work themselves out.",
    win("d-till-1-cart", 60, 780, 960, "servo-pos.vercel.app/pos/cashier", 640) +
    `<div class="tag" style="left:60px;top:1480px;font-size:44px">Total E 208.15</div>` +
    `<div style="position:absolute;left:64px;top:1590px;font-size:30px;opacity:.9">Three dishes, one tap each.</div>`),
  "s04-till-pay": slide(4, "Cash taken. Order sent.", "The cashier picks Cash and taps Complete. The order goes straight to the kitchen.",
    modal("d-till-2-pay", 290, 640, 500) + `<div class="tag" style="left:50%;transform:translateX(-50%);top:1590px;font-size:32px">Quick amounts · Split the bill</div>`),
  "s05-table-3": slide(5, "Order 3: Table 3 sits down", "The same till, on a phone or tablet. Pick the table, tap the dishes, take payment.",
    trio("m-till-1-table", "m-till-2-cart", "m-till-3-pay", ["Pick table + dishes", "Dine-in, not takeaway", "Take payment"], "Same till, in your hand")),
  "s06-receipt": slide(6, "A proper receipt, with a kitchen number", "Dine-in, Table 3, VAT split out, payment method and a number for the kitchen.",
    phone("m-till-4-done", 60, 780, 440, 880) + checks(["Receipt number", "Table and order type", "VAT worked out for you", "Download or print"], 560, 900, 470)),
  "s07-kitchen": slide(7, "Three orders, three sources, one screen", "Orders from guests' phones, the till and the tables all join the same queue, each tagged Takeaway or its table.",
    win("d-kitchen-1", 60, 800, 960, "servo-pos.vercel.app/pos/kitchen", 400, 235) +
    `<div class="chip" style="left:64px;top:1290px">📱 #4045, #4048: guests' phones</div><div class="chip" style="left:64px;top:1400px;background:#FFD54A">🧾 #4046: walk-in at the till</div><div class="chip" style="left:64px;top:1510px">🍽️ #4047: Table 3, dine-in</div>`),
  "s08-kitchen-progress": slide(8, "New. Preparing. Ready to serve.", "The cook taps Start, then Ready. The waiter's screen shows what is ready to carry out.",
    trio("m-kitchen-1", "m-kitchen-2", "m-server-1", ["New in the kitchen", "Cook is preparing", "Waiter: ready to serve"], "One tap at each step")),
  "s09-owner": slide(9, "And the owner sees it live", "Active orders, what is in the kitchen, tables in use and today's revenue. It refreshes every 10 seconds (demo data).",
    win("d-dash-1", 60, 820, 960, "servo-pos.vercel.app/pos/dashboard", 430) +
    `<div class="chip" style="left:64px;top:1330px">Active orders</div><div class="chip" style="left:400px;top:1330px;background:#FFD54A">Kitchen load</div>
     <div class="chip" style="left:64px;top:1450px;background:#FFD54A">Tables in use</div><div class="chip" style="left:400px;top:1450px">Today's revenue</div>`),
  "s10-cta": `<div class="s"><div class="blob" style="right:-260px;top:-240px;width:900px;height:900px"></div><div class="blob" style="left:-300px;bottom:-320px;width:760px;height:760px"></div>
    <div class="brand">SERVO POS</div><div class="step">10/10</div>
    <div style="position:absolute;left:64px;right:64px;top:330px;font-weight:800;font-size:112px;line-height:1.04">Try it yourself.<br>No sign-up.</div>
    <div style="position:absolute;left:64px;right:64px;top:700px;font-size:42px;line-height:1.4;font-weight:600">Sign in as the cashier, the kitchen, the waiter or the manager and place an order of your own.</div>
    <div class="tag" style="left:64px;top:1030px;font-size:46px;padding:22px 40px;background:#fff">servo-pos.vercel.app/demo</div>
    <div class="tag" style="left:64px;top:1180px;font-size:38px">First 5 restaurants: 6 months free</div>
    <div class="tag" style="left:64px;top:1290px;font-size:32px;background:rgba(255,255,255,.18);color:#fff;box-shadow:none">Restaurants 6 to 10: 3 months free</div>
    <div style="position:absolute;left:64px;top:1450px;font-size:36px;font-weight:700">Rather chat? WhatsApp us: +268 7934 2380</div>${foot}</div>`,
};

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const [i, [name, html]] of Object.entries(SLIDES).entries()) {
    const f = path.join(__dirname, `.${name}.html`);
    fs.writeFileSync(f, `<html><head><style>${css}</style></head><body style="${vars(i)}">${html}</body></html>`);
    await p.goto("file://" + f);
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, name + ".png") });
    fs.unlinkSync(f);
    console.log("saved", name);
  }
  await b.close();
})();
