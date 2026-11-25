#!/usr/bin/env node
/* Documentary "video essay" maker: one narrator, AI-generated stills with a slow push or pan, crossfades,
   monospace captions in black boxes, a quiet ambient bed. Everything is driven by projects/<id>/script.md.

   node essay/essay.cjs plan <id>              -> projects/<id>/prompts.md (one image prompt per shot, style added)
                                                  and projects/<id>/termux.sh (paste into Termux to make the voices)
   node essay/essay.cjs render <id>            -> projects/<id>/out/<id>.mp4 (1920x1080) and <id>-sheet.jpg
   node essay/essay.cjs render <id> --vertical -> also <id>-9x16.mp4 (1080x1920, for Shorts/Reels/Status)
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
  const shots = []; let section = '', pendingChapter = null;
  for (const raw of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('<!--')) continue;
    // "# Title" starts a chapter: a title card on screen and a YouTube chapter. "## note" is only for you.
    if (/^#\s/.test(l)) { section = l.replace(/^#\s*/, ''); pendingChapter = section; continue; }
    if (l.startsWith('#')) continue;
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
    if (m) { shots.push({ section, chapter: pendingChapter, prompt: m[2], same: !!m[1], text: '', move: (/\{move:(\w+)\}/.exec(m[2]) || [])[1] }); pendingChapter = null; shots[shots.length - 1].prompt = m[2].replace(/\{move:\w+\}/, '').trim(); continue; }
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
  let md = `# ${meta.title || id}: image prompts\n\nMake each image ${style.aspect || '16:9'} and save it as \`projects/${id}/img/NN.png\` (or .jpg/.webp). Shots marked "same image" reuse the one before.\n\nStyle added to every prompt:\n> ${style.prompt}\n\n`;
  shots.forEach((s) => { const i = s.i; if (s.when && s.same) return; md += `## ${nn(i)}${s.section ? ' · ' + s.section : ''}\n` + (s.same ? '_same image as the shot before_\n\n' : '```\n' + s.prompt + '. ' + style.prompt + '\n```\n') + `Narration: ${spoken(s.text)}\n\n`; });
  fs.writeFileSync(path.join(P, 'prompts.md'), md);
  const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
  let sh = `# ${meta.title || id}: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).\n# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/${id}-voice.zip\n`;
  sh += `say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=${meta.rate} --voice ${meta.voice} --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }\n`;
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
function ass(cues, w, h, style, shots = []) {
  const c = style.captions, v = w < h, fs2 = Math.round(h * (v ? c.sizeVertical : c.size)), mv = Math.round(h * (v ? c.marginVVertical : c.marginV));
  const big = Math.round(Math.min(w * 0.16, h * 0.2)), small = Math.round(fs2 * 0.95), accent = style.accentAss || '&H0092A29E';
  const dim = (a) => `{\\an7\\pos(0,0)\\bord0\\shad0\\1c&H000000&\\1a&H${a}&\\p1}m 0 0 l ${w} 0 ${w} ${h} 0 ${h}{\\p0}`;
  const ev = [];
  shots.forEach((s) => {
    const cx = Math.round(w / 2), cy = Math.round(h * (v ? 0.4 : 0.42));
    if (s.chapter && s.chapterNo > 1) { // a chapter card while the narrator waits: dim the picture, show the number and the title
      const a = s.S + 0.15, b = s.S + s.lead - 0.05;
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(250,250)}${dim('40')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Title,,0,0,0,,{\\fad(300,250)\\an5\\pos(${cx},${cy})}{\\fs${small}\\1c${accent}}PART ${s.chapterNo}\\N{\\fs${Math.round(big * 0.55)}\\1c&HFFFFFF&}${s.chapter.replace(/[{}]/g, '')}`);
    }
    if (s.media && s.mhave && s.media.credit) { const a = s.S + s.lead + 0.3, b = s.S + s.D - 0.2; ev.push(`Dialogue: 4,${assTime(a)},${assTime(b)},Credit,,0,0,0,,{\\fad(200,200)}${(s.media.kind === 'clip' ? 'Clip: ' : 'Source: ') + s.media.credit.replace(/[{}]/g, '')}`); }
    if (s.quote) { // someone's words on screen (a quote from the show or a post): the speaker's name, then the words
      const a = s.S + s.lead + 0.1, b = s.S + s.D - 0.2, q = s.quote, qs = Math.round(fs2 * (v ? 1.3 : 1.7));
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(250,250)}${dim('70')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Quote,,0,0,0,,{\\fad(250,250)\\an5\\pos(${cx},${cy})\\q0}${q.who ? `{\\fs${small}\\1c${accent}}${q.who.replace(/[{}]/g, '').toUpperCase()}\\N{\\fs${qs}\\1c&HFFFFFF&}` : ''}${q.text.replace(/[{}]/g, '')}`);
    }
    if (s.card) { // a statistic or key phrase on screen while it is said
      const a = s.S + s.lead + 0.15, b = s.S + s.D - 0.25;
      ev.push(`Dialogue: 1,${assTime(a)},${assTime(b)},Fx,,0,0,0,,{\\fad(300,300)}${dim('80')}`);
      ev.push(`Dialogue: 2,${assTime(a)},${assTime(b)},Title,,0,0,0,,{\\fad(300,300)\\an5\\pos(${cx},${cy})\\t(0,600,\\fscx100\\fscy100)\\fscx92\\fscy92}{\\fs${big}}${s.card.big.replace(/[{}]/g, '')}${s.card.small ? `\\N{\\fs${small}\\1c${accent}}${s.card.small.replace(/[{}]/g, '')}` : ''}`);
    }
  });
  return `[Script Info]\nScriptType: v4.00+\nPlayResX: ${w}\nPlayResY: ${h}\nWrapStyle: 2\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n` +
    `Style: Cap,${c.font},${fs2},&H00FFFFFF,&H00FFFFFF,${c.box},${c.box},0,0,0,0,100,100,0,0,3,${Math.round(fs2 * 0.18)},0,2,60,60,${mv},1\n` +
    `Style: Title,${c.font},${big},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,0,2,5,60,60,0,1\n` +
    `Style: Quote,${c.font},${Math.round(fs2 * 1.35)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,1,0,0,100,100,0,0,1,0,2,5,${Math.round(w * (v ? 0.08 : 0.16))},${Math.round(w * (v ? 0.08 : 0.16))},0,1\n` +
    `Style: Credit,${c.font},${Math.round(fs2 * 0.62)},&H00DDDDDD,&H00DDDDDD,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,${Math.round(fs2 * 0.06)},1,1,${Math.round(w * 0.025)},60,${Math.round(h * 0.03)},1\n` +
    `Style: Fx,${c.font},10,&H00000000,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n` +
    [...ev, ...cues.map((q) => `Dialogue: 3,${assTime(q.a)},${assTime(q.b)},Cap,,0,0,0,,${q.lines.map((l) => l.replace(/[{}]/g, '')).join('\\N')}`)].join('\n') + '\n';
}

