/* Ink-cartoon drawing kit (runs in the browser page that engine.cjs opens).
   Everything returns SVG markup; a scene is a pure function of time, so any frame can be rendered alone. */
const W = 1080, H = 1920, INK = '#16130f', PAPER = '#f4f0e6';
let BRAND = '#2E8B57';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = (p) => p * p * (3 - 2 * p);
const pop = (p) => { p = clamp(p); return p === 0 ? 0 : 1 + Math.sin(p * Math.PI) * 0.18 * (1 - p) - Math.pow(1 - p, 3); };
const lerp = (a, b, p) => a + (b - a) * p;
const wig = (t, f = 1, a = 1, ph = 0) => Math.sin(t * f * 6.283 + ph) * a;
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const st = (o = {}) => `fill="${o.fill ?? PAPER}" stroke="${o.stroke ?? INK}" stroke-width="${o.w ?? 7}" stroke-linecap="round" stroke-linejoin="round"`;
const ln = (o = {}) => st({ fill: 'none', ...o });
const path = (d, o) => `<path d="${d}" ${st(o)}/>`;
const line = (d, o) => `<path d="${d}" ${ln(o)}/>`;
const rect = (x, y, w, h, r = 0, o) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${st(o)}/>`;
const circ = (x, y, r, o) => `<circle cx="${x}" cy="${y}" r="${r}" ${st(o)}/>`;
const grp = (inner, x = 0, y = 0, s = 1, rot = 0, sy) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s},${sy ?? s})">${inner}</g>`;
const HAND = 'Kalam', BRUSH = 'Caveat Brush';
function text(x, y, str, o = {}) {
  const lines = String(str).split('\n'), size = o.size ?? 48, lh = o.lh ?? size * 1.08;
  return `<text x="${x}" y="${y}" font-family="${o.font ?? HAND}" font-size="${size}" font-weight="${o.weight ?? 700}" text-anchor="${o.anchor ?? 'middle'}" fill="${o.fill ?? INK}" ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''}>` +
    lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${hl(l, o.accent)}</tspan>`).join('') + '</text>';
}
// *word* is drawn in the brand colour
function hl(s, accent) { return esc(s).replace(/\*([^*]+)\*/g, (_, m) => `<tspan fill="${accent ?? BRAND}">${m}</tspan>`); }

// speech bubble: p is the pop-in progress, tail is 'l', 'r' or '' (points down)
function bubble(x, y, w, h, str, o = {}) {
  const p = pop(o.p ?? 1); if (p <= 0) return '';
  const hw = w / 2, hh = h / 2, tx = o.tail === 'l' ? -hw * 0.45 : hw * 0.45;
  const tail = o.tail ? `M${tx - 22},${hh - 4} L${tx + (o.tail === 'l' ? -30 : 30)},${hh + 46} L${tx + 22},${hh - 4}` : '';
  const size = o.size ?? 54, n = String(str).split('\n').length;
  return grp(rect(-hw, -hh, w, h, Math.min(hh, 46), { fill: o.fill ?? '#fff', w: 6 }) +
    (tail ? path(tail, { fill: o.fill ?? '#fff', w: 6 }) + `<path d="M${tx - 19},${hh - 6} L${tx + 19},${hh - 6}" stroke="${o.fill ?? '#fff'}" stroke-width="9"/>` : '') +
    text(0, size * 0.34 - (n - 1) * size * 0.54, str, { size, fill: o.ink ?? INK }), x, y, p, o.rot ?? 0);
}

/* A person, waist up. Local units: head radius about 60, shoulders at y=120, waist at y=330. */
function person(o) {
  const { x, y, s = 1, flip = 1, tilt = 0, hair = 'short', eyes = 'open', brow = '', mouth = 'smile', look = [0, 0],
    body = 'tee', glasses = false, earrings = false, tk = 0 } = o;
  const sh = [88, 124];
  const arm = (side, a) => {
    a = a || { e: [108, 225], h: [98, 318] };
    const d = `M${side * sh[0]},${sh[1]} Q${side * a.e[0]},${a.e[1]} ${side * a.h[0]},${a.h[1]}`;
    return line(d, { w: 40 }) + line(d, { w: 30, stroke: PAPER }) + circ(side * a.h[0], a.h[1], 19, { w: 5 }) + (a.hold ? grp(a.hold, side * a.h[0], a.h[1]) : '');
  };
  let g = '';
  if (!o.headOnly) {
  if (o.armBack) g += arm(o.armBack === 'L' ? -1 : 1, o.armBack === 'L' ? o.armL : o.armR);
  g += path('M-104,340 L-94,132 C-92,92 -46,74 0,74 C46,74 92,92 94,132 L104,340', { w: 5 });
  if (body === 'apron') g += path('M-58,340 L-56,176 L56,176 L58,340', { w: 5, fill: '#fff' }) + line('M-56,176 L-30,80 M56,176 L30,80 M-28,250 h56 v50 h-56 z', { w: 5 });
  if (body === 'suit') g += path('M-34,76 L0,150 L34,76', { w: 5, fill: '#fff' }) + line('M-34,76 L-52,150 L0,210 L52,150 L34,76 M0,210 V340', { w: 5 }) + path('M-10,150 L0,138 L10,150 L6,196 L0,206 L-6,196 Z', { w: 4, fill: INK });
  if (body === 'tee') g += line('M-30,78 Q0,104 30,78', { w: 5 });
  if (body === 'uniform') g += path('M-36,76 L-6,112 L-22,124 Z M36,76 L6,112 L22,124 Z', { w: 4, fill: '#fff' }) + path('M-10,108 L10,108 L14,128 L0,240 L-14,128 Z', { w: 4, fill: BRAND }) + line('M-96,200 h40 M56,200 h40', { w: 4 });
  if (body === 'blazer') g += line('M-30,76 L0,186 L30,76 M0,186 V340 M-30,76 L-58,128 L-14,150 M30,76 L58,128 L14,150', { w: 5 }) + circ(0, 240, 5, { fill: INK, w: 2 });
  if (o.armBack !== 'L') g += arm(-1, o.armL);
  if (o.armBack !== 'R') g += arm(1, o.armR);
  }
  // head
  let h = circ(-61, 4, 11, { w: 5 }) + circ(61, 4, 11, { w: 5 });
  if (earrings) h += circ(-63, 26, 7, { w: 4, fill: 'none' }) + circ(63, 26, 7, { w: 4, fill: 'none' });
  h += path('M-60,0 C-60,-80 60,-80 60,0 C60,60 32,76 0,76 C-32,76 -60,60 -60,0Z', { w: 5 });
  if (hair === 'short') h += path('M-62,-8 C-70,-92 70,-92 62,-8 C44,-52 -44,-52 -62,-8Z', { w: 5, fill: INK });
  if (hair === 'afro') { let d = 'M-64,-4'; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 + i / 8), r = 86; d += ` Q${Math.cos(a - 0.2) * (r + 26)},${Math.sin(a - 0.2) * (r + 26) - 8} ${Math.cos(a) * r},${Math.sin(a) * r - 8}`; } h += path(d + ' L64,-4 C40,-46 -40,-46 -64,-4Z', { w: 5, fill: INK }); }
  if (hair === 'puff') h += circ(0, -96, 44, { w: 5, fill: INK }) + path('M-62,-8 C-70,-84 70,-84 62,-8 C44,-50 -44,-50 -62,-8Z', { w: 5, fill: INK });
  if (hair === 'wrap') h += path('M-68,-10 C-88,-96 -24,-128 8,-120 C64,-122 90,-62 66,-10 C34,-44 -34,-44 -68,-10Z', { w: 5, fill: '#fff' }) +
    line('M-40,-104 C-10,-84 20,-60 52,-34 M-62,-70 C-30,-64 0,-50 22,-36 M4,-118 C24,-100 44,-84 66,-60', { w: 4 }) +
    path('M40,-112 C52,-150 92,-146 84,-112 C110,-124 122,-90 92,-84 C70,-80 48,-92 40,-112Z', { w: 5, fill: '#fff' });
  if (hair === 'chef') h += path('M-58,-50 C-104,-104 -62,-176 -12,-152 C12,-196 86,-172 62,-128 C104,-110 84,-62 58,-50 Z', { w: 5, fill: '#fff' }) + rect(-60, -76, 120, 32, 6, { w: 5, fill: '#fff' }) + line('M-30,-140 q6,30 2,62 M22,-146 q-4,34 -2,68', { w: 4 });
  if (hair === 'cap') h += path('M-64,-32 C-66,-104 66,-104 64,-32 Z', { w: 5, fill: '#fff' }) + path('M-64,-32 L64,-32 C100,-32 120,-26 124,-16 L-62,-20 Z', { w: 5, fill: INK });
  const lx = look[0], ly = look[1], ey = -8;
  const eye = (sx, kind) => {
    const cx = sx * 23;
    if (kind === 'closed') return line(`M${cx - 10},${ey} q10,9 20,0`, { w: 5 });
    if (kind === 'happy') return line(`M${cx - 10},${ey + 3} q10,-12 20,0`, { w: 5 });
    if (kind === 'half') return line(`M${cx - 11},${ey} h22`, { w: 5 }) + circ(cx + lx, ey + 5, 4, { fill: INK, w: 1 });
    if (kind === 'wide') return circ(cx, ey, 14, { w: 4, fill: '#fff' }) + circ(cx + lx, ey + ly, 5, { fill: INK, w: 1 });
    return circ(cx + lx, ey + ly, 6, { fill: INK, w: 1 });
  };
  const [eL, eR] = Array.isArray(eyes) ? eyes : [eyes, eyes];
  h += eye(-1, eL) + eye(1, eR);
  if (glasses) h += circ(-23, ey, 19, { w: 4, fill: 'none' }) + circ(23, ey, 19, { w: 4, fill: 'none' }) + line(`M-4,${ey} h8`, { w: 4 });
  if (brow === 'angry') h += line('M-38,-36 L-12,-26 M38,-36 L12,-26', { w: 5 });
  if (brow === 'sad') h += line('M-38,-28 L-12,-38 M38,-28 L12,-38', { w: 5 });
  if (brow === 'up') h += line('M-36,-38 q12,-10 24,-2 M12,-40 q12,-8 24,2', { w: 5 });
  if (brow === 'one') h += line('M-38,-30 h26 M12,-44 q12,-8 24,2', { w: 5 });
  h += line('M2,6 q8,12 -3,16', { w: 4 });
  if (o.moustache) h += path('M-28,30 Q-13,16 0,27 Q13,16 28,30 Q13,40 0,33 Q-13,40 -28,30Z', { w: 3, fill: INK });
  const my = 42;
  if (mouth === 'smile') h += line(`M-20,${my - 6} Q0,${my + 14} 20,${my - 6}`, { w: 5 });
  if (mouth === 'grin') h += path(`M-24,${my - 8} Q0,${my + 26} 24,${my - 8} Z`, { w: 5, fill: '#fff' });
  if (mouth === 'flat') h += line(`M-15,${my} h30`, { w: 5 });
  if (mouth === 'wavy') h += line(`M-20,${my} q5,-8 10,0 t10,0 t10,0 t10,0`, { w: 5 });
  if (mouth === 'frown') h += line(`M-18,${my + 8} Q0,${my - 10} 18,${my + 8}`, { w: 5 });
  if (mouth === 'o') h += `<ellipse cx="0" cy="${my + 2}" rx="10" ry="13" ${st({ fill: INK, w: 3 })}/>`;
  if (mouth === 'talk') h += `<ellipse cx="0" cy="${my + 1}" rx="${15 - tk * 3}" ry="${3 + tk * 12}" ${st({ fill: INK, w: 3 })}/>`;
  if (mouth === 'yawn') h += `<ellipse cx="0" cy="${my + 4}" rx="17" ry="22" ${st({ fill: INK, w: 3 })}/>`;
  if (o.sweat) h += path('M74,-40 q10,18 0,24 q-10,-6 0,-24Z', { w: 4, fill: '#fff' });
  g += grp(h, 0, 0, 1, tilt);
  return grp(g, x, y, s * flip, 0, s);
}
// lip-flap value for a talking mouth
const flap = (t) => 0.5 + 0.5 * Math.sin(t * 22) * Math.sin(t * 7.3 + 1);
const blink = (t, off = 0) => ((t + off) % 3.1) < 0.14;

// a phone outline with a screen; inner is drawn in screen coordinates (0..w, 0..h)
function phone(x, y, w, h, inner = '', o = {}) {
  return grp(rect(-14, -14, w + 28, h + 28, 46, { w: o.w ?? 8, fill: o.body ?? INK }) + rect(0, 0, w, h, 30, { w: 3, fill: o.screen ?? '#fff' }) +
    `<clipPath id="ph${o.id ?? 0}"><rect x="0" y="0" width="${w}" height="${h}" rx="30"/></clipPath><g clip-path="url(#ph${o.id ?? 0})">${inner}</g>`, x, y, o.s ?? 1, o.rot ?? 0);
}
// a drawing of a QR code (not scannable; the real one is in the app)
function qr(x, y, size, col = INK) {
  const n = 11, c = size / n; let s = rect(-c, -c, size + 2 * c, size + 2 * c, 8, { fill: '#fff', w: 5 });
  const finder = (i, j) => (i < 3 && j < 3) || (i > n - 4 && j < 3) || (i < 3 && j > n - 4);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (!finder(i, j) && rnd(i * 31 + j * 7) > 0.5) s +=`<rect x="${i * c}" y="${j * c}" width="${c + 0.5}" height="${c + 0.5}" fill="${col}"/>`;
  }
  for (const [i, j] of [[0, 0], [n - 3, 0], [0, n - 3]]) s += `<rect x="${i * c}" y="${j * c}" width="${3 * c}" height="${3 * c}" fill="${col}"/><rect x="${(i + 0.6) * c}" y="${(j + 0.6) * c}" width="${1.8 * c}" height="${1.8 * c}" fill="#fff"/><rect x="${(i + 1) * c}" y="${(j + 1) * c}" width="${c}" height="${c}" fill="${col}"/>`;
  return grp(s, x, y);
}
function cake(x, y, s = 1) {
  return grp(path('M-70,0 h140 v-56 q-70,-22 -140,0 z', { w: 5, fill: '#fff' }) + line('M-70,-34 q18,22 35,0 t35,0 t35,0 t35,0', { w: 5 }) +
    circ(0, -80, 11, { fill: INK, w: 3 }) + line('M0,-90 q6,-14 14,-16', { w: 4 }) + line('M-96,0 h192 M0,0 v44 M-50,46 h100', { w: 6 }), x, y, s);
}
const star = (x, y, r, o) => { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * 0.72 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); } return grp(path(d + 'Z', o), x, y); };

/* Frame: paper, boiling line art, steadier lettering, caption, brand strip, progress bar. */
function frame(ep, t) {
  BRAND = ep.brand;
  const sc = ep.scenes.find((s) => t >= s.from && t < s.to) || ep.scenes[ep.scenes.length - 1];
  const rel = (i) => ep.voice[i].at - sc.from; // start of voice line i, in this scene's own time
  rel.end = (i) => rel(i) + ep.voice[i].d;
  rel.on = (i, tt) => tt >= rel(i) && tt < rel.end(i);
  const out = sc.draw(t - sc.from, t, sc.to - sc.from, rel);
  const art = typeof out === 'string' ? out : out.art, ui = typeof out === 'string' ? '' : out.ui || '';
  const seed = Math.floor(t * 5) % 40 + 1;
  const cap = ep.captions.find((c) => t >= c.from && t < c.to);
  let capS = '';
  if (cap && !sc.noCaption) {
    const lines = cap.text.split('\n'), size = 78, lh = 86, w = Math.min(1000, Math.max(...lines.map((l) => l.replace(/\*/g, '').length)) * 35 + 110), h = lines.length * lh + 44;
    const p = pop(prog(t, cap.from, cap.from + 0.25)), cy = 1560;
    capS = grp(rect(-w / 2, -h / 2, w, h, 26, { fill: INK, w: 0 }) + text(0, -h / 2 + 22 + 62, cap.text, { font: BRUSH, size, lh, fill: '#fff', weight: 400, accent: ep.accentOnInk }), 540, cy, p, -1.2);
  }
  const ST = STYLES[ep.style || 'ink'] || STYLES.ink, re = (svg) => restyle(svg, ST, ep);
  const strip = sc.noStrip ? '' : `<image href="${ep.logo}" x="372" y="1752" width="64" height="64"/>` + re(text(452, 1800, ep.url, { size: 40, anchor: 'start', font: BRUSH, weight: 400 }));
  const bar = `<rect x="0" y="1908" width="${W * t / ep.dur}" height="12" fill="${ep.brand}"/>`;
  const inner = (g) => ST.glow ? `<g filter="url(#glow)">${g}</g>` : ST.shadow ? `<g filter="url(#shadow)">${g}</g>` : g;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<filter id="b1" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feTurbulence type="fractalNoise" baseFrequency="${ST.boilFreq ?? 0.02}" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${ST.boil ?? 9}" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="b2" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${ST.boilUi ?? 3.5}" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="${ST.grainFreq ?? 0.9}" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 ${ST.grainTone ?? 0}  0 0 0 0 ${ST.grainTone ?? 0}  0 0 0 0 ${ST.grainTone ?? 0}  0 0 0 ${ST.grain ?? 0.07} 0"/></filter>
<filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="shadow" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feDropShadow dx="7" dy="9" stdDeviation="2" flood-color="#3b2a14" flood-opacity="0.38"/></filter>
<radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="0.55" stop-color="${ST.paper}"/><stop offset="1" stop-color="${ST.edge}"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#vig)"/>${ST.backdrop ? ST.backdrop() : ''}<rect width="${W}" height="${H}" filter="url(#grain)"/>
<g filter="url(#b1)">${inner(re(art))}</g><g filter="url(#b2)">${inner(re(ui))}${capS}</g>${strip}${bar}</svg>`;
}

