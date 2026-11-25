# Voice lines for the 24 original 15-second shorts (docs/studio/IDEAS.md section 5).
# Paste the whole thing into Termux. One folder per short, one zip at the end. Safe to run again: lines that already exist are skipped.
# N = Ryan (narrator)  A = Emma (Nomsa)  M = Andrew (men)  L = Ava (women)

pkg install -y zip
N=en-GB-RyanNeural; A=en-US-EmmaMultilingualNeural; M=en-US-AndrewMultilingualNeural; L=en-US-AvaMultilingualNeural
say(){ [ -s "$1.mp3" ] || edge-tts --rate=+15% --voice "$2" --text "$3" --write-media "$1.mp3"; }
ep(){ mkdir -p ~/storage/downloads/batch3/$1-voice && cd ~/storage/downloads/batch3/$1-voice; }

# ---- VKS01 "The seven-minute voice note"
ep vks01
say 01 $N "He asked one question. She replied with a seven-minute voice note."
say 02 $M "I just wanted to know if you have size nine."
say 03 $N "In her shop app, sizes, prices and pictures are all there. He just taps."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS02 "Customer is typing"
ep vks02
say 01 $N "Customer is typing."
say 02 $N "Still typing."
say 03 $M "Hi."
say 04 $N "With her own shop app, the answer was already there. Prices, pictures, an order button."
say 05 $N "Your own shop app. Free. Venda Khona."

# ---- VKS03 "Last price"
ep vks03
say 01 $M "Is this your last price?"
say 02 $L "It's my only price."
say 03 $N "Put your prices in your own shop app. Fewer debates, more orders."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS04 "Send more pictures"
ep vks04
say 01 $M "Send more pictures."
say 02 $N "She sent twelve. He wanted thirteen."
say 03 $N "In her shop app, every picture and price waits in one place. Customers look as long as they like."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS05 "Month-end"
ep vks05
say 01 $M "I'll pay month-end."
say 02 $L "Which month?"
say 03 $N "Orders in her shop app show who ordered what, and when."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS06 "Are you open?"
ep vks06
say 01 $M "Are you open?"
say 02 $N "Sunday. Six in the morning."
say 03 $N "Her hours are in her shop app. Her phone gets to sleep in."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS07 "The uncle"
ep vks07
say 01 $N "She posted her new cakes on her status. Her uncle saw it."
say 02 $M "Nice. Bring one on Sunday."
say 03 $N "In her shop app, customers follow her shop and see new posts. And they pay."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS08 "The fridge code"
ep vks08
say 01 $N "Mr Gama fixes fridges. So he puts his code on every fridge he fixes."
say 02 $M "Next time it breaks, they scan the fridge."
say 03 $N "One scan, and his shop is on their phone."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS09 "The nephew returns"
ep vks09
say 01 $M "Auntie, I made you a website."
say 02 $L "I have an app. I made it while the rice was cooking."
say 03 $N "Opening a shop on Venda Khona takes minutes. And it's free."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS10 "The goat opens a shop"
ep vks10
say 01 $A "Breaking news. The goat has opened a shop."
say 02 $A "He sells grass. Prices in the app. No fees, no commission."
say 03 $N "If the goat can do it..."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS11 "Peace in the chair"
ep vks11
say 01 $L "Ten o'clock?"
say 02 $N "Not any more. Clients pick a time in her app, and she confirms with one tap."
say 03 $L "My chair is finally at peace."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- VKS12 "Where are you exactly?"
ep vks12
say 01 $L "Where are you exactly?"
say 02 $M "Look at the map in my app. The goat is no longer involved."
say 03 $N "A map, his hours and a code to scan. In his own shop app."
say 04 $N "Your own shop app. Free. Venda Khona."

# ---- SVS01 "Who wrote this?"
ep svs01
say 01 $M "Who wrote this order?"
say 02 $L "You did, Chef."
say 03 $N "With Servo, orders go from the till to a kitchen screen. Typed, not guessed."
say 04 $N "Servo. Try the live demo."

