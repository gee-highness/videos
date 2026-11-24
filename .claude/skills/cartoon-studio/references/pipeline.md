# Pipeline: files, commands and the episode format

## Files
| Path | What it is |
|---|---|
| `scripts/toons/lib.js` | Drawing kit: primitives (`path`, `line`, `rect`, `circ`, `text`, `bubble`, `phone`, `screen`, `qr`, `cake`, `star`), `person()` (hair: short, afro, puff, wrap, cap, chef, bald; body: tee, apron, suit, blazer; eyes, brows, mouths, glasses, earrings, moustache, sweat, arms with held objects), `newsDesk()`, `tickerText()`, the frame composer, **art styles** (`STYLES`, `restyle`), automatic timing (`resolveTiming`) and the episode kit `K` |
| `scripts/toons/engine.cjs` | Renders an episode: `--stills 1,5,9`, `--style <name>`, `--timing`, `--audio-only`. Writes `toons/out/<id>[-style].mp4`, `-720.mp4`, `-sheet.jpg`, `<id>-timing.json` |
| `scripts/toons/sfx.cjs` | Synthesised sounds (pop, tick, buzz, ding, chime, whoosh, scribble, womp, sting, munch, thud) and the quiet plucked tune |
| `scripts/toons/voice.cjs` | Prints the Termux commands for one episode's voice lines |
| `scripts/toons/cutdowns.cjs` + `cuts.json` | 15-second cut-downs from finished videos (whole lines, crossfades, new progress bar) |
| `scripts/toons/compile.cjs` | Landscape YouTube compilation with title cards and a thumbnail |
| `scripts/toons/ep/<id>.js` | One episode |
| `scripts/toons/voice/<id>/NN.mp3` | Its voice files (kept in git so videos can be rebuilt) |
| `scripts/toons/termux-batch*.sh` | Voice scripts the user ran (the source of truth for each line's wording) |
| `toons/out/` | Rendered output (not in git) |

## The episode file (automatic timing)
```js
const { fillR, say, thandi, win, table, news, ownApp, devices, end } = K;
const EP = {
  id: 'vk09', title: 'Short title', auto: true, brand: '#2E8B57', accentOnInk: '#7BE3A8', url: 'vendakhona.vercel.app', logoFile: 'public/icons/icon-192x192.png',
  style: 'ink',                                   // optional; or pass --style
  voices: { N: 'en-GB-RyanNeural', A: 'en-US-EmmaMultilingualNeural', M: 'en-US-AndrewMultilingualNeural', L: 'en-US-AvaMultilingualNeural' },
  voice: [{ who: 'N', text: '...' }, ...],        // file NN.mp3 = line index + 1; gap after a line: 0.34 s (set `gap` to change)
  caps: [[lineIndex, 'Caption with *one* highlight']],
  sx: [[lineIndex, offsetSeconds, 'pop', volume]],
  scenes: [
    { s: 0, draw(t, T, len, rel) { return { art, ui }; } },   // art gets the strong wobble, ui the light one
    news(5, { bad: 5, good: 6, ticker: '...', badPip: (t) => '', goodPip: (t) => '' }),
    ownApp(8, { at: 8, name: 'Shop name', mark: 'SN', rows: [['Item', 'E90']], title: 'Her shop. *Her own app.*' }),
    devices(9, { owner: thandi }),
    end(12, { kind: 'vk', art: (t) => '' }),        // 'sv' for Servo
  ],
};
```
- Inside `draw`, `rel(i)` is when line *i* starts in this scene, `rel.end(i)` when it ends, `rel.on(i, t)` whether it is being spoken: sync bubbles, mouths (`...say(rel.on(i, t), t)`) and taps to speech.
- Layout: frame 1080x1920; title near y 200; art between y 330 and 1400; caption box around y 1450 to 1670; link strip at y 1800; progress bar at the bottom. Phones on screen: `phone(90, 390, 470, 900, inner)`.
- Music plays in every scene that is not `dry` (the news desk is dry). A missing or empty voice file is timed from its text and stays silent (the engine prints MISSING): never ship that.

## Kit `K` (end of lib.js)
Cast: `thandi`, `zanele`, `gama`, `sipho`, `lady`, `gogo`, `man`, `musa`, `lindiwe`, `boss`. Props: `win()`, `table(y)`, `counter(y)`, `smallPhone`, `buzz`, `mark(text, x, y, s)` (app icon), `stamp` (SOLD), `holdPhone(lit)`, `mug`, `icons`, `goat(x, y, s, flip)`, `light(x, y, s, colour)` (traffic light, "robot"). Scenes: `news`, `ownApp`, `devices` (with `s1/s2/s3/names/title` overrides), `end`.

## Delivery
- Masters 1080x1920 at CRF 24 (paper grain makes lower CRF huge); WhatsApp copies 720x1280 (3 to 6 MB a minute).
- One zip per batch: `1080x1920/`, `WhatsApp-720p/`, `captions.md`. Above about 250 MB, split into a 720p zip and a masters zip.
- Run long renders in the background as one command per queue (a `&` inside a background command gets killed when the command returns).
