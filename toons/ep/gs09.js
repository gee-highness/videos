/* GS09 "1998"  For learners, shared through parents and schools (demo: Learner). Timing follows the voice files (EP.auto). */
const { learner, mom, win, mug, appScene, gssEnd, talker } = K;
const kitchen = () => win() + rect(-20, 1240, 1120, 200, 0) + line('M-20,1276 H1100', { w: 4 });
const EP = {
  voiceTempo: 0.9, gapScale: 2.2, gapMin: 0.9, holdCaps: true, endTail: 4, id: 'gs09', title: '1998', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', K: 'en-US-AnaNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'K', text: 'Mama! What do I have first period?' },
    { who: 'L', text: 'How would I know? I finished school in nineteen ninety-eight.', gap: 0.3 },
    { who: 'N', text: 'On GSS-LMS, learners see their own timetable, the homework that is due, and their marks, on their phone.', gap: 0.6 },
    { who: 'K', text: 'Maths. First period.', gap: 0.4 },
    { who: 'K', text: 'Again.', gap: 0.35 },
    { who: 'L', text: 'In nineteen ninety-eight, it was also Maths.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as a learner.', gap: 0.6 },
  ],
  caps: [[0, '“Mama! What do I have\n*first period?*”'], [1, '“I finished school\nin *1998.*”'], [2, 'Timetable, homework, marks:\n*on their phone.*'], [3, '“Maths. First period.”'], [4, '“*Again.*”'], [5, '“In 1998 it was\n*also Maths.*”']],
  sx: [[0, 0.0, 'whoosh'], [1, 0.2, 'pop'], [1, 2.4, 'tick'], [2, -0.2, 'whoosh'], [2, 3.0, 'pop'], [2, 5.0, 'ding', 0.8], [3, 0.3, 'tick'], [4, 0.1, 'womp', 0.8], [5, 0.2, 'pop'], [5, 2.0, 'chime'], [6, 0.2, 'whoosh'], [6, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const run = t < rel(1) ? wig(t, 2.5, 30) : 0;
      const art = kitchen() + learner({ x: 300 + run, y: 900, s: 1.3, eyes: 'wide', ...talker(rel, t, [0], 'o'), brow: 'up', look: [5, 0], tilt: t < rel(1) ? wig(t, 2.5, 6) : 0, armR: { e: [150, 160], h: [140, 60], hold: rect(-40, -24, 80, 48, 8, { fill: '#e4c08a', w: 4 }) } }) +
        mom({ x: 790, y: 820, s: 1.5, eyes: blink(t) ? 'closed' : 'half', ...talker(rel, t, [1], 'flat'), brow: 'one', look: [-4, 0], armR: { e: [134, 196], h: [84, 150], hold: mug } });
      return { art, ui: text(540, 220, '6:45 *a.m.*', { font: BRUSH, size: 130, weight: 400 }) + (t > rel(1) + 1.6 ? grp(rect(-120, -60, 240, 120, 16, { fill: '#fff', w: 6 }) + text(0, 20, '1998', { size: 70, fill: BRAND }), 800, 470, pop(prog(t, rel(1) + 1.6, rel(1) + 2)), -6) : '') };
    } },
    appScene(2, { title: 'On *their* phone.', phone: { title: 'Today', rows: [['07:30', 'Maths', true], ['08:30', 'English'], ['Homework', '2 due'], ['Last test', '68%']] } }),
    { s: 3, draw(t, T, len, rel) {
      const art = kitchen() + learner({ x: 300, y: 900, s: 1.3, eyes: 'half', ...talker(rel, t, [3, 4], 'frown'), brow: 'sad', look: [0, 3], armR: { e: [130, 170], h: [84, 70], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) } }) +
        mom({ x: 790, y: 820, s: 1.5, eyes: 'happy', ...talker(rel, t, [5], 'grin'), brow: 'up', look: [-4, 0], tilt: -5, armR: { e: [134, 196], h: [84, 150], hold: mug } });
      return { art, ui: text(540, 220, t > rel(4) ? 'Maths. *Again.*' : 'Maths.', { font: BRUSH, size: 130, weight: 400 }) };
    } },
    gssEnd(6, 'a learner', learner, { s: 1.0, y: 1380 }),
  ],
};
