# GSS-LMS cartoon shorts GS01-GS10: every voice line. Paste the whole thing into Termux.
# Safe to run again: lines already made are skipped. At the end: one zip in Downloads to send back.
# Voices: N Ryan (narrator), A Emma (Nomsa), L Ava, M Andrew, U Luke (en-ZA), Z Leah (en-ZA), K Ana (child)

termux-setup-storage 2>/dev/null; pkg install -y python zip >/dev/null; pip install -q edge-tts
say(){ [ -s "$1.mp3" ] || edge-tts --rate=+15% --voice "$2" --text "$3" --write-media "$1.mp3"; }
ep(){ mkdir -p ~/storage/downloads/gss-voices/$1 && cd ~/storage/downloads/gss-voices/$1; }

# ---- GS01 "Blessed Tuesday"
ep gs01
say 01 en-GB-RyanNeural 'Seven a.m. One simple question.'
say 02 en-US-AvaMultilingualNeural 'How many learners are absent today?'
say 03 en-US-AndrewMultilingualNeural 'Let me ask the staff group.'
say 04 en-GB-RyanNeural 'Forty messages later, someone sent a picture of flowers.'
say 05 en-GB-RyanNeural 'It said: Blessed Tuesday.'
say 06 en-GB-RyanNeural 'With GSS-LMS, teachers take the register on their phones, and it lands on her screen: who'\''s absent, and which register isn'\''t done.'
say 07 en-US-AvaMultilingualNeural 'Twelve absent. And Tuesday is blessed.'
say 08 en-GB-RyanNeural 'GSS-LMS. Open the demo as the principal.'

# ---- GS02 "Report week"
ep gs02
say 01 en-GB-RyanNeural 'Report week. The staff room hasn'\''t seen the sun since Tuesday.'
say 02 en-US-AndrewMultilingualNeural 'Maths is done. Who has the English marks?'
say 03 en-US-AvaMultilingualNeural 'On a flash drive.'
say 04 en-US-AndrewMultilingualNeural 'Where is the flash drive?'
say 05 en-US-AvaMultilingualNeural 'Manzini.'
say 06 en-GB-RyanNeural 'On GSS-LMS, marks go in once, during the term. The term mark works itself out, and report cards come straight out of it, ready to sign.'
say 07 en-US-AndrewMultilingualNeural 'So what do we do in report week?'
say 08 en-GB-RyanNeural 'Go home.'
say 09 en-GB-RyanNeural 'GSS-LMS. Open the demo as the principal.'

# ---- GS03 "From: Mom"
ep gs03
say 01 en-ZA-LukeNeural 'Proof of payment. One thousand five hundred. From: Mom.'
say 02 en-ZA-LukeNeural 'We have six hundred learners.'
say 03 en-ZA-LukeNeural 'They all have a mom.'
say 04 en-GB-RyanNeural 'On GSS-LMS, parents upload the proof under their own child. The bursar checks it once: the balance updates, the receipt is made, and the statement is always up to date.'
say 05 en-ZA-LukeNeural 'Whichever mom it was. Thank you.'
say 06 en-GB-RyanNeural 'GSS-LMS. Open the demo as the bursar.'

# ---- GS04 "One whiteboard"
ep gs04
say 01 en-GB-RyanNeural 'The new timetable. Three weeks. One whiteboard. Four markers. One still works.'
say 02 en-ZA-LukeNeural 'Perfect. Not one clash.'
say 03 en-GB-RyanNeural 'Monday. First period.'
say 04 en-GB-RyanNeural 'Mr Dube is teaching Form Two and Form Four. In the same lab.'
say 05 en-US-AndrewMultilingualNeural 'I'\''m a good teacher. I'\''m not two teachers.'
say 06 en-GB-RyanNeural 'GSS-LMS builds it in one click. Every teacher, room and class checked, double periods kept together, and clashes refused.'
say 07 en-ZA-LukeNeural 'Three weeks. One click. I need to sit down.'
say 08 en-GB-RyanNeural 'GSS-LMS. Open the demo as the deputy.'

# ---- GS05 "Date of birth: Yes"
ep gs05
say 01 en-US-AvaMultilingualNeural 'New application. Name: Sipho.'
say 02 en-US-AvaMultilingualNeural 'Surname: Form One.'
say 03 en-US-AvaMultilingualNeural 'Date of birth...'
say 04 en-US-AvaMultilingualNeural 'Yes.'
say 05 en-GB-RyanNeural 'On the Standard plan and up, parents apply online. Every answer goes in its own box, the documents come attached, and the whole intake is one list to accept.'
say 06 en-US-AvaMultilingualNeural 'Date of birth: an actual date. I could cry.'
say 07 en-GB-RyanNeural 'GSS-LMS. Open the demo as the registrar.'

