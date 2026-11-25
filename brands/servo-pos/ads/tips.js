// Owner-tip cards for WhatsApp Status (1080x1920): useful first, one soft line at the end. No Servo screens, no claims: practical rules of thumb only.
// Hooks follow docs/FACEBOOK_PROMPTS.md. Output: ads/owner-tips/images/status/tNN-*.png
// Usage: NODE_PATH=$(npm root) node ads/tips.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { vars } = require("./theme");

const TIPS = [
  { slug: "3-numbers", head: "3 numbers to know every night.", items: ["Sales for the day", "Food cost: what the food cost you, as a share of sales", "Wages: what the staff cost you, as a share of sales"], soft: "Servo's daily report shows them in one place." },
  { slug: "price-a-dish", head: "How to price a dish.", items: ["Add up what is on the plate: meat, pap, relish, oil, packaging", "Divide by 0.33 to aim for a food cost of about a third", "Round to a price guests will pay, then check it"], note: "Example: E30 of ingredients ÷ 0.33 is about E91. Example numbers only.", soft: "Many restaurants aim for 30 to 35%. Check what works for yours." },
  { slug: "busy-hour", head: "Your busiest hour is your staff hour.", items: ["Find the hour with the most orders", "Put your fastest people on it", "Prep before it starts, not during it"], soft: "Servo's busy-hours chart shows it from your own orders." },
  { slug: "best-vs-profit", head: "Best seller is not always the best earner.", items: ["List your top 5 sellers", "Next to each, write what it earns after ingredients", "Push the dishes that earn most, not only the ones that sell most"], soft: "Servo shows best sellers from your own orders." },
  { slug: "qr-poster", head: "Make your table QR work.", items: ["Big QR, at least the size of your hand", "Say what to do: \"Scan to order\"", "Put the table number on it", "Test it with your own phone, then a guest's"], soft: "Servo makes the QR for each table." },
  { slug: "payday-friday", head: "Payday Friday: prep on Thursday.", items: ["Count stock Thursday, order by midday", "Extra hands for the lunch rush", "Cash float: enough change for the first hour", "Prep your top 3 dishes early"], soft: "Servo flags low stock before service." },
  { slug: "festive-stock", head: "Festive season stock list.", items: ["Your top 10 dishes: what goes into each", "Drinks, ice and packaging", "Ask suppliers when they close for the holidays", "Order early, count again after the first weekend"], soft: "Servo keeps your stock levels in one list." },
  { slug: "ask-vendor", head: "Before you buy any POS, ask:", items: ["What does it cost each month, with everything?", "Does it need internet? What do I do when it drops?", "Who do I call when it breaks?", "Can I take my data with me if I stop?"], soft: "Ask us these four on WhatsApp: +268 7934 2380." },
];
const W = 1080, H = 1920;

const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,sans-serif;width:${W}px;height:${H}px;overflow:hidden}
.s{position:relative;width:${W}px;height:${H}px;background:linear-gradient(160deg,var(--c1),var(--c2) 58%,var(--c3));color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08);right:-200px;top:-220px;width:900px;height:900px}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.kick{position:absolute;right:64px;top:196px;background:rgba(255,255,255,.18);border-radius:999px;padding:8px 22px;font-weight:800;font-size:26px}
.h{position:absolute;left:64px;right:64px;top:290px;font-size:92px;font-weight:800;line-height:1.05}
.list{position:absolute;left:64px;right:64px;display:flex;flex-direction:column;gap:26px}
.it{display:flex;gap:22px;align-items:flex-start;background:rgba(255,255,255,.14);border-radius:28px;padding:30px 34px;font-size:50px;font-weight:600;line-height:1.25}
.n{flex:none;width:68px;height:68px;border-radius:50%;background:#FFD54A;color:var(--ink);font-weight:800;font-size:38px;display:flex;align-items:center;justify-content:center}
.note{font-size:32px;opacity:.9}
.soft{margin-top:10px;font-size:40px;font-weight:800;background:#FFD54A;color:var(--ink);border-radius:28px;padding:24px 34px}
.tag{position:absolute;left:64px;background:#fff;color:var(--ink);font-weight:800;border-radius:999px;font-size:36px;padding:18px 34px;white-space:nowrap}
.foot{position:absolute;left:64px;top:1750px;font-size:24px;opacity:.75}`;

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const dir = path.join(__dirname, "owner-tips", "images", "status");
  fs.mkdirSync(dir, { recursive: true });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  for (const [i, t] of TIPS.entries()) {
    const items = t.items.map((x, k) => `<div class="it"><span class="n">${k + 1}</span><span>${x}</span></div>`).join("");
    const html = `<html><head><style>${css}</style></head><body style="${vars(i + 3)}"><div class="s"><div class="blob"></div><div class="brand">SERVO POS</div><div class="kick">OWNER TIP</div>
<div class="h">${t.head}</div><div class="list" style="top:${t.head.length > 32 ? 640 : 540}px">${items}${t.note ? `<div class="note">${t.note}</div>` : ""}<div class="soft">${t.soft}</div></div>
<div class="tag" style="top:1630px">Try the demo: servo-pos.vercel.app/demo</div><div class="foot">Servo POS · tips for restaurant owners in Eswatini</div></div></body></html>`;
    const f = path.join(dir, ".tmp.html");
    fs.writeFileSync(f, html);
    await page.goto("file://" + f);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `t${String(i + 1).padStart(2, "0")}-${t.slug}.png`) });
    fs.unlinkSync(f);
  }
  console.log(`${TIPS.length} tips`);
  await b.close();
})();
