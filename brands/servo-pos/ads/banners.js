// Draws the brush-stroke banners (headline, benefit labels, call to action) onto the owner's clean, lettering-free photos in ads/banners/base
// (stage 1: ads/banners_prep.py puts real Servo screens into blank device screens). Same look as the owner's mock-ups: purple paint
// strokes, white hand lettering, yellow highlights, but every word is ours, so nothing had to be erased.
// Output: ads/banners/images/<name>.png (1080x1080). Usage: NODE_PATH=$(npm root) node ads/banners.js [prefix ...]
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "banners", "base"), OUT = path.join(__dirname, "banners", process.argv.includes("--tall") ? "images/status" : "images"), FONTS = path.join(__dirname, "fonts");
const TALL = process.argv.includes("--tall");
const S = 1080, H = TALL ? 1920 : 1080, PUR = "#35108a", PUR2 = "#2a0a70", YEL = "#FFD60A", URL = "servo-pos.vercel.app/demo";

// rough paint-stroke polygon (seeded so a rebuild looks the same)
function stroke(w, h, seed, fill) {
  let s = seed * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts = [], n = Math.max(14, Math.round((w + h) / 26));
  const edge = (x0, y0, x1, y1, k, amp) => { for (let i = 0; i < k; i++) { const t = i / k; pts.push([x0 + (x1 - x0) * t + (r() - .5) * amp, y0 + (y1 - y0) * t + (r() - .5) * amp]); } };
  edge(10, 14, w - 12, 8, n, 22); edge(w - 12, 8, w - 8, h - 10, n / 2, 18); edge(w - 8, h - 10, 12, h - 14, n, 22); edge(12, h - 14, 10, 14, n / 2, 18);
  // frayed bristle tips on the left and right ends
  const tips = []; for (let i = 0; i < 7; i++) { const y = 20 + r() * (h - 40); tips.push(`<rect x="${r() < .5 ? 0 : w - 26 + r() * 20}" y="${y}" width="${20 + r() * 20}" height="${3 + r() * 5}" rx="3" fill="${fill}" opacity=".85"/>`); }
  return `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;overflow:visible"><polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}"/>${tips.join("")}</svg>`;
}
const B = (o) => `<div style="position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;transform:rotate(${o.rot || 0}deg);filter:drop-shadow(0 5px 7px rgba(0,0,0,.35))">${stroke(o.w, o.h, o.seed || 1, o.fill || PUR)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:${o.align || "flex-start"};padding:${o.pad ?? 26}px;font:400 ${o.size || 44}px/1.02 'Caveat Brush';color:${o.color || "#fff"};text-align:${o.align === "center" ? "center" : "left"};text-shadow:0 1px 0 rgba(0,0,0,.18)">${o.html}</div></div>`;
const Y = (t) => `<span style="color:${YEL}">${t}</span>`;
const under = (c = YEL, w = 180) => `<svg width="${w}" height="14" viewBox="0 0 ${w} 14" style="margin-top:4px"><path d="M2 9 Q${w * .25} 2 ${w * .5} 8 T${w - 2} 6" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const bar = (items) => `<div style="position:absolute;left:0;right:0;bottom:0;height:96px;background:${PUR2};display:flex;align-items:center;justify-content:space-around;padding:0 18px;font:600 21px/1.1 Inter;color:#fff">${items.map((t) => `<span style="display:flex;align-items:center;gap:10px"><i style="width:10px;height:10px;border-radius:50%;background:${YEL}"></i>${t}</span>`).join("")}</div>`;
const demo = (x, y, w = 420) => B({ x, y, w, h: 120, rot: -3, seed: 7, fill: YEL, align: "center", pad: 10, size: 38, color: PUR2, html: `Try the live demo<span style="font:700 25px Inter;margin-top:2px">${URL}</span>` });
const brand = `<div style="position:absolute;left:34px;top:26px;font:800 40px Inter;color:#fff;letter-spacing:.01em;text-shadow:0 2px 8px rgba(0,0,0,.45)">Servo <span style="color:${YEL}">POS</span></div>`;
const FOOT = `<div style="position:absolute;right:16px;bottom:104px;font:500 15px Inter;color:#fff;text-shadow:0 0 3px #000,0 0 4px #000">Screens are demo data</div>`;

// crop = x offset into the 1536x1024 photo for the square (null = already square)
// tall (1080x1920) layout: safe zones top 190 and bottom 200 for WhatsApp's own bars. tx = left edge of the photo window in the photo's own pixels.
const TALLJ = {
  "b01-guests-order": { tx: 280, head: `Guests order.<br>${Y("Your kitchen sees it.")}`, sub: "Scan the table QR, pick dishes, place the order.", bar: ["Table QR", "Kitchen screen", "Order tracking"] },
  "b02-your-own-app": { tx: 470, head: `Your name.<br>Your colours.<br>${Y("Your own app.")}`, sub: "Guests add it to their phone. Standard and Multi-branch plans.", bar: ["Your logo", "Your colours", "No app store"] },
  "b03-ready-to-serve": { tx: 520, head: `Orders, table by table.<br>${Y("Nothing gets lost.")}`, sub: "Tickets, tables and what is ready to serve, on a tablet.", bar: ["Tickets", "Tables", "Ready to serve"] },
  "b04-just-scan": { tx: 560, head: `No app to download.<br>${Y("Just scan.")}`, sub: "Your menu, with pictures, opens in the guest's browser.", bar: ["Table QR", "Menu with pictures", "Order from the phone"] },
  "b05-take-payment": { tx: 700, hy: 720, sy: 1050, head: `Take payment<br>${Y("at the table or till.")}`, sub: "Cash works straight away. Card payments once your card processing is connected.", bar: ["Cash", "Card (once connected)", "Receipts"] },
  "b06-kitchen-board": { tx: 520, head: `Every order<br>${Y("on the kitchen screen.")}`, sub: "New, preparing, ready. No shouting across the pass.", bar: ["Live tickets", "Wait times", "No paper slips"] },
};
const tallHtml = (j) => { const t = TALLJ[j.out]; return [
  `<div style="position:absolute;left:34px;top:205px;font:800 44px Inter;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.45)">Servo <span style="color:${YEL}">POS</span></div>`,
  B({ x: 22, y: t.hy || 290, w: 920, h: 330, rot: -3, seed: 3, size: 88, pad: 40, html: t.head }),
  B({ x: 30, y: t.sy || 650, w: 700, h: 190, rot: -2, seed: 4, size: 40, pad: 28, html: t.sub }),
  B({ x: 330, y: 1430, w: 720, h: 170, rot: -3, seed: 7, fill: YEL, align: "center", pad: 12, size: 58, color: PUR2, html: `Try the live demo<span style="font:700 34px Inter;margin-top:4px">${URL}</span>` }),
  `<div style="position:absolute;left:0;right:0;top:1640px;height:90px;background:${PUR2};display:flex;align-items:center;justify-content:space-around;padding:0 18px;font:600 26px/1.1 Inter;color:#fff">${t.bar.map((x) => `<span style="display:flex;align-items:center;gap:10px"><i style="width:12px;height:12px;border-radius:50%;background:${YEL}"></i>${x}</span>`).join("")}</div>`,
  j.out === "b03-ready-to-serve" ? `<div style="position:absolute;right:18px;top:1600px;font:500 20px Inter;color:#fff;text-shadow:0 0 3px #000,0 0 4px #000">Screens are demo data</div>` : "",
]; };

const JOBS = [
  { f: "18-cafe-qr-scan-waiter-tablet.png", out: "b01-guests-order", crop: null, html: [
    B({ x: 18, y: 86, w: 640, h: 235, rot: -4, seed: 3, size: 62, html: `Guests order.<br>${Y("Your kitchen sees it.")}` }),
    B({ x: 24, y: 330, w: 400, h: 120, rot: -3, seed: 4, size: 28, pad: 18, html: "Scan the table QR, pick dishes, place the order." }),
    demo(620, 830), bar(["Table QR", "Kitchen screen", "Order tracking", "Made for Eswatini"])] },
  { f: "19-counter-customer-phone.png", out: "b02-your-own-app", crop: 260, html: [
    B({ x: 16, y: 80, w: 660, h: 240, rot: -4, seed: 5, size: 60, html: `Your name.<br>Your colours.<br>${Y("Your own app.")}` }),
    B({ x: 24, y: 360, w: 420, h: 105, rot: -3, seed: 6, size: 27, pad: 16, html: "Guests add it to their phone. Standard and Multi-branch plans." }),
    demo(600, 830), bar(["Your logo", "Your colours", "Your tabs", "No app store"])] },
  { f: "21-waiter-tablet-floor.png", out: "b03-ready-to-serve", crop: 330, html: [
    B({ x: 16, y: 80, w: 640, h: 230, rot: -4, seed: 8, size: 60, html: `Orders, table by table.<br>${Y("Nothing gets lost.")}` }),
    B({ x: 24, y: 345, w: 400, h: 110, rot: -3, seed: 9, size: 27, pad: 16, html: "Tickets, tables and what is ready to serve, on a tablet." }),
    demo(600, 830), bar(["Tickets", "Tables", "Ready to serve", "Takeaways"]), FOOT] },
  { f: "22-table-qr-scan.png", out: "b04-just-scan", crop: 380, html: [
    B({ x: 16, y: 80, w: 600, h: 235, rot: -4, seed: 11, size: 62, html: `No app to download.<br>${Y("Just scan.")}` }),
    B({ x: 24, y: 340, w: 380, h: 105, rot: -3, seed: 12, size: 27, pad: 16, html: "Your menu, with pictures, opens in the guest's browser." }),
    demo(620, 830), bar(["Table QR", "Menu with pictures", "Order from the phone", "Rewards"])] },
  { f: "23-table-card-tap.png", out: "b05-take-payment", crop: 150, html: [
    B({ x: 16, y: 80, w: 640, h: 235, rot: -4, seed: 13, size: 60, html: `Take payment<br>${Y("at the table or till.")}` }),
    B({ x: 24, y: 345, w: 420, h: 125, rot: -3, seed: 14, size: 26, pad: 16, html: "Cash works straight away. Card payments once your card processing is connected." }),
    demo(600, 830), bar(["Cash", "Card (once connected)", "Receipts", "Split the bill"])] },
  { f: "26-kitchen-chef-tablet.png", out: "b06-kitchen-board", crop: 200, html: [
    B({ x: 16, y: 80, w: 640, h: 235, rot: -4, seed: 15, size: 60, html: `Every order<br>${Y("on the kitchen screen.")}` }),
    B({ x: 24, y: 345, w: 400, h: 105, rot: -3, seed: 16, size: 27, pad: 16, html: "New, preparing, ready. No shouting across the pass." }),
    demo(600, 830), bar(["Live tickets", "Wait times", "New, preparing, ready", "No paper slips"])] },
];

(async () => {
  const want = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const page = await b.newPage({ viewport: { width: S, height: H } });
  for (const j of JOBS) {
    if (want.length && !want.some((w) => j.out.startsWith(w))) continue;
    const img = `file://${path.join(BASE, j.f)}`;
    const sc = H / 1024;
    const photo = TALL ? `<img src="${img}" style="position:absolute;left:${-(j.f.startsWith("18") ? 300 : TALLJ[j.out].tx) * (j.f.startsWith("18") ? H / 1254 : sc)}px;top:0;height:${H}px">` : j.crop === null ? `<img src="${img}" style="position:absolute;left:0;top:0;width:${S}px;height:${S}px">` : `<img src="${img}" style="position:absolute;left:${-j.crop * (S / 1024)}px;top:0;height:${S}px">`;
    const html = `<html><head><style>@font-face{font-family:'Caveat Brush';src:url(file://${path.join(FONTS, "Caveat_Brush.ttf")})}*{box-sizing:border-box;margin:0}body{width:${S}px;height:${H}px;overflow:hidden;position:relative;background:#222}</style></head><body>${photo}
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,8,50,.4) 0%,rgba(20,8,50,0) 38%,rgba(20,8,50,0) 70%,rgba(20,8,50,.3) 100%)"></div>${TALL ? tallHtml(j).join("") : brand + j.html.join("")}</body></html>`;
    const f = path.join(OUT, ".tmp.html"); fs.writeFileSync(f, html);
    await page.goto("file://" + f); await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, j.out + ".png") }); fs.unlinkSync(f);
    console.log("done", j.out);
  }
  await b.close();
})();
