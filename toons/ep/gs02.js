/* GS02 "Report week"  For principals and teachers (demo: Administrator). Timing follows the voice files (EP.auto). */
const { dube, lady, win, paperPile, appScene, gssEnd, talker, mug } = K;
const staffroom = (dark) => rect(-20, 1240, 1120, 200, 0) + rect(80, 1060, 920, 60, 10, { fill: '#fff', w: 6 }) + paperPile(300, 1050, 7) + paperPile(760, 1050, 5) +
  rect(820, 360, 180, 260, 8, { fill: dark ? '#8d887c' : '#fff' }) + text(910, 500, dark ? 'night' : '', { size: 30 });
const flash = (x, y, s = 1) => grp(rect(-60, -24, 120, 48, 10, { fill: BRAND, w: 5 }) + rect(60, -14, 34, 28, 4, { fill: '#fff', w: 4 }), x, y, s);
const EP = {
  voiceTempo: 1.08, id: 'gs02', title: 'Report week', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'N', text: "Report week. The staff room hasn't seen the sun since Tuesday." },
    { who: 'M', text: 'Maths is done. Who has the English marks?', gap: 0.3 },
    { who: 'L', text: 'On a flash drive.', gap: 0.25 },
    { who: 'M', text: 'Where is the flash drive?', gap: 0.2 },
    { who: 'L', text: 'Manzini.', gap: 0.5 },
    { who: 'N', text: 'On GSS-LMS, marks go in once, during the term. The term mark works itself out, and report cards come straight out of it, ready to sign.' , gap: 1.0 },
    { who: 'M', text: 'So what do we do in report week?', gap: 0.35 },
    { who: 'N', text: 'Go home.', gap: 0.5 },
    { who: 'N', text: 'GSS-LMS. Open the demo as the principal.', gap: 0.7 },
  ],
  caps: [[0, 'Report week.\nNo sun *since Tuesday.*'], [1, '“Who has the\n*English marks?*”'], [2, '“On a *flash drive.*”'], [3, '“Where is the\nflash drive?”'], [4, '“*Manzini.*”'],
    [5, 'Marks typed *once.*\nReport cards *come out of them.*'], [6, '“So what do we do\nin report week?”'], [7, '*Go home.*']],
  sx: [[0, 0.2, 'tick'], [0, 1.6, 'scribble', 0.5], [1, 0.1, 'pop'], [2, 0.1, 'pop'], [3, 0.1, 'tick'], [4, 0.0, 'thud', 0.8], [4, 0.8, 'womp', 0.8], [5, -0.2, 'whoosh'], [5, 4.0, 'pop'], [5, 7.0, 'ding', 0.8], [6, 0.1, 'pop'], [7, 0.0, 'chime'], [8, 0.2, 'whoosh'], [8, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = staffroom(true) + dube({ x: 300, y: 760, s: 1.4, eyes: t > rel(4) ? 'wide' : 'half', ...talker(rel, t, [1, 3], 'flat'), brow: t > rel(4) ? 'sad' : 'one', sweat: t > rel(4), look: [5, 0], tilt: wig(t, 0.4, 3), armR: { e: [134, 196], h: [84, 150], hold: mug } }) +
        lady({ x: 760, y: 780, s: 1.3, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [2, 4], 'flat'), look: [-4, 0] });
      return { art, ui: text(540, 230, 'Report *week.*', { font: BRUSH, size: 130, weight: 400 }) + (t > rel(2) ? flash(760, 460, 1.4 * pop(prog(t, rel(2), rel(2) + 0.3))) : '') +
        (t > rel(4) ? grp(rect(-170, -50, 340, 100, 14, { fill: INK, w: 0 }) + text(0, 18, '→ Manzini', { size: 52, fill: '#fff', font: BRUSH, weight: 400 }), 760, 580, pop(prog(t, rel(4), rel(4) + 0.3)), -4) : '') };
    } },
    appScene(5, { title: 'Typed *once.*', phone: { title: 'Gradebook 3B', rows: [['Test 1', '68'], ['Assignment', '74'], ['Exam', '71'], ['Term mark', '71%', true]] },
      monitor: { title: 'Report cards', rows: [['Form 3B', 'ready'], ['Comments', 'done'], ['Principal', 'sign', true]] } }),
    { s: 6, draw(t, T, len, rel) {
      const home = t > rel(7);
      const art = (home ? win() : staffroom(false)) + dube({ x: home ? 540 + 600 * ease(prog(t, rel(7) + 0.6, rel(7) + 1.8)) : 400, y: 800, s: 1.5, eyes: home ? 'happy' : 'open', ...talker(rel, t, [6], home ? 'grin' : 'smile'), brow: 'up', flip: home ? -1 : 1, armR: { e: [130, 170], h: [120, 60], hold: K.bag(0, -40, 0.4) } });
      return { art, ui: text(540, 230, home ? '*Go home.*' : 'So…?', { font: BRUSH, size: 140, weight: 400 }) };
    } },
    gssEnd(8, 'the principal', K.principal),
  ],
};
