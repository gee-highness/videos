/* SV04 "Out of chips at one"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, lindiwe, lady, win, counter, mug, news, devices, end } = K; const man = (o) => person({ hair: "short", body: "tee", glasses: true, ...o });
const ticket = (x, y, rot = 0, s = 1) => grp(rect(-44, -64, 88, 128, 4, { fill: '#fff', w: 5 }) + line('M-26,-34 h52 M-26,-8 h52 M-26,18 h34', { w: 4 }) + text(0, 50, 'chips', { size: 24 }), x, y, s, rot);
const bag = (x, y, s = 1, full = false, rot = 0) => grp(path('M-100,-120 h200 l16,240 h-232 z', { fill: '#fff', w: 7 }) + rect(-100, -150, 200, 40, 6, { fill: '#fff', w: 6 }) + rect(-64, -70, 128, 70, 8, { fill: PAPER, w: 4 }) + text(0, -24, 'CHIPS', { size: 44 }) + (full ? [0, 1, 2, 3].map((i) => rect(-60 + i * 30, -178 - (i % 2) * 14, 18, 56, 4, { fill: '#fff', w: 4 })).join('') : ''), x, y, s, rot);
const potato = (x, y, s = 1, rot = 0, t = 0) => grp(path('M-60,0 C-70,-50 -10,-72 40,-52 C80,-34 72,34 20,48 C-30,60 -56,34 -60,0Z', { fill: '#e7d8b3', w: 6 }) + circ(-18, -14, 5, { fill: INK, w: 1 }) + circ(18, -20, 5, { fill: INK, w: 1 }) + line('M-12,10 q14,12 28,0', { w: 4 }), x, y, s, rot);
const EP = {
  id: 'sv04', title: 'Out of chips at one', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: "One o'clock. Lunch rush. Everybody wants chips." }, { who: 'L', text: 'Chef. Table five wants chips. Table six wants chips. Everybody wants chips.' }, { who: 'M', text: 'There are no chips.' },
    { who: 'N', text: 'There was one bag of chips. It was a rumour.' }, { who: 'A', text: 'Breaking news. A restaurant has run out of chips at lunchtime. Residents are devastated. A single potato has been spotted.' },
    { who: 'A', text: 'In better news: Servo flags what is running low, so you hear about it at ten, not at one.' }, { who: 'N', text: 'Suppliers and purchase orders live there too. Ordering more takes a minute, not a phone tree.' },
    { who: 'N', text: 'When the delivery arrives, you receive it, and the stock goes up by itself.' }, { who: 'N', text: 'Sales, stock and staff. On whatever device is nearest.' }, { who: 'N', text: 'And lunch?' },
    { who: 'M', text: 'Chips for everyone. And I am hugging this bag.' }, { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'One o’clock. Lunch rush.\n*Everybody wants chips.*'], [1, '“Table five. Table six.\n*Everybody.*”'], [2, '“There are *no chips*.”'], [3, 'There was one bag.\n*It was a rumour.*'], [4, 'Out of chips at lunchtime.\n*One potato spotted.*'],
    [5, 'Servo flags what’s low.\n*At ten, not at one.*'], [6, 'Suppliers. Purchase orders.\n*A minute, not a phone tree.*'], [7, 'Delivery arrives. Receive it.\n*Stock goes up.*'], [8, 'Sales. Stock. Staff.\n*Any device.*'], [9, 'And lunch?'], [10, '“Chips for everyone.\n*I am hugging this bag.*”']],
  sx: [[0, 0.5, 'tick'], [0, 1.2, 'tick'], [1, 0.2, 'pop'], [2, 0.2, 'womp'], [3, 0.6, 'tick'], [3, 1.8, 'whoosh', 0.7], [4, -0.3, 'sting'], [5, -0.25, 'ding'], [6, 0.8, 'tick'], [6, 2.0, 'pop'], [6, 3.4, 'chime', 0.8], [7, 0.8, 'whoosh'], [7, 1.8, 'thud'], [7, 2.8, 'chime'],
    [8, 0.6, 'pop'], [8, 1.3, 'pop'], [8, 2.0, 'pop'], [9, 0.3, 'tick'], [10, 0.2, 'pop'], [10, 1.2, 'chime'], [11, 0.3, 'whoosh'], [11, 0.8, 'pop', 1.3], [11, 1.4, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { // lunch rush
      const hand = (Math.PI * 2 * (t / 60)) , talkL = rel.on(1, t);
      const art = circ(900, 450, 74, { fill: '#fff' }) + line(`M900,450 l0,-50 M900,450 l${Math.sin(Math.PI / 6) * 36},${-Math.cos(Math.PI / 6) * 36}`, { w: 6 }) + circ(900, 450, 5, { fill: INK, w: 1 }) + line('M60,560 H1020', { w: 8 }) +
        Array.from({ length: 8 }, (_, i) => ticket(110 + i * 120, 640 + wig(t, 1.2, 4, i), wig(t, 1, 3, i * 2))).join('') +
        musa({ x: 270, y: 1000, s: 1.2, eyes: blink(t) ? 'closed' : 'open', mouth: 'smile', sweat: t > 3, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) +
        lindiwe({ x: 810, y: 1000, s: 1.2, eyes: 'wide', ...say(talkL, t, 'o'), brow: 'up', sweat: true, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) + counter(1290);
      return { art, ui: text(540, 200, 'One o’clock.\n*Everybody wants chips.*', { font: BRUSH, size: 92, weight: 400, lh: 98 }) + (talkL ? bubble(780, 790, 430, 120, 'Table 5. Table 6.\nEverybody.', { p: prog(t, rel(1) + 0.2, rel(1) + 0.5), size: 40, tail: 'r', rot: 3 }) : '') };
    } },
    { s: 2, draw(t, T, len, rel) { // the bag was a rumour
      const roll = prog(t, rel(3) + 1.0, rel(3) + 3.4);
      const art = counter(1180) + musa({ x: 340, y: 830, s: 1.55, eyes: 'wide', ...say(rel.on(2, t), t, 'flat'), brow: 'sad', look: [4, 6], armL: { e: [128, 214], h: [66, 246] }, armR: { e: [150, 200], h: [200, 190] } }) + bag(640, 1120, 1.1, false, -8) +
        (t > rel(3) ? potato(lerp(1060, 300, roll), 1120 - Math.abs(Math.sin(roll * 14)) * 28, 0.5, roll * -900) : '');
      const ui = text(540, 230, 'The bag was\n*a rumour.*', { font: BRUSH, size: 100, weight: 400, lh: 100 }) + (t > rel(3) ? grp(`<ellipse cx="0" cy="0" rx="180" ry="90" ${st({ fill: '#fff', w: 5 })}/>` + text(0, 14, 'rumour?', { size: 54 }) + circ(-40, 130, 14, { w: 4 }) + circ(-70, 170, 8, { w: 4 }), 700, 700, pop(prog(t, rel(3) + 0.5, rel(3) + 0.9))) : '');
      return { art, ui };
    } },
    news(4, { bad: 4, good: 5, ticker: 'RESTAURANT OUT OF CHIPS   •   RESIDENTS DEVASTATED   •   A SINGLE POTATO SPOTTED   •   POTATO DECLINES TO COMMENT',
      badPip: (t) => potato(780, 720, 1.5, wig(t, 0.5, 6)) + line('M700,560 L760,640 M860,560 L800,640', { w: 4 }) + text(780, 840, 'SPOTTED', { size: 40, rot: 4 }),
      goodPip: (t) => grp(rect(-180, -120, 360, 240, 16, { fill: INK, w: 6 }) + rect(-166, -106, 332, 212, 8, { fill: '#fff', w: 2 }) + fillR(-166, -106, 332, 46, 0) + text(0, -72, 'Stock', { size: 30, fill: '#fff' }) +
        text(-140, -14, 'Chips', { size: 34, anchor: 'start' }) + fillR(40, -44, 110, 44, 22) + text(95, -12, 'LOW', { size: 28, fill: '#fff' }) + text(-140, 50, 'Buns', { size: 34, anchor: 'start' }) + text(100, 50, 'ok', { size: 32 }), 780, 700, pop(prog(t, 0.1, 0.5))) }),
    { s: 6, draw(t, T, len, rel) { // purchase order
      const a = rel(6) + 1.2, b = rel(6) + 2.8;
      let inner = head(t < a ? 'Stock' : 'Purchase order', 470, 100);
      if (t < a) { inner += text(24, 170, 'Chips', { size: 40, anchor: 'start' }) + fillR(300, 130, 140, 54, 27) + text(370, 168, 'LOW', { size: 32, fill: '#fff' }) + rect(24, 230, 422, 80, 40, { fill: BRAND, w: 0 }) + text(235, 284, 'Order from supplier', { size: 34, fill: '#fff' }); }
      else { inner += text(24, 170, 'Supplier', { size: 32, anchor: 'start' }) + rect(24, 190, 422, 66, 12, { fill: '#fff', w: 4 }) + text(48, 234, 'Potato & chip supplies', { size: 30, anchor: 'start' }) + rect(24, 290, 422, 90, 12, { fill: '#fff', w: 4 }) + text(48, 346, 'Chips (bags)', { size: 34, anchor: 'start' }) + text(420, 346, '20', { size: 44, anchor: 'end', fill: BRAND }) +
        rect(24, 420, 422, 80, 40, { fill: t > b ? INK : BRAND, w: 0 }) + text(235, 474, t > b ? 'Order sent ✓' : 'Send order', { size: 36, fill: '#fff' }); }
      const art = musa({ x: 830, y: 1020, s: 1.2, eyes: t > b ? 'happy' : 'open', mouth: t > b ? 'grin' : 'smile', look: [-3, 0], armL: { e: [128, 214], h: [66, 236] }, armR: { e: [134, 190], h: [76, 120] } });
      return { art, ui: text(540, 250, 'Order more. *A minute.*', { font: BRUSH, size: 100, weight: 400 }) + phone(90, 390, 470, 620, inner, { id: 6 }) + text(325, 1060, 'demo data', { size: 30 }) };
    } },
    { s: 7, draw(t, T, len, rel) { // delivery received: stock goes up
      const rec = t > rel(7) + 1.6, fill = ease(prog(t, rel(7) + 1.6, rel(7) + 2.8)), walk = ease(prog(t, rel(7) + 0.2, rel(7) + 1.3));
      let inner = head('Receive order', 470, 100) + text(24, 170, 'Chips (bags)', { size: 38, anchor: 'start' }) + text(446, 170, rec ? '20 in' : '20 due', { size: 38, anchor: 'end', fill: BRAND }) +
        rect(24, 220, 422, 80, 40, { fill: rec ? INK : BRAND, w: 0 }) + text(235, 274, rec ? 'Received ✓' : 'Receive', { size: 36, fill: '#fff' }) + text(24, 380, 'Chips in stock', { size: 34, anchor: 'start' }) + rect(24, 404, 422, 40, 20, { fill: '#fff', w: 4 }) + fillR(28, 408, 6 + 408 * fill, 32, 16) + text(446, 480, rec ? '20' : '0', { size: 40, anchor: 'end' });
      const art = (walk < 1 ? '' : '') + man({ x: lerp(1200, 860, walk), y: 1040, s: 1.1, eyes: 'open', mouth: 'smile', armR: { e: [150, 150], h: [170, 60], hold: bag(0, -20, 0.38, true) } });
      return { art, ui: text(540, 250, 'Receive it. *Stock goes up.*', { font: BRUSH, size: 92, weight: 400 }) + phone(90, 390, 470, 620, inner, { id: 7 }) + text(325, 1060, 'demo data', { size: 30 }) };
    } },
    devices(8, { owner: musa, kind: 'sv' }),
    { s: 9, draw(t, T, len, rel) { // chips for everyone
      const art = musa({ x: 330, y: 860, s: 1.55, eyes: 'happy', ...say(rel.on(10, t), t, 'grin'), tilt: wig(t, 0.6, 3), armL: { e: [128, 214], h: [60, 280] }, armR: { e: [128, 214], h: [120, 280] } }) + bag(450, 1030, 1.5, true, -6) + counter(1290) +
        lady({ x: 850, y: 1000, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [66, 236] } }) + lindiwe({ x: 1010, y: 1100, s: 0.7, eyes: 'happy', mouth: 'smile' });
      return { art, ui: text(540, 230, 'Lunch. *Saved.*', { font: BRUSH, size: 110, weight: 400 }) + (rel.on(10, t) ? bubble(270, 560, 420, 130, 'Chips for everyone.', { p: prog(t, rel(10) + 0.2, rel(10) + 0.5), size: 44, tail: 'l', rot: -3 }) : '') };
    } },
    end(11, { kind: 'sv', art: (t) => musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
