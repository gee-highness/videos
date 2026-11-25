/* SV05 "Your restaurant on their phone"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, lady, win, counter, mug, mark, news, ownApp, end, holdPhone, light, smallPhone } = K;
const man = (o) => person({ hair: 'short', body: 'tee', glasses: true, ...o });
const EP = {
  id: 'sv05', title: 'Your restaurant on their phone', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: 'Guests love the food. They just forget the name.' }, { who: 'L', text: 'Where did we eat last Friday?' }, { who: 'M', text: 'You know. That place near the robots.' }, { who: 'L', text: 'Which robots?' }, { who: 'M', text: 'The... robots.' },
    { who: 'A', text: 'Breaking news. A hungry couple has been circling the robots for an hour. The restaurant remains somewhere.' }, { who: 'A', text: "In better news: on the Standard plan and up, a restaurant gets its own app. Its name, its logo, its colours, on the guest's phone." },
    { who: 'N', text: 'One tap on the home screen and the menu is open. Rewards too. The owner sets the points and the prizes.' }, { who: 'N', text: 'Guests add it from the QR code on the table, while the food is coming.' },
    { who: 'L', text: 'Musa\'s Grill. It was Musa\'s Grill. It is right here.' }, { who: 'M', text: 'Next to the robots. I told you.' }, { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'Guests love the food.\n*They forget the name.*'], [1, '“Where did we eat\n*last Friday?*”'], [2, '“That place near\n*the robots.*”'], [3, '“*Which* robots?”'], [4, '“The… *robots.*”'],
    [5, 'Circling the robots.\n*Restaurant: somewhere.*'], [6, 'Standard plan and up:\n*their own app.*'], [7, 'One tap on the home screen.\n*Rewards you set.*'], [8, 'Guests add it from\n*the QR on the table.*'], [9, '“It was *Musa’s Grill*.”'], [10, '“Next to the robots.\n*I told you.*”']],
  sx: [[1, 0.2, 'pop'], [2, 0.2, 'pop'], [3, 0.2, 'pop'], [4, 0.2, 'womp', 0.8], [5, -0.3, 'sting'], [6, -0.25, 'ding'], [6, 2.0, 'chime', 0.7], [7, 0.8, 'pop'], [7, 1.5, 'pop'], [7, 2.2, 'pop'], [8, 0.7, 'pop'], [8, 2.2, 'chime'], [9, 0.3, 'pop'], [10, 0.2, 'pop'], [10, 1.4, 'chime', 0.8], [11, 0.3, 'whoosh'], [11, 0.8, 'pop', 1.3], [11, 1.4, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { // the robots
      const lt = Math.floor(t / 1.2) % 3, who = (i) => rel.on(i, t);
      const art = light(110, 520, 1.4, [0, 2, 1][lt]) + light(970, 520, 1.4, [2, 1, 0][lt]) + line('M40,1260 H1040', { w: 7 }) +
        lady({ x: 300, y: 980, s: 1.2, eyes: 'open', ...say(who(1) || who(3), t, 'smile'), brow: t > rel(4) ? 'one' : '', look: [4, 0], armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) +
        man({ x: 780, y: 980, s: 1.2, eyes: t > rel(4) ? 'half' : 'open', ...say(who(2) || who(4), t, 'smile'), sweat: t > rel(4), look: [-4, 0], armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } });
      const ui = text(540, 200, 'Guests love the food.\n*They forget the name.*', { font: BRUSH, size: 88, weight: 400, lh: 94 }) + bubble(300, 560, 400, 120, 'Where did we eat\nlast Friday?', { p: prog(t, rel(1) + 0.1, rel(1) + 0.4), size: 38, tail: 'l', rot: -3 }) +
        bubble(780, 560, 420, 120, 'That place near\nthe robots.', { p: prog(t, rel(2) + 0.1, rel(2) + 0.4), size: 38, tail: 'r', rot: 3 }) + bubble(300, 740, 300, 90, 'Which robots?', { p: prog(t, rel(3) + 0.1, rel(3) + 0.4), size: 38, tail: 'l', rot: -3 }) + bubble(780, 740, 260, 90, 'The… robots.', { p: prog(t, rel(4) + 0.1, rel(4) + 0.4), size: 38, tail: 'r', rot: 3 });
      return { art, ui };
    } },
    news(5, { bad: 5, good: 6, ticker: 'COUPLE CIRCLING THE ROBOTS   •   RESTAURANT REMAINS SOMEWHERE   •   “IT HAD A GREEN DOOR”   •   “NO, THAT WAS LAST YEAR”',
      badPip: (t) => light(640, 520, 0.8, 0) + light(780, 520, 0.8, 2) + light(920, 520, 0.8, 1) + text(780, 840, 'which one?', { size: 40, rot: -4 }),
      goodPip: (t) => grp(rect(-110, -170, 220, 340, 30, { fill: INK, w: 5 }) + rect(-94, -150, 188, 296, 14, { fill: '#fff', w: 2 }) + [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 1 && c === 1) ? mark('MG', 0, 0, 0.5) : rect(-76 + c * 54, -120 + r * 80, 44, 44, 10, { fill: PAPER, w: 3 })).join('')).join(''), 780, 690, pop(prog(t, 0.1, 0.5))) + star(925, 530, 62, { fill: BRAND, w: 5 }) + text(925, 542, 'Standard', { size: 26, fill: '#fff', rot: -10 }) }),
    ownApp(7, { at: 8, name: 'Musa’s Grill', mark: 'MG', rows: [['Grilled chicken', 'E85'], ['Kota special', 'E45'], ['Chips', 'E25']], rewards: true, tag: 'Standard plan and up', title: 'Your restaurant.\n*Your own app.*', titleSize: 90, who: (q) => lady(q) }),
    { s: 9, draw(t, T, len, rel) { // found it
      const art = rect(40, 560, 620, 560, 8, { fill: '#fff' }) + rect(40, 560, 620, 90, 8, { fill: BRAND, w: 7 }) + text(350, 624, 'Musa’s Grill', { font: BRUSH, size: 70, weight: 400, fill: '#fff' }) + rect(120, 740, 180, 380, 6, { fill: PAPER }) + rect(380, 740, 200, 200, 8, { fill: PAPER }) + line('M40,1120 H1040', { w: 7 }) + light(930, 560, 1.4, 2) +
        lady({ x: 330, y: 1160, s: 0.95, headOnly: true, eyes: 'happy', ...say(rel.on(9, t), t, 'grin'), armR: holdPhone(true) }) + man({ x: 700, y: 1160, s: 0.95, headOnly: true, eyes: 'happy', ...say(rel.on(10, t), t, 'smile') });
      return { art, ui: text(540, 230, 'Found it.', { font: BRUSH, size: 130, weight: 400 }) + grp(rect(-60, -100, 120, 200, 14, { fill: INK, w: 5 }) + rect(-48, -86, 96, 172, 6, { fill: '#fff', w: 2 }) + mark('MG', 0, 0, 0.7), 520, 1060, pop(prog(t, 0.2, 0.6)), -6) +
        bubble(300, 450, 460, 130, 'It was Musa’s Grill.\nIt’s right here.', { p: prog(t, rel(9) + 0.1, rel(9) + 0.4), size: 38, tail: 'l', rot: -3 }) + bubble(780, 450, 380, 130, 'Next to the\nrobots. I told you.', { p: prog(t, rel(10) + 0.1, rel(10) + 0.4), size: 38, tail: 'r', rot: 3 }) };
    } },
    end(11, { kind: 'sv', art: (t) => musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