/* ---- Art styles ----
   Every drawing is made with the same few colours (INK lines, white fills, PAPER fills); a style swaps them, changes the paper,
   the line wobble and the texture, and can add a glow or a paper shadow. Add a style by adding an entry here (see the skill's styles reference). */
const STYLES = {
  ink: { name: 'Ink on paper', paper: PAPER, edge: '#d9d2c0' },
  chalk: { name: 'Chalkboard', dark: true, paper: '#2c302f', edge: '#181b1a', ink: '#f2efe4', inkFill: '#f2efe4', light: '#353a39', paperFill: '#4a504e', lightStroke: '#f2efe4', boil: 11, boilFreq: 0.035, grain: 0.22, grainTone: 1, grainFreq: 1.4, scale: 1.1 },
  neon: { name: 'Neon night', dark: true, paper: '#151128', edge: '#07050f', ink: '#f6f2ff', inkFill: '#f6f2ff', light: '#1d1838', paperFill: '#2a2350', lightStroke: '#f6f2ff', boil: 4, grain: 0.05, grainTone: 1, glow: true, scale: 0.9 },
  cutout: { name: 'Cut paper', paper: '#d8b98a', edge: '#b89260', ink: '#3a2a1a', inkFill: '#3a2a1a', light: '#fff8ea', paperFill: '#f3dcb2', boil: 2.5, grain: 0.12, grainFreq: 0.6, shadow: true, scale: 0.85 },
  signpaint: { name: 'Hand-painted sign', paper: '#f6c84a', edge: '#e2a72a', ink: '#1b1712', inkFill: '#1b1712', light: '#fffdf4', paperFill: '#ffe7a6', boil: 1.5, boilUi: 1, grain: 0.1, scale: 1.45,
    backdrop: () => `<rect x="0" y="1380" width="1080" height="540" fill="#e9a53a" opacity="0.35"/>` },
};
function restyle(svg, S, ep) {
  if (!S || !S.ink) return svg; // the ink style is the drawing as made
  // light tints used for floors, sand, notes and soft bubbles become the style's paper colour (brand colours are never light enough to match)
  svg = svg.replace(/fill="#([0-9a-fA-F]{6})"/g, (m, h) => {
    const c = h.toLowerCase(); if (c === 'ffffff' || c === 'f4f0e6') return m;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255), lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.72 ? `fill="${S.paperFill}"` : m;
  });
  // on dark papers the highlighted words use the brand's light accent so they stay readable
  if (S.dark && ep && ep.accentOnInk) svg = svg.split(`<tspan fill="${ep.brand}">`).join(`<tspan fill="${ep.accentOnInk}">`);
  return svg.replace(/stroke="#16130f"/g, `stroke="${S.ink}"`).replace(/fill="#16130f"/g, `fill="${S.inkFill}"`).replace(/fill="#fff"/g, `fill="${S.light}"`)
    .replace(/stroke="#fff"/g, `stroke="${S.lightStroke || '#fff'}"`).replace(/fill="#f4f0e6"/g, `fill="${S.paperFill}"`)
    .replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${(+w * (S.scale || 1)).toFixed(2)}"`);
}

