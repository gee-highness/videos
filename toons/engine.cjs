#!/usr/bin/env node
/* Renders an ink-cartoon episode to MP4.
   node toons/engine.cjs vk01                 full video -> toons/out/vk01.mp4 (+ 720p copy + contact sheet)
   node toons/engine.cjs vk01 --stills 1,5,9  PNG stills at those seconds (for checking the drawing)
   node toons/engine.cjs vk01 --style chalk    the same episode in another art style (ink, chalk, neon, cutout, signpaint; lib.js STYLES)
   node toons/engine.cjs vk01 --timing         only write toons/out/<id>-timing.json (voice line and scene times)
   Voice: if toons/voice/<id>/NN.mp3 exist they are mixed in at the times in EP.voice (--audio-only remixes without redrawing).
   Drawn "on twos": 12 pictures a second, encoded at 24 fps, like hand-drawn animation. */
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const { chromium } = require('playwright');
const dir = __dirname, root = path.join(dir, '..'), out = path.join(root, 'toons', 'out');
const id = process.argv[2], args = process.argv.slice(3);
const opt = (k) => { const i = args.indexOf('--' + k); return i < 0 ? null : args[i + 1] ?? true; };
const FPS = 12;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b64 = (f) => fs.readFileSync(f).toString('base64');
  const ep = fs.readFileSync(path.join(dir, 'ep', id + '.js'), 'utf8');
  const logoFile = /logoFile:\s*'([^']+)'/.exec(ep)[1], lp = path.join(root, logoFile);
  const logo = `data:image/${lp.endsWith('.svg') ? 'svg+xml' : 'png'};base64,${b64(lp)}`;
  const html = `<!doctype html><meta charset="utf8"><style>
@font-face{font-family:'Kalam';font-weight:700;src:url(data:font/ttf;base64,${b64(path.join(dir, 'fonts/Kalam.ttf'))})}
@font-face{font-family:'Caveat Brush';src:url(data:font/ttf;base64,${b64(path.join(dir, 'fonts/Caveat_Brush.ttf'))})}
html,body{margin:0;background:#fff}#s{width:1080px;height:1920px}</style><div id="s"></div>
<script>${fs.readFileSync(path.join(dir, 'lib.js'), 'utf8')}\n${ep}\nEP.logo=${JSON.stringify(logo)};
window.draw=(t)=>{document.getElementById('s').innerHTML=frame(EP,t)};</script>`;
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined); // the project's own Playwright may want another browser build
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([document.fonts.load('700 40px Kalam'), document.fonts.load('40px "Caveat Brush"')]));
  await page.evaluate(() => { for (let i = 0; i < 4; i++) textW('SMALL BUSINESS NEWS', 50, BRUSH); }); // warm up the canvas font so the news ticker is measured with the real font from the first frame
  // voice file lengths (an empty or unreadable file is estimated from its text and left out of the sound)
  const nLines = await page.evaluate(() => (EP.voice || []).length), tempo0 = await page.evaluate(() => EP.voiceTempo || 1);
  const durs = [], missing = [], cleanDir = path.join(out, id + '-clean'); fs.mkdirSync(cleanDir, { recursive: true });
  for (let i = 0; i < nLines; i++) {
    const f = path.join(dir, 'voice', id, String(i + 1).padStart(2, '0') + '.mp3'); let d = 0;
    // each line is cleaned once: Edge leaves about 0.9 s of silence after every full stop and at both ends, which drags the comedy.
    // Trim the ends, shorten every inner pause to about 0.4 s, apply the speed-up; the timing then follows the cleaned file.
    const cw = path.join(cleanDir, String(i + 1).padStart(2, '0') + '.wav');
    try { if (fs.statSync(f).size > 0) {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-af', `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-45dB:stop_silence=0.22,atempo=${tempo0}`, '-ar', '44100', '-ac', '2', cw]);
      d = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', cw]); } } catch (e) { d = 0; }
    if (!d) { missing.push(i + 1); d = (await page.evaluate((k) => EP.voice[k].text.length, i)) * 0.062 / tempo0; }
    durs.push(d);
  }
  if (missing.length) console.log('MISSING voice lines (timed from their text, no sound): ' + missing.join(', '));
  await page.evaluate((d) => resolveTiming(EP, d), durs);
  if (opt('style')) await page.evaluate((st) => { EP.style = st; }, opt('style'));
  const tag = id + (opt('style') ? '-' + opt('style') : '');
  // timing of every voice line and scene, used by cutdowns.cjs and compile.cjs
  const timing = await page.evaluate((d) => ({ id: EP.id, title: EP.title, dur: EP.dur, voice: EP.voice.map((l, i) => ({ i, who: l.who, text: l.text, at: +(l.at ?? 0).toFixed(3), d: +(l.d ?? d[i]).toFixed(3) })), scenes: EP.scenes.map((s) => ({ from: s.from, to: s.to })) }), durs);
  fs.writeFileSync(path.join(out, id + '-timing.json'), JSON.stringify(timing, null, 1));
  if (opt('timing')) { await browser.close(); console.log(path.join(out, id + '-timing.json')); return; }
  const dur = await page.evaluate(() => EP.dur);
  if (opt('stills')) {
    for (const s of String(opt('stills')).split(',')) {
      await page.evaluate((t) => draw(t), +s);
      await page.screenshot({ path: path.join(out, `${tag}-still-${String(s).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 80 });
    }
    await browser.close(); return;
  }
  const mp4 = path.join(out, tag + '.mp4');
  const vo = await page.evaluate(() => ({ lines: EP.voice || [], tempo: EP.voiceTempo || 1 }));
  const snd = await page.evaluate(() => ({ sfx: EP.sfx || [], music: EP.music || [] }));
  const voFiles = vo.lines.map((l, i) => ({ ...l, n: l.n || String(i + 1).padStart(2, '0'), f: path.join(dir, 'voice', id, (l.n || String(i + 1).padStart(2, '0')) + '.mp3') })).filter((l) => fs.existsSync(l.f) && fs.statSync(l.f).size > 0);
  const silent = path.join(out, tag + '-silent.mp4');
  if (!opt('audio-only')) {
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-shortest', '-r', '24', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => draw(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\r${i}/${n}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  }
  await browser.close();
  // sound: effects and music are synthesised (sfx.cjs) into one bed; each voice line is laid at its time. --audio-only redoes just this.
  const tmp = path.join(out, tag + '-vo'); fs.mkdirSync(tmp, { recursive: true });
  const bed = path.join(tmp, 'bed.wav');
  require('./sfx.cjs').bed(bed, dur, snd.sfx, opt('no-music') ? [] : snd.music);
  // speed each line up in its own step: atempo inside the delay+mix graph gives silence in this ffmpeg
  for (const l of voFiles) l.w = path.join(cleanDir, l.n + '.wav'); // cleaned and sped up when the timing was measured
  const ins = voFiles.flatMap((l) => ['-i', l.w]);
  const fl = voFiles.map((l, i) => `[${i + 2}:a]adelay=${Math.round(l.at * 1000)}:all=1[a${i}]`).join(';') + (voFiles.length ? ';' : '') +
    '[1:a]' + voFiles.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${voFiles.length + 1}:normalize=0,alimiter=limit=0.95,apad[a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', silent, '-i', bed, ...ins, '-filter_complex', fl, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-t', String(dur), '-movflags', '+faststart', mp4]);
  for (const l of voFiles) { const d = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', l.w]); console.log(`${l.n} ${l.at.toFixed(1)}s to ${(l.at + d).toFixed(1)}s`); }
  fs.rmSync(tmp, { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vf', 'scale=720:1280', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'copy', '-movflags', '+faststart', path.join(out, tag + '-720.mp4')]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vf', `fps=1,scale=216:-1,tile=12x${Math.ceil(dur / 12)}`, '-frames:v', '1', path.join(out, tag + '-sheet.jpg')]);
  console.log(`\n${mp4} (${dur}s)`);
})();
