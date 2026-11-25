/* SV02 "What does this say?"  Servo POS, episode 2. Script and choices: docs/toons/PLAN.md */
const musa = (o) => person({ hair: 'chef', body: 'apron', moustache: true, ...o });
const dad = (o) => person({ hair: 'short', body: 'tee', glasses: true, ...o });
const mom = (o) => person({ hair: 'afro', body: 'tee', earrings: true, ...o });
const kid = (o) => person({ hair: 'cap', body: 'tee', ...o });
const dining = (y) => rect(40, y, 1000, 56, 12, { w: 7 }) + rect(80, y + 56, 920, 190, 0, { w: 7 }) + line(`M80,${y + 96} H1000`, { w: 4 });
const tent = (x, y, n, s = 1) => grp(path('M-62,0 L-48,-104 H48 L62,0 Z', { fill: '#fff', w: 6 }) + text(0, -24, n, { size: 84, font: BRUSH, weight: 400 }), x, y, s);
const plate = (x, y, food) => grp(`<ellipse cx="0" cy="0" rx="92" ry="22" ${st({ fill: '#fff', w: 5 })}/><ellipse cx="0" cy="-2" rx="56" ry="11" ${st({ fill: 'none', w: 3 })}/>` +
  (food ? path('M-50,-6 C-56,-56 -8,-70 4,-34 C20,-72 66,-52 52,-6 Z', { fill: PAPER, w: 5 }) + line('M-26,-30 q10,-10 18,0 M14,-34 q10,-8 16,2', { w: 4 }) : '') + line('M-124,-26 v44 M-134,-26 v16 M-114,-26 v16 M122,-28 v46', { w: 5 }), x, y);
const web = (x, y, s) => grp(line('M0,0 L-90,-60 M0,0 L-30,-110 M0,0 L50,-100 M0,0 L100,-40 M-45,-30 L-15,-55 L25,-50 L50,-20 M-72,-48 L-24,-88 L40,-80 L80,-32', { w: 3 }), x, y, s);
const mg = (x, y, s) => grp(`<rect x="-50" y="-50" width="100" height="100" rx="24" fill="${BRAND}" stroke="${INK}" stroke-width="5"/>` + text(0, 19, 'MG', { size: 54, fill: '#fff', font: BRUSH, weight: 400 }), x, y, s);
const fill = (x, y, w, h, r = 0, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c ?? BRAND}"/>`;
const head = (title, w, h = 64) => fill(0, 0, w, h) + text(w / 2, h * 0.7, title, { size: h * 0.56, fill: '#fff' });

const lindiwe = (o) => person({ hair: 'afro', body: 'apron', earrings: true, ...o });
const scrawl = (s = 1) => text(-96, -40, '2 chkn??', { size: 44 * s, anchor: 'start', rot: -4 }) + text(-96, 20, '7 chps', { size: 44 * s, anchor: 'start', rot: 3 }) + line('M-96,54 q14,-14 28,0 t28,0 t28,0 t28,0 t28,0 t28,0', { w: 4 });
const slip = (x, y, s, rot) => grp(rect(-120, -110, 240, 220, 6, { fill: '#fff', w: 6 }) + scrawl(), x, y, s, rot);
function chips(x, y, s = 1) {
  let f = ''; for (let i = 0; i < 46; i++) { const a = rnd(i) * Math.PI, r = Math.sqrt(rnd(i + 99)) * 0.92, fx = Math.cos(a) * r * 190, fy = -Math.sin(a) * r * 250 - 8;
    f += `<rect x="-26" y="-7" width="52" height="14" rx="3" transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${Math.round(rnd(i + 7) * 180)})" ${st({ fill: i % 3 ? '#fff' : PAPER, w: 4 })}/>`; }
  return grp(`<ellipse cx="0" cy="6" rx="250" ry="34" ${st({ fill: '#fff', w: 6 })}/>` + path('M-200,0 C-196,-160 -90,-270 0,-276 C90,-270 196,-160 200,0 Z', { fill: '#fff', w: 6 }) + f, x, y, s);
}

