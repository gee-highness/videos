// Direct phone screenshots of the guest app pages on the local demo (used by the flat hero template in make-stories.js).
// Usage: NODE_PATH=$(npm root) node ads/one-screen/shoot-guest.js [baseUrl]
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const PAGES = [["menu", "menu"], ["rewards", "rewards"], ["home", "home"], ["book", "book"]];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  for (const [name, route] of PAGES) {
    await p.goto(`${BASE}/customer-menu/servo-demo/${route}`, { waitUntil: "networkidle", timeout: 120000 }).catch(() => {});
    await p.getByText("Start Ordering", { exact: false }).first().click({ timeout: 2500 }).catch(() => {});
    await p.addStyleTag({ content: "nextjs-portal,.chakra-toast{display:none!important}" });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(__dirname, "raw", `guest-${name}.png`) });
    console.log("shot", name);
  }
  await b.close();
})();
