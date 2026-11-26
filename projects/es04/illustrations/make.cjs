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
scenes['01'] = () => svg(`${circ(960, 700, 360, '#ffb26b', 'opacity=".32" filter="url(#glow)"')}${stars(40, 380)}${ground(760)}${iroko(960, 770, 1.0)}${rr(840, 700, 120, 90, 8, '#6b3f2a')}${rr(830, 692, 140, 16, 6, '#8a5636')}${redCap(900, 690, 0.9)}`, 'url(#sky)');
scenes['02'] = () => svg(`${rr(0, 0, 420, 900, 0, '#7a1620')}${rr(1500, 0, 420, 900, 0, '#7a1620')}${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * 70}" y="0" width="22" height="900" fill="#5d0f18" opacity=".6"/><rect x="${1500 + i * 70}" y="0" width="22" height="900" fill="#5d0f18" opacity=".6"/>`).join('')}
   ${rr(0, 0, W, 90, 0, '#5d0f18')}${rr(0, 800, W, 280, 0, '#5a3a22')}${[...Array(9)].map((_, i) => `<rect x="${i * 220}" y="800" width="4" height="280" fill="#3d2615" opacity=".6"/>`).join('')}
   <polygon points="880,60 1040,60 1260,820 660,820" fill="url(#beam)"/><ellipse cx="960" cy="820" rx="300" ry="40" fill="url(#pool)"/>${rr(900, 640, 120, 190, 8, '#8a5636')}<ellipse cx="960" cy="640" rx="60" ry="14" fill="#a8683d"/>`, 'url(#night)');
scenes['04'] = () => svg(`${circ(960, 480, 420, '#ffcf70', 'opacity=".16" filter="url(#glow)"')}${rr(0, 800, W, 280, 0, '#2a1626')}${rr(300, 770, 1320, 40, 8, '#6b3f2a')}
   ${rr(940, 520, 16, 260, 6, '#2b2b36')}${rr(900, 760, 96, 22, 6, '#2b2b36')}<ellipse cx="948" cy="400" rx="78" ry="118" fill="#c9a96e"/>${[...Array(7)].map((_, i) => `<rect x="${888 + i * 20}" y="${300 + (i % 2) * 6}" width="6" height="200" rx="3" fill="#6b5430" opacity=".7"/>`).join('')}<ellipse cx="930" cy="360" rx="22" ry="52" fill="#fff3d6" opacity=".35"/>
   ${rr(1200, 560, 360, 230, 14, '#3a3a48')}${circ(1290, 650, 62, '#14141c')}${circ(1290, 650, 62, 'none', 'stroke="#9aa0b8" stroke-width="6"')}${circ(1290, 650, 14, '#9aa0b8')}${circ(1460, 650, 62, '#14141c')}${circ(1460, 650, 62, 'none', 'stroke="#9aa0b8" stroke-width="6"')}${circ(1460, 650, 14, '#9aa0b8')}<path d="M1290 588 C1360 540 1400 540 1460 588" stroke="#c9a96e" stroke-width="4" fill="none"/>
   ${circ(500, 560, 34, '#ffd98a')}${rr(488, 600, 24, 170, 6, '#5a4a30')}`, 'url(#night)');
scenes['05'] = () => svg(`${circ(960, 470, 460, '#7fb8ff', 'opacity=".14" filter="url(#glow)"')}${rr(0, 820, W, 260, 0, '#1b1320')}
   ${rr(600, 220, 720, 560, 56, '#3b2a22')}${rr(640, 260, 580, 450, 44, '#0c1222')}<defs></defs>
   ${rr(640, 260, 580, 450, 44, 'url(#night)')}${circ(1060, 360, 64, '#fff3d6')}${circ(1030, 350, 8, '#e8dcc0', 'opacity=".5"')}
   ${[[760, 600], [880, 620], [1000, 596], [1120, 616]].map(([x, y]) => `<path d="M${x - 60} ${y + 70} L${x - 40} ${y} L${x} ${y - 40} L${x + 40} ${y} L${x + 60} ${y + 70} Z" fill="#05070e"/>`).join('')}${rr(640, 662, 580, 48, 0, '#05070e')}
   ${circ(1270, 330, 14, '#b8975a')}${circ(1270, 390, 14, '#b8975a')}${rr(860, 780, 200, 30, 6, '#2a1a12')}${rr(720, 810, 480, 22, 6, '#6b3f2a')}`, 'url(#night)');
scenes['07'] = () => svg(`${circ(960, 460, 400, '#ffcf70', 'opacity=".15" filter="url(#glow)"')}${rr(0, 800, W, 280, 0, '#1d1420')}
   <g transform="translate(960 560) rotate(-6)">${rr(-310, -70, 620, 330, 14, '#14141c')}${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-300 + i * 90}" y="-70" width="46" height="60" fill="#f2ebdd" transform="skewX(-20)"/>`).join('')}<g transform="translate(0 -120) rotate(-14)">${rr(-310, -30, 620, 60, 10, '#14141c')}${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-300 + i * 90}" y="-30" width="46" height="60" fill="#f2ebdd" transform="skewX(-20)"/>`).join('')}</g>${rr(-280, 20, 560, 8, 3, '#c9a96e')}${rr(-280, 90, 380, 8, 3, '#c9a96e')}${rr(-280, 150, 300, 8, 3, '#c9a96e')}</g>
   ${[[470, 760], [1450, 760]].map(([x, y]) => circ(x, y, 110, '#23232e') + circ(x, y, 110, 'none', 'stroke="#c9a96e" stroke-width="6"') + [0, 60, 120, 180, 240, 300].map((a) => circ(x + Math.cos(a * Math.PI / 180) * 62, y + Math.sin(a * Math.PI / 180) * 62, 22, '#14141c')).join('') + circ(x, y, 16, '#c9a96e')).join('')}`, 'url(#night)');
scenes['09'] = () => svg(`${rr(0, 0, W, H, 0, '#2a1626')}${[...Array(30)].map((_, i) => `<rect x="0" y="${760 + i * 11}" width="${W}" height="3" fill="#8a5c36" opacity="${0.18 + (i % 3) * 0.06}"/>`).join('')}${circ(960, 380, 440, '#ffcf70', 'opacity=".12" filter="url(#glow)"')}
   ${[...Array(31)].map((_, i) => { const h = 40 + Math.abs(Math.sin(i * 0.55) * 230) + (i % 3) * 18; return rr(640 + i * 21, 400 - h / 2, 13, h, 6, i % 2 ? '#e9c46a' : '#c9a96e'); }).join('')}
   ${[[760, 760], [840, 790]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="46" fill="#7a4a24" transform="rotate(-20 ${x} ${y})"/><path d="M${x - 8} ${y - 36} L${x + 6} ${y + 36} M${x + 8} ${y - 36} L${x + 22} ${y + 30}" stroke="#4a2c12" stroke-width="3" fill="none"/>`).join('')}${cup(1120, 700, 150)}`, 'url(#night)');
scenes['10'] = () => svg(`${circ(960, 480, 400, '#ffcf70', 'opacity=".16" filter="url(#glow)"')}${rr(0, 800, W, 280, 0, '#1d1420')}
   ${rr(620, 640, 680, 150, 40, '#6b1620')}${rr(640, 620, 640, 50, 24, '#8f1a28')}
   <rect x="900" y="150" width="40" height="300" fill="#12834f"/><rect x="940" y="150" width="40" height="300" fill="#f2ebdd"/><rect x="980" y="150" width="40" height="300" fill="#12834f"/><polygon points="900,450 920,500 940,450" fill="#12834f"/><polygon points="980,450 1000,500 1020,450" fill="#12834f"/>
   ${circ(960, 560, 110, '#e9c46a')}${circ(960, 560, 96, '#c9a65a')}<polygon points="960,490 977,540 1030,540 987,572 1003,622 960,590 917,622 933,572 890,540 943,540" fill="#12834f"/>
   ${rr(1330, 660, 90, 20, 4, '#c9a96e')}${rr(1360, 600, 30, 62, 4, '#d6b97a')}<path d="M1320 530 q0 70 55 70 q55 0 55 -70 z" fill="#e9c46a"/>`, 'url(#night)');
scenes['12'] = () => { const sil = (x, y, s) => `<g fill="#05070e">${circ(x, y, 44 * s)}<path d="M${x - 90 * s} ${y + 230 * s} C${x - 90 * s} ${y + 60 * s} ${x - 40 * s} ${y + 50 * s} ${x} ${y + 50 * s} C${x + 40 * s} ${y + 50 * s} ${x + 90 * s} ${y + 60 * s} ${x + 90 * s} ${y + 230 * s} Z"/></g>`; return svg(`${rr(500, 160, 920, 460, 30, '#161c34')}${rr(530, 190, 860, 400, 18, '#7fb8ff', 'opacity=".5"')}<polygon points="640,610 1280,610 1500,1080 420,1080" fill="#7fb8ff" opacity=".08"/>${circ(960, 400, 360, '#7fb8ff', 'opacity=".16" filter="url(#glow)"')}
   ${rr(420, 760, 1080, 300, 40, '#2a1f3a')}${sil(650, 640, 1.0)}${sil(790, 690, 0.8)}${sil(960, 620, 1.1)}${sil(1160, 680, 0.85)}${sil(1290, 650, 0.95)}`, 'url(#night)'); };
scenes['13'] = () => svg(`${rr(620, 120, 680, 640, 20, '#161c34')}${rr(650, 150, 620, 580, 8, '#2a3b6a', 'opacity=".6"')}${stars(24, 300)}${circ(960, 400, 340, '#ffb26b', 'opacity=".18" filter="url(#glow)"')}<rect x="950" y="150" width="20" height="580" fill="#161c34"/><rect x="650" y="430" width="620" height="20" fill="#161c34"/>
   ${rr(0, 800, W, 280, 0, '#1b1320')}<g fill="#05070e">${circ(960, 560, 60)}<path d="M820 800 C820 640 880 624 960 624 C1040 624 1100 640 1100 800 Z"/></g>${rr(900, 700, 120, 80, 6, '#f2ebdd', 'transform="rotate(-8 960 740)"')}<rect x="910" y="722" width="90" height="4" fill="#b8ad98" transform="rotate(-8 960 740)"/><rect x="910" y="738" width="70" height="4" fill="#b8ad98" transform="rotate(-8 960 740)"/>`, 'url(#night)');
scenes['14'] = () => svg(`${circ(960, 420, 420, '#ffcf70', 'opacity=".2" filter="url(#glow)"')}${rr(0, 800, W, 280, 0, '#1d1420')}${rr(0, 0, W, 800, 0, '#241a2e')}
   ${rr(1300, 160, 20, 560, 8, '#5a4a30')}<polygon points="1230,160 1390,160 1420,300 1200,300" fill="#e9c46a" opacity=".92"/>${rr(1250, 700, 120, 20, 6, '#5a4a30')}${circ(1310, 230, 160, '#ffcf70', 'opacity=".25" filter="url(#glow)"')}
   ${rr(620, 420, 560, 380, 70, '#6b1620')}${rr(580, 480, 80, 300, 40, '#8f1a28')}${rr(1140, 480, 80, 300, 40, '#8f1a28')}${rr(660, 420, 480, 140, 50, '#7a1822')}${rr(640, 760, 520, 60, 20, '#4a1018')}${redCap(1180, 460, 0.7)}
   ${rr(420, 340, 120, 160, 8, '#c9a96e')}${rr(430, 350, 100, 140, 4, '#3a2a18')}<line x1="480" y1="500" x2="520" y2="560" stroke="#c9a96e" stroke-width="8"/>`, 'url(#night)');
scenes['16'] = () => svg(`${stars(80, 560)}${circ(960, 800, 480, '#b5232a', 'opacity=".2" filter="url(#glow)"')}${ground(780, '#0a0710')}${iroko(960, 800, 1.1, '#07110d')}${[...Array(22)].map((_, i) => circ(300 + ((i * 337) % 1300), 520 + ((i * 131) % 300), 4, '#ffe27a', `opacity="${0.5 + (i % 3) * 0.2}" filter="url(#soft)"`)).join('')}`, 'url(#night)');
// the tribute card on the host's TV (1280x720)
const tvCard = `<!doctype html><meta charset=utf8><style>@font-face{font-family:B;src:url(data:font/ttf;base64,${FONT})}body{margin:0;width:1280px;height:720px;background:radial-gradient(circle at 50% 38%,#4a1a1f,#1a0f14 70%);font-family:B;color:#f2ebdd;overflow:hidden;position:relative;text-align:center}
.n{position:absolute;top:96px;left:0;right:0;font-size:100px;color:#e9c46a;text-shadow:4px 4px 0 #000;letter-spacing:2px}.d{position:absolute;top:300px;left:30px;width:440px;font-size:64px}.q{position:absolute;top:270px;right:30px;width:440px;font-size:64px;line-height:70px;color:#fff;font-style:italic}.c{position:absolute;top:18px;left:50%;margin-left:-60px}</style>
<svg class=c width=120 height=100 viewBox="-90 -80 180 130"><path d="M-80 30 C-80 -40 -40 -70 0 -70 C40 -70 80 -40 80 30 Z" fill="#b5232a"/><ellipse cx="0" cy="30" rx="80" ry="16" fill="#8f1a20"/><path d="M-70 10 q70 24 140 0" stroke="#e9c46a" stroke-width="7" fill="none"/><circle cx="0" cy="-70" r="9" fill="#e9c46a"/></svg>
<div class=n>CHIEF PETE EDOCHIE</div><div class=d>1947 – 2026</div><div class=q>An Iroko<br>Has Fallen</div>
<svg style="position:absolute;bottom:0;left:0" width=1280 height=150 viewBox="0 0 1280 150"><rect y="110" width="1280" height="40" fill="#0a0710"/><path d="M590 112 C600 70 604 40 600 10 L680 10 C676 40 680 70 690 112 Z" fill="#1d1410"/><circle cx="640" cy="0" r="70" fill="#0d1a14"/><circle cx="570" cy="10" r="48" fill="#0d1a14"/><circle cx="715" cy="8" r="50" fill="#0d1a14"/></svg>`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, f] of Object.entries(scenes)) { await pg.setContent(`<body style="margin:0;background:#000">${f()}</body>`); await pg.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  const cp = await b.newPage({ viewport: { width: 1280, height: 720 } }); await cp.setContent(tvCard); await cp.screenshot({ path: path.join(TVO, 'pete.png') }); console.log('tv card pete');
  await b.close();
})();
