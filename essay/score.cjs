/* Music and sound effects for essays, all synthesised in code (no downloads, no licences, nothing to clear).
   score(file, dur, cues, sfx): cues = [[from, mood], ...] (each mood plays until the next cue, 1.5 s crossfades),
   sfx = [[time, name, volume?], ...]. Writes a 44.1 kHz stereo WAV. Moods and sounds are listed in MOODS and SOUNDS. */
const fs = require('fs');
const SR = 44100, TAU = Math.PI * 2;
let seed = 7; const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 1073741823.5 - 1; };
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---------- moods: each returns the sample at time t (seconds since the mood started), about -20 dB peak ----------
const env = (u, a, d) => (u < 0 ? 0 : Math.min(1, u / a) * Math.exp(-u / d));
const tone = (f, t, h = [1, 0.3, 0.12]) => h.reduce((v, a, k) => v + a * Math.sin(TAU * f * (k + 1) * t), 0);
function chordAt(t, bpm, prog, beatsPerChord = 4) { const beat = 60 / bpm, len = beat * beatsPerChord, i = Math.floor(t / len) % prog.length; return { ch: prog[i], u: t % len, beat }; }
const MOODS = {
  // slow ambient pad (the original essay bed)
  calm: (t) => { const { ch, u } = chordAt(t, 50, [[57, 64, 69, 72], [53, 60, 65, 69], [55, 62, 67, 71], [52, 59, 64, 67]]);
    return ch.reduce((v, m, k) => v + Math.sin(TAU * midi(m - 12) * t) * (0.6 + 0.4 * Math.sin(TAU * (0.05 + k * 0.013) * t)), 0) * 0.045 * Math.min(1, u / 1.5 + 0.3); },
  // lounge: warm electric-piano chords and soft ticks (glamour, money, Belgravia)
  glam: (t) => { const { ch, u, beat } = chordAt(t, 92, [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 67]]);
    let v = ch.reduce((a, m) => a + tone(midi(m), t, [1, 0.25, 0.08]) * env(u, 0.01, 1.6), 0) * 0.04 * (1 + 0.15 * Math.sin(TAU * 4.5 * t));
    const b = t % (beat / 2); v += noise() * Math.exp(-b * 90) * (Math.floor(t / (beat / 2)) % 2 ? 0.03 : 0.012);
    v += tone(midi(ch[0] - 24), t, [1, 0.4]) * env(u % (beat * 2), 0.01, 0.5) * 0.08; return v; },
  // tip-toe pizzicato (scheming, gossip, someone about to be found out)
  sneaky: (t) => { const beat = 60 / 116, k = Math.floor(t / (beat / 2)), u = t % (beat / 2), line = [45, 0, 48, 0, 52, 0, 51, 0, 50, 0, 48, 0, 47, 0, 44, 0];
    const n = line[k % line.length]; let v = n ? tone(midi(n + 12), u, [1, 0.5, 0.25, 0.1]) * Math.exp(-u * 18) * Math.min(1, u * 300) * 0.11 : 0;
    if (k % 4 === 0) v += Math.sin(TAU * midi(33) * u) * Math.exp(-u * 10) * 0.12; return v; },
  // low drone and a heartbeat (the feud building, the reunion stage)
  tension: (t) => { const beat = 60 / 64, u = t % beat; let v = (Math.sin(TAU * 55 * t) + 0.6 * Math.sin(TAU * 82.41 * t + 0.4 * Math.sin(TAU * 0.2 * t))) * 0.05;
    v += Math.sin(TAU * (58 - 20 * u) * u) * (Math.exp(-u * 14) + (u > 0.22 ? 0.7 * Math.exp(-(u - 0.22) * 14) : 0)) * 0.22;
    v += Math.sin(TAU * 1318.5 * t) * 0.006 * (0.5 + 0.5 * Math.sin(TAU * 0.3 * t)); return v; },
  // cinematic minor swells with a hit on each bar (the big moment)
  drama: (t) => { const { ch, u, beat } = chordAt(t, 68, [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 56]]);
    const bar = beat * 4, sw = Math.min(1, u / (bar * 0.8)); let v = ch.reduce((a, m) => a + tone(midi(m), t, [1, 0.5, 0.25, 0.12]), 0) * 0.03 * (0.3 + 0.7 * sw);
    v += Math.sin(TAU * (50 - 25 * u) * u) * Math.exp(-u * 5) * 0.3; return v; },
  // bright plucks in a major key (the internet loses its mind, the victory lap)
  triumph: (t) => { const { ch, u, beat } = chordAt(t, 112, [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]);
    const s = beat / 2, k = Math.floor(u / s), w = u % s, pat = [0, 2, 1, 3, 2, 1, 3, 2];
    let v = tone(midi(ch[pat[k % 8]] + 12), w, [1, 0.3]) * Math.exp(-w * 9) * Math.min(1, w * 400) * 0.06;
    v += tone(midi(ch[0] - 12), u % (beat * 2), [1, 0.4]) * Math.exp(-(u % (beat * 2)) * 3) * 0.07;
    v += noise() * Math.exp(-(u % beat) * 70) * 0.02; return v * 1.6; },
  // Caribbean-flavoured offbeat skank, gentle (Karen's story: Jamaica to London)
  island: (t) => { const beat = 60 / 84, { ch } = chordAt(t, 84, [[55, 59, 62], [60, 64, 67], [62, 66, 69], [60, 64, 67]]);
    const b = t % beat, off = b > beat / 2 ? b - beat / 2 : -1; let v = off >= 0 ? ch.reduce((a, m) => a + tone(midi(m + 12), off, [1, 0.3]), 0) * Math.exp(-off * 16) * 0.05 : 0;
    v += tone(midi(ch[0] - 12), b, [1, 0.5]) * Math.exp(-b * 4) * 0.09; return v * 1.6; },
  none: () => 0,
};

