// Captures the home page's 3D devices (phone, tablet, laptop, desktop) showing LIVE demo screens, as transparent PNGs in ./shots.
// It drives the real landing-page showcase in a browser: signs in as each demo role, navigates the app inside the device to a screen,
// switches device, and photographs the WebGL scene with everything else hidden. make-stories.js composes the shots into posts.
// Needs the app running (npm run dev, or a deployed site) with the demo restaurant seeded.
// Usage: NODE_PATH=$(npm root) node ads/devices/capture.js [baseUrl] [only-role]
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const ONLY = process.argv[3] || "";
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });

const N = 5, HOLD = 0.6;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// the showcase turns the device by ease(t) * 360 degrees once a stage is past HOLD; invert that to pose it at an angle
const fFor = (deg) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (ease(m) * 360 < deg) lo = m; else hi = m; } return HOLD + (1 - HOLD) * lo; };
const POSES = { front: 0, right: 24, left: -22, back: 165 }; // degrees; "left" is reached from the previous stage's scroll range

// What to photograph. Stages: 0 guest, 1 cashier, 2 kitchen, 3 waiter, 4 manager. `steps` run inside the app before the photo.
const click = (...names) => async (f) => { for (const n of names) { await f.getByText(n, { exact: false }).first().click({ timeout: 30000, noWaitAfter: true }).catch(() => {}); await f.page().waitForTimeout(500); } };
// turning the device can reload the app frame, which brings the welcome modal back: tap it away again, quickly and only if it is there
const tapIf = (name) => async (f) => { try { await f.getByText(name, { exact: false }).first().click({ timeout: 4000, noWaitAfter: true }); } catch { /* not showing */ } };
const PLAN = [
  { stage: 0, role: "guest", screens: [
    { id: "home", path: "/customer-menu/servo-demo/menu", steps: click("Start Ordering"), after: tapIf("Start Ordering"), shots: [["phone", "right"], ["phone", "back"]] },
    { id: "menu", path: "/customer-menu/servo-demo/menu", steps: click("Start Ordering"), shots: [["phone", "front"]] },
  ] },
  { stage: 1, role: "cashier", screens: [
    { id: "till-cart", path: "/pos/cashier", steps: click("Beef Kebabs", "Black Label", "Boerewors"), shots: [["tablet", "front"], ["tablet", "left"], ["tablet", "right"]] },
  ] },
  { stage: 2, role: "kitchen", screens: [
    { id: "kitchen", path: "/pos/kitchen", shots: [["desktop", "front"], ["desktop", "right"], ["desktop", "back"]] },
  ] },
  { stage: 3, role: "waiter", screens: [
    { id: "server", path: "/pos/server", shots: [["phone", "front"], ["phone", "left"]] },
  ] },
  { stage: 4, role: "manager", screens: [
    { id: "dashboard", path: "/pos/dashboard", shots: [["laptop", "front"], ["laptop", "left"], ["phone", "front"]] }, // no "right": the last stage has no turn of its own, and borrowing the waiter's shows its sign-in loader
    { id: "reports", path: "/pos/management/reports", shots: [["laptop", "left"], ["phone", "front"]] },
    { id: "analytics", path: "/pos/management/analytics", shots: [["laptop", "front"], ["desktop", "front"]] },
    { id: "stock", path: "/pos/management/inventory_products", shots: [["laptop", "front"], ["phone", "front"]] },
    { id: "orders-in", path: "/pos/management/purchase_orders", shots: [["laptop", "front"], ["phone", "front"]] },
    { id: "shifts", path: "/pos/management/shifts", shots: [["laptop", "front"], ["tablet", "front"]] },
    { id: "payroll", path: "/pos/management/payrolls", shots: [["laptop", "front"], ["phone", "front"]] },
  ] },
];
const SCREENS = (process.env.SCREENS || "").split(",").filter(Boolean); // optional: only these screen ids

