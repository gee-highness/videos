/* NB02 "The Jar"  The Neighbourhood (fake cartoon series). Fictional characters only. Used inside projects/es02 (Westville reel). */
const { talker } = K;
const cast2 = (t, rel, st = {}) => {
  const G = nbGogo({ x: 165, y: 880, s: 1.4, eyes: blink(t) ? 'closed' : 'open', ...talker(rel, t, [0, 2, 4, 6], 'flat'), brow: st.gBrow || '', armR: st.gArm });
  const V = nbVerdict({ x: 945, y: 900, s: 1.35, eyes: blink(t, 1) ? 'closed' : 'open', ...talker(rel, t, [3, 7], 'flat'), brow: st.vBrow || '', armL: st.vArm });
  const L = nbLwazi({ x: 440, y: 1000, s: 1.1, eyes: blink(t, 2) ? 'closed' : 'open', ...talker(rel, t, [1, 5], 'smile'), brow: st.lBrow || '' });
  return G + V + L;
};
const jar = (x, y, coins, label, lab2) => grp(jar0(0, 0, coins, label, lab2), x, y, 0.85);
const jar0 = (x, y, coins, label, lab2) => { let c = ''; for (let i = 0; i < coins; i++) c += circ(x - 80 + (i % 4) * 54 + (i % 2) * 10, y + 150 - Math.floor(i / 4) * 30, 24, { fill: i % 3 ? '#ffd166' : '#e8e0c0', w: 4 }) + '';
  return rect(x - 130, y - 170, 260, 340, 36, { fill: '#e8f6fb', w: 7 }) + c + rect(x - 112, y - 215, 224, 56, 12, { fill: '#8a5a3b', w: 6 }) + rect(x - 96, y - 40, 192, 74, 8, { fill: lab2 ? '#7fe0a0' : '#fff', w: 5 }) + text(x, y + 4, label, { size: label.length > 8 ? 30 : 40 }) + (lab2 ? text(x, y + 28, lab2, { size: 22 }) : ''); };
const EP = {
  voiceTempo: 0.95, id: 'nb02', title: 'The Jar', auto: true, brand: '#e0742f', accentOnInk: '#ffd166', url: '', logoFile: 'toons/logos/neighbourhood-mark.svg', series: "Kuina's Neighbourhood", episode: 'Ep. 2',
  voices: { V: 'en-ZA-LukeNeural', G: 'en-ZA-LeahNeural', L: 'en-US-AnaNeural' },
  voice: [
    { who: 'G', text: 'Lwazi. Fetch my jar.' },
    { who: 'L', text: 'The fridge jar? Gogo, that is for the new fridge.', gap: 0.6 },
    { who: 'G', text: 'A man is in hospital. His family says he could lose his arm. The fridge can wait.', gap: 0.8 },
    { who: 'V', text: 'I can give an opinion for free.', gap: 0.8 },
    { who: 'G', text: 'Keep your opinion. Bring a rand.', gap: 0.7 },
    { who: 'L', text: 'Is one rand enough?', gap: 0.7 },
    { who: 'G', text: 'One rand is small. A thousand small rands are not.', gap: 0.8 },
    { who: 'V', text: 'Okay. That one was louder than my opinion.', gap: 1.2 },
  ],
  caps: [[0, '“Lwazi. *Fetch* my jar.”', 1], [1, '“The *fridge* jar? Gogo,\nthat is for the new fridge.”', 2], [2, '“A man is in hospital.\nHis family says he could\nlose his arm. *The fridge can wait.*”', 3], [3, '“I can give an\n*opinion* for free.”', 4], [4, '“Keep your opinion.\n*Bring a rand.*”', 5], [5, '“Is one rand enough?”', 6],
    [6, '“One rand is small.\nA *thousand* small rands\nare *not.*”', 7], [7, '“Okay. That one was *louder*\nthan my opinion.”']],
  sx: [[0, 0.1, 'pop'], [4, 0.9, 'chime', 0.7], [5, 0.6, 'tick'], [6, 0.4, 'ding', 0.7], [6, 1.4, 'ding', 0.7], [6, 2.4, 'ding', 0.8], [7, 0.3, 'ding', 0.9]],
  mood: 'comedy',
  scenes: [
    { s: 0, draw(t, T, len, rel) { const l2 = t > rel(2);
      const art = nbStreet() + cast2(t, rel, { gArm: { e: [150, 190], h: [190, 90] }, lBrow: 'sad', gBrow: l2 ? 'sad' : '' }) + jar(690, 1160, 0, l2 ? 'FOR HIS' : 'FRIDGE', l2 ? 'RECOVERY' : '');
      return { art, ui: nbTitle(t, EP.series, EP.episode, EP.title) };
    } },
    { s: 3, draw(t, T, len, rel) {
      const art = nbStreet() + cast2(t, rel, { gBrow: t > rel(4) ? 'angry' : 'one', vArm: { e: [150, 170], h: [190, 80] } }) + jar(690, 1160, 0, 'FOR HIS', 'RECOVERY');
      return { art, ui: '' };
    } },
    { s: 5, tail: 1.4, draw(t, T, len, rel) {
      const n = Math.floor(prog(t, rel(6), rel.end(7)) * 12) + (t > rel(7) ? 1 : 0), drop = (rel.end(7) - rel(6)) / 12;
      const art = nbStreet() + cast2(t, rel, { gBrow: '', vBrow: t > rel(7) ? 'up' : '', lBrow: 'up' }) + jar(690, 1160, Math.min(n, 13), 'FOR HIS', 'RECOVERY');
      return { art, ui: '' };
    } },
  ],
};