// ---------- sound effects ----------
const harm = (f, t, n) => { let v = 0; for (let k = 1; k <= n; k++) v += Math.sin(TAU * f * k * t) / k; return v; };
const SOUNDS = {
  pop: { d: 0.14, f: (t) => Math.sin(TAU * (320 * t + 2600 * t * t)) * Math.exp(-28 * t) },
  tick: { d: 0.06, f: (t) => Math.sin(TAU * 1900 * t) * Math.exp(-80 * t) * 0.7 },
  ding: { d: 1.1, f: (t) => (Math.sin(TAU * 1568 * t) + 0.5 * Math.sin(TAU * 3136 * t)) * Math.exp(-4.5 * t) * 0.6 },
  chime: { d: 1.2, f: (t) => (Math.sin(TAU * 1047 * t) * Math.exp(-6 * t) + (t > 0.13 ? Math.sin(TAU * 1568 * (t - 0.13)) * Math.exp(-4 * (t - 0.13)) : 0)) * 0.6 },
  whoosh: { d: 0.5, lp: 0.25, f: (t) => noise() * Math.pow(Math.sin(Math.PI * t / 0.5), 2) * 0.9 },
  womp: { d: 0.9, f: (t) => { const f = t < 0.4 ? 233 : 175, u = t < 0.4 ? t : t - 0.4; return harm(f, t, 5) * Math.min(1, u * 40) * Math.exp(-2.2 * u) * 0.4; } },
  sting: { d: 1.2, f: (t) => { let v = 0; [[0, 523], [0.13, 659], [0.26, 784], [0.39, 1047]].forEach(([a, f], i) => { if (t >= a) { const u = t - a; v += harm(f, u, 5) * Math.exp(-(i === 3 ? 3 : 9) * u) * Math.min(1, u * 200); } }); return v * 0.35; } },
  thud: { d: 0.4, f: (t) => (Math.sin(TAU * (110 * t - 60 * t * t)) * Math.exp(-9 * t) + noise() * Math.exp(-60 * t) * 0.5) * 1.3 },
  munch: { d: 0.6, lp: 0.12, f: (t) => noise() * (t % 0.2 < 0.07 ? 1 : 0) * 0.9 },
  // cinematic hit: a deep drop and a burst of air (a reveal, a title)
  boom: { d: 2.2, lp: 0.3, f: (t) => Math.sin(TAU * (48 * t - 8 * t * t)) * Math.exp(-2.2 * t) * 1.4 + noise() * Math.exp(-12 * t) * 0.6 },
  // rising air into a moment (half a second to two seconds of build)
  riser: { d: 1.8, lp: 0.08, f: (t) => noise() * Math.pow(t / 1.8, 2) * 1.2 + Math.sin(TAU * (200 + 400 * t * t) * t) * Math.pow(t / 1.8, 3) * 0.2 },
  // record scratch (the "wait, what?")
  scratch: { d: 0.45, lp: 0.5, f: (t) => noise() * Math.sin(TAU * (t < 0.2 ? 18 : 30) * t) * Math.exp(-3 * t) * 1.1 },
  // cash register (money, prices, fortunes)
  cash: { d: 1.0, f: (t) => (t < 0.06 ? noise() * 0.8 : 0) + (t > 0.05 ? (Math.sin(TAU * 2093 * (t - 0.05)) + 0.6 * Math.sin(TAU * 2637 * (t - 0.05))) * Math.exp(-5 * (t - 0.05)) * 0.5 : 0) },
  // camera shutter (photos, paparazzi, screenshots)
  shutter: { d: 0.18, lp: 0.6, f: (t) => noise() * (Math.exp(-90 * t) + (t > 0.08 ? Math.exp(-90 * (t - 0.08)) : 0)) },
  // phone notification (posts, reactions, going viral)
  notify: { d: 0.5, f: (t) => (t < 0.12 ? Math.sin(TAU * 1318.5 * t) : Math.sin(TAU * 1760 * (t - 0.12))) * Math.exp(-8 * (t < 0.12 ? t : t - 0.12)) * 0.6 },
  // a gentle gasp of air on the lows (the room goes quiet)
  hush: { d: 1.4, lp: 0.04, f: (t) => noise() * Math.sin(Math.PI * t / 1.4) * 0.8 },
};

