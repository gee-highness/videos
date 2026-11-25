// es03 pictures: our own flat illustrations (no real people, no stock photos). Run: node projects/es03/illustrations/make.cjs
// Writes projects/es03/img/NN.png (1920x1080). Key subject stays in the centre third so the 9:16 crop keeps it.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, '..', 'img'); fs.mkdirSync(OUT, { recursive: true });
const C = { navy: '#14192B', navy2: '#0b0e1a', plum: '#3B1E2E', plum2: '#52283f', gold: '#C9A96E', ivory: '#F2EBDD', amber: '#E0962F', terra: '#B5523B', teal: '#3fc1b0', red: '#e5484d', wood: '#6b3f2a' };
const W = 1920, H = 1080;
const defs = `<defs>
 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
 <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
 <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
 <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0e1a"/><stop offset="0.6" stop-color="#1b1428"/><stop offset="1" stop-color="#3B1E2E"/></linearGradient>
 <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d6" stop-opacity="0.5"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0.03"/></linearGradient>
 <linearGradient id="bowl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d98a43"/><stop offset="0.55" stop-color="#a8581f"/><stop offset="1" stop-color="#6e3512"/></linearGradient>
 <linearGradient id="wine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d58a"/><stop offset="1" stop-color="#e0962f"/></linearGradient>
 <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17313a"/><stop offset="1" stop-color="#0c1b22"/></linearGradient>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1230"/><stop offset="0.55" stop-color="#6a2c4a"/><stop offset="0.85" stop-color="#d9693a"/><stop offset="1" stop-color="#f2b45a"/></linearGradient>
 <linearGradient id="golden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B1E2E"/><stop offset="0.45" stop-color="#c9663a"/><stop offset="0.8" stop-color="#f2b45a"/><stop offset="1" stop-color="#f7d58a"/></linearGradient>
 <radialGradient id="pool"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
</defs>`;
const svg = (body, bg = 'url(#night)') => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}<rect width="${W}" height="${H}" fill="${bg}"/>${body}</svg>`;
const rr = (x, y, w, h, r, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`;
const circ = (x, y, r, f, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${extra}/>`;

// string lights: a sagging wire with glowing bulbs
function lights(y0, sag, n = 16, x0 = -40, x1 = W + 40, color = '#ffd98a') {
  let s = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 + sag * 2} ${x1} ${y0}" stroke="#05070e" stroke-width="3" fill="none"/>`;
  for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + 2 * sag * t * (1 - t) * 1; s += circ(x, y + 14, 16, color, 'opacity=".35" filter="url(#glow)"') + circ(x, y + 14, 7, '#fff3d6'); }
  return s;
}
// a chair seen from the front (s = scale)
function chair(x, y, s, fill = C.plum2, sash = null) {
  let o = rr(x - 34 * s, y - 118 * s, 68 * s, 70 * s, 10 * s, fill) + rr(x - 42 * s, y - 52 * s, 84 * s, 24 * s, 8 * s, fill) + `<rect x="${x - 36 * s}" y="${y - 30 * s}" width="${6 * s}" height="${30 * s}" fill="${fill}"/><rect x="${x + 30 * s}" y="${y - 30 * s}" width="${6 * s}" height="${30 * s}" fill="${fill}"/>`;
  if (sash) o += rr(x - 34 * s, y - 88 * s, 68 * s, 14 * s, 3 * s, sash) + rr(x - 42 * s, y - 46 * s, 84 * s, 8 * s, 3 * s, sash);
  return o;
}
// a calabash cup of palm wine (cx = centre, ty = rim height, w = rim width)
function cup(cx, ty, w = 220) {
  const h = w * 0.62, r = w / 2;
  return `<ellipse cx="${cx}" cy="${ty + h + 4}" rx="${r * 0.7}" ry="${r * 0.08}" fill="#000" opacity=".4" filter="url(#soft)"/>
  <path d="M${cx - r} ${ty} C${cx - r} ${ty + h * 0.85} ${cx - r * 0.4} ${ty + h} ${cx} ${ty + h} C${cx + r * 0.4} ${ty + h} ${cx + r} ${ty + h * 0.85} ${cx + r} ${ty} Z" fill="url(#bowl)"/>
  <ellipse cx="${cx}" cy="${ty}" rx="${r}" ry="${r * 0.2}" fill="#3a1f10"/><ellipse cx="${cx}" cy="${ty + 3}" rx="${r * 0.9}" ry="${r * 0.16}" fill="url(#wine)"/>
  <path d="M${cx - r * 0.78} ${ty + h * 0.34} L${cx - r * 0.5} ${ty + h * 0.5} L${cx - r * 0.22} ${ty + h * 0.34} L${cx + r * 0.06} ${ty + h * 0.5} L${cx + r * 0.34} ${ty + h * 0.34} L${cx + r * 0.62} ${ty + h * 0.5}" stroke="${C.gold}" stroke-width="${w * 0.02}" fill="none" stroke-linejoin="round"/>
  <path d="M${cx - r * 0.85} ${ty + h * 0.12} Q${cx - r * 0.8} ${ty + h * 0.55} ${cx - r * 0.35} ${ty + h * 0.85}" stroke="#fff" stroke-opacity=".25" stroke-width="${w * 0.03}" fill="none" stroke-linecap="round"/>`;
}
const palm = (x, y, s, f = '#0a0912') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C6 -120 -10 -230 10 -330" stroke="${f}" stroke-width="16" fill="none" stroke-linecap="round"/>${[-80, -40, 0, 40, 80].map((a, i) => `<path d="M10 -330 Q${a * 2.2} ${-380 - (i % 2) * 20} ${a * 3} ${-300 + Math.abs(a) * 0.6}" stroke="${f}" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
const note = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><ellipse cx="0" cy="60" rx="34" ry="26" transform="rotate(-20 0 60)"/><ellipse cx="110" cy="40" rx="34" ry="26" transform="rotate(-20 110 40)"/><rect x="24" y="-90" width="12" height="150"/><rect x="134" y="-110" width="12" height="150"/><path d="M24 -90 L146 -110 L146 -64 L24 -44 Z"/></g>`;

const scenes = {};
// ---- 01 hook: the cup in a spotlight, chairs in the dark
scenes['01'] = () => {
  let rows = '';
  for (let r = 0; r < 3; r++) for (let i = 0; i < 13; i++) { const s = 0.9 - r * 0.2, x = 160 + i * 120 + r * 30, y = 640 + r * 70; rows += chair(x, y, s, r === 0 ? '#3a2240' : '#2d1a30'); }
  return svg(`${lights(80, 60, 18)}${rows}
   <polygon points="880,0 1040,0 1330,1080 590,1080" fill="url(#beam)"/>
   <ellipse cx="960" cy="905" rx="360" ry="70" fill="url(#pool)"/>
   <ellipse cx="960" cy="905" rx="190" ry="26" fill="#2a1a2f"/>
   ${rr(880, 712, 160, 193, 8, C.wood)}<ellipse cx="960" cy="712" rx="80" ry="16" fill="#8a5636"/>
   ${cup(960, 560, 250)}`);
};
// ---- 02 the search: top-down hall, a path from the cup to the hidden heart
scenes['02'] = () => {
  let ch = '';
  for (let r = 0; r < 9; r++) for (let k = 0; k < 4; k++) { const y = 130 + r * 100; ch += rr(690 + k * 52, y, 38, 38, 8, '#35203a') + rr(1036 + k * 52, y, 38, 38, 8, '#35203a'); }
  let pts = [], dots = '';
  for (let i = 0; i <= 40; i++) { const t = i / 40, y = 960 - t * 820, x = 960 + Math.sin(t * Math.PI * 3.2) * 52 * (1 - 0.2 * t); pts.push([x, y]); }
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  pts.forEach((p, i) => { if (i % 2 === 0 && i > 2 && i < 39) dots += circ(p[0], p[1], 6, C.gold); });
  return svg(`<rect x="620" y="60" width="680" height="960" rx="30" fill="#1a1530" opacity=".8"/>${ch}
   <path d="${d}" stroke="#C9A96E" stroke-opacity=".25" stroke-width="40" fill="none" stroke-linecap="round"/>${dots}
   ${circ(960, 990, 70, C.amber, 'opacity=".4" filter="url(#glow)"')}${circ(960, 990, 44, '#3a1f10')}${circ(960, 990, 36, 'url(#wine)')}
   ${circ(pts[40][0], 120, 70, C.gold, 'opacity=".45" filter="url(#glow)"')}${circ(pts[40][0], 120, 44, C.plum)}
   <path d="M${pts[40][0]} 138 C${pts[40][0] - 40} 112 ${pts[40][0] - 22} 84 ${pts[40][0]} 104 C${pts[40][0] + 22} 84 ${pts[40][0] + 40} 112 ${pts[40][0]} 138 Z" fill="${C.gold}"/>
   ${lights(40, 30, 12, 600, 1320)}`, '#0e1224');
};
// ---- 05 DJ booth: a laptop whose download has failed
scenes['05'] = () => {
  const spk = (x) => rr(x, 330, 230, 600, 26, '#10121d') + circ(x + 115, 480, 78, '#1c2033') + circ(x + 115, 480, 34, '#0a0c14') + circ(x + 115, 740, 56, '#1c2033') + circ(x + 115, 740, 24, '#0a0c14') + circ(x + 115, 480, 80, 'none', `stroke="${C.gold}" stroke-opacity=".5" stroke-width="3"`);
  let kn = ''; for (let i = 0; i < 6; i++) kn += circ(770 + i * 76, 800, 20, '#2a2f46') + `<rect x="${767 + i * 76}" y="784" width="6" height="14" fill="${C.gold}"/>`;
  let fd = ''; for (let i = 0; i < 4; i++) fd += rr(790 + i * 100, 848, 10, 40, 3, '#0a0c14') + rr(782 + i * 100, 856 + (i % 2) * 14, 26, 12, 3, C.ivory);
  return svg(`${lights(70, 50, 18)}${spk(400)}${spk(1290)}
   ${rr(0, 900, W, 180, 0, '#1a1020')}<rect x="0" y="896" width="${W}" height="8" fill="${C.gold}" opacity=".6"/>
   <polygon points="760,900 1160,900 1120,740 800,740" fill="#0a0c14"/>
   ${rr(770, 330, 380, 300, 18, '#0a0c14')}${rr(788, 348, 344, 262, 8, 'url(#screen)')}
   ${[0, 1, 2].map((i) => rr(810, 372 + i * 34, 240 - i * 40, 14, 6, '#2e5560') + circ(1100, 379 + i * 34, 7, '#2e5560')).join('')}
   ${rr(812, 520, 296, 18, 9, '#0a1419')}${rr(812, 520, 186, 18, 9, C.teal)}
   ${circ(1060, 478, 36, C.red, 'opacity=".5" filter="url(#glow)"')}${circ(1060, 478, 28, C.red)}<path d="M1048 466 L1072 490 M1072 466 L1048 490" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
   <ellipse cx="960" cy="420" rx="260" ry="200" fill="${C.teal}" opacity=".07" filter="url(#glow)"/>
   ${rr(700, 740, 520, 170, 16, '#171b2b')}${kn}${fd}${circ(1130, 860, 38, '#0a0c14')}${circ(1130, 860, 30, '#232842')}
   `, 'url(#night)');
};
// ---- 07 the empty aisle and the waiting cup
scenes['07'] = () => {
  const vp = [960, 420]; let rows = '';
  for (let i = 0; i < 8; i++) {
    const t = (i + 1) / 8, y = vp[1] + 700 * Math.pow(t, 1.8), s = 0.18 + 1.05 * Math.pow(t, 1.4), half = 34 + 260 * Math.pow(t, 1.4);
    for (let k = 0; k < 2; k++) { const dx = half + 70 * s + k * 86 * s; rows = chair(960 - dx, y, s, i % 2 ? '#2d1a30' : '#35203a') + chair(960 + dx, y, s, i % 2 ? '#2d1a30' : '#35203a') + rows; }
  }
  return svg(`${lights(60, 40, 18)}<polygon points="${vp[0] - 30},${vp[1]} ${vp[0] + 30},${vp[1]} 1260,1080 660,1080" fill="${C.terra}" opacity=".7"/>
   <polygon points="${vp[0] - 30},${vp[1]} ${vp[0] + 30},${vp[1]} 1000,1080 920,1080" fill="#ffb26b" opacity=".2"/>${rows}
   <ellipse cx="960" cy="500" rx="340" ry="200" fill="url(#pool)"/>
   ${chair(960, 560, 2.1, '#5a2a45', C.gold)}${cup(960, 380, 130)}`, 'url(#night)');
};
// ---- 08 the father's house at dusk
scenes['08'] = () => svg(`
   ${circ(960, 780, 330, '#ffb26b', 'opacity=".35" filter="url(#glow)"')}
   ${[...Array(40)].map((_, i) => circ((i * 197) % W, (i * 89) % 420, 1.5 + (i % 3), '#fff3d6', `opacity="${0.3 + (i % 4) * 0.15}"`)).join('')}
   <rect x="0" y="700" width="${W}" height="380" fill="#150f1c"/><g transform="translate(0 -80)">
   ${palm(430, 800, 1.1)}${palm(1520, 800, 1.25)}${palm(300, 800, 0.8)}
   <polygon points="930,860 990,860 1250,1080 670,1080" fill="#ffcf70" opacity=".5"/>
   ${rr(740, 520, 440, 340, 6, '#9a4a36')}<polygon points="700,525 960,380 1220,525" fill="${C.plum}"/>
   ${rr(740, 520, 40, 340, 0, '#7b3626')}
   ${rr(910, 650, 100, 210, 40, '#ffcf70')}${rr(910, 650, 100, 210, 40, 'url(#pool)', 'opacity=".5"')}
   ${rr(790, 580, 80, 80, 6, '#ffcf70')}${rr(1050, 580, 80, 80, 6, '#ffcf70')}<rect x="826" y="580" width="8" height="80" fill="#9a4a36"/><rect x="1086" y="580" width="8" height="80" fill="#9a4a36"/>
   ${circ(845, 620, 90, '#ffcf70', 'opacity=".2" filter="url(#glow)"')}${circ(1085, 620, 90, '#ffcf70', 'opacity=".2" filter="url(#glow)"')}</g>`, 'url(#sky)');
// ---- 10 two sides: a song, and a DJ's laptop
scenes['10'] = () => {
  const bar = (x, h) => rr(x, 1080 - h, 40, h, 6, '#ffffff', 'opacity=".05"');
  return svg(`${[...Array(48)].map((_, i) => bar(i * 40, 80 + ((i * 53) % 260))).join('')}
   ${circ(960, 540, 480, C.plum2, 'opacity=".35" filter="url(#glow)"')}
   <g transform="translate(0 -150)"><path d="M690 300 h400 a40 40 0 0 1 40 40 v220 a40 40 0 0 1 -40 40 h-250 l-90 70 v-70 h-60 a40 40 0 0 1 -40 -40 v-220 a40 40 0 0 1 40 -40 z" fill="${C.gold}"/>
   ${note(740, 420, 1.0, C.plum)}
   <path d="M1230 560 h-380 a40 40 0 0 0 -40 40 v220 a40 40 0 0 0 40 40 h230 l110 70 v-70 h40 a40 40 0 0 0 40 -40 v-220 a40 40 0 0 0 -40 -40 z" fill="${C.ivory}"/>
   ${rr(930, 620, 240, 150, 10, C.navy)}${rr(944, 634, 212, 114, 4, '#2e5560')}<polygon points="910,780 1190,780 1170,798 930,798" fill="${C.navy}"/>
   ${circ(1050, 690, 16, C.teal)}</g>`, 'url(#night)');
};
// ---- 11 calm backdrop for a date card: a record and soft equaliser bars
scenes['11'] = () => svg(`${[...Array(48)].map((_, i) => rr(i * 40, 1080 - (120 + ((i * 71) % 300)), 40, 120 + ((i * 71) % 300), 6, '#ffffff', 'opacity=".04"')).join('')}
   ${circ(960, 400, 300, C.plum2, 'opacity=".4" filter="url(#glow)"')}${circ(960, 400, 210, '#0a0c14')}${circ(960, 400, 190, '#161a2c', `stroke="${C.gold}" stroke-opacity=".35" stroke-width="3"`)}${circ(960, 400, 120, '#161a2c', `stroke="${C.gold}" stroke-opacity=".25" stroke-width="2"`)}`, 'url(#night)');
// ---- 12 the list: a playlist with one song starred, a notepad with ticks
scenes['12'] = () => {
  let rows = '';
  for (let i = 0; i < 6; i++) { const y = 340 + i * 78, hot = i === 2; rows += rr(800, y, 240, 60, 12, hot ? C.gold : '#242a44') + circ(832, y + 30, 14, hot ? C.plum : '#3c4468') + rr(860, y + 16, hot ? 130 : 110 - i * 6, 10, 5, hot ? C.plum : '#4a5380') + rr(860, y + 36, 70, 8, 4, hot ? C.plum2 : '#323a60'); }
  let tk = ''; for (let i = 0; i < 4; i++) tk += `<path d="M1112 ${590 + i * 70} l14 16 l30 -34" stroke="${C.teal}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + rr(1180, 590 + i * 70 - 8, 90 - i * 8, 8, 4, '#b8ad98');
  return svg(`${circ(960, 460, 440, '#ffcf70', 'opacity=".12" filter="url(#glow)"')}<g transform="translate(0 -110)">
   <g transform="rotate(-6 1180 700)">${rr(1070, 500, 250, 330, 10, C.ivory)}${rr(1070, 500, 250, 40, 10, C.terra)}${tk}</g>
   ${rr(780, 220, 280, 640, 42, '#0a0c14')}${rr(794, 238, 252, 604, 30, '#171b2e')}${rr(900, 246, 60, 12, 6, '#0a0c14')}
   ${rr(812, 282, 216, 26, 8, '#323a60')}${rows}
   ${circ(1000, 372 + 156, 0, '#000')}<path d="M1012 394 l9 -18 l9 18 l-18 -12 h18 z" transform="translate(-6 156)" fill="${C.plum}"/>
   <g transform="rotate(-24 1200 820)">${rr(1120, 812, 190, 14, 6, C.gold)}<polygon points="1120,812 1120,826 1098,819" fill="#232842"/></g></g>`, 'url(#night)');
};
// ---- 13 the ending: one empty chair and a cup at golden hour
scenes['13'] = () => svg(`
   ${circ(960, 640, 300, '#fff3d6', 'opacity=".5" filter="url(#glow)"')}${circ(960, 640, 140, '#ffe9b0')}
   <rect x="0" y="720" width="${W}" height="360" fill="#2a1626"/>
   ${palm(380, 740, 1.2)}${palm(1560, 740, 1.1)}
   <polygon points="900,780 1020,780 1130,990 740,990" fill="#000" opacity=".35" filter="url(#soft)"/>
   ${chair(960, 780, 3.0, '#5a2a45', C.gold)}${cup(1200, 690, 90)}`, 'url(#golden)');

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, f] of Object.entries(scenes)) { await pg.setContent(`<body style="margin:0;background:#000">${f()}</body>`); await pg.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  await b.close();
})();