# ---- SVS02 "Seven ways"
ep svs02
say 01 $L "Table four wants to split the bill. Seven ways."
say 02 $M "Seven?"
say 03 $N "Servo splits the bill at the till in a few taps."
say 04 $N "Servo. Try the live demo."

# ---- SVS03 "Taxi"
ep svs03
say 01 $M "Why are you late?"
say 02 $L "Taxi."
say 03 $N "Servo's clock-in screen records the hours. The taxi stories continue."
say 04 $N "Servo. Try the live demo."

# ---- SVS04 "Do I get points?"
ep svs04
say 01 $L "Do I get points?"
say 02 $M "You get my respect."
say 03 $N "On the Standard plan and up, guests collect points in your own restaurant app. You set the rewards."
say 04 $N "Servo. Try the live demo."

# ---- SVS05 "Seventeen tomatoes"
ep svs05
say 01 $N "Friday. Ten minutes to closing. Time to count the stock."
say 02 $M "Seventeen tomatoes. One is pretending to be an onion."
say 03 $N "Servo keeps your stock levels and flags what's running low."
say 04 $N "Servo. Try the live demo."

# ---- SVS06 "The angry table"
ep svs06
say 01 $L "Two kotas for... which table?"
say 02 $M "The one that's angry."
say 03 $N "With Servo, every order carries its table number from the till to the kitchen."
say 04 $N "Servo. Try the live demo."

# ---- SVS07 "Not your feelings"
ep svs07
say 01 $N "Which dish sells the most?"
say 02 $M "The chicken. Definitely the chicken. Or the chips."
say 03 $N "Servo shows your best sellers. Not your feelings."
say 04 $N "Servo. Try the live demo."

# ---- SVS08 "Stop shouting"
ep svs08
say 01 $M "Table three! Two burgers!"
say 02 $L "Chef. They can see the screen."
say 03 $N "The kitchen screen shows every order, so the kitchen can stop shouting."
say 04 $N "Servo. Try the live demo."

# ---- SVS09 "Four seconds"
ep svs09
say 01 $N "Lindiwe has nine tables and two hands."
say 02 $N "So guests scan the code on the table, pick, and send."
say 03 $L "I sat down. For four seconds."
say 04 $N "Servo. Try the live demo."

# ---- SVS10 "Nomsa's forecast"
ep svs10
say 01 $A "Today's forecast: a lunch rush at twelve, with a strong chance of chips."
say 02 $A "Servo owners are advised to check their stock screen at ten."
say 03 $N "Servo. Try the live demo."

# ---- SVS11 "Ten spots"
ep svs11
say 01 $A "Ten founding spots. The first five restaurants get six months free."
say 02 $A "Restaurants six to ten get three months free. After the first ten, a short free period may apply."
say 03 $N "Servo. Try the live demo."

# ---- SVS12 "Not checking"
ep svs12
say 01 $M "I'm on holiday. I'm not checking sales."
say 02 $N "He checked sales."
say 03 $M "Fine. It's busy. Another drink, please."
say 04 $N "Servo. Try the live demo."

cd ~/storage/downloads/batch3 && rm -f ../voices-batch3.zip && zip -rq ../voices-batch3.zip vks01-voice vks02-voice vks03-voice vks04-voice vks05-voice vks06-voice vks07-voice vks08-voice vks09-voice vks10-voice vks11-voice vks12-voice svs01-voice svs02-voice svs03-voice svs04-voice svs05-voice svs06-voice svs07-voice svs08-voice svs09-voice svs10-voice svs11-voice svs12-voice
echo "files made: $(ls */*.mp3 | wc -l) (empty ones: $(find . -name '*.mp3' -size 0 | wc -l))"
ls -la ~/storage/downloads/voices-batch3.zip
