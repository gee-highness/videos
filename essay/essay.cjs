#!/usr/bin/env node
/* Documentary "video essay" maker: one narrator, AI-generated stills with a slow push or pan, crossfades,
   monospace captions in black boxes, a quiet ambient bed. Everything is driven by projects/<id>/script.md.

   node essay/essay.cjs plan <id>              -> projects/<id>/prompts.md (one image prompt per shot, style added)
                                                  and projects/<id>/termux.sh (paste into Termux to make the voices)
   node essay/essay.cjs render <id>            -> projects/<id>/out/<id>.mp4 (1920x1080) and <id>-sheet.jpg
   node essay/essay.cjs render <id> --vertical -> also <id>-9x16.mp4 (1080x1920, for Shorts/Reels/Status)
   node essay/essay.cjs render <id> --vertical-only -> only <id>-9x16.mp4 (skips the 16:9 render, about half the time)
   node essay/essay.cjs render <id> --to 12    -> only the first 12 shots (quick check)
   node essay/essay.cjs check <id>             -> what is missing (images, voice files) and the estimated length

   Files:  projects/<id>/img/01.png|jpg|webp ...  (missing images render as a labelled placeholder, so drafts work)
           projects/<id>/voice/01.mp3 ...         (missing voice renders silent, timed from the text)
           projects/<id>/music.mp3                (optional; otherwise a soft synthesised pad, or none with music: none) */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const [cmd, id] = process.argv.slice(2), args = process.argv.slice(4);
const opt = (k) => { const i = args.indexOf('--' + k); return i < 0 ? null : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true; };
if (!cmd || !id) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(1); }
const P = path.join(ROOT, 'projects', id), WORK = path.join(P, '.work'), OUT = path.join(P, 'out');
const STYLES = JSON.parse(fs.readFileSync(path.join(__dirname, 'styles.json'), 'utf8'));
const FPS = 25, W = 1920, H = 1080, XF = 0.6, LEAD = 0.25;
const ff = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: ['ignore', 'inherit', 'inherit'], maxBuffer: 1 << 28 });
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const nn = (i) => String(i + 1).padStart(2, '0');

// ---------- the script ----------
function parse() {
  const src = fs.readFileSync(path.join(P, 'script.md'), 'utf8');
  const meta = {}, body = src.replace(/^---\n([\s\S]*?)\n---\n/, (_, m) => { for (const l of m.split('\n')) { const k = /^(\w+):\s*(.*)$/.exec(l); if (k) meta[k[1]] = k[2].trim(); } return ''; });
  const shots = []; let section = '', pendingChapter = null, curPart = 1;
  for (const raw of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('<!--')) continue;
    // "# Title" starts a chapter: a title card on screen and a YouTube chapter. "## note" is only for you.
    if (/^#\s/.test(l)) { section = l.replace(/^#\s*/, ''); pendingChapter = section; continue; }
    if (l.startsWith('#')) continue;
    const tvM = /^\[tv\s+(\S+)\]$/.exec(l); if (tvM) { if (!shots.length) throw new Error('[tv] before the first [img] line'); shots[shots.length - 1].tv = tvM[1]; continue; } // what the host's TV shows (made by essay/host-vme.cjs)
    const hostM = /^\[host(?:\s+([\w-]+))?(?:\s+([\w-]+))?(?:\s+([\w-]+))?\]$/.exec(l);
    if (hostM) { if (!shots.length) throw new Error('[host] before the first [img] line'); const sh = shots[shots.length - 1], words = [hostM[1], hostM[2], hostM[3]].filter(Boolean);
      sh.host = { full: words.includes('full'), name: words.includes('name'), pose: words.find((w) => w !== 'full' && w !== 'name') || null }; continue; } // the channel host on screen for this shot
    const stk = /^\[sticker\s+(.+)\]$/.exec(l); // a sticker on this part of the video: this is a substitute for the media we wanted
    if (stk) { if (!shots.length) throw new Error('[sticker] before the first [img] line'); shots[shots.length - 1].sticker = stk[1].trim(); continue; }
    const unl = /^\[(unless|when)\s+(\S+)\]$/.exec(l);
    if (unl) { if (!shots.length) throw new Error('[unless] or [when] before the first [img] line'); shots[shots.length - 1][unl[1]] = unl[2]; continue; } // this shot is dropped when media/<file> exists (a typed-quote fallback for a real clip)
    const tc = (x) => x.includes(':') ? x.split(':').reduce((a, v) => a * 60 + +v, 0) : +x;
    const shotM = /^\[shot\]\s*([^|]+?)\s*(?:\|\s*(.*))?$/.exec(l), clipM = /^\[clip\]\s*(\S+)\s+([\d:.]+)-([\d:.]+)((?:\s+(?:sound|mute))*)\s*(?:\|\s*(.*))?$/.exec(l), subsM = /^\[subs\]\s*(.*)$/.exec(l);
    if (shotM || clipM || subsM) { if (!shots.length) throw new Error('[shot], [clip] or [subs] before the first [img] line: ' + l); const sh = shots[shots.length - 1];
      const cr = (t) => { const [credit, url] = (t || '').split('|').map((x) => x.trim()); return { credit: credit || '', url: url || '' }; };
      if (shotM) sh.media = { kind: 'shot', file: shotM[1].trim(), ...cr(shotM[2]) };
      if (clipM) { const o = /sound/.test(clipM[4]); sh.media = { kind: 'clip', file: clipM[1], start: tc(clipM[2]), end: tc(clipM[3]), sound: o, ...cr(clipM[5]) }; }
      if (subsM) sh.subs = subsM[1].split('//').map((x) => x.trim()).filter(Boolean).map((x) => { const m = /^(\d+:\d+(?:\.\d+)?|\d+(?:\.\d+)?s)\s+(.*)$/.exec(x); return m ? { at: tc(m[1].replace(/s$/, '')), text: m[2] } : { text: x }; });
      continue; }
    const partM = /^\[part\s+(\d+)\]$/.exec(l); if (partM) { curPart = +partM[1]; continue; } // [part 2]: the shots after this line are the second upload (each part stays inside the reel limit)
    const edM = /^\[(low|cut|src|tag)(?:\s+(.+))?\]$/.exec(l);
    if (edM) { if (!shots.length) throw new Error('[' + edM[1] + '] before the first [img] line'); const sh = shots[shots.length - 1];
      if (edM[1] === 'low') sh.low = true; // droppable when the part runs over the reel limit
      else if (edM[1] === 'cut') { const [w, name] = (edM[2] || '').split(/\s+/); if (w && name) (sh.cuts ||= []).push({ word: w.replace(/_/g, ' '), name }); } // [cut word img]: switch to img/<img>.png when the narrator says <word>
      else if (edM[1] === 'src') sh.src = (edM[2] || '').trim(); // a source chip: [src Highway Mail, 20 Nov]
      else sh.tag = (edM[2] || '').trim(); // a sliding tag: [tag WED 18 NOV · 7 AM]
      continue; }
    const card = /^\[card\]\s*(.*)$/.exec(l), pz = /^\[pause\s+([\d.]+)\]$/.exec(l), quote = /^\[quote\]\s*(.*)$/.exec(l),
      mus = /^\[music\s+(\w+)\]$/.exec(l), fx = /^\[sfx\s+(\w+)(?:\s+(end|[+-]?[\d.]+))?(?:\s+x([\d.]+))?\]$/.exec(l);
    if (card || pz || quote || mus || fx) { if (!shots.length) throw new Error('[card], [quote], [pause], [music] or [sfx] before the first [img] line: ' + l); const sh = shots[shots.length - 1];
      if (card) { const [big, small] = card[1].split('|').map((x) => x.trim()); sh.card = { big, small: small || '' }; }
      else if (quote) { const k = quote[1].indexOf('|'); sh.quote = k < 0 ? { who: '', text: quote[1].trim() } : { who: quote[1].slice(0, k).trim(), text: quote[1].slice(k + 1).trim() }; }
      else if (mus) sh.music = mus[1];
      else if (fx) (sh.sfx ||= []).push({ name: fx[1], at: fx[2] || '0', vol: fx[3] ? +fx[3] : 1 });
      else sh.pause = +pz[1];
      continue; }
    const m = /^\[img(?:\s+(same))?\]\s*(.*)$/.exec(l);
    if (m) { shots.push({ section, chapter: pendingChapter, part: curPart, prompt: m[2], same: !!m[1], text: '', move: (/\{move:(\w+)\}/.exec(m[2]) || [])[1] }); pendingChapter = null; shots[shots.length - 1].prompt = m[2].replace(/\{move:\w+\}/, '').trim(); continue; }
    if (!shots.length) throw new Error('Narration before the first [img] line: ' + l.slice(0, 60));
    shots[shots.length - 1].text += (shots[shots.length - 1].text ? ' ' : '') + l;
  }
  // Voice and image files are numbered by shot. A [when] shot (a real clip that is only there when its file is) takes the previous
  // shot's number, so adding clips never renumbers the voices or pictures already recorded.
  let counter = 0; shots.forEach((sh) => { if (sh.when) sh.i = Math.max(0, counter - 1); else sh.i = counter++; });
  const style = STYLES[meta.style || 'retro-office'];
  if (!style) throw new Error('Unknown style ' + meta.style + ' (essay/styles.json)');
  return { meta: { voice: 'en-US-AndrewMultilingualNeural', rate: '-4%', music: 'pad', ...meta }, style, shots };
}
const spoken = (t) => t.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