const EP = {
  id: 'sv02', title: 'What does this say?', dur: 56, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { n: '01', at: 0.3, who: 'N', text: 'Every kitchen has that one order slip.' },
    { n: '02', at: 3.3, who: 'M', text: 'Two chicken? Or... seven chips?' },
    { n: '03', at: 6, who: 'L', text: 'It says what it says, Chef.' },
    { n: '04', at: 8.3, who: 'N', text: 'So the kitchen guessed. The kitchen guessed wrong.' },
    { n: '05', at: 12.6, who: 'A', text: 'Breaking news. A table that ordered two chicken has received seven chips.' },
    { n: '06', at: 17.6, who: 'A', text: 'In better news: guests can order from their own phone, and the kitchen reads it in clear type.' },
    { n: '07', at: 23.6, who: 'N', text: 'Scan the code on the table. Pick. Send.' },
    { n: '08', at: 28.6, who: 'N', text: 'It lands on the kitchen screen. No handwriting. No guessing.' },
    { n: '09', at: 34.6, who: 'N', text: "On the Standard plan and up, your restaurant even gets its own app, on your guests' phones." },
    { n: '10', at: 39.9, who: 'N', text: 'And you see sales, stock and staff, on any device you like.' },
    { n: '11', at: 44.6, who: 'N', text: 'The old order slip?' },
    { n: '12', at: 46.9, who: 'M', text: "I framed it. It's art now." },
    { n: '13', at: 49.7, who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  sfx: [[0.6, 'scribble'], [3.3, 'pop'], [6, 'pop'], [7.7, 'womp', 0.8], [8, 'whoosh'], [8.5, 'thud'], [10.6, 'pop'], [12.3, 'sting'], [17.3, 'ding'],
    [23.8, 'tick'], [24.1, 'tick'], [24.8, 'pop'], [25.1, 'pop'], [25.4, 'pop'], [25.9, 'tick'], [26.3, 'tick'], [26.9, 'whoosh'], [27.2, 'chime', 0.8], [28.9, 'pop'], [29.1, 'ding', 0.8],
    [34.8, 'pop'], [35.1, 'pop'], [35.4, 'pop'], [36.9, 'chime'], [40.3, 'pop'], [41.3, 'pop'], [42.3, 'pop'], [44.3, 'whoosh'], [44.9, 'ding'], [46.9, 'pop'], [48.6, 'chime', 0.8], [49.3, 'whoosh'], [49.8, 'pop', 1.2]],
  music: [[0, 12.1], [23.3, 56]],
  captions: [
    { from: 3.2, to: 5.9, text: '“Two chicken?\nOr *seven chips*?”' },
    { from: 5.9, to: 8, text: '“It says what it says, Chef.”' },
    { from: 8, to: 12.3, text: 'The kitchen guessed.\n*Wrong.*' },
    { from: 12.3, to: 17.3, text: 'Ordered chicken.\nReceived *seven chips*.' },
    { from: 17.3, to: 23.3, text: 'Guests order from\n*their own phone*.' },
    { from: 23.3, to: 28.3, text: 'Scan the code. Pick. *Send.*' },
    { from: 28.3, to: 34.3, text: 'On the kitchen screen.\n*In clear type.*' },
    { from: 34.3, to: 39.6, text: '*Your own app*\non Standard and up.' },
    { from: 39.6, to: 44.3, text: 'Sales. Stock. Staff.\n*Any device.*' },
    { from: 44.3, to: 46.8, text: 'The old order slip?' },
    { from: 46.8, to: 49.3, text: '“I framed it.\n*It’s art now.*”' },
  ],
  scenes: [
    { from: 0, to: 8, draw(t) { // nobody can read the slip
      const mT = t >= 3.3 && t < 5.7, lT = t >= 6 && t < 7.9;
      const art = musa({ x: 250, y: 940, s: 1.35, eyes: Math.floor(t * 2) % 2 ? ['half', 'wide'] : 'half', brow: 'one', mouth: mT ? 'talk' : 'flat', tk: flap(t), look: [5, 3], tilt: wig(t, 0.5, 3),
        armL: { e: [124, 216], h: [100, 290] }, armR: { e: [150, 190], h: [164, 120] } }) +
        lindiwe({ x: 800, y: 940, s: 1.35, eyes: blink(t) ? 'closed' : 'open', mouth: lT ? 'talk' : 'smile', tk: flap(t + 1), brow: t > 5.8 ? 'up' : '', look: [-4, 0],
          armL: t > 5.8 ? { e: [140, 180], h: [150, 110] } : undefined, armR: t > 5.8 ? { e: [140, 180], h: [150, 110] } : undefined }) + rect(-20, 1310, 1120, 100, 0) + line('M-20,1344 H1100', { w: 4 });
      const ui = text(540, 190, 'Every kitchen has\n*that one slip*.', { font: BRUSH, size: 104, weight: 400, lh: 104 }) + slip(545, 1000, pop(prog(t, 0.4, 0.8)), -5 + wig(t, 0.6, 2)) +
        bubble(300, 470, 500, 150, '2 chicken?\nOr… 7 chips?', { p: prog(t, 3.3, 3.6), size: 50, tail: 'l', rot: -2 }) + bubble(775, 470, 510, 150, 'It says what\nit says, Chef.', { p: prog(t, 6, 6.3), size: 50, tail: 'r', rot: 2 });
      return { art, ui };
    } },
    { from: 8, to: 12.3, draw(t) { // so the table got seven chips
      const drop = ease(prog(t, 0.1, 0.5)), sh = t > 0.5 && t < 0.9 ? wig(t, 14, 6) : 0;
      const art = dad({ x: 220, y: 800, s: 1.45, eyes: t > 0.5 ? 'wide' : 'open', mouth: t > 0.5 ? 'o' : 'smile', brow: t > 0.5 ? 'up' : '', look: [5, 4], armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
        mom({ x: 860, y: 800, s: 1.45, eyes: t > 0.5 ? 'half' : 'open', mouth: 'flat', brow: t > 0.5 ? 'angry' : '', look: [-5, 4], armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
        dining(1160) + chips(540, lerp(200, 1168, drop) + sh, 0.95);
      const ui = text(540, 250, 'The kitchen *guessed*.', { font: BRUSH, size: 110, weight: 400 }) + bubble(800, 560, 460, 120, 'We ordered chicken.', { p: prog(t, 2.6, 2.9), size: 46, tail: 'r', rot: 3 });
      return { art, ui };
    } },
    { from: 12.3, to: 23.3, draw(t) { // news desk
      const good = t >= 5;
      const pip = good ? grp(rect(-110, -170, 220, 340, 30, { fill: INK, w: 5 }) + rect(-94, -150, 188, 296, 14, { fill: '#fff', w: 2 }) + fill(-94, -150, 188, 70) +
          [0, 1, 2].map((i) => rect(-80, -64 + i * 66, 160, 54, 10, { fill: '#fff', w: 3 }) + fill(26, -54 + i * 66, 44, 34, 17)).join(''), 780, 690, pop(prog(t, 5.1, 5.5)))
        : chips(780, 830, 0.72) + text(930, 560, '?!', { size: 90, rot: 10 });
      return newsDesk(t, { good, pip, ticker: 'TABLE ORDERS CHICKEN, GETS CHIPS   •   HANDWRITING UNDER INVESTIGATION   •   CHEF: “IT LOOKED LIKE A SEVEN”   •   WAITER STANDS BY HER PEN' });
    } },
    { from: 23.3, to: 28.3, draw(t) { // scan, pick, send
      const rows = [['Grilled chicken', 'E85'], ['Kota special', 'E45'], ['Chips', 'E25']], scan = t > 0.4 && t < 1.4, sent = t >= 3.6;
      const picked = (i) => (i === 0 && t >= 2.6) || (i === 2 && t >= 3);
      let inner = fill(0, 0, 420, 150) + text(210, 70, 'Menu', { size: 54, fill: '#fff' }) + text(210, 118, 'Table 4', { size: 32, fill: '#fff' });
      rows.forEach(([n, pr], i) => { const p = pop(prog(t, 1.5 + i * 0.3, 1.8 + i * 0.3)); if (!p) return;
        inner += grp(rect(-190, -62, 380, 124, 16, { fill: '#fff', w: 4 }) + text(-166, -8, n, { size: 34, anchor: 'start' }) + text(-166, 40, pr, { size: 44, anchor: 'start', fill: BRAND }) +
          (picked(i) ? circ(130, 0, 28, { fill: BRAND, w: 4 }) + line('M118,0 l9,10 l16,-20', { w: 6, stroke: '#fff' }) : fill(86, -26, 88, 52, 26) + text(130, 10, 'Add', { size: 30, fill: '#fff' })), 210, 240 + i * 142, p); });
      const send = pop(prog(t, 3.1, 3.4)); if (send) inner += grp(fill(-190, -40, 380, 80, 40, sent ? INK : BRAND) + text(0, 13, sent ? 'Sent to the kitchen' : 'Send order (2)', { size: 36, fill: '#fff' }), 210, 680, send * (sent ? 1 : 1 + 0.04 * Math.sin(t * 14)));
      const art = dining(1180) + (scan ? line('M600,760 L470,820 M600,800 L470,880 M600,720 L470,760', { w: 5, stroke: BRAND }) : '');
      const ui = text(540, 250, 'Scan. Pick. *Send.*', { font: BRUSH, size: 120, weight: 400 }) +
        grp(path('M-190,0 L-160,-520 H160 L190,0 Z', { fill: '#fff', w: 7 }) + text(0, -440, 'Table 4', { size: 60, font: BRUSH, weight: 400 }) + qr(-120, -400, 240) + text(0, -60, 'Scan to order', { size: 46 }), 270, 1184) +
        phone(610, 400, 420, 740, inner, { id: 5 });
      return { art, ui };
    } },
    { from: 28.3, to: 34.3, draw(t) { // the kitchen reads it in clear type
      const tick = pop(prog(t, 0.6, 0.95));
      const kds = head('KITCHEN', 700, 80) + (tick ? grp(rect(-310, -150, 620, 300, 16, { fill: '#fff', w: 6 }) + fill(-310, -150, 22, 300, 8) + text(-260, -70, 'Table 4', { size: 76, anchor: 'start', fill: BRAND }) +
        text(-260, 14, '2 x Grilled chicken', { size: 58, anchor: 'start' }) + text(-260, 96, '1 x Chips', { size: 58, anchor: 'start' }), 350, 262, tick) : '');
      const art = musa({ x: 280, y: 1100, s: 0.9, eyes: tick ? 'happy' : 'open', mouth: tick ? 'grin' : 'smile', look: [3, -5], armR: tick ? { e: [150, 150], h: [150, 40] } : undefined }) +
        lindiwe({ x: 800, y: 1100, s: 0.9, eyes: tick ? 'happy' : 'open', mouth: 'smile', look: [-3, -5] });
      const ui = text(540, 250, 'No handwriting. *No guessing.*', { font: BRUSH, size: 88, weight: 400 }) + screen(190, 400, 700, 440, kds, { kind: 'monitor' }) +
        (t > 2.6 ? grp(slip(0, 0, 0.72, 8) + line('M-70,-66 L70,66 M70,-66 L-70,66', { w: 12, stroke: BRAND }), 540, 1180, pop(prog(t, 2.6, 2.9))) : '');
      return { art, ui };
    } },
    { from: 34.3, to: 39.6, draw(t) { // the restaurant's own app (Standard and up)
      const rows = [['Grilled chicken', 'E85'], ['Kota special', 'E45'], ['Chips', 'E25']], inst = t >= 2.6;
      let inner = fill(0, 0, 470, 210) + circ(74, 108, 50, { fill: '#fff', w: 4 }) + text(74, 126, 'MG', { size: 50, fill: BRAND, font: BRUSH, weight: 400 }) +
        text(142, 104, 'Musa’s Grill', { size: 50, fill: '#fff', anchor: 'start' }) + text(142, 152, 'Menu · Rewards', { size: 30, fill: '#fff', anchor: 'start' });
      rows.forEach(([n, pr], i) => { const p = pop(prog(t, 0.5 + i * 0.3, 0.8 + i * 0.3)); if (!p) return;
        inner += grp(rect(-211, -66, 422, 132, 18, { fill: '#fff', w: 4 }) + text(-186, -10, n, { size: 36, anchor: 'start' }) + text(-186, 42, pr, { size: 48, anchor: 'start', fill: BRAND }) + fill(82, -28, 116, 56, 28) + text(140, 11, 'Order', { size: 30, fill: '#fff' }), 235, 310 + i * 150, p); });
      inner += rect(24, 700, 422, 170, 18, { fill: '#fff', w: 4 }) + text(48, 752, 'Your rewards', { size: 36, anchor: 'start' }) + [0, 1, 2, 3, 4].map((i) => circ(76 + i * 78, 816, 26, { w: 4, fill: i < 3 ? BRAND : '#fff' })).join('');
      const card = inst ? grp(rect(-150, -180, 300, 360, 40, { fill: '#fff', w: 7 }) + [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 1 && c === 1) ? '' : rect(-120 + c * 86, -148 + r * 100, 68, 68, 18, { fill: PAPER, w: 4 })).join('')).join('') +
        mg(0, -14, 0.9 * pop(prog(t, 2.7, 3.1))), 835, 720, pop(prog(t, 2.6, 2.9)), 3) + star(972, 590, 88, { fill: BRAND, w: 5 }) + text(972, 602, 'Installed!', { size: 33, fill: '#fff', rot: -10 }) : '';
      const art = mom({ x: 835, y: 1040, s: 1.2, eyes: inst ? 'happy' : 'open', mouth: inst ? 'grin' : 'smile', look: [0, -3],
        armR: { e: [130, 170], h: [84, 70], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) + rect(-19, -64, 38, 62, 4, { fill: inst ? BRAND : '#fff', w: 1 }) } });
      const ui = text(540, 180, 'Your restaurant.\n*Your own app.*', { font: BRUSH, size: 100, weight: 400, lh: 100 }) + phone(90, 390, 470, 900, inner, { id: 6 }) +
        grp(rect(-200, -42, 400, 84, 18, { fill: '#fff', w: 5 }) + text(0, 12, '*Standard* plan and up', { size: 33 }), 832, 436, 1, -2) + card;
      return { art, ui };
    } },
    { from: 39.6, to: 44.3, draw(t) { // the owner runs it from anything
      const mug = rect(-24, -66, 54, 62, 8, { fill: '#fff', w: 5 }) + line('M30,-54 q30,6 0,34', { w: 5 });
      const art = musa({ x: 540, y: 630, s: 1.45, eyes: blink(t) ? 'closed' : 'happy', mouth: 'smile', tilt: wig(t, 0.4, 3), armL: { e: [128, 214], h: [70, 250] }, armR: { e: [134, 196], h: [84, 150], hold: mug } }) +
        line(`M${660 + wig(t, 0.7, 6)},770 q-16,-26 0,-46 q16,-22 0,-44`, { w: 4 }) + rect(-20, 1000, 1120, 420, 0) + line('M-20,1036 H1100', { w: 4 });
      const g = (i) => ease(prog(t, 0.9 + i * 0.1, 1.4 + i * 0.1));
      const bars = [50, 78, 64, 104, 140].map((h, i) => fill(24 + i * 36, 290 - h * g(i), 26, h * g(i))).join('');
      const stock = [['Chicken', 'ok'], ['Buns', 'ok'], ['Chips', 'LOW']].map(([n, s], i) => text(24, 110 + i * 56, n, { size: 36, anchor: 'start' }) + (s === 'LOW' ? fill(220, 76 + i * 56, 96, 44, 22) + text(268, 108 + i * 56, 'LOW', { size: 28, fill: '#fff' }) : text(268, 110 + i * 56, 'ok', { size: 32 }))).join('');
      let ros = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ros += `<rect x="${20 + c * 53}" y="${70 + r * 44}" width="46" height="36" rx="6" fill="${[0, 6, 7, 13, 14].includes(r * 5 + c) ? BRAND : '#fff'}" stroke="${INK}" stroke-width="3"/>`;
      const ui = text(540, 250, 'Run it from *any device*.', { font: BRUSH, size: 100, weight: 400 }) +
        screen(40, 1070, 210, 320, head('Sales', 210, 70) + bars + line('M16,292 H196', { w: 4 }), { p: pop(prog(t, 0.7, 1.05)) }) +
        screen(296, 1120, 340, 270, text(170, 54, 'Stock', { size: 44 }) + stock, { p: pop(prog(t, 1.7, 2.05)) }) +
        screen(712, 1130, 300, 200, text(150, 48, 'Staff', { size: 40 }) + ros, { kind: 'laptop', p: pop(prog(t, 2.7, 3.05)) });
      return { art, ui };
    } },
    { from: 44.3, to: 49.3, draw(t) { // the slip, framed
      const mT = t >= 2.6 && t < 4.4;
      const frame = grp(rect(-230, -250, 460, 500, 10, { fill: PAPER, w: 9 }) + rect(-200, -220, 400, 440, 6, { fill: 'none', w: 4 }) + rect(-160, -180, 320, 360, 4, { fill: '#fff', w: 6 }) +
        [[-230, -250], [230, -250], [-230, 250], [230, 250]].map(([x, y]) => circ(x, y, 26, { fill: PAPER, w: 7 })).join('') + grp(scrawl(1.25), 10, 0, 1, -5) +
        rect(-110, 276, 220, 62, 8, { fill: '#fff', w: 5 }) + text(0, 318, '“Untitled”', { size: 34 }), 660, 760, pop(prog(t, 0.2, 0.6)));
      const art = line('M660,430 V500', { w: 5 }) + musa({ x: 250, y: 900, s: 1.4, eyes: 'happy', mouth: mT ? 'talk' : 'grin', tk: flap(t), brow: 'up', tilt: -4, armL: { e: [124, 216], h: [100, 300] }, armR: { e: [156, 150], h: [190, 90] } }) +
        rect(-20, 1310, 1120, 100, 0) + line('M-20,1344 H1100', { w: 4 }) + line('M470,560 l-40,-30 M450,640 l-50,-6 M850,560 l40,-30 M870,640 l50,-6', { w: 5, stroke: BRAND });
      const ui = text(540, 250, 'Kitchen art.', { font: BRUSH, size: 120, weight: 400 }) + frame + bubble(250, 480, 420, 150, 'I framed it.\nIt’s art now.', { p: prog(t, 2.6, 2.9), size: 50, tail: 'l', rot: -3 });
      return { art, ui };
    } },
    { from: 49.3, to: 56, noCaption: true, noStrip: true, draw(t) { // end card
      const ui = grp(`<image href="${EP.logo}" x="-210" y="-210" width="420" height="420"/>`, 540, 320, pop(prog(t, 0, 0.4))) +
        text(540, 600, 'Run your whole restaurant', { font: BRUSH, size: 96, weight: 400 }) +
        grp(text(0, 40, 'from one screen.', { font: BRUSH, size: 150, weight: 400, fill: BRAND }), 540, 730, pop(prog(t, 0.5, 0.9)), -2) +
        line(`M200,850 q170,-26 ${680 * ease(prog(t, 0.9, 1.3))},0`, { w: 12, stroke: BRAND }) +
        text(540, 980, 'Try the live demo:', { size: 64 }) +
        rect(110, 1040, 860, 136, 30, { fill: INK, w: 0 }) + text(540, 1132, 'servo-pos.vercel.app/demo', { font: BRUSH, size: 76, weight: 400, fill: '#fff' }) +
        text(540, 1820, 'Cartoon restaurant. Own app on Standard and Multi-branch.', { size: 32 }) + text(540, 1866, 'Servo needs an internet connection.', { size: 32 });
      const art = musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) + line('M360,1744 H720', { w: 7 });
      return { art, ui };
    } },
  ],
};
