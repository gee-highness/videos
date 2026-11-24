# Art styles

All drawings use three colours: INK lines (`#16130f`), white fills, PAPER fills (`#f4f0e6`). A style (an entry in `STYLES` in `scripts/toons/lib.js`) swaps those colours, changes the paper, the line wobble (`boil`, `boilFreq`, `boilUi`), the texture (`grain`, `grainTone`, `grainFreq`), the line weight (`scale`), and can add a glow (`glow: true`), a cut-paper shadow (`shadow: true`) or a backdrop. Brand colours are never changed. Captions keep their dark box in every style so they stay readable.

Use: `node scripts/toons/engine.cjs <id> --style chalk` (output `toons/out/<id>-chalk.mp4`), or `style: 'chalk'` in the episode. Cut-downs: `node scripts/toons/cutdowns.cjs <id>:chalk`.

| Style | Look | Best for |
|---|---|---|
| `ink` | Black ink on cream paper, boiling line | The main "Small Business News" episodes |
| `chalk` | Chalk on a charcoal slate, rough line, heavy grain | Explainers, tips, "Kasi Business School" |
| `neon` | Glowing white lines on a night-blue ground | Night stories, festive season, 2 AM orders |
| `cutout` | Cream paper shapes with a drop shadow on kraft card | Warm family, stokvel and heritage stories |
| `signpaint` | Bold thick outlines on a sunny yellow wall, hardly any wobble | Street and township business series, loud announcements |

## How to add a style
1. Add an entry to `STYLES` (copy the closest one). Keep contrast: brand colours (green `#2E8B57`, purple `#8A6CF0`) must stand out on the new paper (the first chalk board was green and swallowed the Venda Khona green; it is now charcoal).
2. Render the comparison sheet: three frames (`vk01` at 4.5 and 27 s, `sv01` at 26.5 s) in every style, joined side by side, and look at it.
3. Render one full episode and its cut-down in the style, check the contact sheet.
4. Add a row above, a line in `lessons.md`, and tell the user what it is for.

## Styles to build next (ideas)
- **Comic halftone**: dots in the fills, speech-balloon lettering, panel borders between scenes (needs a pattern fill in `restyle` and a panel transition).
- **Watercolour wash**: soft blotchy fills (feTurbulence + feColorMatrix into the fills), pencil-thin lines.
- **Linocut / woodcut**: white on black with carved hatching; strong for proverbs ("Ask Gogo").
- **Blueprint**: white lines on blue grid for "how it works" explainers.
- **Newspaper**: grey newsprint, headline type, for "Small Business News" specials.
- **Pixel art**: a different renderer (draw on a 270x480 grid and scale up); for a gaming-style series.
- **Pattern-inspired** (geometric borders in the spirit of Southern African wall painting and beadwork): only as borders and backgrounds, never copying a specific community's sacred or ceremonial designs; ask the user before using.
