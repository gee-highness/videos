// es02 pictures: our own flat illustrations (no real people, no stock photos). Run: node projects/es03/illustrations/make.cjs
// Writes projects/es02/img/NN.png (1920x1080). Key subject stays in the centre third so the 9:16 crop keeps it.
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


const dawn = `<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2540"/><stop offset="0.5" stop-color="#7a5a76"/><stop offset="0.8" stop-color="#e9a36b"/><stop offset="1" stop-color="#f6d6a0"/></linearGradient>`;
const withDawn = (body, bg) => svg(body, bg).replace('</defs>', dawn + '</defs>');
const road = (y = 760) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="#23222e"/><rect x="0" y="${y}" width="${W}" height="14" fill="#3a3844"/>` + [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${i * 300 + 60}" y="${y + 170}" width="150" height="10" fill="#d8cfa8" opacity=".5"/>`).join('');
const gate = (x, y, w, h) => `${rr(x - 40, y - 60, 40, h + 60, 6, '#1a1a22')}${rr(x + w, y - 60, 40, h + 60, 6, '#1a1a22')}` + rr(x, y, w, h, 6, '#0f0f16') + [...Array(Math.floor(w / 36))].map((_, i) => `<rect x="${x + 18 + i * 36}" y="${y + 10}" width="8" height="${h - 20}" fill="#2c2c3a"/>`).join('') + `<rect x="${x}" y="${y + h * 0.42}" width="${w}" height="10" fill="#2c2c3a"/>` + circ(x + w + 20, y - 40, 22, '#e5484d', 'opacity=".35" filter="url(#glow)"') + circ(x + w + 20, y - 40, 9, '#e5484d');
const sack = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="62" rx="80" ry="14" fill="#000" opacity=".35" filter="url(#soft)"/><path d="M-70 60 C-84 -20 -40 -70 0 -70 C40 -70 84 -20 70 60 Z" fill="#c9c3b0"/><path d="M-26 -62 q26 -34 52 0" fill="#a39d8a"/><path d="M-30 -12 q30 24 60 0" stroke="#a39d8a" stroke-width="5" fill="none"/></g>`;
const trolley = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-120" width="240" height="140" rx="10" fill="#3b3f52" stroke="#9aa0b8" stroke-width="6"/>${[-80, -40, 0, 40, 80].map((i) => `<line x1="${i}" y1="-114" x2="${i}" y2="14" stroke="#9aa0b8" stroke-width="3"/>`).join('')}<line x1="-120" y1="-120" x2="-170" y2="-190" stroke="#9aa0b8" stroke-width="10" stroke-linecap="round"/>${circ(-80, 50, 28, '#14141c')}${circ(80, 50, 28, '#14141c')}${circ(-80, 50, 10, '#9aa0b8')}${circ(80, 50, 10, '#9aa0b8')}${sack(-10, -150, 0.8)}</g>`;
const bin = (x, y) => rr(x - 50, y - 130, 100, 130, 10, '#2f6b4f') + rr(x - 58, y - 148, 116, 24, 8, '#3f8a66') + circ(x - 30, y + 6, 12, '#14141c') + circ(x + 30, y + 6, 12, '#14141c');
const tree = (x, y, s) => `<rect x="${x - 14 * s}" y="${y - 300 * s}" width="${28 * s}" height="${300 * s}" fill="#241a1c"/>` + circ(x, y - 340 * s, 130 * s, '#1f3d34') + circ(x - 90 * s, y - 290 * s, 90 * s, '#245244') + circ(x + 90 * s, y - 300 * s, 95 * s, '#1b3a31');
const scenes = {};
scenes['01'] = () => withDawn(`${circ(960, 700, 260, '#ffd9a0', 'opacity=".5" filter="url(#glow)"')}${circ(960, 700, 120, '#ffe9c0')}${tree(300, 770, 1.2)}${tree(1620, 770, 1.3)}${road()}${gate(1180, 560, 360, 230)}${sack(760, 930, 1.2)}`, 'url(#dawn)');
scenes['02'] = () => withDawn(`${circ(960, 640, 220, '#ffd9a0', 'opacity=".4" filter="url(#glow)"')}${tree(420, 770, 1.4)}${tree(1500, 770, 1.1)}${road()}<rect x="0" y="740" width="${W}" height="40" fill="#4b4a58"/>${bin(1230, 770)}${trolley(900, 880, 1.2)}`, 'url(#dawn)');
scenes['03'] = () => withDawn(`${circ(960, 700, 240, '#ffd9a0', 'opacity=".45" filter="url(#glow)"')}${tree(260, 770, 1.1)}${road()}<polygon points="760,930 1500,1000 1500,1040 700,970" fill="#000" opacity=".25" filter="url(#soft)"/>${sack(900, 940, 1.3)}`, 'url(#dawn)');
scenes['04'] = () => withDawn(`${circ(960, 600, 240, '#ffd9a0', 'opacity=".35" filter="url(#glow)"')}${rr(0, 720, W, 360, 0, '#1b1a24')}${rr(380, 300, 1160, 520, 14, '#12121a')}${gate(520, 360, 880, 420)}<rect x="1420" y="320" width="26" height="60" fill="#2c2c3a"/>${circ(1433, 336, 16, '#e5484d', 'opacity=".4" filter="url(#glow)"')}${circ(1433, 336, 7, '#e5484d')}`, 'url(#dawn)');
scenes['06'] = () => withDawn(`${circ(960, 660, 220, '#ffd9a0', 'opacity=".4" filter="url(#glow)"')}${tree(300, 770, 1.1)}${road()}${gate(1300, 600, 320, 190)}<rect x="0" y="740" width="${W}" height="40" fill="#4b4a58"/>${bin(760, 770)}${sack(920, 760, 0.9)}${sack(1040, 764, 0.8)}${trolley(520, 920, 0.9)}`, 'url(#dawn)');
scenes['08'] = () => svg(`${rr(0, 760, W, 320, 0, '#1a1622')}${rr(300, 560, 1320, 70, 10, '#3a2a30')}${rr(340, 630, 1240, 330, 6, '#2a1f28')}
   ${circ(960, 420, 360, '#ffcf70', 'opacity=".14" filter="url(#glow)"')}<polygon points="920,330 1000,330 1040,460 880,460" fill="#5c4a30"/>${rr(956, 460, 8, 110, 3, '#8a7a50')}${circ(960, 330, 18, '#ffcf70')}
   ${rr(620, 505, 340, 56, 6, '#e9e2cc')}${rr(640, 478, 300, 30, 4, '#d6cfb6')}${rr(1100, 520, 220, 42, 6, '#c9a96e')}${rr(1112, 490, 196, 32, 4, '#b8975a')}
   ${circ(1500, 330, 90, '#f2ebdd')}${circ(1500, 330, 80, '#14192B')}<line x1="1500" y1="330" x2="1500" y2="270" stroke="#f2ebdd" stroke-width="6"/><line x1="1500" y1="330" x2="1550" y2="350" stroke="#f2ebdd" stroke-width="6"/>`, 'url(#night)');
