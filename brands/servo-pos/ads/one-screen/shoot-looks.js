// Phone renders of the app builder's six looks from the public /app-gallery page (sample restaurants, no login, no server data).
// Output: ads/app-gallery/raw/<look>-<screen>.png (transparent background, phone frame included).
// Usage: NODE_PATH=$(npm root) node ads/one-screen/shoot-looks.js [baseUrl]
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const LOOKS = ["Classic", "Bistro", "Fresh", "Midnight", "Street", "Minimal"];
const SCREENS = ["Home", "Menu"];
const OUT = path.join(__dirname, "..", "app-gallery", "raw");
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(`${BASE}/app-gallery`, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(3000);
  await p.addStyleTag({ content: "html,body,main{background:transparent!important}nextjs-portal{display:none!important}" });
  for (const look of LOOKS) {
    await p.getByRole("radio", { name: look, exact: true }).click();
    for (const sc of SCREENS) {
      await p.getByRole("button", { name: sc, exact: true }).first().click();
      await p.waitForTimeout(1200);
      await p.locator('[data-testid="gallery-app"]').screenshot({ path: path.join(OUT, `${look.toLowerCase()}-${sc.toLowerCase()}.png`), omitBackground: true });
      console.log("shot", look, sc);
    }
  }
  await b.close();
})();
