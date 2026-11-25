# The Bride, the DJ and the Missing Song: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es03-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+0% --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es03-voice && cd ~/storage/downloads/es03-voice
say 01 'A bride stopped her own traditional wedding. Not over money. Not over family. Over one song.'
say 02 'In an Igbo wedding, called igba nkwu, everyone waits for one moment. The bride takes a cup of palm wine and searches the crowd for her husband.'
say 03 'A bride identified as Sugah asked the DJ for one particular song. He told her he did not have it. He tried to download it. It failed. He played another song by the same artist.'
say 04 'She said no. She reportedly told them she would go back to her father'\''s house unless the song was found. Her friends, family, in-laws and even the groom reportedly begged her to take another one. Now, to be fair. Online, people are split. Some say it is her day and the DJ should be ready. Some say it is one song.'
say 05 'Whoever'\''s right, the lesson is free. Send your DJ the list before the day. And how did it end? The one report I found does not say. Would you have waited for the song? Tell me below. Check your sources. See you in the next one.'
cd .. && rm -f es03-voice.zip && zip -qr es03-voice.zip es03-voice && find es03-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es03-voice.zip (a file listed above is empty: run the block again)"
