// Recaptures the three GUEST phone screens of the "One busy evening" story in the current customer-app look: ./raw/m-guest-1-menu.png (pick),
// m-guest-2-cart.png (check) and m-guest-3-placed.png (received). They are the only story screens that show the customer app; the others are staff screens.
// It places a real order on the LOCAL stack (Boerewors Roll + Oxtail Pot = E276, the story's guest order), gives it the story's order number and evening time
// so it matches the rest of the slides, photographs it, then deletes the test order again.
// Needs the local stack (API :8000, web :3000) with the demo seeded and dressed (servo-api/scripts/dress_demo_look.py).
// Usage: NODE_PATH=$(npm root) node ads/story/capture-guest.js [baseUrl] [orderNumber]
const { chromium } = require("playwright-core");
const { execSync } = require("child_process");
const path = require("path");
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const NUMBER = Number(process.argv[3] || 4048);
const RAW = path.join(__dirname, "raw");
const API = path.join(__dirname, "..", "..", "servo-api");

// runs a snippet of Python with the API's environment (DATABASE_NAME, Mongo URL) so the order can be re-numbered and removed
const py = (code) => execSync(`bash -c 'set -a; . ./.env; set +a; .venv/bin/python -W ignore -'`, { cwd: API, input: code, encoding: "utf8" }).trim();
const DB = `import os
from pymongo import MongoClient
db = MongoClient(os.environ.get("MONGODB_URL") or os.environ.get("MONGO_URL") or os.environ.get("DATABASE_URL"))[os.environ["DATABASE_NAME"]]
`;

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, timezoneId: "Africa/Mbabane", locale: "en-US" });
  const p = await ctx.newPage();
  const hide = () => p.addStyleTag({ content: "nextjs-portal,#__next-build-watcher,.chakra-toast,[id^=chakra-toast-manager]{display:none!important}" }).catch(() => {});
  await p.goto(BASE + "/customer-menu/servo-demo/menu", { waitUntil: "domcontentloaded", timeout: 120000 });
  await p.waitForTimeout(12000);
  await hide();
  await p.getByText("Start Ordering", { exact: false }).first().click({ timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const search = p.getByPlaceholder("Search menu items...");
  for (const item of ["Boerewors Roll", "Oxtail Pot"]) {
    await search.fill(item);
    await p.waitForTimeout(1800);
    await p.getByRole("button", { name: "Add to Cart" }).first().click({ timeout: 15000 });
    await p.waitForTimeout(1200);
  }
  await search.fill("");
  await p.waitForTimeout(1500);
  // pick: the Oxtail Pot card at the top of the screen, cart bar showing both items
  await p.getByText("Oxtail Pot", { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
  await p.evaluate(() => { const h = [...document.querySelectorAll("h1,h2,h3,h4,p,span")].find((e) => e.textContent.trim() === "Oxtail Pot"); if (h) h.scrollIntoView({ block: "start" }); window.scrollBy(0, -380); });
  await p.waitForTimeout(1500);
  await hide();
  await p.screenshot({ path: path.join(RAW, "m-guest-1-menu.png") });
  console.log("saved m-guest-1-menu");
  await p.getByText(/^Cart \(2\)/).first().click({ timeout: 15000 });
  await p.waitForTimeout(2500);
  await hide();
  await p.screenshot({ path: path.join(RAW, "m-guest-2-cart.png") });
  console.log("saved m-guest-2-cart");
  await p.getByRole("button", { name: /Place Order/ }).first().click({ timeout: 15000 });
  await p.waitForURL(/track/, { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(5000);
  // the story's guest order: number #4048, placed at 19:08 the evening before (the app shows the stored time as is, so store 19:08)
  py(DB + `o = db.orders.find_one(sort=[("created_at", -1)])
import datetime
db.orders.update_one({"_id": o["_id"]}, {"$set": {"order_number": ${NUMBER}, "created_at": datetime.datetime(2026, 10, 19, 19, 8, 24)}})
print(o["_id"])`);
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(6000);
  await hide();
  // the floating reading-options button would sit on top of a price on this long page
  await p.evaluate(() => { for (const e of document.querySelectorAll("button")) if (e.textContent.trim() === "Aa") e.style.display = "none"; });
  await p.screenshot({ path: path.join(RAW, "m-guest-3-placed.png") });
  console.log("saved m-guest-3-placed", p.url());
  // leave the demo as it was: the test order is not part of its history
  console.log("removed test order:", py(DB + `print(db.orders.delete_one({"order_number": ${NUMBER}}).deleted_count)`));
  await b.close();
})();
