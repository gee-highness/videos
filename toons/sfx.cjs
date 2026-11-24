/* Sound effects and a quiet music bed, synthesised in code (no downloads, no licences).
   bed(file, dur, sfx, music): sfx = [[time, name, volume?], ...]; music = [[from, to], ...] ranges where the tune plays. */
const fs = require('fs');
const SR = 44100, TAU = Math.PI * 2;
let seed = 1; const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 1073741823.5 - 1; };
const harm = (f, t, n) => { let v = 0; for (let k = 1; k <= n; k++) v += Math.sin(TAU * f * k * t) / k; return v; };
const S = {
  pop: { d: 0.14, f: (t) => Math.sin(TAU * (320 * t + 2600 * t * t)) * Math.exp(-28 * t) },
  tick: { d: 0.06, f: (t) => Math.sin(TAU * 1900 * t) * Math.exp(-80 * t) * 0.7 },
  buzz: { d: 1.0, f: (t) => (t % 0.5 < 0.3 ? 1 : 0) * (Math.sin(TAU * 155 * t) + 0.5 * Math.sin(TAU * 310 * t) + 0.25 * Math.sin(TAU * 465 * t)) * 0.45 },
  ding: { d: 1.1, f: (t) => (Math.sin(TAU * 1568 * t) + 0.5 * Math.sin(TAU * 3136 * t) + 0.2 * Math.sin(TAU * 4704 * t)) * Math.exp(-4.5 * t) * 0.6 },
  chime: { d: 1.2, f: (t) => (Math.sin(TAU * 1047 * t) * Math.exp(-6 * t) + (t > 0.13 ? Math.sin(TAU * 1568 * (t - 0.13)) * Math.exp(-4 * (t - 0.13)) : 0)) * 0.6 },
  whoosh: { d: 0.42, lp: 0.25, f: (t) => noise() * Math.pow(Math.sin(Math.PI * t / 0.42), 2) * 0.9 },
  scribble: { d: 0.7, lp: 0.6, f: (t) => noise() * (0.35 + 0.65 * Math.abs(Math.sin(TAU * 5.5 * t))) * Math.min(1, (0.7 - t) * 8) * 0.5 },
  womp: { d: 0.9, f: (t) => { const f = t < 0.4 ? 233 : 175; const u = t < 0.4 ? t : t - 0.4; return harm(f * (1 + 0.012 * Math.sin(TAU * 6 * t)), t, 5) * Math.min(1, u * 40) * Math.exp(-2.2 * u) * 0.4; } },
  sting: { d: 1.2, f: (t) => { let v = 0; [[0, 523], [0.13, 659], [0.26, 784], [0.39, 1047]].forEach(([a, f], i) => { if (t >= a) { const u = t - a; v += harm(f, u, 5) * Math.exp(-(i === 3 ? 3 : 9) * u) * Math.min(1, u * 200); } }); return v * 0.35; } },
  thud: { d: 0.4, f: (t) => (Math.sin(TAU * (110 * t - 60 * t * t)) * Math.exp(-9 * t) + noise() * Math.exp(-60 * t) * 0.5) * 1.3 },
  munch: { d: 0.5, lp: 0.12, f: (t) => noise() * (t % 0.25 < 0.09 ? 1 : 0) * 0.9 },
};
function bed(file, dur, sfx, music) {
  const n = Math.ceil(dur * SR), buf = new Float32Array(n);
  for (const [at, name, vol = 1] of sfx) {
    const s = S[name]; if (!s) throw new Error('unknown sound ' + name);
    let lp = 0; const i0 = Math.round(at * SR), m = Math.round(s.d * SR);
    for (let i = 0; i < m && i0 + i < n; i++) { let v = s.f(i / SR); if (s.lp) { lp += s.lp * (v - lp); v = lp; } buf[i0 + i] += v * vol * 0.32 * Math.min(1, (m - i) / 300); }
  }
  // music: plucked arpeggio, C Am F G, 104 beats a minute, very quiet under the voice
  const beat = 60 / 104, chords = [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]], pat = [0, 1, 2, 1, 0, 1, 2, 1];
  const pluck = (at, f, vol, dec) => { const i0 = Math.round(at * SR), m = Math.round(0.9 * SR); for (let i = 0; i < m && i0 + i < n; i++) { const t = i / SR; buf[i0 + i] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * Math.exp(-dec * t) * Math.min(1, t * 400) * vol * gain(i0 + i); } };
  const gain = (i) => { const t = i / SR; let g = 0; for (const [a, b] of music) g = Math.max(g, Math.min(1, (t - a) / 0.4, (b - t) / 0.8)); return Math.max(0, g); };
  if (music.length) for (let k = 0; k * beat / 2 < dur; k++) {
    const at = k * beat / 2, ch = chords[Math.floor(k / 8) % 4];
    if (!music.some(([a, b]) => at >= a - 0.1 && at < b)) continue;
    pluck(at, ch[pat[k % 8]] * 2, 0.05, 7);
    if (k % 4 === 0) pluck(at, ch[0] / 2, 0.09, 4);
  }
  const pcm = Buffer.alloc(44 + n * 4);
  pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, buf[i])) * 32767 | 0; pcm.writeInt16LE(v, 44 + i * 4); pcm.writeInt16LE(v, 46 + i * 4); }
  fs.writeFileSync(file, pcm);
}
module.exports = { bed, sounds: Object.keys(S) };
