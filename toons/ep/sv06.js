/* SV06 "Who is working Saturday?"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, lindiwe, lady, gogo, win, counter, mug, news, devices, end } = K;
const cook = (o) => person({ hair: 'chef', body: 'apron', ...o });
const plate2 = (x, y, s = 1) => grp(`<ellipse cx="0" cy="0" rx="70" ry="16" ${st({ fill: '#fff', w: 5 })}/>` + path('M-34,-4 C-38,-44 -6,-54 4,-26 C16,-54 46,-40 38,-4 Z', { fill: PAPER, w: 4 }), x, y, s);
const roster = (w, h, t, rows) => head('Shifts', w, 64) + rows.map(([n, days], i) => text(16, 112 + i * 62, n, { size: 28, anchor: 'start' }) + [0, 1, 2, 3, 4].map((d) => rect(150 + d * ((w - 170) / 5), 84 + i * 62, (w - 170) / 5 - 8, 40, 8, { fill: days.includes(d) ? BRAND : '#fff', w: 3 })).join('')).join('');
const EP = {
  id: 'sv06', title: 'Who is working Saturday?', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: 'Saturday morning. Chef Musa checks the roster.' }, { who: 'M', text: 'The roster is a piece of paper. It was rained on.' }, { who: 'N', text: 'Three cooks arrived. Zero waiters.' }, { who: 'L', text: "Chef. I'm a cook. Why am I holding a plate?" },
    { who: 'M', text: "Walk. Just walk. Don't make eye contact with the customers." }, { who: 'A', text: 'Breaking news. Three cooks are serving tables. Two plates are in the air. The roster is still wet.' },
    { who: 'A', text: 'In better news: Servo has staff schedules, shifts, and a clock-in screen at the kitchen door.' }, { who: 'N', text: 'Everyone sees their shift. Everyone clocks in. The hours add up on their own.' },
    { who: 'N', text: "Staff and roles, set up in minutes. On the owner's tablet, phone or laptop." }, { who: 'N', text: 'And next Saturday?' }, { who: 'M', text: 'Three cooks. Two waiters. And a roster that stays dry.' }, { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'Saturday morning.\n*Chef checks the roster.*'], [1, '“A piece of paper.\n*It was rained on.*”'], [2, 'Three cooks arrived.\n*Zero waiters.*'], [3, '“Why am I holding\n*a plate?*”'], [4, '“Just walk. *No eye contact.*”'],
    [5, 'Cooks serving tables.\n*The roster is still wet.*'], [6, 'Shifts. Schedules.\n*Clock-in at the kitchen door.*'], [7, 'Everyone sees their shift.\n*The hours add up.*'], [8, 'Set up in minutes.\n*Any device.*'], [9, 'And next Saturday?'], [10, '“Three cooks. Two waiters.\n*A roster that stays dry.*”']],
  sx: [[0, 0.8, 'pop'], [1, 0.8, 'womp', 0.7], [2, 0.4, 'pop'], [2, 1.2, 'pop'], [2, 2.0, 'pop'], [3, 0.2, 'pop'], [4, 0.2, 'pop'], [5, -0.3, 'sting'], [6, -0.25, 'ding'], [7, 0.6, 'tick'], [7, 1.8, 'pop'], [7, 3.2, 'chime'], [8, 0.6, 'pop'], [8, 1.3, 'pop'], [8, 2.0, 'pop'],
    [9, 0.3, 'tick'], [10, 0.3, 'pop'], [10, 1.4, 'chime', 0.8], [11, 0.3, 'whoosh'], [11, 0.8, 'pop', 1.3], [11, 1.4, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { // the rained-on roster
      const drip = (i) => ((t * 1.4 + i * 0.37) % 1) * 160;
      const art = musa({ x: 300, y: 860, s: 1.55, eyes: 'half', ...say(rel.on(1, t), t, 'flat'), brow: 'sad', look: [4, 5], tilt: -4, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [160, 170], h: [250, 70] } }) + counter(1290);
      const paper = grp(rect(-190, -260, 380, 520, 8, { fill: '#e9e5d8', w: 7 }) + [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${-90 + (i % 2) * 120}" cy="${-170 + i * 80}" rx="${70 + i * 8}" ry="22" fill="#9fb4d9" opacity="0.55"/>`).join('') + text(0, -190, 'SAT', { size: 60, rot: -4 }) + [0, 1, 2].map((i) => text(-120, -100 + i * 80, ['Si?o', 'Th?ndi', 'B?eki'][i], { size: 40, anchor: 'start' })).join('') +
        [0, 1, 2, 3].map((i) => line(`M${-120 + i * 80},260 v${drip(i)}`, { w: 7, stroke: '#7d97c9' })).join(''), 760, 700, 1, 4 + wig(t, 0.5, 2));
      return { art, ui: text(540, 190, 'Saturday morning.\n*The roster.*', { font: BRUSH, size: 92, weight: 400, lh: 96 }) + paper + (rel.on(1, t) ? bubble(310, 520, 440, 130, 'It was\nrained on.', { p: prog(t, rel(1) + 0.9, rel(1) + 1.2), size: 44, tail: 'l', rot: -3 }) : '') };
    } },
    { s: 2, draw(t, T, len, rel) { // three cooks, zero waiters
      const cooks = [[330, lady, 0.3], [600, gogo, 0.9], [870, lindiwe, 1.5]], walk = wig(t, 1.2, 6);
      const art = cooks.map(([x, mk, at], i) => { const p = pop(prog(t, rel(2) + at, rel(2) + at + 0.4)); if (!p) return ''; const l = i === 2 && rel.on(3, t);
        return grp(cook({ x: 0, y: 0, s: 1, hair: 'chef', body: 'apron', glasses: i === 1, earrings: i !== 1, eyes: t > rel(3) ? 'wide' : 'half', ...say(l, t, 'o'), look: [i === 0 ? 5 : -5, -4], sweat: true, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [150, 160], h: [170 + walk, 70], hold: plate2(0, 0, 0.8) } }), x, 960 + walk * (i - 1), p * 1.05); }).join('') +
        musa({ x: 90, y: 1170, s: 0.8, headOnly: true, eyes: 'half', ...say(rel.on(4, t), t, 'flat'), brow: 'angry', look: [4, -3] }) + counter(1290);
      const ui = text(540, 200, 'Three cooks.\n*Zero waiters.*', { font: BRUSH, size: 100, weight: 400, lh: 100 }) + bubble(850, 600, 400, 140, 'Why am I holding\na plate?', { p: prog(t, rel(3) + 0.1, rel(3) + 0.4), size: 38, tail: 'r', rot: 3 }) + bubble(400, 1040, 440, 100, 'Don’t make eye contact.', { p: prog(t, rel(4) + 0.5, rel(4) + 0.8), size: 36, tail: 'l', rot: -2 });
      return { art, ui };
    } },
    news(5, { bad: 5, good: 6, ticker: 'THREE COOKS SERVING TABLES   •   TWO PLATES IN THE AIR   •   ROSTER STILL WET   •   NOBODY WILL MAKE EYE CONTACT',
      badPip: (t) => [0, 1].map((i) => plate2(700 + i * 160, 640 + wig(t, 0.8, 24, i), 1.1)).join('') + grp(rect(-80, -110, 160, 220, 6, { fill: '#e9e5d8', w: 5 }) + text(0, 10, 'wet', { size: 40 }), 900, 790, 1, 8),
      goodPip: (t) => grp(rect(-190, -130, 380, 260, 16, { fill: INK, w: 6 }) + rect(-176, -116, 352, 232, 8, { fill: '#fff', w: 2 }) + fillR(-176, -116, 352, 36, 0) + [0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => rect(-160 + c * 66, -60 + r * 56, 56, 40, 8, { fill: [0, 6, 7, 13, 14].includes(r * 5 + c) ? BRAND : '#fff', w: 3 })).join('')).join(''), 780, 690, pop(prog(t, 0.1, 0.5))) }),
    { s: 7, draw(t, T, len, rel) { // roster and clock-in
      const clk = t > rel(7) + 2.0, ok = t > rel(7) + 2.8;
      const rost = roster(440, 400, t, [['Lindiwe', [0, 1, 4]], ['Bheki', [1, 2, 3]], ['Zodwa', [0, 3, 4]], ['Thabo', [2, 4]]]);
      const kiosk = head('Clock in', 440, 64) + text(220, 140, 'Search for your name', { size: 28 }) + rect(20, 170, 400, 60, 30, { fill: '#fff', w: 4 }) + text(220, 212, clk ? 'Lindiwe' : '', { size: 34 }) + rect(20, 280, 400, 76, 38, { fill: ok ? INK : BRAND, w: 0 }) + text(220, 330, ok ? 'Clocked in ✓' : 'Clock in', { size: 36, fill: '#fff' });
      const art = lindiwe({ x: 800, y: 1120, s: 0.85, eyes: ok ? 'happy' : 'open', mouth: ok ? 'grin' : 'smile', armR: { e: [150, 170], h: [160, 60] } });
      return { art, ui: text(540, 230, 'Everyone *clocks in*.', { font: BRUSH, size: 100, weight: 400 }) + screen(40, 380, 440, 400, rost, { kind: 'monitor', p: pop(prog(t, 0.2, 0.6)) }) + screen(560, 380, 440, 400, kiosk, { kind: 'monitor', p: pop(prog(t, 0.8, 1.2)) }) + text(540, 1000, 'demo data', { size: 30 }) };
    } },
    devices(8, { owner: musa, kind: 'sv', names: ['Shifts', 'Clock in', 'Hours'],
      s1: () => head('Shifts', 210, 70) + ['Lindiwe', 'Bheki', 'Zodwa'].map((n, i) => text(16, 130 + i * 56, n, { size: 28, anchor: 'start' }) + fillR(130, 108 + i * 56, 64, 30, 10)).join(''),
      s2: () => text(170, 56, 'Clock in', { size: 44 }) + rect(30, 90, 280, 56, 28, { fill: BRAND, w: 0 }) + text(170, 130, 'Clock in', { size: 32, fill: '#fff' }) + text(170, 200, 'Lindiwe ✓', { size: 32 }),
      s3: (g) => text(150, 48, 'Hours', { size: 40 }) + [0, 1, 2].map((i) => fillR(24, 74 + i * 38, (220 - i * 50) * g(i), 24, 8)).join('') }),
    { s: 9, draw(t, T, len, rel) { // next Saturday
      const line5 = [[150, cook, 'chef'], [320, cook, 'chef'], [490, cook, 'chef'], [660, lindiwe, 'afro'], [830, lady, 'afro']];
      const art = line5.map(([x, mk], i) => mk({ x, y: 960, s: 0.62, eyes: 'happy', mouth: 'smile', ...(i > 2 ? {} : {}) })).join('') + musa({ x: 540, y: 600, s: 0.7, headOnly: true, eyes: 'happy', ...say(rel.on(10, t), t, 'grin') }) + counter(1290) +
        grp(rect(-190, -130, 380, 260, 16, { fill: INK, w: 6 }) + rect(-176, -116, 352, 232, 8, { fill: '#fff', w: 2 }) + fillR(-176, -116, 352, 36, 0) + text(0, -88, 'Saturday', { size: 28, fill: '#fff' }), 540, 1130, 0.7);
      const ui = text(540, 230, 'Next Saturday.', { font: BRUSH, size: 110, weight: 400 }) + grp(path('M-230,10 Q0,-150 230,10 Z', { fill: BRAND, w: 7 }) + line('M0,10 v110', { w: 7 }), 540, 1010, pop(prog(t, 0.3, 0.7))) +
        (rel.on(10, t) ? bubble(540, 440, 480, 120, 'A roster that stays dry.', { p: prog(t, rel(10) + 0.8, rel(10) + 1.1), size: 40, tail: '', rot: 0 }) : '');
      return { art, ui };
    } },
    end(11, { kind: 'sv', art: (t) => musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
