/* GS04 "One whiteboard"  For deputies and academic heads (demo: Academic Manager). Timing follows the voice files (EP.auto). */
const { acm, dube, board, appScene, gssEnd, talker, fillR } = K;
const grid = (t, t0, mess) => { let s = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const i = r * 5 + c; if (t < t0 + i * 0.05) continue;
  s += `<rect x="${20 + c * 116}" y="${70 + r * 64}" width="104" height="52" rx="6" fill="#fff" stroke="${INK}" stroke-width="3"/>` + (mess ? line(`M${34 + c * 116},${96 + r * 64} q30,${rnd(i) * 30 - 15} 70,0`, { w: 4, stroke: rnd(i + 9) > 0.7 ? BRAND : INK }) : ''); } return s; };
const lab = () => rect(-20, 1240, 1120, 200, 0) + rect(60, 1080, 960, 50, 8, { fill: '#fff', w: 6 }) + grp(path('M-30,-90 h60 M-18,-90 v60 l-40,80 h116 l-40,-80 v-60', { fill: '#fff', w: 5 }), 820, 1080);
const EP = {
  voiceTempo: 1.08, id: 'gs04', title: 'One whiteboard', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', U: 'en-ZA-LukeNeural', M: 'en-US-AndrewMultilingualNeural' },
  voice: [
    { who: 'N', text: 'The new timetable. Three weeks. One whiteboard. Four markers. One still works.' },
    { who: 'U', text: 'Perfect. Not one clash.', gap: 0.3 },
    { who: 'N', text: 'Monday. First period.', gap: 0.5 },
    { who: 'N', text: 'Mr Dube is teaching Form Two and Form Four. In the same lab.', gap: 0.25 },
    { who: 'M', text: "I'm a good teacher. I'm not two teachers.", gap: 0.35 },
    { who: 'N', text: 'GSS-LMS builds it in one click. Every teacher, room and class checked, double periods kept together, and clashes refused.' , gap: 1.0 },
    { who: 'U', text: 'Three weeks. One click. I need to sit down.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as the deputy.', gap: 0.6 },
  ],
  caps: [[0, 'Three weeks. One whiteboard.\n*One marker still works.*'], [1, '“Perfect.\n*Not one clash.*”'], [2, 'Monday. *First period.*'], [3, 'Form 2 *and* Form 4.\n*Same lab.*'], [4, '“I\'m a good teacher.\nI\'m not *two teachers.*”'],
    [5, 'One click. Teachers, rooms,\nclasses: *all checked.*'], [6, '“One click.\nI need to *sit down.*”']],
  sx: [[0, 1.2, 'scribble', 0.6], [0, 2.6, 'scribble', 0.6], [1, 0.2, 'ding', 0.6], [2, 0.0, 'tick'], [3, 0.4, 'whoosh'], [3, 1.6, 'pop'], [3, 2.6, 'sting', 0.7], [4, 0.2, 'pop'], [5, -0.2, 'whoosh'], [5, 4.0, 'pop'], [5, 7.0, 'ding', 0.8], [6, 1.4, 'thud', 0.6], [7, 0.2, 'whoosh'], [7, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = rect(60, 300, 960, 360, 10, { fill: '#fff', w: 8 }) + line('M120,700 h120', { w: 8 }) + grp(grid(t, 0.3, true), 230, 300, 1.08) + acm({ x: 540, y: 960, s: 1.4, eyes: 'happy', ...talker(rel, t, [1], 'grin'), brow: 'up', armR: { e: [150, 130], h: [170 + wig(t, 0.8, 10), 40], hold: rect(-10, -50, 20, 60, 4, { fill: BRAND, w: 3 }) } }) + rect(-20, 1280, 1120, 160, 0);
      return { art, ui: text(540, 230, 'Three *weeks.*', { font: BRUSH, size: 120, weight: 400 }) };
    } },
    { s: 2, draw(t, T, len, rel) {
      const split = ease(prog(t, rel(3) + 0.6, rel(3) + 1.4));
      const twin = (dx, fl) => dube({ x: 540 + dx * split, y: 860, s: 1.3, flip: fl, eyes: t > rel(3) + 1.6 ? 'wide' : 'open', ...talker(rel, t, [4], 'flat'), sweat: split > 0.5, brow: split > 0.5 ? 'sad' : '' });
      const art = lab() + (split > 0 ? twin(-240, 1) + twin(240, -1) : twin(0, 1));
      return { art, ui: text(540, 230, 'Monday, *8 a.m.*', { font: BRUSH, size: 120, weight: 400 }) + (split > 0.6 ? text(300, 480, 'Form 2', { size: 56, rot: -6 }) + text(780, 480, 'Form 4', { size: 56, rot: 6 }) : '') };
    } },
    appScene(5, { title: 'One *click.*', phone: { title: 'Timetable', rows: [['Build', 'one click', true], ['Teachers', 'checked'], ['Rooms', 'checked'], ['Doubles', 'kept']] },
      monitor: { title: 'Mon, period 1', rows: [['Form 2', 'Mr Dube'], ['Form 4', 'Ms Zwane'], ['Move to lab?', 'clash ✗', true]] } }),
    { s: 6, draw(t, T, len, rel) {
      const sit = ease(prog(t, rel(6) + 1.2, rel(6) + 1.8));
      const art = rect(-20, 1240, 1120, 200, 0) + grp(rect(-110, -20, 220, 40, 8, { fill: '#fff', w: 6 }) + line('M-90,20 v140 M90,20 v140 M90,-20 v-160', { w: 9 }), 540, 1100) +
        acm({ x: 540, y: lerp(760, 880, sit), s: 1.5, eyes: sit > 0.5 ? 'closed' : 'wide', ...talker(rel, t, [6], 'o'), tilt: -8 * sit });
      return { art, ui: text(540, 230, 'One *click.*', { font: BRUSH, size: 140, weight: 400 }) };
    } },
    gssEnd(7, 'the deputy', acm),
  ],
};