function synth(file, dur, cues, sfx) {
  const n = Math.ceil(dur * SR), buf = new Float32Array(n), X = 1.5;
  const list = [...cues].sort((a, b) => a[0] - b[0]);
  for (let c = 0; c < list.length; c++) {
    const [a, mood] = list[c], b = c + 1 < list.length ? list[c + 1][0] : dur, g = MOODS[mood];
    if (!g) throw new Error(`unknown music mood "${mood}" (moods: ${Object.keys(MOODS).join(', ')})`);
    if (mood === 'none') continue;
    const i0 = Math.max(0, Math.round((a - X / 2) * SR)), i1 = Math.min(n, Math.round((b + X / 2) * SR));
    for (let i = i0; i < i1; i++) { const t = i / SR, fade = Math.max(0, Math.min(1, (t - (a - X / 2)) / X, (b + X / 2 - t) / X, dur - t > 3 ? 1 : (dur - t) / 3)); if (fade > 0) buf[i] += g(Math.max(0, t - a)) * fade; }
  }
  for (const [at, name, vol = 1] of sfx) {
    const s = SOUNDS[name]; if (!s) throw new Error(`unknown sound "${name}" (sounds: ${Object.keys(SOUNDS).join(', ')})`);
    let lp = 0; const i0 = Math.round(Math.max(0, at) * SR), m = Math.round(s.d * SR);
    for (let i = 0; i < m && i0 + i < n; i++) { let v = s.f(i / SR); if (s.lp) { lp += s.lp * (v - lp); v = lp; } buf[i0 + i] += v * vol * 0.3 * Math.min(1, (m - i) / 300); }
  }
  const pcm = Buffer.alloc(44 + n * 4);
  pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, buf[i])) * 32767 | 0; pcm.writeInt16LE(v, 44 + i * 4); pcm.writeInt16LE(v, 46 + i * 4); }
  fs.writeFileSync(file, pcm);
}
// The orchestra (orchestra/orchestra.cjs, real recorded sections) scores every video; the synth above is only the fallback
// when the samples cannot be fetched, and still makes the non-orchestral effects (pop, shutter, notify ...).
const orch = require('../orchestra/orchestra.cjs'), { execFileSync } = require('child_process'), path = require('path');
function score(file, dur, cues, sfx) {
  if (!orch.available()) { try { execFileSync('bash', [path.join(__dirname, '..', 'orchestra', 'fetch.sh')], { stdio: 'inherit' }); } catch (e) { console.warn('orchestra: samples unavailable, using the synth'); } }
  if (!orch.available()) return synth(file, dur, cues.map(([t, m]) => [t, MOODS[m] ? m : 'calm']), sfx);
  const hit = (s) => orch.hits.includes(s[1]);
  orch.score(file + '.orch.wav', dur, cues, sfx.filter(hit));
  const rest = sfx.filter((s) => !hit(s));
  if (!rest.length) { fs.renameSync(file + '.orch.wav', file); return; }
  synth(file + '.fx.wav', dur, [[0, 'none']], rest);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file + '.orch.wav', '-i', file + '.fx.wav', '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.95[o]', '-map', '[o]', file]);
  fs.rmSync(file + '.orch.wav'); fs.rmSync(file + '.fx.wav');
}
module.exports = { score, synth, moods: [...new Set([...orch.moods, ...Object.keys(MOODS)])], sounds: [...new Set([...Object.keys(SOUNDS), ...orch.hits])] };