/* The shared "Small Business News" desk. o: { good (bool), pip (markup drawn in the picture box 560..1000 x 480..880), ticker } */
function newsDesk(t, o) {
  const art = rect(60, 210, 960, 140, 14, { fill: INK }) + rect(560, 480, 440, 400, 16, { fill: '#fff', w: 8 }) + o.pip +
    person({ x: 300, y: 800, s: 1.7, hair: 'puff', body: 'blazer', glasses: true, earrings: true, mouth: o.talking === false ? 'flat' : 'talk', tk: flap(t), eyes: blink(t) ? 'closed' : 'open', brow: o.good ? 'up' : 'one', look: [3, 0], tilt: wig(t, 0.5, 2),
      armL: { e: [120, 215], h: [40, 222] }, armR: { e: [120, 215], h: [40, 222] } }) +
    rect(-20, 1180, 1120, 120, 0) + grp(rect(-80, -60, 160, 110, 4, { fill: '#fff', w: 5 }) + line('M-54,-30 h108 M-54,-6 h108 M-54,18 h70', { w: 4 }), 300, 1175, 1, -4) +
    grp(rect(-34, -70, 68, 70, 8, { fill: '#fff', w: 5 }) + line('M34,-56 q34,4 0,36', { w: 5 }), 640, 1180) + rect(-20, 1296, 1120, 92, 0, { fill: INK });
  const ui = text(540, 308, o.title || 'SMALL BUSINESS NEWS', { font: BRUSH, size: 96, weight: 400, fill: '#fff' }) +
    rect(70, 400, 300, 76, 10, { fill: '#fff', w: 5 }) + circ(110, 438, 13, { fill: Math.floor(t * 2) % 2 ? INK : '#fff', w: 4 }) + text(140, 456, o.good ? 'GOOD NEWS' : 'BREAKING', { size: 40, anchor: 'start' }) +
    tickerText(t, o.ticker);
  return { art, ui };
}
// a screen in a frame: tablet, monitor (stand) or laptop (base); inner is drawn in 0..w, 0..h
function screen(x, y, w, h, inner, o = {}) {
  const p = o.p ?? 1; if (p <= 0) return '';
  const extra = o.kind === 'laptop' ? path(`M-30,${h + 14} H${w + 30} L${w + 60},${h + 62} H-60 Z`, { fill: '#fff', w: 6 }) : o.kind === 'monitor' ? path(`M${w / 2 - 30},${h + 12} v50 h-70 v22 h200 v-22 h-70 v-50`, { fill: '#fff', w: 6 }) : '';
  return grp(grp(extra + rect(-12, -12, w + 24, h + 24, 22, { fill: INK, w: 6 }) + rect(0, 0, w, h, 10, { fill: '#fff', w: 2 }) + inner, -w / 2, -h), x + w / 2, y + h, p);
}

