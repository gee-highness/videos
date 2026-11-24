#!/usr/bin/env node
/* Prints the Termux commands that make an episode's voice files with Edge voices.
   node toons/voice.cjs sv03                      -> paste the output into Termux, then put the MP3s in toons/voice/<id>/
   node toons/voice.cjs vk09 +10% N=en-GB-RyanNeural A=en-US-EmmaMultilingualNeural    other speed and voices */
const fs = require('fs'), path = require('path');
const id = process.argv[2], rest = process.argv.slice(3), rate = rest.find((a) => /^[+-]\d+%$/.test(a)) || '+15%';
const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8'), src = fs.readFileSync(path.join(__dirname, 'ep', id + '.js'), 'utf8');
const EP = new Function(lib + '\n' + src + ';return EP')();
for (const a of rest) { const m = /^([A-Z])=(.+)$/.exec(a); if (m) EP.voices[m[1]] = m[2]; } // try another voice
const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
console.log(`mkdir -p ~/storage/downloads/${id}-voice && cd ~/storage/downloads/${id}-voice`);
console.log(`say(){ [ -s "$1.mp3" ] || edge-tts --rate=${rate} --voice "$2" --text "$3" --write-media "$1.mp3"; }`);
EP.voice.forEach((l, i) => console.log(`say ${l.n || String(i + 1).padStart(2, '0')} ${EP.voices[l.who]} ${q(l.text)}`));
console.log('ls -la');
