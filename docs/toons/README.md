# Ink cartoons for Servo POS

Short hand-drawn cartoon videos (black ink on paper, brand colour only on the app), with captions, voices, sound effects and a quiet tune. Everything is made in code, so a joke, a price or a voice line is cheap to change. The same kit makes the Venda Khona videos; the full method, cast and rules are in `PLAN-venda-khona-copy.md` (a copy of `docs/toons/PLAN.md` from the `venda-khona` repository, which is the source of truth for the kit).

## The eight episodes

| # | Title | Story | Status |
|---|---|---|---|
| SV01 | Table 6 | The order slip is behind the fridge; Table 7 has thoughts | Done (hand-timed) |
| SV02 | What does this say? | "Two chicken? Or seven chips?" Guests order from their phones | Done (hand-timed) |
| SV03 | The till is short | Three counts, three answers; the fifty was in the apron | Done |
| SV04 | Out of chips at one | One bag of chips "was a rumour"; stock flags, purchase orders, receiving | Done |
| SV05 | Your restaurant on their phone | "That place near the robots" (traffic lights); own app on Standard and up | Done |
| SV06 | Who is working Saturday? | A rained-on roster; three cooks carry plates; shifts and clock-in | Done |
| SV07 | The owner on holiday | Beach in the top half, kitchen in the bottom; live sales on his phone | Done |
| SV08 | Founding spots | Nomsa the news anchor tries to smile; the offer, word for word | Done |

Cast: Chef Musa (owner), Lindiwe (waiter), Nomsa (news anchor), Table 6 (a family), Table 7 (a man in a suit). Voices (Edge): narrator `en-GB-RyanNeural`, Nomsa `en-US-EmmaMultilingualNeural`, Chef Musa `en-US-AndrewMultilingualNeural`, Lindiwe `en-US-AvaMultilingualNeural`.

## Rules every episode follows (with `docs/POSTING_PLAN.md`)
- Humour on the situation, never on customers, staff or a real business; natural spoken lines; one idea per video; one call to action (the live demo).
- The restaurant's own customer app is on **Standard and Multi-branch only**; say "Standard plan and up". Starter has the plain menu page. Payroll is Multi-branch only: not mentioned. Never say "works offline"; the end card says "Servo needs an internet connection".
- Offer wording only as in `docs/POSTING_PLAN.md` section 3 (SV08 uses it word for word; no prices are spoken or shown). Demo screens say "demo data". No invented testimonials or results.

## Make a video
1. The episode file is `toons/ep/<id>.js` (episodes from SV03 on time themselves from the voice files, `auto: true`). Its voice lines are in `EP.voice`.
2. Voices: `node toons/voice.cjs <id>` prints a block to paste into Termux (`pkg install python`, `pip install edge-tts`); the MP3s go in `toons/voice/<id>/` as `01.mp3`, `02.mp3`, ... (the cloud network cannot reach the Edge voices).
3. Render: `node toons/engine.cjs <id>` (about 2 minutes; Playwright and ffmpeg are needed). Output in `toons/out/` (ignored by git): 1080x1920 master, `-720` copy for WhatsApp, and a 1 fps contact sheet. `--stills 3,9,20` renders single pictures for checking; `--audio-only` remixes the sound.
4. Look at the contact sheet before sending. The sound effects and tune are made in `toons/sfx.cjs` (no downloads, no licences).

## Shorts, styles and YouTube (added 17 Nov 2026)
- **15-second cut-downs**: `node toons/cutdowns.cjs sv01` (or no id for all) after rendering the episode; the lines kept are in `toons/cuts.json`.
- **Art styles**: `node toons/engine.cjs sv03 --style chalk` (ink, chalk, neon, cutout, signpaint); see `.claude/skills/cartoon-studio/references/styles.md`.
- **YouTube compilation**: `node toons/compile.cjs sv-season-1 "Small Business News: The Restaurants" sv01 sv02 sv03 sv04 sv05 sv06 sv07 sv08` (landscape, title cards, thumbnail).
- **Original 15-second Servo shorts** SVS01 to SVS12: scripts in `docs/studio/IDEAS.md` section 5, voices in `toons/termux-batch3.sh`.
- Everything about the method is in the skill `.claude/skills/cartoon-studio/`.

## Post captions
Link tags `sv-n01` to `sv-n08`; put the link in the first comment on Facebook.

### SV01 Table 6
**Every restaurant has a Table 6.** 😅
The order was written on paper. The paper is behind the fridge. With Servo, the order goes from the till straight to the kitchen screen, and guests can order from their own phone with the QR code on the table.
See it working in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n01
💬 Send this to someone who runs a kitchen.
_Cartoon restaurant. The restaurant's own app is on Standard and Multi-branch._

### SV02 What does this say?
**Two chicken? Or seven chips?** 🍗🍟
Guests order from their own phone with the QR code on the table, and the order lands on the kitchen screen in clear type. No handwriting, no guessing.
See it working in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n02
💬 Send this to a kitchen that has a slip like this.
_Cartoon restaurant. The restaurant's own app is on Standard and Multi-branch._

### SV03 The till is short
**He counted three times. He got three answers.** 💵
Servo records every sale, so the day's takings are already added up. Run a report by day or by person, and check it from your phone at home.
See it in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n03
💬 Send this to a chef who counts the till twice.
_Cartoon restaurant; demo data._

### SV04 Out of chips at one
**There was one bag of chips. It was a rumour.** 🥔
Servo flags what is running low, so you hear about it at ten, not at one. Suppliers and purchase orders are there too, and when the delivery arrives you receive it and the stock goes up.
See it in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n04
💬 Send this to someone who ran out at lunchtime.
_Cartoon restaurant; demo data._

### SV05 Your restaurant on their phone
**"That place near the robots."** 🚦
On the Standard plan and up, your restaurant gets its own app: your name, logo and colours on your guests' phones, with rewards you set yourself. Guests add it from the QR code on the table.
See it in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n05
💬 Send this to a restaurant owner whose guests forget the name.
_Cartoon restaurant. The restaurant's own app is on Standard and Multi-branch; Starter has the plain menu page._

### SV06 Who is working Saturday?
**Three cooks arrived. Zero waiters.** 🍽️
Servo has staff schedules, shifts and a clock-in screen at the kitchen door, so everyone sees their shift and the hours add up on their own.
See it in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n06
💬 Send this to a manager with a wet roster.
_Cartoon restaurant; demo data._

### SV07 The owner on holiday
**His body is on a beach. His mind is in the kitchen.** 🏖️
Servo shows today's sales on your phone: orders, takings and what is selling, right now. Any device. Even the one with sand in it.
See it in the live demo, no sign-up: servo-pos.vercel.app/demo?ref=sv-n07
💬 Send this to an owner who has never switched off.
_Cartoon restaurant; demo data._

### SV08 Founding spots
**Good evening. I read the news. Tonight, there is good news.** 📰
Servo has ten founding spots. The first 5 restaurants get 6 months free. Restaurants 6 to 10 get 3 months free. After the first 10, a short free period may apply.
You get the till, the kitchen screen, table QR ordering, stock and sales reports, and on the Standard plan and up your own restaurant app. Try the live demo first, no sign-up: servo-pos.vercel.app/demo?ref=sv-n08
💬 Send this to a restaurant owner you like.
_Cartoon restaurant._
