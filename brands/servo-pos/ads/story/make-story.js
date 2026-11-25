// Builds the "One busy evening" image sequence (1080x1080) from real demo-app screenshots in ./raw.
// Usage: NODE_PATH=$(npm root) node ads/story/make-story.js
const { chromium } = require("playwright-core");
const { vars } = require("../theme");
const path = require("path");
const fs = require("fs");
const R = (n) => "file://" + path.join(__dirname, "raw", n + ".png");
const OUT = path.join(__dirname, "images");
fs.mkdirSync(OUT, { recursive: true });

const BG = "linear-gradient(135deg,var(--c1) 0%,var(--c2) 58%,var(--c3) 100%)";
const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.s{width:1080px;height:1080px;position:relative;overflow:hidden;background:${BG};color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.brand{position:absolute;left:64px;top:52px;font-weight:800;letter-spacing:.22em;font-size:24px;color:rgba(255,255,255,.85)}
.step{position:absolute;right:64px;top:48px;font-weight:800;font-size:24px;background:rgba(255,255,255,.16);border-radius:999px;padding:8px 20px}
.h{position:absolute;left:64px;top:104px;right:64px;font-weight:800;font-size:60px;line-height:1.06}
.sub{position:absolute;left:64px;top:262px;right:64px;font-size:28px;line-height:1.35;opacity:.95}
.tag{position:absolute;background:#FFD54A;color:var(--ink);font-weight:800;border-radius:999px;padding:12px 24px;font-size:26px;box-shadow:0 10px 24px rgba(0,0,0,.25);white-space:nowrap}
.chip{position:absolute;background:#fff;color:var(--ink);font-weight:800;border-radius:18px;padding:14px 20px;font-size:24px;box-shadow:0 14px 30px rgba(0,0,0,.25);white-space:nowrap}
.foot{position:absolute;left:64px;bottom:26px;font-size:20px;opacity:.75;letter-spacing:.02em}
.phone{position:absolute;background:#0f0a2a;border-radius:44px;padding:10px;box-shadow:0 30px 50px rgba(0,0,0,.45)}
.phone img{display:block;width:100%;border-radius:34px}
.phone .cap{position:absolute;left:0;right:0;bottom:-44px;text-align:center;font-weight:700;font-size:20px;opacity:.9}
.win{position:absolute;background:#fff;border-radius:16px;box-shadow:0 30px 50px rgba(0,0,0,.45);overflow:hidden}
.win .bar{height:34px;background:#e9e6f7;display:flex;align-items:center;gap:8px;padding:0 14px;font-size:14px;color:#4a4670}
.win .bar i{width:11px;height:11px;border-radius:50%;background:#b9b3e0;display:inline-block}
.win img{display:block;width:100%}`;

const foot = `<div class="foot">Servo Demo Kitchen · demo data · real app screens</div>`;
// phone(shot, left, top, width, crop = visible height): crop trims the bottom of tall screens
const phone = (n, x, top, w, crop, cap = "", rot = 0) =>
  `<div class="phone" style="left:${x}px;top:${top}px;width:${w}px;height:${crop}px;overflow:hidden;transform:rotate(${rot}deg)"><img src="${R(n)}">${cap ? `<div class="cap">${cap}</div>` : ""}</div>`;
const capOf = (t, x, top, w) => `<div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;text-align:center;font-weight:700;font-size:20px;opacity:.92">${t}</div>`;
const win = (n, x, top, w, url, crop, off = 0) =>
  `<div class="win" style="left:${x}px;top:${top}px;width:${w}px;${crop ? `height:${crop}px` : ""}"><div class="bar"><i></i><i></i><i></i><span style="margin-left:10px">${url}</span></div><img src="${R(n)}" style="margin-top:-${off}px"></div>`;
// the payment modal only fills the middle third of the screen, so crop to it
const modal = (n, x, top, w) => { const iw = Math.round((w * 2160) / 770); return `<div class="win" style="left:${x}px;top:${top}px;width:${w}px;height:${Math.round((iw * 1350) / 2160) + 34}px"><div class="bar"><i></i><i></i><i></i><span style="margin-left:10px">Take payment</span></div><img src="${R(n)}" style="width:${iw}px;max-width:none;margin-left:-${Math.round((690 / 2160) * iw)}px"></div>`; };
const checks = (items, x, top, w = 470) => `<div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;font-size:34px;line-height:1.35;font-weight:700">${items.map((t) => `<div style="margin-bottom:26px">✔ ${t}</div>`).join("")}</div>`;
const slide = (step, head, sub, body) =>
  `<div class="s"><div class="blob" style="right:-200px;top:-220px;width:640px;height:640px"></div><div class="brand">SERVO POS</div><div class="step">${step}/10</div><div class="h">${head}</div>${sub ? `<div class="sub">${sub}</div>` : ""}${body}${foot}</div>`;

const SLIDES = {
  "s01-hook": `<div class="s"><div class="blob" style="right:-200px;top:-220px;width:760px;height:760px"></div><div class="blob" style="left:-220px;bottom:-260px;width:640px;height:640px"></div>
    <div class="brand">SERVO POS</div><div class="step">1/10</div>
    <div style="position:absolute;left:64px;top:190px;right:64px;font-weight:800;font-size:92px;line-height:1.02">One busy evening.<br>Three orders.<br>One kitchen.</div>
    <div class="chip" style="left:64px;top:610px">📱 A guest orders ahead from her phone</div>
    <div class="chip" style="left:64px;top:690px;background:#FFD54A">🧾 A walk-in pays at the till</div>
    <div class="chip" style="left:64px;top:770px">🍽️ Table 3 sits down to eat</div>
    <div style="position:absolute;left:64px;top:890px;font-size:32px;font-weight:700;opacity:.95">Swipe to watch them arrive →</div>${foot}</div>`,

  "s02-guest-phone": slide(2, "Order 1: a guest orders from her phone", "She opens the restaurant's menu link, adds her food and taps Place Order. Nothing to install.",
    phone("m-guest-1-menu", 70, 350, 280, 600) + phone("m-guest-2-cart", 400, 350, 280, 600) + phone("m-guest-3-placed", 730, 350, 280, 600) +
    capOf("Pick", 70, 985, 280) + capOf("Check", 400, 985, 280) + capOf("Received ✓", 730, 985, 280)),

  "s03-walkin-till": slide(3, "Order 2: a walk-in at the till", "Tap the dishes. The total and 15% VAT work themselves out.",
    win("d-till-1-cart", 60, 350, 960, "servo-pos.vercel.app/pos/cashier", 640) + `<div class="tag" style="right:84px;bottom:92px;font-size:30px;z-index:3">Total E 208.15</div>`),

  "s04-till-pay": slide(4, "Cash taken. Order sent.", "The cashier picks Cash and taps Complete. The order goes straight to the kitchen.",
    modal("d-till-2-pay", 600, 330, 400) + checks(["Quick cash amounts", "Split the bill", "Rewards number for regulars", "Order goes to the kitchen"], 64, 440)),

  "s05-table-3": slide(5, "Order 3: Table 3 sits down", "The same till, on a phone or tablet. Pick the table, tap the dishes, take payment.",
    phone("m-till-1-table", 70, 350, 280, 600) + phone("m-till-2-cart", 400, 350, 280, 600) + phone("m-till-3-pay", 730, 350, 280, 600) +
    capOf("Pick table + dishes", 70, 985, 280) + capOf("Dine-in, not takeaway", 400, 985, 280) + capOf("Take payment", 730, 985, 280)),

  "s06-receipt": slide(6, "A proper receipt, with a kitchen number", "Dine-in, Table 3, VAT split out, payment method and a number for the kitchen.",
    phone("m-till-4-done", 70, 340, 380, 640) + checks(["Receipt number", "Table and order type", "VAT worked out for you", "Download or print"], 520, 400)),

  "s07-kitchen": slide(7, "Three orders, three sources, one screen", "Orders from guests' phones, the till and the tables all join the same queue, each tagged Takeaway or its table.",
    win("d-kitchen-1", 60, 350, 960, "servo-pos.vercel.app/pos/kitchen", 400, 235) +
    `<div class="chip" style="left:64px;top:800px">📱 #4045, #4048: guests' phones</div><div class="chip" style="left:64px;top:880px;background:#FFD54A">🧾 #4046: walk-in at the till</div><div class="chip" style="left:64px;top:960px">🍽️ #4047: Table 3, dine-in</div>`),

  "s08-kitchen-progress": slide(8, "New. Preparing. Ready to serve.", "The cook taps Start, then Ready. The waiter's screen shows what is ready to carry out.",
    phone("m-kitchen-1", 70, 350, 280, 600) + phone("m-kitchen-2", 400, 350, 280, 600) + phone("m-server-1", 730, 350, 280, 600) +
    capOf("New in the kitchen", 70, 985, 280) + capOf("Cook is preparing", 400, 985, 280) + capOf("Waiter: ready to serve", 730, 985, 280)),

  "s09-owner": slide(9, "And the owner sees it live", "Active orders, what is in the kitchen, tables in use and today's revenue. It refreshes every 10 seconds (demo data).",
    win("d-dash-1", 60, 360, 960, "servo-pos.vercel.app/pos/dashboard", 430) +
    `<div class="chip" style="left:64px;top:860px">Active orders</div><div class="chip" style="left:290px;top:860px;background:#FFD54A">Kitchen load</div><div class="chip" style="left:500px;top:860px">Tables in use</div><div class="chip" style="left:720px;top:860px;background:#FFD54A">Today's revenue</div>`),

  "s10-cta": `<div class="s"><div class="blob" style="right:-200px;top:-220px;width:760px;height:760px"></div><div class="blob" style="left:-220px;bottom:-260px;width:640px;height:640px"></div>
    <div class="brand">SERVO POS</div><div class="step">10/10</div>
    <div style="position:absolute;left:64px;top:150px;right:64px;font-weight:800;font-size:84px;line-height:1.04">Try it yourself.<br>No sign-up.</div>
    <div style="position:absolute;left:64px;top:370px;right:64px;font-size:36px;line-height:1.4;font-weight:600">Sign in as the cashier, the kitchen, the waiter or the manager and place an order of your own.</div>
    <div class="tag" style="left:64px;top:600px;font-size:40px;padding:18px 34px;background:#fff">servo-pos.vercel.app/demo</div>
    <div class="tag" style="left:64px;top:720px;font-size:32px">First 5 restaurants: 6 months free</div>
    <div class="tag" style="left:64px;top:800px;font-size:26px;background:rgba(255,255,255,.18);color:#fff;box-shadow:none">Restaurants 6 to 10: 3 months free</div>
    <div style="position:absolute;left:64px;top:900px;font-size:30px;font-weight:700">Rather chat? WhatsApp us: +268 7934 2380</div>${foot}</div>`,
};

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
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
