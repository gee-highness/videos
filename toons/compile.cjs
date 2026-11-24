#!/usr/bin/env node
/* Landscape compilation for YouTube (16:9) from finished vertical episodes, with a title card before each episode and a thumbnail.
   node toons/compile.cjs <name> "<Channel title>" <id> <id> ...
   e.g. node toons/compile.cjs vk-season-1 "Small Business News: Season 1" vk01 vk02 vk03 vk04 vk05 vk06 vk07 vk08
   Output: toons/out/youtube/<name>.mp4 (1920x1080) and <name>-thumb.jpg (1280x720). Needs toons/out/<id>.mp4. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..'), out = path.join(root, 'toons', 'out'), dst = path.join(out, 'youtube');
const [name, title, ...ids] = process.argv.slice(2);
if (!name || !ids.length) { console.error('usage: compile.cjs <name> "<title>" <id> ...'); process.exit(1); }
fs.mkdirSync(dst, { recursive: true });
const font = path.join(__dirname, 'fonts', 'Caveat_Brush.ttf').replace(/:/g, '\\:');
const ep = (id) => fs.readFileSync(path.join(__dirname, 'ep', id + '.js'), 'utf8');
const brand = /brand:\s*'(#[0-9A-Fa-f]{6})'/.exec(ep(ids[0]))[1].replace('#', '0x');
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, '\u2019').replace(/:/g, '\\:').replace(/,/g, '\\,');
const ins = [], parts = [];
let f = '';
ids.forEach((id, k) => {
  const t = /title:\s*'([^']+)'/.exec(ep(id))[1].replace(/\\'/g, '\u2019');
  // title card: 2.5 s, brand colour, episode number and title, silent
  f += `color=c=${brand}:s=1920x1080:r=24:d=2.5,drawtext=fontfile='${font}':text='${esc(title)}':fontcolor=white@0.85:fontsize=54:x=(w-text_w)/2:y=300,` +
    `drawtext=fontfile='${font}':text='Episode ${k + 1}':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=420,drawtext=fontfile='${font}':text='${esc(t)}':fontcolor=white:fontsize=130:x=(w-text_w)/2:y=540,format=yuv420p,setsar=1[tc${k}];` +
    `anullsrc=r=44100:cl=stereo,atrim=0:2.5[ta${k}];`;
  ins.push('-i', path.join(out, id + '.mp4'));
  // the vertical episode in the middle, a blurred and darkened copy of itself filling the sides
  f += `[${k}:v]fps=24,split[a${k}][b${k}];[a${k}]scale=1920:-2,crop=1920:1080,boxblur=24:2,eq=brightness=-0.18[bg${k}];[b${k}]scale=-2:1080[fg${k}];[bg${k}][fg${k}]overlay=(W-w)/2:0,format=yuv420p,setsar=1[ev${k}];` +
    `[${k}:a]aresample=44100,aformat=channel_layouts=stereo[ea${k}];`;
  parts.push(`[tc${k}][ta${k}][ev${k}][ea${k}]`);
});
f += `${parts.join('')}concat=n=${ids.length * 2}:v=1:a=1[v][a]`;
const o = path.join(dst, name + '.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', f, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', o]);
// thumbnail: a frame from the first episode on the brand colour with the title
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '4', '-i', path.join(out, ids[0] + '.mp4'), '-frames:v', '1', '-filter_complex',
  `color=c=${brand}:s=1280x720[c];[0:v]scale=-2:720[fg];[c][fg]overlay=W-w-40:0,drawtext=fontfile='${font}':text='${esc(title.split(':')[0])}':fontcolor=white:fontsize=84:x=60:y=170,drawtext=fontfile='${font}':text='${esc((title.split(':')[1] || '').trim())}':fontcolor=white:fontsize=84:x=60:y=270,` +
  `drawtext=fontfile='${font}':text='${ids.length} episodes':fontcolor=white@0.9:fontsize=60:x=60:y=420`, path.join(dst, name + '-thumb.jpg')]);
console.log(o, (+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', o])).toFixed(0) + ' s');
