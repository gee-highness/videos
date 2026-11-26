/* NB01 "Gate Talk"  The Neighbourhood (fake cartoon series, original cast: Mr Verdict, Gogo Zodwa, Lwazi).
   Fictional characters only: never the real people in a story. Satire aims at certainty in comment sections, never at anyone hurt.
   Used inside projects/es02 (Westville reel). Timing follows the voice files (EP.auto). */
const EP = {
  voiceTempo: 0.95, id: 'nb01', title: 'Gate Talk', auto: true, brand: '#e0742f', accentOnInk: '#ffd166', url: '', series: 'The Neighbourhood', episode: 'Ep. 1',
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
  scenes: [],
};
