// Objection-answer cards for WhatsApp Status (1080x1920): useful first, one soft line at the end. No Servo screens, no claims: practical rules of thumb only.
// Hooks follow docs/FACEBOOK_PROMPTS.md. Output: ads/answers/images/status/gNN-*.png
// Usage: NODE_PATH=$(npm root) node ads/tips.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { vars } = require("./theme");

const TIPS = [
  { slug: "internet", head: "What if the internet drops?", items: ["Servo works over an internet connection: phone data or Wi-Fi", "Keep a backup way to take orders, such as a paper pad, for outages", "We would rather tell you honestly than promise what we cannot"], soft: "Ask us anything on WhatsApp: +268 7934 2380" },
  { slug: "data-safe", head: "Is my data safe?", items: ["Each restaurant's data is kept separate", "Connections are encrypted", "Passwords are stored scrambled, never in plain text"], soft: "Read it for yourself: servo-pos.vercel.app/privacy" },
  { slug: "staff", head: "Will my staff manage it?", items: ["Each person signs in and sees only what they need", "Cashier, kitchen, waiter, owner: four simple screens", "Let them try it on the demo first, no sign-up"], soft: "Try it with your team: servo-pos.vercel.app/demo" },
  { slug: "switching", head: "We already have a till.", items: ["Try the demo alongside it and see what you think", "Send us your menu and prices and ask about getting it set up", "No rush, no pressure"], soft: "Message us on WhatsApp: +268 7934 2380" },
  { slug: "cost", head: "What does it cost?", items: ["Starter E350, Standard E750, Multi-branch E1,200 a month", "First 5 restaurants: 6 months free", "Restaurants 6 to 10: 3 months free"], soft: "Own customer app: Standard and Multi-branch. Starter has the plain menu page." },
  { slug: "hardware", head: "Do I need new hardware?", items: ["No special hardware", "Use the phone, tablet or computer you already own", "Open Servo in the browser and sign in"], soft: "See it on your own screen: servo-pos.vercel.app/demo" },
  { slug: "guests-install", head: "Do my guests install anything?", items: ["No. They scan the table QR", "Your menu with pictures opens in their browser", "On Standard and Multi-branch they can add your own app to their home screen"], soft: "See what a guest sees: servo-pos.vercel.app/demo" },
  { slug: "who-to-call", head: "Who do I call?", items: ["WhatsApp us: +268 7934 2380", "Tell us your restaurant, your town and what you need", "We will come back to you"], soft: "Prefer to look first? servo-pos.vercel.app/demo" },
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
  const dir = path.join(__dirname, "answers", "images", "status");
  fs.mkdirSync(dir, { recursive: true });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  for (const [i, t] of TIPS.entries()) {
    const items = t.items.map((x, k) => `<div class="it"><span class="n">${k + 1}</span><span>${x}</span></div>`).join("");
    const html = `<html><head><style>${css}</style></head><body style="${vars(i + 1)}"><div class="s"><div class="blob"></div><div class="brand">SERVO POS</div><div class="kick">ANSWERS</div>
<div class="h">${t.head}</div><div class="list" style="top:${t.head.length > 32 ? 640 : 540}px">${items}${t.note ? `<div class="note">${t.note}</div>` : ""}<div class="soft">${t.soft}</div></div>
<div class="tag" style="top:1630px">WhatsApp: +268 7934 2380</div><div class="foot">straight answers for restaurant owners</div></div></body></html>`;
    const f = path.join(dir, ".tmp.html");
    fs.writeFileSync(f, html);
    await page.goto("file://" + f);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `g${String(i + 1).padStart(2, "0")}-${t.slug}.png`) });
    fs.unlinkSync(f);
  }
  console.log(`${TIPS.length} tips`);
  await b.close();
})();