// ---------- plan: image prompts and the Termux voice script ----------
function plan() {
  const { meta, style, shots } = parse();
  { const hj = meta.host && path.join(path.dirname(path.join(__dirname, '..', meta.host)), 'host.json'); // a locked host speaks the same way in every video (hosts/<name>/host.json, private)
    if (hj && fs.existsSync(hj)) { const h = JSON.parse(fs.readFileSync(hj, 'utf8')); if (h.lock) { meta.voice = h.voice; meta.rate = h.rate; meta.pitch = h.pitch || ''; console.log(`host voice locked: ${h.voice} ${h.rate} ${h.pitch || ''}`); } } }
  let md = `# ${meta.title || id}: image prompts\n\nMake each image ${style.aspect || '16:9'} and save it as \`projects/${id}/img/NN.png\` (or .jpg/.webp). Shots marked "same image" reuse the one before.\n\nStyle added to every prompt:\n> ${style.prompt}\n\n`;
  shots.forEach((s) => { const i = s.i; if (s.when && s.same) return; md += `## ${nn(i)}${s.section ? ' · ' + s.section : ''}\n` + (s.same ? '_same image as the shot before_\n\n' : '```\n' + s.prompt + '. ' + style.prompt + '\n```\n') + `Narration: ${spoken(s.text)}\n\n`; });
  fs.writeFileSync(path.join(P, 'prompts.md'), md);
  const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
  let sh = `# ${meta.title || id}: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).\n# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/${id}-voice.zip\n`;
  sh += `say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=${meta.rate} ${meta.pitch ? `--pitch=${meta.pitch} ` : ''}--voice ${meta.voice} --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }\n`;
  sh += `mkdir -p ~/storage/downloads/${id}-voice && cd ~/storage/downloads/${id}-voice\n`;
  shots.forEach((s) => { const i = s.i; if (spoken(s.text)) sh += `say ${nn(i)} ${q(spoken(s.text))}\n`; });
  sh += `cd .. && rm -f ${id}-voice.zip && zip -qr ${id}-voice.zip ${id}-voice && find ${id}-voice -name "*.mp3" -size 0 && echo "Done: Downloads/${id}-voice.zip (a file listed above is empty: run the block again)"\n`;
  fs.writeFileSync(path.join(P, 'termux.sh'), sh);
  const words = shots.reduce((a, s) => a + spoken(s.text).split(' ').length, 0);
  console.log(`${shots.length} shots, ${words} words, about ${(words / 145).toFixed(1)} min.\n${path.join(P, 'prompts.md')}\n${path.join(P, 'termux.sh')}`);
}

