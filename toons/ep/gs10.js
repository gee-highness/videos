/* GS10 "School News"  For everyone: open the demo (role picker). Calls back GS06 and GS08. Timing follows the voice files (EP.auto). */
const { news, principal, dube, gogo, learner, bag, gssEnd, talker } = K;
const pen = grp(rect(-120, -16, 240, 32, 14, { fill: '#fff', w: 5 }) + path('M120,-16 L170,0 L120,16 Z', { fill: INK, w: 4 }) + text(-20, 12, 'NOT MR DUBE\'S', { size: 22 }), 780, 680, 1.2, -12);
const EP = {
  voiceTempo: 1.08, id: 'gs10', title: 'School News', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural' },
  voice: [
    { who: 'A', text: 'Good evening. This is School News.' },
    { who: 'A', text: 'A teacher has found a pen that works.', gap: 0.3 },
    { who: 'A', text: 'It belongs to someone else.', gap: 0.35 },
    { who: 'A', text: "A learner's homework is in his other bag. The bag could not be reached for comment.", gap: 0.5 },
    { who: 'A', text: 'In better news: there is a whole demo school online. Pick who you are, and walk right in.', gap: 0.6 },
    { who: 'N', text: 'No sign-up. Made-up data. The real app.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Your whole school, one system. Open the live demo.', gap: 0.5 },
  ],
  caps: [[0, '*School News.*'], [1, 'A pen *that works.*'], [2, '*Someone else\'s.*'], [3, 'The bag could not be\nreached *for comment.*'], [4, 'A whole school online.\n*Pick who you are.*'], [5, 'No sign-up.\n*The real app.*']],
  sx: [[0, -0.2, 'sting'], [1, 0.8, 'ding', 0.6], [2, 0.6, 'womp', 0.7], [3, 1.8, 'pop'], [3, 3.6, 'tick'], [4, -0.25, 'chime'], [5, 0.2, 'pop'], [5, 1.2, 'pop'], [5, 2.2, 'ding', 0.8], [6, 0.2, 'whoosh'], [6, 0.7, 'ding', 0.7]],
  scenes: [
    news(0, { title: 'SCHOOL NEWS', bad: 1, good: 4, talk: [0, 2, 3], ticker: 'PEN FOUND   •   OWNER NOT AMUSED   •   HOMEWORK IN OTHER BAG   •   BAG UNAVAILABLE   •   TUCK SHOP OUT OF VETKOEK',
      badPip: (t) => pen + bag(880, 800, 0.45, 10) + text(700, 820, '?', { size: 90 }),
      goodPip: (t) => grp(path('M-160,60 V-40 L0,-130 L160,-40 V60 Z', { fill: '#fff', w: 6 }) + rect(-30, 0, 60, 60, 4, { fill: BRAND, w: 4 }) + [-110, 70].map((x) => rect(x, -30, 40, 40, 4, { fill: '#fff', w: 4 })).join('') + text(0, -60, 'DEMO', { size: 34 }), 780, 700, pop(prog(t, 0.1, 0.5))) }),
    { s: 5, draw(t, T, len, rel) {
      const ppl = [[principal, 'Principal'], [dube, 'Teacher'], [K.mom, 'Parent'], [learner, 'Learner']];
      const art = ppl.map(([who], i) => who({ x: 150 + i * 260, y: 780 + (i % 2) * 40, s: 0.85 * pop(prog(t, 0.2 + i * 0.25, 0.5 + i * 0.25)), eyes: blink(t, i) ? 'closed' : 'happy', mouth: 'grin' })).join('') + rect(-20, 1240, 1120, 200, 0);
      const ui = text(540, 230, 'Pick *who you are.*', { font: BRUSH, size: 110, weight: 400 }) + ppl.map(([, n], i) => grp(rect(-110, -36, 220, 72, 36, { fill: BRAND, w: 4 }) + text(0, 14, n, { size: 34, fill: '#fff' }), 150 + i * 260, 1160, pop(prog(t, 0.4 + i * 0.25, 0.7 + i * 0.25)))).join('') +
        text(540, 1360, 'demo data', { size: 30 });
      return { art, ui };
    } },
    gssEnd(6, '', principal),
  ],
};
