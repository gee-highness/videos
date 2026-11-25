// Facebook page art: profile picture (square, shown as a circle) and cover banner (1640x624, keep key content in the middle).
// Usage: NODE_PATH=$(npm root) node docs/posts/make-page-art.js   (needs docs/posts/shots from capture-shots.js)
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const mark = fs.readFileSync(path.join(__dirname, "../../public/servo-mark.svg"), "utf8").replace(/width="200" height="200"/, 'width="100%" height="100%"');
const S = (n) => "file://" + path.join(__dirname, "shots", n + ".png");
const css = `*{box-sizing:border-box;margin:0}body{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}.ph{position:absolute;filter:drop-shadow(0 24px 34px rgba(0,0,0,.45))}`;
const BG = "radial-gradient(circle at 30% 20%,#6c4be0 0%,#2b1a6b 70%)";
const ART = {
  "facebook-profile": [1080, 1080, `<div style="width:1080px;height:1080px;background:${BG};display:flex;align-items:center;justify-content:center"><div style="width:1150px;height:1150px;flex:0 0 auto">${mark}</div></div>`],
  "facebook-cover": [1640, 624, `<div style="width:1640px;height:624px;position:relative;background:linear-gradient(120deg,#25165e 0%,#5b3fd6 65%,#7c5cff 100%);color:#fff;overflow:hidden">
      <div style="position:absolute;right:-120px;top:-200px;width:700px;height:700px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
      <div style="position:absolute;left:250px;top:120px;display:flex;align-items:center;gap:22px"><div style="width:96px;height:96px">${mark}</div><div style="font-weight:800;letter-spacing:.2em;font-size:38px">SERVO POS</div></div>
      <div style="position:absolute;left:250px;top:250px;font-weight:800;font-size:76px;line-height:1.05">The whole restaurant,<br>on one screen.</div>
      <div style="position:absolute;left:250px;top:450px;font-size:32px;opacity:.95">Till · Kitchen screen · Table QR ordering · Your own app</div>
      <div style="position:absolute;left:250px;top:515px;background:#FFD54A;color:#25165e;font-weight:800;font-size:28px;border-radius:999px;padding:10px 26px">First 5 restaurants: 6 months FREE</div>
      <img class="ph" src="${S("bistro-home")}" style="left:1130px;top:90px;width:230px;transform:rotate(6deg)">
      <img class="ph" src="${S("midnight-home")}" style="left:1280px;top:150px;width:210px;transform:rotate(11deg)"></div>`],
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  for (const [name, [w, h, body]] of Object.entries(ART)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const f = path.join(__dirname, "shots", `.${name}.html`);
    fs.writeFileSync(f, `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto("file://" + f); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, name + ".png") });
    fs.unlinkSync(f); console.log("made", name);
  }
  await b.close();
})();
