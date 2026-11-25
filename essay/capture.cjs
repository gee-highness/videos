#!/usr/bin/env node
/* Screenshots of public web pages (press coverage, Wikipedia, articles) for use as [shot] media.
   node essay/capture.cjs <id>            reads projects/<id>/capture.json, writes projects/<id>/media/<file>
   node essay/capture.cjs <id> <file>     only that entry
   capture.json: [{ "file": "press-bravo.png", "url": "https://...", "mode": "headline" | "text" | "selector" | "top",
                    "text": "words inside the block to capture (mode text)", "selector": "css (mode selector)", "nth": 0,
                    "pad": 24, "width": 1280, "wait": 4000 }]
   Cookie banners, sticky bars and pop-ups are removed before the shot. Instagram/X/TikTok pages need a login and
   cannot be captured here: the user screenshots those on the phone (see the project's media.md). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const [id, only] = process.argv.slice(2);
const P = path.join(__dirname, '..', 'projects', id), list = JSON.parse(fs.readFileSync(path.join(P, 'capture.json'), 'utf8'));
fs.mkdirSync(path.join(P, 'media'), { recursive: true });
const CLEAN = () => {
  const bad = /cookie|consent|privacy|onetrust|didomi|cmp|gdpr|banner|newsletter|subscribe|modal|popup|overlay|paywall|sticky|adhesion|interstitial/i;
  for (const el of [...document.querySelectorAll('body *')]) {
    const cs = getComputedStyle(el), tag = `${el.id} ${typeof el.className === 'string' ? el.className : ''}`;
    if ((cs.position === 'fixed' || cs.position === 'sticky') && !/^(main|article)$/i.test(el.tagName)) el.remove();
    else if (bad.test(tag) && el.getBoundingClientRect().height < innerHeight * 0.9 && !el.querySelector('h1')) el.remove();
  }
  for (const el of document.querySelectorAll('iframe[src*="doubleclick"], iframe[id*="google_ads"], [id^="ad-"], [class*="ad-slot"], [class*="AdSlot"]')) el.remove();
  document.documentElement.style.overflow = document.body.style.overflow = 'auto';
};
(async () => {
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch(exe ? { executablePath: exe, args: ['--no-sandbox'] } : {});
  for (const c of list) {
    if (only && c.file !== only) continue;
    const ctx = await browser.newContext({ viewport: { width: c.width || 1280, height: 1000 }, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' });
    const page = await ctx.newPage(), out = path.join(P, 'media', c.file);
    try {
      await page.goto(c.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(c.wait || 4000);
      await page.evaluate(CLEAN); await page.waitForTimeout(500); await page.evaluate(CLEAN);
      const pad = c.pad ?? 24, mode = c.mode || 'headline';
      let box = null;
      if (mode === 'headline') box = await page.evaluate(() => { const h = document.querySelector('h1'); if (!h) return null; h.scrollIntoView({ block: 'start' }); window.scrollBy(0, -60);
        // the headline plus what follows it (standfirst, byline, lead picture), up to ~640 px
        const r = h.getBoundingClientRect(); let bottom = r.bottom, left = r.left, right = r.right;
        let el = h; for (let k = 0; k < 6; k++) { el = el.nextElementSibling || el.parentElement?.nextElementSibling; if (!el) break; const q = el.getBoundingClientRect(); if (q.height === 0) continue; if (q.top - r.top > 640) break; bottom = Math.max(bottom, Math.min(q.bottom, r.top + 640)); left = Math.min(left, q.left); right = Math.max(right, q.right); }
        return { x: left, y: r.top, w: right - left, h: bottom - r.top }; });
      if (mode === 'text') box = await page.evaluate((t) => { const all = [...document.querySelectorAll('p, blockquote, li, figure, h2, h3, td, div')].filter((e) => e.innerText && e.innerText.includes(t));
        const el = all.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, c.text);
      if (mode === 'selector') box = await page.evaluate(([s, n]) => { const el = document.querySelectorAll(s)[n || 0]; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, [c.selector, c.nth]);
      if (mode === 'top') box = { x: 0, y: 0, w: c.width || 1280, h: 1000 };
      if (!box) throw new Error('nothing matched (' + mode + ')');
      await page.waitForTimeout(800);
      const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.w + pad * 2, height: Math.min(box.h + pad * 2, 1600) };
      await page.screenshot({ path: out, clip });
      console.log('ok  ', c.file, `${Math.round(clip.width)}x${Math.round(clip.height)}`);
    } catch (e) { console.log('FAIL', c.file, e.message.split('\n')[0].slice(0, 120)); }
    await ctx.close();
  }
  await browser.close();
})();
