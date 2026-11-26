# es02: host lines (Ava) and the two cartoon skits (nb01, nb02). Paste all of it. Lines already made are skipped; send back Downloads/es02-all-voices.zip
cd ~/storage/downloads && mkdir -p es02-all-voices
hsay(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+0% --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
tsay(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+10% --voice "$2" --text "$3" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p es02-all-voices/es02 es02-all-voices/nb01 es02-all-voices/nb02
cd es02-all-voices/es02
hsay 01 'A man was mauled by three dogs on a Durban street. Now he and the dogs'\'' owner tell police two different stories.'
hsay 02 'Wednesday morning, Westville. Sizwe Doncabe was collecting recyclables.'
hsay 03 'Three pit bulls attacked him. He is in hospital, and his family says he could lose his right arm.'
hsay 05 'She says he followed her through the gate and grabbed her. She has laid assault and trespassing charges.'
hsay 07 'He says he never went in.'
hsay 08 'Now, to be fair, nothing is proven. Police are investigating both accounts.'
hsay 09 'The same three dogs were linked to two earlier attacks, on other dogs.'
hsay 10 'Meanwhile, online, everyone has a verdict. On my TV, so does Gate Street.'
hsay 12 'And the gate does matter.'
hsay 13 'In South African law an owner can be liable even without negligence, unless the victim had no right to be there.'
hsay 14 'Some people skipped the verdict. Gate Street, episode two.'
hsay 16 'A fund for his recovery has reportedly passed a hundred thousand rand.'
hsay 17 'Ban the breed, or licence owners? Tell me below. Check your sources. See you in the next one.'
cd ../nb01
tsay 01 en-ZA-LukeNeural 'Ladies and gentlemen of Gate Street. I have solved the Westville case.'
tsay 02 en-ZA-LeahNeural 'Oh? How?'
tsay 03 en-ZA-LukeNeural 'He was inside the gate. I read it in a comment.'
tsay 04 en-ZA-LukeNeural 'Wait. Another comment says he was outside. I am one hundred percent sure of both.'
tsay 05 en-US-AnaNeural 'Uncle Verdict, were you there?'
tsay 06 en-ZA-LukeNeural 'No. But I have watched two seasons of a courtroom show.'
tsay 07 en-US-AnaNeural 'So nobody on this street knows where he was standing?'
tsay 08 en-ZA-LeahNeural 'Nobody.'
tsay 09 en-US-AnaNeural 'Then why is everyone shouting?'
tsay 10 en-ZA-LeahNeural 'Because shouting is free. Surgery is not.'
cd ../nb02
tsay 01 en-ZA-LeahNeural 'Lwazi. Fetch my jar.'
tsay 02 en-US-AnaNeural 'The fridge jar? Gogo, that is for the new fridge.'
tsay 03 en-ZA-LeahNeural 'A man is in hospital. His family says he could lose his arm. The fridge can wait.'
tsay 04 en-ZA-LukeNeural 'I can give an opinion for free.'
tsay 05 en-ZA-LeahNeural 'Keep your opinion. Bring a rand.'
tsay 06 en-US-AnaNeural 'Is one rand enough?'
tsay 07 en-ZA-LeahNeural 'One rand is small. A thousand small rands are not.'
tsay 08 en-ZA-LukeNeural 'Okay. That one was louder than my opinion.'
cd ~/storage/downloads && rm -f es02-all-voices.zip && zip -qr es02-all-voices.zip es02-all-voices && find es02-all-voices -name '*.mp3' -size 0 && echo 'Done: Downloads/es02-all-voices.zip (a file listed above is empty: run the block again)'
