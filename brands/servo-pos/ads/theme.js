// The shared promo palette: warm and lively, one gradient per slide so a sequence feels like a menu board, not a wall of one colour.
// Each is dark enough at the top for white text; `ink` is the deep tone used for chip and tag text.
// Generators set the colours as CSS variables on <body>: `.s{background:linear-gradient(...,var(--c1),var(--c2),var(--c3))}`, `color:var(--ink)`.
const PALETTES = [
  { name: "ember", c1: "#7A1F0A", c2: "#D9480F", c3: "#FF8A3D", ink: "#7A1F0A" },
  { name: "amber", c1: "#7A3D00", c2: "#D98200", c3: "#F5B02E", ink: "#7A3D00" },
  { name: "teal", c1: "#053B3F", c2: "#0E8A82", c3: "#34C9A9", ink: "#053B3F" },
  { name: "berry", c1: "#5B0F3C", c2: "#B8236B", c3: "#F0568F", ink: "#5B0F3C" },
  { name: "ocean", c1: "#0B2A5B", c2: "#1F6FEB", c3: "#5CB0FF", ink: "#0B2A5B" },
  { name: "plum", c1: "#25165e", c2: "#5b3fd6", c3: "#7c5cff", ink: "#25165e" },
];
const pick = (i) => PALETTES[((i % PALETTES.length) + PALETTES.length) % PALETTES.length];
const vars = (i) => { const p = pick(i); return `--c1:${p.c1};--c2:${p.c2};--c3:${p.c3};--ink:${p.ink}`; };
module.exports = { PALETTES, pick, vars };
