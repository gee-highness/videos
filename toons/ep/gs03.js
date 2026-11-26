/* GS03 "From: Mom"  For bursars (demo: Finance Manager). Timing follows the voice files (EP.auto). */
const { bursar, mom, appScene, gssEnd, talker, fillR } = K;
const slip = (x, y, s = 1, rot = 0) => grp(rect(-230, -130, 460, 260, 10, { fill: '#fff', w: 6 }) + fillR(-230, -130, 460, 54, 10) + text(0, -90, 'PROOF OF PAYMENT', { size: 32, fill: '#fff' }) +
  text(-200, -20, 'Ref: school fees', { size: 38, anchor: 'start' }) + text(-200, 36, 'From: Mom', { size: 46, anchor: 'start', fill: BRAND }) + text(-200, 92, 'E1,500', { size: 44, anchor: 'start' }), x, y, s, rot);
const desk = () => rect(-20, 1240, 1120, 200, 0) + line('M-20,1276 H1100', { w: 4 });
const EP = {
  voiceTempo: 0.9, gapScale: 2.2, gapMin: 0.9, holdCaps: true, endTail: 4, id: 'gs03', title: 'From: Mom', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', U: 'en-ZA-LukeNeural' },
  voice: [
    { who: 'U', text: 'Proof of payment. One thousand five hundred. From: Mom.' },
    { who: 'U', text: 'We have six hundred learners.', gap: 0.45 },
    { who: 'U', text: 'They all have a mom.', gap: 0.35 },
    { who: 'N', text: 'On GSS-LMS, parents upload the proof under their own child. The bursar checks it once: the balance updates, the receipt is made, and the statement is always up to date.' , gap: 1.2 },
    { who: 'U', text: 'Whichever mom it was. Thank you.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as the bursar.', gap: 0.6 },
  ],
  caps: [[0, '“From: *Mom.*”'], [1, '“We have *600* learners.”'], [2, '“They *all* have a mom.”'], [3, 'Uploaded *under their own child.*\nChecked *once.*'], [4, '“Whichever mom it was.\n*Thank you.*”']],
  sx: [[0, 0.1, 'pop'], [0, 2.4, 'tick'], [1, 0.1, 'tick'], [2, 0.2, 'pop'], [2, 0.4, 'pop'], [2, 0.6, 'pop'], [2, 0.8, 'pop'], [2, 1.6, 'womp', 0.8], [3, -0.2, 'whoosh'], [3, 4.5, 'pop'], [3, 7.5, 'ding', 0.8], [4, 0.3, 'chime'], [5, 0.2, 'whoosh'], [5, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = desk() + bursar({ x: 300, y: 820, s: 1.55, eyes: t > rel(1) ? 'half' : 'open', ...talker(rel, t, [0, 1], 'flat'), brow: 'one', look: [5, 0], armR: { e: [150, 190], h: [200, 130] } });
      return { art, ui: text(540, 220, 'From: *Mom.*', { font: BRUSH, size: 130, weight: 400 }) + slip(760, 620, pop(prog(t, 0.1, 0.5)), 4) + (t > rel(1) ? grp(rect(-150, -60, 300, 120, 16, { fill: INK, w: 0 }) + text(0, 22, '600', { size: 80, fill: '#fff' }), 760, 940, 1.6 * pop(prog(t, rel(1), rel(1) + 0.3)), -3) : '') };
    } },
    { s: 2, draw(t, T, len, rel) {
      let crowd = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c, p = prog(t, 0.1 + i * 0.025, 0.3 + i * 0.025); if (p > 0) crowd += mom({ x: 110 + c * 172 + (r % 2) * 40, y: 470 + r * 190, s: 0.62 * pop(p), headOnly: true, hair: ['afro', 'puff', 'wrap', 'short'][(i * 7) % 4], eyes: blink(t, i * 0.37) ? 'closed' : 'happy', mouth: 'smile' }); }
      return { art: crowd, ui: text(540, 230, 'All of them: *Mom.*', { font: BRUSH, size: 110, weight: 400 }) };
    } },
    appScene(3, { title: 'Checked *once.*', phone: { title: 'Pay fees', rows: [['Learner', 'Sipho D.'], ['Amount', 'E1,500'], ['Proof', 'slip.jpg'], ['Send', '→', true]] },
      monitor: { title: 'Proof of payment', rows: (t, d) => [['Sipho D.', 'E1,500'], ['Status', t > d * 0.7 ? 'Paid ✓' : 'to check', t > d * 0.7], ['Receipt', t > d * 0.8 ? 'made' : '…'], ['Statement', t > d * 0.9 ? 'updated' : '…']] } }),
    { s: 4, draw(t, T, len, rel) {
      const art = desk() + bursar({ x: 540, y: 800, s: 1.6, eyes: 'happy', ...talker(rel, t, [4], 'grin'), brow: 'up', tilt: -6 * ease(prog(t, 0.8, 1.4)), armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [170, 40] } });
      return { art, ui: text(540, 220, 'Thank you, *Mom.*', { font: BRUSH, size: 120, weight: 400 }) + [0, 1, 2].map((i) => star(200 + i * 340, 440 + (i % 2) * 60, 40 * pop(prog(t, 1 + i * 0.2, 1.3 + i * 0.2)), { fill: BRAND, w: 4 })).join('') };
    } },
    gssEnd(5, 'the bursar', bursar),
  ],
};
