// Builds the campaign pictures from the real screens in marketing/raw.  Usage: node marketing/compose.mjs
// Output: marketing/out/<set>/<id>-1x1.png (1080x1080) and <id>-9x16.png (1080x1920, WhatsApp Status / Reels).
// Devices are drawn whole: the screen is the real screenshot at its own proportions, so nothing is stretched or cropped.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { SETS } from "./slides.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const b64 = (f) => fs.readFileSync(f).toString("base64");
const font = (family, weight, file) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(path.join(root, "node_modules/@fontsource", file))}) format('woff2')}`;
const FONTS = [font("Poppins", 700, "poppins/files/poppins-latin-700-normal.woff2"), font("Poppins", 600, "poppins/files/poppins-latin-600-normal.woff2"), font("Inter", 400, "inter/files/inter-latin-400-normal.woff2"), font("Inter", 600, "inter/files/inter-latin-600-normal.woff2")].join("\n");
const img = (name) => `data:image/png;base64,${b64(path.join(root, "marketing/raw", name + ".png"))}`;
const qr = (set) => `data:image/png;base64,${b64(path.join(root, "marketing/qr", set + ".png"))}`;
const dim = (name) => { const buf = fs.readFileSync(path.join(root, "marketing/raw", name + ".png")); return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; };

const CSS = `${FONTS}
*{box-sizing:border-box;margin:0}
body{width:var(--W);height:var(--H);font-family:Inter,sans-serif;color:#fff;overflow:hidden;position:relative;background:linear-gradient(155deg,var(--c1),var(--c2))}
.glow{position:absolute;inset:0;background:radial-gradient(900px 600px at 85% 10%,rgba(255,255,255,.16),transparent 60%),radial-gradient(700px 500px at 0% 100%,rgba(0,0,0,.28),transparent 60%)}
.kicker{font-weight:600;letter-spacing:.14em;font-size:26px;color:var(--acc)}
h1{font-family:Poppins,sans-serif;font-weight:700;line-height:1.08;letter-spacing:-.01em}
.sub{opacity:.92;line-height:1.35}
.chip{display:inline-block;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:8px 20px;font-weight:600;font-size:24px}
.chip.demo{background:var(--acc);color:#1b1b1b;border-color:transparent}
.foot{position:absolute;left:0;right:0;bottom:0;height:96px;background:rgba(0,0,0,.30);display:flex;align-items:center;justify-content:space-between;padding:0 56px;font-weight:600;font-size:28px}
.foot b{color:var(--acc);font-family:Poppins,sans-serif;font-size:32px}
.laptop{position:absolute;filter:drop-shadow(0 30px 40px rgba(0,0,0,.45))}
.laptop .lid{background:#0e0e10;border-radius:20px 20px 8px 8px;padding:14px;border:2px solid #3b3b40}
.laptop .scr{display:block;width:100%;border-radius:6px;background:#fff}
.laptop .base{height:20px;margin:0 -7%;background:linear-gradient(#d7d7dc,#a9a9b0);border-radius:0 0 26px 26px}
.phone{position:absolute;background:#0e0e10;border-radius:56px;padding:36px 13px 22px;border:2px solid #3b3b40;filter:drop-shadow(0 30px 40px rgba(0,0,0,.45))}
.phone .scr{display:block;width:100%;border-radius:18px;background:#fff}
.phone:after{content:"";position:absolute;top:12px;left:50%;width:78px;height:14px;margin-left:-39px;background:#2a2a30;border-radius:10px}
ul.b{list-style:none;padding:0}
ul.b li{display:flex;gap:16px;align-items:flex-start;line-height:1.3}
ul.b li:before{content:"✓";flex:none;width:44px;height:44px;border-radius:50%;background:var(--acc);color:#1b1b1b;display:grid;place-items:center;font-weight:700}
.tag{position:absolute;top:34px;right:42px}
.big{font-family:Poppins,sans-serif;font-weight:700}
`;

function laptop(shot, left, top, width) { const d = dim(shot); const sw = width - 28, sh = Math.round(sw * d.h / d.w); return { html: `<div class="laptop" style="left:${left}px;top:${top}px;width:${width}px"><div class="lid"><img class="scr" src="${img(shot)}" style="height:${sh}px"></div><div class="base"></div></div>`, h: sh + 28 + 20 }; }
function phone(shot, left, top, height) { const d = dim(shot); const sh = height - 58, sw = Math.round(sh * d.w / d.h); return { html: `<div class="phone" style="left:${left}px;top:${top}px;width:${sw + 26}px"><img class="scr" src="${img(shot)}" style="height:${sh}px;width:${sw}px"></div>`, w: sw + 26 }; }

function slide(set, s, fmt) {
  const sq = fmt === "1x1", W = 1080, H = sq ? 1080 : 1920;
  const [c1, c2] = set.palette; let body = "";
  const tag = "";
  const foot = `<div class="foot"><span style="display:flex;gap:16px;align-items:center"><span class="chip demo" style="font-size:22px;padding:6px 16px">Real screen · demo data</span><span style="font-size:24px">No sign-up</span></span><b>gss-lms.vercel.app/demo</b></div>`;
  if (s.device === "laptop") {
    if (sq) { const lw = 880, l = laptop(s.shot, 100, 352, lw);
      body = `<div style="position:absolute;left:64px;top:62px;right:64px"><div class="kicker">${s.kicker}</div><h1 style="font-size:70px;margin-top:14px">${s.head}</h1><div class="sub" style="font-size:32px;margin-top:14px">${s.sub}</div></div>${l.html}`; }
    else { const lw = 960, l = laptop(s.shot, 60, 650, lw);
      body = `<div style="position:absolute;left:64px;top:96px;right:64px"><div class="kicker" style="font-size:30px">${s.kicker}</div><h1 style="font-size:88px;margin-top:20px">${s.head}</h1><div class="sub" style="font-size:38px;margin-top:20px">${s.sub}</div></div>${l.html}
      <ul class="b" style="position:absolute;left:70px;right:70px;top:${650 + l.h + 60}px;font-size:36px;display:grid;gap:26px">${s.bullets.map((x) => `<li>${x}</li>`).join("")}</ul>`; }
  } else if (s.device === "phone") {
    if (sq) { const ph = phone(s.shot, 0, 70, 860); const left = 1080 - 64 - ph.w;
      body = `<div style="position:absolute;left:64px;top:96px;width:${left - 64 - 40}px"><div class="kicker">${s.kicker}</div><h1 style="font-size:62px;margin-top:16px">${s.head}</h1><div class="sub" style="font-size:30px;margin-top:16px">${s.sub}</div>
      <ul class="b" style="font-size:27px;display:grid;gap:18px;margin-top:34px">${s.bullets.map((x) => `<li>${x}</li>`).join("")}</ul></div>${phone(s.shot, left, 70, 860).html}`; }
    else { const ph = phone(s.shot, 0, 600, 1130); const left = Math.round((1080 - ph.w) / 2);
      body = `<div style="position:absolute;left:64px;top:96px;right:64px;text-align:center"><div class="kicker" style="font-size:30px">${s.kicker}</div><h1 style="font-size:84px;margin-top:20px">${s.head}</h1><div class="sub" style="font-size:38px;margin-top:20px">${s.sub}</div></div>${phone(s.shot, left, 600, 1130).html}`; }
  } else if (s.device === "collage") {
    const head = `<div style="position:absolute;left:64px;top:${sq ? 70 : 110}px;right:64px"><div class="kicker">${s.kicker}</div><h1 style="font-size:${sq ? 66 : 88}px;margin-top:14px;max-width:900px">${s.head}</h1>${sq ? "" : `<div class="sub" style="font-size:36px;margin-top:20px;max-width:900px">${s.sub}</div>`}</div>`;
    if (sq) { const l = laptop(s.shots[0], 30, 500, 500); const p1 = phone(s.shots[1], 580, 330, 560), p2 = phone(s.shots[2], 580 + 0, 330, 560); const ph = 500; const a1 = phone(s.shots[1], 560, 380, ph), a2 = phone(s.shots[2], 560 + a1.w + 14, 380, ph);
      body = head + l.html + a1.html + a2.html; }
    else { const l = laptop(s.shots[0], 110, 560, 860); const ph = 560; const a1 = phone(s.shots[1], 0, 1170, ph); const a2 = phone(s.shots[2], 0, 1170, ph); const tot = a1.w + 30 + a2.w; const x0 = Math.round((1080 - tot) / 2);
      body = head + l.html + phone(s.shots[1], x0, 1170, ph).html + phone(s.shots[2], x0 + a1.w + 30, 1170, ph).html; }
  }
  return `<html><head><style>:root{--W:${W}px;--H:${H}px;--c1:${c1};--c2:${c2};--acc:${set.accent}}${CSS}</style></head><body><div class="glow"></div>${body}${tag}${foot}</body></html>`;
}

function ctaSlide(key, set, fmt) {
  const sq = fmt === "1x1", W = 1080, H = sq ? 1080 : 1920; const [c1, c2] = set.palette;
  const roles = { leaders: "As a principal", teachers: "As a teacher", parents: "As a parent", learners: "As a learner", everyone: "As anyone" }[key];
  const q = sq ? 330 : 440;
  return `<html><head><style>:root{--W:${W}px;--H:${H}px;--c1:${c1};--c2:${c2};--acc:${set.accent}}${CSS}</style></head><body><div class="glow"></div>
  <div style="position:absolute;left:64px;right:64px;top:${sq ? 70 : 150}px"><div class="kicker" style="font-size:${sq ? 26 : 30}px">${roles.toUpperCase()}</div><h1 style="font-size:${sq ? 84 : 112}px;margin-top:18px">See it for yourself.</h1>
  <div class="sub" style="font-size:${sq ? 34 : 44}px;margin-top:22px;max-width:900px">Open the live demo. It is a whole school with made-up data. Nothing to sign up for.</div></div>
  <div style="position:absolute;left:64px;right:64px;top:${sq ? 430 : 640}px;display:flex;${sq ? "gap:44px;align-items:center" : "flex-direction:column;gap:36px;align-items:center;text-align:center"}">
    <div style="background:#fff;border-radius:28px;padding:20px"><img src="${qr(key)}" style="width:${q}px;height:${q}px;display:block"></div>
    <div style="font-size:${sq ? 30 : 40}px;line-height:1.4"><div class="big" style="font-size:${sq ? 38 : 50}px;color:var(--acc)">Scan, or visit</div><div class="big" style="font-size:${sq ? 34 : 46}px">gss-lms.vercel.app/demo</div><div style="margin-top:18px;opacity:.9">Choose a role and look around.</div></div></div>
  ${sq ? "" : `<div style="position:absolute;left:64px;right:64px;top:1420px;display:grid;gap:22px;font-size:38px"><ul class="b" style="display:grid;gap:24px"><li>Real screens, real features</li><li>Made-up data: nothing you click is real</li><li>Your school can try it free for 30 days</li></ul></div>`}
  <div class="foot"><span style="display:flex;gap:16px;align-items:center"><span class="chip demo" style="font-size:22px;padding:6px 16px">Demo data</span><span style="font-size:24px">Made for schools in Eswatini</span></span><b>Free to look</b></div></body></html>`;
}

const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium" });
for (const [key, set] of Object.entries(SETS)) {
  fs.mkdirSync(path.join(root, "marketing/out", key), { recursive: true });
  const all = [...set.slides.map((s) => ({ id: s.id, html: (f) => slide(set, s, f) })), { id: key.slice(0, 2) + "-cta", html: (f) => ctaSlide(key, set, f) }];
  for (const s of all) for (const f of ["1x1", "9x16"]) {
    const page = await browser.newPage({ viewport: { width: 1080, height: f === "1x1" ? 1080 : 1920 } });
    await page.setContent(s.html(f), { waitUntil: "load" }); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(root, "marketing/out", key, `${s.id}-${f}.png`) }); await page.close();
  }
  console.log(key, all.length, "slides x 2 sizes");
}
await browser.close();
