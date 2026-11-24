# The AI Takeover Quietly Stalled. Here's What the Numbers Say: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es01-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=-4% --voice en-US-AndrewMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es01-voice && cd ~/storage/downloads/es01-voice
say 01 'When AI first walked into the corporate world, it came with a simple promise.'
say 02 'Fewer people. Faster work. Productivity that climbs overnight.'
say 03 'On paper, it made complete sense.'
say 04 'In practice, something else happened.'
say 05 'In 2025, researchers at MIT looked at more than three hundred public AI projects, and interviewed and surveyed the people running them.'
say 06 'Companies had poured somewhere between thirty and forty billion dollars into generative AI.'
say 07 'And ninety-five percent of the organisations they studied were getting no measurable return from it. Not a loss. Just nothing.'
say 08 'The reason wasn'\''t that the models were bad. It was that most of them couldn'\''t learn.'
say 09 'They didn'\''t remember feedback. They didn'\''t adapt to how a company actually works. So every day, people had to explain the same things again.'
say 10 'Meanwhile, something strange was happening at the desks. Most workers were already using their own AI tools, quietly, while far fewer companies had bought an official one.'
say 11 'And the money went to the wrong places. More than half of the budgets went to sales and marketing, while the biggest returns were showing up in the boring back office.'
say 12 'The five percent that worked did one thing differently. They picked narrow problems, bought tools that could learn, and let the people closest to the work decide.'
say 13 'So the takeover didn'\''t fail because AI is useless. It stalled because replacing people turned out to be the wrong goal.'
say 14 'And that might be the best news this story could have.'
cd .. && rm -f es01-voice.zip && zip -qr es01-voice.zip es01-voice && find es01-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es01-voice.zip (a file listed above is empty: run the block again)"