// News ticker. Each phrase is its own text and only the ones on screen are drawn: one very long text that starts far off-screen is drawn garbled.
let _tw; const textW = (str, size, font) => { _tw = _tw || document.createElement('canvas').getContext('2d'); _tw.font = `${size}px "${font}"`; return _tw.measureText(str).width; };
function tickerText(t, str) {
  const parts = str.split(/\s*•\s*/).filter(Boolean), gap = 84; let x = 1080 - t * 300, out = '';
  for (let k = 0; k < parts.length * 3; k++) { const p = parts[k % parts.length], w = p.length * 22.4; // about 22.4 px a letter at this size and font; measuring the text in a canvas gave wrong widths on some frames
    if (x + w > -20 && x < 1100) out += text(x, 1360, p, { size: 50, fill: '#fff', anchor: 'start', font: BRUSH, weight: 400 }) + circ(x + w + gap / 2, 1344, 6, { fill: '#fff', w: 0 });
    x += w + gap; }
  return out;
}

/* Automatic timing (EP.auto = true): everything follows the voice files, so no times are typed by hand.
   voice: [{ who, text, gap? }]  scenes: [{ s: firstLineIndex, dry?, tail?, draw }]  caps: [[line, text, stopAtLine?]]  sx: [[line, offset, name, vol?]]
   durs = length in seconds of each voice line (after any speed-up). */
