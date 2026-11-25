/* SV08 "Founding spots"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Offer wording: servo-pos docs/POSTING_PLAN.md section 3. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, news, end, holdPhone } = K;
const nomsa = (o) => person({ hair: 'puff', body: 'blazer', glasses: true, earrings: true, ...o });
const EP = {
  id: 'sv08', title: 'Founding spots', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'A', text: 'Good evening. I read the news. It is usually bad news.' }, { who: 'A', text: 'Tonight, there is good news. For ten restaurants.' }, { who: 'A', text: 'Servo has ten founding spots. The first five restaurants get six months free.' },
    { who: 'A', text: 'Restaurants six to ten get three months free. After the first ten, a short free period may apply.' }, { who: 'N', text: 'That is the whole story. It really is that simple.' },
    { who: 'A', text: 'You get the till, the kitchen screen, table QR ordering, stock and sales reports. And on the Standard plan and up, your own restaurant app.' }, { who: 'A', text: 'I am told this is the point where I should smile.' },
    { who: 'N', text: 'She is trying.' }, { who: 'A', text: 'The live demo is open, with no sign-up. Try it before you decide.' }, { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'I read the news.\n*It is usually bad.*'], [1, 'Tonight:\n*good news.*'], [2, 'Ten founding spots.\n*First five: 6 months free.*'], [3, 'Spots 6 to 10:\n*3 months free.*'], [4, 'That is the whole story.'],
    [5, 'Till. Kitchen screen. Table QR.\n*Stock and sales reports.*'], [6, '“I am told I should *smile*.”'], [7, 'She is trying.'], [8, 'The live demo is open.\n*No sign-up.*']],
  sx: [[0, 0.8, 'tick'], [1, -0.25, 'sting'], [1, 0.1, 'ding'], [2, 0.8, 'pop'], [2, 1.3, 'pop'], [2, 1.8, 'pop'], [2, 2.3, 'pop'], [2, 2.8, 'pop'], [3, 0.3, 'pop'], [3, 0.8, 'pop'], [3, 1.3, 'pop'], [3, 1.8, 'pop'], [3, 2.3, 'pop'], [3, 3.2, 'chime'],
    [4, 0.5, 'tick'], [5, 0.6, 'pop'], [5, 1.9, 'pop'], [5, 3.2, 'pop'], [5, 4.5, 'pop'], [5, 6.0, 'chime'], [6, 1.0, 'whoosh', 0.7], [7, 0.8, 'tick'], [7, 1.4, 'tick'], [7, 2.0, 'tick'], [7, 2.4, 'chime'], [8, 0.4, 'pop'], [8, 1.2, 'pop'], [9, 0.3, 'whoosh'], [9, 0.8, 'pop', 1.3], [9, 1.4, 'ding', 0.7]],
  scenes: [
    news(0, { bad: 0, good: 1, ticker: 'ONE ANCHOR   •   TEN SPOTS   •   NO DRAMA   •   FRIDGE DECLINES TO COMMENT',
      badPip: (t) => path('M-80,-20 q-40,-70 40,-80 q40,-70 100,-10 q70,10 40,70 Z', { fill: '#cfc8b6', w: 6 }) .replace('<path', `<path transform="translate(780,690)"`) + line('M730,730 l-10,40 M780,740 l-10,40 M830,730 l-10,40', { w: 5 }) + text(780, 860, 'BAD NEWS', { size: 44 }),
      goodPip: (t) => text(780, 700, '10', { font: BRUSH, size: 220, weight: 400, fill: BRAND }) + text(780, 800, 'spots', { size: 54 }) }),
    { s: 2, draw(t, T, len, rel) { // the offer, as drawn
      const tile = (i) => { const row = i < 5 ? 0 : 1, a = row === 0 ? rel(2) + 0.7 + i * 0.5 : rel(3) + 0.2 + (i - 5) * 0.5, p = pop(prog(t, a, a + 0.3));
        return grp(rect(-70, -70, 140, 140, 18, { fill: p > 0 ? (row === 0 ? BRAND : '#d9d0f7') : '#fff', w: 5 }) + text(0, 18, String(i + 1), { size: 64, fill: p > 0 && row === 0 ? '#fff' : INK }), 125 + (i % 5) * 207, 560 + row * 210, 1); };
      const ui = text(540, 230, 'Ten *founding spots*.', { font: BRUSH, size: 104, weight: 400 }) + Array.from({ length: 10 }, (_, i) => tile(i)).join('') +
        (t > rel(2) + 0.4 ? text(540, 400, 'The first 5 restaurants:  6 months free', { size: 44, fill: INK }) : '') + (t > rel(3) ? text(540, 920, 'Restaurants 6 to 10:  3 months free', { size: 44 }) : '') +
        (t > rel(3) + 2.8 ? text(540, 1010, 'After the first 10, a short free\nperiod may apply.', { size: 36 }) : '');
      return { art: nomsa({ x: 540, y: 1250, s: 0.6, headOnly: true, eyes: blink(t) ? 'closed' : 'open', ...say(rel.on(2, t) || rel.on(3, t), t, 'flat'), brow: 'one' }), ui };
    } },
    { s: 4, draw(t, T, len, rel) { // that is the whole story
      const out = newsDesk(t, { good: true, talking: false, ticker: 'THAT IS THE WHOLE STORY   •   IT IS REALLY THAT SIMPLE   •   NOMSA HAS NO FURTHER COMMENT', pip: text(780, 640, 'THE\nWHOLE\nSTORY', { font: BRUSH, size: 66, weight: 400, lh: 72, rot: -4 }) + line('M690,830 h180', { w: 8, stroke: BRAND }) });
      return out;
    } },
    { s: 5, draw(t, T, len, rel) { // what you get
      const items = [['Till', 0.5], ['Kitchen screen', 1.8], ['Table QR ordering', 3.1], ['Stock and sales reports', 4.4], ['Your own app (Standard plan and up)', 5.7]];
      const ui = text(540, 230, 'What you get.', { font: BRUSH, size: 110, weight: 400 }) + items.map(([n, a], i) => { const p = pop(prog(t, rel(5) + a, rel(5) + a + 0.35)); return p ? grp(rect(-420, -52, 840, 104, 20, { fill: '#fff', w: 5 }) + circ(-360, 0, 30, { fill: BRAND, w: 4 }) + line('M-374,0 l10,12 l22,-26', { w: 7, stroke: '#fff' }) + text(-300, 14, n, { size: i === 4 ? 38 : 48, anchor: 'start' }), 540, 420 + i * 150, p) : ''; }).join('');
      return { art: nomsa({ x: 900, y: 1280, s: 0.55, headOnly: true, eyes: 'open', ...say(rel.on(5, t), t, 'flat'), brow: 'one' }), ui };
    } },
    { s: 6, draw(t, T, len, rel) { // she tries to smile
      const tryT = t - rel(7), mouth = t < rel(7) ? 'flat' : tryT < 0.6 ? 'frown' : tryT < 2.2 ? (Math.floor(tryT * 7) % 2 ? 'grin' : 'flat') : 'grin';
      const art = nomsa({ x: 540, y: 760, s: 2.0, eyes: tryT > 2.2 ? 'happy' : tryT > 0.6 ? 'half' : 'open', ...(rel.on(6, t) ? { mouth: 'talk', tk: flap(t) } : { mouth }), brow: tryT > 0.6 && tryT < 2.2 ? 'angry' : 'one', sweat: tryT > 0.8 && tryT < 2.2, tilt: tryT > 0.6 ? wig(t, 4, 2) : 0 });
      const card = pop(prog(t, rel(6) + 1.2, rel(6) + 1.6));
      return { art, ui: (card ? grp(rect(-150, -70, 300, 140, 12, { fill: '#fff', w: 7 }) + text(0, 26, 'SMILE', { font: BRUSH, size: 100, weight: 400, fill: BRAND }), 880, 1180, card, 6) + circ(940, 1290, 24, { w: 5 }) : '') + text(540, 200, '', { size: 10 }) };
    } },
    { s: 8, draw(t, T, len, rel) { // the live demo
      const art = nomsa({ x: 850, y: 1070, s: 1.3, eyes: 'happy', mouth: 'grin', tilt: wig(t, 0.6, 3), armL: { e: [130, 190], h: [180, 80] } });
      let inner = fillR(0, 0, 470, 120) + text(235, 76, 'servo-pos.vercel.app', { size: 36, fill: '#fff' }) + text(235, 190, 'Live demo', { size: 56 });
      ['Take an order', 'Kitchen screen', 'Reports'].forEach((n, i) => { const p = pop(prog(t, 0.5 + i * 0.4, 0.8 + i * 0.4)); if (p) inner += grp(rect(-190, -40, 380, 80, 40, { fill: '#fff', w: 4 }) + text(0, 12, n, { size: 36 }), 235, 300 + i * 110, p); });
      return { art, ui: text(540, 230, 'Try it first.', { font: BRUSH, size: 120, weight: 400 }) + phone(90, 390, 470, 700, inner, { id: 8 }) + star(500, 410, 100, { fill: BRAND, w: 5 }) + text(500, 420, 'No sign-up', { size: 28, fill: '#fff', rot: -10 }) };
    } },
    end(9, { kind: 'sv', art: (t) => nomsa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
