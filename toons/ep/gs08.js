/* GS08 "The letter"  For parents and principals (demo: Parent / Guardian). Timing follows the voice files (EP.auto). */
const { gogo, learner, win, bag, appScene, gssEnd, talker } = K;
const room = () => win() + rect(-20, 1240, 1120, 200, 0);
const letter = (x, y, s = 1, rot = 0) => grp(path('M-130,-170 L120,-160 L140,170 L-120,160 Z', { fill: '#fff', w: 6 }) + line('M-100,-120 l40,20 l30,-14 l50,22 M-90,-60 h170 M-90,-20 h150 M-90,20 h170 M-90,60 h120', { w: 4 }) +
  text(0, -126, 'SPORTS DAY', { size: 36 }) + path('M30,90 q60,-10 90,40 q-60,30 -90,-40Z', { fill: '#f0d48a', w: 5 }) + text(-40, 140, 'March', { size: 34, fill: BRAND }), x, y, s, rot);
const EP = {
  voiceTempo: 0.9, gapScale: 2.2, gapMin: 0.9, holdCaps: true, endTail: 4, id: 'gs08', title: 'The letter', auto: true, brand: '#1f6f4a', accentOnInk: '#f5c84b', url: 'gss-lms.vercel.app/demo', logoFile: 'toons/logos/gss-mark.svg',
  voices: { N: 'en-GB-RyanNeural', Z: 'en-ZA-LeahNeural', K: 'en-US-AnaNeural' },
  voice: [
    { who: 'Z', text: "Sipho. Why didn't you tell me about sports day?" },
    { who: 'K', text: 'I gave you the letter.', gap: 0.25 },
    { who: 'Z', text: 'When?', gap: 0.25 },
    { who: 'K', text: '...Now.', gap: 0.6 },
    { who: 'N', text: 'The letter is from March.', gap: 0.5 },
    { who: 'N', text: "On GSS-LMS, school notices show up in the parent's app. Sports day, meetings, forms to sign. No school bag in between." , gap: 0.9 },
    { who: 'Z', text: 'And this one smells of banana.', gap: 0.4 },
    { who: 'N', text: 'GSS-LMS. Open the demo as a parent.', gap: 0.6 },
  ],
  caps: [[0, '“Why didn\'t you tell me\nabout *sports day?*”'], [1, '“I gave you *the letter.*”'], [2, '“*When?*”'], [3, '“…*Now.*”'], [4, 'The letter is *from March.*'], [5, 'Notices in the *parent\'s app.*\n*No school bag in between.*'], [6, '“It smells of *banana.*”']],
  sx: [[0, 0.1, 'pop'], [1, 0.1, 'pop'], [2, 0.0, 'tick'], [3, -0.4, 'scribble', 0.8], [3, 0.3, 'pop', 1.2], [4, 0.6, 'womp', 0.8], [5, -0.2, 'whoosh'], [5, 3.2, 'pop'], [5, 5.0, 'ding', 0.8], [6, 1.2, 'chime'], [7, 0.2, 'whoosh'], [7, 0.7, 'ding', 0.7]],
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const pull = ease(prog(t, rel(3) - 0.5, rel(3) + 0.4));
      const art = room() + gogo({ x: 280, y: 820, s: 1.5, eyes: t > rel(4) ? 'half' : 'open', ...talker(rel, t, [0, 2], 'flat'), brow: t > rel(3) ? 'one' : 'angry', look: [4, 0] }) +
        learner({ x: 720, y: 940, s: 1.2, eyes: 'happy', ...talker(rel, t, [1, 3], 'smile'), look: [-4, 0], armR: { e: [150, 190], h: [lerp(100, 220, pull), lerp(300, 120, pull)] } }) + bag(900, 1180, 0.9, 6);
      return { art, ui: (pull > 0.05 ? letter(lerp(900, 640, pull), lerp(1120, 560, pull), 0.4 + 0.6 * pull, -8 + 14 * pull) : '') + (t > rel(4) ? grp(rect(-180, -50, 360, 100, 14, { fill: INK, w: 0 }) + text(0, 18, 'From March', { size: 52, fill: '#fff', font: BRUSH, weight: 400 }), 640, 260, pop(prog(t, rel(4), rel(4) + 0.3)), -3) : '') };
    } },
    appScene(5, { title: '*No bag* in between.', phone: { title: 'Notices', rows: [['Sports day', 'Fri 14 Mar', true], ['Meeting', 'book'], ['Trip form', 'sign'], ['Term dates', 'new']] } }),
    { s: 6, draw(t, T, len, rel) {
      const art = room() + gogo({ x: 400, y: 820, s: 1.55, eyes: 'closed', ...talker(rel, t, [6], 'wavy'), brow: 'one', tilt: -6, armR: { e: [150, 160], h: [200, 100] } });
      return { art, ui: letter(760, 640, 0.8, 8) + line(`M${740 + wig(t, 1, 6)},430 q-14,-24 0,-44 q14,-22 0,-44 M${800 + wig(t, 1.2, 6)},440 q-14,-24 0,-44 q14,-22 0,-44`, { w: 4 }) };
    } },
    gssEnd(7, 'a parent', gogo),
  ],
};