function resolveTiming(ep, durs) {
  if (!ep.auto) return;
  let prevEnd = 0;
  ep.voice.forEach((l, i) => { l.d = durs[i]; l.at = i === 0 ? 0.3 : prevEnd + (l.gap ?? 0.34); prevEnd = l.at + l.d; });
  const V = ep.voice, last = V[V.length - 1];
  ep.scenes.forEach((sc, k) => { sc.from = sc.s === 0 ? 0 : Math.round((V[sc.s].at - 0.25) * 100) / 100; });
  ep.scenes.forEach((sc, k) => { sc.to = k + 1 < ep.scenes.length ? ep.scenes[k + 1].from : Math.round((last.at + last.d + (sc.tail ?? 2.6)) * 100) / 100; });
  ep.dur = ep.scenes[ep.scenes.length - 1].to;
  ep.captions = (ep.caps || []).map(([i, text, stop], k, a) => {
    const from = V[i].at - 0.05; let to = stop != null ? V[stop].at - 0.05 : V[i].at + V[i].d + 0.3;
    if (a[k + 1]) to = Math.min(to, V[a[k + 1][0]].at - 0.05);
    return { from, to, text };
  });
  ep.sfx = (ep.sx || []).map(([i, off, name, vol]) => [V[i].at + off, name, vol ?? 1]);
  ep.music = []; let open = null;
  ep.scenes.forEach((sc) => { if (!sc.dry && open === null) open = sc.from; if (sc.dry && open !== null) { ep.music.push([open, sc.from - 0.1]); open = null; } });
  if (open !== null) ep.music.push([open, ep.dur]);
}

