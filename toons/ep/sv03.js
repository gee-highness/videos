/* SV03 "The till is short"  Servo POS. Lines: scripts/toons/termux-batch2.sh. Timing follows the voice files (EP.auto). */
const { fillR, head, say, musa, lindiwe, win, counter, mug, news, end, holdPhone, smallPhone } = K;
const notes = (x, y, n, s = 1) => Array.from({ length: n }, (_, i) => rect(x + i * 6 - n * 3, y - i * 9, 120 * s, 54 * s, 4, { fill: i % 2 ? '#e8f4ec' : '#fff', w: 4 })).join('');
const drawer = (x, y, s = 1) => grp(rect(-230, -40, 460, 120, 10, { fill: '#fff', w: 7 }) + [-150, -50, 50, 150].map((bx) => rect(bx - 40, -20, 80, 90, 4, { fill: '#fff', w: 4 })).join('') + rect(-200, -90, 400, 56, 8, { fill: INK, w: 6 }), x, y, s);
const note50 = (x, y, s = 1, rot = 0) => grp(rect(-90, -44, 180, 88, 6, { fill: '#e8f4ec', w: 5 }) + circ(0, 0, 26, { w: 4, fill: 'none' }) + text(0, 12, 'E50', { size: 36 }), x, y, s, rot);
const EP = {
  id: 'sv03', title: 'The till is short', auto: true, brand: '#8A6CF0', accentOnInk: '#C9BBFF', url: 'servo-pos.vercel.app', logoFile: 'toons/logos/servo-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: 'End of the day. Time to count the till.' }, { who: 'M', text: 'One thousand, two hundred and... no. Let me start again.' }, { who: 'N', text: 'He counted three times. He got three answers.' },
    { who: 'M', text: 'Lindiwe. Be honest. Where is the fifty?' }, { who: 'L', text: 'Chef. Which fifty?' }, { who: 'A', text: 'Breaking news. A till is short. The staff are calm. The chef is not.' },
    { who: 'A', text: "In better news: Servo records every sale, so the day's takings are already added up." }, { who: 'N', text: 'Run a report by day, or by person. Not to blame anyone. Just to stop the arguing.' },
    { who: 'N', text: 'He checks it from his phone, at home, while dinner is still warm.' }, { who: 'N', text: 'And the missing fifty?' }, { who: 'M', text: 'It was in my apron. It is always in the apron.' },
    { who: 'N', text: 'Servo. Run your whole restaurant from one screen. Try the live demo.' },
  ],
  caps: [[0, 'End of the day.\n*Count the till.*'], [1, '“One thousand, two hundred\nand… *no.* Again.”'], [2, 'Counted three times.\n*Three answers.*'], [3, '“Lindiwe. Be honest.\n*Where is the fifty?*”'], [4, '“Chef.\n*Which* fifty?”'],
    [5, 'The till is short.\n*The chef is not calm.*'], [6, 'Servo records every sale.\n*Takings: added up.*'], [7, 'By day. By person.\n*Not to blame. To stop the arguing.*'], [8, 'From his phone.\n*Dinner still warm.*'], [9, 'And the missing fifty?'], [10, '“It was in\n*my apron.*”']],
  sx: [[0, 1.2, 'tick'], [1, 0.4, 'tick'], [1, 1.0, 'tick'], [1, 2.4, 'womp', 0.7], [2, 0.8, 'pop'], [2, 1.6, 'pop'], [2, 2.4, 'pop', 1.2], [3, 0.2, 'thud'], [4, 0.2, 'pop'], [5, -0.3, 'sting'], [6, -0.25, 'ding'], [7, 0.8, 'tick'], [7, 2.0, 'pop'], [7, 3.6, 'chime', 0.8],
    [8, 0.6, 'pop'], [8, 1.6, 'chime', 0.7], [9, 0.8, 'tick'], [10, 0.8, 'whoosh', 0.8], [10, 1.6, 'chime'], [11, 0.3, 'whoosh'], [11, 0.8, 'pop', 1.3], [11, 1.4, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { // counting the till, three times
      const c = Math.floor((t - rel(2)) / 0.9), tot = ['E1,240', 'E1,190', 'E1,265'];
      const art = musa({ x: 330, y: 780, s: 1.5, eyes: t > rel(1) + 1.6 ? 'half' : 'open', ...say(rel.on(1, t), t, 'flat'), brow: t > rel(2) ? 'sad' : '', sweat: t > rel(2), look: [3, 5], armL: { e: [128, 214], h: [66, 240] }, armR: { e: [140, 190], h: [150 + wig(t, 5, 8), 210] } }) +
        lindiwe({ x: 880, y: 860, s: 1.2, eyes: 'open', mouth: 'smile', look: [-4, 0], armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) + counter(1180) + drawer(520, 1150, 1) + notes(380, 1090, 5) + notes(560, 1090, 4) + [0, 1, 2, 3, 4].map((i) => circ(700 + i * 38, 1112, 16, { w: 4 })).join('');
      const ui = text(540, 200, 'End of the day.\n*Count the till.*', { font: BRUSH, size: 96, weight: 400, lh: 100 }) + (rel.on(1, t) || t > rel(1) ? bubble(330, 500, 480, 130, 'One thousand, two\nhundred and… no.', { p: prog(t, rel(1) + 0.2, rel(1) + 0.5), size: 40, tail: 'l', rot: -2 }) : '') +
        tot.map((tx, i) => t >= rel(2) + 0.6 + i * 0.9 ? bubble(700 + (i % 2) * 120, 480 + i * 110, 230, 84, tx, { p: prog(t, rel(2) + 0.6 + i * 0.9, rel(2) + 0.9 + i * 0.9), size: 42, tail: 'l', rot: i % 2 ? 4 : -4 }) : '').join('');
      return { art, ui };
    } },
    { s: 3, draw(t, T, len, rel) { // be honest
      const art = musa({ x: 280, y: 860, s: 1.6, eyes: 'wide', ...say(rel.on(3, t), t, 'flat'), brow: 'angry', look: [5, 0], tilt: 6, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [150, 190], h: [190, 150] } }) +
        lindiwe({ x: 820, y: 860, s: 1.6, eyes: blink(t) ? 'closed' : 'open', ...say(rel.on(4, t), t, 'smile'), brow: 'up', look: [-4, 0], armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } }) + counter(1290);
      const ui = text(540, 200, 'Be honest.', { font: BRUSH, size: 120, weight: 400 }) + note50(540, 560 + wig(t, 0.6, 12), 1.4 * pop(prog(t, rel(3), rel(3) + 0.4)), -8) + text(540, 700, '?', { size: 120 }) +
        bubble(260, 470, 340, 120, 'Where is\nthe fifty?', { p: prog(t, rel(3) + 0.2, rel(3) + 0.5), size: 44, tail: 'l', rot: -3 }) + bubble(830, 470, 340, 120, 'Which fifty?', { p: prog(t, rel(4) + 0.1, rel(4) + 0.4), size: 46, tail: 'r', rot: 3 });
      return { art, ui };
    } },
    news(5, { bad: 5, good: 6, ticker: 'TILL SHORT   •   STAFF CALM   •   CHEF NOT CALM   •   THE FIFTY HAS NOT BEEN SEEN   •   INQUIRY CONTINUES',
      badPip: () => drawer(780, 760, 0.8) + text(780, 640, 'E50?', { font: BRUSH, size: 96, weight: 400, rot: -6 }),
      goodPip: (t) => grp(rect(-180, -120, 360, 240, 16, { fill: INK, w: 6 }) + rect(-166, -106, 332, 212, 8, { fill: '#fff', w: 2 }) + fillR(-166, -106, 332, 46, 0) + [0, 1, 2, 3, 4].map((i) => fillR(-130 + i * 54, 90 - (40 + i * 22) * ease(prog(t, 0.3 + i * 0.1, 0.9 + i * 0.1)), 36, (40 + i * 22) * ease(prog(t, 0.3 + i * 0.1, 0.9 + i * 0.1)))).join(''), 780, 690, pop(prog(t, 0.1, 0.5))) }),
    { s: 7, draw(t, T, len, rel) { // report by day or person
      const tab = t > rel(7) + 2.2 ? 1 : 0;
      let inner = head('Reports', 760, 70) + rect(24, 92, 330, 64, 32, { fill: tab ? '#fff' : BRAND, w: 4 }) + text(189, 136, 'By day', { size: 36, fill: tab ? INK : '#fff' }) + rect(380, 92, 350, 64, 32, { fill: tab ? BRAND : '#fff', w: 4 }) + text(555, 136, 'By person', { size: 36, fill: tab ? '#fff' : INK });
      const rows = tab ? [['Lindiwe', 'E3 410', 380], ['Chef Musa', 'E2 960', 330], ['Thabo', 'E2 150', 240]] : [['Monday', 'E4 120', 360], ['Tuesday', 'E3 880', 330], ['Wednesday', 'E4 450', 400]];
      rows.forEach(([a, b, w], i) => { inner += text(30, 226 + i * 96, a, { size: 34, anchor: 'start' }) + text(730, 226 + i * 96, b, { size: 34, anchor: 'end' }) + fillR(30, 244 + i * 96, w * ease(prog(t, rel(7) + 0.4 + i * 0.25, rel(7) + 1.0 + i * 0.25)), 22, 11); });
      const art = musa({ x: 270, y: 1090, s: 0.95, eyes: 'happy', mouth: 'smile', armL: { e: [128, 214], h: [66, 236] } }) + lindiwe({ x: 810, y: 1090, s: 0.95, eyes: 'happy', mouth: 'smile', armL: { e: [128, 214], h: [66, 236] }, armR: { e: [128, 214], h: [60, 236] } });
      return { art, ui: text(540, 230, 'By day. *By person.*', { font: BRUSH, size: 100, weight: 400 }) + screen(150, 330, 760, 480, inner, { kind: 'monitor' }) + text(540, 1020, 'demo data', { size: 30 }) };
    } },
    { s: 8, draw(t, T, len, rel) { // dinner at home
      const art = rect(-20, 1100, 1120, 360, 0, { fill: '#e4dfd2' }) + rect(520, 1050, 520, 60, 14, { fill: '#fff', w: 7 }) + grp(`<ellipse cx="0" cy="0" rx="110" ry="24" ${st({ fill: '#fff', w: 6 })}/>` + path('M-60,-6 C-66,-60 -8,-76 6,-36 C24,-74 70,-54 58,-6 Z', { fill: PAPER, w: 5 }), 780, 1040) + steam2(780, 960, t) +
        musa({ x: 300, y: 760, s: 1.5, eyes: blink(t) ? 'closed' : 'happy', mouth: 'smile', tilt: -5, armL: { e: [128, 214], h: [66, 236] }, armR: { e: [160, 190], h: [250, 80], hold: rect(-34, -76, 68, 100, 10, { fill: INK, w: 4 }) + rect(-26, -66, 52, 78, 4, { fill: '#fff', w: 1 }) + fillR(-26, -66, 52, 14, 0) + [0, 1, 2].map((i) => fillR(-20 + i * 14, 12 - (10 + i * 12), 9, 10 + i * 12)).join('') } });
      return { art, ui: text(540, 230, 'At home. *Dinner warm.*', { font: BRUSH, size: 100, weight: 400 }) };
    } },
    { s: 9, draw(t, T, len, rel) { // the fifty, found
      const pull = ease(prog(t, rel(10) + 0.5, rel(10) + 1.3)), talk = rel.on(10, t);
      const art = musa({ x: 310, y: 860, s: 1.6, eyes: pull > 0.5 ? 'happy' : 'open', ...say(talk, t, pull > 0.5 ? 'grin' : 'flat'), brow: pull > 0.5 ? 'up' : '', armL: { e: [128, 214], h: [66, 236] }, armR: { e: [150, 220], h: [lerp(40, 150, pull), lerp(250, 150, pull)] } }) +
        lindiwe({ x: 830, y: 860, s: 1.6, eyes: 'half', mouth: 'flat', brow: 'one', armL: { e: [120, 220], h: [-20, 210] }, armR: { e: [120, 220], h: [-20, 210] } }) + counter(1290);
      return { art, ui: text(540, 200, 'And the fifty?', { font: BRUSH, size: 110, weight: 400 }) + (pull > 0.2 ? note50(lerp(300, 540, pull), lerp(1000, 600, pull) - Math.sin(pull * Math.PI) * 80, 1.4 * pull, -10 + pull * 14) : '') + star(540, 600, 150 * (pull > 0.9 ? 1 : 0), { fill: 'none', w: 5, stroke: BRAND }) };
    } },
    end(11, { kind: 'sv', art: (t) => musa({ x: 540, y: 1370, s: 1.1, eyes: 'happy', mouth: 'grin', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [150 + wig(t, 1.6, 18), 20] } }) }),
  ],
};
function steam2(x, y, t) { return [-40, 0, 40].map((dx, i) => line(`M${x + dx},${y} q${-12 + wig(t, 1, 8, i)},-24 0,-44 q${12 + wig(t, 1.2, 8, i)},-22 0,-44`, { w: 4 })).join(''); }