// visibility (not display) so the page layout, and with it the scroll positions that pose the device, never move
const HIDE = `html,body,.jn,.sc,.sc-track,.sc-stage{background:transparent!important}
.jn-bar,.sc-copy,.sc-sw,.sc-line,.sc-dots,.sc-glow,.sc-cover,.sc-coverbox,.sc-note{visibility:hidden!important}`;

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.25 });
  // FAKE_NOW (an ISO UTC time) sets the browser clock, so a demo ticked to a busy hour looks live outside trading hours
  if (process.env.FAKE_NOW) await ctx.clock.install({ time: new Date(process.env.FAKE_NOW) });
  // shrink every device in the showcase scene so rotated and tilted poses are never clipped by the canvas edge (see deviceScene.ts, __servoFit)
  await ctx.addInitScript((k) => { window.__servoFit = k; }, Number(process.env.FIT || 0.8));
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("PAGEERR", e.message.slice(0, 160)));
  await p.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 180000 });
  await p.waitForSelector(".sc-track", { timeout: 60000 });
  await p.waitForTimeout(4000);
  const geo = await p.evaluate(() => { const t = document.querySelector(".sc-track"), st = document.querySelector(".sc-stage"); return { top: t.getBoundingClientRect().top + scrollY, dist: t.offsetHeight - st.offsetHeight }; });
  const at = (k, f) => Math.round(geo.top - 60 + (Math.min(k + f, N - 1) / (N - 1)) * geo.dist + 2);
  const go = async (k, f, wait) => { await p.evaluate((y) => window.scrollTo(0, y), at(k, f)); await p.waitForTimeout(wait); };
  const device = async (d) => { await p.getByRole("radio", { name: new RegExp(d, "i") }).click({ noWaitAfter: true, timeout: 60000 }); await p.waitForTimeout(3200); };
  const appFrame = () => p.frames().find((f) => f !== p.mainFrame() && f.url().startsWith(BASE));

  for (const part of PLAN) {
    if (ONLY && part.role !== ONLY) continue;
    console.log("== stage", part.role);
    await device("Phone");
    await go(part.stage, 0.3, 4000);
    await p.evaluate(() => document.head.insertAdjacentHTML("beforeend", "<style id=hidecap></style>"));
    await p.waitForFunction(() => !document.querySelector(".sc-load:not(.sc-gone)"), null, { timeout: 240000 }).catch(() => console.log("  (loader still up)"));
    await p.waitForTimeout(2500);
    for (const sc of part.screens) {
      if (SCREENS.length && !SCREENS.includes(sc.id)) continue;
      const f = appFrame();
      if (!f) { console.log("  no frame"); continue; }
      await f.goto(BASE + sc.path, { waitUntil: "domcontentloaded" }).catch(() => {});
      await p.waitForTimeout(11000);
      const fr = appFrame();
      if (fr) { await fr.waitForFunction(() => !/Signing in as|Waking the demo/.test(document.body.innerText), null, { timeout: 120000 }).catch(() => console.log("  (sign-in still showing)")); await p.waitForTimeout(3000); }
      if (fr) await fr.addStyleTag({ content: "nextjs-portal,#__next-build-watcher,.chakra-toast,[id^=chakra-toast-manager],.chakra-toast__inner{display:none!important}" }).catch(() => {});
      if (sc.steps) await sc.steps(appFrame());
      // group by device so each switch happens once
      const byDev = {};
      for (const [d, pose] of sc.shots) (byDev[d] ||= []).push(pose);
      for (const [d, poses] of Object.entries(byDev)) {
        await go(part.stage, 0.3, 800);
        await device(d[0].toUpperCase() + d.slice(1));
        await p.waitForTimeout(3500);
        for (const pose of poses) {
          const deg = POSES[pose];
          if (pose === "front") await go(part.stage, 0.3, 7000);
          else if (pose === "left") await go(Math.max(part.stage - 1, 0), fFor(360 + deg), 18000);
          else await go(part.stage, fFor(deg), 18000);
          if (sc.after && appFrame()) { await sc.after(appFrame()); await p.waitForTimeout(2500); }
          await p.evaluate((css) => { document.getElementById("hidecap").textContent = css; }, HIDE);
          const box = await p.evaluate(() => { const r = document.querySelector(".sc-gl").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
          const file = path.join(OUT, `${part.role}_${sc.id}_${d}_${pose}.png`);
          await p.screenshot({ path: file, clip: box, omitBackground: true });
          await p.evaluate(() => { document.getElementById("hidecap").textContent = ""; });
          console.log("  shot", path.basename(file));
        }
      }
    }
  }
  await b.close();
})();
