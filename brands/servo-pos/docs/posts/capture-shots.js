// Captures phone screenshots of the real app renderer (sample restaurant) from the public gallery.
// Usage: NODE_PATH=$(npm root) node docs/posts/capture-shots.js [baseUrl]
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = process.argv[2] || "http://localhost:3102";
const OUT = path.join(__dirname, "shots");
const LOOKS = { classic: "Classic", bistro: "Bistro", fresh: "Fresh", midnight: "Midnight" };
const SHOTS = [
  ["classic", "home"], ["bistro", "home"], ["fresh", "home"], ["midnight", "home"], ["bistro", "rewards"], ["classic", "events"], ["fresh", "gallery"], ["midnight", "book"], ["bistro", "menu"],
];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto(BASE + "/app-gallery", { waitUntil: "networkidle" });
  await p.addStyleTag({ content: '[data-testid=gallery-app] [aria-hidden="true"][style*="width: 96px"]{display:none !important}' });
  await p.addStyleTag({ content: 'html,body,main{background:transparent !important}' });
  const names = await p.$$eval('[role=radiogroup] button', (bs) => bs.map((x) => x.textContent.trim()));
  console.log("looks:", names.join(", "));
  for (const [look, screen] of SHOTS) {
    const lookName = names.find((n) => n.toLowerCase().startsWith(look)) || names[0];
    await p.getByRole("radio", { name: lookName }).click();
    await p.getByRole("button", { name: new RegExp("^" + ({ home: "Home", rewards: "Rewards", events: "What", gallery: "Gallery", book: "Book", menu: "Menu" })[screen]) }).first().click();
    await p.waitForTimeout(500);
    const phone = p.locator('[data-testid=gallery-app] [role=group]').first();
    await phone.screenshot({ path: path.join(OUT, `${look}-${screen}.png`), omitBackground: true });
    console.log("saved", look, screen);
  }
  await b.close();
})();
