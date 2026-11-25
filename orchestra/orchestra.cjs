/* The orchestra: a scored soundtrack played by real recorded sections (VSCO 2 Community Edition, CC0).
   Samples: bash orchestra/fetch.sh (once per machine) -> orchestra/samples/.
   score(file, dur, cues, sfx, opts): cues = [[from, mood], ...] (each mood plays until the next cue),
   sfx = [[time, name, volume?], ...]. Writes a 44.1 kHz stereo WAV, mixed in a hall, about -20 LUFS.
   Every mood is composed, not looped: an intro, a theme, an answer, a fuller second half, a cadence into the next cue.
   Moods: see MOODS. Orchestral hits for sfx: see HITS (anything else falls back to the synth sounds in essay/score.cjs). */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const SR = 44100, DIR = path.join(__dirname, 'samples');
const available = () => fs.existsSync(DIR) && fs.readdirSync(DIR).length > 20;

// ---------------------------------------------------------------- samples
function readWav(f) {
  const b = fs.readFileSync(f); let o = 12, ch = 2, data = null;
  while (o + 8 <= b.length) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') ch = b.readUInt16LE(o + 10); if (id === 'data') { data = b.subarray(o + 8, o + 8 + sz); break; } o += 8 + sz + (sz & 1); }
  const n = Math.floor(data.length / (2 * ch)), L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = data.readInt16LE(i * 2 * ch) / 32768; R[i] = ch > 1 ? data.readInt16LE(i * 2 * ch + 2) / 32768 : L[i]; }
  // start at the attack (recordings carry a little silence first)
  let s = 0; while (s < n - 1 && Math.abs(L[s]) + Math.abs(R[s]) < 0.004) s++; s = Math.max(0, s - 64);
  return { L: L.subarray(s), R: R.subarray(s), n: n - s };
}
const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
// instruments: folder, stage position (pan -1 left .. 1 right), level, envelope; oct = octave fix for the file names
const INST = {
  vln: { dir: 'Strings__Violin_Section__susVib', pan: -0.5, gain: 0.8, sus: 1, att: 0.16, rel: 0.7 },
  vln2: { dir: 'Strings__Violin_Section__susVib', pan: -0.25, gain: 0.65, sus: 1, att: 0.18, rel: 0.7 },
  vlnSpic: { dir: 'Strings__Violin_Section__Spic', pan: -0.45, gain: 0.7 },
  vlnPizz: { dir: 'Strings__Violin_Section__Pizz', pan: -0.45, gain: 0.85 },
  vlnTrem: { dir: 'Strings__Violin_Section__Trem', pan: -0.4, gain: 0.5, sus: 1, att: 0.4, rel: 0.6 },
  vla: { dir: 'Strings__Viola_Section__susvib', pan: 0.15, gain: 0.75, sus: 1, att: 0.18, rel: 0.7 },
  vlaSpic: { dir: 'Strings__Viola_Section__spic', pan: 0.15, gain: 0.65 },
  vlaPizz: { dir: 'Strings__Viola_Section__pizz', pan: 0.15, gain: 0.8 },
  vc: { dir: 'Strings__Cello_Section__susvib', pan: 0.42, gain: 0.85, sus: 1, att: 0.15, rel: 0.8 },
  vcSpic: { dir: 'Strings__Cello_Section__spic', pan: 0.42, gain: 0.75 },
  vcPizz: { dir: 'Strings__Cello_Section__pizzT', pan: 0.42, gain: 0.9 },
  vcTrem: { dir: 'Strings__Cello_Section__trem', pan: 0.42, gain: 0.55, sus: 1, att: 0.3, rel: 0.6 },
  cb: { dir: 'Strings__Solo_Contrabass__SusVib', pan: 0.6, gain: 0.8, sus: 1, att: 0.15, rel: 0.8 },
  cbPizz: { dir: 'Strings__Solo_Contrabass__Pizz', pan: 0.6, gain: 1.0 },
  harp: { dir: 'Strings__Harp', pan: -0.65, gain: 0.75, oct: 0 },
  hn: { dir: 'Brass__F_Horn__sus', pan: -0.2, gain: 0.55, sus: 1, att: 0.14, rel: 0.6, wet: 1.3 },
  hnStac: { dir: 'Brass__F_Horn__stac', pan: -0.2, gain: 0.55, wet: 1.3 },
  tpt: { dir: 'Brass__Trumpet__sus', pan: 0.22, gain: 0.5, sus: 1, att: 0.06, rel: 0.45, wet: 1.2 },
  tptStac: { dir: 'Brass__Trumpet__stac', pan: 0.22, gain: 0.5, wet: 1.2 },
  tbn: { dir: 'Brass__Tenor_Trombone__sus', pan: 0.35, gain: 0.5, sus: 1, att: 0.08, rel: 0.5, wet: 1.2 },
  tuba: { dir: 'Brass__Tuba__sus', pan: 0.5, gain: 0.6, sus: 1, att: 0.1, rel: 0.6, wet: 1.2 },
  fl: { dir: 'Woodwinds__Flute__susvib', pan: -0.08, gain: 0.6, sus: 1, att: 0.08, rel: 0.45 },
  flStac: { dir: 'Woodwinds__Flute__stac', pan: -0.08, gain: 0.55 },
  ob: { dir: 'Woodwinds__Oboe__Vib', pan: 0.05, gain: 0.55, sus: 1, att: 0.06, rel: 0.4 },
  cl: { dir: 'Woodwinds__Clarinet__susLong', pan: -0.15, gain: 0.6, sus: 1, att: 0.07, rel: 0.4 },
  clStac: { dir: 'Woodwinds__Clarinet__stac', pan: -0.15, gain: 0.55 },
  bsn: { dir: 'Woodwinds__Bassoon__sus', pan: 0.18, gain: 0.6, sus: 1, att: 0.06, rel: 0.4 },
  bsnStac: { dir: 'Woodwinds__Bassoon__stac', pan: 0.18, gain: 0.6 },
  glock: { dir: 'Percussion__Glock', pan: 0.1, gain: 0.35, oct: 0 },
  timp: { dir: 'Percussion__Timpani', pan: 0, gain: 0.9, perc: /Hit/, wet: 1.2 },
  bd: { dir: 'Perc__drums__bass', pan: 0, gain: 0.8, perc: /./, wet: 1.3 },
  crash: { dir: 'Perc__varMetal__Cymbals__clash', pan: 0.1, gain: 0.35, perc: /crash_hit/, wet: 1.3 },
  swell: { dir: 'Perc__varMetal__Cymbals__susp', pan: 0.1, gain: 0.4, perc: /roll2_cresc|roll1/, wet: 1.3 },
  tri: { dir: 'Percussion__temp', pan: 0.3, gain: 0.25, perc: /Triangle/ },
  gong: { dir: 'Perc__varMetal__Gong', pan: 0, gain: 0.5, perc: /gong_hit/, wet: 1.4 },
};
const lib = {};
function load(name) {
  if (lib[name]) return lib[name];
  const I = INST[name], dir = path.join(DIR, I.dir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.wav') && (!I.perc || I.perc.test(f))) : [];
  if (!files.length) throw new Error(`orchestra: no samples for ${name} (${I.dir}); run bash orchestra/fetch.sh`);
  const list = files.map((f) => {
    const m = /_([A-G]#?)(-?\d)(?=[_.])/.exec(f), v = /_v(\d)/.exec(f) || /_(ppp|pp|p|mp|mf|f|ff|fff)[_.]/.exec(f);
    const dyn = v ? (/\d/.test(v[1]) ? +v[1] : ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'].indexOf(v[1]) + 1) : 3;
    return { f: path.join(dir, f), midi: m ? NOTE[m[1]] + 12 * (+m[2] + 1) + (I.oct ?? 12) : null, dyn };
  });
  const dyns = [...new Set(list.map((s) => s.dyn))].sort((a, b) => a - b);
  for (const s of list) s.layer = dyns.length > 1 ? dyns.indexOf(s.dyn) / (dyns.length - 1) : 0.5;
  if (name === 'timp') for (const s of list) s.midi = timpPitch(s);
  return (lib[name] = { list, rr: 0 });
}
const audio = new Map();
function wav(s) { if (!audio.has(s.f)) audio.set(s.f, readWav(s.f)); return audio.get(s.f); }
// the pitch of a timpani hit, from its period (autocorrelation, 45 to 200 Hz)
function timpPitch(s) {
  const a = wav(s).L, w0 = Math.round(0.06 * SR), N = Math.min(a.length - w0 - 1000, Math.round(0.25 * SR)); let best = 0, lag = 300;
  for (let l = 220; l < 980; l++) { let c = 0; for (let i = 0; i < N; i += 2) c += a[w0 + i] * a[w0 + i + l]; if (c > best) { best = c; lag = l; } }
  return Math.round(69 + 12 * Math.log2(SR / lag / 440));
}
// pick the closest sample (pitch first, then dynamic layer), alternating round robins
function pick(name, midi, vel) {
  const L = load(name), list = L.list;
  let cand = list;
  if (midi != null && list[0].midi != null) { const d = Math.min(...list.map((s) => Math.abs(s.midi - midi))); cand = list.filter((s) => Math.abs(s.midi - midi) === d); }
  const dl = Math.min(...cand.map((s) => Math.abs(s.layer - vel))); cand = cand.filter((s) => Math.abs(s.layer - vel) - dl < 1e-6);
  return cand[L.rr++ % cand.length];
}
// sustains longer than the recording: the middle of the note is looped with long equal-power crossfades
const longCache = new Map();
function extended(s, need) {
  const w = wav(s); if (need <= w.n * 0.9) return w;
  const k = s.f + ':' + Math.ceil(need / SR / 4); if (longCache.has(k)) return longCache.get(k);
  const a = Math.round(w.n * 0.3), b = Math.round(w.n * 0.82), X = Math.min(Math.round(0.35 * SR), Math.floor((b - a) / 3)), seg = b - a - X;
  const n = need + SR, L = new Float32Array(n), R = new Float32Array(n);
  L.set(w.L.subarray(0, Math.min(b, n))); R.set(w.R.subarray(0, Math.min(b, n)));
  for (let pos = b - X; pos < n; pos += seg) for (let i = 0; i < seg + X && pos + i < n; i++) {
    const src = a + i, fin = i < X ? Math.sin((i / X) * Math.PI / 2) : 1, fout = i < X ? Math.cos((i / X) * Math.PI / 2) : 0;
    L[pos + i] = L[pos + i] * fout + w.L[src] * fin; R[pos + i] = R[pos + i] * fout + w.R[src] * fin;
  }
  const r = { L, R, n }; longCache.set(k, r); return r;
}

// ---------------------------------------------------------------- the stage
class Stage {
  constructor(dur) { this.n = Math.ceil((dur + 6) * SR); this.dry = [new Float32Array(this.n), new Float32Array(this.n)]; this.send = [new Float32Array(this.n), new Float32Array(this.n)]; }
  // one note: instrument, MIDI pitch, start (s), length (s), velocity 0..1
  note(name, midi, t, dur, vel = 0.6) {
    if (t < 0 || !isFinite(t)) return; const I = INST[name], s = pick(name, midi, vel);
    const rate = midi != null && s.midi != null ? Math.pow(2, (midi - s.midi) / 12) : 1;
    const rel = I.sus ? I.rel : 0.25, len = I.sus ? dur + rel : Math.min(wav(s).n / SR / rate, (dur || 9) + 1.5);
    const need = Math.ceil(len * SR * rate) + 8, w = I.sus ? extended(s, need) : wav(s);
    const i0 = Math.round(t * SR), m = Math.min(Math.round(len * SR), this.n - i0, Math.floor((w.n - 2) / rate));
    const att = I.sus ? I.att * (1.4 - 0.8 * vel) : 0.002, rs = I.sus ? Math.round(dur * SR) : Math.round((len - 0.25) * SR);
    const amp = I.gain * (0.3 + 0.7 * vel), th = ((I.pan + 1) * Math.PI) / 4, gl = Math.cos(th) * Math.SQRT2, gr = Math.sin(th) * Math.SQRT2, wet = 0.32 * (I.wet || 1);
    for (let i = 0; i < m; i++) {
      const p = i * rate, j = p | 0, f = p - j;
      let l = w.L[j] + (w.L[j + 1] - w.L[j]) * f, r = w.R[j] + (w.R[j + 1] - w.R[j]) * f;
      const mid = (l + r) * 0.5; l = mid + (l - mid) * 0.6; r = mid + (r - mid) * 0.6; // narrow each section, then seat it
      const tt = i / SR; let e = Math.min(1, tt / att); if (i > rs) e *= Math.max(0, 1 - (i - rs) / (rel * SR)) ** 1.6;
      const g = amp * e; this.dry[0][i0 + i] += l * g * gl; this.dry[1][i0 + i] += r * g * gr; this.send[0][i0 + i] += l * g * gl * wet; this.send[1][i0 + i] += r * g * gr * wet;
    }
  }
  chord(name, notes, t, dur, vel) { for (const n of notes) this.note(name, n, t, dur, vel); }
}

// ---------------------------------------------------------------- harmony and melody
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const choose = (a) => a[Math.floor(rnd() * a.length)];
const MODES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], harm: [0, 2, 3, 5, 7, 8, 11], dorian: [0, 2, 3, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11] };
// a chord from a scale degree: "1", "6", "4/7" (seventh), "5:harm" (from another mode), "b6" etc via semitone list
function chordOf(key, mode, spec) {
  const [deg, ext] = String(spec).split('/'), [d0, md] = deg.split(':'), sc = MODES[md || mode], k = (+d0 - 1) % 7;
  const tones = [0, 2, 4, ...(ext === '7' ? [6] : ext === '9' ? [6, 8] : ext === 'sus' ? [] : [])].map((o) => sc[(k + o) % 7] + 12 * Math.floor((k + o) / 7));
  if (ext === 'sus') tones[1] = sc[(k + 3) % 7] + 12 * Math.floor((k + 3) / 7);
  return { root: (key + sc[k]) % 12, pcs: tones.map((x) => (key + x) % 12), sc: sc.map((x) => (key + x) % 12) };
}
const inRange = (pc, lo, hi) => { const r = []; for (let m = lo; m <= hi; m++) if (((m % 12) + 12) % 12 === pc) r.push(m); return r; };
// close, smooth voicing: each voice moves to the nearest chord tone in its range, every chord tone covered where possible
function voice(ch, prev, ranges) {
  const out = []; const used = new Set();
  ranges.forEach(([lo, hi], i) => { const p = prev?.[i] ?? (lo + hi) / 2; let best = null;
    for (const pc of ch.pcs) for (const m of inRange(pc, lo, hi)) { const cost = Math.abs(m - p) + (used.has(pc) ? 3 : 0); if (!best || cost < best.c) best = { m, c: cost, pc }; }
    used.add(best.pc); out.push(best.m); });
  return out;
}
const near = (pc, around) => { let best = null; for (let m = around - 6; m <= around + 6; m++) if (((m % 12) + 12) % 12 === pc && (best == null || Math.abs(m - around) < Math.abs(best - around))) best = m; return best; };
// a melody for 2 bars: rhythm cells, chord tones on strong beats, steps between, ending on a chord tone
function phrase(chords, beats, lo, hi, start, rhythm, end) {
  const notes = []; let p = start, b = 0;
  for (const d of rhythm) {
    const bar = Math.min(chords.length - 1, Math.floor(b / beats)), ch = chords[bar], strong = b % 1 === 0 && (b % beats === 0 || b % 2 === 0);
    if (strong) { p = near(choose(ch.pcs), p + choose([-2, 0, 2, 3])); }
    else { const sc = ch.sc, cur = ((p % 12) + 12) % 12, i = sc.indexOf(cur), dir = rnd() < 0.5 ? 1 : -1;
      p = i >= 0 ? p + ((sc[(i + dir + 7) % 7] - cur + 12 * (dir > 0 ? 1 : -1) * ((sc[(i + dir + 7) % 7] - cur) * dir < 0 ? 1 : 0))) : p + dir; }
    while (p < lo) p += 12; while (p > hi) p -= 12;
    notes.push({ b, d, m: p }); b += d;
  }
  if (end != null) { const last = notes[notes.length - 1]; last.m = near(end, last.m); while (last.m < lo) last.m += 12; while (last.m > hi) last.m -= 12; }
  return notes;
}

// ---------------------------------------------------------------- the moods (each is a small composition)
// ctx: st (stage), a (start s), bars (n), beat (s), key, mode, prog (chord specs per bar), lvl (0..1 energy over time)
const MOODS = {
  // gentle strings, harp and a flute line (reflection, the beginning, the quiet aftermath)
  calm: { bpm: 66, key: 2, mode: 'major', prog: ['1', '5', '6', '4', '1', '4', '2/7', '5/sus'], play(c) {
    pad(c, ['vc', 'vla', 'vln2'], 0.32, 0.5); bass(c, 'cb', 0.3);
    c.each((t, ch, i) => { // harp broken chords in eighths
      const v = voice(ch, null, [[50, 62], [57, 69], [62, 74], [66, 79]]);
      [0, 1, 2, 3, 2, 1, 2, 3].forEach((k, j) => c.st.note('harp', v[k], t + j * c.beat / 2, c.beat, 0.35 + 0.1 * (j === 0))); });
    melody(c, 'fl', 74, 86, 0.45, [[2, 1, 1, 3, 1], [1.5, 0.5, 2, 4]], 2);
    melody(c, 'cl', 62, 76, 0.4, [[1, 1, 2, 2, 2], [3, 1, 4]], 6, 4);
    c.each((t, ch, i) => { if (i >= 8) c.st.chord('hn', voice(ch, null, [[53, 62], [57, 67]]), t, c.bar, 0.25); });
  } },
  // lounge orchestra: walking pizz bass, clarinet tune, sparkle (glamour, money, a big house)
  glam: { bpm: 96, key: 5, mode: 'major', prog: ['1/7', '6/7', '2/7', '5/9', '3/7', '6/7', '2/7', '5/7'], play(c) {
    c.each((t, ch, i, next) => { const r = ch.root + 36, walk = [r, near(ch.pcs[1], r + 4), near(ch.pcs[2], r + 7), near((next.root + 11) % 12, r + 10)];
      walk.forEach((m, j) => c.st.note('cbPizz', m, t + j * c.beat, c.beat, 0.6 + 0.1 * (j === 0))); });
    c.each((t, ch) => { const v = voice(ch, null, [[60, 70], [64, 74], [67, 77]]); [1, 3].forEach((b) => c.st.chord('vlnPizz', v, t + b * c.beat, c.beat, 0.45)); c.st.note('tri', null, t + 3 * c.beat, 0.5, 0.25); });
    pad(c, ['vla', 'vln2'], 0.22, 0.4, [[64, 72], [69, 79]]);
    melody(c, 'cl', 65, 81, 0.5, [[1.5, 0.5, 1, 1, 2, 2], [0.5, 0.5, 1, 2, 4]], 1);
    melody(c, 'fl', 77, 89, 0.42, [[1, 0.5, 0.5, 2, 2, 2], [2, 2, 4]], 5, 4);
    c.each((t, ch, i) => { if (i % 4 === 3) [0, 1, 2, 3].forEach((k) => c.st.note('glock', near(ch.pcs[k % ch.pcs.length], 84 + k * 3), t + (2 + k * 0.5) * c.beat, 0.5, 0.35)); });
  } },
  // tiptoe pizzicato and a bassoon creeping about (scheming, gossip, someone about to be found out)
  sneaky: { bpm: 112, key: 2, mode: 'minor', prog: ['1', '1', '6', '5:harm', '1', '4', '6', '5:harm'], play(c) {
    c.each((t, ch, i) => { const r = ch.root + 36, five = r + 7;
      [[0, r], [1, five], [2, r + 12], [3, five]].forEach(([b, m]) => c.st.note(b % 2 ? 'vlaPizz' : 'vcPizz', b % 2 ? m + 12 : m, t + b * c.beat, c.beat / 2, 0.5 + 0.15 * (b === 0))); });
    const line = (inst, from, lo, hi, vel) => c.each((t, ch, i) => { if (i < from) return; const sc = ch.sc; let p = near(ch.root, (lo + hi) / 2);
      for (let k = 0; k < 8; k++) { if (k % 4 === 3 && rnd() < 0.5) continue; c.st.note(inst, p, t + k * c.beat / 2, c.beat / 2, vel + (k % 2 ? 0 : 0.1));
        const cur = sc.indexOf(((p % 12) + 12) % 12); p += rnd() < 0.3 ? -1 : cur >= 0 ? (rnd() < 0.55 ? 1 : -1) * (((sc[(cur + 1) % 7] - sc[cur] + 12) % 12) || 1) : 1; if (p < lo) p += 12; if (p > hi) p -= 12; } });
    line('bsnStac', 2, 46, 62, 0.5); line('clStac', 6, 62, 76, 0.45);
    c.each((t, ch, i) => { if (i >= 4 && i % 2) c.st.note('flStac', near(ch.pcs[1], 86), t + 3.5 * c.beat, 0.3, 0.35); if (i % 4 === 3) c.st.note('timp', ch.root + 36, t + 3 * c.beat, 1, 0.35); });
  } },
  // a pulse in the low strings, a heartbeat on timpani, high strings tightening (the feud building, the wait)
  tension: { bpm: 72, key: 9, mode: 'minor', prog: ['1', '1', '6', '6', '1', '1', '2:harm', '5:harm'], play(c) {
    c.each((t, ch, i) => { const r = ch.root + 36; for (let k = 0; k < 8; k++) { c.st.note(k % 2 ? 'vlaSpic' : 'vcSpic', k % 4 === 2 ? r + 7 : r + (k % 2 ? 12 : 0), t + k * c.beat / 2, c.beat / 2, 0.35 + 0.25 * c.lvl(t) + (k % 4 === 0 ? 0.12 : 0)); } });
    c.each((t, ch, i) => { c.st.note('cb', ch.root + 24 + (ch.root + 24 < 28 ? 12 : 0), t, c.bar, 0.35 + 0.3 * c.lvl(t));
      c.st.note('timp', ch.root + 36, t, 1, 0.45); c.st.note('timp', ch.root + 36, t + 0.32, 1, 0.3);
      if (i >= 2) c.st.chord('vlnTrem', [near(ch.pcs[0], 76 + Math.min(i, 8)), near(ch.pcs[1], 79 + Math.min(i, 8))], t, c.bar, 0.25 + 0.35 * c.lvl(t));
      if (i >= 4 && i % 2 === 0) c.st.chord('hn', [near(ch.pcs[0], 53), near(ch.pcs[2], 57)], t, c.bar * 2, 0.3 + 0.3 * c.lvl(t)); });
  } },
  // full strings and horns in a minor key, swelling into timpani and cymbals (the big moment, the fall)
  drama: { bpm: 66, key: 0, mode: 'minor', prog: ['1', '6', '3', '7', '1', '4', '6', '5:harm'], play(c) {
    pad(c, ['vc', 'vla', 'vln2', 'vln'], 0.4, 0.85, [[43, 55], [55, 67], [62, 74], [67, 79]], true);
    bass(c, 'cb', 0.55); c.each((t, ch, i) => { if (i >= 4) c.st.note('tuba', ch.root + 24 + (ch.root + 24 < 30 ? 12 : 0), t, c.bar, 0.35 + 0.3 * c.lvl(t)); });
    melody(c, 'hn', 55, 70, 0.55, [[3, 1, 2, 2], [2, 1, 1, 4]], 2);
    melody(c, 'tpt', 62, 77, 0.45, [[2, 1, 1, 2, 2], [3, 1, 4]], 8, 4);
    c.each((t, ch, i) => { const down = i % 4 === 0;
      if (down && i > 0) { c.st.note('crash', null, t, 4, 0.6); c.st.note('bd', null, t, 2, 0.6); c.st.note('timp', ch.root + 36, t, 2, 0.7); }
      if (i % 4 === 3) { c.st.note('swell', null, t + c.bar - 3.2, 4, 0.5); for (let k = 0; k < 12; k++) c.st.note('timp', ch.root + 36, t + c.bar - 1.5 + k * 0.125, 0.5, 0.2 + k * 0.05); } });
  } },
  // brass fanfare over driving strings (the win, the comeback, the internet loses its mind)
  triumph: { bpm: 110, key: 0, mode: 'major', prog: ['1', '5', '6', '4', '1', '4', '5', '1'], play(c) {
    c.each((t, ch) => { const v = voice(ch, null, [[60, 69], [64, 74]]); for (let k = 0; k < 8; k++) c.st.chord(k % 2 ? 'vlaSpic' : 'vlnSpic', v, t + k * c.beat / 2, c.beat / 2, 0.45 + 0.15 * (k % 2 === 0)); });
    bass(c, 'cb', 0.55); pad(c, ['vc'], 0.5, 0.7, [[43, 57]]);
    c.each((t, ch, i) => { c.st.note('timp', ch.root + 36, t, 1, 0.55); c.st.note('timp', near(ch.pcs[2], ch.root + 43), t + 2 * c.beat, 1, 0.45);
      if (i % 4 === 0) c.st.note('crash', null, t, 3, 0.5); c.st.chord('hn', voice(ch, null, [[55, 64], [60, 69]]), t, c.bar, 0.5); if (i >= 4) c.st.chord('tbn', [ch.root + 36 + (ch.root < 4 ? 12 : 0), near(ch.pcs[1], 55)], t, c.bar * 0.9, 0.5); });
    melody(c, 'tpt', 64, 79, 0.65, [[1.5, 0.5, 1, 1, 2, 2], [0.75, 0.25, 1, 2, 4]], 0);
    melody(c, 'glock', 76, 91, 0.4, [[1.5, 0.5, 1, 1, 2, 2], [0.75, 0.25, 1, 2, 4]], 4, 4);
  } },
  // light offbeat pizzicato, flute and clarinet in the sun (Caribbean warmth, travel, a holiday)
  island: { bpm: 88, key: 7, mode: 'major', prog: ['1', '4', '5', '4', '1', '6', '2', '5'], play(c) {
    c.each((t, ch) => { const v = voice(ch, null, [[62, 70], [66, 74], [69, 79]]); [0.5, 1.5, 2.5, 3.5].forEach((b) => c.st.chord('vlnPizz', v, t + b * c.beat, c.beat / 2, 0.42));
      c.st.note('cbPizz', ch.root + 36, t, c.beat, 0.65); c.st.note('cbPizz', ch.root + 43 > 50 ? ch.root + 31 : ch.root + 43, t + 1.5 * c.beat, c.beat, 0.5); c.st.note('cbPizz', ch.root + 36, t + 2 * c.beat, c.beat, 0.55);
      c.st.note('tri', null, t + 1.5 * c.beat, 0.4, 0.2); c.st.note('tri', null, t + 3.5 * c.beat, 0.4, 0.2); });
    melody(c, 'fl', 72, 86, 0.5, [[1, 0.5, 1, 0.5, 1], [1.5, 1.5, 1, 2, 2]], 2);
    melody(c, 'cl', 62, 74, 0.42, [[1, 1, 2], [0.5, 0.5, 1, 2, 4]], 6, 4);
  } },
  // oboe over hushed strings (loss, regret, the apology nobody believed)
  sad: { bpm: 58, key: 4, mode: 'minor', prog: ['1', '6', '4', '5', '1', '4', '7', '3'], play(c) {
    pad(c, ['vc', 'vla', 'vln2'], 0.25, 0.5); bass(c, 'cb', 0.3);
    melody(c, 'ob', 64, 79, 0.5, [[2, 1, 1, 4], [1, 1, 2, 4]], 2);
    melody(c, 'vln', 69, 84, 0.42, [[3, 1, 4], [2, 2, 4]], 6, 4);
    c.each((t, ch, i) => { if (i % 2 === 1) [0, 1, 2].forEach((k) => c.st.note('harp', near(ch.pcs[k], 67 + k * 4), t + 2 * c.beat + k * 0.18, 2, 0.3)); });
  } },
  // shimmer: harp, glockenspiel and high strings in a bright Lydian colour (discovery, the reveal of something lovely)
  wonder: { bpm: 72, key: 7, mode: 'lydian', prog: ['1', '2', '1', '2', '6', '5', '4', '2'], play(c) {
    pad(c, ['vla', 'vln2', 'vln'], 0.25, 0.55, [[57, 67], [64, 74], [69, 81]]); bass(c, 'cb', 0.3);
    c.each((t, ch) => { const v = voice(ch, null, [[62, 74], [66, 79], [71, 83], [74, 86]]); for (let k = 0; k < 8; k++) c.st.note('harp', v[[0, 1, 2, 3, 2, 3, 1, 2][k]] + (k > 3 ? 12 : 0), t + k * c.beat / 2, c.beat, 0.3); });
    melody(c, 'glock', 79, 91, 0.32, [[1, 1, 2], [1, 1, 1, 1]], 2); melody(c, 'fl', 74, 86, 0.4, [[2, 2, 3, 1], [4, 4]], 6, 4);
  } },
  // bouncing bassoon and pizzicato with a wink (comedy, a ridiculous claim, the fail)
  comedy: { bpm: 126, key: 5, mode: 'major', prog: ['1', '5', '1', '5', '4', '1', '5', '1'], play(c) {
    c.each((t, ch) => { c.st.note('cbPizz', ch.root + 36, t, c.beat, 0.6); c.st.note('cbPizz', ch.root + 43, t + 2 * c.beat, c.beat, 0.55);
      const v = voice(ch, null, [[60, 69], [64, 72]]); [1, 3].forEach((b) => c.st.chord('vlnPizz', v, t + b * c.beat, c.beat / 2, 0.45)); });
    melody(c, 'bsnStac', 46, 62, 0.6, [[0.5, 0.5, 1, 0.5, 0.5, 1], [1, 1, 0.5, 0.5, 1]], 1);
    melody(c, 'clStac', 65, 77, 0.5, [[0.5, 0.5, 0.5, 0.5, 1, 1], [1, 0.5, 0.5, 2]], 5, 4);
    c.each((t, ch, i) => { if (i % 4 === 3) c.st.note('glock', near(ch.root, 84), t + 3.5 * c.beat, 0.5, 0.45); });
  } },
  none: { bpm: 60, key: 0, mode: 'major', prog: ['1'], play() {} },
};
// sustained strings: smooth voice leading, a phrase-long swell when swell is set
function pad(c, insts, v0, v1, ranges, swell) {
  const R = ranges || [[43, 57], [53, 67], [60, 74], [67, 79]].slice(4 - insts.length); let prev = null;
  c.each((t, ch, i) => { const v = voice(ch, prev, R); prev = v; const e = c.lvl(t), arc = swell ? 0.75 + 0.25 * ((i % 2) + 0.5) / 1.5 : 1;
    insts.forEach((ins, k) => { if (k >= 2 && i < 2 && insts.length > 2) return; c.st.note(ins, v[k], t, c.bar + 0.05, (v0 + (v1 - v0) * e) * arc); }); });
}
function bass(c, ins, vel) { c.each((t, ch) => { let m = ch.root + 24; if (m < 28) m += 12; c.st.note(ins, m, t, c.bar + 0.05, vel * (0.7 + 0.3 * c.lvl(t))); }); }
// a tune in 8-bar periods: theme (2 bars), answer, theme again, cadence to the tonic; enters at bar `from`, every `every` bars
function melody(c, ins, lo, hi, vel, cells, from, skip = 0) {
  let start = (lo + hi) >> 1, theme = null;
  for (let i = from; i < c.bars; i += 2) {
    if (skip && Math.floor((i - from) / 4) % 2 === 1) continue; // rests half the time when skip is set (call and answer)
    const chords = [c.chord(i), c.chord(i + 1)], beats = c.beats, pos = ((i - from) / 2) % 4, cad = pos === 3 || i + 2 >= c.bars;
    let notes;
    if (pos === 2 && theme) notes = theme.map((n) => ({ ...n, m: near(((n.m % 12) + 12) % 12, n.m) }));
    else { const cells2 = pos === 1 || cad ? cells[1] : cells[0]; notes = phrase(chords, beats, lo, hi, start, [...cells2, ...(cells2.reduce((a, b) => a + b, 0) < beats * 2 ? [beats * 2 - cells2.reduce((a, b) => a + b, 0)] : [])], cad ? c.keyPc : null); }
    if (pos === 0) theme = notes;
    const t0 = c.time(i);
    notes.forEach((n, k) => { if (n.b >= beats * 2) return; const shape = 0.85 + 0.15 * Math.sin((Math.PI * n.b) / (beats * 2));
      c.st.note(ins, n.m, t0 + n.b * c.beat, n.d * c.beat * 0.95, Math.min(1, vel * shape * (0.8 + 0.3 * c.lvl(t0)))); });
    start = notes[notes.length - 1].m;
  }
}

// ---------------------------------------------------------------- orchestral hits for sound effects
const HITS = {
  boom: (st, t, v) => { st.note('bd', null, t, 3, 0.9 * v); st.note('timp', 38, t, 3, 0.9 * v); st.note('gong', null, t, 6, 0.6 * v); st.note('crash', null, t, 4, 0.5 * v); st.chord('vcSpic', [36, 43], t, 0.4, 0.9 * v); },
  sting: (st, t, v) => { st.chord('tptStac', [67, 72], t, 0.4, 0.8 * v); st.chord('hnStac', [60, 64], t, 0.4, 0.8 * v); st.chord('vlnSpic', [72, 76, 79], t, 0.4, 0.8 * v); st.chord('vcSpic', [36, 48], t, 0.4, 0.8 * v); st.note('timp', 36, t, 2, 0.7 * v); st.note('crash', null, t, 3, 0.35 * v); },
  riser: (st, t, v) => { st.note('swell', null, t - 1.2, 3, 0.6 * v); st.chord('vlnTrem', [74, 77, 81], t, 1.8, 0.5 * v); st.chord('vcTrem', [45, 52], t, 1.8, 0.45 * v); },
  ding: (st, t, v) => st.note('glock', 91, t, 1, 0.6 * v),
  chime: (st, t, v) => { st.note('glock', 84, t, 1, 0.55 * v); st.note('glock', 91, t + 0.13, 1, 0.55 * v); },
  womp: (st, t, v) => { [58, 57, 56].forEach((m, k) => st.note('tbn', m, t + k * 0.42, 0.38, 0.6 * v)); st.note('tbn', 55, t + 1.26, 1.1, 0.55 * v); },
  hush: (st, t, v) => { st.note('swell', null, t, 2, 0.25 * v); st.chord('vlnTrem', [81, 88], t, 1.4, 0.2 * v); },
  thud: (st, t, v) => { st.note('bd', null, t, 1.5, 0.7 * v); st.note('timp', 36, t, 1.5, 0.5 * v); },
};

// ---------------------------------------------------------------- the score
function hallIR(file, secs = 2.6) {
  const n = Math.round(secs * SR), L = new Float32Array(n), R = new Float32Array(n); let s1 = 3, s2 = 7;
  const nz = (s) => ((s = (s * 16807) % 2147483647), s);
  let lpL = 0, lpR = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, pre = 0.022; if (t < pre) continue;
    s1 = nz(s1); s2 = nz(s2); const env = Math.exp((-6.9 * (t - pre)) / (secs * 0.85)), k = 0.55 * Math.exp(-(t - pre) * 1.6) + 0.06;
    lpL += k * ((s1 / 1073741823.5 - 1) - lpL); lpR += k * ((s2 / 1073741823.5 - 1) - lpR); L[i] = lpL * env; R[i] = lpR * env; }
  [[0.031, 0.5, 0.3], [0.043, 0.3, 0.45], [0.057, 0.35, 0.2], [0.071, 0.2, 0.3]].forEach(([d, a, b]) => { const i = Math.round(d * SR); L[i] += a; R[i] += b; });
  writeWav(file, [L, R], 1 / Math.max(...L.map(Math.abs)) * 0.5);
}
function writeWav(file, [L, R], gain = 1) {
  const n = L.length, b = Buffer.alloc(44 + n * 4);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 4, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * gain * 32767))), 44 + i * 4); b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * gain * 32767))), 46 + i * 4); }
  fs.writeFileSync(file, b);
}
function score(file, dur, cues, sfx = [], opts = {}) {
  seed = opts.seed ?? 11;
  const st = new Stage(dur), list = [...cues].sort((a, b) => a[0] - b[0]);
  for (let c = 0; c < list.length; c++) {
    const [a, mood] = list[c], b = c + 1 < list.length ? list[c + 1][0] : dur, M = MOODS[mood];
    if (!M) throw new Error(`unknown music mood "${mood}" (moods: ${Object.keys(MOODS).join(', ')})`);
    if (mood === 'none' || b - a < 1) continue;
    const beat = 60 / M.bpm, beats = 4, bar = beat * beats, key = opts.key ?? M.key;
    const bars = Math.max(1, Math.round((b - a) / bar)); // whole bars; the last one rings across the change
    const ctx = { st, a, bars, beat, beats, bar, key, keyPc: key, mode: M.mode,
      time: (i) => a + i * bar, chord: (i) => chordOf(key, M.mode, M.prog[Math.min(i, bars - 1) === bars - 1 && bars > 2 ? 0 : i % M.prog.length]),
      // energy: builds through the cue, eases in the last bar
      lvl: (t) => Math.max(0, Math.min(1, ((t - a) / Math.max(bar * 2, b - a)) * 1.1)) * (t > b - bar ? 0.75 : 1),
      each(fn) { for (let i = 0; i < bars; i++) fn(this.time(i), this.chord(i), i, this.chord(i + 1)); } };
    // the cue's own length decides the shape: under 3 bars just the bed
    if (bars < 3) { pad(ctx, ['vc', 'vla', 'vln2'], 0.25, 0.35); bass(ctx, 'cb', 0.25); } else M.play(ctx);
  }
  for (const [at, name, vol = 1] of sfx) if (HITS[name]) HITS[name](st, at, vol);
  // hall: dry stage + convolution reverb (ffmpeg afir), then loudness to about -20 LUFS, limiter
  const tmp = file + '.parts'; fs.mkdirSync(tmp, { recursive: true });
  const cut = (x) => x.subarray(0, Math.ceil(dur * SR));
  writeWav(path.join(tmp, 'dry.wav'), st.dry.map(cut), 0.5); writeWav(path.join(tmp, 'send.wav'), st.send.map(cut), 0.5); hallIR(path.join(tmp, 'ir.wav'));
  const fade = Math.max(0, dur - 3).toFixed(2);
  const hall = path.join(tmp, 'hall.wav');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'dry.wav'), '-i', path.join(tmp, 'send.wav'), '-i', path.join(tmp, 'ir.wav'), '-filter_complex',
    `[1:a][2:a]afir=dry=0:wet=1:irgain=0[w];[0:a][w]amix=inputs=2:normalize=0:weights=1 1.6,highpass=f=32,equalizer=f=250:t=q:w=1:g=-1.5,equalizer=f=3500:t=q:w=1:g=1,afade=t=out:st=${fade}:d=3[o]`,
    '-map', '[o]', '-ar', String(SR), '-ac', '2', '-c:a', 'pcm_f32le', hall]);
  // measured loudness, then one gain (keeps the score's dynamics), then a gentle limiter: a bed at about -21 LUFS sits under a -16 LUFS voice
  let I = -20; try { const out = require('child_process').spawnSync('ffmpeg', ['-nostats', '-i', hall, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' }).stderr; const m = /I:\s+(-?[\d.]+) LUFS\s*\n\s*Threshold[\s\S]*$/.exec(out) || /I:\s+(-?[\d.]+) LUFS/g.exec(out.slice(out.lastIndexOf('Summary'))); if (m) I = +m[1]; } catch (e) {}
  const target = opts.lufs ?? -21;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', hall, '-af', `volume=${(target - I).toFixed(2)}dB,alimiter=limit=0.89:level=false`, '-c:a', 'pcm_s16le', file]);
  fs.rmSync(tmp, { recursive: true, force: true });
  return { hits: Object.keys(HITS) };
}
module.exports = { score, available, moods: Object.keys(MOODS), hits: Object.keys(HITS) };
if (require.main === module) { // demo: node orchestra/orchestra.cjs out.wav [mood ...]
  const out = process.argv[2] || 'orchestra-demo.wav', moods = process.argv.slice(3).length ? process.argv.slice(3) : ['calm', 'tension', 'drama', 'triumph'];
  const each = 24, cues = moods.map((m, i) => [i * each, m]);
  score(out, moods.length * each + 2, cues, [[each - 1.8, 'riser'], [each, 'boom'], [each * 2 + 6, 'sting']]); console.log(out);
}