/* ---- Episode kit (K): shared characters and whole scenes, so a new episode is mostly its own jokes ---- */
const K = (() => {
  const fillR = (x, y, w, h, r = 0, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c ?? BRAND}"/>`;
  const head = (title, w, h = 64) => fillR(0, 0, w, h) + text(w / 2, h * 0.7, title, { size: h * 0.56, fill: '#fff' });
  const say = (on, t, idle = 'smile') => on ? { mouth: 'talk', tk: flap(t) } : { mouth: idle };
  const cast = {
    thandi: (o) => person({ hair: 'wrap', body: 'apron', earrings: true, ...o }), zanele: (o) => person({ hair: 'puff', body: 'apron', earrings: true, ...o }),
    gama: (o) => person({ hair: 'cap', body: 'tee', moustache: true, ...o }), sipho: (o) => person({ hair: 'cap', body: 'tee', ...o }),
    lady: (o) => person({ hair: 'afro', body: 'tee', earrings: true, ...o }), gogo: (o) => person({ hair: 'wrap', body: 'tee', glasses: true, earrings: true, ...o }),
    man: (o) => person({ hair: 'short', body: 'tee', glasses: true, ...o }), musa: (o) => person({ hair: 'chef', body: 'apron', moustache: true, ...o }),
    lindiwe: (o) => person({ hair: 'afro', body: 'apron', earrings: true, ...o }), boss: (o) => person({ hair: 'bald', body: 'suit', glasses: true, ...o }),
  };
  const win = (day = true) => rect(90, 400, 250, 300, 8, { fill: day ? '#fff' : '#cfc8b6' }) + line('M215,400 V700 M90,550 H340') + circ(150, 470, 34, { w: 5 }) + line('M150,418 v-10 M150,522 v10 M98,470 h-6 M202,470 h8 M113,433 l-6,-6 M187,507 l6,6 M187,433 l6,-6 M113,507 l-6,6', { w: 4 });
  const table = (y) => rect(-20, y, 1120, 170, 0, { w: 7 }) + line(`M-20,${y + 34} H1100`, { w: 4 });
  const smallPhone = (x, y, rot = 0, lit = true) => grp(rect(-50, -86, 100, 172, 18, { fill: INK, w: 5 }) + rect(-40, -70, 80, 136, 8, { fill: lit ? '#fff' : '#8d887c', w: 2 }), x, y, 1, rot);
  const buzz = (x, y) => line(`M${x - 84},${y - 60} q-22,34 0,72 M${x + 84},${y - 60} q22,34 0,72 M${x - 112},${y - 76} q-30,50 0,104 M${x + 112},${y - 76} q30,50 0,104`, { w: 5 });
  const mark = (txt, x, y, s = 1) => grp(`<rect x="-50" y="-50" width="100" height="100" rx="24" fill="${BRAND}" stroke="${INK}" stroke-width="5"/>` + text(0, 19, txt, { size: 54, fill: '#fff', font: BRUSH, weight: 400 }), x, y, s);
  const stamp = (x, y, s, rot, p, word = 'SOLD') => p <= 0 ? '' : grp(rect(-150, -62, 300, 124, 14, { fill: '#fff', w: 10, stroke: BRAND }) + rect(-134, -46, 268, 92, 8, { fill: 'none', w: 4, stroke: BRAND }) + text(0, 36, word, { font: BRUSH, size: 108, weight: 400, fill: BRAND }), x, y, s * (1 + 1.4 * Math.pow(1 - clamp(p * 5), 2)), rot);
  const holdPhone = (lit) => ({ e: [130, 170], h: [84, 70], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) + rect(-19, -64, 38, 62, 4, { fill: lit ? BRAND : '#fff', w: 1 }) });
  const counter = (y) => rect(-20, y, 1120, 100, 0) + line(`M-20,${y + 34} H1100`, { w: 4 });
  const mug = rect(-24, -66, 54, 62, 8, { fill: '#fff', w: 5 }) + line('M30,-54 q30,6 0,34', { w: 5 });
  const icons = (inst, markTxt, p) => rect(-160, -200, 320, 400, 40, { fill: '#fff', w: 7 }) + [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 1 && c === 1) ? '' : rect(-128 + c * 92, -160 + r * 104, 72, 72, 18, { fill: PAPER, w: 4 })).join('')).join('') + (inst ? mark(markTxt, 0, -20, 0.95 * p) : '');

  // the news desk as a scene. o: { bad: line of the bad news, good: line of the good news, badPip(t), goodPip(t), ticker }
  const news = (s, o) => ({ s, dry: true, draw(t, T, len, rel) {
    const good = t >= rel(o.good);
    return newsDesk(t, { title: o.title, good, talking: rel.on(o.bad, t) || rel.on(o.good, t) || (o.talk || []).some((i) => rel.on(i, t)), pip: good ? o.goodPip(t - rel(o.good), rel) : o.badPip(t), ticker: o.ticker });
  } });
  // the shop's own app on a phone, a customer scans the code and it installs. o: { name, mark, rows:[[name,price]], btn, sub, at (line where the code appears), title, tag, rewards, who(opts) }
  const ownApp = (s, o) => ({ s, draw(t, T, len, rel) {
    const t0 = rel(o.at), qrT = t0 + 0.7, scanT = qrT + 0.7, instT = qrT + 1.5, qrOn = t >= qrT, inst = t >= instT, scan = t >= scanT && !inst;
    let inner = fillR(0, 0, 470, 210) + circ(74, 108, 50, { fill: '#fff', w: 4 }) + text(74, 126, o.mark, { size: 50, fill: BRAND, font: BRUSH, weight: 400 }) +
      text(142, 104, o.name, { size: o.name.length > 14 ? 40 : 48, fill: '#fff', anchor: 'start' }) + text(142, 152, o.sub || 'Open now', { size: 30, fill: '#fff', anchor: 'start' });
    o.rows.forEach(([n, pr], i) => { const p = pop(prog(t, 0.5 + i * 0.35, 0.8 + i * 0.35)); if (!p) return;
      inner += grp(rect(-211, -66, 422, 132, 18, { fill: '#fff', w: 4 }) + text(-186, -10, n, { size: 34, anchor: 'start' }) + text(-186, 42, pr, { size: 46, anchor: 'start', fill: BRAND }) + fillR(82, -28, 116, 56, 28) + text(140, 11, o.btn || 'Order', { size: 28, fill: '#fff' }), 235, 300 + i * 150, p); });
    inner += o.rewards ? rect(24, 700, 422, 170, 18, { fill: '#fff', w: 4 }) + text(48, 752, 'Your rewards', { size: 36, anchor: 'start' }) + [0, 1, 2, 3, 4].map((i) => circ(76 + i * 78, 816, 26, { w: 4, fill: i < 3 ? BRAND : '#fff' })).join('')
      : rect(0, 790, 470, 110, 0, { fill: '#fff', w: 3 }) + circ(80, 842, 20, { w: 5, fill: BRAND }) + circ(235, 842, 20, { w: 5 }) + circ(390, 842, 20, { w: 5 });
    const card = inst ? grp(icons(true, o.mark, pop(prog(t, instT + 0.1, instT + 0.4))), 835, 640, pop(prog(t, instT, instT + 0.3)), 3) + star(950, 430, 92, { fill: BRAND, w: 5 }) + text(950, 442, 'Installed!', { size: 34, fill: '#fff', rot: -10 })
      : qrOn ? grp(rect(-150, -190, 300, 380, 20, { fill: '#fff', w: 7 }) + qr(-100, -150, 200) + text(0, 150, 'Scan me', { size: 50 }), 835, 640, pop(prog(t, qrT, qrT + 0.4)), 4) : '';
    const who = (o.who || ((q) => cast.sipho(q)))({ x: 835, y: 1040, s: 1.28, eyes: inst ? 'happy' : 'open', mouth: inst ? 'grin' : 'smile', brow: scan ? 'up' : '', look: [0, -3], armR: holdPhone(inst) });
    const ui = text(540, 250, o.title, { font: BRUSH, size: o.titleSize || 96, weight: 400 }) + phone(90, 390, 470, 900, inner, { id: 9 }) + (o.tag ? grp(rect(-200, -42, 400, 84, 18, { fill: '#fff', w: 5 }) + text(0, 12, o.tag, { size: 33 }), 832, 466, 1, -2) : '') + card;
    return { art: qrOn ? who + (scan ? line('M905,910 L860,840 M925,902 L900,836 M885,922 L822,852', { w: 5, stroke: BRAND }) : '') : '', ui };
  } });
  // three devices on the counter and the owner with a mug. o: { owner(opts), kind: 'vk'|'sv', names:[..], title }
  const devices = (s, o) => ({ s, draw(t) {
    const g = (i) => ease(prog(t, 0.6 + i * 0.1, 1.1 + i * 0.1)), nm = o.names || (o.kind === 'sv' ? ['Sales', 'Stock', 'Staff'] : ['New order!', 'Bookings', 'Sales']);
    const bars = [50, 78, 64, 104, 140].map((h, i) => fillR(24 + i * 36, 290 - h * g(i), 26, h * g(i))).join(''), bars2 = [40, 62, 54, 86, 112].map((h, i) => fillR(34 + i * 54, 178 - h * g(i), 36, h * g(i))).join('');
    let cal = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) cal += `<rect x="${20 + c * 53}" y="${70 + r * 44}" width="46" height="36" rx="6" fill="${[0, 6, 7, 13, 14].includes(r * 5 + c) ? BRAND : '#fff'}" stroke="${INK}" stroke-width="3"/>`;
    const stock = [['Chicken', 'ok'], ['Buns', 'ok'], ['Chips', 'LOW']].map(([n, st2], i) => text(24, 110 + i * 56, n, { size: 36, anchor: 'start' }) + (st2 === 'LOW' ? fillR(220, 76 + i * 56, 96, 44, 22) + text(268, 108 + i * 56, 'LOW', { size: 28, fill: '#fff' }) : text(268, 110 + i * 56, 'ok', { size: 32 }))).join('');
    const vk = o.kind !== 'sv', s1 = o.s1 ? o.s1(g) : vk ? fillR(0, 0, 210, 78, 10) + text(105, 54, nm[0], { size: 34, fill: '#fff' }) + cake(105, 196, 0.6) + text(105, 252, o.item || 'Chocolate cake', { size: 26 }) + text(105, 300, o.price || 'E250', { size: 44, fill: BRAND }) : head(nm[0], 210, 70) + bars + line('M16,292 H196', { w: 4 });
    const s2 = o.s2 ? o.s2(g) : vk ? text(170, 56, nm[1], { size: 44 }) + cal : text(170, 54, nm[1], { size: 44 }) + stock, s3 = o.s3 ? o.s3(g) : vk ? text(150, 48, nm[2], { size: 40 }) + bars2 + line('M22,180 H280', { w: 4 }) : text(150, 48, nm[2], { size: 40 }) + cal.replace(/x="(\d+)"/g, (m, x) => `x="${+x - 4}"`);
    const art = win() + o.owner({ x: 560, y: 610, s: 1.5, eyes: blink(t) ? 'closed' : 'happy', mouth: 'smile', tilt: wig(t, 0.4, 3), armL: { e: [128, 214], h: [70, 250] }, armR: { e: [134, 196], h: [84, 150], hold: mug } }) +
      line(`M${680 + wig(t, 0.7, 6)},760 q-16,-26 0,-46 q16,-22 0,-44`, { w: 4 }) + rect(-20, 1000, 1120, 420, 0) + line('M-20,1036 H1100', { w: 4 });
    const ui = text(540, 250, o.title || 'Run it from *any device*.', { font: BRUSH, size: 100, weight: 400 }) + screen(40, 1070, 210, 320, s1, { p: pop(prog(t, 0.6, 0.95)) }) + screen(296, 1120, 340, 270, s2, { p: pop(prog(t, 1.3, 1.65)) }) + screen(712, 1130, 300, 200, s3, { kind: 'laptop', p: pop(prog(t, 2.0, 2.35)) });
    return { art, ui };
  } });
  // end card: kind 'vk' or 'sv'; o.art(t) draws the character
  const end = (s, o) => ({ s, noCaption: true, noStrip: true, tail: o.tail ?? 2.8, draw(t, T, len, rel) {
    const logo = `<image href="${EP.logo}" x="-${o.kind === 'sv' ? 210 : 130}" y="-${o.kind === 'sv' ? 210 : 130}" width="${o.kind === 'sv' ? 420 : 260}" height="${o.kind === 'sv' ? 420 : 260}"/>` + (o.kind === 'sv' ? '' : rect(-130, -130, 260, 260, 6, { fill: 'none', w: 7 }));
    if (o.kind === 'gss') {
      const ui = grp(`<image href="${EP.logo}" x="-150" y="-150" width="300" height="300"/>`, 540, 300, pop(prog(t, 0, 0.4))) + text(540, 560, 'Your whole school.', { font: BRUSH, size: 110, weight: 400 }) +
        grp(text(0, 50, 'One system.', { font: BRUSH, size: 160, weight: 400, fill: BRAND }), 540, 680, pop(prog(t, 0.4, 0.8)), -2) + line(`M230,800 q170,-24 ${620 * ease(prog(t, 0.8, 1.2))},0`, { w: 12, stroke: BRAND }) +
        text(540, 930, o.role ? 'Open the live demo as ' + o.role + ':' : 'Open the live demo:', { size: o.role && o.role.length > 20 ? 44 : o.role && o.role.length > 8 ? 50 : 58 }) + rect(110, 990, 860, 136, 30, { fill: INK, w: 0 }) +
        text(540, 1082, 'gss-lms.vercel.app/demo', { font: BRUSH, size: 80, weight: 400, fill: '#fff' }) + text(540, 1820, 'Cartoon school. The demo is real, with made-up data.', { size: 32 }) + text(540, 1866, 'Nothing to sign up for. Made for schools in Eswatini.', { size: 32 });
      return { art: o.art(t) + line('M360,1744 H720', { w: 7 }), ui };
    }
    const ui = o.kind === 'sv'
      ? grp(logo, 540, 320, pop(prog(t, 0, 0.4))) + text(540, 600, 'Run your whole restaurant', { font: BRUSH, size: 96, weight: 400 }) + grp(text(0, 40, 'from one screen.', { font: BRUSH, size: 150, weight: 400, fill: BRAND }), 540, 730, pop(prog(t, 0.5, 0.9)), -2) +
        line(`M200,850 q170,-26 ${680 * ease(prog(t, 0.9, 1.3))},0`, { w: 12, stroke: BRAND }) + text(540, 980, 'Try the live demo:', { size: 64 }) + rect(110, 1040, 860, 136, 30, { fill: INK, w: 0 }) +
        text(540, 1132, 'servo-pos.vercel.app/demo', { font: BRUSH, size: 76, weight: 400, fill: '#fff' }) + text(540, 1820, 'Cartoon restaurant. Own app on Standard and Multi-branch.', { size: 32 }) + text(540, 1866, 'Servo needs an internet connection.', { size: 32 })
      : grp(logo, 540, 330, pop(prog(t, 0, 0.4))) + text(540, 640, 'Your own shop app.', { font: BRUSH, size: 124, weight: 400 }) + grp(text(0, 60, 'FREE.', { font: BRUSH, size: 250, weight: 400, fill: BRAND }), 540, 800, pop(prog(t, 0.5, 0.9)), -3) +
        line(`M330,900 q110,-26 ${420 * ease(prog(t, 0.9, 1.3))},0`, { w: 12, stroke: BRAND }) + text(540, 1010, 'No fees. No commission.', { size: 62 }) + rect(170, 1080, 740, 136, 30, { fill: INK, w: 0 }) +
        text(540, 1174, 'vendakhona.vercel.app', { font: BRUSH, size: 80, weight: 400, fill: '#fff' }) + text(540, 1860, 'Cartoon shop. The app is real, and free for sellers.', { size: 34 });
    return { art: o.art(t) + line(`M360,${o.kind === 'sv' ? 1744 : 1774} H720`, { w: 7 }), ui };
  } });
  const goat = (x, y, s = 1, flip = 1) => grp(rect(-130, -90, 240, 100, 26, { fill: '#fff', w: 6 }) + [-100, -60, 60, 95].map((lx) => line(`M${lx},10 v100`, { w: 9 })).join('') + line('M-130,-70 q-34,-30 -20,-80', { w: 8 }) +
    path('M100,-110 L190,-86 Q214,-60 196,-34 L130,-20 Q96,-40 100,-110Z', { fill: '#fff', w: 6 }) + path('M120,-108 q-30,-62 -86,-70 q40,10 64,70 Z', { fill: INK, w: 3 }) + path('M150,-100 q-6,-64 -52,-92 q50,20 66,92 Z', { fill: INK, w: 3 }) +
    path('M178,-100 l36,-22 l-6,40 Z', { fill: '#fff', w: 5 }) + circ(160, -70, 5, { fill: INK, w: 1 }) + line('M196,-34 q8,44 -10,70 q-4,-36 -14,-52', { w: 6 }) + line('M180,-48 h14', { w: 4 }), x, y, s * flip, 0, s);
  const light = (x, y, s = 1, c = 0) => grp(line('M0,40 V300', { w: 10 }) + rect(-46, -150, 92, 200, 18, { fill: INK, w: 6 }) + [0, 1, 2].map((i) => circ(0, -108 + i * 62, 22, { fill: i === c ? (['#e24c3a', '#f0b429', '#4cb36b'][i]) : '#8d887c', w: 2 })).join(''), x, y, s);
  /* ---- School kit (GSS-LMS) ---- */
  const school = {
    principal: (o) => person({ hair: 'wrap', body: 'blazer', glasses: true, earrings: true, ...o }), dube: (o) => person({ hair: 'short', body: 'tee', glasses: true, moustache: true, ...o }),
    learner: (o) => person({ hair: 'short', body: 'uniform', ...o }), learnerG: (o) => person({ hair: 'puff', body: 'uniform', earrings: true, ...o }),
    bursar: (o) => person({ hair: 'short', body: 'suit', glasses: true, ...o }), registrar: (o) => person({ hair: 'puff', body: 'blazer', earrings: true, ...o }),
    mom: (o) => person({ hair: 'afro', body: 'tee', earrings: true, ...o }), acm: (o) => person({ hair: 'cap', body: 'blazer', ...o }),
  };
  // chalkboard on the wall; str is chalk writing
  const board = (x, y, w, h, str = '', o = {}) => grp(rect(-12, -12, w + 24, h + 24, 10, { fill: '#fff', w: 7 }) + rect(0, 0, w, h, 4, { fill: INK, w: 3 }) + (str ? text(w / 2, o.ty ?? h * 0.42, str, { font: BRUSH, size: o.size ?? 64, weight: 400, fill: '#fff', lh: o.lh }) : '') + line(`M${w * 0.15},${h + 30} h${w * 0.2}`, { w: 8 }), x, y);
  const desk = (x, y, s = 1) => grp(rect(-170, -20, 340, 40, 8, { fill: '#fff', w: 6 }) + line('M-140,20 v120 M140,20 v120', { w: 9 }), x, y, s);
  const bag = (x, y, s = 1, rot = 0) => grp(rect(-80, -90, 160, 180, 30, { fill: BRAND, w: 6 }) + rect(-56, 10, 112, 60, 14, { fill: '#fff', w: 5 }) + line('M-40,-90 q40,-60 80,0', { w: 7 }), x, y, s, rot);
  const book = (x, y, s = 1, rot = 0, label = '') => grp(rect(-90, -60, 180, 120, 8, { fill: '#fff', w: 6 }) + line('M0,-60 v120', { w: 5 }) + (label ? text(-45, 10, label, { size: 26 }) : line('M-74,-30 h56 M-74,-8 h56 M-74,14 h40 M18,-30 h56 M18,-8 h56', { w: 4 })), x, y, s, rot);
  const paperPile = (x, y, n = 6, s = 1) => grp(Array.from({ length: n }, (_, i) => rect(-110 + rnd(i) * 16, -i * 16, 220, 30, 4, { fill: i % 2 ? '#fff' : PAPER, w: 4 })).join(''), x, y, s);
  // a GSS-LMS screen for phone (470x900) or monitor: title bar then rows [label, value, highlight?]
  const app = (title, rows, t = 9, o = {}) => { const w = o.w ?? 470, rh = o.rh ?? 112;
    let s2 = fillR(0, 0, w, 100) + text(w / 2, 66, title, { size: 42, fill: '#fff' });
    rows.forEach(([a, b, hi], i) => { const st2 = o.step ?? 0.25, p = pop(prog(t, 0.3 + i * st2, 0.6 + i * st2)); if (!p) return;
      s2 += grp(rect(-w / 2 + 20, -rh / 2 + 8, w - 40, rh - 16, 16, { fill: hi ? BRAND : '#fff', w: 4 }) + text(-w / 2 + 44, 14, a, { size: o.size ?? 34, anchor: 'start', fill: hi ? '#fff' : INK }) + text(w / 2 - 44, 14, b, { size: o.size ?? 34, anchor: 'end', fill: hi ? '#fff' : BRAND }), w / 2, 100 + rh / 2 + 10 + i * rh, p); });
    return s2 + (o.demo === false ? '' : text(w / 2, (o.h ?? 900) - 24, 'demo data', { size: 26 })); };
  // a scene where the narrator explains: rows pop in while line `line` is spoken (phone alone, or phone then monitor)
  const appScene = (s, o) => ({ s, draw(t, T, len, rel) {
    const a = rel(o.line ?? s), d = rel.end(o.line ?? s) - a, ph = o.phone, mo = o.monitor;
    let ui = text(540, 210, o.title, { font: BRUSH, size: o.titleSize || 104, weight: 400 });
    if (ph && mo) { const mr = typeof mo.rows === 'function' ? mo.rows(t - a, d) : mo.rows;
      ui += phone(70, 330, 420, 800, app(ph.title, ph.rows, t - a + 0.3, { w: 420, h: 800, rh: 104, step: d * 0.4 / ph.rows.length }), { id: 1 }) +
        screen(560, 470, 460, 380, app(mo.title, mr, t - a - d * 0.4 + 0.3, { w: 460, h: 380, rh: 86, size: 32, demo: false, step: d * 0.5 / mr.length }), { kind: 'monitor', p: pop(prog(t, a + d * 0.35, a + d * 0.35 + 0.35)) }) + text(790, 980, 'demo data', { size: 26 }); }
    else ui += phone(310, 330, 460, 880, app(ph.title, ph.rows, t - a + 0.3, { w: 460, h: 880, step: d * 0.8 / ph.rows.length }), { id: 1 });
    return { art: o.art ? o.art(t, rel) : '', ui };
  } });
  // GSS end card with the character waving
  const gssEnd = (s, role, who, o = {}) => end(s, { kind: 'gss', role, tail: o.tail ?? 2.4, art: (t) => who({ x: 540, y: o.y ?? 1360, s: o.s ?? 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) });
  const talker = (rel, t, lines, idle = 'smile') => say(lines.some((i) => rel.on(i, t)), t, idle);
  const classroom = () => rect(-20, 1240, 1120, 200, 0, { fill: '#e4dfd2' }) + line('M-20,1240 H1100', { w: 5 });
  return { goat, light, ...school, board, desk, bag, book, paperPile, app, appScene, gssEnd, talker, classroom, fillR, head, say, ...cast, win, table, smallPhone, buzz, mark, stamp, holdPhone, counter, mug, icons, news, ownApp, devices, end };
})();
