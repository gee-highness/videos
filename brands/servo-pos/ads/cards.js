// Before / after cards for WhatsApp Status (1080x1920): the old way on top, the Servo screen below, one call to action.
// Reads ads/theme.js palettes and the trimmed device renders in ads/devices/shots/trim. Output: ads/pain-fix/images/status/bNN-*.png
// Usage: NODE_PATH=$(npm root) node ads/cards.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { vars } = require("./theme");

const SHOTS = path.join(__dirname, "devices", "shots", "trim");
const sizes = JSON.parse(fs.readFileSync(path.join(SHOTS, "sizes.json"), "utf8"));
const CARDS = [
  { slug: "paper-pad", emoji: "📝", pain: "Orders on a paper pad. Smudged, lost, misread.", fix: "Orders typed once, on the till.", shots: [["cashier_till-cart_tablet_left", 560]] },
  { slug: "shouting", emoji: "📣", pain: "Shouting orders across the kitchen.", fix: "Tickets on the kitchen screen.", shots: [["kitchen_kitchen_desktop_right", 560]] },
  { slug: "counting", emoji: "🧮", pain: "Counting the day by hand after closing.", fix: "One report. Open it on your phone.", shots: [["manager_reports_laptop_left", 560], ["manager_reports_phone_front", 440]] },
  { slug: "stock-book", emoji: "📒", pain: "Stock in a notebook. You find out when it is gone.", fix: "Low stock is flagged before service.", shots: [["manager_stock_laptop_front", 540], ["manager_stock_phone_front", 470]] },
  { slug: "whatsapp-orders", emoji: "💬", pain: "Orders by WhatsApp, typed out again at the till.", fix: "Guests order from the table QR.", shots: [["guest_menu_phone_front", 650], ["guest_home_phone_right", 620]] },
  { slug: "roster", emoji: "🗓️", pain: "A hand-written roster nobody can find.", fix: "Shifts and clock-ins in one place.", shots: [["manager_shifts_laptop_front", 540], ["manager_shifts_tablet_front", 330]] },
  { slug: "wages", emoji: "🔢", pain: "Wages worked out on a calculator.", fix: "Payroll from the hours, for the whole team.", shots: [["manager_payroll_laptop_front", 540], ["manager_payroll_phone_front", 470]] },
  { slug: "guessing", emoji: "🤔", pain: "\"I think chicken sells best.\"", fix: "Best sellers and busy hours, from your own orders.", shots: [["manager_analytics_laptop_front", 400], ["manager_analytics_desktop_front", 500]] },
];
const W = 1080, H = 1920, FOOT = "Servo Demo Kitchen · demo data · real app screens";

function html(c, i) {
  const rects = c.shots.map(([s, h]) => ({ s, h, w: (sizes[s][0] / sizes[s][1]) * h }));
  const gap = 20, tw = rects.reduce((a, r) => a + r.w, 0) + gap * (rects.length - 1), th = Math.max(...rects.map((r) => r.h));
  const k = Math.min((W * 0.9) / tw, 640 / th);
  let x = (W - tw * k) / 2;
  const imgs = rects.map((r) => { const y = 930 + (640 - r.h * k) / 2; const e = `<img src="file://${path.join(SHOTS, r.s + ".png")}" style="position:absolute;left:${x}px;top:${y}px;width:${r.w * k}px;height:${r.h * k}px;filter:drop-shadow(0 26px 34px rgba(0,0,0,.35))">`; x += r.w * k + gap * k; return e; }).join("");
  return `<html><head><style>*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,sans-serif;width:${W}px;height:${H}px;overflow:hidden;${vars(i + 2)}}
.s{position:relative;width:${W}px;height:${H}px;background:linear-gradient(160deg,var(--c1),var(--c2) 58%,var(--c3));color:#fff}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.before{position:absolute;left:64px;right:64px;top:290px;height:340px;border-radius:36px;background:rgba(20,16,24,.55);border:3px dashed rgba(255,255,255,.35);padding:36px 44px}
.lab{display:inline-block;font-weight:800;font-size:28px;letter-spacing:.08em;border-radius:999px;padding:8px 22px}
.l-b{background:rgba(255,255,255,.2)}.l-a{background:#FFD54A;color:var(--ink)}
.em{position:absolute;right:44px;top:34px;font-size:120px}
.pain{position:absolute;left:44px;right:210px;top:100px;font-size:58px;font-weight:800;line-height:1.1;opacity:.95}
.arrow{position:absolute;left:0;right:0;top:650px;text-align:center;font-size:90px;font-weight:800;line-height:1}
.after{position:absolute;left:64px;right:64px;top:770px}
.fix{margin-top:14px;font-size:56px;font-weight:800;line-height:1.1}
.tag{position:absolute;left:64px;top:1630px;background:#fff;color:var(--ink);font-weight:800;border-radius:999px;font-size:40px;padding:18px 34px;white-space:nowrap}
.foot{position:absolute;left:64px;top:1750px;font-size:24px;opacity:.75}</style></head><body><div class="s">
<div class="brand">SERVO POS</div>
<div class="before"><span class="lab l-b">BEFORE</span><span class="em">${c.emoji}</span><div class="pain">${c.pain}</div></div>
<div class="arrow">↓</div>
<div class="after"><span class="lab l-a">WITH SERVO</span><div class="fix">${c.fix}</div></div>
${imgs}
<div class="tag">Try the demo: servo-pos.vercel.app/demo</div><div class="foot">${FOOT}</div></div></body></html>`;
}

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const dir = path.join(__dirname, "pain-fix", "images", "status");
  fs.mkdirSync(dir, { recursive: true });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  for (const [i, c] of CARDS.entries()) {
    const f = path.join(dir, ".tmp.html");
    fs.writeFileSync(f, html(c, i));
    await page.goto("file://" + f);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `b${String(i + 1).padStart(2, "0")}-${c.slug}.png`) });
    fs.unlinkSync(f);
  }
  console.log(`${CARDS.length} cards`);
  await b.close();
})();
