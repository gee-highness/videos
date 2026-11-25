// Composes the device renders (shots/trim, made by capture.js + trim.py) into post sequences, each in two sizes:
//   images/         1080x1080  Facebook feed
//   images/status/  1080x1920  WhatsApp Status / Stories
// One definition per slide; the device cluster is fitted to each size automatically.
// Usage: NODE_PATH=$(npm root) node ads/devices/make-stories.js [--status-only] [story-slug ...]
// A story with `single: true` is a set of independent one-screen heroes (kind "hero"): files hNN-<slug>.png, no step counter.
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots", "trim");
const sizes = JSON.parse(fs.readFileSync(path.join(SHOTS, "sizes.json"), "utf8"));
const QR = (() => { try { const q = require("qrcode"); let u = ""; q.toString("https://servo-pos.vercel.app/demo?ref=wa-status", { type: "svg", margin: 0 }, (e, svg) => { u = svg; }); return "data:image/svg+xml;base64," + Buffer.from(u).toString("base64"); } catch { return ""; } })();
const FOOT = "Servo Demo Kitchen · demo data · real app screens";

// ---- the stories ----------------------------------------------------------------------------------------------------
// devices: [shot name, cx, cy, h]: centre and height in a free "cluster" space (only the proportions matter).
const D = (shot, cx, cy, h) => ({ shot, cx, cy, h });
const STORIES = {
  "lunch-rush": {
    title: "The Friday lunch rush",
    slides: [
      { kind: "hook", head: "Friday. 12:30. Every table is full.", sub: "One restaurant, four screens, and nobody shouting across the kitchen.",
        devices: [D("kitchen_kitchen_desktop_right", 520, 300, 520), D("cashier_till-cart_tablet_front", 200, 520, 330), D("guest_menu_phone_front", 880, 440, 520)] },
      { head: "12:05  The till is busy", sub: "Dishes go in with one tap each. Totals and 15% VAT work themselves out.", chips: ["Cash payments", "Split the bill"],
        devices: [D("cashier_till-cart_tablet_left", 520, 350, 560)] },
      { head: "12:20  Guests order from their phones", sub: "No queue. No waving for the waiter.", chips: ["Their phone, your menu"],
        devices: [D("guest_menu_phone_front", 330, 360, 650), D("guest_home_phone_right", 700, 360, 620)] },
      { head: "12:35  The kitchen fills up", sub: "Every ticket shows how long it has been waiting.", chips: ["New", "Preparing", "Ready"],
        devices: [D("kitchen_kitchen_desktop_front", 520, 350, 560)] },
      { head: "12:50  Ready to serve", sub: "The waiter sees what is ready, with the table, and carries it out.", chips: ["Ready to serve"],
        devices: [D("waiter_server_phone_front", 330, 360, 650), D("waiter_server_phone_left", 700, 360, 620)] },
      { head: "13:30  The owner checks in", sub: "Orders, kitchen load, tables and revenue, live. From the office or the car.", chips: ["Live dashboard"],
        devices: [D("manager_dashboard_laptop_left", 470, 360, 540), D("manager_dashboard_phone_front", 900, 440, 470)] },
      { head: "Same restaurant. Four screens.", sub: "Phone, tablet, laptop and a big screen on the wall. Each person sees what they need.",
        devices: [D("kitchen_kitchen_desktop_front", 520, 250, 400), D("manager_dashboard_laptop_front", 190, 520, 280), D("cashier_till-cart_tablet_front", 560, 540, 290), D("waiter_server_phone_front", 900, 470, 420)] },
      { kind: "cta", head: "See it on your own screen.", sub: "Open the live demo, no sign-up, and place an order yourself." },
    ],
  },
  "close-the-day": {
    title: "Closing the day",
    slides: [
      { kind: "hook", head: "Doors closed. Now what?", sub: "Counting, ordering, rosters, wages. Here is the same evening in ten minutes.",
        devices: [D("manager_dashboard_laptop_left", 470, 340, 540), D("manager_dashboard_phone_front", 900, 430, 470)] },
      { head: "How did we do today?", sub: "Sales for the day, ready when you are. No till tape, no calculator.", chips: ["Daily sales report"],
        devices: [D("manager_reports_laptop_left", 520, 350, 560), D("manager_reports_phone_front", 920, 450, 440)] },
      { head: "What sold best?", sub: "Best sellers and busy hours, so you cook and staff for what people actually order.", chips: ["Best sellers", "Busy hours"],
        devices: [D("manager_analytics_laptop_front", 300, 330, 400), D("manager_analytics_desktop_front", 700, 350, 500)] },
      { head: "What is running low?", sub: "Stock that is about to run out is flagged before service, not during it.", chips: ["Low-stock flags"],
        devices: [D("manager_stock_laptop_front", 480, 340, 540), D("manager_stock_phone_front", 900, 440, 470)] },
      { head: "Order it from the supplier", sub: "Purchase orders in a few taps, and what arrives is booked in.", chips: ["Purchase orders"],
        devices: [D("manager_orders-in_laptop_front", 480, 340, 540), D("manager_orders-in_phone_front", 900, 440, 470)] },
      { head: "Who worked when?", sub: "Rosters and clock-ins in one place.", chips: ["Shifts", "Timesheets"],
        devices: [D("manager_shifts_laptop_front", 470, 340, 540), D("manager_shifts_tablet_front", 900, 460, 330)] },
      { head: "Wages, without the spreadsheet", sub: "Payroll for the whole team, worked out from the hours.", chips: ["Payroll"],
        devices: [D("manager_payroll_laptop_front", 480, 340, 540), D("manager_payroll_phone_front", 900, 440, 470)] },
      { kind: "cta", head: "Close the day in minutes.", sub: "Try the owner view on the live demo. No sign-up." },
    ],
  },
  "every-screen": {
    title: "One restaurant, every screen",
    slides: [
      { kind: "hook", head: "Your restaurant, on every screen.", sub: "One system. Whatever screen you already have.",
        devices: [D("kitchen_kitchen_desktop_front", 520, 250, 400), D("manager_dashboard_laptop_front", 190, 520, 280), D("cashier_till-cart_tablet_front", 560, 540, 290), D("guest_menu_phone_front", 900, 420, 470)] },
      { head: "In your guests' hands", sub: "Your own app, with your name and your menu. Nothing to install.", chips: ["Phone"],
        devices: [D("guest_menu_phone_front", 330, 360, 650), D("guest_home_phone_right", 700, 360, 620)] },
      { head: "On the counter", sub: "A tablet till for takeaways, tables and cash.", chips: ["Tablet"],
        devices: [D("cashier_till-cart_tablet_right", 520, 350, 560)] },
      { head: "In the back office", sub: "A laptop for stock, staff and reports.", chips: ["Laptop"],
        devices: [D("manager_dashboard_laptop_left", 520, 350, 560)] },
      { head: "On the kitchen wall", sub: "A big screen for every ticket, live.", chips: ["Desktop"],
        devices: [D("kitchen_kitchen_desktop_right", 520, 350, 560)] },
      { head: "Four screens. One restaurant.", sub: "Each person signs in and sees what they need.",
        devices: [D("kitchen_kitchen_desktop_front", 520, 250, 400), D("manager_dashboard_laptop_front", 190, 520, 280), D("cashier_till-cart_tablet_front", 560, 540, 290), D("waiter_server_phone_front", 900, 470, 420)] },
      { kind: "cta", head: "Try it on your screen.", sub: "Phone, tablet, laptop or desktop. Open the live demo, no sign-up." },
    ],
  },
  "one-screen": {
    title: "One screen, one reason",
    single: true,
    slides: [
      { kind: "hero", slug: "till", head: "Cash, card, split bill. Done in four taps.", chips: ["Cashier tablet"],
        devices: [D("cashier_till-cart_tablet_left", 520, 350, 560)] },
      { kind: "hero", slug: "kitchen", head: "No more shouting orders across the kitchen.", chips: ["Kitchen screen"],
        devices: [D("kitchen_kitchen_desktop_right", 520, 350, 560)] },
      { kind: "hero", slug: "guest-phone", head: "Guests order from their own phone. No app.", chips: ["Their phone, your menu"],
        devices: [D("guest_menu_phone_front", 330, 360, 650), D("guest_home_phone_right", 700, 360, 620)] },
      { kind: "hero", slug: "stock", head: "Never run out of chicken on a Friday.", chips: ["Low-stock flags"],
        devices: [D("manager_stock_laptop_front", 480, 340, 540), D("manager_stock_phone_front", 900, 440, 470)] },
      { kind: "hero", slug: "reports", head: "How did we do today? Open your phone.", chips: ["Daily sales report"],
        devices: [D("manager_reports_laptop_left", 520, 350, 560), D("manager_reports_phone_front", 920, 450, 440)] },
      { kind: "hero", slug: "payroll", head: "Wages without the spreadsheet.", chips: ["Payroll"],
        devices: [D("manager_payroll_laptop_front", 480, 340, 540), D("manager_payroll_phone_front", 900, 440, 470)] },
      // flat heroes: direct phone screenshots of the real guest app (ads/one-screen/shoot-guest.js), drawn in a CSS phone frame
      { kind: "hero", slug: "table-qr", head: "A QR on the table. The order lands in the kitchen.", chips: ["Scan, order, done"],
        flat: [{ img: "guest-menu", h: 640, qr: false }, { qr: true }] },
      { kind: "hero", slug: "rewards", head: "Points your guests actually come back for.", chips: ["Your own rewards"],
        flat: [{ img: "guest-rewards", h: 700 }] },
      { kind: "hero", slug: "own-app", head: "Your name. Your colours. Your app.", chips: ["Standard and Multi-branch plans"],
        flat: [{ img: "guest-home", h: 560 }, { img: "guest-menu", h: 560 }, { img: "guest-rewards", h: 560 }] },
    ],
  },
};

