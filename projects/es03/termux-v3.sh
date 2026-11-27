V=en-US-AvaMultilingualNeural; R=+4%; P=+8Hz   # change these three after the voice audition
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=$R --pitch=$P --voice $V --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es03-voice && cd ~/storage/downloads/es03-voice
say 01 'Bestie, a bride stopped her own wedding. Not over money. Not over family. Over one song.'
say 02 'In an Igbo wedding, the bride takes a cup of palm wine and searches the crowd for her husband.'
say 03 'Guests try to distract her. The groom often hides. It usually takes minutes.'
say 04 'A bride identified as Sugah asked the DJ for one particular song. He said he did not have it.'
say 05 'He tried to download it. It failed. So he played another song by the same artist.'
say 06 'She said no.'
say 07 'She reportedly said she had wanted that song since her single days, and would go back to her father'\''s house unless it was found.'
say 08 '[shot press-ghpage.png | GhPage, 24 Nov 2026] Her friends, family, in-laws, even the groom, reportedly begged her to take another one.'
say 09 'Now, to be fair. Online, people are split. Some say it is her day. Others say it is one song.'
say 10 'It is not the first time. In 2024, another Igbo bride held back her wine until the DJ played Obodo. He played it. She served it.'
say 11 'Wedding planners say the same thing: tell your DJ your songs before the day.'
say 12 'Would you have waited for the song? Tell me below. Dream big. Check your sources. See you in the next one.'
cd .. && rm -f es03-voice.zip && zip -qr es03-voice.zip es03-voice && find es03-voice -name '*.mp3' -size 0 && echo 'Done: Downloads/es03-voice.zip (a file listed above is empty: run the block again)'
