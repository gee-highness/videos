/* GS07 "Stuff"  For parents and guardians (demo: Parent / Guardian). Timing follows the voice files (EP.auto). */
const { gogo, learner, win, appScene, gssEnd, talker } = K;
const room = () => win() + rect(-20, 1240, 1120, 200, 0) + rect(560, 1060, 480, 180, 30, { fill: '#fff', w: 6 }) + rect(580, 1000, 440, 90, 30, { fill: PAPER, w: 6 });
const ph = (lit) => ({ e: [130, 170], h: [120, 60], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) + (lit ? rect(-19, -64, 38, 62, 4, { fill: BRAND, w: 1 }) : '') });
const EP = {
  voiceTempo: 1.08, id: 'gs07', title: 'Stuff', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', Z: 'en-ZA-LeahNeural', K: 'en-US-AnaNeural' },
  voice: [
    { who: 'Z', text: 'How was school today?' },
    { who: 'K', text: 'Fine.', gap: 0.3 },
    { who: 'Z', text: 'And what did you learn?', gap: 0.3 },
    { who: 'K', text: 'Stuff.', gap: 0.45 },
    { who: 'N', text: 'On GSS-LMS, parents and guardians see the marks, the attendance and the homework. Same child. More words.' , gap: 0.9 },
    { who: 'Z', text: 'Stuff, hey? It says here: Maths, seventy-two. One late homework. And a Science test on Friday.', gap: 0.4 },
    { who: 'K', text: '...Fine.', gap: 0.5 },
    { who: 'N', text: 'GSS-LMS. Open the demo as a parent.', gap: 0.6 },
  ],
  caps: [[0, '“How was school today?”'], [1, '“*Fine.*”'], [2, '“And what did you learn?”'], [3, '“*Stuff.*”'], [4, 'Marks, attendance, homework.\n*Same child. More words.*'], [5, '“Maths, 72. One late homework.\nScience test *on Friday.*”'], [6, '“…*Fine.*”']],
  sx: [[0, 0.1, 'pop'], [1, 0.0, 'tick'], [2, 0.1, 'pop'], [3, 0.0, 'tick'], [3, 0.7, 'womp', 0.7], [4, -0.2, 'whoosh'], [4, 3.0, 'pop'], [4, 5.0, 'ding', 0.8], [5, 1.2, 'tick'], [5, 2.6, 'tick'], [5, 4.0, 'sting', 0.7], [6, 0.3, 'womp', 0.8], [7, 0.2, 'whoosh'], [7, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = room() + gogo({ x: 300, y: 820, s: 1.5, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [0, 2]), brow: t > rel(3) ? 'one' : 'up', look: [4, 0] }) +
        learner({ x: 800, y: 940, s: 1.2, eyes: 'half', ...talker(rel, t, [1, 3], 'flat'), look: [3, 4], armR: ph(true) });
      return { art, ui: text(540, 220, 'After school.', { font: BRUSH, size: 120, weight: 400 }) + (t > rel(1) ? bubble(800, 520, 220, 110, 'Fine.', { p: prog(t, rel(1), rel(1) + 0.3), size: 54, tail: 'r' }) : '') + (t > rel(3) ? bubble(820, 380, 240, 110, 'Stuff.', { p: prog(t, rel(3), rel(3) + 0.3), size: 54, tail: 'r', rot: 4 }) : '') };
    } },
    appScene(4, { title: 'More than *one word.*', titleSize: 100, phone: { title: 'Sipho, Form 3B', rows: [['Attendance', '96%'], ['Maths', '72%'], ['Homework', '1 late'], ['Science test', 'Friday', true]] } }),
    { s: 5, draw(t, T, len, rel) {
      const busted = t > rel(5) + 3.6;
      const art = room() + gogo({ x: 300, y: 820, s: 1.5, eyes: 'half', ...talker(rel, t, [5]), brow: 'one', look: [4, 0], armR: ph(true) }) +
        learner({ x: 800, y: 940, s: 1.2, eyes: busted ? 'wide' : 'half', ...talker(rel, t, [6], 'flat'), sweat: busted, brow: busted ? 'sad' : '', look: [-4, 0] });
      return { art, ui: text(540, 220, busted ? '*Friday.*' : 'Stuff, hey?', { font: BRUSH, size: 130, weight: 400 }) };
    } },
    gssEnd(7, 'a parent', gogo),
  ],
};