# ---- GS06 "The other bag"
ep gs06
say 01 en-US-AndrewMultilingualNeural 'Sipho. Homework.'
say 02 en-US-AnaNeural 'I did it, sir. It'\''s in my other book.'
say 03 en-US-AndrewMultilingualNeural 'Where'\''s your other book?'
say 04 en-US-AnaNeural 'In my other bag.'
say 05 en-US-AndrewMultilingualNeural 'And your other bag?'
say 06 en-US-AnaNeural '...It'\''s a very big bag.'
say 07 en-GB-RyanNeural 'With GSS-LMS, learners hand in homework on their phones. Teachers see who handed in, who didn'\''t, and exactly when.'
say 08 en-US-AndrewMultilingualNeural 'Eleven fifty-nine p.m., Sipho. I respect it.'
say 09 en-GB-RyanNeural 'GSS-LMS. Open the demo as a teacher.'

# ---- GS07 "Stuff"
ep gs07
say 01 en-ZA-LeahNeural 'How was school today?'
say 02 en-US-AnaNeural 'Fine.'
say 03 en-ZA-LeahNeural 'And what did you learn?'
say 04 en-US-AnaNeural 'Stuff.'
say 05 en-GB-RyanNeural 'On GSS-LMS, parents and guardians see the marks, the attendance and the homework. Same child. More words.'
say 06 en-ZA-LeahNeural 'Stuff, hey? It says here: Maths, seventy-two. One late homework. And a Science test on Friday.'
say 07 en-US-AnaNeural '...Fine.'
say 08 en-GB-RyanNeural 'GSS-LMS. Open the demo as a parent.'

# ---- GS08 "The letter"
ep gs08
say 01 en-ZA-LeahNeural 'Sipho. Why didn'\''t you tell me about sports day?'
say 02 en-US-AnaNeural 'I gave you the letter.'
say 03 en-ZA-LeahNeural 'When?'
say 04 en-US-AnaNeural '...Now.'
say 05 en-GB-RyanNeural 'The letter is from March.'
say 06 en-GB-RyanNeural 'On GSS-LMS, school notices show up in the parent'\''s app. Sports day, meetings, forms to sign. No school bag in between.'
say 07 en-ZA-LeahNeural 'And this one smells of banana.'
say 08 en-GB-RyanNeural 'GSS-LMS. Open the demo as a parent.'

# ---- GS09 "1998"
ep gs09
say 01 en-US-AnaNeural 'Mama! What do I have first period?'
say 02 en-US-AvaMultilingualNeural 'How would I know? I finished school in nineteen ninety-eight.'
say 03 en-GB-RyanNeural 'On GSS-LMS, learners see their own timetable, the homework that is due, and their marks, on their phone.'
say 04 en-US-AnaNeural 'Maths. First period.'
say 05 en-US-AnaNeural 'Again.'
say 06 en-US-AvaMultilingualNeural 'In nineteen ninety-eight, it was also Maths.'
say 07 en-GB-RyanNeural 'GSS-LMS. Open the demo as a learner.'

# ---- GS10 "School News"
ep gs10
say 01 en-US-EmmaMultilingualNeural 'Good evening. This is School News.'
say 02 en-US-EmmaMultilingualNeural 'A teacher has found a pen that works.'
say 03 en-US-EmmaMultilingualNeural 'It belongs to someone else.'
say 04 en-US-EmmaMultilingualNeural 'A learner'\''s homework is in his other bag. The bag could not be reached for comment.'
say 05 en-US-EmmaMultilingualNeural 'In better news: there is a whole demo school online. Pick who you are, and walk right in.'
say 06 en-GB-RyanNeural 'No sign-up. Made-up data. The real app.'
say 07 en-GB-RyanNeural 'GSS-LMS. Your whole school, one system. Open the live demo.'

cd ~/storage/downloads && rm -f gss-voices.zip && zip -qr gss-voices.zip gss-voices && find gss-voices -name "*.mp3" -size 0 && echo "Done: Downloads/gss-voices.zip (any file listed just above is empty: run this again)"