const tvWall = (screenInner = '') => `<rect x="0" y="0" width="${W}" height="${H}" fill="#a9bdb4"/><rect x="0" y="880" width="${W}" height="200" fill="#c9a679"/>${rr(560, 260, 800, 460, 8, '#0d0d10')}${rr(574, 274, 772, 432, 4, screenInner || 'url(#tvgrad)')}${rr(720, 750, 480, 30, 6, '#1a1a1e')}${rr(520, 800, 880, 120, 8, '#5a3a2a')}${rr(780, 210, 360, 26, 4, '#b79a6a')}${rr(800, 168, 120, 42, 3, '#c9704f')}${rr(805, 150, 110, 20, 3, '#2f5d62')}`;
const tvgrad = `<linearGradient id="tvgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0742f"/><stop offset="1" stop-color="#3B1E2E"/></linearGradient>`;
scenes['10'] = () => svg(tvWall(), '#a9bdb4').replace('</defs>', tvgrad + '</defs>');
scenes['14'] = () => { const coins = [...Array(14)].map((_, i) => circ(790 + (i % 5) * 62 + (i % 2) * 14, 600 - Math.floor(i / 5) * 40, 26, i % 3 ? '#ffd166' : '#e8e0c0')).join(''); return svg(tvWall('#12182b') + rr(830, 330, 260, 340, 36, '#e8f6fb', 'opacity=".9"') + coins.replace(/\d+\.?\d*/, (m) => m) + rr(850, 290, 220, 50, 12, '#8a5a3b'), '#a9bdb4').replace('</defs>', tvgrad + '</defs>'); };
scenes['12'] = () => svg(`${rr(0, 800, W, 280, 0, '#1a1318')}${rr(560, 140, 800, 700, 14, '#4b2f22')}${rr(590, 170, 340, 640, 8, '#5f3c2b')}${rr(990, 170, 340, 640, 8, '#5f3c2b')}${circ(900, 500, 16, '#c9a96e')}${circ(1020, 500, 16, '#c9a96e')}
   ${circ(960, 70, 260, '#ffcf70', 'opacity=".14" filter="url(#glow)"')}
   <g transform="translate(960 880)"><rect x="-260" y="-20" width="520" height="40" rx="8" fill="#5a3a2a"/><rect x="-6" y="-300" width="12" height="290" fill="#c9a96e"/><rect x="-170" y="-310" width="340" height="12" rx="6" fill="#c9a96e"/><path d="M-170 -298 l-50 120 h100 z" fill="#d6b97a"/><path d="M170 -298 l-50 120 h100 z" fill="#d6b97a"/><ellipse cx="0" cy="-20" rx="60" ry="10" fill="#c9a96e"/></g>`, 'url(#night)');
