# Two Stories, One Road: The Westville Dog Attack: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es02-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+0% --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es02-voice && cd ~/storage/downloads/es02-voice
say 01 'A man was mauled by three dogs on a Durban street. Now he and the dogs'\'' owner tell police two different stories.'
say 02 'Wednesday morning, Westville. Sizwe Doncabe was collecting recyclables.'
say 03 'Three pit bulls attacked him. He is in hospital, and his family says he could lose his right arm.'
say 05 'She says he followed her through the gate and grabbed her. She has laid assault and trespassing charges.'
say 07 'He says he never went in.'
say 08 'Now, to be fair, nothing is proven. Police are investigating both accounts.'
say 09 'The same three dogs were linked to two earlier attacks, on other dogs.'
say 10 'And the gate does matter.'
say 11 'In South African law an owner can be liable even without negligence, unless the victim had no right to be there.'
say 13 'Meanwhile, online, everyone has a verdict. On my TV, so does Gate Street.'
say 15 'Some people skipped the verdict. Gate Street, episode two.'
say 17 'A fund for his recovery has reportedly passed a hundred thousand rand.'
say 18 'Ban the breed, or licence owners? Tell me below. Check your sources. See you in the next one.'
cd .. && rm -f es02-voice.zip && zip -qr es02-voice.zip es02-voice && find es02-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es02-voice.zip (a file listed above is empty: run the block again)"
