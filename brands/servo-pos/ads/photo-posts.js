// Photo + real-screen posts for WhatsApp Status (1080x1920). The photos (ads/photos/raw) are AI-made illustrations supplied by the owner;
// each post says "Illustrative photo". The Servo screens are the real app (demo data). Text is drawn here, never baked into a photo,
// so the name, currency and claims always match the product. Output: ads/photo-posts/images/status/pNN-*.png
// Usage: NODE_PATH=$(npm root) node ads/photo-posts.js
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { vars } = require("./theme");

const PH = path.join(__dirname, "photos");
const TRIM = path.join(__dirname, "devices", "shots", "trim");
const sizes = JSON.parse(fs.readFileSync(path.join(TRIM, "sizes.json"), "utf8"));
const W = 1080, H = 1920;
// device: {shot (trim name) | flat (one-screen/raw name), h, right|left, top}
const POSTS = [
  { slug: "your-menu", head: "Your menu on your guests' phones.", photo: "raw/tablet-qr-counter.png", pos: "30% 40%", chips: ["Scan the table QR", "Nothing to install"],
    dev: { flat: "guest-menu", h: 600, side: "right", top: 1000 } },
  { slug: "scan-to-kitchen", head: "Scan. Order. It lands in the kitchen.", photo: "raw/tablet-qr-counter.png", pos: "80% 60%", chips: ["Kitchen screen, live"],
    dev: { shot: "kitchen_kitchen_desktop_front", h: 360, side: "right", top: 1100 } },
  { slug: "tablet-till", head: "Take orders on a tablet.", photo: "raw/stall-tablet-qr-left.png", pos: "50% 30%", chips: ["Cash payments", "Totals and VAT worked out"],
    dev: { shot: "cashier_till-cart_tablet_front", h: 300, side: "right", top: 1150 } },
  { slug: "day-on-phone", head: "How did today go? Open your phone.", photo: "raw/stall-tablet-qr-left.png", pos: "50% 30%", chips: ["Daily sales report"],
    dev: { shot: "manager_reports_phone_front", h: 570, side: "right", top: 1030 } },
  { slug: "cafe-scan", head: "Guests order. Your kitchen sees it.", photo: "originals/18-cafe-qr-scan-waiter-tablet.png", pos: "50% 45%", chips: ["Table QR to kitchen screen"],
    dev: { shot: "kitchen_kitchen_desktop_front", h: 360, side: "right", top: 1100 } },
  { slug: "own-app", head: "Your name. Your colours. Your app.", photo: "originals/19-counter-customer-phone.png", pos: "35% 40%", chips: ["Standard and Multi-branch plans"],
    dev: { flat: "guest-home", h: 600, side: "right", top: 1000 } },
  { slug: "ready-to-serve", head: "Know what is ready to serve.", photo: "originals/21-waiter-tablet-floor.png", pos: "30% 40%", chips: ["Ready orders, table by table"],
    dev: { shot: "waiter_server_phone_front", h: 570, side: "right", top: 1030 } },
  { slug: "just-scan", head: "No app to download. Just scan.", photo: "originals/22-table-qr-scan.png", pos: "45% 50%", chips: ["Scan the table QR", "Order from the phone"],
    dev: { flat: "guest-menu", h: 600, side: "right", top: 1000 } },
  { slug: "at-the-till", head: "Take payment at the till.", photo: "originals/23-table-card-tap.png", pos: "55% 40%", chips: ["Cash works straight away", "Card once connected"],
    dev: { shot: "cashier_till-cart_tablet_left", h: 300, side: "right", top: 1150 } },
  { slug: "kitchen-board", head: "Every ticket on the kitchen screen.", photo: "originals/26-kitchen-chef-tablet.png", pos: "45% 40%", chips: ["New, preparing, ready"],
    dev: { shot: "kitchen_kitchen_desktop_right", h: 360, side: "right", top: 1100 } },
];

const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,sans-serif;width:${W}px;height:${H}px;overflow:hidden}
.s{position:relative;width:${W}px;height:${H}px;background:linear-gradient(160deg,var(--c1),var(--c2) 58%,var(--c3));color:#fff}
.brand{position:absolute;left:64px;top:200px;font-weight:800;letter-spacing:.22em;font-size:28px;color:rgba(255,255,255,.85)}
.h{position:absolute;left:64px;right:64px;top:290px;font-size:92px;font-weight:800;line-height:1.05}
.ph{position:absolute;left:60px;top:600px;width:960px;height:760px;border-radius:40px;object-fit:cover;box-shadow:0 26px 40px rgba(0,0,0,.35)}
.dev{position:absolute;filter:drop-shadow(0 26px 34px rgba(0,0,0,.45))}
.chip{position:absolute;left:64px;background:#fff;color:var(--ink);font-weight:800;border-radius:22px;padding:16px 26px;font-size:32px;box-shadow:0 14px 30px rgba(0,0,0,.28)}.chip.y{background:#FFD54A}
.tag{position:absolute;left:64px;top:1630px;background:#fff;color:var(--ink);font-weight:800;border-radius:999px;font-size:38px;padding:18px 34px;white-space:nowrap}
.foot{position:absolute;left:64px;top:1750px;font-size:24px;opacity:.8}`;

const dims = (d) => {
  if (d.flat) return { w: d.h * 0.5, h: d.h, src: null };
  const [w0, h0] = sizes[d.shot];
  return { w: (w0 / h0) * d.h, h: d.h, src: path.join(TRIM, d.shot + ".png") };
};

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const dir = path.join(__dirname, "photo-posts", "images", "status");
  fs.mkdirSync(dir, { recursive: true });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  for (const [i, p] of POSTS.entries()) {
    const d = p.dev, m = dims(d);
    const x = d.side === "right" ? W - 40 - m.w : 40;
    const devHtml = d.flat
      ? `<div class="dev" style="left:${x}px;top:${d.top}px;width:${m.w}px;height:${m.h}px;border-radius:${m.w * 0.14}px;background:#111;padding:${m.w * 0.03}px"><img src="file://${path.join(__dirname, "one-screen", "raw", d.flat + ".png")}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:${m.w * 0.115}px;display:block"></div>`
      : `<img class="dev" src="file://${m.src}" style="left:${x}px;top:${d.top}px;width:${m.w}px;height:${m.h}px">`;
    const chips = p.chips.map((c, k) => `<div class="chip${k % 2 ? " y" : ""}" style="top:${1470 + k * 76}px">${c}</div>`).join("");
    const html = `<html><head><style>${css}</style></head><body style="${vars(i + 4)}"><div class="s"><div class="brand">SERVO POS</div><div class="h">${p.head}</div>
<img class="ph" src="file://${path.join(PH, p.photo)}" style="object-position:${p.pos}">${devHtml}${chips}
<div class="tag">Try the demo: servo-pos.vercel.app/demo</div><div class="foot">Illustrative photo · screens are demo data</div></div></body></html>`;
    const f = path.join(dir, ".tmp.html");
    fs.writeFileSync(f, html);
    await page.goto("file://" + f);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, `p${String(i + 1).padStart(2, "0")}-${p.slug}.png`) });
    fs.unlinkSync(f);
  }
  console.log(`${POSTS.length} posts`);
  await b.close();
})();
