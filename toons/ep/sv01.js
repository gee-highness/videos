/* SV01 "Table 6"  Servo POS, episode 1. Script and choices: docs/toons/PLAN.md */
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

const EP = {
  id: 'sv01', title: 'Table 6', dur: 58, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural' },
  voice: [
    { n: '01', at: 0.3, who: 'N', text: 'Every restaurant has a Table 6.' },
    { n: '02', at: 3.2, who: 'N', text: 'They ordered a long, long time ago.' },
    { n: '03', at: 6.5, who: 'N', text: 'The waiter wrote it down. On paper.' },
    { n: '04', at: 10, who: 'N', text: 'The paper is now behind the fridge.' },
    { n: '05', at: 12.8, who: 'A', text: 'Breaking news. Table 6 is still waiting. The order slip remains missing.' },
    { n: '06', at: 19.6, who: 'A', text: 'In better news: orders can go from the till, straight to a kitchen screen.' },
    { n: '07', at: 25.3, who: 'N', text: 'Tap the order. The kitchen sees it.' },
    { n: '08', at: 28.9, who: 'N', text: 'Guests can even order from their own phone, with the QR code on the table.' },
    { n: '09', at: 33.3, who: 'N', text: 'On the Standard plan and up, your restaurant gets its own app. Your name. Your logo. On their phone.' },
    { n: '10', at: 41.9, who: 'N', text: 'Sales, stock and staff. On any device you like.' },
    { n: '11', at: 46.7, who: 'N', text: 'Table 6 has been served.' },
    { n: '12', at: 49.2, who: 'N', text: 'Table 7 would like a word.' },
    { n: '13', at: 52, who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  sfx: [[3.6, 'womp', 0.8], [4.6, 'tick'], [5, 'tick'], [5.4, 'tick'], [6.8, 'scribble'], [7.6, 'scribble'], [8.4, 'scribble'], [10, 'whoosh'], [11.6, 'pop'], [12.1, 'womp'], [12.6, 'sting'], [19.5, 'ding'],
    [25.6, 'tick'], [26, 'whoosh'], [26.5, 'ding', 0.8], [29.2, 'tick'], [29.5, 'tick'], [30.2, 'pop'], [30.5, 'pop'], [30.8, 'pop'], [31.6, 'chime', 0.8], [33.5, 'pop'], [33.8, 'pop'], [34.1, 'pop'], [36.7, 'chime'],
    [42.3, 'pop'], [43.3, 'pop'], [44.3, 'pop'], [46.5, 'ding'], [47, 'munch'], [47.7, 'munch'], [48.4, 'munch'], [49, 'whoosh'], [49.9, 'tick'], [50.1, 'tick'], [50.3, 'tick'], [50.6, 'pop'], [51.6, 'whoosh'], [52.3, 'pop', 1.2]],
  music: [[0, 12.4], [25, 58]],
  captions: [
    { from: 3.1, to: 6.2, text: 'They ordered a *long*\ntime ago.' },
    { from: 6.2, to: 9.9, text: 'The waiter wrote it down.\nOn *paper*.' },
    { from: 9.9, to: 12.6, text: 'The paper is behind\n*the fridge*.' },
    { from: 12.6, to: 19.5, text: 'Table 6 is *still waiting*.' },
    { from: 19.5, to: 25, text: 'Till to *kitchen screen*.\nNothing gets lost.' },
    { from: 25, to: 28.7, text: 'Tap the order.\n*The kitchen sees it.*' },
    { from: 28.7, to: 33, text: 'Guests order from\n*their own phone*.' },
    { from: 33, to: 37, text: '*Your own app*\non Standard and up.' },
    { from: 37, to: 41.6, text: 'Your name. Your logo.\n*On their phone.*' },
    { from: 41.6, to: 46.4, text: 'Sales. Stock. Staff.\n*Any device.*' },
    { from: 46.4, to: 49, text: 'Table 6 has been *served*.' },
    { from: 49, to: 51.6, text: 'Table 7 would like *a word*.' },
  ],
  scenes: [
    { from: 0, to: 6.2, draw(t) { // Table 6 has been waiting
      const late = t > 3;
      const art = circ(880, 480, 74, { fill: '#fff' }) + line(`M880,480 l${Math.sin(t * 7) * 52},${-Math.cos(t * 7) * 52} M880,480 l${Math.sin(t * 0.6) * 34},${-Math.cos(t * 0.6) * 34}`, { w: 6 }) + circ(880, 480, 5, { fill: INK }) +
        dad({ x: 240, y: 800, s: 1.45, eyes: 'half', mouth: 'flat', brow: late ? 'sad' : '', tilt: late ? 6 : 0, armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
        mom({ x: 840, y: 800, s: 1.45, eyes: blink(t) ? 'closed' : 'open', mouth: 'flat', brow: 'angry', look: [-4, 0], armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
        kid({ x: 540, y: 905, s: 1.05, eyes: 'closed', mouth: late ? 'yawn' : 'flat', tilt: -8 }) +
        (late ? web(150, 720, pop(prog(t, 3, 3.6))) : '') + dining(1160) + plate(240, 1186) + plate(840, 1186);
      const ui = text(540, 190, 'Every restaurant has\na *Table 6*.', { font: BRUSH, size: 104, weight: 400, lh: 104 }) + tent(540, 1166, '6', 1.1) +
        (t > 4.4 ? text(545 + wig(t, 9, 4), 780, 'grrrr', { size: 50, rot: -8 }) : '') + (t < 3 ? '' : text(660, 700, 'z', { size: 54 }) + text(700, 650, 'Z', { size: 72 }));
      return { art, ui };
    } },
    { from: 6.2, to: 9.9, draw(t) { // the order goes on paper
      const art = person({ x: 300, y: 800, s: 1.6, hair: 'afro', body: 'apron', earrings: true, eyes: blink(t) ? 'closed' : 'open', mouth: 'smile', look: [4, 3], armL: { e: [124, 216], h: [60, 250] },
        armR: { e: [140, 190], h: [150 + wig(t, 5, 8), 150 + wig(t, 7, 6)], hold: line('M0,0 L46,-70', { w: 9 }) } }) + line('M60,1330 H520', { w: 7 });
      const scr = (y, a, w) => { const p = prog(t, a, a + 0.6); return p ? line(`M-150,${y} ` + Array.from({ length: Math.round(w * p) }, (_, i) => `q${10 + rnd(i + y) * 8},${i % 2 ? 14 : -14} ${20 + rnd(i * 3 + y) * 8},0`).join(' '), { w: 5 }) : ''; };
      const pad = grp(rect(-190, -280, 380, 560, 10, { fill: '#fff', w: 7 }) + [-150, -90, -30, 30, 90, 150].map((x) => circ(x, -280, 13, { w: 5 })).join('') +
        (t > 0.5 ? text(-150, -150, 'tbl 6 ?', { size: 62, anchor: 'start', rot: -3 }) : '') + scr(-90, 0.9, 9) + (t > 1.5 ? text(-150, 10, '2 chkn?? 7 chps', { size: 44, anchor: 'start', rot: 2 }) : '') + scr(70, 1.9, 11) +
        (t > 2.5 ? text(-150, 170, 'no ??? extra', { size: 48, anchor: 'start', rot: -2 }) : '') + scr(220, 2.8, 7), 790, 860, 1, 4);
      return { art, ui: text(540, 230, 'Order taken. *On paper.*', { font: BRUSH, size: 100, weight: 400 }) + pad };
    } },
    { from: 9.9, to: 12.6, draw(t) { // ...which goes behind the fridge
      const p = prog(t, 0.1, 1.7), sy = lerp(360, 760, p * p), sx = 800 + wig(t, 1.3, 46);
      const slip = grp(rect(-38, -50, 76, 100, 4, { fill: '#fff', w: 5 }) + line('M-22,-26 h44 M-22,-6 h44 M-22,14 h28', { w: 4 }), sx, sy, 1, wig(t, 1.1, 24));
      const art = line('M0,1330 H1080', { w: 7 }) + (p < 1 ? slip : '') + rect(640, 520, 340, 810, 22, { fill: '#fff', w: 8 }) + line('M640,800 H980 M690,600 v130 M690,870 v200', { w: 7 }) +
        musa({ x: 300, y: 830, s: 1.55, eyes: 'wide', mouth: 'o', brow: 'up', look: [wig(t, 0.9, 7), 0], sweat: true, armL: { e: [150, 160], h: [120, 60] }, armR: { e: [124, 216], h: [100, 300] } });
      const ui = text(540, 230, 'Order filed. *Behind the fridge.*', { font: BRUSH, size: 84, weight: 400 }) + (t > 0.4 ? text(170, 560, '?', { size: 130, rot: -12 }) + text(430, 520, '?', { size: 100, rot: 10 }) : '') +
        (p >= 1 ? text(810, 470, 'fwip', { size: 54, rot: -6 }) : '');
      return { art, ui };
    } },
    { from: 12.6, to: 25, draw(t) { // news desk
      const good = t >= 6.9;
      const pip = good ? grp(screen(0, 0, 300, 210, head('KITCHEN', 300, 52) + rect(16, 68, 126, 126, 10, { fill: '#fff', w: 4 }) + fill(16, 68, 12, 126, 4) + line('M44,100 h80 M44,128 h80 M44,156 h50', { w: 4 }) +
          rect(158, 68, 126, 126, 10, { fill: '#fff', w: 4 }) + fill(158, 68, 12, 126, 4) + line('M186,100 h80 M186,128 h60', { w: 4 }), { kind: 'monitor', p: pop(prog(t, 7, 7.4)) }), 630, 560)
        : dad({ x: 780, y: 720, s: 1.3, headOnly: true, eyes: 'half', mouth: 'flat', brow: 'sad' }) + web(690, 650, 0.9) + grp(tent(0, 0, '6', 0.7), 930, 860);
      return newsDesk(t, { good, pip, ticker: 'TABLE 6 STILL WAITING   •   ORDER SLIP MISSING   •   FRIDGE DECLINES TO COMMENT   •   CHEF “LOOKING INTO IT”' });
    } },
    { from: 25, to: 28.7, draw(t) { // till to kitchen screen
      const tiles = ['Chicken', 'Chips', 'Pap', 'Salad', 'Juice', 'Kota'], tap = t > 0.6, sent = t > 1.5;
      let till = head('Till · Table 6', 420, 70);
      tiles.forEach((n, i) => { const x = 24 + (i % 2) * 192, y = 94 + Math.floor(i / 2) * 124, on = tap && i < 2; till += rect(x, y, 180, 108, 14, { fill: on ? BRAND : '#fff', w: 4 }) + text(x + 90, y + 68, n, { size: 38, fill: on ? '#fff' : INK }); });
      till += fill(24, 474, 372, 66, 33) + text(210, 520, 'Send to kitchen', { size: 36, fill: '#fff' });
      const fly = prog(t, 0.9, 1.5), tick = sent ? pop(prog(t, 1.5, 1.8)) : 0;
      const kds = head('KITCHEN', 420, 60) + (tick ? grp(rect(-180, -110, 360, 220, 14, { fill: '#fff', w: 5 }) + fill(-180, -110, 16, 220, 6) + text(-144, -50, 'Table 6', { size: 50, anchor: 'start', fill: BRAND }) +
        text(-144, 8, '2 x Grilled chicken', { size: 36, anchor: 'start' }) + text(-144, 62, '1 x Chips', { size: 36, anchor: 'start' }), 210, 196, tick) : '');
      const art = musa({ x: 810, y: 1066, s: 0.98, eyes: sent ? 'happy' : 'open', mouth: sent ? 'grin' : 'smile', look: [0, -4], armR: sent ? { e: [150, 150], h: [150, 40] } : undefined });
      const ui = text(540, 250, 'Tap. *The kitchen sees it.*', { font: BRUSH, size: 96, weight: 400 }) + screen(60, 500, 420, 560, till) + screen(600, 420, 420, 320, kds, { kind: 'monitor' }) +
        (tap && !sent ? circ(190, 660, 30, { fill: 'none', w: 6, stroke: INK }) : '') +
        (fly > 0 && fly < 1 ? grp(rect(-50, -34, 100, 68, 10, { fill: BRAND, w: 5 }), lerp(270, 810, ease(fly)), lerp(860, 600, ease(fly)) - Math.sin(fly * Math.PI) * 160, 1, fly * 30) : '');
      return { art, ui };
    } },
    { from: 28.7, to: 33, draw(t) { // guests order from their own phone
      const rows = [['Grilled chicken', 'E85'], ['Kota special', 'E45'], ['Chips', 'E25']], scan = t > 0.4 && t < 1.4;
      let inner = fill(0, 0, 420, 150) + text(210, 70, 'Menu', { size: 54, fill: '#fff' }) + text(210, 118, 'Table 6', { size: 32, fill: '#fff' });
      rows.forEach(([n, pr], i) => { const p = pop(prog(t, 1.5 + i * 0.3, 1.8 + i * 0.3)); if (!p) return;
        inner += grp(rect(-190, -62, 380, 124, 16, { fill: '#fff', w: 4 }) + text(-166, -8, n, { size: 34, anchor: 'start' }) + text(-166, 40, pr, { size: 44, anchor: 'start', fill: BRAND }) + fill(86, -26, 88, 52, 26) + text(130, 10, 'Add', { size: 30, fill: '#fff' }), 210, 240 + i * 142, p); });
      const send = pop(prog(t, 2.8, 3.1)); if (send) inner += grp(fill(-190, -40, 380, 80, 40) + text(0, 13, 'Send order (2)', { size: 38, fill: '#fff' }), 210, 680, send);
      const art = dining(1180) + (scan ? line('M600,760 L470,820 M600,800 L470,880 M600,720 L470,760', { w: 5, stroke: BRAND }) : '');
      const ui = text(540, 250, 'Or guests order *from their phone*.', { font: BRUSH, size: 80, weight: 400 }) +
        grp(path('M-190,0 L-160,-520 H160 L190,0 Z', { fill: '#fff', w: 7 }) + text(0, -440, 'Table 6', { size: 60, font: BRUSH, weight: 400 }) + qr(-120, -400, 240) + text(0, -60, 'Scan to order', { size: 46 }), 270, 1184) +
        phone(610, 400, 420, 740, inner, { id: 5 });
      return { art, ui };
    } },
    { from: 33, to: 41.6, draw(t) { // the restaurant's own app (Standard and up)
      const rows = [['Grilled chicken', 'E85'], ['Kota special', 'E45'], ['Chips', 'E25']], inst = t >= 3.6;
      let inner = fill(0, 0, 470, 210) + circ(74, 108, 50, { fill: '#fff', w: 4 }) + text(74, 126, 'MG', { size: 50, fill: BRAND, font: BRUSH, weight: 400 }) +
        text(142, 104, 'Musa’s Grill', { size: 50, fill: '#fff', anchor: 'start' }) + text(142, 152, 'Menu · Rewards', { size: 30, fill: '#fff', anchor: 'start' });
      rows.forEach(([n, pr], i) => { const p = pop(prog(t, 0.5 + i * 0.3, 0.8 + i * 0.3)); if (!p) return;
        inner += grp(rect(-211, -66, 422, 132, 18, { fill: '#fff', w: 4 }) + text(-186, -10, n, { size: 36, anchor: 'start' }) + text(-186, 42, pr, { size: 48, anchor: 'start', fill: BRAND }) + fill(82, -28, 116, 56, 28) + text(140, 11, 'Order', { size: 30, fill: '#fff' }), 235, 310 + i * 150, p); });
      inner += rect(24, 700, 422, 170, 18, { fill: '#fff', w: 4 }) + text(48, 752, 'Your rewards', { size: 36, anchor: 'start' }) + [0, 1, 2, 3, 4].map((i) => circ(76 + i * 78, 816, 26, { w: 4, fill: i < 3 ? BRAND : '#fff' })).join('');
      const card = inst ? grp(rect(-150, -180, 300, 360, 40, { fill: '#fff', w: 7 }) + [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 1 && c === 1) ? '' : rect(-120 + c * 86, -148 + r * 100, 68, 68, 18, { fill: PAPER, w: 4 })).join('')).join('') +
        mg(0, -14, 0.9 * pop(prog(t, 3.7, 4.1))), 835, 720, pop(prog(t, 3.6, 3.9)), 3) + star(972, 590, 88, { fill: BRAND, w: 5 }) + text(972, 602, 'Installed!', { size: 33, fill: '#fff', rot: -10 }) : '';
      const art = mom({ x: 835, y: 1040, s: 1.2, eyes: inst ? 'happy' : 'open', mouth: inst ? 'grin' : 'smile', look: [0, -3],
        armR: { e: [130, 170], h: [84, 70], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) + rect(-19, -64, 38, 62, 4, { fill: inst ? BRAND : '#fff', w: 1 }) } });
      const ui = text(540, 180, 'Your restaurant.\n*Your own app.*', { font: BRUSH, size: 100, weight: 400, lh: 100 }) + phone(90, 390, 470, 900, inner, { id: 6 }) +
        grp(rect(-200, -42, 400, 84, 18, { fill: '#fff', w: 5 }) + text(0, 12, '*Standard* plan and up', { size: 33 }), 832, 436, 1, -2) + card;
      return { art, ui };
    } },
    { from: 41.6, to: 46.4, draw(t) { // the owner runs it from anything
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
    { from: 46.4, to: 51.6, draw(t) { // Table 6 eats; Table 7 has thoughts
      if (t < 2.6) {
        const ch = Math.floor(t * 5) % 2;
        const art = dad({ x: 240, y: 800, s: 1.45, eyes: 'happy', mouth: ch ? 'grin' : 'smile', armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
          mom({ x: 840, y: 800, s: 1.45, eyes: 'happy', mouth: ch ? 'smile' : 'grin', armL: { e: [124, 216], h: [70, 246] }, armR: { e: [124, 216], h: [70, 246] } }) +
          kid({ x: 540, y: 905, s: 1.05, eyes: 'happy', mouth: 'grin' }) + dining(1160) + plate(240, 1186, true) + plate(840, 1186, true);
        return { art, ui: tent(540, 1166, '6', 1.1) + text(250 + wig(t, 5, 5), 560, 'nom', { size: 60, rot: -8 }) + text(830 - wig(t, 5, 5), 540, 'nom nom', { size: 60, rot: 6 }) };
      }
      const u = t - 2.6;
      const art = person({ x: 540, y: 780, s: 1.7, hair: 'bald', body: 'suit', glasses: true, eyes: 'half', mouth: 'flat', brow: 'angry', look: [0, 0], tilt: 4, armL: { e: [124, 216], h: [70, 222] },
        armR: { e: [124, 216], h: [76, 222 + (Math.floor(u * 8) % 2 ? -8 : 0)] } }) + dining(1160) + plate(300, 1186);
      const ui = tent(870, 1166, '7', 1.1) + text(745, 1100, 'tap tap', { size: 40, rot: -6 }) + bubble(790, 600, 260, 120, 'Ahem.', { p: prog(u, 0.9, 1.2), size: 64, tail: 'l', rot: 4 });
      return { art, ui };
    } },
    { from: 51.6, to: 58, noCaption: true, noStrip: true, draw(t) { // end card
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
