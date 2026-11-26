/* GS06 "The other bag"  For teachers (demo: Teacher). Timing follows the voice files (EP.auto). */
const { dube, learner, board, bag, appScene, gssEnd, talker, classroom } = K;
const EP = {
  voiceTempo: 0.9, gapScale: 2.2, gapMin: 0.9, holdCaps: true, endTail: 4, id: 'gs06', title: 'The other bag', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', M: 'en-US-AndrewMultilingualNeural', K: 'en-US-AnaNeural' },
  voice: [
    { who: 'M', text: 'Sipho. Homework.' },
    { who: 'K', text: "I did it, sir. It's in my other book.", gap: 0.2 },
    { who: 'M', text: "Where's your other book?", gap: 0.15 },
    { who: 'K', text: 'In my other bag.', gap: 0.15 },
    { who: 'M', text: 'And your other bag?', gap: 0.2 },
    { who: 'K', text: "...It's a very big bag.", gap: 0.5 },
    { who: 'N', text: 'With GSS-LMS, learners hand in homework on their phones. Teachers see who handed in, who didn\'t, and exactly when.' , gap: 1.1 },
    { who: 'M', text: 'Eleven fifty-nine p.m., Sipho. I respect it.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as a teacher.', gap: 0.6 },
  ],
  caps: [[0, '“Sipho. *Homework.*”'], [1, '“It\'s in my\n*other book.*”'], [2, '“Where\'s your\nother book?”'], [3, '“In my *other bag.*”'], [4, '“And your other bag?”'], [5, '“It\'s a *very big* bag.”'], [6, 'Handed in on the phone.\n*Who, and exactly when.*'], [7, '“11:59 p.m.\n*I respect it.*”']],
  sx: [[0, 0.1, 'tick'], [1, 0.2, 'pop'], [2, 0.1, 'tick'], [3, 0.1, 'pop'], [4, 0.1, 'tick'], [5, 0.3, 'whoosh'], [5, 0.8, 'pop', 1.2], [5, 1.6, 'womp', 0.8], [6, -0.2, 'whoosh'], [6, 3.5, 'pop'], [6, 5.5, 'ding', 0.8], [7, 2.4, 'chime'], [8, 0.2, 'whoosh'], [8, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const g = t > rel(5) ? 0.6 + 2.4 * ease(prog(t, rel(5) + 0.2, rel(5) + 0.9)) : 0;
      const art = board(80, 300, 920, 260, 'HOMEWORK DUE', { size: 80, ty: 150 }) + dube({ x: 250, y: 860, s: 1.4, eyes: g > 1.5 ? 'wide' : 'half', ...talker(rel, t, [0, 2, 4], 'flat'), brow: 'one', look: [5, 0] }) +
        learner({ x: 640, y: 960, s: 1.12, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [1, 3, 5], 'smile'), brow: 'up', look: [-4, 0] }) + (g ? bag(900, 1240 - 90 * g, g, 4) : '') + classroom();
      return { art, ui: '' };
    } },
    appScene(6, { title: 'Handed in. *Timed.*', phone: { title: 'Homework', rows: [['Set 4', 'due today'], ['Photo', 'added'], ['Hand in', '→', true]] },
      monitor: { title: 'Maths set 4', rows: [['Ayanda', '17:40'], ['Lindo', 'not yet'], ['Sipho', '23:59', true]] }, art: () => bag(900, 1300, 0.45, -8) + text(900, 1400, 'retired', { size: 30 }) }),
    { s: 7, draw(t, T, len, rel) {
      const nod = ease(prog(t, rel(7) + 2.0, rel(7) + 2.4));
      const art = dube({ x: 540, y: 820, s: 1.6, eyes: nod > 0.5 ? 'closed' : 'half', ...talker(rel, t, [7], 'smile'), brow: 'up', tilt: 8 * nod, armR: { e: [150, 190], h: [180, 120] } }) + classroom();
      return { art, ui: text(540, 220, '11:59 *p.m.*', { font: BRUSH, size: 140, weight: 400 }) };
    } },
    gssEnd(8, 'a teacher', dube),
  ],
};
