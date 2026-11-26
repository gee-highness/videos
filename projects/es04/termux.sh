# Chief Pete Edochie: The Voice That Carried a Culture: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es04-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=-4% --voice en-US-AvaMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es04-voice && cd ~/storage/downloads/es04-voice
say 01 'Nigeria has lost a giant. Chief Pete Edochie, the man who played Okonkwo, died on Wednesday, the twenty-fifth of November. He was seventy-nine.'
say 02 'He was born in Zaria in nineteen forty-seven.'
say 03 'At fifteen, he was already on a school stage, acting scenes from The Merchant of Venice.'
say 04 'His first career was broadcasting. In nineteen sixty-seven he joined the broadcasting service in the East, and rose to Director of Programmes.'
say 05 'Then, in nineteen eighty-seven, came Okonkwo, in the television adaptation of Chinua Achebe'\''s Things Fall Apart.'
say 06 'It made him a household name. The BBC even sent a team to interview him.'
say 07 'By one count, he went on to more than two hundred screen productions.'
say 08 'Rituals. Igodo. Evil Men. And in twenty eighteen, Lionheart, Nigeria'\''s first Netflix original film.'
say 09 'That deep, unhurried voice, and a proverb for every moment, became what Governor Soludo called, the very sound of Igbo tradition on screen.'
say 10 'In two thousand and three he was made a Member of the Order of the Niger.'
say 11 'In twenty twenty, he received the African Film Legend award.'
say 12 'Funke Akindele, who worked with him, called him an inspiration. The Actors Guild called him a father figure.'
say 13 'He showed that a calm voice and a good story can carry a whole culture.'
say 14 'He leaves behind his wife, Barrister Josephine Edochie, and six children, including the actors Yul and Linc Edochie.'
say 15 'His eldest son, Leo, announced it in a statement of four words: An Iroko Has Fallen.'
say 16 'President Tinubu said it simply: Pete Edochie lived well.'
say 17 'Funeral details will be announced later. Rest well, Chief. And thank you for the stories.'
cd .. && rm -f es04-voice.zip && zip -qr es04-voice.zip es04-voice && find es04-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es04-voice.zip (a file listed above is empty: run the block again)"
