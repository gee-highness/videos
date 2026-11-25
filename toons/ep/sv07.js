/* SV07 "The owner on holiday"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, lindiwe, win, counter, mug, news, end, holdPhone, smallPhone, buzz } = K;
const palm = (x, y, s = 1) => grp(path('M-14,0 q14,-120 6,-260 h28 q-8,140 8,260 z', { fill: '#fff', w: 6 }) + [[-150, -250, -60, -300], [-120, -330, -10, -300], [120, -250, 30, -300], [150, -330, 20, -290]].map(([a, b, c, d]) => path(`M0,-270 Q${(a + c) / 2},${b - 40} ${a},${b + 30} Q${(a + c) / 2},${b} ${c},${d} Z`, { fill: '#fff', w: 5 })).join(''), x, y, s);
const sea = (y, t) => `<path d="M0,${y} ` + Array.from({ length: 12 }, (_, i) => `q45,${-18 + wig(t, 0.6, 6, i)} 90,0`).join(' ') + ` V${y + 70} H0 Z" ${st({ fill: '#fff', w: 5 })}/>`;
const sun = (x, y) => circ(x, y, 56, { fill: '#fff', w: 6 }) + line(`M${x},${y - 80} v-24 M${x},${y + 80} v24 M${x - 80},${y} h-24 M${x + 80},${y} h24 M${x - 56},${y - 56} l-16,-16 M${x + 56},${y - 56} l16,-16`, { w: 5 });
const lounger = (x, y) => grp(path('M-200,40 L130,40 L240,-60 L270,-40 L150,70 L-200,70 Z', { fill: '#fff', w: 7 }) + line('M-180,70 v50 M110,70 v50', { w: 8 }), x, y);
const EP = {
  id: 'sv07', title: 'The owner on holiday', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: 'Chef Musa is on holiday. His body is on a beach. His mind is in the kitchen.' }, { who: 'M', text: 'Lindiwe, how many have we sold?' }, { who: 'L', text: 'Chef. You asked five minutes ago.' }, { who: 'M', text: 'And now?' }, { who: 'L', text: 'Chef...' },
    { who: 'A', text: 'Breaking news. A restaurant owner is on holiday. The restaurant is fine. The owner is not.' }, { who: 'A', text: "In better news: Servo shows today's sales on his phone. Orders, takings, what is selling. Right now." },
    { who: 'N', text: 'He looked once. It was fine. He looked twice. It was still fine. So he looked at the sea instead.' }, { who: 'N', text: 'Any device. Even the one with sand in it.' }, { who: 'N', text: "And Lindiwe's phone? Silent. For once." },
    { who: 'M', text: 'Another drink, please. And no. I am not calling anyone.' }, { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'Chef Musa is on holiday.\n*His mind is in the kitchen.*'], [1, '“How many have\n*we sold?*”'], [2, '“Chef. You asked\n*five minutes ago.*”'], [3, '“And *now*?”'], [4, '“Chef…”'],
    [5, 'Owner on holiday.\n*Restaurant fine. Owner: not.*'], [6, 'Servo shows today’s sales.\n*On his phone. Right now.*'], [7, 'He looked once. Fine.\n*Twice. Fine. So: the sea.*'], [8, 'Any device.\n*Even this one.*'], [9, 'Lindiwe’s phone?\n*Silent. For once.*'], [10, '“Another drink, please.\n*I am not calling anyone.*”']],
  sx: [[0, 0.5, 'whoosh', 0.6], [1, 0.1, 'buzz', 0.7], [1, 1.2, 'pop'], [2, 0.2, 'pop'], [3, 0.1, 'buzz', 0.7], [3, 0.5, 'pop'], [4, 0.2, 'womp'], [5, -0.3, 'sting'], [6, -0.25, 'ding'], [7, 0.6, 'pop'], [7, 2.2, 'pop'], [7, 4.6, 'whoosh', 0.6],
    [8, 0.6, 'pop'], [8, 1.6, 'tick'], [9, 0.8, 'tick'], [10, 0.4, 'pop'], [10, 1.4, 'chime', 0.8], [11, 0.3, 'whoosh'], [11, 0.8, 'pop', 1.3], [11, 1.4, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { // a split screen: beach above, kitchen below
      const mT = rel.on(1, t) || rel.on(3, t), lT = rel.on(2, t) || rel.on(4, t), ring = (t > rel(1) && t < rel(1) + 0.8) || (t > rel(3) && t < rel(3) + 0.8);
      const art = rect(0, 330, 1080, 560, 0, { fill: '#f4efe0', w: 0 }) + sun(160, 470) + palm(910, 760, 1.1) + sea(700, t) + lounger(330, 840) +
        musa({ x: 360, y: 600, s: 0.85, glasses: true, eyes: 'closed', ...say(mT, t, 'flat'), tilt: -8, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [160, 150], h: [200, 60], hold: smallPhone(0, -20, 10) } }) + line('M0,900 H1080', { w: 10 }) +
        lindiwe({ x: 740, y: 1090, s: 0.9, eyes: lT ? 'half' : 'open', ...say(lT, t, 'flat'), brow: lT ? 'sad' : '', armL: { e: [128, 214], h: [66, 236] }, armR: { e: [160, 150], h: [200, 60], hold: smallPhone(0, -20, -10) } }) + counter(1330) + (ring ? buzz(740, 1150) : '');
      const ui = text(540, 200, 'Chef Musa is *on holiday*.', { font: BRUSH, size: 84, weight: 400 }) + (rel.on(1, t) ? bubble(560, 440, 400, 100, 'How many have we sold?', { p: prog(t, rel(1) + 0.2, rel(1) + 0.5), size: 34, tail: 'l', rot: -2 }) : '') + (t > rel(3) && t < rel(4) ? bubble(560, 440, 240, 90, 'And now?', { p: prog(t, rel(3) + 0.1, rel(3) + 0.4), size: 44, tail: 'l', rot: 2 }) : '') +
        (t > rel(2) && t < rel(3) ? bubble(560, 1000, 440, 110, 'You asked five minutes ago.', { p: prog(t, rel(2) + 0.1, rel(2) + 0.4), size: 34, tail: 'r', rot: 3 }) : '') + (t > rel(4) ? bubble(560, 1000, 200, 90, 'Chef…', { p: prog(t, rel(4) + 0.1, rel(4) + 0.4), size: 44, tail: 'r', rot: -2 }) : '');
      return { art, ui };
    } },
    news(5, { bad: 5, good: 6, ticker: 'OWNER ON HOLIDAY   •   RESTAURANT: FINE   •   OWNER: NOT FINE   •   PHONE CALLS REACH RECORD LEVELS',
      badPip: (t) => grp(path('M-110,0 Q0,-130 110,0 Z', { fill: BRAND, w: 6 }) + line('M0,0 v100', { w: 6 }), 780, 700) + smallPhone(900, 800, 10) + buzz(900, 800),
      goodPip: (t) => grp(rect(-110, -170, 220, 340, 30, { fill: INK, w: 5 }) + rect(-94, -150, 188, 296, 14, { fill: '#fff', w: 2 }) + fillR(-94, -150, 188, 50, 0) + text(0, -112, 'Sales today', { size: 28, fill: '#fff' }) + text(0, -40, 'E 6 480', { size: 44, fill: BRAND }) + [0, 1, 2, 3].map((i) => fillR(-70 + i * 40, 120 - (30 + i * 28) * ease(prog(t, 0.3 + i * 0.1, 0.9 + i * 0.1)), 30, (30 + i * 28) * ease(prog(t, 0.3 + i * 0.1, 0.9 + i * 0.1)))).join(''), 780, 690, pop(prog(t, 0.1, 0.5))) }),
    { s: 7, draw(t, T, len, rel) { // looked once, twice, then the sea
      const look = t < rel(7) + 1.6 ? [3, 6] : t < rel(7) + 3.6 ? [3, 6] : [-8, -2], sea1 = t >= rel(7) + 4.0;
      let inner = fillR(0, 0, 470, 120) + text(235, 78, 'Today (demo data)', { size: 40, fill: '#fff' });
      [['Sales', 'E 6 480'], ['Orders', '63'], ['Avg ticket', 'E 103']].forEach(([a, b], i) => { inner += rect(18 + i * 150, 140, 138, 120, 14, { fill: '#fff', w: 4 }) + text(87 + i * 150, 182, a, { size: 26 }) + text(87 + i * 150, 232, b, { size: 32, fill: BRAND }); });
      inner += text(24, 330, 'Best sellers', { size: 32, anchor: 'start' }) + ['Grilled chicken', 'Kota special', 'Chips'].map((n, i) => text(24, 384 + i * 64, n, { size: 28, anchor: 'start' }) + fillR(24, 396 + i * 64, (330 - i * 70) * ease(prog(t, 0.4 + i * 0.2, 1.0 + i * 0.2)), 18, 9)).join('');
      const art = rect(0, 330, 1080, 520, 0, { fill: '#f4efe0', w: 0 }) + sun(900, 470) + sea(700, t) + palm(160, 760, 1.0) + line('M0,850 H1080', { w: 8 }) +
        musa({ x: 810, y: 1060, s: 1.2, glasses: true, eyes: sea1 ? 'happy' : 'open', mouth: sea1 ? 'grin' : 'smile', look: look, armR: { e: [160, 190], h: [170, 100], hold: smallPhone(0, -20, 10) } });
      return { art, ui: text(540, 230, 'He looked. *It was fine.*', { font: BRUSH, size: 92, weight: 400 }) + phone(90, 900, 470, 480, inner, { id: 7, s: 0.8 }) };
    } },
    { s: 8, draw(t, T, len, rel) { // even a phone with sand in it
      const art = sun(880, 480) + path('M-20,1180 Q300,980 560,1100 T1100,1060 V1460 H-20 Z', { fill: '#efe6c9', w: 7 }) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => circ(80 + i * 130, 1190 + (i % 3) * 40, 5, { fill: INK, w: 1 })).join('') +
        grp(rect(-110, -200, 220, 360, 30, { fill: INK, w: 6 }) + rect(-94, -184, 188, 300, 14, { fill: '#fff', w: 2 }) + fillR(-94, -184, 188, 56, 0) + text(0, -146, 'Sales today', { size: 28, fill: '#fff' }) + [0, 1, 2, 3].map((i) => fillR(-70 + i * 40, 90 - (30 + i * 30) * ease(prog(t, 0.4 + i * 0.1, 1.0 + i * 0.1)), 30, (30 + i * 30) * ease(prog(t, 0.4 + i * 0.1, 1.0 + i * 0.1)))).join('') +
          path('M-120,170 Q-60,90 0,130 T120,150 V200 H-120 Z', { fill: '#efe6c9', w: 5 }), 540, 900, 1.5, -8);
      return { art, ui: text(540, 240, 'Any device.\n*Even this one.*', { font: BRUSH, size: 104, weight: 400, lh: 108 }) };
    } },
    { s: 9, draw(t, T, len, rel) { // silence and a drink
      const dT = rel.on(10, t);
      const art = rect(0, 330, 1080, 520, 0, { fill: '#f4efe0', w: 0 }) + sun(180, 470) + sea(700, t) + palm(930, 760, 1.0) + lounger(380, 820) + line('M0,880 H1080', { w: 10 }) +
        musa({ x: 400, y: 610, s: 1.0, glasses: true, eyes: dT ? 'happy' : 'closed', ...say(dT, t, 'smile'), tilt: -8, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [150, 160], h: [190, 80], hold: grp(path('M-22,-60 h44 l-8,60 h-28 z', { fill: '#fff', w: 5 }) + line('M0,-60 l14,-40', { w: 5 }) + circ(14, -104, 10, { fill: BRAND, w: 3 }), 0, 0) } }) +
        lindiwe({ x: 700, y: 1100, s: 0.95, eyes: blink(t) ? 'closed' : 'happy', mouth: 'smile', tilt: 6, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) + counter(1330) + smallPhone(900, 1260, 90, false);
      return { art, ui: text(540, 200, 'Lindiwe’s phone: *silent.*', { font: BRUSH, size: 88, weight: 400 }) + text(900, 1130, 'z', { size: 50 }) + text(940, 1090, 'Z', { size: 70 }) + (dT ? bubble(640, 450, 460, 120, 'Another drink, please.', { p: prog(t, rel(10) + 0.2, rel(10) + 0.5), size: 38, tail: 'l', rot: 2 }) : '') };
    } },
    end(11, { kind: 'sv', art: (t) => musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