scenes['16'] = () => svg(`${circ(960, 520, 440, '#ffcf70', 'opacity=".12" filter="url(#glow)"')}${rr(1000, 560, 300, 300, 20, '#2a1f28')}${rr(1060, 600, 180, 28, 6, '#c9a96e')}
   ${rr(700, 190, 380, 680, 50, '#0a0c14')}${rr(716, 208, 348, 644, 36, '#171b2e')}${rr(820, 218, 140, 14, 7, '#0a0c14')}${rr(740, 300, 300, 70, 14, '#323a60')}
   ${rr(740, 440, 300, 28, 14, '#0f1426')}${rr(740, 440, 236, 28, 14, '#7fe0a0')}${circ(890, 600, 62, '#ffd166')}${circ(890, 600, 46, '#e0a82e')}
   ${rr(760, 730, 260, 60, 14, '#c9a96e')}`, 'url(#night)');
// series cards (16:9, drawn for the TV and the clip title shots)
const card = (ep, name, extra) => `<!doctype html><meta charset=utf8><style>@font-face{font-family:B;src:url(data:font/ttf;base64,${FONT})}body{margin:0;width:1280px;height:720px;background:linear-gradient(160deg,#ff9a4d,#e0742f 55%,#8a2f1c);font-family:B;overflow:hidden;position:relative}
.h{position:absolute;bottom:0;left:0;right:0;height:260px}.t{position:absolute;top:70px;left:0;right:0;text-align:center;font-size:132px;color:#fff7c2;text-shadow:6px 6px 0 #16130f;letter-spacing:2px}.s{position:absolute;top:240px;left:0;right:0;text-align:center;font-size:60px;color:#16130f}.e{position:absolute;top:330px;left:90px;right:90px;text-align:center;font-size:88px;color:#fff;text-shadow:5px 5px 0 #16130f}
.b{position:absolute;top:34px;left:40px;background:#16130f;color:#ffd166;font-size:40px;padding:6px 22px;border-radius:12px}</style>
<div class=b>TONIGHT</div><div class=t>THE NEIGHBOURHOOD</div><div class=s>${ep}</div><div class=e>${name}</div>
<svg class=h viewBox="0 0 1280 260"><rect width="1280" height="260" fill="#16130f" opacity=".92"/>${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${60 + i * 250} 80)"><rect width="170" height="140" fill="#f2c9a0" stroke="#16130f" stroke-width="5"/><path d="M-14 0 L85 -70 L184 0 Z" fill="#b5523b" stroke="#16130f" stroke-width="5"/><rect x="66" y="70" width="38" height="70" fill="#8a5a3b"/><rect x="18" y="30" width="34" height="34" fill="#fff7c2"/><rect x="118" y="30" width="34" height="34" fill="#fff7c2"/></g>`).join('')}</svg>${extra || ''}`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, f] of Object.entries(scenes)) { await pg.setContent(`<body style="margin:0;background:#000">${f()}</body>`); await pg.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  const cards = { 'series': ['a cartoon series', 'Gate Street'], 'ep1': ['Episode 1', 'Gate Talk'], 'ep2': ['Episode 2', 'The Jar'] };
  const cp = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const [k, [ep, name]] of Object.entries(cards)) { await cp.setContent(card(ep, name)); await cp.screenshot({ path: path.join(TVO, k + '.png') }); console.log('tv card', k); }
  // the two series title shots (11, 15) are these cards at 1920x1080
  const big = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  for (const [id, k] of [['11', 'ep1'], ['15', 'ep2']]) { await big.setContent(card(cards[k][0], cards[k][1])); await big.screenshot({ path: path.join(OUT, id + '.png') }); console.log('wrote', id); }
  await b.close();
})();
