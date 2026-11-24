#!/usr/bin/env node
/* 15-second cut-downs made from the finished episode videos (so voices, captions and sound stay exactly as approved).
   node toons/cutdowns.cjs            all episodes in cuts.json
   node toons/cutdowns.cjs vk01 sv03  only these
   node toons/cutdowns.cjs vk01:neon  from the neon render (toons/out/vk01-neon.mp4)
   Needs toons/out/<id>.mp4 and toons/out/<id>-timing.json (made by engine.cjs). Output: toons/out/shorts/<id>-15.mp4, -15-720.mp4 and a contact sheet.
   Whole voice lines only; consecutive lines play as one stretch; 0.15 s crossfades; the episode's progress bar is replaced by one for the short. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..'), out = path.join(root, 'toons', 'out'), dst = path.join(out, 'shorts');
const cuts = JSON.parse(fs.readFileSync(path.join(__dirname, 'cuts.json'), 'utf8'));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(cuts).filter((k) => !k.startsWith('_'));
const X = 0.15, PRE = 0.15, POST = 0.3;
fs.mkdirSync(dst, { recursive: true });
for (const arg of ids) {
  const [id, style] = arg.split(':'), tag = id + (style ? '-' + style : '');
  const T = JSON.parse(fs.readFileSync(path.join(out, id + '-timing.json'), 'utf8')), V = T.voice, last = V.length - 1;
  const src = fs.readFileSync(path.join(__dirname, 'ep', id + '.js'), 'utf8'), brand = /brand:\s*'(#[0-9A-Fa-f]{6})'/.exec(src)[1];
  // group consecutive lines into stretches, then add the end card (the last line plus a short hold)
  const keep = [...cuts[id]].sort((a, b) => a - b), segs = [];
  for (const i of keep) { const s = segs[segs.length - 1]; if (s && s.b === i - 1) s.b = i; else segs.push({ a: i, b: i }); }
  const span = segs.map(({ a, b }) => [Math.max(0, V[a].at - PRE), Math.min(T.dur, V[b].at + V[b].d + POST)]);
  span.push([V[last].at - 0.3, Math.min(T.dur, V[last].at + V[last].d + 0.9)]);
  const lens = span.map(([s, e]) => e - s), total = lens.reduce((x, y) => x + y, 0) - X * (lens.length - 1);
  const ins = span.flatMap(([s, e]) => ['-ss', s.toFixed(3), '-t', (e - s).toFixed(3), '-i', path.join(out, tag + '.mp4')]);
  let f = span.map((_, i) => `[${i}:v]setpts=PTS-STARTPTS,fps=24[v${i}];[${i}:a]asetpts=PTS-STARTPTS[a${i}]`).join(';'), vPrev = 'v0', aPrev = 'a0', acc = lens[0];
  for (let i = 1; i < span.length; i++) { f += `;[${vPrev}][v${i}]xfade=transition=fade:duration=${X}:offset=${(acc - X).toFixed(3)}[vx${i}];[${aPrev}][a${i}]acrossfade=d=${X}[ax${i}]`; vPrev = `vx${i}`; aPrev = `ax${i}`; acc += lens[i] - X; }
  // cover the episode's progress bar with the colour just above it, then draw the short's own bar
  f += `;[${vPrev}]split[base][strip];[strip]crop=1080:14:0:1890,scale=1080:14[cov];[base][cov]overlay=0:1906[cv];color=c=${brand}:s=1080x14:r=24[bar];[cv][bar]overlay=x='-W+W*t/${total.toFixed(3)}':y=1906:shortest=1[vout]`;
  const o = path.join(dst, tag + '-15.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', f, '-map', '[vout]', '-map', `[${aPrev}]`, '-t', total.toFixed(3), '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', o]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', o, '-vf', 'scale=720:1280', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'copy', '-movflags', '+faststart', path.join(dst, tag + '-15-720.mp4')]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', o, '-vf', 'fps=1,scale=216:-1,tile=9x2', '-frames:v', '1', path.join(dst, tag + '-15-sheet.jpg')]);
  console.log(`${tag}: ${total.toFixed(1)} s from lines ${keep.join(', ')} + end card`);
}
