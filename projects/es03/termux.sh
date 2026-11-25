# The Bride, the DJ and the Missing Song: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es03-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+0% --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es03-voice && cd ~/storage/downloads/es03-voice
say 01 'A bride stopped her own traditional wedding. Not over money. Not over family. Over one song.'
say 02 'In an Igbo wedding, called igba nkwu, everyone waits for one moment.'
say 03 'The bride takes a cup of palm wine and searches the crowd for her husband.'
say 04 'It usually takes a few minutes. Guests try to distract her. The groom often hides. Then the couple dance.'
say 05 'A bride identified as Sugah asked the DJ for one particular song. He said he did not have it.'
say 06 'He tried to download it. The download failed.'
say 07 'So he played another song by the same artist. She said no.'
say 08 'She reportedly said the song had been on her mind since her single days, and that she would go back to her father'\''s house unless it was found.'
say 09 'Her friends, family, in-laws, even the groom, reportedly begged her to take another one.'
say 10 'Now, to be fair. Online, people are split. Some say it is her day, and the DJ should be ready. Others say it is one song.'
say 11 'It is not the first time. In 2024, a video showed another Igbo bride holding back her wine until the DJ played Obodo. He played it. She served it.'
say 12 'Whoever is right, wedding planners say the same thing: tell your DJ your songs, and ask if he can play them, before the day.'
say 13 'And how did it end? The one report I found does not say.'
say 14 'Would you have waited for the song? Tell me below. Check your sources. See you in the next one.'
cd .. && rm -f es03-voice.zip && zip -qr es03-voice.zip es03-voice && find es03-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es03-voice.zip (a file listed above is empty: run the block again)"