// A warm, lively palette: every slide gets its own gradient so a sequence feels like a menu board, not a wall of one colour.
// Each is dark enough at the top for white text; ink is the deep tone used for chip text.
const PALETTES = [
  { c1: "#7A1F0A", c2: "#D9480F", c3: "#FF8A3D", ink: "#7A1F0A" }, // ember
  { c1: "#7A3D00", c2: "#D98200", c3: "#F5B02E", ink: "#7A3D00" }, // amber
  { c1: "#053B3F", c2: "#0E8A82", c3: "#34C9A9", ink: "#053B3F" }, // teal
  { c1: "#5B0F3C", c2: "#B8236B", c3: "#F0568F", ink: "#5B0F3C" }, // berry
  { c1: "#0B2A5B", c2: "#1F6FEB", c3: "#5CB0FF", ink: "#0B2A5B" }, // ocean
  { c1: "#25165e", c2: "#5b3fd6", c3: "#7c5cff", ink: "#25165e" }, // plum
];
const palette = (slug, i, kind) => PALETTES[kind === "cta" ? 0 : (i + Object.keys(STORIES).indexOf(slug)) % PALETTES.length];

// ---- layouts --------------------------------------------------------------------------------------------------------
const FORMATS = {
  feed: { w: 1080, h: 1080, dir: "", brand: 52, headTop: 104, head: 60, hookHead: 84, subTop: 262, sub: 28, zone: { y: 372, h: 640 }, chip: 26, foot: { bottom: 26, size: 20 }, ctaHead: 84, ctaSub: 34 },
  status: { w: 1080, h: 1920, dir: "status", brand: 200, headTop: 290, head: 80, hookHead: 104, subTop: 560, sub: 36, zone: { y: 780, h: 880 }, chip: 32, foot: { bottom: 196, size: 24 }, ctaHead: 112, ctaSub: 42 },
};
const css = (F) => `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.s{width:${F.w}px;height:${F.h}px;position:relative;overflow:hidden;background:linear-gradient(${F.h > F.w ? 160 : 135}deg,var(--c1) 0%,var(--c2) 58%,var(--c3) 100%);color:#fff}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.brand{position:absolute;left:64px;top:${F.brand}px;font-weight:800;letter-spacing:.22em;font-size:${F.h > F.w ? 28 : 24}px;color:rgba(255,255,255,.85)}
.step{position:absolute;right:64px;top:${F.brand - 4}px;font-weight:800;font-size:${F.h > F.w ? 28 : 24}px;background:rgba(255,255,255,.16);border-radius:999px;padding:8px 20px}
.h{position:absolute;left:64px;right:64px;font-weight:800;line-height:1.05}
.sub{position:absolute;left:64px;right:64px;line-height:1.35;opacity:.95}
.dev{position:absolute;filter:drop-shadow(0 26px 34px rgba(0,0,0,.35))}
.chip{position:absolute;left:64px;background:#fff;color:var(--ink);font-weight:800;border-radius:${F.h > F.w ? 22 : 18}px;padding:${F.h > F.w ? "16px 26px" : "13px 20px"};font-size:${F.chip}px;box-shadow:0 14px 30px rgba(0,0,0,.28);white-space:nowrap}
.chip.y{background:#FFD54A}
.tag{position:absolute;left:64px;background:#fff;color:var(--ink);font-weight:800;border-radius:999px;white-space:nowrap}
.foot{position:absolute;left:64px;font-size:${F.foot.size}px;opacity:.75;letter-spacing:.02em;bottom:${F.foot.bottom}px}`;