// ---------- captions: two lines of at most ~40 characters, timed by characters within each shot ----------
function chunk(text, max = 40) {
  const out = [], sentences = spoken(text).match(/[^.!?]+[.!?]*["”’)]*\s*/g) || [];
  for (const s of sentences) {
    const words = s.trim().split(' '); let lines = [], cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    for (let i = 0; i < lines.length; i += 2) {
      let a = lines[i], b = lines[i + 1];
      if (b && i + 2 === lines.length - 1 && lines[i + 2].split(' ').length <= 2) { b += ' ' + lines[i + 2]; i++; } // no orphan word on its own card
      out.push(b ? [a, b] : [a]);
    }
  }
  return out;
}
const assTime = (t) => { const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = (t % 60).toFixed(2).padStart(5, '0'); return `${h}:${String(m).padStart(2, '0')}:${s}`; };
function ass(cues, w, h, style, shots = [], hostName = '') {
  const c = style.captions, v = w < h, fs2 = Math.round(h * (v ? c.sizeVertical : c.size)), mv = Math.round(h * (v ? c.marginVVertical : c.marginV));
  const bigMax = Math.round(Math.min(w * 0.16, h * 0.2)), wrapAss = (txt, size) => { const mx = Math.max(8, Math.floor((w * 0.84) / (size * 0.62))); const out = []; let cur = ''; for (const wd of String(txt).split(' ')) { if ((cur + ' ' + wd).trim().length > mx && cur) { out.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); } if (cur) out.push(cur); return out.join('\\N'); }, fit = (txt, mx, k = 0.62) => Math.max(24, Math.min(mx, Math.round((w * 0.86) / (Math.max(...String(txt).split('\n').map((x) => x.length)) * k)))), small = Math.round(fs2 * (style.captions.mode === 'pop' ? 1.25 : 0.95)), big = style.captions.mode === 'pop' ? Math.round(Math.min(w * 0.3, h * 0.17)) : bigMax, accent = style.accentAss || '&H0092A29E';
  const dim = (a) => `{\\an7\\pos(0,0)\\bord0\\shad0\\1c&H000000&\\1a&H${a}&\\p1}m 0 0 l ${w} 0 ${w} ${h} 0 ${h}{\\p0}`;
  const ev = [];
  const NUMW = /^(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion|\d[\d,.]*[%k]?)$/i;
  const popEv = (q) => { // bold word-by-word captions: each word pops in as it is said; a number (or the longest word) is in the accent colour
    const words = []; q.lines.forEach((l, li) => l.replace(/[{}]/g, '').split(' ').forEach((wd) => { if (wd) words.push({ wd: c.upper ? wd.toUpperCase() : wd, li }); }));
    if (!words.length) return [];
    let ai = words.findIndex((x) => NUMW.test(x.wd.replace(/[^\w,.%]/g, ''))); if (ai < 0) { let best = 0; words.forEach((x, j) => { if (x.wd.length > words[best].wd.length) best = j; }); ai = words[best].wd.length >= 5 ? best : -1; }
    const tot = words.reduce((a, x) => a + x.wd.length + 2, 0), dur = Math.max(0.3, q.b - q.a); let acc = 0; const st = words.map((x) => { const t = q.a + dur * 0.88 * acc / tot; acc += x.wd.length + 2; return t; });
    return words.map((_, k) => { let txt = '', cur = words[0].li;
      words.forEach((x, j) => { if (x.li !== cur) { txt += '\\N'; cur = x.li; } else if (j) txt += ' ';
        txt += (j === k ? '{\\fscx70\\fscy70\\t(0,90,\\fscx114\\fscy114)\\t(90,170,\\fscx100\\fscy100)}' : '') + (j === ai ? '{\\1c&H0066D1FF&}' : '') + (j > k ? '{\\alpha&HFF&}' : '') + x.wd + (j === ai ? '{\\1c&HFFFFFF&}' : '') + (j > k ? '{\\alpha&H00&}' : ''); });
      return `Dialogue: 3,${assTime(st[k])},${assTime(k + 1 < words.length ? st[k + 1] : q.b)},Cap,,0,0,0,,${txt}`; }); };
  shots.forEach((s) => {
    const cx = Math.round(w / 2), cy = Math.round(h * (v ? 0.4 : 0.42));
    if (s.src) { const a = s.S + s.lead + 0.25, b = Math.min(s.S + s.D - 0.2, a + 3.6); ev.push(`Dialogue: 4,${assTime(a)},${assTime(b)},Src,,0,0,0,,{\\fad(180,180)\\an7\\pos(${Math.round(w * 0.05)},${Math.round(h * (v ? 0.075 : 0.08))})}SOURCE · ${s.src.replace(/[{}]/g, '').toUpperCase()}`); }
    if (s.tag) { const a = s.S + s.lead + 0.15, b = Math.min(s.S + s.D - 0.2, a + 3.4), ty = Math.round(h * (v ? 0.13 : 0.14)); ev.push(`Dialogue: 4,${assTime(a)},${assTime(b)},Tag,,0,0,0,,{\\an9\\move(${w + 500},${ty},${w - Math.round(w * 0.04)},${ty},0,260)\\fad(0,220)}${s.tag.replace(/[{}]/g, '').toUpperCase()}`); }
    if (s.chapter && s.chapterNo > 1) { // a chapter card while the narrator waits: dim the picture, show the number and the title
      const a = s.S + 0.15, b = s.S + s.lead - 0.05;
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(250,250)}${dim('40')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Title,,0,0,0,,{\\fad(300,250)\\an5\\pos(${cx},${cy})}{\\fs${small}\\1c${accent}}PART ${s.chapterNo}\\N{\\fs${fit(s.chapter, Math.round(big * 0.55), 0.6)}\\1c&HFFFFFF&}${wrapAss(s.chapter.replace(/[{}]/g, ''), fit(s.chapter, Math.round(big * 0.55), 0.6))}`);
    }
    if (s.media && s.mhave && s.media.credit) { const a = s.S + s.lead + 0.3, b = s.S + s.D - 0.2; ev.push(`Dialogue: 4,${assTime(a)},${assTime(b)},Credit,,0,0,0,,{\\fad(200,200)}${(s.media.kind === 'clip' ? 'Clip: ' : 'Source: ') + s.media.credit.replace(/[{}]/g, '')}`); }
    if (s.sticker) { // "SUBSTITUTE" sticker: honest label for stand-in media, on screen for the whole shot, tilted like a sticker, never wider than 40% of the frame
      const a = s.S + s.lead + 0.15, b = s.S + s.D - 0.15, sx = Math.round(w * (v ? 0.05 : 0.035)), sy = Math.round(h * (v ? 0.05 : 0.07)), big2 = Math.round(fs2 * (v ? 1.05 : 1.0)), sm = Math.round(big2 * 0.72);
      const mx = Math.max(10, Math.floor((w * (v ? 0.7 : 0.4)) / (sm * 0.6))), lines = []; let cur = '';
      for (const wd of s.sticker.replace(/[{}]/g, '').split(' ')) { if ((cur + ' ' + wd).trim().length > mx && cur) { lines.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); } if (cur) lines.push(cur);
      ev.push(`Dialogue: 5,${assTime(a)},${assTime(b)},Sticker,,0,0,0,,{\\fad(200,200)\\an7\\pos(${sx},${sy})\\frz-3\\fs${big2}}{\\b1}SUBSTITUTE\\N{\\b0\\fs${sm}}${lines.join('\\N')}`);
    }
    if (s.host && s.host.name && hostName) { // name label: large, boxed for contrast, low-left clear of her face (UX rule)
      const a = s.S + s.lead + 0.2, b = Math.min(s.S + s.D - 0.2, a + 4.5), nx = Math.round(w * (v ? 0.06 : 0.05)), ny = Math.round(h * (v ? 0.66 : 0.74)), nf = Math.round(fs2 * (v ? 1.9 : 1.7));
      ev.push(`Dialogue: 4,${assTime(a)},${assTime(b)},Name,,0,0,0,,{\\fad(250,250)\\an7\\pos(${nx},${ny})\\fs${nf}}${hostName.toUpperCase()}\\N{\\fs${Math.round(nf * 0.5)}\\1c${accent}}your host`); }
    if (s.quote) { // someone's words on screen (a quote from the show or a post): the speaker's name, then the words
      const a = s.S + s.lead + 0.1, b = s.S + s.D - 0.2, q = s.quote, qs = Math.round(fs2 * (v ? 1.3 : 1.7));
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(250,250)}${dim('70')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Quote,,0,0,0,,{\\fad(250,250)\\an5\\pos(${cx},${cy})\\q0}${q.who ? `{\\fs${small}\\1c${accent}}${q.who.replace(/[{}]/g, '').toUpperCase()}\\N{\\fs${qs}\\1c&HFFFFFF&}` : ''}${wrapAss(q.text.replace(/[{}]/g, ''), qs)}`);
    }
    if (s.card) { // a statistic or key phrase on screen while it is said
      const a = s.S + s.lead + 0.15, b = s.S + s.D - 0.25;
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(300,300)}${dim('80')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Title,,0,0,0,,{\\fad(300,300)\\an5\\pos(${cx},${cy})\\t(0,600,\\fscx100\\fscy100)\\fscx92\\fscy92}{\\fs${fit(s.card.big, big)}}${s.card.big.replace(/[{}]/g, '')}${s.card.small ? `\\N{\\fs${small}\\1c${accent}}${wrapAss(s.card.small.replace(/[{}]/g, ''), small)}` : ''}`);
    }
  });
  return `[Script Info]\nScriptType: v4.00+\nPlayResX: ${w}\nPlayResY: ${h}\nWrapStyle: 2\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n` +
    (c.mode === 'pop' ? `Style: Cap,${c.font},${fs2},&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,1,${Math.round(fs2 * 0.11)},${Math.round(fs2 * 0.05)},2,50,50,${mv},1\n` : `Style: Cap,${c.font},${fs2},&H00FFFFFF,&H00FFFFFF,${c.box},${c.box},0,0,0,0,100,100,0,0,3,${Math.round(fs2 * 0.18)},0,2,60,60,${mv},1\n`) +
    `Style: Title,${c.font},${big},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,0,2,5,60,60,0,1\n` +
    `Style: Quote,${c.font},${Math.round(fs2 * 1.35)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,1,0,0,100,100,0,0,1,0,2,5,${Math.round(w * (v ? 0.08 : 0.16))},${Math.round(w * (v ? 0.08 : 0.16))},0,1\n` +
    `Style: Credit,${c.font},${Math.round(fs2 * 0.62)},&H00DDDDDD,&H00DDDDDD,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,${Math.round(fs2 * 0.06)},1,1,${Math.round(w * 0.025)},60,${Math.round(h * 0.03)},1\n` +
    `Style: Name,${c.font},${Math.round(fs2 * 1.7)},&H00FFFFFF,&H00FFFFFF,${c.box},${c.box},1,0,0,0,100,100,0,0,3,${Math.round(fs2 * 0.22)},0,7,0,0,0,1\n` +
    `Style: Sticker,${c.font},${Math.round(fs2 * 0.72)},&H00101010,&H00101010,&H004BC8F5,&H004BC8F5,0,0,0,0,100,100,0,0,3,${Math.round(fs2 * 0.2)},0,7,0,0,0,1\n` +
    `Style: Src,${c.font},${Math.round(fs2 * 0.62)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,3,${Math.round(fs2 * 0.14)},0,7,0,0,0,1\n` +
    `Style: Tag,${c.font},${Math.round(fs2 * 0.95)},&H00101010,&H00101010,&H004BC8F5,&H004BC8F5,0,0,0,0,100,100,1,0,3,${Math.round(fs2 * 0.2)},0,9,0,0,0,1\n` +
    `Style: Fx,${c.font},10,&H00000000,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n` +
    [...ev, ...(c.mode === 'pop' ? cues.flatMap(popEv) : cues.map((q) => `Dialogue: 3,${assTime(q.a)},${assTime(q.b)},Cap,,0,0,0,,${q.lines.map((l) => l.replace(/[{}]/g, '')).join('\\N')}`))].join('\n') + '\n';
}

// ---------- render ----------
function placeholder(file, i, prompt, style, W = 1920, H = 1080) {
  const tf = path.join(WORK, `ph${nn(i)}.txt`), wrap = (prompt || 'image').replace(W < H ? /(.{1,27})(\s|$)/g : /(.{1,58})(\s|$)/g, '$1\n').slice(0, 520);
  fs.writeFileSync(tf, `SHOT ${nn(i)}  (placeholder: add projects/${id}/img/${nn(i)}.png)\n\n${wrap}`);
  ff(['-f', 'lavfi', '-i', `color=c=${style.placeholder || '0x1c2523'}:s=${W}x${H}`, '-vf', `drawtext=fontfile=${path.join(__dirname, 'fonts/NotoSansMono.ttf')}:textfile=${tf}:fontcolor=0x9ea292:fontsize=34:x=${W < H ? 60 : 120}:y=${W < H ? 420 : 200}:line_spacing=10`, '-frames:v', '1', file]);
}
function render() {
  const { shots } = parse(), parts = [...new Set(shots.map((x) => x.part))].sort((a, b) => a - b), want = opt('part') && opt('part') !== true ? [+opt('part')] : parts;
  want.forEach((pn) => renderPart(pn, parts.length));
}
function renderPart(partNo, nParts) {
  const sfxp = nParts > 1 ? `-part${partNo}` : '', { meta, style, shots } = parse(), to = opt('to') ? +opt('to') : shots.length, has = (f) => fs.existsSync(path.join(P, 'media', f)) && fs.statSync(path.join(P, 'media', f)).size > 0, dropped = (x) => (x.unless && has(x.unless)) || (x.when && !has(x.when)), use0 = shots.filter((x) => x.part === partNo).slice(0, to).filter((x) => !dropped(x));
  fs.mkdirSync(WORK, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
  let use = use0; const pause = style.pause ?? 0.45, gap = style.gap ?? 0.45;
  // 1. voice: clean each line (Edge leaves ~0.9 s after every full stop), measure it
  const missing = [];
  use.forEach((s, i) => {
    const f = path.join(P, 'voice', nn(s.i) + '.mp3'), w = path.join(WORK, `v${nn(s.i)}.wav`);
    if (fs.existsSync(f) && fs.statSync(f).size > 0) {
      ff(['-i', f, '-af', `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=stop_periods=-1:stop_duration=${pause}:stop_threshold=-45dB:stop_silence=${pause}`, '-ar', '44100', '-ac', '2', w]);
      s.d = dur(w); s.wav = w;
    } else { if (spoken(s.text)) missing.push(nn(s.i)); s.d = spoken(s.text).length * 0.066; s.wav = null; }
    if (s.quote && !spoken(s.text)) s.d = Math.max(s.d, s.quote.text.split(' ').length * 0.34 + 1.2); // a silent quote card stays up long enough to read
    s.mpath = s.media && path.join(P, 'media', s.media.file); s.mhave = !!(s.mpath && fs.existsSync(s.mpath) && fs.statSync(s.mpath).size > 0);
    if (s.media) { const silent = !spoken(s.text);
      if (s.media.kind === 'clip') s.d = silent ? Math.max(s.d, s.media.end - s.media.start) : Math.max(s.d, 3);
      else if (silent) s.d = Math.max(s.d, 4.5);
      if (s.mhave && s.quote) s.quote = null; } // the real post or clip replaces the typed quote; without the file the typed quote stays
    s.lead = LEAD + (s.chapter && i > 0 ? (style.chapterHold ?? 1.8) : 0);
    s.D = s.lead + s.d + gap + (s.pause || 0) + (i === use.length - 1 ? 2.5 : 0);
  });
  if (missing.length) console.log(`No voice for shots ${missing.join(', ')}: silent, timed from the text.`);
  { const limit = +(meta.limit || 90); let tot = use.reduce((a, x) => a + x.D, 0); // the reel limit: drop [low] shots (last first) until the part fits
    if (tot > limit && !opt('keep-low')) for (const x of [...use].reverse()) { if (tot <= limit) break; if (x.low) { tot -= x.D; use = use.filter((y) => y !== x); console.log(`part ${partNo} is over the ${limit} s limit: dropped the low-priority shot ${nn(x.i)}`); } }
    if (tot > limit) console.log(`WARNING: part ${partNo} is ${tot.toFixed(0)} s, over the ${limit} s reel limit: split it with [part N] or mark shots [low]`); else console.log(`part ${partNo}: ${tot.toFixed(0)} s (limit ${limit} s)`); }
  let t = 0, chNo = 0; use.forEach((s) => { s.S = t; t += s.D; if (s.chapter) s.chapterNo = ++chNo; }); const total = t;
  // YouTube chapters for the description (the first must start at 0:00)
  const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const chs = use.filter((s) => s.chapter).map((s, k) => `${mmss(k === 0 ? 0 : s.S)} ${s.chapter}`);
  fs.mkdirSync(OUT, { recursive: true }); if (chs.length) fs.writeFileSync(path.join(OUT, `${id}${sfxp}-chapters.txt`), chs.join('\n') + '\n');
  // 2 and 3. pictures and the joined video, once for each shape: 1920x1080 and (with --vertical) a native 1080x1920 recomposition
  const probe = (f) => { try { const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', f]).toString().trim().split('x').map(Number); return { w, h }; } catch { return { w: 16, h: 9 }; } };
  const moves = style.moves || ['in', 'panR', 'out', 'panL'];
  const buildVideo = (W, H, tag) => {
    const vert = H > W; let lastImg = null;
    use.forEach((s, i) => {
      let img = ['png', 'jpg', 'jpeg', 'webp'].map((e) => path.join(P, 'img', `${nn(s.i)}.${e}`)).find((f) => fs.existsSync(f));
      if (!img && s.same && lastImg && !(s.media && !s.mhave)) img = lastImg;
      if (!img) { img = path.join(WORK, `ph${nn(s.i)}${vert ? 'v' : ''}.png`); placeholder(img, s.i, (s.media && !s.mhave ? `[${s.media.kind.toUpperCase()} MISSING: media/${s.media.file}${s.media.kind === 'clip' ? ` ${s.media.start}-${s.media.end}s` : ''}] ` : '') + s.prompt, style, W, H); }
      lastImg = img;
      const L = s.D + (i < use.length - 1 ? XF : 0), N = Math.round(L * FPS), z = style.zoom ?? 0.07, mv = s.move || moves[i % moves.length];
      const grade = style.grade || 'null', base = path.join(WORK, `c${nn(s.i)}${tag}.mp4`), enc = ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17'];
      if (!vert) {
        const Z = { in: `1+${z}*on/${N}`, out: `${1 + z}-${z}*on/${N}`, panR: `${1 + z}`, panL: `${1 + z}`, up: `${1 + z}`, down: `${1 + z}`, hold: '1' }[mv] || `1+${z}*on/${N}`;
        const X = { panR: `(iw-iw/zoom)*on/${N}`, panL: `(iw-iw/zoom)*(1-on/${N})` }[mv] || 'iw/2-(iw/zoom/2)';
        const Y = { up: `(ih-ih/zoom)*(1-on/${N})`, down: `(ih-ih/zoom)*on/${N}` }[mv] || 'ih/2-(ih/zoom/2)';
        ff(['-i', img, '-vf', `scale=${W * 1.5}:${H * 1.5}:force_original_aspect_ratio=increase,crop=${W * 1.5}:${H * 1.5},zoompan=z='${Z}':x='${X}':y='${Y}':d=${N}:s=${W}x${H}:fps=${FPS},${grade},format=yuv420p`, '-frames:v', String(N), ...enc, '-pix_fmt', 'yuv420p', base]);
      } else { // 9:16: slide a portrait window across the wide picture (pans), then push in or out on it
        const cw = Math.round(W * 1.5), ch = Math.round(H * 1.5), T = (N / FPS).toFixed(3);
        const pan = { panR: `(0.32+0.36*t/${T})`, panL: `(0.68-0.36*t/${T})` }[mv] || '0.5';
        const Z = { in: `1+${z}*on/${N}`, out: `${1 + z}-${z}*on/${N}`, panR: `1+${z / 2}*on/${N}`, panL: `1+${z / 2}*on/${N}`, up: `${1 + z}`, down: `${1 + z}`, hold: '1' }[mv] || `1+${z}*on/${N}`;
        const Y = { up: `(ih-ih/zoom)*(1-on/${N})`, down: `(ih-ih/zoom)*on/${N}` }[mv] || 'ih/2-(ih/zoom/2)';
        ff(['-loop', '1', '-framerate', String(FPS), '-t', T, '-i', img, '-vf', `scale=-2:${ch}:force_original_aspect_ratio=increase,crop=${cw}:${ch}:x='(iw-${cw})*${pan}':y=0,zoompan=z='${Z}':x='iw/2-(iw/zoom/2)':y='${Y}':d=1:s=${W}x${H}:fps=${FPS},${grade},format=yuv420p`, '-frames:v', String(N), ...enc, '-pix_fmt', 'yuv420p', base]);
      }
      s.clip = base;
      if (s.cuts && s.cuts.length && spoken(s.text)) { // word-timed cuts: a new picture on the word being said (hard cut, short push)
        const txt = spoken(s.text), found = [];
        s.cuts.forEach((c) => { const ix = txt.toLowerCase().indexOf(c.word.toLowerCase()); const f = ['png', 'jpg', 'jpeg', 'webp'].map((e) => path.join(P, 'img', `${c.name}.${e}`)).find((q) => fs.existsSync(q)); if (ix >= 0 && f) found.push({ t: Math.min(Math.max(s.lead + s.d * (ix / txt.length) - 0.12, 0.7), L - 0.9), img: f }); });
        found.sort((a, b) => a.t - b.t);
        if (found.length) { s.cutAt = found.map((x) => x.t); const ins = ['-i', base]; let fc = '', prev = '[0:v]';
          found.forEach((c, k) => { const cf = path.join(WORK, `cut${nn(s.i)}${k}${tag}.mp4`), Lc = L - c.t, Nc = Math.round(Lc * FPS), mvc = ['in', 'panR', 'out', 'panL'][(i + k + 1) % 4], zc = style.zoom ?? 0.07;
            const Zc = { in: `1+${zc}*on/${Nc}`, out: `${1 + zc}-${zc}*on/${Nc}`, panR: `1+${zc / 2}*on/${Nc}`, panL: `1+${zc / 2}*on/${Nc}` }[mvc], cw = Math.round(W * 1.5), ch = Math.round(H * 1.5), Tc = Lc.toFixed(3);
            const pan = { panR: `(0.32+0.36*t/${Tc})`, panL: `(0.68-0.36*t/${Tc})` }[mvc] || '0.5';
            ff(['-loop', '1', '-framerate', String(FPS), '-t', Tc, '-i', c.img, '-vf', vert ? `scale=-2:${ch}:force_original_aspect_ratio=increase,crop=${cw}:${ch}:x='(iw-${cw})*${pan}':y=0,zoompan=z='${Zc}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},${grade},format=yuv420p` : `scale=${W * 1.5}:${H * 1.5}:force_original_aspect_ratio=increase,crop=${W * 1.5}:${H * 1.5},zoompan=z='${Zc}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Nc}:s=${W}x${H}:fps=${FPS},${grade},format=yuv420p`, '-frames:v', String(Nc), ...enc, '-pix_fmt', 'yuv420p', cf]);
            ins.push('-i', cf); fc += `[${k + 1}:v]setpts=PTS-STARTPTS+${c.t.toFixed(3)}/TB[c${k}];${prev}[c${k}]overlay=eof_action=pass:enable='gte(t,${c.t.toFixed(3)})'[o${k}];`; prev = `[o${k}]`; });
          const outc = path.join(WORK, `cs${nn(s.i)}${tag}.mp4`); ff([...ins, '-filter_complex', fc.slice(0, -1), '-map', prev, ...enc, '-pix_fmt', 'yuv420p', outc]); s.clip = outc; } }
      if (s.media && s.mhave) { // a screenshot floats over a dimmed picture; a video clip plays full frame (letterboxed over a blurred background when its shape does not fit)
        const out2 = path.join(WORK, `m${nn(s.i)}${tag}.mp4`), LL = L.toFixed(3), enc2 = ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', '-pix_fmt', 'yuv420p', '-t', LL, out2];
        if (s.media.kind === 'shot') {
          const bw = Math.round(W * (vert ? 0.9 : 0.78)), bh = Math.round(H * (vert ? 0.55 : 0.7)), dy = vert ? -Math.round(H * 0.06) : -40;
          ff(['-i', s.clip, '-loop', '1', '-framerate', String(FPS), '-t', LL, '-i', s.mpath, '-filter_complex',
            `[0:v]eq=brightness=-0.3:saturation=0.8,boxblur=16:2[bg];[1:v]scale=w=${bw}:h=${bh}:force_original_aspect_ratio=decrease,pad=iw+14:ih+14:7:7:color=0x1b1b22,pad=iw+90:ih+90:45:45:color=black@0,format=rgba,split[c][sh];` +
            `[sh]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.7,boxblur=18:3[shb];[shb][c]overlay=0:6[card];[card]scale=w='trunc(iw*(1+0.04*t/${LL})/2)*2':h=-2:eval=frame,fade=t=in:st=0.12:d=0.4:alpha=1[cz];[bg][cz]overlay=x=(W-w)/2:y=(H-h)/2${dy}:format=auto:shortest=1[v]`, '-map', '[v]', ...enc2]);
        } else {
          const dur = Math.max(0.5, s.media.end - s.media.start), d0 = probe(s.mpath), portrait = d0.h > d0.w * 1.2;
          const fit = vert && portrait ? `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}` : `scale=${W}:${H}:force_original_aspect_ratio=decrease`; // a portrait clip fills a portrait frame
          ff(['-i', s.clip, '-ss', String(s.media.start), '-t', String(dur), '-i', s.mpath, '-filter_complex',
            `[0:v]eq=brightness=-0.35,boxblur=24:3[bg];[1:v]fps=${FPS},${fit},setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=30,fade=t=in:st=0:d=0.25[fg];[bg][fg]overlay=x=(W-w)/2:y=(H-h)/2:format=auto:shortest=1[v]`, '-map', '[v]', ...enc2]);
          if (s.media.sound && !s.mwav) { s.mwav = path.join(WORK, `m${nn(s.i)}.wav`); ff(['-ss', String(s.media.start), '-t', String(dur), '-i', s.mpath, '-vn', '-af', 'aresample=44100,aformat=channel_layouts=stereo', s.mwav]); }
        }
        s.clip = out2;
      }
      if (s.host) { // the animated host (v_me avatar, rendered by essay/host-vme.cjs into projects/<id>/host/): a framed window beside the picture, or large with [host full]. No photo of the host is ever used.
        const n2 = nn(s.i), full = s.host.full, tagV = vert || !full ? 'v' : 'h', hv = path.join(P, 'host', `${n2}-${tagV}.mp4`), out3 = path.join(WORK, `h${n2}${tag}.mp4`), LL = L.toFixed(3);
        if (fs.existsSync(hv)) {
          const hh = Math.round(vert ? (full ? H : H * 0.3) : H * (full ? 1 : 0.62));
          let fc;
          const hostIn = `[1:v]tpad=stop_mode=clone:stop=-1,trim=duration=${LL},setpts=PTS-STARTPTS,fps=${FPS}`;
          if (full) fc = `${hostIn},scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},format=yuv420p,fade=t=in:st=0:d=0.3[v]`;
          else { const x = vert ? `W-w-${Math.round(W * 0.04)}` : `W-w-${Math.round(W * 0.04)}`, y = vert ? `${Math.round(H * 0.06)}` : `(H-h)/2-${Math.round(H * 0.02)}`;
            fc = `[0:v]null[bg];${hostIn},scale=-2:${hh},pad=iw+12:ih+12:6:6:color=0x${(style.hostFrame || 'c9a96e')},pad=iw+80:ih+80:40:40:color=black@0,format=rgba,split[c][sh];[sh]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.65,boxblur=16:3[shb];[shb][c]overlay=0:6[card];[card]fade=t=in:st=0.1:d=0.35:alpha=1[cz];[bg][cz]overlay=x=${x}:y=${y}:format=auto:shortest=1[v]`; }
          ff(['-i', s.clip, '-i', hv, '-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', '-pix_fmt', 'yuv420p', '-t', LL, out3]);
          s.clip = out3;
        } else console.warn(`\nhost clip missing for shot ${n2} (${tagV}): run node essay/host-vme.cjs ${id}; no host shown`);
      }
      process.stdout.write(`\r${tag || 'wide'} shots ${i + 1}/${use.length}`);
    });
    console.log('');
    const vid = path.join(WORK, `video${tag}.mp4`);
    if (use.length === 1) fs.copyFileSync(use[0].clip, vid);
    else {
      const xf = (clips, durs, outFile) => { const a = []; clips.forEach((c) => a.push('-i', c)); let fc = '', prev = '[0:v]', off = 0;
        for (let k = 1; k < clips.length; k++) { off += durs[k - 1]; const o = k === clips.length - 1 ? '[v]' : `[x${k}]`; fc += `${prev}[${k}:v]xfade=transition=${(style.xfade || ['fade'])[(k - 1) % (style.xfade || ['fade']).length]}:duration=${style.xfadeDur ?? XF}:offset=${off.toFixed(3)}${o};`; prev = o; }
        ff([...a, '-filter_complex', fc.slice(0, -1), '-map', '[v]', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', '-pix_fmt', 'yuv420p', outFile]); };
      // groups of 20 shots; each group keeps its tail so the next group can crossfade into it
      const G = 20, parts = [], pdurs = [];
      for (let g = 0; g < use.length; g += G) {
        const grp = use.slice(g, g + G), f = path.join(WORK, `g${g}${tag}.mp4`);
        if (grp.length === 1) fs.copyFileSync(grp[0].clip, f); else xf(grp.map((s) => s.clip), grp.map((s) => s.D), f);
        parts.push(f); pdurs.push(grp.reduce((a, s) => a + s.D, 0));
      }
      if (parts.length === 1) fs.copyFileSync(parts[0], vid); else xf(parts, pdurs, vid);
    }
    return vid;
  };
  const vOnly = !!opt('vertical-only');
  const vid = vOnly ? null : buildVideo(W, H, '');
  const vidV = opt('vertical') || vOnly ? buildVideo(1080, 1920, 'v') : null;
  // 4. sound: narration laid on the timeline, plus the bed
  const voiceTrack = path.join(WORK, 'voice.wav'), ins = [], fl = [];
  use.forEach((s) => {
    if (s.wav) { ins.push('-i', s.wav); fl.push(`[${fl.length + 1}:a]adelay=${Math.round((s.S + s.lead) * 1000)}:all=1[a${fl.length}]`); }
    if (s.mwav) { ins.push('-i', s.mwav); fl.push(`[${fl.length + 1}:a]volume=${spoken(s.text) ? 0.22 : 1},adelay=${Math.round((s.S + s.lead) * 1000)}:all=1[a${fl.length}]`); } });
  ff(['-f', 'lavfi', '-t', total.toFixed(2), '-i', 'anullsrc=r=44100:cl=stereo', ...ins, '-filter_complex', (fl.length ? fl.join(';') + ';' : '') + '[0:a]' + fl.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${fl.length + 1}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[o]`, '-map', '[o]', '-t', total.toFixed(2), voiceTrack]);
  let bed = null;
  const music = meta.music, scored = use.some((s) => s.music || s.sfx) || require('./score.cjs').moods.includes(music);
  if (scored) { // mood music that changes with the story, plus sound effects (essay/score.cjs)
    const { score, moods } = require('./score.cjs'), cuesM = [], sfx = [];
    if (moods.includes(music)) cuesM.push([0, music]);
    use.forEach((s) => { if (s.music) cuesM.push([Math.max(0, s.S - 0.3), s.music]);
      if (style.cutSfx && s.i > 0 && !s.chapter) sfx.push([Math.max(0, s.S - 0.05), style.cutSfx, 0.35]);
      (s.cutAt || []).forEach((tc2) => sfx.push([s.S + tc2, style.cutSfx || 'tick', 0.3]));
      if (style.riser && s.media && s.media.kind === 'clip') sfx.push([Math.max(0, s.S - 1.5), 'riser', 0.5]);
      if (s.card) sfx.push([s.S + s.lead + 0.15, 'pop', 0.5]);
      if (s.tag || s.src) sfx.push([s.S + s.lead + 0.2, 'tick', 0.4]);
      for (const f of s.sfx || []) sfx.push([f.at === 'end' ? s.S + s.lead + s.d : s.S + s.lead + parseFloat(f.at), f.name, f.vol]); });
    if (!cuesM.length) cuesM.push([0, 'calm']);
    const raw = path.join(WORK, 'score.wav'); score(raw, total, cuesM, sfx);
    bed = path.join(WORK, 'bed.wav'); ff(['-i', raw, '-af', `volume=${style.scoreVolume ?? 1.0}`, bed]);
  } else if (music && music !== 'none') {
    bed = path.join(WORK, 'bed.wav');
    const src = music === 'pad' ? null : path.join(P, music);
    if (src && fs.existsSync(src)) ff(['-stream_loop', '-1', '-i', src, '-t', total.toFixed(2), '-af', `volume=${style.musicVolume ?? 0.12},afade=t=in:d=2,afade=t=out:st=${Math.max(0, total - 3).toFixed(2)}:d=3`, '-ar', '44100', '-ac', '2', bed]);
    else { const notes = style.pad || [110, 164.81, 220, 261.63, 329.63];
      const expr = notes.map((f, k) => `${(0.5 / (k + 1)).toFixed(2)}*sin(2*PI*${f}*t)*(0.6+0.4*sin(2*PI*${(0.03 + k * 0.011).toFixed(3)}*t+${k}))`).join('+');
      ff(['-f', 'lavfi', '-i', `aevalsrc='0.05*(${expr})':s=44100:d=${total.toFixed(2)}`, '-af', `lowpass=f=1200,aecho=0.8:0.7:120|240:0.35|0.2,volume=${style.padVolume ?? 0.9},afade=t=in:d=3,afade=t=out:st=${Math.max(0, total - 4).toFixed(2)}:d=4`, '-ac', '2', bed]); }
  }
  const mix = path.join(WORK, 'mix.wav');
  if (bed) ff(['-i', voiceTrack, '-i', bed, '-filter_complex', '[0:a]asplit[v][k];[1:a][k]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=600[d];[v][d]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[o]', '-map', '[o]', mix]); else fs.copyFileSync(voiceTrack, mix);
  // 5. captions
  const cuesFor = (max) => { const cues = [];
  use.forEach((s) => {
    if (s.subs && s.mhave) { const t0 = s.S + s.lead, len = (s.media.end - s.media.start) / s.subs.length; s.subs.forEach((sb, k) => { const ch = chunk(sb.text, max), from = sb.at != null ? sb.at : k * len, next = s.subs[k + 1], to = next && next.at != null ? next.at : sb.at != null ? Math.min(s.media.end - s.media.start, from + len) : (k + 1) * len;
      ch.forEach((c, j) => { cues.push({ a: t0 + from + (j * (to - from)) / ch.length, b: t0 + from + ((j + 1) * (to - from)) / ch.length - 0.05, lines: c }); }); }); }
    if (s.quote) return; // the words are already on screen
    const cards = chunk(s.text, max), chars = cards.map((c) => c.join(' ').length), sum = chars.reduce((a, b) => a + b, 0) || 1; let a = s.S + s.lead;
    cards.forEach((c, k) => { const len = (s.d * chars[k]) / sum; cues.push({ a, b: a + len - 0.04, lines: c }); a += len; }); });
  return cues; };
  const cues = cuesFor(style.captions.chars ?? 40);
  const fontsdir = path.join(__dirname, 'fonts'), sub = (f) => `subtitles=${f}:fontsdir=${fontsdir}`;
  fs.writeFileSync(path.join(WORK, 'cap169.ass'), ass(cues, W, H, style, use, meta.host_name || ''));
  const final = path.join(OUT, `${id}${sfxp}.mp4`);
  if (vid) ff(['-i', vid, '-i', mix, '-vf', sub(path.join(WORK, 'cap169.ass')), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
  if (vid) ff(['-i', final, '-vf', `fps=1/${Math.max(2, Math.round(total / 40))},scale=320:-1,tile=8x5`, '-frames:v', '1', path.join(OUT, `${id}${sfxp}-sheet.jpg`)]);
  if (vidV) {
    fs.writeFileSync(path.join(WORK, 'cap916.ass'), ass(cuesFor(style.captions.charsVertical ?? 24), 1080, 1920, style, use, meta.host_name || ''));
    ff(['-i', vidV, '-i', mix, '-vf', sub(path.join(WORK, 'cap916.ass')), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', path.join(OUT, `${id}${sfxp}-9x16.mp4`)]);
  }
  console.log(`${vid ? final : path.join(OUT, `${id}${sfxp}-9x16.mp4`)} (${total.toFixed(1)} s, ${use.length} shots, ${cues.length} captions)`);
}
function check() {
  const { meta, style, shots: all } = parse(); const noImg = [], noVoice = [];
  const hasM = (f) => fs.existsSync(path.join(P, 'media', f)) && fs.statSync(path.join(P, 'media', f)).size > 0;
  const shots = all.filter((x) => !((x.unless && hasM(x.unless)) || (x.when && !hasM(x.when))));
  shots.forEach((x) => { x.n = x.i; });
  shots.forEach((s) => { const i = s.i; if (!s.same && !['png', 'jpg', 'jpeg', 'webp'].some((e) => fs.existsSync(path.join(P, 'img', `${nn(i)}.${e}`)))) noImg.push(nn(i)); const v = path.join(P, 'voice', nn(i) + '.mp3'); if (spoken(s.text) && (!fs.existsSync(v) || !fs.statSync(v).size)) noVoice.push(nn(i)); });
  // Pacing estimate: voice length if the file exists (minus Edge's padding), otherwise from the text
  let t = 0; const tl = shots.map((s, k) => { const i = s.i; const v = path.join(P, 'voice', nn(i) + '.mp3'); const words = spoken(s.text).split(' ').length;
    const d = s.media && s.media.kind === 'clip' && !spoken(s.text) ? s.media.end - s.media.start : s.quote && !spoken(s.text) ? s.quote.text.split(' ').length * 0.34 + 1.2 : fs.existsSync(v) && fs.statSync(v).size ? Math.max(0.5, dur(v) - 0.7 - 0.45 * (spoken(s.text).match(/[.!?]/g) || []).length) : spoken(s.text).length * 0.066;
    const lead = LEAD + (s.chapter && i > 0 ? (style.chapterHold ?? 1.8) : 0), D = lead + d + (style.gap ?? 0.45) + (s.pause || 0); const r = { i: k, S: t, D, words, s }; t += D; return r; });
  const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const words = tl.reduce((a, r) => a + r.words, 0), warn = [];
  const media = shots.filter((s) => s.media).map((s) => ({ ...s.media, have: fs.existsSync(path.join(P, 'media', s.media.file)) && fs.statSync(path.join(P, 'media', s.media.file)).size > 0 }));
  if (media.length) { const clipSec = media.filter((m) => m.kind === 'clip').reduce((a, m) => a + (m.end - m.start), 0);
    console.log(`media: ${media.filter((m) => m.have).length} of ${media.length} files in (${media.filter((m) => m.kind === 'clip').length} clips, ${clipSec.toFixed(0)} s of footage, ${media.filter((m) => m.kind === 'shot').length} screenshots)\nmedia missing: ${media.filter((m) => !m.have).map((m) => m.file).join(' ') || 'none'}`);
    if (clipSec > 90) warn.push(`${clipSec.toFixed(0)} s of borrowed footage: keep clips short (under ~90 s in total, each under ~25 s) and always credited.`); }
  console.log(`${shots.length} shots, ${words} words, about ${mmss(t)} (${(words / (t / 60)).toFixed(0)} words a minute)`);
  console.log(`images missing: ${noImg.join(' ') || 'none'}\nvoice missing:  ${noVoice.join(' ') || 'none'}\n\nChapters:`);
  const ch = tl.filter((r) => r.s.chapter); ch.forEach((r, k) => console.log(`  ${mmss(r.S).padStart(5)}  ${r.s.chapter}  (${(((ch[k + 1]?.S ?? t) - r.S) / 60).toFixed(1)} min)`));
  if (!ch.length || ch[0].i !== 0) warn.push('Start the script with a "# Chapter" line so YouTube chapters begin at 0:00.');
  { const lim = +(meta.limit || 90), by = {}; tl.forEach((r) => { (by[r.s.part] ||= []).push(r); }); // each part must fit the reel limit (default 90 s)
    Object.keys(by).forEach((pn) => { const sec = by[pn].reduce((a, r) => a + r.D, 0), low = by[pn].filter((r) => r.s.low).reduce((a, r) => a + r.D, 0);
      console.log(`Part ${pn}: ${sec.toFixed(0)} s of ${lim} s${sec > lim ? ` OVER by ${(sec - lim).toFixed(0)} s: ${low >= sec - lim ? 'the [low] shots will be dropped' : 'split with [part N] or mark more shots [low]'}` : ' (ok)'}`); }); }
  const avg = t / shots.length; console.log(`\nAverage shot ${avg.toFixed(1)} s (aim 4 to 8 s).`);
  tl.forEach((r) => { if (r.D > 11) warn.push(`Shot ${nn(r.i)} runs ${r.D.toFixed(1)} s: split it into two pictures.`); });
  // something new should happen at least every minute: a chapter, a card, a question, a pause or a callback
  const beats = tl.filter((r) => r.s.chapter || r.s.card || r.s.quote || r.s.pause || /\?/.test(r.s.text)).map((r) => r.S);
  let prev = 0; for (const b of [...beats, t]) { if (b - prev > 60) warn.push(`Nothing new on screen from ${mmss(prev)} to ${mmss(b)}: add a [card], a question or a [pause].`); prev = b; }
  const hook = tl.filter((r) => r.S < 15); if (!hook.some((r) => /\d|\?/.test(r.s.text) || r.s.card)) warn.push('The first 15 seconds have no number, question or card: sharpen the hook.');
  console.log(warn.length ? '\nTo fix:\n- ' + warn.join('\n- ') : '\nPacing: no problems found.');
}
// ---------- media: what to fetch, and a download block for the phone ----------
function media() {
  const { shots } = parse(), mm = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const list = shots.map((s, i) => ({ s, i })).filter((r) => r.s.media);
  const have = (m) => fs.existsSync(path.join(P, 'media', m.file)) && fs.statSync(path.join(P, 'media', m.file)).size > 0;
  let md = `# Media for ${id}\n\nPut every file in \`projects/${id}/media/\` with exactly these names. Missing files render as labelled placeholders (a typed quote stays in place of a missing post), so you can render before everything is in.\n\n`;
  md += `## Video clips (borrowed footage: keep each under ~25 s, always credited on screen)\n| File | Use | From | Credit | Status |\n|---|---|---|---|---|\n`;
  for (const { s, i } of list.filter((r) => r.s.media.kind === 'clip')) md += `| \`${s.media.file}\` | shot ${nn(i)}, ${mm(s.media.start)}–${mm(s.media.end)} of the clip${s.media.sound ? ', with its sound' : ', muted'} | ${s.media.url || '(find it)'} | ${s.media.credit} | ${have(s.media) ? 'in' : 'MISSING'} |\n`;
  md += `\nThe times are the part of the clip that is used. Watch each clip once and change the times in \`script.md\` if the moment is elsewhere.\n\n## Screenshots\n| File | Use | How | Credit | Status |\n|---|---|---|---|---|\n`;
  const cap = fs.existsSync(path.join(P, 'capture.json')) ? JSON.parse(fs.readFileSync(path.join(P, 'capture.json'), 'utf8')).map((c) => c.file) : [];
  for (const { s, i } of list.filter((r) => r.s.media.kind === 'shot')) md += `| \`${s.media.file}\` | shot ${nn(i)} | ${cap.includes(s.media.file) ? 'captured by `node essay/capture.cjs ' + id + '`' : 'screenshot it on your phone (Instagram, TikTok and X need a login, so I cannot)'} | ${s.media.credit} | ${have(s.media) ? 'in' : 'MISSING'} |\n`;
  fs.writeFileSync(path.join(P, 'media.md'), md);
  const clips = list.filter((r) => r.s.media.kind === 'clip' && r.s.media.url);
  let sh = `# Downloads the clips on your phone, into Downloads/${id}-media. Needs: pip install yt-dlp (Termux). Send back Downloads/${id}-media.zip\n# Check each site's terms and keep to short, credited clips. Re-run is safe: finished files are skipped.\n`;
  sh += `mkdir -p ~/storage/downloads/${id}-media && cd ~/storage/downloads/${id}-media\n`;
  for (const { s } of clips) sh += `[ -s ${s.media.file} ] || yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o ${s.media.file} '${s.media.url}'\n`;
  sh += `cd .. && rm -f ${id}-media.zip && zip -qr ${id}-media.zip ${id}-media && ls -la ${id}-media\n`;
  fs.writeFileSync(path.join(P, 'media-download.sh'), sh);
  console.log(`${list.length} media items (${list.filter((r) => r.s.media.kind === 'clip').length} clips). ${path.join(P, 'media.md')}\n${path.join(P, 'media-download.sh')}`);
}
// ---------- kit: the posting kit for each part (caption variants, pinned comment, hashtags, cover frame) ----------
function kit() {
  const { meta, shots } = parse(), parts = [...new Set(shots.map((x) => x.part))].sort((a, b) => a - b), many = parts.length > 1;
  const tags = (meta.tags || '').split(/[\s,]+/).filter(Boolean).map((t) => '#' + t.replace(/^#/, ''));
  let md = `# ${id}: posting kit (${parts.length} upload${many ? 's' : ''})\n\nReel limit ${meta.limit || 90} s per upload. Turn on Facebook's AI label (the host is AI-generated). Check the first 3 seconds on a phone before posting.\n`;
  for (const pn of parts) {
    const ps = shots.filter((x) => x.part === pn), narr = ps.filter((x) => spoken(x.text)), hook = narr[0] ? spoken(narr[0].text) : meta.title, second = narr[1] ? spoken(narr[1].text) : '', last = narr[narr.length - 1] ? spoken(narr[narr.length - 1].text) : '';
    const sfx = many ? `-part${pn}` : '', vid = path.join(OUT, `${id}${sfx}-9x16.mp4`), cover = path.join(OUT, `${id}${sfx}-cover.png`);
    md += `\n## ${many ? 'Part ' + pn : 'Upload'}\n\n**Caption (pick one, first line is the hook):**\n1. ${hook} ${many && pn < parts.length ? 'Part ' + (pn + 1) + ' is out next.' : ''}\n2. Two sides, one story. ${second || hook}\n3. ${hook.split('.')[0]}. Here is what is on record. 👇\n\n**Pinned comment:** ${last.endsWith('?') || /\?/.test(last) ? last : 'What do you think? Tell me below.'} Sources are in the description.\n\n**Hashtags:** ${tags.join(' ') || '(add tags: in the script front matter)'}\n\n**Cover frame:** ${path.relative(ROOT, cover)} (1.2 s into the video, with the title on it)\n`;
    if (fs.existsSync(vid)) { const title = String(meta.title || id).replace(/:.*/, '').toUpperCase().replace(/['"]/g, '').replace(/[:,]/g, ''); try { ff(['-ss', '1.2', '-i', vid, '-frames:v', '1', '-vf', `drawtext=fontfile=${path.join(__dirname, 'fonts/Anton-Regular.ttf')}:text='${title}${many ? '  PART ' + pn : ''}':fontcolor=white:fontsize=84:borderw=6:bordercolor=black:x=(w-text_w)/2:y=h*0.12`, cover]); } catch (e) { md += '(cover frame failed)\n'; } }
  }
  fs.writeFileSync(path.join(P, 'kit.md'), md); console.log(path.join(P, 'kit.md'));
}
const run = { plan, render, check, media, kit }[cmd];
if (run) run(); else console.log('Commands: plan, render, check, media, kit');
