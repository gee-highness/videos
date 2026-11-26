#!/usr/bin/env node
/* The animated host: renders every [host] moment of an essay with the v_me avatar (the `kuina` look) in the default house.
   node essay/host-vme.cjs <id> [--scale 0.5] [--only 1,4] [--fps 24] [--v-only]     -> projects/<id>/host/NN-v.mp4 (9:16) and NN-h.mp4 (16:9, full-screen shots only)
   The essay engine (essay/essay.cjs) plays these clips in the framed window and the full-screen host shots. No photo of the host is ever used.
   Needs: the v_me repo (env VME_DIR, default /home/user/v_me) with npm install done, and the look file hosts/kuina/v_me-look.json
   (private; kept in the v_me repo under hosts/kuina/). The line she says is the shot's narration: projects/<id>/voice/NN.mp3 if it exists
   (her real voice), otherwise silent with a synthetic mouth timed from the text. */
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), id = process.argv[2], args = process.argv.slice(3);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
if (!id) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(1); }
const VME = process.env.VME_DIR || '/home/user/v_me', P = path.join(ROOT, 'projects', id), OUT = path.join(P, 'host'), WORK = path.join(OUT, '.work');
const lookFile = [path.join(ROOT, 'hosts/kuina/v_me-look.json'), path.join(VME, 'hosts/kuina/v_me-look.json'), path.join(VME, 'public/avatars/looks/kuina.json')].find((f) => fs.existsSync(f));
if (!lookFile) throw new Error('host look not found (hosts/kuina/v_me-look.json, private)');
const look = JSON.parse(fs.readFileSync(lookFile, 'utf8'));
// the shots with a [host ...] line: same parsing as essay.cjs (shot numbers = voice file numbers)
const src = fs.readFileSync(path.join(P, 'script.md'), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<!--[\s\S]*?-->/g, '');
const hostTv = (/^host_tv:\s*(\S+)/m.exec((fs.readFileSync(path.join(P, 'script.md'), 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1] || '') || [])[1] || null; // front matter host_tv: <name in projects/<id>/tv/> = she stands in front of her TV
// a spot in the v_me apartment: the host in front of the TV, the camera 2 m away, the TV centred behind her (9:16 and 16:9)
const TV_SPOT = { id: 'tv-host', label: 'In front of the TV', x: 1.25, z: 2.8, facing: Math.PI / 2, cam: { azimuth: 0, distance: 2.2, height: 1.38, lookY: 1.2, fov: 46, pos: { x: 3.4, y: 1.9, z: 2.8 }, look: { x: 0.3, y: 1.2, z: 2.8 } } };
const shots = []; for (const raw of src.split('\n')) { const l = raw.trim(); if (!l || /^#\s/.test(l) || l.startsWith('#')) continue;
  const m = /^\[img(?:\s+same)?\]/.exec(l); if (m) { shots.push({ text: '', host: null, when: false }); continue; }
  if (!shots.length) continue; const sh = shots[shots.length - 1];
  const tvm = /^\[tv\s+(\S+)\]$/.exec(l); if (tvm) { sh.tv = tvm[1]; continue; }
  const h = /^\[host(?:\s+([\w-]+))?(?:\s+([\w-]+))?(?:\s+([\w-]+))?\]$/.exec(l); if (h) { const w = [h[1], h[2], h[3]].filter(Boolean); sh.host = { full: w.includes('full'), pose: w.find((x) => x !== 'full' && x !== 'name') || null }; continue; }
  if (/^\[(when|unless)\s/.test(l)) { if (/^\[when/.test(l)) sh.when = true; continue; }
  if (/^\[(card|pause|quote|music|sfx|shot|clip|subs|sticker)/.test(l)) continue;
  sh.text += (sh.text ? ' ' : '') + l; }
shots.forEach((x) => { if (x.tv === undefined) x.tv = null; });
let counter = 0; shots.forEach((s) => { if (s.when) s.i = Math.max(0, counter - 1); else s.i = counter++; });
const only = opt('only') ? opt('only').split(',').map(Number) : null, scale = opt('scale', '0.5'), fps = opt('fps', '24');
const TV_CLOSE = { id: 'tv-close', label: 'Close-up, TV behind', x: 1.25, z: 2.8, facing: Math.PI / 2, cam: { azimuth: 0, distance: 1.6, height: 1.5, lookY: 1.3, fov: 36, pos: { x: 2.85, y: 1.62, z: 2.8 }, look: { x: 0.3, y: 1.42, z: 2.8 } } }; // tight framing: face and shoulders, the TV glowing behind
const POSES = { tight: { spot: 'close' }, present: { gesture: 'present' }, nod: { gesture: 'nod' }, solemn: { expression: { name: 'sad', weight: 0.3 } }, eyebrow: { gesture: 'shrug', expression: { name: 'surprised', weight: 0.25 } }, laugh: { expression: { name: 'happy', weight: 0.9 } }, point: { gesture: 'point' }, phone: {}, arms: { gesture: 'nod' }, desk: {} };
fs.mkdirSync(WORK, { recursive: true });
const jobs = [];
for (const s of shots) { if (!s.host || !s.text) continue; if (only && !only.includes(s.i + 1)) continue;
  const n = String(s.i + 1).padStart(2, '0'), vsrc = ['mp3', 'wav'].map((e) => path.join(P, 'voice', `${n}.${e}`)).find((f) => fs.existsSync(f));
  let voice = null; if (vsrc) { voice = path.join(WORK, `${n}.wav`); spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', vsrc, '-ar', '24000', '-ac', '1', '-c:a', 'pcm_s16le', voice]); } // v_me's file engine reads WAV
  for (const [tag, aspect, w, h] of [['v', '9:16', 1080, 1920], ['h', '16:9', 1920, 1080]]) { if (tag === 'h' && (!s.host.full || args.includes('--v-only'))) continue;
    const pose = POSES[s.host.pose] || {}, cues = [{ do: 'camera', at: 0, preset: 'closeup', move: 'cut' }];
    if (pose.expression) cues.push({ do: 'expression', at: 0.2, ...pose.expression, duration: 3 }); if (pose.gesture) cues.push({ do: 'gesture', at: 0.6, name: pose.gesture });
    cues.push({ do: 'say', text: s.text, ...(voice ? { audio: voice } : {}), caption: false }, { do: 'wait', seconds: 0.4 });
    const script = { version: 1, meta: { title: `${id} host ${n}${tag}`, format: { aspect, width: w, height: h, fps: +fps } },
      setup: { avatarLook: look, scene: 'apartment-default', background: 'living-room', lighting: 'studioSoft', camera: 'halfbody', voice: { engine: voice ? 'file' : 'none' }, animation: { personality: 'calm', energy: 0.5, handsRest: 'front', eyeContact: 0.9 } }, cues };
    if (hostTv) { const nm = s.tv || hostTv; const SP = pose.spot === 'close' ? TV_CLOSE : TV_SPOT; script.setup.background = SP.id; script.setup.spots = [SP]; script.cues = script.cues.filter((c) => c.do !== 'camera');
      if (nm !== 'none') { const img = path.join(P, 'tv', nm + '.png'); if (!fs.existsSync(img)) throw new Error('TV picture not found: ' + img); fs.copyFileSync(img, path.join(WORK, `tv-${nm}.png`)); script.cues.unshift({ do: 'media', at: 0, src: `tv-${nm}.png`, layout: 'tv', duration: 120 }); } }
    const f = path.join(WORK, `${n}-${tag}.vme.json`); fs.writeFileSync(f, JSON.stringify(script)); jobs.push({ n, tag, f, voice }); } }
console.log(`${jobs.length} host clips to render (scale ${scale}, ${fps} fps)`);
if (args.includes('--still')) { // a quick look (one JPEG per clip, about a minute) instead of the whole clip
  for (const j of jobs) { const r = spawnSync('npm', ['run', 'performer:render', '--', j.f, '--engine', 'none', '--scale', scale, '--stills', '1.2', '--out', path.join(WORK, `${j.n}-${j.tag}-still.mp4`)], { cwd: VME, stdio: 'inherit' }); if (r.status !== 0) process.exit(1); }
  console.log('stills in ' + path.join(WORK, 'stills')); process.exit(0); }
for (const j of jobs) { const out = path.join(OUT, `${j.n}-${j.tag}.mp4`); if (fs.existsSync(out) && !args.includes('--force')) { console.log('have', out); continue; }
  console.log(`rendering ${j.n}-${j.tag} (${j.voice ? 'voice file' : 'silent, synthetic mouth'})`);
  const r = spawnSync('npm', ['run', 'performer:render', '--', j.f, '--engine', j.voice ? 'file' : 'none', '--scale', scale, '--out', out], { cwd: VME, stdio: 'inherit' });
  if (r.status !== 0) { console.error('render failed for ' + j.n + j.tag); process.exit(1); } }
console.log('done: ' + OUT);
