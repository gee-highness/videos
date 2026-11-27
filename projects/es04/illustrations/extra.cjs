// es04 pictures: our own flat illustrations (no real people, no stock photos). Run: node projects/es03/illustrations/make.cjs
// Writes projects/es04/img/NN.png (1920x1080). Key subject stays in the centre third so the 9:16 crop keeps it.
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


const redCap = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="86" ry="18" fill="#000" opacity=".3" filter="url(#soft)"/><path d="M-80 30 C-80 -40 -40 -70 0 -70 C40 -70 80 -40 80 30 Z" fill="#b5232a"/><ellipse cx="0" cy="30" rx="80" ry="16" fill="#8f1a20"/><path d="M-70 10 q70 24 140 0" stroke="#e9c46a" stroke-width="7" fill="none"/><path d="M-50 -34 q50 -26 100 0" stroke="#d95a5a" stroke-width="4" fill="none" opacity=".6"/><circle cx="0" cy="-70" r="9" fill="#e9c46a"/></g>`;
const ground = (y, col = '#150f1c') => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${col}"/>`;
const stars = (n, h) => [...Array(n)].map((_, i) => circ((i * 211) % W, (i * 97) % h, 1.5 + (i % 3), '#fff3d6', `opacity="${0.3 + (i % 4) * 0.15}"`)).join('');
const iroko = (x, y, s = 1, col = '#0d1a14') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 C-40 -120 -30 -260 -40 -380 L40 -380 C30 -260 40 -120 60 0 Z" fill="#1d1410"/><path d="M-60 0 q-50 14 -90 8 M60 0 q50 14 90 8" stroke="#1d1410" stroke-width="22" fill="none" stroke-linecap="round"/>${circ(0, -470, 200, col)}${circ(-170, -420, 140, col)}${circ(170, -430, 150, col)}${circ(-80, -580, 130, col)}${circ(110, -590, 120, col)}</g>`;

const scenes = {};
scenes['08'] = () => svg(`${[...Array(18)].map((_, i) => `<polygon points="960,640 ${960 + Math.cos(i * 0.349) * 1700},${640 + Math.sin(i * 0.349) * 1700} ${960 + Math.cos((i + 0.5) * 0.349) * 1700},${640 + Math.sin((i + 0.5) * 0.349) * 1700}" fill="#e9c46a" opacity="${i % 2 ? 0.04 : 0.1}"/>`).join('')}${stars(40, 520)}${ground(780)}${iroko(960, 800, 0.9, '#07110d')}${redCap(960, 780, 0.8)}`, 'url(#sky)');
scenes['c_lion'] = () => svg(`${circ(960, 520, 420, '#ffcf70', 'opacity=".18" filter="url(#glow)"')}${[...Array(16)].map((_, i) => `<ellipse cx="${960 + Math.cos(i * 0.3927) * 250}" cy="${520 + Math.sin(i * 0.3927) * 250}" rx="90" ry="150" transform="rotate(${i * 22.5 + 90} ${960 + Math.cos(i * 0.3927) * 250} ${520 + Math.sin(i * 0.3927) * 250})" fill="#b5782e"/>`).join('')}${circ(960, 520, 210, '#e9b25a')}${circ(890, 480, 24, '#2b1a10')}${circ(1030, 480, 24, '#2b1a10')}<path d="M930 580 q30 30 60 0 q-10 40 -30 40 q-20 0 -30 -40z" fill="#2b1a10"/><path d="M960 520 v50" stroke="#2b1a10" stroke-width="10"/>`, 'url(#night)');
scenes['c_trophy'] = () => svg(`${circ(960, 480, 420, '#ffcf70', 'opacity=".18" filter="url(#glow)"')}${rr(780, 800, 360, 70, 12, '#6b3f2a')}${rr(860, 700, 200, 110, 8, '#c9a96e')}<path d="M760 240 h400 v120 q0 220 -200 260 q-200 -40 -200 -260 z" fill="#e9c46a"/><path d="M760 280 q-120 10 -100 120 q20 90 130 100" fill="none" stroke="#e9c46a" stroke-width="30"/><path d="M1160 280 q120 10 100 120 q-20 90 -130 100" fill="none" stroke="#e9c46a" stroke-width="30"/><rect x="930" y="600" width="60" height="120" fill="#e9c46a"/><polygon points="960,330 984,400 1056,400 998,444 1018,516 960,472 902,516 922,444 864,400 936,400" fill="#12834f"/>`, 'url(#night)');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, f] of Object.entries(scenes)) { await pg.setContent(`<body style="margin:0;background:#000">${f()}</body>`); await pg.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  await b.close();
})();