function render(story, slide, i, n, F) {
  const tall = F.h > F.w;
  let body = "";
  if (slide.kind === "cta") {
    const hs = F.ctaHead, ss = F.ctaSub;
    const t0 = tall ? 330 : 150;
    body = `<div class="blob" style="right:-200px;top:-220px;width:${tall ? 900 : 760}px;height:${tall ? 900 : 760}px"></div><div class="blob" style="left:-220px;bottom:-260px;width:640px;height:640px"></div>
      <div class="brand">SERVO POS</div><div class="step">${i + 1}/${n}</div>
      <div class="h" style="top:${t0}px;font-size:${hs}px">${slide.head}</div>
      <div class="sub" style="top:${t0 + (tall ? 330 : 190)}px;font-size:${ss}px;font-weight:600;line-height:1.4">${slide.sub}</div>
      <div class="tag" style="top:${t0 + (tall ? 640 : 380)}px;font-size:${tall ? 46 : 40}px;padding:${tall ? "22px 40px" : "18px 34px"}">servo-pos.vercel.app/demo</div>
      <div class="tag" style="top:${t0 + (tall ? 790 : 490)}px;background:#FFD54A;font-size:${tall ? 38 : 32}px;padding:${tall ? "16px 32px" : "12px 24px"}">First 5 restaurants: 6 months free</div>
      <div class="tag" style="top:${t0 + (tall ? 900 : 570)}px;background:rgba(255,255,255,.18);color:#fff;font-size:${tall ? 32 : 26}px;padding:${tall ? "14px 28px" : "10px 22px"}">Restaurants 6 to 10: 3 months free</div>
      <div style="position:absolute;left:64px;top:${t0 + (tall ? 1050 : 650)}px;font-size:${tall ? 36 : 30}px;font-weight:700">Rather chat? WhatsApp us: +268 7934 2380</div>
      <div class="foot">${FOOT}</div>`;
    return body;
  }
  const hook = slide.kind === "hook";
  const hero = slide.kind === "hero";
  const hs = hero ? (tall ? 96 : 66) : hook ? F.hookHead : F.head;
  body += `<div class="blob" style="right:-200px;top:-220px;width:${tall ? 900 : 700}px;height:${tall ? 900 : 700}px"></div><div class="blob" style="left:-240px;bottom:-280px;width:640px;height:640px"></div>
    <div class="brand">SERVO POS</div>${hero ? "" : `<div class="step">${i + 1}/${n}</div>`}
    <div class="h" style="top:${F.headTop}px;font-size:${hs}px">${slide.head}</div>
    ${hero ? "" : `<div class="sub" style="top:${hook && !tall ? F.subTop + 30 : F.subTop}px;font-size:${F.sub}px">${slide.sub}</div>`}`;
  if (slide.flat) {
    const k = (tall ? 1.1 : 0.7), z0 = hero ? (tall ? { y: 640, h: 800 } : { y: 372, h: 560 }) : F.zone;
    const items = slide.flat.map((f) => (f.qr ? { qr: true, w: 340 * k, h: 340 * k } : { ...f, h: f.h * k, w: f.h * k * 0.5 }));
    const gap = 26, total = items.reduce((a, it) => a + it.w, 0) + gap * (items.length - 1);
    const sc = Math.min(1, (F.w * 0.9) / total, z0.h / Math.max(...items.map((it) => it.h)));
    let x = (F.w - total * sc) / 2;
    for (const it of items) {
      const w = it.w * sc, h = it.h * sc, y = z0.y + (z0.h - h) / 2;
      if (it.qr) body += `<div style="position:absolute;left:${x}px;top:${y + (h - w) / 2 - 20}px;width:${w}px;background:#fff;border-radius:28px;padding:${w * 0.07}px;box-shadow:0 26px 34px rgba(0,0,0,.35);color:#1b1722;text-align:center;font-weight:800;font-size:${w * 0.075}px"><img src="${QR}" style="width:100%;display:block"><div style="margin-top:8px">Scan to order</div><div style="font-weight:600;font-size:${w * 0.055}px;opacity:.7">Table 5 · demo</div></div>`;
      else body += `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w * 0.14}px;background:#111;padding:${w * 0.03}px;box-shadow:0 26px 34px rgba(0,0,0,.35)"><img src="file://${path.join(__dirname, "..", "one-screen", "raw", it.img + ".png")}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:${w * 0.115}px;display:block"></div>`;
      x += w + gap * sc;
    }
    (slide.chips || []).forEach((c, kk) => { body += `<div class="chip${kk % 2 ? " y" : ""}" style="top:${(tall ? 1470 : 940) - (slide.chips.length - kk - 1) * (tall ? 84 : 66)}px">${c}</div>`; });
    body += `<div class="tag" style="left:64px;top:${tall ? 1600 : 1000}px;font-size:${tall ? 40 : 28}px;padding:${tall ? "18px 34px" : "12px 22px"}">Try the demo: servo-pos.vercel.app/demo</div><div class="foot">${FOOT}</div>`;
    return body;
  }
  // fit the device cluster into the zone
  const rects = slide.devices.map((d) => { const [w0, h0] = sizes[d.shot]; const w = (w0 / h0) * d.h; return { d, w, h: d.h, x0: d.cx - w / 2, y0: d.cy - d.h / 2 }; });
  const minX = Math.min(...rects.map((r) => r.x0)), maxX = Math.max(...rects.map((r) => r.x0 + r.w));
  const minY = Math.min(...rects.map((r) => r.y0)), maxY = Math.max(...rects.map((r) => r.y0 + r.h));
  const z = hero ? (tall ? { y: 640, h: 800 } : { y: 372, h: 560 }) : F.zone;
  const s = Math.min((F.w * 0.94) / (maxX - minX), z.h / (maxY - minY)); // 3% clear space either side: devices may touch each other or sit close to the edge, but are never cut
  const ox = (F.w - (maxX - minX) * s) / 2 - minX * s, oy = z.y + (z.h - (maxY - minY) * s) / 2 - minY * s;
  for (const r of rects) {
    body += `<img class="dev" src="file://${path.join(SHOTS, r.d.shot + ".png")}" style="left:${(ox + r.x0 * s).toFixed(1)}px;top:${(oy + r.y0 * s).toFixed(1)}px;width:${(r.w * s).toFixed(1)}px;height:${(r.h * s).toFixed(1)}px">`;
  }
  (slide.chips || []).forEach((c, k) => {
    const top = hero ? (tall ? 1470 : 940) - (slide.chips.length - k - 1) * (tall ? 84 : 66) : z.y + z.h - 30 - (slide.chips.length - k) * (tall ? 84 : 66);
    body += `<div class="chip${k % 2 ? " y" : ""}" style="top:${top}px">${c}</div>`;
  });
  if (hero) body += `<div class="tag" style="left:64px;top:${tall ? 1600 : 1000}px;font-size:${tall ? 40 : 28}px;padding:${tall ? "18px 34px" : "12px 22px"}">Try the demo: servo-pos.vercel.app/demo</div>`;
  body += `<div class="foot">${FOOT}</div>`;
  return body;
}

