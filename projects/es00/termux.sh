# The AI Takeover Quietly Stalled. Here's What the Numbers Say: every voice line. Paste the whole block into Termux (needs: pkg install python zip; pip install edge-tts).
# Each line retries up to 5 times, and lines already made are skipped, so it is safe to run again. Send back Downloads/es01-voice.zip
say(){ n=0; until [ -s "$1.mp3" ] || [ $n -ge 5 ]; do rm -f "$1.mp3"; edge-tts --rate=-4% --voice en-US-AndrewMultilingualNeural --text "$2" --write-media "$1.mp3"; n=$((n+1)); [ -s "$1.mp3" ] || sleep 2; done; }
mkdir -p ~/storage/downloads/es01-voice && cd ~/storage/downloads/es01-voice
say 01 'A few years ago, every company was sold the same promise.'
say 02 'Fewer people. Faster work. Profits that climb overnight.'
say 03 'Then someone actually counted.'
say 04 'Ninety-five percent of the organisations studied got no measurable return from it.'
say 05 'Not a loss. Just... nothing. So what went wrong?'
say 06 'In 2025, researchers at MIT went looking for the answer.'
say 07 'They studied more than three hundred public AI projects, and talked to the people running them.'
say 08 'Companies had spent an estimated thirty to forty billion dollars.'
say 09 'And only about five percent of the projects that went live made real money.'
say 10 'Imagine hiring an assistant who forgets everything you taught them, every single morning.'
say 11 'That, the researchers said, was the real problem.'
say 12 'The tools didn'\''t learn. They didn'\''t remember feedback, or adapt to how the work is really done.'
say 13 'Meanwhile, workers were quietly using their own AI tools.'
say 14 'About nine in ten said they did. Only about four in ten companies had bought an official one.'
say 15 'Think about the last time you used an AI tool at work. Did your company give it to you?'
say 16 'And the money went to the loud places. More than half of it went to sales and marketing.'
say 17 'But the best returns were hiding in the boring back office.'
say 18 'So what did the five percent do differently?'
say 19 'They picked one narrow job. They bought tools that could learn. And they let the people doing the work decide.'
say 20 'Tools bought from specialists worked about two times in three. Tools built in-house, about a third as often.'
say 21 'So the takeover didn'\''t fail because AI is useless.'
say 22 'It stalled because replacing people was the wrong goal.'
say 23 'And that might be the best news in this whole story.'
cd .. && rm -f es01-voice.zip && zip -qr es01-voice.zip es01-voice && find es01-voice -name "*.mp3" -size 0 && echo "Done: Downloads/es01-voice.zip (a file listed above is empty: run the block again)"
