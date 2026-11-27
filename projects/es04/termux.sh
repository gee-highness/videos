# Chief Pete Edochie: The Voice That Carried a Culture: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es04-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=+0% --pitch=+6Hz --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es04-voice && cd ~/storage/downloads/es04-voice
say 01 'Nigeria has lost a giant. Chief Pete Edochie, the man who played Okonkwo, died on Wednesday. He was seventy-nine.'
say 02 'He was born in Zaria, and by fifteen he was already acting on a school stage.'
say 03 'His first career was broadcasting. He joined the broadcasting service in the East, and rose to Director of Programmes.'
say 04 'Then came Okonkwo, in Things Fall Apart. Overnight, he was a household name.'
say 05 'The BBC even sent a team to interview him.'
say 06 'By one count, over two hundred screen productions. Rituals. Igodo. Evil Men. And Lionheart, Nigeria'\''s first Netflix original.'
say 07 'That deep, unhurried voice, and a proverb for every moment, became what Governor Soludo called, the very sound of Igbo tradition on screen.'
say 09 'Funke Akindele, who worked with him, called him an inspiration. The Actors Guild called him a father figure.'
say 10 'In two thousand and three he became a Member of the Order of the Niger. In twenty twenty, an African Film Legend.'
say 11 'He showed a whole generation that a calm voice and a good story can carry a culture.'
say 12 'He leaves behind his wife, Barrister Josephine Edochie, and six children, including the actors Yul and Linc Edochie.'
say 13 'His eldest son, Leo, announced it in four words: An Iroko Has Fallen.'
say 14 'President Tinubu said it simply: Pete Edochie lived well.'
say 15 'Funeral details will be announced later. Rest well, Chief. And thank you for the stories.'
cd .. && rm -f es04-voice.zip && zip -qr es04-voice.zip es04-voice && find es04-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es04-voice.zip (a file listed above is empty: run the block again)"
