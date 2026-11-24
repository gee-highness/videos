/* GS05 "Date of birth: Yes"  For registrars (demo: Registrar Manager). Online applications are on the Standard plan and up. Timing follows the voice files (EP.auto). */
const { registrar, appScene, gssEnd, talker } = K;
const form = (t, rel) => { const f = (y, label, val, at) => text(-250, y, label, { size: 38, anchor: 'start' }) + line(`M-30,${y + 8} H250`, { w: 3 }) + (t > at ? text(-10, y - 4, val, { font: BRUSH, size: 54, weight: 400, anchor: 'start', fill: BRAND, rot: -3 }) : '');
  return rect(-290, -300, 580, 600, 10, { fill: '#fff', w: 6 }) + text(0, -230, 'APPLICATION', { size: 44 }) + f(-140, 'Name', 'Sipho', rel(0) + 1.4) + f(-40, 'Surname', 'Form One', rel(1) + 0.2) + f(60, 'Date of birth', '', 99) +
    (t > rel(3) ? text(80, 56, 'Yes.', { font: BRUSH, size: 72, weight: 400, anchor: 'start', fill: BRAND, rot: -6 }) : '') + f(160, 'Phone', '', 99) + text(130, 156, t > rel(1) + 1 ? 'see above' : '', { font: BRUSH, size: 40, weight: 400, anchor: 'start', fill: BRAND, rot: 3 }); };
const EP = {
  voiceTempo: 1.08, id: 'gs05', title: 'Date of birth: Yes', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [
    { who: 'L', text: 'New application. Name: Sipho.' },
    { who: 'L', text: 'Surname: Form One.', gap: 0.35 },
    { who: 'L', text: 'Date of birth...', gap: 0.35 },
    { who: 'L', text: 'Yes.', gap: 0.45 },
    { who: 'N', text: 'On the Standard plan and up, parents apply online. Every answer goes in its own box, the documents come attached, and the whole intake is one list to accept.' , gap: 1.1 },
    { who: 'L', text: 'Date of birth: an actual date. I could cry.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as the registrar.', gap: 0.6 },
  ],
  caps: [[0, '“Name: *Sipho.*”'], [1, '“Surname: *Form One.*”'], [2, '“Date of birth…”'], [3, '“*Yes.*”'], [4, 'Parents apply *online.*\nEvery answer, *its own box.*'], [5, '“An actual date.\n*I could cry.*”']],
  sx: [[0, 0.1, 'pop'], [0, 1.4, 'scribble', 0.6], [1, 0.2, 'scribble', 0.6], [2, 0.2, 'tick'], [3, 0.0, 'thud', 0.7], [3, 0.6, 'womp', 0.8], [4, -0.2, 'whoosh'], [4, 4.0, 'pop'], [4, 7.0, 'ding', 0.8], [5, 0.4, 'chime'], [6, 0.2, 'whoosh'], [6, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = rect(-20, 1240, 1120, 200, 0) + registrar({ x: 260, y: 900, s: 1.35, eyes: t > rel(3) ? 'half' : 'open', glasses: true, ...talker(rel, t, [0, 1, 2, 3], 'flat'), brow: t > rel(1) ? 'one' : '', look: [5, -2], armR: { e: [150, 190], h: [210, 120] } });
      return { art, ui: grp(form(t, rel), 700, 680, 0.92, 3) };
    } },
    appScene(4, { title: 'Applied *online.*', phone: { title: 'Apply', rows: [['Name', 'Sipho'], ['Surname', 'Dlamini'], ['Born', '12 Mar 2014'], ['Birth cert.', 'attached'], ['Submit', '→', true]] },
      monitor: { title: 'Form 1 intake', rows: [['Sipho Dlamini', 'accept', true], ['Ayanda M.', 'accept'], ['Lindo S.', 'accept']] } }),
    { s: 5, draw(t, T, len, rel) {
      const art = rect(-20, 1240, 1120, 200, 0) + registrar({ x: 540, y: 820, s: 1.6, eyes: 'happy', glasses: true, ...talker(rel, t, [5], 'grin'), brow: 'up', armL: { e: [128, 214], h: [96, 300] }, armR: { e: [150, 130], h: [120, 30] } }) +
        path(`M${600},${740 + 60 * prog(t, rel(5) + 1.5, rel(5) + 2.5)} q10,18 0,24 q-10,-6 0,-24Z`, { w: 4, fill: '#fff' });
      return { art, ui: text(540, 220, '12 Mar *2014.*', { font: BRUSH, size: 130, weight: 400 }) };
    } },
    gssEnd(6, 'the registrar', registrar),
  ],
};
