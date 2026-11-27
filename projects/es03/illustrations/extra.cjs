// es03 pictures: our own flat illustrations (no real people, no stock photos). Run: node projects/es03/illustrations/make.cjs
// Writes projects/es03/img/NN.png (1920x1080). Key subject stays in the centre third so the 9:16 crop keeps it.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, '..', 'img'); fs.mkdirSync(OUT, { recursive: true });
const TVO = path.join(__dirname, '..', 'tv'); fs.mkdirSync(TVO, { recursive: true });
const FONT = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'toons', 'fonts', 'Caveat_Brush.ttf')).toString('base64');
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
scenes['c_cup'] = () => svg(`<polygon points="860,0 1060,0 1400,1080 520,1080" fill="url(#beam)"/><ellipse cx="960" cy="900" rx="420" ry="80" fill="url(#pool)"/>${cup(960, 430, 560)}`, 'url(#night)');
scenes['c_fail'] = () => svg(`${circ(960, 520, 500, '#3fc1b0', 'opacity=".1" filter="url(#glow)"')}${rr(360, 160, 1200, 760, 40, '#0a0c14')}${rr(400, 200, 1120, 680, 20, 'url(#screen)')}${[0, 1, 2].map((i) => rr(460, 250 + i * 70, 640 - i * 90, 30, 12, '#2e5560') + circ(1440, 265 + i * 70, 14, '#2e5560')).join('')}${rr(460, 700, 1000, 44, 22, '#0a1419')}${rr(460, 700, 620, 44, 22, '#3fc1b0')}${circ(1290, 470, 120, '#e5484d', 'opacity=".4" filter="url(#glow)"')}${circ(1290, 470, 92, '#e5484d')}<path d="M1250 430 L1330 510 M1330 430 L1250 510" stroke="#fff" stroke-width="22" stroke-linecap="round"/>${rr(260, 920, 1400, 60, 20, '#1a1f33')}`, 'url(#night)');
scenes['c_records'] = () => { const rec = (x, ok) => `${circ(x, 520, 270, '#0a0c14')}${[240, 200, 160].map((r) => circ(x, 520, r, 'none', 'stroke="#232842" stroke-width="3"')).join('')}${circ(x, 520, 80, ok ? '#c9a96e' : '#8a8f9a')}${circ(x, 520, 12, '#0a0c14')}${circ(x + 150, 790, 70, ok ? '#3fc1b0' : '#e5484d')}<path d="${ok ? `M${x + 118} 790 l24 28 l46 -58` : `M${x + 120} 760 l60 60 M${x + 180} 760 l-60 60`}" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; return svg(rec(600, false) + rec(1320, true), 'url(#night)'); };
const card = (a, b) => `<!doctype html><meta charset=utf8><style>@font-face{font-family:B;src:url(data:font/ttf;base64,${FONT})}body{margin:0;width:1280px;height:720px;background:radial-gradient(circle at 50% 35%,#6a2c4a,#1a1230 75%);font-family:B;color:#f2ebdd;overflow:hidden;position:relative;text-align:center}.n{position:absolute;top:70px;left:0;right:0;font-size:150px;color:#e9c46a;text-shadow:5px 5px 0 #000;letter-spacing:3px}.s{position:absolute;top:250px;left:0;right:0;font-size:64px}.b{position:absolute;top:24px;left:40px;background:#e9c46a;color:#14192B;font-size:40px;padding:6px 22px;border-radius:12px}</style><div class=b>VIRAL</div><div class=n>${a}</div><div class=s>${b}</div><svg style="position:absolute;bottom:0;left:0" width=1280 height=240 viewBox="0 0 1280 240"><g fill="#e9c46a" opacity=".9" transform="translate(120 60) scale(.9)"><ellipse cx="0" cy="130" rx="46" ry="34" transform="rotate(-20)"/><rect x="34" y="-40" width="14" height="170"/></g><g fill="#fff" opacity=".35" transform="translate(1000 40) scale(1.1)"><ellipse cx="0" cy="130" rx="46" ry="34" transform="rotate(-20)"/><ellipse cx="110" cy="110" rx="46" ry="34" transform="rotate(-20)"/><rect x="34" y="-40" width="14" height="170"/><rect x="144" y="-60" width="14" height="170"/></g></svg>`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, f] of Object.entries(scenes)) { await pg.setContent(`<body style="margin:0;background:#000">${f()}</body>`); await pg.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  const cp = await b.newPage({ viewport: { width: 1280, height: 720 } }); await cp.setContent(card('ONE SONG', 'Igbo wedding standoff')); await cp.screenshot({ path: path.join(TVO, 'bride.png') }); console.log('tv card bride');
  await b.close();
})();
