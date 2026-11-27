/* NB01 "Gate Talk"  The Neighbourhood (fake cartoon series, original cast: Mr Verdict, Gogo Zodwa, Lwazi).
   Fictional characters only: never the real people in a story. Satire aims at certainty in comment sections, never at anyone hurt.
   Used inside projects/es02 (Westville reel). Timing follows the voice files (EP.auto). */
const { talker } = K;
const cast3 = (t, rel, st = {}) => {
  const zoom = st.zoom || 1;
  const V = nbVerdict({ x: 580, y: 880, s: 1.55, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [0, 2, 3, 5], 'flat'), brow: st.vBrow || '', sweat: st.sweat, armR: st.vArm, look: [0, 0] });
  const G = nbGogo({ x: 215, y: 960, s: 1.3, eyes: blink(t, 1) ? 'closed' : 'open', ...talker(rel, t, [1, 7, 9], 'flat'), brow: st.gBrow || '', armL: undefined });
  const L = nbLwazi({ x: 905, y: 1040, s: 1.1, eyes: blink(t, 2) ? 'closed' : 'open', ...talker(rel, t, [4, 6, 8], 'smile'), brow: st.lBrow || '' });
  return G + V + L;
};
const EP = {
  voiceTempo: 0.95, id: 'nb01', title: 'Gate Talk', auto: true, brand: '#e0742f', accentOnInk: '#ffd166', url: '', logoFile: 'toons/logos/neighbourhood-mark.svg', series: "Kuina's Neighbourhood", episode: 'Ep. 1',
  voices: { V: 'en-ZA-LukeNeural', G: 'en-ZA-LeahNeural', L: 'en-US-AnaNeural' },
  voice: [
    { who: 'V', text: 'Ladies and gentlemen of Gate Street. I have solved the Westville case.' },
    { who: 'G', text: 'Oh? How?', gap: 0.5 },
    { who: 'V', text: 'He was inside the gate. I read it in a comment.', gap: 0.6 },
    { who: 'V', text: 'Wait. Another comment says he was outside. I am one hundred percent sure of both.', gap: 0.8 },
    { who: 'L', text: 'Uncle Verdict, were you there?', gap: 0.9 },
    { who: 'V', text: 'No. But I have watched two seasons of a courtroom show.', gap: 0.7 },
    { who: 'L', text: 'So nobody on this street knows where he was standing?', gap: 0.9 },
    { who: 'G', text: 'Nobody.', gap: 0.7 },
    { who: 'L', text: 'Then why is everyone shouting?', gap: 0.8 },
    { who: 'G', text: 'Because shouting is free. Surgery is not.', gap: 1.0 },
  ],
  caps: [[0, 'Ladies and gentlemen of\nGate Street.\nI have *solved* the case.', 1], [1, '“Oh? *How?*”', 2], [2, 'He was *inside* the gate.\nI read it in a comment.', 3], [3, 'Wait. *Outside.*\n100% sure of *both.*', 4], [4, '“Were *you there?*”', 5],
    [5, '“No. But I watched\n*two seasons* of a courtroom show.”', 6], [6, '“So nobody knows\nwhere he was *standing?*”', 7], [7, '“*Nobody.*”', 8], [8, '“Then why is\neveryone *shouting?*”', 9], [9, '“Because shouting is *free.*\nSurgery is *not.*”']],
  sx: [[0, 0.1, 'pop'], [2, 0.3, 'chime', 0.7], [3, 0.0, 'sting', 0.6], [5, 0.5, 'womp', 0.7], [7, 0.1, 'tick'], [9, 1.6, 'ding', 0.8]],
  mood: 'comedy',
  scenes: [
    { s: 0, draw(t, T, len, rel) {
      const art = nbStreet() + nbBoard(190, 140, 700, 440, chalk(540, 300, 'THE GATE CASE', 96) + line('M400,420 v120 M470,420 v120 M540,420 v120 M610,420 v120 M680,420 v120 M390,540 h300', { w: 7, stroke: '#f2efe4' }) + chalk(540, 410, '?', 120, { rot: -6 })) +
        cast3(t, rel, { vArm: { e: [140, 90], h: [130, -30] }, gBrow: 'up' });
      return { art, ui: nbTitle(t, EP.series, EP.episode, EP.title) };
    } },
    { s: 2, draw(t, T, len, rel) {
      const l3 = t > rel(3);
      const art = nbStreet() + nbBoard(190, 140, 700, 440, chalk(540, 280, l3 ? 'OUTSIDE!' : 'INSIDE!', 130) + (l3 ? chalk(540, 180, 'INSIDE', 64, { fill: '#9aa' }) + line('M390,160 H690', { w: 8, stroke: '#e5484d' }) + chalk(540, 450, '100% SURE × 2', 78, { fill: '#ffd166' }) : line('M300,330 H780', { w: 7, stroke: '#f2efe4' }))) +
        cast3(t, rel, { vArm: { e: [140, 90], h: [135, -40] }, sweat: l3, vBrow: l3 ? 'up' : '', gBrow: 'one' });
      return { art, ui: '' };
    } },
    { s: 4, draw(t, T, len, rel) {
      const art = nbStreet() + nbBoard(190, 140, 700, 440, chalk(540, 340, 'WERE YOU', 112) + chalk(540, 470, 'THERE?', 130, { fill: '#ffd166' })) + cast3(t, rel, { vBrow: t > rel(5) ? '' : 'sad', gBrow: 'one', lBrow: 'up' });
      return { art, ui: '' };
    } },
    { s: 7, tail: 1.2, draw(t, T, len, rel) {
      const l9 = t > rel(9), l7 = t > rel(7);
      const art = nbStreet() + nbBoard(190, 140, 700, 440, chalk(540, 250, 'WHO WAS WHERE?', 84) + (l7 ? chalk(540, 370, 'NOBODY KNOWS', 100, { fill: '#ffd166' }) : '') + (l9 ? chalk(540, 490, 'SHOUTING: R0', 80, { fill: '#7fe0a0' }) : '')) +
        cast3(t, rel, { vBrow: 'sad', gBrow: l9 ? '' : 'one' });
      return { art, ui: '' };
    } },
  ],
};
