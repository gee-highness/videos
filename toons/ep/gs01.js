/* GS01 "Blessed Tuesday"  For principals (demo: Administrator). Script and truth notes: docs/toons/PLAN.md. Timing follows the voice files (EP.auto). */
const { principal, dube, win, mug, app, appScene, gssEnd, talker, fillR } = K;
const flowers = (x, y, s = 1, p = 1) => grp(rect(-170, -170, 340, 340, 20, { fill: '#fff', w: 6 }) + [[-70, -40], [10, -70], [80, -20], [-20, 30], [60, 60]].map(([fx, fy], i) =>
  [0, 1, 2, 3, 4, 5].map((k) => circ(fx + Math.cos(k * 1.047) * 24, fy + Math.sin(k * 1.047) * 24, 16, { fill: i % 2 ? '#fff' : PAPER, w: 4 })).join('') + circ(fx, fy, 13, { fill: BRAND, w: 4 })).join('') +
  text(0, 140, 'Blessed Tuesday', { font: BRUSH, size: 50, weight: 400, fill: BRAND }), x, y, s * pop(p), -4);
const chat = (n) => { let s = fillR(0, 0, 440, 100) + text(220, 64, 'Staff group', { size: 40, fill: '#fff' });
  const k = Math.min(n, 7); for (let i = 0; i < k; i++) { const right = rnd(i + n) > 0.5, w = 170 + rnd(i * 3 + n) * 170, x = right ? 420 - w : 20, y = 760 - (k - i) * 90;
    s += rect(x, y, w, 66, 22, { fill: right ? '#e8f4ec' : '#fff', w: 3 }) + line(`M${x + 22},${y + 34} h${w - 60}`, { w: 4 }); } return s; };
const EP = {
  voiceTempo: 1.08, id: 'gs01', title: 'Blessed Tuesday', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', L: 'en-US-AvaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural' },
  voice: [
    { who: 'N', text: 'Seven a.m. One simple question.' },
    { who: 'L', text: 'How many learners are absent today?', gap: 0.25 },
    { who: 'M', text: 'Let me ask the staff group.', gap: 0.2 },
    { who: 'N', text: 'Forty messages later, someone sent a picture of flowers.', gap: 0.45 },
    { who: 'N', text: 'It said: Blessed Tuesday.', gap: 0.35 },
    { who: 'N', text: "With GSS-LMS, teachers take the register on their phones, and it lands on her screen: who's absent, and which register isn't done." , gap: 0.9 },
    { who: 'L', text: 'Twelve absent. And Tuesday is blessed.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as the principal.', gap: 0.5 },
  ],
  caps: [[0, '7 a.m.\nOne *simple* question.'], [1, '“How many learners are\n*absent* today?”'], [2, '“Let me ask\nthe *staff group.*”'], [3, '40 messages later…'], [4, '“*Blessed Tuesday.*”'],
    [5, 'The register, *on their phones.*\nThe answer, *on hers.*'], [6, '“Twelve absent.\nAnd Tuesday is *blessed.*”']],
  sx: [[0, 0.1, 'tick'], [1, 0.1, 'pop'], [2, 0.1, 'pop'], [3, 0.2, 'tick'], [3, 0.5, 'tick'], [3, 0.8, 'tick'], [3, 1.1, 'tick'], [3, 1.4, 'tick'], [4, -0.1, 'chime', 0.8], [4, 1.4, 'womp', 0.7], [5, -0.2, 'whoosh'], [5, 3.5, 'pop'], [5, 5.0, 'ding', 0.8], [6, 1.6, 'chime'], [7, 0.2, 'whoosh'], [7, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = win() + principal({ x: 560, y: 760, s: 1.6, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [1], 'flat'), brow: t > rel(1) ? 'up' : '', look: [-3, 0], armL: { e: [128, 214], h: [70, 250] }, armR: { e: [134, 196], h: [84, 150], hold: mug } }) + rect(-20, 1240, 1120, 200, 0) + line('M-20,1276 H1100', { w: 4 });
      return { art, ui: text(540, 230, '7:00 *a.m.*', { font: BRUSH, size: 130, weight: 400 }) + bubble(800, 560, 400, 150, 'How many are\nabsent?', { p: prog(t, rel(1), rel(1) + 0.35), size: 48, tail: 'l', rot: 3 }) };
    } },
    { s: 2, draw(t, T, len, rel) {
      const n = Math.floor(prog(t, rel(3), rel.end(3)) * 40), fl = t > rel(4) - 0.1;
      const art = dube({ x: 280, y: 820, s: 1.5, eyes: fl ? 'half' : 'open', ...talker(rel, t, [2]), brow: fl ? 'sad' : '', sweat: n > 20 && !fl, look: [4, 2], armR: { e: [130, 170], h: [120, 60], hold: rect(-26, -74, 52, 86, 10, { fill: INK, w: 4 }) } }) + rect(-20, 1280, 1120, 160, 0);
      const ui = text(540, 220, fl ? '*Blessed* Tuesday.' : 'The *staff group.*', { font: BRUSH, size: 110, weight: 400 }) + phone(560, 360, 440, 840, chat(n) + (fl ? flowers(220, 420, 1, prog(t, rel(4) - 0.1, rel(4) + 0.3)) : ''), { id: 1 }) +
        (n ? grp(circ(0, 0, 62, { fill: BRAND, w: 6 }) + text(0, 18, String(n), { size: 54, fill: '#fff' }), 990, 380) : '');
      return { art, ui };
    } },
    appScene(5, { title: 'Register: *one tap.*', phone: { title: 'Register 3B', rows: [['Ayanda', '✓'], ['Bongani', '✓'], ['Lindo', 'absent', true], ['Nosipho', '✓'], ['Sipho', '✓']] },
      monitor: { title: 'Today', rows: [['Present', '548'], ['Absent', '12', true], ['Registers', '13 of 14'], ['Not done', 'Form 5C']] } }),
    { s: 6, draw(t, T, len, rel) {
      const art = principal({ x: 330, y: 820, s: 1.6, eyes: blink(t) ? 'closed' : 'happy', ...talker(rel, t, [6], 'grin'), brow: 'up', look: [4, 0], armL: { e: [128, 214], h: [70, 250] }, armR: { e: [134, 196], h: [84, 150], hold: mug } }) + rect(-20, 1280, 1120, 160, 0);
      return { art, ui: text(540, 220, 'Twelve.', { font: BRUSH, size: 130, weight: 400 }) + grp(rect(-150, -120, 300, 240, 20, { fill: '#fff', w: 6 }) + text(0, -40, 'Absent', { size: 40 }) + text(0, 60, '12', { size: 120, fill: BRAND }), 820, 520, pop(prog(t, 0.1, 0.5)), 3) +
        flowers(820, 900, 0.7, prog(t, rel(6) + 1.4, rel(6) + 1.8)) };
    } },
    gssEnd(7, 'the principal', principal),
  ],
};