(async () => {
  const args = process.argv.slice(2);
  const statusOnly = args.includes("--status-only");
  const want = args.filter((a) => !a.startsWith("--"));
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  for (const [slug, story] of Object.entries(STORIES)) {
    if (want.length && !want.includes(slug)) continue;
    const missing = [...new Set(story.slides.flatMap((s) => (s.devices || []).map((d) => d.shot)).filter((n) => n && !sizes[n]))];
    if (missing.length) console.log(`${slug}: missing shots -> ${missing.join(", ")}`);
    const slides = story.slides.filter((s) => (s.devices || []).every((d) => sizes[d.shot]));
    for (const F of Object.values(FORMATS)) {
      if (statusOnly && F.dir !== "status") continue;
      const dir = path.join(__dirname, "..", slug, "images", F.dir);
      fs.mkdirSync(dir, { recursive: true });
      const page = await b.newPage({ viewport: { width: F.w, height: F.h } });
      for (const [i, slide] of slides.entries()) {
        const pal = palette(slug, i, slide.kind);
        const html = `<html><head><style>${css(F)}</style></head><body><div class="s" style="--c1:${pal.c1};--c2:${pal.c2};--c3:${pal.c3};--ink:${pal.ink}">${render(story, slide, i, slides.length, F)}</div></body></html>`;
        const f = path.join(dir, ".tmp.html");
        fs.writeFileSync(f, html);
        await page.goto("file://" + f);
        await page.waitForTimeout(350);
        const name = story.single ? `h${String(i + 1).padStart(2, "0")}-${slide.slug}.png` : `s${String(i + 1).padStart(2, "0")}-${slide.kind || "slide"}.png`;
        await page.screenshot({ path: path.join(dir, name) });
        fs.unlinkSync(f);
      }
      await page.close();
      console.log(`${slug} ${F.w}x${F.h}: ${slides.length} slides`);
    }
  }
  await b.close();
})();