// ---------- render ----------
function placeholder(file, i, prompt, style) {
  const tf = path.join(WORK, `ph${nn(i)}.txt`), wrap = (prompt || 'image').replace(/(.{1,58})(\s|$)/g, '$1\n').slice(0, 520);
  fs.writeFileSync(tf, `SHOT ${nn(i)}  (placeholder: add projects/${id}/img/${nn(i)}.png)\n\n${wrap}`);
  ff(['-f', 'lavfi', '-i', `color=c=${style.placeholder || '0x1c2523'}:s=${W}x${H}`, '-vf', `drawtext=fontfile=${path.join(__dirname, 'fonts/NotoSansMono.ttf')}:textfile=${tf}:fontcolor=0x9ea292:fontsize=34:x=120:y=200:line_spacing=10`, '-frames:v', '1', file]);
}
function render() {
  const { meta, style, shots } = parse(), to = opt('to') ? +opt('to') : shots.length, has = (f) => fs.existsSync(path.join(P, 'media', f)) && fs.statSync(path.join(P, 'media', f)).size > 0, dropped = (x) => (x.unless && has(x.unless)) || (x.when && !has(x.when)), use = shots.slice(0, to).filter((x) => !dropped(x));
  fs.mkdirSync(WORK, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
  const pause = style.pause ?? 0.45, gap = style.gap ?? 0.45;
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
  let t = 0, chNo = 0; use.forEach((s) => { s.S = t; t += s.D; if (s.chapter) s.chapterNo = ++chNo; }); const total = t;
  // YouTube chapters for the description (the first must start at 0:00)
  const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const chs = use.filter((s) => s.chapter).map((s, k) => `${mmss(k === 0 ? 0 : s.S)} ${s.chapter}`);
  fs.mkdirSync(OUT, { recursive: true }); if (chs.length) fs.writeFileSync(path.join(OUT, `${id}-chapters.txt`), chs.join('\n') + '\n');
  // 2. pictures: one clip per shot with a slow push or pan, a little longer than the shot so the crossfade has room
  const moves = style.moves || ['in', 'panR', 'out', 'panL'];
  let lastImg = null;
  use.forEach((s, i) => {
    let img = ['png', 'jpg', 'jpeg', 'webp'].map((e) => path.join(P, 'img', `${nn(s.i)}.${e}`)).find((f) => fs.existsSync(f));
    if (!img && s.same && lastImg && !(s.media && !s.mhave)) img = lastImg;
    if (!img) { img = path.join(WORK, `ph${nn(s.i)}.png`); placeholder(img, s.i, (s.media && !s.mhave ? `[${s.media.kind.toUpperCase()} MISSING: media/${s.media.file}${s.media.kind === 'clip' ? ` ${s.media.start}-${s.media.end}s` : ''}] ` : '') + s.prompt, style); }
    lastImg = img;
    const L = s.D + (i < use.length - 1 ? XF : 0), N = Math.round(L * FPS), z = style.zoom ?? 0.07, mv = s.move || moves[i % moves.length];
    const Z = { in: `1+${z}*on/${N}`, out: `${1 + z}-${z}*on/${N}`, panR: `${1 + z}`, panL: `${1 + z}`, up: `${1 + z}`, down: `${1 + z}`, hold: '1' }[mv] || `1+${z}*on/${N}`;
    const X = { panR: `(iw-iw/zoom)*on/${N}`, panL: `(iw-iw/zoom)*(1-on/${N})` }[mv] || 'iw/2-(iw/zoom/2)';
    const Y = { up: `(ih-ih/zoom)*(1-on/${N})`, down: `(ih-ih/zoom)*on/${N}` }[mv] || 'ih/2-(ih/zoom/2)';
    s.clip = path.join(WORK, `c${nn(s.i)}.mp4`);
    ff(['-i', img, '-vf', `scale=${W * 1.5}:${H * 1.5}:force_original_aspect_ratio=increase,crop=${W * 1.5}:${H * 1.5},zoompan=z='${Z}':x='${X}':y='${Y}':d=${N}:s=${W}x${H}:fps=${FPS},${style.grade || 'null'},format=yuv420p`, '-frames:v', String(N), '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', s.clip]);
    if (s.media && s.mhave) { // a screenshot floats over a dimmed picture; a video clip plays full frame (letterboxed over a blurred background if it is vertical)
      const out2 = path.join(WORK, `m${nn(s.i)}.mp4`), LL = L.toFixed(3), enc = ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', '-pix_fmt', 'yuv420p', '-t', LL, out2];
      if (s.media.kind === 'shot') {
        ff(['-i', s.clip, '-loop', '1', '-framerate', String(FPS), '-t', LL, '-i', s.mpath, '-filter_complex',
          `[0:v]eq=brightness=-0.3:saturation=0.8,boxblur=16:2[bg];[1:v]scale=w=${Math.round(W * 0.78)}:h=${Math.round(H * 0.7)}:force_original_aspect_ratio=decrease,pad=iw+14:ih+14:7:7:color=0x1b1b22,pad=iw+90:ih+90:45:45:color=black@0,format=rgba,split[c][sh];` +
          `[sh]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.7,boxblur=18:3[shb];[shb][c]overlay=0:6[card];[card]scale=w='trunc(iw*(1+0.04*t/${LL})/2)*2':h=-2:eval=frame,fade=t=in:st=0.12:d=0.4:alpha=1[cz];[bg][cz]overlay=x=(W-w)/2:y=(H-h)/2-40:format=auto:shortest=1[v]`, '-map', '[v]', ...enc]);
      } else {
        const dur = Math.max(0.5, s.media.end - s.media.start);
        ff(['-i', s.clip, '-ss', String(s.media.start), '-t', String(dur), '-i', s.mpath, '-filter_complex',
          `[0:v]eq=brightness=-0.35,boxblur=24:3[bg];[1:v]fps=${FPS},scale=${W}:${H}:force_original_aspect_ratio=decrease,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=30,fade=t=in:st=0:d=0.25[fg];[bg][fg]overlay=x=(W-w)/2:y=(H-h)/2:format=auto:shortest=1[v]`, '-map', '[v]', ...enc]);
        if (s.media.sound) { s.mwav = path.join(WORK, `m${nn(s.i)}.wav`); ff(['-ss', String(s.media.start), '-t', String(dur), '-i', s.mpath, '-vn', '-af', 'aresample=44100,aformat=channel_layouts=stereo', s.mwav]); }
      }
      s.clip = out2;
    }
    process.stdout.write(`\rshots ${i + 1}/${use.length}`);
  });
  console.log('');
  // 3. join with crossfades (in groups, so a long video never needs one giant filter)
  const vid = path.join(WORK, 'video.mp4');
  if (use.length === 1) fs.copyFileSync(use[0].clip, vid);
  else {
    const xf = (clips, durs, outFile) => { const a = []; clips.forEach((c) => a.push('-i', c)); let fc = '', prev = '[0:v]', off = 0;
      for (let k = 1; k < clips.length; k++) { off += durs[k - 1]; const o = k === clips.length - 1 ? '[v]' : `[x${k}]`; fc += `${prev}[${k}:v]xfade=transition=fade:duration=${XF}:offset=${off.toFixed(3)}${o};`; prev = o; }
      ff([...a, '-filter_complex', fc.slice(0, -1), '-map', '[v]', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '17', '-pix_fmt', 'yuv420p', outFile]); };
    // groups of 20 shots; each group keeps its tail so the next group can crossfade into it
    const G = 20, parts = [], pdurs = [];
    for (let g = 0; g < use.length; g += G) {
      const grp = use.slice(g, g + G), f = path.join(WORK, `g${g}.mp4`), last = g + G >= use.length;
      if (grp.length === 1) fs.copyFileSync(grp[0].clip, f); else xf(grp.map((s) => s.clip), grp.map((s) => s.D), f);
      parts.push(f); pdurs.push(grp.reduce((a, s) => a + s.D, 0) - (last ? 0 : 0));
    }
    if (parts.length === 1) fs.copyFileSync(parts[0], vid); else xf(parts, pdurs, vid);
  }
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
  fs.writeFileSync(path.join(WORK, 'cap169.ass'), ass(cues, W, H, style, use));
  const final = path.join(OUT, `${id}.mp4`);
  ff(['-i', vid, '-i', mix, '-vf', sub(path.join(WORK, 'cap169.ass')), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
  ff(['-i', final, '-vf', `fps=1/${Math.max(2, Math.round(total / 40))},scale=320:-1,tile=8x5`, '-frames:v', '1', path.join(OUT, `${id}-sheet.jpg`)]);
  if (opt('vertical')) {
    fs.writeFileSync(path.join(WORK, 'cap916.ass'), ass(cuesFor(style.captions.charsVertical ?? 24), 1080, 1920, style, use));
    ff(['-i', vid, '-i', mix, '-filter_complex', `[0:v]split[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=24:2,eq=brightness=-0.18[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2,${sub(path.join(WORK, 'cap916.ass'))}[v]`, '-map', '[v]', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', path.join(OUT, `${id}-9x16.mp4`)]);
  }
  console.log(`${final} (${total.toFixed(1)} s, ${use.length} shots, ${cues.length} captions)`);
}
function check() {
  const { style, shots: all } = parse(); const noImg = [], noVoice = [];
  const hasM = (f) => fs.existsSync(path.join(P, 'media', f)) && fs.statSync(path.join(P, 'media', f)).size > 0;
  const shots = all.filter((x) => !((x.unless && hasM(x.unless)) || (x.when && !hasM(x.when))));
  shots.forEach((x) => { x.n = x.i; });
  shots.forEach((s) => { const i = s.i; if (!s.same && !['png', 'jpg', 'jpeg', 'webp'].some((e) => fs.existsSync(path.join(P, 'img', `${nn(i)}.${e}`)))) noImg.push(nn(i)); const v = path.join(P, 'voice', nn(i) + '.mp3'); if (spoken(s.text) && (!fs.existsSync(v) || !fs.statSync(v).size)) noVoice.push(nn(i)); });
  // Pacing estimate: voice length if the file exists (minus Edge's padding), otherwise from the text
  let t = 0; const tl = shots.map((s, k) => { const i = s.i; const v = path.join(P, 'voice', nn(i) + '.mp3'); const words = spoken(s.text).split(' ').length;
    const d = s.quote && !spoken(s.text) ? s.quote.text.split(' ').length * 0.34 + 1.2 : fs.existsSync(v) && fs.statSync(v).size ? Math.max(0.5, dur(v) - 0.7 - 0.45 * (spoken(s.text).match(/[.!?]/g) || []).length) : spoken(s.text).length * 0.066;
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
const run = { plan, render, check, media }[cmd];
if (run) run(); else console.log('Commands: plan, render, check, media');
